function scrollFloor(operate) {
    if (operate == 'add' && spaceInfoController.addFloorSign == 'up') {
        $("#floorContent").scrollTop(0);
    } else {
        var scrollHeight = document.getElementById("floorContent").scrollHeight;
        var offsetHeight = document.getElementById("floorContent").offsetHeight;
        if (scrollHeight > offsetHeight) {
            $("#floorContent").scrollTop(scrollHeight);
        }
    }
}
function editItem(event) {
    var instance = spaceInfoModel.instance();
    instance.detailEditSign = false;//其他不可以编辑
    instance.editMode = 'modify';//保存方式
    var $this = $(event.currentTarget);
    var $contShow = $this.parents(".contShow");
    $contShow.hide();
    $contShow.siblings(".editShow").show();
    var $inputText = $contShow.siblings(".editShow").find("[widtye='inputText']");
    $inputText.length > 0 && (true, $inputText.precover());//输入恢复初始化


    var ftype = $this.parents(".detailItem").attr("ftype");//哪种属性
    if (instance.editFloatName == 'floor') {
        spaceInfoController.editDetailCopy = JSON.parse(JSON.stringify(instance.floorDetail));//备份 
        ftype == 'floor_type' && (true, $('#editFloorType').psel(parseInt(instance.floorDetail.floor_type) - 1));//如果是楼层类型
        $("#editCodeType").precover("请选择楼层编码");
        ftype == 'floor_identity' && (true, $('#editCodeType').psel(instance.floorDetail.floor_identity));//如果是楼层编码
    }
    
    if (instance.editFloatName == 'space') {
        spaceInfoController.editDetailCopy = JSON.parse(JSON.stringify(instance.spaceDetail));//备份 
    }
}
//function cancelEdit(event) {
//    var $this = $(event.currentTarget);
//    $("#quitEditDialog").pshow({ title: "确定退出编辑吗？", subtitle: "取消编辑将不保存当前编辑信息" });//弹出弹出框
//    $("#quitEditBut").data('thisObj', $this);
//}
//function sureEdit(event) {//弹出编辑确认框
//    var $this = $(event.currentTarget);
//    var instance = spaceInfoModel.instance();
//    var $inputText = $this.parents(".detailItem").find("[widtye='inputText']");
//    if ($inputText.length > 0 && !$inputText.pverifi()) {//输入出现错误
//        return;
//    }
//    var ftype = $this.parents(".detailItem").attr("ftype");

//    if (instance.editFloatName == 'floor') {//楼层
//        spaceInfoController.queryFloorInfoPointHis(ftype);//查询历史信息
//    } else {
//        spaceInfoController.querySpaceInfoPointHis(ftype);
//    }
//    $("#saveModeSel").pshow();//弹出弹出框
//    $("#sureEditBut").data('thisObj', $this);
//    $("#editTimeBox").psel({ y: (new Date()).format('yyyy'), M: (new Date()).format('MM'), d: (new Date()).format('dd') });//设置时间为今天
//}

