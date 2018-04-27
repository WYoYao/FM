v.pushComponent({
    name: "monitoringPlan",
    data: {
        // 时间数据
        timeData:{
            time:null,
            month:"",
            day:[],
            startTime:"",
            endTime:""
        },
        // 所有频率
        fiveFreq:[{name:"每日",sel:true,id:"d"},{name:"每周",sel:false,id:"w"},{name:"每月",sel:false,id:"m"},{name:"每季",sel:false,id:"q"},{name:"每年",sel:false,id:"y"}],
        // 表格数据
        monitoringGrid:[],
        // 项目计划更新状态
        isUpdateGPWO:[{name:"全部",id:""},{name:"已更新",id:"1"},{name:"未更新",id:"0"}],
        // 没有引用本集团计划的项目列表
        notCitePlanList:[],
    },

    methods: {
        // 生成时间数据
        creatTimeData: function(){

            // 将时间对象修正为每一天的第一秒,day为true则顺带修正为第一天
            function t(date,day){
                day ? date.setDate(1) : void 0;
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                return date;
            }

            // 获取该月的天数
            function gd(num){
                var a = t(new Date(num),true);    
                var month = a.getMonth();
                a.setMonth(month + 1);
                a.setDate(0);
                return a.getDate();
            }

            var d = this.timeData;

            d.month = new Date(d.time).getMonth() + 1;
            var list = {1:"一月",2:"二月",3:"三月",4:"四月",5:"五月",6:"六月",7:"七月",8:"八月",9:"九月",10:"十月",11:"十一月",12:"十二月"};
            d.month = list[d.month];

            d.day = [];
            for(var i =1;i < gd(d.time) + 1;i++){
                d.day.push(i);  
            }

            var x = t(new Date(d.time),true);

            d.startTime = x.getTime();
            d.endTime = "" + x.getFullYear() + (x.getMonth()+1) + gd(d.time) + "235959";

        },
        // 用户选择计划频率
        selGroupFreq : function(model){
            this.fiveFreq.forEach(function(item){
                item.sel = false;
            })
            model.sel = true;
            this.createGroupOrderGrid();
        },
        // 用户选择时间
        selOrderTime : function(){
            this.timeData.time = new Date($("#divCalendar").psel().startTime).getTime();
            this.creatTimeData();
            this.createGroupOrderGrid();
        },
        // 生成表格数据
        createGroupOrderGrid : function(){
            var param = {
                group_plan_id:this.cache.groupPlanId,
                is_update_group_plan:$("#isUpdateGroupPlan").psel().id,
                freq_cycle:this.fiveFreq.forEach(function(item){
                    if(item.sel){return item.id}
                }),
                start_time:this.timeData.startTime,
                end_time:this.timeData.endTime
            }
            // 根据计划频率调相应接口拿数据
            var p = param.freq_cycle === 'd' ? controller.queryWoPlanDayExecuteList : controller.queryWoPlanExecuteList;

            p().then(function(data){
                this.monitoringGrid = groupDataControll(JSON.parse(JSON.stringify(data.Content)));
            }).catch(function(err){

            })

        }
    },
    computed: {

    },
    watch: {

    },
    beforeMount: function () {
        // 如果时间为空则重置时间并获取时间数据，否则直接拿数据就行
        if(this.timeData.time === null){
            this.timeData.time = new Date().getTime();
            this.creatTimeData();
        }
        this.createGroupOrderGrid();
        // 获取没有引用本计划的项目列表
        controller.queryUnuseGroupPlanProjectList().then(function(data){
            this.notCitePlanList = JSON.parse(JSON.stringify(data.Content));
        }).catch(function(err){

        })



        
        this.monitoringGrid = groupDataControll(JSON.parse(JSON.stringify(hhh.Content)));
    }
})









window.hhh = {
    "Result": "success",
    "Content": [
      {
        "plan_id":"***",                //计划id
        "project_id":"***",             //项目id
        "project_name":"***",           //项目名称
        "is_update_group_plan":"***" ,   //是否更新集团计划，1-已更新、0-未更新
        "create_wo_total":"8"       ,    //发单总数
        "uncreate_wo_total":"2"   ,      //未发出数
        "executing_wo_total":"2"  ,      //执行中数
        "finished_wo_total":"2" ,        //已完成数
        "row_count":3,                  //行数
        "work_orders":[                 //时间段内生成工单数组
            {
                "order_id": "Wo13010200015dc32a0ca3b746e5bff69575a5769577",
                "ask_start_time": "20180501000000",
                "ask_end_time": "20180501000000",
                "order_state": "4",
                "is_next_order": false
            },
            {
                "order_id": "Wo1301020001f253969a926444c48834a3764b5039b8",
                "ask_start_time": "20180501000000",
                "ask_end_time": "20180501000000",
                "order_state": "4",
                "is_next_order": false
            }
        ]            
      },
     {
        "plan_id":"***",                //计划id
        "project_id":"***",             //项目id
        "project_name":"***",           //项目名称
        "is_update_group_plan":"***" ,   //是否更新集团计划，1-已更新、0-未更新
        "create_wo_total":"8"     ,      //发单总数
        "uncreate_wo_total":"2"    ,     //未发出数
        "executing_wo_total":"2"  ,      //执行中数
        "finished_wo_total":"2"   ,      //已完成数
        "row_count":3,                  //行数
        "work_orders":[                 //时间段内生成工单数组
            {
                "order_id": "Wo13010200015dc32a0ca3b746e5bff69575a5769577",
                "ask_start_time": "20180501000000",
                "ask_end_time": "20180509000000",
                "order_state": "4",
                "is_next_order": false
            },
            {
                "order_id": "Wo1301020001f253969a926444c48834a3764b5039b8",
                "ask_start_time": "20180501000000",
                "ask_end_time": "20180501000000",
                "order_state": "4",
                "is_next_order": false
            }
        ]            
      }
    ],
    "Count": 2,
  }