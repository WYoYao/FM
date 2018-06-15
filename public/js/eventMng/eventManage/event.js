$(function(){
    // 验证小时输入
    $("#createGroupEvFixStart").find("input").on("blur",function(){
        var value = $("#createGroupEvFixStart").pval();
        if(!!value && value.indexOf(".") != -1 && value.split(".")[1].length > 1){
            $("#createGroupEvFixStart").pshowTextTip("请输入正数(小数点后最多保留一位)");
        }
    });
    // 获取系统时间戳，在新建事件时和填写的开始时间对比
    EMA.GT({}, function (data) {
        v.currentTime = data.system_time - 5*60*1000; // 误差五分钟
    }, function () {
        
    }, function () {
  
    });
  
})
// 图片剩余数量
function successNum(){
    $(".imgReduceNum").html("("+$("#createGroupEventImg").pval().length+"/4)");
}
function clearNum(){
    $(".imgReduceNum").html("("+$("#createGroupEventImg").pval().length+"/4)");
}