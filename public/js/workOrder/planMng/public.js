"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 创建Controller 的请求类可以添加
 */
var Controller = function () {
    function Controller(arr, user) {
        _classCallCheck(this, Controller);

        // 保存每次提交的时候需要的参数
        this.user = _.isPlainObject(user) ? user : {};

        return this.push.call(this, arr);
    }

    Controller.prototype.push = function push(arr) {
        var _this = this;

        if (!_.isArray(arr)) throw new TypeError('Arugments must be an Array');

        var _loop = function _loop() {
            if (_isArray) {
                if (_i >= _iterator.length) return "break";
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) return "break";
                _ref = _i.value;
            }

            var _ref2 = _ref,
                name = _ref2.name,
                url = _ref2.url,
                argu = _ref2.argu,
                cb = _ref2.cb,
                convert = _ref2.convert,
                configServiceName = _ref2.configServiceName;


            if (_.has(_this, name)) {
                console.log(name + "\u4E0E\u73B0\u6709\u7684\u5C5E\u6027\u91CD\u590D,\u5DF2\u5408\u5E76\u3002");
            };

            _this[name] = function () {
                var argus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


                if (false) {

                    // 调用假数据方法进行查询
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {

                            resolve(_.isFunction(convert) ? convert(cb(argus)) : cb(argus));
                        }, _.random(1000, 2000));
                    });
                } else {

                    // 真实发请求
                    return new Promise(function (resolve, rejcet) {
                        pajax.post({
                            url: url,
                            data: Object.assign({}, argu, argus, _this.user),
                            configServiceName: configServiceName,
                            success: function success(res) {
                                res = _.has(res, "data") ? res.data : res;
                                resolve(_.isFunction(convert) ? convert(res) : res);
                            },
                            error: rejcet
                        });
                    });
                }
            };
        };

        for (var _iterator = arr, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ;) {
            var _ref;

            var _ret = _loop();

            if (_ret === "break") break;
        }
        return this;
    };

    return Controller;
}();


//  开发环境下绑定的用户信息
var USER = {
    // "user_id": "RY1505218031651",
    // "customer_id": "",
    // "project_id": "Pj1301020001",
}

//  给最节点添加 selected 属性
function addSelected(arr) {
    if (!_.isArray(arr)) return arr;

    var own = addSelected;

    arr.forEach(function (item) {
        item.selected = false;
        own(item.content);
    });

    return arr;
}

var controller = new Controller([], USER);


// 整数 + 0
String.prototype.Integer = function () {

    return (this.pisInt() || +this == 0)
}

//  0 - 24 数字整数验证
String.prototype.pisdayhour = function () {
    return (+this < 25 && +this >= 0);
}

// 正整数 + 0
String.prototype.ZInteger = function () {

    return (this.pisPositiveInt() || +this == 0)
}

/**
 * 依次执行多个会返回Promise的方法,串行执行
 * @param {一个数组 数组里面每一项都是一个方法,每个方法可以返回一个Promise 对象 } arr
 */
function PromiseFollow(arr) {
    var result = [];

    return new Promise(function (resolve) {
        arr.reduce(function (a, b, i) {
            return function (res) {
                return b()
                    .then(function (one) {
                        result.push(one);

                        return new Promise(function (re) {
                            re(i == 0 ? result.reverse() : one);
                        });
                    })
                    .then(a);
            };
        }, resolve)();
    });
}

/**
 * 依次执行多个会返回Promise的方法,并行执行
 * @param {一个数组 数组里面每一项都是一个方法,每个方法可以返回一个Promise 对象 } arr
 */
function PromiseConcurrent(arr) {
    var result = [];

    return new Promise(function (resolve) {
        // 全部执行发送请求
        arr
            .map(function (item) {
                return item();
            })
            .reduce(function (a, b, i) {
                return function () {
                    b
                        .then(function (one) {
                            result.push(one);

                            return new Promise(function (re) {
                                re(i == 0 ? result.reverse() : one);
                            });
                        })
                        .then(a);
                };
            }, resolve)();
    });
}




/**
 * loadding 弹窗状态控制
 */
// 加载状态的容器
function SetLoading(resolve, reject) {
    // 保存状态的容器
    this.keys = {};

    this.resolve = resolve;

    this.reject = reject;
}

