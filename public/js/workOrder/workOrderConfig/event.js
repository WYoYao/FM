
$(function(){

	workOrderConfigLogger.init();//controller.js初始化

	$(document).on("click",".add_more_work",function(){
		if(!$(this).find("ul").is(":visible")){
            $(".more_work_list").hide();
			$(this).find("ul").show();
		}else{
			$(this).find("ul").hide();
		}
	});
    $(document).click(function (event) {
        var tg = event.target;
        if (!$(tg).hasClass('add_more_work') && !$(tg).parents('.add_more_work').length && $(".more_work_list").length && $(".more_work_list").is(':visible') ) {

            $(".more_work_list").hide();
        }
    });
    $(document).click(function (event) {
        event.stopPropagation();
        var tg=event.target;
        if(!$(tg).hasClass('per-madal-float') && !$(tg).parents().hasClass('per-madal-float') && !$(tg).hasClass('tr') && !$(tg).parents().hasClass('tr')){
            $("#floatWindow").phide();
        }
       
    });
    $("#operatWindow").click(function (event) {
        event.stopPropagation();
        var tg = event.target;
         //申请选择岗位列表隐藏
        if(!$(tg).hasClass('mutiSelect') && !$(tg).parents().hasClass('mutiSelect')){
            $(tg).parents().find('.mutiSelectList').hide();
        }
        if(!$(tg).hasClass('applyAduitList') && !$(tg).parents().hasClass('applyAduitList')){
            for(var i=0;i<5;i++){
                $("#applyAduit" + i).pslideUp();
            }
        }
    });


});
