var appData = {
    //当前日期 (obj)
    currentDate: { ym: "201805"},
    //当前岗位id (str)
    currentPositionId: "",
    //当前的排班计划模型(arr)
    currentPlan: [],
    //等待发布的排班计划(待定)
    newPlan: [],
    //岗位（arr）
    positionArr: [123],
    //显示查询的排班计划 (能查出数据和查不出来) (bool)
    viewFormStatus: false,
    //班次设置面板显示 (bool)
    editPlanStatus: false,
    //按钮状态切换 (预览和真实) (bool)
    optionStatus: false,
    //当前班次 (arr)
    currentShift : [],
    //当前选择的职位是否为已有排班计划 
    hasShift: false
}

var appMethods = {
    //选择时间事件
    getDate: function () {
        var dateObj = $("#divCalendar").psel();
        var date = new Date(dateObj.startTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        appData.currentDate.m = m;
        appData.currentDate.y = y;
        appData.currentDate.ym = y + "" + (m > 9 ? m : ("0" + m));
        //更新人员在当前月份是否有排班计划
        appMethods.queryPosition(appData.currentDate.ym);
        //查询计划
        if(appData.currentPositionId === ""){
            return false;
        }
        appMethods.queryPlan(appData.currentDate.ym,appData.currentPositionId);
       
    },
    //显示班次设置
    showEditPlan: function () {
        appData.editPlanStatus = true;
        appMethods.queryShift(appData.currentPositionId);
    },
    //隐藏班次设置
    hideEditPlan: function () {
        appData.editPlanStatus = false;
    },
    //下载模板
    downloadModel: function () {
        $('#globalloading').pshow();
        controllers.querySchedulingConfig({"position_id": appData.currentPositionId}).then(function(data){
            var arr = data;
            if(arr.length == 0){
                $("#message").pshow({ text: "请设置班次后下载模板", state: "failure" });
                return false;
            }
            pajax.downloadByParam("restSchedulingService/downloadSchedulingTemplateFile", {
                "position_id": appData.currentPositionId,
                "month": appData.currentDate.ym
            });
        })
    },
    //上传
    uploadModel: function(data){
        controllers.uploadSchedulingFile(data,appData.currentDate.ym,appData.currentPositionId).then(function(data){
            uploadInit();
            if(typeof data[0] === "string"){
                $("#message").pshow({ text: data[0], state: "failure" });
                return false;
            }
            appData.currentPlan = data;
            appData.optionStatus = true;
            appData.viewFormStatus = true; 
        });
    },
    //保存班次设置
    commitShift: function(){
        $("#keepshift").trigger("click");
    },
    //同步岗位
    changeposition: function(positionid){
        appData.currentPositionId = positionid;
        // 同步岗位的同时查询是否已有排班计划
        appData.hasShift = "pendding";
        controllers.querySchedulingConfig({"position_id": appData.currentPositionId}).then(function(data){
            var arr = data;
            if(arr.length == 0){
                appData.hasShift = false;
            }else{
                appData.hasShift = true;
            }

        })
    },
    //查询排班计划
    queryPlan: function(month,positionid){
        $('#globalloading').pshow();
        controllers.queryMonthSchedulingForWeb({"month":month,"position_id":positionid}).then(function(data){
            if(data.length == 0){
                appData.viewFormStatus = false;
                return false;
            }
            appData.currentPlan = data;
            appData.viewFormStatus = true; 
            appData.optionStatus = false; 
            //通过伪类置灰过期的数据
            var curTime = dayjs();
            $("#controller_table").remove();
            if((Number(appData.currentDate.y) < curTime.year())){
                $("<style id='controller_table'>.plan_ul>li:nth-child(n+3)>p:nth-child(n+5){color: #ddd;}</style>").appendTo($("head"));
            }else if((Number(appData.currentDate.y) == curTime.year())){     
                if(( Number(appData.currentDate.m) < (curTime.month() + 1) )){
                    $("<style id='controller_table'>.plan_ul>li:nth-child(n+3)>p:nth-child(n+5){color: #ddd;}</style>").appendTo($("head"));
                }else if(( Number(appData.currentDate.m) == (curTime.month() + 1) )){
                    $("<style id='controller_table'>.plan_ul>li:nth-child(n+3)>p:nth-child(n+5):nth-child(-n+"+(curTime.date()-1+4)+"){color: #ddd;}</style>").appendTo($("head"));
                } 
            }
        });
    },
    //查询岗位
    queryPosition: function(month){
        $('#globalloading').pshow();
        controllers.queryDeptPositions({"month":month}).then(function(data){
            var newArr = [];
            var str = "";
            (function find_(arr,str) {
                var find = arguments.callee;
                var str_ = str;
                for (var i = 0; i < arr.length; i++) {
                    str_ = str+arr[i].obj_name+"-";
                    if((arr[i].obj_type === "p1") || (arr[i].obj_type === "p2") || (arr[i].obj_type === "p3")){
                        str_ = str_.substr(0,str_.length-1);
                        newArr.push({
                            name: str_,
                            positionId: arr[i].obj_id,
                            hasplan: (arr[i].has_scheduling_show == "0" ? "0" : "1")
                        })
                    }
                    if (arr[i].child_objs && arr[i].child_objs.length) {
                        find(arr[i].child_objs,str_);
                    }
                }
            })(data,str);
            appData.positionArr = newArr;
        });
    },
    //查询班次
    queryShift: function(position_id){
        $('#globalloading').pshow();
        controllers.querySchedulingConfig({"position_id": position_id}).then(function(data){
            // 初始化shift_arr为符合模型的数据结构(加工)
            var arr = data;
            var h="",m="";
            for(var i=0;i<arr.length;i++){
                if(arr[i].time_plan && (arr[i].time_plan.length > 0)){
                    for(var j=0;j<arr[i].time_plan.length;j++){
                        h = arr[i].time_plan[j].end.split(":")[0];
                        m = arr[i].time_plan[j].end.split(":")[1];
                        arr[i].time_plan[j].end_ = {
                            h: h,
                            m: m
                        };
                        h = arr[i].time_plan[j].start.split(":")[0];
                        m = arr[i].time_plan[j].start.split(":")[1];
                        arr[i].time_plan[j].start_ = {
                            h: h,
                            m: m
                        };
                    }
                }
            };
            appData.currentShift = arr;
        })
    },
    //保存班次设置
    saveShift: function(arr){
        if((typeof arr === "object") && (arr.length === 0)){
            $("#message").pshow({ text: "班次信息不能为空！", state: "failure" });
            $('#globalloading').phide();
            return false;
        }
        controllers.saveOrUpdateSchedulingConfig({
            "position_id": appData.currentPositionId,		
            "scheduling_configs": arr
        }).then(function(data){
            if(data[0] == null){
                setTimeout(function(){
                    appData.editPlanStatus = false;
                    appMethods.queryPlan(appData.currentDate.ym,appData.currentPositionId);
                },1000);
                $("#message").pshow({ text: "保存成功！", state: "success" });
            }
        });
    }
}

var appComputed = {
    
}

var appWatch = {
    //改变月份时响应数据
    currentDate: {
        handler: function(curVal, oldVal) {        
            $("#download em").html('下载'+curVal.m+'月排班表模板');
            $("#downloadModel em").html('下载'+curVal.m+'月排班表模板')
        },
        deep: true
    },
}

var appMounted = function () {
    appMethods.queryPosition(appData.currentDate.ym);
    $("#download em").html('下载'+appData.currentDate.m+'月排班表模板');
    $("#downloadModel em").html('下载'+appData.currentDate.m+'月排班表模板');
    //初始化时间
    // var date = new Date();
    // var y = date.getFullYear();
    // var m = date.getMonth() + 1;
    // appData.currentDate.m = m;
    // appData.currentDate.y = y;
    // appData.currentDate.ym = y + "" + (m > 9 ? m : ("0" + m));
}

var appCreated = function () {
   
}

var appUpdated = function(){

}

var app = new Vue({
    data: appData,
    methods: appMethods,
    computed: appComputed,
    mounted: appMounted,
    created: appCreated,
    watch: appWatch,
})

// 插件加载完后再挂载vue实例
$(function(){
    app.$mount("#scheduleManage");
})
