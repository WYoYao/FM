// 本页面需要传入cache
// 工单计划Id    orderPlanId
v.pushComponent({
  name: "planWorkOrder",
  data: {
    planWorkOrderData: []
  },
  methods: {
  },
  filters: {
      
  },
  beforeMount:function(){
    
    var that = this;
    $("#workOrderStateSel").psel(0,false);
    $("#planWorkOrderLoad").pshow();

    // 获取计划工单
    PMA.PWO({plan_id:this.cache.orderPlanId,order_state:$("#workOrderStateSel").psel().id},function(data){
      that.planWorkOrderData = JSON.parse(JSON.stringify(data || []));
    },function(err){
      that.planWorkOrderData = [];
    },function(){
      $("#planWorkOrderLoad").phide();
    })
    
  }
});