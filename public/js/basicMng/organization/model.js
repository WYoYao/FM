/* 
vue实例的数据模型 
*/
var organizationModel = {
    //先前显示的内容
    curPage: 'list',
    //切换内容时的备份，取消修改时恢复数据 String
    treeBackup : "",
    //全局配置配置
    config: {
        userId: "",  //人员id
        projectId: "",  //项目id
    },
    //disabled状态
    statusModel: true,
    projectStatus: false,
    //中心部门树
    listByCenterDepartment: [
        {
            obj_id: '',
            obj_name: '中心部门',
            obj_type: 'd1',
            child_objs: []
        },
    ],
    //项目通用部门树
    listByProjectCommon: [
        {
            obj_id: '',
            obj_name: '通用部门',
            obj_type: 'd2',
            child_objs: []
        }
    ],
    //快速添加人员-项目list
    listByProject: [],
    //操作状态
    operationState: [
        {
            id: 0,
            operationName: 'add_same_depart',
            usable: false
        },
        {
            id: 1,
            operationName: 'add_sub_depart',
            usable: false
        },
        {
            id: 2,
            operationName: 'add_same_point',
            usable: false
        },
        {
            id: 3,
            operationName: 'add_sub_point',
            usable: false
        },
        {
            id: 4,
            operationName: 'remove',
            usable: false
        }
    ],
    //当前活动状态的数据对象
    activeDataObj: {},
    //验证项目是否选择
    verifi3 : false,
    //验证职位是否选择
    verifi4 : false,
    //快速添加的状态
    fastAddPage: 1,

    //人员详情
    personList: {
        "person_id":"123",            //员工id
        "name":"佩奇",                 //姓名 
        "id_number":"130533XXXXXXX",            //身份证号码
        "phone_num":"15023215896",            //手机号 
        "gender":"male",               //性别，male-男、female-女
        "birthday":"1949-10-1",             //出生年月，yyyy-MM-dd
        "person_mail":"24851565521@163.com",           //邮箱
        "person_type":"1",          //人员类型，1-中心部门人员，2-项目人员
        "project_ids": ["pj001","pj002"],           //所属项目id 
        "project_names":[             //所属项目名称
            {"code":"1","name":"项目一"},
            {"code":"2","name":"项目二"},
        ],
        "person_num":"13246541ad",           //员工编号
        "dept_id":"123",              //部门id
        "dept_name":"中心部门",            //部门名称
        "position_id":"岗位id",          //岗位id
        "position_name":"岗位名称",        //岗位名称
        "specialty":["1","2"],    //专业编码
        "specialty_name":[            //已选中专业对象
            {"code":"1","name":"专业1"}
         ],
        "id_photo":"",                //证件照片
        "head_portrait":"key",         //系统头像
        "person_status":"1",           //人员状态, 1-在职，0-离职
        "person_user_id":"2",        //账号id
        "person_user_name":"账号名称",      //账号名称
        "func_pack_names":"权限1，权限2"        //权限包名称，之间用、号隔开
    },
    //性别list
    buttonArr: [{
        name: '男', id: '1'
    }, {
        name: '女', id: '2'
    }],
    // 专业list
    majorArr: [{
        name: '专业1', code: '1'
    }],
    //权限list
    jurisdiction: [{
      "func_pack_id": "QXB00022",
      "func_pack_name": "G权限包"
    }],
    //岗位
    postArr: [],
    // 定时器
    timer: false,
    //模糊查询
    personAccountList: [],
    //模糊查询input值
    accountName: "",
    //模糊查询id
    accountId: ""
}

