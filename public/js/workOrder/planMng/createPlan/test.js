var 集团计划精确设置编辑 = {
    isquote: false,
    isedit: true,
    isterm: false,
    iscopy: false,
    addWoPlan: {
        "execute": "2",
        "plan_name": "计划名称添加",
        "order_type": "2",
        "urgency": "高",
        "ahead_create_time": "23",
        "freq_cycle": "m",
        "freq_num": "2",
        "freq_times": [
            {
                "start_time": {
                    "cycle": "m",
                    "time_day": "01",
                    "time_hour": "01",
                    "time_minute": "01"
                },
                "end_time": {
                    "cycle": "m",
                    "time_day": "02",
                    "time_hour": "02",
                    "time_minute": "02"
                }
            },
            {
                "start_time": {
                    "cycle": "m",
                    "time_day": "03",
                    "time_hour": "03",
                    "time_minute": "03"
                },
                "end_time": {
                    "cycle": "m",
                    "time_day": "04",
                    "time_hour": "04",
                    "time_minute": "04"
                }
            }
        ],
        "instantiated_object_flag": 1,
        "freq_limit": {
            "num": 1,
            "unit": "d"
        },
        "freq_time_span": {
            "num": "1",
            "unit": "d",
            "startTime": "00:00",
            "continue": "1"
        },
        "plan_freq_type": "1",
        "plan_start_type": "1",
        "plan_start_time": "",
        "plan_end_type": "1",
        "plan_end_time": "",
        "next_route": [],
        "draft_matters": [],
        "published_matters": []
    },
}

var 集团计划模糊设置编辑 = {
    isquote: false,
    isedit: true,
    isterm: true,
    iscopy: false,
    addWoPlan: { "execute": "3", "plan_name": "计划名称添加", "order_type": "2", "urgency": "高", "ahead_create_time": "22", "freq_cycle": "m", "freq_num": "2", "freq_times": [{ "start_time": { "cycle": "m", "time_day": "1", "time_hour": "0", "time_minute": "0" }, "end_time": { "cycle": "m", "time_day": "1", "time_hour": "0", "time_minute": "0" } }, { "start_time": { "cycle": "m", "time_day": "1", "time_hour": "0", "time_minute": "0" }, "end_time": { "cycle": "m", "time_day": "1", "time_hour": "0", "time_minute": "0" } }], "instantiated_object_flag": 0, "freq_limit": { "num": "2", "unit": "d" }, "freq_time_span": { "num": "1", "unit": "d", "startTime": "00:00", "continue": "1" }, "plan_freq_type": "2", "plan_start_type": "1", "plan_start_time": "", "plan_end_type": "1", "plan_end_time": "", "next_route": [], "draft_matters": [], "published_matters": [] },
}

var 集团计划相对设置 = {
    isquote: false,
    isedit: true,
    isterm: false,
    iscopy: false,
    addWoPlan: { "execute": "3", "plan_name": "计划名称添加", "order_type": "2", "urgency": "高", "ahead_create_time": "22", "freq_cycle": "m", "freq_num": 1, "freq_times": [{ "start_time": { "cycle": "m", "time_day": "1", "time_hour": "0", "time_minute": "0" }, "end_time": { "cycle": "m", "time_day": "1", "time_hour": "0", "time_minute": "0" } }], "instantiated_object_flag": 0, "freq_limit": { "num": "2", "unit": "d" }, "freq_time_span": { "num": "2", "unit": "d", "startTime": "03:03", "continue": "3" }, "plan_freq_type": "3", "plan_start_type": "1", "plan_start_time": "", "plan_end_type": "1", "plan_end_time": "", "next_route": [], "draft_matters": [], "published_matters": [] },
}



/**
 * 获取积分点
 */
function getPowerPoint(minute) {
    console.log(123);
    return {
        time_season: minute * 60 * 24 * 30 * 3, //季
        time_month: minute * 60 * 24 * 30,  //月
        time_week: minute * 60 * 24 * 7,   //周
        time_day: minute * 60 * 24,    //日
        time_hour: minute * 60,   //时
        time_minute: minute, //分
    }
}

/**
 * 根据属性获取绝对的值的大小Object
 */
var getPower = tool.createLazyFunction(getPowerPoint);



/**
 * 获取开始时间或者结束的事件的代表的分钟数 后面进行比较
 * @param {开始时间结束时间对象} time 
 */
function getTimePower(time) {
    return _.reduce(Object.keys(time), function (con, key) {
        return con + getPower(key, +time[key]);
    }, 0);
}

/**
 * 就这样从四点开始把
 */
// function () {

// }

