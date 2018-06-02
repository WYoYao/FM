/*路由控制的实现*/
function controller() {
    this.tool = require('common/tool');
};

controller.prototype.personManage = function (req, res, next) {
    var _this = this;
    return function (req, res, next) {
        res.render('./pages/basicMng/person/index', { host: commonLibUrl, user: req.session[_this.tool.userSessionName] });
    };
}

controller.prototype.organizationManage = function (req, res, next) {
    var _this = this;
    return function (req, res, next) {
        res.render('./pages/basicMng/organization/index', { host: commonLibUrl, user: req.session[_this.tool.userSessionName] });
    };
}

controller.prototype.scheduleManage = function (req, res, next) {
    var _this = this;
    return function (req, res, next) {
        res.render('./pages/basicMng/schedule/index', { host: commonLibUrl, user: req.session[_this.tool.userSessionName] });
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

controller.prototype.equipmentAddress = function (req, res, next) {
    var _this = this;
    return function (req, res, next) {
        res.render('./pages/equipmentSpace/equipmentAddress/index', { host: commonLibUrl, user: req.session[_this.tool.userSessionName] });
    };
}

controller.prototype.equipmentspace = function (req, res, next) {
    var _this = this;
    return function (req, res, next) {
        res.render('./pages/equipmentSpace/equipmentMng/index', { host: commonLibUrl, tool_type: 'Web', user: req.session[_this.tool.userSessionName] });
    };
}

controller.prototype.workorderType = function (req, res, next) {
    var _this = this;
    return function (req, res, next) {
        res.render('./pages/workOrder/workOrderConfig/index', { host: commonLibUrl, user: req.session[_this.tool.userSessionName] });
    };
}


controller.prototype.events = function (req, res, next) {
    return function (req, res, next) {
        res.render('./pages/eventMng/term', { host: commonLibUrl });
    };
}

controller.prototype.eventgroup = function (req, res, next) {
    return function (req, res, next) {
        res.render('./pages/eventMng/group', { host: commonLibUrl });
    };
}



controller.prototype.workOrderManagement = function (req, res, next) {
    var _this = this;
    return function (req, res, next) {
        res.render('./pages/workOrder/workOrderMng/index', { host: commonLibUrl, user: req.session[_this.tool.userSessionName] });
    };
}

controller.prototype.renderScan = function (req, res, next) {
    return function (req, res, next) {
        res.render('./scan.html', { host: commonLibUrl });
    };
}

controller.prototype.getScanInfo = function (req, res, next) {
    var _this = this;
    return function (req, res, next) {
        var obj = req.query;
        var fn = 'restEquipService/queryScanEquipSpacePublicInfo';
        if (typeof pconst == 'object')
            obj = JSON.parse(JSON.stringify(obj).replace(new RegExp('"' + pconst.emptyReplaceStr + '"', "g"), '""'));

        _this.restClient.request.sendPost({
            url: _config.serviceUrl,
            criteria: obj,
            fn: fn,
            isParserResult: true,
            call: function (err, result) {
                if (err) {
                    console.error('获取' + fn + '的数据err：' + (err.stack || JSON.stringify(err)));
                    return _this.responseTool.sendServerException(res);
                }
                var clientResult = _this.tool2.parseResult(result, fn, null);
                if (!clientResult)
                    return _this.responseTool.sendServerException(res, '请检查' + pconst.mapFileName + '文件是否有' + fn + '请求的配置');
                _this.responseTool.sendSuccess(res, clientResult);
            }
        });
    };
}

//根据用户id获取用户信息
controller.prototype.userInfo = function () {
    var _this = this;
    return function (req, res, next) {
        var puser = JSON.parse(JSON.stringify(req.session[_this.tool.userSessionName]));

        var userId = puser.userId;
        if (!userId) return _this.responseTool.sendDecline(res, '无效的用户');
        //工单管理如果没有person_id,传入userId。
        puser.person_id= puser.person_id|| puser.userId;
        res.send(puser);

        // _this.realRestClient.sendPost({
        //     criteria: { puser: { userId: userId, loginDevice: 'PC' } },
        //     fn: 'getPersonByUserIdService',
        //     call: function (err, result) {
        //         if (err) return console.error('根据ID获取用户信息时错误：' + (err.stack || JSON.stringify(err))),
        //             _this.responseTool.sendDecline(res, '数据端错误');
        //         var user = (result || [])[0] || {};
        //         var newUser = _this.tool.parserUser(user);
        //         var oldLoginTime = req.session[_this.tool.userSessionName][_this.tool.loginTimeName];
        //         newUser[_this.tool.loginTimeName] = oldLoginTime;
        //         req.session[_this.tool.userSessionName] = newUser;

        //         var sendUser = JSON.parse(JSON.stringify(newUser));
        //         sendUser.projects = null;
        //         sendUser.authorizations = null;
        //         delete sendUser.projects;
        //         delete sendUser.authorizations;
        //         res.send(sendUser);
        //     }
        // });
    };
};


module.exports = new controller();