var organizationMethods = {
    // 公共方法
    organizationTreeInit: function (arr, parentId, placeholder, lv, disabled, selected) { //默认赋值树数据
        var organizationTreeInit = arguments.callee;
        arr = arr.map(function (item) {
            item.lv = lv;
            item.placeholder = placeholder || '';
            item.parentId = parentId || '';
            if (disabled !== undefined) {
                item.disabled = disabled;
            }
            if (selected !== undefined) {
                item.selected = selected;
            }
            item.id = organizationMethods.randomRangeId(10);
            if (item.child_objs && item.child_objs.length) {
                organizationTreeInit(item.child_objs, item.id, item.placeholder, lv + 1, disabled, selected);
            }
            return item;
        });
        return arr;
    },
    searchByRegExp: function(keyWord, list) {
        //正则匹配模糊搜索
        if (!(list instanceof Array)) {
            return;
        }
        var len = list.length;
        var arr = [];
        var reg = new RegExp(keyWord);
        for (var i = 0; i < len; i++) {
            //如果字符串中不包含目标字符会返回-1
            if (list[i].person_user_name.match(reg)) {
                arr.push(list[i]);
            }
        }
        return arr;
    },
    //写入详情
    showPerson: function(person_id){
        $('#globalloading').pshow();
        //查询人员详情	
        organizationController.queryCoreDeptPersonDetailById({"person_id":person_id}).then(function(list) {
            organizationModel.personList = JSON.parse(JSON.stringify(list));
            var obj = organizationModel.personList;
            var arr = ["dept_name","id_number", "name", "project_names", "gender", "birthday", "phone_num", "person_mail", "person_num", "position_name", "specialty_name", "person_user_name", "func_pack_names"];
            var str = "";
            $("#fastAdd .per-madal-float_titcon b").html(obj.name);
            var link = '/' + pconst.requestType.pdownload + '/' + psecret.create(obj.head_portrait);
            $(".imgBox img").attr("src",link);
            for(var i = 0 ; i < arr.length ; i++) {
                str = obj[arr[i]] ? obj[arr[i]] : "";
                var str_ = "";
                if((arr[i] == "project_names") || (arr[i] == "specialty_name")){
                    for(var j = 0 ; j < obj[arr[i]].length ; j++){  
                        str_ += obj[arr[i]][j].name + "，";
                    }
                    $(".personDetails ."+arr[i]).html(str_.slice(0,-1)).attr("title",str_.slice(0,-1));
                    continue;
                }
                if((arr[i] == "gender")){
                    $(".personDetails ."+arr[i]).html(((str == "male") ? "男" : "女")).attr("title",((str == "male") ? "男" : "女"));
                    continue;
                }
                $(".personDetails ."+arr[i]).html(str).attr("title",str);
            }
        });  

    },
    //权限 点击enter
    enterAccountAddPermission: function(){
        $("#searchAccountInfo > div").hide();
        if($("#searchAccountInfo>input").val() == ""){
            return false;
        }
        organizationModel.accountId = "";
        var list = organizationModel.personAccountList;
        var str = '';
        for(var i = 0;i < list.length;i++){
            if(list[i].person_user_name === $("#searchAccountInfo>input").val()){
                str = list[i].func_pack_names;
                organizationModel.accountId = list[i].person_user_id;
                break;
            }
        }
        if(str === ''){
            $("#searchAccountInfo > div.options").hide();
            $("#searchAccountInfo > div.conJurisdictionlist").show();
            $('#jurisdictionList').html("--").attr("title","--").css("color","#cacaca").parent().css("color","#cacaca");
        }else{
            $("#searchAccountInfo > div.options").hide();
            $('#jurisdictionList').html(str).attr("title",str);
            $("#jurisdictionList").parent().find(".promptForm").hide();
        }

    },
    //选择账号添加权限
    clickAccountAddPermission: function(item) {
        $("#searchAccountInfo > div.options").hide();
        if (item.person_user_name != "暂无结果") {
            organizationModel.accountName = item.person_user_name;
            organizationModel.accountId = item.person_user_id;
            if(item.func_pack_names){
                // $("#jurisdictionId_").hide();
                // $("#jurisdictionId").show();
                $("#jurisdictionList").parent().find(".promptForm").hide();
                $('#jurisdictionList').html((item.func_pack_names ? item.func_pack_names : "")).attr("title",(item.func_pack_names ? item.func_pack_names : "")).parent().css("color","#333");
            }
        }else{
            organizationModel.accountId = "";
        }
    },
    //查询识别码
    queryById:  function(event){
        if(tools.trim(event.target.value) == ""){
            windowEvent.showPwindow5(true); //传true时该方法的作用为初始化
            return false;
        }
        clearTimeout(windowEvent.timer);  
        windowEvent.timer=setTimeout(function(){  
            windowEvent.showPwindow5(true,"123","check"); //传true时该方法的作用为初始化
            if(tools.trim(event.target.value) == ""){
                return false;
            }
            // console.log(event);
            organizationController.queryPersonDetailByidNumber({"id_number":event.target.value}).then(function(list) {
                // if(JSON.stringify(list).length == 2){
                //     return false;
                // }
                var date = new Date();
                var _year = date.getFullYear();
                var _month = date.getMonth() + 1;
                var _date = date.getDate();
                // $("#identificationCode").precover();
                $("#personName").precover();
                $("#personName").pval((list.name ? list.name : ""));    
                $("#personSex").precover();
                $("#personSex").psel((list.gender === "female" ? "女" : "男"));
                $("#phoneNumber").precover();
                $("#phoneNumber").pval((list.phone_num ? list.phone_num : ""));
                $("#birthDate").precover();
                $("#birthDate").psel({y:_year,M:_month,d:_date});
                if(list.birthday){
                    var birthday = list.birthday.split("-");
                    $("#birthDate").psel({y:birthday[0],M:birthday[1],d:birthday[2]});
                }
                $("#email").precover();
                $("#email").pval((list.person_mail ? list.person_mail : ""));
                organizationModel.accountId = (list.person_user_id ? list.person_user_id : "");
                $("#searchAccountInfo>input").val((list.person_user_name ? list.person_user_name : ""));
                if(list.person_user_name){
                    $("#searchAccountInfo>input").attr("pdisabled",true);
                }else{
                    $("#searchAccountInfo>input").attr("pdisabled",false);
                }
                $("#jurisdictionList").html((list.func_pack_names ? list.func_pack_names : "--")).attr("title",(list.func_pack_names ? list.func_pack_names : "--"));

                if(list.head_portrait && (list.head_portrait.length > 0)){
                    var link = list.head_portrait;
                    $("#fastAddImg").pval([{name: '', url: link}]);
                }

                //初始化权限
                arr = organizationModel.jurisdiction;
                (function find_(arr){
                    var find = arguments.callee;
                    for(var i=0;i<arr.length;i++){     
                        if(arr[i].selected){
                            arr[i].selected = false;  
                        } 
                        if(arr[i].disabled){
                            arr[i].disabled = false;
                        }     
                        if (arr[i].child_objs && arr[i].child_objs.length) {
                            find(arr[i].child_objs);
                        }
                    }
                })(arr);
            }); 
        },500);  
        
    },
    //删除人员
    deleteDetails: function(){
        $("#pwindow6").pshow();
    },
    //编辑详情
    editDetails:  function(){
        organizationModel.fastAddPage = 1;
        $("#fastAdd .per-madal-float_titcon b").html("编辑");
        var list = organizationModel.personList;
        var date = new Date();
        var _year = date.getFullYear();
        var _month = date.getMonth() + 1;
        var _date = date.getDate();
        $("#identificationCode").pval((list.id_number ? list.id_number : "")); 
        $("#personName").precover();
        $("#personName").pval((list.name ? list.name : ""));    
        $("#personSex").precover();
        $("#personSex").psel((list.gender === "female" ? "女" : "男"));
        $("#phoneNumber").precover();
        $("#phoneNumber").pval((list.phone_num ? list.phone_num : ""));
        $("#birthDate").precover();
        $("#birthDate").psel({y:_year,M:_month,d:_date});
        if(list.birthday){
            var birthday = list.birthday.split("-");
            $("#birthDate").psel({y:birthday[0],M:birthday[1],d:birthday[2]});
        }
        //写入岗位
        if(list.position_id){
            $("#selectedPosition").psel(list.position_name);
        }
        
        //写入项目
        if(list.project_ids && (list.project_ids.length > 0)){
            var arr = organizationModel.listByProject;
            var headerString = '';
            (function find_(arr) {
                var find = arguments.callee;
                for (var i = 0; i < arr.length; i++) {
                    for(var j = 0;j < list.project_ids.length;j++){
                        if (arr[i].obj_id == list.project_ids[j]) {
                            arr[i].selected = true;
                            headerString += (headerString.length === 0 ? '' : ',') + arr[i].obj_name;
                            break;
                        }
                    }
                    if (arr[i].child_objs && arr[i].child_objs.length) {
                        find(arr[i].child_objs);
                    }
                }
            })(arr);
            $("#selectedStr").html((headerString === '' ? '' : headerString)).attr("title",(headerString === '' ? '' : headerString));
        }

        //写入专业
        if(list.specialty && (list.specialty.length > 0)){
            console.log(list.specialty)
            var arr = organizationModel.majorArr;
            var headerString = '';
            (function find_(arr) {
                var find = arguments.callee;
                for (var i = 0; i < arr.length; i++) {
                    for(var j = 0;j < list.specialty.length;j++){
                        if (arr[i].obj_id == list.specialty[j]) {
                            arr[i].selected = true;
                            headerString += (headerString.length === 0 ? '' : ',') + arr[i].obj_name;
                            break;
                        }
                    }
                    if (arr[i].child_objs && arr[i].child_objs.length) {
                        find(arr[i].child_objs);
                    }
                }
            })(arr);
            // if(){
                $("#selectedMajor .per-combobox_name").html((headerString === '' ? '' : headerString)).attr("title",(headerString === '' ? '' : headerString));
            // }
        }

        $("#email").precover();
        $("#email").pval((list.person_mail ? list.person_mail : ""));
        $("#employeeNumber").precover();
        $("#employeeNumber").pval((list.person_num ? list.person_num : ""));
        organizationModel.accountId = (list.person_user_id ? list.person_user_id : "");
        setTimeout(function(){
            $("#searchAccountInfo > input").val((list.person_user_name ? list.person_user_name : ""));
        },0)
        if(list.person_user_name){
            $("#searchAccountInfo>input").attr("pdisabled",true);
        }else{
            $("#searchAccountInfo>input").attr("pdisabled",false);
        }
        $("#jurisdictionList").html((list.func_pack_names ? list.func_pack_names : "--")).attr("title",(list.func_pack_names ? list.func_pack_names : "--"));

        if(list.head_portrait && (list.head_portrait.length > 0)){
            var link = '/' + pconst.requestType.pdownload + '/' + psecret.create(list.head_portrait);
            $("#fastAddImg").pval([{name: '', url: link}]);
        }    

        //初始化权限
        arr = organizationModel.jurisdiction;
        (function find_(arr){
            var find = arguments.callee;
            for(var i=0;i<arr.length;i++){     
                if(arr[i].selected){
                    arr[i].selected = false;  
                } 
                if(arr[i].disabled){
                    arr[i].disabled = false;
                }     
                if (arr[i].child_objs && arr[i].child_objs.length) {
                    find(arr[i].child_objs);
                }
            }
        })(arr);
    },
    searchAccountByName: function() {
        organizationModel.accountId = "";
        if($("#searchAccountInfo > input").val() == ""){
            $("#jurisdictionList").parent().find(".promptForm").hide();
        }
        $("#jurisdictionList").html("--");
        (function find_(arr){
            var find = arguments.callee;
            for(var i=0;i<arr.length;i++){     
                if(arr[i].selected){
                    arr[i].selected = false;  
                } 
                if(arr[i].disabled){
                    arr[i].disabled = false;
                }     
                if (arr[i].child_objs && arr[i].child_objs.length) {
                    find(arr[i].child_objs);
                }
            }
        })(organizationModel.jurisdiction);
        $("#searchAccountInfo > div.options").show();
        var functionShow = $("#searchAccountInfo > .conJurisdictionlist").is(":hidden");
        if(!functionShow){
            $("#searchAccountInfo > .conJurisdictionlist").hide();
        }

        organizationModel.functionPermissionObj = [];
        var keyWord = organizationModel.accountName || "";
        var list = organizationModel.personAccountList;
        if (keyWord) {
            var arr = organizationMethods.searchByRegExp(keyWord, list);
            if (arr && arr.length > 0) {
                organizationModel.searchAccountList = arr;
            } else {
                organizationModel.searchAccountList = [{
                    person_user_name: "暂无结果",
                }];
            }
        } else if(keyWord == '') {
            $("#searchAccountInfo > div.options").hide();
            $("#searchAccountInfo > .conJurisdictionlist").hide();
            organizationModel.searchAccountList = [{
                person_user_name: "",
            }];
        }else{
            organizationModel.searchAccountList = [{
                person_user_name: "暂无结果",
            }];
        }

    },
    
    //保存中心部门修改
    keepCenterDepart: function(){
        if($("#centerDepart").find(".inputPromptShow").length > 0){
            $("#message").pshow({ text: "请根据提示信息补充完整！", state: "failure" });
            return false;
        }
        var deptPositions = this.listFormat(organizationModel.listByCenterDepartment)
        organizationController.saveDeptPosition({
            "dept_type": "d1",
            "deptPositions": deptPositions
        }).then(function(result){
            location.href=location.href;
        })
        
    },
    //保存项目通用管理修改
    keepProjectCommon: function(){
        if($("#projectCommon").find(".inputPromptShow").length > 0){
            $("#message").pshow({ text: "请根据提示信息补充完整！", state: "failure" });
            return false;
        }
        var deptPositions = this.listFormat(organizationModel.listByProjectCommon);
        organizationController.saveDeptPosition({
            "dept_type": "d2",
            "deptPositions": deptPositions
        }).then(function(result){
            location.href=location.href;
        })   
    },
    //查找当前id在树中的位置
    operations: function (arr, activeObj_) {  
        var position = [];
        var position_ = [];
        var y = 0;
        (function find(arr, id, y) {
            var find = arguments.callee;
            for (var i = 0; i < arr.length; i++) {
                position[y] = i;
                if (arr[i].id == id) {
                    position_ = position.slice(0);
                    break;
                }
                if (arr[i].child_objs && arr[i].child_objs.length) {
                    find(arr[i].child_objs, id, y + 1);
                }
            }
        })(arr, activeObj_.id, y)
        position_.splice(activeObj_.lv);
        return position_;
    },
    //列表数据格式化（用于提交到后台）
    listFormat: function(arr){ 
        var newArr = [];
        console.log(arr);
        (function find(arr,newArr) {
            var find = arguments.callee;
            for (var i = 0; i < arr.length; i++) {
                newArr[i] = {};
                newArr[i].obj_id = arr[i].obj_id;
                newArr[i].obj_name = arr[i].obj_name;
                newArr[i].obj_type = arr[i].obj_type;
                if (arr[i].child_objs && arr[i].child_objs.length) {
                    newArr[i].child_objs = [];
                    find(arr[i].child_objs,newArr[i].child_objs);
                }
            }
        })(arr,newArr);
        return newArr;
    },
    //生成随机数
    randomRangeId: function (num) { 
        var returnStr = "",
            charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < num; i++) {
            var index = Math.round(Math.random() * (charStr.length - 1));
            returnStr += charStr.substring(index, index + 1);
        }
        return returnStr;
    },
    //组织列表页
    projectCommonEdit: function () {
        organizationModel.curPage = "projectGenerral";
    },
    //中心部门编辑
    centerDepartEdit: function () {
        organizationModel.curPage = "centerDepartMent";
    },
    //取消修改
    cancelChange: function () {
        organizationModel.curPage = "list";
        $("#centerDepart").find(".inputPrompt").removeClass("inputPromptShow").css("display","none");
        $("#projectCommon").find(".inputPrompt").removeClass("inputPromptShow").css("display","none");
    },
    //修改功能操作初始化
    operationStateInit: function () {
        organizationModel.operationState[0].usable = false;
        organizationModel.operationState[1].usable = false;
        organizationModel.operationState[2].usable = false;
        organizationModel.operationState[3].usable = false;
        organizationModel.operationState[4].usable = false;
    },
    //修改
    operation: function (opId, obj, type) {
        clearTimeout(organizationModel.timer);
        var activeObj_ = {};
        $.extend(activeObj_, organizationModel.activeDataObj);
        if (!activeObj_.id) {
            return false;
        }

        //opId: 0添加同级部门，1添加下级部门，2添加同级岗位，3添加下级岗位，4删除
        var position_ = organizationMethods.operations(obj, activeObj_);
        var point = obj;
        if (opId === 4) {  //删除

            if((point[0].obj_name !== "中心部门") && point.length === 1 && (activeObj_.id === point[0].id)){
                $("#message").pshow({ text: "项目通用部门不可为空！", state: "failure" })
            }else if(position_.length === 1){
                $("#").find("#"+activeObj_.id).parent().find(".inputPrompt").remove();
                point.splice(position_[0], 1);
            }else{

                for (var i = 0; i < position_.length; i++) {
                    if (i == (position_.length - 2)) {
                        point[position_[i]].child_objs.splice(position_[i + 1], 1);
                        break;
                    }
                    point = point[position_[i]].child_objs
                }
            }
            windowEvent.hidePwindow3();
            windowEvent.hidePwindow2();
        }
        if (opId === 0) {  //添加同级部门
            if (organizationModel.operationState[0].usable) {
                var newObj = {};
                newObj.lv = activeObj_.lv;
                newObj.placeholder = '';
                newObj.parentId = activeObj_.parentId;
                newObj.obj_id = '';
                newObj.obj_name = '新部门';
                newObj.obj_type = (type === 1 ? "d1" : "d2");
                newObj.child_objs = [];
                newObj.id = organizationMethods.randomRangeId(10);
                for (var i = 0; i < position_.length; i++) {
                    if (1 == (position_.length)) {
                        point.splice(position_[i] + 1, 0, newObj)
                    }
                    if (i == (position_.length - 2)) {
                        point[position_[i]].child_objs.splice(position_[i + 1] + 1, 0, newObj);
                        break;
                    }
                    point = point[position_[i]].child_objs
                }
            }
        }
        if (opId === 1) {  //添加下级部门
            if (organizationModel.operationState[1].usable) {
                var newObj = {};
                newObj.lv = activeObj_.lv + 1;
                newObj.placeholder = '';
                newObj.parentId = activeObj_.id;
                newObj.obj_id = '';
                newObj.obj_name = '新部门';
                newObj.obj_type = (type === 1 ? "d1" : "d2");
                newObj.child_objs = [];
                newObj.id = organizationMethods.randomRangeId(10);
                for (var i = 0; i < position_.length; i++) {
                    if (i == (position_.length - 1)) {
                        if (point[position_[i]].child_objs) {
                            point[position_[i]].child_objs.push(newObj);
                        }
                        break;
                    }
                    point = point[position_[i]].child_objs;
                }
            }
        }
        if (opId === 2) {  //添加同级岗位
            if (organizationModel.operationState[2].usable) {
                var newObj = {};
                newObj.lv = activeObj_.lv;
                newObj.placeholder = '';
                newObj.parentId = activeObj_.parentId;
                newObj.obj_id = '';
                newObj.obj_name = '新岗位';
                newObj.obj_type = 'p1';
                newObj.id = organizationMethods.randomRangeId(10);
                for (var i = 0; i < position_.length; i++) {
                    if (1 == (position_.length)) {
                        point.splice(position_[i] + 1, 0, newObj)
                    }
                    if (i == (position_.length - 2)) {
                        point[position_[i]].child_objs.splice(position_[i + 1] + 1, 0, newObj);
                        break;
                    }
                    point = point[position_[i]].child_objs
                }
            }
        }
        if (opId === 3) {  //添加下级岗位
            if (organizationModel.operationState[3].usable) {
                var newObj = {};
                newObj.lv = activeObj_.lv + 1;
                newObj.placeholder = '';
                newObj.parentId = activeObj_.id;
                newObj.obj_id = '';
                newObj.obj_name = '新岗位';
                newObj.obj_type = 'p1';
                newObj.id = organizationMethods.randomRangeId(10);
                for (var i = 0; i < position_.length; i++) {
                    if (i == (position_.length - 1)) {
                        if (point[position_[i]].child_objs) {
                            point[position_[i]].child_objs.push(newObj);
                        }
                        break;
                    }
                    point = point[position_[i]].child_objs;
                }
            }
        }
        organizationModel.activeDataObj = {};
        organizationMethods.operationStateInit();
    }
}

