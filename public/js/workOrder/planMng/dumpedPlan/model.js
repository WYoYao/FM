v.pushComponent({
    name: "dumpedPlan",
    data: {
        dumpedPlanList:[]
      },
    methods: {
        // 打开被废弃计划详情
        openDumpedPlan:function(model){
            this.cache = {name:"已作废计划详情",planType:'orderD',planId:this.model.plan_id};
            v.initPage('planInformation');
        }
    },
    filters: {
        
    },
    beforeMount:function(){
        $("#dumpedPlanPartLoad").pshow();
        getData([{name:"dumpedPlan",data:{order_type:this.cache.orderType}}])[0].then(function(data){
            // this.dumpedPlanList = JSON.parse(JSON.stringify(data.Content));
            this.dumpedPlanList = xp;
            $("#dumpedPlanPartLoad").phide();
        }).catch(function(err){
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