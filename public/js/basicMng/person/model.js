var personModel = {
    curPage: "list",
    userId: "", //人员id
    projectId: "", //项目id
    buttonMenus1: [
        { name: "人员管理", isActive: true, icon: "z" },
        { name: "登录信息", isActive: false, icon: "z" }
    ],
    buttonMenus2: [
        { name: "人员管理", isActive: true, icon: "z" },
    ],
    buttonMenus3: [
        { name: "登录信息", isActive: true, icon: "z" }
    ],
    //人员管理相关

    // 新建、编辑、详情
    personInformationObj: {
        //新建人员侧弹框显示新建或详情
        page: "create"
    },
    employeeSexObj: [{
            //员工性别
            name: "男"
        },
        {
            name: "女"
        }
    ],
    employeePositionObj: [
        //员工所在岗位
    ],
    saveEmplyeePosition:{
        obj_name:"",
        obj_id:"",
    },
    employeeMajorObj: [
        //专业
        {
            name: "a"
        },
        {
            name: "b"
        }
    ],
    personAccountList: [
        //账号列表
    ],
    confirmChoicePositionObj: {
        //确认选中岗位对象
    },
    employeePermissionList: [
        //员工功能权限列表
    ],
    choicePositionTree:[//新建员工选择岗位树

    ],
    functionPermissionObj: {
        //功能权限
        func_pack_names:'— —',
        person_user_name:'',
        person_user_id:''
    },
    choiceMajorList: [], //专业列表
    majorChoiceObj: {}, //选中专业对象
    permissionPackageIdArr: [], //权限包id数组
    functionPermissionBlock: {
        //是否显示员工权限列表
        isShow: false
    },
    accountName: "", //账号存储
    permissionPackageList: [], //权限包列表
    personDetalObj: {}, //人员详情

    // 人员列表列表
    deptPositionId: "", //存储选择树中的部门或岗位id
    organizationList: [
        //组织结构树
    ],
    personInfoGrid: [
        //员工信息列表
    ],
    personStateSelect: [//人员状态选择选择列表
        {
            name:"全部",
            id:"2"
        },
        {
            
            name: "在职",
            id: "1"
        },
        {
            name: "离职",
            id: "0"
        }
    ],
    personNum: 1, //未绑定账号的员工数量
    personGroup: [
        //人员缩略图列表
    ],

    //登录信息相关
    loginInfoDepartment: [
        //部门
        {
            name: "xxx部门"
        },
        {
            name: "yyy部门"
        }
    ],
    loginInfoPosition: [
        //岗位
        {
            name: "开发工程师"
        },
        {
            name: "测试工程师"
        }
    ],
    loginInfoGrid: [
        //登录信息表格
    ],
    //编辑自定义部门相关
    listByCenterDepartment: [], //中心部门树
    listByProjectCommon: [], //项目通用树

    personCustomTree: [], //自定义部门树
    choiceOptionId: "" //存储选中项id
};

