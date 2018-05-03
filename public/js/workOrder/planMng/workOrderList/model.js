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
        lookWorkOrderDetail: function (item) {
            this.cache = { name: "工单详情", workOrderId: item.order_id };
            v.initPage('workOrderDetail');
        },
        selWorkOrderState: function (item) {
            var _that = this;

            if (_.isPlainObject(item)) _that.queryWoListArgu.order_state = item.code;

            $("#workOrderListLoad").pshow();
            controller.queryWoListByPlanId({ plan_id: _that.queryWoListArgu.planId, order_state: _that.queryWoListArgu.order_state }).then(function (data) {
                _that.workOrderListData = JSON.parse(JSON.stringify(data.Content));

                $("#workOrderListLoad").phide();
            }).catch(function (err) {

                _that.workOrderListData = [];

                $("#workOrderListLoad").phide();

                //测试用假数据，后面需要删除
                _that.workOrderListData = _.range(_.random(10, 100)).map(index => {
                    return {
                        "order_id": "工单id" + index,                 //工单id
                        "summary": "工单概述,事项名称的串连" + index,               //工单概述,事项名称的串连
                        "create_time": new Date().format('yyyyMMddhhmmss'),   //创建时间，yyyyMMddhhmmss
                        "close_time": new Date().format('yyyyMMddhhmmss'),    //结束时间，yyyyMMddhhmmss
                        "participants": "张三，李四",        //参与人/操作人，用"，"隔开
                        "order_state_name": "工单状态名称" + index          //工单状态名称         
                    }
                })
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
            // planId: _that.cache.planId,
        };

        _that.selWorkOrderState();
    }
})