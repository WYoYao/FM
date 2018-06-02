var controllerAddSystem = {
    updateSystemInfo: function (argu, type) {

        return new Promise(function (resolve, rejcet) {
            
            type = /attachments/g.test(JSON.stringify(argu));

            pajax[type ? 'updateWithFile' : 'post']({
                url: 'restSystemService/updateSystemInfo',
                data: argu,
                success: function (res) {
                    resolve(res);
                },
                error: function (errObj) {
                    rejcet(errObj)
                },
                complete: function () { }
            });
        })
    },
    querySystemInfoPointHis: function (system_id, info_point_code, info, cb) {

        // 获取最后一个参数为回调函数
        cb = arguments[arguments.length - 1];

        info = arguments.length == 4 ? info : void 0;

        return new Promise(function (resolve, rejcet) {

            pajax.post({
                url: 'restSystemService/querySystemInfoPointHis',
                data: {
                    system_id: system_id,
                    info_point_code: info_point_code,
                },
                success: function (data) {

                    if (data.data) {

                        // 动态信息点
                        if (info) {

                            // 复选框 下拉菜单
                            if (_.isArray(info.cmpt_data) && info.cmpt_data.length) {

                                data.data = data.data.map(function (item) {

                                    // 默认转换为数组
                                    item.value = _.isArray(item.value) ? item.value : [item.value];

                                    // 将数组转换成为对应的字符串
                                    item.value = item.value.map(function (x) {

                                        return info.cmpt_data.filter(function (y) {

                                            return y.code == x;
                                        }).map(function (z) {

                                            return z.name;
                                        });

                                    }).join(',');;

                                    return item;

                                })
                            } else if (_.isArray(info.str_value) && (info.cmpt_data || []).length == 0 && info.str_value.length == 2) {

                                // 范围框
                                data.data = data.data.map(function (item) {

                                    item.value = item.value.map(function (x) {

                                        return x + (info.unit ? info.unit : '');

                                    }).join('~');

                                    return item;
                                })

                            } else if(info.cmpt == "pupload_attachmentonly"){

                                data.data.map(function(value,index){
                                    data.data[index].value = data.data[index].value[0].name;
                                })

                            } else {

                                data.data = data.data.map(function (item) {

                                    item.value = _.isArray(item.value) ? item.value.join(',') : item.value;

                                    return item;
                                })
                            }
                        }

                    }

                    data.data = data.data.map(function (item) {
                        if ((_.isString(item.value) && /^\d{14}$/g.test(item.value))) {

                            item.value = item.value.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/g, function () {
                                var arr = Array.prototype.slice.call(arguments);
                                return arr.slice(1, 4).join('.');
                            });
                        } else if (_.isString(item.name) && /^\d{14}$/g.test(item.name)) {

                            item.name = item.name.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/g, function () {
                                var arr = Array.prototype.slice.call(arguments);
                                return arr.slice(1, 4).join('.');
                            });
                        }
                        return item;
                    })

                    cb(data.data.map(function (item) {
                        // 将后台返回的时间字符串格式化为可以实例的时间格式
                        item.date = item.date.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/g, function () {
                            var arr = Array.prototype.slice.call(arguments);
                            return arr.slice(1, 4).join('/') + " " + arr.slice(4, 7).join(':');
                        });
                        item.value = item.name != "--" ? item.name : item.value;

                        return item;
                    }))
                    resolve(data);
                },
                error: function (errObj) {
                    rejcet(errObj)
                },
                complete: function () { }
            });
        })
    },
    querySystemPublicInfo: function (system_id, cb) {

        return new Promise(function (resolve, rejcet) {

            pajax.post({
                url: 'restSystemService/querySystemPublicInfo',
                data: {
                    system_id: system_id
                    //user_id: 'RY1505218031651', //用户id
                    //project_id: 'Pj1301020001', //项目id
                },
                success: function (res) {
                    resolve(res);
                },
                error: function (errObj) {
                    rejcet(errObj)
                },
                complete: function () { }
            });
        })
    },
    querySystemDynamicInfo: function (system_id) {

        return new Promise(function (resolve, reject) {

            pajax.post({
                url: 'restSystemService/querySystemDynamicInfo',
                data: {
                    system_id: system_id
                    //user_id: 'RY1505218031651', //用户id
                    //project_id: 'Pj1301020001', //项目id
                },
                success: function (res) {

                    resolve(res.data);
                },
                error: function (errObj) {

                    reject(errObj);
                },
                complete: function () { }
            });
        })
    },
    queryBuild: function () {

        // return new Promise(function (resolve, reject) {
        //     setTimeout(function () {

        //         resolve(_.range(10).map((item, index) => {
        //             return {
        //                 "obj_id": ++index,
        //                 "obj_name": '名称' + (index),
        //             }
        //         }))

        //     }, 300);
        // });

        return new Promise(function (resolve, reject) {

            pajax.post({
                url: 'restObjectService/queryBuild',
                data: {
                    //user_id: 'RY1505218031651', //用户id
                    //project_id: 'Pj1301020001', //项目id
                },
                success: function (res) {

                    resolve(res.data);
                },
                error: function (errObj) {

                    reject(errObj);
                },
                complete: function () { }
            });
        })
    },
    queryAllEquipCategoryPro: function () {

        return new Promise(function (resolve, reject) {

            pajax.post({
                url: 'restDictService/queryAllEquipCategory',
                data: {

                },
                success: function (res) {
                    resolve(res);
                },
                error: function (errObj) {

                    reject(errObj);
                },
                complete: function () { }
            });
        })
    },
    querySystemDynamicInfoForAdd: function (system_category) {

        return new Promise(function (resolve, reject) {

            pajax.post({
                url: 'restSystemService/querySystemDynamicInfoForAdd',
                data: {
                    system_category: system_category
                },
                success: function (res) {
                    resolve(res.data);
                },
                error: function (err) {

                    reject(err);
                },
                complete: function () { }
            });
        })
    },
    addSystem: function (argu) {

        return new Promise(function (resolve, reject) {

            var hasAttr = /attachments/g.test(JSON.stringify(argu));

            pajax[hasAttr ? "updateWithFile" : "post"]({
                url: 'restSystemService/addSystem',
                data: argu,
                success: function (res) {
                    $('#globalnotice').pshow({
                        text: '保存成功',
                        state: 'success'
                    });
                    resolve(res.data);
                },
                error: function (err) {
                    $('#globalnotice').pshow({
                        text: '保存失败',
                        state: 'failure'
                    });
                    reject(err);
                },
                complete: function () { }
            });
        })
    },
    verifySystemName: function (argu) {

        return new Promise(function (resolve, reject) {

            pajax.post({
                url: 'restSystemService/verifySystemName',
                data: argu,
                success: function (res) {

                    resolve(res);
                },
                error: function (err) {

                    reject(err);
                },
                complete: function () { }
            });
        })
    },
    verifySystemLocalId: function (argu) {

        return new Promise(function (resolve, reject) {

            pajax.post({
                url: 'restSystemService/verifySystemLocalId',
                data: argu,
                success: function (res) {

                    resolve(res);
                },
                error: function (err) {

                    reject(err);
                },
                complete: function () { }
            });
        })
    },
    verifySystemBimId: function (argu) {

        return new Promise(function (resolve, reject) {

            pajax.post({
                url: 'restSystemService/verifySystemBimId',
                data: argu,
                success: function (res) {

                    resolve(res);
                },
                error: function (err) {

                    reject(err);
                },
                complete: function () { }
            });
        })
    },

}
controllerAddSystem.init = function () {
    v.initPage("systemMng");

}
controllerAddSystem.queryAllEquipCategory = function (cb) { //查询专业-系统类型-设备类型

    pajax.post({
        url: 'restDictService/queryAllEquipCategory',
        data: {
            //user_id: 'RY1505218031651', //用户id
            //project_id: 'Pj1301020001', //项目id
        },
        success: function (res) {

            var data = res || [];
            v.instance.majorTypeArr = v.instance.majorTypeArr.concat(data); //专业列表

        },
        error: function (errObj) {
            console.error('queryAllEquipCategory err');
        },
        complete: function () { }
    });
};
controllerAddSystem.queryBuildSystemTree = function (argu, cb) { //查询建筑-系统列表树

    pajax.post({
        url: 'restSystemService/queryBuildSystemTree',
        data: argu,
        success: function (res) {
            var data = res.data || [];
            cb(data);
        },
        error: function (errObj) {
            console.error('queryBuildSystemTree err');
        },
        complete: function () { }
    });
};