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

var Item = function () {
    return {
        str: '',
        isWrongs: false,
    }
}

var Wrong = function () {
    return {
        _id: +new Date() + _.random(1, 199999),
        type: "",
        value: "",
        values: {
            start: "",
            end: ""
        },
    }
}

Vue.component('point', {
    template: '#point',
    data: function () {
        return {
            page: "index",
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
                    code: "range",
                },
                {
                    name: "非区间",
                    code: "",
                }
            ],
            customize: {
                name: "",
                type: "1",
                items: [],
                wrongs: [],
                wrong_ranges: [],
                unit: "",
            },
            InfoPointForObject: {
                key: "",
                list: []
            },
            searchKey: "",
            // 自定义的控件
            controlsList: [
                { name: "普通文本", type: "1" },
                { name: "单选", type: "2" },
                { name: "多选", type: "3" },
                { name: "无单位的数字", type: "4" },
                { name: "有单位的数字", type: "5" }
            ],
        }
    },
    props: ["obj_id", "cb", "codes"],
    methods: {
        // 查询某个对象对应的信息点
        queryInfoPointForObject: function (obj_id) {
            var _that = this;


            addcontent_controller.queryInfoPointForObject({
                obj_id: obj_id,
                obj_type: {
                    "Bd": "build",
                    "Fl": "floor",
                    "Sp": "space",
                    "Sy": "system",
                    "Eq": "equip",
                }[obj_id.slice(0, 2)]
            }).then(function (res) {

                var arr = _that.codes || [];
                // 已选中的加上状态
                _that.InfoPointForObject.list = res.map(function (item) {
                    if (arr.indexOf(item.code) != -1) {
                        item.selected = true;
                    };
                    return item;
                });
            })
        },
        // 点击确定返回信息
        submit: function () {
            var res = { info_points: [], customs: [] }, _that = this;
            // 搜索查询到
            if (_that.page == 'index') {
                res.info_points = _.filter(_that.InfoPointForObject.list, { selected: true });
            } else {
                var obj = {
                    name: _that.customize.name,
                    type: _that.customize.type,
                };
                if (obj.type == 2 || obj.type == 3) {

                    obj.items = _.map(_that.customize.items, 'str');
                    obj.wrongs = _.map(_.filter(_that.customize.items, { isWrongs: true }), 'str');
                } else if (obj.type == 4 || obj.type == 5) {
                    obj.wrong_ranges = _that.customize.wrong_ranges.map(function (item) {
                        var o = {};
                        o.type = item.type;
                        if (o.type == "range") {
                            o.values = [item.values.start, item.values.end]
                        } else {
                            o.values = item.value;
                        }
                        return o;
                    })
                }

                res.customs = [obj];
            };
            if (_.isFunction(_that.cb)) _that.cb(res);
        }
    },
    computed: {
        // 经过筛选的信息
        InfoPoints: function () {
            var _that = this;
            if (_that.InfoPointForObject.key.length) {
                return _that.InfoPointForObject.list.filter(function (item) {
                    return item.name.indexOf(_that.InfoPointForObject.key) != -1;
                })
            }
            return _that.InfoPointForObject.list;
        }
    },
    watch: {
    },
    beforeMount: function () {
        var _that = this;

        _that.queryInfoPointForObject(_that.obj_id);

        // 修改自定义信息点的类型
        window.changeCustomizeType = function (item) {
            _that.customize.type = item.type;
            if (item.type == '2' || item.type == '3') {
                _that.customize.items = [new Item()];
            } else if (item.type == '4' || item.type == '5') {
                _that.customize.wrong_ranges = [new Wrong()];
            } else {
                _that.customize.items = [];
                _that.customize.wrong_ranges = [];
            }
        }

        // 编辑框状态类型点击事件
        window.itemClick = function (model, event) {
            // 替换全局作用域中的 _that
            window.back_that = window._that;
            window._that = _that;

            var item = eval($(event._currentTarget).attr("id"));
            item.type = model.code;

            // 还原全局作用域下的 _that
            window._that = window.back_that;
            window.back_that = void 0;
        }

        window.uRangesTypeSel = function (model, event) {
            // 替换全局作用域中的 _that
            window.back_that = window._that;
            window._that = _that;

            var item = eval($(event._currentTarget).attr("id"));
            item.type = model.code;

            // 还原全局作用域下的 _that
            window._that = window.back_that;
            window.back_that = void 0;
        }
    },
    destroyed: function () {
        window.changeCustomizeType = undefined;
        window.itemClick = undefined;
        window.uRangesTypeSel = undefined;
    }
})