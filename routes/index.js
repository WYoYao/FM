/*路由*/
module.exports = function (app) {
    var controller = require('../controller/controller');

    //扫描页面
    app.get('/scan', controller.renderScan());

    //获取扫描后的信息
    app.get('/scanInfo', controller.getScanInfo());

    //人员管理
    app.get('/person', controller.personManage());

    //组织结构管理
    app.get('/organization', controller.organizationManage());

    //排班管理
    app.get('/SchedulingManagement', controller.scheduleManage());

    // 计划管理集团版
    app.get('/groupPlanManagement', controller.group());
    // 计划管理项目版
    app.get('/PlanManagement', controller.term());

    //设备通讯录
    app.get('/equipmentaddress', controller.equipmentAddress());

    //设备空间
    app.get('/equipmentspace', controller.equipmentspace());

    //工单配置
    app.get('/workorderType', controller.workorderType());

    // 项目事件
    app.get('/EventManagement', controller.events());

    // 集团事件
    app.get('/GroupEvent', controller.eventgroup());

    //工单管理
    app.get('/workOrderManagement', controller.workOrderManagement());

    //工单管理
    app.get('/userInfo', controller.userInfo());
};
