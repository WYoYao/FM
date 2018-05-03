var personController = {
    queryDeptPositionTree: function (_data) {//查询部门岗位树
        // $('#globalloading').pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restDeptService/queryDeptPositionTree',
                data: _data,
                success: function (res) {
                    var data = res  ? res: [];
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
    queryPersonWithGroup: function (_data) { //人员缩略图列表
        $("#globalloading").pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restPersonService/queryPersonWithGroup',
                data: _data,
                success: function (res) {
                    var data = res && res.data ? res.data : [];
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () {
                    $("#globalloading").phide();
                }
            });
        })
    },
    queryPersonList: function (_data) { //人员列表
        $('#globalloading').pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restPersonService/queryPersonList',
                data: _data,
                success: function (res) {
                    var data = res  ? res : [];
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
   
    queryDeptTree: function (_data) { //查询部门树
        $('#globalloading').pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restDeptService/queryDeptTree',
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
    queryPositionByDeptId: function (_data) { //查询部门下岗位
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restDeptService/queryPositionByDeptId',
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
    queryGeneralDictByKey: function (_data) { //查询专业
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
    queryNoBindingUserList: function (_data) { //未绑定账号模糊查询
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
    queryFuncPackList: function (_data) { //查询权限包列表
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
    queryDeptPositionTreeByType: function (_data) { //查询指定类型的部门岗位树
        // $('#globalloading').pshow();
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
    addPerson: function (_data,files) { //添加人员信息
        $('#globalloading').pshow();
        var type = files.length >0 ? 'updateWithFile' :'update';
        return new Promise(function (resolve, reject) {
            pajax[type]({
                url: 'restPersonService/addPerson',
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
    queryPersonDetailByidNumber:function(_data){//根据员工识别码查询员工信息
        // $('#globalloading').pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restPersonService/queryPersonDetailByidNumber',
                data: _data,
                success: function (res) {
                    var data = res ? res : {};
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
    queryPersonDetailById: function (_data) { //根据id查询人员详细信息
        $('#globalloading').pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restPersonService/queryPersonDetailById',
                data: _data,
                success: function (res) {
                    var data = res ? res : {};
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
    discardPersonById: function (_data) { //根据Id废弃（离职）人员信息
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restPersonService/discardPersonById',
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
    deleteProjectPersonById:function(_data){//删除人员
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restPersonService/deleteProjectPersonById',
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
    regainPersonById: function (_data) { //根据Id恢复已废弃的人员信息
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restPersonService/regainPersonById',
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
    updatePersonById: function (_data,files) { //根据Id编辑人员信息
        $('#globalloading').pshow();
        var type = files.length >0 && files[0].name ? 'updateWithFile' :'update';
        return new Promise(function (resolve, reject) {
            pajax[type]({
                url: 'restPersonService/updatePersonById',
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
    saveDeptPosition: function (_data) { //保存部门岗位信息
        $('#globalloading').pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restDeptService/saveDeptPosition',
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
    downloadCardInfo: function () {// 下载人员excel模板
        pajax.downloadByParam("restPersonService/downloadPersonTemplateFile");
    },
    uploadPersonFile: function (_data) {   //批量上传:上传人员

        return new Promise(function (resolve, reject) {

            pajax.updateWithFile({
                url: 'restPersonService/uploadPersonFile',
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
            })
        })
    },
    queryPersonLoginInfo: function (_data) { //查询人员登录信息
        $('#globalloading').pshow();
        return new Promise(function (resolve, reject) {
            pajax.post({
                url: 'restPersonService/queryPersonLoginInfo',
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

}