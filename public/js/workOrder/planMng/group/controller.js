//  开发环境下绑定的用户信息
var USER = {
    "user_id": "RY1505218031651",
    "customer_id": "",
    "project_id": "Pj1301020001",
}

/**
 * 统一查询接口的类
 * @param {用于创建查询接口的数组} arr 
 * @param {假数据数组} obj
 */
function createController(arr, obj) {

    return arr.reduce(function (con, item) {

        if (con[item.name]) console.error("controller 已有 " + item.name + "方法,请注意合并");

        con[item.name] = function (argu) {

            return new Promise(function (resovle, reject) {

                if (obj.hasOwnProperty(item.name)) {

                    setTimeout(() => {

                        resovle(obj[item.name](Object.assign({}, USER, item.argu, argu)));
                    }, _.random(1, 1000));

                } else {

                    pajax.post({
                        url: item.url,
                        data: Object.assign({}, USER, item.argu, argu),
                        success: resovle,
                        error: reject,
                        complete: function () { }
                    });
                }
            })
        }
        return con;
    }, {})
};


var controller = createController([
    {//查询工单类型
        name: "queryWoTypeList",
        url: "restGeneralDictService/queryGeneralDictByKey",
        argu: {
            "dict_type": "work_order_type",
        }
    },
    {// 查询计划列表
        name: "queryGroupPlanList",
        url: "restGroupPlanService/queryGroupPlanList",
        argu: {}
    },
    {//查询工单计划发出工单列表
        name: "queryWoListByPlanId",
        url: "restWoPlanService/queryWoListByPlanId",
        argu: {}
    },
    // 查询非日类型集团计划项目版及其工单信息
    {
        name: "queryWoPlanExecuteList",
        url: "restGroupPlanService/queryWoPlanExecuteList",
        argu: {

        }
    },
    // 查询日类型集团计划项目版及其工单信息
    {
        name: "queryWoPlanDayExecuteList",
        url: "restGroupPlanService/queryWoPlanDayExecuteList",
        argu: {

        }
    },
    //查询未引用此集团计划得项目列表
    {
        name: "queryUnuseGroupPlanProjectList",
        url: "restGroupPlanService/queryUnuseGroupPlanProjectList",
        argu: {

        }
    }
], {
        // queryWoTypeList() {
        //     return _.range(9).map(index => {
        //         return {
        //             name: `name${index}`,
        //             code: index
        //         }
        //     })
        // },
        queryGroupPlanList() {
            return _.range(40).map(index => {
                return {
                    "group_plan_id": `group_plan_id${index}`,             //集团计划id
                    "group_plan_name": `group_plan_name${index}`,          //集团计划名称
                    "freq_cycle": `y`,                 //计划频率-周期，y/m/w/d
                    "freq_num": _.random(1, 5),                    //计划频率-次数，n
                    "urgency": `urgency${index}`,                   //紧急程度 ，高、中、低
                    "use_project_num": `use_project_num${index}`,           //引用项目数
                    "no_update_project_num": `no_update_project_num${index}`,       //未更新项目数
                };
            })
        },
        queryWoListByPlanId() {
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
    }
);