/* 
挂载完成 
*/
var organizationMounted = function () {

    //初始化快速添加-项目
    organizationController.queryCurrentUserProjectLimits()
    .then(function(list) {
        organizationModel.listByProject = list;

        var newListByProject = [];
        (function find(arr,newArr) {
            var find = arguments.callee;
            for (var i = 0; i < arr.length; i++) {
                newArr[i] = {};
                newArr[i].obj_id = arr[i].partition_project_id;
                newArr[i].obj_name = arr[i].partition_project_name;
                newArr[i].obj_type = arr[i].type;
                if (arr[i].contents && arr[i].contents.length) {
                    newArr[i].child_objs = [];
                    find(arr[i].contents,newArr[i].child_objs);
                }
            }
        })(organizationModel.listByProject,newListByProject);
        organizationModel.listByProject = newListByProject;
        var orgTreeProject = organizationMethods.organizationTreeInit(organizationModel.listByProject, '', '', 1, false, false);
        organizationModel.listByProject = JSON.parse(JSON.stringify(orgTreeProject));
    });     
    //初始化快速添加-专业
    organizationController.queryGeneralDictByKey({"user_id": organizationModel.config.userId, "dict_type": "domain_require" })
    .then(function(list) {
        organizationModel.majorArr = list;
        var newListByMajor = [];
        (function find(arr,newArr) {
            var find = arguments.callee;
            for (var i = 0; i < arr.length; i++) {
                newArr[i] = {};
                newArr[i].obj_id = arr[i].code;
                newArr[i].obj_name = arr[i].name;
                newArr[i].obj_type = '';
                if (arr[i].child_objs && arr[i].child_objs.length) {
                    newArr[i].child_objs = [];
                    find(arr[i].child_objs,newArr[i].child_objs);
                }
            }
        })(organizationModel.majorArr,newListByMajor);
        organizationModel.majorArr = newListByMajor;
        var orgTreeProject = organizationMethods.organizationTreeInit(organizationModel.majorArr, '', '', 1, false, false);
        organizationModel.majorArr = JSON.parse(JSON.stringify(orgTreeProject));
        
    });
    //初始化权限
    organizationController.queryFuncPackList({"user_id":""}).then(function(list) {
        organizationModel.jurisdiction = list;
        var newListByMajor = [];
        (function find(arr,newArr) {
            var find = arguments.callee;
            for (var i = 0; i < arr.length; i++) {
                newArr[i] = {};
                newArr[i].obj_id = arr[i].func_pack_id;
                newArr[i].obj_name = arr[i].func_pack_name;
                newArr[i].obj_type = '';
                if (arr[i].child_objs && arr[i].child_objs.length) {
                    newArr[i].child_objs = [];
                    find(arr[i].child_objs,newArr[i].child_objs);
                }
            }
        })(organizationModel.jurisdiction,newListByMajor);
        organizationModel.jurisdiction = newListByMajor;
        var orgTreeProject = organizationMethods.organizationTreeInit(organizationModel.jurisdiction, '', '', 1, false, false);
        organizationModel.jurisdiction = JSON.parse(JSON.stringify(orgTreeProject));
    });
    //初始化中心部门
    var data_department = organizationController.queryDeptPositionTreeByType({"dept_type": "d1","query_person":"1"});
    data_department.then(function (result) { 
        if(result && (result.length > 0)){
            var orgTreeCenterDepart = organizationMethods.organizationTreeInit(result, '', '', 1);
        }else{
            var orgTreeCenterDepart = organizationMethods.organizationTreeInit(organizationModel.listByCenterDepartment, '', '', 1);
        }
        organizationModel.listByCenterDepartment = JSON.parse(JSON.stringify(orgTreeCenterDepart));
        var centerId = organizationModel.listByCenterDepartment[0].obj_id;
        //初始化中心部门岗位
        organizationController.queryPositionByDeptId({"dept_id":centerId}).then(function(result){
            organizationModel.postArr = result;
        })
        windowEvent.windowInit();
    });
    //初始化项目通用部门
    var data_projectcommo = organizationController.queryDeptPositionTreeByType({"dept_type": "d2","query_person":"1"});
    data_projectcommo.then(function (result) {      
        if(result && (result.length > 0)){
            var orgTreeProjectCommon = organizationMethods.organizationTreeInit(result, '', '', 1);
        }else{
            var orgTreeProjectCommon = organizationMethods.organizationTreeInit(organizationModel.listByProjectCommon, '', '', 1);
        }
        organizationModel.listByProjectCommon = JSON.parse(JSON.stringify(orgTreeProjectCommon));
        windowEvent.windowInit();
    }); 
    //根据账号模糊查询产生的数据列表  
    var accountData = {
        person_user_name: ""
    };
    organizationController.queryNoBindingUserList(accountData).then(function(list) {
        organizationModel.personAccountList = list;
    });             

}

