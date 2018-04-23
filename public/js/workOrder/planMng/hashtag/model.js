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
                hashtag_controller.querySopListForSel({
                    sop_name: _that.searchStr,
                }).then(function (data) {

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
                        fit_objs: addSelected(data.criteria.brands),
                        labels: addSelected(data.criteria.brands),
                        order_type: addSelected(data.criteria.brands),
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

            }, 300)


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
    }
})