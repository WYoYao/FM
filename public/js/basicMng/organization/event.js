/*事件注册*/

$(function () {
    organizationLogger.init();    
    var date = new Date();
    var _year = date.getFullYear();
    var _month = date.getMonth() + 1;
    var _date = date.getDate();
    $("#birthDate").psel({ y: _year, M: _month, d: _date });
    //矫正树的底部边框样式
    windowEvent.borderInit();
    //校验员工识别码
    // $("#identificationCode>input").on("blur",function(){
    //     var regu = /^\d{1,20}$/;
    //     if(!regu.test($(this).val())){
    //         if($(this).val().length == 0){
    //             $("#identificationCode").pshowTextTip("员工识别码不能为空!");
    //         }else{
    //             $("#identificationCode").pshowTextTip("请输入正整数或0");
    //         }

    //     }
    // });
    //controller.js
    $("#pwindow6").on("click",function(){
        return false;
    });
    //收起下拉框
    $(".conFastAdd").on("click",function(event){   
        function contains(root, el){
            if (root.compareDocumentPosition)
                return root === el || !!(root.compareDocumentPosition(el) & 16);
            if (root.contains && el.nodeType === 1) {
                return root.contains(el) && root !== el;
            }
            while ((el = el.parentNode))
                if (el === root) return true;
            return false;
        }
        if(!contains($("#selectedMajor")[0], event.target)){
            $("#selectedMajor").pslideUp();
        }
        // if(!contains($("#selectedProject")[0], event.target)){
        //     $("#selectedProject").pslideUp();
        // }
        // if(!contains($("#selectedJurisdiction")[0], event.target)){
        //     $("#selectedJurisdiction").pslideUp();
        //     // $("#selectedJurisdiction .per-combobox-wrap").css("display","none");
        // }   
        $("#personSex").pslideUp();
        $("#selectedPosition").pslideUp();
        if(!contains($("#searchAccountInfo>.options")[0], event.target)){
            $("#searchAccountInfo>.options").hide();
        }
        if(($(".conJurisdictionlist").css("display") != "none") && !contains($(".conJurisdictionlist")[0], event.target)){
            windowEvent.slideUpJurisdiction();
        }
    });
    $("#projectMotai").appendTo($("body"));
    $("#searchAccountInfo > div.options").hide();
    
});
//工具
var tools = {
    //去除两端空格
    trim: function (x) {
        return x.replace(/^\s+|\s+$/gm, '');
    },
    //判断ie
    isIE: function() {   
        if (!!window.ActiveXObject || "ActiveXObject" in window){
            return true;
        }else{
            return false;
        }
    }
 
}

