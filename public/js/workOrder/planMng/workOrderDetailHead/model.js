// 需存入cache  workOrderId工单id
// 计划管理通用
v.pushComponent({
    name: "workOrderDetailHead",
    data: {
    },
    methods: {
    },
    filters: {
        
    },
    beforeMount : function(){
        this.workOrderDetailReady();
    }
});