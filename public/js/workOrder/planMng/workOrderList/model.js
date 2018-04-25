v.pushComponent({
    name: "workOrderList",
    data: {
        workOrderListData:[],
        // 之前页面传递进来的工单状态以及工单计划ID
        workOrderListCache:{
            planType:"",
            orderStateName:"",
            planId:""
        }
    },
    methods: {
        lookWorkOrderDetail : function(item){
            v.initPage('workOrderDetail',{workOrderId:item.order_id});
        },
        selWorkOrderState : function(){
            controller.queryWoListByPlanId({plan_id:this.workOrderListCache.planId,order_state:$("#workOrderListState").psel().id}).then(function(data){
                this.workOrderListData = JSON.parse(JSON.stringify(data.Content));
            }).catch(function(err){
    
            })
        }
    },
    computed: {

    },
    watch: {

    },
    beforeMount: function () {

        controller.queryWoListByPlanId().then(function(data){
            this.workOrderListData = JSON.parse(JSON.stringify(data.Content));
        }).catch(function(err){

        })

    }
})