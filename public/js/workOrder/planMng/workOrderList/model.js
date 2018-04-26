// 本页面需要传入cache
// 计划ID       planId
v.pushComponent({
    name: "workOrderList",
    data: {
        workOrderListData:[],
    },
    methods: {
        lookWorkOrderDetail : function(item){
            v.initPage('workOrderDetail',{workOrderId:item.order_id});
        },
        selWorkOrderState : function(){
            controller.queryWoListByPlanId({plan_id:this.cache.planId,order_state:$("#workOrderListState").psel().id}).then(function(data){
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