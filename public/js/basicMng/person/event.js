/*事件注册*/
$(function () {
    personManageLogger.init();
});
$(function(){
    $(document).click(function (event) {
        event.stopPropagation();
        var tg=event.target;
        if(!$(tg).hasClass('per-madal-float') && !$(tg).parents().hasClass('per-madal-float') && !$(tg).hasClass('per-modal-control') && !$(tg).parents().hasClass('per-modal-control') ){
            if($(tg).hasClass('per-modal-control') || $(tg).parents().hasClass('per-modal-control')){
                $("#createPersonFloatWindow").pshow();
            }else{
                $("#createPersonFloatWindow").phide();
            }
            
        }
    });

    $(document).click(function (event) {
        event.stopPropagation();
        var tg=event.target;
        if(!$(tg).hasClass('operatAreaBtnList') && !$(tg).parents().hasClass('operatAreaBtnList') && !$(tg).hasClass('templateTreeBox') && !$(tg).parents().hasClass('templateTreeBox')&& !$(tg).hasClass('per-modal-control')&& !$(tg).parents().hasClass('per-modal-control')){
            personMethods.resetOperatBtn();
            // console.log(1);
        }
    });
    $("#createPersonFloatWindow").click(function (event) {
        event.stopPropagation();
        var tg=event.target;
        if(!$(tg).hasClass('per-combobox-basic') && !$(tg).parents().hasClass('per-combobox-basic')){
            $("#employeeSex").pslideUp();
        }
        if(!$(tg).hasClass('employeeMajorTitle') && !$(tg).parents().hasClass('employeeMajorTitle') && !$(tg).hasClass('employeeMajorListUl')&& !$(tg).parents().hasClass('employeeMajorListUl')){
            $(".employeeMajorList").hide();
        }
        if(!$(tg).hasClass('permissionPackageList') && !$(tg).parents().hasClass('permissionPackageList')){
            $(".permissionPackageList").hide();
        }
    });
})

var pub_method = {
    //公共方法
      returnPop:function(e){
         e.stopPropagation();
      }
 };