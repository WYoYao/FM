//   相对设置转换成为精确设置
if (addWoPlan.plan_freq_type == "3") {

    // 转换生成对应的 精确时间点
    var convertAddWoPlan = function (addWoPlan) {
        // 周期设置为年
        addWoPlan.freq_cycle = "y";

        var dayTime = 24 * 60 * 60 * 1000;

        // 时间范围
        var range = Math.floor(
            (yyyyMMdd2Date(addWoPlan.plan_end_time) - yyyyMMdd2Date(addWoPlan.plan_start_time)) / dayTime / addWoPlan.freq_time_span.num
        );

        var startTime = addWoPlan.plan_start_time,
            endTime = addWoPlan.plan_end_time,
            num = parseInt(addWoPlan.freq_time_span.num),
            hour = parseInt(addWoPlan.freq_time_span.time_hour),
            minute = parseInt(addWoPlan.freq_time_span.time_minute),
            continuer = parseInt(addWoPlan.freq_time_span.continue);

        //  生成对应的精确数组
        addWoPlan.freq_times = _.range(range).map(function (index) {

            return {
                start_time: {
                    cycle: "y",
                    time_day: addDate(yyyyMMdd2Date(startTime), index * num).format('yyyyMMdd'),          //y("0612"-6月12日)，q("312"-第三个月12号，)，m("01"-1号)，w("1"-1号，周一)，d("")
                    time_hour: hour,                    //10时
                    time_minute: minute,                //15分
                },
                end_time: {
                    cycle: "y",
                    time_day: addDate(yyyyMMdd2Date(startTime), index * num, hour + continuer).format('yyyyMMdd'),          //y("0612"-6月12日)，q("312"-第三个月12号，)，m("01"-1号)，w("1"-1号，周一)，d("")
                    time_hour: addDate(yyyyMMdd2Date(startTime), index * num, hour + continuer).getHours().toString(),        //10时
                    time_minute: minute,                //15分
                }
            }
        })

        return addWoPlan;
    };

    addWoPlan = convertFn(addWoPlan);
}