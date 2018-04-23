/*路由*/
module.exports = function (app) {
    var controller = require('../controller/controller');

    //人员管理
    app.get('/person', controller.personManage());

    //组织结构管理
    app.get('/organization', controller.organizationManage());
    
    // 计划管理集团版
    app.get('/group', controller.group());
    // 计划管理项目版
    app.get('/term', controller.term());

};
