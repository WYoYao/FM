var workOrderModel = {
    //工单管理模块数据模型
    //列表
    curPage: "list", //当前页面
    orderConfigId: "", //配置方案id存储
    workOrderConfigList: [], //列表页:查询项目下所有方案
    workOrderConfigDetail: {
        plan_id: "", //工单类型id
        plan_name: "", //工单类型名称
        work_type: "", //工作类型编码
        work_type_name: "", //工作类型名称
        repair_flag: '0', //报修是否可以转工单
        execute_type: "", //时间类型编码
        execute_type_name: "", //时间类型名称
        plan_status: "1", //方案状态,0-需维护，1-正常
        create_time: "", //创建时间，yyyyMMddHHmmss
        valid: true, //有效状态       true：有效，false：失效
        time_limit: {
            startTime: { //到达工单要求开始时间
                "selected": false, //是否选中
                "around": "after", //after-后  front-前
                "minute": "" //分钟 		
            },
            endTime: { //到达工单要求结束时间
                "selected": false, //是否选中
                "around": "after", //after-后  front-前
                "minute": "" //分钟
            }
        },
        post_and_duty: []
    },
    //详情

    //新建编辑
    workTypeSelect: [], //工作类型
    timeTypeSelect: [] ,  //时间类型
    choiceTimeSectionList:[{ //选择时间段
        name: '前',
        code: 'front'
    }, {
        name: '后',
        code: 'after'
    }],
    choicePositionList: [], //选择岗位列表
    choicePositionListCopy: [], //选择岗位列表副本
    controlModuleList: [], //流转方案控制模块数据


    operateOptionList: [ //流转方案配置列表

    ],
    currOptionFaIndex: '', //存储点击执行步骤 父元素索引
    currOptionChildIndex: '', //存储点击执行步骤 子元素索引
    currStepDutyName: '', //存储点击执行步骤 name
    currStepDutyCode: '', //存储点击执行步骤 code

    createModuleList: [], //新建下级控制模块

    assignCheckbox: false, //指派时间复选框

    applyModuleList: [], //申请下级路由控制模块
    applyModuleListCatch:[],//申请控制模块缓存
    applyAuditSelect: [], //是否需要审批或审核
    applyPositionSelect: [], //申请选择岗位
    
    auditModuleList: [], //审核下级路由控制模块
    auditNextTimeState: false, //审核下级路由 时间选择

    approveModuleList: [], //审批下级路由控制模块
    approvaNextTimeState: false, //审核下级路由 时间选择

    errorTipList:[],//错误提示
};

