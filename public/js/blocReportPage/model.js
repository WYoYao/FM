blocReportModel = {
    showName: '测试&nbsp;&nbsp;名字',
    pageShow: 0,
    tabMenus: [
        { name: "维修工单", isActive: true, icon: "z" },
        { name: "巡检工单", isActive: false, icon: "z" },
        { name: "维保工单", isActive: false, icon: "z" },
        { name: "运行工单", isActive: false, icon: "z" },
        { name: "管理人员KPI", isActive: false, icon: "z" },
    ],
    projectSelect: [//项目
     {
         name: "全部",
         id: "0"
     }, {
         name: "项目1",
         id: "1"
     }, {
         name: "项目2",
         id: "2"
     }, {
         name: "项目3",
         id: "3"
     }
    ],
    timeTypeSelect: [//时间类型
        {
            name: "全部",
            id: "0"
        }, {
            name: "计划",
            id: "1"
        }, {
            name: "临时",
            id: "2"
        }
    ],
    priorLevelSelect: [//优先级
        {
            name: "全部",
            id: "0"
        }, {
            name: "高",
            id: "1"
        }, {
            name: "中",
            id: "2"
        }, {
            name: "低",
            id: "3"
        }
    ],
    specialtySelect: [//专业
        {
            name: "全部",
            id: "0"
        }, {
            name: "空调",
            id: "1"
        }, {
            name: "给排水",
            id: "2"
        }, {
            name: "强电",
            id: "3"
        }
    ],
    repairWorkOrder: [//维修工单
    {
        name: '项目A',
        orderNum: 24,
        sfOrderNum: '11   58',
        sfOrderRate: 58,
        xyOrderNum: '11 58',
        xyOrderRate: 58,
        innerOrderNum: '11 58',
        innerOrderRate: 56,
        timelyCompleteBig: 89.5,
        timelyCompleteSmall: 89.5,
        overdueRate: 56.3,
    }
    ],
    inspectWorkOrder: [//巡检工单
        {
            name: '项目A',
            orderNum: 24,
            undonePointNum: 11,
            undonePointRate: 58,
            overdueUndonePointNum: 58,
            overdueUndonePointRate: 58,
            donePointNum: 58,
            donePointRate: 56,
            overdueDonePointNum: 11,
            overdueDonePointRate: 11,
            pointUnusualRate: 89.5,
            timelyCompleteSmall: 56.3,
            inspectPointNum: 89.5,
            missInspectNum: 89.5,
            missInspectRate: 56.3,
        }, {
            name: '项目A',
            orderNum: 24,
            undonePointNum: 11,
            undonePointRate: 58,
            overdueUndonePointNum: 58,
            overdueUndonePointRate: 58,
            donePointNum: 58,
            donePointRate: 56,
            overdueDonePointNum: 11,
            overdueDonePointRate: 11,
            pointUnusualRate: 89.5,
            timelyCompleteSmall: 56.3,
            inspectPointNum: 89.5,
            missInspectNum: 89.5,
            missInspectRate: 56.3,
        }
    ],
    maintainWorkOrder: [//维保工单
    {
        name: '项目A',
        orderNum: 24,
        undonePointNum: 58,
        undonePointRate: 58,
        overdueUndonePointNum: 58,
        overdueUndonePointRate: 58,
        donePointNum: 58,
        donePointRate: 56,
        overdueDonePointNum: 89.5,
        overdueDonePointRate: 52,
        inspectPointNum: 89.5,
        doneInspectPointNum: 56.3,
        doneInspectOrderNum: 89.5,
        timelyCompleteSmall: 89.5,
    }
    ],
    runningWorkOrder: [//运行工单
    {
        name: '项目A',
        orderNum: 24,
        undonePointNum: 58,
        timelyCompleteSmall: 56.3,
    }
    ],
    managePersonData: [//管理人员
    {
        name: '项目A',
        undonePointNum: 58,
        missInspectRate: 58,
        maintainNum: 58,
        timelyCompleteBig: 56.3,
    }
    ],
};
blocReportMethods = {
    eventStop: function (event) {
        event.stopPropagation();

    },
    tabChange: function (model, event) {
        var _index = event.pEventAttr.index || 0;
        blocReportModel.pageShow = _index;
    },
    choiceProject: function (event) {//项目选择
        var type = event.pEventAttr.currItem.id;
    },
    choiceTimeType: function (event) {//时间类型选中
        var type = event.pEventAttr.currItem.id;
    },
    choicePriorLevel: function (event) {//优先级选中
        var type = event.pEventAttr.currItem.id;
    },
    selEventsTime: function () {//选择时间
        var time = $("#blocReportCalendar").psel();
        var startTime = new Date(time.startTime).format("yMd000000");//什么鬼
        var endTime = new Date(time.realEndTime).format("yMd000000");

    },
    choiceSpecialty: function (event) {//专业选中
        var type = event.pEventAttr.currItem.id;
    },
    repairOrderSort: function (model) { //维修工单列表排序
        var _index = model.pEventAttr.columnIndex || 0;
        var _sortType = model.pEventAttr.sortType || "desc";
        //var _name = $("#personNameSearch >div").pval().key || "";
        //var _data = {
        //    user_id: personModel.userId,
        //    project_id: personModel.projectId,
        //    dept_type: "d3",
        //    name: _name,
        //    page: 1,
        //    page_size: ""
        //};
        //if (_index === 1 && _sortType === "desc") {
        //    _data.order_field = "login_time";
        //    _data.order_by = "desc";
        //} else if (_index === 1 && _sortType === "asc") {
        //    _data.order_field = "login_time";
        //    _data.order_by = "asc";
        //} else if (_index === 4 && _sortType === "desc") {
        //    _data.order_field = "distance";
        //    _data.order_by = "desc";
        //} else if (_index === 4 && _sortType === "asc") {
        //    _data.order_field = "distance";
        //    _data.order_by = "asc";
        //}
        //personController.queryPersonLoginInfo(_data)
        //    .then(function(list) {
        //        personModel.loginInfoGrid = list;
        //    })
        //    .catch(function() {
        //        $("#globalnotice").pshow({
        //            text: "获取登录信息失败，请重试",
        //            state: "failure"
        //        });
        //    });
    },
    inspectOrderSort: function (model) { //巡检工单列表排序
        var _index = model.pEventAttr.columnIndex || 0;
        var _sortType = model.pEventAttr.sortType || "desc";

    },
    maintainOrderSort: function (model) { //维保工单列表排序
        var _index = model.pEventAttr.columnIndex || 0;
        var _sortType = model.pEventAttr.sortType || "desc";

    },
    runningOrderSort: function (model) { //运行工单列表排序
        var _index = model.pEventAttr.columnIndex || 0;
        var _sortType = model.pEventAttr.sortType || "desc";

    },
    managePersonSort: function (model) { //管理人员列表排序
        var _index = model.pEventAttr.columnIndex || 0;
        var _sortType = model.pEventAttr.sortType || "desc";

    }
};

var blocReportLogger = {
    init: function () {
        new Vue({
            el: "#blocReportPage",
            data: blocReportModel,
            methods: blocReportMethods,
            mounted: function () {

            }
        });
    }
};