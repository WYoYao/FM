var a = [                         //工单事项 ,非空
    {
        "$ID": "***",                  //引擎需要的id，同matter_id，后台使用
        "matter_id": "***",            //事项id ,非空
        "matter_name": "***",          //事项名称 ,非空
        // 跟@的对象对应 签字多一个
        "matter_steps": [              //事项步骤 ,非空	
            {
                "$ID": "***",            //引擎需要的id，同obj_step_id，后台使用
                "obj_step_id": "***",    //对象步骤id ,非空
                "description": "***",    //事项概述
                "obj_id": "***",         //对象id，可能为空     ==> matter_obj_id 我的工单-新增页:预览工单-查询大类下的对象实例
                "obj_name": "***",       //对象名称 ，可能为空
                "steps": [               //步骤 ,非空
                    {
                        "$ID": "***",                 //引擎需要的id，step_id，后台使用
                        "step_id": "***",             //步骤id,obj_step_id+"_"+step_sequence组成 ,非空
                        "step_sequence": "1-1",       //步骤序号  ,非空
                        "step_type": "3",             //步骤类型：1-文字输入、2-上传照片、3-拍照、4-扫码、5-工作内容、6-签字,非空
                        "content": "到达指定位置拍照"    //操作内容描述
                    },
                    {
                        "$ID": "***",                 //引擎需要的id，step_id，后台使用
                        "step_id": "***",             //步骤id,obj_step_id+"_"+step_sequence组成,非空
                        "step_sequence": "1-2",       //步骤序号 ,非空
                        "step_type": "4",             //步骤类型：1-文字输入、2-上传照片、3-拍照、4-扫码、5-工作内容、6-签字,非空
                        "content": "到达指定位置扫码"    //操作内容描述
                    },
                    {
                        "$ID": "***",                 //引擎需要的id，step_id，后台使用
                        "step_id": "***",             //步骤id,obj_step_id+"_"+step_sequence组成,非空
                        "step_sequence": "2-1",       //步骤序号 ,非空
                        "step_type": "5",             //步骤类型：1-文字输入、2-上传照片、3-拍照、4-扫码、5-工作内容、6-签字,非空
                        "pre_conform": "***",         //强制确认
                        "content": "***",             //操作内容
                        //操作内容中涉及的对象,如果有子对象时，则子对象中obj_id、obj_name、obj_type皆非空
                        "content_objs": [
                            {
                                "obj_id": "***",           //对象id
                                "obj_name": "对象名称1",    //对象名称
                                "obj_type": "equip"        //对象类型,子项见后边
                            },
                        ],
                        "notice": "***",                //注意事项
                        "confirm_result": [	          //需确认的操作结果，如果有子对象时，则子对象中obj_id、obj_name、obj_type皆非空
                            {
                                "obj_id": "*** ",   //==> obj_id 我的工单-新增页:预览工单-查询大类下的对象实例
                                "obj_name": "*** ",
                                "obj_type": "***",  //==>obj_type 我的工单-新增页:预览工单-查询大类下的对象实例
                                "parents": [
                                    { "parent_ids": ["***", "***", "***"], "parent_names": ["建筑1", "楼层1", "空间"] },
                                    { "parent_ids": ["***", "***"], "parent_names": ["专业1", "系统1"] }
                                ],
                                "info_points": [			//信息点组件数据，如果有子对象时，则子对象中id、code、name皆非空
                                    {
                                        "id": "***", "code": "***", "name": "***", "unit": "***", "cmpt": "Numberentry02",
                                        "wrong_ranges": [{ "type": "gt", "values": "12" }, { "type": "lt", "values": "6" }]
                                    },
                                    {
                                        "id": "***", "code": "***", "name": "***", "unit": "***", "cmpt": "Multiselect01",
                                        "cmpt_data": [{ "code": "***", "name": "***" }], "wrongs": ["选项1", "选项2"]
                                    }
                                ],
                                "customs": [//自定义项，type：1-文本、2-单选、3-多选、4-无单位的数字、5-有单位的数字，如果有子对象时，则子对象中name、type皆非空
                                    { "name": "确认信息2", "type": "1" },
                                    { "name": "确认信息2", "type": "2", "items": ["选项1", "选项2", "选项3"], "wrongs": ["选项1", "选项2"] },
                                    { "name": "确认信息3", "type": "3", "items": ["选项1", "选项2", "选项3"], "wrongs": ["选项1", "选项2"] },
                                    //非区间异常的type项有：gt-大于,gte-大于等于，lt-小于,lte-小于等于,区间的type项为range,满足一个子项就认为出现异常
                                    { "name": "确认信息4", "type": "4", "wrong_ranges": [{ "type": "gt", "values": "12" }, { "type": "lt", "values": "6" }] },
                                    {
                                        "name": "确认信息5", "type": "5", "unit": "***", "wrong_ranges": [{ "type": "range", "values": ["12", "20"] }]
                                    }
                                ]
                            }
                        ],
                        "domain": "***",               //专业code
                        "domain_name": "***"           //专业名称
                    },
                    {
                        "$ID": "***",
                        "step_id": "***",
                        "step_sequence": "2-2",
                        "step_type": "5",
                        "pre_conform": "***",
                        "content": "***",
                        //操作内容中涉及的对象
                        "content_objs": [
                            {
                                "obj_id": "***",         //对象id
                                "obj_name": "对象名称1",  //对象名称
                                "obj_type": "equip"      //对象类型,子项见后边
                            }
                        ],
                        "notice": "***",
                        "confirm_result": [
                            {
                                "obj_id": "*** ",
                                "obj_name": "*** ",
                                "obj_type": "***",
                                "parents": [
                                    { "parent_ids": ["***", "***", "***"], "parent_names": ["建筑1", "楼层1", "空间"] },
                                    { "parent_ids": ["***", "***"], "parent_names": ["专业1", "系统1"] }
                                ],
                                "info_points": [
                                    {
                                        "id": "***", "code": "***", "name": "***", "unit": "***", "cmpt": "Numberentry02",
                                        "wrong_ranges": [{ "type": "gt", "values": "12" }, { "type": "lt", "values": "6" }]
                                    },
                                    {
                                        "id": "***", "code": "***", "name": "***", "unit": "***", "cmpt": "Multiselect01",
                                        "cmpt_data": [{ "code": "***", "name": "***" },], "wrongs": ["选项1", "选项2"]
                                    }
                                ],
                                "customs": [//自定义项，type：1-文本、2-单选、3-多选、4-无单位的数字、5-有单位的数字
                                    { "name": "确认信息2", "type": "1" },
                                    { "name": "确认信息2", "type": "2", "items": ["选项1", "选项2", "选项3"], "wrongs": ["选项1", "选项2"] },
                                    { "name": "确认信息3", "type": "3", "items": ["选项1", "选项2", "选项3"], "wrongs": ["选项1", "选项2"] },
                                    //非区间异常的type项有：gt-大于,gte-大于等于，lt-小于,lte-小于等于,区间的type项为range,满足一个子项就认为出现异常
                                    { "name": "确认信息4", "type": "4", "wrong_ranges": [{ "type": "gt", "values": "12" }, { "type": "lt", "values": "6" }] },
                                    {
                                        "name": "确认信息5", "type": "5", "unit": "***", "wrong_ranges": [{ "type": "range", "values": ["12", "20"] }]
                                    }
                                ]
                            },

                        ],
                        "domain": "***",              //专业code
                        "domain_name": "***"          //专业名称
                    },

                ]
            },
            {
                "$ID": "***",            //引擎需要的id，同obj_step_id，后台使用
                "obj_step_id": "***",    //对象步骤id ,非空
                "steps": [               //步骤 ,非空
                    {
                        "$ID": "***",                 //引擎需要的id，step_id，后台使用
                        "step_id": "***",             //步骤id,obj_step_id+"_"+step_sequence组成 ,非空
                        "step_sequence": "3-1",       //步骤序号  ,非空
                        "step_type": "6",             //步骤类型：1-文字输入、2-上传照片、3-拍照、4-扫码、5-工作内容、6-签字  ,非空
                        "content": "结束该事项时签字"   //操作内容描述
                    }
                ]
            },
        ],
        "desc_photos": [key1, key2],    //描述中的图片
        "desc_sops": [                 //描述中涉及的sop，如果有子对象时，则子对象中sop_id、sop_name、version皆非空	
            {
                "sop_id": "*** ",          //sop的id
                "sop_name": "对象名称1",   //sop名称
                "version": "V1.3"        //sop版本
            },
        ],

    },
]



