var controller = {
    //配置列表相关请求
    queryFlowPlan:function(_data){
        $('#globalloading').pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: "restFlowPlanService/queryFlowPlan",
                data: _data,
                success: function (res) {
                    var data = res && res.data ? res.data : [];
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () {
                    $('#globalloading').phide();
                }
            });
        });
    },
    deleteFlowPlanById:function(_data){//删除工单配置
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: "restFlowPlanService/deleteFlowPlanById",
                data: _data,
                success: function (res) {
                    var data = res ;
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () {

                }
            });
        });
    },
    queryFlowPlanById:function(_data){//根据Id查询工单类型详细信息
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: "restFlowPlanService/deleteFlowPlanById",
                data: _data,
                success: function (res) {
                    var data = res ? res : {};
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () {

                }
            });
        });
    },
    //新建编辑相关
    queryGeneralDictByKeyConfig:function(_data){//查询数据字典  工作类型，时间类型 ,工单流转控制模块
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: "restGeneralDictService/queryGeneralDictByKey",
                data: _data,
                success: function (res) {
                    var data = res ? res : [];
                    resolve(data.data);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () {

                }
            });
        });
    },
    queryDeptPositionTree:function(_data){//查询岗位树
        return new Promise(function (resolve, reject) {
            pajax.post({
                // url:"restDeptService/queryDeptPositionTree",
                url: "restFlowPlanService/queryDeptPositionTree",
                data: _data,
                success: function (res) {
                    var data = res && res.data ? res.data : [];
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () {

                }
            });
        });
    },
    queryControlModuleList:function(){//查询工单流转控制模块
        return new Promise(function (resolve, reject) {
            pajax.post({
                url:"restGeneralDictService/queryGeneralDictByKey",
                // url: "restPersonService/queryPositions",
                data: _data,
                success: function (res) {
                    var data = res && res.data ? res.data : [];
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () {

                }
            });
        });
    },

    //新建编辑 保存及验证
    addFlowPlan:function(_data){//新建工单配置方案保存
        $('#globalloading').pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                url:"restFlowPlanService/addFlowPlan",
                data: _data,
                success: function (res) {
                    var data = res ? res : [];
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () {
                    $('#globalloading').phide();
                }
            });
        });
    },
    updateFlowPlanById:function(_data){//根据Id更新工单类型信息
        $('#globalloading').pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                url:"restFlowPlanService/updateFlowPlanById",
                data: _data,
                success: function (res) {
                    var data = res ? res : [];
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () {
                    $('#globalloading').phide();
                }
            });
        });
    },
    verifyFlowPlan:function(_data){//验证工单配置
        return new Promise(function (resolve, reject) {
            pajax.post({
                url:"restFlowPlanService/verifyFlowPlan",
                data: _data,
                success: function (res) {
                    var data = res ? res : [];
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () {

                }
            });
        });
    },
    queryFlowPlanById:function(_data){//根据Id查询工单类型详细信息
        // $('#globalloading').pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                url:"restFlowPlanService/queryFlowPlanById",
                data: _data,
                success: function (res) {
                    var data = res ? res :{};
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () {
                    // $('#globalloading').phide();
                }
            });
        });
    },

    


    

  

};