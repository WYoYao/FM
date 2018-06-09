// 本页面需要传入cache
// 计划ID       planId
v.pushComponent({
    name: "workOrderList",
    data: {
        // 查询工单列表的参数
        queryWoListArgu: {
            order_state: "",
            planId: "",
        },
        //  列表集合
        workOrderListData: [],
        // 状态集合
        // workOrderStateList: [],
    },
    methods: {
        selWorkOrderState: function (item) {
            var _that = this;

            if (_.isPlainObject(item)) _that.queryWoListArgu.order_state = item.code;

            $("#workOrderListLoad").pshow();
            controller.queryWoListByPlanId({ plan_id: _that.queryWoListArgu.planId, order_state: _that.queryWoListArgu.order_state, project_id: _that.queryWoListArgu.project_id }).then(function (data) {
                _that.workOrderListData = JSON.parse(JSON.stringify(data));

                $("#workOrderListLoad").phide();
            }).catch(function (err) {

                _that.workOrderListData = [];

                $("#workOrderListLoad").phide();
                
            })
        }
    },
    computed: {

    },
    watch: {

    },
    beforeMount: function () {
        var _that = this;

        _that.queryWoListArgu = {
            order_state: _that.cache.order_state,
            planId: _that.cache.planId,
            project_id: _that.cache.project_id,
        };

        _that.selWorkOrderState();
    }
})