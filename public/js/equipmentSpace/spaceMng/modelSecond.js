function spaceInfoModel() {
}

spaceInfoModel.instance = function () {
    if (!spaceInfoModel._instance) {
        spaceInfoModel._instance = new Vue({
            el: '#spaceMoleMange',
            data: {
                allBuild: [],//所以建筑
                selBuild: {},//首页选择的建筑
                allFloorInfo: [],//所有楼层信息
                floorDetail: {},//楼层详情信息
                floorTypeArr: ['普通楼层', '中庭', '室外', '其他'],
                allSpace: [],//所有房间信息
                floorSpace: [],//某楼层下的房间信息
                desFloorSpace: [],//拆毁的房间信息
                spaceRemind: [],//房间提醒数组
                spaceRemindCopy: [],//房间提醒数组 备份

                allSpaceCode: [],//所有房间功能类型
                allRentalCode: [],//租赁业态类型
                detailEditSign: true,//楼层是否可以编辑
                floorShowTitle: '建筑下的全部房间',//是否显示所有floor
                selFloorItem: {},//选中的楼层

                spaceFloorArr: [],//房间添加中的楼层
                spaceDetail: {},//房间详细信息
                removeShowSign: false,//是否是拆除界面

                infoPointHis: [],//历史信息
                editFloatName: 'floor',
                editMode: 'modify',//保存方式是  修改输入错误
                
                floorCodeArr:[],//楼层编码
                showWorkOrder:'',
                //工单
                curPage: '',
                orderDetailData: {},
                orderOperatList: [],
                planObjExampleArr: [],
                userInfo:'',
                showPage: '',//当前显示的页面
                layer: new layerModel(),

                // 工单详情数据
                workOrderDetailData: {
                    place: []
                },
                // 添加工具保存数组
                toolarr: [],
                // 是否显示添加工具
                isShowAddTool: false,
                workOrderNoData:"--"

            },
            methods: {
                //滚动监听public事件
                onScrollPub: function (contentView, catVerticalViewClass, axesBoxClass, contentBox, dataList) {
                    var _that = this;
                    var target = $(contentView + ":visible");//内容视窗box
                    var targetCat = $(catVerticalViewClass + ":visible")[0];//目录视窗box
                    //获取目录集
                    var cats = $(axesBoxClass + ":visible").children().children();//目录无长度box子集
                    //获取所有目录div的距顶部距离
                    var catAll = [];
                    for (let k = 0; k < cats.length; k++) {
                        catAll.push(cats[k].offsetTop);
                    }
                    //获取所有内容div的距顶部距离
                    var divs = $(contentBox + ":visible").children();//内容无长度box
                    var len = divs.length;
                    var disAll = [];//div 距顶部距离汇总arr
                    var heiAll = [];//div 高度汇总arr
                    for (let i = 0; i < len; i++) {
                        disAll.push(divs[i].offsetTop);
                        heiAll.push(divs[i].offsetHeight);
                    }
                    var totalLength = target[0].scrollHeight;//可滚动总长度；
                    var viewHeight = target[0].offsetHeight;//滚动视窗高度；
                    var scrollDis = target[0].scrollTop;//已滚动距离；
                    if (scrollDis + viewHeight < totalLength) {//还可以滚动时
                        for (let j = 0; j < disAll.length; j++) {
                            var top = disAll[j];
                            var bottom = disAll[j] + heiAll[j];
                            var scrollTop = target.scrollTop();
                            if (j == 0)top = 0;
                            top = top - 45;
                            bottom = bottom - 45;
                            if (scrollTop >= top && scrollTop < bottom) {
                                if (dataList) {
                                    dataList[j].isSelected = true;//由内容滚动定位目录
                                } else {
                                    $(cats[j]).addClass("sel");
                                }
                                targetCat.scrollTop = catAll[j - 1];
                            } else {
                                if (dataList) {
                                    dataList[j].isSelected = false;
                                } else {
                                    $(cats[j]).removeClass("sel");
                                }
                            }
                        }
                    }
                },
                sureEdit: function (event, ftype) {
                    var $thisDom = $(event.currentTarget);
                    var that = this;
                    var $inputText = $thisDom.parents(".detailItem").find("[widtye='inputText']");
                    if ($inputText.length > 0 && !$inputText.pverifi()) {//输入出现错误
                        return;
                    }
                    function submitCb(res) {//点击确认提交
                        //保存数据
                        var changeTime = res.isNewValue;

                        function call() {//编辑状态隐藏
                            that.detailEditSign = true;
                            var $editShow = $thisDom.parents(".editShow");
                            $editShow.hide();
                            $editShow.siblings(".contShow").show();
                        }

                        if (that.editFloatName == 'floor') {
                            var fvalue = that.floorDetail[ftype];
                            switch (ftype) {
                                case 'floor_local_name':
                                    spaceInfoController.verifyFloorName(function () {//判断名字是否可用
                                        spaceInfoController.updateFloorInfo(changeTime, ftype, fvalue, call);//编辑接口
                                    });
                                    return;
                                    break;
                                case 'floor_local_id':
                                    spaceInfoController.verifyFloorLocalId(function () {//判断名字是否可用
                                        spaceInfoController.updateFloorInfo(changeTime, ftype, fvalue, call);//编辑接口
                                    });
                                    return;
                                    break;
                                case 'BIMID':
                                    if (!!fvalue) {
                                        spaceInfoController.verifyFloorBimId(function () {//判断名字是否可用
                                            spaceInfoController.updateFloorInfo(changeTime, ftype, fvalue, call);//编辑接口
                                        });
                                        return;
                                    }
                                    break;
                            }
                            spaceInfoController.updateFloorInfo(changeTime, ftype, fvalue, call);//编辑接口
                        }
                        if (that.editFloatName == 'space') {
                            ftype == 'room_func_type_name' && (true, ftype = 'room_func_type');//房间类型
                            ftype == 'tenant_type_name' && (true, ftype = 'tenant_type');//租户类型
                            var fvalue = that.spaceDetail[ftype];
                            switch (ftype) {
                                case 'room_local_name':
                                    spaceInfoController.verifySpaceName(function () {//判断名字是否可用
                                        spaceInfoController.updateSpaceInfo(changeTime, ftype, fvalue, call);//编辑接口
                                    });
                                    return;
                                    break;
                                case 'room_local_id':
                                    spaceInfoController.verifySpaceLocalId(function () {//判断名字是否可用
                                        spaceInfoController.updateSpaceInfo(changeTime, ftype, fvalue, call);//编辑接口
                                    });
                                    return;
                                    break;
                                case 'BIMID':
                                    if (!!fvalue) {
                                        spaceInfoController.verifySpaceBimId(function () {//判断名字是否可用
                                            spaceInfoController.updateSpaceInfo(changeTime, ftype, fvalue, call);//编辑接口
                                        });
                                        return;
                                    }
                                    break;
                            }
                            spaceInfoController.updateSpaceInfo(changeTime, ftype, fvalue, call);//编辑接口
                        }
                    }

                    var getPoints = function (cb) {//获取数据
                        if (that.editFloatName == 'floor') {//楼层
                            spaceInfoController.queryFloorInfoPointHis(ftype, cb);//查询历史信息
                        } else {
                            ftype == 'room_func_type_name' && (true, ftype = 'room_func_type');//房间类型
                            ftype == 'tenant_type_name' && (true, ftype = 'tenant_type');//租户类型
                            spaceInfoController.querySpaceInfoPointHis(ftype, cb);
                        }
                    }
                    this.submitTip(event, submitCb, getPoints);
                },
                cancelEdit: function (event) {
                    var $thisDom = $(event.currentTarget);
                    var that = this;

                    function cancelCb() {//点击取消 确认
                        var instance = spaceInfoModel.instance();
                        that.detailEditSign = true;
                        var $editShow = $thisDom.parents(".editShow");
                        $editShow.hide();
                        $editShow.siblings(".contShow").show();
                        if (that.editFloatName == 'floor') {
                            that.floorDetail = JSON.parse(JSON.stringify(spaceInfoController.editDetailCopy));//还原 
                        }
                        if (that.editFloatName == 'space') {
                            that.spaceDetail = JSON.parse(JSON.stringify(spaceInfoController.editDetailCopy));//还原 
                        }
                    }

                    this.cancelTip(event, cancelCb);

                },
                submitTip: function (event, submitCb, getPoints) {//弹出确认框
                    this.layer.submit(event.clientX, event.clientY, submitCb, getPoints);
                },
                cancelTip: function (event, cancelCb) {//
                    this.layer.cancel(event.clientX, event.clientY, cancelCb);
                },
                upFloor: function (findex, item) {
                    floatTipHide();//侧弹框隐藏
                    if (findex == 0 && item.floor_sequence_id != -1) return;//最高层 并且不是地下一层
                    if (item.floor_sequence_id == -1) {//地下一层
                        this.allFloorInfo.forEach(function (ele) {
                            ele.floor_sequence_id++;
                        });
                    } else {
                        var temp = this.allFloorInfo[findex - 1];
                        item.floor_sequence_id = parseInt(item.floor_sequence_id) + 1;
                        temp.floor_sequence_id = parseInt(temp.floor_sequence_id) - 1;
                        Vue.set(this.allFloorInfo, findex - 1, item);
                        Vue.set(this.allFloorInfo, findex, temp);
                    }
                    spaceInfoController.updateFloorOrder();
                },
                downFloor: function (findex, item) {
                    floatTipHide();//侧弹框隐藏
                    if (findex == this.allFloorInfo.length - 1 && item.floor_sequence_id != 0) return;//最底层 并且不是地上一层
                    if (item.floor_sequence_id == 0) {//地上一层
                        this.allFloorInfo.forEach(function (ele) {
                            ele.floor_sequence_id--;
                        });
                    } else {
                        var temp = this.allFloorInfo[findex + 1];
                        item.floor_sequence_id = parseInt(item.floor_sequence_id) - 1;
                        temp.floor_sequence_id = parseInt(temp.floor_sequence_id) + 1;
                        Vue.set(this.allFloorInfo, findex + 1, item);
                        Vue.set(this.allFloorInfo, findex, temp);
                    }
                    spaceInfoController.updateFloorOrder();
                },
                moveDivClick: function (event) {//查看楼层详情
                    event.stopPropagation();
                },
                checkFloorDetail: function (event, item) {//查看楼层详情
                    event.stopPropagation();
                    // $("#globalloading").pshow();
                    $("#spaceCheckFloat").phide();//空间详情隐藏
                    $(".orderList").css({'display': 'none'});//工单列表隐藏
                    $("#floorCheckFloat").pshow();
                    $("#floorCheckFloat .contShow").css({'display': 'block'});
                    $("#floorCheckFloat .editShow").css({'display': 'none'});
                    spaceInfoController.queryFloorById(item);
                    this.detailEditSign = true;
                    this.editFloatName = 'floor';
                    $("#floorCheckFloat .detailFloat").scrollTop(0);   //滚动条复位
                    spaceInfoController.queryFloorIdentity();//获取楼层编码
                },
                spaceItemClick: function (event, item) {//房间模块的点击事件
                    event.stopPropagation();
                    // $("#globalloading").pshow();
                    // 收起选择建筑下拉
                    $("#buildDropDown").pslideUp();
                    
                    $("#floorCheckFloat").phide();//楼层详情隐藏
                    $(".orderList").css({'display': 'none'});//工单列表隐藏
                    $("#spaceCheckFloat").pshow();
                    $("#spaceCheckFloat .contShow").css({'display': 'block'});
                    $("#spaceCheckFloat .editShow").css({'display': 'none'});
                    spaceInfoController.querySpaceById(item);
                    this.removeShowSign ? this.detailEditSign = false : this.detailEditSign = true;
                    this.editFloatName = 'space';
                    $("#spaceCheckFloat .detailFloat").scrollTop(0);   //滚动条复位
                },
                floorItemClick: function (item) {//楼层模块的点击事件
                    this.selFloorItem = item;
                    spaceInfoController.querySpaceForFloor();
                    this.floorShowTitle = item.floor_local_name + '房间';
                },
                checkRemind: function (item) {//选中房间提醒
                    item.is_remind = !item.is_remind;
                },
                orderSignClick: function (event, item) {//详情工单标志的点击
                    event.stopPropagation();
                    var $allOrderList = $("#spaceList").find(".orderList");
                    var $orderList = $(event.currentTarget).find(".orderList");
                    var isShow = false;
                    if ($orderList.is(":visible")) {
                        isShow = true;
                    }
                    floatTipHide();//侧弹框隐藏
                    // $allOrderList.css({ 'display': 'none' });
                    if (!isShow) {
                        item.orders.length > 1 && $orderList.css({'display': 'block'});
                    }
                    if (item.orders.length == 1) {//只有一个工单
                        this.workOrderDetailReady(item.orders[0].order_id)
                        $("#workOrderDetailDivSpace").show();
                       // orderDetail_pub.goWorkOrderDetail(this,"Wo110102000410bc3fde591d46a8931627a104427f62",true);
                       // orderDetail_pub.getOrderDetail(this, item.orders[0].order_id, '1');
                    }
                },
                orderLiClick: function (event, item) {//工单列表一行的点击
                    event.stopPropagation();
                    var $orderList = $(event.currentTarget).parents(".orderList");

                    function cb() {
                        $orderList.css({'display': 'none'});
                    }
                    this.workOrderDetailReady(item.order_id);
                    $("#workOrderDetailDivSpace").show();
                   // orderDetail_pub.goWorkOrderDetail(this,"Wo110102000410bc3fde591d46a8931627a104427f62",true);
                   // orderDetail_pub.getOrderDetail(this, item.order_id, '1', cb);
                },
                //工单详情相关
                 // Start 6.12
            // 解决日历控件和下拉框控件下拉框隐藏问题
            fakerClick: function (event) {
                if (event) {
    
                    var el = event.srcElement ? event.srcElement : event.target;
                    $(el).addClass("NowSelthisEl");
    
                    var elList = $("._combobox_bottom");
    
                    for (var i = 0; i < elList.length; i++) {
                        var elWrap = $(elList[i]).parents(".comboMark");
                        var len = $(elWrap).find(".NowSelthisEl").length;
                        len != 0 ? void 0 : $(elList[i]).css("display", "none");
                    }
    
                    $(el).removeClass("NowSelthisEl");
                } else {
                    // 兼容IE,页面发生一次点击事件
                    $("body").trigger("click");
                }
            },
            transfYMWD: function (str) { //通过年月周天转换对应的中文
                var obj = {
                    y: "年",
                    m: "月",
                    w: "周",
                    d: "日",
                    q: "季"
                }
                return obj[str]
            },
            filter_weekDetail_trans: function (str) {
                var obj = {
                    "01": "周一",
                    "02": "周二",
                    "03": "周三",
                    "04": "周四",
                    "05": "周五",
                    "06": "周六",
                    "07": "周日",
                };
                return obj[str]
            },
            sectionToChinese: function (section) {
                var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
                var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
                var chnUnitChar = ["", "十", "百", "千"];
    
                var strIns = '', chnStr = '';
                var unitPos = 0;
                var zero = true;
                while (section > 0) {
                    var v = section % 10;
                    if (v === 0) {
                        if (!zero) {
                            zero = true;
                            chnStr = chnNumChar[v] + chnStr;
                        }
                    } else {
                        zero = false;
                        strIns = chnNumChar[v];
                        strIns += chnUnitChar[unitPos];
                        chnStr = strIns + chnStr;
                    }
                    unitPos++;
                    section = Math.floor(section / 10);
                }
                return chnStr;
            },
            // yyyymmddhhMMss => yyyy.mm.dd hh:MM  type === '0'
            // yyyymmddhhMMss => yyyy.mm.dd        type === '1'
            timeFormat: function (str, type) {
                str = str || "";
                if ((typeof str) != 'string') { str = str + ""; }
                switch (type) {
                    case '0':
                        return str.length > 0 ? str.substring(0, 4) + '.' + str.substring(4, 6) + '.' + str.substring(6, 8) + ' ' + str.substring(8, 10) + ':' + str.substring(10, 12) : this.noData
                        break;
                    case '1':
                        return str.length > 0 ? str.substring(0, 4) + '.' + str.substring(4, 6) + '.' + str.substring(6, 8) : this.noData
                        break;
                }
            },
            // 后台格式转换日期格式
            yyyyMMddhhmmss2date: function (str) {
    
                return str.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/g, function () {
                    var arr = Array.prototype.slice.call(arguments);
                    return arr.slice(1, 4).join('/') + " " + arr.slice(4, 7).join(':');
                });
            },
            // 普通格式转换
            date2yyyyMMddhhmm: function (date) {
    
                return (new Date(date)).format('yyyy.MM.dd hh:mm');
            },
            // End 6.12
                    // 查看工单详情 ,id工单id，name，name为"workOrderDetail",path在计划模块中使用，其他模块不需要传
                // openWorkOrderDetail: function (id, name, path) {
                //     if (!id) {
                //         console.log("请携带工单ID");
                //         return
                //     };
                //     v.instance.cache = { workOrderId: id }
                //     path ? v.instance.cache.name = path : void 0;
                //    // v.initPage(name);
                //     v.instance.workOrderDetailReady();
                // },
                 // 生成页面
                workOrderDetailReady: function (order_id ) {
                    var that = this;
                    that.isShowAddTool = false;
                    $("#workOrderDetailLoad").pshow();
                  //  console.log(this.cache);
                    PMA.OD({ order_id: order_id  }, function (data) {
                        that.workOrderDetailData = JSON.parse(JSON.stringify(data.work_order.wo_body || {}));
                        // that.workOrderDetailData = JSON.parse(JSON.stringify(data));
                        
                        that.workOrderDetailData.wo_exec_controls && that.workOrderDetailData.wo_exec_controls.length != 0 && that.workOrderDetailData.wo_exec_controls.forEach(function (item) {
                            item.type = that.getWorkOrderCheckType(item.control_code);
                        });

                        if (that.workOrderDetailData.pit_positions && that.workOrderDetailData.pit_positions.length > 0) {
                            var arr = [];
                            that.workOrderDetailData.pit_positions.forEach(function (item, index) {
                                if (item.pit_position_ask_names) {
                                    if (item.pit_position_ask_names.length == 1) {
                                        arr.push({ name: (item.pit_position_ask_names).toString() })
                                    }
                                    if (item.pit_position_ask_names.length > 1) {
                                        arr.push({ name: (item.pit_position_ask_names.join('、')).toString() });
                                    }

                                }
                            })
                            console.log(arr);
                            if (arr.length > 0) {
                                that.workOrderDetailData.place = JSON.parse(JSON.stringify(arr));
                            }
                        }

                        that.workOrderDetailData.matters.forEach(function(item){
                            item.matter_steps.forEach(function(step){
                                if(step.feedback && step.feedback.length){
                                    step.feedback.forEach(function(model){
                                        if(model.confirm_result && model.confirm_result.length){
                                            model.confirm_result.forEach(function(feed){
                                                var str = '';
                                                if(feed.info_points && feed.info_points.length){
                                                    str = feed.info_points.reduce(function(t,a){
                                                        if(a.value || (a.values && a.values.length)){
                                                            if(a.value){
                                                                t += (a.name + '：' + a.value + (a.unit || '')) + ' ； ';
                                                            }else{
                                                                t += (a.name + '：' + a.values.join(",") + (a.unit || '')) + ' ； ';
                                                            }
                                                        }
                                                        return t;
                                                    },str)
                                                }
                                                if(feed.customs && feed.customs.length){
                                                    str = feed.customs.reduce(function(t,a){
                                                        switch(a.type){
                                                            case '1' : 
                                                                if(a.content){t += (a.name + '：' + a.content + ' ； ')}
                                                            break
                                                            case '2' : 
                                                                if(a.item){t += (a.name + '：' + a.item + ' ； ')}
                                                            break
                                                            case '3' : 
                                                                if(a.items && a.items.length){t += (a.name + '：' + a.items.join(',') + ' ； ')}
                                                            break
                                                            case '4' : 
                                                                if(a.value){t += (a.name + '：' + a.value + (a.unit || '') + ' ； ')}
                                                            break
                                                            case '5' : 
                                                                if(a.value){t += (a.name + '：' + a.value + (a.unit || '') + ' ； ')}
                                                            break
                                                        };
                                                        return t;
                                                    },str)
                                                }
                                                feed.str = str;
                                            })
                                        }
                                    })
                                }
                            })
                        })

                    }, function () {
                        that.workOrderDetailData = {};
                    }, function () {
                        $("#workOrderDetailLoad").phide();
                    })
                },
                workOrderArrToString: function (arr) { //普通数组转字符串方法
                    var arr = arr || [];
                    var str = ''
                    if (arr) {
                        str = arr.join("、");
                    } else {
                        str = ""
                    }
                    return str;
                },
                // 获取工单控制模块类型
                getWorkOrderCheckType: function (str) {
                    str = str || "";

                    if (str == 'stop') {
                        return { state: 'stop', type: 'stop' };
                    }
                    if(str == 'assign'){
                        return { state: 'assign', type: 'assign' }
                    }
                    var obj = {};
                    if (str.search('apply') !== -1) {
                        obj.state = 'apply';
                    } else if (str.search('audit') !== -1) {
                        obj.state = 'audit';
                    } else {
                        obj.state = 'approval';
                    }

                    if (str.search('Matters') !== -1) {
                        obj.type = 'ma';
                    } else if (str.search('AddingPeople') !== -1) {
                        obj.type = 'ap';
                    } else if (str.search('ReplacePeople') !== -1) {
                        obj.type = 'rp';
                    } else if (str.search('Delay') !== -1) {
                        obj.type = 'dl';
                    } else {
                        obj.type = 'cl';
                    }
                    return obj;
                },
                // 项目信息点与确认信息异常范围
                createInfoWrongWO: function (model) {
                    var name = model.name;
                    var a = model.wrong_ranges;
                    var b = model.wrongs;
                    var u = model.unit || "";
                    if (a) {
                        if(a.length == 0){ return name;}
                        var str = a.reduce(function (t, item) {
                            // gt-大于,gte-大于等于，lt-小于,lte-小于等于
                            switch (item.type) {
                                case 'gt':
                                    t += (',大于' + item.values + u);
                                    break
                                case 'gte':
                                    t += (',大于等于' + item.values + u);
                                    break
                                case 'lt':
                                    t += (',小于' + item.values + u);
                                    break
                                case 'lte':
                                    t += (',小于等于' + item.values + u);
                                    break
                                case 'range':
                                    t += (item.values[0] + u + '~' + item.values[1] + u);
                                    break
                            }
                            t.slice(0, 1) === ',' ? t = t.slice(1) : void 0;
                            return t;
                        }, "");
                        return name + '：异常范围(' + str + ')';
                    } else if (b) {
                        if(b.length == 0){ return name;}
                        return name + '：异常范围(' + (b.join(u + ',') + u) + ')';
                    } else {
                        return name;
                    }
                },
                getPreview: function (argu) {
                    var _that = this;
                    controller.getWoMattersWorkOrderPreview({
                        draft_matters: argu
                    }).then(function (res) {

                        _that.argu.preview = res.matters;
                        _that.queryPersonListByPositionIdsArgu.domain_list = res.domain_list;
                        //返回数据存在工具时构造数据
                        if(res.required_tools && res.required_tools.length >0){
                            _that.toolarr = [];
                            res.required_tools.forEach(function(item){
                                _that.toolarr.push({name:item});
                            })
                        }
                        controller.queryPersonListByPositionIds(_that.queryPersonListByPositionIdsArgu).then(function (res) {
                            if (res && res.length > 0) {
                                _that.persons = res.map(function (item) {
                                    item.selected = true;
                                    item.persons.map(function (info) {
                                        info.selected = true;
                                        v.instance.argu.next_person_ids.push(info);
                                        return info;
                                    })
                                    return item;
                                });

                                v.instance.argu.next_person_ids;
                                console.log(v.instance.argu.next_person_ids);
                            }

                        })

                        _that.isShowAddTool = true;

                        var res = Object.assign({}, res, JSON.parse(JSON.stringify(_that.addwork)));


                        _that.workOrderDetailData = JSON.parse(JSON.stringify(res)) || {};
                        //判断是否添加选择坑位数组
                        if (_that.addwork.pit_positions && _that.addwork.pit_positions.length > 0) {
                            var arr = [];
                            _that.addwork.pit_positions.forEach(function (item, index) {
                                if (item.pit_position_ask_names) {
                                    if (item.pit_position_ask_names.length == 1) {
                                        arr.push({ name: (item.pit_position_ask_names).toString() })
                                    }
                                    if (item.pit_position_ask_names.length > 1) {
                                        arr.push({ name: (item.pit_position_ask_names.join('、')).toString() });
                                    }

                                }
                            })
                            console.log(arr);
                            if (arr.length > 0) {
                                _that.workOrderDetailData.place = JSON.parse(JSON.stringify(arr));
                            }

                        }

                        if (_.isArray(_that.workOrderDetailData.wo_exec_controls)) {
                            _that.workOrderDetailData.wo_exec_controls.forEach(function (item) {
                                item.type = that.getWorkOrderCheckType(item.control_code);
                            });
                        }
                    }).catch(function () {
                        _that.workOrderDetailData = {};
                    })
                },



            },
            beforeMount: function () {
            },
            watch: {},
            computed: {
                hasUnder: function () {
                    var resArr = this.allFloorInfo.filter(function (ele) {
                        return ele.floor_sequence_id == -1;
                    });
                    var flag = resArr.length > 0 ? true : false;
                    return flag;
                }


            }
        });
    }
    return spaceInfoModel._instance;
}