//function infoEditSure() {//ftype来自于哪里啊
//    var instance = spaceInfoModel.instance();
//    $("#saveModeSel").phide();//弹出弹出框
//    //保存数据
//    var $thisObj = $("#sureEditBut").data('thisObj');
//    var ftype = $thisObj.parents(".detailItem").attr("ftype");
//    function call() {//编辑状态隐藏
//        var $editShow = $thisObj.parents(".editShow");
//        $editShow.hide();
//        $editShow.siblings(".contShow").show();
//    }
//    if (instance.editFloatName == 'floor') {
//        var fvalue = instance.floorDetail[ftype];
//        if (ftype == 'floor_local_name') {//如果是楼层名字
//            function floorCall() {
//                spaceInfoController.updateFloorInfo(ftype, fvalue, call);//编辑接口
//            }
//            spaceInfoController.verifyFloorName(floorCall);//判断名字是否可用
//            return;
//        }
//        spaceInfoController.updateFloorInfo(ftype, fvalue, call);//编辑接口
//    }
//    if (instance.editFloatName == 'space') {
//        ftype == 'room_func_type_name' && (true, ftype = 'room_func_type');//房间类型
//        ftype == 'tenant_type_name' && (true, ftype = 'tenant_type');//租户类型
//        var fvalue = instance.spaceDetail[ftype];
//        if (ftype == 'room_local_name') {//如果是名字
//            function spaceCall() {
//                spaceInfoController.updateSpaceInfo(ftype, fvalue, call);//编辑接口
//            }
//            spaceInfoController.verifySpaceName(spaceCall);//判断名字是否可用
//            return;
//        }
//        spaceInfoController.updateSpaceInfo(ftype, fvalue, call);//编辑接口
//    }
//}
//function infoEditCancle() {
//    $("#saveModeSel").phide();//弹出弹出框
//}
//function quitEditSure() {//确认取消编辑
//    $("#quitEditDialog").phide();
//    var $thisObj = $("#quitEditBut").data('thisObj');
//    var instance = spaceInfoModel.instance();
//    instance.detailEditSign = true;
//    var $editShow = $thisObj.parents(".editShow");
//    $editShow.hide();
//    $editShow.siblings(".contShow").show();
//    if (instance.editFloatName == 'floor') {
//        instance.floorDetail = JSON.parse(JSON.stringify(spaceInfoController.editDetailCopy));//还原 
//    }
//    if (instance.editFloatName == 'space') {
//        instance.spaceDetail = JSON.parse(JSON.stringify(spaceInfoController.editDetailCopy));//还原 
//    }
//}
//function quiteEditCancle() {
//    $("#quitEditDialog").phide();
//}
function showWarnSet() {
    if (spaceInfoController.firstRemind) {
        spaceInfoController.querySpaceRemindConfig();//查询房间提醒设置
    }
    spaceInfoController.firstRemind = false;
    $("#spaceWarnSet").pshow();
}
function sureWarnSet() {
    $("#spaceWarnSet").phide();
    spaceInfoController.saveSpaceRemindConfig();
}
function cancelWarnSet() {
    var instance = spaceInfoModel.instance();
    $("#spaceWarnSet").phide();
    instance.spaceRemind = JSON.parse(JSON.stringify(instance.spaceRemindCopy));

}
function checkRemoveSpace(event) {//查看已经拆除的房间
    var instance = spaceInfoModel.instance();
    $("#removeSpace").show();
    spaceInfoController.queryDestroyedSpace();
    instance.removeShowSign = true;
}
function removeSpaceHide(event) {
    var instance = spaceInfoModel.instance();
    $("#spaceCheckFloat").phide();//侧弹框取消
    $("#removeSpace").hide();
    instance.removeShowSign = false;
}
function addFloorShow(event, param) {//添加楼层页面显示
    var instance = spaceInfoModel.instance();
    instance.floorDetail = new floorObj();
    spaceInfoController.addFloorSign = param;
    $("#addFloorDiv").show();
    $("#addFloorDiv [floortype='typeDrop']").precover();//恢复默认  
   $("#addFloorDiv [floortype='typeCode']").precover("请选择楼层编码");//恢复默认  
    var allInput = $("#addFloorDiv [widtye='inputText']");
    for (var i = 0; i < allInput.length; i++) {//恢复默认 
        $(allInput[i]).precover();
    }
    spaceInfoController.queryFloorIdentity();//获取楼层编码

}
function saveAddFloor() {
    var instance = spaceInfoModel.instance();
    var floorDetail = instance.floorDetail;
    if (spaceInfoController.addFloorSign == 'up') {
        var upSequence = instance.allFloorInfo.length == 0 ? -1 : instance.allFloorInfo[0].floor_sequence_id;
        var thisSequence = parseInt(upSequence) + 1;
    }
    if (spaceInfoController.addFloorSign == 'down') {
        var downSequence = instance.allFloorInfo.length == 0 ? 0 : instance.allFloorInfo[instance.allFloorInfo.length - 1].floor_sequence_id;
        var thisSequence = parseInt(downSequence) - 1;
    }
    floorDetail.floor_sequence_id = thisSequence.toString();

    //input框的判断
    var allInput = $("#addFloorDiv [widtye='inputText']");
    var wrongSign = true;
    for (var i = 0; i < allInput.length; i++) {
        wrongSign = $(allInput[i]).pverifi();
        if (!wrongSign) break;
    }
    if (!wrongSign) {
        return;
    }

    //验证是有重复
    spaceInfoController.fnameRepeat = true;
    spaceInfoController.fidRepeat = true;
    spaceInfoController.fbimRepeat = true;
    spaceInfoController.fverifyNum = 0;
    if (!floorDetail.BIMID.ptrimHeadTail()) {//为空
        spaceInfoController.fbimRepeat = false;
        spaceInfoController.fverifyNum = 1;
    }
    spaceInfoController.verifyFloorLocalId('add');
    spaceInfoController.verifyFloorName('add');
    !!floorDetail.BIMID.ptrimHeadTail() && spaceInfoController.verifyFloorBimId('add');

}
function floorTypeSel(event) {//请选择楼层性质
    var instance = spaceInfoModel.instance();
    var thisIndex = event.pEventAttr.index;
    instance.floorDetail.floor_type = parseInt(thisIndex) + 1;
}
function floorCodeSel(item,event) {//请选择楼层编码
    //console.log(item.name)
    var instance = spaceInfoModel.instance();
    // var thisIndex = event.pEventAttr.index;
   instance.floorDetail.floor_identity = item.code;
}

