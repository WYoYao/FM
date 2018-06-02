﻿function createRoute(app, isLogin) {
    var crypto = require('crypto');
    var path = require('path');
    var fileOper = require('./attachmentOper');
    var realRestClient = require('./restClient');
    var demoRestClient = require('../demoData/data');
    var tool = require('../demoData/tool');
    var responseTool = require('./responseTool');
    var cryptoKey = 'user';
    var keyTool = require('./tool');

    app.all('*', function (req, res, next) {
        var userId = req.query.uid || '';
        if (typeof _config.specialUserName == 'string' && psecret.parser(userId) == _config.specialUserName) {
            return next();
        }

        var reqUrl = req.url;
        if (reqUrl.indexOf(pconst.requestNoValidUrl) > -1 || reqUrl.indexOf('.') > -1 || reqUrl.indexOf(pconst.requestType.plogin) > -1
            || reqUrl.indexOf(pconst.requestType.pvalidse) > -1 || reqUrl.indexOf('/scan') > -1)
            return next();
        if (isLogin === true) {
            if (req.session && req.session[keyTool.customSessionIdName]) {
                req.session._garbage = Date();
                req.session.touch();
                return next();
            }
        } else {
            if (req.cookies[keyTool.customSessionIdName]) return next();
            var secretTicket = req.query[pconst.pticket] || '';
            if (secretTicket) {
                var objResult = paserSecretUser(secretTicket, cryptoKey);
                keyTool.storeUserInfo(req, res, objResult);
                return next();
            }
        }
        return next();
        responseTool.renderNoPower(res, isLogin);
    });

    app.get('/', function (req, res, next) {
        var userId = req.query.uid || '';
        if (typeof _config.specialUserName == 'string' && psecret.parser(userId) == _config.specialUserName) {
            var type = 2;
            var fn = 'restUserService/personLogin';
            var loginType = type;
            req.body = {
                data: { user_name: _config.specialUser, user_psw: '1000', not_verify_code: 'true' },
                loginType: type,
                fn: fn,
                _ptype: pconst.requestType.plogin,
                _c: null
            };
            parseRequest(req, res, next, realRestClient.requestTypes.post);
            return;
        }
        var oldUserInfo = keyTool.getUserInfo(req) || {};
        var ticket = secretUser(oldUserInfo, cryptoKey);
        responseTool.renderMain(res, oldUserInfo, ticket);
    });

    /*导航点击时验证session*/
    app.get('/' + pconst.requestType.pvalidse, function (req, res) {
        if (isLogin === true) {
            if (req.session && req.session[keyTool.customSessionIdName])
                return res.send(200);
            return responseTool.sendRedirect(res, '/');
        }
        res.send(200);
    });

    /*文件上传，只是临时保存在网站应用程序服务器上*/
    app.post('/' + pconst.requestType.pupload, function (req, res, next) {
        function errSend(err) {
            pLogger.error('文件上传错误：' + (err.stack || JSON.stringify(err)));
            return responseTool.sendServerException(res);
        }

        if (req.files) {
            var proArr = Object.getOwnPropertyNames(req.files || {});
            var file = req.files[proArr[0]];

            var filePath = file.path;
            var fileName = file.name || '';
            var name = fileName.substring(0, fileName.lastIndexOf('.'));
            var suffix = fileName.substring(fileName.lastIndexOf('.') + 1);

            var tempName = path.basename(filePath);
            var showUrl = '/' + fileOper.tempDirName + '/' + tempName;
            responseTool.sendSuccess(res, { showUrl: showUrl, name: name, suffix: suffix, result: 1 });
        } else {
            errSend('文件丢失');
        }
    });

    /*附件下载，参数
     *id 必须，附件对应的资源ID
     */
    app.get('/' + pconst.requestType.pdownload + '/:id', function (req, res, next) {
        var id = psecret.parser(req.params.id);
        if (!id) return responseTool.sendDecline(res, '文件标识符不正确');
        var fileType = req.query.ft || '1';
        req.query = {
            data: { id: id, fileType: fileType },
            fn: pconst.requestType.pdownload,
            _ptype: pconst.requestType.pdownload
        };
        parseRequest(req, res, next, realRestClient.requestTypes.down);
    });

    /*根据不同参数来进行附件下载
     */
    app.post('/' + pconst.requestType.pdownloadByParam, function (req, res, next) {
        var paramStr = psecret.parser(req.body.data);
        if (!paramStr) return responseTool.sendDecline(res, '参数不正确');
        var paramObj = JSON.parse(paramStr);
        var fn = paramObj.url;
        delete paramObj.url;

        req.body = {
            data: paramObj,
            fn: fn,
            _ptype: pconst.requestType.pdownloadByParam
        };
        parseRequest(req, res, next, realRestClient.requestTypes.pdownloadByParam);
    });

    /*登录*/
    app.post('/' + pconst.requestType.plogin, function (req, res, next) {
        startLogin(req, res, next, req.body.name, req.body.pass, req.body.type);
    });

    /*注销*/
    app.get('/' + pconst.requestType.ploginOut, function (req, res, next) {
        req.session[keyTool.customSessionIdName] = null;
        req.session.destroy();
        responseTool.redirectMain(res);
    });

    /*get请求*/
    app.get(pconst.requestUrl, function (req, res, next) {
        parseRequest(req, res, next, realRestClient.requestTypes.get);
    });

    /*post请求*/
    app.post(pconst.requestUrl, function (req, res, next) {
        parseRequest(req, res, next, realRestClient.requestTypes.post);
    });

    /*get请求*/
    app.get(pconst.requestNoValidUrl, function (req, res, next) {
        parseRequest(req, res, next, realRestClient.requestTypes.get);
    });

    /*post请求*/
    app.post(pconst.requestNoValidUrl, function (req, res, next) {
        parseRequest(req, res, next, realRestClient.requestTypes.post);
    });

    //登录入口
    function startLogin(req, res, next, userId, pass, type, call) {
        var fn = type == 1 ? 'restUserService/companyLogin' : type == 2 ? 'restUserService/personLogin' : 'restUserService/login';
        var loginType = type;
        req.body = {
            data: { user_name: userId, user_psw: pass },
            loginType: type,
            fn: fn,
            _ptype: pconst.requestType.plogin,
            _c: call
        };
        parseRequest(req, res, next, realRestClient.requestTypes.post);
    };

    //请求中转
    function parseRequest(req, res, next, requestType) {
        var restClient = _config.isRealData == true ? realRestClient : demoRestClient;
        var requestParamFather = requestType == realRestClient.requestTypes.get || requestType == realRestClient.requestTypes.down ? 'query' : 'body';
        var objParam = req[requestParamFather];
        var ptype = objParam._ptype;
        var ptypeFn = restClient[ptype];
        if (typeof ptypeFn == 'function') return restClient[ptype](req, res, next, requestType, objParam);
        responseTool.sendDecline(res, '无效的请求');
    };

    //用户_id、_customer_id、_system_code、_image_secret  一起加密，以便放到url上
    function secretUser(userInfo, key) {
        var base = userInfo._id + '&' + (userInfo._customer_id || '') + '&' + userInfo._system_code + '&' + userInfo._image_secret;
        base = psecret.create(base);
        return createSecret(base, key);
    };

    //解密用户_id、_customer_id、_system_code、_image_secret
    function paserSecretUser(base, key) {
        var result = parserSecret(base, key);
        result = psecret.parser(result);
        var resultArr = result.split('&');

        var _id = resultArr[0];
        var _customer_id = resultArr[1];
        var _system_code = resultArr[2];
        var _image_secret = resultArr[3];

        return { _id: _id, _customer_id: _customer_id, _system_code: _system_code, _image_secret: _image_secret };
    };

    //加密
    function createSecret(base, key) {
        var cipher = crypto.createCipher('aes-256-cbc', key);
        var crypted = cipher.update(base, 'utf8', 'hex');
        var secretResult = crypted + cipher.final('hex');
        return secretResult;
    };

    //解密
    function parserSecret(base, key) {
        var decipher = crypto.createDecipher('aes-256-cbc', key);
        var dec = decipher.update(base, 'hex', 'utf8');
        var parseResult = dec + decipher.final('utf8');
        return parseResult;
    };
};

module.exports = createRoute;