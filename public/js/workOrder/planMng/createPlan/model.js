v.pushComponent({
    name: "createPlan",
    data: {
        addWoPlan: {},
        //addWoPlan: { "execute": "13", "plan_name": "111", "order_type": 1, "urgency": "高", "ahead_create_time": "12", "freq_cycle": "q", "freq_num": "2", "freq_times": [{ "start_time": { "cycle": "q", "time_day": "101", "time_hour": "01", "time_minute": "00" }, "end_time": { "cycle": "q", "time_day": "202", "time_hour": "02", "time_minute": "00" } }, { "start_time": { "cycle": "q", "time_day": "203", "time_hour": "03", "time_minute": "00" }, "end_time": { "cycle": "q", "time_day": "304", "time_hour": "04", "time_minute": "00" } }], "freq_limit": {}, "sendTypes": "1", "plan_start_type": "1", "plan_start_time": "", "plan_end_type": "1", "plan_end_time": "", "next_route": [], "draft_matters": [], "published_matters": [] },
        //addWoPlan: { "execute": "13", "plan_name": "计划名称更", "order_type": 3, "urgency": "高", "ahead_create_time": "12", "freq_cycle": "s", "freq_num": "2", "freq_times": [{ "start_time": { "cycle": "s", "time_week": "1", "time_season": 1, "time_month": "1", "time_day": "01", "time_hour": "01", "time_minute": "00" }, "end_time": { "cycle": "s", "time_week": "1", "time_season": 2, "time_month": "1", "time_day": "02", "time_hour": "02", "time_minute": "00" } }, { "start_time": { "cycle": "s", "time_week": "1", "time_season": 3, "time_month": "1", "time_day": "03", "time_hour": "03", "time_minute": "00" }, "end_time": { "cycle": "s", "time_week": "1", "time_season": 1, "time_month": "1", "time_day": "04", "time_hour": "04", "time_minute": "00" } }], "freq_limit": {}, "sendTypes": "1", "plan_start_type": "1", "plan_start_time": "", "plan_end_type": "1", "plan_end_time": "", "next_route": [], "draft_matters": [], "published_matters": [] },
        //addWoPlan: { "execute": "123", "plan_name": "计划名称", "order_type": 1, "urgency": "高", "ahead_create_time": "12", "freq_cycle": "m", "freq_num": 1, "freq_times": [{ "start_time": { "cycle": "m", "time_day": "1", "time_hour": "0", "time_minute": "0" }, "end_time": { "cycle": "m", "time_day": "1", "time_hour": "0", "time_minute": "0" } }], "freq_limit": { "num": "2", "unit": "w" }, "sendTypes": "0", "plan_start_type": "1", "plan_start_time": "", "plan_end_type": "1", "plan_end_time": "", "next_route": [], "draft_matters": [], "published_matters": [] },
        //addWoPlan: { "execute": "321", "plan_name": "新计划名称", "order_type": 2, "urgency": "中", "ahead_create_time": "11", "freq_cycle": "s", "freq_num": "2", "freq_times": [{ "start_time": { "cycle": "s", "time_week": 1, "time_season": "1", "time_month": "1", "time_day": "NaN", "time_hour": "NaN", "time_minute": "NaN" }, "end_time": { "cycle": "s", "time_week": 2, "time_season": "1", "time_month": "1", "time_day": "NaN", "time_hour": "NaN", "time_minute": "NaN" } }, { "start_time": { "cycle": "s", "time_week": 3, "time_season": "1", "time_month": "1", "time_day": "NaN", "time_hour": "NaN", "time_minute": "NaN" }, "end_time": { "cycle": "s", "time_week": 1, "time_season": "1", "time_month": "1", "time_day": "NaN", "time_hour": "NaN", "time_minute": "NaN" } }], "freq_limit": { "num": 1, "unit": "d" }, "sendTypes": "1", "plan_start_type": "1", "plan_start_time": "", "plan_end_type": "1", "plan_end_time": "", "next_route": [], "draft_matters": [], "published_matters": [] },
        isquote: false,
        isterm: false,
        str:"",
    },
    methods: {
        // 获取对象
        getObj:function(arr){
            console.log(arr);
            this.str="";
        }
    },
    computed: {
    },
    watch: {

    },
    beforeMount: function () {

        var _that = this;

    }
})