var personMethods = {
    // 公共方法
    eventStop: function(event) {
        console.log(1);
        event.stopPropagation();
    },
    // 公用
    arrayObjectTransfString: function(arr, key, point) {
        //数组对象转字符串通用
        var str = "";
        var newArr = [];
        if (arr && arr.length > 0) {
            arr.forEach(function(item) {
                newArr.push(item[key]);
            });
        }

        return (str = newArr.join(point));
    },
    createSon: function(obj_name, obj_type, lv, parentId, placeholder) {
        //创建新节点
        console.log(obj_name, lv, parentId);
        return {
            id: personMethods.randomRangeId(10),
            lv: lv,
            placeholder: placeholder,
            obj_name: obj_name,
            obj_type: obj_type,
            child_objs: [],
            parentId: parentId
        };
    },
    searchParentId: function(arr, id, con) {
        //查找自身和父元素id

        var search = arguments.callee;

        return arr.reduce(function(con, info) {
            if (info.id == id) {
                con.push(info);
            }

            if (info.child_objs && info.child_objs.length) {
                con = search(info.child_objs, id, con);
            }

            return con;
        }, con);
    },
    searchObjId: function(arr, id, con) {
        //查找自身和父元素id

        var search = arguments.callee;

        return arr.reduce(function(con, info) {
            if (info.obj_id == id) {
                con.push(info);
            }

            if (info.child_objs && info.child_objs.length) {
                con = search(info.child_objs, id, con);
            }

            return con;
        }, con);
    },
    searchPositionId: function(arr, id, con) {
        //查找岗位id及子元素
        var search = arguments.callee;

        return arr.reduce(function(con, info) {
            if (info.position_id == id) {
                con.push(info);
            }

            if (info.child_objs && info.child_objs.length) {
                con = search(info.child_objs, id, con);
            }

            return con;
        }, con);
    },
    organizationTreeInit: function(arr, parentId, placeholder, lv) {
        //默认赋值树数据

        var organizationTreeInit = arguments.callee;

        arr = arr.map(function(item) {
            item.lv = lv;
            item.placeholder = placeholder || "";
            item.parentId = parentId || "";

            item.id = personMethods.randomRangeId(10);

            if (item.child_objs && item.child_objs.length) {
                organizationTreeInit(
                    item.child_objs,
                    item.id,
                    item.placeholder,
                    lv + 1
                );
            } else {
                item.child_objs = [];
            }

            return item;
        });

        return arr;
    },
    randomRangeId: function(num) {
        //生成随机数
        var returnStr = "",
            charStr =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < num; i++) {
            var index = Math.round(Math.random() * (charStr.length - 1));
            returnStr += charStr.substring(index, index + 1);
        }
        return returnStr;
    },

    //创建人员相关
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
    searchAccountByName: function() {//通过账号模糊查询列表
        $("#searchAccountInfo > div").show();
        var functionShow = $("#permissionPackageList").is(":hidden");
        if(!functionShow){
            $("#permissionPackageList").hide();
        }
        personModel.functionPermissionObj = [];
        var keyWord = personModel.accountName || "";
        var list = personModel.personAccountList;
        if (keyWord) {
            var arr = personMethods.searchByRegExp(keyWord, list);
            if (arr && arr.length > 0) {
                personModel.searchAccountList = arr;
            } else {
                personModel.searchAccountList = [{
                    person_user_name: "暂无结果",
                }];
            }
        } else if(keyWord == '') {
            $("#searchAccountInfo > div").hide();
            personModel.searchAccountList = [{
                person_user_name: "",
            }];
        }else{
            personModel.searchAccountList = [{
                person_user_name: "暂无结果",
            }];
        }

        console.log(arr);
    },
    clickAccountAddPermission: function(item) {//选择账号添加权限
        $("#searchAccountInfo > div").hide();
        if (item.person_user_name != "暂无结果") {
            personModel.functionPermissionObj = {
                person_user_id:item.person_user_id,
                func_pack_names:item.func_pack_names,
                person_user_name:item.person_user_name
            };
            personModel.accountName = item.person_user_name;
        }
    },
    enterAccountAddPermission: function() { //输入账号名称回车展开权限列表
        $("#searchAccountInfo > div").hide();
        var keyWord = personModel.accountName || "";
        //判断输入框为空时
        if(keyWord == ''){
            return;
        };
        //判断输入文本是否匹配现有账号如果有直接设置
        var list = personModel.personAccountList;
        var saveObj  = {};
        for(var i=0;i<list.length;i++){
            var jsonArr = list[i];
            if(keyWord == jsonArr.person_user_name){
                saveObj = jsonArr;
                break;
            }
        }
        if(saveObj.person_user_id){
            personModel.functionPermissionObj = {
                person_user_id:saveObj.person_user_id,
                func_pack_names:saveObj.func_pack_names,
                person_user_name:saveObj.person_user_name
            };
            personModel.accountName = saveObj.person_user_name;
            return;
        }else{//未能在当前列表中匹配到，存储当前输入的结果为账号
            personModel.accountName = keyWord;
            
        }

        $("#permissionPackageList").show();
        // personModel.functionPermissionObj = [];
        // personModel.functionPermissionObj = {};

        //获取权限包列表
        var funData = {
            user_id: personModel.userId
        };
        personController.queryFuncPackList(funData).then(function(list) {
            personModel.permissionPackageList = list;
        });
    },
    
    moreSelectPermissionItem: function(item) { //权限列表点击某项选中
       
        item.isShow = !item.isShow;
        personModel.permissionPackageList = JSON.parse(JSON.stringify(personModel.permissionPackageList));
    },
    moreSelectPermissionList: function() { //通过权限列表选中项确认选中结果
       
        $("#permissionPackageList").hide(); //多选权限包列表
        var arr = personModel.permissionPackageList || [];
        var checkedArr = [];
        var checkedIdArr = [];
        var checkedStr = "";
        for (var i = 0; i < arr.length; i++) {
            var json = arr[i];
            if (json.isShow) {
                checkedArr.push(json.func_pack_name);
                checkedIdArr.push(json.func_pack_id);
            }
        }
        if (checkedArr && checkedArr.length > 1) {
            checkedStr = checkedArr.join("、");
        }else{
            checkedStr = checkedArr[0];
        }
        personModel.functionPermissionObj = {
            func_pack_names: checkedStr,
            // disabled: true
        };
        personModel.functionPermissionObj = JSON.parse(JSON.stringify(personModel.functionPermissionObj));
        personModel.permissionPackageIdArr = checkedIdArr;
    },
    checkedAccountOption: function(obj) {//选中当前账号
        
        var _name = obj.pEventAttr.key || "";
        var arr = personModel.personAccountList;
        var result;
        if (!!_name) {
            for (var i = 0; i < arr.length; i++) {
                var json = arr[i];
                if (json.person_user_name && json.person_user_name == _name) {
                    result = json;
                    break;
                }
            }
            personModel.functionPermissionObj = result;
        }
        console.log(obj.pEventAttr.key);
    },

    //人员列表相关
    tabChange: function(model, event) { //人员管理列表tab切换
        var _this = this;
        var vueModel = window.model;
        var _index = event.pEventAttr.index || 0;
        if (_index === 0) {
            $("#personState").precover("全部");
            $("#personInfoListGrid").precover(true);//表格初始化
            // $("#personInfoListGrid").psetHeaderSort({index:0,sortType:'desc'});
            $("#personState").pslideUp();
            $("#personManageList").show();
            $("#loginInfoList").hide();
            personModel.deptPositionId = '';
            personMethods.showPersonList();
            var organizationTree = JSON.parse(JSON.stringify(personModel.organizationList));
            var newOrganizationTree = repeat(organizationTree);
            personModel.organizationList = JSON.parse(JSON.stringify(newOrganizationTree));
            function repeat(arr){
                for(var i=0;i<arr.length;i++){
                    var jsonArr = arr[i];
                    jsonArr["checked"] = false;
                    if(jsonArr.child_objs && jsonArr.child_objs.length>0){
                        repeat(jsonArr.child_objs);
                    }
                }
                return arr;
            }
        } else if (_index === 1) {
            //获取登录信息列表
            $("#personNameSearch").precover();
            $("#loginInfoGrid").precover(true);//表格初始化
            $("#createPersonFloatWindow").phide();
            var _data = {
                user_id: personModel.userId,
                project_id: personModel.projectId,
                name: "", //姓名，支持模糊查询
                page: 1, //当前页号，默认从第1页开始
                page_size: "", //每页返回数量，不传时不分页
                order_field: "login_time", //排序字段名称（login_time-登录时间，distance-距离）
                order_by: "desc" //升降序（asc-升序，desc-降序）默认登录时间降序
            };
            personController.queryPersonLoginInfo(_data)
                .then(function(list) {
                    personModel.loginInfoGrid = JSON.parse(JSON.stringify(list));
                })
                .catch(function() {
                    $("#globalnotice").pshow({
                        text: "获取登录信息失败，请重试",
                        state: "failure"
                    });
                });
            $("#loginInfoList").show();
            $("#personManageList").hide();
        }
    },
    choiceOption:function(item){//点击组织结构某项重置列表
        console.log(item);
        $("#createPersonFloatWindow").phide();
        personModel.deptPositionId = item.obj_id;
        var _flag = $(".personShow").hasClass("disabled") || false;
        if (_flag) {
            //人员列表显示
            console.log("列表");
            personMethods.showPersonList();
        } else {
            //人员缩略图显示
            console.log("缩略图");
            personMethods.showPersonPicList();
        };
        //添加选中项
        //取出当前树结构
        var _tree = JSON.parse(JSON.stringify(personModel.organizationList));
        //将数据源重置

        var repeatTree = repeat(_tree);
        var newTree = fn(repeatTree,item.id);
        personModel.organizationList = JSON.parse(JSON.stringify(newTree));
        console.log(newTree);
        function repeat(arr){
            for(var i=0;i<arr.length;i++){
                var jsonArr = arr[i];
                jsonArr["checked"] = false;
                if(jsonArr.child_objs && jsonArr.child_objs.length>0){
                    repeat(jsonArr.child_objs);
                }
            }
            return arr;
        }
        function fn(arr,_id){
            for(var i=0;i<arr.length;i++){
                var jsonArr = arr[i];
                if(jsonArr.id == _id){
                    jsonArr["checked"] = true;
                    addClass(jsonArr.child_objs);
                }
                if(jsonArr.child_objs && jsonArr.child_objs){
                    fn(jsonArr.child_objs,_id)
                }
            }
            return arr;
        }
        function addClass(arr){
            if(arr && arr.length >0){
                for(var i=0;i<arr.length;i++){
                    var jsonArr = arr[i];
                    jsonArr["checked"] = true;
                    if(jsonArr.child_objs && jsonArr.child_objs){
                        addClass(jsonArr.child_objs);
                    }
                }
            }
            return arr
        }
   
    },
    personInfoGridSort: function(model) {//登录信息排序
        console.log(model.pEventAttr);
        var _sortType = model.pEventAttr.sortType || "desc";
        var deptPositionId = personModel.deptPositionId || "";
        var state = $("#personState").psel() ?  ($("#personState").psel().id != '2' ? $("#personState").psel().id : '') :  '';
        var _data = {
            user_id: personModel.userId, //账号id-当前登录人的账号id，必须
            project_id: personModel.projectId,
            person_status: state,
            dept_position_id: deptPositionId,
            order_field: "person_num",
            order_by: _sortType
        };
        personMethods.getPersonListData(_data);
    },
    goBackPersonManageList: function() {  //人员管理列表初始化函数

            personModel.listByCenterDepartment = [];
            personModel.listByProjectCommon = [];
            $(".closeCenterBtn").hide();
            $(".openCenterBtn").show();
            $(".closeCommonBtn").hide();
            $(".openCommonBtn").show();
            $("#projectCommonUl >section").hide();
            $("#centerDepartmentUl >section").hide(); 

        if (personModel.curPage != "list") {
            personModel.curPage = "list";
           
        }
        //获取组织结构列表
        var treeData = {
            project_id: personModel.projectId,
            user_id: personModel.userId
        };
        personController.queryDeptPositionTree(treeData)
            .then(function(list) {
                var tree = personMethods.organizationTreeInit(list, "", "", 1);
                personModel.organizationList = JSON.parse(JSON.stringify(tree));
            })
            .catch(function() {});
        var tree = personMethods.organizationTreeInit(personModel.organizationList,"","",1);
        personModel.organizationList = JSON.parse(JSON.stringify(tree));
        var person_status = $("#personState").psel() ?  ($("#personState").psel().id != '2' ? $("#personState").psel().id : '') : '';
        //获取人员列表
        var personData = {
            user_id: personModel.userId,
            project_id: personModel.projectId,
            person_status: person_status, //人员状态，1-在职，0-离职，必须
            dept_position_id: "", //部门id，或者岗位id
            order_field: "person_num", //排序字段名称（person_num）
            order_by: "desc"
        };
        personMethods.getPersonListData(personData);
        var accountData = {
            user_id: personModel.userId,
            person_user_name: ""
        };
        personController.queryNoBindingUserList(accountData).then(function(list) {
            personModel.personAccountList = list;
        });
        setTimeout(function(){
            $("#navBar").psel(0, false); //选中当前选项，false掉默认事件加载
            // $("#upload").find("em").text("批量上传");
        },0)
    },
    showPersonList: function() {//展示人员列表
        
        var deptPositionId = personModel.deptPositionId || "";
        var state = $("#personState").psel() ?  ($("#personState").psel().id != '2' ? $("#personState").psel().id : '') : '' ;
        var _data = {
            user_id: personModel.userId, //账号id-当前登录人的账号id，必须
            project_id: personModel.projectId,
            person_status: state,
            dept_position_id: deptPositionId,
            order_field: "person_num",
            order_by: "desc"
        };
        personMethods.getPersonListData(_data);
        $("#personInfoList").show();
        $("#perPicTable").hide();
        $(".switchBtn").find(".personList").removeClass("disabled");
        $(".switchBtn").find(".personShow ").addClass("disabled");
    },
    showPersonPicList: function() { //展示缩略图列表
        var deptPositionId = personModel.deptPositionId || "";
        var state = $("#personState").psel() ?  ($("#personState").psel().id != '2' ? $("#personState").psel().id : '') :  '';
        var _data = {
            person_status: state,
            dept_position_id: deptPositionId,
            user_id: personModel.userId,
            project_id: personModel.projectId
        };
        personMethods.getPersonWithGroup(_data);
        $("#perPicTable").show();
        $("#personInfoList").hide();
        $(".switchBtn").find(".personShow").removeClass("disabled");
        $(".switchBtn").find(".personList ").addClass("disabled");
    },
    choicePersonState: function(model) {//切换员工状态获取数据
        $("#createPersonFloatWindow").phide();
        var state = model.pEventAttr.currItem.id != 2 ? model.pEventAttr.currItem.id : '';
        var deptPositionId = personModel.deptPositionId || "";
        var _data = {
            user_id: personModel.userId, //账号id-当前登录人的账号id，必须
            project_id: personModel.projectId,
            person_status: state,
            dept_position_id: deptPositionId,
            order_field: "person_num",
            order_by: "desc"
        };
        var groupData = {
            //缩略图传参
            user_id: personModel.userId,
            project_id: personModel.projectId,
            person_status: state,
            dept_position_id: deptPositionId
        };
        var _flag = $(".personShow").hasClass("disabled") || false;
        if (_flag) {
            //人员列表显示
            console.log("列表");
            personModel.personInfoGrid = [];
            
            
            personMethods.getPersonListData(_data);
        } else {
            //人员缩略图显示
            console.log("缩略图");
            personMethods.getPersonWithGroup(groupData);
        }
    },
    checkPersonId:function(){//通过员工识别码查询员工数据
        // personMethods.createAndEditShow();
        $("#employeeName").precover();
        $("#employeeIdTip").hide();
        $("#employeeSex").precover();
        $("#startTime").precover();
        $("#employeePhone").precover();
        $("#employeeEmail").precover();
        $("#employeeNo").precover();
        $("#employeePosition").precover("请选择");
        $("#employeeMajor .title >span").text("请选择");
        setTimeout(function(){
            $("#employeePositionTip").hide();
        },0)
        
        personModel.accountName = '';
        personModel.functionPermissionObj = {
            person_user_name: '',
            disabled: false
        };
        $("#imageInformationId").precover();
        var personId = $("#employeeId").pval();
        if(personId){
            var personData = {
                "id_number":personId
            };
            personController.queryPersonDetailByidNumber(personData)
            .then(function(result){   
                personDetail = result;
                if(personDetail["id_number"]){//如果存在员工识别码
                    setTimeout(function() {
                        //查找反选岗位参数
                        // var positionTree = JSON.parse(
                        //     JSON.stringify(personModel.employeePositionObj)
                        // );
                        // positionTree = personMethods.organizationTreeInit(positionTree,"","",1);
                        // if (personDetail.position_id) {
                        //     var curNode = personMethods.searchObjId(
                        //         personModel.employeePositionObj,
                        //         personDetail.position_id,
                        //         []
                        //     );
                        //     $("#employeePosition").psel({ text: curNode[0].obj_name, level: curNode[0].lv, id:  curNode[0].id});
                        //     console.log(curNode);
                        // }
            
                        $("#employeeId").pval(personDetail.id_number); //员工识别码
                        $("#employeeName").pval(personDetail.name); //员工姓名
                        var _sex = personDetail.gender == "male" ? "男" : "女";
                        $("#employeeSex").psel(_sex); //选择性别
                        var birthdayObj = {
                            year: "",
                            month: "",
                            day: ""
                        };
                        var str = personDetail.birthday;
                        birthdayObj.year = str ? str.substr(0, 4) :'';
                        birthdayObj.month = str ? str.substr(5, 2) :'';
                        birthdayObj.day = str ? str.substr(8, 2) :'';
                        $("#startTime").psel({
                            y: birthdayObj.year,
                            M: birthdayObj.month,
                            d: birthdayObj.day
                        });
                        $("#employeePhone").pval(personDetail.phone_num); //手机号
                        $("#employeeEmail").pval(personDetail.person_mail); //邮箱
                        $("#employeeNo").pval(personDetail.person_num); //员工编号
                        personModel.accountName = personDetail.person_user_name; //账号
                        $("#employeePositionTip").hide();
                        // console.log(personDetail.specialty_name);
                        // if(personDetail.specialty_name && personDetail.specialty_name.length >0){
                        //     $("#employeeMajor > .title >span").text(personMethods.arrayObjectTransfString(personDetail.specialty_name,"name","、")); //专业
                        //     $("#employeeMajor > .title >span").attr("title",personMethods.arrayObjectTransfString(personDetail.specialty_name,"name","、")); 
                        // }else{
                        //     $("#employeeMajor > .title >span").text("请选择");
                        //     $("#employeeMajor > .title >span").attr("title","");
                        // }
                        //功能权限
                        personModel.functionPermissionObj = {
                            person_user_name: personDetail.person_user_name,
                            func_pack_names:personDetail.func_pack_names,
                            person_user_id:personDetail.person_user_id
                        };
                        if(personDetail.head_portrait != '' && personDetail.head_portrait != '--'){
                            $("#imageInformationId [pertype='uplodImgBox']").pval([{name: '', url: personDetail.head_portrait}]);
                        };
                        // $("#createPersonFloatWindow").pshow({ title: "编辑", subtitle: "" });
                    }, 0);
                }else{//不存在清空反填数据
                    // $("#employeeId").precover();
                    $("#employeeName").precover();
                    $("#employeeIdTip").hide();
                    $("#employeeSex").precover();
                    $("#startTime").precover();
                    $("#employeePhone").precover();
                    $("#employeeEmail").precover();
                    $("#employeeNo").precover();
                    $("#employeePosition").precover("请选择");
                    $("#employeeMajor .title >span").text("请选择");
                    setTimeout(function(){
                        $("#employeePositionTip").hide();
                    },0)
                    
                    personModel.accountName = '';
                    personModel.functionPermissionObj = {
                        person_user_name: '',
                        disabled: false
                    };
                    $("#imageInformationId").precover();
                }
               
            })
        }else{
            $("#employeeName").precover();
            $("#employeeSex").precover();
            $("#startTime").precover();
            $("#employeePhone").precover();
            $("#employeeEmail").precover();
            $("#employeeNo").precover();
            $("#employeePosition").precover("请选择");
            $("#employeeMajor .title >span").text("请选择");
            setTimeout(function(){
                $("#employeePositionTip").hide();
            },0)
            
            personModel.accountName = '';
            personModel.functionPermissionObj = {
                person_user_name: '',
                disabled: false
            };
            $("#imageInformationId").precover();
        };
        
    },
    checkInitAndZero:function(val){//验证员工识别码类型
        var re = /^\d+$/;
        var val = val || '';
        var res =  re.test(val) ? true : false;
        return res;
    },
    employeeIdBlur:function(){//验证员工识别码是否为正整数或0
        if($("#employeeId").pval()){
            var flag = personMethods.checkInitAndZero($("#employeeId").pval());
            if(flag){
                $("#employeeIdTip").hide();
            }else{
                $("#employeeIdTip").show();
            }
        }else{
            $("#employeeIdTip").hide();
        }
       
    },
    createPersonSave: function() {//创建人员保存
        
        var page = personModel.personInformationObj.page;
        var employeeName = $("#employeeName").pval() || "";
        var employeeId = $("#employeeId").pval() || "";
        var employeePhone = $("#employeePhone").pval() || "";
        var employeeEmail = $("#employeeEmail").pval() || "";
        var startTime = $("#startTime").psel().startTime;
        var employeeSex = $("#employeeSex").psel().text == "女" ? "female" : "male";
        var employeeNo = $("#employeeNo").pval();
        var employeeChoiceOptionId = personModel.saveEmplyeePosition.obj_id;
        var employeeSpecialty = personModel.majorChoiceObj.idArr; //专业数组id
        var personUserId = personModel.functionPermissionObj.person_user_id || "";
        var personUserName = personModel.accountName || "";
        var funcPackIds = personModel.permissionPackageIdArr;

        //表单验证
        var employeeIdFlag = $("#employeeId").pverifi(); //员工识别码
        var employeeIdTypeFlag = personMethods.checkInitAndZero($("#employeeId").pval());
        var employeeNameFlag = $("#employeeName").pverifi(); //员工姓名
        var employeePhoneFlag = $("#employeePhone").pverifi(); //员工手机号
        var employeeEmailFlag = $("#employeeEmail").pverifi(); //员工邮箱
        var employeeNoFlag = $("#employeeNo").pverifi();//员工编号
        var employeePosition = $("#employeePositionName").attr("objId") ? true : false;
        if (!employeeIdFlag) {
            $("#employeeId").pshowTextTip();
            // return;
        }else if(!employeeIdTypeFlag){//判断员工识别码是否为正整数或0
            $("#employeeIdTip").show();
        }
        // if(!employeeIdTypeFlag){
        //     $("#employeeIdTip").show();
        //     return;
        // }
        if (!employeeNameFlag) {
            $("#employeeName").pshowTextTip();
        }
        if (!employeePhoneFlag) {
            $("#employeePhone").pshowTextTip();
        }
        if (!employeeEmailFlag) {
            $("#employeeEmail").pshowTextTip();
        }
        if(!employeeNoFlag){
            $("#employeeNo").pshowTextTip();
        }
        var employeePositionId = $("#employeePositionName").attr("objId");
        if(!employeePositionId){//是否选中岗位
            $("#employeePositionTip").show();
            return;
        }
        var checkResult =
            employeeIdFlag &&
            employeeIdTypeFlag &&
            employeeNameFlag &&
            employeePhoneFlag &&
            employeeEmailFlag && 
            employeeNoFlag &&
            employeePosition;
        if (checkResult) {
            if (page == "create") {
                //新建
                var createData = {
                    user_id: personModel.userId, //账号id-当前登录人的账号id，必须
                    project_id: personModel.projectId, //项目id ,必须
                    name: employeeName, //姓名 ,必须
                    id_number: employeeId, //身份证号码 ,必须
                    phone_num: employeePhone, //手机号
                    gender: employeeSex, //性别，male-男、female-女,必须
                    birthday: startTime, //出生年月
                    person_mail: employeeEmail, //邮箱
                    person_type: "2", //人员类型，1-中心部门人员，2-项目人员,必须
                    person_num: employeeNo, //员工编号
                    position_id: employeeChoiceOptionId, //岗位id
                    specialty: employeeSpecialty, //专业编码
                    //head_portrait: "", //系统头像
                    person_user_id: personUserId, //账号id
                    person_user_name: personUserName, //账号名称
                    func_pack_ids: funcPackIds
                };
                var filesImg = $("#imageInformationId").pval();
                if (filesImg.length > 0 && filesImg[0].name) {
                    var attachments = {
                        path:filesImg[0].url,
                        fileName:filesImg[0].name,
                        toPro:"head_portrait",
                        fileSuffix:filesImg[0].suffix,
                        fileType:1
                    }
                    createData['attachments'] = attachments;
                }
                personController.addPerson(createData, filesImg)
                    .then(function(result) {
                        if(result && result.length >0){
                            $("#globalnotice").pshow({
                                text: result,
                                state: "failure"
                            });
                        }else{
                            $("#globalnotice").pshow({ text: "保存成功", state: "success" });
                            $("#createPersonFloatWindow").phide();
                            var _flag = $(".personShow").hasClass("disabled") || false;
                            setTimeout(function() {
                                personMethods.showPersonList();
                            }, 0);
                            
                        };
                        
                    })
                    .catch(function() {
                        $("#globalnotice").pshow({
                            text: "保存失败，请重试",
                            state: "failure"
                        });
                    });
            } else if (page == "edit") {
                //编辑

                var editData = {
                    user_id: personModel.userId, //账号id-当前登录人的账号id，必须
                    person_id: personModel.personDetalObj.person_id, //人员id,必须
                    project_id: personModel.projectId, //项目id ,必须
                    name: employeeName, //姓名 ,必须
                    id_number: employeeId, //身份证号码 ,必须
                    phone_num: employeePhone, //手机号
                    gender: employeeSex, //性别，male-男、female-女,必须
                    birthday: startTime, //出生年月
                    person_mail: employeeEmail, //邮箱
                    person_type: "2", //人员类型，1-中心部门人员，2-项目人员,必须
                    person_num: employeeNo, //员工编号
                    position_id: employeeChoiceOptionId, //岗位id
                    specialty: employeeSpecialty, //专业编码
                    // head_portrait: "", //系统头像
                    person_user_id: personUserId, //账号id
                    person_user_name: personUserName, //账号名称
                    func_pack_ids: funcPackIds //权限包id数组
                };
                var filesImg = $("#imageInformationId").pval();
                
               
                if (filesImg.length > 0 && filesImg[0].name) {
                    var attachments = {
                        path:filesImg[0].url,
                        fileName:filesImg[0].name,
                        toPro:"head_portrait",
                        fileSuffix:filesImg[0].suffix,
                        fileType:1
                    }
                    editData['attachments'] = attachments;
                }

                
                personController.updatePersonById(editData,filesImg)
                    .then(function(result) {
                        if(result.length >0){
                            $("#globalnotice").pshow({
                                text: result,
                                state:"failure"
                            });
                        }else{
                            $("#globalnotice").pshow({ text: "保存成功", state: "success" });
                            $("#createPersonFloatWindow").phide();
                            setTimeout(function() {
                                personMethods.showPersonList();
                            }, 0);
                        };
                       
                    })
                    .catch(function() {
                        $("#globalnotice").pshow({
                            text: "保存失败，请重试",
                            state: "failure"
                        });
                    });
            }
        } else {
            return;
        }
    },
    batchUpload: function() {//批量上传人员
        
        var val = $("#upload").pval()[0];
        
        var fileData = {
            user_id:personModel.userId,                  //账号id-当前登录人的账号id，必须
            project_id:personModel.projectId, 
            attachments: {
                path: val.url,
                toPro: 'file_key',
                fileName: val.name,
                fileSuffix: val.suffix,
                isNewFile: true,
                fileType: 1,
            }
        };
        personController.uploadPersonFile(fileData)
        .then(function(result){
            if(result && result[0].status == '2'){
                $("#globalnotice").pshow({ text: "上传成功", state: "success" });
                setTimeout(function() {
                    personMethods.showPersonList();
                }, 0);
            }else if(result && result[0].status == '1'){
                $("#globalnotice").pshow({ text: result[0].msgs, state: "failure" });
            }else if(result && result[0].status == '3'){
                $("#globalnotice").pshow({ text: result[0].msgs, state: "failure" });
            }
            $("#upload").precover();
        }).catch(function(){
            $("#globalnotice").pshow({ text: "上传失败，请重试", state: "failure" });
        });
        
    },
    downloadTemplate:function(){//下载模板
        var downloadData = {

        };
        personController.downloadCardInfo();
    },
    viewPersonDetail: function(model) { //查看员工详情
        personModel.personInformationObj.page = "detail";
        var _personId = model.person_id || "";
        var _personObj = {
            user_id: personModel.userId,
            project_id: personModel.projectId,
            person_id: _personId
        };
        personController.queryPersonDetailById(_personObj)
            .then(function(result) {
                personModel.personDetalObj = result;
                $("#createPersonFloatWindow .per-madal-float_titcon >b").attr("title",personModel.personDetalObj.name);
                $("#createPersonFloatWindow").pshow({
                    title: personModel.personDetalObj.name,
                    subtitle: ""
                });
            })
            .catch(function() {
                $("#globalnotice").pshow({
                    text: "获取数据失败，请重试",
                    state: "failure"
                });
            });

        console.log(model);
    },
    editPersonDetail: function() { //编辑员工详情
       
        personModel.personInformationObj.page = "edit";
        var _personId = personModel.personDetalObj.person_id;
        var personDetail;
        var _personObj = {
            user_id: personModel.userId,
            project_id: personModel.projectId,
            person_id: _personId
        };
        personController.queryPersonDetailById(_personObj).then(function(result) {
            personDetail = result;
            setTimeout(function() {
                //查找反选岗位参数
    
                $("#employeeId").pval(personDetail.id_number); //员工识别码
                $("#employeeName").pval(personDetail.name); //员工姓名
                var _sex = personDetail.gender == "male" ? "男" : "女";
                $("#employeeSex").psel(_sex); //选择性别
                var birthdayObj = {
                    year: "",
                    month: "",
                    day: ""
                };
                var str = personDetail.birthday;
                birthdayObj.year = str.substr(0, 4);
                birthdayObj.month = str.substr(5, 2);
                birthdayObj.day = str.substr(8, 2);
                $("#startTime").psel({
                    y: birthdayObj.year,
                    M: birthdayObj.month,
                    d: birthdayObj.day
                });
                $("#employeePhone").pval(personDetail.phone_num); //手机号
                $("#employeeEmail").pval(personDetail.person_mail); //邮箱
                $("#employeeNo").pval(personDetail.person_num); //员工编号
                personModel.accountName = personDetail.person_user_name; //账号
                $("#employeePositionTip").hide();
                //专业数据重置
                var majorArr = JSON.parse(JSON.stringify(personModel.choiceMajorList));
                majorArr = majorArr.map(function(item){
                    item["isShow"] = false;
                    return item;
                });
                personModel.choiceMajorList = JSON.parse(JSON.stringify(majorArr));
                if(personDetail.specialty_name && personDetail.specialty_name.length >0){
                    $("#employeeMajor > .title >span").text(personMethods.arrayObjectTransfString(personDetail.specialty_name,"name","、")); //专业
                    $("#employeeMajor > .title >span").attr("title",personMethods.arrayObjectTransfString(personDetail.specialty_name,"name","、"));
                    //选中相应的数据选项
                    var selectedArr = JSON.parse(JSON.stringify(personDetail.specialty_name));
                    var allDataArr = JSON.parse(JSON.stringify(personModel.choiceMajorList));
                    selectedArr = selectedArr.map(function(item){
                        allDataArr = allDataArr.map(function(info){
                            if(item.code == info.code){
                                info["isShow"] = true;
                            }
                            return info;
                        })
                    });
                    console.log(allDataArr);
                    personModel.choiceMajorList = JSON.parse(JSON.stringify(allDataArr));
                }else{
                    $("#employeeMajor > .title >span").text("请选择");
                    $("#employeeMajor > .title >span").attr("title","");
                };
                if(personDetail.position_id){
                    personModel.saveEmplyeePosition.obj_id = personDetail.position_id;
                    personModel.saveEmplyeePosition.obj_name = personDetail.position_name;
                };
                if(personDetail.position_name){//填入岗位名称
                    $("#employeePositionName").text(personDetail.position_name);
                    $("#employeePositionName").attr("title",personDetail.position_name);
                    $("#employeePositionName").attr("objid",personDetail.position_id);
                };
                personModel.functionPermissionObj = {
                    //功能权限
                    person_user_name: personDetail.person_user_name,
                    func_pack_names:personDetail.func_pack_names,
                    person_user_id:personDetail.person_user_id
                };
                if(personDetail.head_portrait != '' && personDetail.head_portrait != '--'){
                    $("#imageInformationId [pertype='uplodImgBox']").pval([{name: '', url: personDetail.head_portrait}]);
                }
                
                $("#createPersonFloatWindow").pshow({ title: "编辑", subtitle: "" });
            }, 100);
        });

        
    },
    confirmDeletePersonFn:function(){//确认删除
        var personId = personModel.personDetalObj.person_id;
        var _data = {
            user_id: personModel.userId,
            project_id: personModel.projectId,
            person_id: personId
        };
        personController.deleteProjectPersonById(_data)
            .then(function() {
                $("#globalnotice").pshow({text: "删除成功",state: "success"});
                setTimeout(function() {
                    $("#createPersonFloatWindow").phide();
                    $("#confirmDismissionPerson").phide();
                    personMethods.goBackPersonManageList();
                   
                }, 0);
            })
            .catch(function() {
                $("#globalnotice").pshow({
                    text: "删除失败，请重试",
                    state: "failure"
                });
            });
        $("#confirmDeletePerson").phide();
    },
    cancelDeletePersonFn:function(){//取消删除
        $("#confirmDeletePerson").phide();
    },
    confirmDismissionFn:function(){//确认离职
        var personId = personModel.personDetalObj.person_id;
        var _data = {
            user_id: personModel.userId,
            project_id: personModel.projectId,
            person_id: personId
        };
        personController.discardPersonById(_data)
            .then(function() {
                $("#globalnotice").pshow({text: "离职成功",state: "success"});
                $("#confirmDismissionPerson").phide();
                setTimeout(function() {
                    var _flag = $(".personShow").hasClass("disabled") || false;
                    if (_flag) {
                        //人员列表显示
                        console.log("列表");
                        personMethods.showPersonList();
                    } else {
                        //人员缩略图显示
                        console.log("缩略图");
                        personMethods.showPersonPicList();
                    };
                   
                }, 0);
            })
            .catch(function() {
                $("#globalnotice").pshow({
                    text: "离职失败，请重试",
                    state: "failure"
                });
            });
        $("#createPersonFloatWindow").phide();
    },
    cancelDismissionFn:function(){//取消离职
        $("#confirmDismissionPerson").phide();
    },
    confirmReinstatedFn:function(){//确认复职
        var personId = personModel.personDetalObj.person_id;
        var _data = {
            user_id: personModel.userId,
            project_id: personModel.projectId,
            person_id: personId
        };
        personController.regainPersonById(_data)
            .then(function() {
                $("#globalnotice").pshow({ text: "复职成功", state: "success" });
                $("#confirmReinstatedPerson").phide();
                setTimeout(function() {
                    var _flag = $(".personShow").hasClass("disabled") || false;
                    if (_flag) {
                        //人员列表显示
                        console.log("列表");
                        personMethods.showPersonList();
                    } else {
                        //人员缩略图显示
                        console.log("缩略图");
                        personMethods.showPersonPicList();
                    };
                   
                }, 0);
            })
            .catch(function() {
                $("#globalnotice").pshow({
                    text: "复职失败，请重试",
                    state: "failure"
                });
            });
        $("#createPersonFloatWindow").phide();
    },
    cancelReinstatedFn:function(){//取消复职
        $("#confirmReinstatedPerson").phide();
    },
    deletePersonShow:function(personId){//删除员工显示
        personModel.personDetalObj.person_id = personId;
        $("#confirmDeletePerson").pshow({
            title: "确定要删除此员工吗？",
        });
    },
    dismissionPerson: function(personId) {//离职员工
        
        personModel.personDetalObj.person_id = personId;
        $("#confirmDismissionPerson").pshow({
            title: "确定要离职此员工吗？",
            subtitle: '已绑定的账号将停用'
        });
       
    },
    reinstatedPerson: function(personId) { //复职员工
       
        personModel.personDetalObj.person_id = personId;
        $("#confirmReinstatedPerson").pshow({
            title: "确定要复职此员工吗？",
            subtitle: '复职后该员工可使用原账号登录'
        });
        
    },
    createAndEditShow: function(event) {//显示创建和编辑人员侧弹框
        console.log("新建");
        $("#personState").pslideUp();
        personModel.personInformationObj.page = "create";
        $("#employeeId").precover();
        $("#employeeIdTip").hide();
        $("#employeeName").precover();
        $("#employeeSex").precover();
        $("#startTime").precover();
        $("#employeePhone").precover();
        $("#employeeEmail").precover();
        $("#employeeNo").precover();
        $("#employeePosition").precover("请选择");
        $("#employeeMajor .title >span").text("请选择");
        setTimeout(function(){
            $("#employeePositionTip").hide();
        },0);
        personModel.saveEmplyeePosition = {//清空已选岗位

        };
        $("#employeePositionName").text(" ");//重置岗位参数
        $("#employeePositionName").attr("objid","");
        $("#employeePositionName").attr("title","");
        //重置专业参数
        $(".employeeMajorList").hide()//隐藏岗位列表
        var majorArr = JSON.parse(JSON.stringify(personModel.choiceMajorList));
        majorArr = majorArr.map(function(item){
            item["isShow"] = false;
            return item;
        });
        personModel.choiceMajorList = JSON.parse(JSON.stringify(majorArr));
        personModel.accountName = '';
        personModel.functionPermissionObj = {
            person_user_name: '',
            disabled: false
        };
        $("#permissionPackageList").hide();//隐藏权限列表
        $("#imageInformationId").precover();
        $("#createPersonFloatWindow").pshow({ title: "新建", subtitle: "" });
    },
    repeatOtherSelect:function(){//点击性别下拉，收起其他下拉
        $(".employeeMajorList").hide();
        $(".permissionPackageList").hide();
    },
    createAndEditHide: function(event) {//隐藏创建和编辑人员侧弹框
        event.stopPropagation();
        $("#createPersonFloatWindow").phide();
    },
    choiceMajorListShow: function() { //显示专业列表
        $("#personState").pslideUp();
        var flag = $("#employeeMajor > .list").is(":hidden");
        if(flag){
            $("#employeeMajor > .list").show();
        }else{
            $("#employeeMajor > .list").hide();
        };

        
    },
    confirmChoiceMajor: function(item) { //专业列表点击某项选中
        item.isShow = !item.isShow;
        personModel.choiceMajorList = JSON.parse(
            JSON.stringify(personModel.choiceMajorList)
        );
    },
    moreSelectMajorList: function() {//选择专业确定
        
        $("#employeeMajor > .list").hide(); //多选专业列表
        var arr = personModel.choiceMajorList || [];
        var checkedArr = [];
        var checkedIdArr = [];
        var checkedStr = "";
        for (var i = 0; i < arr.length; i++) {
            var json = arr[i];
            if (json.isShow) {
                checkedArr.push(json.name);
                checkedIdArr.push(json.code);
            }
        }
        if (checkedArr && checkedArr.length > 1) {
            checkedStr = checkedArr.join("、");
        }else{
            checkedStr = checkedArr[0];
        }
        personModel.majorChoiceObj = {
            name: checkedStr,
            idArr: checkedIdArr,
            disabled: true
        };
        if(personModel.majorChoiceObj.name){
            $("#employeeMajor > .title >span").text(personModel.majorChoiceObj.name);
            $("#employeeMajor > .title >span").attr("title",personModel.majorChoiceObj.name);
        }else{
            $("#employeeMajor > .title >span").text("请选择");
            $("#employeeMajor > .title >span").attr("title","");
        }
        
    },
    moreUnSelectPermissionList: function() {//选择专业取消
        
        $("#employeeMajor > .list").hide(); //多选专业列表
        $("#employeeMajor > .title >span").text("请选择");
        personModel.majorChoiceObj = {};
        var arr = personModel.choiceMajorList || [];
        arr.forEach(function(item) {
            item.isShow = false;
        });
        personModel.choiceMajorList = JSON.parse(JSON.stringify(arr));
    },
    confirmChoicePosition: function(obj) {//确认选中岗位
        
        personModel.confirmChoicePositionObj = obj;
        $("#employeePositionTip").hide();
        console.log(obj);
    },
    positionTreeWindowShow:function(){//显示岗位树
        var treeData = JSON.parse(JSON.stringify(personModel.employeePositionObj));
        treeData = repeat(treeData);
        function repeat(arr){
            for(var i=0;i<arr.length;i++){
                var jsonArr = arr[i];
                jsonArr["checked"] = false;
                if(jsonArr.child_objs && jsonArr.child_objs.length>0){
                    repeat(jsonArr.child_objs);
                }
            }
            return arr;
        }
        personModel.employeePositionObj = JSON.parse(JSON.stringify(treeData));
        var obj_id = $("#employeePositionName").attr("objId");
        if(obj_id){
            var _tree = JSON.parse(JSON.stringify(personModel.employeePositionObj));
            var resTree = addSelect(_tree,obj_id);
            personModel.employeePositionObj = JSON.parse(JSON.stringify(resTree));
            function addSelect(arr,_id){
                for(var i=0;i<arr.length;i++){
                    var jsonArr = arr[i];
                    if(jsonArr.obj_id == _id){
                        jsonArr["checked"] = true;
                        break;
                    }else{
                        if(jsonArr.child_objs && jsonArr.child_objs){
                            addSelect(jsonArr.child_objs,_id);
                        }
                    }
                }
                return arr;
            };
            $("#confirmSelectOptionBtn").pdisable(false);//确定选中岗位按钮是否禁用
        }else{
            $("#confirmSelectOptionBtn").pdisable(true);
        }
       
        $("#positionWindow").pshow({ title: '选择岗位' });
    },
    selectPositionTree:function(item){//新建人员选择岗位树
        console.log(item);
        $("#confirmSelectOptionBtn").pdisable(false);
        if(item.issel){
            personModel.saveEmplyeePosition.obj_name = item.obj_name;
            personModel.saveEmplyeePosition.obj_id = item.obj_id;

             //添加选中项
        //取出当前树结构
        var _tree = JSON.parse(JSON.stringify(personModel.employeePositionObj));
        //将数据源重置

        var repeatTree = repeat(_tree);
        var newTree = fn(repeatTree,item.id);
        personModel.employeePositionObj = JSON.parse(JSON.stringify(newTree));
        console.log(newTree);
            function repeat(arr){
                for(var i=0;i<arr.length;i++){
                    var jsonArr = arr[i];
                    jsonArr["checked"] = false;
                    if(jsonArr.child_objs && jsonArr.child_objs.length>0){
                        repeat(jsonArr.child_objs);
                    }
                }
                return arr;
            }
            function fn(arr,_id){
                for(var i=0;i<arr.length;i++){
                    var jsonArr = arr[i];
                    if(jsonArr.id == _id){
                        jsonArr["checked"] = true;
                        addClass(jsonArr.child_objs);
                    }
                    if(jsonArr.child_objs && jsonArr.child_objs){
                        fn(jsonArr.child_objs,_id)
                    }
                }
                return arr;
            };
            function addClass(arr){
                if(arr && arr.length >0){
                    for(var i=0;i<arr.length;i++){
                        var jsonArr = arr[i];
                        jsonArr["checked"] = true;
                        if(jsonArr.child_objs && jsonArr.child_objs){
                            addClass(jsonArr.child_objs);
                        }
                    }
                }
                return arr;
            };
        }
    },
    confirmSelectOptionFn:function(){//确认选中岗位
        if(personModel.saveEmplyeePosition.obj_name){
            $("#employeePositionTip").hide();
            $("#employeePositionName").text(personModel.saveEmplyeePosition.obj_name);
            $("#employeePositionName").attr("title",personModel.saveEmplyeePosition.obj_name);
            $("#employeePositionName").attr("objId",personModel.saveEmplyeePosition.obj_id);
        };
        $("#positionWindow").phide();
    },
    cancelSelectOptionFn:function(){//取消选中岗位
        // $("#employeePositionName").text(" ");
        personModel.saveEmplyeePosition.obj_name = '';
        personModel.saveEmplyeePosition.obj_id = '';
        $("#positionWindow").phide();
    },
    editOrganizationList: function() {//编辑组织结构列表
        $("#createPersonFloatWindow").phide();
        personModel.curPage = "editOrganization";
        var _data = {
            user_id: personModel.userId,
            dept_type: "d3",
            project_id: personModel.projectId
        };
        personController.queryDeptPositionTreeByType(_data).then(function(list) {
            if (list && list.length > 0) {
                var tree = personMethods.organizationTreeInit(
                    list,
                    "",
                    "请在此填写部门名称",
                    1
                );
                personModel.personCustomTree = JSON.parse(JSON.stringify(tree));
            } else {
                var tree = [{
                    // obj_id: "",
                    obj_name: "",
                    obj_type: "d3",
                    child_objs: []
                }];
                personModel.personCustomTree = personMethods.organizationTreeInit(
                    tree,
                    "",
                    "请在此填写部门名称",
                    1
                );
            }
        });
    },

    // 列表相关数据请求
    getPersonListData: function(_data) {
        //获取人员列表请求
       
        personController.queryPersonList(_data)
            .then(function(list) {
                if(list && list.length >0){
                    $("#personInfoListGrid").pcount(1);
                    personModel.personInfoGrid = list;
                }else{
                    $("#personInfoListGrid").pcount(0);
                    $("#personInfoListGrid").find(".per-prompt_subtitle").text("");
                }
               
            })
            .catch(function() {
                $("#globalnotice").pshow({
                    text: "获取数据失败，请重试",
                    state: "failure"
                });
            });
    },
    getPersonWithGroup: function(_data) {
        //获取人员缩略图列表
        personModel.personGroup = [];
        personController.queryPersonWithGroup(_data)
            .then(function(list) {
                personModel.personGroup = JSON.parse(JSON.stringify(list));
            })
            .catch(function() {
                $("#globalnotice").pshow({
                    text: "获取数据失败，请重试",
                    state: "failure"
                });
            });
    },

    //登录信息相关
    searchPersonByName: function() {
        //输入人员姓名查询
        var _name = $("#personNameSearch >div").pval().key || "";
        var _data = {
            user_id: personModel.userId,
            project_id: personModel.projectId,
            name: _name,
            page: 1,
            page_size: "",
            order_field: "login_time",
            order_by: "desc"
        };
        personController.queryPersonLoginInfo(_data)
            .then(function(list) {
                personModel.loginInfoGrid = list;
            })
            .catch(function() {
                $("#globalnotice").pshow({
                    text: "获取登录信息失败，请重试",
                    state: "failure"
                });
            });
    },
    loginInfoSort: function(model) {
        //登录信息列表排序
        console.log(model.pEventAttr)
        var _index = model.pEventAttr.columnIndex || 0;
        var _sortType = model.pEventAttr.sortType || "desc";
        var _name = $("#personNameSearch >div").pval().key || "";
        var _data = {
            user_id: personModel.userId,
            project_id: personModel.projectId,
            dept_type: "d3",
            name: _name,
            page: 1,
            page_size: ""
        };
        if (_index === 1 && _sortType === "desc") {
            _data.order_field = "login_time";
            _data.order_by = "desc";
        } else if (_index === 1 && _sortType === "asc") {
            _data.order_field = "login_time";
            _data.order_by = "asc";
        } else if (_index === 4 && _sortType === "desc") {
            _data.order_field = "distance";
            _data.order_by = "desc";
        } else if (_index === 4 && _sortType === "asc") {
            _data.order_field = "distance";
            _data.order_by = "asc";
        }
        personController.queryPersonLoginInfo(_data)
            .then(function(list) {
                personModel.loginInfoGrid = list;
            })
            .catch(function() {
                $("#globalnotice").pshow({
                    text: "获取登录信息失败，请重试",
                    state: "failure"
                });
            });
    },

    //编辑自定义部门相关
    changeCommonDepatState: function() {
        //切换项目通用部门列表显示隐藏
        var _hidden = $(".openCommonBtn").is(":hidden");
        console.log(1);
        if (_hidden) {
            $("#projectCommonUl >section").hide();
            $(".openCommonBtn").show();
            $(".closeCommonBtn").hide();
            personModel.listByProjectCommon = [];
        } else {
            $("#projectCommonUl >section").show();
            $(".openCommonBtn").hide();
            $(".closeCommonBtn").show();

            //获取项目通用树数据
            var _data = {
                user_id: personModel.userId,
                dept_type: "d2", //部门类型，d1-中心部门、d2-项目通用部门、d3-自定义部门 ,必须
                project_id: personModel.projectId
            };
            personController.queryDeptPositionTreeByType(_data).then(function(list) {
                var tree = personMethods.organizationTreeInit(list, "", "", 1);
                personModel.listByProjectCommon = JSON.parse(JSON.stringify(tree));
            });
        }
    },
    changeCenterDepatState: function() {
        //切换中心部门树显示隐藏
        var _hidden = $(".openCenterBtn").is(":hidden");
        console.log(1);
        if (_hidden) {
            $("#centerDepartmentUl >section").hide();
            $(".openCenterBtn").show();
            $(".closeCenterBtn").hide();
            personModel.listByCenterDepartment = [];
        } else {
            $("#centerDepartmentUl >section").show();
            $(".openCenterBtn").hide();
            $(".closeCenterBtn").show();
            //获取中心部门树数据
            // TO DELETE

            // var list = [{
            //     obj_id:'1',
            //     obj_name:'aaa',
            //     obj_type:'d1',
            //     child_objs:[{
            //         obj_id:'2',
            //         obj_name:'bbb',
            //         obj_type:'d1',
            //     }]
            // }];
            // var tree = personMethods.organizationTreeInit(list,'','',1);
            // personModel.listByCenterDepartment = JSON.parse(JSON.stringify(tree));
            // TO DELETE
            var _data = {
                user_id: personModel.userId,
                dept_type: "d1", //部门类型，d1-中心部门、d2-项目通用部门、d3-自定义部门 ,必须
                project_id: personModel.projectId
            };
            personController.queryDeptPositionTreeByType(_data).then(function(list) {
                var tree = personMethods.organizationTreeInit(list, "", "", 1);
                personModel.listByCenterDepartment = JSON.parse(JSON.stringify(tree));
            });
        }
    },
    resetOperatBtn: function() {
        //重置操作选项
        personModel.choiceOptionId = ""; //失去焦点取消绑定当前节点并禁用操作按钮
        $("#addSiblingDepart").addClass("disabled");
        $("#addSonDepart").addClass("disabled");
        $("#addSiblingPosition").addClass("disabled");
        $("#addSonPosition").addClass("disabled");
        $("#deletePartition").addClass("disabled");
    },
    blur: function(data, e) {
        //失去焦点
        // console.log($($(e.target)));
        $($(e.target)[0]).removeClass("borderBlue");

        // $($(e.target)[0]).addClass("warningRed");
    },
    handle: function(data, e) {
        //选中当前项
        var _this = data;
        setTimeout(function() {
            $($(e.target))[0].focus();
            $($(e.target)[0]).addClass("borderBlue");
            $($(e.target)[0]).removeClass("warningRed");
        });
        personModel.choiceOptionId = data.id; //当前选中id
        //点击取出自身节点
        var currentNode = personMethods.searchParentId(
            personModel.personCustomTree,
            data.id, []
        );
        //通过自身节点的parentId取到父节点
        if (!currentNode[0].parentId) {
            //不存在父节点    第一级 只有添加下级分区启用
            console.log("不存在父节点");
            if (currentNode[0].obj_type == "d3") {
                $("#addSiblingDepart").removeClass("disabled");
                $("#addSonDepart").removeClass("disabled");
                $("#addSiblingPosition").addClass("disabled");
                $("#addSonPosition").removeClass("disabled");
            }
            if (currentNode[0].obj_type == "p3") {
                $("#addSiblingDepart").removeClass("disabled");
                $("#addSonDepart").addClass("disabled");
                $("#addSiblingPosition").removeClass("disabled");
                $("#addSonPosition").addClass("disabled");
            }

            //判断是否可以删除
            var _jsonArr = personModel.personCustomTree;
            if(_jsonArr.length <= 1){
                $("#deletePartition").addClass("disabled");
            } else{
                $("#deletePartition").removeClass("disabled");
            }  
        }

        if (currentNode[0].parentId && currentNode[0].obj_type == "d3") {
            //非一级节点并且为自定义部门

            console.log("存在父节点");
            $("#addSiblingDepart").removeClass("disabled");
            $("#addSonDepart").removeClass("disabled");
            $("#addSiblingPosition").removeClass("disabled");
            $("#addSonPosition").removeClass("disabled");
            $("#deletePartition").removeClass("disabled");
        }

        if (currentNode[0].parentId && currentNode[0].obj_type == "p3") {
            $("#addSiblingDepart").removeClass("disabled");
            $("#addSonDepart").addClass("disabled");
            $("#addSiblingPosition").removeClass("disabled");
            $("#addSonPosition").addClass("disabled");
            $("#deletePartition").removeClass("disabled");
        }
    },
    addSiblingDepart: function() {
        //添加同级部门
        console.log("添加同级部门");
        var _flag = $("#addSiblingDepart").hasClass("disabled");
        if (_flag) {
            return;
        }
        var _id = personModel.choiceOptionId;
        var arr = personModel.personCustomTree;
        var currentNode = personMethods.searchParentId(
            personModel.personCustomTree,
            _id, []
        );
        var _parentId = currentNode[0].parentId;

        if (!_parentId) {
            //不存父节点为一级节点
            var _child = new personMethods.createSon(
                "",
                "d3",
                1,
                "",
                "请在此填写部门名称"
            );
            personModel.personCustomTree.push(_child);
        } else {
            //父节点存在
            var parentNode = personMethods.searchParentId(
                personModel.personCustomTree,
                _parentId, []
            );
            fn(arr, _parentId);

            function fn(json, nodeId) {
                for (var i = 0; i < json.length; i++) {
                    var obj = json[i];
                    //没有就下一个
                    if (!obj || !obj.id) {
                        continue;
                    }
                    //2.有节点就开始找，一直递归下去
                    if (obj.id == nodeId) {
                        //找到了与nodeId匹配的节点，结束递归
                        var _lv = obj.lv + 1;
                        console.log(_lv);
                        var _child = new personMethods.createSon(
                            "",
                            "d3",
                            _lv,
                            obj.id,
                            "请在此填写部门名称"
                        );
                        obj.child_objs.push(_child);

                        break;
                    } else {
                        //3.如果有子节点就开始找
                        if (obj.child_objs) {
                            fn(obj.child_objs, nodeId);
                        } else {
                            //跳出当前递归，返回上层递归
                            continue;
                        }
                    }
                }
            }
        }
        personModel.personCustomTree = JSON.parse(
            JSON.stringify(personModel.personCustomTree)
        );
    },
    addSonDepart: function() {
        //添加下级部门
        console.log("添加下级部门");
        var _flag = $("#addSonDepart").hasClass("disabled");
        if (_flag) {
            return;
        }
        var _id = personModel.choiceOptionId;
        var arr = personModel.personCustomTree;

        fn(arr, _id);

        function fn(json, nodeId) {
            for (var i = 0; i < json.length; i++) {
                var obj = json[i];
                //没有就下一个
                if (!obj || !obj.id) {
                    continue;
                }
                //2.有节点就开始找，一直递归下去
                if (obj.id == nodeId) {
                    //找到了与nodeId匹配的节点，结束递归
                    var _lv = obj.lv + 1;
                    console.log(_lv);
                    var _child = new personMethods.createSon(
                        "",
                        "d3",
                        _lv,
                        obj.id,
                        "请在此填写部门名称"
                    );
                    obj.child_objs.push(_child);
                    break;
                } else {
                    //3.如果有子节点就开始找
                    if (obj.child_objs) {
                        fn(obj.child_objs, nodeId);
                    } else {
                        //跳出当前递归，返回上层递归
                        continue;
                    }
                }
            }
        }
        personModel.personCustomTree = JSON.parse(
            JSON.stringify(personModel.personCustomTree)
        );
    },
    addSiblingPosition: function() {
        //添加同级岗位
        console.log("添加同级岗位");
        var _flag = $("#addSiblingPosition").hasClass("disabled");
        if (_flag) {
            return;
        }
        var _id = personModel.choiceOptionId;
        var arr = personModel.personCustomTree;
        var currentNode = personMethods.searchParentId(
            personModel.personCustomTree,
            _id, []
        );
        var _parentId = currentNode[0].parentId;

        if (!_parentId) {
            //不存父节点为一级节点
            var _child = new personMethods.createSon(
                "",
                "p3",
                1,
                "",
                "请在此填写岗位名称"
            );
            personModel.personCustomTree.push(_child);
        } else {
            //父节点存在
            var parentNode = personMethods.searchParentId(
                personModel.personCustomTree,
                _parentId, []
            );
            fn(arr, _parentId);

            function fn(json, nodeId) {
                for (var i = 0; i < json.length; i++) {
                    var obj = json[i];
                    //没有就下一个
                    if (!obj || !obj.id) {
                        continue;
                    }
                    //2.有节点就开始找，一直递归下去
                    if (obj.id == nodeId) {
                        //找到了与nodeId匹配的节点，结束递归
                        var _lv = obj.lv + 1;
                        console.log(_lv);
                        var _child = new personMethods.createSon(
                            "",
                            "p3",
                            _lv,
                            obj.id,
                            "请在此填写岗位名称"
                        );
                        obj.child_objs.push(_child);

                        break;
                    } else {
                        //3.如果有子节点就开始找
                        if (obj.child_objs) {
                            fn(obj.child_objs, nodeId);
                        } else {
                            //跳出当前递归，返回上层递归
                            continue;
                        }
                    }
                }
            }
        }
        personModel.personCustomTree = JSON.parse(
            JSON.stringify(personModel.personCustomTree)
        );
    },
    addSonPosition: function() {
        //添加下级岗位

        console.log("添加下级岗位");
        var _flag = $("#addSonPosition").hasClass("disabled");
        if (_flag) {
            return;
        }
        var _id = personModel.choiceOptionId;
        var arr = personModel.personCustomTree;

        fn(arr, _id);

        function fn(json, nodeId) {
            for (var i = 0; i < json.length; i++) {
                var obj = json[i];
                //没有就下一个
                if (!obj || !obj.id) {
                    continue;
                }
                //2.有节点就开始找，一直递归下去
                if (obj.id == nodeId) {
                    //找到了与nodeId匹配的节点，结束递归
                    var _lv = obj.lv + 1;
                    console.log(_lv);
                    var _child = new personMethods.createSon(
                        "",
                        "p3",
                        _lv,
                        obj.id,
                        "请在此填写岗位名称"
                    );
                    obj.child_objs.push(_child);
                    break;
                } else {
                    //3.如果有子节点就开始找
                    if (obj.child_objs) {
                        fn(obj.child_objs, nodeId);
                    } else {
                        //跳出当前递归，返回上层递归
                        continue;
                    }
                }
            }
        }

        personModel.personCustomTree = JSON.parse(
            JSON.stringify(personModel.personCustomTree)
        );
    },
    deletePartition: function() {
        //删除
        var _flag = $("#deletePartition").hasClass("disabled");
        if (_flag) {
            return;
        }
        console.log("删除");
        $("#confirmDeleteModal").pshow({
            title: "您确定要删除该岗位/部门吗？",
            subtitle: '被删除岗位/部门下的人将移动至"其他"可以在编辑人员信息中单独设置其岗位'
        });
    },
    confirmDeleteFn: function() {
        //确认删除
        var arr = personModel.personCustomTree,
            _id = personModel.choiceOptionId;
        var currentNode = personMethods.searchParentId(
            personModel.personCustomTree,
            _id, []
        );
        _parentId = currentNode[0].parentId;

        if (!_parentId) {
            //删除根节点判断
            var jsonArr = JSON.parse(JSON.stringify(arr));
            if(arr.length >1){
                arr.forEach(function(item,index){
                    if(item.id == _id){
                        jsonArr.splice(index,1);
                    }
                });
                personModel.personCustomTree = JSON.parse(JSON.stringify(jsonArr));
            }
            setTimeout(function() {
                $("#confirmDeleteModal").hide();
                personMethods.resetOperatBtn();
            }, 0);
            return;
        }
        

        var parentNode = personMethods.searchParentId(
            personModel.personCustomTree,
            _parentId, []
        );
        var _arr = parentNode[0].child_objs;
        var _newArr = JSON.parse(JSON.stringify(_arr));
        _arr.forEach(function(item, index) {
            if (item.id == _id) {
                _newArr.splice(index, 1);
            }
        });
        fn(arr, _parentId);

        function fn(json, nodeId) {
            for (var i = 0; i < json.length; i++) {
                var obj = json[i];
                //没有就下一个
                if (!obj || !obj.id) {
                    continue;
                }
                //2.有节点就开始找，一直递归下去
                if (obj.id == nodeId) {
                    //找到了与nodeId匹配的节点，结束递归

                    obj.child_objs = _newArr;
                    break;
                } else {
                    //3.如果有子节点就开始找
                    if (obj.child_objs) {
                        fn(obj.child_objs, nodeId);
                    } else {
                        //跳出当前递归，返回上层递归
                        continue;
                    }
                }
            }
        }

        setTimeout(function() {
            $("#confirmDeleteModal").hide();
            personMethods.resetOperatBtn();
        }, 0);
    },
    cancelDeleteFn: function() {
        //取消删除
        personMethods.resetOperatBtn();
        $("#confirmDeleteModal").phide();
    },
    updateCustomDeptInfo: function() {
        //更新自定义部门保存
        //1复制当前树形结构
        var nullValueId = "";
        var tree = JSON.parse(JSON.stringify(personModel.personCustomTree));
        //重置所有标记属性
        var tree = markReset(tree);

        function markReset(data) {
            for (var i = 0; i < data.length; i++) {
                var json = data[i];
                if (!json.id) {
                    break;
                }
                json.markNull = false;
                json.markRepeat = false;
                if (json.child_objs && json.child_objs.length) {
                    markReset(json.child_objs);
                }
            }
            return data;
        }
        //2判断节点中名称是否有空值
        checkedNullValue(tree, "");

        function checkedNullValue(data, name) {
            //通过名称找到当前id
            for (var i = 0; i < data.length; i++) {
                var json = data[i];
                if (json.obj_name == name) {
                    nullValueId = json.id;
                    break;
                }
                if (json.child_objs && json.child_objs.length) {
                    checkedNullValue(json.child_objs, name);
                }
            }
        }
        //3.标记空值提示
        if (nullValueId) {
            //根据存在空值的id标记当前节点
            var treeData = addMarkById(tree, nullValueId); //标记后的数值
            function addMarkById(data, id) {
                for (var i = 0; i < data.length; i++) {
                    var json = data[i];
                    if (json.id == id) {
                        json.markNull = true; //空值提示
                        // json.markRepeat = true;
                        break;
                    }
                    if (json.child_objs && json.child_objs.length) {
                        addMarkById(json.child_objs, id);
                    }
                }
                return data;
            }

            personModel.personCustomTree = JSON.parse(JSON.stringify(treeData));
            console.log("名称不能为空");
            return;
        }
        console.log(nullValueId);
        //4.没有空值，新建数组用于存放所有树形节点名称
        var allNodeName = [];
        saveAllName(tree);

        function saveAllName(data) {
            for (var i = 0; i < data.length; i++) {
                var json = data[i];
                if (!json.id) {
                    break;
                }
                if (json.obj_name) {
                    allNodeName.push(json.obj_name);
                }
                if (json.child_objs && json.child_objs.length) {
                    saveAllName(json.child_objs);
                }
            }
        }
        //5.存放名称数组中是否有重复name
        var repeatNameArr = [];

        //6.如果有重复名称   提交保存到新的数组中
        if (allNodeName && allNodeName.length > 0) {
            var result = [];
            for (var i = 0; i < allNodeName.length; i++) {
                if (result.indexOf(allNodeName[i]) == -1) {
                    result.push(allNodeName[i]);
                } else {
                    repeatNameArr.push(allNodeName[i]);
                }
            }
        }
        //7.循环重复名称数组,新建名称重复的数组，通过name找到对应的id并添加到数组
        var repeatIdArr = [];
        if (repeatNameArr && repeatNameArr.length > 0) {
            for (var i = 0; i < repeatNameArr.length; i++) {
                checkedRepeatId(tree, repeatNameArr[i]);
            }

            function checkedRepeatId(data, name) {
                //通过名称找到当前id
                for (var i = 0; i < data.length; i++) {
                    var json = data[i];
                    if (json.obj_name == name) {
                        repeatIdArr.push(json.id);
                    }
                    if (json.child_objs && json.child_objs.length) {
                        checkedRepeatId(json.child_objs, name);
                    }
                }
            }
        }
        //8.通过重复名称递归树增加标记提示名称重复
        if (repeatIdArr && repeatIdArr.length) {
            for (var i = 0; i < repeatIdArr.length; i++) {
                checkedRepeatId(tree, repeatIdArr[i]);
            }

            function checkedRepeatId(data, id) {
                //通过名称找到当前id
                for (var i = 0; i < data.length; i++) {
                    var json = data[i];
                    if (json.id == id) {
                        json.markRepeat = true;
                    }
                    if (json.child_objs && json.child_objs.length) {
                        checkedRepeatId(json.child_objs, id);
                    }
                }
            }
            var newTree = JSON.parse(JSON.stringify(tree));
            personModel.personCustomTree = JSON.parse(JSON.stringify(newTree));
            console.log("名称不能重复");
            return;
        }

        personModel.personCustomTree = JSON.parse(JSON.stringify(tree));
        //向后台提交更新后的数据
        console.log(personModel.personCustomTree);
        var _publishData = {
            user_id: personModel.userId,
            dept_type: "d3",
            deptPositions: tree
        }; //不能成功提交需删除无效数据
        personController.saveDeptPosition(_publishData)
            .then(function() {
                setTimeout(function(){
                    $("#navBar").psel(0, false); //选中当前选项，false掉默认事件加载
                },0)
               
                personMethods.goBackPersonManageList();
            })
            .catch(function() {
                $("#globalnotice").pshow({
                    text: "更新失败，请重试",
                    state: "failure"
                });
            });
    }
};

