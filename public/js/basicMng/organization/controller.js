var organizationController = {
    queryDeptPositionTreeByType: function (_data) {      //查询指定类型的部门岗位树
        $('#globalloading').pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restDeptService/queryDeptPositionTreeByType',
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
    saveDeptPosition: function (_data) {    //保存部门岗位信息
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restDeptService/saveDeptPosition',
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
    queryGeneralDictByKey: function (_data) {     //查询专业
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restGeneralDictService/queryGeneralDictByKey',
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
    queryCurrentUserProjectLimits: function () {     //查询项目
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restPersonService/queryCurrentUserProjectLimits',
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
    addPersonMultipleProject: function (_data) {      //快速添加中心部门人员（无图）
        
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restPersonService/addPersonMultipleProject',
                data: _data,
                success: function (res) {
                    console.log(res)
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
    addPersonMultipleProjectWithImg: function (_data) {      //快速添加中心部门人员（有图）
        
        return new Promise(function (resolve, reject) {
            pajax.updateWithFile({
                url: 'restPersonService/addPersonMultipleProject',
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
    queryNoBindingUserList: function (_data) {      //模糊查询
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restPersonService/queryNoBindingUserList',
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
    queryFuncPackList: function (_data) {      //查询权限包
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restPersonService/queryFuncPackList',
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
    queryPositionByDeptId: function (_data) {      //查询部门下岗位
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restDeptService/queryPositionByDeptId',
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
    queryPersonDetailByidNumber: function (_data) {      //根据身份证查询人员信息
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restPersonService/queryPersonDetailByidNumber',
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
    }
}