function addFloorHide(event) {
    $("#addFloorDiv").hide();
}
function addSpaceShow(event, instancePara) {
    spaceInfoController.systemModelObj = instancePara || null;
    var instance = spaceInfoController.systemModelObj || spaceInfoModel.instance();
    spaceInfoController.systemModelObj && spaceInfoController.queryBuild();//对外接口取数据
    spaceInfoController.systemModelObj && spaceInfoController.queryAllSpaceCode();
    spaceInfoController.systemModelObj && spaceInfoController.queryAllRentalCode();
    instance.spaceFloorArr = [];
    instance.spaceDetail = new spaceObj();
    instance.showPage = 'addSpace';
    $(".orderList").css({ 'display': 'none' });
    //监听
    instance.$nextTick(function () {
        //创建新房间页
        $(".addspace_contentView:visible")[0].addEventListener('scroll',function(){
            instance.onScrollPub(".addspace_contentView",".addspace_verticalView","#spaceNavigBar",".addspace_contentBox",null)
        });
    })
    //$("#addSpaceDiv").show();
    //$("#spaceBuildDrop").precover('请选择建筑');
    //$("#spaceFloorDrop").precover('请选择楼层');
    //var allInput = $("#addSpaceDiv [widtye='inputText']");
    //for (var i = 0; i < allInput.length; i++) {
    //    $(allInput[i]).precover();
    //}
}
function addSpaceHide(event) {
    //$("#addSpaceDiv").hide();
    var instance = spaceInfoController.systemModelObj || spaceInfoModel.instance();
    instance.showPage = '';
}
function buildLiSel(item) {//建筑的点击事件 首页
    var instance = spaceInfoModel.instance();
    instance.selBuild = item;
    instance.floorShowTitle = '建筑下的全部房间';
    instance.selFloorItem = new floorObj();
    spaceInfoController.queryFloorWithOrder('floor', item);//重新去查询

}
function spaceBuildSel(item) {//房间中的建筑选择
    var instance = spaceInfoController.systemModelObj || spaceInfoModel.instance();
    spaceInfoController.queryFloorWithOrder('space', item);//根据建筑查询楼层
    instance.spaceDetail.build_id = item.obj_id;//选中的建筑id
    instance.spaceDetail.build_local_name = item.obj_name;//选中的建筑名字
    //建筑选择后需要清空楼层
    $("#spaceFloorDrop").precover('请选择楼层');
    instance.spaceDetail.floor_id = '';//选中的楼层id
    instance.spaceDetail.floor_local_name = '';//选中的楼层id
}

