$(function(){
    //初始化时间
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    appData.currentDate.m = m;
    appData.currentDate.y = y;
    appData.currentDate.ym = y + "" + (m > 9 ? m : ("0" + m));
});
var wMethods = {
    cancelConfirm: function(){
        $("#confirmWindow").phide();
    },
    determineConfirm: function(){
        $("#uploadPlan2").find("input[type=file]").trigger("click");
        $("#confirmWindow").phide();
    },
    showConfirm: function(){
        $("#confirmWindow").pshow();
    },
    checkShift: function(){
        if( appData.hasShift == "pendding" ){
            $("#message").pshow({ text: "系统繁忙请稍后重试", state: "failure" });
        }else if( appData.hasShift ){
            $("#uploadPlan1").find("input[type=file]").trigger("click"); 
        }else{
            $("#message").pshow({ text: "请设置班次后上传模板", state: "failure" });
        }
    }
}

//上传事件
// 首次上传
var upload1 = function(){
    $('#globalloading').pshow();
    var val = $("#uploadPlan1").pval()[0];
    appMethods.uploadModel(val);
    
}
var uploadScheduleSuccess = function () {
    controllers.uploadSchedulingFile($("#uploadPlan1").pval()[0], appData.currentDate.ym, appData.currentPositionId).then(function (data) {
        console.log(data);
    });
}
// 已有上传
var upload2 = function(){
    $('#globalloading').pshow();
    var val = $("#uploadPlan2").pval()[0];
    appMethods.uploadModel(val);
}
//初始化上传按钮
var uploadInit = function(){
    $("#uploadPlan1").precover();
    $("#uploadPlan2").precover();
}
//发布计划
var releasePlan = function(){
    $('#globalloading').pshow();
    controllers.saveSchedulingPlan({
        "position_id": appData.currentPositionId,
        "month": appData.currentDate.ym,                  
        "contents": appData.currentPlan
    }).then(function(data){
        uploadInit();
        appData.editPlanStatus = false;
        appMethods.queryPlan(appData.currentDate.ym,appData.currentPositionId);
        appMethods.queryPosition(appData.currentDate.ym);
    })
}
//重新上传
var reloadPlan = function(){
    uploadInit();
    appData.editPlanStatus = false;
    appMethods.queryPlan(appData.currentDate.ym,appData.currentPositionId);
}
