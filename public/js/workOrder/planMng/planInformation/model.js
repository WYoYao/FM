v.pushComponent({
  name: "planInformation",
  data: {
    planId:"",
    // 计划类型 
    // 'order'工单计划 'group'集团计划 'groupD'已作废集团计划 'orderD'已作废工单计划 'project'项目计划
    planType:"",
    // 计划信息
    planInfo:{},
    // 计划修改历史
    historyRecordList:{},
    planInformationPaths:[],
  },
  methods: {
    // 废弃计划
    deletePlan : function(){
      getData([this.planType == 'group' ? {name:"deleteGroupPlan",data:{group_plan_id:this.planId}} : {name:"deleteOrderPlan",data:{plan_id:this.planId}}])[0].then(function(data){

      }).catch(function(err){

      })
    },
    // 查看计划历史工单信息
    lookHistoryOrderInfo : function(){
        v.initPage('planWorkOrder',{orderPlanId:this.planId})
    },
    // 修改计划
    changePlan : function(){

    },
    // 复制计划
    copyPlan : function(){

    },
    // 跳转到项目计划监控
    GoProPlan : function(){

    },
    // 查看计划版本记录
    lookVersionRemark : function(){
      $("#planChangeHistoryWindow").pshow();
    },
    // 查看项目计划中的工单
    lookAllOrder : function(){

    },
    // 查看项目所有计划
    lookAllPlan : function(){

    },
    //与当前时间做比较，判断计划生效时间
    comparePlanEffect: function (str) { 
      if (str != '') {
        var _st = this.timeFormat(str,'0');
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
  beforeMount : function(){
    // 生成路径
    switch(this.planType){
      case 'group':
        this.planInformationPaths = [{name:"首页",path:""},{name:"集团计划详情"}];
      break;
      case 'order':
        this.planInformationPaths = [{name:"首页",path:"planManage"},{name:"计划详情"}]
      break;
      case 'groupD':
        this.planInformationPaths = [{name:"首页",path:""},{name:"已作废集团计划详情"}];
      break;
      case 'orderD':
        this.planInformationPaths = [{name:"首页",path:"planManage"},{name:"已作废计划列表",path:"planManage"},{name:"已作废计划详情"}];
      break;
      case 'project':
        this.planInformationPaths = [{name:"首页",path:""},{name:"集团计划详情",path:"planInfomation"},{name:"项目计划监控",path:""},{name:"项目计划详情"}];
      break;
    }
    
    // 获取计划信息
    var arr = [{name:(this.planType === 'order' || this.planType === 'orderD' || this.planType === 'project') ? "orderPlanInfo" : "groupPlanInfo",data:{planId:this.planId}}];
    getData(arr)[0].then(function(data){
      this.planInfo = JSON.parse(JSON.stringify(data.Content));
    }).catch(function(err){
        
    })

    // 如果当前计划为工单计划或已作废工单计划，则获取计划历史信息，点不点随意，先准备总是没错的
    if(this.planType === 'order' || this.planType === 'orderD'){
      var arr = [{name:"planChangeHistory",data:{plan_id:this.planId}}];
      getData(arr)[0].then(function(data){
        this.historyRecordList = JSON.parse(JSON.stringify(data.Content.splice(0,2)));
      }).catch(function(err){

      })
    }

  }
});











var abc = {
  "plan_id": "JH1510145828954",
  "project_id": "Pj1301020001",
  "plan_name": "wxmz",
  "order_type": "2",
  "order_type_name": "维修",
  "urgency": "低",
  "ahead_create_time": 1,
  "freq_cycle": "w",
  "remind_type": "3",
  "plan_update_status":"0",
  "plan_from":"1",
  "plan_update_type":"2",
  "freq_num": 1,
  "freq_times": [
    {
      "start_time": {
        "cycle": "w",
        "time_day": 1,
        "time_hour": "00",
        "time_minute": "00"
      },
      "end_time": {
        "cycle": "w",
        "time_day": 1,
        "time_hour": "00",
        "time_minute": "00"
      }
    }
  ],
  "plan_start_type": "1",
  "plan_start_time": "20171110103828",
  "plan_end_time": "",
  "draft_matters": [
    {
      "matter_name": "ab",
      "description": "ab",
      "desc_forepart": "",
      "desc_aftpart": "ab",
      "desc_photos": [],
      "desc_objs": [],
      "desc_sops": [],
      "desc_works": [],
      "required_control": []
    }
  ],
  "destroy_person_id": "--",
  "destroy_person_named": "--",
  "destroy_time": "--",
  "create_time": "20171108205708",
  "update_time": "20171110103828"
}

var def={"data": [
  {
    "plan_id": "JH1508933047106",
    "project_id": "Pj1301020001",
    "plan_name": "a",
    "order_type": "2",
    "order_type_name": "维修",
    "urgency": "低",
    "ahead_create_time": 1,
    "freq_cycle": "d",
    "freq_num": 2,
    "freq_times": [
      {
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "11",
          "time_minute": "40"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "11",
          "time_minute": "59"
        }
      },
      {
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "11",
          "time_minute": "50"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "12",
          "time_minute": "00"
        }
      }
    ],
    "plan_start_type": "1",
    "plan_start_time": "20171026103042",
    "plan_end_time": "",
    "draft_matters": [
      {
        "matter_name": "a",
        "description": "a",
        "desc_forepart": "--",
        "desc_aftpart": "--",
        "desc_photos": [],
        "desc_objs": [],
        "desc_sops": [],
        "desc_works": [],
        "required_control": []
      }
    ],
    "create_time": "20171025200407",
    "update_time": "20171026103216"
  },
  {
    "plan_id": "JH1508933047106",
    "project_id": "Pj1301020001",
    "plan_name": "a",
    "order_type": "2",
    "order_type_name": "维修",
    "urgency": "低",
    "ahead_create_time": 1,
    "freq_cycle": "d",
    "freq_num": 1,
    "freq_times": [
      {
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      },{
        "start_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "00",
          "time_minute": "00"
        },
        "end_time": {
          "cycle": "d",
          "time_day": "1",
          "time_hour": "01",
          "time_minute": "00"
        }
      }
    ],
    "plan_start_type": "1",
    "plan_start_time": "20171025200407",
    "plan_end_time": "20171026103042",
    "draft_matters": [
      {
        "matter_name": "a",
        "description": "a",
        "desc_forepart": "",
        "desc_aftpart": "",
        "desc_photos": [],
        "desc_objs": [],
        "desc_sops": [],
        "desc_works": [],
        "required_control": []
      }
    ],
    "create_time": "20171025200407",
    "update_time": "20171025200407"
  }
],
"count": 2}.data;