/* 
vue的watch属性 
*/
var organizationWatch = {
    listByProjectCommon: {
        handler: function (val, oldVal) {
            windowEvent.borderInit();
        },
        deep: true
    },
    curPage: function(val, oldVal){
        if(val === "centerDepartMent"){
            organizationModel.treeBackup = JSON.stringify(organizationModel.listByCenterDepartment);
            $($("#centerDepart input")[0]).attr("readonly","").keydown(function(e) {
                e.preventDefault();
            });
            organizationModel.statusModel = false;
        }
        if(oldVal === "centerDepartMent" && val === "list"){
            organizationModel.listByCenterDepartment = JSON.parse(organizationModel.treeBackup);
            organizationModel.statusModel = true;
        }
        if(val === "projectGenerral"){
            organizationModel.treeBackup = JSON.stringify(organizationModel.listByProjectCommon);
            organizationModel.statusModel = false;
        }
        if(oldVal === "projectGenerral" && val === "list"){
            organizationModel.listByProjectCommon = JSON.parse(organizationModel.treeBackup);
            organizationModel.statusModel = true;
        }
    },
    listByCenterDepartment: {
        handler: function(val,oldVal){
            setTimeout(function(){
                (function find_(arr) {
                    var find = arguments.callee;
    
                    for (var i = 0; i < arr.length; i++) {
                        if (tools.trim(arr[i].obj_name) == "") {
                            $("#centerDepart").find("#"+arr[i].id).parent().find(".inputPrompt").addClass("inputPromptShow").css("display","block");  
                        }else{
                            $("#centerDepart").find("#"+arr[i].id).parent().find(".inputPrompt").removeClass("inputPromptShow").css("display","none");  
                        }
                        if (arr[i].child_objs && arr[i].child_objs.length) {
                            find(arr[i].child_objs);
                        }
                    }
                })(val)
            },100)
        },
        deep: true
    },
    listByProjectCommon: {
        handler: function(val,oldVal){
            setTimeout(function(){
                (function find_(arr) {
                    var find = arguments.callee;
                    for (var i = 0; i < arr.length; i++) {
                        if (tools.trim(arr[i].obj_name) == "") {
                            $("#projectCommon").find("#"+arr[i].id).parent().find(".inputPrompt").addClass("inputPromptShow").css("display","block");  
                        }else{
                            $("#projectCommon").find("#"+arr[i].id).parent().find(".inputPrompt").removeClass("inputPromptShow").css("display","none");  
                        }
                        if (arr[i].child_objs && arr[i].child_objs.length) {
                            find(arr[i].child_objs);
                        }
                    }
                })(val)
            },100)
        },
        deep: true 
    }
}

var organizationComputed = {
    //编辑
    edit : function(){
        
    }

}

var organizationLogger = {
    init: function () {
        new Vue({
            el: '#organizationManage',
            data: organizationModel,
            computed: organizationComputed,
            methods: organizationMethods,
            mounted: organizationMounted,
            updated: function () {
                windowEvent.borderInit();
                windowEvent.majorInit();
                windowEvent.jurisdictionInit();
                // windowEvent.positionInit();
                windowEvent.projectInit();
                //更新完成后设置readonly
                $("#centerDepart_ input,#projectCommon_ input,#selectedProject input,#selectedMajor input,#selectedJurisdiction input").attr("readonly","readonly").keydown(function(e) {
                    e.preventDefault();
                });
                windowEvent.showPerson_();
            },
            watch: organizationWatch
        });
    }
};