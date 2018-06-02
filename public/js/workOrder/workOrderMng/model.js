

//查询列表参数集
function queryListParameter() {
    return {
        "start_time": "",      //创建开始时间，必填
        "end_time": "",      //创建结束时间，必填
        "order_state": "",                //工单状态编码
        "order_type": "",  		     //工单类型编码
        "system_ids": [],        //系统ids
        "equip_class_ids": [],    //设备类ids
        "equip_ids": [],          //设备ids
        "space_class_ids": [],    //空间类型ids
        "space_ids": [],          //空间ids
        "executor_ids": [],       //执行人ids
        "participant_ids": [],     //参与人ids
        'page':1,
        'page_size':50
    }
}

var workOrderMngModel = { //工单管理模块数据模型
    //------------------------------------------ydx__start------------------------------------------
    pages: ["workOrderList", "see_orderDetail"], //所有页面导航
    curPage: 'workOrderList', //当前页面
    orderDetailData: {}, //工单详情数据
    orderOperatList: [], //工单操作列表
    personPositionList: [], //人员岗位列表
    userInfo:{},//存储用户信息
    order_id:'',//工单id
    orderDetailObj:{},//工单详情传入对象，包括type,fn
    stop_order_content:'',//终止工单输入内容

    //工单详情调用需model中新建以下属性
    orderDetailData:{},//工单详情数据
    orderOperatList:[],//操作列表
    planObjExampleArr: [],//选择对象存储

    //vue绑定的数据data
    timeType: [], //时间类型
    workType: [], //工单类型
    workState: [], //工单状态
    createPerson: [], //创建人
    temList: [],
    workList: [], //所有工单
    pageNum: 1, //请求页数



    //工单管理筛选类型wyy
    systemArr: [],//系统
    systemSel: [],//已选系统
    equipTypeArr: [],//设备类型
    equipTypeSel: [],//已选设备类型
    equipArr: [],//设备
    equipSel: [],//已选设备
    spaceTypeArr: [],//空间类型
    spaceTypeSel: [],//已选空间类型
    spaceArr: [],//空间
    spaceSel: [],//已选空间
    participantsArr: [],//参与人
    participantsSel: [],//已选参与人
    executorArr: [],//执行人
    executorSel: [],//已选执行人

    queryListParameter:new queryListParameter(),//参数集
    workStateSel: '',//工单状态sel
    workTypeSel: '',//工单类型sel
    startTime: '',
    endTime:'',
    treeDate: [],//组件树的数据集
    treeLeafDateArr:[],//叶子节点数据集
    hasCheck: true,//是否有复选框

    filterTypeSel:'',//当前添加的筛选项类型
    //wyy end

    evaluateMessage:[],//展示执行人信息
    executor_comments:[]//提交执行人的评价信息


}
var workOrderMngMethod = { //工单管理模块方法
    timeFormatting: function(str) {
        var str = str || '';
        var nstr = str.substr(0, 4) + "-" + str.substr(4, 2) + "-" + str.substr(6, 2) + " " + str.substr(8, 2) + ":" + str.substr(10, 2) + ":" + str.substr(12, 2);
        return nstr;
    },
    //普通数组转字符串方法
    arrToString: function(arr) { 
        var arr = arr || [];
        var str = ''
        if (arr) {
            str = arr.join(",");
        } else {
            str = ""
        }
        return str;
    },
    //打开工单详情
    openOrderDetail_workOrderManage: function(item) {
        console.log(item);
        controller.getUserInfo();
        workOrderMngModel.order_id = item.order_id;

        //头部控制
        $("#monitor-all").hide();
        $("#app").show();
        v.instance.openWorkOrderDetail(item.order_id,"workOrderDetail");

        var orderState=item.order_state;
        var ary=["7","8","9"];
        if(ary.indexOf(orderState)>-1){
            $("#pauseBtn").css("display","none");
        }else{
            $("#pauseBtn").css("display","block");
        }
    },
    goBackOrderList: function() { //返回工单列表
        workOrderMngModel.orderDetailData = [];
        workOrderMngModel.orderOperatList = [];
        workOrderMngModel.curPage = workOrderMngModel.pages[0];

        workOrderEvent.goBack();

    },
   //by liuchang--start
    /*通过工单ID获取执行人信息*/
    showEvaluateModal: function () {
        $("#evaluateModal").pshow();
        $("#evaluateBox>ul").scrollTop(0);
        workOrderMngModel.executor_comments=[];
        controller.queryEvaluateId({
            order_id: workOrderMngModel.order_id,
            person_id:workOrderMngModel.userInfo.person_id
        })
    },
    /*对执行人进行分数评价*/
    getScore:function (event) {
        var $target=$(event.target);
        var $container=$(event.target).parent();
        var $lists=$container.find("span");
        var curIndex=$target.attr("index");
        $lists.each(function (index) {
        if(curIndex>=index){
            $lists.eq(index).css("color","#FF7B7B");
        }else{
            $lists.eq(index).css("color","#CACACA");
        }
    });
        var score=Number(curIndex)+1;
        $container.attr("realScore",score);
    },
    /*提交评价执行人的信息*/
    confirmEvaluate:function () {
        var value=$("#evaluateBox").pverifi();
        if(!value) return;
        var executor_comments=[];
        var evaluateMessage=workOrderMngModel.evaluateMessage;
        for (var i = 0; i < evaluateMessage.length; i++) {
            var cur = evaluateMessage[i];
            if(!cur.comment_flag){
                var curId=cur.executor_person_id;
                var curScore=$('#'+curId).find(".evaluateName").attr("realScore");
                var curComment=$('#'+curId).find(".textarea").pval();
                if(Number(curScore)>0){
                    executor_comments.push({executor_person_id:curId,score:curScore,comment:curComment});
                }
            }
        }
        console.log(executor_comments);
       if(executor_comments.length==0) {
           $("#evaluateModal").phide();
           return;
       }else{
           controller.confirmEvaluate(
               {
                   order_id:workOrderMngModel.order_id,
                   person_id:workOrderMngModel.userInfo.person_id,
                   executor_comments:executor_comments
               });
       }



    },
    // by liuchang-end
    createAssignSetHide: function() { //指派隐藏

        $("#createAssignSet").hide();
    },
    timeFormatting: function(str) { //时间格式化
        var str = str || '';
        var nstr = str.substr(0, 4) + "-" + str.substr(4, 2) + "-" + str.substr(6, 2) + " " + str.substr(8, 2) + ":" + str.substr(10, 2) + ":" + str.substr(12, 2);
        return nstr;
    },
    clickAssignSet: function() { //指派设置
        controller.getPersonPositionList();
    },
    personPositionShow: function(e) { //岗位人员列表显示
        var $target = $(e.target);

        var $person_position_list = $target.parent().parent().find(".choicePersonPosition_con_persion_position");
        if (!$person_position_list.is(":visible")) {
            // console.log(1)
            $person_position_list.show();
            $target.text("b")
        } else {
            $person_position_list.hide();
            $target.text("r")
        }
    },
    clickAdditem: function(item) { //弹出框添加选中

        var id = item.id;

        var personPositionList = JSON.parse(JSON.stringify(workOrderMngModel.personPositionList));

        personPositionList.forEach(function(item) {

            if (item.id == id) {

                item.isSelected = !item.isSelected;

                // 当父级被选中的时候子级跟随变化
                if (item.type == 2) {
                    item.persons.map(function(t) {

                        t.isSelected = item.isSelected;
                        return t;
                    })
                }
            } else if (item.type == 2) {
                item.isSelected = item.persons.reduce(function(con, info) {
                    info.isSelected = info.id == id ? !info.isSelected : info.isSelected;
                    if (!con) return con;
                    return info.isSelected;
                }, true);
            }
        })

        workOrderMngModel.personPositionList = personPositionList;



    },
    
    createAssignSetYes: function() { //指派设置确定
        var valArr = [];
        var arr = JSON.parse(JSON.stringify(workOrderMngModel.personPositionList));
        arr.forEach(function(ele) {
            if (ele.isSelected) {
                if (ele.type == 2) {
                    valArr.push({ "name": ele.name, "type": ele.type })
                } else if (ele.type == 3) {
                    valArr.push({ "name": ele.name, "type": ele.type, "person_id": ele.person_id })

                }
            }
            if (ele.type == "2" && !ele.isSelected) {
                ele.persons.forEach(function(p) {
                    if (p.isSelected) {
                        valArr.push({ "name": p.name, "type": "3", "person_id": p.person_id })

                    }
                })
            }
        });

        workOrderMngModel.userInfo
        var nextRoute = valArr;
        var operatorName = workOrderMngModel.userInfo.user.name;
        var operatorId =  workOrderMngModel.userInfo.user.person_id;

        var _data = {
            "order_id": workOrderMngModel.order_id,
            "operator_id": operatorId,
            "operator_name": operatorName,
            "next_route": nextRoute
        };
        controller.assignOrderSet(_data);
  


        $("#createAssignSet").hide();
    },
    /*中止工单*/
    stopOrderSetYes:function(){
        var content = workOrderMngModel.stop_order_content;
        var _data = {
            order_id: workOrderMngModel.order_id,
            person_id:workOrderMngModel.userInfo.person_id,
            content: content
        };
        controller.stopOrderSet(_data);

    },
    /*停止工单显示*/
    stopOrder_con_show:function(){
        workOrderMngModel.stop_order_content = "";
        // $("#stopPromptMessage").hide();
        $("#stopOrder").pshow();
    },
    /*停止工单隐藏*/
    stopOrderSetHide:function(){
        workOrderMngModel.stop_order_content = '';
        $("#stopOrder").phide();
    },


    //------------------------------------------ydx__end------------------------------------------



    //wyy
    //工单类型
    selEventsTyle: function (selObj, event) {
        var model = workOrderMngModel;
        model.queryListParameter.order_type = selObj.code;
        $(".monitor-table-noData").addClass("flash-no");
        workOrderMngModel.queryListParameter.page=1;
        //获取所有工单TODO
        controller.queryAllWorkOrder(workOrderMngModel.queryListParameter);
    },
    //工单状态
    selEventsState: function (selObj, event) {
        var model = workOrderMngModel;
        model.queryListParameter.order_state = selObj.code;
        $(".monitor-table-noData").addClass("flash-no");
        workOrderMngModel.queryListParameter.page=1;
        //获取所有工单TODO
        controller.queryAllWorkOrder(workOrderMngModel.queryListParameter);
    },

    //移除已选的筛选条件
    removeSelScreening: function (index,item,type) {
        switch (type) {
            case "system"://系统
                workOrderMngModel.systemSel.splice(index, 1);
                break;
            case "equipType"://设备类型
                workOrderMngModel.equipTypeSel.splice(index, 1);
                break;
            case "equip"://设备
                workOrderMngModel.equipSel.splice(index, 1);
                break;
            case "spaceType"://空间类型
                workOrderMngModel.spaceTypeSel.splice(index, 1);
                break;
            case "space"://空间
                workOrderMngModel.spaceSel.splice(index, 1);
                break;
            case "participants"://参与人
                workOrderMngModel.participantsSel.splice(index, 1);
                break;
            case "executor"://执行人
                workOrderMngModel.executorSel.splice(index, 1);
                break;
        };
        workOrderEvent.workListHeight();
    },
    //筛选条件树结构整行点击
    treeSel: function (item, e) {
        item.content = item.content || [];
        if (workOrderMngModel.filterTypeSel == "participants" || workOrderMngModel.filterTypeSel == "executor"||workOrderMngModel.filterTypeSel == "spaceType") { return; }
        if (item.content.length > 0) return;//只有叶子节点可以点击
        workOrderEvent.activeAttrTree(workOrderMngModel.treeDate, 'content', 'active', '0');
        item.active = "1";
        workOrderMngModel.treeLeafDateArr = [];
        item.content_arr = item.content_arr || [];
        switch (workOrderMngModel.filterTypeSel) {
            case "system"://系统
                workOrderMngModel.treeLeafDateArr = item.content_arr;
                break;
            case "equipType"://设备类型
                workOrderMngModel.treeLeafDateArr = item.content_arr;
                break;
            case "equip"://设备
                var parameterObj = {
                    build_id: '',          //建筑id
                    space_id: item.obj_id,          //空间id
                    domain_code:'',       //专业编码
                    system_id: ''      //系统id
                }
                var settedArr = ["hasCheck", "disable","active"];

                //获取设备TODO
                controller.getEquipData(parameterObj).then(function (result) {
                    result = result || [];
                   workOrderEvent.addAttrTree(result, "content", settedArr, workOrderMngModel.equipSel, "selected");
                    var equipSel = workOrderMngModel.equipSel;
                    for (var i = 0; i < result.length; i++) {
                        var cd = result[i] || {};
                        for (var j = 0; j < equipSel.length; j++) {
                            var eq = equipSel[j] || {};
                            if (cd.obj_id == eq.obj_id) {
                                cd.selected = "1";
                            };
                        };
                    };
                    workOrderMngModel.treeLeafDateArr = result;
                });             
                break;

            case "space"://空间
                workOrderMngModel.treeLeafDateArr = item.content_arr;
                break;
            case "participants"://参与人
            case "executor"://执行人
            case "spaceType"://空间类型
                break;
        }
        workOrderMngModel.treeLeafDateArr = JSON.parse(JSON.stringify(workOrderMngModel.treeLeafDateArr));

    },
    //筛选条件树结构复选框
    treeCheck: function (item, e) {
        e.stopPropagation();
        item.selected = item.selected == '1' ? '0' : '1';
        var settedAttr = ["selected", "disable"];
        if (workOrderMngModel.filterTypeSel == "participants" || workOrderMngModel.filterTypeSel == "executor") {
            if (item.selected == "1") {
                workOrderEvent.updateAttrTree(item.content, 'content', settedAttr, true);
            } else {
                workOrderEvent.updateAttrTree(item.content, 'content', settedAttr, false);
            }
        }
    },
    //筛选条件树结构三角
    treeArrow: function (item,e) {
        e.stopPropagation()
        var target = $(e.currentTarget);
        var next = target.parent().next();
        if (next.is(":visible")) {
            next.slideUp();
            target.text("r");
        } else {
            next.slideDown();
            target.text("b")
        };
    }
};
var workOrderMngLogic = {
    init: function () {
        new Vue({
            el: '#workOrderManage-Monitor',
            data: workOrderMngModel,
            methods: workOrderMngMethod
        });
        var timeObj = {
            dataObj: {
                dict_type: "wo_execute_type"      //时间类型，必须
            },
            noticeSuccessObj: { text: '获取时间类型成功', state: "success" },
            noticeFailureObj: { text: '获取时间类型失败', state: "failure" }

        };
        var workObj = {
            dataObj: {
                dict_type: "work_order_type"      //工单类型，必须
            },
            noticeSuccessObj: { text: '获取工单状态成功', state: "success" },
            noticeFailureObj: { text: '获取工单状态失败', state: "failure" }

        };
        var AllConditionObj = {
            time_type: "",                       //时间类型，temp-临时，plan计划
            order_type: "",                      //工单类型编码
            order_state: "",                     //工单状态编码
            creator_id: "",                      //创建人id
            page: workOrderMngModel.pageNum,                       //当前页号，必须
            page_size: 50                        //每页返回数量，必须
        }
        //时间初始化
        var workOrderDate = new Date();
        var currWeek = workOrderDate.getDay();
        var currday = workOrderDate.getTime();
        var onDay = 86400000;
        var startTime = currday - (currWeek * onDay);
        var endTime = currday + ((7 - currWeek-1) * onDay);
        $("#divCalendar").psel({ startTime: startTime, endTime: endTime },false);

        workOrderMngModel.queryListParameter.start_time = new Date(startTime).format("yMd000000");
        workOrderMngModel.queryListParameter.end_time =  new Date(endTime).format("yMd000000");
         controller.queryGeneralDictByKey();//查询工单类型
        controller.queryWorkOrderState();//查询工单状态
        controller.queryAllWorkOrder(workOrderMngModel.queryListParameter);//查询所有工单

    },

};

//组件
Vue.component("tree-component", {
    template: "#treeTempComponent",
    props: ["model", "check", "arrow", "sel"],
});