function checkAllFloor(event) {//查看右侧所有楼层房间
    var instance = spaceInfoModel.instance();
    instance.floorShowTitle = '建筑下的全部房间';
    instance.selFloorItem = new floorObj();
    spaceInfoController.querySpaceWithGroup();
}
function spaceFloorSel(item) {//房间中的楼层选择
    var instance = spaceInfoController.systemModelObj || spaceInfoModel.instance();
    instance.spaceDetail.floor_id = item.floor_id;//选中的楼层id
    instance.spaceDetail.floor_local_name = item.floor_local_name;//选中的楼层id
}

function saveAddSpace(equipCall) {
    var instance = spaceInfoController.systemModelObj || spaceInfoModel.instance();
    var spaceDetail = instance.spaceDetail;
    if (!spaceDetail.build_id) {
        $("#globalnotice").pshow({ text: "所属建筑不能为空！", state: "failure" });
        return;
    }
    if (!spaceDetail.floor_id) {
        $("#globalnotice").pshow({ text: "所属楼层不能为空！", state: "failure" });
        return;
    }
    //input框的判断
    var allInput = $("#addSpaceDiv [widtye='inputText']");
    var wrongSign = true;
    for (var i = 0; i < allInput.length; i++) {
        wrongSign = $(allInput[i]).pverifi();
        if (!wrongSign) break;
    }
    if (!wrongSign) {
        return;
    }
    //if (!spaceDetail.tenant_type.ptrimHeadTail()) {
    //    $("#globalnotice").pshow({ text: "租赁业态类型不能为空！", state: "failure" });
    //    return;
    //}
    //验证是有重复
    spaceInfoController.snameRepeat = true;
    spaceInfoController.sidRepeat = true;
    spaceInfoController.sbimRepeat = true;
    spaceInfoController.sverifyNum = 0;
    if (!spaceDetail.BIMID.ptrimHeadTail()) {//为空
        spaceInfoController.sbimRepeat = false;
        spaceInfoController.sverifyNum = 1;
    }
    spaceInfoController.verifySpaceName('add', equipCall);
    spaceInfoController.verifySpaceLocalId('add', equipCall);
    !!spaceDetail.BIMID.ptrimHeadTail() && spaceInfoController.verifySpaceBimId('add', equipCall);//BIMID不为null 才去判断
}
function verifyDestroy() {//是否可以拆除
    spaceInfoController.verifyDestroySpace();
}
function destroySure() {//拆除房间
    spaceInfoController.destroySpace();
}
function destroyCancle() {
    $("#desSpaceDialog").phide();
}
function treeHeadClick(event) {
    event.stopPropagation();
    var $this = $(event.currentTarget);
    var $contTreeList = $this.siblings(".contTreeList");
    if ($contTreeList.is(":visible")) {
        $contTreeList.slideUp();
    } else {
        $contTreeList.slideDown();
    }
}
function spaceCirClick(event) {
    var $this = $(event.currentTarget);
    $("#spaceNavigBar .circle").removeClass("sel");
    $this.addClass("sel");
    var stype = $this.attr("stype");
    var dis = document.getElementById(stype).offsetTop;
    $(".addspace_contentView:visible")[0].scrollTop = dis;
    // document.getElementById(stype).scrollIntoView();
}
function spceBindClick() {
    $(document).on('click', function () {
        $(".contTreeList").slideUp();
    });
}
function inputFocus(event) {// input控件  focus=inputFocus(event)
    var $this = event._currentTarget;
    var pvalue = $this.pval();
    $this.precover();
    $this.pval(pvalue);
}
function inputBlur(event) {
    var $this = event._currentTarget;
    var pvalue = $this.pval();
    var verify = /[\u4e00-\u9fa5]{1,}/.test(pvalue);
    if (verify) {//验证错误
        $this.pshowTextTip('不可输入汉字！');
    }
}
var floorTypeArr = [{ name: '普通楼层' }, { name: '中庭' }, { name: '室外' }, { name: '其他' }];