var personMounted = function() {
    $("#navBar").psel(0, false); //选中当前选项，false掉默认事件加载
    //人员管理列表初始化
    // $("#upload").find("em").text("批量上传");
    personMethods.goBackPersonManageList();
    var data = {
        user_id: personModel.userId,
        project_id: personModel.projectId,
        dict_type: "domain_require"
    };
    //获取岗位列表
    var positionData = {
        user_id: personModel.userId, //账号id-当前登录人的账号id，必须
        project_id: personModel.projectId
    };
    personController.queryDeptPositionTree(positionData).then(function(list) {
        var initList = personMethods.organizationTreeInit(list,'','',1);
        var tree = fn(initList);

        function fn(arr) {
            for (var i = 0; i < arr.length; i++) {
                var json = arr[i];
                if(json.obj_type == 'p1' || json.obj_type == 'p2' || json.obj_type == 'p3'){
                    json["issel"] = true;
                }
                
                if (json.child_objs && json.child_objs.length > 0) {
                    fn(json.child_objs);
                }
            }
            return arr;
        }

        personModel.employeePositionObj = JSON.parse(JSON.stringify(tree));
    });

    //获取专业列表
    personController.queryGeneralDictByKey(data).then(function(list) {
        list.forEach(function(item) {
            item["isShow"] = false;
        });
        personModel.choiceMajorList = JSON.parse(JSON.stringify(list));
    });
};

var personManageLogger = {
    init: function() {
        new Vue({
            el: "#personManage",
            data: personModel,
            methods: personMethods,
            mounted: personMounted
        });
    }
};