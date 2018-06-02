function createAjax(arr){
    return arr.link.reduce(function(obj,link){
        if(obj[link.name]){
            console.log(link.name + "链接已存在");
            return
        }
        obj[link.name] = function(argu,success,err,complete){
            if(link.faker){
                success(link.data());
                complete()
            }else{
                pajax.post({
                    url: link.url,
                    data: Object.assign({},link.argu,argu,arr.argu),
                    success: function(data){
                        success((data && data.data) || data);
                    },
                    error: function(){
                        $("#globalnotice").pshow({text: "网络错误",state: "failure"});
                        err();
                    },
                    complete: complete(),
                    configServiceName:link.severName,
                });
            }
        }
        return obj
    },{})
}

function cteatePromise(arr){
    return arr.link.reduce(function(obj,link){
        if(obj[link.name]){
            console.log(link.name + "链接已存在");
            return
        }
        obj[link.name] = function(argu){
            console.log(JSON.stringify(Object.assign({},link.argu,argu,arr.argu)));
            return new Promise(function(resolve,reject){
                pajax.post({
                    url: link.url,
                    data: Object.assign({},link.argu,argu,arr.argu),
                    success: resolve,
                    error: function(err){
                        $("#globalnotice").pshow({text: "网络错误",state: "failure"})
                        reject();
                    },
                    configServiceName:link.severName,
                });
            })
        }
        return obj
    },{})
}


