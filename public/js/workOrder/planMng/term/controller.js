var AllLink = {
    // 获取所有工单状态
    "orderState" : "restGeneralDictService/queryWorkOrderState",
    // 获取工作类型
    "workType" :"restGeneralDictService/queryGeneralDictByKey",
    // 查询集团计划引用数量
    "groupPlanUse" : "restWoPlanService/queryGroupPlanUseNum",
    
    // 获取周月季年工单数据
    "planOrder":"restWoPlanService/queryWoPlanExecuteList",
    // 获取日工单数据
    "dayOrder":"restWoPlanService/queryWoPlanDayExecuteList",
    // 获取工单详情
    "orderDetail":"restWoMonitorService/queryWorkOrderById",

    // 获取作废工单计划列表
    "dumpedPlan":"restWoPlanService/queryDestroyedWoPlanList",
    // 获取工单计划发出的工单列表
    "planWorkOrder":"restWoPlanService/queryWoListByPlanId",
    // 查询工单计划详细信息
    "orderPlanInfo" : "restWoPlanService/queryWoPlanById",
    // 获取工单计划改变历史列表
    "planChangeHistory":"restWoPlanService/queryWoPlanHisList",
    // 作废工单计划
    "deleteOrderPlan":"restWoPlanService/destroyWoPlanById",


    // 查询集团计划详细信息
    "groupPlanInfo" : "restGroupPlanService/queryGroupPlanById",
    // 获取集团计划列表
    "groupPlanList":"restGroupPlanService/queryGroupPlanListForProject",
    // 作废集团计划
    "deleteGroupPlan":"restGroupPlanService/destroyGroupPlanById",
}

function getData(arr) {
    var a = {
        "user_id": "RY1505218031651",
        "customer_id": "",
        "project_id": "Pj1301020001",
    }
    var c = arr.map(function(model){
        return {url:AllLink[model.name],data:Object.assign({},model.data,a)}
    })
    return c.map(function(item){
        return new Promise(function (resovle, reject) {
            pajax.post({
                url: item.url,
                data: item.data,
                success: resovle,
                error: reject,
                complete: function (){}
            });
        })
    })
};