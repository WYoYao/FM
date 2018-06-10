controller.push([
    {
        //  获取预览页面
        name: "queryObjectByClass",
        url: "restObjectService/queryObjectByClass",
        argu: {
        },
        convert: addSelected
    },
    {
        name: "querySopDetailById",
        url: "restSopService/querySopDetailById",
    },
    {
        name: "getWoMattersWorkOrderPreview",
        url: "workorder/restWorkOrderService/getWoMattersPreview",
        configServiceName: "baseServiceUrl",
    },
    {//新建工单-查询岗位下的人员列表
        name: "queryPersonListByPositionIds",
        url: "restPersonService/queryPersonListByPositionIds",
        argu: {
            "filter_scheduling": false,
            "limit_domain": false
        },
        cb: function () {
            return _.range(20).map(index => {
                return {
                    position_id: "岗位id" + index,
                    position_name: "岗位名称" + index,
                    persons: _.range(20).map(i => {
                        return {
                            "person_id": index + "员工id" + i,                //员工id
                            "name": index + "姓名" + i,                     //姓名 
                        };
                    })
                }
            })
        },
        convert: function (res) {

            return addSelected(res).map(function (item) {
                item.persons = addSelected(item.persons);
                return item;
            });
        }
    },
    {
        // 获取工单预览
        name: "getWoMattersPreview",
        url: "restWoPlanService/getWoMattersPreview",
        cb: function () {
            //=====================
            return _.range(2).map((i0) => {
                // i0
                return {
                    "$ID": "$ID" + i0,                  //引擎需要的id，同matter_id，后台使用
                    "matter_id": "matter_id" + i0,            //事项id ,非空
                    "matter_name": "matter_name" + i0,          //事项名称 ,非空
                    "description": "description 事项概述" + i0,          //事项概述
                    "matter_steps": [              //事项步骤 ,非空	
                        {
                            "$ID": "$ID" + i0,            //引擎需要的id，同obj_step_id，后台使用
                            "obj_step_id": "obj_step_id" + 1,    //对象步骤id ,非空
                            "obj_id": "obj_id" + 1,         //对象id，可能为空
                            "obj_name": "obj_name" + 2,       //对象名称 ，可能为空
                            "obj_finish": false,     //对象工作是否完成
                            "steps": [{
                                "$ID": "$ID" + i0,                 //引擎需要的id，step_id，后台使用
                                "step_id": "step_id",             //步骤id,obj_step_id+"_"+step_sequence组成 ,非空
                                "step_sequence": "1-1",       //步骤序号  ,非空
                                "step_type": "3",             //步骤类型:1-文字输入、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                                "step_finish": true,          //步骤工作是否完成
                                "content": "到达指定位置拍照"    //操作内容描述
                            },
                            {
                                "$ID": "$ID" + i0,                 //引擎需要的id，step_id，后台使用
                                "step_id": "",             //步骤id,obj_step_id+"_"+step_sequence组成 ,非空
                                "step_sequence": "1-2",       //步骤序号  ,非空
                                "step_type": "4",             //步骤类型:1-文字输入、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                                "step_finish": true,          //步骤工作是否完成
                                "content": "到达指定位置扫码"    //操作内容描述 
                            }].concat(
                                _.range(_.random(1, 3)).map(index => {
                                    index = index + 3;
                                    return {
                                        "$ID": index,                 //引擎需要的id，step_id，后台使用
                                        "step_id": "",             //步骤id,obj_step_id+"_"+step_sequence组成 ,非空
                                        "step_sequence": "1-" + index,       //步骤序号  ,非空
                                        "step_type": "5",             //步骤类型:1-文字输入、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                                        "pre_conform": "强制确认",         //强制确认
                                        "content": "操作内容",             //操作内容
                                        //工作内容中涉及的对象,如果有子对象时，则子对象中obj_id、obj_name、obj_type皆非空
                                        "content_objs": _.range(_.random(2, 5)).map(ii => {
                                            return {
                                                "obj_id": "obj_id" + ii,           //对象id
                                                "obj_name": "对象名称" + ii,    //对象名称
                                                "obj_type": "obj_type" + ii        //对象类型,子项见后边
                                            }
                                        }),
                                        "notice": "注意事项",                //注意事项
                                        "confirm_result": _.range(_.random(2, 5)).map(ix => {  //需确认的操作结果，如果有子对象时，则子对象中obj_id、obj_name、obj_type皆非空
                                            return {
                                                "obj_id": "obj_id" + ix,
                                                "obj_name": "obj_name" + ix,
                                                "obj_type:": "obj_type" + ix,
                                                "parents": [
                                                    { "parent_ids": _.range(3).map(index => 1 + index), "parent_names": _.range(3).map(index => '层数' + 1 + index) }
                                                ],
                                                "info_points": _.range(2).map(index => { //信息点组件数据，如果有子对象时，则子对象中id、code、name、cmpt皆非空    
                                                    return {
                                                        "id": "id" + index, "code": "code" + index, "name": "name" + index, "unit": "unit", "cmpt": "Numberentry02",
                                                        "wrong_ranges": [{ "type": "gt", "values": "12" }, { "type": "lt", "values": "6" }]
                                                    };
                                                }).concat(
                                                    _.range(2).map(index => {
                                                        return {
                                                            "id": "id" + index, "code": "code" + index, "name": "name" + index, "unit": "unit", "cmpt": "Multiselect01",
                                                            "cmpt_data": [{ "code": "", "name": "" }], "wrongs": ["选项1", "选项2"]
                                                        };
                                                    })
                                                ),
                                                "customs": [//自定义项，type:1-文本、2-单选、3-多选、4-无单位的数字、5-有单位的数字，如果有子对象时，则子对象中name、type皆非空
                                                    { "name": "确认信息2", "type": "1" },
                                                    { "name": "确认信息2", "type": "1" },
                                                    { "name": "确认信息2", "type": "2", "items": ["选项1", "选项2", "选项3"], "wrongs": ["选项1", "选项2"] },
                                                    { "name": "确认信息3", "type": "3", "items": ["选项1", "选项2", "选项3"], "wrongs": ["选项1", "选项2"] },
                                                    //非区间异常的type项有:gt-大于,gte-大于等于，lt-小于,lte-小于等于,区间的type项为range,满足一个子项就认为出现异常
                                                    { "name": "确认信息4", "type": "4", "wrong_ranges": [{ "type": "gt", "values": "12" }, { "type": "lt", "values": "6" }] },
                                                    { "name": "确认信息5", "type": "5", "unit": "", "wrong_ranges": [{ "type": "range", "values": ["12", "20"] }] }
                                                ]
                                            }
                                        }),
                                        "domain": "专业code",               //专业code
                                        "domain_name": "专业名称"           //专业名称
                                    }
                                })
                            ).concat([{
                                "$ID": "$ID",                 //引擎需要的id，step_id，后台使用
                                "step_id": "step_id",             //步骤id,obj_step_id+"_"+step_sequence组成 ,非空
                                "step_sequence": "1-100",       //步骤序号  ,非空
                                "step_type": "6",             //步骤类型:1-文字输入、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                                "content": "结束该事项时签字"   //操作内容描述 
                            }]),
                            "feedback": [                     //反馈信息
                                {
                                    "$ID": "*",              //引擎需要的id，同step_id，后台使用
                                    "step_id": "",            //步骤id ,非空
                                    "step_sequence": "1-1",      //步骤序号  ,非空
                                    "step_type": "3",            //步骤类型:1-文字输入、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                                    "step_finish": true,         //步骤工作是否完成
                                    "description": "*",      //反馈描述
                                    "photos": ["key", "key"],    //图片key
                                    "executor_id": "",        //执行人Id
                                    "operate_time": ""             //操作时间，yyyyMMddHHmmss
                                },
                                {
                                    "$ID": "*",              //引擎需要的id，同step_id，后台使用
                                    "step_id": "",            //步骤id ,非空
                                    "step_sequence": "2-1",      //步骤序号 ,非空
                                    "step_type": "5",            //步骤类型:1-文字输入、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                                    "step_finish": true,         //步骤工作是否完成
                                    "pre_conform_result": "前提已确认",	//前提确认结果
                                    "description": "*",      //反馈描述
                                    "confirm_result": [	        //需确认的操作结果，如果有子对象时，则子对象中obj_id、obj_name皆非空
                                        {
                                            "obj_id": "",
                                            "obj_name": "",
                                            "info_points": [		//信息点信息反馈，如果有子对象时，则子对象中code、name、cmpt皆非空
                                                {
                                                    "id": "id", "code": "code", "name": "name", "unit": "unit", "value": "123", "cmpt": "Numberentry02",
                                                    "wrong_ranges": [{ "type": "gt", "values": "12" }, { "type": "lt", "values": "6" }],
                                                    "info_point_value_status": "1"                                //0-正常 1-异常
                                                },
                                                {
                                                    "id": "id", "code": "code", "name": "name", "unit": "unit", "values": ["123", "456"], "cmpt": "Multiselect01",
                                                    "cmpt_data": [{ "code": "", "name": "" },], "wrongs": ["选项1", "选项2"],
                                                    "info_point_value_status": "1"                                //0-正常 1-异常
                                                }

                                            ],
                                            "customs": [//自定义项反馈，type:1-文本、2-单选、3-多选、4-无单位的数字、5-有单位的数字，如果有子对象时，则子对象中name、type皆非空
                                                { "name": "确认信息2", "type": "1", "content": "*" },
                                                { "name": "确认信息2", "type": "2", "item": ["选项1", "选项2"], "wrongs": ["选项1", "选项2"] },
                                                { "name": "确认信息3", "type": "3", "items": ["选项1", "选项2"], "wrongs": ["选项1", "选项2"] },
                                                //非区间异常的type项有:gt-大于,gte-大于等于，lt-小于,lte-小于等于,区间的type项为range,满足一个子项就认为出现异常
                                                { "name": "确认信息4", "type": "4", "value": "123", "wrong_ranges": [{ "type": "gt", "values": "12" }, { "type": "lt", "values": "6" }] },
                                                {
                                                    "name": "确认信息5", "type": "5", "value": "456", "unit": "", "wrong_ranges": [{ "type": "range", "values": ["12", "20"] },]
                                                }

                                            ]
                                        }
                                    ],
                                    "photos": ["key", "key"],//图片key
                                    "executor_id": "执行人Id",//执行人Id ,非空
                                    "operate_time": new Date().format('yyyyMMddHHmmss') //操作时间，yyyyMMddHHmmss ,非空
                                }
                            ],
                            "executors": ["执行人1", "执行人2"]     //执行人 ,非空
                        },
                    ],
                    "desc_photos": ['key1', 'key2'],    //描述中的图片
                    "desc_sops": [                 //描述中涉及的sop，如果有子对象时，则子对象中sop_id、sop_name、version皆非空	
                        {
                            "sop_id": "sop_id",          //sop的id
                            "sop_name": "对象名称1",   //sop名称
                            "version": "V1.3"        //sop版本
                        }
                    ],
                }
                // i0
            });
            //=====================
        },
        convert: function (res) {
            var obj = {
                matters: res,
                wo_exec_controls: [],
            }

            return obj;
        }
    },
    {
        // 验证 对象和SOP 之间的对应的关系
        name: "verifyObjectAndSop",
        url: "restSopService/verifyObjectAndSop",
        argu: {
            dict_type: "domain_require"
        },
        cb: function () {
            return _.range(20).map(index => {
                return {
                    "obj_name": "obj_name" + index,         //对象名称
                    "sop_name": "sop_name" + index          //sop名称
                }
            })
        },
        convert: addSelected
    },
    // 基础信息需要
    {//获取当前人员拥有的项目信息
        name: "queryPersonDetailByPersonId",
        url: "restPersonService/queryPersonDetailByPersonId",

        argu: {},
        // cb: function () {
        //     return {
        //         "person_id": "person_id",                //类型：String  可有字段  备注：员工id
        //         "id_number": "id_number",            //人员识别码
        //         "name": "name",                //类型：String  可有字段  备注：员工姓名
        //         "phone_num": "phone_num",                //类型：String  可有字段  备注：手机号
        //         "gender": "gender",                //类型：String  可有字段  备注：性别，male-男、female-女
        //         "birthday": "birthday",                //类型：String  可有字段  备注：出生年月 格式：yyyy-MM-dd
        //         "person_mail": "person_mail",                //类型：String  可有字段  备注：邮箱
        //         "head_portrait": "mock",                //类型：String  可有字段  备注：系统头像
        //         "project_persons": [
        //             {
        //                 "project_id": "Pj7010000002",             //项目id 
        //                 "project_local_name": "***",     //项目本地名称
        //                 "person_num": "***",             //员工编号
        //                 "position_id": "岗位ID",               //岗位
        //                 "position_name": "***",           //岗位名称
        //             }
        //         ]
        //     };
        // }
    },
    {//查询某个岗位拥有某控制模块的工单类型
        name: "queryWoTypeListByPersonIdControlCode",
        url: "workorder/restGeneralDictService/queryWoTypeListByPersonIdControlCode",
        argu: {
            // "user_id": "***", //账号id-当前登录人的账号id，必须
            "position_id": "systemPosition",                //岗位ID ，必填
            "wo_execute_type": "plan",           //工单执行类型(时间类型)，temp-临时、plan-计划，必填
            "control_code": "create",            //控制模块ID,必填，
            // "repair_flag": "1"                  //报修是否可以转此工单，  0-否，1-是，非必填
        },
        configServiceName: "baseServiceUrl",
        // cb: function () {

        //     return _.range(10).map(function (index) {
        //         return {
        //             "plan_id": "工单类型id" + index,              //工单类型id 
        //             "plan_name": "工单类型名称" + index,			//工单类型名称
        //             "work_type": "工作类型编码" + index,           //工作类型编码
        //             "work_type_name": "工作类型名称" + index,      //工作类型名称
        //             "execute_type": "时间类型编码" + index,         //时间类型编码
        //             "execute_type_name": "时间类型名称" + index,    //时间类型名称
        //             "repair_flag": "1",             //报修是否可以转此工单，  0-否，1-是
        //             "time_limit": {
        //                 "startTime": {   //到达工单要求开始时间
        //                     "selected": true, //是否选中
        //                     "around": "after", //after-后  front-前
        //                     "minute": 20 //分钟 		
        //                 },
        //                 "endTime": {   //到达工单要求结束时间
        //                     "selected": true, //是否选中
        //                     "around": "front", //after-后  front-前
        //                     "minute": 20 //分钟
        //                 }
        //             },
        //             "post_and_duty": [{
        //                 "type": "2",  //类型，2-岗位
        //                 "position_id": "岗位id",
        //                 "name": "岗位名称",
        //                 "duty": [
        //                     {
        //                         "code": "create",
        //                         "name": "新建工单",
        //                         "executie_mode": "robbing",  //下级路由方式：execute-新建后执行，assign-新建后指派，robbing-新建后抢单
        //                         "arrival_time_allow_execute": false,  //到达工单要求开始时间时才允许执行
        //                         "limit_domain": false,  //请选择是否启用专业控制
        //                         "next_route": [  //根据下级路由方式选择下级路由岗位 execute-执行，assign-指派，robbing-执行
        //                             { "type": "2", "position_id": "岗位id", "name": "岗位名称" },
        //                             { "type": "2", "position_id": "岗位id", "name": "岗位名称" }
        //                         ]
        //                     }
        //                 ]
        //             }],        //岗位职责
        //         }
        //     })
        // },
        convert: addSelected,
    },
    {//查询工单类型             
        name: "queryWoTypeList",
        url: "restGeneralDictService/queryWoTypeList",
        argu: {
            "work_type": "work_type",
            "wo_execute_type": "plan",
        }
    },
    //  事项管理需要
    {
        //  根据关键字查詢
        name: "queryGeneralDictByKey",
        url: "restGeneralDictService/queryGeneralDictByKey",
        argu: {
            dict_type: "wo_control_require"
        },
        convert: addSelected,
    },
    // @ 输入框需要
    {// 查询通用系统类
        name: 'universalSystem',
        url: 'sop/restObjectService/querySystemClass',
        configServiceName: "baseServiceUrl",
        argu: { need_back_parents: true },
        // cb: function () {
        //     return _.range(10).map(index => {
        //         return {
        //             "obj_id": "专业编码" + index,            //专业编码
        //             "obj_name": "专业名称" + index,         //专业名称
        //             "content": _.range(20).map(i => {
        //                 return {
        //                     "obj_id": index + "系统类型编码" + i,              //系统类型编码
        //                     "obj_name": index + "系统类型名称" + i,    //系统类型名称
        //                     "parents": []
        //                 }
        //             }),
        //         }
        //     })
        // },
        convert: function (res) {
            return addSelected(res).map(function (item) {

                item.content = item.content.map(function (info) {
                    info.obj_type = "system_class";
                    return info;
                })
                return item;
            })
        }
    },
    {// 查询通用设备类
        name: 'universalEquipment',
        url: 'sop/restObjectService/queryEquipClass',
        configServiceName: "baseServiceUrl",
        argu: { need_back_parents: true },

        // cb: function () {
        //     return _.range(10).map(index => {
        //         return {
        //             "obj_id": "专业编码" + index,            //专业编码
        //             "obj_name": "专业名称" + index,         //专业名称
        //             "content": _.range(20).map(i => {
        //                 return {
        //                     "obj_id": index + "系统类型编码" + i,              //系统类型编码
        //                     "obj_name": index + "系统类型名称" + i,    //系统类型名称
        //                     "content": _.range(20).map(x => {
        //                         return {
        //                             "obj_id": index + "设备类型编码" + i + x,              //系统类型编码
        //                             "obj_name": index + "设备类型名称" + i + x,    //系统类型名称
        //                             "content": []
        //                         }
        //                     })
        //                 }
        //             }),
        //         }
        //     })
        // },
        convert: function (list) {
            list = addSelected(list);
            list = list.map(function (item) {
                item.content = item.content.map(function (info) {

                    info.child = info.content;
                    info.child = info.child.map(function (x) {
                        x.obj_type = "equip_class";
                        return x;
                    })
                    info.content = [];
                    return info;
                })
                return item;
            })
            return list;
        }
    },
    {// 查询通用空间功能类型
        name: 'universalSpace',
        url: 'sop/restObjectService/querySpaceClass',
        configServiceName: "baseServiceUrl",
        argu: { need_back_parents: true },
        // cb: function () {
        //     return _.range(10).map(index => {
        //         return {
        //             "obj_id": "对象编码A" + index,            //专业编码
        //             "obj_name": "对象名称A" + index,         //专业名称
        //             "content": _.range(20).map(i => {
        //                 return {
        //                     "obj_id": index + "对象编码B" + i,              //系统类型编码
        //                     "obj_name": index + "对象名称B" + i,    //系统类型名称
        //                     "content": _.range(20).map(x => {
        //                         return {
        //                             "obj_id": index + "对象编码C" + i + x,              //系统类型编码
        //                             "obj_name": index + "对象编码C" + i + x,    //系统类型名称
        //                             "content": []
        //                         }
        //                     })
        //                 }
        //             }),
        //         }
        //     })
        // },
        convert: function (res) {
            return addSelected(res).map(function (item) {

                item.obj_type = "space_class";
                item.content = item.content.map(function (info) {

                    info.obj_type = "space_class";
                    info.content = info.content.map(function (x) {
                        x.obj_type = "space_class";
                        return x;
                    })
                    return info;
                })
                return item;
            })
        }
    },
    {
        // 查询建筑
        name: "Build",
        url: "restObjectService/queryBuild",
        argu: {},
        cb: function () {
            return _.range(20).map(index => {
                return {
                    "obj_id": "obj_id" + index,
                    "obj_name": "obj_name" + index
                }
            })
        },
        convert: addSelected
    },
    {
        // 查询楼层
        name: "Floor",
        url: "restObjectService/queryFloor",
        argu: { need_back_parents: true },
        convert: addSelected
    },
    {
        // 查询房间
        name: "Room",
        url: "restObjectService/queryFloor",
        argu: { need_back_parents: true }
    },
    {
        // 查询空间
        name: "Space",
        url: "restObjectService/querySpace",
        argu: { need_back_parents: true },
        convert: addSelected
    },
    {
        //  查询系统
        name: "System",
        url: "restObjectService/querySystem",
        argu: { need_back_parents: true },
        cb: function () {
            return _.range(20).map(index => {
                return {
                    "obj_id": "专业编码" + index,            //专业编码
                    "obj_name": "专业名称" + index,         //专业名称
                    "content": _.range(10).map(i => {
                        return {
                            "obj_id": "系统类型编码" + i,              //系统类型编码
                            "obj_name": "中央供冷系统" + i,   //系统类型名称
                            "parents": [
                                { "parent_ids": ["专业编码" + index], "parent_names": ["专业名称" + index] }
                            ]
                        }
                    })
                };
            })
        },
        convert: addSelected
    },
    {
        //  查询设备 需要查询空间树
        name: "BuildFloorSpaceTree",
        url: "restObjectService/queryBuildFloorSpaceTree",
        argu: { dict_type: "domain_require" }
    },
    {
        //  查询设备 需要查询查询设备专业
        name: "GeneralDict",
        url: "restGeneralDictService/queryGeneralDictByKey",
        argu: { dict_type: "domain_require" }
    },
    {
        //  查询设备专业系统
        name: "GeneralSystem",
        url: "restObjectService/querySystemForSystemDomain",
    },
    {
        //  查询设备
        name: "EquipList",
        url: "restObjectService/queryEquip",
        argu: { need_back_parents: true },
        convert: addSelected
    },
    {
        //  查询部件 
        name: "Part",
        url: "restObjectService/queryTempObjectList",
        argu: { obj_type: "2" },
        convert: addSelected
    },
    {
        //  查询工具
        name: "Tool",
        url: "restObjectService/queryTempObjectList",
        argu: { obj_type: "3" },
        convert: addSelected
    },
    {
        //  检查自定义是否存在
        name: "Exist",
        url: "restObjectService/existTempObjectWithType",
        argu: {},
    },
    {
        //  保存自定义
        name: "Add",
        url: "restObjectService/addTempObjectWithType",
        argu: {},
    },
    {
        //  根据关键字查詢
        name: "searchObjectClass",
        url: "saas/restObjectService/searchObjectClass",
        configServiceName: "baseServiceUrl",
        argu: {},
        convert: addSelected
    },
    {
        //  根据关键字查詢
        name: "searchObject",
        url: "restObjectService/searchObject",
        argu: {},
        convert: addSelected
    },
    //  # SOP 需要
    {
        // 查询推荐 SOP
        name: "queryRecommendSop",
        url: "workorder/restSopService/queryRecommendSop",
        configServiceName: "baseServiceUrl",
        argu: {},
        convert: addSelected
    },
    {
        // 根据搜索的内容查询对应的sop
        name: "querySopListForSel",
        url: "restSopService/querySopListForSel",
        argu: {
            need_return_criteria: true,
        },
        cb: function () {
            return [{
                "criteria": {
                    "equip_model_ids": _.range(5).map(index => "品牌" + index),     //品牌
                    "labels": _.range(5).map(index => "标签" + index),     //自定义标签
                    "order_type": _.range(5).map(function (index) {
                        return {
                            "code": "code" + index,
                            "name": "name" + index,
                        };
                    }),
                    "fit_objs": _.range(5).map(function (index) {
                        return {
                            "obj_id": "obj_id" + index,
                            "obj_name": "obj_name" + index,
                        };
                    })
                },
                "content": _.range(20).map(index => {
                    return {
                        "sop_id": "sop_id" + index,         //sop的主键id、sop编号
                        "sop_name": "sop_name" + index,       //sop的名字
                        "version": "V1.3"          //当前版本号
                    };
                })
            }];
        },
        convert: function (res) {
            return {
                criteria: res.criteria,
                res: addSelected(res.content).map(function (params) {
                    return params;
                })
            }
        }
    },
    // 添加工作内容
    {
        // 专业列表
        name: "GeneralDictByKey",
        url: "restGeneralDictService/queryGeneralDictByKey",
        argu: {
            dict_type: "domain_require"
        },
        convert: addSelected
    },
    {
        name: "queryInfoPointForObject",
        url: "restObjectService/queryInfoPointForObject",
        argu: {},
        cb: function () {
            return _.range(20).map(index => {
                return {
                    "id": "信息点id" + index,       //信息点id
                    "code": "信息点编码" + index,     //信息点编码
                    "name": "信息点名称" + index,     //信息点名称
                    "unit": "信息点单位" + index,     //信息点单位
                    "cmpt": ['Radio01', 'Multiselect01', 'Numberentry01', 'Numberentry02', 'Textentry01'][index % 4],     //App端使用的组件
                    "cmpt_data": _.range(20).map(index => {             //组件数据源，用于列表选择
                        return { "code": "code" + index, "name": "name" + index };
                    })
                }
            })
        },
        convert: addSelected
    },
    {
        //  根据关键字查詢
        name: "searchInfoPoint",
        url: "restObjectService/searchInfoPoint",
        argu: {},
        convert: addSelected
    },
    {   //事件转工单发布
        name: "publishEventTranOrder",
        url: "workorder/restWoPlanService/saveWorkOrderForEventPC",
        configServiceName: "baseServiceUrl",
        argu: {},
        convert: addSelected
    }
]
    // 开发时使用后面需要删除
    // .map(item => {
    //     let { argu = {} } = item;
    //     item.argu = Object.assign({}, USER, argu);
    //     return item;
    // })
);