function createPlanModuleController(){
    // planManageLinkList
    var PML = {
        link:[
            // 获取所有工单状态
            {
                name:"OS",
                url :"restGeneralDictService/queryWorkOrderState",
                severName:"serviceUrl",
                argu:{
                    "dict_type": "work_order_state"
                }
            },
            // 获取工单类型
            {
                name:"WT",
                // url :"restGeneralDictService/queryGeneralDictByKey",
                url:"restGeneralDictService/queryWoTypeList",
                severName:"serviceUrl",
                argu:{
                    "work_type": "work_type",
                    "wo_execute_type": "plan"
                }
            },
            // 查询集团计划引用数量
            {
                name:"GPU",
                url :"/workorder/restWoPlanService/queryGroupPlanUseNum",
                severName:"baseServiceUrl",
            },
            // 获取周月季年工单数据
            {
                name:"PO",
                url :"/workorder/restWoPlanService/queryWoPlanExecuteList",
                severName:"baseServiceUrl",
                faker:false,
                data : function(){
                    return _.range(_.random(20, 50)).map((index) => {
                        let count = _.random(5, 10);
                        let create_wo_total = _.random(1, 5);
                        let uncreate_wo_total = _.random(1, count - create_wo_total);
                    
                        return {
                            "plan_id": "计划id",                //计划id
                            "plan_name": "计划id",                //计划id
                            "project_id": "项目id",             //项目id
                            "project_name": "项目名称",           //项目名称
                            "is_update_group_plan": _.random(0, 1),    //是否更新集团计划，1-已更新、0-未更新
                            "create_wo_total": create_wo_total,           //发单总数
                            "uncreate_wo_total": uncreate_wo_total,         //未发出数
                            "executing_wo_total": _.random(0, 5),        //执行中数
                            "finished_wo_total": _.random(0, 5),         //已完成数
                            "row_count": 3,                  //行数
                            "work_orders": _.chunk(_.range(_.random(28, 31)).map(item => ++item), 4).map((item, index) => {
                    
                                var obj = {
                                    order_id: "1231",
                                    "ask_start_time": "201805" + ("00" + item.slice(0, 1)).slice(-2) + "000000",   //要求开始时间,yyyyMMddhhmmss
                                    "ask_end_time": "201805" + ("00" + item.slice(-1)).slice(-2) + "000000",     //要求结束时间,yyyyMMddhhmmss
                                    "order_state": "1"       //工单状态编码，优先返回自定义状态
                                };
                    
                                return obj;
                            })
                        }
                    })
                }
            },
            // 获取周月季年集团版工单数据
            {
                name:"GPO",
                url:"/workorder/restGroupPlanService/queryWoPlanExecuteList",
                severName:"baseServiceUrl",
            },
            // 获取日工单集团版工单数据
            {
                name:"GDO",
                url:"/workorder/restGroupPlanService/queryWoPlanDayExecuteList",
                severName:"baseServiceUrl",
            },
            // 获取日工单数据
            {
                name:"DO",
                url :"/workorder/restWoPlanService/queryWoPlanDayExecuteList",
                severName:"baseServiceUrl",
                faker:false,
                data : function(){
                    return _.range(_.random(20, 50)).map((index) => {
                        let count = _.random(5, 10);
                        let create_wo_total = _.random(1, 5);
                        let uncreate_wo_total = _.random(1, count - create_wo_total);
                    
                        return {
                            "plan_id": "计划id",                //计划id
                            "plan_name": "计划id",                //计划id
                            "project_id": "项目id",             //项目id
                            "project_name": "项目名称",           //项目名称
                            "is_update_group_plan": _.random(0, 1),    //是否更新集团计划，1-已更新、0-未更新
                            "create_wo_total": create_wo_total,           //发单总数
                            "uncreate_wo_total": uncreate_wo_total,         //未发出数
                            "executing_wo_total": _.random(0, 5),        //执行中数
                            "finished_wo_total": _.random(0, 5),         //已完成数
                            "row_count": 3,                  //行数
                            "work_orders": _.chunk(_.range(_.random(28, 31)).map(item => ++item), 4).map((item, index) => {
                    
                                var obj = {
                                    order_id: "1231",
                                    "ask_start_time": "201805" + ("00" + item.slice(0, 1)).slice(-2) + "000000",   //要求开始时间,yyyyMMddhhmmss
                                    "ask_end_time": "201805" + ("00" + item.slice(-1)).slice(-2) + "000000",     //要求结束时间,yyyyMMddhhmmss
                                    "order_state": "1"       //工单状态编码，优先返回自定义状态
                                };
                    
                                return obj;
                            })
                        }
                    })
                }
            },
            // 获取工单详情
            {
                name:"OD",
                url :"/workorder/restWoMonitorService/queryWorkOrderById",
                severName:"baseServiceUrl",
                faker:false,
                data:function(){
                    // wo_exec_controls 中 control_code有：
                    // applyMatters-申请事项,auditMatters-审核事项,approvalMatters-审批事项
                    // applyAddingPeople-申请加人,auditAddingPeople-审核加人,approvalAddingPeople-审批加人
                    // applyReplacePeople-申请换人,auditReplacePeople-审核换人,approvalReplacePeople-审批换人
                    // applyDelay-申请延期,auditDelay-审核延期,approvalDelay-审批延期
                    // applyClose-申请结束,auditClose-审核结束,approvalClose-审批结束
                    var a = Math.random();
                    var b = ['applyMatters','auditMatters','approvalMatters','applyAddingPeople','applyAddingPeople','applyAddingPeople'
                    ,'applyReplacePeople','auditReplacePeople','approvalReplacePeople','applyDelay','auditDelay','approvalDelay'
                    ,'applyClose','auditClose','approvalClose']
                    var obj = {
                        "order_id":"***",                   //工单id ,非空
                        "project_id":"***",                 //项目id ,非空
                        "place":_.range(_.random(1,10)).map(function(item){
                            return {
                                name:"中南海" + item + '号楼',
                            }
                        }),
                        "order_type":"***",                 //工单类型 ,非空
                        "order_type_name":Math.random(),            //工单类型名称 ,非空
                        "execute_type":"***",               //工单执行类型编码,temp-临时、plan-计划、all-全部  ,非空
                        "urgency":a > 0.3 ? a > 0.6 ? '高' : '中' : '低',                    //紧急程度，高、中、低
                        "executie_mode" :"***",             //工单执行方式编码,1-单人串行、2-多人并行  ,非空
                        "start_time_type":a > 0.5 ? 1 : 2 ,              //开始时间类型,1-发单后立即开始，2-自定义开始时间
                        "ask_start_time":"20170620180000",  //要求开始时间,yyyyMMddhhmmss  ,非空
                        "ask_end_limit":Math.ceil(a*48),                //要求固定时间内完成,单位小时
                        "ask_end_time":"20170622180000",    //要求结束时间,yyyyMMddhhmmss  ,非空
                        "required_tools":[_.range(1,20)],     //所需工具
                        "order_state":"***",                //工单状态编码  ,非空
                        "order_state_name":"***",           //工单状态名称  ,非空
                        "custom_state":"***",               //工单自定义状态编码
                        "custom_state_name":"***",          //工单自定义状态名称
                        "summary":"***",                    //工单概述,事项名称的串连  ,非空
                        "order_from_type":"***",            //工单来源类型,1-正常创建，2-工单计划，3-报修转工单，默认1
                        "order_from_id":"***",              //工单来源id，报修转工单时，这里是报修单id
                        "creator_id":"***" ,                //创建人id  ,非空
                        "creator_name":"***",               //创建人名字
                        "domain_list":["code1","code2"],        //工单中专业列表，code，接单列表过滤使用
                        "limit_domain":true,                //专业限制
                        "do_after_start_time":true,         //到达开始时间后才允许处理工单
                        "matters":[                         //工单事项  ,非空
                            {	
                                "$ID":"***",                  //引擎需要的id，同matter_id，后台使用
                                "matter_id":"***",            //事项id ,非空
                                "matter_name":"***",          //事项名称 ,非空
                                "matter_steps":[              //事项步骤 ,非空		
                                    {
                                        "$ID":"***",            //引擎需要的id，同obj_step_id，后台使用
                                        "obj_step_id":"***",    //对象步骤id ,非空
                                        "description":"***",    //事项概述
                                        "obj_id":"***",         //对象id，可能为空
                                        "obj_name":"***",       //对象名称 ，可能为空
                                        "steps":[               //步骤 ,非空
                                        {
                                            "$ID":"***",                 //引擎需要的id，step_id，后台使用
                                            "step_id":"***",             //步骤id,obj_step_id+"_"+step_sequence组成 ,非空
                                            "step_sequence":"1-1",       //步骤序号  ,非空
                                            "step_type":"3",             //步骤类型：1-文字输入、2-上传照片、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                                            "step_finish":true,          //步骤工作是否完成
                                            "content":"到达指定位置拍照"    //操作内容描述
                                        },
                                        {
                                            "$ID":"***",                 //引擎需要的id，step_id，后台使用
                                            "step_id":"***",             //步骤id,obj_step_id+"_"+step_sequence组成 ,非空
                                            "step_sequence":"1-2",       //步骤序号  ,非空
                                            "step_type":"4",             //步骤类型：1-文字输入、2-上传照片、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                                            "step_finish":true,          //步骤工作是否完成
                                            "content":"到达指定位置扫码"    //操作内容描述 
                                        },
                                        {
                                            "$ID":"***",                 //引擎需要的id，step_id，后台使用
                                            "step_id":"***",             //步骤id,obj_step_id+"_"+step_sequence组成 ,非空
                                            "step_sequence":"2-1",       //步骤序号  ,非空
                                            "step_type":"5",             //步骤类型：1-文字输入、2-上传照片、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                                            "pre_conform":"***",         //强制确认
                                            "content":"***",             //操作内容
                                            //操作内容中涉及的对象,如果有子对象时，则子对象中obj_id、obj_name、obj_type皆非空
                                            "content_objs":[
                                                {
                                                    "obj_id":"***",           //对象id
                                                    "obj_name":"对象名称1",    //对象名称
                                                    "obj_type":"equip"        //对象类型,子项见后边
                                                },
                                            ],   
                                            "notice":"***",                //注意事项
                                            "confirm_result":[	          //需确认的操作结果，如果有子对象时，则子对象中obj_id、obj_name、obj_type皆非空
                                                {
                                                    "obj_id":"***",
                                                    "obj_name":"***",
                                                    "obj_type":"***",
                                                    "parents":[
                                                        {"parent_ids":["***","***","***"],"parent_names":["建筑1","楼层1","空间"]},
                                                        {"parent_ids":["***","***"],"parent_names":["专业1","系统1"]}
                                                    ],
                                                    "info_points":[			//信息点组件数据，如果有子对象时，则子对象中id、code、name、cmpt皆非空
                                                        {  "id":"***","code":"***","name":"***","unit":"***","cmpt":"Numberentry02",
                                                                "wrong_ranges":[{"type":"gt","values":"12"},{"type":"lt","values":"6"}],"wrongs_info_code":"***"},
                                                        {  "id":"***","code":"***","name":"***","unit":"***","cmpt":"Multiselect01",
                                                                "cmpt_data":[{"code": "***","name": "***"}],"wrongs":["选项1","选项2"],"wrongs_info_code":"***"}
                                                    ],
                                                    "customs":[//自定义项，type：1-文本、2-单选、3-多选、4-无单位的数字、5-有单位的数字，如果有子对象时，则子对象中name、type皆非空
                                                        {  "name":"确认信息2","type":"1"},
                                                        {  "code":"***","name":"确认信息2","type":"1"},
                                                        {  "code":"***","name":"确认信息2","type":"2","items":["选项1","选项2","选项3"],"wrongs":["选项1","选项2"],"wrongs_info_code":"***"},
                                                        {  "code":"***","name":"确认信息3","type":"3","items":["选项1","选项2","选项3"],"wrongs":["选项1","选项2"],"wrongs_info_code":"***"},
                                                            //非区间异常的type项有：gt-大于,gte-大于等于，lt-小于,lte-小于等于,区间的type项为range,满足一个子项就认为出现异常
                                                        {  "code":"***","name":"确认信息4","type":"4","wrong_ranges":[{"type":"gt","values":"12"},{"type":"lt","values":"6"}],"wrongs_info_code":"***"},
                                                        {  "code":"***","name":"确认信息5","type":"5","unit":"***","wrong_ranges":[{"type":"range","values":["12","20"]}],"wrongs_info_code":"***"}
                                                    ]
                                                },
                                            ],
                                            "domain":"***",               //专业code
                                            "domain_name":"***"           //专业名称
                                        },
                                        {
                                            "$ID":"***",
                                            "step_id":"***",
                                            "step_sequence":"2-2",
                                            "step_type":"5",              
                                            "pre_conform":"***",
                                            "content":"***",
                                            //操作内容中涉及的对象
                                            "content_objs":[
                                                {
                                                    "obj_id":"***",   
                                                    "obj_name":"对象名称1",
                                                    "obj_type":"equip" 
                                                },
                                            ],   
                                            "notice":"***",  
                                            "confirm_result":[
                                                {
                                                    "obj_id":"***",
                                                    "obj_name":"***",
                                                    "obj_type":"***",
                                                    "parents":[
                                                        {"parent_ids":["***","***","***"],"parent_names":["建筑1","楼层1","空间"]},
                                                        {"parent_ids":["***","***"],"parent_names":["专业1","系统1"]}
                                                    ],
                                                    "info_points":[			//信息点组件数据源类型
                                                        {  "id":"***","code":"***","name":"***","unit":"***","cmpt":"Numberentry02",
                                                                "wrong_ranges":[{"type":"gt","values":"12"},{"type":"lt","values":"6"}],"wrongs_info_code":"***"},
                                                        {  "id":"***","code":"***","name":"***","unit":"***","cmpt":"Multiselect01",
                                                                "cmpt_data":[{"code": "***","name": "***"},],"wrongs":["选项1","选项2"],"wrongs_info_code":"***"}
                                                    ],
                                                    "customs":[//自定义项，type：1-文本、2-单选、3-多选、4-无单位的数字、5-有单位的数字
                                                        {  "code":"***","name":"确认信息2","type":"1"},
                                                        {  "code":"***","name":"确认信息2","type":"2","items":["选项1","选项2","选项3"],"wrongs":["选项1","选项2"],"wrongs_info_code":"***"},
                                                        {  "code":"****","name":"确认信息3","type":"3","items":["选项1","选项2","选项3"],"wrongs":["选项1","选项2"],"wrongs_info_code":"***"},
                                                            //非区间异常的type项有：gt-大于,gte-大于等于，lt-小于,lte-小于等于,区间的type项为range,满足一个子项就认为出现异常
                                                        {  "code":"****","name":"确认信息4","type":"4","wrong_ranges":[{"type":"gt","values":"12"},{"type":"lt","values":"6"}],"wrongs_info_code":"***"},
                                                        {  "code":"****","name":"确认信息5","type":"5","unit":"***","wrong_ranges":[{"type":"range","values":["12","20"]}],"wrongs_info_code":"***"}
                                                    ]
                                                },
                                            ],
                                            "domain":"***",              //专业code
                                            "domain_name":"***"          //专业名称
                                        },
                                        ],  
                                        "feedback" :[                     //反馈信息
                                        {
                                            "$ID":"****",              //引擎需要的id，同step_id，后台使用
                                            "step_id":"***",            //步骤id ,非空
                                            "step_sequence":"1-1",      //步骤序号  ,非空
                                            "step_type":"3",            //步骤类型：1-文字输入、2-上传照片、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                                            "step_finish":true,         //步骤工作是否完成
                                            "description":"****",      //反馈描述
                                            "photos":["key","key"],    //图片key
                                            "executor_id":"***",        //执行人Id
                                            "operate_time" :20150505055555             //操作时间，yyyyMMddHHmmss
                                        },
                                        {
                                            "$ID":"****",              //引擎需要的id，同step_id，后台使用
                                            "step_id":"***",            //步骤id ,非空
                                            "step_sequence":"2-1",      //步骤序号 ,非空
                                            "step_type":"5",            //步骤类型：1-文字输入、2-上传照片、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                                            "step_finish":true,         //步骤工作是否完成
                                            "pre_conform_result":"前提已确认",	//前提确认结果
                                            "description":"****",      //反馈描述
                                            "confirm_result":[	        //需确认的操作结果，如果有子对象时，则子对象中obj_id、obj_name皆非空
                                                {
                                                    "obj_id":"***",
                                                    "obj_name":"***",
                                                    "info_points":[		//信息点信息反馈，如果有子对象时，则子对象中code、name、cmpt皆非空
                                                        { "id":"***","code":"***","name":"***","unit":"***","value":"123","cmpt":"Numberentry02",
                                                                "wrong_ranges":[{"type":"gt","values":"12"},{"type":"lt","values":"6"}],"wrongs_info_code":"***"},
                                                        { "id":"***","code":"***","name":"***","unit":"***","values":["123","456"],"cmpt":"Multiselect01",
                                                                "cmpt_data":[{"code": "***","name": "***"},],"wrongs":["选项1","选项2"],"wrongs_info_code":"***"}
                        
                                                    ],
                                                    "customs":[//自定义项反馈，type：1-文本、2-单选、3-多选、4-无单位的数字、5-有单位的数字，如果有子对象时，则子对象中name、type皆非空
                                                        {  "code":"****","name":"确认信息2","type":"1","content": "****" },
                                                        {  "code":"****","name":"确认信息2","type":"2","item":"***","wrongs":["选项1","选项2"],"wrongs_info_code":"***"},
                                                        {  "code":"****","name":"确认信息3","type":"3","items":["***","***"],"wrongs":["选项1","选项2"],"wrongs_info_code":"***"},
                                                            //非区间异常的type项有：gt-大于,gte-大于等于，lt-小于,lte-小于等于,区间的type项为range,满足一个子项就认为出现异常
                                                        {  "code":"****","name":"确认信息4","type":"4","value":"123","wrong_ranges":[{"type":"gt","values":"12"},{"type":"lt","values":"6"}],"wrongs_info_code":"***"},
                                                        {  "code":"****","name":"确认信息5","type":"5","value":"456","unit":"***","wrong_ranges":[{"type":"range","values":["12","20"]}],"wrongs_info_code":"***"}
                        
                                                    ]
                                                },
                                            ],
                                            "photos":["key","key"],//图片key
                                            "executor_id":"***",//执行人Id ,非空
                                            "operate_time":20171212121212 ,//操作时间，yyyyMMddHHmmss ,非空
                                        },
                                        ],
                                        "executors":["name1","name2"] ,    //执行人 ,非空
                                    },
                                    {
                                        "$ID":"***",            //引擎需要的id，同obj_step_id，后台使用
                                        "obj_step_id":"***",    //对象步骤id ,非空
                                        "steps":[               //步骤 ,非空
                                        {
                                            "$ID":"***",                 //引擎需要的id，step_id，后台使用
                                            "step_id":"***",             //步骤id,obj_step_id+"_"+step_sequence组成 ,非空
                                            "step_sequence":"3-1",       //步骤序号  ,非空
                                            "step_type":"6",             //步骤类型：1-文字输入、2-上传照片、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                                            "content":"结束该事项时签字"   //操作内容描述 
                                        } 
                                        ],
                                        "feedback" :[                     //反馈信息
                                        {
                                            "$ID":"****",             //引擎需要的id，同step_id，后台使用
                                            "step_id":"***",           //步骤id ,非空
                                            "step_sequence":"3-1",     //步骤序号  ,非空
                                            "step_type":"5",           //步骤类型：1-文字输入、2-上传照片、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                                            "description":"****",     //反馈描述
                                            "photos":["key","key"],   //图片key
                                            "executor_id":"***",       //执行人Id
                                            "operate_time" :20180505050505         //操作时间，yyyyMMddHHmmss
                                        },
                                        ], 
                                        "executors":["name1","name2"] ,    //执行人
                                    },
                                ],
                                "desc_photos":["key1","key2"],    //描述中的图片
                                "desc_sops":[                 //描述中涉及的sop，如果有子对象时，则子对象中sop_id、sop_name、version皆非空	
                                    {
                                        "sop_id":"***",          //sop的id
                                        "sop_name":"对象名称1",   //sop名称
                                        "version":"V1.3"        //sop版本
                                    },
                                ],
                        
                            },
                        ],    
                        "wo_exec_controls":_.range(1,10).map(function(){
                            return {
                                "control_code":b[_.random(0,14)],         //控制模块编码,名称查询数据字典
                                "control_name":"***",         //控制模块名称,名称查询数据字典
                                "operator_id":"***",          //操作人id
                                "operator_name":"***",        //操作人名字
                                "operate_time":"***",   	  //操作时间, yyyyMMddHHmmss
                                "opinion" :"***",             //意见
          
          
                                "apply_type":"finish",		  //申请类型，finish-正常结束，stop-异常结束   "申请结束" 控制模块专用
          
                                "audit_result" :"0",        //审核结果,1-通过，0-不通过   所有的"审核"，"审批"控制模块专用
          
          
                                "domains":["***","***"],	  //专业code数组   "申请加人","审核加人","审批加人"控制模块专用
                                "domain_names":["***","***"], //专业名称数组   "申请加人","审核加人","审批加人"控制模块专用
                                "person_num":"5",             //所加的人数   "申请加人","审核加人","审批加人"控制模块专用
                                "person_ids":["***","***"],   //所加的人员id数组 "申请加人","审核加人","审批加人"控制模块专用
                                "person_names":["***","***"],   //所加的人员名称数组 "申请加人","审核加人","审批加人"控制模块专用
          
                                "delay_hour":"5",             //延期小时数  "申请延期","审核延期","审批延期"控制模块专用
          
                                "replace_person_id":"***",    //更换人员id   "申请换人","审核换人","审批换人"控制模块专用
                                "replace_person_name":"***",    //更换人员名称   "申请换人","审核换人","审批换人"控制模块专用
                                "create_time":"***"           //操作时间, yyyyMMddHHmmss
                            }
                        }),
        
        
        
                        "publish_time":"20170620093000",    //发布时间，yyyyMMddhhmmss
                        "create_time":"20170620093000",     //创建时间，yyyyMMddhhmmss ,非空
                        "close_time":"20170620093000",      //结束时间，yyyyMMddhhmmss
                        "valid":true                        //有效状态 true：有效，false：失效 ,非空
        
        
                    }
                    return obj
                }
            },
        
            // 获取作废工单计划列表
            {
                name:"DP",
                url :"/workorder/restWoPlanService/queryDestroyedWoPlanList",
                severName:"baseServiceUrl",
            },
            // 获取工单计划发出的工单列表
            {
                name:"PWO",
                url :"/workorder/restWoPlanService/queryWoListByPlanId",
                severName:"baseServiceUrl",
                faker:false,
                data : function(){
                    return _.range(_.random(30,300)).map(function(item){
                        return {
                            "order_id": "Wo13010200011508943600226",
                            "create_time": _.random(2013,2019) + _.random(1,12) + _.random(1,31) + _.random(0,60) +_.random(0,60) + _.random(0,60),
                            "close_time": _.random(2013,2019) + _.random(1,12) + _.random(1,31) + _.random(0,60) +_.random(0,60) + _.random(0,60),
                            "participants": "",
                            "order_state_name": "待开始"
                          }
                    })
                }
            },
            // 查询工单计划详细信息
            {
                name:"OPI",
                url :"/workorder/restWoPlanService/queryWoPlanById",
                severName:"baseServiceUrl",
            },
            // 获取工单计划改变历史列表
            {
                name:"PCH",
                url :"/workorder/restWoPlanService/queryWoPlanHisList",
                severName:"baseServiceUrl",
            },
            // 作废工单计划
            {
                name:"DOP",
                url :"/workorder/restWoPlanService/destroyWoPlanById",
                severName:"baseServiceUrl",
            },
            // 查询集团计划详细信息
            {
                name:"GPI",
                url :"/workorder/restGroupPlanService/queryGroupPlanById",
                severName:"baseServiceUrl",
            },
            // 获取集团计划列表
            {
                name:"GPL",
                url :"/workorder/restGroupPlanService/queryGroupPlanListForProject",
                severName:"baseServiceUrl",
                faker:false,
                data : function(){
                    return _.range(_.random(10,100)).map(function(item){
                        return {
                            "group_plan_id":"***",            //集团计划id
                            "group_plan_name":"***",          //集团计划名称
                            "order_type": "***",              //工单类型编码
                            "order_type_name": "***" + item,         //工单类型名称
                            "freq_cycle":"m",                 //计划频率-周期，y/m/w/d
                            "freq_num":item,                   //计划频率-次数，n
                            "urgency":"高",                   //紧急程度 ，高、中、低
                            "use_status":_.random(1,2)                  //引用状态，1-已引用，2-未引用
                        }
                    })
                }
            },
            // 作废集团计划
            {
                name:"DGP",
                url :"/workorder/restGroupPlanService/destroyGroupPlanById",
                severName:"baseServiceUrl",
            },
        ],
        argu:{
            // "user_id": "620bcbd9-b692-4202-877d-f772d1ba4f5c",
            "user_id":"systemId",
            // "customer_id": "",
        }
    }
    // planManageAjax
    window.PMA ? console.error("计划模块的AJAX集合名PMA被占用，方法createPlanModuleController") : window.PMA = createAjax(PML);
    // planManagePromise
    window.PMP ? console.error("计划模块的Promise集合名PMP被占用，方法createPlanModuleController") : window.PMP = cteatePromise(PML);
}