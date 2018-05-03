var AllLink = {
    // 获取所有工单状态
    "orderState" : "restGeneralDictService/queryWorkOrderState",
    // 获取工作类型
    "workType" :"restGeneralDictService/queryGeneralDictByKey",
    // 查询集团计划引用数量
    "groupPlanUse" : "restWoPlanService/queryGroupPlanUseNum",
    
    // 获取周月季年工单数据
    "planOrder":"restWoPlanService/queryWoPlanExecuteList",
    // 获取日工单数据
    "dayOrder":"restWoPlanService/queryWoPlanDayExecuteList",
    // 获取工单详情
    "orderDetail":"restWoMonitorService/queryWorkOrderById",

    // 获取作废工单计划列表
    "dumpedPlan":"restWoPlanService/queryDestroyedWoPlanList",
    // 获取工单计划发出的工单列表
    "planWorkOrder":"restWoPlanService/queryWoListByPlanId",
    // 查询工单计划详细信息
    "orderPlanInfo" : "restWoPlanService/queryWoPlanById",
    // 获取工单计划改变历史列表
    "planChangeHistory":"restWoPlanService/queryWoPlanHisList",
    // 作废工单计划
    "deleteOrderPlan":"restWoPlanService/destroyWoPlanById",


    // 查询集团计划详细信息
    "groupPlanInfo" : "restGroupPlanService/queryGroupPlanById",
    // 获取集团计划列表
    "groupPlanList":"restGroupPlanService/queryGroupPlanListForProject",
    // 作废集团计划
    "deleteGroupPlan":"restGroupPlanService/destroyGroupPlanById",
}
var customParam = {
    "user_id": "RY1505218031651",
    "customer_id": "",
    "project_id": "Pj1301020001",
}

function cteatePromise(arr) {
    var c = arr.map(function(model){
        return {url:AllLink[model.name],data:Object.assign({},model.data,customParam)}
    })
    return c.map(function(item){
        return new Promise(function (resovle, reject) {
            pajax.post({
                url: item.url,
                data: item.data,
                success: resovle,
                error: reject,
                complete: function (){}
            });
        })
    })
};

function ajx(name,data,success,err,complete){
    pajax.post({
        url: AllLink[name],
        data: Object.assign({},data,customParam),
        success: success,
        error: err,
        complete: complete
    });
}




window.xx = {
    "order_id":"***",                   //工单id ,非空
    "project_id":"***",                 //项目id ,非空
    "order_type":"***",                 //工单类型 ,非空
    "order_type_name":"***",            //工单类型名称 ,非空
    "execute_type":"***",               //工单执行类型编码,temp-临时、plan-计划、all-全部  ,非空
    "urgency":"***",                    //紧急程度，高、中、低
    "executie_mode" :"***",             //工单执行方式编码,1-单人串行、2-多人并行  ,非空
    "start_time_type":"1",              //开始时间类型,1-发单后立即开始，2-自定义开始时间
    "ask_start_time":"20170620180000",  //要求开始时间,yyyyMMddhhmmss  ,非空
    "ask_end_limit":"2",                //要求固定时间内完成,单位小时
    "ask_end_time":"20170622180000",    //要求结束时间,yyyyMMddhhmmss  ,非空
    "required_tools":["***","***"],     //所需工具
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
    "wo_exec_controls":[                //执行控制信息
        {
          "$ID":"****",                 //引擎需要的id，同exec_control_id，后台使用
          "exec_control_id":"***",
          "control_code":"***",         //控制模板编码,名称查询数据字典 ,非空
          "operator_id":"***",          //操作人id ,非空
          "operator_name":"***",        //操作人名字 ,非空
          "operate_start_time":"***",   //操作开始时间, yyyyMMddHHmmss ,非空
          "operate_end_time":"***",     //操作结束时间, yyyyMMddHHmmss
          "apply_type":"finish",        //申请类型，finish-正常结束，stop-中止
          "audit_result" :"***",        //审核结果,1-通过，0-不通过
          "opinion" :"***",             //意见
          "next_route":["xx岗位","张杰" ], //下级路由
          "create_time":"***"           //操作时间, yyyyMMddHHmmss
        },
    ],    
    "publish_time":"20170620093000",    //发布时间，yyyyMMddhhmmss
    "create_time":"20170620093000",     //创建时间，yyyyMMddhhmmss ,非空
    "close_time":"20170620093000",      //结束时间，yyyyMMddhhmmss
    "valid":true                        //有效状态 true：有效，false：失效 ,非空
}