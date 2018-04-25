// 计划管理通用
v.pushComponent({
    name: "workOrderDetail",
    data: {
        workOrderId:"",
        // 工单详情数据
        orderDetailData:{},
        // 工单操作列表
        orderOperatList:[],
        workOrderDetailPaths:[],
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
    },
    filters: {
        
    },
    beforeMount : function(){
        var that = this;


        this.workOrderDetailPaths = v.name.hasOwnProperty('term') ? [
            {name:"首页",path:"planManage"},{name:"工单详情"}
        ] : [

        ];


        getData([{name:"orderDetail",data:{order_id:this.workOrderId}}])[0].then(function(data){
            this.orderDetailData = JSON.parse(JSON.stringify(data.Content));
        })


    }
});