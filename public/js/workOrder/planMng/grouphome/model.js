v.pushComponent({
    name: "grouphome",
    data: {
        queryGroupPlanList: {
            order_type: "",
            valid: true,
        },
        //工单类型
        orderTypes: [],
        // 有效状态
        validTypes: [{ name: "已发布", code: true, }, { name: '已作废', code: false, }],
        // 计划列表
        planList: [],
    },
    methods: {
        // 查询计划列表
        queryPlan: function () {
            var _that = this;
            return controller
                .queryGroupPlanList(_that.queryGroupPlanList)
                .then(function (res) {
                    _that.planList = res;
                });
        },
        // 工单类型选择事件
        handler_orderTypes: function (param) {
            this.queryGroupPlanList.order_type = param.code;
        },
        // 计划状态选择事件
        handler_validTypes: function (param) {
            this.queryGroupPlanList.valid = param.code;
        },
        // 跳转计划监控
        handler_to_monitoringPlan: function (item) {
            v.initPage('monitoringPlan', item)
        }
    },
    computed: {

    },
    watch: {

        "queryGroupPlanList": {
            handler: function () {
                this.queryPlan();
            },
            deep: true
        },

        // "queryGroupPlanList.order_type": function() {
        //     this.queryPlan();
        // },
        // "queryGroupPlanList.valid": function () {
        //     this.queryPlan();
        // },
    },
    beforeMount: function () {
        var _that = this;
        // 加载工单状态类
        controller.queryWoTypeList().then(function (res) {
            // 加载状态列表
            _that.orderTypes = [{ name: '全部', code: "" }].concat(res);

            return new Promise(function (resolve) {

                _that.$nextTick(resolve);
            }).then(function () {
                // 绑定下拉菜单
                $("#id_orderTypes").psel(0, false);
                $("#id_validTypes").psel(0, false);
            })
        });

    }
})