var equipmentMngDeatilController = {
    queryEquipDynamicInfo: function (equip_id) {

        return new Promise(function (resolve, reject) {

            pajax.post({
                url: 'restEquipService/queryEquipDynamicInfo',
                data: {
                    equip_id: equip_id
                },
                success: function (data) {
                    resolve(data.data);
                },
                error: function () {
                    reject(err);
                },
                complete: function () {

                },
            });
        })
    },
    //设备管理-详细页:查询设备通用信息
    queryEquipPublicInfo: function (equip_id) {

        return new Promise(function (resolve, reject) {

            pajax.post({
                url: 'restEquipService/queryEquipPublicInfo',
                data: {
                    equip_id: equip_id
                },
                success: function (data) {
                    if (Object.keys(data).length) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                },
                error: function () {
                    reject(err);
                },
                complete: function () {

                },
            });
        })

    },
    //设备管理-详细页:查询设备名片信息
    queryEquipCardInfo: function (equip_id) {

        return new Promise(function (resolve, reject) {

            pajax.post({
                url: 'restEquipService/queryEquipCardInfo',
                data: {
                    equip_id: equip_id
                },
                success: function (data) {
                    if (Object.keys(data).length) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                },
                error: function () {
                    reject(err);
                },
                complete: function () {

                },
            });
        })
    },
    // 查询工单类型
    queryGeneralDictByKey: function () {

        return new Promise(function (resolve, reject) {

            pajax.post({
                url: 'restGeneralDictService/queryGeneralDictByKey',
                data: {
                    "dict_type": "work_order_type"
                },
                success: function (data) {
                    if (data.data) {
                        resolve(data.data);
                    } else {
                        reject(data);
                    }
                },
                error: function () {
                    reject(err);
                },
                complete: function () {

                },
            });

        })
    },
    //设备管理-详细页:查询设备相关的工单
    queryEquipRelWorkOrder: function (argu) {


        return new Promise(function (resolve, reject) {


            pajax.post({
                url: 'restEquipService/queryEquipRelWorkOrder',
                data: argu,
                success: function (data) {
                    if (data.data) {
                        resolve(data.data);
                    } else {
                        reject(data);
                    }
                },
                error: function () {
                    reject(err);
                },
                complete: function () {

                },
            });
        })
    },
    // 对象选择:查询设备实例:查询建筑-楼层-空间列表树 (**安装位置**)
    queryBuildFloorSpaceTree: function (build_id) {

        return new Promise(function (resolve, reject) {

            pajax.post({
                url: 'restObjectService/queryBuildFloorSpaceTree',
                data: {
                    build_id: build_id
                },
                success: function (data) {

                    if (data.data) {
                        resolve(data.data.map(function (item) {
                            var obj_id = item.obj_id;

                            item.Parent_obj_id = item.obj_id;

                            item.content = item.content.map(function (info) {

                                info.Parent_obj_id = obj_id;

                                info.disabled = true;

                                info.content = info.content.map(function (x) {

                                    x.Parent_obj_id = obj_id;

                                    return x;
                                });

                                return info;
                            });

                            return item;

                        }));
                    } else {
                        reject(data);
                    }
                },
                error: function () {
                    reject(err);
                },
                complete: function () {

                },
            });

        })
    },
    // 对象选择:查询设备实例-系统专业下所有系统 (**所属系统**)
    querySystemForSystemDomain: function () {

        return new Promise(function (resolve, reject) {

            pajax.post({
                url: 'restObjectService/querySystemForSystemDomain',
                data: {},
                success: function (data) {
                    if (data.data) {
                        resolve(data.data);
                    } else {
                        reject(data);
                    }
                },
                error: function () {
                    reject(err);
                },
                complete: function () {

                },
            });
        })
    },
    //设备管理-新增页:查询专业-系统类型-设备类型 (** 所属系统 下拉菜单 **) 第二级
    queryAllEquipCategory: function () {

        return new Promise(function (resolve, reject) {

            pajax.post({
                url: 'restDictService/queryAllEquipCategory',
                data: {},
                success: function (data) {
                    if (data) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                },
                error: function () {
                    reject(err);
                },
                complete: function () {

                },
            });
        })
    },
    //设备管理-详细页:编辑设备信息
    updateEquipInfo: function (argu, type) {

        if (argu.info_point_code == "start_date" || argu.info_point_code == "maintain_deadline" || argu.info_point_code == "product_date") {
            argu.info_point_value = argu.info_point_value.replace(/-/g, "") + "000000";
        }
        /**
         * argu 接口调用的参数
         * type 请求类型， false 普通提交 true 上传文本
         */
        argu.info_point_value=argu.info_point_value?argu.info_point_value:'';
     //   console.log(argu);

        return new Promise(function (resolve, reject) {


            pajax[type ? 'updateWithFile' : 'post']({
                url: 'restEquipService/updateEquipInfo',
                data: argu,
                success: function (data) {
                    $("#globalnotice").pshow({
                        text: "编辑成功",
                        state: "success"
                    });
                    resolve();
                },
                error: function () {
                    $("#globalnotice").pshow({
                        text: "编辑失败",
                        state: "failure"
                    });
                    reject();
                },
                complete: function () {
                    reject()
                },
            });
        })
    },
    //设备管理-新增页:设备通讯录选择：供应商、生产厂家、维修商、保险公司
    queryEquipCompanySel: function (type) {

        /**
         * 1-供应商、2-生产厂家、3-维修商、4-保险公司
         * argu 接口调用的参数
         * type 请求类型， false 普通提交 true 上传文本
         */
        return new Promise(function (resolve, reject) {

            pajax.post({
                url: 'restEquipCompanyService/queryEquipCompanySel',
                data: {
                    company_type: new String(type)
                },
                success: function (data) {
                    resolve(data.data);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () {

                },
            });
        })
    },
    //设备管理-详细页:查询设备信息点的历史信息
    queryEquipInfoPointHis: function (equip_id, info_point_code, info, cb) {

        // 获取最后一个参数为回调函数
        cb = arguments[arguments.length - 1];

        info = arguments.length == 4 ? info : void 0;

        pajax.post({
            url: 'restEquipService/queryEquipInfoPointHis',
            data: {
                equip_id: equip_id,
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

                        } else {

                            data.data = data.data.map(function (item) {

                                item.value = _.isArray(item.value) ? item.value.join(',') : item.value;

                                return item;
                            })
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

                }
            },
            error: function () {

            },
            complete: function () {

            },
        });
    },
    // 下载设备名片
    downloadCardInfo: function (equip_id) {

        pajax.downloadByParam("restEquipService/downloadEquipCard", {
            "equip_id": equip_id,
        });
    }
}