//全局事件
var windowEvent = {
    remove: function (opId, listName, type) {
        organizationMethods.operation(opId, organizationModel[listName], type)
    },
    showPwindow3: function () {
        if (organizationModel.operationState[4].usable) {
            clearTimeout(organizationModel.timer);
            $("#pwindow3").pshow();
        }
    },
    hidePwindow3: function () {
        $("#pwindow3").phide();
        organizationMethods.operationStateInit();
    },
    showPwindow2: function () {
        if (organizationModel.operationState[4].usable) {
            clearTimeout(organizationModel.timer);
            $("#pwindow2").pshow();
        }
    },
    timer: null,
    hidePwindow2: function () {
        $("#pwindow2").phide();
        organizationMethods.operationStateInit();
    },
    hidePwindow6: function(){
        $("#pwindow6").phide();
    },
    removePwindow6: function(){
        $('#globalloading').pshow();
        organizationController.deleteCoreDeptPersonById({"person_id": organizationModel.personList.person_id}).then(function(list){

            $("#message").pshow({ text: "已删除！", state: "success" });
            setTimeout(function(){
                location.href = location.href;
            },1000)
        }).catch(function(){
            $("#message").pshow({ text: "删除失败！", state: "failure" });
        })
        $("#pwindow6").phide();
    },
    // 显示项目
    showProjectList: function(){
        organizationModel.activeObjProject_ = JSON.stringify(organizationModel.listByProject);
        organizationModel.projectStatus = true;
        $("#projectMotai").show();
        $(".selArea").scrollTop(0);
    },
    show: function(){},
    //查看岗位下人员初始化
    showPerson_ : function(){
        $("#centerDepart_ .organizationTreeBoxName,#projectCommon_ .organizationTreeBoxName").off("click");
        $("#centerDepart_ .organizationTreeBoxName,#projectCommon_ .organizationTreeBoxName").on("click",function(){
   
            if(!$(this).find(".peopleList").hasClass("active")){
                $("#centerDepart_ .organizationTreeBoxName,#projectCommon_ .organizationTreeBoxName").find(".active").removeClass("active");
                $("#centerDepart_ .peopleList,#projectCommon_ .peopleList").hide();
                $(this).find(".peopleList").show();
                $(this).find(".peopleList").addClass("active");  
            }else{
                $(this).find(".peopleList").hide();
                $(this).find(".peopleList").removeClass("active");
            }
  
        });
    },
    // 取消项目操作
    cancelProjectList: function(){
        organizationModel.listByProject = JSON.parse(organizationModel.activeObjProject_);
        var str=$("#searchAccountInfo>input").val();
        var headerString = '';
        (function find_(arr) {
            var find = arguments.callee;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].selected) {
                    headerString += (headerString.length === 0 ? '' : ',') + arr[i].obj_name;
                }
                if (arr[i].child_objs && arr[i].child_objs.length) {
                    find(arr[i].child_objs);
                }
            }
        })(organizationModel.listByProject);
        
        $("#selectedStr").html((headerString === '' ? '' : headerString)).attr("title",(headerString === '' ? '' : headerString));
        var verifi = ($("#selectedStr").html() != "");
        if(verifi){
            $("#selectedStr").parent().find(".promptForm").hide();
        }
        organizationModel.projectStatus = false;
        $("#projectMotai").hide();
        setTimeout(function(){$("#searchAccountInfo>input").val(str);},0)
        
        return false;
    },
    // 隐藏项目
    hideProjectList: function(){
        var verifi = ($("#selectedStr").html() != "");
        if(verifi){
            $("#selectedStr").parent().find(".promptForm").hide();
        }
        organizationModel.projectStatus = false;
        $("#projectMotai").hide();
    },  
    //下拉框收起
    slideUp: function(id){
        $("#"+id).pslideUp();
    },
    //event.js
    showDetails: function(){

    },

    //权限收起
    slideUpJurisdiction: function(){
        $(".conJurisdictionlist").hide();
        var headerString = '';
        (function find_(arr) {
            var find = arguments.callee;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].selected) {
                    headerString += (headerString.length === 0 ? '' : ',') + arr[i].obj_name;
                }
                if (arr[i].child_objs && arr[i].child_objs.length) {
                    find(arr[i].child_objs);
                }
            }
        })(organizationModel.jurisdiction);
        if(headerString !== ''){
            $("#jurisdictionList").parent().find(".promptForm").hide();
        }
        $("#jurisdictionList").html((headerString === '' ? '--' : headerString)).attr("title",(headerString === '' ? '--' : headerString));
    },
    //修改状态
    initStatus: function(){
        organizationModel.statusModel = true;
        return true;
    },
    //清空岗位提示
    cleanTip: function(){
        $("#selectedPosition").parent().find(".promptForm").hide();
    },
    //清空多选
    clearSel: function(id){
        if(id == "selectedMajor"){
           
            //初始化专业
            var arr = organizationModel.majorArr;
            (function find_(arr) {
                var find = arguments.callee;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].selected) {
                        arr[i].selected = false;
                    }
                    if (arr[i].disabled) {
                        arr[i].disabled = false;
                    }
                    if (arr[i].child_objs && arr[i].child_objs.length) {
                        find(arr[i].child_objs);
                    }
                }
            })(arr);
            $("#selectedMajor .per-combobox_name").html("请选择专业");
        }
        if(id == "selectedJurisdiction"){
            //初始化权限
            var arr = organizationModel.jurisdiction;
            (function find_(arr) {
                var find = arguments.callee;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].selected) {
                        arr[i].selected = false;
                    }
                    if (arr[i].disabled) {
                        arr[i].disabled = false;
                    }
                    if (arr[i].child_objs && arr[i].child_objs.length) {
                        find(arr[i].child_objs);
                    }
                }
            })(arr);
            $("#selectedJurisdiction .per-combobox_name").html("请选择权限");
        }
        if(id == "selectedProject"){    
            //初始化项目
            var arr = organizationModel.listByProject;
            (function find_(arr) {
                var find = arguments.callee;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].selected) {
                        arr[i].selected = false;
                    }
                    if (arr[i].disabled) {
                        arr[i].disabled = false;
                    }
                    if (arr[i].child_objs && arr[i].child_objs.length) {
                        find(arr[i].child_objs);
                    }
                }
            })(arr);
            $("#selectedProject .per-combobox_name").html("请选择项目");
            $("#selectedStr").html("").attr("title","");
            $("#projectMotai").hide();
        }    
        $("#"+id).pslideUp();
    },
    // 树的节点的事件绑定
    windowInit: function () {
        $('#projectCommon, #centerDepart').off('click', '.organizationTreeBoxName').off('blur', '.organizationTreeBoxName>input');
        $('#projectCommon, #centerDepart').on('click', '.organizationTreeBoxName', function () {
            clearTimeout(organizationModel.timer);   
            $('#projectCommon .organizationTreeBoxName input,#centerDepart .organizationTreeBoxName input').css('borderColor', 'transparent');
            $('#centerDepart .organizationTreeBoxName:last,#projectCommon .organizationTreeBoxName:last').css('borderBottom', 'none');
            $(this).find('input').css('background', '#f8f8f8');
            
            var obj = JSON.parse($(this).find('input').attr('dis'));
            if (obj.obj_name === '中心部门') {
                organizationModel.operationState[0].usable = false;
                organizationModel.operationState[1].usable = false;
                organizationModel.operationState[2].usable = false;
                organizationModel.operationState[3].usable = true;
                organizationModel.operationState[4].usable = false;
            }else if((obj.obj_type == 'd2') && (obj.lv == 1)){
                organizationModel.operationState[0].usable = true;
                organizationModel.operationState[1].usable = true;
                organizationModel.operationState[2].usable = false;
                organizationModel.operationState[3].usable = true;
                organizationModel.operationState[4].usable = true;
            }else if (!obj.child_objs) {
                if (organizationModel.curPage === 'centerDepartMent') {
                    organizationModel.operationState[0].usable = false;
                    organizationModel.operationState[1].usable = false;
                    organizationModel.operationState[2].usable = true;
                    organizationModel.operationState[3].usable = false;
                    organizationModel.operationState[4].usable = true;
                } else {
                    organizationModel.operationState[0].usable = true;
                    organizationModel.operationState[1].usable = false;
                    organizationModel.operationState[2].usable = true;
                    organizationModel.operationState[3].usable = false;
                    organizationModel.operationState[4].usable = true;
                }

            }else if (obj.obj_type == 'd2'){
                organizationModel.operationState[0].usable = true;
                organizationModel.operationState[1].usable = true;
                organizationModel.operationState[2].usable = true;
                organizationModel.operationState[3].usable = true;
                organizationModel.operationState[4].usable = true;
            } else {
                organizationModel.operationState[0].usable = false;
                organizationModel.operationState[1].usable = false;
                organizationModel.operationState[2].usable = true;
                organizationModel.operationState[3].usable = false;
                organizationModel.operationState[4].usable = true;
            }
            var that = this;
            if(obj.obj_name === '中心部门'){
                $(this).find("input").css({"position":"relative","left":"-1000px"});
                $(this).append("<span class='centermodel'>中心部门</span>")
            }
        })

        // 改变树的元素的状态为未选择
        $('#projectCommon , #centerDepart').on('blur', '.organizationTreeBoxName>input', function () {
            if (tools.trim($(this).val()) === "") {
                $(this).parent().find(".inputPrompt").show().addClass("inputPromptShow");
            } else {
                $(this).parent().find(".inputPrompt").hide().removeClass("inputPromptShow");
            }
            var obj = JSON.parse($(this).attr('dis'));
            
            if(obj.obj_name === '中心部门'){
                $(this).css({"position":"relative","left":"0"});
                $(this).parent().find(".centermodel").remove();
            }
            $('#projectCommon .organizationTreeBoxName input,#centerDepart .organizationTreeBoxName input').css('background', '#fff');
            $('#centerDepart .organizationTreeBoxName:last,#projectCommon .organizationTreeBoxName:last').css('borderBottom', 'none');
            organizationModel.timer = setTimeout(function () {
                organizationMethods.operationStateInit();
                organizationModel.activeDataObj = {};
            }, 200)
        })
    },
    // 插件—多选树事件
    multiselectPluginEvent: function (targetElementId, model, headerId, placeHolder) {
        $("." + targetElementId + " span").on('click', function () {
            //分三种状态：1.disabled 不可用；2.selected 已选中 3.初始化状态
            if ($(this).hasClass('disabled')) {
                return false;
            }
            var arr = organizationModel[model];
            var id = $(this).attr('id');
            if ($(this).hasClass('selected')) {
                (function find(arr, id) {
                    var find = arguments.callee;
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].id == id) {
                            arr[i].selected = false;
                            if (arr[i].child_objs && arr[i].child_objs.length) {
                                (function find_(arr) {
                                    var find = arguments.callee;
                                    for (var i = 0; i < arr.length; i++) {
                                        arr[i].disabled = false;
                                        if (arr[i].child_objs && arr[i].child_objs.length) {
                                            find(arr[i].child_objs);
                                        }
                                    }
                                })(arr[i].child_objs)
                            }
                            break;
                        }
                        if (arr[i].child_objs && arr[i].child_objs.length) {
                            find(arr[i].child_objs, id);
                        }
                    }
                })(arr, id)
            } else {
                (function find(arr, id) {
                    var find = arguments.callee;
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].id == id) {
                            arr[i].selected = true;
                            if (arr[i].child_objs && arr[i].child_objs.length) {
                                (function find_(arr) {
                                    var find = arguments.callee;
                                    for (var i = 0; i < arr.length; i++) {
                                        arr[i].disabled = true;
                                        arr[i].selected = false;
                                        if (arr[i].child_objs && arr[i].child_objs.length) {
                                            find(arr[i].child_objs);
                                        }
                                    }
                                })(arr[i].child_objs)
                            }
                            break;
                        }
                        if (arr[i].child_objs && arr[i].child_objs.length) {
                            find(arr[i].child_objs, id);
                        }
                    }
                })(arr, id);
            }
            var headerString = '';
            (function find_(arr) {
                var find = arguments.callee;
                for (var i = 0; i < arr.length; i++) {
                    if ((arr[i].selected && (arr[i].obj_type == 0)) || (arr[i].disabled && (arr[i].obj_type == 0))) {
                        headerString += (headerString.length === 0 ? '' : ',') + arr[i].obj_name;
                    }
                    if (arr[i].child_objs && arr[i].child_objs.length) {
                        find(arr[i].child_objs);
                    }
                }
            })(arr)
            if(headerString !== ''){
                $("#" + headerId).parent().find('.promptForm').hide();
            }
            if(headerId == "selectedProject"){
                $("#selectedStr").html((headerString === '' ? '' : headerString)).attr("title",(headerString === '' ? '' : headerString));
                // return false;
            }
            $("#" + headerId + " .per-combobox_name").html((headerString === '' ? placeHolder : headerString)).attr("title",(headerString === '' ? '' : headerString));
            
        });
    },
    //项目初始化
    projectInit: function () {
        var targetElementId = "projectList";
        var model = "listByProject";
        var headerId = "selectedProject";
        this.multiselectPluginEvent(targetElementId, model, headerId, "请选择项目");
    },
    // 专业事件绑定
    majorInit: function () {
        var targetElementId = "projectList1";
        var model = "majorArr";
        var headerId = "selectedMajor";
        this.multiselectPluginEvent(targetElementId, model, headerId, "请选择专业");
    },
    // 权限事件绑定
    jurisdictionInit: function () {
        var targetElementId = "projectList2";
        var model = "jurisdiction";
        var headerId = "selectedJurisdiction";
        this.multiselectPluginEvent(targetElementId, model, headerId, "请选择权限");
    },
    // 显示快速添加中心部门人员
    showPwindow5: function (status,person_id,flag) { //status 为true时是初始化数据，为1时是显示员工详情
        if(!status){
            $('#fastAdd').pshow();
            $(".conFastAdd").scrollTop(0);
            organizationModel.statusModel = false;
        }
        $("#searchAccountInfo .options").hide();
        if(status === true){

        }else if(status === 1){
            $('#fastAdd').pshow();
            $(".conFastAdd").scrollTop(0);
            // person_id = "RYbdcc9dee2c5942a0a3e97240c5f2d6c4";
            organizationMethods.showPerson(person_id);
            organizationModel.fastAddPage = 2;
            $("#identificationCode").precover();
            organizationModel.fastAddPage_ = 2;
            organizationModel.statusModel = false;
        }else{
            organizationModel.fastAddPage = 1;
            organizationModel.fastAddPage_ = 1;
            $("#fastAdd .per-madal-float_titcon b").html("添加中心部门人员");
        }
        function fastAddInit() {
            if(status === false){
                $("#identificationCode").precover();
            }
            $(".conJurisdictionlist").hide();
            $("#personName").precover();
            $("#fastAdd .promptForm").css("display","none");
            $("#personSex").psel("男");
            $("#phoneNumber").precover();
            var date = new Date();
            var _year = date.getFullYear();
            var _month = date.getMonth() + 1;
            var _date = date.getDate();
            $("#birthDate").psel({ y: _year, M: _month, d: _date });
            $("#email").precover();
            $("#employeeNumber").precover();
            $("#email").precover();
            $("#searchAccountInfo>input").val("");
            $("#selectedProject .per-combobox_name").html("请选择项目");
            $("#selectedStr").html("").attr("title","");
            $("#selectedPosition").precover();
            $("#selectedPosition .per-combobox_name").html("请选择岗位");
            $("#selectedJurisdiction .per-combobox_name").html("请选择权限");
            $("#selectedMajor .per-combobox_name").html("请选择专业");
            $("#fastAddImg").precover();
            $("#searchAccountInfo>input").attr("pdisabled",false);
            $("#jurisdictionList").html("--").attr("title","--");
            if(flag != "check"){ 
                $(".error-tip").hide();
            }
            organizationModel.accountId = "";
            //初始化专业
            arr = organizationModel.majorArr;
            (function find_(arr) {
                var find = arguments.callee;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].selected) {
                        arr[i].selected = false;
                    }
                    if (arr[i].disabled) {
                        arr[i].disabled = false;
                    }
                    if (arr[i].child_objs && arr[i].child_objs.length) {
                        find(arr[i].child_objs);
                    }
                }
            })(arr);
            //初始化权限
            arr = organizationModel.jurisdiction;
            (function find_(arr) {
                var find = arguments.callee;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].selected) {
                        arr[i].selected = false;
                    }
                    if (arr[i].disabled) {
                        arr[i].disabled = false;
                    }
                    if (arr[i].child_objs && arr[i].child_objs.length) {
                        find(arr[i].child_objs);
                    }
                }
            })(arr);
            //初始化项目
            arr = organizationModel.listByProject;
            (function find_(arr) {
                var find = arguments.callee;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].selected) {
                        arr[i].selected = false;
                    }
                    if (arr[i].disabled) {
                        arr[i].disabled = false;
                    }
                    if (arr[i].child_objs && arr[i].child_objs.length) {
                        find(arr[i].child_objs);
                    }
                }
            })(arr);
        }
        fastAddInit();
    },
    borderInit: function () {
        setTimeout(function () {
            $('#centerDepart .organizationTreeBoxName,#projectCommon .organizationTreeBoxName').css('borderBottom', '1px dashed #ddd');
            $('#centerDepart_ .organizationTreeBoxName,#projectCommon_ .organizationTreeBoxName').css('borderBottom', '1px dashed #ddd');
            $('#centerDepart .organizationTreeBoxName:last,#projectCommon .organizationTreeBoxName:last').css('borderBottom', 'none');
            $('#centerDepart_ .organizationTreeBoxName:last,#projectCommon_ .organizationTreeBoxName:last').css('borderBottom', 'none');
            $("#projectCommon .centerDepartmentUl,#projectCommon_ .projectCommonUl").css({ 'borderBottom': 'none', 'borderTop': 'none' });
            $($("#projectCommon .centerDepartmentUl").get(0)).css({ 'borderTop': '1px solid #ddd' });
            $($("#projectCommon_ .projectCommonUl").get(0)).css({ 'borderTop': '1px solid #ddd' });
            $("#projectCommon .centerDepartmentUl:last,#projectCommon_ .projectCommonUl:last").css({ 'borderBottom': '1px solid #ddd' });
        }, 10)
    },
    keepFastAdd: function () {
        //验证必填项
        $("#searchAccountInfo .options").hide();
        $("#searchAccountInfo .conJurisdictionlist ").hide();
        var verifi1 = $('#identificationCode').pverifi();
        var verifi2 = $('#personName').pverifi();
        organizationModel.verifi3 = ($("#selectedStr").html() == "");
        if(organizationModel.verifi3){
            $("#selectedStr").parent().find(".promptForm").show();
        }
        organizationModel.verifi4 = !$("#selectedPosition").psel();
        if(organizationModel.verifi4){
            $("#selectedPosition").parent().find(".promptForm").show();
        }
        var verifi5 = $('#phoneNumber').pverifi();
        var verifi6 = $('#email').pverifi();

        var verifi7 = ($("#jurisdictionList").html() == "--") && ($("#searchAccountInfo>input").val() != "");
        if(verifi7){
            $("#jurisdictionList").parent().find(".promptForm").show();
        }
        if (!verifi1 || !verifi2 || organizationModel.verifi3 || organizationModel.verifi4 || !verifi5 || !verifi6 || verifi7) {
            return false;
        }
        $('#globalloading').pshow();
        //提取专业
        var majors = [];
        arr = organizationModel.majorArr;
        (function find_(arr) {
            var find = arguments.callee;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].selected) {
                    majors.push(arr[i].obj_id);
                }
                if (arr[i].child_objs && arr[i].child_objs.length) {
                    find(arr[i].child_objs);
                }
            }
        })(arr);
        //提取权限
        var jurisdiction = [];
        arr = organizationModel.jurisdiction;
        (function find_(arr) {
            var find = arguments.callee;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].selected) {
                    jurisdiction.push(arr[i].obj_id);
                }
                if (arr[i].child_objs && arr[i].child_objs.length) {
                    find(arr[i].child_objs);
                }
            }
        })(arr);
        //提取项目
        var projects = [];
        arr = organizationModel.listByProject;
        (function find_(arr) {
            var find = arguments.callee;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].selected && (arr[i].obj_type == "0")) {
                    projects.push(arr[i].obj_id);
                }else if(arr[i].disabled && (arr[i].obj_type == "0")){
                    projects.push(arr[i].obj_id);
                }
                if (arr[i].child_objs && arr[i].child_objs.length) {
                    find(arr[i].child_objs);
                }
            }
        })(arr);

        var addpeople = {
            "project_ids": projects,      //项目id组 ,必须数
            "name": $('#personName').pval(),                     //姓名 ,必须
            "id_number": $('#identificationCode').pval(),                //身份证号码 ,必须
            "phone_num": ($('#phoneNumber').pverifi() ? $('#phoneNumber').pval() : ''),                //手机号 
            "gender": ($('#personSex').psel().text === '男' ? 'male' : 'female'),                   //性别，male-男、female-女,必须
            "birthday": $('#birthDate').psel().startTime,          //出生年月
            "person_mail": ($('#email').pverifi() ? $('#email').pval() : ''),               //邮箱
            "person_type": "1",              //人员类型，1-中心部门人员，2-项目人员,必须
            "person_num": $('#employeeNumber').pval(),               //员工编号
            "position_id": $("#selectedPosition").psel().id,              //岗位id
            "specialty": majors,        //专业编码
            //"head_portrait": "key",            //系统头像
            "person_user_id": organizationModel.accountId,           //账号id(暂时为空)
            "person_user_name": (organizationModel.accountId === "" ? $('#searchAccountInfo>input').val() : ""),         //账号名称
            "func_pack_ids": (((organizationModel.accountId === "") && ($('#searchAccountInfo>input').val() != "")) ? jurisdiction : [])//权限包id数组
        }

        //判断是添加还是编辑
        var interfaceStr = "addPersonMultipleProject";
        if(organizationModel.fastAddPage_ == 2){
            addpeople.person_id = organizationModel.personList.person_id;
            interfaceStr = "updateCoreDeptPersonById";
        }

        //提取图片
        var filesImg = $("#fastAddImg").pval();

        if (filesImg.length > 0 && filesImg[0].name) {
            var attachments = {
                path: filesImg[0].url,
                fileName: filesImg[0].name,
                toPro: "head_portrait",
                fileSuffix: filesImg[0].suffix,
                fileType: 1
            }
            addpeople['attachments'] = attachments;
            //保存2     
            organizationController[interfaceStr+"WithImg"](addpeople).then(function (result) {
                if(result[0] === null){
                    result = "";
                }
                if (result && result.length > 0) {
                    $("#globalnotice").pshow({
                        text: result,
                        state: "failure"
                    });
                } else {
                    $("#message").pshow({ text: "保存成功！", state: "success" });
                    setTimeout(function () {
                        location.href = location.href;
                    }, 1000)
                }
            }).catch(function(err){
                console.log(err);
                $("#message").pshow({ text: "保存失败！", state: "failure" });
            })
        } else {
            //保存1
            organizationController[interfaceStr](addpeople).then(function (result) {
                if(result[0] === null){
                    result = "";
                }
                if (result && result.length > 0) {
                    $("#globalnotice").pshow({
                        text: result,
                        state: "failure"
                    });
                } else {
                    $("#message").pshow({ text: "保存成功！", state: "success" });
                    setTimeout(function () {
                        location.href = location.href;
                    }, 1000)
                }
            }).catch(function(err){
                console.log(err);
                $("#message").pshow({ text: "保存失败！", state: "failure" });
            })
        }

    }
}