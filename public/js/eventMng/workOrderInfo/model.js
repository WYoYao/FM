v.pushComponent({
    name: "workOrderInfo",
    data: {
    },
    methods: {
        evMngWorkOrderBack : function(fn){
            v.init.hasOwnProperty('eventManage') ? v.goBack('eventManage') : v.goBack('eventList');
        }
    },
    filters: {

    },
    watch: {

    },
    beforeMount : function(){
        // this.workOrderDetailReady();
    }
});