SetLoading.prototype.set = function (name) {
    var _that = this;

    //  默认传入属性的名称
    name = name || +new Date() + _.random(1000, 9999);

    // 有相同的键值的时候的抛出错误
    if (_.has(_that.keys, name))
        throw new Error("The property has already existed");
    else
        // 状态添加到的容器中  值为释放当前的状态的方法
        _that.keys[name] = function () {
            //删除那个对应的键值
            delete _that.keys[name];

            // 全部键值都被释放后则执行停止的方法
            if (!Object.keys(_that.keys).length) _that.reject();
        };

    // 添加状态后的执行的状态中的方法
    _that.resolve();

    //返回清除当前传入状态的方法
    return _that.keys[name];
};

// 释放某个状态
SetLoading.prototype.remove = function (name) {
    // 验证非空判断
    if (!name) throw new Error("Parameters can not be empty");

    // 释放对应的属性
    this.keys[name] && this.keys[name]();

    // 删除对应的属性
    delete this.keys[name];
};

var loadding = new SetLoading(
    function () {
        $("#globalloading").pshow();
    },
    function () {
        $("#globalloading").phide();
    }
);

/**
 * 合并Vue 使用
 */
(function () {
    var initPageNames = [];

    var _constAssignArr = [
        "name",
        "beforeMount",
        "data",
        "methods",
        "computed",
        "watch",
        "filters"
    ];

    var VueReady = function (el) {
        // 挂载的DOM
        this.el = el;

        var _that = this;

        /**
         * 创建对应的存储集合
         */
        _constAssignArr.reduce(function (con, key) {
            con[key] = {};
            return con;
        }, _that);

        // 保存初始化使用的值
        this.init = {};

        // 控制显示隐藏的dom集合
        this.navigators = {};

        // 用于保存生成后面的Vue 实例
        this._instance = null;

        // 只读获取Vue
        Object.defineProperty(this, "instance", {
            get: function () {
                if (_that._instance) return _that._instance;

                _that._instance = new Vue({
                    el: _that.el,
                    data: _that.data,
                    methods: _that.methods
                });

                return _that._instance;
            }
        });
    };

    // 创建Vue 实例
    VueReady.prototype.createVue = function () {
        this._instance = new Vue({
            el: this.el,
            data: JSON.parse(JSON.stringify(this.data)),
            methods: this.methods,
            computed: this.computed,
            watch: this.watch,
            filters: this.filters
        });

        // 创建成功Vue 实例的方法全部挂载到window 对象上面
        for (var key in this.methods) {
            if (this.methods.hasOwnProperty(key)) {
                window[key] = this.methods[key].bind(this._instance);
            }
        }

        return this._instance;
    };

    // 将需要添加的实例属性合并
    VueReady.prototype.pushComponent = function (option) {
        /**
         * name:'当前模块名称'
         * data:'当前模块需要绑定的状态树'
         * methods:'当前模块需要绑定的方法'
         */

        var _that = this,
            name,
            assignArr = _constAssignArr, // 需要验正重复合并内容
            el = option.el || void 0;

        name = option.name || void 0;

        _that.name[option.name] = true;

        // 挂载对应的 beforeMount 事件
        if (name && el) {
            // 綁定 方法中this 为 Vue 实例
            _that.navigators[name] = el;
        }

        // 挂载对应的 beforeMount 事件
        if (name && _.isFunction(option.beforeMount)) {
            // 綁定 方法中this 为 Vue 实例
            _that.beforeMount[name] = option.beforeMount;
        }

        // 循环执行两种类型的验证合并
        assignArr
            .map(function (key) {
                // 获对应的data methods 值
                return {
                    key: key,
                    value: _.isPlainObject(option[key]) ? option[key] : {}
                };
            })
            .forEach(function (item) {
                var key = item.key, // 区别   'data', 'methods'
                    value = item.value, // 传入的 'data', 'methods' 对应的值
                    keys = Object.keys(_that[key]), // 已有的值
                    err; // 冲突的方法名称集合

                // 记录每个name 对应的初始化状态
                if (key == "data" && name != void 0) {
                    if (Object.keys(_that.init).includes(name))
                        throw new Error("当前namespace:" + name + "已经被使用");

                    _that.init[name] = value;
                }

                // 记录冲突
                err = Object.keys(value).reduce(function (err, info) {
                    // 冲突记录
                    if (keys.includes(info)) err.push(info);
                    return err;
                }, []);

                // 合并
                _that[key] = _.assign({}, _that[key], value);

                // 冲突的打印出来
                if (err.length)
                    throw new Error(
                        name + "下" + key + "中" + err.join(",") + "与已有内容发生冲突"
                    );
            });
    };

    VueReady.prototype.goBack = function (name, bool) {

        this._instance.onPage = name;

        if (bool) {
            this.beforeMount[name].call(this.instance);
        }
    };

    // 初始化对应页面内容
    VueReady.prototype.initPage = function (name, argu) {
        // 保存除名称外的所有参数
        var argus = Array.prototype.slice.call(arguments, 1);

        initPageNames.push(name);

        // 获取对应的状态值
        var data = this.init[name],
            beforeMount = this.beforeMount[name] || function () { };

        if (argu) data = Object.assign(data, argu);

        // onPage 切换到当前页面
        data.onPage = name;

        // 循环修改Vue 实例中的内容
        Object.keys(data).reduce(function (con, key, index) {
            con[key] = JSON.parse(JSON.stringify(data[key]));
            return con;
        }, this._instance);

        // beforeMount 方法执行
        beforeMount.apply(this._instance, argus);
    };

    window.VueReady = VueReady;
})();

