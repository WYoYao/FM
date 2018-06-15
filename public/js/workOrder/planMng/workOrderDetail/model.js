// 需存入v.instance.cache  workOrderId工单id
// 然后调用workOrderDetailReady
// 计划管理通用
v.pushComponent({
    name: "workOrderDetail",
    data: {
        // 工单详情数据
        workOrderDetailData: {
            place: []
        },
        // 添加工具保存数组
        toolarr: [],
        // 是否显示添加工具
        isShowAddTool: false,
        workOrderNoData: "--",
        pscrollShwo:true,
    },
    methods: {
        // 查看工单详情 ,id工单id，name，name为"workOrderDetail",path在计划模块中使用，其他模块不需要传
        openWorkOrderDetail: function (id, name, path) {
            if (!id) {
                console.log("请携带工单ID");
                return
            };
            v.instance.cache = { workOrderId: id }
            path ? v.instance.cache.name = path : void 0;
            v.initPage(name);
            this.pscrollShwo = false;
            v.instance.workOrderDetailReady();
        },
        // 生成页面
        workOrderDetailReady: function () {
            var that = this;
            that.isShowAddTool = false;
            $("#workOrderDetailLoad").pshow();
            console.log(this.cache);
            PMA.OD({ order_id: that.cache.workOrderId }, function (data) {
                that.workOrderDetailData = JSON.parse(JSON.stringify(data.work_order.wo_body || {}));
                // that.workOrderDetailData = JSON.parse(JSON.stringify(data));

                that.workOrderDetailData.wo_exec_controls && that.workOrderDetailData.wo_exec_controls.length != 0 && that.workOrderDetailData.wo_exec_controls.forEach(function (item) {
                    item.type = that.getWorkOrderCheckType(item.control_code);
                });

                if (that.workOrderDetailData.pit_positions && that.workOrderDetailData.pit_positions.length > 0) {
                    var arr = [];
                    that.workOrderDetailData.pit_positions.forEach(function (item, index) {
                        if (item.pit_position_ask_names) {
                            if (item.pit_position_ask_names.length == 1) {
                                arr.push({ name: (item.pit_position_ask_names).toString() })
                            }
                            if (item.pit_position_ask_names.length > 1) {
                                arr.push({ name: (item.pit_position_ask_names.join('、')).toString() });
                            }

                        }
                    })
                    console.log(arr);
                    if (arr.length > 0) {
                        that.workOrderDetailData.place = JSON.parse(JSON.stringify(arr));
                    }
                }

                that.workOrderDetailData.matters.forEach(function (item) {
                    item.matter_steps.forEach(function (step) {
                        if (step.feedback && step.feedback.length) {
                            step.feedback.forEach(function (model) {
                                if (model.confirm_result && model.confirm_result.length) {
                                    model.confirm_result.forEach(function (feed) {
                                        var str = '';
                                        if (feed.info_points && feed.info_points.length) {
                                            str = feed.info_points.reduce(function (t, a) {
                                                if (a.value || (a.values && a.values.length)) {
                                                    if (a.value) {
                                                        t += (a.name + '：' + a.value + (a.unit || '')) + ' ； ';
                                                    } else {
                                                        t += (a.name + '：' + a.values.join(",") + (a.unit || '')) + ' ； ';
                                                    }
                                                }
                                                return t;
                                            }, str)
                                        }
                                        if (feed.customs && feed.customs.length) {
                                            str = feed.customs.reduce(function (t, a) {
                                                switch (a.type) {
                                                    case '1':
                                                        if (a.content) { t += (a.name + '：' + a.content + ' ； ') }
                                                        break
                                                    case '2':
                                                        if (a.item) { t += (a.name + '：' + a.item + ' ； ') }
                                                        break
                                                    case '3':
                                                        if (a.items && a.items.length) { t += (a.name + '：' + a.items.join(',') + ' ； ') }
                                                        break
                                                    case '4':
                                                        if (a.value) { t += (a.name + '：' + a.value + (a.unit || '') + ' ； ') }
                                                        break
                                                    case '5':
                                                        if (a.value) { t += (a.name + '：' + a.value + (a.unit || '') + ' ； ') }
                                                        break
                                                };
                                                return t;
                                            }, str)
                                        }
                                        feed.str = str;
                                    })
                                }
                            })
                        }
                    })
                })

            }, function () {
                that.workOrderDetailData = {};
            }, function () {
                that.pscrollShwo = true;
                $("#workOrderDetailLoad").phide();
            })
        },
        workOrderArrToString: function (arr) { //普通数组转字符串方法
            var arr = arr || [];
            var str = ''
            if (arr) {
                str = arr.join("、");
            } else {
                str = ""
            }
            return str;
        },
        // 获取工单控制模块类型
        getWorkOrderCheckType: function (str) {
            str = str || "";

            if (str == 'stop') {
                return { state: 'stop', type: 'stop' };
            }
            if (str == 'assign') {
                return { state: 'assign', type: 'assign' }
            }
            var obj = {};
            if (str.search('apply') !== -1) {
                obj.state = 'apply';
            } else if (str.search('audit') !== -1) {
                obj.state = 'audit';
            } else {
                obj.state = 'approval';
            }

            if (str.search('Matters') !== -1) {
                obj.type = 'ma';
            } else if (str.search('AddingPeople') !== -1) {
                obj.type = 'ap';
            } else if (str.search('ReplacePeople') !== -1) {
                obj.type = 'rp';
            } else if (str.search('Delay') !== -1) {
                obj.type = 'dl';
            } else {
                obj.type = 'cl';
            }
            return obj;
        },
        // 项目信息点与确认信息异常范围
        createInfoWrongWO: function (model) {
            var name = model.name;
            var a = model.wrong_ranges;
            var b = model.wrongs;
            var u = model.unit || "";
            if (a) {
                if (a.length == 0) { return name; }
                var str = a.reduce(function (t, item) {
                    // gt-大于,gte-大于等于，lt-小于,lte-小于等于
                    switch (item.type) {
                        case 'gt':
                            t += (',大于' + item.values + u);
                            break
                        case 'gte':
                            t += (',大于等于' + item.values + u);
                            break
                        case 'lt':
                            t += (',小于' + item.values + u);
                            break
                        case 'lte':
                            t += (',小于等于' + item.values + u);
                            break
                        case 'range':
                            t += (item.values[0] + u + '~' + item.values[1] + u);
                            break
                    }
                    t.slice(0, 1) === ',' ? t = t.slice(1) : void 0;
                    return t;
                }, "");
                return name + '：异常范围(' + str + ')';
            } else if (b) {
                if (b.length == 0) { return name; }
                return name + '：异常范围(' + (b.join(u + ',') + u) + ')';
            } else {
                return name;
            }
        },
        getPreview: function (argu) {
            var _that = this;
            controller.getWoMattersWorkOrderPreview({
                draft_matters: argu
            }).then(function (res) {

                _that.argu.preview = res.matters;
                _that.queryPersonListByPositionIdsArgu.domain_list = res.domain_list;
                //返回数据存在工具时构造数据
                if (res.required_tools && res.required_tools.length > 0) {
                    _that.toolarr = [];
                    res.required_tools.forEach(function (item) {
                        _that.toolarr.push({ name: item });
                    })
                }
                v.instance.argu.next_person_ids = [];
                controller.queryPersonListByPositionIds(_that.queryPersonListByPositionIdsArgu).then(function (res) {
                    if (res && res.length > 0) {
                        _that.persons = res.map(function (item) {
                            item.selected = true;
                            item.persons.map(function (info) {
                                info.selected = true;
                                v.instance.argu.next_person_ids.push(info);
                                return info;
                            })
                            return item;
                        });

                        v.instance.argu.next_person_ids;
                        console.log(v.instance.argu.next_person_ids);
                    }

                })

                _that.isShowAddTool = true;

                var res = Object.assign({}, res, JSON.parse(JSON.stringify(_that.addwork)));


                _that.workOrderDetailData = JSON.parse(JSON.stringify(res)) || {};
                //判断是否添加选择坑位数组
                if (_that.addwork.pit_positions && _that.addwork.pit_positions.length > 0) {
                    var arr = [];
                    _that.addwork.pit_positions.forEach(function (item, index) {
                        if (item.pit_position_ask_names) {
                            if (item.pit_position_ask_names.length == 1) {
                                arr.push({ name: (item.pit_position_ask_names).toString() })
                            }
                            if (item.pit_position_ask_names.length > 1) {
                                arr.push({ name: (item.pit_position_ask_names.join('、')).toString() });
                            }

                        }
                    })
                    console.log(arr);
                    if (arr.length > 0) {
                        _that.workOrderDetailData.place = JSON.parse(JSON.stringify(arr));
                    }

                }

                if (_.isArray(_that.workOrderDetailData.wo_exec_controls)) {
                    _that.workOrderDetailData.wo_exec_controls.forEach(function (item) {
                        item.type = that.getWorkOrderCheckType(item.control_code);
                    });
                }
                that.pscrollShwo = true;
            }).catch(function () {
                _that.workOrderDetailData = {};
                that.pscrollShwo = true;
            })
        },

        // 后台格式转换日期格式
        // yyyyMMddhhmmss2date: function (str) {

        //     return str.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/g, function () {
        //         var arr = Array.prototype.slice.call(arguments);
        //         return arr.slice(1, 4).join('/') + " " + arr.slice(4, 7).join(':');
        //     });
        // },

    },
    filters: {

    },
    beforeMount: function () {

    }
});