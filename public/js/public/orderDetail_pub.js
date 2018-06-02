var orderDetail_pub = {
    getOrderDetail: function (pub_model, order_id, flag, fn) {
        if (flag == '4') {
            orderDetail_data.goBackFlag = flag;
            orderDetail_data.pub_model = pub_model;
            orderDetail_data.pub_model.curPage = 'see_orderDetail';
            orderDetail_data.checkedToolList = orderDetail_data.checkedToolList.concat(pub_model.orderDetailData.required_tools);
            commonData.publicModel.toolList = [];//清空工具列表数组
            orderDetail_pub.getUserInfo(); //获取人员信息
        } else {
            orderDetail_pub.getPublishedOrderDetail(pub_model, order_id, flag, fn);
        }
    },

    getPublishedOrderDetail: function (pub_model, order_id, flag, fn) { //查看工单详情
        orderDetail_data.order_id = order_id;
        $("#globalloading").pshow();
        pajax.post({
            // url: 'restWoPlanService/queryDestroyedWoPlanList', //临时使用
            url: 'restWoMonitorService/queryWorkOrderById',
            data: {
                order_id: order_id
            },
            success: function (res) {
                var _obj = res ? res : {};
                var _data = _obj.work_order.wo_body;
                // _data = d.orderDetailData; //临时使用
                orderDetail_data.goBackFlag = flag;
                orderDetail_data.pub_model = pub_model;
                if (flag == '1') { //空间内展示
                    pub_model.orderDetailData = _data;
                    orderDetail_data.pub_model.curPage = 'see_orderDetail';
                    orderDetail_pub.getWorkOrderServiceList(orderDetail_data.pub_model, null, order_id); //查询工单操作列表
                    if (typeof fn == "function") {
                        orderDetail_data.fun = fn;
                    }
                } else if (flag == '2') { //计划监控
                    pub_model.orderDetailData = _data = _data;
                    orderDetail_data.pub_model.curPage = 'see_orderDetail';
                    orderDetail_pub.getWorkOrderServiceList(orderDetail_data.pub_model, null, order_id); //查询工单操作列表
                    orderDetail_pub.getUserInfo(); //获取人员信息
                    if (typeof fn == "function") {
                        orderDetail_data.fun = fn;
                    }
                } else if (flag == '3') { //工单管理
                    pub_model.orderDetailData = _data;
                    orderDetail_data.pub_model.curPage = 'see_orderDetail';
                    orderDetail_pub.getWorkOrderServiceList(orderDetail_data.pub_model, null, order_id); //查询工单操作列表
                    orderDetail_pub.getUserInfo(); //获取人员信息
                    if (typeof fn == "function") {
                        orderDetail_data.fun = fn;
                    }
                }

                if (flag == '1' || flag == '2' || flag == '3') {//判断表格内左右高度，若右大于左设置左最后一个模块高度的差值
                    setTimeout(function () {
                        var orderContentArr = $(".orderContentArr");
                        if (orderContentArr) {
                            for (var i = 0; i < orderContentArr.length; i++) {
                                var rightBlockHeight = $(orderContentArr[i]).find('.see_orderDetail_grid_tab_rig').outerHeight(true);
                                var leftBlockHeight = 0;
                                var leftBlockOutLastHeight = 0;
                                var leftLiArr = $(orderContentArr[i]).find('.see_orderDetail_grid_tab_left').children("div");
                                if (leftLiArr && leftLiArr.length > 0) {
                                    for (var j = 0; j < leftLiArr.length; j++) {
                                        leftBlockHeight += $(leftLiArr[j]).outerHeight(true);
                                    }
                                    for (var j = 0; j < leftLiArr.length - 1; j++) {
                                        leftBlockOutLastHeight += $(leftLiArr[j]).outerHeight(true);
                                    }
                                }
                                if (rightBlockHeight > (leftBlockHeight + 1)) {
                                    var currHeight = rightBlockHeight - leftBlockOutLastHeight;
                                    // console.log(currHeight);
                                    $(leftLiArr[leftLiArr.length - 1]).find('.leftBorderCls').height(currHeight);
                                    $(leftLiArr[leftLiArr.length - 1]).find('.leftBorderCls').parent().css('border', 'none');
                                    // console.log($(leftLiArr[leftLiArr.length - 1]).outerHeight(true));
                                }
                                // console.log(leftBlockHeight + "---------------" + rightBlockHeight);
                            }
                        }

                    }, 50)
                }
            },
            error: function (error) {
                $("#globalnotice").pshow({ text: '数据请求失败', state: "failure" });
            },

            complete: function () {
                $("#globalloading").phide();
            }
        });
    },
    getObjExample: function (_data) { //获取对象实例请求
        $("#object_loading").pshow();
        pajax.post({
            // url: 'restWoPlanService/queryDestroyedWoPlanList', //临时使用
            url: 'restObjectService/queryObjectByClass',
            data: _data,
            success: function (res) {
                var _data = res && res.data ? res.data : [];
                // _data = d.objExample; //临时使用
                commonData.publicModel.planObjExampleArr = _data;
                // console.log(_data)
                $(".choiceObjExampleModal").show();
            },
            error: function (error) {

            },

            complete: function () {
                $("#object_loading").phide();
            }
        });
    },
    getWorkOrderServiceList: function (pub_model, userId, orderId, flag) { //获取工单操作时间列表
        pajax.post({
            // url: 'restWoPlanService/queryDestroyedWoPlanList', //临时使用
            url: 'restMyWorkOrderService/queryOperateRecord',
            data: {
                order_id: orderId
            },
            success: function (res) {
                var _data = res && res.data ? res.data : [];

                if (orderDetail_data.goBackFlag == '1') {
                    orderDetail_data.pub_model.orderOperatList = _data;
                } else {
                    orderDetail_data.pub_model.orderOperatList = _data;
                    if (flag == '4') orderDetail_data.pub_model.LorC = 0;
                }
            },
            error: function (error) {

            },

            complete: function () {
                $("#list_loading").phide();
            }
        });
    },
    getToolList: function (_data) { //选择工具
        $("#tool_loading").pshow();
        commonData.publicModel.toolList = [];
        pajax.post({
            // url: 'restWoPlanService/queryDestroyedWoPlanList', //临时使用
            url: 'restObjectService/queryTempObjectList',
            data: _data,
            success: function (res) {
                var _data = res && res.data ? res.data : [];
                var allTools = _data;
                var oldCheckTools = orderDetail_pub.unique(commonData.publicModel.orderDetailData.required_tools); //上次展示的工具列表

                if (oldCheckTools.length > 0) {
                    for (var i = 0; i < oldCheckTools.length; i++) {
                        for (var j = 0; j < allTools.length; j++) {
                            if (allTools[j]['checked']) {
                                continue
                            }
                            if (oldCheckTools[i] == allTools[j].obj_name) {
                                allTools[j]['checked'] = true;
                                // commonData.publicModel.selectedTool.push(allTools[j]);

                            } else {
                                allTools[j]['checked'] = false;
                            }
                        }
                    }
                }
                commonData.publicModel.toolList = allTools;
                if(commonData.publicModel.toolList.length>0){
                    $(".no_tool_tip").hide();
                }else{
                    $(".no_tool_tip").show();
                }
            },
            error: function (error) {

            },

            complete: function () {
                $("#tool_loading").phide();
            }
        });
    },
    stopOrderSet: function (_data) { //中止工单请求
        pajax.update({
            url: 'restWoMonitorService/doStopWithAdmin',
            data: _data,
            success: function (res) {
                var orderTypeName = orderDetail_data.pub_model.orderDetailData.order_type_name;
                var executieModeName = orderDetail_data.pub_model.orderDetailData.execute_type;
                var _obj = {
                    order_id: _data.order_id,
                    do_assign: '0',
                    do_stop: '1',
                    order_type_name: orderTypeName,
                    executie_mode_name: executieModeName
                }
                if (orderTypeName && executieModeName) {//判断两个值都存在
                    orderDetail_pub.saveWoMonitor(_obj);//埋点
                }
                $("#publishNotice").pshow({ text: '中止成功', state: "success" });
                if (orderDetail_data.fun) {
                    orderDetail_data.fun();
                }
                $("#stopOrder").phide();
            },
            error: function (error) {
                $("#publishNotice").pshow({ text: '中止失败,请重试', state: "failure" });
            },

            complete: function () {
                $("#list_loading").phide();
            }
        });
    },
    assignOrderSet: function (_data) { //指派工单请求
        pajax.update({
            url: 'restWoMonitorService/doAssignWithAdmin',
            data: _data,
            success: function (res) {
                var orderTypeName = orderDetail_data.pub_model.orderDetailData.order_type_name;
                var executieModeName = orderDetail_data.pub_model.orderDetailData.execute_type;
                var _obj = {
                    order_id: _data.order_id,
                    do_assign: '1',
                    do_stop: '0',
                    order_type_name: orderTypeName,
                    executie_mode_name: executieModeName
                }
                if (orderTypeName && executieModeName) {//判断两个值都存在
                    orderDetail_pub.saveWoMonitor(_obj);//埋点
                }
                $("#publishNotice").pshow({ text: '指派成功', state: "success" });
                if (orderDetail_data.fun) {
                    orderDetail_data.fun();
                }
            },
            error: function (error) {
                $("#publishNotice").pshow({ text: '指派失败,请重试', state: "failure" });
            },

            complete: function () {
                $("#list_loading").phide();
            }
        });
    },
    saveWoMonitor: function (_data) {//中止工单，指派工单埋点
        pajax.update({
            url: 'restBuryPointService/saveWoMonitor',
            data: _data,
            success: function (res) {
                console.log('success');
            },
            error: function (error) {

            },

            complete: function () {

            }
        });
    },
    getPersonPositionList: function () { //获取人员或岗位信息
        pajax.post({
            url: 'restPersonService/queryPositionPersonSel',
            data: {},
            success: function (res) {
                var _data = res && res.data ? res.data : [];

                // workOrderModel.personPositionList = _data.map(function(item) {
                var falseList = _data.map(function (item) {
                    item.isSelected = false;

                    item.id = ptool.produceId();

                    if (item.type == 2) {

                        item.persons = item.persons.map(function (info) {

                            info.isSelected = false;
                            info.id = ptool.produceId();
                            return info;
                        });
                    }
                    ;

                    return item;
                });
                $("#createAssignSet").pshow();
                orderDetail_data.pub_model.personPositionList = JSON.parse(JSON.stringify(falseList));
                //console.log(JSON.stringify(orderDetail_data.personPositionList))
                // orderDetail_data.personPositionList = orderDetail_data.personPositionList.length > 0 ? orderDetail_data.personPositionList : orderDetail_data.falsePersonPosition;
            },
            error: function (error) {

            },

            complete: function () {

            }
        });
    },
    choiceObjExample: function (_obj, event, objId, objType, index1, index2, index3, index4 ,_obj_id) { //选择对象实例
        var matter_objId = _obj_id || '';
        var _data = {
            obj_id: objId,
            obj_type: objType,
            matter_obj_id:matter_objId
        };
        orderDetail_data.pub_model.obj_example = _obj;
        orderDetail_data.pub_model.index1 = index1;
        orderDetail_data.pub_model.index2 = index2;
        orderDetail_data.pub_model.index3 = index3;
        orderDetail_data.pub_model.index4 = index4;
        orderDetail_data._save_major = _obj.obj_name || '';
        var str = '';
        if(_obj.parents && _obj.parents.length >0){
            _obj.parents.forEach(function(item){
                if(item.parent_names && item.parent_names.length >0){
                    item.parent_names.forEach(function(info,_index){
                        if(_index < item.parent_names.length-1){
                            str += info + '-';
                        }else{
                            str += info;
                        }
                        
                    })
                }
            })
        }
        
        orderDetail_data._save_system = str || '';
        var _scrollTop = $(".see_orderDetail_page_grid").scrollTop();
        var _left = $(event.target).offset().left + 120 + 'px';
        var _top = $(event.target).offset().top - '70' + _scrollTop + 'px';
        // console.log($(event.target).offset().top);
        $(".choiceObjExampleModal").css("left", _left);
        $(".choiceObjExampleModal").css("top", _top);
        orderDetail_pub.getObjExample(_data); //获取对象实例请求
    },
    replaceObjExample: function (_obj) { //替换对象实例(创建计划下一步)
        // console.log(_obj)
        var index1 = orderDetail_data.pub_model.index1;
        var index2 = orderDetail_data.pub_model.index2;
        var index3 = orderDetail_data.pub_model.index3;
        var index4 = orderDetail_data.pub_model.index4;
        //var matters_obj = orderDetail_pub.getObjectByKey(orderDetail_data.pub_model.orderDetailData.matters,[index1,'matter_steps',index2,'steps',index3,'confirm_result',index4]);
        orderDetail_data.pub_model.orderDetailData.matters[index1].matter_steps[index2].steps[index3].confirm_result[index4].obj_id = _obj.obj_id;
        orderDetail_data.pub_model.orderDetailData.matters[index1].matter_steps[index2].steps[index3].confirm_result[index4].obj_name = _obj.obj_name;
        orderDetail_data.pub_model.orderDetailData.matters[index1].matter_steps[index2].steps[index3].confirm_result[index4].obj_type = _obj.obj_type;
        orderDetail_data.pub_model.orderDetailData.matters[index1].matter_steps[index2].steps[index3].confirm_result[index4].parents = _obj.parents;
        // matters_obj.obj_id =_obj.obj_id;
        // matters_obj.obj_name =_obj.obj_name;
        // matters_obj.obj_type =_obj.obj_type;
        // matters_obj.parents =_obj.parents;
        // orderDetail_data.pub_model.orderDetailData = JSON.parse(JSON.stringify(orderDetail_data.pub_model.orderDetailData));
        orderDetail_data.choiceObjectFlag = orderDetail_pub.choiceObjExampleStatus(orderDetail_data.pub_model.orderDetailData.matters);//选择对象实例状态
        $(".choiceObjExampleModal").hide();

        // console.log(JSON.stringify(orderDetail_data.pub_model.orderDetailData.matters));
    },
    getObjectByKey: function (obj, k) {

        // 字符转换数组
        if (Object.prototype.toString.call(k).slice(8, -1) == 'String') k = [k];

        // 循环返回对应的属性值
        return k.reduce(function (con, key) {

            return con[key];
        }, obj);
    },
    orderDetail_goBack: function () { //工单详情返回
        if (orderDetail_data.goBackFlag == '1') { //空间返回
            orderDetail_data.pub_model.curPage = '';
            if (orderDetail_data.fun) {
                orderDetail_data.fun();
            }
        } else if (orderDetail_data.goBackFlag == '2') { //计划监控
            model.curPage = model.pages[0];
            model.scrapListArr = [];
        } else if (orderDetail_data.goBackFlag == '3') { //工单管理
            // console.log(orderDetail_data.pub_model)
            orderDetail_data.pub_model.curPage = orderDetail_data.pub_model.pages[0];
        } else if (orderDetail_data.goBackFlag == '4') { //工单创建
            orderDetail_data.checkedToolList = [];//清空已选数组
            if (commonData.publicModel.Published !== 1) {
                orderDetail_data.pub_model.LorC = false;
            } else {
                orderDetail_data.pub_model.LorC = true; //发布列表页
                commonData.publicModel.Published = null;
            }
        }
    },
    unique: function (arr) {
        var res = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            var obj = arr[i];
            for (var j = 0, jlen = res.length; j < jlen; j++) {
                if (res[j] === obj) break;
            }
            if (jlen === j) res.push(obj);
        }
        return res;
    },
    arrToString: function (arr) { //普通数组转字符串方法
        var arr = arr || [];
        var str = ''
        if (arr) {
            str = arr.join("、");
        } else {
            str = ""
        }
        return str;
    },
    timeFormatting: function (str) { //时间格式化
        var str = str || '';
        var nstr = str.substr(0, 4) + "." + str.substr(4, 2) + "." + str.substr(6, 2) + " " + str.substr(8, 2) + ":" + str.substr(10, 2);
        return nstr;
    },
    clickToolListShow: function (event) { //工具列表显示
        $("#delay-search").precover();
        $(".tool-select-list").show();
        var _left = $(event.target).offset().left + 40 + 'px';
        $(".tool-select-list").css({ "left": _left, "top": "30px" });
        var _data = {
            obj_type: "3",
            obj_name: ''
        };
        orderDetail_pub.getToolList(_data);
    },
    toggleSelTool: function (p_model, event) { //选中工具
        p_model.checked = !p_model.checked;
        //orderDetail_data.checkedToolList = [];//点击选中工具列表
        //commonData.publicModel.toolList = [];//展示列表
        var showList = commonData.publicModel.toolList;
        var checkedList = orderDetail_data.checkedToolList;
        if (p_model.checked) {
            for (var i = 0; i < showList.length; i++) {
                if (showList.obj_name == p_model.obj_name) {
                    showList[i].checked = true;
                    break;
                }
            }
            if (orderDetail_data.checkedToolList.length > 0) {//判断当前数组中有没有这个name,如果没有添加进去
                var flag = true;
                for (var j = 0; j < orderDetail_data.checkedToolList.length; j++) {
                    if (orderDetail_data.checkedToolList[j] == p_model.obj_name) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    orderDetail_data.checkedToolList.push(p_model.obj_name);
                }
            } else {
                orderDetail_data.checkedToolList.push(p_model.obj_name);
            }

            // console.log(orderDetail_data.checkedToolList);
        } else {
            for (var i = 0; i < showList.length; i++) {
                if (showList.obj_name == p_model.obj_name) {
                    showList[i].checked = false;
                    break;
                }
            }
            var _index = orderDetail_data.checkedToolList.indexOf(p_model.obj_name);
            orderDetail_data.checkedToolList.splice(_index, 1);
            // console.log(orderDetail_data.checkedToolList);
        }
        // console.log(commonData.publicModel.toolList);
        commonData.publicModel.toolList = JSON.parse(JSON.stringify(commonData.publicModel.toolList));
    },
    choiceToolYes: function () { //确定选择工具
        // var arr = [];
        // for (var i = 0; i < commonData.publicModel.selectedTool.length; i++) {
        //     arr.push(commonData.publicModel.selectedTool[i].obj_name)
        // }
        //commonData.publicModel.orderDetailData.required_tools = orderDetail_pub.unique(arr);
        commonData.publicModel.orderDetailData.required_tools = orderDetail_pub.unique(JSON.parse(JSON.stringify(orderDetail_data.checkedToolList)));
        $(".tool-select-list").hide();
    },
    clickAssignSet: function () { //指派设置
        orderDetail_pub.getPersonPositionList();
    },
    personPositionShow: function (e) { //岗位人员列表显示
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
    createAssignSetHide: function () { //指派隐藏

        $("#createAssignSet").hide();
    },
    clickAdditem: function (item) { //弹出框添加选中

        var id = item.id;

        var personPositionList = JSON.parse(JSON.stringify(orderDetail_data.pub_model.personPositionList));

        personPositionList.forEach(function (item) {

            if (item.id == id) {

                item.isSelected = !item.isSelected;

                // 当父级被选中的时候子级跟随变化
                if (item.type == 2) {
                    item.persons.map(function (t) {

                        t.isSelected = item.isSelected;
                        return t;
                    })
                }
            } else if (item.type == 2) {
                item.isSelected = item.persons.reduce(function (con, info) {
                    info.isSelected = info.id == id ? !info.isSelected : info.isSelected;
                    if (!con) return con;
                    return info.isSelected;
                }, true);
            }
        })

        orderDetail_data.pub_model.personPositionList = personPositionList;

        // Vue.set(this, 'personPositionList', personPositionList);

    },
    choiceObjExampleStatus: function (arr) {//设置选择对象实例状态
        var flag = false;
        if (!flag) {
            if (arr.length > 0) {
                arr.map(function (item) {
                    if (item.matter_steps.length > 0) {
                        item.matter_steps.map(function (info) {
                            if (info.steps.length > 0) {
                                info.steps.map(function (x) {
                                    if (x.confirm_result.length > 0) {
                                        x.confirm_result.map(function (y) {
                                            if (y.obj_type == 'system_class' || y.obj_type == 'equip_class') {
                                                flag = true;
                                                // return flag;
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }

                })
            }
        }
        return flag;

    },
    createAssignSetYes: function () { //指派设置确定
        var valArr = [];
        var arr = JSON.parse(JSON.stringify(orderDetail_data.pub_model.personPositionList));
        arr.forEach(function (ele) {
            if (ele.isSelected) {
                if (ele.type == 2) {
                    valArr.push({ "name": ele.name, "type": ele.type })
                } else if (ele.type == 3) {
                    valArr.push({ "name": ele.name, "type": ele.type, "person_id": ele.person_id })

                }
            }
            if (ele.type == "2" && !ele.isSelected) {
                ele.persons.forEach(function (p) {
                    if (p.isSelected) {
                        valArr.push({ "name": p.name, "type": "3", "person_id": p.person_id })

                    }
                })
            }
        });
        // console.log(JSON.stringify(valArr));
        orderDetail_data.userInfo;
        var nextRoute = valArr;
        var operatorName = orderDetail_data.userInfo.user.name;
        var operatorId = orderDetail_data.userInfo.user.person_id;
        // console.log(operatorName)
        var _data = {
            "order_id": orderDetail_data.order_id,
            "operator_id": operatorId,
            "operator_name": operatorName,
            "next_route": nextRoute
        };
        if (nextRoute.length > 0) {
            orderDetail_pub.assignOrderSet(_data);
            $("#createAssignSet").hide();
        } else {
            $("#globalnotice").pshow({ text: '请选择指派的岗位或人员范围', state: "failure" });
        }

    },
    stopOrderSetYes: function () { //中止工单确定
        var operatorName = orderDetail_data.userInfo.user.name;
        var operatorId = orderDetail_data.userInfo.user.person_id;
        var option = orderDetail_data.pub_model.stop_order_content;
        var _data = {
            "order_id": orderDetail_data.order_id,
            "operator_id": operatorId,
            "operator_name": operatorName,
            "opinion": option
        };
        if (option != '') {
            orderDetail_pub.stopOrderSet(_data);
        } else {
            $("#stopTishi").show();
            return;
        }
    },
    getUserInfo: function () { //获取用户信息
        $.ajax({
            url: '/userInfo',
            type: 'get',
            data: {},
            success: function (result) {
                orderDetail_data.userInfo = result;
                // console.log(JSON.stringify(workOrderMngModel.userInfo.user))
            },
            error: function (error) {
            },
            complete: function () {
            }
        });
    },
    transPicUrl: function () {//图片地址转换

    },
    stopOrder_con_show: function () { //停止工单显示
        orderDetail_data.pub_model.stop_order_content = "";
        $("#stopOrder").pshow();
    },
    stopOrderSetHide: function () { //停止工单隐藏
        $("#stopOrder").phide();
        orderDetail_data.pub_model.stop_order_content = '';
    },
    orderNewCreatePublish: function () { //发布工单
        var flag = true;
        var _data = orderDetail_data.pub_model.orderDetailData;//需要将数组中的所有图片转换成java端需要的格式
        var tools_list = orderDetail_data.pub_model.orderDetailData.required_tools;
        //tools_list && tools_list.length >0 ?commonData.new_tool_num = '1' : commonData.new_tool_num = "0";
        commonData.new_tool_num = tools_list ? (tools_list.length || 0) : 0;
        _data.matters.map(function (item) {
            if (item.desc_photos.length > 0)

                var attachments = [];

            attachments = item.desc_photos.map(function (info) {//图片链接转成key值方法，需要将路径地址赋值给attachments数组中对象的path属性，topro属性对应当前对象中的key值
                var obj = {};
                obj['path'] = info;
                obj['toPro'] = 'desc_photos';
                obj['isNewFile'] = false;
                obj['fileType'] = 1;
                obj['multiFile'] = true;
                return obj;
            });

            item.attachments = attachments;

            item.desc_photos = [];
        });
        _data.matters.map(function (item) {
            item.matter_steps.map(function (info) {
                info.steps.map(function (x) {
                    if (x.step_type == '5') {
                        x.confirm_result.map(function (y) {
                            if (y.obj_type == 'system_class' || y.obj_type == 'equip_class') {
                                flag = false;

                            } else {

                            }
                        })
                    } else {

                    }
                })
            })
        });
        // console.log(JSON.stringify(_data));
        if (flag) {
            myWorkOrderController.publishWorkOrder(_data);

        } else {
            $("#globalnotice").pshow({ text: "请选择设备对象实例后，再次发布", state: "failure" });
        }
    },
}

var orderDetail_data = {
    goBackFlag: '', //调用对象传入标记1只有展示工单详情无任何操作，2需要显示选择对象实例，选择工具，可以指派，可以中止工单
    choiceObjectFlag: false,//判断选择对象实例是否匹配提示
    pub_model: {}, //调用对象传入自己的model
    userInfo: {}, //用户信息存储
    personPositionList: [], //人员岗位列表
    stop_order_content: '', //中止工单内容
    planObjExampleArr: [], //对象实例
    index1: '',
    index2: '',
    index3: '',
    index4: '', //matters层级索引
    checkedToolList: [],//选中工具
    showToolList: [],//展示工具列表
     _save_major:'',//专业存储
    _save_system:'',//系统存储

}
$(function () {
    $(document).click(function (event) {
        var tg = event.target;
        if (!$(tg).hasClass('choiceObjExampleModal') && !$(tg).parents('.choiceObjExampleModal').length && $(".choiceObjExampleModal").length && $(".choiceObjExampleModal").is(':visible')) {
            $(".choiceObjExampleModal").hide();
        }
        if (!$(tg).hasClass('nextStepSelToolPop') && !$(tg).parents('.nextStepSelToolPop').length && $(".nextStepSelToolPop").length && $(".nextStepSelToolPop").is(':visible')) {
            $(".nextStepSelToolPop").hide();
        }

    });
})