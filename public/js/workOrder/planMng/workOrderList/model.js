// 本页面需要传入cache
// 计划ID       planId
v.pushComponent({
    name: "workOrderList",
    data: {
        workOrderListData:[],
    },
    methods: {
        lookWorkOrderDetail : function(item){
            this.cache = {name:"工单详情",workOrderId:item.order_id};
            v.initPage('workOrderDetail');
        },
        selWorkOrderState : function(){
            controller.queryWoListByPlanId({plan_id:this.cache.planId,order_state:$("#workOrderListState").psel().id}).then(function(data){
                this.workOrderListData = JSON.parse(JSON.stringify(data.Content));
            }).catch(function(err){
                console.log(err);
            })
        }
    },
    computed: {

    },
    watch: {

    },
    beforeMount: function () {

        this.selWorkOrderState();

    }
})