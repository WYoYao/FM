// 计划管理通用
v.pushComponent({
    name: "term",
    data: {
        // 上一个页面
        lastPage:"",
        // 集团计划引用数量
        groupPlanUse:{
            total:0,
            unUse:0
        },
        // 所有工单类型
        allPlanType:[{tab_name:"全部",order_type:0},{tab_name:"维修",order_type:1},{tab_name:"计划",order_type:2},{tab_name:"巡检",order_type:3}],
    },
    methods: {
    },
    filters: {
        

        
    },
});