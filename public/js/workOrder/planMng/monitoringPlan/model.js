v.pushComponent({
    name: "monitoringPlan",
    data: {
        maps: _.range(4).map((item, index) => {

            return {
                name: `第${++index}菜单`,
                index,
            }
        }),
    },
    methods: {
        createsitemap(value) {
            console.log(value);
        },
        back: function () {
            v.initPage('grouphome');
            console.log("back");
        }
    },
    computed: {

    },
    watch: {

    },
    beforeMount: function (item) {
        console.log("计划监控中查询方法未确定");
        // queryWoListByPlanId({

        // })
    }
})