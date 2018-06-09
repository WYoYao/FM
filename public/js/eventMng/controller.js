/*  EML结构
{
    link:[
        {name:"简写，调用名",url:"地址",argu:"该接口参数"，faker:是否调用假数据,data:function(){return 假数据}}
    ],argu:{该模块公用参数}
}
*/
function createEventModuleController(){
    var  createAjax = function(arr){
        return arr.link.reduce(function(obj,link){
            if(obj[link.name]){
                return
            }
            obj[link.name] = function(argu,success,err,complete){
                if(link.faker){
                    success(link.data());
                    complete()
                }else{
                    var data = {
                        url: link.url,
                        data: Object.assign({},link.argu,argu,arr.argu),
                        success: success,
                        error: function(){
                            $("#globalnotice").pshow({text: "网络错误",state: "failure"});
                            err();
                        },
                        complete: complete,
                        
                    };  
                    link.severName ? data.configServiceName = link.severName : console.log("使用默认服务器");
                    if(argu.attachments && (argu.attachments.length > 0)){
                        pajax.updateWithFile(data);
                    }else{
                        pajax.post(data);
                    }
                }
            }
            return obj
        },{})
    };
    
    var cteatePromise = function(arr){
        return arr.link.reduce(function(obj,link){
            if(obj[link.name]){
                console.error(link.name + "链接已存在，请修改createEventModuleController");
                return
            }
            obj[link.name] = function(argu){
                return new Promise(function(resolve,reject){
                    var data = {
                        url: link.url,
                        data: Object.assign({},link.argu,argu,arr.argu),
                        success: resolve,
                        error: function(err){
                            $("#globalnotice").pshow({text: "网络错误",state: "failure"})
                            reject();
                        },
                        configServiceName:link.severName,
                    };
                    link.severName ? data.configServiceName = link.severName : console.log("使用默认服务器");
                    pajax.post(data);
                })
            }
            return obj
        },{})
    };

    var EML = {
        link:[
            // 查询项目事件列表
            {
                name:"PE",
                url:"listProjectEventsService",
                faker:false,
                severName:"jsonStringServerUrl",
                data:function(){
                    var obj =  {
                        total : Math.floor(Math.random()*1000),
                        contents : []
                    }
                    for(var i = 0;i<_.random(300,5000);i++){
                        let name = _.range(_.random(0,50)).reduce(function(t,a){
                            t+=(",@测试"+a);
                            return t
                        },"@测试")
                        obj.contents.push({
                                "eventId":i,       			         //事件id
                                "deptId":i,                            //处理部门id
                                "deptName":'开发部门' + i,	                      //处理部门名称
                                "problemType":i,  				    //问题类型
                                "eventDescribe":i,                     //事件描述
                                "repairPosition":"@测试",                    //报修位置,建筑/楼层/空间名称或文本信息,
                                "associationObject": name,            //关联对象
                                "infoPoint":"*****",     				    //信息点
                                "actualValue":"****",        			    //实际值(参数)
                                "actualValues":[1,2],        			    //实际值(参数)
                                "unit":"km",
                                "wrongs":["选项1","选项2"],    			    //异常范围 与 wrongRanges 互斥
                                "wrongRanges":[ 						    //异常范围  与 wrongs  互斥
                                    {"type":"gt","values":"12"},
                                    {"type":"lt","values":"6"},
                                    {"type":"range","values":["12","20"]}
                                ],                                            
                                "eventType":Math.floor(Math.random()*4),    					   //事件来源 客户报修,工程报修，总部指派,数据异常
                                "closeType":Math.floor(Math.random()*4),    					   //关闭原因 误报，重复报修，其他,工单已完成   当事件状态为2时存在
                                "closeTime":'2018.05.12 13:' + ('00' + i).slice(-2),   					   //关闭时间 格式yyyy.MM.dd HH:mm  当事件状态为2时存在
                                "handlePersons":["****"+i,"****"+i], 		   //解决人  当事件状态为2时存在
                                "workOrderState":"***",       			   //处理进度  当事件状态为1时存在
                                "contacts":"***",    				       //联系人
                                "startTime":"***",    					   //要求开始时间 格式yyyy.MM.dd HH:mm
                                "endTime":"***",     					   //要求完成时间 格式yyyy.MM.dd HH:mm
                                "creater":"***",      					   //事件提交人或创建人
                                "createTime":"***",   					   //事件提交时间
                                "pictures":["key1","key2"]                 //事件图片
                        })
                    }
                    return obj
                }
            },
            // 查询项目各状态各类型事件数量
            {
                name:"PL",
                url:"countProjectEventsService",
                severName:"jsonStringServerUrl",
            },
            //查询问题类型
            {
                name:"QT",
                url:"queryProblemTypesService",
                severName:"jsonStringServerUrl",
            },
            // 查询项目事件详情
            {
                name:"EI",
                url:"getProjectEventDetailByIdService",
                faker:false,
                severName:"jsonStringServerUrl",
                data : function(){
                    var a = ["待处理","工单待接单","工单运行中","已关闭"];
                    var b = ["客户报修","工程报修","总部指派","数据异常"];
                    var c = ["误报","重复报修","其他","工单已完成"];
                    var d = _.random(1,50);
                    return {
                        "eventId":"*****",     		   				 //事件id
                        "deptId":"****",                              //处理部门id
                        "deptName":"万达维修部",                             //处理部门名称
                        "eventType":_.random(0,3),      	   				 //事件来源，客户报修，工程报修，总部指派,数据异常
                        "eventState": _.random(0,3),    					 //事件状态，待处理，工单待接单,工单运行中,已关闭
                        "workOrderId":"***",    					 //工单id,工单待接单,工单运行中,已关闭关闭原因为工单已完成时有值
                        "handlePersons":"小头爸爸,大头儿子",  				 //解决人  当事件状态为已关闭时有值
                        "closeType":_.random(0,3),    						 //关闭原因 误报，重复报修，其他,工单已完成   当事件状态为2时存在
                        "closeTime":"***",   					     //关闭时间 格式yyyy.MM.dd HH:mm  当事件状态为2时存在
                        "repeatedEventId":"***", 				     //重复事件ID,已关闭关闭原因为重复报修时有值
                        "closeRemark":"***",     				     //关闭备注,已关闭关闭原因为其他时可能有值
                        "creater":"***",        					//事件提交人或报修人
                        "createTime":"***",     					//事件提交时间
                        "originalData":{      						//原始信息
                             "originalProblemType":"****", 		    //问题类型
                             "originalEventDescribe":"****",     	    //事件描述
                             "originalRepairPosition":"****",        //报修位置,建筑/楼层/空间id，优先使用
                             "originalRepairPositionName":"@天安门广场",   //报修位置名称,建筑/楼层/空间名称，优先使用
                             "originalRepairPositionString":"****",  //报修位置,无法关联到本系统物理建筑/楼层/空间id的文本信息
                             "originalAssociationObjectCount":d, //关联对象的数量
                             "originalAssociationObject":_.range(d).map(function(item){
                                 return {
                                    "obj_id":"***", 				//关联对象id
                                    "obj_name":"对象"+item, 			//关联对象名称
                                    "obj_type":"equip",             //关联对象类型
                                    "space_id":"***",			//空间id,当对象类型为equip才会有值
                                    "space_name":"北京天上人间" + item + "分店",			//空间名称,当对象类型为equip才会有值
                                }
                             }),  						//关联对象，优先使用
                            "originalAssociationObjectString":"****",     //关联对象，无法关联到本系统物理对象的文本信息
                            "infoPointName":"*****",     		//信息点名称
                            "infoCollectionTime":"****",		//数据采集时间 yyyyMMddHHmmss
                            "infoPointId":"*****",       		//信息点id
                            "actualValue":"****",         		//实际值(参数)
                            "actualValues":"[1,2]",         		//实际值(参数)
                            "unit":"****",         		//实际值(参数)
                            "wrongs":["选项1","选项2"],    		//异常范围 与 wrongRanges 互斥
                            "wrongRanges":[ 				    //异常范围  与 wrongs  互斥
                                {
                                    "type":"gt",
                                "values":"12"
                                },
                                {
                                "type":"lt",
                                "values":"6"
                                },
                                {
                                    "type":"range",
                                    "values":["12","20"]
                                    }
                                ]
                            },
                            "reviseData":{      						 //修正信息
                            "reviseProblemType":"****",               //问题类型
                            "reviseEventDescribe":"****",             //事件描述
                            "reviseRepairPosition":"****",            //报修位置，优先使用
                            "reviseRepairPositionName":"@****",       //报修位置名称,建筑/楼层/空间名称，优先使用
                            "reviseRepairPositionString":"****",   	 //报修位置,无法关联到本系统物理建筑/楼层/空间id的文本信息
                            "reviseAssociationObjectCount":"***",     //关联对象的数量
                            "reviseAssociationObject":[
                            {
                            "obj_id":"***", 						 //关联对象id
                            "obj_name":"***", 				     //关联对象名称
                            "obj_type":"equip",             //关联对象类型
                            "space_id":"***",			//空间id,当对象类型为equip才会有值
                            "space_name":"***",			//空间名称,当对象类型为equip才会有值
                            }], 							 //关联对象，优先使用
                            "reviseAssociationObjectString":"****",   //关联对象，无法关联到本系统物理对象的文本信息
                            "revisepersonId":"****",   				 //修正人主键
                            "revisePersonName":"****",   			 //修正人名称
                            "reviseDate":"*****"        			 //修正时间
                            },
                           "contacts":"***",      						 //联系人
                           "phone":"****",        						 //联系电话
                           "startTime":"***",    						 //要求开始时间 格式yyyy.MM.dd HH:mm
                           "endTime":"***",      						 //要求完成时间 格式yyyy.MM.dd HH:mm
                           "pictures":["key1","key2"]     			 	 //事件图片
                     }
                }
            },
            // 关闭项目事件
            {
                name:"CP",
                url:"changProjectEventStateByIdService",
                severName:"jsonStringServerUrl",
            },
            // 获取重复项目事件列表
            {
                name:"RE",
                url:"listProjectEventsTwoStateService",
                severName:"jsonStringServerUrl",
            },
            // 获取集团事件各状态数量
            {
                name:"GL",
                url:"countGroupEventsService",
                severName:"jsonStringServerUrl",
            },
            // 查询集团事件首页信息
            {
                name:"GI",
                url:"countProjectGroupEventsService",
                faker:false,
                severName:"jsonStringServerUrl",
                data : function(){
                    var a = _.range(_.random(5,50));
                    return {
                        "projectTotalCount":"***",     		  //项目总数量
                        "waitingHandleCount":"***", 			  //待处理事件数量
                        "waitingHandleEvents":{    			  //待处理事件分类型数量,如果筛选条件选择了事件来源,则值为空
                            "customerRepairCount":"****",         //客户报修数量
                            "projectRepairCount":"****",          //工程报修数量
                            "headquartersAssignCount":"****",     //总部指派数量
                            "dataAnomalyCount":"***",             //数据异常数量
                        },
                        "handlingCount":"***",     		 //处理中事件总数
                        "handlingEvents":{         			 //处理中事件分类型数量,如果筛选条件选择了事件来源,则值为空
                            "customerRepairCount":"****",         //客户报修数量
                            "projectRepairCount":"****",          //工程报修数量
                            "headquartersAssignCount":"****",     //总部指派数量
                            "dataAnomalyCount":"***",             //数据异常数量
                         },
                        "projectsDetail": a.map(function(item){
                                return {
                                    "projectId":"project"+item,     				 //项目id
                                    "projectName":"项目"+item,    			 //项目名称
                                    "projectCount":{
                                        "waitingHandleCount":_.random(100,1000),		 //待处理事件数量
                                        "handlingCount":_.random(100,1000),     		 //处理中事件总数
                                    }
                                }
                            })
                    }
                }
            },
            // 查询集团事件列表
            {
                name:"GD",
                url:"listGroupEventsService",
                faker:false,
                severName:"jsonStringServerUrl",
                data:function(){
                    var x = _.random(1,500);
                    var a = _.range(x);
                    var d = a.map(function(item){
                        return {
                            "groupEventId":"*****",       	//集团事件id
                            "eventDescribe":"集团事件" + item,     	//事件描述
                            "createrName":"创建人" + item,     		//创建人
                            "startTime":"***",    			//要求开始时间 格式yyyy.MM.dd HH:mm
                            "endTime":"***",      			//要求完成时间 格式yyyy.MM.dd HH:mm
                            "groupEventState": _.random(0,2),       	//集团事件状态，未指派，已指派XX项目，已关闭
                            "assignCount":_.random(1,30),
    
                        }
                    })
                    return {
                        "total":x,					    //查询数据的总条数
                        "contents":d
                    }
                }
            },
            // 查询集团事件详情
            {
                name:"GE",
                url:"getGroupEventByIdService",
                severName:"jsonStringServerUrl",
                faker:false,
                data : function(){
                    var a = _.random(1,50);
                    var b = _.range(a);
                    return {
                        "groupEventId":"*****",    	//集团事件id
                        "eventDescribe":"****"+a ,    			//事件描述
                        "createrName":"***"+a ,      			//创建人
                        "createTime":"***"+a ,         		//创建时间  yyyy.MM.dd HH:mm
                        "groupEventState":_.random(0,2),         	//集团事件状态，未指派，已指派，已关闭
                        "assignedCount":a,      			//已指派项目数量
                        "assignedProjects":b.map(function(item){
                            return  {
                                "eventId":"***",      //项目事件id
                                "projectId":item,    //项目id 
                                "projectName":"****" + item, //项目名称
                                "deptId":"***",       //部门id
                                "deptName":"***dasd" + item,     //部门名称
                                "eventState":_.random(0,2),  //事件状态 待处理,处理中,已关闭
                                "workOrderId":"***",  //工单id
                                "workOrderState":_.random(0,3),	//工单状态名称
                                "closeType":_.random(0,3)//关闭类型,0-误报，1-重复报修，2-其他,3-工单已完成
                              }
                        }),
                        "startTime":"***",        		//要求开始时间 格式yyyy.MM.dd HH:mm或指派后立即开始
                        "endTime":"***",            	//要求完成时间 格式yyyy.MM.dd HH:mm
                        "pictures":["key1","key2"]     	//事件图片
                     }
                }
            },
            // 查询集团事件可指派的项目列表
            {
                name:"GP",
                url:"listPartitionProjectTreeService",
                severName:"jsonStringServerUrl",
                faker:false,
                data:function(){
                    return  [
                        {               					//类型：Object  必有字段  备注：无
                            "partitionProjectId":"mock",     //类型：String  必有字段  备注：分区或者项目id
                            "partitionProjectName":"北京中南海项目",   //类型：String  必有字段  备注：分区或者项目名称
                            "type":"mock",                   //类型：String  必有字段  备注：1-分区，0-项目
                            "selected":"1",               //类型：String  必有字段  备注：1-已选择，0-未选择
                            "contents":[                		//类型：Array  必有字段  备注：分区或者项目，项目一定是叶子节点
                                {               			//类型：Object  必有字段  备注：无
                                    "partitionProjectId":"mock",             //类型：String  必有字段  备注：分区或者项目id
                                    "partitionProjectName":"美国白宫翻新项目",           //类型：String  必有字段  备注：分区或者项目名称
                                    "type":"mock",                		  //类型：String  必有字段  备注：1-分区，0-项目
                                    "selected":"0",                		  //类型：String  必有字段  备注：1-已选择，0-未选择
                                    "contents":[                			  //类型：Array  必有字段  备注：分区或者项目，项目一定是叶子节点
                                                                          //类型：Array  必有字段  备注：无
                                            {               			//类型：Object  必有字段  备注：无
                                                "partitionProjectId":"mock",             //类型：String  必有字段  备注：分区或者项目id
                                                "partitionProjectName":"法国卢浮宫项目",           //类型：String  必有字段  备注：分区或者项目名称
                                                "type":"mock",                		  //类型：String  必有字段  备注：1-分区，0-项目
                                                "selected":"0", 
                                                
                                            },{               			//类型：Object  必有字段  备注：无
                                                "partitionProjectId":"mock",             //类型：String  必有字段  备注：分区或者项目id
                                                "partitionProjectName":"英国白金汉宫项目",           //类型：String  必有字段  备注：分区或者项目名称
                                                "type":"mock",                		  //类型：String  必有字段  备注：1-分区，0-项目
                                                "selected":"0", 
                                                
                                            }
                                        
                                    ]
                                }
                            ]
                        },{               					//类型：Object  必有字段  备注：无
                            "partitionProjectId":"mock",     //类型：String  必有字段  备注：分区或者项目id
                            "partitionProjectName":"北京中南海项目",   //类型：String  必有字段  备注：分区或者项目名称
                            "type":"mock",                   //类型：String  必有字段  备注：1-分区，0-项目
                            "selected":"1",               //类型：String  必有字段  备注：1-已选择，0-未选择
                            "contents":[                		//类型：Array  必有字段  备注：分区或者项目，项目一定是叶子节点
                                {               			//类型：Object  必有字段  备注：无
                                    "partitionProjectId":"mock",             //类型：String  必有字段  备注：分区或者项目id
                                    "partitionProjectName":"美国白宫翻新项目",           //类型：String  必有字段  备注：分区或者项目名称
                                    "type":"mock",                		  //类型：String  必有字段  备注：1-分区，0-项目
                                    "selected":"0",                		  //类型：String  必有字段  备注：1-已选择，0-未选择
                                    "contents":[                			  //类型：Array  必有字段  备注：分区或者项目，项目一定是叶子节点
                                                                         //类型：Array  必有字段  备注：无
                                            {               			//类型：Object  必有字段  备注：无
                                                "partitionProjectId":"mock",             //类型：String  必有字段  备注：分区或者项目id
                                                "partitionProjectName":"法国卢浮宫项目",           //类型：String  必有字段  备注：分区或者项目名称
                                                "type":"mock",                		  //类型：String  必有字段  备注：1-分区，0-项目
                                                "selected":"0", 
                                                
                                            },{               			//类型：Object  必有字段  备注：无
                                                "partitionProjectId":"mock",             //类型：String  必有字段  备注：分区或者项目id
                                                "partitionProjectName":"英国白金汉宫项目",           //类型：String  必有字段  备注：分区或者项目名称
                                                "type":"mock",                		  //类型：String  必有字段  备注：1-分区，0-项目
                                                "selected":"0", 
                                                
                                            }
                                    
                                    ]
                                }
                            ]
                        }
                    ]
                            
                },
            },
            // 获取部门树
            {
                name:"OT",
                url:"restDeptService/queryDeptTreeForGroupEvent",
                // severName:"jsonStringServerUrl",
                faker:false,
                data : function(){
                    return  [
                        {
                            "obj_id":"***",               //对象id
                            "obj_name":"国务院",             //对象名称
                            "obj_type":"***",             //对象类型，d1-中心部门、d2-项目通用部门、d3-自定义部门
                            "child_objs":[
                                {
                                "obj_id":"***",            //对象id
                                "obj_name":"广电总局",          //对象名称
                                "obj_type":"***",          //对象类型
                                "child_objs":[]  //子对象
                                }
                            ]
                        },
                        {
                            "obj_id":"***",               //对象id
                            "obj_name":"中央军委",             //对象名称
                            "obj_type":"***",             //对象类型，d1-中心部门、d2-项目通用部门、d3-自定义部门
                            "child_objs":[
                                {
                                "obj_id":"***",            //对象id
                                "obj_name":"广电总局",          //对象名称
                                "obj_type":"***",          //对象类型
                                "child_objs":[]  //子对象
                                }
                            ]
                        },
                    ]
                },
            },
            //删除集团事件
            {
                name:"DG",
                url:"deleteGroupEventService",
                severName:"jsonStringServerUrl",
            } ,
            // 修改集团事件状态
            {
                name:"CG",
                url:"changeGroupEventStateService",
                severName:"jsonStringServerUrl",
            },
            // 查询该事件绑定的未完成的项目事件
            {
                name:"NB",
                url:"listNoFinishProjectEventsService",
                severName:"jsonStringServerUrl",
                faker:false,
                data : function(){
                    var a = _.range(_.random(0,2));
                    return a.map(function(item){
                        return  {
                            "projectId":item,      				//项目id
                            "projectName":"***" + item,    				//项目名称
                          }
                    })
                }
            },
            // 新建集团事件
            {
                name:"NG",
                url:"saveGroupEventService",
                severName:"jsonStringServerUrl",
                faker:false,
                data:function(){
                    return {
                        "result": "success",       //类型：String  必有字段  备注：failure失败，success成功
                        "content": [],       //返回值
                        "reason": "***"        //类型：String  可有字段  备注：失败原因，result为failure时reason不为null
                    }
                },
            },
            // 指派集团事件
            {
                name:"AG",
                url:"assignProjectEventsService",
                severName:"jsonStringServerUrl",
                faker:false,
                data : function(){
                    return {
                        "result": "success",       	//类型：String  必有字段  备注：failure失败，success成功
                        "content": [],       		//返回结果值
                        "reason": "***"          		//类型：String  可有字段  备注：失败原因，result为failure时reason不为null
                    }
                },
            },
            // 修正项目事件信息
            {
                name:"CI",
                url:"reviseProjectEventByIdService",
                severName:"jsonStringServerUrl",
                faker:false,
                data:function(){
                    return  {
                        "result": "success",       	//类型：String  必有字段  备注：failure失败，success成功
                        "content": [],       		//返回结果值
                        "reason": "***"          		//类型：String  可有字段  备注：失败原因，result为failure时reason不为null
                    }
                },
            }
        ],
        // argu:{
        //     "puser":{                   //登录人信息,必须
        //         "userId":"64e57cc2-f6eb-4bfd-bf06-7a202c9488da",         //登录ID
        //         "loginDevice":"PC"      //登录设备  取值范围是iPhone/Android/PC
        //     },
        //     "person_id":"123",
        //     "user_id":"64e57cc2-f6eb-4bfd-bf06-7a202c9488da"
        // }
    }

    window.EMA ? console.error("事件模块AJAX集合EMA被占用，请修改createEventModuleController方法") : window.EMA = createAjax(EML);
    window.EMP ? console.error("事件模块Promise集合EMP被占用，请修改createEventModuleController方法") : window.EMP = cteatePromise(EML);
}

