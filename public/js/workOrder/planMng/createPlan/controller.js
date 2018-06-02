//  开发环境下绑定的用户信息
var USER = {
    // "user_id": "RY1505218031651",
    // "customer_id": "",
    // "project_id": "Pj1301020001"
}

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


                if (_.isFunction(cb)) {

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

try {

} catch (error) {

}

//  给最节点添加 selected 属性
function addSelected(arr) {

    if (!_.isArray(arr)) return arr;

    var own = arguments.callee;

    arr.forEach(function (item) {
        item.selected = false;
        own(item.content);
    });

    return arr;
}


var createPlan_controller = new Controller([
    {   // 下发到项目
        name: "issueGroupPlanToWoPlan",
        url: "workorder/restGroupPlanService/issueGroupPlanToWoPlan",
        configServiceName: "baseServiceUrl",
    },
    {   // 获取下发的项目
        name: "getIssueProjectList",
        url: "workorder/restGroupPlanService/getIssueProjectList",
        configServiceName: "baseServiceUrl",
        convert: addSelected
    },
    {   // 编辑项目计划
        name: "updateWoPlan",
        url: "workorder/restWoPlanService/updateWoPlan",
        configServiceName: "baseServiceUrl",
    },
    {   // 创建项目计划
        name: "addWoPlan",
        url: "workorder/restWoPlanService/addWoPlan",
        configServiceName: "baseServiceUrl",
    },
    {   //创建集团计划
        name: "addGroupPlan",
        url: "workorder/restGroupPlanService/addGroupPlan",
        configServiceName: "baseServiceUrl",
    },
    {   //编辑集团计划
        name: "updateGroupPlan",
        url: "workorder/restGroupPlanService/updateGroupPlan",
        configServiceName: "baseServiceUrl",
    },
    {
        // 验证 对象和SOP 之间的对应的关系
        name: "verifyObjectAndSop",
        url: "restSopService/verifyObjectAndSop",
        argu: {
            dict_type: "domain_require"
        },
        convert: addSelected
    }, {
        // 查询SOP列表
        name: "querySopListForSel",
        url: "restSopService/querySopListForSel",
        argu: {
            "need_return_criteria": false
        },
        convert: addSelected
    }, {
        //  获取预览页面
        name: "getWoMattersPreview",
        url: "workorder/restWoPlanService/getWoMattersPreview",
        configServiceName: "baseServiceUrl",
        convert: addSelected
    }, {
        // 集团获取预览页面
        name: "getWoMattersPreviewGroup",
        url: "workorder/restGroupPlanService/getWoMattersPreview",
        configServiceName: "baseServiceUrl",
    }, {
        //  获取预览页面
        name: "queryObjectByClass",
        url: "restObjectService/queryObjectByClass",
        argu: {
        },
        convert: addSelected
    }
], {}
);

