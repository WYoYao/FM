var ViewError = function () {
    return {
        isRepeat: false,
        isSpace: false,
        isDescForepartSpace: false,
        verify: [],
        sopeds: [],
    };
}

var convertEnum = {
    plan_name: "group_plan_name",
}

v.pushComponent({
    name: "createPlan",
    data: {
        // 具体操作内容
        GeneralDictByKey: [],
        // 工单状态类型
        WorkOrderType: [],
        //  基础信息
        addWoPlan: {},
        //  事项集合
        matters: [{
            // 事项名称
            matter_name: "",
            desc_objs: [],
            desc_sops: [], // Sop 列表
            desc_works: [], // 新建工作内容
            // 对象描述
            desc_forepart: "", //  @ 输入框文本
            desc_aftpart: "", //  # 输入框文本  
            required_control: [],
        }],
        //  事项的错误信息
        mattersViews: [
            new ViewError(),
        ],
        // 预览事项
        WoMattersPreview: {},
        // 是否被引用
        isquote: false,
        // 是否编辑
        isedit: false,
        // 是否是项目版
        isterm: false,
        // 是否是预览页面
        PreView: false,
        // 根据大类查询出来的结果
        ObjectByClassId: {},
        ObjectByClass: [],
        str: "",
        req: {},
        // 坑位信息
        WoTypeListAll: [],
        // 下发的参数
        toProjectArgu: {
            "plan_freq_type": "1",
            "instantiated_object_flag": "1",

            "group_plan_id": "", //集团计划id，必须
            "project_ids": [], //项目计划id集合，必须
            "plan_start_type": "2", //计划开始类型,1-发布成功后第二天生效，2-指定时间 ,必须
            "plan_start_time": new Date(+new Date() + (24 * 60 * 60000)).format('yyyyMMdd000000'), //计划开始时间,yyyyMMdd+"000000"
            "plan_end_time": new Date(+new Date((new Date().getFullYear() + 1) + "/01/01 00:00:00") - (24 * 60 * 60000)).format('yyyyMMdd235959') //计划结束时间,yyyyMMdd+"235959"，空值时代表一直有效
        },
        getIssueProjectListArgu: {
            group_plan_id: "JTJH6a93466d7bb7465c8f893d2ba3e83b7e"
        },
        IssueProjectList: [],
    },
    methods: {
        //获取日期格式
        getDateStringByType: function (item) {
            if (item.cycle == 'y') {
                return fill(item.time_month, 2) + "." + fill(item.time_day, 2) + " " + fill(item.time_hour, 2) + ":" + fill(item.time_minute, 2);
            } else if (item.cycle == 'q') {
                return [null, '第一个月', '第二个月', '第三个月'][item.time_season] + " " + fill(item.time_day, 2) + " " + fill(item.time_hour, 2) + ":" + fill(item.time_minute, 2);
            } else if (item.cycle == 'w') {
                return [null, '周一', '周二', '周三', '周四', '周五', '周六', '周日'][item.time_week] + " " + fill(item.time_hour, 2) + ":" + fill(item.time_minute, 2);
            } else if (item.cycle == 'm') {
                return fill(item.time_day, 2) + " " + fill(item.time_hour, 2) + ":" + fill(item.time_minute, 2);
            } else if (item.cycle == 'd') {
                return fill(item.time_hour, 2) + ":" + fill(item.time_minute, 2);
            }
            return "";
        },
        // 将相对设置转换成为对应的精确设置
        convertAddWoPlan: function (addWoPlan) {
            // 周期设置为年
            addWoPlan.freq_cycle = "y";

            var dayTime = 24 * 60 * 60 * 1000;

            // 时间范围
            var range = Math.floor(
                (yyyyMMdd2Date(addWoPlan.plan_end_time) - yyyyMMdd2Date(addWoPlan.plan_start_time)) / dayTime / addWoPlan.freq_time_span.num
            );

            var startTime = addWoPlan.plan_start_time,
                endTime = addWoPlan.plan_end_time,
                num = parseInt(addWoPlan.freq_time_span.num),
                hour = parseInt(addWoPlan.freq_time_span.time_hour),
                minute = parseInt(addWoPlan.freq_time_span.time_minute),
                continuer = parseInt(addWoPlan.freq_time_span.continue);

            //  生成对应的精确数组
            addWoPlan.freq_times = _.range(range).map(function (index) {

                return {
                    start_time: {
                        cycle: "y",
                        time_day: addDate(yyyyMMdd2Date(startTime), index * num).format('MMdd'), //y("0612"-6月12日)，q("312"-第三个月12号，)，m("01"-1号)，w("1"-1号，周一)，d("")
                        time_hour: hour, //10时
                        time_minute: minute, //15分
                    },
                    end_time: {
                        cycle: "y",
                        time_day: addDate(yyyyMMdd2Date(startTime), index * num, hour + continuer).format('MMdd'), //y("0612"-6月12日)，q("312"-第三个月12号，)，m("01"-1号)，w("1"-1号，周一)，d("")
                        time_hour: addDate(yyyyMMdd2Date(startTime), index * num, hour + continuer).getHours().toString(), //10时
                        time_minute: minute, //15分
                    }
                }
            })

            addWoPlan.plan_freq_type = "1";
            addWoPlan.freq_cycle = "y";
            addWoPlan.freq_num = addWoPlan.freq_times.length;

            return addWoPlan;
        },
        // 所有在总集合   item 用于查询的父类 arr返回的数组
        setConfirm_result: function (list, item, arr) {
            // 隐藏对应显示数组
            item.isshow = false;
            var obj = !_.isUndefined(item) ? _.cloneDeep(item) : {};
            var index = list.indexOf(item);
            var len = _.filter(list, {
                parent_id: item.obj_id
            }).length;
            // 当前类后面替换对应返回的数组
            list.splice.bind(list, index + 1, len).apply(list, arr.map(function (info) {
                return Object.assign({}, obj, info);
            }))
            // [].splice.apply(list,index+1,len)
            // list.splice(index+1, len, arr.map(function (info) {
            //     return Object.assign({}, obj, info);
            // }))
            // 隐藏对应显示数组
            item.isshow = false;
        },
        // 获取对象
        getObj: function (arr) {
            this.str = "";
        },
        //  提交信息
        commit: function () {
            var _that = this;

            _that.req = {};

            // 获取基本信息输入框验证
            if (!_that.$refs.baseinfomation.canUse()) {
                return;
            }

            // 验证时间重叠
            if (_that.isterm) {
                if (!_that.valiteStartEndTime(_that.$refs.baseinfomation.argu())) return;
            }

            // next();

            // return
            // debugger;
            if (_that.isterm) {

                controller.verifyWoPlanName({
                    plan_name: _that.$refs.baseinfomation.argu().plan_name,
                    plan_id: _that.$refs.baseinfomation.argu().plan_id,
                }).then(function (res) {
                    if (res.verify) {
                        next()
                    } else {
                        $("#globalnotice").pshow({
                            text: '计划名称与当前已有计划重复',
                            state: "failure"
                        });
                        return;
                    }
                })


            } else {
                // 如果不存在 计划id 则为新建
                controller.verifyGroupPlanName({
                    group_plan_name: _that.$refs.baseinfomation.argu().plan_name,
                    group_plan_id: _that.$refs.baseinfomation.argu().group_plan_id ? _that.$refs.baseinfomation.argu().group_plan_id : ""
                }).then(function (res) {
                    if (res.verify) {
                        next()
                    } else {
                        $("#globalnotice").pshow({
                            text: '计划名称与当前已有计划重复',
                            state: "failure"
                        });
                        return;
                    }
                })
            }

            function next() {
                _that.req = Object.assign({}, _that.req, _that.$refs.baseinfomation.argu())

                if (!_that.matters.length) {
                    $("#globalnotice").pshow({
                        text: '工作事项不能为空',
                        state: "failure"
                    });
                    return;
                }



                // 重名的验证
                _that.mattersViews = _that.mattersViews.map(function (item) {
                    item.isRepeat = (_.uniq(_.map(_that.matters, 'matter_name')).length != _that.matters.length);
                    return item;
                });

                // matters 验证
                if (_.filter(_that.mattersViews, {
                        isRepeat: true
                    }).length) return;

                // 验证名称非空
                _that.mattersViews.forEach(function (item, index) {
                    item.isSpace = !_that.matters[index].matter_name.length;
                    item.isDescForepartSpace = !_that.matters[index].desc_forepart.length && !_that.matters[index].desc_aftpart.length && !_that.matters[index].desc_works.length;
                })

                // 验证内容为空
                if (_.filter(_that.mattersViews, {
                        isSpace: true
                    }).length) return;
                if (_.filter(_that.mattersViews, {
                        isDescForepartSpace: true
                    }).length) return;

                // 验证重复
                if (_.filter(_that.mattersViews, {
                        isRepeat: true
                    }).length) return;



                // 验证名称是否重复
                // controller.queryGroupPlanList({
                //     order_type: "",
                //     valid: ""
                // }).then(function (res) {
                //     if (_.filter(res, { group_plan_name: _that.req.plan_name }).length) {

                //     }
                // });


                // 默认验证通过
                var bool = true;
                //  验证多个关系是否不匹配
                // 并行发送请求多个事项同时验证
                Promise.all(_that.matters.map(function (item) {

                    // 验证是否匹配
                    // if (item.desc_objs.length && item.desc_sops.length) {

                    //     // 对象与SOP 匹配验证
                    //     return controller.verifyObjectAndSop({
                    //         objs: item.desc_objs.map(function (item) {
                    //             return {
                    //                 obj_id: item.obj_id,
                    //                 obj_name: item.obj_name,
                    //             }
                    //         }),
                    //         sop_ids: _.map(item.desc_sops, "sop_id")
                    //     })
                    // } else {
                    //     return new Promise(function (resolve) {
                    //         setTimeout(function () {
                    //             resolve([]);
                    //         }, 0);
                    //     })
                    // }

                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve([]);
                        }, 0);
                    })

                })).then(function (res) {
                    // 把原来的错误的状态替换的新的错误信息中
                    res.forEach(function (item, index) {

                        item = item.map(function (info) {
                            // 有之前的返回之前的，没有之前的返回新的
                            var find = _.find(_that.mattersViews[index].verify, {
                                obj_name: info.obj_name,
                                sop_name: info.sop_name
                            });
                            return find ? find : info;
                        })

                        _that.mattersViews[index].verify = item;
                    });


                    bool = !_that.mattersViews.map(function (item) {
                        return _.filter(item.verify, {
                            selected: false
                        }).length
                    }).reduce(function (con, num) {
                        return con + num;
                    }, 0);

                    // 验证替换后的错误信息是否全部被忽略

                    console.log("已经全部被忽略,可以提交预览");
                    //  验证是否被销毁
                    // _that.matters
                    createPlan_controller.querySopListForSel().then(function (data) {

                        var res = data.content;
                        var con = true;
                        // 验证所有的 SOP 都在直接提交
                        _that.matters.forEach(function (item, index) {


                            //  循环每个matter 的 desc_sop 判断是否存在当前SOP列表中
                            item.desc_sops.forEach(function (info) {

                                var bak = con;

                                var bol = !!_.filter(res, {
                                    sop_id: info.sop_id
                                }).length;

                                // 再从忽略列表中查找
                                if (!bol) {

                                    if (!!_.filter(_that.mattersViews[index].sopeds, {
                                            sop_id: info.sop_id
                                        }).length) {

                                        // 在原来的列表中
                                        var bol = !!_.filter(_that.mattersViews[index].sopeds, {
                                            sop_id: info.sop_id,
                                            selected: true
                                        }).length;
                                    } else {

                                        // 不在原来的列表中
                                        // 已经保存了添加到报废列表中
                                        if (!bol) {
                                            var bak = JSON.parse(JSON.stringify(info));
                                            bak.selected = false;
                                            _that.mattersViews[index].sopeds.push(bak);
                                        }
                                    }
                                }
                                if (!bak) {
                                    con = false
                                }
                            })

                        });

                        if (con && bool) {

                            _that.matters = _that.matters.map(function (matter) {
                                matter.description = (matter.desc_forepart ? matter.desc_forepart : '') + (matter.desc_aftpart ? matter.desc_aftpart : '') + (matter.desc_works_desc ? matter.desc_works_desc : '');
                                return matter;
                            })

                            loadding.set("Preview");

                            var getWoMattersPreviewPromise;

                            // 计划管理中的编辑 查询之前的内容
                            if (_that.isterm && v.instance.base().argu().plan_id) {
                                getWoMattersPreviewPromise = new Promise(function (resolve) {
                                    setTimeout(function () {
                                        resolve(v.instance.base().argu());
                                    }, 0)
                                });
                            } else if (_that.isterm) {
                                getWoMattersPreviewPromise = createPlan_controller.getWoMattersPreview({
                                    // order_type: _that.$refs.baseinfomation.addWoPlan.order_type,
                                    draft_matters: _that.matters,
                                });
                            } else {
                                getWoMattersPreviewPromise = createPlan_controller.getWoMattersPreviewGroup({
                                    draft_matters: _that.matters,
                                });
                            }

                            // var getWoMattersPreviewPromise = _that.isterm ?
                            //     createPlan_controller.getWoMattersPreview({
                            //         // order_type: _that.$refs.baseinfomation.addWoPlan.order_type,
                            //         draft_matters: _that.matters,
                            //     })
                            //     :
                            //     createPlan_controller.getWoMattersPreviewGroup({
                            //         draft_matters: _that.matters,
                            //     });

                            getWoMattersPreviewPromise.then(function (res) {
                                console.log("可以执行保存了");
                                // 保存预览时候数据
                                // _that.WoMattersPreview = res.published_matters;
                                _that.WoMattersPreview = res.published_matters.map(function (item) {

                                    item.matter_steps = item.matter_steps.map(function (info) {

                                        if (info.step_type == "5") {
                                            info.step_content = info.step_content.map(function (x) {

                                                x.confirm_result.forEach(function (m) {
                                                    m.isshow = false;
                                                })

                                                // x.class_confirm_result = x.confirm_result ? JSON.parse(JSON.stringify(x.confirm_result)).map(function (y) {
                                                //     y.isshow = false;
                                                //     return y;
                                                // }) : [];

                                                return x;
                                            })
                                        }
                                        return info;
                                    });
                                    return item;
                                });

                                _that.PreView = true;

                                // 保存matters
                                _that.req.draft_matters = JSON.parse(JSON.stringify(_that.matters));

                                if (_that.isterm) {
                                    // 如果是项目版
                                    _that.req.required_tools = res.required_tools;
                                    _that.req.summary = res.summary;
                                    _that.req.domain_list = res.domain_list;
                                    _that.req.published_matters = res.published_matters;
                                }

                            }).finally(function () {
                                loadding.remove("Preview");
                            })
                        }
                    })

                })
            }
        },
        //  查询大类下的对象实例
        queryObjectByClass: function (obj_id, obj_type) {

            var _that = this;

            createPlan_controller.queryObjectByClass({
                obj_id: obj_id,
                obj_type: obj_type,
            }).then(function (res) {
                _that.ObjectByClass = res;
            })
        },
        // 获取父级的路径
        getparent_names: function (arr) {
            return arr.map(function (parent) {

                return parent.parent_names.join('-');
            }).join('');
        },
        // 选择实例的点击事件
        handder_click: function (confirm_result, item) {
            this.ObjectByClassId = void 0;
            confirm_result.obj_id = item.obj_id;
            confirm_result.obj_name = item.obj_name;
            confirm_result.obj_type = item.obj_type;
        },
        base: function () {
            return this.$refs.baseinfomation;
        },
        // 根据不同的条件做不同的背景
        createPlan: function () {

            var _that = this;

            var cb = function () {

                // 执行成功的回调
                window.createPlanCallback();
                // 释放全局的回调函数
                window.createPlanCallback = void 0;
            }

            var argu = _.cloneDeep(_that.req);

            if (argu.plan_freq_type == 3) {
                argu.freq_cycle = "y";
            }

            argu.instantiated_object_flag = argu.instantiated_object_flag.toString();
            argu.ahead_create_time = +argu.ahead_create_time;
            argu.suggest_executor_num = +argu.suggest_executor_num;

            argu.draft_matters = _.map(argu.draft_matters, function (item) {
                /**
                 * 对象
                 */
                item.desc_objs = _.map(item.desc_objs, function (info) {
                    return {
                        obj_id: info.obj_id,
                        obj_name: info.obj_name,
                    }
                })

                /**
                 * SOP
                 */
                item.desc_sops = _.map(item.desc_sops, function (info) {
                    return {
                        sop_id: info.sop_id,
                        sop_name: info.sop_name,
                        version: info.version,
                    }
                })

                return item;
            })

            if (_that.isterm) {

                if (_that.addWoPlan.plan_freq_type == 3) {
                    _that.addWoPlan = _that.convertAddWoPlan(_that.addWoPlan)
                };

                // 项目版处理
                argu = Object.assign({}, {
                    plan_from: _that.isquote ? "1" : "2", // 是否引用
                    group_plan_id: _that.isquote ? _that.cache.argu.addWoPlan.group_plan_id : "", // 引用集团ID
                    published_matters: _that.WoMattersPreview,
                }, argu);

                /**
                 * 如果是项目中 且不全部实例化对象
                 */
                if (_that.isterm && _that.base().addWoPlan.instantiated_object_flag != 1) {
                    var bool = true;
                    argu.published_matters.map(function (item) {
                        return item.matter_steps;
                    }).reduce(function (con, item) {
                        return con.concat(item);
                    }, []).filter(function (item) {
                        return item.step_type == 5;
                    }).map(function (item) {
                        return item.step_content;
                    }).reduce(function (con, item) {
                        return con.concat(item);
                    }, []).map(function (item) {
                        return item.confirm_result;
                    }).forEach(function (list) {
                        _.filter(list, function (m) {
                            return m.obj_type == 'system_class' || m.obj_type == 'equip_class' || m.obj_type == 'space_class';
                        }).forEach(function (i) {
                            bool = bool ? !!_.filter(list, {
                                parent_id: i.obj_id
                            }).length : bool;
                        })
                    })
                    // .map(function (item) {
                    //     return item.map(function (info) {
                    //         return info.obj_type;
                    //     });
                    // }).map(function (item) {
                    //     return item.indexOf('system_class') != -1 || item.indexOf('equip_class') != -1 || item.indexOf('space_class') != -1;
                    // }).filter(function (bool) {
                    //     return bool;
                    // }).length;

                    if (!bool) {

                        $("#globalnotice").pshow({
                            text: "请实例化全部系统设备空间类",
                            state: "failure"
                        });

                        return;
                    }
                }


                !_that.isquote ? argu.group_plan_id = "" : void 0;

                loadding.set("addWoPlan");
                if (_that.isedit && !_that.iscopy && !_that.isquote) {
                    // 是编辑
                    argu.draft_matters = argu.draft_matters.map(function (item) {
                        item.description = (item.desc_forepart ? item.desc_forepart : '') + (item.desc_aftpart ? item.desc_aftpart : '') + (item.desc_works_desc ? item.desc_works_desc : '');
                        return item;
                    })

                    createPlan_controller.updateWoPlan(argu).then(cb).finally(function () {
                        loadding.remove("addWoPlan");
                    })
                } else {
                    $("#globalnotice").pshow({
                        text: _that.iscopy ? "复制成功" : _that.isquote ? "引用成功" : '创建成功',
                        state: "success"
                    });

                    createPlan_controller.addWoPlan(Object.assign({}, argu, {
                        person_id: _that.userInfo.person_id
                    })).then(cb).finally(function () {
                        loadding.remove("addWoPlan");
                    })
                }

            } else {
                // 集团版处理

                /**
                 * 修改对应的属性完成对应的参数
                 */
                _.forIn(convertEnum, function (value, key) {
                    argu[value] = argu[key];
                    delete argu[key];
                })

                if (_that.isedit && !_that.iscopy) {
                    // 编辑操作
                    loadding.set("updateGroupPlan");
                    createPlan_controller.updateGroupPlan(argu).then(
                        cb,
                        $("#globalnotice").pshow({
                            text: '编辑成功',
                            state: 'success'
                        })
                    ).finally(function () {
                        loadding.remove("updateGroupPlan");
                    });

                } else {

                    if (_that.iscopy) {
                        // 复制操作删除对应的ID
                        delete argu.group_plan_id;
                    }

                    /**
                     * 添加对应计划
                     */
                    loadding.set("addGroupPlan");
                    createPlan_controller.addGroupPlan(Object.assign({}, argu, {
                        person_id: _that.userInfo.person_id
                    })).then(
                        function (res) {

                            $("#createSuccessFul").pshow({
                                title: "发布成功！",
                                subtitle: "是否将该计划下发到项目上？",
                            });

                            // 跟新下发的方法
                            window.toProject = function () {
                                _that.toProjectArgu.group_plan_id = res.group_plan_id;
                                // 保存计划频率设置
                                _that.toProjectArgu.plan_freq_type = argu.plan_freq_type;
                                // 保存是否实例化全部对象
                                _that.toProjectArgu.instantiated_object_flag = argu.instantiated_object_flag;
                                // 展示选中的项目框
                                _that.createToProject();
                            }

                            cb();
                        }
                    ).finally(function () {
                        loadding.remove("addGroupPlan");

                    });
                }

            }
        },
        // 删除事项
        deleteMatter: function (item) {
            var _that = this;
            var index = _that.matters.indexOf(item);
            // 删除对应的事项 和事项报错提示
            _that.matters.splice(index, 1);
            _that.mattersViews.splice(index, 1);
        },
        // 开始搞下发
        createToProject: function () {
            var _that = this;

            $("#modalWindow").pshow();
            $("#confirmWindow").phide();
            $("#IssueProjectListLoading").pshow()
            createPlan_controller.getIssueProjectList(_that.getIssueProjectListArgu).then(function (res) {
                _that.IssueProjectList = res;
            }).finally(function () {
                $("#IssueProjectListLoading").phide();
            })
        },
        submitToProjectAllBtn: function () {
            var _that = this;

            var bool = !(_that.IssueProjectList.length == _.filter(_that.IssueProjectList, {
                selected: true
            }).length && _that.IssueProjectList.length);

            _that.IssueProjectList = _that.IssueProjectList.map(function (item) {

                item.selected = bool;
                return item;
            })
        },
        submitToProject: function () {
            var _that = this;
            _that.toProjectArgu.project_ids = _.map(_.filter(_that.IssueProjectList, {
                selected: true
            }), "project_id");
            // 如果选中的有值才提交
            if (_that.toProjectArgu.project_ids.length) {

                if (_that.toProjectArgu.plan_freq_type == "2") {
                    $('#globalnotice').pshow({
                        text: '下发失败，请修改计划频率',
                        state: 'failure'
                    });
                    return;
                }

                // if (_that.toProjectArgu.instantiated_object_flag != 1) {
                //     $('#globalnotice').pshow({ text: '下发失败，请实例化全部对象', state: 'failure' });
                //     return;
                // }

                $("#globalWindow").pshow();

                var now = new Date(+new Date() + (24 * 60 * 60 * 1000));
                $("#xfstartTimesPtimeid").psel({
                    y: now.getFullYear(),
                    M: now.getMonth() + 1,
                    d: now.getDate(),
                });

                $("#xfendTimesPtimeid").psel({
                    y: now.getFullYear(),
                    M: now.getMonth() + 1,
                    d: now.getDate(),
                })

                // createPlan_controller.issueGroupPlanToWoPlan(_that.toProjectArgu).then(function () {
                //     $('#globalnotice').pshow({ text: '下发成功', state: 'success' });
                // }).catch(function () {
                //     $('#globalnotice').pshow({ text: '下发失败', state: 'failure' });
                // })
            };
        },
        // 下发的年份选择时间
        xfyearClick: function (item) {
            var _that = this;
            _that.toProjectArgu.plan_start_time = item.plan_start_time;
            _that.toProjectArgu.plan_end_time = item.plan_end_time;
        },
        // 起 下拉菜单事件
        xfstartTimesClick: function (item) {
            var _that = this;
            _that.toProjectArgu.plan_start_type = item.code;
            _that.toProjectArgu.plan_start_time = item.value;

            this.$nextTick(function () {
                var now = new Date(+new Date() + (24 * 60 * 60 * 1000));
                $("#xfstartTimesPtimeid").psel({
                    y: now.getFullYear(),
                    M: now.getMonth() + 1,
                    d: now.getDate(),
                });
            })
        },
        // 止 下拉菜单事件
        xfendTimesClick: function (item) {
            var _that = this;
            _that.toProjectArgu.plan_end_time = item.value;
            this.$nextTick(function () {
                var now = new Date(+new Date() + (24 * 60 * 60 * 1000));
                $("#xfendTimesPtimeid").psel({
                    y: now.getFullYear(),
                    M: now.getMonth() + 1,
                    d: now.getDate(),
                })
            })

        },
        // 自定义开始时间控件点击事件
        xfstartTimesPtime: function (item) {
            this.toProjectArgu.plan_start_time = item.pEventAttr.startTime.replace(/\-/g, "") + "000000";
        },
        // 自定义结束时间控件点击事件
        xfendTimesPtime: function (item) {
            this.toProjectArgu.plan_end_time = item.pEventAttr.startTime.replace(/\-/g, "") + "235959";
        },
        // 验证计划生效开始时间和结束时间
        valiteStartEndTime: function (obj) {
            var end = +obj.plan_end_time;
            var start = +obj.plan_start_time;

            var newdate = +new Date(+new Date() + 24 * 60 * 60 * 1000).format('yyyyMMdd000000');
            if (obj.plan_start_type == 2 && start < newdate) {
                $('#globalnotice').pshow({
                    text: '计划生效开始时间小于当前时间',
                    state: 'failure'
                });
                return false;
            } else if (obj.plan_start_type == 2 && end && (start >= end)) {
                $('#globalnotice').pshow({
                    text: '计划生效结束时间必须大于开始时间',
                    state: 'failure'
                });
                return false;
            } else if (end && (end < newdate)) {
                $('#globalnotice').pshow({
                    text: '计划生效结束时间小于当前时间',
                    state: 'failure'
                });
                return false;
            }

            return true;
        },
        // 提交下发按钮
        submitClick: function () {
            var _that = this;

            if (!_that.valiteStartEndTime(_that.toProjectArgu)) return;

            controller.queryGroupPlanById({
                group_plan_id: _that.toProjectArgu.group_plan_id
            }).then(function (res) {

                if (res.plan_freq_type == 3) {

                    res.plan_start_time = _that.toProjectArgu.plan_start_time;
                    res.plan_end_time = _that.toProjectArgu.plan_end_time;

                    res = _that.convertAddWoPlan(res);

                }


                var argu = JSON.parse(JSON.stringify(_that.toProjectArgu));

                argu.freq_cycle = res.freq_cycle;
                argu.freq_num = res.freq_times.length;
                argu.freq_times = res.freq_times;

                argu.plan_freq_type = 1;


                // console.log(JSON.stringify(_that.toProjectArgu));

                // return;

                createPlan_controller.issueGroupPlanToWoPlan(Object.assign({}, argu, {
                    person_id: _that.userInfo.person_id
                })).then(function () {
                    $('#globalnotice').pshow({
                        text: '下发成功',
                        state: 'success'
                    });
                }).catch(function () {
                    $('#globalnotice').pshow({
                        text: '下发失败',
                        state: 'failure'
                    });
                })

                $('#globalWindow').phide();

            })
        },
        //取消二次弹窗
        cancelWindows: function () {
            $("#planCreateWindow").pshow({
                title: '确定要取消吗？',
                subtitle: '取消后计划将不能保存！'
            });
        },
        cancelWindowsConfirm: function () {
            this.cancelWindowsCancel();

            setTimeout(function () {
                window.createPlanCallback();
            }, 500);
        },
        cancelWindowsCancel: function () {
            $("#planCreateWindow").phide();
        }

    },
    computed: {
        // 下发选择的年份
        xfyear: function () {
            return _.range(20).map(function (item, index) {

                var obj = {
                    name: index + new Date().getFullYear() + '年',
                }
                // 今年的选项
                if (index == 0) {
                    //第二天
                    obj.plan_start_time = new Date(+new Date() + (24 * 60 * 60000)).format('yyyyMMdd000000');
                } else {
                    obj.plan_start_time = new Date(new Date().getFullYear() + "/01/01 00:00:00").format('yyyyMMdd000000');
                }
                obj.plan_end_time = new Date(new Date((new Date().getFullYear() + 1 + index) + "/01/01 00:00:00") - (24 * 60 * 60000)).format('yyyyMMdd235959');
                return obj;
            })
        },
        // 下发开始时间选项
        xfstartTimes: function () {
            return [{
                name: "下发成功后第二天生效",
                code: "1",
                value: new Date(+new Date() + (24 * 60 * 60000)).format('yyyyMMdd000000'),
            }, {
                name: "自定义",
                code: "2",
                value: new Date(+new Date() + (24 * 60 * 60000)).format('yyyyMMdd000000'),
            }];
        },
        // 下发结束时间选项
        xfendTimes: function () {
            return [{
                name: "一直有效",
                code: "1",
                value: '',
            }, {
                name: "自定义",
                code: "2",
                value: new Date(+new Date() + (24 * 60 * 60000)).format('yyyyMMdd000000'),
            }];
        }
    },
    watch: {
        matters: function (newVlaue) {
            var _that = this;
            if (newVlaue.length > _that.mattersViews.length) {

                _that.mattersViews = _that.mattersViews.concat(_.range(newVlaue.length - _that.mattersViews.length).map(function () {
                    return new ViewError();
                }))
            } else if (newVlaue.length < _that.mattersViews.length) {

                _that.mattersViews.splice(newVlaue.length);
            }
        }
    },
    beforeMount: function () {

        var _that = this;
        var argu = _that.cache.argu;

        argu = argu || {
            isquote: false,
            isedit: false,
            isterm: false,
            iscopy: false,
            addWoPlan: {},
            cb: function () {
                console.log('Hello World');
            }
        };


        /**
         * 测试添加参数
         */
        // argu = {
        //     isquote: false,
        //     isedit: true,
        //     isterm: true,
        //     iscopy: false,
        //     addWoPlan: { "execute": "3", "plan_name": "计划名称添加", "order_type": "2", "urgency": "高", "ahead_create_time": "22", "freq_cycle": "m", "freq_num": 1, "freq_times": [{ "start_time": { "cycle": "m", "time_day": "1", "time_hour": "0", "time_minute": "0" }, "end_time": { "cycle": "m", "time_day": "1", "time_hour": "0", "time_minute": "0" } }], "instantiated_object_flag": 0, "freq_limit": { "num": "2", "unit": "d" }, "freq_time_span": { "num": "2", "unit": "d", "startTime": "03:03", "continue": "3" }, "plan_freq_type": "3", "plan_start_type": "1", "plan_start_time": "", "plan_end_type": "1", "plan_end_time": "", "next_route": [], "draft_matters": [], "published_matters": [] },
        // }

        // 查询位置需要的专业
        controller.GeneralDict().then(function (res) {
            _that.WoTypeListAll = res;
        })

        controller.queryGeneralDictByKey().then(function (res) {

            _that.GeneralDictByKey = res.map(function (item) {
                return item;
            });
        });

        var convertEnumBak = {
            plan_name: "group_plan_name",
            // execute: "suggest_executor_num",
            // pit_positions: "pitPositions"
        }

        if (argu.isterm) {
            // 项目版处理
            /**
             * 修改对应的属性完成对应的参数
             */
            _.forIn(convertEnumBak, function (key, value) {
                argu.addWoPlan[value] = argu.addWoPlan[key] || argu.addWoPlan[value];
                delete argu.addWoPlan[key];
            })

        } else {
            // 集团版
            /**
             * 修改对应的属性完成对应的参数
             */
            _.forIn(convertEnumBak, function (key, value) {
                argu.addWoPlan[value] = argu.addWoPlan[key];
                delete argu.addWoPlan[key];
            })
        }


        _that.isquote = argu.isquote; // 是否被引用
        _that.isedit = argu.isedit; // 是否编辑
        _that.isterm = argu.isterm; // 是否是项目版
        _that.iscopy = argu.iscopy;

        console.log(argu.addWoPlan);
        // 如果有是项目中 且计划有计划id 则 引用的计划



        if (_that.isterm && argu.addWoPlan.group_plan_id && !_that.iscopy) {
            _that.isquote = true;
        }

        _that.addWoPlan = argu.addWoPlan;

        _that.matters = argu.addWoPlan.draft_matters || [new Matter()];

        window.createPlanCallback = argu.cb;
    }
})