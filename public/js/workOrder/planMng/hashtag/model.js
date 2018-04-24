Vue.component('hashtag', {
    template: '#hashtag',
    data: function () {

        return {

            // 查询字符创
            searchStr: "",
            // 定时查询的实例
            timer: null,
            // 显示哪块内容 index默认首页
            onBlock: "",
            // 加载动画
            isLoading: "false",

            SopList: [],

            // 数据列表 每次用于查询的数据列表
            list: [],

            // 筛选按钮
            filter: false,
            // 筛选条件
            criteria: {
                brands: [],
                fit_objs: [],
                labels: [],
                order_type: [],
            }

        }
    },
    props: ['str', 'cb', 'desc_objs', "order_type"],
    methods: {
        // 插叙相关接口
        /**
         * key 对应controller的键值
         * keys 查询完毕后返回对应的属性
         * item 查询需要的参数如果没有可以不传
         */
        queryClass: function (key, item, keys, cb) {
            var _that = this;

            _that.isLoading = true;

            //查询对应的方法 
            hashtag_controller[key](item || {}).then(function (res) {
                _that[keys || key] = _.isFunction(cb) ? cb(res) : res;
            }).finally(function () { _that.isLoading = false; })
        },
        // 选择全部
        selectedAll: function (arr) {
            arr = arr.map(function (item) {
                item.selected = true;
                return item;
            })
        },
        // 查询SOP
        querySop: function (argu) {
            var _that = this;

            hashtag_controller.querySopListForSel(argu).then(function (data) {

                function addSelected(arr) {

                    if (!_.isArray(arr)) return arr;
                    if (!arr.length) return arr;
                    // 字符串数组转换成为 Object 数组
                    if (_.isString(arr[0])) {
                        arr = arr.map(function (params) {
                            return {
                                name: params,
                            }
                        })
                    }

                    return arr.map(function (params) {
                        params.selected = false;
                        return params;
                    })
                }

                _that.criteria = {
                    brands: addSelected(data.criteria.brands),
                    fit_objs: addSelected(data.criteria.fit_objs),
                    labels: addSelected(data.criteria.labels),
                    order_type: addSelected(data.criteria.order_type),
                };
                _that.SopList = data.res.map(function (item) {
                    var arr = [],
                        reg = new RegExp(_that.searchStr, 'g'),
                        res = reg.exec(item.sop_name);

                    while (res) {
                        arr = arr.concat(_.range(+res.index, res.index + _that.searchStr.length))
                        res = reg.exec(item.sop_name);
                    }

                    item.sop_name_arr = item.sop_name.split("").map(function (char, index) {

                        return {
                            mark: arr.indexOf(index) != -1,
                            char: char,
                        }
                    })

                    return item;
                })
            })
        },
        // 全部选中则为全部
        va: function (arr) {
            return _.filter(arr, { selected: true }).length == arr.length;
        },
        watchStr: function (newValue, oldValue) {
            var _that = this;

            // 跟上次相同不做任何处理
            if (newValue == oldValue) return;

            // 验证格式 格式不对不进行搜索
            if (!/^\#\S+/g.test(newValue)) {
                _that.onBlock = 'index';
                return;
            } else {
                _that.onBlock = 'Search';
            }

            _that.searchStr = newValue.replace(/#/, "");

            if (!_that.searchStr.length) return;

            if (!_.isNull(_that.timer)) {
                clearTimeout(_that.timer);
                _that.timer = null;
            }

            _that.timer = setTimeout(function () {
                _that.querySop({
                    sop_name: _that.searchStr,
                });
            }, 300)


        },
        // 搜索阶段清理所有选项
        clearSelect: function () {
            var _that = this,
                allUnSelected = function (arr) {
                    return arr.map(function (item) {
                        item.selected = false;
                        return item;
                    })
                }

            _that.criteria.brands = allUnSelected(_that.criteria.brands);
            _that.criteria.fit_objs = allUnSelected(_that.criteria.fit_objs);
            _that.criteria.labels = allUnSelected(_that.criteria.labels);
            _that.criteria.order_type = allUnSelected(_that.criteria.order_type);
            _that.SopList = allUnSelected(_that.SopList);
        },
        // 根据筛选条件查询
        submitSelect: function () {
            var _that = this;

            var brands = _.filter(_that.criteria.brands, { selected: true }).map(function (item) { return item.name });
            var fit_objs = _.filter(_that.criteria.fit_objs, { selected: true }).map(function (item) { return item.obj_name });
            var labels = _.filter(_that.criteria.labels, { selected: true }).map(function (item) { return item.name });
            var order_type = _.filter(_that.criteria.order_type, { selected: true }).map(function (item) { return item.name });


            var argu = {
                sop_name: _that.searchStr,
            }
            // 有对应的属性直接附加
            if (brands.length) argu.brands = brands;
            if (fit_objs.length) argu.fit_objs = fit_objs;
            if (labels.length) argu.labels = labels;
            if (order_type.length) argu.order_type = order_type;

            _that.querySop(argu);
        },
        // 提交事件，保存对应的事件
        submit: function () {
            var _that = this;
            if (_.isFunction(_that.cb)) _that.cb(_.filter(_that.SopList, { selected: true }));
        },
        // 桌面点击时间
        documentClick: function () {
            var _that = this;
            if (_that.str.length) {
                _that.cb([]);
            }
        }
    },
    computed: {
        isShow: function () {

            return this.str.indexOf('#') != -1;
        },
        // 集合中选中一个
        listClick: function (list, item) {
            list.forEach(function (info) {
                info.selected = info == item;
            })
        },
    },
    watch: {
        str: function (newValue, oldValue) {
            this.watchStr(newValue, oldValue);
        },
        onBlock: function (newVlaue, oldValue) {
            var _that = this;
            // 如果是空值的时候，我们需要根据传入的对象查询对应的sop
            if (newVlaue == 'index') {

                var arr = JSON.parse(JSON.stringify(_that.desc_objs))
                    .map(function (item) {
                        item.checked = true;
                        item.initialChecked = true;
                        // 类型
                        item.obj_type = {
                            "Bd": "build",
                            "Fl": "floor",
                            "Sp": "space",
                            "Sy": "system",
                            "Eq": "equip",
                        }[item.obj_id.slice(0, 2)];
                        return item;
                    });
                if (!arr.length) return;

                // 查询推荐的SOP
                _that.queryClass('queryRecommendSop', {
                    fit_obj_ids: arr,
                    order_type: _that.order_type,
                }, "SopList")

            }
        },
        desc_objs: function (parms) {
            console.log(parms);
        }
    },
    beforeMount: function () {
        var _that = this;

        // 防止加载的时候的调用
        _that.watchStr(_that.str, "");

        // 加载完毕
        _that.isLoading = false;

        // 绑定点击桌面消失内容
        document.addEventListener("click", _that.documentClick, false)
    },
    destroyed: function () {
        // 释放桌面点击事件
        document.removeEventListener("click", this.documentClick, false)
    }
})