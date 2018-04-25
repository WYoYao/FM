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

Vue.component('idepoint', {
    template: '#idepoint',
    data: function () {
        return {
            page: "index",
            wrongType: [
                {
                    name: "区间",
                    code: "range",
                },
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
    props: ["point", "cb"],
    methods: {
        // 获取类型名称
        getTypeName: function (type) {
            return { gt: '大于', gte: '大于等于', lt: '小于', lte: '小于等于', range: '区间' }[type];
        },
        // 查询某个对象对应的信息点
        covertObj: function (obj) {
            var _that = this;

            _that.customize.name = obj.name;
            _that.customize.type = obj.type;

            //  选项绑定属性
            if (obj.type == 2 || obj.type == 3) {
                _that.customize.items = (obj.items || []).map(function (str) {
                    return {
                        str: str,
                        isWrongs: (obj.wrongs || []).indexOf(str) != -1,
                    }
                })
            } else if (obj.type == 4 || obj.type == 5) {
                _that.customize.wrong_ranges = (obj.wrong_ranges || []).map(function (o) {
                    return {
                        type: o.type,
                        values: (o.type == "range") ? {
                            start: o.values[0],
                            end: o.values[1]
                        } : {},
                        value: o.type != "range" ? o.values : "",
                    }
                })

                if (obj.type == 5) {
                    _that.customize.unit = obj.unit;
                }
            }

        },
        // 点击确定返回信息
        submit: function () {
            var _that = this;
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

            if (_.isFunction(_that.cb)) _that.cb(obj);
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
        //  动态绑定对应的下拉菜单
        "customize.wrong_ranges": function (list) {
            var _that = this;
            _that.$nextTick(function () {
                list.forEach(function (item, index) {
                    $(document.getElementById('_that.customize.wrong_ranges[' + index + ']')).psel(_.findIndex(_that.wrongType, { code: item.type }), false);
                });
            })
        }
    },
    beforeMount: function () {
        var _that = this;
        _that.covertObj(_that.point);

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