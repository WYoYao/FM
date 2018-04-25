v.pushComponent({
    name: "dumpedPlan",
    data: {
        dumpedPlanPaths: [
            {name:"首页",path:"planManage"},{name:"已作废计划列表"}
        ],
        orderType:"",
        dumpedPlanList:[]
      },
    methods: {
        // 打开被废弃计划详情
        openDumpedPlan:function(model){
            v.initPage('planInformation',{planType:'orderD',planId:this.model.plan_id});
        }
    },
    filters: {
        
    },
    beforeMount:function(){
        $("#dumpedPlanPartLoad").pshow();
        getData([{name:"dumpedPlan",data:{order_type:this.orderType}}])[0].then(function(data){
            this.dumpedPlanList = JSON.parse(JSON.stringify(data.Content));
            $("#dumpedPlanPartLoad").phide();
        }).catch(function(err){
            $("#dumpedPlanPartLoad").phide();
        })
    }
});