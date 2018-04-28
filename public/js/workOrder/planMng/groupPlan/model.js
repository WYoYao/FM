// 本页面需要传入cache
// 
// 计划管理通用
v.pushComponent({
    name: "groupPlan",
    data: {
        // groupPlanPaths:[
        //     {name:"首页",path:"planManage"},{name:"集团计划"}
        // ],
        groupPlanList:[],
        planSiteType:[{name:"全部",id:2},{name:"是",id:1},{name:"否",id:0}]
    },
    methods: {
        getGroupPlanList : function(){
            var that = this;
            
            $("#groupPlanPartLoad").pshow(); 

            ajx("groupPlanList",{order_type:$("#groupPlanTypeCombo").psel.id,is_use_group_plan:$("#isPlanSite").psel().id},function(data){
                that.groupPlanList = JSON.parse(JSON.stringify(data[0].Content));
            },function(){
                that.groupPlanList = [];
            },function(){
                $("#groupPlanPartLoad").phide(); 
            })

        },
        // type   'site'引用该计划   'copy'复制该计划
        getThisPlan : function(model,type){

        }
    },
    filters: {
        
    },
    beforeMount : function(){
        var arr = [
            {name:"groupPlanList",data:{order_type:$("#groupPlanTypeCombo").psel.id,is_use_group_plan:$("#isPlanSite").psel().id}},
            {name:"groupPlanUse",data:{}}
        ]
        $("#groupPlanPartLoad").pshow();
        Promise.all(cteatePromise(arr)).then(function(data){
            this.groupPlanList = JSON.parse(JSON.stringify(data[0].Content));
            this.groupPlanUse = {
                total:data[1].Item.plan_total,
                unUse:data[1].Item.plan_unused_num
            }
            $("#groupPlanPartLoad").phide();          
        }).catch(function(err){
            $("#groupPlanPartLoad").phide();
        })

    this.groupPlanList = [
        {
            "group_plan_id":"***",            //集团计划id
            "group_plan_name":"***",          //集团计划名称
            "order_type": "***",              //工单类型编码
            "order_type_name": "***",         //工单类型名称
            "freq_cycle":"m",                 //计划频率-周期，y/m/w/d
            "freq_num":"3",                   //计划频率-次数，n
            "urgency":"高",                   //紧急程度 ，高、中、低
            "use_status":"1"                  //引用状态，1-已引用，2-未引用
        },
        {
            "group_plan_id":"***",            //集团计划id
            "group_plan_name":"***",          //集团计划名称
            "order_type": "***",              //工单类型编码
            "order_type_name": "***",         //工单类型名称
            "freq_cycle":"m",                 //计划频率-周期，y/m/w/d
            "freq_num":"3",                   //计划频率-次数，n
            "urgency":"高",                   //紧急程度 ，高、中、低
            "use_status":"1"                  //引用状态，1-已引用，2-未引用
        },
        {
            "group_plan_id":"***",            //集团计划id
            "group_plan_name":"***",          //集团计划名称
            "order_type": "***",              //工单类型编码
            "order_type_name": "***",         //工单类型名称
            "freq_cycle":"m",                 //计划频率-周期，y/m/w/d
            "freq_num":"3",                   //计划频率-次数，n
            "urgency":"高",                   //紧急程度 ，高、中、低
            "use_status":"1"                  //引用状态，1-已引用，2-未引用
        },
        {
            "group_plan_id":"***",            //集团计划id
            "group_plan_name":"***",          //集团计划名称
            "order_type": "***",              //工单类型编码
            "order_type_name": "***",         //工单类型名称
            "freq_cycle":"m",                 //计划频率-周期，y/m/w/d
            "freq_num":"3",                   //计划频率-次数，n
            "urgency":"高",                   //紧急程度 ，高、中、低
            "use_status":"1"                  //引用状态，1-已引用，2-未引用
        },
        {
            "group_plan_id":"***",            //集团计划id
            "group_plan_name":"***",          //集团计划名称
            "order_type": "***",              //工单类型编码
            "order_type_name": "***",         //工单类型名称
            "freq_cycle":"m",                 //计划频率-周期，y/m/w/d
            "freq_num":"3",                   //计划频率-次数，n
            "urgency":"高",                   //紧急程度 ，高、中、低
            "use_status":"1"                  //引用状态，1-已引用，2-未引用
        },
    ]



    },
    watch:{

    }
});