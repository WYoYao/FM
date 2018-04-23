v.pushComponent({
    name: "planInformation",
    data: {
        planId:"",
        planType:"",
        planInfo:{},
        historyRecordList:{},
        planInformationPaths:[],
    },
    methods: {
        // 废弃计划
        deletePlan : function(){

        },
        // 查看计划历史工单信息
        lookHistoryOrderInfo : function(){
            v.initPage('dumpedPlanOrder',{orderPlanId:this.planInfo.plan_id})
        },
        // 修改计划
        changePlan : function(){

        },
        // 复制计划
        copyPlan : function(){

        },
        // 查看计划版本记录
        lookVersionRemark : function(){
            $("#planChangeHistoryWindow").pshow();
        },
        comparePlanEffect: function (str) { //与当前时间做比较，判断计划生效时间
            if (str != '') {
                var _st = this.timeFormatting(str);
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
        if(v.name.hasOwnProperty('term')){
            this.planInformationPaths = this.lastPage == 'dumpedPlan' ? [
                {name:"首页",path:"planManage"},{name:"已作废计划列表",path:"dumpedPlan"},{name:"已作废计划详情"}
            ] : [
                {name:"首页",path:"planManage"},{name:"计划详情"}
            ];
        }
        var arr = [{name:this.planType == 'order' ? "orderPlanInfo" : "groupPlanInfo",data:{planId:this.planId}}];
        getData(arr)[0].then(function(data){
            this.planInfo = JSON.parse(JSON.stringify(data.Content));
        }).catch(function(err){

        })
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
  "remind_type": "1",
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