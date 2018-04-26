var Custom = function (obj) {
    this.name = obj.name;
    this.type = obj.type;

    if (obj.type == 2 || obj.type == 3) {
        this.items = obj.items || [];
        this.wrongs = obj.wrongs || [];
    } else if (obj.type == 4 || obj.type == 5) {
        this.wrong_ranges = obj.wrong_ranges || [];

        if (obj.type == 5) this.unit = obj.unit || "";
    }
}

Vue.component('addcontent', {
    template: '#addcontent',
    data: function () {

        return {
            showAddObjAndPoint: false,
            uRangesType: [
                {
                    name: "大于",
                    code: "gt",
                }, {
                    name: "大于等于",
                    code: "gte",
                }, {
                    name: "小于",
                    code: "lt",
                }, {
                    name: "小于等于",
                    code: "lte",
                }],
            wrongType: [
                {
                    name: "区间",
                    code: 1,
                },
                {
                    name: "非区间",
                    code: 0,
                }
            ],

            onItem: "",
            onPoint: "",
            // 自定义的控件
            controlsList: [
                { name: "普通文本", type: "1" },
                { name: "单选", type: "2" },
                { name: "多选", type: "3" },
                { name: "无单位的数字", type: "4" },
                { name: "有单位的数字", type: "5" }
            ],
            GeneralDictByKey: [],
            view: {
                // 作业前检查项
                pre_conform: false,
                //标准操作要求
                content: false,
                // 注意事项
                notice: false,
                // 操作记录要求
                confirm_result: false,
                // 专业限定
                domain: false,
            },
            content_str: "",
            desc_work: {
                "work_name": "",
                "pre_conform": "",
                "content": "",
                "content_objs": [],
                "notice": "",
                "confirm_result": [],
                "domain": "",
                "domain_name": ""
            }
        }
    },
    props: ["cb"],
    methods: {
        // 获取对象
        get_content_Obj: function (arr) {
            var _that = this;

            _that.desc_work.content_objs = _that.desc_work.content_objs.concat(arr);

            // 去重
            var obj = {};
            _that.desc_work.content_objs = _that.desc_work.content_objs.filter(function (item) {
                if (obj.hasOwnProperty(item.obj_name)) return false;
                obj[item.obj_name] = true;
                return true;
            })

            _that.desc_work.content = _that.desc_work.content_objs.map(function (obj) {
                return "@" + obj.obj_name + " ";
            }).join('');

            // 如果 confirm_result 没有，则添加到 confirm_result 中
            var arr_name = _that.desc_work.confirm_result.map(function (item) {
                return item.obj_name;
            });

            JSON.parse(JSON.stringify(arr)).filter(function (item) {

                return arr_name.indexOf(item.obj_name) == -1;
            }).forEach(function (info) {

                _that.desc_work.confirm_result.push(Object.assign({}, {
                    info_points: [],
                    parents: [],
                    customs: [],
                }, info));
            })

            _that.content_str = "";
        },
        // 获取单个对象的信息点
        get_point: function (obj) {
            var _that = this;
            // 返回什么附加什么
            if (obj.info_points.length) {
                _that.onItem.info_points = obj.info_points;
                _that.onItem = void 0;
                return;
            }
            if (obj.customs.length) {
                _that.onItem.customs = _that.onItem.customs.concat(obj.customs);
                _that.onItem = void 0;
                return;
            }
            //  什么否没返回直接置空
            _that.onItem.customs = [];
            _that.onItem.info_points = [];

            _that.onItem = void 0;

        },
        //转换成父级链字符串形式
        getParentsLinks: function (parents) {
            if (!parents || !parents.length) return '';
            var str = '(';
            for (var i = 0; i < parents.length; i++) {
                str += parents[i].parent_names.join('-');
                if (i != parents.length - 1) str += '/';
            }
            return str + ')';
        },
        // 获取key 集合
        getkeys: function (list, key) {
            if (!_.isArray(list) || !list.length) return [];
            return list.map(function (item) {
                return item[key];
            })
        },
        // 获取异常范围
        getError: function (item) {
            var str = "";
            var type = [
                {
                    name: "大于",
                    code: "gt",
                }, {
                    name: "大于等于",
                    code: "gte",
                }, {
                    name: "小于",
                    code: "lt",
                }, {
                    name: "小于等于",
                    code: "lte",
                }];
            if (item.type == 2 || item.type == 3) {
                str = item.wrongs.join();
            } else if (item.type == 4 || item.type == 5) {

                str = item.wrong_ranges.map(function (info) {

                    if (info.type == "range") {
                        return info.values.join('~');
                    } else {
                        return (_.find(type, { code: info.type }) || {}).name + info.values;
                    }
                }).join();
            }

            return str.length ? ("异常范围：" + str) : '';
        },
        //  编辑信息点
        idecallback: function (item) {
            var _that = this;
            Object.assign(_that.onPoint, item);
            _that.onPoint = void 0;
        },
        // 添加对象和信息点
        addObjAndPoint: function (arr) {
            var _that = this;
            _that.desc_work.confirm_result = _that.desc_work.confirm_result.concat(arr);
            _that.showAddObjAndPoint = false;
        },
        // 提交返回内容
        commit: function () {
            var _that = this;
            // 当前的内容
            var dw = _that.desc_work;
            // 常规验证

            // 验证作业简称不能为空
            if (!dw.work_name.length) {
                $('#globalnotice').pshow({ text: '作业简称不能为空', state: false, });
                return;
            }

            // 作业简称不能为空
            if (!dw.content.length) {
                $('#globalnotice').pshow({ text: '标准操作要求不能为空', state: false, });
                return;
            }

            // 作业简称不能为空
            if (!dw.content.length) {
                $('#globalnotice').pshow({ text: '标准操作要求不能为空', state: false, });
                return;
            }

            // 返回上级
            if (_.isFunction(_that.cb)) _that.cb(dw);
        }
    },
    computed: {

    },
    watch: {
        "desc_work.content": function (newValue, old) {
            var _that = this;
            var str = newValue;
            var arr = [], name = [];

            // 原来没有保存直接的搜索
            // if (!_that.matter.desc_sops.length) {
            //     _that.desc_str = newValue;
            //     return;
            // }

            // 获取语句中的所有的对象
            str = str.replace(/@(\S*?)\s{1}/g, function (c, name) {

                arr.push(name);
                return " ";
            }) + " ";

            //  直接在中间插如的操作直接过滤
            for (var index = 0; index < arr.length; index++) {
                var element = arr[index];
                if (/@|#/.test(element)) {
                    _that.desc_work.content = old;
                    return;
                }
            }


            // 更新删除的内容
            _that.desc_work.content_objs = _that.desc_work.content_objs.filter(function (item, index) {
                return arr.indexOf(item.obj_name) != -1;
            });

            var search = /@(\S*?)\s{1}/.exec(str)

            if (!_.isNull(search)) {
                _that.content_str = '@' + search[1];
            }
        }
    },
    beforeMount: function () {
        var _that = this;
        // 加载专业限定
        addcontent_controller.GeneralDictByKey().then(function (res) {
            _that.GeneralDictByKey = res;
        })

        window.clear_pre_conform = function () {
            _that.desc_work.pre_conform = "";
            _that.view.pre_conform = false;
        };
        window.clear_domain = function () {
            // _that.desc_work.pre_conform = "";
            _that.desc_work.domain = "";
            _that.desc_work.domain_name = "";
            _that.view.domain = false;
        };
        window.clear_confirm_result = function () {
            _that.desc_work.confirm_result = [];
            _that.view.confirm_result = false;
        };
        window.clear_notice = function () {
            _that.desc_work.notice = "";
            _that.view.notice = false;
        };
        window.clear_content = function () {
            // _that.desc_work.pre_conform = "";
            _that.view.content = false;
            _that.desc_work.content = "";
            _that.desc_work.content_objs = [];
        };

        // 专业限定下拉选择事件
        window.domainSel = function (item) {
            _that.desc_work.domain = item.code;
            _that.desc_work.domain_name = item.name;
        }
    },
    destroyed: function () {

        window.clear_pre_conform = undefined;
    }
})