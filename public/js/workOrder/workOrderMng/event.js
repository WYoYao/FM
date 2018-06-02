$(function () {
    

    workOrderMngLogic.init();


   //时间控件锁定会 执行点击事件的
   // $("#divCalendar").plock({ startTime: startTime, endTime: endTime },false);

    //普通事件，组件
    var nScrollHight = 0; //滚动距离总长
    var nScrollTop = 0;   //滚动到的当前位置
    $(".monitor-table-body").scroll(function () {
        var nDivHight = $(".monitor-table-body").height();
        nScrollHight = $(this)[0].scrollHeight;
        nScrollTop = $(this)[0].scrollTop;
        if (nScrollTop + nDivHight >= nScrollHight) {
            workOrderMngModel.pageNum += 1;        
            workOrderMngModel.queryListParameter.page=workOrderMngModel.pageNum;
            controller.queryAllWorkOrder(workOrderMngModel.queryListParameter,true);//查询所有工单
        }      
    });
});

var workOrderEvent = {
    //初始化筛选条件
    init: function () {
        workOrderMngModel.systemSel = [];//已选系统
        workOrderMngModel.equipTypeSel = [];//已选设备类型
        workOrderMngModel.equipSel = [];//已选设备
        workOrderMngModel.spaceTypeSel = [];//已选空间类型
        workOrderMngModel.spaceSel = [];//已选空间
        workOrderMngModel.participantsSel = [];//已选参与人
        workOrderMngModel.executorSel = [];//已选执行人
    },
    //计算高度
    workListHeight: function () {
        Vue.nextTick(function () {
            var sosoH = $(".screeningConditions").height();
            var WH = $(".monitor-content-list").height();
            $(".monitor-content-list-body").height((WH - sosoH - 85) + 'px');
        });
    },
    //高级筛选
    advancedScreeningClick: function (event) {
        var target = $(event.currentTarget);
        var model = workOrderMngModel;
        var show = $(".screeningConditions").is(":visible");
          //筛选条件初始化
          workOrderEvent.init();
        if (show) {
            target.text("高级筛选");
            model.queryListParameter.page=1;
          //  $(".monitor-table-body").scrollTop(0);
               workOrderEvent.queryListClick();
      
            $(".monitor-content-list-body").css({
                height:'calc(100% - 70px)'
            });
        } else {
            target.text("取消高级筛选");
         
            workOrderEvent.workListHeight();
        }
        $(".screeningConditions").toggle();
    },

    //查找
    queryListClick: function () {
        var model = workOrderMngModel;
        var obj = model.queryListParameter;
        obj.page=1;
        obj.system_ids = workOrderEvent.objIdArr(model.systemSel);        //系统ids
        obj.equip_class_ids = workOrderEvent.objIdArr(model.equipTypeSel);  //设备类ids
        obj.equip_ids = workOrderEvent.objIdArr(model.equipSel);       //设备ids
        obj.space_class_ids = workOrderEvent.objIdArr(model.spaceTypeSel);    //空间类型ids
        obj.space_ids = workOrderEvent.objIdArr(model.spaceSel);      //空间ids

        obj.executor_ids=workOrderEvent.personnelIdArr(model.executorSel,'content','obj_type','ps'); //执行人ids

        obj.participant_ids = workOrderEvent.personnelIdArr(model.participantsSel,'content','obj_type','ps');    //参与人ids
        console.log(JSON.parse(JSON.stringify( obj.participant_ids)));
        console.log(JSON.parse(JSON.stringify( obj.executor_ids)));
        //查询列表TODO
        controller.queryAllWorkOrder(model.queryListParameter);

    },
    //时间
    selEventsTime: function () {
       var time = $("#divCalendar").psel();
        var startTime = new Date(time.startTime).format("yMd000000");
        var endTime = new Date(time.realEndTime).format("yMd000000");
        workOrderMngModel.queryListParameter.page=1;
        workOrderMngModel.queryListParameter.start_time = startTime;
        workOrderMngModel.queryListParameter.end_time = endTime;
        //查询列表数据
        controller.queryAllWorkOrder(workOrderMngModel.queryListParameter);
    },






    //弹窗确定事件
    screeningModalConfirm: function () {
        //系统、设备类型、空间，叶子节点在左侧显示需要特殊处理
        var selArr = [];
        switch (workOrderMngModel.filterTypeSel) {
            case "system"://系统
                var data = workOrderMngModel.treeLeafDateArr || [];
                var newSelArr = workOrderEvent.selForFun(data, workOrderMngModel.systemSel);
                workOrderMngModel.systemSel = newSelArr;

                break;
            case "equipType"://设备类型
                var data = workOrderMngModel.treeLeafDateArr || [];
                var newSelArr = workOrderEvent.selForFun(data, workOrderMngModel.equipTypeSel);
                workOrderMngModel.equipTypeSel = newSelArr;
                break;
            case "equip"://设备
                var data = workOrderMngModel.treeLeafDateArr || [];
                var newSelArr = workOrderEvent.selForFun(data,workOrderMngModel.equipSel);
                workOrderMngModel.equipSel = newSelArr;

                break;
            case "spaceType"://空间类型
                var SelData = workOrderEvent.selAttrTree(selArr, workOrderMngModel.treeDate, "content", "selected");
                workOrderMngModel.spaceTypeSel = SelData;
                break;
            case "space"://空间
                var data = workOrderMngModel.treeLeafDateArr || [];
                var newSelArr = workOrderEvent.selForFun(data,workOrderMngModel.spaceSel);
                workOrderMngModel.spaceSel = newSelArr;
                break;
            case "participants"://参与人
                var SelData = workOrderEvent.selAttrTree(selArr, workOrderMngModel.treeDate, "content", "selected");
                workOrderMngModel.participantsSel = SelData;
                break;
            case "executor"://执行人
                var SelData = workOrderEvent.selAttrTree(selArr, workOrderMngModel.treeDate, "content", "selected");
                workOrderMngModel.executorSel = SelData;
                break;
        }
        workOrderEvent.screeningModalHide();
        workOrderEvent.workListHeight();
    },
    //筛选条件添加
    screeningModalShow: function (event) {
        var target = $(event.currentTarget);
        var model = workOrderMngModel;
        var type = target.attr("type");
        workOrderMngModel.treeLeafDateArr = [];
        model.treeDate =[];
        model.filterTypeSel = type;
        var title = "";
        var arr = [], selArr = [], content = "content";
        var settedArr = ["hasCheck", "disable","active"];
        switch (model.filterTypeSel) {
            case "system"://系统
                title = "系统";
                // 请求数据TODO
                controller.getSystemData().then(function (result) {
                    result = result || [];
                    model.systemArr = JSON.parse(JSON.stringify(result));
                    workOrderEvent.addAttrTree(model.systemArr, "content", settedArr, model.systemSel, "selected");
                    var newArr = workOrderEvent.forFun(model.systemArr, 2);
                    model.treeDate = JSON.parse(JSON.stringify(newArr));
                });
                break;
            case "equipType"://设备类型
                title = "设备类型";
                // 请求数据TODO
                controller.getEquipTypeData().then(function (result) {
                    result = result || [];
                    model.equipTypeArr=result;
                    workOrderEvent.addAttrTree(model.equipTypeArr, "content", settedArr, model.equipTypeSel, "selected");
                    var newArr = workOrderEvent.forFun3(model.equipTypeArr, 3);
                    model.treeDate = JSON.parse(JSON.stringify(newArr));
                });

                break;
            case "equip"://设备
                title = "设备";
                controller.getSpaceData().then(function (result) {
                    result = result || {};
                    var data = result.data || [];
                    model.equipArr = data;
                    workOrderEvent.addAttrTree(model.equipArr, "content", settedArr, model.equipSel, "selected");
                    model.treeDate = JSON.parse(JSON.stringify( model.equipArr));
                });
                break;
            case "spaceType"://空间类型
                title = "空间类型";
                // 请求数据TODO
                controller.getSpaceTypeData().then(function (result) {
                    result = result || [];
                    model.spaceTypeArr = result;
                    workOrderEvent.addAttrTree(model.spaceTypeArr, "content", settedArr, model.spaceTypeSel, "selected");
                    model.treeDate = JSON.parse(JSON.stringify(model.spaceTypeArr));
                });
                break;
            case "space"://空间
                title = "空间";
 
                // 请求数据TODO
                controller.getSpaceData().then(function (result) {
                    result = result || {};
                    var data = result.data || [];
                    model.spaceArr = data;
                    workOrderEvent.addAttrTree(model.spaceArr, "content", settedArr, model.spaceSel, "selected");
                    var newArr=workOrderEvent.forFun3( model.spaceArr, 3);
                    model.treeDate = JSON.parse(JSON.stringify(newArr));
                });
                break;
            case "participants"://参与人
                title = "参与人";
                // 请求数据TODO
                controller.getPersonTree().then(function (result) {
                    result = result || [];
                    model.participantsArr =result;
                    workOrderEvent.changeAttrTree(model.participantsArr, "child_objs", "content");
                    workOrderEvent.addAttrTree(model.participantsArr, "content", settedArr, model.participantsSel, "selected");
                    workOrderEvent.updateAttrDisableTree(model.participantsArr, "content",  model.participantsSel);
                    
                    model.treeDate = JSON.parse(JSON.stringify(model.participantsArr));
                });
                //
                break;
            case "executor"://执行人
                title = "执行人";
                // 请求数据TODO
                controller.getPersonTree().then(function (result) {
                    result = result || [];
                    model.executorArr = result;
                    workOrderEvent.changeAttrTree(model.executorArr, "child_objs", "content");
                    workOrderEvent.addAttrTree(model.executorArr, "content", settedArr, model.executorSel, "selected");
                    workOrderEvent.updateAttrDisableTree(model.executorArr, "content",  model.executorSel);
                    model.treeDate = JSON.parse(JSON.stringify(model.executorArr));
                });
                break;
        }

        $("#screeningModal").pshow({ title: title });
    },

    screeningModalHide: function () {
        $("#screeningModal").phide();
    },
    //递归过滤已选中的
    selAttrTree: function (selArr, arr, arrAttr, settedAttr) {
        arr = arr ? arr : [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][settedAttr] == "1") {
                selArr.push(arr[i]);
            };
            workOrderEvent.selAttrTree(selArr, arr[i][arrAttr], arrAttr, settedAttr);
        };
        return selArr;
    },
    //父级选中子集disable 执行人、参与人专用
    updateAttrTree: function (arr, arrAttr, settedAttr, disable) {
        arr = arr ? arr : [];
        for (var i = 0; i < arr.length; i++) {
            arr[i]['selected'] = "0";
            arr[i]['disable'] = disable;
            workOrderEvent.updateAttrTree(arr[i][arrAttr], arrAttr, settedAttr, disable);
        };
        return arr;
    },
    //递归改变属性  执行人参、与人专用
    changeAttrTree: function (arr, arrAttr, settedAttr) {
        arr = arr ? arr : [];
        for (var i = 0; i < arr.length; i++) {
            arr[i][settedAttr] = arr[i][arrAttr];
            workOrderEvent.changeAttrTree(arr[i][arrAttr], arrAttr, settedAttr);
        };
        return arr;
    },
    //父级选中子集disable  执行人、参与人专用
    updateAttrDisableTree:function(arr, arrAttr,selArr){
        arr = arr ? arr : [];
        selArr = selArr ? selArr : [];
        for (var i = 0; i < arr.length; i++) {
            var a = arr[i] || {};
            for (var j = 0; j < selArr.length; j++) {
                if (a.obj_id == selArr[j].obj_id) {
                    var settedAttr1 = ["selected", "disable"];
                    workOrderEvent.updateAttrTree(a.content, 'content', settedAttr1, true);                  
                };
            };
            workOrderEvent.updateAttrDisableTree(arr[i][arrAttr], arrAttr, selArr);

        };
    },
    //过滤人员id，执行人、参与人专用，后台接受参数为人员id
    personnelIdArr:function(arr,arrAttr,sel,val){
        var newArr=[];
        arrFun(arr,arrAttr,sel,val);
        function arrFun(arr,arrAttr,sel,val){
            arr = arr ? arr : [];
            for (var i = 0; i < arr.length; i++) {
                if( arr[i][sel] == val){
                    newArr.push(arr[i].obj_id);
                }           
                arrFun(arr[i][arrAttr], arrAttr,sel,val);
            };
        };
        return newArr;
    },
    //递归改变属性值
    activeAttrTree: function (arr, arrAttr, active,val) {
        arr = arr ? arr : [];
        for (var i = 0; i < arr.length; i++) {
            arr[i][active] = val;
            workOrderEvent.activeAttrTree(arr[i][arrAttr], arrAttr, active, val);
        };
        return arr;
    },

    //1、递归追加元素settedArr:[hasCheck，disable]（是否带复选框，是否可选），2、匹配obj_id相同时改变selected=1
    //参数说明（数据源、子集、需要追加的属性（多个 ["hasCheck", "disable"]）、选中的arr、需要匹配的类型)
    addAttrTree: function (arr, arrAttr, settedArr, selArr, selected) {  
            arr = arr ? arr : [];
            selArr = selArr ? selArr : [];
            settedArr = settedArr ? settedArr : [];
            for (var i = 0; i < arr.length; i++) {
                var a = arr[i] || {};
                a[selected] = "0";
                a[settedArr[0]] = true;
                a[settedArr[1]] = false;
                a[settedArr[2]] = '0';
                if (workOrderMngModel.filterTypeSel == "spaceType" || workOrderMngModel.filterTypeSel == "participants" || workOrderMngModel.filterTypeSel == "executor") {
                    a[settedArr[0]] = false;
                };
                for (var j = 0; j < selArr.length; j++) {
                    if (a.obj_id == selArr[j].obj_id) {
                        a[selected] = "1";                     
                    };
                };
                workOrderEvent.addAttrTree(arr[i][arrAttr], arrAttr, settedArr, selArr, selected);
            };    
    },
  
    //叶子节点在右侧展示，2层结构,content赋值给content_arr，清空content
    forFun: function (arr, lenh) {
        for (var i = 0; i < arr.length; i++) {
            var arr1 = arr[i] || {};
            arr1.content_arr = arr1.content;
            arr1.content = [];
        }
        return arr;
    },
    //叶子节点在右侧展示，3层结构，content赋值给content_arr，清空content
    forFun3: function (arr) {
        for (var i = 0; i < arr.length; i++) {
            var arr1 = (arr[i] || {}).content || [];
            for (var j = 0; j < arr1.length; j++) {
                var arr2 = arr1[j] || {};
                arr2.content_arr = arr2.content;
                arr2.content = [];
            };

        };
        return arr;
    },
    //叶子节点在右侧展示，把属性selected="1"的，push成一个数组
    selForFun: function (data, selArr) {
        data = data ? data : [];
        selArr = selArr ? selArr : [];
        if (selArr.length == 0) {//筛选条件数组为空时，直接添加
            for (var i = 0; i < data.length; i++) {
                var cb = data[i] || {};
                if (cb.selected == "1") {
                    selArr.push(cb);
                };
            };
        } else {
            for (var i = 0; i < data.length; i++) {  // 1、筛选条件数组里面有的就不再添加。
                var cb = data[i] || {};
                if (cb.selected == "1") {
                    var sign = false;
                    for (var k = 0; k < selArr.length; k++) {
                        var selcb = selArr[k] || {};
                        if (cb.obj_id == selcb.obj_id) {
                            sign = true;
                            break;
                        };
                    };
                    if (sign == false) {
                        selArr.push(cb);
                    }
                };
                if (cb.selected == "0") {//未选中状态，数据源与选中的数据源对比，有相同id的移除掉
                    for (var k = 0; k < selArr.length; k++) {
                        var selcb = selArr[k] || {};
                        if (cb.obj_id == selcb.obj_id) {
                            selArr.splice(k, 1);
                            break;
                        };
                    };
                };
            };
        };
        return selArr;

    },


    //返回列表页
    goBack:function(){
        $("#monitor-all").show();
        $("#app").hide();
    },

    objIdArr: function (arr) {
        arr = arr ? arr : [];
        var selArr = [];
        for (var i = 0; i < arr.length; i++) {
            selArr.push(arr[i].obj_id);
        }
        return selArr;
    }

};



window.common = {//全局方法
    openOrderDetail: function (order_id, type, fn) {
        workOrderMngMethod.openOrderDetail(order_id, type, fn);
    }
};


