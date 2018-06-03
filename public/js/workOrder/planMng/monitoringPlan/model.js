v.pushComponent({
    name: "monitoringPlan",
    data: {
        // 时间数据
        timeData: {
            time: null,
            month: "",
            day: [],
            startTime: "",
            endTime: ""
        },
        // 所有频率
        fiveFreq: [{ name: "每日", sel: false, id: "d" }, { name: "每周", sel: false, id: "w" }, { name: "每月", sel: false, id: "m" }, { name: "每季", sel: false, id: "q" }, { name: "每年", sel: false, id: "y" }],
        // 表格数据
        monitoringGrid: [],
        // 项目计划更新状态
        isUpdateGPWO: [{ name: "全部", id: "" }, { name: "已更新", id: "1" }, { name: "未更新", id: "0" }],
        // 没有引用本集团计划的项目列表
        notCitePlanList: [],
        // 工单状态集合
        WorkOrderStateList: [],
    },

    methods: {
        // 打开项目计划详情
        openPlanDetail: function (model) {
            this.cache = { planType: 'project', planId: model.plan_id, name: "项目计划详情", project_id: model.project_id, project_name: model.project_name };
            v.initPage('planInformation');
        },
        // 生成时间数据
        creatTimeData: function () {

            // 将时间对象修正为每一天的第一秒,day为true则顺带修正为第一天
            function t(date, day) {
                day ? date.setDate(1) : void 0;
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                return date;
            }

            // 获取该月的天数
            function gd(num) {
                var a = t(new Date(num), true);
                var month = a.getMonth();
                a.setMonth(month + 1);
                a.setDate(0);
                return a.getDate();
            }

            var d = this.timeData;

            d.month = new Date(d.time).getMonth() + 1;
            var list = { 1: "一月", 2: "二月", 3: "三月", 4: "四月", 5: "五月", 6: "六月", 7: "七月", 8: "八月", 9: "九月", 10: "十月", 11: "十一月", 12: "十二月" };
            d.month = list[d.month];

            d.day = [];
            for (var i = 1; i < gd(d.time) + 1; i++) {
                d.day.push(i);
            }

            var x = t(new Date(d.time), true);

            d.startTime = x.format("yyyyMMddhhmmss");
            d.endTime = "" + x.getFullYear() + ("00" + (x.getMonth() + 1)).slice(-2) + gd(d.time) + "235959";

        },
        // 用户选择计划频率
        selGroupFreq: function (model) {
            return;
            this.fiveFreq.forEach(function (item) {
                item.sel = false;
            })
            model.sel = true;
            this.createGroupOrderGrid();
        },
        // 用户选择时间
        selOrderTime: function () {
            this.timeData.time = new Date($("#divCalendar").psel().startTime).getTime();
            this.creatTimeData();
            this.createGroupOrderGrid();
        },
        // 生成表格数据
        createGroupOrderGrid: function () {
            var _that = this;
            var param = {
                group_plan_id: this.cache.group_plan_id,
                is_update_group_plan: $("#isUpdateGroupPlan").psel().id,
                freq_cycle: "",
                start_time: (this.timeData.startTime || new Date().format("yyyyMMddhhmmss")),
                end_time: (this.timeData.endTime || new Date().format("yyyyMMdd235959")),
            };
            this.fiveFreq.forEach(function (item) { item.sel && (param.freq_cycle = item.id); });
            param.freq_cycle || (param.freq_cycle = this.cache.freq_cycle);
            var p = param.freq_cycle === 'd' ? PMA.GDO : PMA.GPO;
            $("#moniPlanLoading").pshow();
            p(param, function (data) {
                _that.monitoringGrid = groupDataControll(data && data.length || []);
            }, function () { }, function () {
                $("#moniPlanLoading").phide();
            })
        },
        // 查询工单管理
        queryOrderManage: function (planId, order_state,project_id) {
            this.cache = {
                order_state: order_state,
                planId: planId,
                project_id:project_id,
                name: "工单列表",
            };
            v.initPage("workOrderList");
        },
    },
    computed: {

    },
    watch: {

    },
    beforeMount: function () {
        var _that = this,
            req = JSON.parse(JSON.stringify(_that.cache));

        // 默认频率
        (_.find(_that.fiveFreq, { id: req.freq_cycle }) || {}).sel = true;

        // 如果时间为空则重置时间并获取时间数据，否则直接拿数据就行
        if (_that.timeData.time === null) {
            _that.timeData.time = new Date().getTime();
            _that.creatTimeData();
        }
        // 获取创建表格数据
        _that.createGroupOrderGrid();
        // 获取没有引用本计划的项目列表
        $("#unUseGPProLoading").pshow();
        controller.queryUnuseGroupPlanProjectList({ group_plan_id: req.group_plan_id }).then(function (data) {
            _that.notCitePlanList = JSON.parse(JSON.stringify(data || []));
            $("#unUseGPProLoading").phide();
        }).catch(function (err) {
            _that.notCitePlanList = [];
            $("#unUseGPProLoading").phide();
        })
        // 查询工单状态
        _that.allOrderState.length === 0 ? controller.queryWorkOrderState().then(function (res) {
            _that.allOrderState = res;
            _that.workOrderStateAndAll = [{ name: "全部", code: "" }].concat(res);
            _that.$nextTick(function () {
                var arr = Array.prototype.slice.call($("#app .monitoring_plan .main .content .contenter .status_view .icon_list .item .icon img"));
                arr.forEach(function (item, index) {
                    item.onerror = function () {
                        $(item).hide();
                    }
                })
            })
        }) : void 0;


        // controller.queryWoPlanExecuteList({

        // }).then(function (res) {
        //     res = res.map(function (item) {
        //         item.freq_cycle = (_.find(_that.fiveFreq, { sel: true }) || { id: d }).id;
        //         return item;
        //     })

        //     _that.monitoringGrid = groupDataControll(res);
        // })
    }
})