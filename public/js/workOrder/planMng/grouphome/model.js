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
        // 待作废的计划 id
        confirmInvalid: ""
    },
    methods: {
        // 查询计划列表
        queryPlan: function () {
            var _that = this;
            loadding.set("queryGroupPlanList")
            return controller
                .queryGroupPlanList(_that.queryGroupPlanList)
                .then(function (res) {
                    _that.planList = res;
                }).finally(function () {
                    loadding.remove("queryGroupPlanList");
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
            this.cache = Object.assign({ name: "项目计划监控" }, item);
            v.initPage('monitoringPlan');
        },
        /**
         * isquote 是否是引用
         * isedit 是否是编辑状态
         * isterm 是否是项目版
         * addWoPlan  对象
         * cb 提交完成后返回的回调函数
         */
        handler_to_createplan: function (isquote, isedit, isterm, iscopy, addWoPlan, cb) {
            v.instance.cache = {
                argu: {
                    isquote: isquote || false,
                    isedit: isedit || false,
                    isterm: isterm || false,
                    iscopy: iscopy || false,
                    addWoPlan: addWoPlan || {},
                    cb: cb || function () {
                        v.initPage("grouphome");
                    }
                },
            };
            v.initPage("createPlan")
        },
        queryGroupPlan: function (id, isquote, isedit, isterm, iscopy) {
            var _that = this;

            if (id) {
                controller.queryGroupPlanById({
                    group_plan_id: id
                }).then(function (res) {
                    // res[0]
                    _that.handler_to_createplan(isquote, isedit, isterm, iscopy, res[0], function () {
                        v.initPage("grouphome");
                    })
                })
            } else {
                _that.handler_to_createplan(isquote, isedit, isterm, {}, function () {
                    v.initPage("grouphome");
                })
            }
        },
        // 作废工单计划
        confirmInvalid: function () {
            var _that = this;
            _that.confirmInvalid;

            controller.destroyWoPlanById({
                group_plan_id: _that.confirmInvalid
            }).then(function () {
                $('#globalnotice').pshow({ text: '作废成功', state: 'success' });
                _that.queryPlan();
            });
        },
        // 跳转计划详情
        queryGroupPlanById: function (group_plan_id, planType) {
            this.cache = {
                name: "集团计划详情",
                planType: planType,
                planId: group_plan_id,
            };
            // 跳转到的计划的详情页面
            v.initPage("planInformation");
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
                // $("#id_orderTypes").psel(0, false);
                // $("#id_validTypes").psel(0, false);
            })
        });
    }
})
