/*数据model映射配置，支持无限嵌套*/
var dataModelMap = {
    //工单管理
    'restWoMonitorService/queryWorkOrderById': {
        "note": "根据id查询工单详细信息-发布后的",
        "type": "object",
        "proArr": [{
            "note": "work_order",
            "name": "work_order",
            "type": "object",
            "proArr": [{
                "note": "工单id",
                "name": "order_id",
                "type": "string"
            }, {
                "note": "wo_body",
                "name": "wo_body",
                "type": "object",
                "proArr": [{
                    "note": "工单id",
                    "name": "order_id",
                    "type": "string"
                }, {
                    "note": "项目id",
                    "name": "project_id",
                    "type": "string"
                }, {
                    "note": "工单类型",
                    "name": "order_type",
                    "type": "string"
                }, {
                    "note": "工单类型名称",
                    "name": "order_type_name",
                    "type": "string"
                }, {
                    "note": "工单执行类型编码,数据字典查名称",
                    "name": "execute_type",
                    "type": "string"
                }, {
                    "note": "紧急程度，高、中、低",
                    "name": "urgency",
                    "type": "string"
                }, {
                    "note": "工单执行方式编码,数据字典查名称",
                    "name": "executie_mode",
                    "type": "string"
                }, {
                    "note": "开始时间类型,1-发单后立即开始，2-自定义开始时间",
                    "name": "start_time_type",
                    "type": "string"
                }, {
                    "note": "要求开始时间",
                    "name": "ask_start_time",
                    "type": "string"
                }, {
                    "note": "要求固定时间内完成,单位小时",
                    "name": "ask_end_limit",
                    "type": "string"
                }, {
                    "note": "要求结束时间",
                    "name": "ask_end_time",
                    "type": "string",
                    "isToSpecial": false
                }, {
                    "note": "所需工具",
                    "name": "required_tools",
                    "type": "array"
                }, {
                    "note": "工单状态编码",
                    "name": "order_state",
                    "type": "string",
                    "isToSpecial": false
                }, {
                    "note": "工单状态名称",
                    "name": "order_state_name",
                    "type": "string"
                }, {
                    "note": "工单自定义状态编码",
                    "name": "custom_state",
                    "type": "string"
                }, {
                    "note": "工单自定义状态名称",
                    "name": "custom_state_name",
                    "type": "string"
                }, {
                    "note": "工单概述,事项名称的串连",
                    "name": "summary",
                    "type": "string"
                }, {
                    "note": "工单来源类型,1-正常创建，2-工单计划，3-报修转工单，默认1",
                    "name": "order_from_type",
                    "type": "string"
                }, {
                    "note": "工单来源id，报修转工单时，这里是报修单id",
                    "name": "order_from_id",
                    "type": "string"
                }, {
                    "note": "创建人id",
                    "name": "creator_id",
                    "type": "string"
                }, {
                    "note": "创建人名字",
                    "name": "creator_name",
                    "type": "string"
                }, {
                    "note": "工单中专业列表",
                    "name": "domain_list",
                    "type": "array"
                }, {
                    "note": "专业限制",
                    "name": "limit_domain",
                    "type": "string"
                }, {
                    "note": "工单事项",
                    "name": "matters",
                    "type": "array",
                    "proArrBy": "order_matters"
                }, {
                    "note": "执行控制信息",
                    "name": "wo_exec_controls",
                    "type": "array",
                    "proArr": [{
                        "note": "引擎需要的id",
                        "name": "$ID",
                        "type": "string"
                    }, {
                        "note": "exec_control_id",
                        "name": "exec_control_id",
                        "type": "string"
                    }, {
                        "note": "控制模板编码,名称查询数据字典",
                        "name": "control_code",
                        "type": "string"
                    }, {
                        "note": "操作人名字",
                        "name": "operator_name",
                        "type": "string"
                    }, {
                        "note": "操作开始时间",
                        "name": "operate_start_time",
                        "type": "string"
                    }, {
                        "note": "操作结束时间",
                        "name": "operate_end_time",
                        "type": "string"
                    }, {
                        "note": "申请类型，finish-正常结束，stop-中止",
                        "name": "apply_type",
                        "type": "string"
                    }, {
                        "note": "审核结果,1-通过，0-不通过",
                        "name": "audit_result",
                        "type": "string"
                    }, {
                        "note": "意见",
                        "name": "opinion",
                        "type": "string"
                    }, {
                        "note": "下级路由",
                        "name": "next_route",
                        "type": "array"
                    },
                        {
                            "note": "操作时间",
                            "name": "create_time",
                            "type": "string"
                        }
                    ]
                }, {
                    "note": "发布时间",
                    "name": "publish_time",
                    "type": "string"
                }, {
                    "note": "创建时间",
                    "name": "create_time",
                    "type": "string"
                }, {
                    "note": "有效状态 true：有效，false：失效",
                    "name": "valid",
                    "type": "boolean"
                }]
            }]
        }]

    },
    'restMyWorkOrderService/queryOperateRecord': {
        "note": "查询工单操作记录",
        "type": "array",
        "proArr": [{
            "note": "操作人姓名",
            "name": "operator_name",
            "type": "string"
        }, {
            "note": "开始时间",
            "name": "start_time",
            "type": "string"
        }, {
            "note": "耗时",
            "name": "use_times",
            "type": "string"
        }]
    },
    "restPersonService/queryPositionPersonSel": {
        "note": "查询岗位和人员列表",
        "type": "array",
        "proArr": [{
            "note": "类型2岗位3人",
            "name": "type",
            "type": "string"
        },
            {
                "note": "岗位名称人员名称",
                "name": "name",
                "type": "string"
            },
            {
                "note": "员工id",
                "name": "person_id",
                "type": "string"
            },
            {
                "note": "岗位下人员列表",
                "name": "persons",
                "type": "array",
                "proArr": [{
                    "note": "员工id",
                    "name": "person_id",
                    "type": "string"
                },
                    {
                        "note": "员工姓名",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "note": "类型",
                        "name": "type",
                        "type": "string"
                    }
                ]
            }
        ]
    },
    "restGeneralDictService/queryWorkOrderState": {
        "note": "工单状态",
        "type": "array",
        "proArr": [{
            "note": "编号",
            "name": "code",
            "type": "string"
        },
            {
                "note": "状态名称",
                "name": "name",
                "type": "string"
            },
            {
                "note": "注释",
                "name": "description",
                "type": "string"
            }
        ]
    },
    "restPersonService/queryProjectPersonSel": {
        "note": "查询项目下人员列表",
        "type": "array",
        "proArr": [{
            "note": "员工id",
            "name": "person_id",
            "type": "string"
        },
            {
                "note": "员工姓名",
                "name": "name",
                "type": "string"
            }
        ]
    },
    "restWoMonitorService/queryAllWorkOrder": {
        "note": "所有工单",
        "type": "array",
        "proArr": [{
            "note": "工单id",
            "name": "order_id",
            "type": "string"
        },
            {
                "note": "工单类型",
                "name": "order_type",
                "type": "string"
            },
            {
                "note": "工单类型名称",
                "name": "order_type_name",
                "type": "string"
            },
            {
                "note": "工单概述",
                "name": "summary",
                "type": "string"
            },
            {
                "note": "工单状态编码",
                "name": "order_state",
                "type": "string",
                "isToSpecial": false
            },
            {
                "note": "工单状态名称",
                "name": "order_state_name",
                "type": "string"
            },
            {
                "note": "工单自定义状态",
                "name": "custom_state",
                "type": "string"
            },
            {
                "note": "工单自定义状态名称",
                "name": "custom_state_name",
                "type": "string"
            },
            {
                "note": "创建时间",
                "name": "create_time",
                "type": "string"
            }
        ]
    },

    "restPersonService/queryPersonDetailByidNumber": {
        note: "人员信息-新增页:根据身份证号查询人员详细信息",
        type: "object",
        proArr: [
            {
                note: "姓名",
                name: "name",
                mapName: "",
                type: "string"
            },
            {
                note: "身份证号码",
                name: "id_number",
                mapName: "",
                type: "string"
            },
            {
                note: "手机号",
                name: "phone_num",
                mapName: "",
                type: "string"
            },
            {
                note: "性别",
                name: "gender",
                mapName: "",
                type: "string"
            },
            {
                note: "出生年月 yyyy-MM-dd",
                name: "birthday",
                mapName: "",
                type: "string",
                isToSpecial: false
            }
        ]
    },
//   "restPersonService/queryPersonWithGroup": {
//     note: "人员信息-列表页:查询人员缩略图",
//     type: "array",
//     proArr: [
//     {
//         note: "岗位id",
//         name: "position_id",
//         mapName: "",
//         type: "string",
//         isToSpecial: false
//     },
//     {
//         note: "岗位名称",
//         name: "position_name",
//         mapName: "",
//         type: "string",
//         isToSpecial: false
//     },
//     {
//         note: "员工数组",
//         name: "persons",
//         mapName: "",
//         type: "array",
//         proArr: [
//         {
//             note: "员工id",
//             name: "person_id",
//             mapName: "",
//             type: "string"
//         },
//         {
//             note: "所属项目id",
//             name: "project_id",
//             mapName: "",
//             type: "string",
//             isToSpecial: false
//         },
//         {
//             note: "员工编号",
//             name: "person_num",
//             mapName: "",
//             type: "string"
//         },
//          {
//             note: "姓名",
//             name: "name",
//             mapName: "",
//             type: "string"
//         },
//         {
//             note: "系统头像",
//             name: "head_portrait",
//             mapName: "",
//             type: "fileLink",
//             fileType: 1
//         }]
//       }
//     ]
//   },
    "restPersonService/queryPersonDetailById": {
        note: "人员管理-详细页:根据查询人员详细信息",
        type: "object",
        proArr: [{
            note: "员工id",
            name: "person_id",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "所属项目id ",
            name: "project_id",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "姓名",
            name: "name",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "员工识别码",
            name: "id_number",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "手机号",
            name: "phone_num",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "性别",
            name: "gender",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "出生年月",
            name: "birthday",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "邮箱",
            name: "person_mail",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "人员类型",
            name: "person_type",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "人员类型",
            name: "person_type",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "员工编号",
            name: "person_num",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "部门id",
            name: "dept_id",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "部门名称",
            name: "dept_name",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "岗位id",
            name: "position_id",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "岗位名称",
            name: "position_name",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "专业编码",
            name: "specialty",
            mapName: "",
            type: "array",
        }, {
            note: "已选中专业对象",
            name: "specialty_name",
            mapName: "",
            type: "array",
            proArr: [{
                "note": "code",
                "name": "code",
                "mapName": "",
                "type": "string"
            }, {
                "note": "name",
                "name": "name",
                "mapName": "",
                "type": "string"
            },]
        }, {
            note: "证件照片",
            name: "id_photo",
            mapName: "",
            type: "string",
        }, {
            note: "key",
            name: "head_portrait",
            mapName: "",
            type: "fileLink",
            fileType: 1
        }, {
            note: "人员状态",
            name: "person_status",
            mapName: "",
            type: "string",
        }, {
            note: "账号id",
            name: "person_user_id",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "账号名称",
            name: "person_user_name",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "权限包名称",
            name: "func_pack_names",
            mapName: "",
            type: "string",
            isToSpecial: false
        }],
    },
    "restPersonService/queryPersonDetailByidNumber": {
        note: "根据员工识别码查询人员详细信息",
        type: "object",
        proArr: [{
            note: "员工id",
            name: "person_id",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "所属项目id ",
            name: "project_id",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "姓名",
            name: "name",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "员工识别码",
            name: "id_number",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "手机号",
            name: "phone_num",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "性别",
            name: "gender",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "出生年月",
            name: "birthday",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "邮箱",
            name: "person_mail",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "人员类型",
            name: "person_type",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "人员类型",
            name: "person_type",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "员工编号",
            name: "person_num",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "部门id",
            name: "dept_id",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "部门名称",
            name: "dept_name",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "岗位id",
            name: "position_id",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "岗位名称",
            name: "position_name",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "专业编码",
            name: "specialty",
            mapName: "",
            type: "array",
        }, {
            note: "已选中专业对象",
            name: "specialty_name",
            mapName: "",
            type: "array",
            proArr: [{
                "note": "code",
                "name": "code",
                "mapName": "",
                "type": "string"
            }, {
                "note": "name",
                "name": "name",
                "mapName": "",
                "type": "string"
            },]
        }, {
            note: "证件照片",
            name: "id_photo",
            mapName: "",
            type: "string",
        }, {
            note: "key",
            name: "head_portrait",
            mapName: "",
            type: "fileLink",
            fileType: 1
        }, {
            note: "人员状态",
            name: "person_status",
            mapName: "",
            type: "string",
        }, {
            note: "账号id",
            name: "person_user_id",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "账号名称",
            name: "person_user_name",
            mapName: "",
            type: "string",
            isToSpecial: false
        }, {
            note: "权限包名称",
            name: "func_pack_names",
            mapName: "",
            type: "string",
            isToSpecial: false
        }],
    },
    "restGeneralDictService/queryGeneralDictByKey": {
        "note": "数据字典 查询专业",
        "type": "array",
        "proArr": [{
            "note": "id",
            "name": "code",
            "mapName": "",
            "type": "string"
        },
            {
                "note": "名字",
                "name": "name",
                "mapName": "",
                "type": "string"
            },
            {
                "note": "释义",
                "name": "description",
                "mapName": "",
                "type": "string"
            },
            {
                "note": "key值",
                "name": "dict_type",
                "mapName": "",
                "type": "string"
            }
        ]
    },
    'restEquipCompanyService/queryEquipCompanyList': {
        "note": "商家列表",
        "type": "array",
        "proArrBy": 'merchantInfo'
    },
    'merchantInfo': [{
        "note": "商家ID",
        "name": "company_id",
        "type": "string"
    }, {
        "note": "商家名称",
        "name": "company_name",
        "type": "string"
    }, {
        "note": "联系人",
        "name": "contacts",
        "type": "string"
    }, {
        "note": "联系电话",
        "name": "phone",
        "type": "string"
    }, {
        "note": "网址",
        "name": "web",
        "type": "string"
    }, {
        "note": "传真",
        "name": "fax",
        "type": "string"
    }, {
        "note": "电子邮件",
        "name": "email",
        "type": "string"
    }, {
        "note": "是否可以删除",
        "name": "can_delete",
        "type": "boolean"
    }, {
        "note": "设备品牌数组，生产厂家专用",
        "name": "equip_models",
        "type": "array"
    }, {
        "note": "保险单信息，保险公司专用",
        "name": "insurer_info",
        "type": "array",
        "proArr": [{
            "note": "保险单号",
            "name": "insurer_num",
            "type": "string"
        }, {
            "note": "保险文件",
            "name": "insurance_file",
            "type": "object",
            "proArr": [{
                "note": "保险文件名称",
                "name": "name",
                "type": "string"
            }, {
                "note": "保险文件标识",
                "name": "key",
                "type": "fileLink",
                "fileType": 2
            }]
        }]
    }],
    'restEquipCompanyService/queryEquipCompanyById':{
        "note":"设备通讯录--详情页：通过ID值获取详细信息",
        "type":"object",
        "proArr":[{
            "note": "商家ID",
            "name": "company_id",
            "type": "string"
        }, {
            "note": "商家名称",
            "name": "company_name",
            "type": "string"
        }, {
            "note": "联系人",
            "name": "contacts",
            "type": "string"
        }, {
            "note": "联系电话",
            "name": "phone",
            "type": "string"
        }, {
            "note": "网址",
            "name": "web",
            "type": "string"
        }, {
            "note": "传真",
            "name": "fax",
            "type": "string"
        }, {
            "note": "电子邮件",
            "name": "email",
            "type": "string"
        }, {
            "note": "是否可以删除",
            "name": "can_delete",
            "type": "boolean"
        }, {
            "note": "设备品牌数组，生产厂家专用",
            "name": "equip_models",
            "type": "array"
        }, {
            "note": "保险单信息，保险公司专用",
            "name": "insurer_info",
            "type": "array",
            "proArr": [{
                "note": "保险单号",
                "name": "insurer_num",
                "type": "string"
            }, {
                "note": "保险文件",
                "name": "insurance_file",
                "type": "object",
                "proArr": [{
                    "note": "保险文件名称",
                    "name": "name",
                    "type": "string"
                }, {
                    "note": "保险文件标识",
                    "name": "key",
                    "type": "fileLink",
                    "fileType": 2
                }]
            }]
        }]
    },
    'restEquipCompanyService/validmerchantnamerepeat': {
        "note": "验证商家名称是否重复",
        "type": "object"
    },
    'restEquipCompanyService/verifyCompanyName': {
        'note': '设备通讯录--验证公司名称的重复性',
        'type': 'object'
    },
    'restDictService/queryAllEquipCategory': {
        "type": "array",
        "note": "未输入note",
        "proArr": [{
            "name": "code",
            "type": "string",
            "note": "code"
        },
            {
                "name": "name",
                "type": "string",
                "note": "name"
            },
            {
                "name": "content",
                "type": "array",
                "note": "content",
                "proArr": [{
                    "name": "code",
                    "type": "string",
                    "note": "code"
                },
                    {
                        "name": "name",
                        "type": "string",
                        "note": "name"
                    },
                    {
                        "name": "content",
                        "type": "array",
                        "note": "content",
                        "proArr": [{
                            "name": "code",
                            "type": "string",
                            "note": "code"
                        },
                            {
                                "name": "name",
                                "type": "string",
                                "note": "name"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'restSystemService/queryBuildSystemTree': {
        "type": "array",
        "note": "未输入note",
        "proArr": [{
            "name": "build_id",
            "type": "string",
            "note": "build_id"
        },
            {
                "name": "build_name",
                "type": "string",
                "note": "build_name"
            },
            {
                "name": "system",
                "type": "array",
                "note": "system",
                "proArr": [{
                    "name": "system_id",
                    "type": "string",
                    "note": "system_id"
                },
                    {
                        "name": "system_local_id",
                        "type": "string",
                        "note": "system_local_id"
                    },
                    {
                        "name": "system_local_name",
                        "type": "string",
                        "note": "system_local_name"
                    }
                ]
            }
        ]
    },
    'restEquipService/queryEquipDynamicInfo': {
        "type": "array",
        "note": "未输入note",
        "proArr": [{
            "name": "info_Points",
            "type": "array",
            "note": "info_Points",
            "proArr": [{
                "name": "att_value",
                "type": "array",
                "note": "att_value",
                "proArr": [{
                    "name": "key",
                    "type": "fileLink",
                    "note": "key",
                    "fileType": "2",
                }, {
                    "name": "name",
                    "type": "string",
                    "note": "name"
                }, {
                    "name": "type",
                    "type": "string",
                    "note": "type"
                }]
            }, {
                "name": "cmpt",
                "type": "string",
                "note": "cmpt"
            }, {
                "name": "cmpt_data",
                "type": "array",
                "note": "cmpt_data",
                "proArr": [{
                    "name": "code",
                    "type": "string",
                    "note": "code"
                }, {
                    "name": "name",
                    "type": "string",
                    "note": "name"
                }]
            }, {
                "name": "data_type",
                "type": "string",
                "note": "data_type"
            }, {
                "name": "info_code",
                "type": "string",
                "note": "info_code"
            }, {
                "name": "info_name",
                "type": "string",
                "note": "info_name"
            }, {
                "name": "str_value",
                "type": "string",
                "note": "str_value"
            }, {
                "name": "unit",
                "type": "string",
                "note": "unit"
            }]
        }, {
            "name": "tag",
            "type": "string",
            "note": "tag"
        }]
    },
    'restEquipService/queryEquipPublicInfo': {
        "type": "object",
        "note": "未输入note",
        "proArr": [{
            "name": "equip_id",
            "type": "string",
            "note": "equip_id"
        },
            {
                "name": "equip_local_id",
                "type": "string",
                "note": "equip_local_id"
            },
            {
                "name": "equip_local_name",
                "type": "string",
                "note": "equip_local_name"
            },
            {
                "name": "BIMID",
                "type": "string",
                "note": "BIMID"
            },
            {
                "name": "build_id",
                "type": "string",
                "note": "build_id"
            },
            {
                "name": "position",
                "type": "string",
                "note": "position"
            },
            {
                "name": "equip_category_name",
                "type": "string",
                "note": "equip_category_name"
            },
            {
                "name": "system_name",
                "type": "string",
                "note": "system_name"
            },
            {
                "name": "space_id",
                "type": "string",
                "note": "space_id"
            },
            {
                "name": "length",
                "type": "string",
                "note": "length"
            },
            {
                "name": "width",
                "type": "string",
                "note": "width"
            },
            {
                "name": "height",
                "type": "string",
                "note": "height"
            },
            {
                "name": "mass",
                "type": "string",
                "note": "mass"
            },
            {
                "name": "material",
                "type": "string",
                "note": "material"
            },
            {
                "name": "dept",
                "type": "string",
                "note": "dept"
            },
            {
                "name": "drawing",
                "type": "array",
                "note": "drawing",
                "proArr": [{
                    "name": "key",
                    "type": "fileLink",
                    "fileType": "2"
                },
                    {
                        "name": "name",
                        "type": "string",
                        "note": "name"
                    },
                    {
                        "name": "type",
                        "type": "number",
                        "note": "type"
                    }
                ]
            },
            {
                "name": "picture",
                "type": "fileArray",
                "note": "picture",
            },
            {
                "name": "check_report",
                "type": "array",
                "note": "check_report",
                "proArr": [{
                    "name": "key",
                    "type": "fileLink",
                    "fileType": "2"
                },
                    {
                        "name": "name",
                        "type": "string",
                        "note": "name"
                    },
                    {
                        "name": "type",
                        "type": "number",
                        "note": "type"
                    }
                ]
            },
            {
                "name": "nameplate",
                "type": "fileArray",
                "note": "nameplate"
            },
            {
                "name": "archive",
                "type": "array",
                "note": "archive",
                "proArr": [{
                    "name": "key",
                    "type": "fileLink",
                    "fileType": "2"
                },
                    {
                        "name": "name",
                        "type": "string",
                        "note": "name"
                    },
                    {
                        "name": "type",
                        "type": "number",
                        "note": "type"
                    }
                ]
            },
            {
                "name": "manufacturer",
                "type": "string",
                "note": "manufacturer"
            },
            {
                "name": "brand",
                "type": "string",
                "note": "brand"
            },
            {
                "name": "product_date",
                "type": "date",
                "note": "product_date",
                "format": 'y.M.d'
            },
            {
                "name": "serial_num",
                "type": "string",
                "note": "serial_num"
            },
            {
                "name": "specification",
                "type": "string",
                "note": "specification"
            },
            {
                "name": "supplier",
                "type": "string",
                "note": "supplier"
            },
            {
                "name": "supplier_phone",
                "type": "string",
                "note": "supplier_phone"
            },
            {
                "name": "supplier_contactor",
                "type": "string",
                "note": "supplier_contactor"
            },
            {
                "name": "supplier_web",
                "type": "string",
                "note": "supplier_web"
            },
            {
                "name": "supplier_fax",
                "type": "string",
                "note": "supplier_fax"
            },
            {
                "name": "supplier_email",
                "type": "string",
                "note": "supplier_email"
            },
            {
                "name": "contract_id",
                "type": "string",
                "note": "contract_id"
            },
            {
                "name": "asset_id",
                "type": "string",
                "note": "asset_id"
            },
            {
                "name": "purchase_price",
                "type": "string",
                "note": "purchase_price"
            },
            {
                "name": "principal",
                "type": "string",
                "note": "principal"
            },
            {
                "name": "maintain_id",
                "type": "string",
                "note": "maintain_id"
            },
            {
                "name": "start_date",
                "type": "date",
                "note": "start_date",
                "format": 'y.M.d'
            },
            {
                "name": "maintain_deadline",
                "type": "date",
                "note": "maintain_deadline",
                "format": 'y.M.d'
            },
            {
                "name": "service_life",
                "type": "string",
                "note": "service_life"
            },
            {
                "name": "warranty",
                "type": "string",
                "note": "warranty"
            },
            {
                "name": "maintain_cycle",
                "type": "string",
                "note": "maintain_cycle"
            },
            {
                "name": "maintainer",
                "type": "string",
                "note": "maintainer"
            },
            {
                "name": "maintainer_phone",
                "type": "string",
                "note": "maintainer_phone"
            },
            {
                "name": "maintainer_contactor",
                "type": "string",
                "note": "maintainer_contactor"
            },
            {
                "name": "maintainer_web",
                "type": "string",
                "note": "maintainer_web"
            },
            {
                "name": "maintainer_fax",
                "type": "string",
                "note": "maintainer_fax"
            },
            {
                "name": "maintainer_email",
                "type": "string",
                "note": "maintainer_email"
            },
            {
                "name": "status",
                "type": "string",
                "note": "status"
            },
            {
                "name": "insurer",
                "type": "string",
                "note": "insurer"
            },
            {
                "name": "insurer_num",
                "type": "string",
                "note": "insurer_num"
            },
            {
                "name": "insurer_contactor",
                "type": "string",
                "note": "insurer_contactor"
            },
            {
                "name": "insurer_phone",
                "type": "string",
                "note": "insurer_phone"
            },
            {
                "name": "insurance_file",
                "type": "array",
                "note": "insurance_file",
                "proArr": [{
                    "name": "key",
                    "type": "fileLink",
                    "fileType": "1"
                },
                    {
                        "name": "name",
                        "type": "string",
                        "note": "name"
                    },
                    {
                        "name": "type",
                        "type": "number",
                        "note": "type"
                    }
                ]
            }
        ]
    },
    'restEquipService/queryEquipCardInfo': {
        "type": "object",
        "note": "未输入note",
        "proArr": [{
            "name": "equip_id",
            "type": "string",
            "note": "equip_id"
        },
            {
                "name": "equip_qr_code",
                "type": "fileLink",
                "fileType": 1,
                "note": "equip_qr_code"
            },
            {
                "name": "card_info",
                "type": "array",
                "note": "card_info",
                "proArr": [{
                    "name": "info_point_code",
                    "type": "string",
                    "note": "info_point_code"
                },
                    {
                        "name": "info_point_name",
                        "type": "string",
                        "note": "info_point_name"
                    },
                    {
                        "name": "value",
                        "type": "string",
                        "note": "value"
                    }
                ]
            }
        ]
    },
    "restDictService/queryDomainSystemEquipType": {
        "note": "数据字典 查询专业",
        "type": "array",
        "proArr": [{
            "note": "id",
            "name": "code",
            "mapName": "",
            "type": "string"
        },
            {
                "note": "名字",
                "name": "name",
                "mapName": "",
                "type": "string"
            },
            {
                "note": "释义",
                "name": "description",
                "mapName": "",
                "type": "string"
            },
            {
                "note": "key值",
                "name": "dict_type",
                "mapName": "",
                "type": "string"
            }
        ]
    },
    'restEquipService/queryEquipRelWorkOrder': {
        "type": "array",
        "note": "未输入note",
        "proArr": [{
            "name": "order_id",
            "type": "string",
            "note": "order_id"
        },
            {
                "name": "summary",
                "type": "string",
                "note": "summary"
            },
            {
                "name": "order_state",
                "type": "string",
                "note": "order_state",
                "isToSpecial": false
            },
            {
                "name": "order_state_name",
                "type": "string",
                "note": "order_state_name"
            },
            {
                "name": "custom_state_name",
                "type": "string",
                "note": "custom_state_name"
            },
            {
                "name": "participants",
                "type": "string",
                "note": "participants"
            },
            {
                "name": "publish_time",
                "type": "string",
                "note": "publish_time"
            },
            {
                "name": "desc_photos",
                "type": "fileArray",
                "note": "desc_photos"
            }
        ]
    },
    'restWorkOrderService/queryEquipDetailRelWorkOrder': {
        "type": "array",
        "note": "未输入note",
        "proArr": [{
            "name": "order_id",
            "type": "string",
            "note": "order_id"
        },
            {
                "name": "summary",
                "type": "string",
                "note": "summary"
            },
            {
                "name": "order_state",
                "type": "string",
                "note": "order_state",
                "isToSpecial": false
            },
            {
                "name": "order_state_name",
                "type": "string",
                "note": "order_state_name"
            },
            {
                "name": "custom_state_name",
                "type": "string",
                "note": "custom_state_name"
            },
            {
                "name": "participants",
                "type": "string",
                "note": "participants"
            },
            {
                "name": "publish_time",
                "type": "string",
                "note": "publish_time"
            },
            {
                "name": "desc_photos",
                "type": "fileArray",
                "note": "desc_photos"
            }
        ]
    },
    "restObjectService/queryBuildFloorSpaceTree": {
        note: '查询建筑-楼层-空间列表树',
        type: 'array',
        proArr: [{
            note: '对象id',
            name: 'obj_id',
            type: 'string'
        }, {
            note: '对象名称',
            name: 'obj_name',
            type: 'string'
        }, {
            note: '对象类型',
            name: 'obj_type',
            type: 'string'
        }, {
            note: '下级列表',
            name: 'content',
            type: 'array',
            proArr: [{
                note: '对象id',
                name: 'obj_id',
                type: 'string'
            }, {
                note: '对象名称',
                name: 'obj_name',
                type: 'string'
            }, {
                note: '对象类型',
                name: 'obj_type',
                type: 'string'
            }, {
                note: '下级列表',
                name: 'content',
                type: 'array',
                proArr: [{
                    note: '对象id',
                    name: 'obj_id',
                    type: 'string'
                }, {
                    note: '对象名称',
                    name: 'obj_name',
                    type: 'string'
                }, {
                    note: '对象类型',
                    name: 'obj_type',
                    type: 'string'
                }, {
                    note: '父级',
                    name: 'parents',
                    type: 'array',
                    proArr: [{
                        note: '父级id列表',
                        name: 'parent_ids',
                        type: 'array'
                    }, {
                        note: '父级名称列表',
                        name: 'parent_names',
                        type: 'array'
                    }]
                }]
            }]
        }]
    },
    "restObjectService/querySystemForSystemDomain": {
        note: '查询设备实例-系统专业下所有系统',
        type: 'array',
        proArr: [{
            note: 'id',
            name: 'system_id',
            type: 'string'
        }, {
            note: '名称',
            name: 'system_name',
            type: 'string'
        }]
    },
    "restObjectService/queryEquipCategoryBySystemId": {
        note: '查询设备实例-系统下的所有类型',
        type: 'array',
        proArr: [{
            note: 'id',
            name: 'code',
            type: 'string'
        }, {
            note: '名称',
            name: 'name',
            type: 'string'
        }]
    },

    'restEquipCompanyService/queryEquipCompanySel': {
        "type": "array",
        "note": "未输入note",
        "proArrBy": 'merchantInfo'
    },
    'restEquipService/queryEquipInfoPointHis': {
        "type": "array",
        "note": "未输入note",
        "proArr": [{
            "name": "date",
            "type": "string",
            "note": "date"
        },
            {
                "name": "value",
                "type": "string",
                "note": "value"
            },
            {
                "name": "name",
                "type": "string",
                "note": "name"
            }
        ]
    },
    'restEquipService/updateEquipInfo': {
        "type": "object",
        "note": "未输入note",
        "proArr": [{
            "name": "Result",
            "type": "string",
            "note": "Result"
        },
            {
                "name": "ResultMsg",
                "type": "string",
                "note": "ResultMsg"
            }
        ]
    },
    'restObjectService/querySystemForBuild': {
        "type": "array",
        "note": "未输入note",
    },
    'restEquipService/addEquip': {
        "type": "object",
        "note": "未输入note",
        "proArr": [{
            "name": "Result",
            "type": "string",
            "note": "Result"
        },
            {
                "name": "ResultMsg",
                "type": "string",
                "note": "ResultMsg"
            }
        ]
    },
    'restEquipService/verifyEquipLocalId': {
        "type": "object",
        "note": "未输入note",
    },
    'restEquipService/verifyEquipBimId': {
        "type": "object",
        "note": "未输入note",
    },
    'restEquipCompanyService/addCompanyBrand': {
        "type": "object",
        "note": "未输入note",
    },
    'restEquipCompanyService/addCompanyEquipModel': {
        "type": "object",
        "note": "未输入note",
    },
    
    'restEquipCompanyService/addCompanyInsurerNum': {
        "type": "object",
        "note": "未输入note",
    },
    'restEquipService/queryEquipDynamicInfoForAdd': {
        "type": "array",
        "note": "未输入note",
    },
    'restEquipService/queryEquipList': {
        "type": "array",
        "note": "设备管理首页-查询项目下设备列表",
        // "proArrBy": 'equipList'
    },
    'restEquipService/queryRepairEquipList': {
        "type": "array",
        "note": "未输入note",
    },
    'restEquipService/queryMaintEquipList': {
        "type": "array",
        "note": "未输入note",
    },
    'restEquipService/queryGoingDestroyEquipList': {
        "type": "array",
        "note": "未输入note",
    },
    'restEquipService/verifyDestroyEquip': {
        "type": "object",
        "note": "未输入note",
        "proArr": [{
            "name": "can_destroy",
            "type": "boolean",
            "note": "can_destroy"
        },
            {
                "name": "remind",
                "type": "string",
                "note": "remind"
            }
        ]
    },
    'restEquipService/destroyEquip': {
        "type": "object",
        "note": "未输入note",
        "proArr": [{
            "name": "Result",
            "type": "string",
            "note": "Result"
        },
            {
                "name": "ResultMsg",
                "type": "string",
                "note": "ResultMsg"
            }
        ]
    },
    'restSystemService/updateSystemInfo': {
        "type": "object",
        "note": "未输入note",
        "proArr": [{
            "name": "Result",
            "type": "string",
            "note": "Result"
        },
            {
                "name": "ResultMsg",
                "type": "string",
                "note": "ResultMsg"
            }
        ]
    },
    'restSystemService/querySystemInfoPointHis': {
        "type": "array",
        "note": "未输入note",
        "proArr": [{
            "name": "date",
            "type": "string",
            "note": "date"
        },
            {
                "name": "value",
                "type": "string",
                "note": "value"
            },
            {
                "name": "name",
                "type": "string",
                "note": "name"
            }
        ]
    },
    'restSystemService/querySystemPublicInfo': {
        "type": "object",
        "note": "未输入note",
        "proArr": [{
            "name": "system_id",
            "type": "string",
            "note": "system_id"
        },
            {
                "name": "system_local_id",
                "type": "string",
                "note": "system_local_id"
            },
            {
                "name": "system_local_name",
                "type": "string",
                "note": "system_local_name"
            },
            {
                "name": "BIMID",
                "type": "string",
                "note": "BIMID"
            },
            {
                "name": "build_local_name",
                "type": "string",
                "note": "build_local_name"
            },
            {
                "name": "domain_name",
                "type": "string",
                "note": "domain_name"
            },
            {
                "name": "system_category_name",
                "type": "string",
                "note": "system_category_name"
            }
        ]
    },
    'restSystemService/querySystemDynamicInfo': {
        "type": "array",
        "note": "未输入note",
    },
    "restObjectService/queryBuild": {
        note: '查询建筑体',
        type: 'array',
        proArr: [{
            note: '对象id',
            name: 'obj_id',
            type: 'string'
        }, {
            note: '对象名称',
            name: 'obj_name',
            type: 'string'
        }]
    },
    'restSystemService/querySystemDynamicInfoForAdd': {
        "type": "array",
        "note": "未输入note",
    },
    'restSystemService/addSystem': {
        "type": "object",
        "note": "未输入note",
        "proArr": [{
            "name": "Result",
            "type": "string",
            "note": "Result"
        },
            {
                "name": "ResultMsg",
                "type": "string",
                "note": "ResultMsg"
            }
        ]
    },
    'restSystemService/verifySystemName': {
        "type": "object",
        "note": "未输入note",
    },
    'restSystemService/verifySystemLocalId': {
        "type": "object",
        "note": "未输入note",
    },
    'restSystemService/verifySystemBimId': {
        "type": "object",
        "note": "未输入note",
    },
    'restCardService/queryNotDownloadEquipList': {
        "type": "array",
        "note": "设备名片页-未下载的设备列表",
        "proArrBy": 'equipList'
    },
    'restCardService/queryEquipList': {
        "type": "array",
        "note": "设备名片页-已下载的设备列表",
        "proArrBy": 'equipList'
    },
    'equipList': [{
        "name": "equip_id",
        "type": "string",
        "note": "equip_id"
    }, {
        "name": "equip_local_id",
        "type": "string",
        "note": "equip_local_id"
    }, {
        "name": "equip_local_name",
        "type": "string",
        "note": "equip_local_name"
    }, {
        "name": "specification",
        "type": "string",
        "note": "specification"
    }, {
        "name": "position",
        "type": "string",
        "note": "position"
    }, {
        "name": "supplier",
        "type": "string",
        "note": "supplier"
    }, {
        "name": "download_flag",
        "type": "string",
        "note": "是否下载过 0 为下载   1 已下载"
    }, {
        "name": "create_time",
        "type": "date",
        "note": "create_time",
        "format": 'y.M.d h:m'
    }, {
        "name": "destroy_remind_type",
        "type": "string",
        "note": "报废提醒类型，1-距离时间，2-超出时间"
    }, {
        "name": "destroy_remind",
        "type": "string",
        "note": "destroy_remind"
    }],

    'restCardService/queryNotDownloadSpaceList': {
        "type": "array",
        "note": "设备名片页-未下载的空间列表",
        "proArrBy": 'spaceInfo'
    },
    'restCardService/querySpaceList': {
        "type": "array",
        "note": "设备名片页-已下载的空间列表",
        "proArrBy": 'spaceInfo'
    },
    'spaceInfo': [{
        "note": "空间id",
        "name": "space_id",
        "type": "string"
    }, {
        "note": "空间本地编码",
        "name": "room_local_id",
        "type": "string"
    }, {
        "note": "空间本地名称",
        "name": "room_local_name",
        "type": "string"
    }, {
        "note": "空间功能类型名称",
        "name": "room_func_type_name",
        "type": "string"
    }, {
        "note": "备注",
        "name": "intro",
        "type": "string"
    }, {
        "note": "是否下载的标记 0 未下载   1 已下载",
        "name": "download_flag",
        "type": "string"
    }, {
        "note": "创建时间",
        "name": "create_time",
        "type": "date",
        "format": "y.M.d h:m"
    }],
    'restFloorService/queryFloorList': {
        "type": "array",
        "note": "设备名片页-获取某建筑下的楼层",
        "proArr": [{
            "note": "楼层ID",
            "name": "floor_id",
            "type": "string"
        }, {
            "note": "楼层名称",
            "name": "floor_local_name",
            "type": "string"
        }]
    },
    'restCardService/queryEquipOptions': {
        "note": "设备名片页-设备选择项",
        "type": "array",
        "proArr": [{
            "note": "信息点编码",
            "name": "info_point_code",
            "type": "string"
        }, {
            "note": "信息点名称",
            "name": "info_point_name",
            "type": "string"
        }]
    },
    'restCardService/querySpaceOptions': {
        "note": "设备名片页-空间选择项",
        "type": "array",
        "proArr": [{
            "note": "信息点编码",
            "name": "info_point_code",
            "type": "string"
        }, {
            "note": "信息点名称",
            "name": "info_point_name",
            "type": "string"
        }]
    },
    'restCardService/queryCardInfo': {
        "note": "设备名片页-上一次设置的设备名片或空间名片",
        "type": "object",
        "proArr": [{
            "note": "项目id",
            "name": "project_id",
            "type": "string"
        }, {
            "note": "对象类型，space、equip",
            "name": "obj_type",
            "type": "string"
        }, {
            "note": "标题和logo",
            "name": "card_title",
            "type": "object",
            "proArr": [{
                "note": "标题",
                "name": "title",
                "type": "string",
                'isToSpecial': false
            }, {
                "note": "logo的key",
                "name": "logo",
                "type": "fileLink"
            }]
        }, {
            "note": "名片信息项",
            "name": "card_info",
            "type": "array",
            "proArr": [{
                "note": "信息项编码",
                "name": "info_point_code",
                "type": "string"
            }, {
                "note": "信息项名称",
                "name": "info_point_name",
                "type": "string"
            }]
        }]
    },
    "restFloorService/queryFloorWithOrder": {
        "note": "查询某建筑下楼层信息",
        "type": "array",
        "proArr": [{
            "note": "楼层id",
            "name": "floor_id",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "楼层编码",
            "name": "floor_local_id",
            "mapName": "",
            "type": "string",
        }, {
            "note": "楼层本地名称",
            "name": "floor_local_name",
            "mapName": "",
            "type": "string",
        }, {
            "note": "楼层顺序码",
            "name": "floor_sequence_id",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "楼层性质，1. 普通楼层 2. 中庭 3. 室外 4. 其他",
            "name": "floor_type",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "楼层编码",
            "name": "floor_identity",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "楼层面积",
            "name": "area",
            "mapName": "",
            "type": "string",
        },
            {
                "note": "楼层高",
                "name": "net_height",
                "mapName": "",
                "type": "string",
            }, {
                "note": "楼层功能",
                "name": "floor_func_type",
                "mapName": "",
                "type": "string",
            }, {
                "note": "是否选中",
                "name": "ischeck",
                "mapName": "",
                "type": "boolean",
            }
        ]
    },
    "restFloorService/queryFloorById": {
        "note": "根据id查询楼层详细信息",
        "type": "object",
        "proArr": [{
            "note": "楼层id",
            "name": "floor_id",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "楼层编码",
            "name": "floor_local_id",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "楼层本地名称",
            "name": "floor_local_name",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "楼层顺序码",
            "name": "floor_sequence_id",
            "mapName": "",
            "type": "string",
            "isToSpecial": false,
        }, {
            "note": "BIM编码",
            "name": "BIMID",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "楼层性质，1. 普通楼层 2. 中庭 3. 室外 4. 其他",
            "name": "floor_type",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "楼层编码",
            "name": "floor_identity",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "楼层面积",
            "name": "area",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        },
            {
                "note": "楼层高",
                "name": "net_height",
                "mapName": "",
                "type": "string",
                "isToSpecial": false
            }, {
                "note": "楼层功能",
                "name": "floor_func_type",
                "mapName": "",
                "type": "string",
                "isToSpecial": false
            }, {
                "note": "楼层常驻人数",
                "name": "permanent_people_num",
                "mapName": "",
                "type": "string",
                "isToSpecial": false
            },
            {
                "note": "逐时流出人数",
                "name": "out_people_flow",
                "mapName": "",
                "type": "string",
                "isToSpecial": false
            }, {
                "note": "逐时流入人数",
                "name": "in_people_flow",
                "mapName": "",
                "type": "string",
                "isToSpecial": false
            }, {
                "note": "逐时楼层内现有人数",
                "name": "exsit_people_num",
                "mapName": "",
                "type": "string",
                "isToSpecial": false
            },
        ]
    },
    "restSpaceService/querySpaceWithGroup": {
        "note": "查询某建筑下空间信息",
        "type": "array",
        "proArr": [{
            "note": "楼层id",
            "name": "floor_id",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "楼层本地名称",
            "name": "floor_local_name",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "空间",
            "name": "spaces",
            "mapName": "",
            "type": "array",
            "proArr": [{
                "note": "空间id",
                "name": "space_id",
                "mapName": "",
                "type": "string",
                "isToSpecial": false
            }, {
                "note": "空间编码",
                "name": "room_local_id",
                "mapName": "",
                "type": "string",
            }, {
                "note": "空间本地名称",
                "name": "room_local_name",
                "mapName": "",
                "type": "string",
            }, {
                "note": "空间功能类型名称",
                "name": "room_func_type_name",
                "mapName": "",
                "type": "string",
                "isToSpecial": false
            }, {
                "note": "工单",
                "name": "work_orders",
                "mapName": "",
                "type": "array",
                "proArr": [{
                    "note": "工单类型编码",
                    "name": "order_type",
                    "mapName": "",
                    "type": "string",
                }, {
                    "note": "该类型下的工单",
                    "name": "orders",
                    "mapName": "",
                    "type": "array",
                    "proArr": [{
                        "note": "工单id",
                        "name": "order_id",
                        "mapName": "",
                        "type": "string",
                    }, {
                        "note": "工单概述",
                        "name": "summary",
                        "mapName": "",
                        "type": "string",
                    }, {
                        "note": "工单状态名称",
                        "name": "order_state_name",
                        "mapName": "",
                        "type": "string",
                    }]
                }]
            }]
        }]
    },
    "restSpaceService/querySpaceForFloor": {
        "note": "查询某楼层下空间信息",
        "type": "array",
        "proArr": [{
            "note": "空间id",
            "name": "space_id",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "空间编码",
            "name": "room_local_id",
            "mapName": "",
            "type": "string",
        }, {
            "note": "空间本地名称",
            "name": "room_local_name",
            "mapName": "",
            "type": "string",
        }, {
            "note": "空间功能类型名称",
            "name": "room_func_type_name",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "工单",
            "name": "work_orders",
            "mapName": "",
            "type": "array",
            "proArr": [{
                "note": "工单类型编码",
                "name": "order_type",
                "mapName": "",
                "type": "string",
            }, {
                "note": "该类型下的工单",
                "name": "orders",
                "mapName": "",
                "type": "array",
                "proArr": [{
                    "note": "工单id",
                    "name": "order_id",
                    "mapName": "",
                    "type": "string",
                }, {
                    "note": "工单概述",
                    "name": "summary",
                    "mapName": "",
                    "type": "string",
                }, {
                    "note": "工单状态名称",
                    "name": "order_state_name",
                    "mapName": "",
                    "type": "string",
                }]
            }]
        }]
    },
    "restSpaceService/queryDestroyedSpace": {
        "note": "查询某建筑下已拆除的空间信息",
        "type": "array",
        "proArr": [{
            "note": "楼层id",
            "name": "floor_id",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "楼层本地名称",
            "name": "floor_local_name",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "空间",
            "name": "spaces",
            "mapName": "",
            "type": "array",
            "proArr": [{
                "note": "空间id",
                "name": "space_id",
                "mapName": "",
                "type": "string",
                "isToSpecial": false
            }, {
                "note": "空间编码",
                "name": "room_local_id",
                "mapName": "",
                "type": "string",
            }, {
                "note": "空间本地名称",
                "name": "room_local_name",
                "mapName": "",
                "type": "string",
            }, {
                "note": "空间功能类型名称",
                "name": "room_func_type_name",
                "mapName": "",
                "type": "string",
                "isToSpecial": false
            }]
        }]
    },
    "restSpaceService/querySpaceRemindConfig": {
        "note": "查询空间提醒设置",
        "type": "array",
        "proArr": [{
            "note": "code",
            "name": "code",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "名称",
            "name": "name",
            "mapName": "",
            "type": "string",
        }, {
            "note": "是否提醒",
            "name": "is_remind",
            "mapName": "",
            "type": "boolean",
        }]
    },
    "restDictService/queryAllSpaceCode": {
        "note": "查询空间功能类型",
        "type": "array",
        "proArr": [{
            "note": "code",
            "name": "code",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "名称",
            "name": "name",
            "mapName": "",
            "type": "string",
        }, {
            "note": "内容",
            "name": "content",
            "mapName": "",
            "type": "array",
            "proArr": [{
                "note": "code",
                "name": "code",
                "mapName": "",
                "type": "string",
                "isToSpecial": false
            }, {
                "note": "名称",
                "name": "name",
                "mapName": "",
                "type": "string",
            }, {
                "note": "内容",
                "name": "content",
                "mapName": "",
                "type": "array",
                "proArr": [{
                    "note": "code",
                    "name": "code",
                    "mapName": "",
                    "type": "string",
                    "isToSpecial": false
                }, {
                    "note": "名称",
                    "name": "name",
                    "mapName": "",
                    "type": "string",
                }]
            }],
        }]
    },
    "restDictService/queryAllRentalCode": {
        "note": "查询租赁业态类型",
        "type": "array",
        "proArr": [{
            "note": "code",
            "name": "code",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "名称",
            "name": "name",
            "mapName": "",
            "type": "string",
        }, {
            "note": "内容",
            "name": "content",
            "mapName": "",
            "type": "array",
            "proArr": [{
                "note": "code",
                "name": "code",
                "mapName": "",
                "type": "string",
                "isToSpecial": false
            }, {
                "note": "名称",
                "name": "name",
                "mapName": "",
                "type": "string",
            }, {
                "note": "内容",
                "name": "content",
                "mapName": "",
                "type": "array",
                "proArr": [{
                    "note": "code",
                    "name": "code",
                    "mapName": "",
                    "type": "string",
                    "isToSpecial": false
                }, {
                    "note": "名称",
                    "name": "name",
                    "mapName": "",
                    "type": "string",
                }]
            }],
        }]
    },
    "restFloorService/queryFloorInfoPointHis": {
        "note": "查询楼层信息点的历史信息",
        "type": "array",
        "proArr": [{
            "note": "时间",
            "name": "date",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "值",
            "name": "value",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "值",
            "name": "name",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }]
    },
    "restSpaceService/querySpaceInfoPointHis": {
        "note": "查询空间信息点的历史信息",
        "type": "array",
        "proArr": [{
            "note": "时间",
            "name": "date",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "值",
            "name": "value",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "值",
            "name": "name",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }]
    },
    "restSpaceService/querySpaceById": {
        "note": "根据id查询空间详细信息",
        "type": "object",
        "proArr": [{
            "note": "空间id",
            "name": "space_id",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "所属建筑id",
            "name": "build_id",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "所属建筑名称",
            "name": "build_local_name",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "所属楼层名称",
            "name": "floor_local_name",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "空间本地编码",
            "name": "room_local_id",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "空间名称",
            "name": "room_local_name",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "BIM编码",
            "name": "BIMID",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "空间功能区类型",
            "name": "room_func_type",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "空间功能区类型名称",
            "name": "room_func_type_name",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "长度",
            "name": "length",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "宽",
            "name": "width",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "高",
            "name": "height",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "面积",
            "name": "area",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "配电容量",
            "name": "elec_cap",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "备注文字",
            "name": "intro",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "租赁业态类型",
            "name": "tenant_type",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "租赁业态类型名称",
            "name": "tenant_type_name",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "所属租户",
            "name": "tenant",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "空间内常驻人数",
            "name": "permanent_people_num",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "逐时流出人数",
            "name": "out_people_flow",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "逐时流入人数",
            "name": "in_people_flow",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "逐时空间内现有人数",
            "name": "exsit_people_num",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "用电功率",
            "name": "elec_power",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "逐时冷量",
            "name": "cool_consum",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "逐时热量",
            "name": "heat_consum",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "空调水压力",
            "name": "ac_water_press",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "用水量",
            "name": "water_consum",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "自来水压力",
            "name": "water_press",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "热水用水量",
            "name": "hot_water_consum",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "热水压力",
            "name": "hot_water_press",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "用燃气量",
            "name": "gas_consum",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "燃气压力",
            "name": "gas_press",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "热舒适PMV",
            "name": "PMV",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }, {
            "note": "热舒适PPD",
            "name": "PPD",
            "mapName": "",
            "type": "string",
            "isToSpecial": false
        }]
    },
    'restEquipService/queryEquipStatisticCount': {
        "type": "object",
        "note": "设备管理-首页:查询设备统计数量",
        "proArr": [{
            "name": "equip_total",
            "type": "number",
            "note": "equip_total"
        },
            {
                "name": "new_count",
                "type": "number",
                "note": "new_count"
            },
            {
                "name": "repair_count",
                "type": "number",
                "note": "repair_count"
            },
            {
                "name": "maint_count",
                "type": "number",
                "note": "maint_count"
            },
            {
                "name": "going_destroy_count",
                "type": "number",
                "note": "going_destroy_count"
            }
        ]
    },
    'workorder/restWorkOrderService/queryWorkOrderList': {
        "type": "array",
        "note": "工单管理列表",
        "proArr": [ 
            {
                "name": "order_id",
                "type": "string",
                "note": "order_id"
            },
            {
                "name": "order_type",
                "type": "string",
                "note": "order_type"
            },
            {
                "name": "order_type_name",
                "type": "string",
                "note": "order_type_name"
            },
            {
                "name": "order_state",
                "type": "string",
                "note": "order_state"
            },
            {
                "name": "order_state_name",
                "type": "string",
                "note": "order_state_name"
            },
            {
                "name": "summary",
                "type": "string",
                "note": "summary"
            },
            
            {
                "name": "create_time",
                "type": "date",
                "format": 'y.M.d h:m',
                "note": "create_time"
            }
        ]
    },
    

};
module.exports = dataModelMap;
