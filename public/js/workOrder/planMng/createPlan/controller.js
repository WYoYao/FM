//  开发环境下绑定的用户信息
var USER = {
    // "user_id": "RY1505218031651",
    // "customer_id": "",
    // "project_id": "Pj1301020001"
}

"use strict";

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

