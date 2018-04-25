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
    //中心部门树
    listByCenterDepartment: [
        {
            obj_id: '',
            obj_name: '中心部门',
            obj_type: '',
            child_objs: []
        },
    ],
    //项目通用部门树
    listByProjectCommon: [
        {
            obj_id: '',
            obj_name: '项目通用部门',
            obj_type: '',
            child_objs: []
        }
    ],
    //快速添加人员-项目list
    listByProject: [
        {
          "partition_project_id":"1",           //分区或者项目id
          "partition_project_name":"集团1",         //分区或者项目名称
          "type":"1",                           //备注：1-分区，0-项目
          "contents":[                            //分区或者项目，项目一定是叶子节点
             {
                "partition_project_id":"2",
                "partition_project_name":"项目1", 
                "type":"0",     
                "contents":[]
             },
             {
                "partition_project_id":"3",
                "partition_project_name":"项目2", 
                "type":"0",     
                "contents":[]
             }
          ]
        },
        {
          "partition_project_id":"4",           //分区或者项目id
          "partition_project_name":"集团2",         //分区或者项目名称
          "type":"1",                           //备注：1-分区，0-项目
          "contents":[{                           //分区或者项目，项目一定是叶子节点
                "partition_project_id":"5",
                "partition_project_name":"分区1", 
                "type":"1",     
                "contents":[                            //分区或者项目，项目一定是叶子节点
                    {
                       "partition_project_id":"6",
                       "partition_project_name":"项目3", 
                       "type":"0",     
                       "contents":[]
                    }
                ],
            }
          ]
        },
    ],
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
    activeDataObj: {

    },
    //验证项目是否选择
    verifi3 : false,
    //验证职位是否选择
    verifi4 : false,
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
    enterAccountAddPermission: function(){
        organizationModel.accountId = "";
        $("#searchAccountInfo > div").hide();
        $("#jurisdictionId").hide();
        $("#jurisdictionId_").show();
        $('#jurisdictionList').html("--").css("color","#cacaca").parent().css("color","#cacaca");
    },
    clickAccountAddPermission: function(item) {
        //选择账号添加权限
        $("#searchAccountInfo > div").hide();
        if (item.person_user_name != "暂无结果") {
            organizationModel.accountName = item.person_user_name;
            organizationModel.accountId = item.person_user_id;
            if(item.func_pack_names){
                $("#jurisdictionId_").hide();
                $("#jurisdictionId").show();
                $('#jurisdictionList').html((item.func_pack_names ? item.func_pack_names : "")).css("color","#333").parent().css("color","#333");
            }
        }else{
            organizationModel.accountId = "";
           
        }
    },
    //查询识别码
    queryById:  function(event){
        if(tools.trim(event.target.value) == ""){
            return false;
        }
        organizationController.queryPersonDetailByidNumber({"id_number":event.target.value}).then(function(list) {
            // if(JSON.stringify(list).length == 2){
            //     return false;
            // }

            // $("#identificationCode").precover();
            $("#personName").pval((list.name ? list.name : ""));
            $("#personSex").psel((list.gender === "female" ? "女" : "男"));
            $("#phoneNumber").pval((list.phone_num ? list.phone_num : ""));
            $("#birthDate").psel({y:2007,M:1,d:1});
            if(list.birthday){
                var birthday = list.birthday.split("-");
                $("#birthDate").psel({y:birthday[0],M:birthday[1],d:birthday[2]});
            }
            $("#email").pval((list.person_mail ? list.person_mail : ""));
            organizationModel.accountId = (list.person_user_id ? list.person_user_id : "");

            // $("#employeeNumber").precover();
            // $("#email").precover();
            $("#searchAccountInfo>input").val((list.person_user_name ? list.person_user_name : ""));
            $("#jurisdictionId").show();
            $("#jurisdictionId_").hide(); 
            $("#jurisdictionList").html((list.func_pack_names ? list.func_pack_names : "--"));
            // $("#selectedProject .per-combobox_name").html("请选择项目");
            // $("#selectedPosition").precover();
            // $("#selectedPosition .per-combobox_name").html("请选择岗位");
            // $("#selectedJurisdiction .per-combobox_name").html("请选择权限");
            // $("#selectedMajor .per-combobox_name").html("请选择专业");

            // //初始化专业
            // arr = organizationModel.majorArr;
            // (function find_(arr){
            //     var find = arguments.callee;
            //     for(var i=0;i<arr.length;i++){     
            //         if(arr[i].selected){
            //             arr[i].selected = false;  
            //         } 
            //         if(arr[i].disabled){
            //             arr[i].disabled = false;
            //         }    
            //         if (arr[i].child_objs && arr[i].child_objs.length) {
            //             find(arr[i].child_objs);
            //         }
            //     }
            // })(arr);
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
            // //初始化项目
            // arr = organizationModel.listByProject;
            // (function find_(arr){
            //     var find = arguments.callee;
            //     for(var i=0;i<arr.length;i++){     
            //         if(arr[i].selected){
            //             arr[i].selected = false;  
            //         } 
            //         if(arr[i].disabled){
            //             arr[i].disabled = false;
            //         }    
            //         if (arr[i].child_objs && arr[i].child_objs.length) {
            //             find(arr[i].child_objs);
            //         }
            //     }
            // })(arr);
        });
    },
    searchAccountByName: function() {
        //通过账号模糊查询列表
        $("#searchAccountInfo > div").show();
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
                    disabled: true
                }];
            }
        } else {
            organizationModel.searchAccountList = [{
                person_user_name: "暂无结果",
                disabled: true
            }];
        }
    },
    //保存中心部门修改
    keepCenterDepart: function(){
        if($("#centerDepart").find(".inputPromptShow").length > 0){
            $("#message").pshow({ text: "请根据提示信息补充完整！", state: "failure" });
            return false;
        }
        var deptPositions = this.listFormat(organizationModel.listByCenterDepartment);
        organizationController.saveDeptPosition({
            "dept_type": "d1",
            "deptPositions": deptPositions
        }).then(function(result){
            location.href=location.href;
        })
        
    },
    //屏蔽backspace按键
    shieldingKey: function(id){
        var k=window.event.keyCode;
        if(k==id){window.event.keyCode=0;window.event.returnValue=false;return false;}
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
                if(type === 1){
                    $("#centerDepart").find("#"+activeObj_.id).parent().find(".inputPrompt").removeClass("inputPromptShow").css("display","none");
                }else{
                    $("#projectCommon").find("#"+activeObj_.id).parent().find(".inputPrompt").removeClass("inputPromptShow").css("display","none");
                }
                $("#").find("#"+activeObj_.id).parent().find(".inputPrompt").remove();
                point.splice(position_[0], 1);
            }else{
                if(type === 1){
                    $("#centerDepart").find("#"+activeObj_.id).parent().find(".inputPrompt").removeClass("inputPromptShow").css("display","none");
                    console.log($("#centerDepart").find("#"+activeObj_.id).parent().find(".inputPrompt"))
                }else{
                    $("#projectCommon").find("#"+activeObj_.id).parent().find(".inputPrompt").removeClass("inputPromptShow").css("display","none");
                }
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
    // $(document).on('focus', 'input[readonly]', function () {
    //     this.blur();    
    // })
    //初始化中心部门岗位
    organizationController.queryPositionByDeptId({"dept_id":"BMBMb4bad6394438481c8488366b9d49aee1"}).then(function(result){
        organizationModel.postArr = result;
        // var newListByMajor = [];
        // (function find(arr,newArr) {
        //     var find = arguments.callee;
        //     for (var i = 0; i < arr.length; i++) {
        //         newArr[i] = {};
        //         newArr[i].obj_id = arr[i].position_id;
        //         newArr[i].obj_name = arr[i].position_name;
        //         newArr[i].obj_type = '';
        //         if (arr[i].child_objs && arr[i].child_objs.length) {
        //             newArr[i].child_objs = [];
        //             find(arr[i].child_objs,newArr[i].child_objs);
        //         }
        //     }
        // })(organizationModel.postArr,newListByMajor);
        // organizationModel.postArr = newListByMajor;
        // var orgTreeProject = organizationMethods.organizationTreeInit(organizationModel.postArr, '', '', 1, false, false);
        // organizationModel.postArr = JSON.parse(JSON.stringify(orgTreeProject));
    })
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
    var data_department = organizationController.queryDeptPositionTreeByType({"dept_type": "d1" });
    data_department.then(function (result) {
        var orgTreeCenterDepart = organizationMethods.organizationTreeInit(result, '', '', 1);
        organizationModel.listByCenterDepartment = JSON.parse(JSON.stringify(orgTreeCenterDepart));
        windowEvent.windowInit();
    });
    //初始化项目通用部门
    var data_projectcommo = organizationController.queryDeptPositionTreeByType({"dept_type": "d2" });
    data_projectcommo.then(function (result) {
        var orgTreeProjectCommon = organizationMethods.organizationTreeInit(result, '', '', 1);
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
        }
        if(oldVal === "centerDepartMent" && val === "list"){
            organizationModel.listByCenterDepartment = JSON.parse(organizationModel.treeBackup);
        }
        if(val === "projectGenerral"){
            organizationModel.treeBackup = JSON.stringify(organizationModel.listByProjectCommon);
        }
        if(oldVal === "projectGenerral" && val === "list"){
            organizationModel.listByProjectCommon = JSON.parse(organizationModel.treeBackup);
        }
    }
}

var organizationLogger = {
    init: function () {
        new Vue({
            el: '#organizationManage',
            data: organizationModel,
            methods: organizationMethods,
            mounted: organizationMounted,
            updated: function () {
                windowEvent.borderInit();
                windowEvent.majorInit();
                windowEvent.jurisdictionInit();
                // windowEvent.positionInit();
                windowEvent.projectInit();
            },
            watch: organizationWatch
        });
    }
};