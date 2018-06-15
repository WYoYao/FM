

var controller = {

    //指派工单请求
    assignOrderSet: function (_data) {
        pajax.update({
            url: 'restWoMonitorService/doAssignWithAdmin',
            data: _data,
            success: function (res) {
                $("#publishNotice").pshow({ text: '指派成功', state: "success" });
            },
            error: function (error) {
                $("#publishNotice").pshow({ text: '指派失败,请重试', state: "failure" });
            },

            complete: function () {
                $("#list_loading").phide();
            }
        });
    },
    //中止工单请求
    stopOrderSet: function (dataObj) {
        pajax.update({
            configServiceName: "baseServiceUrl",
            url: 'workorder/restWoMonitorService/stopWorkOrderById',
            data: dataObj,
            success: function (result) {
                workOrderMngModel.stopWorkOrderIsClick=true;
                $("#stopOrder").phide();
                $("#monitor-list-notice").pshow({ text: '中止成功', state: "success" });
            },
            error: function (error) {
                $("#monitor-list-notice").pshow({ text: '中止失败,请重试', state: "failure" });
            },
            complete: function () {
                workOrderMngMethod.goBackOrderList();
                controller.queryAllWorkOrder(workOrderMngModel.queryListParameter);
            }
        });
    },
    //获取用户信息
    getUserInfo: function () {
        $.ajax({
            url: '/userInfo',
            type: 'get',
            data: {},
            success: function (result) {
                workOrderMngModel.userInfo = result;

            },
            error: function (error) {
            },
            complete: function () {
            }
        });
    },

    // ajax请求
    // 工单类型 
    queryGeneralDictByKey: function () {
        $('#loadCover').pshow();
        pajax.post({
            url: 'restGeneralDictService/queryWoTypeList',
            data: {},
            success: function (result) {
                result = result || {};
                var data = result.data || [];
                var allArr = [{
                    code: "",
                    name: "全部",
                    description: "",
                    dic_type: 'work_order_type'
                }]

                workOrderMngModel.workType = allArr.concat(data);
                setTimeout(function () {
                    $("#work-type").psel("全部", false);
                }, 0);
            },
            error: function (err) {
                $("#monitor-list-notice").pshow({ text: "获取工单类型失败", state: "failure" });
            },
            complete: function () {
                $('#loadCover').phide();
            }
        });
    },

    // 工单状态 
    queryWorkOrderState: function () {
        $('#loadCover').pshow();
        pajax.post({
            url: 'restGeneralDictService/queryWorkOrderState',
            data: {
                dict_type: "work_order_state"     //工单状态，必须
            },
            success: function (result) {
                var data = result && result.data ? result.data : [];
                var allArr = [{
                    code: "",
                    name: "全部",
                    description: ""
                }];

                workOrderMngModel.workState = allArr.concat(data);
                setTimeout(function () {
                    $("#work-state").psel("全部", false);
                }, 0);
            },
            error: function (err) {
                $("#monitor-list-notice").pshow({ text: "获取工单状态失败", state: "failure" });
            },
            complete: function () {
                // $('#loadCover').phide();
            }
        });

    },


    //查询获取评价执行人Id
    queryEvaluateId: function (dataObj) {
        pajax.post({
            configServiceName: "baseServiceUrl",
            url: "workorder/restWoMonitorService/queryWoExecutorsById",
            data: dataObj,
            success: function (result) {
                console.log(result);
                result = result || {};
                var data = result.data || [];
                for (var i = 0; i < data.length; i++) {
                    var cur = data[i];
                    cur.score = Number(cur.score);
                }
                workOrderMngModel.evaluateMessage = data;
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {
                Vue.nextTick(function () {
                    for (var i = 0; i < workOrderMngModel.evaluateMessage.length; i++) {
                        var cur = workOrderMngModel.evaluateMessage[i];
                        var value = cur.executor_person_id;
                        if (!cur.comment_flag) {
                            $('#' + value).find(".textarea").pval("");
                        }
                    }
                })
            }
        })
    },

    //提交评价人信息
    confirmEvaluate: function (dataObj) {
        pajax.post({
            configServiceName: "baseServiceUrl",
            url: "workorder/restWoMonitorService/addWoExecutorsCommentInfo",
            data: dataObj,
            success: function (result) {
                workOrderMngModel.evaluateMessage = [];
                $("#monitor-list-notice").pshow({ text: '提交成功', state: "success" });
            },
            error: function (error) {
                console.log(error);
                $("#monitor-list-notice").pshow({ text: '提交失败,请重试', state: "failure" });
            },
            complete: function () {
                $("#evaluateModal").phide();
            }
        });
    },


    //wyy
    //获取系统
    getSystemData: function (argu) {
        $("#treeTempLoading").pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restObjectService/querySystem',
                data: {
                    need_back_parents: true    //返回数据叶子节点是否需要带父级,必须
                },
                success: function (result) {
                    result = result || {};
                    resolve(result.data);
                },
                error: function (err) {
                    $("#monitor-list-notice").pshow({ text: "获取系统失败", state: "failure" });
                },
                complete: function () {
                    $("#treeTempLoading").phide();
                },
            });
        });
    },

    //获取设备类型

    getEquipTypeData: function () {
        $("#treeTempLoading").pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                configServiceName: "baseServiceUrl",
                url: 'sop/restObjectService/queryEquipClass',
                data: {
                    need_back_parents: true    //返回数据叶子节点是否需要带父级,必须
                },
                success: function (result) {
                    result = result || {};

                    resolve(result.data);
                },
                error: function (err) {
                    $("#monitor-list-notice").pshow({ text: "获取设备类型失败", state: "failure" });
                },
                complete: function () {
                    $("#treeTempLoading").phide();
                }
            });
        })
    },

    //获取空间类型
    getSpaceTypeData: function () {
        $("#treeTempLoading").pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                configServiceName: "baseServiceUrl",
                url: 'sop/restObjectService/querySpaceClass',
                data: {
                    need_back_parents: true    //返回数据叶子节点是否需要带父级,必须
                },
                success: function (result) {
                    result = result || {};

                    resolve(result.data);

                },
                error: function (err) {
                    $("#monitor-list-notice").pshow({ text: "获取空间类型失败", state: "failure" });
                },
                complete: function () {
                    $("#treeTempLoading").phide();
                }
            });
        });
    },
    //获取空间
    getSpaceData: function () {
        $("#treeTempLoading").pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restObjectService/queryBuildFloorSpaceTree',
                data: {},
                success: function (result) {
                    resolve(result);

                },
                error: function (err) {
                    $("#monitor-list-notice").pshow({ text: "获取空间失败", state: "failure" });
                },
                complete: function () {
                    $("#treeTempLoading").phide();
                }
            });
        });
    },
    //根据空间id获取设备
    getEquipData: function (data) {
        data.need_back_parents = true;
        $("#treeTempLoading").pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restObjectService/queryEquip',
                data: data,
                success: function (result) {
                    result = result || {};

                    resolve(result.data);
                },
                error: function (err) {
                    $("#monitor-list-notice").pshow({ text: "获取设备失败", state: "failure" });
                },
                complete: function () {
                    $("#treeTempLoading").phide();
                }
            });
        });
    },
    //获取参与人、执行人
    getPersonTree: function () {
        $("#treeTempLoading").pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restDeptService/queryDeptPositionPersonTree',
                data: {},
                success: function (result) {
                    result = result || {};

                    resolve(result.data);
                },
                error: function (err) {
                    $("#monitor-list-notice").pshow({ text: "获取人员失败", state: "failure" });
                },
                complete: function () {
                    $("#treeTempLoading").phide();
                }
            });
        });

    },
    //查询工单列表
    queryAllWorkOrder: function (conditionObj, flag) {
        if (!flag) {
            workOrderMngModel.workList = [];
        }
        $('#loadCover').pshow();
        pajax.post({
            configServiceName: "baseServiceUrl",
            url: 'workorder/restWorkOrderService/queryWorkOrderList',
            data: conditionObj,
            success: function (result) {
                result = result || {};
                var data = result.data || [];
                workOrderMngModel.workList = workOrderMngModel.workList.concat(data);
                if (flag) {
                    if (result.count == 0) {

                        $("#monitor-list-notice").pshow({ text: "已经加载到底了", state: "success" });
                    }
                }
            },
            error: function (err) {
                $("#monitor-list-notice").pshow({ text: "获取工单列表失败", state: "failure" });
            },
            complete: function () {
                $('#loadCover').phide();
                $(".monitor-flash").removeClass("flash-no");

            }
        });
    }

};

