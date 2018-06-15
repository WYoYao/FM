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
      var x = this.cache.planType == 'group' ? true : false;
      var param = x ? { group_plan_id: this.cache.planId, person_id: this.userInfo.person_id } : { plan_id: this.cache.planId };
      param.person_id = this.userInfo.person_id;
      var a = x ? PMA.DGP : PMA.DOP;
      a(param, function (data) {
        $("#globalnotice").pshow({ text: "作废成功", state: "success" });
        v.instance.gobackLastPath(v.instance.paths.path);
        // 刷新集团事件列表
        x && v.initPage('grouphome');
      }, function (err) {
        $("#globalnotice").pshow({ text: "作废失败", state: "failure" });
      }, function () {
        $('#deletePlanSure').phide();
      })
    },

    // 查看计划历史工单信息
    lookHistoryOrderInfo: function () {
      this.cache = {
        name: "过去发出的工单记录",
        orderPlanId: this.cache.planId
      }
      v.initPage('planWorkOrder');
    },
    // 修改计划
    changePlan: function () {
      var that = this;
      var CC = JSON.parse(JSON.stringify(this.cache));
      this.cache = {
        argu: {
          isquote: that.planInfo.plan_from == 1 ? true : false,
          isedit: true,
          isterm: that.cache.planType === 'order' ? true : false,
          iscopy: false,
          addWoPlan: that.planInfo,
          cb: CC.planType === 'order' ? function () {
            v.instance.cache = { name: "计划详情", planType: 'order', planId: CC.planId };
            v.initPage('planInformation');
          } : function () {
            v.instance.cache = { name: "集团计划详情", planType: 'group', planId: CC.planId };
            v.initPage('planInformation');
          }
        },
      }
      v.initPage("createPlan");
    },
    // 复制计划,只有集团计划调用
    copyPlan: function () {
      var id = v.instance.planInfo.group_plan_id;
      this.cache = {
        argu: {
          isquote: false,
          isedit: true,
          isterm: false,
          iscopy: true,
          addWoPlan: this.planInfo,
          cb: function () {
            v.instance.cache = { name: "集团计划详情", planType: "group", planId: id };
            v.initPage('planInformation');
          }
        },
      }
      v.initPage("createPlan");
    },
    // 跳转到项目计划监控,只有集团计划
    GoProPlan: function () {
      var a = this.cache.planId;
      this.cache = { group_plan_id: a, name: "项目计划监控", freq_cycle: this.planInfo.freq_cycle, group_plan_name: this.planInfo.group_plan_name };
      this.cache.is_delete_plan = true;
      v.initPage('monitoringPlan');
    },
    // 查看计划版本记录
    lookVersionRemark: function () {
      $("#planChangeHistoryWindow").pshow();
    },
    // 查看项目计划中的工单
    lookAllOrder: function () {
      var a = this.cache.planId;
      this.cache = { planId: a, name: "工单列表", project_id: this.cache.project_id };
      v.initPage('workOrderList');
    },
    // 查看项目所有计划
    lookAllPlan: function () {
      var a = psecret.create(JSON.stringify({ pt: this.cache.project_id }));
      window.open(window.location.ancestorOrigins[0] + '/frame/PlanManagement?ot=' + a);
    },
    computeNextDay: function (str, add) {
      var date = new Date(this.yyyyMMddhhmmss2date(str));
      return new Date(date.setDate(date.getDate() + (add ? 1 : -1))).format('yyyyMMddhhmmss');
    },
  },
  filters: {

  },
  beforeMount: function () {

    var that = this;
    var x = (that.cache.planType === 'order' || that.cache.planType === 'orderD' || that.cache.planType === 'project');
    var a = x ? PMA.OPI : PMA.GPI;
    var param = x ? { plan_id: that.cache.planId } : { group_plan_id: that.cache.planId };
    $("#planInformationLoad").pshow();
    a(param, function (data) {
      that.planInfo = JSON.parse(JSON.stringify(data || {}));
      // 如果为集团计划则获取计划类型
      if (!x) {
        that.orderTypes.forEach(function (item) {
          (item.code == that.planInfo.order_type) && (that.planInfo.order_type_name = item.name);
        })
      }

      if (that.planInfo.pit_positions && that.planInfo.pit_positions.length > 0) {
        var arr = [];
        that.planInfo.pit_positions.forEach(function (item, index) {
          if (item.pit_position_ask_names) {
            if (item.pit_position_ask_names.length == 1) {
              arr.push({ name: (item.pit_position_ask_names).toString() })
            }
            if (item.pit_position_ask_names.length > 1) {
              arr.push({ name: (item.pit_position_ask_names.join('、')).toString() });
            }

          }
        })
        if (arr.length > 0) {
          that.planInfo.place = JSON.parse(JSON.stringify(arr));
        }
      }
    }, function () { }, function () {
      $("#planInformationLoad").phide();
    })

    // 如果当前计划为工单计划或已作废工单计划，则获取计划历史信息
    if (that.cache.planType === 'order' || that.cache.planType === 'orderD') {
      $("#planChangeHistoryLoading").pshow();
      PMA.PCH({ plan_id: that.cache.planId }, function (data) {
        data = JSON.parse(JSON.stringify(data || []));
        that.historyRecordList = data.length > 2 ? data.splice(0, 2) : data;
        that.historyRecordList.forEach(function (model) {
          if (model.pit_positions && model.pit_positions.length > 0) {
            var arr = [];
            model.pit_positions.forEach(function (item, index) {
              if (item.pit_position_ask_names) {
                if (item.pit_position_ask_names.length == 1) {
                  arr.push({ name: (item.pit_position_ask_names).toString() })
                }
                if (item.pit_position_ask_names.length > 1) {
                  arr.push({ name: (item.pit_position_ask_names.join('、')).toString() });
                }

              }
            })
            if (arr.length > 0) {
              model.place = JSON.parse(JSON.stringify(arr));
            }
          }
        })
        if (that.historyRecordList.length == 2) {
          var a = that.historyRecordList;
          // a.forEach(function(item){
          //   if(item.plan_start_type == 1){
          //     item.plan_start_time = computeNextDay(item.plan_start_time,true);
          //   }
          // })
          if (a[0].plan_start_time == a[1].plan_end_time) {
            a[1].plan_end_time = that.computeNextDay(a[1].plan_end_time, false);
          }
        }
      }, function () { }, function () {
        $("#planChangeHistoryLoading").phide();
      })
    }
  }
});
