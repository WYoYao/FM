var uploadEquipmentArr = [{ name: '下载设备模板' }];
// 报废设备
var scrappedEquipment = function () {

    equipmentMngList.verifyDestroyEquip(v.instance.Scrapped.equip_id)
        .then(function (res) {

            if (res.can_destroy) {
                // 可以删除执行删除
                equipmentMngList.destroyEquip(v.instance.Scrapped.equip_id)
                    .then(function () {

                        var index = v.instance.ScrappedList.indexOf(v.instance.Scrapped);

                        if (index >= -1) {
                            v.instance.ScrappedList.splice(index, 1);
                        }

                        // $("#equipmentMngpnotice").pshow({ text: '报废成功', state: "success" });
                    }).catch(function () {

                        // $("#equipmentMngpnotice").pshow({ text: '报废失败', state: "failure" });
                    })


            } else {

                // 不可以删除提示原因
                $("#equipmentMngpnotice").pshow({ text: res.remind, state: "failure" });
            }
        })

    $("#confirmWindow").phide();


}
//下载设备模板、批量上传设备
var uploadEquipmentSel = function (obj) {
    
    var index = obj.pEventAttr.index;
    switch (index) {
        case 0:
        
        equipmentMngList.downDataFile();
            break;
        case 1:
      
            break;
    }

}
// 取消报废设备
var cancelScrappedEquipment = function () {

    $("#confirmWindow").phide();
}
// var uploadFileSuccess = function (obj) {
//     var obj;
//     var val = $("#uploadFile").pval() || [];
//     val = val[0] || {}
//     var data = {};
//     // data.excel_key = "";// TODO
//     data.attachments = {
//         path: val.url,
//         toPro: "excel_key",
//         fileName: val.name,
//         fileSuffix: "xlsx",
//         multiFile: false,
//         isNewFile: true,
//         fileType: 2
//     };
//     var _that = v.instance;
//     //上传验证
//     equipmentMngList.submitDataFileVerifyExcel(data, v.instance.currentSelector).then(function (data) {
//         data = data || {};
//         var re = data.Content || [];
//         if (re.length >= 1) {
//             $("#globalnotice").pshow({
//                 text: re,
//                 state: "failure"
//             });
//             return;
//         };
//         var val = $("#uploadFile").pval();
//         var argu = _that.currentSelector;
//         //上传
//         equipmentMngList.submitDataFile({ excel_key: data.exl_key, excel_name: val[0].name }, argu).then(function (data) {
//             var re = data || [];
//             if (re.length == 0) {
//                 $("#globalnotice").pshow({
//                     text: '上传成功！',
//                     state: "success"
//                 });
//                 //成功后刷新列表          
//                 equipmentMngList.queryEquipEnum('equip_total', argu).then(function (list) {

//                     _that[EnumType['equip_total']] = list || [];

//                     $(".nodata").removeClass('noDataDiv');

//                     _that.$nextTick(_that.computelistHeight);
//                 })
//                 //成功后刷新工单数量 
//                 equipmentMngList.queryEquipStatisticCount().then(function (res) {
//                     _that.EquipStatisticCount = res;
//                     $("#globalloading").phide();
//                 });
//             } else {
//                 $("#globalnotice").pshow({
//                     text: re.join(","),
//                     state: "failure"
//                 });
//             };
//         });
//     });
// };

/**
 *
 * 批量上传设备
 *
**/

