v.pushComponent({
    name: "planManage",
    data: {
        allPlanSource:[{name:"全部",id:""},{name:"引用集团计划",id:1},{name:"自定义计划",id:2}],
        allFreq:[{name:"每日",sel:true,id:"d"},{name:"每周",sel:false,id:"w"},{name:"每月",sel:false,id:"m"},{name:"每季",sel:false,id:"q"},{name:"每年",sel:false,id:"y"}],
        // 工单表格数据
        planData:[],
        // 时间数据
        dateData:{
            // lastMonth:{
            //     name:"",
            //     width:0
            // },
            // thisMonth:{
            //     name:"",
            //     width:0
            // },
            // nextMonth:{
            //     name:"",
            //     width:0
            // },
            day:[],
            width:0
        },
        centerMonth:null,
        // planManage页面下方表格高度
        residueHeight:0,
        // 集团计划引用数量
        groupPlanUse:{
            total:0,
            unUse:0
        },
        planManageState:{}
        
    },
    methods: {
        // 选择显示的计划频率
        changePlanFreq : function(item){
            if(item.sel){return}
            this.allFreq.forEach(function(model){
                model.sel = false;
            })
            item.sel = true;
            this.refreshRenderPMGrid(false);
        },
        // 状态存储
        planManageSt : function(name){
            var el = document.getElementById(name);
            if(this.planManageState[name] == undefined){this.planManageState[name] = ""}
            if(this.planManageState[name] == $(el).psel().id){ return }
            this.planManageState[name] = $(el).psel().id;
            this.refreshRenderPMGrid(false);
        },
        
        planManageCreateTime : function(){
            var date = new Date(this.centerMonth);
            // 获取这个月的月份以及天数
            var month = date.getMonth();
            month = month == 0 ? 1 : month + 1;
            var day = getThisAndLastMonthDays(this.centerMonth,true);
            var a = ('00' + month).substr(-2,2);
            this.dateData.startTime = "" + (month == 1 ? (date.getFullYear() - 1) : date.getFullYear()) + a;
            this.dateData.endTime = "" + (month == 12 ? (date.getFullYear() + 1) : date.getFullYear()) + a;

            var monthList = [{a:1,b:"一月"},{a:2,b:"二月"},{a:3,b:"三月"},{a:4,b:"四月"},{a:5,b:"五月"},{a:6,b:"六月"},{a:7,b:"七月"},{a:8,b:"八月"},{a:9,b:"九月"},{a:10,b:"十月"},{a:11,b:"十一月"},{a:12,b:"十二月"}]
            monthList.forEach(function(model){
                (model.a == month) && (month = model.b);
            });
            // 计算格子宽度
            var cell = (window.document.getElementById('getCellWidth').offsetWidth - (day - 1))/day;
            // 计算天的数据
            this.dateData.day = [];
            for(var i = 1 ;i < day+1;i++){
                this.dateData.day.push(i);
            }
            // 完善当前所能显示的最小以及最大时间存入时间数据
            var a = this.dateData.day[0];
            var b = this.dateData.day.pop();
            this.dateData.day.push(b);
            this.dateData.startTime += ('00' + a).substr(-2,2) + "000000";
            this.dateData.endTime += ('00' + b).substr(-2,2) + "235959";
            this.dateData.month = month;
            this.dateData.cell = cell;
        },

        // 首页时间插件被选择
        planTypeTimeSel : function(){
            // 更新中心月份数据，调用页面渲染函数
            if($("#planTypeTime").psel().startTime == this.centerMonth){return}
            this.centerMonth = $("#planTypeTime").psel().startTime;
            this.refreshRenderPMGrid(true);
        },
        // 首页点击切换月份
        changeMonth : function(type){
            // 更新中心月份数据，更新插件时间，调用页面渲染函数
            this.centerMonth = getCenterMonth(this.centerMonth,type);
            $("#planTypeTime").psel({startTime:this.centerMonth},false);
            this.refreshRenderPMGrid(true);
        },
        // 查看已经废弃的计划
        lookDiscardGroupPlan : function(){
            this.cache = {orderType : $("#planTypeCombo").psel().id,name:"已作废计划列表",}
            v.initPage('dumpedPlan');
        },
        // 跳转到集团计划
        openGroupModule : function(){
            this.cache = {name:"集团计划"};
            v.initPage('groupPlan');
        },
        // 查看计划详情
        openPlanDetail : function(item){
            this.cache = {name:"计划详情",planId:item.plan_id,planType:'order'};
            v.initPage("planInformation");
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
        // 页面滚动
        planMngScroll : function(ev){
            return
            if(ev.pEventAttr.currScrollTop >= ev.pEventAttr.maxScrollTop - 30){
                if(this.planData.length/this.pageSize + 1)
                this.refreshRenderPMGrid(false,ev.pEventAttr.currScrollTop);
            }
        },
        // 重新渲染表格
        // type为true时同时刷新时间部分和计划部分,否则只刷新计划部分,isscroll如果不传则重置计划信息
        refreshRenderPMGrid : function(type,isscroll){
            var that = this;
            if(type){this.planManageCreateTime()}
            !isscroll ? this.planData = [] : void 0;
            var param = this.createPlanOrderParam();
            var a = param.freq_cycle == 'd' ? PMA.DO : PMA.PO;
            $("#planManagePartLoading").pshow();
            a(param,function(data){
                data = data || [];
                if(data.length == 0){
                    $("#globalnotice").pshow({ text: "没有更多计划了", state: "success" });
                    return
                }else{
                    data = dataControll(JSON.parse(JSON.stringify(data)));
                    that.planData = that.planData.concat(data);
                    that.$nextTick(function(){
                        $("#countHT .grid .per-scrollbar").css('max-height',that.residueHeight - 131 + 'px');
                        $("#countHT .grid .per-scrollbar>div").css('height','auto');
                        $("#planManagePartLoading").phide();
                        isscroll ? $("#planMngScroll").psetScroll(isscroll,"vertical") : void 0;
                    })
                }
            },function(){
                $("#planManagePartLoading").phide();
            },function(){
            })
        },
        // 统一获取向后台获取计划工单数据时的参数
        createPlanOrderParam : function(){
            var param = {
                plan_name  : $("#planKeyword").pval().key,
                start_time : this.dateData.startTime,
                end_time   : this.dateData.endTime,
                pageSize   : this.pageSize,
                page       : this.planData.length/this.pageSize + 1,
            }
            this.allFreq.forEach(function(item){
                if(item.sel){param.freq_cycle = item.id}
            })
            param.plan_from = $("#planSourceCombo").psel().id ? $("#planSourceCombo").psel().id : "";
            param.order_type = $("#planTypeCombo").psel().id ? $("#planTypeCombo").psel().id : "";
            return param;
        },
    },
    filters: {

    },
    beforeMount : function(){
        var that = this;
        if(this.centerMonth === null ){ this.centerMonth = new Date().getTime(); } 
        // 如果工单状态为空说明为第一次加载，则获取所有工单状态和所有工单类型
        if(this.allOrderState.length === 0){
            // 获取工单状态数组
            PMA.OS({},function(data){
                data = JSON.parse(JSON.stringify(data));
                that.allOrderState = data || [];
                that.workOrderStateAndAll = [{name:"全部",code:""}].concat(that.allOrderState);
            },function(){
                that.allOrderState = [];
            },function(){});
            // 获取工单类型数组
            PMA.WT({},function(data){
                data = JSON.parse(JSON.stringify(data));
                that.allPlanType = data && data.length ? [{name:"全部",code:""}].concat(data) : [{name:"全部",code:""}];
            },function(){
                that.allPlanType = [{name:"全部",code:""}]
            },function(){});

        }
        // 获取集团计划引用及总数
        PMA.GPU({},function(data){
            data = data || {};
            that.groupPlanUse = {
                total:data.plan_total || 0,
                unUse:data.plan_unused_num || 0
            };
        },function(){
            that.groupPlanUse = {total:0,unUse:0};
        },function(){})

        this.$nextTick(function(){
            this.refreshRenderPMGrid(true);
            this.residueHeight = $("#countHT").height();
        })
    }
});