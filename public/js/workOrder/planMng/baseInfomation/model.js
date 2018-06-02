var pit_positions = function () {
    return {
        "pit_position_asks": [],		// 专业ID数组
        "pit_position_ask_names": [], // 专业名称数组
        "pit_position_state": "",				//坑位状态  0-空、1-已抢单、2-确认执行
        "pit_position_person_id": "",		//坑位对应人员ID
        "pit_position_person_name": ""		//坑位对应人员名称
    };
}

// 常用Event Start
//  根据Key 值 选择选项
//  根据Key 值 选择选项
function changeComboxbyKey(key, index, bool) {
    $("#cbx_id_" + key).psel(index, bool);
}/**
 * 创建所选时间的下拉时间
 */
function createTimesSel(cb) {

    return function (item, e) {

        var index = $(e._currentTarget).attr("index");

        cb(index, item);
    }
}

function createUsuallyTimesSel(cb) {

    return function (e) {
        var dom = $(e._currentTarget).parent().parent(),
            index = dom.attr("index"),
            item = dom.psel();


        cb(index, item);
    }
}
// 常用Event End

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
    if (!str) return Array(num).join(0);
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
            "time_day": item.time_day,                    //y("0612"-6月12日)，q/m/w("1"-第一月，1号，周一)，d("")
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
        start_time: Cycle.prototype.c2t(this.start_time),
        end_time: Cycle.prototype.c2t(this.end_time)
    }
}

//  模糊设置的频率周期
function freq_limit(count, unit) {

    return {
        num: count,
        unit: unit,
    }
}

// 相对设置类型
function freq_time_span() {
    return {                  //频率限制,相对设置时非空,例如：2天一次
        "num": "1",
        "unit": "d",                        //unit的值有：m/w/d/h，目前仅支持d
        "time_hour": "00",
        "time_minute": "00",
        "continue": "1"                   //持续时间小时
    }
}


// 创建计划类
function AddWoPlan() {
    return {
        // "execute": "1", // 执行人数 后期字段会有修改
        "plan_name": "",                //工单计划名称 ,必须
        "order_type": "",               //工单类型编码 ,必须
        "urgency": "低",                  //紧急程度,高、中、低 ,必须
        "ahead_create_time": 24,           //提前创建工单时间 ,必须
        "freq_cycle": "m",                 //计划频率-周期,y/m/w/d ,必须
        "freq_num": 1,                     //计划频率-次数 ,必须
        "freq_times": [                    //计划频率-时间 ,必须
        ],
        "instantiated_object_flag": 1,
        "freq_limit": {},
        "freq_time_span": new freq_time_span(),
        "plan_freq_type": "1",
        "plan_start_type": "1",             //计划开始类型,1-发布成功后立即，2-指定时间 ,必须
        "plan_start_time": "",             //计划开始时间,yyyyMMddhhmmss
        "plan_end_type": "1",
        "plan_end_time": "",               //计划结束时间,yyyyMMddhhmmss，空值时代表一直有效
        "next_route": [],						//下级路由，预览后的next_route，必须
        "draft_matters": [],               //工单事项数组,草稿的matters  ,必须
        "published_matters": [],            //工单事项数组,预览后的matters  ,必须      
        "pit_positions": [],
        "robbing_flag": false,
        "suggest_executor_num": 1,

    }
}
// 常用实体类 End

// 模糊设置修改为精确设置之后最判断需要的判断类
/**
* 获取积分点
*/
var getPowerPoint = function (minute) {
    minute = minute || 1;
    return {
        time_season: minute * 60 * 24 * 30 * 3, //季
        time_month: minute * 60 * 24 * 30,  //月
        time_week: minute * 60 * 24 * 7,   //周
        time_day: minute * 60 * 24,    //日
        time_hour: minute * 60,   //时
        time_minute: minute, //分
    }
};

/**
 * 根据属性获取绝对的值的大小Object
 */
var getPower = function (key, value) {
    var power = getPowerPoint(1);
    return _.has(power, key) ? power[key] * value : 0;
};



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
 * yyyyMMdd 转换成为 Date
 * @param {yyyyMMdd 转换成为 Date} str
 */
