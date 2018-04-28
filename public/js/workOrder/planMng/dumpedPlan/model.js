v.pushComponent({
    name: "dumpedPlan",
    data: {
        dumpedPlanList:[]
      },
    methods: {
        // 打开被废弃计划详情
        openDumpedPlan:function(model){
            this.cache = {name:"已作废计划详情",planType:'orderD',planId:model.plan_id};
            v.initPage('planInformation');
        }
    },
    filters: {
        
    },
    beforeMount:function(){
        var that = this;

        $("#dumpedPlanPartLoad").pshow();
        // 获取作废计划列表
        ajx("dumpedPlan",{order_type:this.cache.orderType},function(data){
            that.dumpedPlanList = JSON.parse(JSON.stringify(data.Content));
        },function(err){
            that.dumpedPlanList = [];
        },function(){
            $("#dumpedPlanPartLoad").phide();
        })

    }
});


var xp = [
    {
        "plan_id":"***",              //工单计划id
        "project_id":"***",           //项目id
        "plan_name":"***",            //工单计划名称
        "matters_desc":"***",         //工作事项概述,将事项名称连接起来的字符串，用"、"隔开
        "plan_start_time":"***",      //计划开始时间,yyyyMMddhhmmss
        "plan_end_time":"***",        //计划结束时间,yyyyMMddhhmmss，空值时代表一直有效
        "destroy_time":"20180405082534",         //报废时间,yyyyMMddhhmmss
        "destroy_person_name":"***"   //报废人name         
    },{
        "plan_id":"***",              //工单计划id
        "project_id":"***",           //项目id
        "plan_name":"***",            //工单计划名称
        "matters_desc":"***",         //工作事项概述,将事项名称连接起来的字符串，用"、"隔开
        "plan_start_time":"***",      //计划开始时间,yyyyMMddhhmmss
        "plan_end_time":"***",        //计划结束时间,yyyyMMddhhmmss，空值时代表一直有效
        "destroy_time":"20180405082534",         //报废时间,yyyyMMddhhmmss
        "destroy_person_name":"***"   //报废人name         
    },{
        "plan_id":"***",              //工单计划id
        "project_id":"***",           //项目id
        "plan_name":"***",            //工单计划名称
        "matters_desc":"***",         //工作事项概述,将事项名称连接起来的字符串，用"、"隔开
        "plan_start_time":"***",      //计划开始时间,yyyyMMddhhmmss
        "plan_end_time":"***",        //计划结束时间,yyyyMMddhhmmss，空值时代表一直有效
        "destroy_time":"20180405082534",         //报废时间,yyyyMMddhhmmss
        "destroy_person_name":"***"   //报废人name         
    },{
        "plan_id":"***",              //工单计划id
        "project_id":"***",           //项目id
        "plan_name":"***",            //工单计划名称
        "matters_desc":"***",         //工作事项概述,将事项名称连接起来的字符串，用"、"隔开
        "plan_start_time":"***",      //计划开始时间,yyyyMMddhhmmss
        "plan_end_time":"***",        //计划结束时间,yyyyMMddhhmmss，空值时代表一直有效
        "destroy_time":"20180405082534",         //报废时间,yyyyMMddhhmmss
        "destroy_person_name":"***"   //报废人name         
    },{
        "plan_id":"***",              //工单计划id
        "project_id":"***",           //项目id
        "plan_name":"***",            //工单计划名称
        "matters_desc":"***",         //工作事项概述,将事项名称连接起来的字符串，用"、"隔开
        "plan_start_time":"***",      //计划开始时间,yyyyMMddhhmmss
        "plan_end_time":"***",        //计划结束时间,yyyyMMddhhmmss，空值时代表一直有效
        "destroy_time":"20180405082534",         //报废时间,yyyyMMddhhmmss
        "destroy_person_name":"***"   //报废人name         
    }
    
]