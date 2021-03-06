var ViewError = function () {
    return {
        isRepeat: false,
        isSpace: false,
        isDescForepartSpace: false,
        verify: [],
        sopeds: [],
    };
}

var pit_positions = function () {
    return {
        "pit_position_asks": [],		// 专业ID数组
        "pit_position_ask_names": [], // 专业名称数组
        "pit_position_state": "0",				//坑位状态  0-空、1-已抢单、2-确认执行
        "pit_position_person_id": "",		//坑位对应人员ID
        "pit_position_person_name": ""		//坑位对应人员名称
    };
}

var MatterO = function () {
    return {
        // 事项名称
        matter_name: "",
        desc_objs: [],
        desc_sops: [], // Sop 列表
        desc_works: [],  // 新建工作内容
        desc_photos: [],
        // 对象描述
        desc_forepart: "",  //  @ 输入框文本
        desc_aftpart: "",   //  # 输入框文本  
        required_control: [],
    };
}

v.pushComponent({
    name: "addwork",
    data: {
        //  事项的错误信息
        mattersViews: [
            new ViewError(),
        ],
        //  事项集合
        matters: [{
            // 事项名称
            matter_name: "",
            desc_objs: [],
            desc_sops: [], // Sop 列表
            desc_works: [],  // 新建工作内容
            desc_photos: [],
            // 对象描述
            desc_forepart: "",  //  @ 输入框文本
            desc_aftpart: "",   //  # 输入框文本  
            required_control: [],
        }],
        "shouldStartType": "1",                // 开始状态 （未确定） 1 要求开始时间和结束时间 0要求固定的时间完成

        //  基础信息
        addwork: {

            "order_type": "",                 //工单类型			
            "order_type_name": "",            //工单类型名称		
            "work_type": "",                  //工作类型			
            "work_type_name": "",             //工作类型名称	
            "execute_type": "temp",           //时间类型	temp-临时、plan-计划
            "urgency": "低",                  //紧急程度，高、中、低
            // "execute_count": "",              // 建议执行人数
            // 新建工单后是否抢单
            robbing_flag: false,              //当前标记增加是否显示返送人员列表
            pit_positions: [],
            "start_time_type": "1",           //开始时间类型,1-发单后立即开始，2-自定义开始时间
            "ask_start_time": "",             //要求开始时间,yyyyMMddhhmmss
            "ask_end_limit": "",             //要求固定时间内完成,单位小时
            "ask_end_time": "",               //要求结束时间,yyyyMMddhhmmssf

            required_tools: [],             //所需工具名称数组 预览后获取
            // 监听 robbing_flag 抢单的情况为2 未抢单情况默认为5
            "order_state": "",                //工单状态编码        2-抢单中、4-未开始、5-执行中、6-审核中、7-延期完成、8-按时完成、9-异常结束
            "order_state_name": "",           //工单状态名称          不填
            "custom_state": "",               //工单自定义标签编码     不填
            "custom_state_name": "",          //工单自定义标签名称     不填

            "order_from_type": "3",

            summary: "",                    // 预览查询
            order_from_id: "",

            "creator_id": "",                 //创建人id
            "creator_name": "",
            domain_list: [],
            "limit_domain": false,
            "do_after_start_time": false,
            "start_minute": "",
            "end_minute": "",
            "input_mode": "1",                   //输入方式，1-自由输入，2-结构化输入,必须
            "order_from_id": "***",              //工单来源id，报修转工单时，这里是报修单id
            "execute_count": ""
        },
        WoTypeList: [],                          // 工单集合
        shouldStartEnums: [{ name: "无", code: "" }, { name: "发单后立即开始", code: "1" }, { name: "自定义开始时间", code: "2" }],
        start_type: [{ name: "发单后立即开始", code: "1" }, { name: "指定时间", code: "2" }],
        urgencyType: [{ "name": "高", "code": "高" }, { "name": "中", "code": "中" }, { "name": "低", "code": "低" }],// 紧急程度集合
        WoTypeListAll: [],
        showPersonTree: false,
        // 查询岗位部门的参数
        queryPersonListByPositionIdsArgu: {

        },
        //  岗位部门集合
        persons: [],
        //  发布工单的参数
        argu: {
            next_person_ids: [],
            draft_matters: [],
            sendPersonName: "请添加人员",
            error: true
        },
        GeneralDictByKey: []
    },
    methods: {
        // 开始时间类型选择事件
        handlerStart_time_type: function (item) {
            this.addwork.start_time_type = item.code;
            if (item.code == 2) {
                //  开始自定义时间的时候自动赋值
                this.addwork.ask_end_time = + new Date();
            }
        },
        // 结束事件选择事件
        handlerEnd_time: function (e) {
            this.addwork.ask_end_time = + new Date(e.pEventAttr.startTime.replace(/\-/g, '/'));
        },
        // 要求开始时间
        handlerstart_time: function (e) {
            this.addwork.ask_start_time = + new Date(e.pEventAttr.startTime.replace(/\-/g, '/'));
        },
        // 开始时间类型
        handlerStartType: function (item) {
            var _that = this;
            _that.addwork.start_time_type = item.code;
        },
        // 工单类型选择事件
        handlerWoType: function (item) {
            var _that = this;

            _that.addwork.order_type = item.plan_id;
            _that.addwork.order_type_name = item.plan_name;
            _that.addwork.work_type = item.work_type;
            _that.addwork.work_type_name = item.work_type_name;
            _that.addwork.work_type_name = item.work_type_name;
            //  计算大小的时间
            if (_.isPlainObject(item.time_limit)) {
                _that.addwork.start_minute = item.time_limit.startTime && item.time_limit.startTime.selected ? (item.time_limit.startTime.around == "front" ? -1 : 1) * item.time_limit.startTime.minute : 0;
                _that.addwork.end_minute = item.time_limit.endTime && item.time_limit.endTime.selected ? (item.time_limit.endTime.around == "front" ? -1 : 1) * item.time_limit.endTime.minute : 0;
            }

            //  保存新建订单后的状态
            if (_.isArray(item.post_and_duty)) {

                _that.addwork.robbing_flag = item.post_and_duty.reduce(function (bool, item) {

                    return item.duty.reduce(function (con, info) {
                        if (con) return con;

                        if (info.code == "create") {
                            _that.addwork.do_after_start_time = info.arrival_time_allow_execute;
                            _that.addwork.limit_domain = info.limit_domain;

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

                _that.addwork.robbing_flag = false;
            }
            // _that.addwork.order_type = item.code;
            // _that.addwork.order_type_name = item.name;
        },
        // 紧急程度选择事件
        handlerUrgency: function (item) {
            var _that = this;
            _that.addwork.urgency = item.code;
        },
        // 查询对应的数组名称
        selecet: function (list, item, key) {
            return (_.find(list, item) || {})[key];
        },
        // 获取对象
        getObj: function (arr) {
            var _that = this;

            _that.desc_str = "";

            _that.matter.desc_objs = _that.matter.desc_objs.concat(arr);

            // 去重
            var obj = {};
            _that.matter.desc_objs = _that.matter.desc_objs.filter(function (item) {
                if (obj.hasOwnProperty(item.obj_name)) return false;
                obj[item.obj_name] = true;
                return true;
            })

            _that.matter.desc_forepart = _that.matter.desc_objs.map(function (obj) {
                return "@" + obj.obj_name + " ";
            }).join('');

        },
        // 获取SOP
        getSOPObj: function (arr) {
            // console.log(arr);
            var _that = this;
            _that.matter.desc_sops = _that.matter.desc_sops.concat(arr);
            _that.matter.desc_aftpart = _that.matter.desc_sops.map(function (item) {
                return (item.hasOwnProperty('sop_name') ? "#" : "@") + (item.sop_name || item.obj_name) + " ";
            }).join("");
            _that.desc_sop_str = "";
            _that.desc_sop_c_str = "";
        },
        // 工作内容
        workContent: function (wk) {

            var _that = this;

            if (_.isPlainObject(wk)) {
                _that.matter.desc_works.push(wk);

                _that.matter.desc_aftpart += " " + wk.work_name + " ";
            }

            this.addcontent = false;
        },
        // 获取岗位
        getPositon: function (index, list) {

            this.addwork.pit_positions[index].pit_position_ask_names = _.map(list, 'name');
            this.addwork.pit_positions[index].pit_position_asks = _.map(list, 'code');
        },
        // 计算执行人数
        comExecutreNumber: function (num) {
            if (num == "") {
                return num;
            }
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
        // 删除事项
        deleteMatter: function (item) {
            var _that = this;
            var index = _that.matters.indexOf(item);
            // 删除对应的事项 和事项报错提示
            _that.matters.splice(index, 1);
            _that.mattersViews.splice(index, 1);
        },
        // 点击下一步操作 验证获取预览信息
        next: function () {
            var _that = this;

            // 开发的时候使用
            // console.log("SuccessFul");
            // console.log(_that.matters);
            // _that.getPreview(_that.matters);
            // _that.onPage = "Preview";
            // return;

            // 获取基本信息
            console.log(_that.addwork);
            // 获取事项集合
            console.log(_that.matters);

            // 基础信息验证 Start
            // 基础的验证消息 验证是否需要选择工单类型
            if (!_that.addwork.order_type.length) {
                $('#globalnotice').pshow({ text: '请选择工单类型', state: 'failure' });
                return;
            }

            // 基础的验证消息 验证执行人数
            if (!$("#execute_count_id").pverifi()) return;

            //  当指定开始时间和结束时间的时候需要验证弹窗提示比对大小的结果
            // $("#startTimeTip").hide();
            // $("#endTimeTip").hide();
            var currTime = +new Date();

            //_that.shouldStartType 单选时间类型  _that.addwork.start_time_type 下拉时间类型
            if (_that.shouldStartType == 1 && _that.addwork.start_time_type == 2) {//要求开始时间和结束时间    自定义开始时间
                _that.addwork.ask_start_time = +new Date(($("#ask_start_time").psel().startTime).replace(/-/g, '.'));
                _that.addwork.ask_end_time = +new Date(($("#ask_end_time").psel().startTime).replace(/-/g, '.'));
                if (_that.addwork.ask_start_time > _that.addwork.ask_end_time) {
                    $('#globalnotice').pshow({ text: '要求完成时间需大于要求开始时间', state: 'failure' });
                    return;
                }
                if (_that.addwork.ask_start_time) {
                    if (_that.addwork.ask_start_time < currTime) {
                        $('#globalnotice').pshow({ text: '要求开始时间需大于当前系统时间', state: 'failure' });
                        return;
                    }
                }
                if (_that.addwork.ask_end_time) {
                    if (_that.addwork.ask_end_time < currTime) {
                        $('#globalnotice').pshow({ text: '要求完成时间需大于当前系统时间', state: 'failure' });
                        return;
                    }
                }

            } else if (_that.shouldStartType == 1 && _that.addwork.start_time_type == "" || _that.shouldStartType == 1 && _that.addwork.start_time_type == "1") {
                _that.addwork.ask_end_time = +new Date(($("#ask_end_time").psel().startTime).replace(/-/g, '.'));
                if (_that.addwork.ask_end_time < currTime) {
                    $('#globalnotice').pshow({ text: '要求完成时间需大于当前系统时间', state: 'failure' });
                    return;
                }
            } else if (_that.shouldStartType == 0 && _that.addwork.start_time_type == "2") {
                _that.addwork.ask_start_time = +new Date(($("#ask_start_time").psel().startTime).replace(/-/g, '.'));
                if (_that.addwork.ask_start_time < currTime) {
                    $('#globalnotice').pshow({ text: '要求开始时间需大于当前系统时间', state: 'failure' });
                    return;
                }
            }

            //验证固定完成时间
            if (!$("#ask_end_limit_num").pverifi()) return;



            // 验证名称非空
            _that.mattersViews.forEach(function (item, index) {
                item.isSpace = !_that.matters[index].matter_name.length;
                item.isDescForepartSpace = !_that.matters[index].desc_forepart.length && !_that.matters[index].desc_aftpart.length && !_that.matters[index].desc_works.length;
            })

            // 验证内容为空
            if (_.filter(_that.mattersViews, { isSpace: true }).length) return;
            if (_.filter(_that.mattersViews, { isDescForepartSpace: true }).length) return;

            // 重名的验证
            _that.mattersViews = _that.mattersViews.map(function (item) {
                item.isRepeat = (_.uniq(_.map(_that.matters, 'matter_name')).length != _that.matters.length);
                return item;
            });
            // matters 验证
            if (_.filter(_that.mattersViews, { isRepeat: true }).length) return;

            //  验证多个关系是否不匹配

            //判断sop是否有值
            Promise.all(_that.matters.map(function (item) {

                if (item.desc_objs.length && item.desc_sops.length) {

                    // 对象与SOP 匹配验证
                    return controller.verifyObjectAndSop({
                        objs: item.desc_objs.map(function (item) {
                            return {
                                obj_id: item.obj_id,
                                obj_name: item.obj_name,
                            }
                        }),
                        sop_ids: _.map(item.desc_sops, "sop_id")
                    })
                } else {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve([]);
                        }, 0);
                    })
                }

                // // 对象与SOP 匹配验证
                // return controller.verifyObjectAndSop({
                //     objs: item.desc_objs.map(function (item) {
                //         return {
                //             obj_id: item.obj_id,
                //             obj_name: item.obj_name,
                //         }
                //     }),
                //     sop_ids: _.map(item.desc_sops, "sop_id")
                // })
            })).then(function (res) {
                // 把原来的错误的状态替换的新的错误信息中
                res.forEach(function (item, index) {

                    item = item.map(function (info) {
                        // 有之前的返回之前的，没有之前的返回新的
                        var find = _.find(_that.mattersViews[index].verify, { obj_name: info.obj_name, sop_name: info.sop_name });
                        return find ? find : info;
                    })

                    _that.mattersViews[index].verify = item;
                });
                // 验证替换后的错误信息是否全部被忽略
                if (
                    !_that.mattersViews.map(function (item) {
                        return _.filter(item.verify, { selected: false }).length
                    }).reduce(function (con, num) {
                        return con + num;
                    }, 0)
                ) {
                    console.log("已经全部被忽略,可以提交预览");
                    //  验证是否被销毁
                    // _that.matters
                    controller.querySopListForSel().then(function (data) {
                        var res = data.res;
                        // 验证所有的 SOP 都在直接提交
                        var bool = _that.matters.reduce(function (con, item, index) {

                            if (!con) return false;
                            //  循环每个matter 的 desc_sop 判断是否存在当前SOP列表中
                            return item.desc_sops.reduce(function (con, info) {

                                var bak = con;

                                var bol = !!_.filter(res, { sop_id: info.sop_id }).length;

                                // 再从忽略列表中查找
                                if (!bol) {

                                    if (!!_.filter(_that.mattersViews[index].sopeds, { sop_id: info.sop_id }).length) {

                                        // 在原来的列表中
                                        var bol = !!_.filter(_that.mattersViews[index].sopeds, { sop_id: info.sop_id, selected: true }).length;
                                    } else {

                                        // 不在原来的列表中
                                        // 已经保存了添加到报废列表中
                                        if (!bol) {
                                            var bak = JSON.parse(JSON.stringify(info));
                                            bak.selected = false;
                                            _that.mattersViews[index].sopeds.push(bak);
                                        }
                                    }
                                }
                                if (!bak) return false;
                                return bol;
                            }, con)
                        }, true);

                        if (bool) {

                            // console.log("SuccessFul");
                            // console.log(_that.matters);
                            //将desc_forepart转成工单预览时的数据结构
                            _that.matters = _that.matters.map(function (item) {
                                item["description"] = item.desc_forepart;
                                return item;
                            })
                            //转换时间格式
                            if (_that.addwork.ask_start_time) {
                                _that.addwork.ask_start_time = new Date(_that.addwork.ask_start_time).format("yMdhm");
                            }
                            if (_that.addwork.ask_end_time) {
                                _that.addwork.ask_end_time = new Date(_that.addwork.ask_end_time).format("yMdhm");
                            }

                            //通过新建选择的要求开始时间类型设置预览时显示的事件模块
                            if (_that.shouldStartType == "1") {
                                _that.addwork.ask_end_limit = "";
                            }

                            _that.getPreview(_that.matters);

                            // controller.queryPersonListByPositionIds().then(function (res) {
                            //     _that.persons = res;
                            //     console.log(res);
                            // })

                            _that.onPage = "Preview";


                            // controller.getWoMattersWorkOrderPreview({
                            //     // order_type: _that.$refs.baseinfomation.addWoPlan.order_type,
                            //     draft_matters: _that.matters,
                            // }).then(function (res) {
                            //     console.log("可以执行保存了");
                            //     // 保存预览时候数据
                            //     _that.WoMattersPreview = res.matters;

                            //     _that.PreView = true;

                            //     // 保存matters
                            //     _that.argu.draft_matters = JSON.parse(JSON.stringify(_that.matters));
                            // })
                        }
                    })
                }
            })

        },
        getPersions: function (list) {//选择人员列表确定
            var _that = this;
            _that.argu.next_person_ids = list;
            _that.showPersonTree = false;
        },
        fillpit_positions: function (robbing_flag, execute_count) {

            var fn = arguments.callee;

            execute_count = +execute_count;

            // 如果是抢单的话的
            if (robbing_flag) {

                if (_.isNumber(execute_count) && execute_count > 0 && execute_count < 10) {
                    // this.addwork.execute_count = this.comExecutreNumber(execute_count);
                    this.addwork.execute_count = execute_count;


                    this.addwork.pit_positions = fill(this.addwork.pit_positions, execute_count, pit_positions)
                } else {
                    // var input = $("#peoplenumber").find("input");
                    // // 如果拥有焦点事件的情况下
                    // if (document.hasFocus() && document.activeElement === input[0]) {
                    //     input.one("blur", fn.bind(this, robbing_flag, execute_count));
                    // } else {
                    //     $("#peoplenumber").pshowTextTip("抢单状态下建议执行人数只允许输入个位数");
                    // }

                    this.addwork.pit_positions = [];
                }

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
                // 如果不是抢单的情况下 重置判断接口
                $("#execute_count_id").precover();
                // if ($("#peoplenumber").pverifi()) {
                //     $("#peoplenumber").precover();
                // }

                this.addWoPlan.pit_positions = [];
            }
        },
        cc: function () {//选择人员取消
            var _that = this;
            _that.showPersonTree = false;
        },
        transTimeType: function (str) {//时间类型转换
            return {
                y: +str.substr(0, 4),
                M: +str.substr(4, 2),
                d: +str.substr(6, 2),
                h: +str.substr(8, 2),
                m: +str.substr(10, 2)
            }
        },
        //事件转工单发布
        submit: function () {
            var _that = this;
            console.log(_that.argu);
            console.log(_that.addwork);
            var comObj = {
                executie_mode: "",
                next_person_ids: [],
                person_id: "",
                work_order: {
                    wo_body: {}
                }
            };
            comObj.work_order.wo_body = $.extend({}, _that.argu, _that.addwork);
            comObj.work_order.wo_body.project_id = v.instance.project_id;
            comObj.work_order.wo_body.matters = comObj.work_order.wo_body.preview;
            delete comObj.work_order.wo_body.preview;

            comObj.executie_mode = v.instance.addwork.execute_type;
            var personArr = [];
            v.instance.persons.forEach(function (item) {
                item.persons.forEach(function (info) {
                    if (info.selected) {
                        personArr.push(info.person_id);
                    }
                })
            })
            comObj.next_person_ids = JSON.parse(JSON.stringify(personArr));
            comObj.person_id = v.instance.userInfo.person_id;
            console.log(comObj);
            $('#globalloading').pshow();
            controller.publishEventTranOrder(comObj).then(function (data) {
                console.log(data);
                if (typeof data == 'object') {
                    $('#globalnotice').pshow({ text: '发布成功', state: 'success' });
                    v.initPage('eventList');
                    v.instance.proEvListPower.isELTHasPage = true;
                    v.instance.getProEvListLenAndData();
                }
                $('#globalloading').phide();
            }, function () {
                $('#globalnotice').pshow({ text: '发布失败，请重试', state: 'failure' });
                $('#globalloading').phide();
            });

        },

    },
    filters: {

    },
    beforeMount: function (event) {

        var _that = this;

        // 保存事件转工单的事件ID
        _that.addwork.order_from_id = event.eventId;
        _that.addwork.creator_id = _that.userInfo.person_id;
        _that.addwork.creator_name = _that.userInfo.name;

        // 查询位置需要的专业
        controller.GeneralDict().then(function (res) {
            _that.WoTypeListAll = res;
        })

        // 查询工作事项完成后操作
        controller.queryGeneralDictByKey().then(function (res) {

            // 只保存 当工作事项完成后人工签字确认 选项
            // _that.GeneralDictByKey = _.filter(res, { code: "matter_end_scan" });
            _that.GeneralDictByKey = res.map(function (item) {
                return item;
            });
        });
        //将事件描述和问题类型带入工单
        if (event.originalData && event.originalData.originalProblemType) {
            _that.matters[0].matter_name = event.originalData.originalProblemType;
        }
        if (event.originalData && event.originalData.originalEventDescribe) {
            _that.matters[0].desc_forepart = event.originalData.originalEventDescribe;
        }
        // 如果事件有图片的情况下 附加到第一个事项中
        if (_.isArray(event.pictures)) {
            if (event.pictures && event.pictures.length > 0) {
                event.pictures = event.pictures.map(function (item) {
                    return item = ('/' + pconst.requestType.pdownload + '/' + psecret.create(item));
                })
            }
            _that.matters[0].desc_photos = event.pictures;
        }
        //转工单时将事件开始结束时间带入工单 0612
        //获取当前时间时间戳
        var currTime = +new Date();

        //1.无开始和结束时间：开始时间选择为无，结束时间显示为当前系统时间+1小时；

        if (!!event && !!event.startTime == false && !!event.endTime == false) {
            v.instance.addwork.start_time_type = "";
            //设置当前时间 加一小时为设置结束时间
            var setEndTime = currTime + 60 * 60 * 1000;
            var tranSetEndTime = new Date(setEndTime).format("yMdhm");
            setTimeout(function () {
                $("#ask_end_time").psel(_that.transTimeType(tranSetEndTime));
            }, 100)

        }
        //2.有开始和结束时间：带入开始和结束时间
        else if (!!event && !!event.startTime && !!event.endTime) {
            v.instance.addwork.start_time_type = "2";
            var st = event.startTime;
            var et = event.endTime;
            var setStartTime = st.replace(/\.|\s|:/g, "");
            var setEndTime = et.replace(/\.|\s|:/g, "");
            _that.$nextTick(function () {
                $("#ask_start_time").psel(_that.transTimeType(setStartTime));
                $("#ask_end_time").psel(_that.transTimeType(setEndTime));
            }, 100)
        }
        //3.有开始无结束时间：带入开始时间，结束时间显示为开始时间+1小时；
        else if (!!event && !!event.startTime && !!event.endTime == false) {
            v.instance.addwork.start_time_type = "2";
            var st = event.startTime;
            var setStartTime = st.replace(/\.|\s|:/g, "");
            var setEndTime = +new Date(st) + 60 * 60 * 1000;
            var tranSetEndTime = new Date(setEndTime).format("yMdhm");
            _that.$nextTick(function () {
                $("#ask_start_time").psel(_that.transTimeType(setStartTime));
                $("#ask_end_time").psel(_that.transTimeType(tranSetEndTime));
            }, 100)
        }
        //4.无开始有结束时间：开始时间显示为发单后立即开始，结束时间显示为当前系统时间+1小时；
        else if (!!event && !!event.startTime == false && !!event.endTime) {
            v.instance.addwork.start_time_type = "1";
            var setEndTime = currTime + 60 * 60 * 1000;
            var tranSetEndTime = new Date(setEndTime).format("yMdhm");
            _that.$nextTick(function () {
                $("#ask_end_time").psel(_that.transTimeType(tranSetEndTime));
            }, 100)
        }
        // 查询用户的权限
        // controller.getPersonByUserId().then(function(res){
        //     console.log(res)
        // });
        controller.queryPersonDetailByPersonId(
            {
                person_id: v.instance.userInfo.person_id
            }
        ).then(function (obj) {

            var item = _.find(obj.project_persons, { project_id: v.instance.project_id });
            // 查询某个岗位拥有某控制模块的工单类型
            // return controller.queryWoTypeListByPersonIdControlCode({ position_id: item.position_id });
            return controller.queryWoTypeListByPersonIdControlCode({ "wo_execute_type": "temp", "repair_flag": "1", "position_id": item.position_id });
        }).then(function (list) {
            _that.WoTypeList = list;
        })

        _that.$nextTick(function () {
            $("#add_work_order_type").precover("请选择");
        })
        // persons

    },
    watch: {
        //发送人姓名
        "argu.next_person_ids": function (newValue, oldValue) {
            var that = this;
            var arr = [];
            if (newValue.length == 0) {
                that.argu.sendPersonName = '请添加人员';
                that.argu.error = true;
            }
            if (newValue.length > 0) {
                that.argu.sendPersonName = newValue.length == '1' ? (newValue[0].name).toString() : '';
                that.argu.error = false;
            }
            if (newValue.length > 1) {
                newValue.forEach(function (item) {
                    arr.push(item.name);
                })
                that.argu.sendPersonName = arr.join('、');
                that.argu.error = false;
            }


        },
        "addwork.execute_count": function (num, old) {

            this.fillpit_positions(this.addwork.robbing_flag, num);
        },
        "addwork.robbing_flag": function (newValue, oldValue) {

            this.fillpit_positions(newValue, this.addwork.execute_count);
        },
        'addwork.ask_start_time': function (date) {
            var date = new Date(date);
            $("#ask_start_time").psel({
                y: date.format("yyyy"),
                M: date.format("MM"),
                d: date.format("dd"),
                h: date.format("hh"),
                m: date.format("mm"),
            }, false)
        },
        'addwork.ask_end_time': function (date) {
            var date = new Date(date);
            $("#ask_end_time").psel({
                y: date.format("yyyy"),
                M: date.format("MM"),
                d: date.format("dd"),
                h: date.format("hh"),
                m: date.format("mm"),
            }, false)
        },
        // "addwork.robbing_flag": function (newValue, oldValue) {
        //     if (newValue) {
        //         this.addwork.execute_count = this.comExecutreNumber(this.addwork.execute_count);
        //         // 生成对应的坑位
        //         this.addwork.pit_positions = _.range(this.addwork.execute_count).map(function () {
        //             return new pit_positions();
        //         })
        //     } else {
        //         this.addwork.pit_positions = [];
        //     }

        //     this.addwork.order_state = newValue ? 2 : 5
        // },
        'addwork.execute_count': function (num, old) {
            // 如果是抢单的话的
            if (this.addwork.robbing_flag) {
                this.addwork.execute_count = this.comExecutreNumber(this.addwork.execute_count);

                this.addwork.pit_positions = fill(this.addwork.pit_positions, num, pit_positions)

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
                this.addwork.pit_positions = [];
            }
        },
        'shouldStartType': function (num, old) {
            var _that = this;
            if (num != old && num == 0) {
                _that.addwork.ask_end_time = +new Date();
            } else {
                _that.addwork.ask_end_limit = "";
            }

        },
        "addwork.start_time_type": function (num, old) {
            var _that = this;
            if (num != old && num == 2) {
                _that.addwork.ask_start_time = +new Date();
            }
        }
    }
}); 
