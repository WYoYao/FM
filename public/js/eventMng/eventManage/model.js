v.pushComponent({
    name: "eventManage",
    data: {
        eventManageTab: [
            { name: "项目预览", icon: "M" },
            { name: "事件管理", icon: "S" }
        ],
        allEvAssignState: [
            { name: "全部", id: "" },
            { name: "未指派", id: 0 },
            { name: "已指派", id: 1 },
            { name: "已关闭", id: 2 }
        ],
        EvMngCtrPage: {  //集团事件页面控制
            wrap: 0,//tab分页
            list: 0,//tab第一页内分页 0项目列表 1项目事件列表
            group: 0//tab第二页内分页 0集团事件列表 1新建集团事件
        },
        proBoxWidth: "300px",//右侧项目格子宽度
        createEv: {  //新建集团计划页面所用数据
            start: 0,
            end: 0,
        },
        groupEvIndexData: {},//集团事件管理首页数据
        groupListData: { //集团事件列表数据
            num: {},
            data: [],
            total: "",
            sort: {
                type: "",
                name: "",
            }
        },
        evMngProject: {},//操作该项目
        groupEvOpeId: "",//对该集团事件进行操作
        groupEvProjectList: [],//集团事件可指派的项目列表数据
        groupEvProjectList_: [],
        groupEvOrgainTree: [],//组织部门树数据
        groupEvOrgainTree_: [],
        groupEvIngProList: [],//该集团事件相关的正在执行的项目
        groupEvAssignStep: 0,//项目树中选中的项目集合
        city: [
            {
                name: "中国",  // 名称
                deep: 1,  // 层级
                childStatus: false,  // 子对象状态
                selected: false,  // 是否被选中  
                hasBranch: true,  // 是否存在分支  
                gray: false,  // 置灰（不可用状态）
                obj: [  // 子对象数组
                    {
                        name: "北京",
                        deep: 2,
                        childStatus: false,
                        selected: false,
                        hasBranch: true, 
                        gray: false, 
                        obj: [
                            {
                                name: "朝阳区",
                                deep: 3,
                                childStatus: false,
                                selected: false,
                                hasBranch: false, 
                                gray: false, 
                                obj: []
                            },
                            {
                                name: "海淀区",
                                deep: 3,
                                childStatus: false,
                                selected: false,
                                hasBranch: false, 
                                gray: false, 
                                obj: []
                            },
                        ]
                    },
                    {
                        name: "上海",
                        childStatus: false,
                        deep: 2,
                        selected: false,
                        hasBranch: false, 
                        gray: false, 
                        obj: []
                    },
                ]
            },
            {
                name: "美国",
                deep: 1,
                childStatus: false,
                selected: false,
                hasBranch: true, 
                gray: false, 
                obj: [
                    {
                        name: "华盛顿",
                        deep: 2,
                        childStatus: false,
                        selected: false,
                        hasBranch: false, 
                        gray: false, 
                        obj: []
                    }
                ]
            },
        ]
    },
    methods: {

        // 选择分页大Tab
        selEventTab: function () {
            this.EvMngCtrPage.wrap = $("#eventManageTab").psel() === 0 ? 0 : 1;
            // 切换标签时初始化
            if($("#eventManageTab").psel() === 0){
                $("#eventGPKeyWord").precover();
                $("#eventTypeCombo").psel(0)
            }else{
                $("#groupEvSerKey").precover();
                $("#isEvPCombo").psel(0)
                this.EvMngCtrPage.group = 0;
            }
        },


        // 事件管理首页
        // 获取事件管理首页数据
        getEvProListData: function () {
            var that = this;
            $("#eventMngPart").pshow();
            EMA.GI({ keyword: $("#eventGPKeyWord").pval().key,eventType: ($("#eventTypeCombo").psel().index === 0 || $("#eventTypeCombo").psel() === undefined) ? null : $("#eventTypeCombo").psel().index - 1 }, function (data) {
                that.groupEvIndexData = JSON.parse(JSON.stringify(data[0])) || {};
            }, function () {
                that.groupEvIndexData = {};
            }, function () {
                $("#eventMngPart").phide();
            });
        },
        // 搜索
        proEvSearch: function () {
            this.getEvProListData();
        },
        // 选择项目事件类型
        selProEventType: function () {
            this.getEvProListData();
        },
        // 计算每个项目的小格子的宽度
        computeBoxWidth: function () {
            var a = $("#proWrap").width();
            var b = Math.floor(a / 310);
            return (Math.floor(a / b) - 12 + 'px');
        },
        // 打开某项目的事件列表
        openProEvList: function (model) {
            this.eventListRecover();
            this.proEvListPower = {
                closeEvent: false,      // 关闭事件权限
                isCanSelState: true,   // 是否能够选择事件状态
                isELTHasPage: true,   // 是否分页
            }
            this.evMngProject = model;
            this.eventListProjectId = model.projectId;
            this.EvMngCtrPage.list = 1;
            this.getProEvListData();
            this.getProEvListLen();
        },


        // 集团事件列表
        // 获取集团事件数量
        getGroupEvNum: function () {
            var that = this;
            EMA.GL({}, function (data) {
                that.groupListData.num = JSON.parse(JSON.stringify(data[0])) || {};
            }, function () {
                that.groupListData.num = {};
            }, function () {

            });
        },
        // 获取集团事件列表数据
        getGroupEvList: function () {
            var that = this;
            var param = {
                "page": $("#groupEventPage").psel(),        					 //分页页码
                "pageSize": that.evPageLen,     							     //分页条数  分页页码与分页条数如果不传的话默认不分页
                "orderName": that.groupListData.sort.name,   				 //排序字段,startTime-开始服务时间,endTime-要求完成时间 非必须
                "orderType": that.groupListData.sort.type,    			     //升序降序,asc-升序,desc-降序 非必须,默认创建时间排序倒序方式
            }
            // $("#isEvPCombo").psel() ? param.groupEventState = $("#isEvPCombo").psel().id : void 0;
            $("#isEvPCombo").psel().id ? param.groupEventState = $("#isEvPCombo").psel().id : void 0;
            $("#groupEvSerKey").pval().key.length > 0 ? param.keyword = $("#groupEvSerKey").pval().key : void 0;
            $("#groupEvListLoading").pshow();
            EMA.GD(param, function (data) {
                $("#groupEventPage").pcount(Math.ceil(data[0].total / that.evPageLen));
                that.groupListData.data = JSON.parse(JSON.stringify(data[0].contents)) || [];
                that.groupListData.data.total = data[0].total || 0;
            }, function () {
                that.groupListData.data = [];
                that.groupListData.data.total = 0;
            }, function () {
                $("#groupEvListLoading").phide();
            });
        },
        // 获取集团事件可指派的项目列表
        getGroupEvProList: function () {
            var that = this;
            $("#groupEvAssignProLoading").pshow();
            var param = { groupEventId: that.groupEvOpeId, };
            $("#groupEvProKey").pval().key.length > 0 ? param.keyword = $("#groupEvProKey").pval().key : void 0;
            EMA.GP(param, function (data) {
                that.groupEvProjectList = JSON.parse(JSON.stringify(data)) || [];
                // deep: 1,  // 层级
                // childStatus: false,  // 子对象状态
                // selected: false,  // 是否被选中  
                // hasBranch: true,  // 是否存在分支  
                // gray: false,  // 置灰（不可用状态）
                var newObj = JSON.parse(JSON.stringify(data));
                (function recursion(newObj,deep){
                    newObj.map(function(item,index){
                        item.childStatus = false;  
                        item.selected = false;  
                        item.gray = false; 
                        item.contents && item.contents.length > 0 ? item.hasBranch = true : item.hasBranch = false;  
                        item.deep = deep+1;  
                        item.name = item.partition_project_name;
                        item.obj = item.contents ? item.contents : [];
                        item.hasBranch ? recursion(item.obj,item.deep) : null;
                    })
                })(newObj,0);
                that.groupEvProjectList_ = newObj;
            }, function () {
                that.groupEvProjectList = [];
                that.groupEvProjectList_ = [];
            }, function () {
                $("#groupEvAssignProLoading").phide();
            })
        },
        // 获取部门树
        getGroupEvListOrign: function () {
            var that = this;
            $("#groupEvAssignProLoading").pshow();
            EMA.OT({ keyword: $("#groupEvDeptKey").pval().key }, function (data) {
                that.groupEvOrgainTree = JSON.parse(JSON.stringify(data.data)) || [];
                var newObj = JSON.parse(JSON.stringify(data.data));
                (function recursion(newObj,deep){
                    newObj.map(function(item,index){
                        item.childStatus = false;  
                        item.selected = false;  
                        item.gray = false; 
                        item.child_objs && item.child_objs.length > 0 ? item.hasBranch = true : item.hasBranch = false;  
                        item.deep = deep+1;  
                        item.name = item.obj_name;
                        item.obj = item.child_objs ? item.child_objs : [];
                        item.hasBranch ? recursion(item.obj,item.deep) : null;
                    })
                })(newObj,0);
                that.groupEvOrgainTree_ = newObj;
            }, function () {
                that.groupEvOrgainTree = [];
                that.groupEvOrgainTree_ = [];
            }, function () {
                $("#groupEvAssignProLoading").phide();
            })
        },

        // 集团事件列表排序
        groupEvListSort: function (ev, type) {
            this.eventMngListSort(ev, type, v.instance.groupListData.sort);
            $("#groupEventPage").psel(1, false);
            this.getGroupEvList();
        },
        // 选择事件指派状态
        selEvAssignState: function () {
            $("#groupEventPage").pcount(1, false);
            this.getGroupEvList();
        },
        // 选择分页
        selGroupEventPage: function () {
            this.getGroupEvList();
        },
        // 搜索框
        groupEvListSeaKey: function () {
            $("#groupEventPage").pcount(1, false);
            this.getGroupEvList();
        },
        // 指派集团事件
        openAssignW: function (model) {
            if (model) { this.groupEvOpeId = model.groupEventId };
            this.groupEvAssignStep = 0;
            $("#groupEvProKey").pval("", false);
            $("#groupEvProKey").pval("", false);
            $("#evProListTree").precover();
            this.getGroupEvProList();
            $("#groupEvAssignW").pshow();
        },
        // 指派集团事件下一步
        groupEvAssignFin: function (type) {
            if (type) {
                var newArr = [];
                var selectedArr = (function recursion(arr){   
                    arr.map(function(item,index){
                        (item.selected == true && item.type == "0") ? newArr.push(item) : null;
                        item.hasBranch ? recursion(item.obj) : null;
                    })
        
                })(this.groupEvProjectList_);
                if (newArr.length != 0) {
                    this.groupEvSelProList = newArr;
                    this.groupEvAssignStep = 1;
                    $("#groupEvDeptKey").precover();
                    $("#groupEvAssignW .per-modal-custom_title").html("选择部门")
                } else {
                    $("#globalnotice").pshow({ text: "请选择需要指派的项目(非项目选中无效)", state: "failure" });
                }
            } else {
                $("#groupEvAssignW").phide();
            }
        },
        // 指派集团事件选择部门下一步
        groupEvAssignTwoFin: function (type) {
            var that = this;
            if (type) {
                var newArr = [];
                var selectedArr = (function recursion(arr){   
                    arr.map(function(item,index){
                        (item.selected == true) ? newArr.push(item) : null;
                        item.hasBranch ? recursion(item.obj) : null;
                    })
        
                })(this.groupEvOrgainTree_);
                if (newArr.length == 0) {
                    $("#globalnotice").pshow({ text: "请选择需要指派的部门", state: "failure" });
                    return;
                }   
                var param = {
                    person_id: v.instance.userInfo.person_id,
                    groupEventId: this.groupEvOpeId,
                    projectIds: that.groupEvSelProList.reduce(function (total, item) {
                        if (item.type == "0") {    //只提交项目id
                            total.push(item.partition_project_id);
                        }
                        return total;
                    }, []),
                    deptIds: newArr.map(function (item) {
                        return item.obj_id;
                    })
                }
                EMA.AG(param, function (data) {
                    $("#globalnotice").pshow({ text: "指派成功", state: "success" });
                    $("#groupEvAssignW").phide();
                    $("#eventInfoFloat").css("display") === 'block' && that.getGroupEvInfo();
                    that.getGroupEvList();
                    // $("#evOrgainTree").precover();
                }, function () { }, function () { });
            } else {
                // $("#groupEvAssignW").phide();
                this.groupEvAssignStep = 0;
                // $("#evOrgainTree").precover();
                $("#groupEvAssignW .per-modal-custom_title").html("选择项目")
            }
        },
        // 删除集团事件
        deleteGroupEv: function (model) {
            if (model) { this.groupEvOpeId = model.groupEventId };
            $("#deleteGroupEvW").pshow({ title: '您确定要删除该事件吗' });
        },
        // 删除集团事件确认
        deleteGroupEvFin: function (type) {
            var that = this;
            if (type) {
                EMA.DG({ groupEventId: that.groupEvOpeId }, function () {
                    $("#globalnotice").pshow({ text: "删除成功", state: "success" });
                    $("#deleteGroupEvW").phide();
                    $("#eventInfoFloat").css("display") === 'block' && $("#eventInfoFloat").phide();
                    that.getGroupEvList();
                    that.getGroupEvNum();
                }, function () {
                    // $("#globalnotice").pshow({text: "删除失败",state: "failure"});
                }, function () {
                })
            } else {
                $("#deleteGroupEvW").phide();
            }
        },
        // 关闭集团事件
        closeGroupEv: function (model) {
            var that = this;
            if (model) { that.groupEvOpeId = model.groupEventId }
            EMA.NB({ groupEventId: that.groupEvOpeId }, function (data) {
                that.groupEvIngProList = JSON.parse(JSON.stringify(data || []));
                if (that.groupEvIngProList.length != 0) {
                    $("#groupEvCloseW").pshow();
                } else {
                    that.closeGroupEvFin(true);
                }
            }, function () { }, function () { })
        },
        // 关闭集团事件确认
        closeGroupEvFin: function (type) {
            var that = this;
            if (type) {
                EMA.CG({ person_id: v.instance.userInfo.person_id, groupEventId: that.groupEvOpeId, groupEventState: 2 + "" }, function (data) {
                    $("#globalnotice").pshow({ text: "关闭成功", state: "success" });
                    $("#groupEvCloseW").phide();
                    $("#eventInfoFloat").css("display") === 'block' && that.getGroupEvInfo();
                    $("#eventInfoFloat").hide();
                    that.getGroupEvList();
                    that.getGroupEvNum();
                }, function () {
                    // $("#globalnotice").pshow({text: "关闭失败",state: "failure"});
                }, function () {
                })
            } else {
                $("#groupEvCloseW").phide();
            }
        },
        backGroupEv: function (model) {
            // console.log(model);
            this.EvInfoType = "group";
        }, 
        // 搜索该项目
        searchThisEvPro: function () {
            this.getGroupEvProList();
        },
        // 集团事件页面初始化
        recoverGroupEvList: function () {
            $("#groupEventPage").psel(1, false);
            $("#groupEvSerKey").pval("", false);
        },




        // 创建新集团事件
        // 打开创建事件页面
        createNewEvent: function () {
            this.recoverCreateGroupEv();
            this.EvMngCtrPage.group = 1;
        },
        // 重置创建事件页面
        recoverCreateGroupEv: function () {
            var t = new Date();
            var y = t.getFullYear();
            var M = t.getMonth() + 1;
            var d = t.getDate();
            var h = t.getHours();
            var m = t.getMinutes();
            $("#createGroupEventText").phideTextTip();
            $("#createGroupEventText").pval("");
            $("#createGroupEventImg").precover();
            $("#createGroupEventStart").psel(0);
            $("#groupEventEnd").psel(0);
            $("#groupEventStartTime").psel({ y: y, M: M, d: d, h: h, m: m, startYear: 2003, endYear: 2099 });
            $("#createGroupEventEndTime").psel({ y: y, M: M, d: d, h: h, m: m, startYear: 2003, endYear: 2099 });
            $("#createGroupEvFixStart").precover();
        },
        // 创建新事件结束
        createEvFin: function (type) {
            var that = this;
            if (type) {

                // if (this.createEv.end === 0) {
                    if (!$("#newGroup").pverifi()) { return };
                // }
                var param = {
                    "person_id": v.instance.userInfo.person_id,
                    "groupEventDescribe": $("#createGroupEventText").pval(),     			  //事件描述
                    // "pictures":[],       			  //照片ID数组
                    "requireTimeType": String(this.createEv.start),    				  //要求开始时间类型,0-指派后立即开始,1-指定时间
                };
                var files = $("#createGroupEventImg").pval();
                if (files.length > 0) {
                    var attachments = files.map(function (currentValue) {
                        return {
                            path: currentValue.url,
                            fileName: currentValue.name,
                            toPro: "pictures",
                            fileSuffix: currentValue.suffix,
                            fileType: 1
                        }
                    });
                    param.attachments = attachments;
                }
                this.createEv.start === 1 ? param.startTime = new Date($("#groupEventStartTime").psel().startTime.replace(/-/g, "/")).format("yyyyMMddhhmmss") : void 0;
                this.createEv.end === 0 ? param.requireFixedTime = $("#createGroupEvFixStart").pval() :
                    param.endTime = new Date($("#createGroupEventEndTime").psel().startTime.replace(/-/g, "/")).format("yyyyMMddhhmmss");
                // 验证事件开始时间是否早于当前服务器时间，早于则提示修改
                if(param.startTime){
                    if(!v.currentTime){
                        console.log("系统时间获取失败！",that);
                        return;
                    }
                    if(new Date($("#groupEventStartTime").psel().startTime).getTime() < v.currentTime){
                        $("#globalnotice").pshow({ text: "事件开始时间不能早于当前时间，请检查后提交", state: "failure" });
                        return;
                    }
                }   
                // 验证事件结束时间是否早于当前服务器时间，早于则提示修改
                if(param.endTime){
                    if(!v.currentTime){
                        console.log("系统时间获取失败！",that);
                        return;
                    }
                    if(new Date($("#createGroupEventEndTime").psel().startTime).getTime() < v.currentTime){
                        $("#globalnotice").pshow({ text: "事件结束时间不能早于当前时间，请检查后提交", state: "failure" });
                        return;
                    }
                } 
                // 验证事件开始时间是否晚于结束时间，晚于则提示修改
                if (param.startTime && param.endTime) {
                    var start = new Date($("#groupEventStartTime").psel().startTime.replace(/-/g, "/")).getTime();
                    var end = new Date($("#createGroupEventEndTime").psel().startTime.replace(/-/g, "/")).getTime();
                    if (start > end) {
                        $("#globalnotice").pshow({ text: "事件结束时间不能早于开始时间，请检查后提交", state: "failure" });
                        return;
                    }
                }
                
                $("#eventMngPart").pshow()
                EMA.NG(param, function () {
                    $("#globalnotice").pshow({ text: "新建成功", state: "success" });
                    that.recoverGroupEvList();
                    that.getGroupEvNum();
                    that.getGroupEvList();
                    that.EvMngCtrPage.group = 0; // 此项并非同步执行代码，触发 值 的set事件，只是添加到事件队列
                    setTimeout(function(){$($("#groupEvList .per-scrollbar_wrap")[1]).scrollTop(0);},0); // 此时项目未显示（display：none）无法修改滚动条，同样注册到事件队列
                }, function () { }, function () {
                    $("#eventMngPart").phide()
                });
            } else {
                that.EvMngCtrPage.group = 0;
            }
        },
        // 选择事件开始时间模式
        groupEventStartSel: function () {
            this.createEv.start = Number($("#createGroupEventStart").psel().id);
        },
        // 选择事件结束时间模式
        groupEventEndtSel: function () {
            this.createEv.end = $("#groupEventEnd").psel() ? 0 : 1;
        },

    },
    filters: {

    },
    watch: {

    },
    beforeMount: function () {
        this.getEvProListData();// 获取事件管理首页数据
        this.getGroupEvList(); // 获取集团事件列表数据
        this.getGroupEvNum(); // 获取集团事件数量
        // this.proEvInPower.isEdit = true; // 设置为不可编辑状态
        this.proEvListPower.closeEvent = false;
        $("#eventManageTab").psel(this.EvMngCtrPage.wrap, false);
        // 计算右侧项目格子宽度
        this.$nextTick(function () {
            this.proBoxWidth = this.computeBoxWidth();
            this.showDepartmentCombo = false;
        })
    }
});