function floorObj() {
    var self = this;
    self.floor_local_id = '';
    self.floor_local_name = '';
    self.floor_sequence_id = '';
    self.BIMID = '';
    self.floor_type = '';
    self.floor_identity = '';
    self.area = '';
    self.net_height = '';
    self.floor_func_type = '';
    self.permanent_people_num = '';
    self.out_people_flow = '';
    self.in_people_flow = '';
    self.exsit_people_num = '';
}
function spaceObj() {
    var self = this;
    self.build_id = "";
    self.floor_id = "";
    self.room_local_id = "";
    self.room_local_name = "";         //房间本地名称
    self.BIMID = "";                 //BIM编码
    self.room_func_type = ''            //房间功能区类型
    self.room_func_type_name = '',
        self.length = '';
    self.width = '';
    self.height = '';
    self.area = '';
    self.elec_cap = '';                  //配电容量
    self.intro = '';                     //备注文字
    self.tenant_type = '';               //租赁业态类型
    self.tenant_type_name = '',
        self.tenant = '';                   //所属租户
    self.permanent_people_num = '';      //房间内常驻人数
    self.out_people_flow = '';          //逐时流出人数
    self.in_people_flow = '';            //逐时流入人数
    self.exsit_people_num = '';          //逐时房间内现有人数
    self.elec_power = '';              //用电功率
    self.cool_consum = '';               //逐时冷量
    self.heat_consum = '';               //逐时热量
    self.ac_water_press = '';            //空调水压力
    self.water_consum = '';              //用水量
    self.water_press = '';               //自来水压力
    self.hot_water_consum = ''          //热水用水量
    self.hot_water_press = '';           //热水压力
    self.gas_consum = '';               //用燃气量
    self.gas_press = '';                 //燃气压力
    self.PMV = '';                     //热舒适PMV
    self.PPD = ''                        //热舒适PPD
}