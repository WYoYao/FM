v.pushComponent({
    name: "planManage",
    data: {
        allPlanSource:[{name:"全部",id:0},{name:"引用集团计划",id:1},{name:"自定义计划",id:2}],
        allFreq:[{name:"每日",sel:true,id:"d"},{name:"每周",sel:false,id:"w"},{name:"每月",sel:false,id:"m"},{name:"每季",sel:false,id:"q"},{name:"每年",sel:false,id:"y"}],
        // 工单表格数据
        planData:[],
        // 时间数据
        dateData:{
            lastMonth:{
                name:"",
                width:0
            },
            thisMonth:{
                name:"",
                width:0
            },
            nextMonth:{
                name:"",
                width:0
            },
            day:[],
            width:0
        },
        centerMonth:null,
        // planManage页面下方表格高度
        residueHeight:600,
        // 集团计划引用数量
        groupPlanUse:{
            total:0,
            unUse:0
        },
        
    },
    methods: {
        // 选择显示的计划频率
        changePlanFreq : function(item){
            this.allFreq.forEach(function(model){
                model.sel = false;
            })
            item.sel = true;
            this.refreshRenderGrid(false);
        },
        // 构建时间数据
        createTimeData : function(){
            // 构建当前中心月对象
            var date = new Date(this.centerMonth);
            // 获取上个月及这个月的天数
            var days = getThisAndLastMonthDays(this.centerMonth);
            // 计算月份数据
            // 获取需要显示的3个月份
            var month = date.getMonth();
            month = [
                month == 0 ? 12 : month,
                month == 0 ? 1 : month + 1,
                month == 0 ? 2 : month == 11 ? 1 : month + 2
            ]
            // 获取当前所能显示的最小以及最大时间，在函数最后进行补充
            var a = String(month[0]).length == 1 ? "0" + month[0] : month[0];
            var b = String(month[2]).length == 1 ? "0" + month[2] : month[2];
            this.dateData.startTime = "" + (month[1] == 1 ? (date.getFullYear() - 1) : date.getFullYear()) + a;
            this.dateData.endTime = "" + (month[1] == 12 ? (date.getFullYear() + 1) : date.getFullYear()) + b;
            var monthList = [{a:1,b:"一月"},{a:2,b:"二月"},{a:3,b:"三月"},{a:4,b:"四月"},{a:5,b:"五月"},{a:6,b:"六月"},{a:7,b:"七月"},{a:8,b:"八月"},{a:9,b:"九月"},{a:10,b:"十月"},{a:11,b:"十一月"},{a:12,b:"十二月"}]
            month = month.map(function(item){
                monthList.forEach(function(model){
                    model.a != item ? void 0 : item = model.b;
                })
                return item
            })
            // 这个月的天数
            var thisMonthDay = days.this;
            // 计算格子宽度
            var width = window.document.getElementById('getCellWidth').offsetWidth;
            var cell = width/(thisMonthDay + 4);
            // 计算3个月份宽度
            var a = cell*2 - 1;
            var b = cell*thisMonthDay - 1;
            var c = 2*a + b + 3 > width ? width - a - b - 3 :a;
            this.dateData.lastMonth = {name:month[0],width:a};
            this.dateData.thisMonth = {name:month[1],width:b};
            this.dateData.nextMonth = {name:month[2],width:c};
            // 计算天的数据
            this.dateData.day = [];
            this.dateData.day.push(days.last-1,days.last);
            for(var i = 1 ;i < days.this + 1;i++){
                this.dateData.day.push(i);
            }
            this.dateData.day.push(1,2);
            this.dateData.width = cell - 1;
            // 完善当前所能显示的最小以及最大时间存入时间数据
            var a = this.dateData.day[0];
            var b = this.dateData.day.pop();
            this.dateData.day.push(b);
            a = String(a).length == 1 ? "0" + a : a;
            b = String(b).length == 1 ? "0" + b : b;
            this.dateData.startTime += a + "000000";
            this.dateData.endTime += b + "235959";
        },
        // 首页时间插件被选择
        planTypeTimeSel : function(){
            // 更新中心月份数据，调用页面渲染函数
            this.centerMonth = $("#planTypeTime").psel().startTime;
            this.refreshRenderGrid(true);
        },
        // 首页点击切换月份
        changeMonth : function(type){
            // 更新中心月份数据，更新插件时间，调用页面渲染函数
            this.centerMonth = getCenterMonth(this.centerMonth,type);
            $("#planTypeTime").psel({startTime:this.centerMonth},false);
            this.refreshRenderGrid(true);
        },
        // 查看已经废弃的计划
        lookDiscardGroupPlan : function(){
            this.cache = {
                orderType : $("#planTypeCombo").psel().code,
                name:"已作废计划列表",
            }
            v.initPage('dumpedPlan');
        },
        // 跳转到集团计划首页
        openGroupModule : function(){
            this.cache = {name:"集团计划"};
            v.initPage('groupPlan');
        },
        // 查看计划详情
        openPlanDetail : function(item){
            this.cache = {name:"计划详情",planId:item.plan_id,planType:'order'};
            v.initPage("planInformation");
        },
        // 查看工单详情
        openOrderDetail : function(model){
            if(model.type === ''){
                return
            }
            this.cache = {name:"工单详情",workOrderId:model.id};
            v.initPage("workOrderDetail");
        },
        // 创建计划
        createTermPlan : function(){
            v.instance.cache = {
                argu: {
                    isquote: false,
                    isedit: false,
                    isterm: true,
                    iscopy:false,
                    addWoPlan: {},
                    cb: function () {
                        v.goBack('planManage',true);
                    }
                },
            };
            v.initPage("createPlan");
        },
        // 重新渲染表格
        // type为true时同时刷新时间部分和计划部分,否则只刷新计划部分
        refreshRenderGrid : function(type){
            var that = this;

            // $("#planManagePartLoad").pshow();

            if(type){this.createTimeData()}

            // 构建参数
            var param = this.createPlanOrderParam();

            // ajx(param.freq_cycle == 'd' ? "dayOrder" : "planOrder",param,function(data){
            //     data = JSON.parse(JSON.stringify(data.Content));
            //     that.planData = dataControll(data);
            // },function(){
            //     that.planData = [];
            // },function(){
            //     $("#planManagePartLoad").phide();
            // })

            // faker
            v.instance.planData = dataControll( _.range(_.random(20, 50)).map((index) => {
                let count = _.random(5, 10);
                let create_wo_total = _.random(1, 5);
                let uncreate_wo_total = _.random(1, count - create_wo_total);
            
                return {
                    "plan_id": "计划id",                //计划id
                    "plan_name": "计划id",                //计划id
                    "project_id": "项目id",             //项目id
                    "project_name": "项目名称",           //项目名称
                    "is_update_group_plan": _.random(0, 1),    //是否更新集团计划，1-已更新、0-未更新
                    "create_wo_total": create_wo_total,           //发单总数
                    "uncreate_wo_total": uncreate_wo_total,         //未发出数
                    "executing_wo_total": _.random(0, 5),        //执行中数
                    "finished_wo_total": _.random(0, 5),         //已完成数
                    "row_count": 3,                  //行数
                    "work_orders": _.chunk(_.range(_.random(28, 31)).map(item => ++item), 4).map((item, index) => {
            
                        var obj = {
                            order_id: "1231",
                            "ask_start_time": "2018" + ('00' + Math.floor(Math.random()*12)).slice(-2) + ("00" + item.slice(0, 1)).slice(-2) + "000000",   //要求开始时间,yyyyMMddhhmmss
                            "ask_end_time": "2018"  + ('00' + Math.floor(Math.random()*12)).slice(-2) + ("00" + item.slice(-1)).slice(-2) + "000000",     //要求结束时间,yyyyMMddhhmmss
                            "order_state": "1"       //工单状态编码，优先返回自定义状态
                        };
            
                        return obj;
                    })
                }
            }));

        },
        // 统一获取向后台获取计划工单数据时的参数
        createPlanOrderParam : function(){
            var param = {
                order_type : $("#planTypeCombo").psel().code,
                plan_from : $("#planSourceCombo").psel().id,
                plan_name : $("#planKeyword").pval().key,
                freq_cycle : "",
                start_time:this.dateData.startTime,
                end_time:this.dateData.endTime
            }
            this.allFreq.forEach(function(item){
                if(item.sel){param.freq_cycle = item.id}
            })
            return param;
        },
    },
    filters: {

    },
    beforeMount : function(){

        var that = this;

        if(this.centerMonth === null ){ this.centerMonth = new Date().getTime(); } 

        // 如果工单状态为空说明为第一次加载，则获取常量数据所有工单状态和所有工作状态
        if(this.allOrderState == []){
            var list = cteatePromise([
                {name:"orderState",data:{"dict_type": "work_order_state"}},
                {name:"workType",data:{"dict_type": "work_type"}},
                
            ]);
            Promise.all(list).then(function(data){
                that.allOrderState = that.allOrderState.concat(JSON.parse(JSON.stringify(data[0])));
                that.allPlanType = [{name:"全部",code:""}].concat(JSON.parse(JSON.stringify(data[1])));
                // 修改默认的三种工单状态Id
                that.workOrderState.forEach(function(item){
                    v.instance.allOrderState.forEach(function(model){
                        item.name == model.name ? item.id = model.code : void 0;
                    })
                })
                // 生成带全部的工单状态数组
                that.workOrderStateAndAll = [{name:"全部",code:""}].concat(that.allOrderState);
            }).catch(function(err){

            })
        }

        ajx("groupPlanUse",{},function(data){
            that.groupPlanUse = {
                total:data.Item.plan_total,
                unUse:data.Item.plan_unused_num
            }
        },function(){},function(){})

        this.$nextTick(function(){
            this.refreshRenderGrid(true);
        })
    }
});
window.prc = {

    "data": [
      {
        "plan_id": "JH1510145828954",
        "plan_name": "wxmz",
        "remind_type": 1,
        "plan_end_time": "--",
        "freq_cycle": "d",
        "freq_num": 6,
        "max_freq_num": 6,
        "plan_from":1,
        "plan_update_status":0,
        "remind_type" : 1,
        "freq_cycle_desc": "每天6次",
        "row_count": 1,
        "work_order_date": [
            {
                "work_order":[
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
                },
                {
                    "order_id": "",
                    "ask_start_time": "20180501000000",
                    "ask_end_time": "20180501000000",
                    "order_state": "3",
                    "is_next_order": true
                },
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
                },
                {
                    "order_id": "",
                    "ask_start_time": "20180501000000",
                    "ask_end_time": "20180501000000",
                    "order_state": "2",
                    "is_next_order": true
                }
            ]},
            {"work_order":[
                {
                    "order_id": "Wo13010200015dc32a0ca3b746e5bff69575a5769577",
                    "ask_start_time": "20180503000000",
                    "ask_end_time": "20180503000000",
                    "order_state": "4",
                    "is_next_order": false
                },
                {
                    "order_id": "Wo1301020001f253969a926444c48834a3764b5039b8",
                    "ask_start_time": "20180503000000",
                    "ask_end_time": "20180503000000",
                    "order_state": "4",
                    "is_next_order": false
                },
                {
                    "order_id": "",
                    "ask_start_time": "20180503000000",
                    "ask_end_time": "20180503000000",
                    "order_state": "1",
                    "is_next_order": true
                }

            ]}
        ]
      },
  {
        "plan_id": "JH1510145828954",
        "plan_name": "wxmz",
        "remind_type": 1,
        "plan_end_time": "--",
        "freq_cycle": "w",
        "freq_num": 1,
        "freq_cycle_desc": "每周1次",
        "row_count": 1,
        "plan_from":1,
        "plan_update_status":0,
        "work_orders": [
        ]
      },
  {
        "plan_id": "JH1510145828954",
        "plan_name": "wxmz",
        "remind_type": 1,
        "plan_end_time": "--",
        "freq_cycle": "w",
        "freq_num": 1,
        "freq_cycle_desc": "每周1次",
        "row_count": 1,
        "work_orders": [
          {
            "order_id": "Wo13010200015dc32a0ca3b746e5bff69575a5769577",
            "ask_start_time": "20180802000000",
            "ask_end_time": "20181002000000",
            "order_state": "4",
            "is_next_order": false
          },
          {
            "order_id": "Wo1301020001f253969a926444c48834a3764b5039b8",
            "ask_start_time": "20180509000000",
            "ask_end_time": "20180509000000",
            "order_state": "4",
            "is_next_order": false
          },
          {
            "order_id": "",
            "ask_start_time": "20180516000000",
            "ask_end_time": "20180523000000",
            "order_state": "",
            "is_next_order": true
          }
        ]
      },
      {
            "plan_id": "JH1510145828954",
            "plan_name": "wxmz",
            "remind_type": 1,
            "plan_end_time": "--",
            "freq_cycle": "w",
            "freq_num": 1,
            "freq_cycle_desc": "每周1次",
            "row_count": 1,
            "work_orders": [
              {
                "order_id": "Wo13010200015dc32a0ca3b746e5bff69575a5769577",
                "ask_start_time": "20180802000000",
                "ask_end_time": "20181002000000",
                "order_state": "4",
                "is_next_order": false
              },
              {
                "order_id": "Wo1301020001f253969a926444c48834a3764b5039b8",
                "ask_start_time": "20180509000000",
                "ask_end_time": "20180509000000",
                "order_state": "4",
                "is_next_order": false
              },
              {
                "order_id": "",
                "ask_start_time": "20180516000000",
                "ask_end_time": "20180523000000",
                "order_state": "",
                "is_next_order": true
              }
            ]
          },
          {
                "plan_id": "JH1510145828954",
                "plan_name": "wxmz",
                "remind_type": 1,
                "plan_end_time": "--",
                "freq_cycle": "w",
                "freq_num": 1,
                "freq_cycle_desc": "每周1次",
                "row_count": 1,
                "work_orders": [
                  {
                    "order_id": "Wo13010200015dc32a0ca3b746e5bff69575a5769577",
                    "ask_start_time": "20180802000000",
                    "ask_end_time": "20181002000000",
                    "order_state": "4",
                    "is_next_order": false
                  },
                  {
                    "order_id": "Wo1301020001f253969a926444c48834a3764b5039b8",
                    "ask_start_time": "20180509000000",
                    "ask_end_time": "20180509000000",
                    "order_state": "4",
                    "is_next_order": false
                  },
                  {
                    "order_id": "",
                    "ask_start_time": "20180516000000",
                    "ask_end_time": "20180523000000",
                    "order_state": "",
                    "is_next_order": true
                  }
                ]
              },
              {
                    "plan_id": "JH1510145828954",
                    "plan_name": "wxmz",
                    "remind_type": 1,
                    "plan_end_time": "--",
                    "freq_cycle": "w",
                    "freq_num": 1,
                    "freq_cycle_desc": "每周1次",
                    "row_count": 1,
                    "work_orders": [
                      {
                        "order_id": "Wo13010200015dc32a0ca3b746e5bff69575a5769577",
                        "ask_start_time": "20180802000000",
                        "ask_end_time": "20181002000000",
                        "order_state": "4",
                        "is_next_order": false
                      },
                      {
                        "order_id": "Wo1301020001f253969a926444c48834a3764b5039b8",
                        "ask_start_time": "20180509000000",
                        "ask_end_time": "20180509000000",
                        "order_state": "4",
                        "is_next_order": false
                      },
                      {
                        "order_id": "",
                        "ask_start_time": "20180516000000",
                        "ask_end_time": "20180523000000",
                        "order_state": "",
                        "is_next_order": true
                      }
                    ]
                  },
                  {
                        "plan_id": "JH1510145828954",
                        "plan_name": "wxmz",
                        "remind_type": 1,
                        "plan_end_time": "--",
                        "freq_cycle": "w",
                        "freq_num": 1,
                        "freq_cycle_desc": "每周1次",
                        "row_count": 1,
                        "work_orders": [
                          {
                            "order_id": "Wo13010200015dc32a0ca3b746e5bff69575a5769577",
                            "ask_start_time": "20180802000000",
                            "ask_end_time": "20181002000000",
                            "order_state": "4",
                            "is_next_order": false
                          },
                          {
                            "order_id": "Wo1301020001f253969a926444c48834a3764b5039b8",
                            "ask_start_time": "20180509000000",
                            "ask_end_time": "20180509000000",
                            "order_state": "4",
                            "is_next_order": false
                          },
                          {
                            "order_id": "",
                            "ask_start_time": "20180516000000",
                            "ask_end_time": "20180523000000",
                            "order_state": "",
                            "is_next_order": true
                          }
                        ]
                      },
                      {
                            "plan_id": "JH1510145828954",
                            "plan_name": "wxmz",
                            "remind_type": 1,
                            "plan_end_time": "--",
                            "freq_cycle": "w",
                            "freq_num": 1,
                            "freq_cycle_desc": "每周1次",
                            "row_count": 1,
                            "work_orders": [
                              {
                                "order_id": "Wo13010200015dc32a0ca3b746e5bff69575a5769577",
                                "ask_start_time": "20180802000000",
                                "ask_end_time": "20181002000000",
                                "order_state": "4",
                                "is_next_order": false
                              },
                              {
                                "order_id": "Wo1301020001f253969a926444c48834a3764b5039b8",
                                "ask_start_time": "20180509000000",
                                "ask_end_time": "20180509000000",
                                "order_state": "4",
                                "is_next_order": false
                              },
                              {
                                "order_id": "",
                                "ask_start_time": "20180516000000",
                                "ask_end_time": "20180523000000",
                                "order_state": "",
                                "is_next_order": true
                              }
                            ]
                          },
  {
        "plan_id": "JH1510145828954",
        "plan_name": "wxmz",
        "remind_type": 1,
        "plan_end_time": "--",
        "freq_cycle": "w",
        "freq_num": 1,
        "freq_cycle_desc": "每周1次",
        "row_count": 1,
        "work_orders": [
        ]
      },
  {
        "plan_id": "JH1510145828954",
        "plan_name": "wxmz",
        "remind_type": 1,
        "plan_end_time": "--",
        "freq_cycle": "w",
        "freq_num": 1,
        "freq_cycle_desc": "每周1次",
        "row_count": 1,
        "work_orders": [
          {
            "order_id": "Wo13010200015dc32a0ca3b746e5bff69575a5769577",
            "ask_start_time": "20180402000000",
            "ask_end_time": "20180402000000",
            "order_state": "4",
            "is_next_order": false
          },
          {
            "order_id": "Wo1301020001f253969a926444c48834a3764b5039b8",
            "ask_start_time": "20180409000000",
            "ask_end_time": "20180409000000",
            "order_state": "4",
            "is_next_order": false
          },
          {
            "order_id": "",
            "ask_start_time": "20180416000000",
            "ask_end_time": "20180423000000",
            "order_state": "",
            "is_next_order": true
          }
        ]
      }
    ],
    "count": 1
  }


  window.prc = _.range(_.random(20, 50)).map((index) => {
    let count = _.random(5, 10);
    let create_wo_total = _.random(1, 5);
    let uncreate_wo_total = _.random(1, count - create_wo_total);

    return {
        "plan_id": "计划id",                //计划id
        "plan_name": "计划id",                //计划id
        "project_id": "项目id",             //项目id
        "project_name": "项目名称",           //项目名称
        "is_update_group_plan": _.random(0, 1),    //是否更新集团计划，1-已更新、0-未更新
        "create_wo_total": create_wo_total,           //发单总数
        "uncreate_wo_total": uncreate_wo_total,         //未发出数
        "executing_wo_total": _.random(0, 5),        //执行中数
        "finished_wo_total": _.random(0, 5),         //已完成数
        "row_count": 3,                  //行数
        "work_orders": _.chunk(_.range(_.random(28, 31)).map(item => ++item), 4).map((item, index) => {

            var obj = {
                order_id: "1231",
                "ask_start_time": "201805" + ("00" + item.slice(0, 1)).slice(-2) + "000000",   //要求开始时间,yyyyMMddhhmmss
                "ask_end_time": "201805" + ("00" + item.slice(-1)).slice(-2) + "000000",     //要求结束时间,yyyyMMddhhmmss
                "order_state": "1"       //工单状态编码，优先返回自定义状态
            };

            return obj;
        })
    }
})