var v = new VueReady("#app");

//  全局全局公用的方法的和属性
v.pushComponent({
    name: "global",
    data: {
        onPage: "",
        noData: "--",
        // model: "plan",
        // userSelCache:{},
        // 默认的以及自定义的工单状态
        allOrderState: [],
        workOrderStateAndAll: [],
        // 上一个页面
        lastPage: "",
        // 所有工单类型
        allPlanType: [{ name: "全部", code: "" }],
        // 工单时间状态
        orderTimeType: [{ name: "全部", code: 0 }, { name: "临时性工单", code: 1 }, { name: "计划性工单", code: 1 }],
        // 页面间跳转时传递的参数
        cache: {},
        paths: {
            base: {              //手动配置的根目录
                'planManage': { name: "首页", path: "planManage", cache: "" },
                'grouphome': { name: "集团计划", path: "grouphome", cache: "" },
            },
            path: [],            //自动生成的路径数据,{name,path,cache}分别为该路径的名字，该路径的对应的onPage值，和该路径缓存
            isBase: true,        //当前页是否为根目录
            auto: true           //是否显示自动生成的面包屑
        },
        project_id: "",
        userInfo: {},
    },
    methods: {
        // 解决日历控件和下拉框控件下拉框隐藏问题
        fakerClick: function (event) {
            if (event) {

                var el = event.srcElement ? event.srcElement : event.target;
                $(el).addClass("NowSelthisEl");

                var elList = $("._combobox_bottom");

                for (var i = 0; i < elList.length; i++) {
                    var elWrap = $(elList[i]).parents(".comboMark");
                    var len = $(elWrap).find(".NowSelthisEl").length;
                    len != 0 ? void 0 : $(elList[i]).css("display", "none");
                }

                $(el).removeClass("NowSelthisEl");
            } else {
                // 兼容IE,页面发生一次点击事件
                $("body").trigger("click");
            }
        },
        transfYMWD: function (str) { //通过年月周天转换对应的中文
            var obj = {
                y: "年",
                m: "月",
                w: "周",
                d: "日",
                q: "季"
            }
            return obj[str]
        },
        filter_weekDetail_trans: function (str) {
            var obj = {
                "01": "周一",
                "02": "周二",
                "03": "周三",
                "04": "周四",
                "05": "周五",
                "06": "周六",
                "07": "周日",
            };
            return obj[str]
        },
        sectionToChinese: function (section) {
            var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
            var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
            var chnUnitChar = ["", "十", "百", "千"];

            var strIns = '', chnStr = '';
            var unitPos = 0;
            var zero = true;
            while (section > 0) {
                var v = section % 10;
                if (v === 0) {
                    if (!zero) {
                        zero = true;
                        chnStr = chnNumChar[v] + chnStr;
                    }
                } else {
                    zero = false;
                    strIns = chnNumChar[v];
                    strIns += chnUnitChar[unitPos];
                    chnStr = strIns + chnStr;
                }
                unitPos++;
                section = Math.floor(section / 10);
            }
            return chnStr;
        },
        // yyyymmddhhMMss => yyyy.mm.dd hh:MM  type === '0'
        // yyyymmddhhMMss => yyyy.mm.dd        type === '1'
        timeFormat: function (str, type) {
            str = str || "";
            if ((typeof str) != 'string') { str = str + ""; }
            switch (type) {
                case '0':
                    return str.length > 0 ? str.substring(0, 4) + '.' + str.substring(4, 6) + '.' + str.substring(6, 8) + ' ' + str.substring(8, 10) + ':' + str.substring(10, 12) : this.noData
                    break;
                case '1':
                    return str.length > 0 ? str.substring(0, 4) + '.' + str.substring(4, 6) + '.' + str.substring(6, 8) : this.noData
                    break;
            }
        },
        // 组装路径
        createPath: function (N, O) {
            // 如果跳入基础路径则清空路径缓存并修改isBase
            // 否则记录该路径并存储name，path,以及页面间传递的参数cache
            // 跳回时统一goback，使用该路径存储的cache替换根实例中的cache
            var that = this;

            this.paths.isBase = false;

            var a = Object.keys(this.paths.base);
            a.forEach(function (item) {
                if (item == N) {
                    that.paths.path = [that.paths.base[N]];
                    that.paths.isBase = true;
                }
            })

            if (!this.paths.isBase && this.cache.name) {
                var a = 0;
                // 此时根实例的cache内存储的一定为目标路径的cache信息
                this.paths.path.forEach(function (model) {
                    // 可能会跳入同一个路径的页面两次,但不可能跳入同一个名字的页面两次,因此使用cache.name进行判断
                    if (model.name == that.cache.name) { a++ }
                })
                a === 0 ? this.paths.path.push({ name: this.cache.name, path: N, cache: JSON.parse(JSON.stringify(this.cache)) }) : void 0;
            }

        },
        // 跳回用户选择的Path
        gobackSelPath: function (value) {
            this.cache = value.cache;
            this.paths.path.forEach(function (item, index) {
                if (item.name == value.name) {
                    v.instance.paths.path.splice(index + 1, v.instance.paths.path.length - index - 1);
                }
            })
            v.goBack(value.path, true);
        },
        //  跳回上一级Path
        gobackLastPath: function (maps) {
            this.cache = maps.slice(-2, -1)[0].cache;
            v.goBack(maps.slice(-2, -1)[0].path, true);
            this.paths.path.pop();
        },
        // 后台格式转换日期格式
        yyyyMMddhhmmss2date: function (str) {

            return str.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/g, function () {
                var arr = Array.prototype.slice.call(arguments);
                return arr.slice(1, 4).join('/') + " " + arr.slice(4, 7).join(':');
            });
        },
        // 普通格式转换
        date2yyyyMMddhhmm: function (date) {

            return (new Date(date)).format('yyyy.MM.dd hh:mm');
        }
    },
    filters: {

    },
    watch: {
        onPage: function (N, O) {
            this.createPath(N, O);
        }
    }
});
$(function () {

    v.createVue();

    var url = window.location.href;
    var reg = /pt\=(.+)&?/;
    if (reg.test(url)) {
        var str = url.match(reg)[1];
        v.instance.project_id = psecret.parser(str);
    }
    // 生成计划模块的AJAX以及Promise集合PMA与PMP
    createPlanModuleController();
    // 获取用户信息
    // 正式提测的时候取消注释
    // $.ajax({
    //     url: '/userInfo',
    //     type: 'get',
    //     data: {},
    //     success: function (result) {
    //         v.instance.userInfo = result;
    //         debugger
    //         console.log(v.instance.userInfo);
    //     },
    //     error: function (error) {
    //     },
    //     complete: function () {
    //     }
    // });

    if (v.name.hasOwnProperty('grouphome')) v.initPage('grouphome');

    if (v.name.hasOwnProperty('planManage')) v.initPage('planManage');

    // v.instance.model = v.name.hasOwnProperty('createPlan') ? 'group' : 'plan';

});