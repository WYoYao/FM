// 计划管理通用
v.pushComponent({
    name: "groupPlan",
    data: {
        groupPlanList: [],
        planSiteType: [{ name: "全部", id: "" }, { name: "已引用", id: 1 }, { name: "未引用", id: 0 }]
    },
    methods: {
        // 获取集团计划列表
        getGroupPlanList: function () {
            var that = this;
            $("#groupPlanPartLoad").pshow();
            PMA.GPL({ order_type: $("#groupPlanTypeCombo").psel().id, is_use_group_plan: $("#isPlanSite").psel().id }, function (data) {
                data = JSON.parse(JSON.stringify(data || []));
                that.groupPlanList = [];
                data.reduce(function(t,a){
                    if(a.plan_freq_type != 3){t.push(a);}
                    return t;
                },that.groupPlanList);
            }, function () {
                that.groupPlanList = [];
            }, function () {
                $("#groupPlanPartLoad").phide();
            })

        },
        // type   'site'引用该计划   'copy'复制该计划
        getThisPlan: function (model, type) {
            var that = this;
            PMA.GPI({ group_plan_id: model.group_plan_id }, function (data) {
                that.cache = {
                    argu: {
                        isquote: type === 'site' ? true : false,
                        isedit: true,
                        isterm: true,
                        iscopy: type === 'copy' ? true : false,
                        addWoPlan: JSON.parse(JSON.stringify(data)),
                        cb: function () {
                            v.goBack('groupPlan', true);
                        }
                    },
                };
                v.initPage("createPlan");
            }, function () { }, function () { })
        }
    },
    filters: {

    },
    beforeMount: function () {
        var that = this;
        // 恢复两个下拉框至默认状态
        $("#groupPlanTypeCombo").psel(0, false);
        $("#isPlanSite").psel(0, false);
        // 拿计划列表数据
        this.getGroupPlanList();
        // 拿一次集团计划总数及引用数量
        PMA.GPU({}, function (data) {
            data = JSON.parse(JSON.stringify(data || {}));
            that.groupPlanUse = {
                total: data.plan_total || 0,
                unUse: data.plan_unused_num || 0
            }
        }, function () { }, function () { })
    },
    watch: {

    }
});