var b = {
    "next_route": [
        {
            "name": "JAVA",
            "persons": [
                {
                    "name": "666",
                    "person_id": "RY1505456973449",
                    "selected": true,
                    "type": "3"
                },
                {
                    "name": "rtre",
                    "person_id": "RY1505443926873",
                    "selected": true,
                    "type": "3"
                },
                {
                    "name": "888",
                    "person_id": "RY1505456867173",
                    "selected": true,
                    "type": "3"
                },
                {
                    "name": "cs离职",
                    "person_id": "RY1510043027998",
                    "selected": true,
                    "type": "3"
                },
                {
                    "name": "dsfsd",
                    "person_id": "RY1505442902695",
                    "selected": true,
                    "type": "3"
                }
            ],
            "selected": true,
            "type": "2"
        },
        {
            "name": "程序多福",
            "persons": [
                {
                    "name": "郭松超",
                    "person_id": "RY1503737342744",
                    "selected": false,
                    "type": "3"
                },
                {
                    "name": "感觉",
                    "person_id": "RY1506320509559",
                    "selected": false,
                    "type": "3"
                },
                {
                    "name": "测试更新-3",
                    "person_id": "RY1509338841078",
                    "selected": false,
                    "type": "3"
                }
            ],
            "selected": false,
            "type": "2"
        }
    ],
    "published_matters": [
        {
            "$ID": "a656e7bdfaa645c0b75d896eecdaf6e1",
            "desc_sops": [
                {
                    "selected": true,
                    "sop_id": "SOP1511507959604",
                    "sop_name": "测试1124",
                    "sop_name_arr": [
                        {
                            "char": "测",
                            "mark": false
                        },
                        {
                            "char": "试",
                            "mark": false
                        },
                        {
                            "char": "1",
                            "mark": true
                        },
                        {
                            "char": "1",
                            "mark": true
                        },
                        {
                            "char": "2",
                            "mark": false
                        },
                        {
                            "char": "4",
                            "mark": false
                        }
                    ],
                    "step_count": 1,
                    "update_time": "2017-11-25 11:09:05",
                    "version": "V0.9"
                },
                {
                    "selected": true,
                    "sop_id": "SOP1510555064181",
                    "sop_name": "测试111111",
                    "sop_name_arr": [
                        {
                            "char": "测",
                            "mark": false
                        },
                        {
                            "char": "试",
                            "mark": false
                        },
                        {
                            "char": "1",
                            "mark": true
                        },
                        {
                            "char": "1",
                            "mark": true
                        },
                        {
                            "char": "1",
                            "mark": true
                        },
                        {
                            "char": "1",
                            "mark": true
                        },
                        {
                            "char": "1",
                            "mark": true
                        },
                        {
                            "char": "1",
                            "mark": true
                        }
                    ],
                    "step_count": 1,
                    "update_time": "2017-11-13 14:37:44",
                    "version": "V0.1"
                },
                {
                    "selected": true,
                    "sop_id": "SOP1510537318762",
                    "sop_name": "测试对象作废1113",
                    "sop_name_arr": [
                        {
                            "char": "测",
                            "mark": false
                        },
                        {
                            "char": "试",
                            "mark": false
                        },
                        {
                            "char": "对",
                            "mark": false
                        },
                        {
                            "char": "象",
                            "mark": false
                        },
                        {
                            "char": "作",
                            "mark": false
                        },
                        {
                            "char": "废",
                            "mark": false
                        },
                        {
                            "char": "1",
                            "mark": true
                        },
                        {
                            "char": "1",
                            "mark": true
                        },
                        {
                            "char": "1",
                            "mark": false
                        },
                        {
                            "char": "3",
                            "mark": false
                        }
                    ],
                    "step_count": 1,
                    "update_time": "2017-11-13 11:56:14",
                    "version": "V0.3"
                },
                {
                    "selected": true,
                    "sop_id": "SOP1510393209568",
                    "sop_name": "sop208061111",
                    "sop_name_arr": [
                        {
                            "char": "s",
                            "mark": false
                        },
                        {
                            "char": "o",
                            "mark": false
                        },
                        {
                            "char": "p",
                            "mark": false
                        },
                        {
                            "char": "2",
                            "mark": false
                        },
                        {
                            "char": "0",
                            "mark": false
                        },
                        {
                            "char": "8",
                            "mark": false
                        },
                        {
                            "char": "0",
                            "mark": false
                        },
                        {
                            "char": "6",
                            "mark": false
                        },
                        {
                            "char": "1",
                            "mark": true
                        },
                        {
                            "char": "1",
                            "mark": true
                        },
                        {
                            "char": "1",
                            "mark": true
                        },
                        {
                            "char": "1",
                            "mark": true
                        }
                    ],
                    "step_count": 1,
                    "update_time": "2017-11-11 17:43:19",
                    "version": "V0.1"
                }
            ],
            "matter_id": "a656e7bdfaa645c0b75d896eecdaf6e1",
            "matter_name": "事项名称1",
            "matter_steps": [
                {
                    "$ID": "989578a1bfb9422dbbb7c6bba1d573cc",
                    "description": "@上格云-001-2号楼 #测试1124 #测试111111 #测试对象作废1113 #sop208061111 ",
                    "obj_id": "Bd1301020001002",
                    "obj_name": "上格云-001-2号楼",
                    "obj_step_id": "989578a1bfb9422dbbb7c6bba1d573cc",
                    "steps": [
                        {
                            "$ID": "989578a1bfb9422dbbb7c6bba1d573cc_1-1",
                            "confirm_result": [],
                            "content": "aaa",
                            "content_objs": [],
                            "domain": "WS",
                            "domain_name": "给排水",
                            "notice": "aaa",
                            "pre_conform": "aaa",
                            "step_id": "989578a1bfb9422dbbb7c6bba1d573cc_1-1",
                            "step_sequence": "1-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "989578a1bfb9422dbbb7c6bba1d573cc_2-1",
                            "confirm_result": [],
                            "content": "@离心机@离心机 @测试多步骤@测试多步骤 ",
                            "content_objs": [
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "CCCC",
                                    "obj_name": "离心机",
                                    "obj_name_arr": [
                                        {
                                            "char": "离",
                                            "mark": true
                                        },
                                        {
                                            "char": "心",
                                            "mark": true
                                        },
                                        {
                                            "char": "机",
                                            "mark": true
                                        }
                                    ],
                                    "obj_type": "search",
                                    "parents": [
                                        {
                                            "linked_names": "空调专业>中央供冷系统",
                                            "linked_names_arr": [
                                                {
                                                    "char": "空",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "调",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "专",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "业",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "中",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "央",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "供",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "冷",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "系",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "统",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "AC",
                                                "CC"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "中央供冷系统"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "Eq1301020001002ACCCCC00m",
                                    "obj_name": "测试多步骤",
                                    "obj_name_arr": [
                                        {
                                            "char": "测",
                                            "mark": true
                                        },
                                        {
                                            "char": "试",
                                            "mark": true
                                        },
                                        {
                                            "char": "多",
                                            "mark": true
                                        },
                                        {
                                            "char": "步",
                                            "mark": true
                                        },
                                        {
                                            "char": "骤",
                                            "mark": true
                                        }
                                    ],
                                    "obj_type": "search",
                                    "parents": [
                                        {
                                            "linked_names": "上格云-001-2号楼>2号楼-1层>2号楼-1层-2号房间",
                                            "linked_names_arr": [
                                                {
                                                    "char": "上",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "格",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "云",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "层",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "层",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "房",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "间",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "Bd1301020001002",
                                                "Fl1301020001002001",
                                                "Sp1301020001002001002"
                                            ],
                                            "parent_names": [
                                                "上格云-001-2号楼",
                                                "2号楼-1层",
                                                "2号楼-1层-2号房间"
                                            ]
                                        },
                                        {
                                            "linked_names": "空调专业>2号楼-中央供冷系统-001",
                                            "linked_names_arr": [
                                                {
                                                    "char": "空",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "调",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "专",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "业",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "中",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "央",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "供",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "冷",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "系",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "统",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "AC",
                                                "Sy1301020001002ACCC001"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "2号楼-中央供冷系统-001"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "FF",
                            "domain_name": "消防",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "989578a1bfb9422dbbb7c6bba1d573cc_2-1",
                            "step_sequence": "2-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "989578a1bfb9422dbbb7c6bba1d573cc_2-2",
                            "confirm_result": [],
                            "content": "@中央供冷系统 ",
                            "content_objs": [
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "CC",
                                    "obj_name": "中央供冷系统",
                                    "obj_type": "system_class",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "AC"
                                            ],
                                            "parent_names": [
                                                "空调"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "SP",
                            "domain_name": "安防",
                            "notice": "dsadsa",
                            "pre_conform": "saaa",
                            "step_id": "989578a1bfb9422dbbb7c6bba1d573cc_2-2",
                            "step_sequence": "2-2",
                            "step_type": "5"
                        },
                        {
                            "$ID": "989578a1bfb9422dbbb7c6bba1d573cc_3-1",
                            "confirm_result": [],
                            "content": "",
                            "content_objs": [],
                            "domain": "OT",
                            "domain_name": "其他",
                            "notice": "",
                            "pre_conform": "前提",
                            "step_id": "989578a1bfb9422dbbb7c6bba1d573cc_3-1",
                            "step_sequence": "3-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "989578a1bfb9422dbbb7c6bba1d573cc_3-2",
                            "confirm_result": [
                                {
                                    "customs": [],
                                    "info_points": [
                                        {
                                            "code": "MaxCoolP",
                                            "id": "system_CC_MaxCoolP",
                                            "is_revise": false,
                                            "name": "最大供冷能力"
                                        },
                                        {
                                            "code": "MinCoolP",
                                            "id": "system_CC_MinCoolP",
                                            "is_revise": false,
                                            "name": "最小供冷能力"
                                        }
                                    ],
                                    "is_revise": false,
                                    "obj_id": "CC",
                                    "obj_name": "中央供冷系统",
                                    "obj_type": "system_class",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "AC"
                                            ],
                                            "parent_names": [
                                                "空调"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "content": "dsada",
                            "content_objs": [],
                            "domain": "AC",
                            "domain_name": "空调",
                            "notice": "dsadsadsa",
                            "pre_conform": "dsadsadsa",
                            "step_id": "989578a1bfb9422dbbb7c6bba1d573cc_3-2",
                            "step_sequence": "3-2",
                            "step_type": "5"
                        },
                        {
                            "$ID": "989578a1bfb9422dbbb7c6bba1d573cc_4-1",
                            "confirm_result": [],
                            "content": "",
                            "content_objs": [],
                            "domain": "SE",
                            "domain_name": "强电",
                            "notice": "",
                            "pre_conform": "dsadsadsa",
                            "step_id": "989578a1bfb9422dbbb7c6bba1d573cc_4-1",
                            "step_sequence": "4-1",
                            "step_type": "5"
                        }
                    ]
                },
                {
                    "$ID": "f715da384d66414fa34ab140e573e587",
                    "description": "@上格云-001-1号楼 #测试1124 #测试111111 #测试对象作废1113 #sop208061111 ",
                    "obj_id": "Bd1301020001001",
                    "obj_name": "上格云-001-1号楼",
                    "obj_step_id": "f715da384d66414fa34ab140e573e587",
                    "steps": [
                        {
                            "$ID": "f715da384d66414fa34ab140e573e587_1-1",
                            "confirm_result": [],
                            "content": "aaa",
                            "content_objs": [],
                            "domain": "WS",
                            "domain_name": "给排水",
                            "notice": "aaa",
                            "pre_conform": "aaa",
                            "step_id": "f715da384d66414fa34ab140e573e587_1-1",
                            "step_sequence": "1-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "f715da384d66414fa34ab140e573e587_2-1",
                            "confirm_result": [],
                            "content": "@离心机@离心机 @测试多步骤@测试多步骤 ",
                            "content_objs": [
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "CCCC",
                                    "obj_name": "离心机",
                                    "obj_name_arr": [
                                        {
                                            "char": "离",
                                            "mark": true
                                        },
                                        {
                                            "char": "心",
                                            "mark": true
                                        },
                                        {
                                            "char": "机",
                                            "mark": true
                                        }
                                    ],
                                    "obj_type": "search",
                                    "parents": [
                                        {
                                            "linked_names": "空调专业>中央供冷系统",
                                            "linked_names_arr": [
                                                {
                                                    "char": "空",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "调",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "专",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "业",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "中",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "央",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "供",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "冷",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "系",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "统",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "AC",
                                                "CC"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "中央供冷系统"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "Eq1301020001002ACCCCC00m",
                                    "obj_name": "测试多步骤",
                                    "obj_name_arr": [
                                        {
                                            "char": "测",
                                            "mark": true
                                        },
                                        {
                                            "char": "试",
                                            "mark": true
                                        },
                                        {
                                            "char": "多",
                                            "mark": true
                                        },
                                        {
                                            "char": "步",
                                            "mark": true
                                        },
                                        {
                                            "char": "骤",
                                            "mark": true
                                        }
                                    ],
                                    "obj_type": "search",
                                    "parents": [
                                        {
                                            "linked_names": "上格云-001-2号楼>2号楼-1层>2号楼-1层-2号房间",
                                            "linked_names_arr": [
                                                {
                                                    "char": "上",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "格",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "云",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "层",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "层",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "房",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "间",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "Bd1301020001002",
                                                "Fl1301020001002001",
                                                "Sp1301020001002001002"
                                            ],
                                            "parent_names": [
                                                "上格云-001-2号楼",
                                                "2号楼-1层",
                                                "2号楼-1层-2号房间"
                                            ]
                                        },
                                        {
                                            "linked_names": "空调专业>2号楼-中央供冷系统-001",
                                            "linked_names_arr": [
                                                {
                                                    "char": "空",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "调",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "专",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "业",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "中",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "央",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "供",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "冷",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "系",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "统",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "AC",
                                                "Sy1301020001002ACCC001"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "2号楼-中央供冷系统-001"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "FF",
                            "domain_name": "消防",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "f715da384d66414fa34ab140e573e587_2-1",
                            "step_sequence": "2-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "f715da384d66414fa34ab140e573e587_2-2",
                            "confirm_result": [],
                            "content": "@中央供冷系统 ",
                            "content_objs": [
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "CC",
                                    "obj_name": "中央供冷系统",
                                    "obj_type": "system_class",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "AC"
                                            ],
                                            "parent_names": [
                                                "空调"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "SP",
                            "domain_name": "安防",
                            "notice": "dsadsa",
                            "pre_conform": "saaa",
                            "step_id": "f715da384d66414fa34ab140e573e587_2-2",
                            "step_sequence": "2-2",
                            "step_type": "5"
                        },
                        {
                            "$ID": "f715da384d66414fa34ab140e573e587_3-1",
                            "confirm_result": [],
                            "content": "",
                            "content_objs": [],
                            "domain": "OT",
                            "domain_name": "其他",
                            "notice": "",
                            "pre_conform": "前提",
                            "step_id": "f715da384d66414fa34ab140e573e587_3-1",
                            "step_sequence": "3-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "f715da384d66414fa34ab140e573e587_3-2",
                            "confirm_result": [
                                {
                                    "customs": [],
                                    "info_points": [
                                        {
                                            "code": "MaxCoolP",
                                            "id": "system_CC_MaxCoolP",
                                            "is_revise": false,
                                            "name": "最大供冷能力"
                                        },
                                        {
                                            "code": "MinCoolP",
                                            "id": "system_CC_MinCoolP",
                                            "is_revise": false,
                                            "name": "最小供冷能力"
                                        }
                                    ],
                                    "is_revise": false,
                                    "obj_id": "CC",
                                    "obj_name": "中央供冷系统",
                                    "obj_type": "system_class",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "AC"
                                            ],
                                            "parent_names": [
                                                "空调"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "content": "dsada",
                            "content_objs": [],
                            "domain": "AC",
                            "domain_name": "空调",
                            "notice": "dsadsadsa",
                            "pre_conform": "dsadsadsa",
                            "step_id": "f715da384d66414fa34ab140e573e587_3-2",
                            "step_sequence": "3-2",
                            "step_type": "5"
                        },
                        {
                            "$ID": "f715da384d66414fa34ab140e573e587_4-1",
                            "confirm_result": [],
                            "content": "",
                            "content_objs": [],
                            "domain": "SE",
                            "domain_name": "强电",
                            "notice": "",
                            "pre_conform": "dsadsadsa",
                            "step_id": "f715da384d66414fa34ab140e573e587_4-1",
                            "step_sequence": "4-1",
                            "step_type": "5"
                        }
                    ]
                },
                {
                    "$ID": "43661dbf7ca74872a6d029fdc5d1e379",
                    "obj_step_id": "43661dbf7ca74872a6d029fdc5d1e379",
                    "steps": [
                        {
                            "$ID": "43661dbf7ca74872a6d029fdc5d1e379_5-1",
                            "content": "确认事项完成后签字",
                            "step_id": "43661dbf7ca74872a6d029fdc5d1e379_5-1",
                            "step_sequence": "5-1",
                            "step_type": "6"
                        }
                    ]
                }
            ]
        },
        {
            "$ID": "1b1c88002e79406fa172ce539736694e",
            "desc_sops": [
                {
                    "selected": true,
                    "sop_id": "SOP1510913364976",
                    "sop_name": "SOPM1",
                    "sop_name_arr": [
                        {
                            "char": "S",
                            "mark": false
                        },
                        {
                            "char": "O",
                            "mark": false
                        },
                        {
                            "char": "P",
                            "mark": false
                        },
                        {
                            "char": "M",
                            "mark": false
                        },
                        {
                            "char": "1",
                            "mark": true
                        }
                    ],
                    "step_count": 1,
                    "update_time": "2017-12-18 10:52:02",
                    "version": "V0.1"
                },
                {
                    "selected": true,
                    "sop_id": "SOP1511778908348",
                    "sop_name": "SOPU1",
                    "sop_name_arr": [
                        {
                            "char": "S",
                            "mark": false
                        },
                        {
                            "char": "O",
                            "mark": false
                        },
                        {
                            "char": "P",
                            "mark": false
                        },
                        {
                            "char": "U",
                            "mark": false
                        },
                        {
                            "char": "1",
                            "mark": true
                        }
                    ],
                    "step_count": 1,
                    "update_time": "2017-11-27 18:35:08",
                    "version": "V0.1"
                },
                {
                    "selected": true,
                    "sop_id": "SOP1511600567075",
                    "sop_name": "SOPT1",
                    "sop_name_arr": [
                        {
                            "char": "S",
                            "mark": false
                        },
                        {
                            "char": "O",
                            "mark": false
                        },
                        {
                            "char": "P",
                            "mark": false
                        },
                        {
                            "char": "T",
                            "mark": false
                        },
                        {
                            "char": "1",
                            "mark": true
                        }
                    ],
                    "step_count": 3,
                    "update_time": "2017-11-25 17:03:10",
                    "version": "V0.1"
                },
                {
                    "selected": true,
                    "sop_id": "SOP1510555939648",
                    "sop_name": "1451",
                    "sop_name_arr": [
                        {
                            "char": "1",
                            "mark": true
                        },
                        {
                            "char": "4",
                            "mark": false
                        },
                        {
                            "char": "5",
                            "mark": false
                        },
                        {
                            "char": "1",
                            "mark": true
                        }
                    ],
                    "step_count": 2,
                    "update_time": "2017-11-25 16:06:39",
                    "version": "V0.7"
                },
                {
                    "selected": true,
                    "sop_id": "SOP1511507959604",
                    "sop_name": "测试1124",
                    "sop_name_arr": [
                        {
                            "char": "测",
                            "mark": false
                        },
                        {
                            "char": "试",
                            "mark": false
                        },
                        {
                            "char": "1",
                            "mark": true
                        },
                        {
                            "char": "1",
                            "mark": true
                        },
                        {
                            "char": "2",
                            "mark": false
                        },
                        {
                            "char": "4",
                            "mark": false
                        }
                    ],
                    "step_count": 1,
                    "update_time": "2017-11-25 11:09:05",
                    "version": "V0.9"
                }
            ],
            "matter_id": "1b1c88002e79406fa172ce539736694e",
            "matter_name": "事项名称2",
            "matter_steps": [
                {
                    "$ID": "0b50414ce3e14e039aa62d2bb1f50db3",
                    "description": "@1号楼-2层-3号房间 #SOPM1 #SOPU1 #SOPT1 #1451 #测试1124 ",
                    "obj_id": "Sp1301020001001002003",
                    "obj_name": "1号楼-2层-3号房间",
                    "obj_step_id": "0b50414ce3e14e039aa62d2bb1f50db3",
                    "steps": [
                        {
                            "$ID": "0b50414ce3e14e039aa62d2bb1f50db3_1-1",
                            "content": "到达指定位置时拍照",
                            "step_id": "0b50414ce3e14e039aa62d2bb1f50db3_1-1",
                            "step_sequence": "1-1",
                            "step_type": "3"
                        },
                        {
                            "$ID": "0b50414ce3e14e039aa62d2bb1f50db3_1-2",
                            "content": "到达指定位置时扫码",
                            "step_id": "0b50414ce3e14e039aa62d2bb1f50db3_1-2",
                            "step_sequence": "1-2",
                            "step_type": "4"
                        },
                        {
                            "$ID": "0b50414ce3e14e039aa62d2bb1f50db3_2-1",
                            "confirm_result": [
                                {
                                    "customs": [],
                                    "info_points": [],
                                    "is_revise": false,
                                    "obj_id": "Eq1301020001001ACCCCC00K",
                                    "obj_name": "wuwu",
                                    "obj_type": "equip",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "Bd1301020001001"
                                            ],
                                            "parent_names": [
                                                "上格云-001-1号楼"
                                            ]
                                        },
                                        {
                                            "parent_ids": [
                                                "AC",
                                                "Sy1301020001001ACCC001"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "1号楼-中央供冷系统-001"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "content": "@wuwu ",
                            "content_objs": [
                                {
                                    "initialChecked": true,
                                    "is_revise": false,
                                    "obj_id": "Eq1301020001001ACCCCC00K",
                                    "obj_name": "wuwu",
                                    "obj_type": "equip",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "Bd1301020001001"
                                            ],
                                            "parent_names": [
                                                "上格云-001-1号楼"
                                            ]
                                        },
                                        {
                                            "parent_ids": [
                                                "AC",
                                                "Sy1301020001001ACCC001"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "1号楼-中央供冷系统-001"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "0b50414ce3e14e039aa62d2bb1f50db3_2-1",
                            "step_sequence": "2-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "0b50414ce3e14e039aa62d2bb1f50db3_3-1",
                            "confirm_result": [
                                {
                                    "customs": [
                                        {
                                            "name": "自定义信息点U13",
                                            "type": "1"
                                        }
                                    ],
                                    "info_points": [],
                                    "obj_id": "1511778052203",
                                    "obj_name": "自定义信息点U12",
                                    "obj_type": "other"
                                },
                                {
                                    "customs": [
                                        {
                                            "name": "自定义信息点U14",
                                            "type": "1"
                                        }
                                    ],
                                    "info_points": [
                                        {
                                            "checked": true,
                                            "code": "ULevType",
                                            "id": "system_TD_ULevType",
                                            "name": "电压等级类型"
                                        }
                                    ],
                                    "obj_id": "TD",
                                    "obj_name": "变配电系统",
                                    "obj_type": "system_class",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "SE"
                                            ],
                                            "parent_names": [
                                                "强电"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "content": "@自定义信息点U12 ",
                            "content_objs": [
                                {
                                    "initialChecked": true,
                                    "isCustomized": true,
                                    "obj_id": "1511778052203",
                                    "obj_name": "自定义信息点U12",
                                    "obj_type": "other"
                                }
                            ],
                            "domain": "",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "0b50414ce3e14e039aa62d2bb1f50db3_3-1",
                            "step_sequence": "3-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "0b50414ce3e14e039aa62d2bb1f50db3_4-1",
                            "confirm_result": [],
                            "content": "2",
                            "content_objs": [],
                            "domain": "",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "0b50414ce3e14e039aa62d2bb1f50db3_4-1",
                            "step_sequence": "4-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "0b50414ce3e14e039aa62d2bb1f50db3_5-1",
                            "confirm_result": [],
                            "content": "1",
                            "content_objs": [],
                            "domain": "",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "0b50414ce3e14e039aa62d2bb1f50db3_5-1",
                            "step_sequence": "5-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "0b50414ce3e14e039aa62d2bb1f50db3_6-1",
                            "confirm_result": [],
                            "content": "3",
                            "content_objs": [],
                            "domain": "",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "0b50414ce3e14e039aa62d2bb1f50db3_6-1",
                            "step_sequence": "6-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "0b50414ce3e14e039aa62d2bb1f50db3_7-1",
                            "confirm_result": [],
                            "content": "@离心机@离心机 @测试多步骤@测试多步骤 ",
                            "content_objs": [
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "CCCC",
                                    "obj_name": "离心机",
                                    "obj_name_arr": [
                                        {
                                            "char": "离",
                                            "mark": true
                                        },
                                        {
                                            "char": "心",
                                            "mark": true
                                        },
                                        {
                                            "char": "机",
                                            "mark": true
                                        }
                                    ],
                                    "obj_type": "search",
                                    "parents": [
                                        {
                                            "linked_names": "空调专业>中央供冷系统",
                                            "linked_names_arr": [
                                                {
                                                    "char": "空",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "调",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "专",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "业",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "中",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "央",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "供",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "冷",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "系",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "统",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "AC",
                                                "CC"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "中央供冷系统"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "Eq1301020001002ACCCCC00m",
                                    "obj_name": "测试多步骤",
                                    "obj_name_arr": [
                                        {
                                            "char": "测",
                                            "mark": true
                                        },
                                        {
                                            "char": "试",
                                            "mark": true
                                        },
                                        {
                                            "char": "多",
                                            "mark": true
                                        },
                                        {
                                            "char": "步",
                                            "mark": true
                                        },
                                        {
                                            "char": "骤",
                                            "mark": true
                                        }
                                    ],
                                    "obj_type": "search",
                                    "parents": [
                                        {
                                            "linked_names": "上格云-001-2号楼>2号楼-1层>2号楼-1层-2号房间",
                                            "linked_names_arr": [
                                                {
                                                    "char": "上",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "格",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "云",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "层",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "层",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "房",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "间",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "Bd1301020001002",
                                                "Fl1301020001002001",
                                                "Sp1301020001002001002"
                                            ],
                                            "parent_names": [
                                                "上格云-001-2号楼",
                                                "2号楼-1层",
                                                "2号楼-1层-2号房间"
                                            ]
                                        },
                                        {
                                            "linked_names": "空调专业>2号楼-中央供冷系统-001",
                                            "linked_names_arr": [
                                                {
                                                    "char": "空",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "调",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "专",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "业",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "中",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "央",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "供",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "冷",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "系",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "统",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "AC",
                                                "Sy1301020001002ACCC001"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "2号楼-中央供冷系统-001"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "FF",
                            "domain_name": "消防",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "0b50414ce3e14e039aa62d2bb1f50db3_7-1",
                            "step_sequence": "7-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "0b50414ce3e14e039aa62d2bb1f50db3_7-2",
                            "confirm_result": [],
                            "content": "@中央供冷系统 ",
                            "content_objs": [
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "CC",
                                    "obj_name": "中央供冷系统",
                                    "obj_type": "system_class",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "AC"
                                            ],
                                            "parent_names": [
                                                "空调"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "SP",
                            "domain_name": "安防",
                            "notice": "dsadsa",
                            "pre_conform": "saaa",
                            "step_id": "0b50414ce3e14e039aa62d2bb1f50db3_7-2",
                            "step_sequence": "7-2",
                            "step_type": "5"
                        },
                        {
                            "$ID": "0b50414ce3e14e039aa62d2bb1f50db3_7-3",
                            "confirm_result": [],
                            "content": "@中央供冷系统 ",
                            "content_objs": [
                                {
                                    "is_revise": false,
                                    "obj_id": "CC",
                                    "obj_name": "中央供冷系统",
                                    "obj_type": "system_class",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "AC"
                                            ],
                                            "parent_names": [
                                                "空调"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "",
                            "notice": "",
                            "pre_conform": "cece",
                            "step_id": "0b50414ce3e14e039aa62d2bb1f50db3_7-3",
                            "step_sequence": "7-3",
                            "step_type": "5"
                        },
                        {
                            "$ID": "0b50414ce3e14e039aa62d2bb1f50db3_8-1",
                            "confirm_result": [],
                            "content": "@离心机@离心机 @测试多步骤@测试多步骤 ",
                            "content_objs": [
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "CCCC",
                                    "obj_name": "离心机",
                                    "obj_name_arr": [
                                        {
                                            "char": "离",
                                            "mark": true
                                        },
                                        {
                                            "char": "心",
                                            "mark": true
                                        },
                                        {
                                            "char": "机",
                                            "mark": true
                                        }
                                    ],
                                    "obj_type": "search",
                                    "parents": [
                                        {
                                            "linked_names": "空调专业>中央供冷系统",
                                            "linked_names_arr": [
                                                {
                                                    "char": "空",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "调",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "专",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "业",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "中",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "央",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "供",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "冷",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "系",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "统",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "AC",
                                                "CC"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "中央供冷系统"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "Eq1301020001002ACCCCC00m",
                                    "obj_name": "测试多步骤",
                                    "obj_name_arr": [
                                        {
                                            "char": "测",
                                            "mark": true
                                        },
                                        {
                                            "char": "试",
                                            "mark": true
                                        },
                                        {
                                            "char": "多",
                                            "mark": true
                                        },
                                        {
                                            "char": "步",
                                            "mark": true
                                        },
                                        {
                                            "char": "骤",
                                            "mark": true
                                        }
                                    ],
                                    "obj_type": "search",
                                    "parents": [
                                        {
                                            "linked_names": "上格云-001-2号楼>2号楼-1层>2号楼-1层-2号房间",
                                            "linked_names_arr": [
                                                {
                                                    "char": "上",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "格",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "云",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "层",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "层",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "房",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "间",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "Bd1301020001002",
                                                "Fl1301020001002001",
                                                "Sp1301020001002001002"
                                            ],
                                            "parent_names": [
                                                "上格云-001-2号楼",
                                                "2号楼-1层",
                                                "2号楼-1层-2号房间"
                                            ]
                                        },
                                        {
                                            "linked_names": "空调专业>2号楼-中央供冷系统-001",
                                            "linked_names_arr": [
                                                {
                                                    "char": "空",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "调",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "专",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "业",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "中",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "央",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "供",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "冷",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "系",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "统",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "AC",
                                                "Sy1301020001002ACCC001"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "2号楼-中央供冷系统-001"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "FF",
                            "domain_name": "消防",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "0b50414ce3e14e039aa62d2bb1f50db3_8-1",
                            "step_sequence": "8-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "0b50414ce3e14e039aa62d2bb1f50db3_8-2",
                            "confirm_result": [],
                            "content": "@中央供冷系统 ",
                            "content_objs": [
                                {
                                    "is_revise": false,
                                    "obj_id": "CC",
                                    "obj_name": "中央供冷系统",
                                    "obj_type": "system_class",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "AC"
                                            ],
                                            "parent_names": [
                                                "空调"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "SP",
                            "domain_name": "安防",
                            "notice": "dsadsa",
                            "pre_conform": "saaa",
                            "step_id": "0b50414ce3e14e039aa62d2bb1f50db3_8-2",
                            "step_sequence": "8-2",
                            "step_type": "5"
                        },
                        {
                            "$ID": "0b50414ce3e14e039aa62d2bb1f50db3_9-1",
                            "confirm_result": [],
                            "content": "aaa",
                            "content_objs": [],
                            "domain": "WS",
                            "domain_name": "给排水",
                            "notice": "aaa",
                            "pre_conform": "aaa",
                            "step_id": "0b50414ce3e14e039aa62d2bb1f50db3_9-1",
                            "step_sequence": "9-1",
                            "step_type": "5"
                        }
                    ]
                },
                {
                    "$ID": "c41674ed99d44bcaa430693992733045",
                    "description": "@1号楼-2层-4号房间 #SOPM1 #SOPU1 #SOPT1 #1451 #测试1124 ",
                    "obj_id": "Sp1301020001001002004",
                    "obj_name": "1号楼-2层-4号房间",
                    "obj_step_id": "c41674ed99d44bcaa430693992733045",
                    "steps": [
                        {
                            "$ID": "c41674ed99d44bcaa430693992733045_1-1",
                            "content": "到达指定位置时拍照",
                            "step_id": "c41674ed99d44bcaa430693992733045_1-1",
                            "step_sequence": "1-1",
                            "step_type": "3"
                        },
                        {
                            "$ID": "c41674ed99d44bcaa430693992733045_1-2",
                            "content": "到达指定位置时扫码",
                            "step_id": "c41674ed99d44bcaa430693992733045_1-2",
                            "step_sequence": "1-2",
                            "step_type": "4"
                        },
                        {
                            "$ID": "c41674ed99d44bcaa430693992733045_2-1",
                            "confirm_result": [
                                {
                                    "customs": [],
                                    "info_points": [],
                                    "is_revise": false,
                                    "obj_id": "Eq1301020001001ACCCCC00K",
                                    "obj_name": "wuwu",
                                    "obj_type": "equip",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "Bd1301020001001"
                                            ],
                                            "parent_names": [
                                                "上格云-001-1号楼"
                                            ]
                                        },
                                        {
                                            "parent_ids": [
                                                "AC",
                                                "Sy1301020001001ACCC001"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "1号楼-中央供冷系统-001"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "content": "@wuwu ",
                            "content_objs": [
                                {
                                    "initialChecked": true,
                                    "is_revise": false,
                                    "obj_id": "Eq1301020001001ACCCCC00K",
                                    "obj_name": "wuwu",
                                    "obj_type": "equip",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "Bd1301020001001"
                                            ],
                                            "parent_names": [
                                                "上格云-001-1号楼"
                                            ]
                                        },
                                        {
                                            "parent_ids": [
                                                "AC",
                                                "Sy1301020001001ACCC001"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "1号楼-中央供冷系统-001"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "c41674ed99d44bcaa430693992733045_2-1",
                            "step_sequence": "2-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "c41674ed99d44bcaa430693992733045_3-1",
                            "confirm_result": [
                                {
                                    "customs": [
                                        {
                                            "name": "自定义信息点U13",
                                            "type": "1"
                                        }
                                    ],
                                    "info_points": [],
                                    "obj_id": "1511778052203",
                                    "obj_name": "自定义信息点U12",
                                    "obj_type": "other"
                                },
                                {
                                    "customs": [
                                        {
                                            "name": "自定义信息点U14",
                                            "type": "1"
                                        }
                                    ],
                                    "info_points": [
                                        {
                                            "checked": true,
                                            "code": "ULevType",
                                            "id": "system_TD_ULevType",
                                            "name": "电压等级类型"
                                        }
                                    ],
                                    "obj_id": "TD",
                                    "obj_name": "变配电系统",
                                    "obj_type": "system_class",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "SE"
                                            ],
                                            "parent_names": [
                                                "强电"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "content": "@自定义信息点U12 ",
                            "content_objs": [
                                {
                                    "initialChecked": true,
                                    "isCustomized": true,
                                    "obj_id": "1511778052203",
                                    "obj_name": "自定义信息点U12",
                                    "obj_type": "other"
                                }
                            ],
                            "domain": "",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "c41674ed99d44bcaa430693992733045_3-1",
                            "step_sequence": "3-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "c41674ed99d44bcaa430693992733045_4-1",
                            "confirm_result": [],
                            "content": "2",
                            "content_objs": [],
                            "domain": "",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "c41674ed99d44bcaa430693992733045_4-1",
                            "step_sequence": "4-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "c41674ed99d44bcaa430693992733045_5-1",
                            "confirm_result": [],
                            "content": "1",
                            "content_objs": [],
                            "domain": "",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "c41674ed99d44bcaa430693992733045_5-1",
                            "step_sequence": "5-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "c41674ed99d44bcaa430693992733045_6-1",
                            "confirm_result": [],
                            "content": "3",
                            "content_objs": [],
                            "domain": "",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "c41674ed99d44bcaa430693992733045_6-1",
                            "step_sequence": "6-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "c41674ed99d44bcaa430693992733045_7-1",
                            "confirm_result": [],
                            "content": "@离心机@离心机 @测试多步骤@测试多步骤 ",
                            "content_objs": [
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "CCCC",
                                    "obj_name": "离心机",
                                    "obj_name_arr": [
                                        {
                                            "char": "离",
                                            "mark": true
                                        },
                                        {
                                            "char": "心",
                                            "mark": true
                                        },
                                        {
                                            "char": "机",
                                            "mark": true
                                        }
                                    ],
                                    "obj_type": "search",
                                    "parents": [
                                        {
                                            "linked_names": "空调专业>中央供冷系统",
                                            "linked_names_arr": [
                                                {
                                                    "char": "空",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "调",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "专",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "业",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "中",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "央",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "供",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "冷",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "系",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "统",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "AC",
                                                "CC"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "中央供冷系统"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "Eq1301020001002ACCCCC00m",
                                    "obj_name": "测试多步骤",
                                    "obj_name_arr": [
                                        {
                                            "char": "测",
                                            "mark": true
                                        },
                                        {
                                            "char": "试",
                                            "mark": true
                                        },
                                        {
                                            "char": "多",
                                            "mark": true
                                        },
                                        {
                                            "char": "步",
                                            "mark": true
                                        },
                                        {
                                            "char": "骤",
                                            "mark": true
                                        }
                                    ],
                                    "obj_type": "search",
                                    "parents": [
                                        {
                                            "linked_names": "上格云-001-2号楼>2号楼-1层>2号楼-1层-2号房间",
                                            "linked_names_arr": [
                                                {
                                                    "char": "上",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "格",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "云",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "层",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "层",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "房",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "间",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "Bd1301020001002",
                                                "Fl1301020001002001",
                                                "Sp1301020001002001002"
                                            ],
                                            "parent_names": [
                                                "上格云-001-2号楼",
                                                "2号楼-1层",
                                                "2号楼-1层-2号房间"
                                            ]
                                        },
                                        {
                                            "linked_names": "空调专业>2号楼-中央供冷系统-001",
                                            "linked_names_arr": [
                                                {
                                                    "char": "空",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "调",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "专",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "业",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "中",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "央",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "供",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "冷",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "系",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "统",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "AC",
                                                "Sy1301020001002ACCC001"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "2号楼-中央供冷系统-001"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "FF",
                            "domain_name": "消防",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "c41674ed99d44bcaa430693992733045_7-1",
                            "step_sequence": "7-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "c41674ed99d44bcaa430693992733045_7-2",
                            "confirm_result": [],
                            "content": "@中央供冷系统 ",
                            "content_objs": [
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "CC",
                                    "obj_name": "中央供冷系统",
                                    "obj_type": "system_class",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "AC"
                                            ],
                                            "parent_names": [
                                                "空调"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "SP",
                            "domain_name": "安防",
                            "notice": "dsadsa",
                            "pre_conform": "saaa",
                            "step_id": "c41674ed99d44bcaa430693992733045_7-2",
                            "step_sequence": "7-2",
                            "step_type": "5"
                        },
                        {
                            "$ID": "c41674ed99d44bcaa430693992733045_7-3",
                            "confirm_result": [],
                            "content": "@中央供冷系统 ",
                            "content_objs": [
                                {
                                    "is_revise": false,
                                    "obj_id": "CC",
                                    "obj_name": "中央供冷系统",
                                    "obj_type": "system_class",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "AC"
                                            ],
                                            "parent_names": [
                                                "空调"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "",
                            "notice": "",
                            "pre_conform": "cece",
                            "step_id": "c41674ed99d44bcaa430693992733045_7-3",
                            "step_sequence": "7-3",
                            "step_type": "5"
                        },
                        {
                            "$ID": "c41674ed99d44bcaa430693992733045_8-1",
                            "confirm_result": [],
                            "content": "@离心机@离心机 @测试多步骤@测试多步骤 ",
                            "content_objs": [
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "CCCC",
                                    "obj_name": "离心机",
                                    "obj_name_arr": [
                                        {
                                            "char": "离",
                                            "mark": true
                                        },
                                        {
                                            "char": "心",
                                            "mark": true
                                        },
                                        {
                                            "char": "机",
                                            "mark": true
                                        }
                                    ],
                                    "obj_type": "search",
                                    "parents": [
                                        {
                                            "linked_names": "空调专业>中央供冷系统",
                                            "linked_names_arr": [
                                                {
                                                    "char": "空",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "调",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "专",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "业",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "中",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "央",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "供",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "冷",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "系",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "统",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "AC",
                                                "CC"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "中央供冷系统"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "Eq1301020001002ACCCCC00m",
                                    "obj_name": "测试多步骤",
                                    "obj_name_arr": [
                                        {
                                            "char": "测",
                                            "mark": true
                                        },
                                        {
                                            "char": "试",
                                            "mark": true
                                        },
                                        {
                                            "char": "多",
                                            "mark": true
                                        },
                                        {
                                            "char": "步",
                                            "mark": true
                                        },
                                        {
                                            "char": "骤",
                                            "mark": true
                                        }
                                    ],
                                    "obj_type": "search",
                                    "parents": [
                                        {
                                            "linked_names": "上格云-001-2号楼>2号楼-1层>2号楼-1层-2号房间",
                                            "linked_names_arr": [
                                                {
                                                    "char": "上",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "格",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "云",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "层",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "层",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "房",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "间",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "Bd1301020001002",
                                                "Fl1301020001002001",
                                                "Sp1301020001002001002"
                                            ],
                                            "parent_names": [
                                                "上格云-001-2号楼",
                                                "2号楼-1层",
                                                "2号楼-1层-2号房间"
                                            ]
                                        },
                                        {
                                            "linked_names": "空调专业>2号楼-中央供冷系统-001",
                                            "linked_names_arr": [
                                                {
                                                    "char": "空",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "调",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "专",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "业",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "中",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "央",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "供",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "冷",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "系",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "统",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "AC",
                                                "Sy1301020001002ACCC001"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "2号楼-中央供冷系统-001"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "FF",
                            "domain_name": "消防",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "c41674ed99d44bcaa430693992733045_8-1",
                            "step_sequence": "8-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "c41674ed99d44bcaa430693992733045_8-2",
                            "confirm_result": [],
                            "content": "@中央供冷系统 ",
                            "content_objs": [
                                {
                                    "is_revise": false,
                                    "obj_id": "CC",
                                    "obj_name": "中央供冷系统",
                                    "obj_type": "system_class",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "AC"
                                            ],
                                            "parent_names": [
                                                "空调"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "SP",
                            "domain_name": "安防",
                            "notice": "dsadsa",
                            "pre_conform": "saaa",
                            "step_id": "c41674ed99d44bcaa430693992733045_8-2",
                            "step_sequence": "8-2",
                            "step_type": "5"
                        },
                        {
                            "$ID": "c41674ed99d44bcaa430693992733045_9-1",
                            "confirm_result": [],
                            "content": "aaa",
                            "content_objs": [],
                            "domain": "WS",
                            "domain_name": "给排水",
                            "notice": "aaa",
                            "pre_conform": "aaa",
                            "step_id": "c41674ed99d44bcaa430693992733045_9-1",
                            "step_sequence": "9-1",
                            "step_type": "5"
                        }
                    ]
                },
                {
                    "$ID": "aeee915a67784f879394e66a9c461da9",
                    "description": "@1号楼-2层-5号房间 #SOPM1 #SOPU1 #SOPT1 #1451 #测试1124 ",
                    "obj_id": "Sp1301020001001002005",
                    "obj_name": "1号楼-2层-5号房间",
                    "obj_step_id": "aeee915a67784f879394e66a9c461da9",
                    "steps": [
                        {
                            "$ID": "aeee915a67784f879394e66a9c461da9_1-1",
                            "content": "到达指定位置时拍照",
                            "step_id": "aeee915a67784f879394e66a9c461da9_1-1",
                            "step_sequence": "1-1",
                            "step_type": "3"
                        },
                        {
                            "$ID": "aeee915a67784f879394e66a9c461da9_1-2",
                            "content": "到达指定位置时扫码",
                            "step_id": "aeee915a67784f879394e66a9c461da9_1-2",
                            "step_sequence": "1-2",
                            "step_type": "4"
                        },
                        {
                            "$ID": "aeee915a67784f879394e66a9c461da9_2-1",
                            "confirm_result": [
                                {
                                    "customs": [],
                                    "info_points": [],
                                    "is_revise": false,
                                    "obj_id": "Eq1301020001001ACCCCC00K",
                                    "obj_name": "wuwu",
                                    "obj_type": "equip",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "Bd1301020001001"
                                            ],
                                            "parent_names": [
                                                "上格云-001-1号楼"
                                            ]
                                        },
                                        {
                                            "parent_ids": [
                                                "AC",
                                                "Sy1301020001001ACCC001"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "1号楼-中央供冷系统-001"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "content": "@wuwu ",
                            "content_objs": [
                                {
                                    "initialChecked": true,
                                    "is_revise": false,
                                    "obj_id": "Eq1301020001001ACCCCC00K",
                                    "obj_name": "wuwu",
                                    "obj_type": "equip",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "Bd1301020001001"
                                            ],
                                            "parent_names": [
                                                "上格云-001-1号楼"
                                            ]
                                        },
                                        {
                                            "parent_ids": [
                                                "AC",
                                                "Sy1301020001001ACCC001"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "1号楼-中央供冷系统-001"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "aeee915a67784f879394e66a9c461da9_2-1",
                            "step_sequence": "2-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "aeee915a67784f879394e66a9c461da9_3-1",
                            "confirm_result": [
                                {
                                    "customs": [
                                        {
                                            "name": "自定义信息点U13",
                                            "type": "1"
                                        }
                                    ],
                                    "info_points": [],
                                    "obj_id": "1511778052203",
                                    "obj_name": "自定义信息点U12",
                                    "obj_type": "other"
                                },
                                {
                                    "customs": [
                                        {
                                            "name": "自定义信息点U14",
                                            "type": "1"
                                        }
                                    ],
                                    "info_points": [
                                        {
                                            "checked": true,
                                            "code": "ULevType",
                                            "id": "system_TD_ULevType",
                                            "name": "电压等级类型"
                                        }
                                    ],
                                    "obj_id": "TD",
                                    "obj_name": "变配电系统",
                                    "obj_type": "system_class",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "SE"
                                            ],
                                            "parent_names": [
                                                "强电"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "content": "@自定义信息点U12 ",
                            "content_objs": [
                                {
                                    "initialChecked": true,
                                    "isCustomized": true,
                                    "obj_id": "1511778052203",
                                    "obj_name": "自定义信息点U12",
                                    "obj_type": "other"
                                }
                            ],
                            "domain": "",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "aeee915a67784f879394e66a9c461da9_3-1",
                            "step_sequence": "3-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "aeee915a67784f879394e66a9c461da9_4-1",
                            "confirm_result": [],
                            "content": "2",
                            "content_objs": [],
                            "domain": "",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "aeee915a67784f879394e66a9c461da9_4-1",
                            "step_sequence": "4-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "aeee915a67784f879394e66a9c461da9_5-1",
                            "confirm_result": [],
                            "content": "1",
                            "content_objs": [],
                            "domain": "",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "aeee915a67784f879394e66a9c461da9_5-1",
                            "step_sequence": "5-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "aeee915a67784f879394e66a9c461da9_6-1",
                            "confirm_result": [],
                            "content": "3",
                            "content_objs": [],
                            "domain": "",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "aeee915a67784f879394e66a9c461da9_6-1",
                            "step_sequence": "6-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "aeee915a67784f879394e66a9c461da9_7-1",
                            "confirm_result": [],
                            "content": "@离心机@离心机 @测试多步骤@测试多步骤 ",
                            "content_objs": [
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "CCCC",
                                    "obj_name": "离心机",
                                    "obj_name_arr": [
                                        {
                                            "char": "离",
                                            "mark": true
                                        },
                                        {
                                            "char": "心",
                                            "mark": true
                                        },
                                        {
                                            "char": "机",
                                            "mark": true
                                        }
                                    ],
                                    "obj_type": "search",
                                    "parents": [
                                        {
                                            "linked_names": "空调专业>中央供冷系统",
                                            "linked_names_arr": [
                                                {
                                                    "char": "空",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "调",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "专",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "业",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "中",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "央",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "供",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "冷",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "系",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "统",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "AC",
                                                "CC"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "中央供冷系统"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "Eq1301020001002ACCCCC00m",
                                    "obj_name": "测试多步骤",
                                    "obj_name_arr": [
                                        {
                                            "char": "测",
                                            "mark": true
                                        },
                                        {
                                            "char": "试",
                                            "mark": true
                                        },
                                        {
                                            "char": "多",
                                            "mark": true
                                        },
                                        {
                                            "char": "步",
                                            "mark": true
                                        },
                                        {
                                            "char": "骤",
                                            "mark": true
                                        }
                                    ],
                                    "obj_type": "search",
                                    "parents": [
                                        {
                                            "linked_names": "上格云-001-2号楼>2号楼-1层>2号楼-1层-2号房间",
                                            "linked_names_arr": [
                                                {
                                                    "char": "上",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "格",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "云",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "层",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "层",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "房",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "间",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "Bd1301020001002",
                                                "Fl1301020001002001",
                                                "Sp1301020001002001002"
                                            ],
                                            "parent_names": [
                                                "上格云-001-2号楼",
                                                "2号楼-1层",
                                                "2号楼-1层-2号房间"
                                            ]
                                        },
                                        {
                                            "linked_names": "空调专业>2号楼-中央供冷系统-001",
                                            "linked_names_arr": [
                                                {
                                                    "char": "空",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "调",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "专",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "业",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "中",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "央",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "供",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "冷",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "系",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "统",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "AC",
                                                "Sy1301020001002ACCC001"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "2号楼-中央供冷系统-001"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "FF",
                            "domain_name": "消防",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "aeee915a67784f879394e66a9c461da9_7-1",
                            "step_sequence": "7-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "aeee915a67784f879394e66a9c461da9_7-2",
                            "confirm_result": [],
                            "content": "@中央供冷系统 ",
                            "content_objs": [
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "CC",
                                    "obj_name": "中央供冷系统",
                                    "obj_type": "system_class",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "AC"
                                            ],
                                            "parent_names": [
                                                "空调"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "SP",
                            "domain_name": "安防",
                            "notice": "dsadsa",
                            "pre_conform": "saaa",
                            "step_id": "aeee915a67784f879394e66a9c461da9_7-2",
                            "step_sequence": "7-2",
                            "step_type": "5"
                        },
                        {
                            "$ID": "aeee915a67784f879394e66a9c461da9_7-3",
                            "confirm_result": [],
                            "content": "@中央供冷系统 ",
                            "content_objs": [
                                {
                                    "is_revise": false,
                                    "obj_id": "CC",
                                    "obj_name": "中央供冷系统",
                                    "obj_type": "system_class",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "AC"
                                            ],
                                            "parent_names": [
                                                "空调"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "",
                            "notice": "",
                            "pre_conform": "cece",
                            "step_id": "aeee915a67784f879394e66a9c461da9_7-3",
                            "step_sequence": "7-3",
                            "step_type": "5"
                        },
                        {
                            "$ID": "aeee915a67784f879394e66a9c461da9_8-1",
                            "confirm_result": [],
                            "content": "@离心机@离心机 @测试多步骤@测试多步骤 ",
                            "content_objs": [
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "CCCC",
                                    "obj_name": "离心机",
                                    "obj_name_arr": [
                                        {
                                            "char": "离",
                                            "mark": true
                                        },
                                        {
                                            "char": "心",
                                            "mark": true
                                        },
                                        {
                                            "char": "机",
                                            "mark": true
                                        }
                                    ],
                                    "obj_type": "search",
                                    "parents": [
                                        {
                                            "linked_names": "空调专业>中央供冷系统",
                                            "linked_names_arr": [
                                                {
                                                    "char": "空",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "调",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "专",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "业",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "中",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "央",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "供",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "冷",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "系",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "统",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "AC",
                                                "CC"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "中央供冷系统"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "checked": true,
                                    "initialChecked": true,
                                    "obj_id": "Eq1301020001002ACCCCC00m",
                                    "obj_name": "测试多步骤",
                                    "obj_name_arr": [
                                        {
                                            "char": "测",
                                            "mark": true
                                        },
                                        {
                                            "char": "试",
                                            "mark": true
                                        },
                                        {
                                            "char": "多",
                                            "mark": true
                                        },
                                        {
                                            "char": "步",
                                            "mark": true
                                        },
                                        {
                                            "char": "骤",
                                            "mark": true
                                        }
                                    ],
                                    "obj_type": "search",
                                    "parents": [
                                        {
                                            "linked_names": "上格云-001-2号楼>2号楼-1层>2号楼-1层-2号房间",
                                            "linked_names_arr": [
                                                {
                                                    "char": "上",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "格",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "云",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "层",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "层",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "房",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "间",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "Bd1301020001002",
                                                "Fl1301020001002001",
                                                "Sp1301020001002001002"
                                            ],
                                            "parent_names": [
                                                "上格云-001-2号楼",
                                                "2号楼-1层",
                                                "2号楼-1层-2号房间"
                                            ]
                                        },
                                        {
                                            "linked_names": "空调专业>2号楼-中央供冷系统-001",
                                            "linked_names_arr": [
                                                {
                                                    "char": "空",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "调",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "专",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "业",
                                                    "mark": false
                                                },
                                                {
                                                    "char": ">",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "2",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "号",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "楼",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "中",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "央",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "供",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "冷",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "系",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "统",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "-",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "0",
                                                    "mark": false
                                                },
                                                {
                                                    "char": "1",
                                                    "mark": false
                                                }
                                            ],
                                            "parent_ids": [
                                                "AC",
                                                "Sy1301020001002ACCC001"
                                            ],
                                            "parent_names": [
                                                "空调专业",
                                                "2号楼-中央供冷系统-001"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "FF",
                            "domain_name": "消防",
                            "notice": "",
                            "pre_conform": "",
                            "step_id": "aeee915a67784f879394e66a9c461da9_8-1",
                            "step_sequence": "8-1",
                            "step_type": "5"
                        },
                        {
                            "$ID": "aeee915a67784f879394e66a9c461da9_8-2",
                            "confirm_result": [],
                            "content": "@中央供冷系统 ",
                            "content_objs": [
                                {
                                    "is_revise": false,
                                    "obj_id": "CC",
                                    "obj_name": "中央供冷系统",
                                    "obj_type": "system_class",
                                    "parents": [
                                        {
                                            "parent_ids": [
                                                "AC"
                                            ],
                                            "parent_names": [
                                                "空调"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "domain": "SP",
                            "domain_name": "安防",
                            "notice": "dsadsa",
                            "pre_conform": "saaa",
                            "step_id": "aeee915a67784f879394e66a9c461da9_8-2",
                            "step_sequence": "8-2",
                            "step_type": "5"
                        },
                        {
                            "$ID": "aeee915a67784f879394e66a9c461da9_9-1",
                            "confirm_result": [],
                            "content": "aaa",
                            "content_objs": [],
                            "domain": "WS",
                            "domain_name": "给排水",
                            "notice": "aaa",
                            "pre_conform": "aaa",
                            "step_id": "aeee915a67784f879394e66a9c461da9_9-1",
                            "step_sequence": "9-1",
                            "step_type": "5"
                        }
                    ]
                },
                {
                    "$ID": "8aeebd0703ec4816a513f1a207b36528",
                    "obj_step_id": "8aeebd0703ec4816a513f1a207b36528",
                    "steps": [
                        {
                            "$ID": "8aeebd0703ec4816a513f1a207b36528_10-1",
                            "content": "确认事项完成后签字",
                            "step_id": "8aeebd0703ec4816a513f1a207b36528_10-1",
                            "step_sequence": "10-1",
                            "step_type": "6"
                        }
                    ]
                }
            ]
        }
    ]
};