function yyyyMMdd2Date(str) {
    var arr = /^(\d{4})(\d{2})(\d{2})/.exec(str);
    return new Date(arr[1], parseInt(arr[2]) - 1, arr[3]);
}

/**
 * 指定时间添加对应的日期和小时
 * @param {传入日期} date 
 * @param {添加天数} day 
 * @param {添加小时} hour 
 * @param {添加分钟} minute 
 */
function addDate(date, day, hour, minute) {

    // 设置日期
    if (_.isNumber(day)) date = new Date(date.setDate(date.getDate() + day));
    // 设置小时
    if (_.isNumber(hour)) date = new Date(date.setHours(date.getHours() + hour));
    // 设置分钟
    if (_.isNumber(minute)) date = new Date(date.setMinutes(date.getMinutes() + minute));

    return date;
}

Vue.component('baseinfomation', {
    template: '#baseinfomation',
    data: function () {

        return {
            compare: [],
            //是否是编辑计划
            isedit: false,
            // 工单类型枚举
            WorkOrderType: [],
            // 紧急程度枚举
            urgencyType: [{ "name": "高", "code": "高" }, { "name": "中", "code": "中" }, { "name": "低", "code": "低" }],
            // 日 周 月 季 年 枚举
            freq_cycleType: [{ name: "日", code: "d" }, { name: "周", code: "w" }, { name: "月", code: "m" }, { name: "季", code: "q" }, { name: "年", code: "y" },],
            // 精确设置
            sendTypes: [{ name: "精确设置", code: "1" }, { name: "模糊设置", code: "2" }, { name: "相对设置", code: "3" }],
            // 计划开始类型
            plan_start_type: [{ name: "发布成功后立即", code: "1" }, { name: "指定时间", code: "2" }],
            // 计划结束时间
            plan_end_time_type: [{ name: "一直有效", code: "1" }, { name: "指定时间", code: "2" }],
            // weekType 每周所有枚举
            weekType: [{ name: "周一", code: 1 }, { name: "周二", code: 2 }, { name: "周三", code: 3 }, { name: "周四", code: 4 }, { name: "周五", code: 5 }, { name: "周六", code: 6 }, { name: "周日", code: 7 },],
            // 季度枚举
            seasonType: [{ name: "第一个月", code: 1 }, { name: "第二个月", code: 2 }, { name: "第三个月", code: 3 },],
            // 是否全部实例化对象枚举
            instantiatedTypes: [{ name: "是", code: 1 }, { name: "否", code: 0 }],
            // 添加计划所用实例 AddWoPlan
            addWoPlan: new AddWoPlan(),
            // addWoPlan: {
            //     freq_times: [],
            //     next_route: [],
            //     draft_matters: [],
            //     published_matters: [],
            //     freq_limit: {},
            //     freq_time_span: {},
            //     pit_positions: [],
            //     robbing_flag: false,
            //     suggest_executor_num: 1,
            // },
            // 项目版中模糊设置转换成精确设置的时候 需要在限制条件
            limit: null,
            WoTypeList: [],
            // 查询岗位
            queryPersonListByPositionIdsArgu: {},
        }
    },
    // 是否是引用计划  项目中引用计划 部分基本信息不可编辑
    //isquote: false,
    // 是否是项目版创建编辑计划 项目版创建编辑计划 需要设置计划生效时间
    //isTerm: false,
    // 是否是编辑计划
    //isEdit: false,
    props: ['addwoplan', 'isquote', 'isterm', 'isedit', "wotypelistall"],
    methods: {
        // 绑定计划频率数组
        addfreq_times: function (type, count, bool) {

            var _that = this, difference;

            if (!bool) {
                _that.addWoPlan.freq_times = [];
                return;
            }

            //  传入数字不规范直接返回空
            if (_.isNaN(+count)) {
                _that.freq_times = [];
            }

            // 绑定对应下拉菜单
            difference = _that.addWoPlan.freq_times.length - count;
            // 如果是 当前数据为空的时候直接添加
            if (difference == 0) {
                _that.addWoPlan.freq_times = _.range(count).map(function () {
                    return new Cycle(type);
                });
            } else if (difference < 0) {
                // 比之前大的时候要保证之前的值不做改变
                _that.addWoPlan.freq_times = _that.addWoPlan.freq_times.concat(_.range(Math.abs(difference)).map(function () {
                    return new Cycle(type);
                }))
            } else if (difference > 0) {
                // 减少的时候保证之前的值不改变
                _that.addWoPlan.freq_times.splice(-difference, difference);
            }

            _that.bind_fres_times();
        },
        // 绑定 时间格式控件
        bind_fres_times: function () {
            var _that = this;

            return new Promise(function (resolve) {
                _that.$nextTick(function () {

                    var startTimes = $(".indexl .StartTime"),
                        endTimes = $(".indexl .EndTime"),
                        StartSeason = $(".StartSeason"),
                        EndSeason = $(".EndSeason"),
                        StartWeek = $(".StartWeek"),
                        EndWeek = $(".EndWeek");

                    // 循环给对应的Dom 赋值
                    _that.addWoPlan.freq_times.forEach(function (item, index) {
                        startTimes.eq(index).psel({ y: 2018, M: item.start_time.time_day, d: item.start_time.time_day, h: item.start_time.time_hour, m: item.start_time.time_minute });
                        endTimes.eq(index).psel({ y: 2018, M: item.end_time.time_day, d: item.end_time.time_day, h: item.end_time.time_hour, m: item.end_time.time_minute });

                        // 周和季度默认选中下拉框
                        if (item.start_time.cycle == "q") {
                            StartSeason.eq(index).psel(item.start_time.time_season - 1);
                            EndSeason.eq(index).psel(item.end_time.time_season - 1);
                        }

                        if (item.end_time.cycle == "w") {
                            StartWeek.eq(index).psel(item.start_time.time_week - 1);
                            EndWeek.eq(index).psel(item.end_time.time_week - 1);
                        }
                    });

                    resolve()
                })
            })
        },
        com: function (item) {

            function zero(str) {
                return ('00' + str.toString()).slice(-2);
            }

            var start, end, type = item.start_time.cycle;
            start = zero(item.start_time.time_hour) + zero(item.start_time.time_minute);
            end = zero(item.end_time.time_hour) + zero(item.end_time.time_minute);

            switch (type) {

                case 'w':
                    start = zero(item.start_time.time_week) + start;
                    end = zero(item.end_time.time_week) + end;
                    break;
                case 'm':
                    start = zero(item.start_time.time_day) + start;
                    end = zero(item.end_time.time_day) + end;
                    break;
                case 'q':
                    start = zero(item.start_time.time_season) + zero(item.start_time.time_day) + start;
                    end = zero(item.end_time.time_season) + zero(item.end_time.time_day) + end;
                    break;
                case 'y':
                    start = zero(item.start_time.time_month) + zero(item.start_time.time_day) + start;
                    end = zero(item.end_time.time_month) + zero(item.end_time.time_day) + end;
                    break;
                default:
                    break;
            }

            return +start > +end;
        },
        // 数据验证
        canUse: function () {
            var _that = this;
            //  验证文本框
            if (!$("#plan_name_text").pverifi()) return false;
            if (!$("#aheadCreateTime").pverifi()) return false;
            if (!$("#peoplenumber").pverifi()) return false;
            if (!$("#planRateRig").pverifi()) return false;

            if (!$("#relatetiveID").pverifi()) return false;
            if (!$("#conterner").pverifi()) return false;

            // 验证 工单类型
            if (!_that.addWoPlan.order_type.length) {
                $("#globalnotice").pshow({
                    text: '工单类型不能为空',
                    state: "failure"
                });
                return false;
            }
            // 验证 下滑栏菜单
            if (!_that.addWoPlan.urgency.length) {
                $("#globalnotice").pshow({
                    text: '工单紧急程度不能为空',
                    state: "failure"
                });
                return false;
            }
            // 计划频率不能为空
            if (!_that.addWoPlan.plan_freq_type) {
                $("#globalnotice").pshow({
                    text: '计划频率不能为空',
                    state: "failure"
                });
                return false;
            }

            // 验证精确设置
            if (_that.addWoPlan.plan_freq_type == 1) {

                if (_that.compare.filter(function (bool) {
                    return bool
                }).length) {
                    return;
                }
            } else if (_that.addWoPlan.plan_freq_type == 2) {
                if (!$("#num_id").pverifi()) {
                    return;
                }
                if (!_that.addWoPlan.freq_limit.unit) {
                    $("#globalnotice").pshow({
                        text: '间隔次数不能为空',
                        state: "failure"
                    });
                    return;
                }
            }

            // 模糊设置转化能成为精确设置 需要根据每次的间隔做验证
            if (_.isPlainObject(_that.limit)) {
                var Start = [], End = [];

                _that.addWoPlan.freq_times.forEach(function (item) {
                    Start.push(getTimePower(item.start_time));
                    End.push(getTimePower(item.end_time));
                });

                for (var index = 0; index < Start.length; index++) {
                    var start = Start[index];

                    for (let i = 0; i < End.length; i++) {
                        var end = End[i];

                        if (i == index) continue;

                        var compare = {
                            q: 1 * 60 * 24 * 30 * 3, //季
                            y: 1 * 60 * 24 * 30,  //月
                            w: 1 * 60 * 24 * 7,   //周
                            d: 1 * 60 * 24,    //日
                            h: 1 * 60,   //时
                            s: 1, //分
                        }[_that.limit.unit] * _that.limit.num;

                        if (!((start - end) >= compare) && ((start - end) > 0)) {
                            $("#globalnotice").pshow({
                                text: '第' + ++i + '次开始时间与第' + ++index + '次结束时间间隔小于' + _that.limit.num + (_.find(_that.freq_cycleType, { code: _that.limit.unit }) || {}).name,
                                state: "failure"
                            });
                            return;
                        }

                    }
                }
            }

            if (_that.isterm && _that.addWoPlan.plan_start_type == 2) {
                if (!_.isString(_that.addWoPlan.plan_start_time) || !_that.addWoPlan.plan_start_time.length || !_.isString(_that.addWoPlan.plan_end_time) || !_that.addWoPlan.plan_end_time.length) {
                    $("#globalnotice").pshow({
                        text: '计划生效时间不能为空',
                        state: "failure"
                    });
                    return;
                }
            }

            // 相对设置验证  项目版做验证
            if (_that.addWoPlan.plan_freq_type == "3" && _that.isterm) {

            }



            return true;
        },
        // 外界获取参数
        argu: function () {
            var _that = this;
            var addWoPlan = JSON.parse(JSON.stringify(this.addWoPlan));

            //  普通的直接做这些处理
            addWoPlan.freq_times = addWoPlan.freq_times.map(function (item) {
                return Cycle.prototype.Cycle2Item.call(item);
            })

            //   相对设置转换成为精确设置
            if (addWoPlan.plan_freq_type == "3" && _that.isterm) {

                // 转换生成对应的 精确时间点
                var convertFn = function (addWoPlan) {
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

            return addWoPlan;
        },
        // 获取可选择的次数
        getCount: function (type) {
            var typeEnum = {
                d: 12,
                w: 7,
                m: 31,
                q: 31,
                y: 24
            };

            return _.range(typeEnum[type] || 31).map(function (index) {
                return {
                    name: index + 1,
                    code: index + 1,
                }
            })
        },
        // 计算执行人数
        comExecutreNumber: function (num) {
            num = parseInt(num);
            // 如果非数字则返回上一次的值
            if (_.isNaN(num)) {
                return 1;
            }

            if (_.isNumber(num) && (num < 1 || num > 9)) {
                if (num < 1) return 1;
                if (num > 9) return 9;
            }

            return num;
        },
        // 根据某一个属性获取数组中满足的对象集合
        getSelected: function (list, arr, key) {
            return list.filter(function (item) {
                return arr.indexOf(item[key]) != -1;
            })
        },
        // 获取岗位
        getPositon: function (index, list) {

            this.addWoPlan.pit_positions[index].pit_position_ask_names = _.map(list, 'name');
            this.addWoPlan.pit_positions[index].pit_position_asks = _.map(list, 'code');
        },
    },
    computed: {
        // compare: function () {
        //     var _that = this;
        //     return _that.addWoPlan.freq_times.map(function (item) {
        //         return _that.com(item);
        //     })
        // },
        cycleTypes: function () {
            var index = _.findIndex(this.freq_cycleType, { code: this.addWoPlan.freq_cycle })
            return this.freq_cycleType.slice(0, index);
        },
        years: function () {

            var year = new Date().getFullYear();

            return _.range(30).map(function (number) {
                return {
                    name: (year + number) + '年',
                    start: number == 0 ? addDate(new Date(new Date().format("yyyy/MM/dd 00:00:00")), 1).format("yyyyMMddhhmmss") : new Date(new Date().format("yyyy/01/01 00:00:00")).format("yyyyMMddhhmmss"),
                    end: new Date(new Date(new Date().getFullYear() + 1 + "/01/01 00:00:00") - 24 * 60 * 60 * 1000).format("yyyyMMddhhmmss")
                }
            })
        }
    },
    watch: {
        "addWoPlan.suggest_executor_num": function (num, old) {
            // 如果是抢单的话的
            if (this.addWoPlan.robbing_flag) {
                this.addWoPlan.suggest_executor_num = this.comExecutreNumber(this.addWoPlan.suggest_executor_num);

                this.addWoPlan.pit_positions = fill(this.addWoPlan.pit_positions, num, pit_positions)

                /**
                 * 填充数组到指定长度
                 * @param {需要填充的数组} arr 
                 * @param {需要填充到的长度} len 
                 * @param {用于填充的对象或生成对象的方法} createObj 
                 */
                function fill(arr, len, createObj) {

                    var l = arr.length;
                    // 长度相同直接返回
                    if (l == len) return arr;
                    // 本身更长直接截取
                    if (l > len) return arr.slice(0, len);
                    // 需要填充
                    if (l < len) {
                        // 返回对应的填充对象
                        return arr.concat(_.range(len - l).map(function () {
                            return _.isFunction(createObj) ? createObj() : createObj;
                        }))
                    }

                    return arr;
                }
            } else {
                this.addWoPlan.pit_positions = [];
            }
        },
        "addWoPlan.robbing_flag": function (newValue, oldValue) {
            if (newValue) {
                this.addWoPlan.suggest_executor_num = this.comExecutreNumber(this.addWoPlan.suggest_executor_num);
                // 生成对应的坑位
                this.addWoPlan.pit_positions = fill(this.addWoPlan.pit_positions, this.addWoPlan.suggest_executor_num, pit_positions)

                /**
                 * 填充数组到指定长度
                 * @param {需要填充的数组} arr 
                 * @param {需要填充到的长度} len 
                 * @param {用于填充的对象或生成对象的方法} createObj 
                 */
                function fill(arr, len, createObj) {

                    var l = arr.length;
                    // 长度相同直接返回
                    if (l == len) return arr;
                    // 本身更长直接截取
                    if (l > len) return arr.slice(0, len);
                    // 需要填充
                    if (l < len) {
                        // 返回对应的填充对象
                        return arr.concat(_.range(len - l).map(function () {
                            return _.isFunction(createObj) ? createObj() : createObj;
                        }))
                    }

                    return arr;
                }
            } else {
                this.addWoPlan.pit_positions = [];
            }

            // this.addWoPlan.order_state = newValue ? 2 : 5
        },
        "addWoPlan.plan_start_type": function (value, old) {
            var _that = this;
            if (value == old) return;

            _that.addWoPlan.plan_start_time = value == 2 ? new Date().format("yyyyMMdd000000") : "";
        },
        "addWoPlan.plan_end_type": function (value, old) {
            var _that = this;
            if (value == old) return;

            _that.addWoPlan.plan_end_time = value == 2 ? new Date().format("yyyyMMdd235959") : "";
        },
        //  监听频率精度
        "addWoPlan.plan_freq_type": function (value, old) {
            var _that = this;
            if (value == old) return;

            //  重置时间阶段
            _that.addWoPlan.freq_cycle = "m";
            _that.addWoPlan.freq_num = 1;


            if (value == "1") {

                // 精确设置重置
                _that.addfreq_times(_that.addWoPlan.freq_cycle, _that.addWoPlan.freq_num, _that.addWoPlan.plan_freq_type)
            } else if (value == "2") {

                // 模糊设置重置
                _that.addWoPlan.freq_limit = new freq_limit(1, "m");
                _that.$nextTick(function () {
                    $("#cycleTypes_id").psel(0);
                    _that.addWoPlan.freq_limit.unit = _that.cycleTypes[0].code;
                })

                _that.addWoPlan.freq_times = [];
            } else if (value == "3") {

                _that.addWoPlan.freq_time_span = new freq_time_span();
            }
        },
        //  监听频率次数
        "addWoPlan.freq_num": function (value, old) {

            if (value == old) return;

            this.addfreq_times(this.addWoPlan.freq_cycle, value, this.addWoPlan.plan_freq_type)
        },
        // 监听频率周期
        "addWoPlan.freq_cycle": function (value, old) {
            if (value == old) return;
            var _that = this;
            // _that.bind_combox({ freq_cycle: value }, { freq_cycle: old });
            this.addfreq_times(value, this.addWoPlan.freq_num, this.addWoPlan.plan_freq_type);
        },
        "addWoPlan.freq_times": {
            handler: function (item) {
                var _that = this;
                _that.compare = _that.addWoPlan.freq_times.map(function (item) {
                    return _that.com(item);
                })
            },
            deep: true
        },
        "addWoPlan.freq_time_span.time_hour": function (value, old) {
            if (value == old) return;
            var _that = this;
            $("#ptiemStartTime").psel({ h: value, m: _that.addWoPlan.freq_time_span.time_minute }, false);
        },
        "addWoPlan.freq_time_span.time_minute": function (value, old) {
            if (value == old) return;
            var _that = this;
            $("#ptiemStartTime").psel({ h: _that.addWoPlan.freq_time_span.time_hour, m: value }, false);

        },
        addWoPlan: function (newValue, oldValue) {

            var _that = this;

            // _that.bind_combox(newValue, oldValue);
        },
    },
    beforeMount: function () {

        var _that = this;
        //  判断是否是编辑计划
        //  如果是编辑计划赋值
        // if (_that.isEdit) _that.addWoPlan = _that.addwoplan;
        // 是否引用
        // if (_.isBoolean(_that.isquote)) _that.isquote = _that.isquote;
        // // 是否项目版
        // if (_.isBoolean(_that.isterm)) _that.isterm = _that.isterm;
        // 加载工单状态类型
        var WorkOrderTypePromise = controller.queryWoTypeListByPersonIdControlCode().then(function (res) {

            res.forEach(function (item) {
                _that.WorkOrderType.push(item);
            })

            return new Promise(function (resolve) {
                resolve(res);
            });

        }).catch(function () {

            _that.WorkOrderType = [];
        })

        //  选项加载完毕 附加默认值
        WorkOrderTypePromise.then(function () {

            // 编辑情况
            if (_that.isedit) {

                // var addwoplan = function () {
                //     return JSON.parse(JSON.stringify(_that.addwoplan))
                // }
                var addwoplan = function () {
                    return JSON.parse(JSON.stringify(Object.assign(new AddWoPlan(), _that.addwoplan || {})))
                }

                new Promise(function (resolve) {

                    //  绑定基础信息
                    _that.addWoPlan = Object.assign(new AddWoPlan(), addwoplan())
                    _that.$nextTick(resolve);

                }).then(function () {

                    // _.forIn(addwoplan(), function (value, key, obj) {

                    //     if (_.has(obj, key) && !_.isObject(value)) _that.addWoPlan[key] = value;
                    // })

                    _that.addWoPlan.freq_num = addwoplan().freq_num;
                    _that.addWoPlan.freq_cycle = addwoplan().freq_cycle;

                    return new Promise(function (resolve) {
                        _that.$nextTick(resolve)
                    })
                }).then(function () {

                    //   判断是精确设置还是模糊设置
                    if (addwoplan().plan_freq_type == 1) {

                        if (_.isArray(addwoplan().freq_times) && addwoplan().freq_times.length) {
                            _that.addWoPlan.freq_times = addwoplan().freq_times.map(function (item) {
                                return new Cycle(item.start_time.cycle).ParseItem(item);
                            });
                            _that.bind_fres_times().then(function () {
                                console.log('加载完毕');
                            })
                        }

                    } else if (addwoplan().plan_freq_type == 2) {

                        if (addwoplan().hasOwnProperty('freq_limit')) {
                            _that.addWoPlan.freq_limit.num = addwoplan().freq_limit.num;
                            _that.addWoPlan.freq_limit.unit = addwoplan().freq_limit.unit;
                        }

                        //  项目版中的模糊设置需要修改为精确设置
                        if (_that.isterm) {
                            // 模糊設置修改为精确设置
                            _that.addWoPlan.plan_freq_type = "1";
                            // 生成对应的精确设置
                            _that.addfreq_times(_that.addWoPlan.freq_cycle, _that.addWoPlan.freq_num, _that.addWoPlan.plan_freq_type);

                            _that.limit = _that.addWoPlan.freq_limit;

                        }

                    } else if (addwoplan().plan_freq_type == 3) {
                        if (addwoplan().hasOwnProperty('freq_time_span')) {
                            _that.addWoPlan.freq_time_span.num = addwoplan().freq_time_span.num;
                            _that.addWoPlan.freq_time_span.unit = addwoplan().freq_time_span.unit;
                            _that.addWoPlan.freq_time_span.startTime = addwoplan().freq_time_span.startTime;
                            _that.addWoPlan.freq_time_span.continue = addwoplan().freq_time_span.continue;
                        }
                    }
                })

            } else {

                // 新建情况
                _that.addWoPlan = new AddWoPlan()
            }
        })

            // 闭包保存全局方法中需要的变量
            ; (function () {
                /**
                 * 修改频率的特殊类型
                 * @param {開始結束} type 
                 * @param {索引} index 
                 */
                function chageTime(type, key, index, item) {
                    _that.addWoPlan.freq_times[index][type][key] = item.code;
                }

                //  季节选择下拉
                window.StartSeasonSel = createTimesSel(chageTime.bind(null, "start_time", "time_season"));
                //  季节选择下拉
                window.EndSeasonSel = createTimesSel(chageTime.bind(null, "end_time", "time_season"));

                //  季节选择下拉
                window.StartWeekSel = createTimesSel(chageTime.bind(null, "start_time", "time_week"));
                //  季节选择下拉
                window.EndWeekSel = createTimesSel(chageTime.bind(null, "end_time", "time_week"));
                // 修改频率每次的时间
                function chageSETime(type, index, item) {

                    if (!item) return;

                    var str = "2018/01/01 00:00:00".split(""),
                        startTime = item.startTime.replace(/-/g, '/').split("");

                    str.splice.bind(str, str.length - 3 - startTime.length, startTime.length).apply(str, startTime);

                    var date = new Date(str.join(""));

                    _that.addWoPlan.freq_times[index][type].time_month = date.format("MM");
                    _that.addWoPlan.freq_times[index][type].time_day = date.format("dd");
                    _that.addWoPlan.freq_times[index][type].time_hour = date.format("hh");
                    _that.addWoPlan.freq_times[index][type].time_minute = date.format("mm");
                }

                // 开始时间
                window.TimeStartSel = createUsuallyTimesSel(chageSETime.bind(null, "start_time"));
                // 结束时间
                window.TimeEndSel = createUsuallyTimesSel(chageSETime.bind(null, "end_time"));

                // 修改频率每次的时间
                function chageTypeTime(type, index, item) {

                    if (!item) return;
                    _that.addWoPlan[type] = new Date(item.startTime.replace(/-/g, '/')).format(type == 'plan_start_time' ? 'yyyyMMdd000000' : 'yyyyMMdd235959');
                }

                // 开始时间
                window.TimeStartTypeTimeSel = createUsuallyTimesSel(chageTypeTime.bind(null, "plan_start_time"));
                // 结束时间
                window.TimeEndTypeTimeSel = createUsuallyTimesSel(chageTypeTime.bind(null, "plan_end_time"));

                // 相对设置要求开始时间
                window.ptiemStartTime = function (event) {
                    var arr = /(\d{2}):(\d{2})/.exec(event.pEventAttr.startTime);
                    _that.addWoPlan.freq_time_span.time_hour = arr[1];
                    _that.addWoPlan.freq_time_span.time_minute = arr[2];
                }

                //  模糊设置间隔单位
                window.cycleTypes_sel = function (item) {
                    _that.addWoPlan.freq_limit.unit = item.code;
                }

                window.cbx_sel_order_type = function (item) {

                    _that.addWoPlan.order_type = item.plan_id;

                    _that.addWoPlan.order_type = item.plan_id;
                    _that.addWoPlan.order_type_name = item.plan_name;
                    _that.addWoPlan.work_type = item.work_type;
                    _that.addWoPlan.work_type_name = item.work_type_name;
                    _that.addWoPlan.work_type_name = item.work_type_name;

                    if (item.time_limit.startTime && item.time_limit.endTime) {

                        //  计算大小的时间
                        _that.addWoPlan.start_minute = item.time_limit.startTime.selected ? (item.time_limit.startTime.around == "front" ? -1 : 1) * item.time_limit.startTime.minute : 0;
                        _that.addWoPlan.end_minute = item.time_limit.endTime.selected ? (item.time_limit.endTime.around == "front" ? -1 : 1) * item.time_limit.endTime.minute : 0;

                    }

                    //  保存新建订单后的状态
                    if (_.isArray(item.post_and_duty)) {

                        _that.addWoPlan.robbing_flag = _.filter(item.post_and_duty, { position_id: "systemPosition" }).reduce(function (bool, item) {

                            return item.duty.reduce(function (con, info) {
                                if (con) return con;

                                if (info.code == "create") {
                                    // _that.addWoPlan.do_after_start_time = info.arrival_time_allow_execute;
                                    // _that.addWoPlan.limit_domain = info.limit_domain;

                                    //保存 查询岗位的参数
                                    _that.queryPersonListByPositionIdsArgu.position_ids = _.map(info.next_route, 'position_id');
                                    _that.queryPersonListByPositionIdsArgu.filter_scheduling = false;
                                    _that.queryPersonListByPositionIdsArgu.limit_domain = info.limit_domain;
                                }

                                return info.code == "create" && info.executie_mode == "robbing";
                            }, bool)
                        }, false)

                        // _that.robbing_flag = (_.find(item.post_and_duty.duty, { code: "create" }) || {}).executie_mode == "robbing";
                    } else {

                        _that.addWoPlan.robbing_flag = false;
                    }

                }

                    ; (function () {
                        window.cbx = {
                            // order_type: _that.WorkOrderType,// 工单类型编码
                            urgency: _that.urgencyType, // 紧急程度
                            freq_cycle: _that.freq_cycleType,  //计划频率
                            plan_start_type: _that.plan_start_type, //计划开始类型 ,
                            plan_freq_type: _that.sendTypes,

                        };

                        var ComboxEnum = {
                            // order_type: {
                            //     order_type: 'plan_id',
                            // },
                            urgency: {
                                urgency: "name",
                            },
                            freq_cycle: {
                                freq_cycle: "code",
                            },
                            freq_num: {
                                freq_num: "code",
                            },
                            // plan_start_type: {
                            //     plan_start_type: "code",
                            // },
                            plan_end_type: {
                                plan_end_type: "code",
                            },
                            //频率精确设置 后期修改
                            plan_freq_type: {
                                plan_freq_type: "code",
                            },
                            instantiated_object_flag: {
                                instantiated_object_flag: "code",
                            },
                            end_time: {
                                plan_end_time: "end",
                                plan_start_time: "start",
                            }
                        };

                        /**
                             * 根据传入的key 生成对应的下拉菜单控件回调函数
                             * 
                             * @param {any} key 
                             */
                        function createComboxSelFn(key) {

                            return function (item) {

                                // 循环对应的值赋值
                                for (k in ComboxEnum[key]) {

                                    if (ComboxEnum[key].hasOwnProperty(k)) {

                                        var obj = {};
                                        obj[k] = item[ComboxEnum[key][k]];
                                        // 附加对应的值
                                        _that.addWoPlan = Object.assign({}, _that.addWoPlan, obj)
                                    }
                                }
                            }
                        };

                        Object.keys(ComboxEnum).forEach(function (key) {
                            // 将对应的函数绑定 window 对象上面
                            window['cbx_sel_' + key] = createComboxSelFn(key);
                        });
                    })();
            })();
    }
})