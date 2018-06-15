proReportModel = {
    pageShow: 0,
    tabMenus: [
        { name: "工单报表", isActive: true, icon: "z" },
        { name: "需求报表", isActive: false, icon: "z" },
        { name: "设备报表", isActive: false, icon: "z" },
        { name: "员工KPI", isActive: false, icon: "z" },
    ],
};
proReportMethods = {
    eventStop: function (event) {
        event.stopPropagation();
    },
    tabChange: function (model, event) {
        var _index = event.pEventAttr.index || 0;
        proReportModel.pageShow = _index;
    }
};

var proReportLogger = {
    init: function () {
        new Vue({
            el: "#proReportPage",
            data: proReportModel,
            methods: proReportMethods,
            mounted: function () {

            }
        });
    }
};