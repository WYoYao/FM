controller.push([
    {
        // 验证集团计划中的名称重复
        name: "verifyGroupPlanName",
        url: "workorder/restGroupPlanService/verifyGroupPlanName",
        configServiceName: "baseServiceUrl",
    },
    {
        // 验证集团计划中的名称重复
        name: "verifyWoPlanName",
        url: "workorder/restWoPlanService/verifyWoPlanName",
        configServiceName: "baseServiceUrl",
    },
    {//查询工单类型
        name: "queryWoTypeList",
        url: "restGeneralDictService/queryWoTypeList",
        argu: {
            "work_type": "work_type",
            "wo_execute_type": "plan",
        }
    },
    {// 查询计划列表
        name: "queryGroupPlanList",
        url: "workorder/restGroupPlanService/queryGroupPlanList",
        configServiceName: "baseServiceUrl",
        argu: {},
        // cb: function () {
        //     return _.range(40).map(index => {
        //         return {
        //             "group_plan_id": `group_plan_id${index}`,             //集团计划id
        //             "group_plan_name": `group_plan_name${index}`,          //集团计划名称
        //             "freq_cycle": `y`,                 //计划频率-周期，y/m/w/d
        //             "freq_num": _.random(1, 5),                    //计划频率-次数，n
        //             "urgency": `urgency${index}`,                   //紧急程度 ，高、中、低
        //             "use_project_num": `use_project_num${index}`,           //引用项目数
        //             "no_update_project_num": `no_update_project_num${index}`,       //未更新项目数
        //         };
        //     })
        // }
    },
    {//查询工单计划发出工单列表
        name: "queryWoListByPlanId",
        url: "restWoPlanService/queryWoListByPlanId",
        argu: {},
        cb: function () {
            return _.range(9).map(index => {
                return {
                    order_id: index,
                    create_time: 20170620093000,
                    close_time: 20170620093000,
                    participants: "张三，李四",
                    order_state_name: "工单状态名称",
                }
            })
        }
    },
    {// 查询非日类型集团计划项目版及其工单信息
        name: "queryWoPlanExecuteList",
        url: "workorder/restGroupPlanService/queryWoPlanExecuteList",
        configServiceName: "baseServiceUrl",
        argu: {

        },
        cb: function () {
            return _.range(_.random(20, 50)).map((index) => {
                let count = _.random(5, 10);
                let create_wo_total = _.random(1, 5);
                let uncreate_wo_total = _.random(1, count - create_wo_total);

                return {
                    "plan_id": "计划id",                //计划id
                    "project_id": "项目id",             //项目id
                    "project_name": "项目名称",           //项目名称
                    "is_update_group_plan": _.random(0, 1),    //是否更新集团计划，1-已更新、0-未更新
                    "create_wo_total": create_wo_total,           //发单总数
                    "uncreate_wo_total": uncreate_wo_total,         //未发出数
                    "executing_wo_total": _.random(0, 5),        //执行中数
                    "finished_wo_total": _.random(0, 5),         //已完成数
                    "row_count": 3,                  //行数
                    "work_orders": _.chunk(_.range(_.random(28, 31)).map(item => ++item), 4).map((item, index) => {

                        var obj = {
                            order_id: "1231",
                            "ask_start_time": "201805" + ("00" + item.slice(0, 1)).slice(-2) + "000000",   //要求开始时间,yyyyMMddhhmmss
                            "ask_end_time": "201805" + ("00" + item.slice(-1)).slice(-2) + "000000",     //要求结束时间,yyyyMMddhhmmss
                            "order_state": "5"       //工单状态编码，优先返回自定义状态
                        };

                        return obj;
                    })
                }
            })
        }
    },
    {// 查询日类型集团计划项目版及其工单信息
        name: "queryWoPlanDayExecuteList",
        url: "restGroupPlanService/queryWoPlanDayExecuteList",
        argu: {

        }
    },
    {//查询未引用此集团计划得项目列表
        name: "queryUnuseGroupPlanProjectList",
        url: "workorder/restGroupPlanService/queryUnuseGroupPlanProjectList",
        configServiceName: "baseServiceUrl",
        argu: {

        }
    },
    {//根据ID查询集团计划详细信息
        name: "queryGroupPlanById",
        url: "workorder/restGroupPlanService/queryGroupPlanById",
        configServiceName: "baseServiceUrl",
        argu: {}
    },
    {// 废弃工作计划
        name: 'destroyWoPlanById',
        url: 'workorder/restGroupPlanService/destroyGroupPlanById',
        configServiceName: "baseServiceUrl",
    },
    {// 查询工单状态
        name: 'queryWorkOrderState',
        url: 'restGeneralDictService/queryWorkOrderState',
        argu: { dict_type: "work_order_state" },
    }
]);