function floatTipHide() {
    $("#spaceCheckFloat").phide();
    $("#floorCheckFloat").phide();
    $(".orderList").css({ 'display': 'none' });
}
function buildHeadClick() {
    floatTipHide();
}
function eventStop(event) {
    event.stopPropagation();
}

/**
 *
 * 下载设备模板、批量上传设备
 *
**/
var uploadEquipmentArr1 = [{ name: '下载空间模板' }];
var uploadEquipmentSel1 = function (obj) {

    var index = obj.pEventAttr.index;
    switch (index) {
        case 0:
        
        systemMngController.downDataFile();
            break;
        case 1:
      
            break;
    }

}

/**
 *
 * 批量上传设备
 *
**/

var equipmentEvent1 = {
    //模板验证数据
    modelObj:{
        exl_key: "",
        exl_name: "",
        imgArr: [],
        fileArr: []
    },
    //模板验证
    uploadExcelCheck: function(){
        var val = $("#uploadFile1").pval() || [];
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
        equipmentEvent1.modelObj.exl_name = val.name;
        //标识正在验证
        equipmentEvent1.modelObj.excel_key = false;
        systemMngController.uploadFile(attachments).then(function(data){
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
                $("#uploadEquipment1 .modelErr").show().css("color","#f00").html("校验失败!");
                equipmentEvent1.modelObj.exl_key = "";
                return false;
            }
            equipmentEvent1.modelObj.exl_key = data.exl_key;
            $("#uploadEquipment1 .modelErr").show().css("color","#2ed62e").html("校验成功!");
        })
    },
    //清除模板
    uploadExcelClear: function(){
        equipmentEvent1.modelObj.exl_key = "";
        $("#uploadEquipment1 .modelErr").hide();
    },
    //取消
    uploadEquipmentCancel: function () {
        equipmentEvent1.windowHide();
    },
    //确定
    uploadEquipmentConfirm: function () {
        if(equipmentEvent1.modelObj.exl_key === false){
            $("#equipmentMessage").pshow({ 
                text: "模板正在验证，请稍后...", 
                state: "failure" 
            }); 
            return false;
        }
        if(equipmentEvent1.modelObj.exl_key === ""){
            $("#equipmentMessage").pshow({ 
                text: "未验证模板或模板未通过验证，请重新上传模板", 
                state: "failure" 
            }); 
            return false;
        }
        // if((equipmentEvent1.modelObj.imgArr.length == 0) && (equipmentEvent1.modelObj.fileArr.length == 0)){
        //     $("#equipmentMessage").pshow({ 
        //         text: "未检测到文件，请上传后重试", 
        //         state: "failure" 
        //     }); 
        //     return false;
        // }
        $("#equipmentPartLoading").pshow();
        new Promise(function (resolve,reject) {
            var imgArr = equipmentEvent1.modelObj.imgArr;
            var fileArr = equipmentEvent1.modelObj.fileArr;
            var attachments1 = [],attachments2 = [];
            //上传图片
            var files1 = $("#uploadImg_")[0].files;
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
            var files2 = $("#uploadImg_1")[0].files;
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
                excel_key: equipmentEvent1.modelObj.exl_key,
                excel_name: equipmentEvent1.modelObj.exl_name,
                image_relation: {},
                file_relation:{}
            }
            if(attachments1.length > 0){
                data.image_relation.attachments = attachments1;
            }
            if(attachments2.length > 0){
                data.file_relation.attachments = attachments2;
            }
            //有附件和无附件
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
                spaceInfoController.querySpaceWithGroup(); //查询建筑下的房间信息
                spaceInfoController.queryFloorWithOrder('floor', spaceInfoModel._instance.selBuild); //查询建筑下的楼层信息
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
            equipmentEvent1.windowHide();
        });

             
    },
    //隐藏面板
    windowHide: function () {
        $("#uploadEquipment1").phide();
    },
    //图片change
    uploadImgChange: function (event) {
        var files = $("#uploadImg_")[0].files;
        // var VM = v.instance;
        // VM.uploadImgLength = files.length;
        $("#imgNum").html("已选"+files.length);
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
            equipmentEvent1.modelObj.imgArr = data;
            $($("#uploadEquipment1 .uploadInp")[0]).find("em").html("x")
            $($("#uploadEquipment1 .uploadInp")[0]).find("b").html("清空已上传图片");
            $($("#uploadEquipment1 .uploadInp")[0]).on("click",function(){
                $($("#uploadEquipment1 .uploadInp")[0]).off("click");
                $($("#uploadEquipment1 .uploadInp")[0]).find("em").html("d")
                $($("#uploadEquipment1 .uploadInp")[0]).find("b").html("点击上传图片");
                $("#uploadImg_").prop("value",null);
                equipmentEvent1.modelObj.imgArr = [];
                // VM.uploadImgLength = 0;
                $("#imgNum").html("已选0");
                return false;
            })
        })
    },
    // 文件change
    uploadFileChange: function (event) {
        var files = $("#uploadImg_1")[0].files
        // var VM = v.instance;
        // VM.uploadFileLength = files.length;
        $("#fileNum").html("已选"+files.length);
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
            equipmentEvent1.modelObj.fileArr = data;
            $($("#uploadEquipment1 .uploadInp")[1]).find("em").html("x")
            $($("#uploadEquipment1 .uploadInp")[1]).find("b").html("清空已上传文件");
            $($("#uploadEquipment1 .uploadInp")[1]).on("click",function(){
                $($("#uploadEquipment1 .uploadInp")[1]).off("click");
                $($("#uploadEquipment1 .uploadInp")[1]).find("em").html("d")
                $($("#uploadEquipment1 .uploadInp")[1]).find("b").html("点击上传文件");
                $("#uploadImg_1").prop("value",null);
                equipmentEvent1.modelObj.fileArr = [];
                $("#fileNum").html("已选0");
                return false;
            })
        })
    },
};

