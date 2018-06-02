var a= [ //工单事项  ,非空
    {
        "$ID": "***", //引擎需要的id，同matter_id，后台使用
        "matter_id": "***", //事项id ,非空
        "matter_name": "***", //事项名称 ,非空
        "description": "***", //事项概述
        "matter_steps": [ //事项步骤 ,非空	
            {
                "$ID": "***", //引擎需要的id，同obj_step_id，后台使用
                "obj_step_id": "***", //对象步骤id ,非空
                "obj_id": "***", //对象id，可能为空
                "obj_name": "***", //对象名称 ，可能为空
                "obj_finish": true, //对象工作是否完成
                "steps": [ //步骤 ,非空
                    {
                        "$ID": "***", //引擎需要的id，step_id，后台使用
                        "step_id": "***", //步骤id,obj_step_id+"_"+step_sequence组成 ,非空
                        "step_sequence": "1-1", //步骤序号  ,非空
                        "step_type": "3", //步骤类型：1-文字输入、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                        "step_finish": true, //步骤工作是否完成
                        "content": "到达指定位置拍照" //操作内容描述
                    },
                    {
                        "$ID": "***", //引擎需要的id，step_id，后台使用
                        "step_id": "***", //步骤id,obj_step_id+"_"+step_sequence组成 ,非空
                        "step_sequence": "1-2", //步骤序号  ,非空
                        "step_type": "4", //步骤类型：1-文字输入、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                        "step_finish": true, //步骤工作是否完成
                        "content": "到达指定位置扫码" //操作内容描述 
                    },
                    {
                        "$ID": "***", //引擎需要的id，step_id，后台使用
                        "step_id": "***", //步骤id,obj_step_id+"_"+step_sequence组成 ,非空
                        "step_sequence": "2-1", //步骤序号  ,非空
                        "step_type": "5", //步骤类型：1-文字输入、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                        "pre_conform": "***", //强制确认
                        "content": "***", //操作内容
                        //工作内容中涉及的对象,如果有子对象时，则子对象中obj_id、obj_name、obj_type皆非空
                        "content_objs": [
                            {
                                "obj_id": "***", //对象id
                                "obj_name": "对象名称1", //对象名称
                                "obj_type": "equip" //对象类型,子项见后边
                            }
                        ],
                        "notice""***", //注意事项
                        "confirm_result": [ //需确认的操作结果，如果有子对象时，则子对象中obj_id、obj_name、obj_type皆非空
                            {
                                "obj_id:"***",
                          "obj_name:"***",
                          "obj_type:": "***",
                                "parents": [
                                    {
                                        "parent_ids": [
                                            "***",
                                            "***",
                                            "***"
                                        ],
                                        "parent_names": [
                                            "建筑1",
                                            "楼层1",
                                            "空间"
                                        ]
                                    },
                                    {
                                        "parent_ids": [
                                            "***",
                                            "***"
                                        ],
                                        "parent_names": [
                                            "专业1",
                                            "系统1"
                                        ]
                                    }
                                ]
                          "info_points": [ //信息点组件数据，如果有子对象时，则子对象中id、code、name、cmpt皆非空
                                    {
                                        "id": "***",
                                        "code": "***",
                                        "name": "***",
                                        "unit": "***",
                                        "cmpt": "Numberentry02",
                                        "wrong_ranges": [
                                            {
                                                "type": "gt",
                                                "values": "12"
                                            },
                                            {
                                                "type": "lt",
                                                "values": "6"
                                            }
                                        ]
                                    },
                                    {
                                        "id": "***",
                                        "code": "***",
                                        "name": "***",
                                        "unit": "***",
                                        "cmpt": "Multiselect01",
                                        "cmpt_data": [
                                            {
                                                "code": "***",
                                                "name": "***"
                                            }
                                        ],
                                        "wrongs": [
                                            "选项1",
                                            "选项2"
                                        ]
                                    }
                                ],
                                "customs": [ //自定义项，type：1-文本、2-单选、3-多选、4-无单位的数字、5-有单位的数字，如果有子对象时，则子对象中name、type皆非空
                                    {
                                        "name": "确认信息2",
                                        "type": "1"
                                    },
                                    {
                                        "name": "确认信息2",
                                        "type": "1"
                                    },
                                    {
                                        "name": "确认信息2",
                                        "type": "2",
                                        "items": [
                                            "选项1",
                                            "选项2",
                                            "选项3"
                                        ],
                                        "wrongs": [
                                            "选项1",
                                            "选项2"
                                        ]
                                    },
                                    {
                                        "name": "确认信息3",
                                        "type": "3",
                                        "items": [
                                            "选项1",
                                            "选项2",
                                            "选项3"
                                        ],
                                        "wrongs": [
                                            "选项1",
                                            "选项2"
                                        ]
                                    },
                                    //非区间异常的type项有：gt-大于,gte-大于等于，lt-小于,lte-小于等于,区间的type项为range,满足一个子项就认为出现异常
                                    {
                                        "name": "确认信息4",
                                        "type": "4",
                                        "wrong_ranges": [
                                            {
                                                "type": "gt",
                                                "values": "12"
                                            },
                                            {
                                                "type": "lt",
                                                "values": "6"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "确认信息5",
                                        "type": "5",
                                        "unit": "",
                                        "wrong_ranges": [
                                            {
                                                "type": "range",
                                                "values": [
                                                    "12",
                                                    "20"
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "domain": "***", //专业code
                        "domain_name": "***" //专业名称
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
                                "obj_id": "***",
                                "obj_name": "对象名称1",
                                "obj_type": "equip"
                            },
                            {....
                            }
                        ],
                        "notice""***",
                        "confirm_result": [
                            {
                                "obj_id:"***",
                          "obj_name:"***",
                          "obj_type": "***",
                                "parents": [
                                    {
                                        "parent_ids": [
                                            "***",
                                            "***",
                                            "***"
                                        ],
                                        "parent_names": [
                                            "建筑1",
                                            "楼层1",
                                            "空间"
                                        ]
                                    },
                                    {
                                        "parent_ids": [
                                            "***",
                                            "***"
                                        ],
                                        "parent_names": [
                                            "专业1",
                                            "系统1"
                                        ]
                                    }
                                ]
                          "info_points": [ //信息点组件数据源类型
                                    {
                                        "id": "***",
                                        "code": "***",
                                        "name": "***",
                                        "unit": "***",
                                        "cmpt": "Numberentry02",
                                        "wrong_ranges": [
                                            {
                                                "type": "gt",
                                                "values": "12"
                                            },
                                            {
                                                "type": "lt",
                                                "values": "6"
                                            }
                                        ]
                                    },
                                    {
                                        "id": "***",
                                        "code": "***",
                                        "name": "***",
                                        "unit": "***",
                                        "cmpt": "Multiselect01",
                                        "cmpt_data": [
                                            {
                                                "code": "***",
                                                "name": "***"
                                            },
                                            {***
                                            }
                                        ],
                                        "wrongs": [
                                            "选项1",
                                            "选项2"
                                        ]
                                    }
                                ],
                                "customs": [ //自定义项，type：1-文本、2-单选、3-多选、4-无单位的数字、5-有单位的数字
                                    {
                                        "name": "确认信息2",
                                        "type": "1"
                                    },
                                    {
                                        "name": "确认信息2",
                                        "type": "2",
                                        "items": [
                                            "选项1",
                                            "选项2",
                                            "选项3"
                                        ],
                                        "wrongs": [
                                            "选项1",
                                            "选项2"
                                        ]
                                    },
                                    {
                                        "name": "确认信息3",
                                        "type": "3",
                                        "items": [
                                            "选项1",
                                            "选项2",
                                            "选项3"
                                        ],
                                        "wrongs": [
                                            "选项1",
                                            "选项2"
                                        ]
                                    },
                                    //非区间异常的type项有：gt-大于,gte-大于等于，lt-小于,lte-小于等于,区间的type项为range,满足一个子项就认为出现异常
                                    {
                                        "name": "确认信息4",
                                        "type": "4",
                                        "wrong_ranges": [
                                            {
                                                "type": "gt",
                                                "values": "12"
                                            },
                                            {
                                                "type": "lt",
                                                "values": "6"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "确认信息5",
                                        "type": "5",
                                        "unit": "***",
                                        "wrong_ranges": [
                                            {
                                                "type": "range",
                                                "values": [
                                                    "12",
                                                    "20"
                                                ]
                                            },
                                            {***
                                            }
                                        ]
                                    }
                                ]
                            },
                            {...
                            }
                        ],
                        "domain": "***", //专业code
                        "domain_name": "***" //专业名称
                    },
                    {***
                    }
                ],
                "feedback": [ //反馈信息
                    {
                        "$ID"："****", //引擎需要的id，同step_id，后台使用
                        "step_id": "***", //步骤id ,非空
                        "step_sequence": "1-1", //步骤序号  ,非空
                        "step_type": "3", //步骤类型：1-文字输入、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                        "step_finish": true, //步骤工作是否完成
                        "description"："****", //反馈描述
                        "photos": [
                            "key"，"key"
                        ], //图片key
                        "executor_id": "***", //执行人Id
                        "operate_time" //操作时间，yyyyMMddHHmmss
                    },
                    {
                        "$ID"："****", //引擎需要的id，同step_id，后台使用
                        "step_id": "***", //步骤id ,非空
                        "step_sequence": "2-1", //步骤序号 ,非空
                        "step_type": "5", //步骤类型：1-文字输入、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                        "step_finish": true, //步骤工作是否完成
                        "pre_conform_result": "前提已确认", //前提确认结果
                        "description"："****", //反馈描述
                        "confirm_result": [ //需确认的操作结果，如果有子对象时，则子对象中obj_id、obj_name皆非空
                            {
                                "obj_id:"***",
                          "obj_name:"***",
                          "info_points": [ //信息点信息反馈，如果有子对象时，则子对象中code、name、cmpt皆非空
                                    {
                                        "id": "***",
                                        "code": "***",
                                        "name": "***",
                                        "unit": "***",
                                        "value": "123",
                                        "cmpt": "Numberentry02",
                                        "wrong_ranges": [
                                            {
                                                "type": "gt",
                                                "values": "12"
                                            },
                                            {
                                                "type": "lt",
                                                "values": "6"
                                            }
                                        ],
                                        "info_point_value_status": "1" //0-正常 1-异常
                                    },
                                    {
                                        "id": "***",
                                        "code": "***",
                                        "name": "***",
                                        "unit": "***",
                                        "values": [
                                            "123",
                                            "456"
                                        ],
                                        "cmpt": "Multiselect01",
                                        "cmpt_data": [
                                            {
                                                "code": "***",
                                                "name": "***"
                                            },
                                            {***
                                            }
                                        ],
                                        "wrongs": [
                                            "选项1",
                                            "选项2"
                                        ],
                                        "info_point_value_status": "1" //0-正常 1-异常
                                    }
                                ],
                                "customs": [ //自定义项反馈，type：1-文本、2-单选、3-多选、4-无单位的数字、5-有单位的数字，如果有子对象时，则子对象中name、type皆非空
                                    {
                                        "name": "确认信息2",
                                        "type": "1",
                                        "content": "****"
                                    },
                                    {
                                        "name": "确认信息2",
                                        "type": "2",
                                        "item": "***",
                                        "wrongs": [
                                            "选项1",
                                            "选项2"
                                        ]
                                    },
                                    {
                                        "name": "确认信息3",
                                        "type": "3",
                                        "items": [
                                            "***",
                                            "***"
                                        ],
                                        "wrongs": [
                                            "选项1",
                                            "选项2"
                                        ]
                                    },
                                    //非区间异常的type项有：gt-大于,gte-大于等于，lt-小于,lte-小于等于,区间的type项为range,满足一个子项就认为出现异常
                                    {
                                        "name": "确认信息4",
                                        "type": "4",
                                        "value": "123",
                                        "wrong_ranges": [
                                            {
                                                "type": "gt",
                                                "values": "12"
                                            },
                                            {
                                                "type": "lt",
                                                "values": "6"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "确认信息5",
                                        "type": "5",
                                        "value": "456",
                                        "unit": "***",
                                        "wrong_ranges": [
                                            {
                                                "type": "range",
                                                "values": [
                                                    "12",
                                                    "20"
                                                ]
                                            },
                                            {***
                                            }
                                        ]
                                    }
                                ]
                            },
                            {...
                            }
                        ],
                        "photos": [
                            "key"，"key"
                        ], //图片key
                        "executor_id": "***", //执行人Id ,非空
                        "operate_time" //操作时间，yyyyMMddHHmmss ,非空
                    },
                    {***
                    }
                ],
                "executors": [
                    "name1",
                    "name2"
                ] //执行人 ,非空
            },
            {
                "$ID": "***", //引擎需要的id，同obj_step_id，后台使用
                "obj_step_id": "***", //对象步骤id ,非空
                "step_finish": true, //对象工作是否完成
                "steps": [ //步骤 ,非空
                    {
                        "$ID": "***", //引擎需要的id，step_id，后台使用
                        "step_id": "***", //步骤id,obj_step_id+"_"+step_sequence组成 ,非空
                        "step_sequence": "3-1", //步骤序号  ,非空
                        "step_type": "6", //步骤类型：1-文字输入、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                        "content": "结束该事项时签字" //操作内容描述 
                    }
                ],
                "feedback": [ //反馈信息
                    {
                        "$ID"："****", //引擎需要的id，同step_id，后台使用
                        "step_id": "***", //步骤id ,非空
                        "step_sequence": "3-1", //步骤序号  ,非空
                        "step_type": "6", //步骤类型：1-文字输入、3-拍照、4-扫码、5-工作内容、6-签字 ,非空
                        "description"："****", //反馈描述
                        "step_finish": true, //步骤工作是否完成
                        "photos": [
                            "key"，"key"
                        ], //图片key
                        "executor_id": "***", //执行人Id
                        "operate_time" //操作时间，yyyyMMddHHmmss
                    },
                    {***
                    }
                ],
                "executors": [
                    "name1",
                    "name2"
                ] //执行人
            },
            {***
            }
        ],
        "desc_photos": [key1,key2
        ], //描述中的图片
        "desc_sops": [ //描述中涉及的sop，如果有子对象时，则子对象中sop_id、sop_name、version皆非空	
            {
                "sop_id:"***",          //sop的id
  	          "sop_name:"对象名称1",   //sop名称
  	          "version": "V1.3" //sop版本
            },
            {***
            }
        ],
    },
    {***
    }
],
"wo_exec_controls": [ //执行控制信息
    {
        "control_code": "***", //控制模块编码,名称查询数据字典
        "control_name": "***", //控制模块名称,名称查询数据字典
        "operator_id": "***", //操作人id
        "operator_name": "***", //操作人名字
        "operate_time": "***", //操作时间, yyyyMMddHHmmss
        "apply_type": "finish" //申请类型，finish-正常结束，stop-异常结束   "申请结束" 控制模块专用
		"audit_result": "***", //审核结果,1-通过，0-不通过   所有的"审核"，"审批"控制模块专用
        "opinion": "***", //意见
        "domains": [
            "***",
            "***"
        ], //专业code数组   "申请加人","审核加人","审批加人"控制模块专用
        "domain_names": [
            "***",
            "***"
        ], //专业名称数组   "申请加人","审核加人","审批加人"控制模块专用
        "person_num": "5", //所加的人数   "申请加人","审核加人","审批加人"控制模块专用
        "person_ids": [
            "***",
            "***"
        ], //所加的人员id数组 "申请加人","审核加人","审批加人"控制模块专用
        "person_names": [
            "***",
            "***"
        ], //所加的人员名称数组 "申请加人","审核加人","审批加人"控制模块专用
        "delay_hour": "5", //延期小时数  "申请延期","审核延期","审批延期"控制模块专用
        "replace_person_id": "***", //更换人员id   "申请换人","审核换人","审批换人"控制模块专用
        "replace_person_name": "***", //更换人员名称   "申请换人","审核换人","审批换人"控制模块专用
        "create_time": "***" //操作时间, yyyyMMddHHmmss
    },
    {...
    }
]