var workOrderMethod = {
    arrayObjectTransfString: function (arr, key, point) {
        //数组对象转字符串通用
        var str = "";
        var newArr = [];
        var obj = {};
        if (arr && arr.length > 0) {
            arr = arr.reduce(function (cur,item) {
                obj[item[key]] ? "" : obj[item[key]] = true && cur.push(item);
                return cur;
            },[]).forEach(function(info){
                newArr.push(info[key]);
            });
        }

        return (str = newArr.join(point));
    },
    newCreateOrder: function () { //新建工单配置页

        workOrderModel.curPage = "create";
        workOrderMethod.newCreateConfigInit();
    },
    returnPop:function(event){//阻止冒泡
        event.stopPropagation();
    },
    //列表
    openDeleteBlock: function (orderConfigId) { //打开删除框
        workOrderModel.orderConfigId = orderConfigId ? orderConfigId : workOrderModel.plan_id;
        $("#confirmDeleteConfigList").pshow({
            title: "确定要删除此方案吗？"
        });
    },
    confirmDeleteConfigList: function () { //确认删除
        var _this = this;
        var orderConfigId = workOrderModel.orderConfigId || "";
        controller.deleteFlowPlanById({plan_id: orderConfigId}).then(function () {
            
            $("#globalnotice").pshow({text: "删除成功",state: "success"});
            workOrderMethod.getWorkOrderListCommon();
        
               
        }).catch(function () {
            $("#globalnotice").pshow({text: "删除失败，请重试", state: "failure"});
        });
        $("#confirmDeleteConfigList").phide();
    },
    cancelDeleteConfigList: function () { //取消删除

        $("#confirmDeleteConfigList").phide();
    },
    getWorkOrderListCommon:function(){//查询工单配置列表通用函数
        $("#floatWindowPersonDetail").phide();
        controller.queryFlowPlan({}).then(function (list) {
            workOrderModel.workOrderConfigList = list;
            Vue.nextTick(function(){
                workOrderModel.curPage = 'list';
            });
            
        }).catch(function () {
            $("#globalnotice").pshow({text: "获取数据失败，请重试",state: "failure"});
        });
    },
    openConfigDetail: function (planId) {
        //打开配置详情
        workOrderModel.plan_id = planId;
        var _data = {
            plan_id: planId
        };
        controller.queryFlowPlanById(_data).then(function (list) {
            workOrderModel.workOrderConfigDetail = list;
            $("#floatWindowPersonDetail").pshow({
                "title": "工单类型详情"
            });
            $("#floatWindowPersonDetail .singleConfigContent").scrollTop(0);
        }).catch(function () {
            $("#globalnotice").pshow({
                text: "获取数据失败，请重试",
                state: "failure"
            });
        });
    },
    //新建编辑
    changeTimeType: function (model) { //切换时间类型  //选择计划性时需要在岗位数据中加入系统类型
        var code = model.code;
        var _operaList = JSON.parse(JSON.stringify(workOrderModel.operateOptionList));
        if(code == 'plan'){//禁用保修转工单
            $("#tranOrderSwitch").psel(false);
            $("#tranOrderSwitch").pdisable(true);
        }else{
            $("#tranOrderSwitch").pdisable(false);
        };
        if (_operaList && _operaList.length > 0) {
            var type = workOrderModel.operateOptionList[0].type;
            if (code == 'plan') {
                if (type == 'system') { //岗位操作数据列表第一项是系统
                    return
                } else { //不是系统，添加一个系统项
                    workOrderModel.operateOptionList = JSON.parse(JSON.stringify(addSystem(workOrderModel.operateOptionList)));
                }
            } else {
                if (type == 'system') {
                    var _list = workOrderModel.operateOptionList.splice(1);
                    workOrderModel.operateOptionList = JSON.parse(JSON.stringify(_list));
                } else {
                    return;
                }
            }
        } else {
            if (code == 'plan') {
                workOrderModel.operateOptionList = JSON.parse(JSON.stringify(addSystem(workOrderModel.operateOptionList)));
            } else {
                return;
            }
        };
        //添加系统函数
        function addSystem(arr) {
            arr.unshift({
                type: "system",
                delete: {
                    show: false
                }, //判断
                id: '',
                position_id: 'systemPosition',
                name: '系统',
                duty: [{
                        code: 'create',
                        name: '新建',
                        executie_mode: '',
                        arrival_time_allow_execute: ''
                    },
                    {
                        code: 'assign',
                        name: '指派'
                    }
                ]
            });
            return arr;
        };

    },
    uniqueArray: function (array, key, mark) { //JSON数组去重
        /*
         * @param: [array] json Array
         * @param: [key] 唯一的key名，根据此键名进行去重
         * @param: [mark] 标记此项不相同视为不同
         */
        var result = [array[0]];
        for (var i = 1; i < array.length; i++) {
            var item = array[i];
            var repeat = false;
            for (var j = 0; j < result.length; j++) {
                if (item[key] == result[j][key] && item[mark] == result[j][mark]) {
                    repeat = true;
                    break;
                }
            }
            if (!repeat) {
                result.push(item);
            }
        }
        return result;
    },
    randomRangeId: function (num) { //生成随机数

        var returnStr = "",
            charStr =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < num; i++) {
            var index = Math.round(Math.random() * (charStr.length - 1));
            returnStr += charStr.substring(index, index + 1);
        }
        return returnStr;
    },
    positionTreeInit: function (arr, parentId, placeholder, lv) { //岗位树初始化数据

        var positionTreeInit = arguments.callee;

        arr = arr.map(function (item) {
            item.lv = lv;
            item.placeholder = placeholder || "";
            item.parentId = parentId || "";

            item.id = workOrderMethod.randomRangeId(10);

            if (item.child_objs && item.child_objs.length) {
                positionTreeInit(
                    item.child_objs,
                    item.id,
                    item.placeholder,
                    lv + 1
                );
            } else {
                item.child_objs = [];
            }

            return item;
        });

        return arr;
    },
    goBackList:function(){//返回列表
        workOrderMethod.resetCreateBlock();
        workOrderMethod.getWorkOrderListCommon();
    },
    newCreateConfigInit: function () { //新建工单配置初始化
        this.resetCreateBlock();//重置所有新建表单
        //获取工作类型
        controller.queryGeneralDictByKeyConfig({
            "dict_type": "work_type"
        }).then(function (list) {
            workOrderModel.workTypeSelect = list;
        });
        
        //获取时间类型
        controller.queryGeneralDictByKeyConfig({
            "dict_type": "wo_execute_type"
        }).then(function (list) {
            workOrderModel.timeTypeSelect = list;
        });

        //获取所有下级路由控制模块
        workOrderMethod.getAllNextRouteBlock();

    },
    getAllNextRouteBlock:function(){ //获取所有下级路由控制模块
         //获取工单流转控制模块
         controller.queryGeneralDictByKeyConfig({
            "dict_type": "wo_control_module"
        }).then(function (list) {
            workOrderModel.controlModuleList = list;
        });

        //获取新建控制模块
        controller.queryGeneralDictByKeyConfig({
            "dict_type": "wo_execute_mode"
        }).then(function (list) {
            list.forEach(function (item) {
                item["show"] = true;
                if (item.code == 'execute') {
                    item.state = true;
                } else {
                    item.state = false;
                };
            });
            workOrderModel.createModuleList = list;
        });

        //获取申请控制模块
        controller.queryGeneralDictByKeyConfig({
            "dict_type": "wo_applay_item"
        }).then(function (list) {
            list.forEach(function (item) {
                item["checked"] = false;
                item["aduitList"] = [{
                    next_code: "audit",
                    next_name: "需要审核"
                }, {
                    next_code: "approve",
                    next_name: "需要审批"
                }];
                item["next_code"] = "approve";
                item["selectPositionName"] = "系统";
                item["next_route"] = [{
                    "type": "system",
                    "position_id": "systemPosition",
                    "name": "系统",
                    "isShow": true,
                    "isCurr":true,
                    "mark": "approve"
                }];
            });
            workOrderModel.applyModuleList = list;
            workOrderModel.applyModuleListCatch = list;
        });

        //审核控制模块
        controller.queryGeneralDictByKeyConfig({
            "dict_type": "wo_audit_item"
        }).then(function (list) {

            list.forEach(function (item) {
                item["checked"] = false;
                item["next_route"] = [
                    // {"type":"system","position_id":"system","name":"系统","isShow":false}
                ];
            });
            workOrderModel.auditModuleList = list;
        });

        //审批控制模块
        controller.queryGeneralDictByKeyConfig({
            "dict_type": "wo_approval_item"
        }).then(function (list) {
            list.forEach(function (item) {
                item["checked"] = false;
                item["next_route"] = [
                    // {"type":"system","position_id":"system","name":"系统","isShow":false}
                ];
            });
            workOrderModel.approveModuleList = list;
        });

    },
    resetCreateBlock:function(){//重置新建模块数据
        $("#orderType").precover();//名称
        $("#workType").precover("请选择工作类型");//
        $("#timeType").precover("请选择时间类型");//
        $("#workType").pdisable(false);
        $("#timeType").pdisable(false);
        $("#tranOrderSwitch").psel(false);

        //设置工单要求
        $("#startTimeCheck").psel(false);
        $("#startTimeSel").pdisable(true);
        $("#startTimeSel").precover("请选择");
        
        $("#startTimeTxt").pval("");
        $("#startTimeTxt").pdisable(true);

        $("#endTimeCheck").psel(false);
        $("#endTimeSel").precover("请选择");
        $("#endTimeSel").pdisable(true);


        $("#endTimeTxt").pval("");
        $("#endTimeTxt").pdisable(true);
        
        $("#choicePositionError").hide();
        workOrderModel.operateOptionList = [];
        workOrderModel.errorTipList = [];
        workOrderModel.plan_id = ''; 
        
    },
    resetSetOrderType:function(){//重置设置工单要求
        $("#startTimeCheck").psel(false);
        $("#startTimeSel").pdisable(true);
        $("#startTimeSel").precover("请选择");
        
        $("#startTimeTxt").pval("");
        $("#startTimeTxt").pdisable(true);

        $("#endTimeCheck").psel(false);
        $("#endTimeSel").precover("请选择");
        $("#endTimeSel").pdisable(true);


        $("#endTimeTxt").pval("");
        $("#endTimeTxt").pdisable(true);
        $("#choicePositionError").hide();
    },
    checkedPositionInit: function (arr) { //选中岗位初始化
        var checkedPositionInit = arguments.callee;
        for (var i = 0; i < arr.length; i++) {
            var jsonArr = arr[i];
            jsonArr["checked"] = false;
            if (jsonArr.child_objs && jsonArr.child_objs.length > 0) {
                checkedPositionInit(jsonArr.child_objs);
            }
        }
        return arr;
    },
    choiceStartTimeFn:function(){//选择开始时间
        if($("#startTimeCheck").psel()){
            $("#startTimeSel").pdisable(false);
            $("#startTimeSel").find(".error-tip").hide();
            $("#startTimeTxt").precover();
            $("#startTimeTxt").pdisable(false);
            
        }else{
            $("#startTimeSel").pdisable(true);
            $("#startTimeSel").find(".error-tip").hide();
            $("#startTimeTxt").precover();
            $("#startTimeTxt").pdisable(true);
            
        }
    },
    choiceEndTimeFn:function(){//选择结束时间
        if($("#endTimeCheck").psel()){
            $("#endTimeSel").pdisable(false);
            $("#endTimeSel").find(".error-tip").hide();
            $("#endTimeTxt").precover();
            $("#endTimeTxt").pdisable(false);
        }else{
            $("#endTimeSel").pdisable(true);
            $("#endTimeSel").find(".error-tip").hide();
            $("#endTimeTxt").precover();
            $("#endTimeTxt").pdisable(true);
        }
        
    },
    positionRouterOptionInit: function (position_id, name, type, duty, operatList) { //选中岗位时初始化当前岗位及路由相关数据
        var obj = {
            position_id: position_id,
            name: name,
            type: type,
            duty: duty,
            operatList: operatList
        };
        return obj;
    },
    dutyListIsShow:function(arr){//判断右侧职责列表是否显示
        if(arr && arr.length >0){
             //如果列表中每一项_show 都为false,则返回false
            var res = arr.reduce(function(con,item){
                if(con){
                    return con;
                }
                return item._show;
            },false)
            return res;
        }
       
    },
    addPosition: function () { //添加岗位列表显示
        controller.queryDeptPositionTree({})
            .then(function (list) {
                var initList = workOrderMethod.positionTreeInit(list, '', '', 1);
                var tree = (function addInit(arr) {
                    var addInit = arguments.callee;
                    for (var i = 0; i < arr.length; i++) {
                        var json = arr[i];
                        if (json.obj_type == 'p1' || json.obj_type == 'p2' || json.obj_type == 'p3') {
                            json["issel"] = true;
                            json["checked"] = false;
                            json["checked"] = false;
                        };

                        if (json.child_objs && json.child_objs.length > 0) {
                            addInit(json.child_objs);
                        };
                    }
                    return arr;
                }(initList));
                //判断是否存在已选中岗位
                var yetSelectPosition = JSON.parse(JSON.stringify(workOrderModel.operateOptionList));
                if (yetSelectPosition && yetSelectPosition.length > 0) {
                    //已存在的岗位是否为系统岗位
                    // if (yetSelectPosition[0].type != 'system') {
                        for (var i = 0; i < yetSelectPosition.length; i++) {
                            var selectArr = yetSelectPosition[i];
                            //递归当前树结构 岗位id相等 添加disable = true
                            (function addDisable(arr, position_id) {
                                var addDisable = arguments.callee;
                                for (var j = 0; j < arr.length; j++) {
                                    var json = arr[j];
                                    if (json.obj_type == 'p1' || json.obj_type == 'p2' || json.obj_type == 'p3') {
                                        if (json.obj_id == position_id) {
                                            json.disabled = true;
                                        };
                                    };

                                    if (json.child_objs && json.child_objs.length) {
                                        addDisable(json.child_objs, position_id);
                                    };
                                }
                            })(tree, selectArr.position_id)
                        };
                    // };
                    console.log(tree);
                };

                workOrderModel.choicePositionList = JSON.parse(JSON.stringify(tree));
                //存储备份数据
                workOrderModel.choicePositionListCopy = JSON.parse(JSON.stringify(tree));
                //过滤中心部门的节点
                // var treeData = JSON.parse(JSON.stringify(workOrderModel.choicePositionList));

                // var _newTreeData = [];
                // if(treeData && treeData.length >0){
                //     for(var i=0;i<treeData.length;i++){
                //         var json = treeData[i];
                //         if(json.obj_type !='d1'){
                //             _newTreeData.push(json);
                //         }
                //     }
                //     _newTreeData = workOrderMethod.checkedPositionInit(_newTreeData);//将选中岗位初始化
                // };
                // workOrderModel.choicePositionList = JSON.parse(JSON.stringify(_newTreeData));
                //判断是否为第一次选择
                $("#positionWindow").pshow();
            }).catch(function (err) {
                $("#globalnotice").pshow({
                    text: "获取岗位列表失败",
                    state: "failure"
                });
            });
    },
    deletePositionFn: function (items, itIndex) { //删除岗位
        if(items.type == "system"){
            return;
        }
        var _list = JSON.parse(JSON.stringify(workOrderModel.operateOptionList));
        var positionId = items.position_id;
        _list.splice(itIndex, 1);
        console.log(_list);
        //删除岗位时处理已经操作完成的数据，对下级路由的岗位列表删除当前岗位，对已选的岗位重置
        if(_list && _list.length >0){
            _list.forEach(function(item){
                if(item.duty && item.duty.length >0){
                    item.duty.forEach(function(info){
                        //当前为申请
                        if(info.code == "apply"){
                            if(info.apply_items && info.apply_items.length >0){
                                info.apply_items.forEach(function(block){
                                    //删除下级路由中已存在的岗位
                                    if(block.next_route && block.next_route.length >0){
                                        var positionArr = [];
                                        block.next_route.forEach(function(route,index){
                                            if(route.mark == "approve" || route.mark == "audit"){
                                                if(route.position_id != positionId){
                                                    positionArr.push(route);
                                                }
                                            }
                                            // positionArr.push(route.position_id);  
                                        });
                                        if(positionArr.length >0){
                                            block.next_route = JSON.parse(JSON.stringify(positionArr));
                                        }else{
                                            block.next_route = [];
                                            block.selectPositionName = "请选择审核岗位";
                                        }  
                                    };
                                    if(block.next_code == 'audit'){//如果当前选项为审核
                                        block.selectPositionName = "请选择审核岗位";
                                        block.next_route.forEach(function(f){
                                            if(f.type == "system"){
                                                f.isCurr = false;
                                            }
                                        })
                                    };
                                    if(block.next_code == "approve"){//如果为审批
                                        block.selectPositionName = "系统";
                                        block.next_route.forEach(function(f){
                                            if(f.type == "system"){
                                                f.isCurr = true;
                                            }
                                        })
                                    };
                                })
                            }
                        }else if(info.code == "audit"){
                            if(info.apply_items && info.apply_items.length >0){
                                info.apply_items.forEach(function(block){
                                    //删除下级路由中已存在的岗位
                                    if(block.next_route && block.next_route.length >0){
                                        var _position = [];
                                        block.next_route.forEach(function(route,index){
                                            if(route.position_id != positionId){
                                                _position.push(route);
                                            }   
                                        });
                                        if(_position.length >0){
                                            block.next_route = JSON.parse(JSON.stringify(_position));
                                            block.selectPositionName = workOrderMethod.arrayObjectTransfString(_position,'name',',');
                                        }else{
                                            block.next_route = [];
                                            block.selectPositionName = "请选择审批岗位";
                                        }  
                                    };
                                })
                            }
                        }
                    })
                }
            });
        }
        
        workOrderModel.operateOptionList = JSON.parse(JSON.stringify(_list));

        workOrderModel.applyModuleList.forEach(function(item){
            if(item.next_route && item.next_route.length >0){
                item.next_route = [{
                    isCurr:true,
                    isShow:true,
                    mark:"approve",
                    name:"系统",
                    position_id:"systemPosition",
                    type:"system"
                }]
            }
        });
    },
    //根据id编辑工单配置
    editWorkOrderConfigDetail: function (planId) {
        //重置工单要求
        workOrderMethod.resetSetOrderType();
        //所有下级路由模块初始化
        workOrderMethod.getAllNextRouteBlock();

        var dataPlanId = planId ? planId : workOrderModel.plan_id;
        if(planId){
            workOrderModel.plan_id = planId;
        };

        controller.queryFlowPlanById({
            plan_id: dataPlanId
        }).then(function (res) {
            var result = res || {};
            if (JSON.stringify(result) !== '{}') {
                $("#orderType").pval(result.plan_name); //名称
                $("#workType").psel(result.work_type_name); //工作类型
                
                $("#timeType").psel(result.execute_type_name); //时间类型
                
                $("#tranOrderSwitch").psel(result.repair_flag == '1'? true : false); //保修转工单
                if (result.time_limit && result.time_limit.startTime && result.time_limit.startTime.selected) {
                    $("#startTimeCheck").psel(true);
                    $("#startTimeSel").psel(result.time_limit.startTime.around == 'after' ? '后' : '前');
                    $("#startTimeTxt").pval(result.time_limit.startTime.minute);
                };
                if (result.time_limit && result.time_limit.endTime && result.time_limit.endTime.selected) {
                    $("#endTimeCheck").psel(true);
                    $("#endTimeSel").psel(result.time_limit.endTime.around == 'after' ? '后' : '前');
                    $("#endTimeTxt").pval(result.time_limit.endTime.minute);
                };
                var _dutyList = result.post_and_duty;
                workOrderModel.controlModuleList = workOrderModel.controlModuleList.map(function(item){
                    item["_show"] = true;
                    return item;
                });
                var controlModule = JSON.parse(JSON.stringify(workOrderModel.controlModuleList));
                
                if (_dutyList && _dutyList.length > 0) {
                    _dutyList.forEach(function (item) {
                        item["operatList"] = JSON.parse(JSON.stringify(controlModule));
                        if(item.type == 'system'){
                            item["operatList"] = item["operatList"].map(function(item){
                                item._show = false;
                                return item;
                            })
                        }
                    });
                };
                console.log(_dutyList);
                _dutyList.forEach(function(item) { //构造右侧下拉列表数据
                    item.operatList.forEach(function(info) {
                        item.duty.forEach(function(x) {
                            if (info.code == x.code) {
                                info["_show"] = false;
                            }
                        })
                    })
                });
                //根据当前数据填充默认系统岗位
                if(_dutyList && _dutyList.length >0){
                    _dutyList.forEach(function(item){
                        if(item.duty && item.duty.length >0){
                            item.duty.forEach(function(duty){
                                if(duty.code == 'apply'){
                                    if(duty.apply_items && duty.apply_items.length >0){
                                        duty.apply_items.forEach(function(apply){
                                            //判断存在下级路由中是否存在岗位  存在的岗位是否为系统
                                            if(apply.next_route && apply.next_route.length >0){
                                                var positionArr = [];
                                                apply.next_route.forEach(function(next){
                                                    positionArr.push(next.position_id);
                                                })
                                                if(positionArr.length >0){
                                                    if(positionArr.indexOf('systemPosition') =='-1'){
                                                        apply.next_route.push({
                                                            isCurr:true,
                                                            isShow:false,
                                                            mark:"approve",
                                                            name:"系统",
                                                            position_id:"systemPosition",
                                                            type:"system"
                                                        })
                                                    }
                                                    
                                                }
                                            }else{
                                                //如果不存在下级路由需要添加默认的系统岗位
                                                apply.next_route = [{
                                                    isCurr:true,
                                                    isShow:true,
                                                    mark:"approve",
                                                    name:"系统",
                                                    position_id:"systemPosition",
                                                    type:"system"
                                                }]
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    })
                }
                

                workOrderModel.operateOptionList = JSON.parse(JSON.stringify(_dutyList));
                workOrderModel.curPage = 'create';
                Vue.nextTick(function(){
                    $("#workType").pdisable(true);
                    $("#timeType").pdisable(true);
                })
               
            }
        });
    },
    //下级路由操作
    createSelectRadio: function (item) { //新建模块 选中单选框函数
        var arr = workOrderModel.createModuleList;
        arr.forEach(function (info) {
            info.state = false;
            if (info.code == item.code) {
                info.state = true;
            }
        })
    },
    openApplyPosition: function (event) { //申请模块  打开岗位下拉多选函数
        event.stopPropagation();
        var _curr = $(event.currentTarget);
        var isShow = $(_curr).parent().find('.list').is(":hidden");
        $(_curr).parents().find('.list').hide();
        if (isShow) {
            $(_curr).parent().find('.list').show();
        } else {
            $(_curr).parent().find('.list').hide();
        }
        for(var i=0;i<5;i++){
            $("#applyAduit" + i).pslideUp();
        }
    },
    clickMutiselectTitFn:function(){//点击申请下拉列表表头
        $(".applyAduit").find(".list").hide();
    },
    choiceApplyNextRouteSel:function(_model,event){//选择申请下级路由下拉
        // console.log(_model);
        var _obj = JSON.parse($($(event)[0]._currentTarget).attr("obj"));
        var applyList = JSON.parse(JSON.stringify(workOrderModel.applyModuleList));
        if(_model.next_code == 'approve'){
            applyList.forEach(function(item,index){
                if(_obj._index == index){
                    if(item.next_route && item.next_route.length >0){
                        item.next_route.forEach(function(info){
                            if(info.mark == 'approve' || info.type == 'system'){
                                info.isCurr = true;
                                info.isShow = false;
                                if(info.type == 'system'){
                                    info.isShow = true;
                                }
                            }else{
                                info.isCurr = false;
                            }
                        });
                    };
                    item.next_code = "approve";
                    item.selectPositionName = "系统";
                    
                }
            });    
        }else if(_model.next_code == 'audit'){
            applyList.forEach(function(item,index){
                if(_obj._index == index){
                    if(item.next_route && item.next_route.length >0){
                        item.next_route.forEach(function(info){
                            info.isShow = false;
                            if(info.mark == 'audit'){
                                info.isCurr = true;
                            }else{
                                info.isCurr = false;
                            }
                        });
                    };
                    item.next_code = "audit";
                    item.selectPositionName = "请选择审核岗位";
                }
            });   
        };
        Vue.nextTick(function(){
            workOrderModel.applyModuleList = JSON.parse(JSON.stringify(applyList));
        });
        
        
    },
    checkedApplyPosition: function (index, item) { //选中申请岗位函数 index 父元素索引   item 当前的选中项
        var _list = JSON.parse(JSON.stringify(workOrderModel.applyModuleList));
        _list[index].next_route.forEach(function (info) {
            if (item.position_id == info.position_id) {
                info.isShow = !info.isShow;
            }
            return info;
        });
        var selectPosition = [];
        _list[index].next_route.forEach(function(info){
            if(info.isShow && info.mark == item.mark){
                selectPosition.push(info.name);
            };
        });
        if(selectPosition && selectPosition.length >0){
            _list[index].selectPositionName = selectPosition.join(',');
        }else{
            _list[index].selectPositionName = item.mark == "audit" ?  "请选择审核岗位" : "请选择审批岗位"; 
        }
        
        workOrderModel.applyModuleList = JSON.parse(JSON.stringify(_list));
    },
    checkedAuditPosition: function (index, item) { //选中申请岗位函数 index 父元素索引   item 当前的选中项
        var _list = JSON.parse(JSON.stringify(workOrderModel.auditModuleList));
        _list[index].next_route.forEach(function (info) {
            if (item.position_id == info.position_id) {
                info.isShow = !info.isShow;
            }
            return info;
        });
        var selectPosition = [];
        _list[index].next_route.forEach(function(info){
            if(info.isShow){
                selectPosition.push(info.name);
            };
        });
        _list[index].selectPositionName = selectPosition.join(',');
        workOrderModel.auditModuleList = JSON.parse(JSON.stringify(_list));
    },
    //添加更多职责
    addMoreDuty: function (items, itIndex, operatList, index) { //判断添加模块类型

        items[itIndex].duty.push({
            "code": items[itIndex].operatList[index].code,
            "name": items[itIndex].operatList[index].name,
        });
        items[itIndex].operatList[index]._show = false;
    },
    removeDutyData: function (items, itIndex, duty, index) { //移除职责
        $("#operatWindow").phide();
        var _code = items[itIndex].duty[index].code;
        items[itIndex].operatList.forEach(function (info) {
            if (_code == info.code) {
                info._show = true;
            }
        })
        items[itIndex].duty.splice(index, 1);
        //存储当前操作的岗位
        var positionId = items[itIndex].position_id;
        //判断当前删除模块的是审批  将数据源中所有引用当前岗位的模块初始化 需处理所有申请  审核模块 的下级路由
        var _operatList = JSON.parse(JSON.stringify(workOrderModel.operateOptionList));
        //如果当前操作的是审核或审批 ，需要将所有下级路由的数据源初始化
        if(_code == "approve" || _code == "audit"){
            workOrderMethod.getAllNextRouteBlock();
        }
        if(_code == "approve"){
            if(_operatList && _operatList.length >0){
                _operatList.forEach(function(item){
                    if(item.duty && item.duty.length >0){
                        item.duty.forEach(function(info){
                            //当前为申请
                            if(info.code == "apply"){
                                if(info.apply_items && info.apply_items.length >0){
                                    info.apply_items.forEach(function(block){
                                        //删除下级路由中已存在的岗位
                                        if(block.next_route && block.next_route.length >0){
                                            var positionArr = [];
                                            block.next_route.forEach(function(route,index){
                                                if(route.mark == "audit"){
                                                    positionArr.push(route);
                                                }else if(route.mark == "approve"){
                                                    if(route.position_id != positionId){
                                                        positionArr.push(route);
                                                    }
                                                }
                                                // positionArr.push(route.position_id);  
                                            });
                                            if(positionArr.length >0){
                                                block.next_route = JSON.parse(JSON.stringify(positionArr));
                                            }else{
                                                block.next_route = [];
                                                block.selectPositionName = "系统";
                                            }  
                                            // if(positionArr && positionArr.length >0 && positionArr.indexOf(positionId) !='-1'){
                                            //     block.next_route = [{
                                            //         isCurr:true,
                                            //         isShow:true,
                                            //         mark:"approve",
                                            //         name:"系统",
                                            //         position_id:"systemPosition",
                                            //         type:"system"
                                            //     }]
                                            // }
                                        };
                                        if(block.next_code == 'audit'){//如果当前选项为审核
                                            block.selectPositionName = "请选择审核岗位";
                                            block.next_route.forEach(function(f){
                                                if(f.type == "system"){
                                                    f.isCurr = false;
                                                }
                                            })
                                        };
                                        if(block.next_code == "approve"){//如果为审批
                                            block.selectPositionName = "系统";
                                            block.next_route.forEach(function(f){
                                                if(f.type == "system"){
                                                    f.isCurr = true;
                                                }
                                            })
                                        };
                                    })
                                }
                            }else if(info.code == "audit"){
                                if(info.apply_items && info.apply_items.length >0){
                                    info.apply_items.forEach(function(block){
                                        //删除下级路由中已存在的岗位
                                        var _position = [];
                                        if(block.next_route && block.next_route.length >0){
                                           
                                            block.next_route.forEach(function(route,index){
                                                if(route.position_id != positionId){
                                                    _position.push(route);
                                                }
                                            });
                                            if(_position.length >0){
                                                block.next_route = JSON.parse(JSON.stringify(_position));
                                            }else{
                                                block.next_route = [];
                                                block.selectPositionName = "请选择审批岗位";
                                            } 
                                        };
                                    })
                                }
                            }
                        })
                    }
                });
            };
        }else if(_code == "audit"){//判断删除的是审批
            if(_operatList && _operatList.length >0){
                _operatList.forEach(function(item){
                    if(item.duty && item.duty.length >0){
                        item.duty.forEach(function(info){
                            //当前为申请
                            if(info.code == "apply"){
                                if(info.apply_items && info.apply_items.length >0){
                                    info.apply_items.forEach(function(block){
                                        //删除下级路由中已存在的岗位
                                        if(block.next_route && block.next_route.length >0){
                                            var positionArr = [];
                                           
                                            block.next_route.forEach(function(route,index){
                                                if(route.mark == "approve"){
                                                    positionArr.push(route);
                                                }else if(route.mark == "audit"){
                                                    if(route.position_id != positionId){
                                                        positionArr.push(route);
                                                    }
                                                }
                                                // positionArr.push(route.position_id);  
                                            });
                                            if(positionArr.length >0){
                                                block.next_route = JSON.parse(JSON.stringify(positionArr));
                                            }else{
                                                block.next_route = [];
                                                block.selectPositionName = "请选择审核岗位";
                                            }  
                                            // if(positionArr && positionArr.length >0 && positionArr.indexOf(positionId) !='-1'){
                                            //     block.next_route = [{
                                            //         isCurr:true,
                                            //         isShow:true,
                                            //         mark:"approve",
                                            //         name:"系统",
                                            //         position_id:"systemPosition",
                                            //         type:"system"
                                            //     }]
                                            // }
                                        };
                                        if(block.next_code == 'audit'){//如果当前选项为审核
                                            block.selectPositionName = "请选择审核岗位";
                                            block.next_route.forEach(function(f){
                                                if(f.type == "system"){
                                                    f.isCurr = false;
                                                }
                                            })
                                        };
                                        if(block.next_code == "approve"){//如果为审批
                                            block.selectPositionName = "系统";
                                            block.next_route.forEach(function(f){
                                                if(f.type == "system"){
                                                    f.isCurr = true;
                                                }
                                            })
                                        };
                                    })
                                }
                            }
                        })
                    }
                });
            };
        }
       
        workOrderModel.operateOptionList = JSON.parse(JSON.stringify(_operatList));

        // console.log(items)
        // workOrderModel.operateOptionList[itIndex].duty.splice(index,1);//移除对应选项
    },
    arrObjUniq:function(arr,key){//数组对象去重
        var obj = {};
        var newArr = [];
        if (arr && arr.length > 0) {
            newArr = arr.reduce(function (cur,item) {
                obj[item[key]] ? "" : obj[item[key]] = true && cur.push(item);
                return cur;
            },[])
        }
        return newArr;
    },
    clickDutyShowModal: function (event, allList, arr, name, code, faIndex, childIndex) { //点击执行步骤弹出框
        event.stopPropagation();
        var _optionList = JSON.parse(JSON.stringify(workOrderModel.operateOptionList));
        workOrderModel.currOptionFaIndex = faIndex;
        workOrderModel.currOptionChildIndex = childIndex;
        workOrderModel.currStepDutyName = name;

        if (code == 'create') { //新建
            workOrderModel.currStepDutyCode = 'create';
            var executie_mode = _optionList[faIndex].duty[childIndex].executie_mode || 'execute'; //执行方式
            var arrival_time_allow_execute = _optionList[faIndex].duty[childIndex].arrival_time_allow_execute || false; //到达工单要求开始时间时才允许执行
            var limit_domain = _optionList[faIndex].duty[childIndex].limit_domain || false; //是否启用专业控制
            //根据上次选中记录  选中下级路由选项
            workOrderModel.createModuleList.forEach(function (item) {
                item.state = false;
                if (item.code == executie_mode) {
                    item.state = true;
                }
            });
           
            setTimeout(function(){
                $("#create_switch").psel(arrival_time_allow_execute);
                $("#execute_major_switch").psel(limit_domain);
                $("#operatWindow").pshow({title: "新建设置"});
            },0);

        } else if (code == 'assign') { //指派
            workOrderModel.currStepDutyCode = 'assign';
            $("#assignTime").precover();
            //根据上次选中记录  选中下级路由选项
            var filter_scheduling = _optionList[faIndex].duty[childIndex].filter_scheduling || false; //是否需要按照排班表过滤每次可转交的人员范围
            var limit_domain = _optionList[faIndex].duty[childIndex].limit_domain || false; //是否启用专业控制
            var expecte_operation = _optionList[faIndex].duty[childIndex].expecte_operation || false; //期望该操作持续时间不超过
            var minute = _optionList[faIndex].duty[childIndex].minute || ''; //分钟
            setTimeout(function(){
                $("#assign_layout_switch").psel(filter_scheduling);
                $("#assign_major_switch").psel(limit_domain);
                if (expecte_operation) {
                    $("#assignTimeSwitch").psel(true);
                    $("#assignTime").pval(minute);
                } else {
                    $("#assignTimeSwitch").psel(false);
                    $("#assignTime").pval('');
                };
                $("#operatWindow").pshow({title: "指派设置"});
            },0);
           
        } else if (code == 'apply') { //申请
            workOrderModel.currStepDutyCode = 'apply';
            workOrderModel.applyModuleList = JSON.parse(JSON.stringify(workOrderModel.applyModuleListCatch));
            var apply_items = _optionList[faIndex].duty[childIndex].apply_items || []; //下级路由
            //审核岗位添加
            //1.判断当前操作列表中选择当前审批选项被选中的岗位添加到列表中
            var _operatList = JSON.parse(JSON.stringify(workOrderModel.operateOptionList));
            var _applyMattersNext = []; //审核事项岗位列表
            var _applyAddingPeopleNext = []; //审核加人岗位列表
            var _applyReplacePeopleNext = []; //审核换人列表
            var _applyDelayNext = []; //审核延期列表
            var _applyCloseNext = []; //审核结束

            //遍历所有数据找出申请下需要的审核和审批的岗位
            function createNextRoute(obj,mark){
                return {
                    name:obj.name,
                    type:obj.type,
                    position_id:obj.position_id,
                    isShow:false,
                    mark:mark,
                    isCurr:true
                }
            }
            _operatList.forEach(function (operat) {
                if (operat.duty && operat.duty.length > 0) {
                    operat.duty.forEach(function (duty) {
                       
                        //将审批模块中的已经选中的岗位取出
                        if (duty.code == 'approve') {
                            if (duty.apply_items && duty.apply_items.length > 0) {
                                duty.apply_items.forEach(function (apply) {
                                    if (apply.code == 'approvalMatters' && apply.checked) {
                                        _applyMattersNext.push(createNextRoute(operat,'approve'));
                                    };
                                    if (apply.code == 'approvalAddingPeople' && apply.checked) {
                                        _applyAddingPeopleNext.push(createNextRoute(operat,'approve'));
                                    };
                                    if (apply.code == 'approvalReplacePeople' && apply.checked) {
                                        _applyReplacePeopleNext.push(createNextRoute(operat,'approve'));
                                    };
                                    if (apply.code == 'approvalDelay' && apply.checked) {
                                        _applyDelayNext.push(createNextRoute(operat,'approve'));
                                    };
                                    if (apply.code == 'approvalClose' && apply.checked) {
                                        _applyCloseNext.push(createNextRoute(operat,'approve'));
                                    };
                                });
                            };

                        };
                        if (duty.code == 'audit') {
                            if (duty.apply_items && duty.apply_items.length > 0) {
                                duty.apply_items.forEach(function (apply) {
                                    if (apply.code == 'auditMatters' && apply.checked) {
                                        _applyMattersNext.push(createNextRoute(operat,'audit'));
                                    };
                                    if (apply.code == 'auditAddingPeople' && apply.checked) {
                                        _applyAddingPeopleNext.push(createNextRoute(operat,'audit'));
                                    };
                                    if (apply.code == 'auditReplacePeople' && apply.checked) {
                                        _applyReplacePeopleNext.push(createNextRoute(operat,'audit'));
                                    };
                                    if (apply.code == 'auditDelay' && apply.checked) {
                                        _applyDelayNext.push(createNextRoute(operat,'audit'));
                                    };
                                    if (apply.code == 'auditClose' && apply.checked) {
                                        _applyCloseNext.push(createNextRoute(operat,'audit'));
                                    };
                                });
                            };
                        };
                    });
                }

            });
           
            workOrderModel.applyModuleList.forEach(function (item) {
                //下级路由岗位列表数据构造
                if (item.code == 'applyMatters') { //审核事项
                    item.next_route = workOrderMethod.uniqueArray((item.next_route.concat(_applyMattersNext)), 'position_id', 'mark');
                }
                if (item.code == 'applyAddingPeople') { //审核加人
                    item.next_route = workOrderMethod.uniqueArray((item.next_route.concat(_applyAddingPeopleNext)), 'position_id', 'mark');
                }
                if (item.code == 'applyReplacePeople') { //审核换人
                    item.next_route = workOrderMethod.uniqueArray((item.next_route.concat(_applyReplacePeopleNext)), 'position_id', 'mark');
                }
                if (item.code == 'applyDelay') { //审核延时
                    item.next_route = workOrderMethod.uniqueArray((item.next_route.concat(_applyDelayNext)), 'position_id', 'mark');
                }
                if (item.code == 'applyClose') { //审核结束
                    item.next_route = workOrderMethod.uniqueArray((item.next_route.concat(_applyCloseNext)), 'position_id', 'mark');
                }

            });
           

            //根据上次操作记录，选中当前选项
            $("#operatWindow").pshow({
                title: "申请设置"
            });
            Vue.nextTick(function(){
                $(".mutiSelect >.list").hide();
            });
           
            //下级路由存在
            if (apply_items && apply_items.length > 0) {
                var selectList = JSON.parse(JSON.stringify(apply_items));
                workOrderModel.applyModuleList.forEach(function (item, index) {
                    //根据选择记录重新赋值需要审核审批
                    if(selectList && selectList.length >0){
                        selectList.forEach(function(sel){
                            if(sel.code == item.code){
                                item.next_code = sel.next_code || 'approve';
                            }
                        })
                    }
                    //判断选项为需要审核时，将审批岗隐藏
                   
                    if (item.next_code == 'audit') {
                        item.next_route.forEach(function(next){
                            if(next.mark == 'approve'){
                                next.isCurr = false;
                            };
                            if(next.mark == 'audit'){
                                next.isCurr = true;
                            };
                        });
                        setTimeout(function(){
                            $("#applyAduit" + index).psel("需要审核",false);
                        },0);
                        
                    } else if (item.next_code == 'approve') {
                        item.next_route.forEach(function(next){
                            if(next.mark == 'approve'){
                                next.isCurr = true;
                            };
                            if(next.mark == 'audit'){
                                next.isCurr = false;
                            };
                        });
                        //判断当前下级路由只有一个岗位并且是系统时，修改状态为选中
                        if(item.next_route && item.next_route.length == 1 && item.next_route[0].position_id == 'systemPosition'){
                            item.next_route[0].isShow = true;
                            item.next_route[0].isCurr = true;
                        }
                        setTimeout(function(){
                            $("#applyAduit" + index).psel("需要审批",false);
                        },0)
                    };
                });

                //处理下级路由选中
                for(var i = 0; i<workOrderModel.applyModuleList.length ;i++){
                    var _outer = workOrderModel.applyModuleList[i];
                    for(var j = 0; j<selectList.length;j++){
                        var _inner = selectList[j];
                        if(_outer.code == _inner.code){
                            _outer.checked = _inner.checked;
                           
                            if(_outer.next_code == "audit"){//审核默认展示请选择审核岗位  下级只展示审核岗位
                                _inner.next_route.forEach(function(item){
                                    if(item.mark == 'approve' || item.type == 'system'){
                                        item.isCurr = false;
                                    }
                                });
                                _outer.next_route = workOrderMethod.uniqueArray(_inner.next_route.concat(_outer.next_route), 'position_id', 'mark');
                                if(_inner.next_route && _inner.next_route.length >0){
                                    _outer.selectPositionName = "请选择审核岗位";
                                    var nameArr = _inner.next_route.reduce(function(cur,_item){
                                        if(_item.mark == 'audit' && _item.isShow){
                                            cur.push(_item);
                                        }
                                        return cur;
                                    },[])
                                    if(nameArr && nameArr.length >0){//判断如果下级路由中的岗位标记为审核的length 大于0 ，处理名称设置值
                                        _outer.selectPositionName = workOrderMethod.arrayObjectTransfString(nameArr,'name',',');
                                    }
                                }else{
                                    _outer.selectPositionName = "请选择审核岗位";
                                }
                                continue;
                            }else if(_outer.next_code == "approve"){//审批默认展示系统 下级只展示审批岗位
                                _inner.next_route.forEach(function(item){
                                    if(item.mark == 'audit'){
                                        item.isCurr = false;
                                    }
                                });
                                _outer.next_route = workOrderMethod.uniqueArray(_inner.next_route.concat(_outer.next_route), 'position_id', 'mark');
                                if(_inner.next_route && _inner.next_route.length >0){
                                    var nameArr = _inner.next_route.reduce(function(cur,_item){
                                        if(_item.mark == 'approve' && _item.isShow){
                                            cur.push(_item);
                                        }
                                        return cur;
                                    },[])
                                    _outer.selectPositionName = workOrderMethod.arrayObjectTransfString(nameArr,'name',',') || "系统";
                                }else{
                                    _outer.selectPositionName = "系统";
                                }
                                continue;
                            }
                            
                            
                        }
                    }
                };
                workOrderModel.applyModuleList = JSON.parse(JSON.stringify(workOrderModel.applyModuleList));
            }else{
                workOrderModel.applyModuleList.forEach(function (item, index) {
                    item.checked = false;
                    item.selectPositionName = '系统';
                    if(item.next_route && item.next_route.length >0){
                        item.next_route.forEach(function(info){
                            info.isShow = false;
                            if(info.mark == "audit"){
                                info.isCurr = false;
                            }else if(info.mark == "approve"){
                                info.isCurr = true;
                            };
                            if(info.type == "system"){
                                info.isShow = true;
                            }
                        });
                    };
                    Vue.nextTick(function(){
                        $("#applyAduit" + index).psel("需要审批");
                    });
                    
                });
            };
            

        } else if (code == 'audit') { //审核
            workOrderModel.currStepDutyCode = 'audit';
            $("#auditTimeTxt").precover();
            var expecte_operation = _optionList[faIndex].duty[childIndex].expecte_operation || false; //期望该操作持续时间不超过
            var minute = _optionList[faIndex].duty[childIndex].minute || ''; //分钟
            var apply_items = _optionList[faIndex].duty[childIndex].apply_items || []; //下级路由
            //审核岗位添加
            //1.判断当前操作列表中选择当前审批选项被选中的岗位添加到列表中
            var _operatList = JSON.parse(JSON.stringify(workOrderModel.operateOptionList));
            var _auditMattersNext = []; //审核事项岗位列表
            var _auditAddingPeopleNext = []; //审核加人岗位列表
            var _auditReplacePeopleNext = []; //审核换人列表
            var _auditDelayNext = []; //审核延期列表
            var _auditCloseNext = []; //审核结束
            _operatList.forEach(function (operat) {
                if (operat.duty && operat.duty.length > 0) {
                    operat.duty.forEach(function (duty) {
                        if (duty.code == 'approve') {
                            if (duty.apply_items && duty.apply_items.length > 0) {
                                duty.apply_items.forEach(function (apply) {
                                    if (apply.code == 'approvalMatters' && apply.checked) {
                                        _auditMattersNext.push({
                                            name: operat.name,
                                            type: operat.type,
                                            position_id: operat.position_id,
                                            isShow: operat.isShow || false,
                                            mark: 'audit'
                                        });
                                    };
                                    if (apply.code == 'approvalAddingPeople' && apply.checked) {
                                        _auditAddingPeopleNext.push({
                                            name: operat.name,
                                            type: operat.type,
                                            position_id: operat.position_id,
                                            isShow: operat.isShow || false,
                                            mark: 'audit'
                                        });
                                    };
                                    if (apply.code == 'approvalReplacePeople' && apply.checked) {
                                        _auditReplacePeopleNext.push({
                                            name: operat.name,
                                            type: operat.type,
                                            position_id: operat.position_id,
                                            isShow: operat.isShow || false,
                                            mark: 'audit'
                                        });
                                    };
                                    if (apply.code == 'approvalDelay' && apply.checked) {
                                        _auditDelayNext.push({
                                            name: operat.name,
                                            type: operat.type,
                                            position_id: operat.position_id,
                                            isShow: operat.isShow || false,
                                            mark: 'audit'
                                        });
                                    };
                                    if (apply.code == 'approvalClose' && apply.checked) {
                                        _auditCloseNext.push({
                                            name: operat.name,
                                            type: operat.type,
                                            position_id: operat.position_id,
                                            isShow: operat.isShow || false,
                                            mark: 'audit'
                                        });
                                    };
                                });
                            }

                        };
                    });
                }

            });

            workOrderModel.auditModuleList.forEach(function (item) {
                if (item.code == 'auditMatters') {
                    item.next_route = _auditMattersNext;
                }
                if (item.code == 'auditAddingPeople') {
                    item.next_route = _auditAddingPeopleNext;
                }
                if (item.code == 'auditReplacePeople') {
                    item.next_route = _auditReplacePeopleNext;
                }
                if (item.code == 'auditDelay') {
                    item.next_route = _auditDelayNext;
                }
                if (item.code == 'auditClose') {
                    item.next_route = _auditCloseNext;
                }
            });

            $("#operatWindow").pshow({
                title: "审核设置"
            });
            Vue.nextTick(function(){
                $(".mutiSelect >.list").hide();
            });
            //根据上次操作记录，选中当前选项
            if (apply_items && apply_items.length > 0) {
                var selectList = JSON.parse(JSON.stringify(apply_items));
                for(var i = 0; i<workOrderModel.auditModuleList.length ;i++){
                    var _outer = workOrderModel.auditModuleList[i];
                    _outer.checked = false;
                    _outer.selectPositionName = '请选择审批岗位';
                    for(var j = 0; j<selectList.length;j++){
                        var _inner = selectList[j];
                        if(_outer.code == _inner.code){
                            _outer.checked = _inner.checked;
                            _outer.next_route = _inner.next_route.concat(_outer.next_route);
                            _outer.next_route = workOrderMethod.arrObjUniq(_outer.next_route,'position_id');
                            _outer.selectPositionName = _inner.selectPositionName;
                            continue;
                        }
                    }
                };
                workOrderModel.auditModuleList = JSON.parse(JSON.stringify(workOrderModel.auditModuleList));
                // Vue.nextTick(function(){
                //     workOrderModel.auditModuleList = JSON.parse(JSON.stringify( workOrderModel.auditModuleList));
                // });
                
            }else{
                workOrderModel.auditModuleList.forEach(function(item){
                    item.checked = false;
                    item.selectPositionName = '请选择审批岗位';
                    item.next_route.forEach(function(info){
                        info.isShow = false;
                    });
                });
            };
            setTimeout(function(){
                if (expecte_operation) {
                    $("#auditTimeSwitch").psel(true);
                    $("#auditTimeTxt").pval(minute);
                } else {
                    $("#auditTimeSwitch").psel(false);
                    $("#auditTimeTxt").pval('');
                };
            },0);
            
            
        } else if (code == 'approve') { //审批
            workOrderModel.currStepDutyCode = 'approve';
            $("#approveTime").precover();
            var apply_items = _optionList[faIndex].duty[childIndex].apply_items || []; //下级路由
            var expecte_operation = _optionList[faIndex].duty[childIndex].expecte_operation || false; //期望该操作持续时间不超过
            var minute = _optionList[faIndex].duty[childIndex].minute || ''; //分钟
            //根据上次操作记录，选中当前选项
            if (apply_items && apply_items.length > 0) {
                var selectList = JSON.parse(JSON.stringify(apply_items));
                workOrderModel.approveModuleList.forEach(function(item){
                    item.checked = false;
                    selectList.forEach(function(info){
                        if(item.code == info.code){
                            item.checked = info.checked;
                            item.next_route = info.next_route;
                        }
                    });
                });
                Vue.nextTick(function(){
                    workOrderModel.approveModuleList = JSON.parse(JSON.stringify( workOrderModel.approveModuleList));
                });
            }else{
                workOrderModel.approveModuleList.forEach(function(item){
                    item.checked = false;
                });
            };
            setTimeout(function(){
                $("#operatWindow").pshow({title: "审批设置"});
                if (expecte_operation) {
                    $("#approvaNextTimeSwitch").psel(true);
                    $("#approveTime").pval(minute);
                } else {
                    $("#approvaNextTimeSwitch").psel(false);
                    $("#approveTime").pval('');
                };
            },0);
           

            
        } else if (code == 'stop') {
            $("#operatWindow").phide();
        }
        console.log(faIndex, childIndex, name, code);
    },
    confirmSetItemBlock: function (code) { //保存当前操作
        var _operatList = JSON.parse(JSON.stringify(workOrderModel.operateOptionList));
        var faIndex = workOrderModel.currOptionFaIndex; //父元素索引
        var childIndex = workOrderModel.currOptionChildIndex; //子元素索引

        if (code == 'create') { //新建
            var _executie_mode = '';
            var _arrival_time_allow_execute = ($("#create_switch").psel()) ? true : false;
            workOrderModel.createModuleList.forEach(function (item) {
                if (item.state) {
                    _executie_mode = item.code;
                }
            });
            var _limit_domain = $("#execute_major_switch").psel() ? true : false; //请选择是否启用专业控制
            _operatList[faIndex].duty[childIndex]["limit_domain"] = _limit_domain;
            _operatList[faIndex].duty[childIndex]["executie_mode"] = _executie_mode;
            _operatList[faIndex].duty[childIndex]["arrival_time_allow_execute"] = _arrival_time_allow_execute;

            // workOrderModel.operateOptionList = JSON.parse(JSON.stringify(_operatList));
        } else if (code == 'assign') { //指派
            var _filter_scheduling = $("#assign_layout_switch").psel() ? true : false; //是否需要按照排班表过滤每次可转交的人员范围
            var _limit_domain = $("#assign_major_switch").psel() ? true : false; //是否需要按照专业要求过滤每次可转交的人员范围
            var _assign_checkBox_flag = $("#assignTimeSwitch").psel();
            var _minute = 0;
            if(_assign_checkBox_flag){
                //判断当选中当前项，输入的时间格式是否合法
                if($("#assignTime").pverifi()){

                }else{
                    return;
                }
                
            };
            _operatList[faIndex].duty[childIndex]["expecte_operation"] = _assign_checkBox_flag;
            _operatList[faIndex].duty[childIndex]["filter_scheduling"] = _filter_scheduling;
            _operatList[faIndex].duty[childIndex]["limit_domain"] = _limit_domain;
            if (_assign_checkBox_flag) {
                
                _minute = + ($("#assignTime").pval());
                _operatList[faIndex].duty[childIndex]["minute"] = _minute;
            };

            
            // workOrderModel.operateOptionList = JSON.parse(JSON.stringify(_operatList));

        } else if (code == 'apply') { //申请
            var _apply_items = [];

            //申请下级路由数据源
            var result = [];
            var applyNextRoute = JSON.parse(JSON.stringify(workOrderModel.applyModuleList));
            applyNextRoute.forEach(function (apply, index) {
                if (apply.checked) {
                    apply["next_code"] = $("#applyAduit" + index).psel().id || 'approve';
                    result.push(apply);
                }
            });

            if (result && result.length > 0) {
                result.forEach(function (res) {
                    if (res.next_route && res.next_route.length > 0) {//已选中下级岗位

                    } else {//不存在下级岗位时添加默认岗位 系统
                        result.next_route = [{
                            "type": "system",
                            "position_id": "systemPosition",
                            "name": "系统",
                            "isShow": true,
                            "isCurr":true,
                            "mark": "approve"
                        }];
                    }
                });

            };
            _apply_items = JSON.parse(JSON.stringify(result));

            _operatList[faIndex].duty[childIndex]["apply_items"] = _apply_items;
        } else if (code == 'audit') { //审核
            var _apply_items = [];

            //审核下级路由数据源
            var result = [];
            //处理缓存数据的数组
            var catchArr = [];
            var positionId = _operatList[faIndex].position_id;
            var positionName = _operatList[faIndex].name;
            var auditNextRoute = JSON.parse(JSON.stringify(workOrderModel.auditModuleList));
            auditNextRoute.forEach(function (apply, index) {
                if (apply.checked) {
                    result.push(apply);
                }
                //存储每次操作后的下级路由
                catchArr.push({
                    code:apply.code,
                    name:apply.name,
                    position_id:positionId,
                    position_name:positionName,
                    isShow:apply.checked
                })
            });
            //判断当前保存操作如果取消勾选，需重置申请模块的下级路由列表
            //初始化系统函数
            function initSystem(){
                return [{
                    isCurr:true,
                    isShow:true,
                    mark:"approve",
                    name:"系统",
                    position_id:"systemPosition",
                    type:"system"
                }]
            }
            catchArr.forEach(function(catchItem){
                if(!catchItem.isShow){
                    _operatList.forEach(function(operat){
                        operat.duty.forEach(function(duty){
                            //判断当前项是申请时
                            if(duty.code == 'apply'){
                                if(duty.apply_items && duty.apply_items.length >0){
                                    duty.apply_items.forEach(function(apply){
                                        if(catchItem.code == 'auditReplacePeople' && apply.code == "applyReplacePeople" || catchItem.code == 'auditMatters' && apply.code == "applyMatters"
                                            || catchItem.code == 'auditDelay' && apply.code == "applyDelay" ||  catchItem.code == 'auditClose' && apply.code == "applyClose"
                                            || catchItem.code == 'auditAddingPeople' && apply.code == "applyAddingPeople"){
                                            //判断当前选择的为审核
                                            if( apply.next_route &&  apply.next_route.length >0){
                                                var _position = [];
                                                apply.next_route.forEach(function(posi){
                                                    //去选当前岗位状态选择时，需要处理code = audit 下的状态，code = approve时，添加到当前下级路由
                                                    if(posi.mark == "approve"){
                                                        _position.push(posi);
                                                    }else if(posi.mark == "audit"){
                                                        if(posi.position_id != catchItem.position_id){
                                                            _position.push(posi);
                                                        }
                                                    }
                                                   
                                                })
                                                if(_position.length >0){
                                                    apply.next_route = JSON.parse(JSON.stringify(_position));
                                                }else{
                                                    apply.next_route = [];
                                                    apply.selectPositionName = "系统";
                                                }   
                                            }
                                        }
                                    })
                                }
                            }    
                        })
                    })

                    // _operatList = JSON.parse(JSON.stringify(_operatList));
                    // console.log(_operatList);
                }
            });
            console.log(_operatList);
            //将选中的岗位添加到下级路由
            if (result && result.length > 0) {
                result.forEach(function (res) {
                    if (res.next_route && res.next_route.length > 0) {
                        var _position = [];
                        res.next_route.forEach(function (next) {
                            if (next.isShow) {
                                _position.push(next);
                            }
                        });

                        res.next_route = _position;
                    } 
                });

            };
            _apply_items = JSON.parse(JSON.stringify(result));


            _operatList[faIndex].duty[childIndex]["apply_items"] = _apply_items;
            var _timeState = $("#auditTimeSwitch").psel();
            if(_timeState){
                //判断当选中当前项，输入的时间格式是否合法
                if($("#auditTimeTxt").pverifi()){

                }else{
                    return;
                }
                
            };
            if (_timeState) { //判断是否选中期望持续时间
                _operatList[faIndex].duty[childIndex]["expecte_operation"] = true;
                _operatList[faIndex].duty[childIndex]["minute"] = +($("#auditTimeTxt").pval());

            } else {
                _operatList[faIndex].duty[childIndex]["expecte_operation"] = false;
            }

        } else if (code == 'approve') { //审批
            var _apply_items = [];

            //审核下级路由数据源
            var result = [];
            //处理缓存数据的数组
            var catchArr = [];
            var positionId = _operatList[faIndex].position_id;
            var positionName = _operatList[faIndex].name;
            var approveNextRoute = JSON.parse(JSON.stringify(workOrderModel.approveModuleList));
            approveNextRoute.forEach(function (approve, index) {
                if (approve.checked) {
                    result.push(approve);
                }
                //存储每次操作后的下级路由
                catchArr.push({
                    code:approve.code,
                    name:approve.name,
                    position_id:positionId,
                    position_name:positionName,
                    isShow:approve.checked
                })
            });
             //遍历每次操作后的数据和缓存中数据比对，如果当前未选中需要将缓存中的数据清除
             //初始化系统函数
             function initSystem(){
                return [{
                    isCurr:true,
                    isShow:true,
                    mark:"approve",
                    name:"系统",
                    position_id:"systemPosition",
                    type:"system"
                }]
            }
            catchArr.forEach(function(catchItem){
                if(!catchItem.isShow){
                    _operatList.forEach(function(operat){
                        operat.duty.forEach(function(duty){
                            //判断当前项是审核时 如果审核的下级路由中的某个模块包含当前未选中的岗位，需要将当前项初始化
                            if(duty.code == 'audit'){
                                if(duty.apply_items && duty.apply_items.length >0){
                                    duty.apply_items.forEach(function(apply){
                                        if(catchItem.code == 'approvalReplacePeople' && apply.code == "auditReplacePeople" || 
                                            catchItem.code == 'approvalMatters' && apply.code == "auditMatters" ||
                                            catchItem.code == 'approvalDelay' && apply.code == "auditDelay" || 
                                            catchItem.code == 'approvalClose' && apply.code == "auditClose" || 
                                            catchItem.code == 'approvalAddingPeople' && apply.code == "auditAddingPeople"
                                        ){
                                            if( apply.next_route &&  apply.next_route.length >0){
                                                var _position = [];
                                                apply.next_route.forEach(function(posi){
                                                    if(posi.position_id != catchItem.position_id){
                                                        _position.push(posi);
                                                    }
                                                });
                                                if(_position.length >0){
                                                    apply.next_route = JSON.parse(JSON.stringify(_position));
                                                    apply.selectPositionName = workOrderMethod.arrayObjectTransfString(_position,'name',',');
                                                }else{
                                                    apply.next_route = [];
                                                    apply.selectPositionName = "请选择审批岗位";
                                                }   
                                            }
                                        }
                                    })
                                }
                            }
                            //判断当前项是申请时
                            if(duty.code == 'apply'){
                                if(duty.apply_items && duty.apply_items.length >0){
                                    duty.apply_items.forEach(function(apply){
                                        if(catchItem.code == 'approvalReplacePeople' && apply.code == "applyReplacePeople" || 
                                            catchItem.code == 'approvalMatters' && apply.code == "applyMatters" || 
                                            catchItem.code == 'approvalDelay' && apply.code == "applyDelay" ||
                                            catchItem.code == 'approvalClose' && apply.code == "applyClose" || 
                                            catchItem.code == 'approvalAddingPeople' && apply.code == "applyAddingPeople"
                                        ){
                                            if( apply.next_route &&  apply.next_route.length >0){
                                                var _position = [];
                                                apply.next_route.forEach(function(posi){
                                                    if(posi.mark == "audit"){
                                                        _position.push(posi);
                                                    }else if(posi.mark == "approve"){
                                                        if(posi.position_id != catchItem.position_id){
                                                            _position.push(posi);
                                                        }
                                                    }
                                                });
                                                if(_position.length >0){
                                                    if(_position.length == '1' && _position[0].type == 'system'){
                                                        apply.next_route = [];
                                                    }else{
                                                        apply.next_route = JSON.parse(JSON.stringify(_position));
                                                        apply.selectPositionName = workOrderMethod.arrayObjectTransfString(_position,'name',',');
                                                    }
                                                    
                                                }else{
                                                    apply.next_route = [];
                                                    apply.selectPositionName = "请选择审批岗位";
                                                }    
                                            }
                                        }
                                    })
                                }
                            }                                                        
                        })
                    })
                }
            });
            _apply_items = JSON.parse(JSON.stringify(result));
           
            _operatList[faIndex].duty[childIndex]["apply_items"] = _apply_items;
            var _timeState = $("#approvaNextTimeSwitch").psel();
            if(_timeState){
                //判断当选中当前项，输入的时间格式是否合法
                if($("#approveTime").pverifi()){

                }else{
                    return;
                }
                
            };
            if (_timeState) { //判断是否选中期望持续时间
                _operatList[faIndex].duty[childIndex]["expecte_operation"] = true;
                _operatList[faIndex].duty[childIndex]["minute"] = + ($("#approveTime").pval());

            } else {
                _operatList[faIndex].duty[childIndex]["expecte_operation"] = false;
            }
        };
        workOrderModel.operateOptionList = JSON.parse(JSON.stringify(_operatList));
        $("#operatWindow").phide();
    },
    confirmSelectOptionFn: function () { //确认选择岗位并添加到操作列表
        //更新备份数据
        workOrderModel.choicePositionListCopy = JSON.parse(JSON.stringify(workOrderModel.choicePositionList));

        var selectPosition = [];
        //添加更多职责数组
        var controlModule = JSON.parse(JSON.stringify(workOrderModel.controlModuleList));
        controlModule.forEach(function (item) {
            item['_show'] = true;
        });
        //操作完成的岗位树
        var positionTree = JSON.parse(JSON.stringify(workOrderModel.choicePositionList));
        // 将选中的岗位添加初始化添加到 selectPosition
        (function collectCheckPosition(arr) {
            var collectCheckPosition = arguments.callee;
            for (var j = 0; j < arr.length; j++) {
                var json = arr[j];
                if (json.checked) {
                    //position_id,name,type,duty,operatList
                    //初始化选中岗位结构放进数组
                    var item = workOrderMethod.positionRouterOptionInit(json.obj_id, json.obj_name, '2', [], controlModule);
                    selectPosition.push(item);
                };
                if (json.child_objs && json.child_objs.length) {
                    collectCheckPosition(json.child_objs);
                };
            }
        }(positionTree));
        //
        //选中岗位初始化完成，赋值
        var arr_create = JSON.parse(JSON.stringify(selectPosition));
        if(arr_create && arr_create.length >0){
            $("#choicePositionError").hide();
        }
        workOrderModel.operateOptionList = (workOrderModel.operateOptionList || []).concat(arr_create);
        $("#positionWindow").phide();
        console.log(selectPosition);

    },
    cancelSelectOptionFn: function () { //选择岗位列表隐藏
        //恢复岗位列表初始状态
        workOrderModel.choicePositionList = JSON.parse(JSON.stringify(workOrderModel.choicePositionListCopy));
        $("#positionWindow").phide();
    },
    selectPositionTree: function (item) { //选中岗位
        console.log(item);
        //判断选中项是否为岗位
        if (item.issel) {
            //判断是否已选中
            if (item["disabled"]) {
                console.log("禁用");
                return;
            } else {
                item["checked"] = !item["checked"];
            }
        } else {
            console.log("非岗位");
            return;
        }
    },
    //保存配置方案
    saveOrderConfigFn: function () { //保存工单配置方案
        //根据planid判断 新建 或 编辑
        var planId = workOrderModel.plan_id || '';
        //保存方案参数
        var configObj = {
            plan_name: '',
            work_type: '',
            execute_type: '',
            repair_flag: '',
            time_limit: {},
            post_and_duty: [],
        };
        configObj.plan_name = $("#orderType").pval() || '';
        configObj.work_type = $("#workType").psel().id || '';
        configObj.execute_type = $("#timeType").psel().id || '';
        configObj.repair_flag = ($("#tranOrderSwitch").psel()) ? '1' : '0' ;

        //判断是否设置工单要求
        var _limit = {
            startTime: {
                selected: false,
                around: '',
                minute: '',
            },
            endTime: {
                selected: false,
                around: '',
                minute: '',
            }
        };
        if ($("#startTimeCheck").psel()) {
            _limit.startTime.selected = true;
            _limit.startTime.around = $("#startTimeSel").psel() && $("#startTimeSel").psel().text == '前' ? 'front' : 'after';
            _limit.startTime.minute = +($("#startTimeTxt").pval() || '');
        }else{
            delete _limit.startTime;
        };
        if ($("#endTimeCheck").psel()) {
            _limit.endTime.selected = true;
            _limit.endTime.around = $("#endTimeSel").psel() && $("#endTimeSel").psel().text == '前' ?  'front' : 'after';
            _limit.endTime.minute = +($("#endTimeTxt").pval() || '');
        }else{
            delete _limit.endTime;
        };
        configObj.time_limit = _limit; //设置工单要求参数赋值
        var postAndDuty = JSON.parse(JSON.stringify(workOrderModel.operateOptionList));
        postAndDuty.forEach(function(item){
            if(item.duty && item.duty.length >0){
                item.duty.forEach(function(info){
                    if(info.code == 'create'){
                        info['executie_mode'] =  info['executie_mode'] ? info['executie_mode'] : 'execute';
                    }
                    if(info.code == "apply"){
                        if(info.apply_items && info.apply_items.length >0){
                            info.apply_items.forEach(function(apply){
                                var _approve = [];
                                //判断下拉选择的是审批过滤 mark = audit 的岗位
                                if(apply.next_code == "approve"){
                                    if(apply.next_route && apply.next_route.length >0){
                                        apply.next_route.forEach(function(next){
                                            if (next.mark == 'approve') {
                                                _approve.push(next);
                                            }
                                        })
                                       
                                        apply.next_route = _approve;//添加选中岗位
                                    }
                                }
                                var _audit = [];
                                //判断是审核过滤 mark = approve 的岗位
                                if(apply.next_code == "audit"){
                                    if(apply.next_route && apply.next_route.length >0){
                                        apply.next_route.forEach(function(next){
                                            if (next.mark == 'audit') {
                                                _audit.push(next);
                                            }
                                        })
                                       
                                        apply.next_route = _audit;//添加选中岗位
                                    }
                                }
                            })
                        }
                    }
                    if(info.code == "apply" || info.code == "audit"){
                        if(info.apply_items && info.apply_items.length >0){
                            info.apply_items.forEach(function(apply){
                                var _position = [];
                                if(apply.next_route && apply.next_route.length >0){
                                    apply.next_route.forEach(function(next){
                                        if (next.isShow) {
                                            _position.push(next);
                                        }
                                    })
                                   
                                    apply.next_route = _position;//添加选中岗位
                                }
                            })
                        }
                    }
                });
            };
        });
        configObj.post_and_duty = postAndDuty;


        //验证必填项
        var planNaneCheck =  $("#orderType").pverifi();
        var orderTypeCheck = $("#workType").psel().id ? true : false;
        var timeTypeCheck = $("#timeType").psel().id ? true : false;
        var operatList = JSON.parse(JSON.stringify(workOrderModel.operateOptionList));
        var operatListCheck = operatList.length >0 ? true : false;
        if(!orderTypeCheck){
            $("#workType .error-tip").show();
        };
        if(!timeTypeCheck){
            $("#timeType .error-tip").show();
        };
        if(!operatListCheck){
            $("#choicePositionError").show();
        }
        //判断是否设置工单相关要求
        var checkStartTime = true;
        var checkStartTimeTxt = true;
        var checkEndTime = true;
        var checkEndTimeTxt = true;
        if($("#startTimeCheck").psel()){
            if($("#startTimeSel").psel().text){
                checkStartTime = true;
            }else{
                checkStartTime = false;
                $("#startTimeSel").find(".error-tip").text("请选择").show();
            }
            if($("#startTimeTxt").pverifi()){
                checkStartTimeTxt = true;
            }else{
                checkStartTimeTxt = false;
                $("#startTimeTxt").find(".error-tip").show();
            }
        };
        if($("#endTimeCheck").psel()){
            if($("#endTimeSel").psel().text){
                checkEndTime = true;
            }else{
                checkEndTime = false;
                $("#endTimeSel").find(".error-tip").text("请选择").show();
            }
            if($("#endTimeTxt").pverifi()){
                checkEndTimeTxt = true;
            }else{
                checkEndTimeTxt = false;
                $("#endTimeTxt").find(".error-tip").show();
            }
        };
        //验证传入data
        var checkBlockData = {
            plan_name:$("#orderType").pval(),
            execute_type:$("#timeType").psel().id,
            post_and_duty:JSON.parse(JSON.stringify(configObj.post_and_duty))
        };
        if(planNaneCheck && planNaneCheck && timeTypeCheck && operatListCheck && checkStartTime && checkEndTime && checkStartTimeTxt && checkEndTimeTxt){

            var _this = this;
            workOrderMethod.checkWorkOrderVerify(planId,checkBlockData).then(function(list){
                if(list && list.length >0){
                    workOrderModel.errorTipList = list;
                    $("#globalnotice").pshow({text: "请根据顶部提示，完善工单配置",state: "failure"});
                    return;
                }else{
                    if (planId) { //编辑
                        configObj["plan_id"] = planId;
                        controller.updateFlowPlanById(configObj).then(function (res) {
                            $("#globalnotice").pshow({text: "保存成功",state: "success"});
                            //查询工单配置列表
                            workOrderMethod.getWorkOrderListCommon();
            
                        }).catch(function (err) {
                            $("#globalnotice").pshow({text: "保存失败",state: "failure"});
                        });
                    } else { //新建
                        
                        controller.addFlowPlan(configObj).then(function (res) {
                            $("#globalnotice").pshow({text: "保存成功",state: "success"});
                             //查询工单配置列表
                             workOrderMethod.getWorkOrderListCommon();
                            
                        }).catch(function (err) {
                            $("#globalnotice").pshow({text: "保存失败",state: "failure"});
                        });
                    };
                }
                
            }).catch(function(){

            });
           
        }else{
            $("#globalnotice").pshow({text: "请根据提示，完善工单配置",state: "failure"});
            return ;
        }



       
    },
    checkWorkOrderVerify:function(planId,checkBlockData){//验证工单配置是否合法
        //校验模块配置
        workOrderModel.errorTipList = [];//清空错误提示
        if(planId){
            checkBlockData.plan_id = planId;
        };
        return controller.verifyFlowPlan(checkBlockData).then(function(list){
            return list;
        });
        
    },
};
var workOrderConfigMounted = function () {
    //查询工单配置列表
    controller.queryFlowPlan({}).then(function (list) {
        workOrderModel.workOrderConfigList = list;
    }).catch(function () {
        $("#globalnotice").pshow({
            text: "获取数据失败，请重试",
            state: "failure"
        });
    });

    //新建配置  TO DELETE
    workOrderMethod.newCreateConfigInit();
};

var workOrderConfigLogger = {
    //初始化
    init: function () {
        window.app = new Vue({
            el: "#workOrderConfig",
            data:workOrderModel,
            methods: workOrderMethod,
            mounted: workOrderConfigMounted
        });
    }
};