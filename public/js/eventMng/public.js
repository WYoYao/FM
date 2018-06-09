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

// 正整数 + 0
String.prototype.ZInteger = function () {

    return (this.pisPositiveInt() || +this == 0)
}
String.prototype.Digits = function () {

    return this.ZInteger && this.length == 1;
}

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
    if (_that.keys.hasOwnProperty(name))
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
        $("#globaloadng").pshow();
    },
    function () {
        $("#globaloadng").phide();
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

        if (argu) data = Object.assign({}, data, argu);

        // onPage 切换到当前页面
        data.onPage = name;

        // 循环修改Vue 实例中的内容
        Object.keys(data).reduce(function (con, key, index) {
            con[key] = _.isObject(data[key]) ? _.cloneDeep(data[key]) : data[key];
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
        allEventType: [
            { name: "全部", code: 0 },
            { name: "客户报修", code: 1 },
            { name: "工程报修", code: 2 },
            { name: "总部指派", code: 3 },
            { name: "数据异常", code: 4 },
        ],
        allEventRate: [
            { name: "待处理", code: 0 },
            { name: "处理中", code: 1 },
            { name: "已关闭", code: 2 },
        ],
        cache: {},//调用工单详情所需，用来存储工单ID
        evPageLen: 20,
        noDataWord: "--",
        userInfo: {
            "userId": "userId",                //类型：String  必有字段  备注：用户id
            "userName": "userName",                //类型：String  必有字段  备注：用户名称
            "isAdmin": "isAdmin",                //类型：String  必有字段  备注：用户类型1-管理员，0-普通用户
            "loginDevice": "loginDevice",                //类型：String  必有字段  备注：登录设备 取值：PC/IOS/Android
            "person_id": "person_id",                //类型：String  可有字段  备注：员工id
            "name": "name",                //类型：String  可有字段  备注：员工姓名
            "phone_num": "phone_num",                //类型：String  可有字段  备注：手机号
            "gender": "gender",                //类型：String  可有字段  备注：性别，male-男、female-女
            "birthday": "birthday",                //类型：String  可有字段  备注：出生年月 格式：yyyy-MM-dd
            "person_mail": "person_mail",                //类型：String  可有字段  备注：邮箱
            "head_portrait": "head_portrait",                //类型：String  可有字段  备注：系统头像
        },
        project_id: "",
    },
    methods: {
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
    },
    filters: {

    },
    beforeMount: {

    },
    watch: {
    }
});


$(function () {
    v.createVue();
    // 生成事件模块的AJAX集合EMA与Promise合集EMP
    createEventModuleController();
    // 生成计划模块的AJAX集合PMA与Promise合集PMP
    createPlanModuleController();

    var url = window.location.href;
    var reg = /pt\=(.+)&?/;
    if (reg.test(url)) {
        var str = url.match(reg)[1];
        v.instance.project_id = psecret.parser(str);
    }

    // 获取用户信息
    // 正式提测的时候取消注释
    $.ajax({
        url: '/userInfo',
        type: 'get',
        data: {},
        success: function (result) {
            v.instance.userInfo = result;
        },
        error: function (error) {
        },
        complete: function () {
        }
    });
    v.init.hasOwnProperty('eventManage') ? v.initPage('eventManage') : v.initPage('eventList');
})