var equipmentEvent = {
    //模板验证数据
    modelObj:{
        exl_key: "",
        exl_name: "",
        imgArr: [],
        fileArr: []
    },
    //模板验证
    uploadExcelCheck: function(){
        var val = $("#uploadFile").pval() || [];
        val = val[0] || {}
        var attachments = {
            path: val.url,
            toPro: "excel_key",
            fileName: val.name,
            fileSuffix: "xlsx",
            multiFile: false,
            isNewFile: true,
            fileType: 2
        };
        equipmentEvent.modelObj.exl_name = val.name;
        //标识正在验证
        equipmentEvent.modelObj.excel_key = false;
        equipmentMngList.uploadFile(attachments).then(function(data){
            
            if(data.Content && data.Content.length>0){
                var str = "";
                for(var i=0;i<data.Content.length;i++){
                    str += data.Content[i];
                }
                equipmentEvent.downTipsShow(str);
                // $("#equipmentMessage").pshow({ 
                //     text: str, 
                //     state: "failure" 
                // });
                $("#uploadEquipment .modelErr").show().css("color","#f00").html("校验失败!");
                equipmentEvent.modelObj.exl_key = "";
                return false;
            }
            equipmentEvent.modelObj.exl_key = data.exl_key;
            $("#uploadEquipment .modelErr").show().css("color","#2ed62e").html("校验成功!");
        })
    },
    //清除模板
    uploadExcelClear: function(){
        equipmentEvent.modelObj.exl_key = "";
        $("#uploadEquipment .modelErr").hide();
    },
    //取消
    uploadEquipmentCancel: function () {
        equipmentEvent.windowHide();
    },
    //确定
    uploadEquipmentConfirm: function () {
        if(equipmentEvent.modelObj.exl_key === false){
            $("#equipmentMessage").pshow({ 
                text: "模板正在验证，请稍后...", 
                state: "failure" 
            }); 
            return false;
        }
        if(equipmentEvent.modelObj.exl_key === ""){
            $("#equipmentMessage").pshow({ 
                text: "未验证模板或模板未通过验证，请重新上传模板", 
                state: "failure" 
            }); 
            return false;
        }
        // if((equipmentEvent.modelObj.imgArr.length == 0) && (equipmentEvent.modelObj.fileArr.length == 0)){
        //     $("#equipmentMessage").pshow({ 
        //         text: "未检测到文件，请上传后重试", 
        //         state: "failure" 
        //     }); 
        //     return false;
        // }
        $("#equipmentPartLoading").pshow();
        new Promise(function (resolve,reject) {
            var imgArr = equipmentEvent.modelObj.imgArr;
            var fileArr = equipmentEvent.modelObj.fileArr;
            var attachments1 = [],attachments2 = [];
            //上传图片
            var files1 = $("#uploadImg")[0].files;
            for(var i=0;i<imgArr.length;i++){
                attachments1.push({
                    file: files1[i],
                    toPro: imgArr[i].name,
                    fileName: imgArr[i].name,
                    fileSuffix: imgArr[i].suffix,
                    multiFile: false,
                    // isNewFile: true,
                    fileType: 1
                });
            }
            // 上传文件
            var files2 = $("#uploadImg1")[0].files;
            for(var i=0;i<fileArr.length;i++){
                attachments2.push({
                    file: files2[i],
                    toPro: fileArr[i].name,
                    fileName: fileArr[i].name,
                    fileSuffix: fileArr[i].suffix,
                    multiFile: false,
                    // isNewFile: true,
                    fileType: 2
                })
            }
            var data = {
                excel_key: equipmentEvent.modelObj.exl_key,
                excel_name: equipmentEvent.modelObj.exl_name,
                image_relation: {},
                file_relation:{}
            }
            if(attachments1.length > 0){
                data.image_relation.attachments = attachments1;
            }
            if(attachments2.length > 0){
                data.file_relation.attachments = attachments2;
            }
            if((attachments1.length > 0) || (attachments1.length > 0)){
                pajax.updateBeforeWithFile({
                    url: "restImportPhysicsWorld/submitData",
                    data:data,
                    success: function(data){
                        resolve(data);
                    },
                    error: function(err){
                        console.log(err);
                    }
                });
            }else{
                pajax.post({
                    url: "restImportPhysicsWorld/submitData",
                    data:data,
                    success: function(data){
                        resolve(data);
                    },
                    error: function(err){
                        console.log(err);
                    }
                });
            }
        }).then(function(data){
           data =((data||{}).data)||[];
            if(data && (data.length == 0)){
                
                $("#equipmentMessage").pshow({ 
                    text: "上传成功！", 
                    state: "success" 
                });
                setTimeout(function(){
                    location.href=location.href; //刷新页面
                },1000)
            }else{
                var str = "";
                for(var i=0;i<data.length;i++){
                    str += data[i];
                }
                equipmentEvent.downTipsShow(str);

                // $("#equipmentMessage").pshow({ 
                //     text: str, 
                //     state: "failure" 
                // });
            }
            $("#equipmentPartLoading").phide();
            equipmentEvent.windowHide();
        });
             
    },
    //隐藏面板
    windowHide: function () {
        $("#uploadEquipment").phide();
    },
    //图片change
    uploadImgChange: function (event) {
        var files = $("#uploadImg")[0].files;
        var VM = v.instance;
        VM.uploadImgLength = files.length;
        new Promise(function  (resolve,reject) {
            var imgArr = [];
            for(var i=0;i<files.length;i++){
                pajax.upload({
                    file: files[i],
                    success: function(data){
                        imgArr.push(data);
                        if(imgArr.length == files.length){
                            resolve(imgArr);
                        }
                    },
                    error: function(err){
                        console.log(err);
                    }
                });
            }
        }).then(function(data){
            equipmentEvent.modelObj.imgArr = data;
            $($("#component .uploadInp")[0]).find("em").html("x")
            $($("#component .uploadInp")[0]).find("b").html("清空已上传图片");
            $($("#component .uploadInp")[0]).on("click",function(){
                $($("#component .uploadInp")[0]).off("click");
                $($("#component .uploadInp")[0]).find("em").html("d")
                $($("#component .uploadInp")[0]).find("b").html("点击上传图片");
                $("#uploadImg").prop("value",null);
                equipmentEvent.modelObj.imgArr = [];
                VM.uploadImgLength = 0;
                return false;
            })
        })
    },
    // 文件change
    uploadFileChange: function (event) {
        var files = $("#uploadImg1")[0].files
        var VM = v.instance;
        VM.uploadFileLength = files.length;
        new Promise(function  (resolve,reject) {
            var fileArr = [];
            for(var i=0;i<files.length;i++){
                pajax.upload({
                    file: files[i],
                    success: function(data){ 
                        fileArr.push(data);
                        if(fileArr.length == files.length){
                            resolve(fileArr);
                        }
                    },
                    error: function(err){
                        console.log(err);
                    }
                });
            }
        }).then(function(data){
            equipmentEvent.modelObj.fileArr = data;
            $($("#component .uploadInp")[1]).find("em").html("x")
            $($("#component .uploadInp")[1]).find("b").html("清空已上传文件");
            $($("#component .uploadInp")[1]).on("click",function(){
                $($("#component .uploadInp")[1]).off("click");
                $($("#component .uploadInp")[1]).find("em").html("d")
                $($("#component .uploadInp")[1]).find("b").html("点击上传文件");
                $("#uploadImg1").prop("value",null);
                equipmentEvent.modelObj.fileArr = [];
                VM.uploadFileLength = 0;
                return false;
            })
        })
    },
    //提示
    downTipsShow:function (text) {
        var timer=null;
        $("#prompt-box").find("em").text(text);
        $("#prompt-box").stop().animate({top:"0"},500);
        timer= setTimeout(function () {
            $("#prompt-box").stop().animate({top:"-100%"},500);
             $("#prompt-box").find("em").text('');
            clearTimeout(timer);
        },3000);
        $("#prompt-box").mouseenter(function () {
            clearTimeout(timer);
        }).mouseleave(function () {
            $("#prompt-box").stop().animate({top:"-100%"},500);
             $("#prompt-box").find("em").text('');
         });
    }
};
$(function(){
    
    $("#component .uploadEquipment .per-comboboxButton_name").on('click',function(){
        // $("#uploadFile").pval('');
        // document.querySelector("#uploadFile>div>div").click(); 
        // 初始化上传
        $($("#component .uploadInp")[0]).off("click");
        $($("#component .uploadInp")[0]).find("em").html("d")
        $($("#component .uploadInp")[0]).find("b").html("点击上传图片");
        equipmentEvent.modelObj.imgArr = [];

        $($("#component .uploadInp")[1]).off("click");
        $($("#component .uploadInp")[1]).find("em").html("d")
        $($("#component .uploadInp")[1]).find("b").html("点击上传文件");
        equipmentEvent.modelObj.fileArr = [];

        equipmentEvent.modelObj.exl_key = "";
        $("#uploadEquipment .modelErr").hide();
        $("#uploadFile").precover();
        
        v.instance.uploadFileLength = 0;
        v.instance.uploadImgLength = 0;
        $("#uploadEquipment").pshow();
    });
});