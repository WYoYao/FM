// 计划管理通用
v.pushComponent({
    name: "term",
    data: {
        // 所有工单状态
        allOrderState:[],
        // 上一个页面
        lastPage:"",
        // 首次加载
        firstRender:{
            planManage:true,
        },
        // 配置缓存
        configCache:{
            planManage:null
        },
        // 集团计划引用数量
        groupPlanUse:{
            total:0,
            unUse:0
        },
        // 所有工单类型
        allPlanType:[{tab_name:"维修",order_type:0},{tab_name:"计划",order_type:1},{tab_name:"巡检",order_type:2}],
    },
    methods: {
    },
    filters: {
        
    },
    watch:{
        onPage:function(N,O){
            this.lastPage = O;
            switch(O){
            case 'planManage':
                v.instance.configCache.planManage = {
                    planType : $("#planTypeCombo").psel().id,
                    planSource : $("#planSourceCombo").psel().id,
                    time : v.instance.centerMonth,
                }
                // v.instance.allFreq.forEach(function(item,index){
                //     if(item.sel){ v.instance.configCache.planManage.freq = index; }
                // })
            break;
            default:

            }
        }
    }
});