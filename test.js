var project = {
    "project_id": "",               //项目id ,必须
    "plan_name": "",                //工单计划名称 ,必须
    "plan_from": "",                //计划来源，1-引用集团计划，2-自定义计划,必须
    "group_plan_id": "",            //引用集团计划ID

    //左边不同 Start
    "plan_start_type": "",             //计划开始类型,1-发布成功后第二天生效，2-指定时间 ,必须
    "plan_start_time": "",             //计划开始时间,yyyyMMdd+"000000"
    "plan_end_type": "",               //计划结束类型,1-发布成功后立即，2-指定时间
    "plan_end_time": "",               //计划结束时间,yyyyMMdd+"235959"，空值时代表一直有效 
    //左边不同 End

    // 左边相同 Start
    "user_id": "",                  //账号id-当前登录人的账号id ,必须
    "order_type": "",               //工单类型编码 ,必须
    "urgency": "",                  //紧急程度,高、中、低 ,必须
    "ahead_create_time": 12,           //提前创建工单时间 ,必须
    "suggest_executor_num": "2",       //建议执行人数
    "input_mode": "2",                 //输入方式，1-自由输入，2-结构化输入，默认2
    "freq_cycle": "m",                 //计划频率-周期,y/q/m/w/d ,必须
    "freq_num": 4,                     //计划频率-次数 ,必须
    "freq_times": [                    //计划频率-时间 ,必须
        {
            "start_time": {
                "cycle": "w",             //周期,y/q/m/w/d
                "time_day": "1",          //y("0612"-6月12日)，q/m/w("1"-第一月，1号，周一)，d("")
                "time_hour": "10",        //10时
                "time_minute": "15"       //15分
            },
            "end_time": {
                "cycle": "w",
                "time_day": "1",
                "time_hour": "20",
                "time_minute": "15"
            }
        }
    ],
    // 左边相同 End

    "draft_matters": [],               //工单事项数组,草稿的matters  ,必须

    "next_route": [],                  //下级路由，预览后的next_route
    "published_matters": [],            //工单事项数组,预览后的matters  ,必须 

}

var group = {
    "group_plan_name": "",          //集团计划名称 ,必须

    //左边不同 Start
    "plan_freq_type": "1",             //计划频率类型,1-精确设置，2-模糊设置，必须
    "freq_limit": {                       //频率限制,模糊设置时非空,例如：相邻两次间隔不小于2月
        "num": "2",
        "unit": "m"                        //unit的值有：m/w/d/h
    },
    //左边不同 End

    // 左边相同 Start
    "user_id": "",                  //账号id-当前登录人的账号id ,必须
    "order_type": "",               //工单类型编码 ,必须
    "urgency": "",                  //紧急程度,高、中、低 ,必须
    "ahead_create_time": 12,           //提前创建工单时间 ,必须
    "suggest_executor_num": "2",       //建议执行人数
    "input_mode": "2",                 //输入方式，1-自由输入，2-结构化输入，默认2
    "freq_cycle": "m",                 //计划频率-周期,y/q/m/w/d
    "freq_num": 4,                     //计划频率-次数
    "freq_times": [                    //计划频率-时间 ,精确设置时非空
        {
            "start_time": {
                "cycle": "w",             //周期,y/q/m/w/d
                "time_day": "1",          //y("0612"-6月12日)，q/m/w("1"-第一月，1号，周一)，d("")
                "time_hour": "10",        //10时
                "time_minute": "15"       //15分
            },
            "end_time": {
                "cycle": "w",
                "time_day": "1",
                "time_hour": "20",
                "time_minute": "15"
            }
        }
    ],
    // 左边相同 End

    "draft_matters": []                //工单事项数组,草稿的matters  ,必须
}


function Cycle(type) {

    this.start_time = {
        "cycle": type,             //周期,y/m/w/d
        "time_week": "1",
        "time_season": "1",
        "time_month": "1",
        "time_day": "1",          //周一，1号，“0612”,6月12日
        "time_hour": "0",        //10时
        "time_minute": "0"       //15分
    };
    this.end_time = {
        "cycle": type,
        "time_week": "1",
        "time_season": "1",
        "time_month": "1",
        "time_day": "1",
        "time_hour": "0",
        "time_minute": "0"
    }

}

Cycle.prototype.c2i = function (item) {
    // y("0612" - 6月12日) ，q("312" - 第三个月12号，) ，m("01" - 1号) ，w("1" - 1号，周一) ，d("")
    // 年4位，季3位，月2位，周1位，日不用传
    if (item.cycle == 'y') {
        item.time_day = item.time_day.slice(-2);
        item.time_month = item.time_day.slice(0, -2);

    } else if (item.cycle == 'q') {
        item.time_day = item.time_day.slice(-2);
        item.time_season = item.time_day.slice(0, -2);

    } else if (item.cycle == 'w') {
        item.time_week = item.time_day.slice(-2);
    }

    return item;
}

Cycle.prototype.ParseItem = function (item) {
    Object.assign(this.start_time, this.c2i(item.start_time));

    Object.assign(this.end_time, this.c2i(item.end_time));

    return this;
}

// y("0612" - 6月12日) ，q("312" - 第三个月12号，) ，m("01" - 1号) ，w("1" - 1号，周一) ，d("")
// 年4位，季3位，月2位，周1位，日不用传

var item = {
    "start_time": {
        "cycle": "y",
        "time_day": "0612",
        "time_hour": "22",
        "time_minute": "33"
    },
    "end_time": {
        "cycle": "y",
        "time_day": "0723",
        "time_hour": "44",
        "time_minute": "55"
    }
}
console.log(this.start_time)
console.log(new Cycle('y').ParseItem(item));



// 转换Cycle 实例的方法 组件参数 转 创建参数
function item2Cycle() {

}


var a = { name: 1 },
    b = { name: 2 };

Object.assign(a, b);
console.log(a, b)