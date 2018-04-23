/*事件注册*/
$(function () {
    organizationLogger.init();
    $("#birthDate").psel({y:2017,M:1,d:1});
    //矫正树的底部边框样式
    windowEvent.borderInit();
    
    //快速添加人员-项目list的input点击事件
    // $("#projectList input").on('click',function(){
    //     //分三种状态：1.disabled 不可用；2.selected 已选中 3.初始化状态
    //     if($(this).hasClass('disabled')){
    //         return false;
    //     }
    //     var arr = organizationModel.listByProject;
    //     var id = $(this).attr('id');
    //     if($(this).hasClass('selected')){
    //         (function find(arr,id){
    //             var find = arguments.callee;
    //             for(var i=0;i<arr.length;i++){     
    //                 if(arr[i].id == id){
    //                     arr[i].selected = false;
    //                     if (arr[i].child_objs && arr[i].child_objs.length) {
    //                         (function find_(arr){
    //                             var find = arguments.callee;
    //                             for(var i=0;i<arr.length;i++){     
    //                                 arr[i].disabled = false;         
    //                                 if (arr[i].child_objs && arr[i].child_objs.length) {
    //                                     find(arr[i].child_objs);
    //                                 } 
    //                             }
    //                         })(arr[i].child_objs)
    //                     }   
    //                     break;
    //                 }      
    //                 if (arr[i].child_objs && arr[i].child_objs.length) {
    //                     find(arr[i].child_objs,id);
    //                 } 
    //             }
    //         })(arr,id)
    //     }else{
    //         (function find(arr,id){
    //             var find = arguments.callee;
    //             for(var i=0;i<arr.length;i++){     
    //                 if(arr[i].id == id){
    //                     arr[i].selected = true;
    //                     if (arr[i].child_objs && arr[i].child_objs.length) {
    //                         (function find_(arr){
    //                             var find = arguments.callee;
    //                             for(var i=0;i<arr.length;i++){     
    //                                 arr[i].disabled = true;  
    //                                 arr[i].selected = false;                                                    
    //                                 if (arr[i].child_objs && arr[i].child_objs.length) {
    //                                     find(arr[i].child_objs);
    //                                 } 
    //                             }
    //                         })(arr[i].child_objs)
    //                     }    
    //                     break;
    //                 }      
    //                 if (arr[i].child_objs && arr[i].child_objs.length) {
    //                     find(arr[i].child_objs,id);
    //                 } 
    //             }
    //         })(arr,id);
    //     }
    //     var headerString = '';
    //     (function find_(arr){
    //         var find = arguments.callee;
    //         for(var i=0;i<arr.length;i++){     
    //             if(arr[i].selected){
    //                 headerString += (headerString.length === 0 ? '' : ',') + arr[i].obj_name;
    //             }        
    //             if (arr[i].child_objs && arr[i].child_objs.length) {
    //                 find(arr[i].child_objs);
    //             } 
    //         }
    //     })(arr)
    //     $("#selectedProject .per-combobox_name").html((headerString === '' ? '请选择项目' : headerString));
    // });
});

//工具
var tools = {
    //去除两端空格
    trim: function(x) {
        return x.replace(/^\s+|\s+$/gm,'');
    }
}

