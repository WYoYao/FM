v.pushComponent({
    name: "eventInfo",
    data: {
        proEvInPower: { //项目事件详情页面控制
            isEdit: false, //是否正在编辑
            showObj: false, //是否显示对象，原始信息里的
            showObjT: false, //是否显示对象，修正信息里的
        },
        proEvInfoData: { //项目事件详情数据，easy存放之前带过来的数据，full存放接口获取的完整数据
            easy: {},
            full: {},
        },
        someEventType: [
            // { name: "客户报修", code: 1 },
            // { name: "工程报修", code: 2 },
            // { name: "总部指派", code: 3 },
            // { name: "数据异常", code: 4 },
        ],
        proEvStr: "", //文本框里的字段
        proEvDesc_str: "", //搜索用的字段
        proEvObjs: [], //文本框中的对象
        EvInfoType: "project", //当前事件是集团的还是项目的，集团group，项目project
        groupEvInfoData: { //集团事件详情弹窗所用数据
            isResever: false, //是否展开，true为收起状态，false为展开状态
            easy: {},
            full: {}
        },
        allWkOrdSta: ["待接单", "已接单", "处理中"],
        allcleRon: ['误报', '重复报修', '其他', '工单已完成'],
        allEvSta: ["未指派", "已指派", "已关闭"],
        // allEvSte: ["待处理", "工单待接单", "工单运行中", "已关闭"],
        allEvSte: ["待处理", "处理中", "已关闭"],
        allEvType: ["客户报修", "工程报修", "总部指派", "数据异常"],
        allObjType: {
            build: "建筑",
            floor: "楼层",
            space: "空间",
            system: "系统实例",
            equip: "设备实例",
            system_class: "系统类",
            equip_class: "设备类"
        }
    },
    methods: {
        // 打开项目事件详情
        openProEvInfoW: function (data) {
            this.resetProEvInfo();
            this.stopModelEvPropagation(false);
            this.EvInfoType = "project";
            this.closedEvId = data.eventId;
            this.proEvInfoData.easy = data;
            this.getProEvInfo();
            $("#eventInfoFloat").pshow();
        },
        // 重置项目事件详情弹窗
        resetProEvInfo: function () {
            this.proEvInPower = {
                isEdit: false,
                showObj: false,
                showObjT: false,
            }
            this.proEvInfoData = {
                easy: {},
                full: {},
            }
        },
        // 双层弹窗
        stopModelEvPropagation: function (type) {
            if (type) {
                $(".per-modal-mask").bind('click', function (ev) {
                    ev.stopPropagation()
                });
            } else {
                $(".per-modal-mask").unbind('click', function (ev) {
                    ev.stopPropagation()
                });
            }
        },
        // 获取项目事件详情
        getProEvInfo: function () {
            var that = this;
            $("#EvInfoLoading").pshow();
            EMA.EI({
                eventId: this.proEvInfoData.easy.eventId
            }, function (data) {
                that.proEvInfoData.full = JSON.parse(JSON.stringify(data[0])) || {};
            }, function () {
                that.proEvInfoData.full = {};
            }, function () {
                $("#EvInfoLoading").phide();
            })
        },
        // 在事件详情弹窗中关闭项目事件
        proEvInfoCloseSel: function (sel) {
            this.selCloseProEvWay(sel, 'list');
        },
        // 编辑项目事件信息
        editProEvInfo: function () {
            var that = this;
            that.textareaBlur("focus");
            this.proEvInPower.isEdit = true;
            EMA.QT({}, function (data) {
                that.someEventType = JSON.parse(JSON.stringify(data)) || [];
                $("#editEvTypeCombo").precover("请选择");
                that.proEvStr = "";
            }, function () {
                that.someEventType = [];
            }, function () {
                $("#EvInfoLoading").phide();
            })
        },
        // 项目详情打开关闭原因下拉框
        openProEvInfoCloseSel: function (obj) {
            document.querySelector(obj).childNodes[0].click();
        },
        // 查看项目事件重复事件
        lookProEvRepeatEv: function () {
            this.closedEvId = this.proEvInfoData.full.repeatedEventId;
            this.getProEvInfo();
        },




        // 打开工单详情
        evInfoToWorkOrder: function (id) {
            // debugger
            $("#eventInfoFloat").phide();
            this.openWorkOrderDetail(id, 'workOrderInfo');
        },
        // 转工单
        eventToWorkOrder: function (id) {
            $("#eventInfoFloat").phide();
            var that = this;
            EMA.EI({
                eventId: id
            }, function (data) {
                data = data[0];
                // data.pictures = ["https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/home/img/qrcode/zbios_efde696.png", "https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/home/img/qrcode/zbios_efde696.png"]

                v.initPage("addwork", data);


                console.log(data);
            }, function () {

            }, function () {

            })
        },
        // 编辑项目信息确认
        editEventInfo: function (type) {
            var that = this;
            
            if (type) {
                if(that.proEvStr==""){
                    that.textareaBlur("blur");
                    return;
                }

            
                var x = that.proEvObjs.length ? that.proEvObjs.reduce(function (t, a) {
                    t += a.obj_name + ',';
                    return t
                }, "") : "";
                x === "" ? void 0 : x = x.substr(0, x.length - 1);
                var param = {
                    eventId: that.proEvInfoData.full.eventId,
                    person_id: v.instance.userInfo.person_id,
                    reviseProblemType: $("#editEvTypeCombo").psel().text?$("#editEvTypeCombo").psel().text:'',
                    reviseEventDescribe: that.proEvStr,
                    reviseAssociationObject: that.proEvObjs,
                    reviseAssociationObjectString: x
                }
                $("#EvInfoLoading").pshow();
                EMA.CI(param, function (data) {
                    $("#globalnotice").pshow({
                        text: "修改成功",
                        state: "success"
                    });
                    that.getProEvInfo();
                }, function () {
                    $("#EvInfoLoading").phide();
                }, function () { })
            }
            this.proEvInPower.isEdit = false;
        },

        ProEvgetObjs: function (arr) {
            var _that = this;
            _that.proEvObjs = _that.proEvObjs.concat(arr);
            _that.proEvDesc_str = "";

            // 去重
            var obj = {};
            _that.proEvObjs = _that.proEvObjs.filter(function (item) {
                if (obj.hasOwnProperty(item.obj_name)) return false;
                obj[item.obj_name] = true;
                return true;
            })

            // 更新文本信息
            _that.proEvStr = replaceTemplate('@', _that.proEvStr, _that.proEvObjs.map(function (obj) {
                return obj.obj_name;
            }));
        },


        // 打开集团事件详情侧弹窗
        openGroupEvInfoW: function (model) {
            this.EvInfoType = "group";
            this.groupEvOpeId = model.groupEventId;
            this.groupEvInfoData.easy = JSON.parse(JSON.stringify(model));
            this.groupEvInfoData.isResever = false;
            $("#evProWrap").fadeIn();
            $("#eventInfoFloat").pshow();
            this.getGroupEvInfo();
        },
        // 获取集团事件详情
        getGroupEvInfo: function () {
            var that = this;
            $("#EvInfoLoading").pshow();
            EMA.GE({
                groupEventId: that.groupEvOpeId
            }, function (data) {
                that.groupEvInfoData.full = JSON.parse(JSON.stringify(data[0])) || {};
                // that.groupEvInfoData.full.groupEventState >=0 ? that.groupEvInfoData.full.groupEventStateText = that.allEvSta[that.groupEvInfoData.full.groupEventState] : void 0;
                // that.groupEvInfoData.full.assignedProjects.forEach(function(item){
                //     item.workOrderState >=0 ? item.workOrderStateText = that.allWkOrdSta[item.workOrderState] : void 0;
                //     item.closeType >=0 ? item.closeTypeText = that.allcleRon[item.closeType] : void 0;
                //     item.eventState >=0 ? item.eventStateText = that.allEvSta[item.eventState] : void 0;
                // })
            }, function () {
                that.groupEvInfoData.full = {};
            }, function () {
                $("#EvInfoLoading").phide();
            })
        },
        // 集团事件所指派项目列表区域显示控制
        evProControl: function () {
            this.groupEvInfoData.isResever ? $("#evProWrap").fadeIn() : $("#evProWrap").fadeOut();
            this.groupEvInfoData.isResever = !this.groupEvInfoData.isResever;
        },
        // 查看集团事件指派的项目事件详情
        lookProjectEvInfo: function (model) {
            this.proEvListPower.closeEvent = false;
            this.openProEvInfoW(model);
        },
        //问题修正 多行文本框 失去焦点事件
        textareaBlur:function(type){ 
            var that = this;
            if(type=="focus"){
                $("#textareaErrorClass").removeClass("input-error");
                $("#textareaErrorTip").hide();
            }else if(type=="blur"){
                if( that.proEvStr==""){
                    $("#textareaErrorClass").addClass("input-error");
                    $("#textareaErrorTip").show();
                }
            }
             
        }

    },
    filters: {

    },
    watch: {
        proEvStr: function (newValue, old) {
            var _that = this;
            var res = createInputWatch('@', _that.proEvObjs)(newValue, old);

            _that.proEvStr = res.value;
            _that.proEvObjs = res.list;
            _that.proEvDesc_str = res.str;
        }
    }
});