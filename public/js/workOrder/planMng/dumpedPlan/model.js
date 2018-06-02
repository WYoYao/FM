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
        PMA.DP({order_type:this.cache.orderType},function(data){
            that.dumpedPlanList = JSON.parse(JSON.stringify(data || []));
        },function(){
            that.dumpedPlanList = [];
        },function(){
            $("#dumpedPlanPartLoad").phide();
        })

    }
});