//全局事件
var windowEvent = {
    remove: function(opId,listName,type){
        organizationMethods.operation(opId,organizationModel[listName],type)
    },
    showPwindow3: function(){
        
        if(organizationModel.operationState[4].usable){
            clearTimeout(organizationModel.timer);
         
            $("#pwindow3").pshow();
        }    
    },
    hidePwindow3: function(){
        $("#pwindow3").phide();
        organizationMethods.operationStateInit();
    },
    showPwindow2: function(){
        if(organizationModel.operationState[4].usable){
            clearTimeout(organizationModel.timer);
            $("#pwindow2").pshow();
        }    
    },
    hidePwindow2: function(){
        $("#pwindow2").phide();
        organizationMethods.operationStateInit();
    },
    //树的节点的事件绑定
    windowInit: function(){
        $('#projectCommon, #centerDepart').off('click','.organizationTreeBoxName').off('blur','.organizationTreeBoxName>input');
        $('#projectCommon, #centerDepart').on('click','.organizationTreeBoxName' ,function () {
            clearTimeout(organizationModel.timer);
            $('#projectCommon .organizationTreeBoxName input,#centerDepart .organizationTreeBoxName input').css('borderColor', 'transparent');
            $('#centerDepart .organizationTreeBoxName:last,#projectCommon .organizationTreeBoxName:last').css('borderBottom', 'none');
            $(this).find('input').css('border', '1px solid #0ff');
            var obj=JSON.parse($(this).find('input').attr('dis'));
            if(obj.obj_name === '中心部门' ){
                organizationModel.operationState[0].usable = false;
                organizationModel.operationState[1].usable = false;
                organizationModel.operationState[2].usable = false;
                organizationModel.operationState[3].usable = true;
                organizationModel.operationState[4].usable = false;
            }else if(!obj.child_objs){
                if(organizationModel.curPage === 'centerDepartMent'){
                    organizationModel.operationState[0].usable = false;
                    organizationModel.operationState[1].usable = false;
                    organizationModel.operationState[2].usable = true;
                    organizationModel.operationState[3].usable = false;
                    organizationModel.operationState[4].usable = true;
                }else{
                    organizationModel.operationState[0].usable = true;
                    organizationModel.operationState[1].usable = false;
                    organizationModel.operationState[2].usable = true;
                    organizationModel.operationState[3].usable = false;
                    organizationModel.operationState[4].usable = true;
                }

            }else{
                organizationModel.operationState[0].usable = true;
                organizationModel.operationState[1].usable = true;
                organizationModel.operationState[2].usable = true;
                organizationModel.operationState[3].usable = true;
                organizationModel.operationState[4].usable = true;
            }
            setTimeout(() => {
                if(obj.obj_name !== '中心部门'){
                    $(this).find('input').removeAttr('readonly').focus();
                }
            }, 200)
        })
    
        //改变树的元素的状态为未选择
        $('#projectCommon , #centerDepart').on('blur', '.organizationTreeBoxName>input',function () {   
            if(tools.trim($(this).val()) === ""){
                console.log("123")
                $(this).parent().find(".inputPrompt").show().addClass("inputPromptShow");
            }else{
                $(this).parent().find(".inputPrompt").hide().removeClass("inputPromptShow");
            }
            $('#projectCommon .organizationTreeBoxName input,#centerDepart .organizationTreeBoxName input').css('borderColor', 'transparent');
            $('#centerDepart .organizationTreeBoxName:last,#projectCommon .organizationTreeBoxName:last').css('borderBottom', 'none');
            organizationModel.timer=setTimeout(function () {
                organizationMethods.operationStateInit();
                organizationModel.activeDataObj = {};
            }, 200)
        })
    },
    //插件—多选树事件
    multiselectPluginEvent: function(targetElementId,model,headerId,placeHolder){
        $("#"+targetElementId+" input").on('click',function(){
            //分三种状态：1.disabled 不可用；2.selected 已选中 3.初始化状态
            if($(this).hasClass('disabled')){
                return false;
            }
            var arr = organizationModel[model];
            var id = $(this).attr('id');
            if($(this).hasClass('selected')){
                (function find(arr,id){
                    var find = arguments.callee;
                    for(var i=0;i<arr.length;i++){     
                        if(arr[i].id == id){
                            arr[i].selected = false;
                            if (arr[i].child_objs && arr[i].child_objs.length) {
                                (function find_(arr){
                                    var find = arguments.callee;
                                    for(var i=0;i<arr.length;i++){     
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
                            find(arr[i].child_objs,id);
                        } 
                    }
                })(arr,id)
            }else{
                (function find(arr,id){
                    var find = arguments.callee;
                    for(var i=0;i<arr.length;i++){     
                        if(arr[i].id == id){
                            arr[i].selected = true;
                            if (arr[i].child_objs && arr[i].child_objs.length) {
                                (function find_(arr){
                                    var find = arguments.callee;
                                    for(var i=0;i<arr.length;i++){     
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
                            find(arr[i].child_objs,id);
                        } 
                    }
                })(arr,id);
            }
            var headerString = '';
            (function find_(arr){
                var find = arguments.callee;
                for(var i=0;i<arr.length;i++){     
                    if(arr[i].selected){
                        headerString += (headerString.length === 0 ? '' : ',') + arr[i].obj_name;
                    }        
                    if (arr[i].child_objs && arr[i].child_objs.length) {
                        find(arr[i].child_objs);
                    } 
                }
            })(arr)
            $("#"+headerId+" .per-combobox_name").html((headerString === '' ? placeHolder : headerString));
        });
    },
    //项目初始化
    projectInit : function(){
        var targetElementId = "projectList";
        var model = "listByProject";
        var headerId = "selectedProject";
        this.multiselectPluginEvent(targetElementId,model,headerId,"请选择项目");
    },
    // 专业事件绑定
    majorInit : function(){
        var targetElementId = "projectList1";
        var model = "majorArr";
        var headerId = "selectedMajor";
        this.multiselectPluginEvent(targetElementId,model,headerId,"请选择专业");
    },
    // 权限事件绑定
    jurisdictionInit : function(){
        var targetElementId = "projectList2";
        var model = "jurisdiction";
        var headerId = "selectedJurisdiction";
        this.multiselectPluginEvent(targetElementId,model,headerId,"请选择权限");
    },
    // 岗位事件绑定
    // positionInit : function(){
    //     var targetElementId = "projectList3";
    //     var model = "postArr";
    //     var headerId = "selectedPosition";
    //     $("#"+targetElementId+" input").on('click',function(){
    //         //分三种状态：1.disabled 不可用；2.selected 已选中 3.初始化状态
    //         if($(this).hasClass('disabled') || $(this).hasClass('selected')){
    //             $("#selectedPosition > .per-combobox-wrap").hide();
    //             return false;
    //         }
    //         var arr = organizationModel[model];

    //         var id = $(this).attr('id');

    //         // if($(this).hasClass('selected')){
    //         //     (function find(arr,id){
    //         //         var find = arguments.callee;
    //         //         for(var i=0;i<arr.length;i++){     
    //         //             if(arr[i].id == id){
    //         //                 arr[i].selected = false;  
    //         //                 break;
    //         //             }      
    //         //             if (arr[i].child_objs && arr[i].child_objs.length) {
    //         //                 find(arr[i].child_objs,id);
    //         //             } 
    //         //         }
    //         //     })(arr,id)
    //         // }else{
    //             (function find(arr,id){
    //                 var find = arguments.callee;
    //                 for(var i=0;i<arr.length;i++){     
    //                     if(arr[i].id == id){
    //                         arr[i].selected = true;
    //                     }else{
    //                         if(arr[i].selected === true){
    //                             arr[i].selected = false;
    //                         }   
    //                     }   
    //                     if (arr[i].child_objs && arr[i].child_objs.length) {
    //                         find(arr[i].child_objs,id);
    //                     } 
    //                 }
    //             })(arr,id);
    //         // }

    //         var headerString = '';

    //         (function find_(arr){
    //             var find = arguments.callee;
    //             for(var i=0;i<arr.length;i++){     
    //                 if(arr[i].selected){
    //                     headerString += (headerString.length === 0 ? '' : ',') + arr[i].obj_name;
    //                 }        
    //                 if (arr[i].child_objs && arr[i].child_objs.length) {
    //                     find(arr[i].child_objs);
    //                 } 
    //             }
    //         })(arr)

    //         $("#"+headerId+" .per-combobox_name").html((headerString === '' ? '请选择岗位' : headerString));

    //         $("#selectedPosition > .per-combobox-wrap").hide();
    //     });
    // },
    //显示快速添加中心部门人员
    showPwindow5 : function () {
        $('#fastAdd').pshow();
        function fastAddInit () {
            $("#identificationCode").precover();
            $("#personName").precover();
            $("#personSex").psel("男");
            $("#phoneNumber").precover();
            $("#birthDate").psel({y:2017,M:1,d:1});
            $("#email").precover();
            $("#employeeNumber").precover();
            $("#email").precover();
            $("#searchAccountInfo>input").val("");
            $("#jurisdictionId").show();
            $("#jurisdictionId_").hide();
            $("#selectedProject .per-combobox_name").html("请选择项目");
            $("#selectedPosition").precover();
            $("#selectedPosition .per-combobox_name").html("请选择岗位");
            $("#selectedJurisdiction .per-combobox_name").html("请选择权限");
            $("#selectedMajor .per-combobox_name").html("请选择专业");

            //初始化专业
            arr = organizationModel.majorArr;
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
            //初始化项目
            arr = organizationModel.listByProject;
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
        }
        fastAddInit();
    },
    borderInit : function (){
        setTimeout(function(){
            $('#centerDepart .organizationTreeBoxName,#projectCommon .organizationTreeBoxName').css('borderBottom', '1px dashed #ddd');
            $('#centerDepart_ .organizationTreeBoxName,#projectCommon_ .organizationTreeBoxName').css('borderBottom', '1px dashed #ddd');
            $('#centerDepart .organizationTreeBoxName:last,#projectCommon .organizationTreeBoxName:last').css('borderBottom', 'none');
            $('#centerDepart_ .organizationTreeBoxName:last,#projectCommon_ .organizationTreeBoxName:last').css('borderBottom', 'none');
            $("#projectCommon .centerDepartmentUl,#projectCommon_ .projectCommonUl").css({'borderBottom':'none','borderTop':'none'});
            $($("#projectCommon .centerDepartmentUl").get(0)).css({'borderTop':'1px solid #ddd'});
            $($("#projectCommon_ .projectCommonUl").get(0)).css({'borderTop':'1px solid #ddd'});
            $("#projectCommon .centerDepartmentUl:last,#projectCommon_ .projectCommonUl:last").css({'borderBottom':'1px solid #ddd'});
        },10)
    },
    keepFastAdd : function(){
        //验证必填项
        if(!$('#identificationCode').pverifi() || !$('#personName').pverifi() || ($("#selectedProject .per-combobox_name").html() == "请选择项目") || !$("#selectedPosition").psel()){
            $("#message").pshow({ text: "请检查必填项信息完整", state: "failure" })
            return false;
        }
        //提取岗位id
        // var arr = organizationModel.postArr;
        // var positions = [];
        // (function find_(arr){
        //     var find = arguments.callee;
        //     for(var i=0;i<arr.length;i++){     
        //         if(arr[i].selected){
        //             positions.push(arr[i].obj_id);
        //         }    
        //         if (arr[i].child_objs && arr[i].child_objs.length) {
        //             find(arr[i].child_objs);
        //         }
        //     }
        // })(arr);
        //提取专业
        var majors = [];
        arr = organizationModel.majorArr;
        (function find_(arr){
            var find = arguments.callee;
            for(var i=0;i<arr.length;i++){     
                if(arr[i].selected){
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
        (function find_(arr){
            var find = arguments.callee;
            for(var i=0;i<arr.length;i++){     
                if(arr[i].selected){
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
        (function find_(arr){
            var find = arguments.callee;
            for(var i=0;i<arr.length;i++){     
                if(arr[i].selected){
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
            "head_portrait": "key",            //系统头像
            "person_user_id": organizationModel.accountId,           //账号id(暂时为空)
            "person_user_name": (organizationModel.accountId === "" ? $('#searchAccountInfo>input').val() : ""),         //账号名称
            "func_pack_ids": (organizationModel.accountId === "" ? jurisdiction : "")  //权限包id数组
        } 
        // console.log(JSON.stringify(addpeople));
        //保存
        organizationController.addPersonMultipleProject(addpeople).then(function(result){
            if(result && result.length >0){
                $("#globalnotice").pshow({
                    text: result,
                    state: "failure"
                });
            }else{
                $("#message").pshow({ text: "保存成功！", state: "success" });
                setTimeout(function(){
                    location.href = location.href;
                },1000)
            }
       })
    }
}
  