$(function(){
    $("#uploadImg_").on("change",equipmentEvent1.uploadImgChange);
    $("#uploadImg_1").on("change",equipmentEvent1.uploadFileChange);
    $("#spaceMoleMange .uploadEquipment .per-comboboxButton_name").on('click',function(){
        // $("#uploadFile").pval('');
        // document.querySelector("#uploadFile>div>div").click(); 
        // 初始化上传

        $($("#uploadEquipment1 .uploadInp")[0]).off("click");
        $($("#uploadEquipment1 .uploadInp")[0]).find("em").html("d")
        $($("#uploadEquipment1 .uploadInp")[0]).find("b").html("点击上传图片");
        equipmentEvent1.modelObj.imgArr = [];

        $($("#uploadEquipment1 .uploadInp")[1]).off("click");
        $($("#uploadEquipment1 .uploadInp")[1]).find("em").html("d")
        $($("#uploadEquipment1 .uploadInp")[1]).find("b").html("点击上传文件");
        equipmentEvent1.modelObj.fileArr = [];

        equipmentEvent1.modelObj.exl_key = "";
        $("#uploadEquipment1 .modelErr").hide();
        $("#uploadFile1").precover();
        
        $("#imgNum").html("已选0");
        $("#fileNum").html("已选0");
        $("#uploadEquipment1").pshow();
    });
});

var  codeFunSel=function (arr,code){
    arr=arr||[];
    for(var i=0;i<arr.length;i++){
        var a=arr[i]||{};
        if(a.code==code){
            return a.name;
        }
    }
};