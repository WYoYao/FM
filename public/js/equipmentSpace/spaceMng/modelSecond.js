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

                //工单
                curPage: '',
                orderDetailData: {},
                orderOperatList: [],
                planObjExampleArr: [],
                userInfo:'',
                showPage: '',//当前显示的页面
                layer: new layerModel(),
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
                        orderDetail_pub.getOrderDetail(this, item.orders[0].order_id, '1');
                    }
                },
                orderLiClick: function (event, item) {//工单列表一行的点击
                    event.stopPropagation();
                    var $orderList = $(event.currentTarget).parents(".orderList");

                    function cb() {
                        $orderList.css({'display': 'none'});
                    }

                    orderDetail_pub.getOrderDetail(this, item.order_id, '1', cb);
                }
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