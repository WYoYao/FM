$(function(){
    $("#projectEvInfo").click(function (event) {
        event.stopPropagation();
        var tg = event.target;
        if (!$(tg).hasClass('aite-bubble') && !$(tg).parents().hasClass('aite-bubble') && !$(tg).hasClass('hint') ) {
            v.instance.ProEvgetObjs(v.instance.proEvObjs);
            // $(".aite-bubble").hide();
        }
    });
})