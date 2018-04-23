/*事件注册*/
$(function () {
    personManageLogger.init();
});
$(function(){
    $(document).click(function (event) {
        event.stopPropagation();
        var tg=event.target;
        if(!$(tg).hasClass('per-madal-float') && !$(tg).parents().hasClass('per-madal-float') ){
            $("#createPersonFloatWindow").phide();
        }
    });

    $(document).click(function (event) {
        event.stopPropagation();
        var tg=event.target;
        if(!$(tg).hasClass('operatAreaBtnList') && !$(tg).parents().hasClass('operatAreaBtnList') && !$(tg).hasClass('templateTreeBox') && !$(tg).parents().hasClass('templateTreeBox')){
            
            personMethods.resetOperatBtn();
            // console.log(1);
        }
    });
})

var pub_method = {
    //公共方法
      returnPop:function(e){
         e.stopPropagation();
      }
 };