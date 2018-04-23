// 组件使用的时间格式
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

function fill(str, num) {
    return (Array(num).join(0) + str.toString()).slice(-num);
}

Cycle.prototype.c2i = function (item) {
    // y("0612" - 6月12日) ，q("312" - 第三个月12号，) ，m("01" - 1号) ，w("1" - 1号，周一) ，d("")
    // 年4位，季3位，月2位，周1位，日不用传
    if (item.cycle == 'y') {
        item.time_month = item.time_day.slice(0, -2);
        item.time_day = item.time_day.slice(-2);

    } else if (item.cycle == 'q') {
        item.time_season = item.time_day.slice(0, -2);
        item.time_day = item.time_day.slice(-2);

    } else if (item.cycle == 'w') {
        item.time_week = item.time_day.slice(-2);
    }

    return item;
}

Cycle.prototype.c2t = function (item) {

    var item = JSON.parse(JSON.stringify(item)),
        obj = {
            "cycle": item.cycle,                //周期,y/q/m/w/d
            "time_day": "",                    //y("0612"-6月12日)，q/m/w("1"-第一月，1号，周一)，d("")
            "time_hour": item.time_hour,                  //10时
            "time_minute": item.time_minute                 //15分
        }

    if (item.cycle == 'y') {

        item.time_month = fill(item.time_month, 2);
        item.time_day = fill(item.time_day, 2);

        obj.time_day = item.time_month + item.time_day;

    } else if (item.cycle == 'q') {
        item.time_season = fill(item.time_season, 1);
        item.time_day = fill(item.time_day, 2);

        obj.time_day = item.time_season + item.time_day;

    } else if (item.cycle == 'w') {
        item.time_week = fill(item.time_week, 1);

        obj.time_day = item.time_week;
    }

    return obj;
}

// 接口参数类型 组件能够使用的参数
Cycle.prototype.ParseItem = function (item) {

    this.start_time = Object.assign({}, this.start_time, this.c2i(item.start_time));

    this.end_time = Object.assign({}, this.end_time, this.c2i(item.end_time));

    return this;
}

// 组件使用的参数转换成为 接口参数类型
Cycle.prototype.Cycle2Item = function () {

    return {
        start_time: this.c2t(this.start_time),
        end_time: this.c2t(this.end_time)
    }
}


// y("0612" - 6月12日) ，q("312" - 第三个月12号，) ，m("01" - 1号) ，w("1" - 1号，周一) ，d("")
// 年4位，季3位，月2位，周1位，日不用传

var item = {
    "start_time": {
        "cycle": "w",
        "time_day": "2",
        "time_hour": "22",
        "time_minute": "33"
    },
    "end_time": {
        "cycle": "w",
        "time_day": "3",
        "time_hour": "44",
        "time_minute": "55"
    }
}
// console.log(this.start_time)
// console.log(new Cycle('y').ParseItem(item));

var res = new Cycle('w');

console.log(res.ParseItem(item).Cycle2Item());


