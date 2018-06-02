;
(function () {
    v.pushComponent({
        name: 'systemMng',
        data: {
            

            PublicInfoBaseInfo: {}, // 查询的基础数据
            SystemModel: {},
            majorTypeArr: [{
                code: null,
                name: "全部",
                content: []
            }], //专业列表
            systemTypeArr: [{
                code: null,
                name: "全部",
            }], //系统列表
            buildSystemTree: [],
            systemMngCurrentSelector: {
                domain: '',
                system_category: ''
            },
            // 基础信息点
            PublicInfoArr: [{
                info_code: 'system_local_name',
                info_name: '系统本地名称',
                type: 0,
            },
            {
                info_code: 'system_local_id',
                info_name: '系统本地编码',
                type: 0,
            },
            {
                info_code: 'BIMID',
                info_name: 'BIM模型中编码',
                type: 0,
            },
            {
                info_code: 'build_local_name',
                info_name: '所属建筑',
                type: 1,
            },
            {
                info_code: 'domain_name',
                info_name: '所属专业',
                type: 1,
            },
            {
                info_code: 'system_category_name',
                info_name: '所属系统类型',
                type: 1,
            }
            ],
            PublicInfo: [],
            // 技术信息点
            DynamicInfo: [],
            // 信息点总和
            totalPoints: [],
            insertSystemModel: {
                "user_id": "", //员工id-当前操作人id，必须
                "project_id": "", //所属项目id，必须
                "build_id": "", //所属建筑id，必须
                "system_local_id": "", //系统本地编码
                "system_local_name": "", //系统本地名称
                "BIMID": "", //BIM编码
                "system_category": "", //系统类型编码
            },

        },
        computed: {

        },
        filters: {
            filterStrValue: function (value) {

                return _.isPlainObject(value) ? value.name : value;
            }
        },
        methods: {
            // 查询建筑结构树
            queryBuildSystem: function (value) {
                var _that = this;
                controllerAddSystem.queryBuildSystemTree(value || _that.systemMngCurrentSelector, function (list) {

                    _that.buildSystemTree = (list || []).map(function (item) {

                        item.system = item.system.map(function (info) {
                            info.build_id = item.build_id;
                            return info;
                        });

                        return item;
                    });
                });
                showSystemCont()

            },
            _clickQuerySystem: function (system_id) {

                return controllerAddSystem.querySystemPublicInfo(system_id)

            },
            _clickQuerySystemDynamicInfo: function (system_id) {

                return controllerAddSystem.querySystemDynamicInfo(system_id)
            },
            queryPoints: function (item, build_id) {

                var _that = this;

                var system_id = item.system_id;

                _that.SystemModel = item;

                var querySystemPublicInfo = _that._clickQuerySystem(system_id);

                var querySystemDynamicInfo = _that._clickQuerySystemDynamicInfo(system_id);

                querySystemPublicInfo.then(function (list) {

                    _that.PublicInfoBaseInfo = list;
                    var arr = _that.PublicInfoArr.reduce(function (con, item) {

                        var obj = {
                            "info_code": item.info_code, //信息点编码,字段编码
                            "info_name": item.info_name, //信息点名称
                            "unit": "", //单位
                            "data_type": "Str", //value值类型
                            "str_value": list[item.info_code], //信息点值
                            "type": item.type,
                            "cmpt": "font",
                            "name": list[item.info_code], //信息点值
                            "isShow": false,
                        };

                        // 是下拉菜单
                        if (item.type == 1) {
                            obj.cmpt_data = _that.getcmpt_dataByKey(item.info_code);
                        }

                        con.push(obj);

                        return con;
                    }, []);

                    _that.PublicInfo = {
                        tag: '基础',
                        info_Points: arr,
                    };

                    querySystemDynamicInfo.then(function (list) {

                        _that.DynamicInfo = _that.convertDynamicInfo(list);

                        // _that.totalPoints = [{}];

                        _that.totalPoints = [_that.PublicInfo].concat(_that.DynamicInfo);
                        if(_that.totalPoints.length){
                            $(".noDataDiv").hide();
                        }else{
                            $(".noDataDiv").show();
                        }
                        // setTimeout(function () {
                        //     _that.totalPoints = [_that.PublicInfo].concat(_that.DynamicInfo);
                        // }, 0);
                    });
                });

            },
            getcmpt_dataByKey: function (key) {
                var _that = this;
                var Enum = {
                    build_local_name: _that.buildSystemTree.map(function (item) {
                        return {
                            code: item.build_id,
                            name: item.build_name,
                        }
                    }),
                    domain_name: _that.majorTypeArr.filter(function (item) {
                        // 查询对应的系统专业
                        // 过滤全部
                        return !!item.code;

                    }).map(function (item) {
                        return {
                            code: item.code,
                            name: item.name,
                            content: item.content,
                        }
                    }),
                    system_category_name: _that.majorTypeArr.reduce(function (con, item) {

                        // 查询对应的系统的类型
                        if (_that.PublicInfoBaseInfo.domain_name == item.name) {
                            con = item.content;
                        }

                        return con;
                    }, []),
                }

            },
            // 编辑对号
            _realSystemWillSubmit: function (event, item) {
                var _that = this,
                    submitCb, getPoints, info_point_code, type, info_point_code;

                info_point_code = item.info_code;
                window.activeElementVal1 = $(event.target).parent().parent().find(".editInput>div").psel().text;
                window.activeElementVal2 = [];
                $(event.target).parent().parent().find(".editInput>div").each(function(index,element){
                    if($(element).find("span").hasClass("per-checkbox-checked")){
                        activeElementVal2.push(index);
                    }     
                });
                
                //验证系统编码系统名称 BIM编码
                if (info_point_code == "system_local_id" || info_point_code == "system_local_name" || info_point_code == "BIMID") {
                    if (!$("#ides_" + info_point_code).pverifi()) return;
                }

                getPoints = controllerAddSystem.querySystemInfoPointHis.bind(null, _that.SystemModel.system_id, info_point_code, item);

                type = item.type;

                var req = {
                    "system_id": _that.SystemModel.system_id,
                    "info_point_code": info_point_code, //修改的信息点编码，必须
                    "info_point_value": "", //修改的信息点的值，必须
                    "valid_time": "",
                };

                var res = _that.getDynamicInfo("totalPoints", "#cbx_Points_id_");

                req.info_point_value = res[info_point_code];

                if (_.isUndefined(req.info_point_value) && item.cmpt == "pcombobox_normal") {
                    $('#globalnotice').pshow({ text: '请选择' + item.info_name, state: 'failure' });
                    return;
                }

                // 成功回调
                submitCb = function (isNewValue) {
                    req.valid_time = isNewValue.isNewValue;
                    controllerAddSystem.updateSystemInfo(req, (type == 3))
                        .then(function (data) {
       
                            if(JSON.stringify(data) == "{}" || (data[0] === null)){
                                
                                $('#globalnotice').pshow({
                                    text: '保存成功',
                                    state: 'success'
                                });
                                //关掉编辑项
                                // elementFlag.find(".editShow").hide();
                                // elementFlag.find(".contShow").show().find(".cont").html(elementFlag.find(".editShow").find("input").val());
                                

                                elementFlag.find(".editInput>div").precover();

                                item.isShow = false;

                                _that.queryBuildSystem();
                                
                                var system_id = _that.SystemModel.system_id;

                                var querySystemDynamicInfo = _that._clickQuerySystemDynamicInfo(system_id);
                                //不同类型成功动作
                                if(item.cmpt == "pupload_attachmentonly"){    //如果是文件类型
                                    // _that.queryPoints(_that.SystemModel);
                                    
                                    querySystemDynamicInfo.then(function (list) {

                                        var arr = list[0].info_Points;
                
                                        for(var i=0;i<arr.length;i++){
                                            if(arr[i].info_code == item.info_code){
                                                arr[i].att_value[0].url = arr[i].att_value[0].key;
                                                var obj = arr[i].att_value;
                                                item.att_value = item.value = obj;
                                                break;
                                            }
                                        }

                                    });

                                }else if(item.cmpt == "pswitch_checkbox"){ // 多选类型
                                    var arr = [];
                                    activeElementVal2.map(function(value,index){
                                        arr.push(value+1);
                                    });
                                    item.str_value = arr;
                                    item.value = arr.slice(0);
                                    var str = "";
                                    for(var i=0;i<activeElementVal2.length;i++){
                                        str += item.cmpt_data[activeElementVal2[i]].name + ",";
                                        if(i == (activeElementVal2.length - 1)){
                                            str = str.slice(0,-1);
                                        }
                                    }
                                    item.name = str;

                                }else if(item.cmpt == "pcombobox_normal"){ // 单选类型 
    
                                    for(var i=0;i<item.cmpt_data.length;i++){
                                        item.cmpt_data[i].isSelected = false;
                                        if(item.cmpt_data[i].name == activeElementVal1){
                                            item.name = item.cmpt_data[i];
                                            item.cmpt_data[i].isSelected = true;
                                            item.str_value = item.cmpt_data[i].code;
                                            item.value = item.str_value;
                                        }
                                    }
                                    
                                }else if(item.type == 0 || item.unit.length > 0){  // 字符串类型
                                    
                                    item.name = item.str_value+item.unit;
                                    if(item.value !== undefined){
                                        item.value = item.str_value;
                                    }
                                    
                                }          
                            }

                        }, function () {
                            _that.queryPoints(_that.SystemModel);
                            $('#globalnotice').pshow({
                                text: '保存失败',
                                state: 'failure'
                            });
                        })
                };

                // 显示提交弹窗
                _that.submitTip(event, submitCb, getPoints);

            },
            // 增加验证的重复过程
            _clickSystemWillSubmit: function (event, item) {


                var key = item.info_code,
                    str = item.str_value,
                    _that = this;

                window.elementFlag = $(event.target).parent().parent();
                if (key == "system_local_name") {

                    controllerAddSystem.verifySystemName({
                        build_id: v.instance.SystemModel.build_id,
                        system_id: v.instance.PublicInfoBaseInfo.system_id,
                        system_local_name: str,
                    }).then(function (data) {

                        if (!data.can_use) {

                            $("#globalnotice").pshow({
                                text: "系统名称重复",
                                state: "failure"
                            });
                        } else {
                            _that._realSystemWillSubmit(event, item);
                        }
                    })

                } else if (key == "system_local_id") {

                    // 验证不可重复
                    controllerAddSystem.verifySystemLocalId({
                        system_id: v.instance.PublicInfoBaseInfo.system_id,
                        system_local_id: str,
                    }).then(function (data) {

                        if (!data.can_use) {

                            $("#globalnotice").pshow({
                                text: "系统本地编码重复",
                                state: "failure"
                            });
                        } else {
                            _that._realSystemWillSubmit(event, item);
                        }
                    })

                } else if (key == "BIMID") {

                    // 验证不可重复
                    controllerAddSystem.verifySystemBimId({
                        system_id: v.instance.PublicInfoBaseInfo.system_id,
                        BIMID: str,
                    }).then(function (data) {

                        if (!data.can_use) {
                            $("#globalnotice").pshow({
                                text: "BIM编码重复",
                                state: "failure"
                            });
                        } else {
                            _that._realSystemWillSubmit(event, item);
                        }
                    })

                } else {
                    this._realSystemWillSubmit(event, item);
                }

            },
             // 编辑叉号
            _clickSystemWillCancel: function (event, item) {
                var _that = this;
                window.elementFlag = $(event.target).parent().parent();
                var cancelCb = function () {

                    // _that.queryPoints(_that.SystemModel);

                    // 清空对应的输入框
                    var val_system_local_id = $("#ides_system_local_id").pval();
                    var val_system_local_name = $("#ides_system_local_name").pval();
                    var val_BIMID = $("#ides_BIMID").pval();

                    $("#ides_system_local_id").precover();
                    $("#ides_system_local_name").precover();
                    $("#ides_BIMID").precover();

                    $("#ides_system_local_id").pval(val_system_local_id);
                    $("#ides_system_local_name").pval(val_system_local_name);
                    $("#ides_BIMID").pval(val_BIMID);

                    item.isShow = false;
                   
                    if(item.cmpt == "pupload_attachmentonly"){    //如果是文件类型
                        
                        elementFlag.find(".editInput>div").precover();

                    }else if(item.cmpt == "pswitch_checkbox"){ // 多选类型

                        elementFlag.find(".editInput>div").each(function(index,element){
                            if(item.str_value.indexOf(index+1+"") != -1){
                                $(element).find(".per-checkbox_input").addClass("per-checkbox-checked");
                            }else{
                                $(element).find(".per-checkbox_input").removeClass("per-checkbox-checked");
                            }
                        })

                    }else if(item.cmpt == "pcombobox_normal"){ // 单选类型 

                        
                    }else if(item.type == 0 || item.unit.length > 0){  // 字符串类型
                        
                        if(item.unit.length > 0){
                            item.str_value = item.name.slice(0,-1*item.unit.length);
                        }else{
                            item.str_value = item.name.slice(0);
                        }
                           
                    }  
       
                    // $(".editShow").hide();

                    // $(".addSystemCont .rightCont .detailFloat .detailItem .contShow").show();

                };
 
                // 显示取消弹窗
                _that.cancelTip(event, cancelCb);
            }
        },
        watch: {
            systemMngCurrentSelector: function (newValue, oldValue) {
                var _that = this;

                for (var key in newValue) {
                    if (newValue.hasOwnProperty(key)) {
                        var newElement = newValue[key];
                        var oldElement = oldValue[key];

                        if (newElement != oldElement) {
                            // 检查到查询值不同的时候重新查询列表中的值
                            setTimeout(function () {

                                _that.queryBuildSystem(newValue);
                            }, 0);

                            break;
                        }
                    }
                }
            }
        },
        beforeMount: function () {
            var _that = this;

            //绑定专业信息
            controllerAddSystem.queryAllEquipCategory(function (list) {
                _that.majorTypeArr = list;
            });

            _that.queryBuildSystem();

            // 初始化弹窗
            _that.layer = new layerModel();

            //默认选择全部专业
            setTimeout(function () {
                $("#cbx_id_domin").psel(0);
            }, 0);
        }
    })


    v.pushComponent({
        name: 'addSystem',
        data: {
            clickAble: true,
            SystemPoints: [], // 动态信息列表
            SystemScrollBase: [{
                title: "基础",
                id: 'base',
                isSelected: true,
                top: 60,
            }],
            SystemScrollList: [{
                title: "基础",
                id: 'base',
                isSelected: true,
                top: 60,
            }],
            InsertSystemBuildArray: [], // 建筑列表
            InsertSystemAllEquipCategory: [], // 专业类表
            InsertSystemModel: {
                "build_id": "", //所属建筑id，必须
                "system_local_id": "", //系统本地编码
                "system_local_name": "", //系统本地名称
                "BIMID": "", //BIM编码
                "system_category": "", //系统类型编码
                EList: [] // 设备类型集合
            },

            systemCategoryStorage:'',
            addSystemKey: ptool.produceId(),
            isShowAddSystem: false,
        },
        computed: {

        },
        filters: {

        },
        methods: {

            _clickInsertSystem: function (cb) {
                if (this.clickAble) {
                    this.clickAble = false;
                    var _that = this;
                    setTimeout(function(){
                        _that.clickAble = true;
                    }, 2000);

                

                if (!$("#" + _that.addSystemKey + "system_local_name").pverifi()) {

                    if (!v.instance.InsertSystemModel.system_local_name) {
                        $("#globalnotice").pshow({
                            text: "系统名称不可为空",
                            state: "failure"
                        });
                    }

                    $("#globalnotice").pshow({
                        text: v.instance.InsertSystemModel.system_local_name ? "系统名称填写错误" : "系统名称不可为空",
                        state: "failure"
                    });
                    return;
                }
                if (!$("#" + _that.addSystemKey + "system_local_id").pverifi()) {
                    $("#globalnotice").pshow({
                        text: v.instance.InsertSystemModel.system_local_id ? "系统本地编码填写错误" : "系统本地编码不可为空",
                        state: "failure"
                    });
                    return;
                }
                if (!$("#" + _that.addSystemKey + "BIMID").pverifi()) {
                    $("#globalnotice").pshow({
                        text: v.instance.InsertSystemModel.BIMID ? "BIM模型中编码填写错误" : "BIM模型中编码不可为空",
                        state: "failure"
                    });
                    return;
                }


                // 基础数据
                var removeKeys = ['build_id',
                    'system_local_id',
                    'system_local_name',
                    'BIMID',
                    'system_category'
                ];
                var base = removeKeys.reduce(function (con, key) {
                    con[key] = _that.InsertSystemModel[key];
                    return con;
                }, {});


                if (!base["build_id"]) {
                    $("#globalnotice").pshow({
                        text: "所属建筑不可为空",
                        state: "failure"
                    });
                    return;
                }
                if (!base["system_category"]) {
                    $("#globalnotice").pshow({
                        text: "系统类型不可为空",
                        state: "failure"
                    });
                    return;
                }

                // 动态数据
                var res = _that.getDynamicInfo("SystemPoints", "#cbx_Points_id_");

                var req = Object.assign({}, res, base);

                // controllerAddSystem.addSystem(req).then(function () {
                //     hideAddSystem();

                //     if (_.isFunction(cb)) cb();
                // })

                /**
                 * 暂时取消重复限制
                 */

                // 验证重复验证
                controllerAddSystem.verifySystemName({
                    build_id: req.build_id,
                    system_local_name: req.system_local_name,
                }).then(function (data) {

                    if (!data.can_use) {

                        $("#globalnotice").pshow({
                            text: "系统名称重复",
                            state: "failure"
                        });

                    } else {

                        return controllerAddSystem.verifySystemLocalId({
                            system_local_id: req.system_local_id,
                        })

                    }
                }).then(function (data) {

                    if (!data.can_use) {

                        $("#globalnotice").pshow({
                            text: "系统本地编码重复",
                            state: "failure"
                        });

                    } else {

                        if (req.BIMID) {
                            return controllerAddSystem.verifySystemBimId({
                                BIMID: req.BIMID,
                            })
                        } else {

                            return new Promise(function (resolve) {
                                resolve({
                                    can_use: true
                                });
                            })
                        }

                    }
                }).then(function (data) {

                    if (!data.can_use) {

                        $("#globalnotice").pshow({
                            text: "BIMID编码重复",
                            state: "failure"
                        });

                    } else {

                        controllerAddSystem.addSystem(req).then(function () {
                            hideAddSystem();

                            if (_.isFunction(cb)) cb();
                        })

                    }

                })
                }

            },
            querySystemDynamicInfoForAdd: function (system_category) {

                var _that = this;
                /**
                 * 获取创建系统需要的动态信息
                 */
                controllerAddSystem.querySystemDynamicInfoForAdd(system_category).then(function (list) {

                    if (!list.length) {
                        _that.SystemPoints = {};
                        $("#cbx_id_system").psel(1);
                    }

                    _that.SystemPoints = _that.convertDynamicInfo(list);;
                })
            },
            convertDynamicInfo: function (list) {

                /**
                 * 范围框筛选值转换
                 * @param {信息点实例} info
                 */
                function arr2str(info) {

                    info.str_arr_value = info.value || info.str_value || info.str_arr_value || [];
                    char = info.unit || '~'

                    //转换成为长度为2 的数组
                    info.str_arr_value = _.range(2).map(function (index) {
                        return info.str_arr_value[index] || "";
                    });

                    if (info.str_arr_value[0]) {

                        if (info.unit) {

                            return info.str_arr_value.map(function (str) {

                                return str + info.unit;
                            }).join('~');
                        } else {

                            return info.str_arr_value.join('~');
                        }

                    } else {

                        return "";
                    }
                }

                if (_.isArray(list)) {
                    return list.map(function (item, index) {

                        item.isSelected = index == 0;

                        item.info_Points = item.info_Points.map(function (info) {

                            info.isShow = false;

                            /**
                             * type 0 普通字符串 文本框
                             *      1 普通下拉选择框
                             *      2 多选按钮
                             *      3 附件类型
                             *      4 有单位文本框
                             * 根据 data_type 和 cmpt_data 判断显示的类型
                             */
                            if (info.cmpt == "ptext_text") {
                                //手工填写-单个-数字-无单位
                                info.name = info.value || info.str_value || "";

                            } else if (info.cmpt == "ptext_unit") {
                                //手工填写-单个-数字-有单位
                                info.name = (info.value || info.str_value || "") ? ((info.value || info.str_value || "") + info.unit) : '';

                            } else if (info.cmpt == "ptext_numscope") {
                                //手工填写-单个-数字范围-无单位

                                info.name = arr2str(info);

                            } else if (info.cmpt == "ptext_unitnumscope") {
                                //手工填写-单个-数字范围-有单位
                                info.str_arr_value = info.value || info.str_arr_value || [];

                                info.name = arr2str(info);

                            } else if (info.cmpt == "ptext_textarea") {
                                //手工填写-单个-文本
                                info.name = info.value || info.str_value || "";;

                            } else if (info.cmpt == "ptime_timeymdhm") {
                                //手工填写-单个-日期时间值
                                info.name = info.value || info.str_value || "";;

                            } else if (info.cmpt == "ptime_timeymdhmscope") {
                                //手工填写-单个-日期时间段
                                info.name = info.value || info.str_value;

                            } else if (info.cmpt == "ptime_timeymd") {
                                //手工填写-单个-日期值
                                info.name = info.value || info.str_value || "";;

                            } else if (info.cmpt == "ptime_timeymdscope") {
                                //手工填写-单个-日期段

                                info.name = arr2str(info);;

                            } else if (info.cmpt == "ptime_timehm") {
                                //手工填写-单个-时间值
                                info.name = info.value || info.str_value || "";;

                            } else if (info.cmpt == "ptime_timehmscope") {
                                //手工填写-单个-时间段
                                info.name = arr2str(info);

                            } else if (info.cmpt == "pcombobox_normal") {

                                info.cmpt_data = info.cmpt_data.map(function (item) {
                                    // 判断是否有选中的项
                                    item.isSelected = new String(item.code) == (info.value || info.str_value || "");

                                    return item;
                                })

                                //字典选择-单个-单选
                                // Str 将字符串数组修改为单个个对应的实体对象
                                info.name = info.cmpt_data.filter(function (item) {

                                    //过滤出选中的项
                                    return item.isSelected;
                                })[0] || {};

                                // info.name = info.cmpt_data.filter(function (item) {
                                //     return new String(item.code) == (info.value || info.str_value || "");
                                // })[0] || {};

                            } else if (info.cmpt == "pswitch_checkbox") {

                                //转换成为长度为2 的数组
                                info.cmpt_data = info.cmpt_data.map(function (item) {

                                    item.isChecked = (info.value || (_.isArray(info.str_value) ? info.str_value : []) || []).indexOf(item.code) != -1;
                                    return item;
                                });

                                info.name = info.cmpt_data.filter(function (item) {
                                    return item.isChecked;
                                }).map(function (item) {

                                    return item.name;
                                }).join(',');

                            } else if (info.cmpt == "pupload_attachmentonly") {

                                info.att_value = info.att_value || [];

                                //上传-单个文件
                                // 将附件内容全部转换成为对应的Url 值
                                info.att_value = _.isArray(info.value) ? info.value : _.isArray(info.att_value) ? info.att_value : _.isArray(info.str_value) ? info.str_value : [];

                                info.att_value = info.att_value.map(function (item) {
                                    item.url = item.type == 1 ? item.url : item.key;
                                    return item;
                                });

                            }
                            return info;
                        });

                        return item;
                    });
                } else {
                    return [];
                }
            },
            getDynamicInfo: function (vkey, el, type) {

                var _that = this;
                res = {},
                    list = _that[vkey];

                // 获取日历控件值
                var getTimeContro = function (el, code, type) {
                    var obj = $(el + code).psel();

                    if (obj) {
                        if (obj.startTime) {

                            return obj.startTime;

                            var date = new Date(obj.startTime);

                        }
                    }
                }

                // tag 循环
                return list.reduce(function (con, item) {
                    // points 循环
                    return item.info_Points.reduce(function (con, info) {

                        // 文字直接获取
                        if (info.cmpt == "font" || info.cmpt == "ptext_text" || info.cmpt == "ptext_unit" || info.cmpt == "ptext_textarea") {

                            con[info.info_code] = info.str_value;

                        } else if (info.cmpt == "ptext_numscope" || info.cmpt == "ptext_unitnumscope") {
                            //范围文字
                            con[info.info_code] = info.str_arr_value;

                        } else if (info.cmpt == "ptime_timeymdhm" || info.cmpt == "ptime_timeymdhmscope" || info.cmpt == "ptime_timeymd" || info.cmpt == "ptime_timehm" || info.cmpt == "ptime_timehm") {
                            // 单个时间控件
                            con[info.info_code] = getTimeContro(el, info.info_code, info.cmpt);

                        } else if (info.cmpt == "ptime_timeymdscope" || info.cmpt == "ptime_timehmscope") {
                            // 时间范围控件
                            con[info.info_code] = [getTimeContro(el, info.info_code + '0', info.cmpt), getTimeContro(el, info.info_code + '1', info.cmpt)];

                        } else if (info.cmpt == "pcombobox_normal") {

                            // 下滑菜单
                            var text = getEquipDynamicInfoBykey(el, info.info_code, 1, info);
                            if (text) con[info.info_code] = text;
                        } else if (info.cmpt == "pswitch_checkbox") {

                            // 复选框
                            con[info.info_code] = info.cmpt_data.filter(function (item) {
                                return item.isChecked;
                            }).map(function (item) {
                                return item.code;
                            });

                        } else if (info.cmpt == "pupload_attachmentonly") {
                            // 上传附件
                            var attachments = getEquipDynamicInfoBykey(el, info.info_code, 4, info);

                            con[info.info_code] = attachments.map(function (attachment) {

                                attachment.toPro = 'key';
                                attachment.multiFile = false;

                                return {
                                    "type": "2",
                                    "name": attachment.fileName,
                                    "key": "",
                                    "attachments": attachments,
                                };

                            });
                        }

                        // 为空的范围属性全部删除
                        if (_.isArray(con[info.info_code]) && con[info.info_code].length == 2 && !con[info.info_code].join('').length) {
                            delete con[info.info_code];
                        }

                        return con;

                    }, con)
                }, {});

            },
            comPsel: function (info,from) {

                if(from == 'system'){
                    // info.str_value = info.name;
                }else if(from == 'equip'){
                    info.str_value = info.str_value;
                }
                
                if (info.cmpt == "pcombobox_normal") {

                    var index = info.cmpt_data.reduce(function (con, item, index) {

                        if (con != -1) return con;

                        if (item.isSelected) return index;

                        return con;
                    }, -1);

                    if (index >= 0) {

                        $("#cbx_Points_id_" + info.info_code).psel(index);
                    } else {

                        $("#cbx_Points_id_" + info.info_code).precover();
                    }
                }

            }
        },
        watch: {
            InsertSystemModel: function (n, o) {

                var _that = this;
                // 设备编码被修改
                if (n.system_category != o.system_category) {
                    if(n.system_category !=''){
                        _that.querySystemDynamicInfoForAdd(n.system_category);
                    }
                }

            },
            SystemPoints: function (newValue) {
                var _that = this;
                _that.SystemScrollList = _that.SystemScrollBase.concat(newValue.map(function (item, index) {
                    return {
                        title: item.tag,
                        id: "tag" + index,
                        isSelected: false,
                        top: (_that.SystemScrollBase.length * 120 - 60) + ((index + 1) * 120),
                    }
                }));
            }
        },
        beforeMount: function () {
            var _that = this;

            // 获取两个编辑的下拉框编辑时候的内容
            /**
             * 获取建筑列表
             */
            controllerAddSystem.queryBuild().then(function (list) {
                _that.InsertSystemBuildArray = list;
            });

            /**
             * 绑定所属专业类型
             */
            controllerAddSystem.queryAllEquipCategoryPro().then(function (list) {
                _that.InsertSystemAllEquipCategory = list;
            });
            //监听
            this.$nextTick(function () {
                //新建系统页
                $("#addsystems_contentView")[0].addEventListener('scroll', function(){
                    _that.onScrollPub("#addsystems_contentView",".addsystems_verticalView",".addsystems_verticalAxes","#addsystems_contentBox",_that.SystemScrollList)
                });
            })
        }
    })
})();