// 常用Event Start
//  根据Key 值 选择选项
//  根据Key 值 选择选项
function changeComboxbyKey(key, index, bool) {
    $("#cbx_id_" + key).psel(index, bool);
}

/**
 * 脏值检查指定的属性
 * 使用不同的属性数组搞事情
 * @param {*} fn 使用每个不同属性搞事情的方法
 */
// function createCheck(fn) {

//     return function Comparison(newValue, oldValue, keys) {
//         if (!(_.isPlainObject(newValue) && _.isPlainObject(oldValue) && _.isArray(keys))) throw TypeError('Arguments Error');
//         // 返回新的有的变动的值
//         keys.map(function (key) {

//             var value = newValue[key];

//             return {
//                 issame: value == oldValue[key],
//                 key: key,
//                 value: value
//             };
//         }).filter(function (item) {

//             return !item.issame;
//         }).forEach(function (item) {

//             fn(item);
//         })
//     }
// }

/**
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


// 创建计划类
function AddWoPlan() {
    return {
        "execute": "1", // 执行人数 后期字段会有修改
        "plan_name": "",                //工单计划名称 ,必须
        "order_type": "",               //工单类型编码 ,必须
        "urgency": "低",                  //紧急程度,高、中、低 ,必须
        "ahead_create_time": 24,           //提前创建工单时间 ,必须
        "freq_cycle": "m",                 //计划频率-周期,y/m/w/d ,必须
        "freq_num": 1,                     //计划频率-次数 ,必须
        "freq_times": [                    //计划频率-时间 ,必须
        ],
        "freq_limit": {},
        "sendTypes": "1",
        "plan_start_type": "1",             //计划开始类型,1-发布成功后立即，2-指定时间 ,必须
        "plan_start_time": "",             //计划开始时间,yyyyMMddhhmmss
        "plan_end_type": "1",
        "plan_end_time": "",               //计划结束时间,yyyyMMddhhmmss，空值时代表一直有效
        "next_route": [],						//下级路由，预览后的next_route，必须
        "draft_matters": [],               //工单事项数组,草稿的matters  ,必须
        "published_matters": []            //工单事项数组,预览后的matters  ,必须      
    }
}
// 常用实体类 End

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
            sendTypes: [{ name: "精确设置", code: "1" }, { name: "模糊设置", code: "0" }],
            // 计划开始类型
            plan_start_type: [{ name: "发布成功后立即", code: "1" }, { name: "指定时间", code: "2" }],
            // 计划结束时间
            plan_end_time_type: [{ name: "一直有效", code: "1" }, { name: "指定时间", code: "2" }],
            // weekType 每周所有枚举
            weekType: [{ name: "周一", code: 1 }, { name: "周二", code: 2 }, { name: "周三", code: 3 }, { name: "周四", code: 4 }, { name: "周五", code: 5 }, { name: "周六", code: 6 }, { name: "周日", code: 7 },],
            // 季度枚举
            seasonType: [{ name: "第一个月", code: 1 }, { name: "第二个月", code: 2 }, { name: "第三个月", code: 3 },],
            // 添加计划所用实例
            addWoPlan: {
                freq_times: [],
                next_route: [],
                draft_matters: [],
                published_matters: [],
                freq_limit: {},
            },
        }
    },
    // 是否是引用计划  项目中引用计划 部分基本信息不可编辑
    //isquote: false,
    // 是否是项目版创建编辑计划 项目版创建编辑计划 需要设置计划生效时间
    //isTerm: false,
    //  是否是编辑计划
    //isEdit: false,
    props: ['addwoplan', 'isquote', 'isterm', 'isedit'],
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
                _that.addWoPlan.freq_times.splice(-1, difference);
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
        // 检查绑定最外层的属性
        // bind_combox: function (newValue, oldValue) {

        //     var _that = this;

        //     /**
        //      *  找到单个实例对应数据集的索引,然后选中该索引对应的下拉菜单
        //      * @param {脏值检查中检查到不同的实例} item 
        //      */
        //     function destory(item) {

        //         var selector = {};

        //         selector.code = item.value;

        //         index = _.findIndex(cbx[item.key], selector);

        //         changeComboxbyKey(item.key, index, false);
        //     }

        //     createCheck(destory)(newValue, oldValue, Object.keys(cbx));
        // },
        // 数据验证
        canUse: function () {
            var _that = this;
            //  验证文本框
            if (!$("#plan_name_text").pverifi()) return false;
            if (!$("#aheadCreateTime").pverifi()) return false;
            if (!$("#peoplenumber").pverifi()) return false;
            if (!$("#planRateRig").pverifi()) return false;

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
            } else {
                if (!$("#num_id").pverifi()) {
                    return;
                }
                if (!_that.addWoPlan.unit) {
                    $("#globalnotice").pshow({
                        text: '间隔次数不能为空',
                        state: "failure"
                    });
                    return;
                }
            }

            return true;
        },
        // 外界获取参数
        argu: function () {
            var addWoPlan = JSON.parse(JSON.stringify(this.addWoPlan));

            addWoPlan.freq_times = addWoPlan.freq_times.map(function (item) {
                return Cycle.prototype.Cycle2Item.call(item);
            })

            return addWoPlan;
        }
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
        }
    },
    watch: {
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
        "addWoPlan.sendTypes": function (value, old) {
            var _that = this;
            if (value == old) return;

            //  重置时间阶段
            _that.addWoPlan.freq_cycle = "m";
            _that.addWoPlan.freq_num = 1;

            if (!+value) {

                _that.addWoPlan.freq_limit = new freq_limit(1, "m");
                _that.$nextTick(function () {
                    $("#cycleTypes_id").psel(0);
                    _that.addWoPlan.freq_limit.unit = _that.cycleTypes[0].code;
                })

                _that.addWoPlan.freq_times = [];
            } else {
                this.addfreq_times(_that.addWoPlan.freq_cycle, _that.addWoPlan.freq_num, _that.addWoPlan.sendTypes)
            }
        },
        //  监听频率次数
        "addWoPlan.freq_num": function (value, old) {

            if (value == old) return;

            this.addfreq_times(this.addWoPlan.freq_cycle, value, this.addWoPlan.sendTypes)
        },
        // 监听频率周期
        "addWoPlan.freq_cycle": function (value, old) {
            if (value == old) return;
            var _that = this;
            // _that.bind_combox({ freq_cycle: value }, { freq_cycle: old });
            this.addfreq_times(value, this.addWoPlan.freq_num, this.addWoPlan.sendTypes);
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
        addWoPlan: function (newValue, oldValue) {

            var _that = this;

            // _that.bind_combox(newValue, oldValue);
        }
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
        var WorkOrderTypePromise = controller.queryWoTypeList().then(function (res) {

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

                    _that.addWoPlan.freq_num = addwoplan().freq_num;
                    _that.addWoPlan.freq_cycle = addwoplan().freq_cycle;

                    return new Promise(function (resolve) {
                        _that.$nextTick(resolve)
                    })
                }).then(function () {

                    //   判断是精确设置还是模糊设置
                    if (addwoplan().sendTypes == 1) {

                        if (_.isArray(addwoplan().freq_times) && addwoplan().freq_times.length) {
                            _that.addWoPlan.freq_times = addwoplan().freq_times.map(function (item) {
                                return new Cycle(item.cycle).ParseItem(item);
                            });
                            _that.bind_fres_times().then(function () {
                                console.log('加载完毕');
                            })
                        }

                    } else {

                        if (addwoplan().hasOwnProperty(freq_limit)) {
                            _that.addWoPlan.freq_limit.num = addwoplan().freq_limit.num;
                            _that.addWoPlan.freq_limit.unit = addwoplan().freq_limit.unit;
                        }
                        $("#cycleTypes_id").psel(_.findIndex(_that.cycleTypes, { code: _that.addWoPlan.freq_limit.unit }));
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

                //  模糊设置间隔单位
                window.cycleTypes_sel = function (item) {
                    _that.addWoPlan.freq_limit.unit = item.code;
                }

                    ; (function () {
                        window.cbx = {
                            order_type: _that.WorkOrderType,// 工单类型编码
                            urgency: _that.urgencyType, // 紧急程度
                            freq_cycle: _that.freq_cycleType,  //计划频率
                            plan_start_type: _that.plan_start_type, //计划开始类型 ,
                            plan_freq_type: _that.sendTypes,

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
                            plan_end_type: {
                                plan_end_type: "code"
                            },
                            //频率精确设置 后期修改
                            plan_freq_type: {
                                plan_freq_type: "code"
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