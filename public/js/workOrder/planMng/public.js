

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
    },
    methods: {
        timeFormatting: function (str) { //时间格式化
            var str = str || '';
            var nstr = str.substr(0, 4) + "." + str.substr(4, 2) + "." + str.substr(6, 2) + " " + str.substr(8, 2) + ":" + str.substr(10, 2);
            return nstr;
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
        numTimeTransform: function (str) {
            str = str || "";
            return str.length > 0 ? str.substring(0, 4) + '.' + str.substring(4, 6) + '.' + str.substring(6, 8) + ' ' + str.substring(8, 10) + ':' + str.substring(10, 12) : this.noData
        },
        numTimeFormat: function (str) {
            str = str || "";
            return str.length > 0 ? str.substring(0, 4) + '.' + str.substring(4, 6) + '.' + str.substring(6, 8) : this.noData
        },
        gobackSelPath: function (value) {
            v.goBack(value.path, true);
        },
        gobackLastPath: function (maps) {
            v.goBack(maps.slice(-2, -1)[0].path, true);
        }
    },
    filters: {

    },
});
$(function () {
    v.createVue();

    if (v.name.hasOwnProperty('grouphome')) v.initPage('grouphome');

    if (v.name.hasOwnProperty('term')) v.initPage('planManage');

    // v.initPage('planManage');
});



