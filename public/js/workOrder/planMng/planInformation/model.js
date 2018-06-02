// 跳入本页需要在cache中存入
// 计划类型     planType : 'order'工单计划 'group'集团计划 'groupD'已作废集团计划 'orderD'已作废工单计划 'project'项目计划
// 计划ID      planId
v.pushComponent({
  name: "planInformation",
  data: {
    // 计划信息
    planInfo: {},
    // 计划修改历史
    historyRecordList: {},
  },
  methods: {
    // 废弃计划
    deletePlan: function () {
      var param = this.cache.planType == 'group' ? { group_plan_id: this.cache.planId } : { plan_id: this.cache.planId };
      var a = this.cache.planType == 'group' ? PMA.DGP : PMA.DOP;
      a(param,function (data) {
          $("#globalnotice").pshow({text: "删除成功",state: "success"})
          v.instance.gobackLastPath(v.instance.paths.path);
        }, function (err) {
          $("#globalnotice").pshow({text: "删除失败",state: "failure"})
        }, function () { })
    },
    // 查看计划历史工单信息
    lookHistoryOrderInfo: function () {
      this.cache = {
        name: "计划历史工单",
        orderPlanId: this.cache.planId
      }
      v.initPage('planWorkOrder');
    },
    // 修改计划
    changePlan : function(){
      var that = this;
      var CC = JSON.parse(JSON.stringify(this.cache));
      this.cache = {
        argu: {
          isquote: false,
          isedit: true,
          isterm: that.cache.planType === 'order' ? true : false,
          iscopy:false,
          addWoPlan: that.planInfo,
          cb : CC.planType === 'order' ? function(){
            var x = v.instance.cache.argu.addWoPlan;
            v.instance.cache = {name:"计划详情",planType:'order',planId:x.plan_id};
            v.initPage('planInformation');
          } : function(){
            var x = v.instance.cache.argu.addWoPlan;
            v.instance.cache = {name:"计划详情",planType:'group',planId:x.plan_id};
            v.initPage('planInformation');
          }
        },
      }
      v.initPage("createPlan");
    },
    // 复制计划
    copyPlan: function () {
      this.cache = {
        argu: {
          isquote: false,
          isedit: true,
          isterm: false,
          iscopy:true,
          addWoPlan: this.planInfo,
          cb: function () {
            var x = v.instance.cache.argu.addWoPlan;
            v.instance.cache = { name: "计划详情", planType: "group", planId: x.plan_id };
            v.initPage('planInformation');
          }
        },
      }
      v.initPage("createPlan");
    },
    // 跳转到项目计划监控
    GoProPlan: function () {
      var a = this.cache.planId;
      this.cache = { group_plan_id: a, name: "项目计划监控",freq_cycle:this.planInfo.freq_cycle};
      v.initPage('monitoringPlan');
    },
    // 查看计划版本记录
    lookVersionRemark: function () {
      $("#planChangeHistoryWindow").pshow();
    },
    // 查看项目计划中的工单
    lookAllOrder: function () {
      var a = this.cache.planId;
      this.cache = { planId: a, name: "工单列表" };
      v.initPage('workOrderList');
    },
    // 查看项目所有计划
    lookAllPlan: function () {
      // here
      var a = psecret.create(JSON.stringify({project_name:this.cache.project_name,project_id:this.cache.project_id}));
      window.open('http://localhost:9092/frame/PlanManagement?ot=' + a);
      // var a = $("iframe")[0];
      // var a = this.cache.planId;
      // this.cache = {planId:a,name:"工单列表"}
    },
    //与当前时间做比较，判断计划生效时间
    comparePlanEffect: function (str) {
      if (str != '') {
        var _st = this.timeFormat(str, '0');
        var _st_tran = Date.parse(new Date(_st));
        var date = new Date();
        var _curr_t = Date.parse(new Date()); //当前时间
        if (_st_tran > _curr_t) {
          return 1;
        } else {
          return 2;
        }
      }
    },
  },
  filters: {

  },
  beforeMount: function () {

    var that = this;
    var a = (that.cache.planType === 'order' || that.cache.planType === 'orderD' || that.cache.planType === 'project') ? PMA.OPI : PMA.GPI;
    var param = (that.cache.planType === 'order' || that.cache.planType === 'orderD' || that.cache.planType === 'project') 
    ? {plan_id:that.cache.planId} : {group_plan_id:that.cache.planId};
    $("#planInformationLoad").pshow();
    a(param,function(data){
      that.planInfo = JSON.parse(JSON.stringify(data || {}));
    }, function () { }, function () {
      $("#planInformationLoad").phide();
    })

    // 如果当前计划为工单计划或已作废工单计划，则获取计划历史信息
    if (that.cache.planType === 'order' || that.cache.planType === 'orderD') {
      $("#planChangeHistoryLoading").pshow();
      PMA.PCH( { plan_id: that.cache.planId }, function (data) {
        data = JSON.parse(JSON.stringify(data || []))
        that.historyRecordList = data.length > 2 ? data.splice(0, 2) : data;
      }, function () {}, function () {
        $("#planChangeHistoryLoading").phide();
      })
    }
  }
});