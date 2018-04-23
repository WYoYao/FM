/*路由控制的实现*/
function controller() {
    this.tool = require('common/tool');
};

controller.prototype.personManage = function (req, res, next) {
    return function (req, res, next) {
        res.render('./pages/basicMng/person/index', { host: commonLibUrl });
    };
}

controller.prototype.organizationManage = function (req, res, next) {
    return function (req, res, next) {
        res.render('./pages/basicMng/organization/index', { host: commonLibUrl });
    };
}

controller.prototype.group = function (req, res, next) {
    return function (req, res, next) {
        res.render('./pages/workOrder/planMng/group', { host: commonLibUrl });
    };
}

controller.prototype.term = function (req, res, next) {
    return function (req, res, next) {
        res.render('./pages/workOrder/planMng/term', { host: commonLibUrl });
    };
}

module.exports = new controller();
