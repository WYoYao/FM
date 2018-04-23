//  根据Key 值 选择选项
function changeComboxbyKey(key, index, bool) {
    $("#cbx_id_" + key).psel(index, bool);
}

/**
 * 脏值检查指定的属性
 * 使用不同的属性数组搞事情
 * @param {*} fn 使用每个不同属性搞事情的方法
 */
function createCheck(fn) {

    return function Comparison(newValue, oldValue, keys) {
        if (!(_.isPlainObject(newValue) && _.isPlainObject(oldValue) && _.isArray(keys))) throw TypeError('Arguments Error');
        // 返回新的有的变动的值
        keys.map(function (key) {

            var value = newValue[key];

            return {
                issame: value == oldValue[key],
                key: key,
                value: value
            };
        }).filter(function (item) {

            return !item.issame;
        }).forEach(function (item) {

            fn(item);
        })
    }
}

/**
 * 创建所选时间的下拉时间
 */
function createTimesSel(cb) {

    return function (item, e) {

        var index = $(e._currentTarget).attr("index");

        cb(index, item);
    }
}

/**
 * 修改频率的特殊类型
 * @param {開始結束} type 
 * @param {索引} index 
 */
function chageTime(type, key, index, item) {
    var _that = v.instance;
    _that.addWoPlan.freq_times[index][type][key] = item.code;
}
//  季节选择下拉
var StartSeasonSel = createTimesSel(chageTime.bind(null, "start_time", "time_season"));
//  季节选择下拉
var EndSeasonSel = createTimesSel(chageTime.bind(null, "end_time", "time_season"));

//  季节选择下拉
var StartWeekSel = createTimesSel(chageTime.bind(null, "start_time", "time_week"));
//  季节选择下拉
var EndWeekSel = createTimesSel(chageTime.bind(null, "end_time", "time_week"));

function createUsuallyTimesSel(cb) {

    return function (e) {
        var dom = $(e._currentTarget).parent().parent(),
            index = dom.attr("index"),
            item = dom.psel();


        cb(index, item);
    }
}

// 修改频率每次的时间
function chageSETime(type, index, item) {

    if (!item) return;

    var _that = v.instance,
        str = "2018/01/01 00:00:00".split(""),
        startTime = item.startTime.replace(/-/g, '/').split("");

    str.splice.bind(str, str.length - 3 - startTime.length, startTime.length).apply(str, startTime);

    var date = new Date(str.join(""));

    _that.addWoPlan.freq_times[index][type].time_month = date.format("MM");
    _that.addWoPlan.freq_times[index][type].time_day = date.format("dd");
    _that.addWoPlan.freq_times[index][type].time_hour = date.format("hh");
    _that.addWoPlan.freq_times[index][type].time_minute = date.format("mm");
}

// 开始时间
var TimeStartSel = createUsuallyTimesSel(chageSETime.bind(null, "start_time"));
// 结束时间
var TimeEndSel = createUsuallyTimesSel(chageSETime.bind(null, "end_time"));

//  模糊设置间隔单位
function cycleTypes_sel(item) {
    v.instance.interval.unit = item.code;
}

$(function () {
    window.cbx = {
        order_type: v.instance.WorkOrderType,// 工单类型编码
        urgency: v.instance.urgencyType, // 紧急程度
        freq_cycle: v.instance.freq_cycleType,  //计划频率
        plan_start_type: v.instance.plan_start_type, //计划开始类型 ,
        sendTypes: v.instance.sendTypes,

    };

    var ComboxEnum = {
        order_type: {
            order_type: 'code',
        },
        urgency: {
            urgency: "name",
        },
        freq_cycle: {
            freq_cycle: "code",
        },
        plan_start_type: {
            plan_start_type: "code",
        },
        //频率精确设置 后期修改
        sendTypes: {
            sendTypes: "code"
        }
    };

    /**
         * 根据传入的key 生成对应的下拉菜单控件回调函数
         * 
         * @param {any} key 
         */
    function createComboxSelFn(key) {

        return function (item) {

            var _that = v.instance;
            // 循环对应的值赋值
            for (k in ComboxEnum[key]) {

                if (ComboxEnum[key].hasOwnProperty(k)) {

                    var obj = {};
                    obj[k] = item[ComboxEnum[key][k]];
                    // 附加对应的值
                    v.instance.addWoPlan = Object.assign({}, v.instance.addWoPlan, obj)
                }
            }

        }

    };

    Object.keys(ComboxEnum).forEach(function (key) {
        // 将对应的函数绑定 window 对象上面
        window['cbx_sel_' + key] = createComboxSelFn(key);
    });
})