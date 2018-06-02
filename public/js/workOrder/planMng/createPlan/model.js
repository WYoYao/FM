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
            desc_works: [],  // 新建工作内容
            // 对象描述
            desc_forepart: "",  //  @ 输入框文本
            desc_aftpart: "",   //  # 输入框文本  
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
            "group_plan_id": "",              //集团计划id，必须
            "project_ids": [],              //项目计划id集合，必须
            "plan_start_type": "1",            //计划开始类型,1-发布成功后第二天生效，2-指定时间 ,必须
            "plan_start_time": "",            //计划开始时间,yyyyMMdd+"000000"
            "plan_end_time": ""               //计划结束时间,yyyyMMdd+"235959"，空值时代表一直有效
        },
        getIssueProjectListArgu: {
            group_plan_id: "JTJH6a93466d7bb7465c8f893d2ba3e83b7e"
        },
        IssueProjectList: [],
    },
    methods: {
        // 获取对象
        getObj: function (arr) {
            this.str = "";
        },
        //  提交信息
        commit: function () {
            var _that = this;
            // console.log(_that.$refs.baseinfomation.argu());
            // console.log(_that.matters);

            _that.req = {};

            // 获取基本信息输入框验证
            if (!_that.$refs.baseinfomation.canUse()) {
                return;
            }

            _that.req = Object.assign({}, _that.req, _that.$refs.baseinfomation.argu())

            // matters 验证

            if (_.filter(_that.mattersViews, { isRepeat: true }).length) return;
            // 验证名称非空
            _that.mattersViews.forEach(function (item, index) {
                item.isSpace = !_that.matters[index].matter_name.length;
                item.isDescForepartSpace = !_that.matters[index].desc_forepart.length;
            })
            // 验证内容为空
            if (_.filter(_that.mattersViews, { isSpace: true }).length) return;
            if (_.filter(_that.mattersViews, { isDescForepartSpace: true }).length) return;

            // 重名的验证
            _that.mattersViews = _that.mattersViews.map(function (item) {
                item.isRepeat = (_.uniq(_.map(_that.matters, 'matter_name')).length != _that.matters.length);
                return item;
            });

            //  验证多个关系是否不匹配
            // 并行发送请求多个事项同时验证
            Promise.all(_that.matters.map(function (item) {

                if (item.desc_objs.length && item.desc_sops.length) {

                    // 对象与SOP 匹配验证
                    return controller.verifyObjectAndSop({
                        objs: item.desc_objs.map(function (item) {
                            return {
                                obj_id: item.obj_id,
                                obj_name: item.obj_name,
                            }
                        }),
                        sop_ids: _.map(item.desc_sops, "sop_id")
                    })
                } else {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve([]);
                        }, 0);
                    })
                }

            })).then(function (res) {
                // 把原来的错误的状态替换的新的错误信息中
                res.forEach(function (item, index) {

                    item = item.map(function (info) {
                        // 有之前的返回之前的，没有之前的返回新的
                        var find = _.find(_that.mattersViews[index].verify, { obj_name: info.obj_name, sop_name: info.sop_name });
                        return find ? find : info;
                    })

                    _that.mattersViews[index].verify = item;
                });
                // 验证替换后的错误信息是否全部被忽略
                if (
                    !_that.mattersViews.map(function (item) {
                        return _.filter(item.verify, { selected: false }).length
                    }).reduce(function (con, num) {
                        return con + num;
                    }, 0)
                ) {
                    console.log("已经全部被忽略,可以提交预览");
                    //  验证是否被销毁
                    // _that.matters
                    createPlan_controller.querySopListForSel().then(function (data) {

                        var res = data.res;
                        // 验证所有的 SOP 都在直接提交
                        var bool = _that.matters.reduce(function (con, item, index) {

                            if (!con) return false;
                            //  循环每个matter 的 desc_sop 判断是否存在当前SOP列表中
                            return item.desc_sops.reduce(function (con, info) {

                                var bak = con;

                                var bol = !!_.filter(res, { sop_id: info.sop_id }).length;

                                // 再从忽略列表中查找
                                if (!bol) {

                                    if (!!_.filter(_that.mattersViews[index].sopeds, { sop_id: info.sop_id }).length) {

                                        // 在原来的列表中
                                        var bol = !!_.filter(_that.mattersViews[index].sopeds, { sop_id: info.sop_id, selected: true }).length;
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
                                if (!bak) return false;
                                return bol;
                            }, con)
                        }, true);

                        if (bool) {
                            loadding.set("Preview");
                            var getWoMattersPreviewPromise = _that.isterm ?
                                createPlan_controller.getWoMattersPreview({
                                    // order_type: _that.$refs.baseinfomation.addWoPlan.order_type,
                                    draft_matters: _that.matters,
                                })
                                :
                                createPlan_controller.getWoMattersPreviewGroup({
                                    draft_matters: _that.matters,
                                });

                            getWoMattersPreviewPromise.then(function (res) {
                                console.log("可以执行保存了");
                                // 保存预览时候数据
                                _that.WoMattersPreview = !_that.isterm ? res.published_matters : res;

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
                }
            })

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

            argu.instantiated_object_flag = argu.instantiated_object_flag.toString();
            argu.ahead_create_time = +argu.ahead_create_time;

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
                // 项目版处理
                argu = Object.assign({}, {
                    plan_from: _that.isquote ? 1 : 2, // 是否引用
                    group_plan_id: _that.isquote ? _that.cache.argu.addWoPlan.group_plan_id : "", // 引用集团ID
                    published_matters: _that.WoMattersPreview,
                }, argu);

                /**
                 *  如果是引用集团计划
                 */
                // if (_that.isquote) {
                //     // 修改计划的创建类型
                //     argu.plan_from = "1";
                // }

                // if (_that.iscopy) {
                //     // 如果是复制的情况下
                //     argu.group_plan_id = "";
                //     argu.plan_from = "2";
                // }

                loadding.set("addWoPlan");
                if (_that.isedit && !_that.iscopy) {
                    // 是编辑
                    argu.draft_matters = argu.draft_matters.map(function (item) {
                        item.description = item.desc_forepart + item.desc_aftpart + item.desc_works_desc;
                        return item;
                    })

                    createPlan_controller.updateWoPlan(argu).then(cb).finally(function () {
                        loadding.remove("addWoPlan");
                    })
                } else {

                    createPlan_controller.addWoPlan(argu).then(cb).finally(function () {
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
                    createPlan_controller.updateGroupPlan(argu).then(cb).finally(function () {
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
                    createPlan_controller.addGroupPlan(argu).then(
                        function (res) {
                            // 跟新下发的方法
                            window.toProject = function () {
                                _that.toProjectArgu.group_plan_id = res.group_plan_id;
                            }

                            cb();
                        }
                    ).finally(function () {
                        loadding.remove("addGroupPlan");


                        $("#confirmWindow").pshow({ title: '发布成功！', subtitle: '是否将该计划下发到项目上？' });
                    });
                }
            }
        },
        // 开始搞下发
        createToProject: function () {
            var _that = this;

            $("#modalWindow").pshow();

            createPlan_controller.getIssueProjectList(_that.getIssueProjectListArgu).then(function (res) {
                _that.IssueProjectList = res;
            })
        },
        submitToProjectAllBtn: function () {
            var _that = this;

            var bool = !(_that.IssueProjectList.length == _.filter(_that.IssueProjectList, { selected: true }).length && _that.IssueProjectList.length);

            _that.IssueProjectList = _that.IssueProjectList.map(function (item) {

                item.selected = bool;
                return item;
            })
        },
        submitToProject: function () {
            var _that = this;
            _that.toProjectArgu.project_ids = _.map(_.filter(_that.IssueProjectList, { selected: true }), "project_id");

            createPlan_controller.issueGroupPlanToWoPlan(_that.toProjectArgu).then(function () {
                $('#globalnotice').pshow({ text: '下发成功', state: 'success' });
            }).catch(function () {
                $('#globalnotice').pshow({ text: '下发失败', state: 'failure' });
            })

        }
    },
    computed: {
        base: function () {
            return this.$refs.baseinfomation;
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


        _that.isquote = argu.isquote;// 是否被引用
        _that.isedit = argu.isedit;// 是否编辑
        _that.isterm = argu.isterm; // 是否是项目版
        _that.iscopy = argu.iscopy;
        _that.addWoPlan = argu.addWoPlan;

        _that.matters = argu.addWoPlan.draft_matters || [new Matter()];

        window.createPlanCallback = argu.cb;
        debugger;
        // 查询用户的权限
        // controller.queryWoTypeListByPersonIdControlCode().then(function (list) {
        //     _that.WoTypeList = list;
        // })

        //  查询工单状态类
        // var WorkOrderTypePromise = controller.queryWoTypeList().then(function (res) {
        //     //  返回对应Object 集合
        //     _that.WorkOrderType = res.reduce(function (con, item) {
        //         con[item.code] = item.name;
        //         return con;
        //     }, {});

        // }).catch(function () {

        //     _that.WorkOrderType = {};
        // })



    }
})