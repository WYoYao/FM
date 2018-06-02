
var v = new VueReady('#component');


$(function() {
    // // 创建Vue 实例
    $("#startLoading").phide();
    $("#globalloading").pshow();

    v.createVue();
    
    $("#component").show();

    v.initPage('equipmentMng');

})