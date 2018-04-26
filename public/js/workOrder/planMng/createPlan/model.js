v.pushComponent({
    name: "createPlan",
    data: {
        mattersViews: [
            {
                isRepeat: false,
                isSpace: false,
                isDescForepartSpace: false,
                verify: [],
                sopeds: [],
            }
        ],
        addWoPlan: {

        },
        matters: [{
            // 事项名称
            matter_name: "",
            desc_objs: [],
            desc_sops: [], // Sop 列表
            desc_works: [],  // 新建工作内容
            // 对象描述
            desc_forepart: "",  //  @ 输入框文本
            desc_aftpart: "",   //  # 输入框文本
            required_control: [],
        }],
        //addWoPlan: { "execute": "13", "plan_name": "111", "order_type": 1, "urgency": "高", "ahead_create_time": "12", "freq_cycle": "q", "freq_num": "2", "freq_times": [{ "start_time": { "cycle": "q", "time_day": "101", "time_hour": "01", "time_minute": "00" }, "end_time": { "cycle": "q", "time_day": "202", "time_hour": "02", "time_minute": "00" } }, { "start_time": { "cycle": "q", "time_day": "203", "time_hour": "03", "time_minute": "00" }, "end_time": { "cycle": "q", "time_day": "304", "time_hour": "04", "time_minute": "00" } }], "freq_limit": {}, "sendTypes": "1", "plan_start_type": "1", "plan_start_time": "", "plan_end_type": "1", "plan_end_time": "", "next_route": [], "draft_matters": [], "published_matters": [] },
        //addWoPlan: { "execute": "13", "plan_name": "计划名称更", "order_type": 3, "urgency": "高", "ahead_create_time": "12", "freq_cycle": "s", "freq_num": "2", "freq_times": [{ "start_time": { "cycle": "s", "time_week": "1", "time_season": 1, "time_month": "1", "time_day": "01", "time_hour": "01", "time_minute": "00" }, "end_time": { "cycle": "s", "time_week": "1", "time_season": 2, "time_month": "1", "time_day": "02", "time_hour": "02", "time_minute": "00" } }, { "start_time": { "cycle": "s", "time_week": "1", "time_season": 3, "time_month": "1", "time_day": "03", "time_hour": "03", "time_minute": "00" }, "end_time": { "cycle": "s", "time_week": "1", "time_season": 1, "time_month": "1", "time_day": "04", "time_hour": "04", "time_minute": "00" } }], "freq_limit": {}, "sendTypes": "1", "plan_start_type": "1", "plan_start_time": "", "plan_end_type": "1", "plan_end_time": "", "next_route": [], "draft_matters": [], "published_matters": [] },
        //addWoPlan: { "execute": "123", "plan_name": "计划名称", "order_type": 1, "urgency": "高", "ahead_create_time": "12", "freq_cycle": "m", "freq_num": 1, "freq_times": [{ "start_time": { "cycle": "m", "time_day": "1", "time_hour": "0", "time_minute": "0" }, "end_time": { "cycle": "m", "time_day": "1", "time_hour": "0", "time_minute": "0" } }], "freq_limit": { "num": "2", "unit": "w" }, "sendTypes": "0", "plan_start_type": "1", "plan_start_time": "", "plan_end_type": "1", "plan_end_time": "", "next_route": [], "draft_matters": [], "published_matters": [] },
        //addWoPlan: { "execute": "321", "plan_name": "新计划名称", "order_type": 2, "urgency": "中", "ahead_create_time": "11", "freq_cycle": "s", "freq_num": "2", "freq_times": [{ "start_time": { "cycle": "s", "time_week": 1, "time_season": "1", "time_month": "1", "time_day": "NaN", "time_hour": "NaN", "time_minute": "NaN" }, "end_time": { "cycle": "s", "time_week": 2, "time_season": "1", "time_month": "1", "time_day": "NaN", "time_hour": "NaN", "time_minute": "NaN" } }, { "start_time": { "cycle": "s", "time_week": 3, "time_season": "1", "time_month": "1", "time_day": "NaN", "time_hour": "NaN", "time_minute": "NaN" }, "end_time": { "cycle": "s", "time_week": 1, "time_season": "1", "time_month": "1", "time_day": "NaN", "time_hour": "NaN", "time_minute": "NaN" } }], "freq_limit": { "num": 1, "unit": "d" }, "sendTypes": "1", "plan_start_type": "1", "plan_start_time": "", "plan_end_type": "1", "plan_end_time": "", "next_route": [], "draft_matters": [], "published_matters": [] },
        isquote: false,
        isterm: false,
        str: "",
    },
    methods: {
        // 获取对象
        getObj: function (arr) {
            console.log(arr);
            this.str = "";
        },
        commit: function () {
            var _that = this;
            console.log(_that.$refs.baseinfomation.addWoPlan);
            console.log(_that.matters);

            // matters 验证
            // 重名的验证
            _that.mattersViews = _that.mattersViews.map(function (item) {
                item.isRepeat = !(_.uniq(_.map(_that.matters, 'matter_name')).length != _that.matters.length);
                return item;
            });

            if (_.filter(_that.mattersViews, { isRepeat: true }).length) return;
            // 验证名称非空
            _that.mattersViews.forEach(function (item, index) {
                item.isSpace = !_that.matters[index].matter_name.length;
                item.isDescForepartSpace = !_that.matters[index].desc_forepart.length;
            })
            // 验证内容为空
            if (_.filter(_that.mattersViews, { isSpace: true }).length) return;
            if (_.filter(_that.mattersViews, { isDescForepartSpace: true }).length) return;

            //  验证多个关系是否不匹配
            // 并行发送请求多个事项同时验证
            PromiseConcurrent(
                _that.matters.map(function (item) {

                    return function () {

                        // 对象与SOP 匹配验证
                        return createPlan_controller.verifyObjectAndSop({
                            objs: item.desc_objs.map(function (item) {
                                return {
                                    obj_id: item.obj_id,
                                    obj_name: item.obj_name,
                                }
                            }),
                            sop_ids: _.map(item.desc_sops, "sop_id")
                        })
                    }
                })
            ).then(function (res) {
                // 把原来的错误的状态替换的新的错误信息中
                Array.prototype.slice.call(arguments).map(function (item, index) {

                    item.map(function (info) {
                        // 有之前的返回之前的，没有之前的返回新的
                        var find = _.find(_that.mattersViews[index].verify, { obj_name: info.obj_name, sop_name: info.sop_name });
                        return find ? find : info;
                    })

                    _that.mattersViews[index].verify = item;
                });
                // 验证替换后的错误信息是否全部被忽略
                if (
                    !_that.mattersViews[index].map(function (item) {
                        return _.filter(item.verify, { ignore: false }).length
                    }).reduce(function (con, num) {
                        return con + num;
                    }, 0)
                ) {
                    console.log("已经全部被忽略,可以提交预览");
                    //  验证是否被销毁
                    // _that.matters
                    createPlan_controller.querySopListForSel().then(function (data) {
                        var res = data.res;
                        // 验证所有的 SOP 都在直接提交
                        var bool = _that.matters.reduce(function (con, item, index) {

                            if (!con) return false;
                            //  循环每个matter 的 desc_sop 判断是否存在当前SOP列表中
                            return item.desc_sops.reduce(function (con, info) {

                                if (!con) return false;
                                var bol = !!_.filter(res, { sop_id: info.sop_id }).length;
                                // 再从忽略列表中查找
                                if (!bol) {
                                    var bol = !!_.filter(_that.mattersViews[index].sopeds, { sop_id: info.sop_id, ignore: true }).length;
                                }

                                // 已经保存了添加到报废列表中
                                if (!bol) {
                                    info.ignore = false;
                                    _that.mattersViews[index].sopeds.push(info)
                                }

                                return bol;
                            }, con)
                        }, true);

                        if (bool) {
                            console.log("可以执行保存了");
                        }

                    })
                }
            })

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