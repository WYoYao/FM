// 计划管理通用
v.pushComponent({
    name: "workOrderDetail",
    data: {
        // 工单详情数据
        orderDetailData:{},
        // 工单操作列表
        orderOperatList:[],
    },
    methods: {
        arrToString: function (arr) { //普通数组转字符串方法
            var arr = arr || [];
            var str = ''
            if (arr) {
                str = arr.join("、");
            } else {
                str = ""
            }
            return str;
        },
        nameArrToString: function (arr) { //普通数组转字符串方法
            var arr = arr || [];
            var str = ''
            if (arr) {
                str = arr.join("-");
            } else {
                str = ""
            }
            return str;
        },
    },
    filters: {
        
    },
    beforeMount : function(){
        var that = this;
        $("#workOrderDetailLoad").pshow();
        ajx("orderDetail",{order_id:this.cache.workOrderId},function(data){
            that.orderDetailData = JSON.parse(JSON.stringify(data.Content));
        },function(){
            that.orderDetailData = {};
        },function(){
            $("#workOrderDetailLoad").phide();
        })

    }
});