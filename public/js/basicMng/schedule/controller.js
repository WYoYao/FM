var controllers = {
    querySchedulingConfig: function (_data) {      //查询排班类型
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restSchedulingConfigService/querySchedulingConfig',
                data: _data,
                success: function (res) {
                    var data = res.data ? res.data : [];
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
    queryDeptPositions: function (_data) {      //查询部门岗位树（排班使用）
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restSchedulingService/queryDeptPositions',
                data: _data,
                success: function (res) {
                    var data = res.data ? res.data : [];
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
    queryMonthSchedulingForWeb: function (_data) {      //查询目前排班计划
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restSchedulingService/queryMonthSchedulingForWeb',
                data: _data,
                success: function (res) {
                    var data = res.data ? res.data : [];
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
    saveOrUpdateSchedulingConfig: function (_data) {      //保存班次设置
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restSchedulingConfigService/saveOrUpdateSchedulingConfig',
                data: _data,
                success: function (res) {
                    var data = res ? res : [];
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                    $("#message").pshow({ text: "保存失败！", state: "failure" });
                },
                complete: function () {
                    $('#globalloading').phide();
                }
            });
        });
    },
    uploadSchedulingFile : function (val, month,positionid) {   //上传
        return new Promise(function (resolve, reject) {
            pajax.updateWithFile({
                url: 'restSchedulingService/uploadSchedulingFile',
                data: {
                    month: month, //月份, 格式：yyyyMM，必须
                    position_id: positionid,
                    attachments: {
                        path: val.url,
                        toPro: 'file',
                        multiFile: false,
                        fileName: val.name,
                        fileSuffix: val.suffix,
                        isNewFile: true,
                        fileType: 2,
                    }
                },
                success: function (res) {
                    var data = res ? res : [];
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                    $("#message").pshow({ text: "上传失败！", state: "failure" });
                },
                complete: function () {
                    $('#globalloading').phide();
                }
            });
        })    
    },
    saveSchedulingPlan: function (_data) {      //发布
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restSchedulingService/saveSchedulingPlan',
                data: _data,
                success: function (res) {
                    var data = res ? res : [];
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                    $("#message").pshow({ text: "发布失败！", state: "failure" });
                },
                complete: function () {
                    $('#globalloading').phide();
                }
            });
        });
    },
}