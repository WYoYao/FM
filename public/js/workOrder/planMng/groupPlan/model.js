// 计划管理通用
v.pushComponent({
    name: "groupPlan",
    data: {
        groupPlanPaths:[
            {name:"首页",path:"planManage"},{name:"集团计划"}
        ],
        groupPlanList:[],
        planSiteType:[{name:"全部",id:2},{name:"是",id:1},{name:"否",id:0}]
    },
    methods: {

    },
    filters: {
        
    },
    beforeMount : function(){
        // 恢复配置先不管，反正数据都要重新拿
        var arr = [
            {name:"groupPlanList",data:{order_type:$("#groupPlanTypeCombo").psel.id,is_use_group_plan:$("#isPlanSite").psel().id}},
            {name:"groupPlanUse",data:{}}
        ]
        Promise.all(getData(arr)).then(function(data){
            this.groupPlanList = JSON.parse(JSON.stringify(data[0].Content));
            this.groupPlanUse = {
                total:data[1].Item.plan_total,
                unUse:data[1].Item.plan_unused_num
            }
        }).catch(function(err){

        })
    },
    watch:{

    }
});