// 计划管理通用
v.pushComponent({
    name: "workOrderDetail",
    data: {
        workOrderId:"",
        // 工单详情数据
        orderDetailData:{
            "order_id": "Wo13010200011506327526532",
            "project_id": "Pj1301020001",
            "order_type": "2",
            "order_type_name": "维修",
            "execute_type": "temp",
            "urgency": "高",
            "executie_mode": "--",
            "start_time_type": "1",
            "ask_start_time": "20170925161846",
            "ask_end_limit": "2.5",
            "ask_end_time": "20170925184846",
            "required_tools": [],
            "order_state": "8",
            "order_state_name": "完成",
            "custom_state": "C7",
            "custom_state_name": "未完成",
            "summary": "测试-事项名称-003",
            "order_from_type": "1",
            "order_from_id": "--",
            "creator_id": "RY1503538063730",
            "creator_name": "孟祥永1",
            "domain_list": [
                "AC"
            ],
            "limit_domain": "--",
            "matters": [
                {
                "$ID": "0b824680c364466599f1e8ffa5fbd9b1",
                "matter_id": "0b824680c364466599f1e8ffa5fbd9b1",
                "matter_name": "测试-事项名称-006",
                "matter_steps": [
                    {
                    "$ID": "1fcecba6b5f24c34a2beb501daed71c8",
                    "obj_step_id": "1fcecba6b5f24c34a2beb501daed71c8",
                    "description": "测试-事项描述-006",
                    "obj_id": "Eq1301020001001ACCCCC001",
                    "obj_name": "1号楼-离心机-001",
                    "steps": [
                        {
                        "step_id": "1fcecba6b5f24c34a2beb501daed71c8_1-1",
                        "$ID": "1fcecba6b5f24c34a2beb501daed71c8_1-1",
                        "step_sequence": "1-1",
                        "step_type": "3",
                        "pre_conform": "--",
                        "content": "到达指定位置拍照",
                        "content_objs": [],
                        "notice": "--",
                        "confirm_result": [],
                        "domain": "--",
                        "domain_name": "--"
                        },
                        {
                        "step_id": "1fcecba6b5f24c34a2beb501daed71c8_1-2",
                        "$ID": "1fcecba6b5f24c34a2beb501daed71c8_1-2",
                        "step_sequence": "1-2",
                        "step_type": "4",
                        "pre_conform": "--",
                        "content": "到达指定位置扫码",
                        "content_objs": [],
                        "notice": "--",
                        "confirm_result": [],
                        "domain": "--",
                        "domain_name": "--"
                        },
                        {
                        "step_id": "1fcecba6b5f24c34a2beb501daed71c8_2-1",
                        "$ID": "1fcecba6b5f24c34a2beb501daed71c8_2-1",
                        "step_sequence": "2-1",
                        "step_type": "5",
                        "pre_conform": "测试-强制确认-003",
                        "content": "测试-操作内容-003",
                        "content_objs": [
                            {
                            "obj_id": "Eq1301020001001ACCCCC001",
                            "obj_name": "1号楼-离心机-001",
                            "obj_type": "equip"
                            }
                        ],
                        "notice": "测试-注意事项-003",
                        "confirm_result": [
                            {
                            "obj_id": "Eq1301020001001ACCCCC001",
                            "obj_name": "1号楼-离心机-001",
                            "obj_type": "equip",
                            "parents": [
                                {
                                "parent_ids": [
                                    "Bd1301020001001",
                                    "Fl1301020001001001",
                                    "Sp1301020001001001001"
                                ],
                                "parent_names": [
                                    "上格云-001-1号楼",
                                    "1号楼-1层",
                                    "1号楼-1层-1号房间"
                                ]
                                },
                                {
                                "parent_ids": [
                                    "AC",
                                    "Sy1301020001001ACCC001"
                                ],
                                "parent_names": [
                                    "空调",
                                    "1号楼-中央供冷系统-001"
                                ]
                                },
                                {
                                "parent_ids": [
                                    "AC",
                                    "CC",
                                    "CCCC"
                                ],
                                "parent_names": [
                                    "空调",
                                    "中央供冷系统",
                                    "离心机"
                                ]
                                }
                            ],
                            "info_points": [
                                {
                                "id": "equip_CCCC_PowerType",
                                "code": "PowerType",
                                "name": "电源类型",
                                "unit": "",
                                "cmpt": "Radio01",
                                "cmpt_data": [
                                    {
                                    "code": "1",
                                    "name": "220V"
                                    },
                                    {
                                    "code": "2",
                                    "name": "380V"
                                    },
                                    {
                                    "code": "3",
                                    "name": "10kV"
                                    },
                                    {
                                    "code": "4",
                                    "name": "其他"
                                    }
                                ]
                                }
                            ],
                            "customs": [
                                {
                                "name": "确认信息1",
                                "type": "1",
                                "items": [],
                                "unit": ""
                                },
                                {
                                "name": "确认信息2",
                                "type": "2",
                                "items": [
                                    "选项1",
                                    "选项2",
                                    "选项3"
                                ],
                                "unit": ""
                                },
                                {
                                "name": "确认信息3",
                                "type": "3",
                                "items": [
                                    "选项1",
                                    "选项2",
                                    "选项3"
                                ],
                                "unit": ""
                                },
                                {
                                "name": "确认信息4",
                                "type": "4",
                                "items": [],
                                "unit": ""
                                },
                                {
                                "name": "确认信息5",
                                "type": "5",
                                "items": [],
                                "unit": "m"
                                }
                            ]
                            }
                        ],
                        "domain": "AC",
                        "domain_name": "空调"
                        }
                    ],
                    "feedback": [
                        {
                        "$ID": "1fcecba6b5f24c34a2beb501daed71c8_1-1",
                        "step_id": "1fcecba6b5f24c34a2beb501daed71c8_1-1",
                        "step_sequence": "1-1",
                        "step_type": "3",
                        "pre_conform_result": "",
                        "description": "",
                        "confirm_result": [],
                        "photos": [
                            "/pfiledownload/6b%2C65%2C79?ft=1",
                            "/pfiledownload/31%2C35%2C30%2C36%2C36%2C35%2C30%2C34%2C33%2C36%2C31%2C35%2C35%2C2e%2C6a%2C70%2C67?ft=1"
                        ],
                        "executor_id": "RY1503538063730",
                        "operate_time": "20170929100052"
                        },
                        {
                        "$ID": "1fcecba6b5f24c34a2beb501daed71c8_1-2",
                        "step_id": "1fcecba6b5f24c34a2beb501daed71c8_1-2",
                        "step_sequence": "1-2",
                        "step_type": "4",
                        "pre_conform_result": "",
                        "description": "",
                        "confirm_result": [],
                        "photos": [],
                        "executor_id": "RY1503538063730",
                        "operate_time": "20170929100957"
                        },
                        {
                        "$ID": "1fcecba6b5f24c34a2beb501daed71c8_2-1",
                        "step_id": "1fcecba6b5f24c34a2beb501daed71c8_2-1",
                        "step_sequence": "2-1",
                        "step_type": "5",
                        "pre_conform_result": "",
                        "description": "",
                        "confirm_result": [
                            {
                            "obj_id": "Eq1301020001001ACCCCC001",
                            "obj_name": "1号楼-离心机-001",
                            "info_points": [
                                {
                                "id": "equip_CCCC_PowerType",
                                "code": "PowerType",
                                "name": "电源类型",
                                "value": "380V",
                                "unit": ""
                                }
                            ],
                            "customs": [
                                {
                                "name": "确认信息1",
                                "type": "1",
                                "content": "宅男女神你呢",
                                "item": "",
                                "items": [],
                                "value": "",
                                "unit": ""
                                },
                                {
                                "name": "确认信息2",
                                "type": "2",
                                "content": "",
                                "item": "选项2",
                                "items": [
                                    "选项1",
                                    "选项2",
                                    "选项3"
                                ],
                                "value": "",
                                "unit": ""
                                },
                                {
                                "name": "确认信息3",
                                "type": "3",
                                "content": "",
                                "item": "",
                                "items": [
                                    "选项2"
                                ],
                                "value": "",
                                "unit": ""
                                },
                                {
                                "name": "确认信息4",
                                "type": "4",
                                "content": "",
                                "item": "",
                                "items": [],
                                "value": "4979",
                                "unit": ""
                                },
                                {
                                "name": "确认信息5",
                                "type": "5",
                                "content": "",
                                "item": "",
                                "items": [],
                                "value": "494949",
                                "unit": "m"
                                }
                            ]
                            }
                        ],
                        "photos": [],
                        "executor_id": "RY1503538063730",
                        "operate_time": "20170929101354"
                        }
                    ],
                    "executors": [
                        "孟祥永1"
                    ]
                    },
                    {
                    "$ID": "80f411f1b31d45f9bbe8c9ff78e1f089",
                    "obj_step_id": "80f411f1b31d45f9bbe8c9ff78e1f089",
                    "description": "",
                    "obj_id": "",
                    "obj_name": "--",
                    "steps": [
                        {
                        "step_id": "80f411f1b31d45f9bbe8c9ff78e1f089_3-1",
                        "$ID": "80f411f1b31d45f9bbe8c9ff78e1f089_3-1",
                        "step_sequence": "3-1",
                        "step_type": "6",
                        "pre_conform": "--",
                        "content": "结束该事项时签字",
                        "content_objs": [],
                        "notice": "--",
                        "confirm_result": [],
                        "domain": "--",
                        "domain_name": "--"
                        }
                    ],
                    "feedback": [
                        {
                        "$ID": "80f411f1b31d45f9bbe8c9ff78e1f089_3-1",
                        "step_id": "80f411f1b31d45f9bbe8c9ff78e1f089_3-1",
                        "step_sequence": "3-1",
                        "step_type": "6",
                        "pre_conform_result": "",
                        "description": "",
                        "confirm_result": [],
                        "photos": [
                            "/pfiledownload/6b%2C65%2C79?ft=1",
                            "/pfiledownload/31%2C35%2C30%2C37%2C37%2C39%2C30%2C30%2C36%2C30%2C32%2C35%2C33%2C2e%2C6a%2C70%2C67?ft=1"
                        ],
                        "executor_id": "RY1503737342744",
                        "operate_time": "20171012143421"
                        }
                    ],
                    "executors": [
                        "郭松超"
                    ]
                    }
                ],
                "desc_photos": [],
                "sop_id": "",
                "sop_name": "",
                "version": ""
                }
            ],
            "wo_exec_controls": [
                {
                "$ID": "741a4810fd14499ebf913ef0b38bc72c",
                "exec_control_id": "741a4810fd14499ebf913ef0b38bc72c",
                "control_code": "execute",
                "operator_name": "孟祥永1",
                "operate_start_time": "20170929100052",
                "operate_end_time": "20171023100415",
                "apply_type": "--",
                "audit_result": "--",
                "opinion": "--",
                "next_route": [],
                "create_time": "20170929100051"
                },
                {
                "$ID": "696939c09a23488294401b91459c0eb6",
                "exec_control_id": "696939c09a23488294401b91459c0eb6",
                "control_code": "assign",
                "operator_name": "孟祥永1",
                "operate_start_time": "20170929101203",
                "operate_end_time": "--",
                "apply_type": "--",
                "audit_result": "--",
                "opinion": "--",
                "next_route": [
                    "Android"
                ],
                "create_time": "20170929101201"
                },
                {
                "$ID": "e6ca665d69204b80be0e61c5357a20b3",
                "exec_control_id": "e6ca665d69204b80be0e61c5357a20b3",
                "control_code": "execute",
                "operator_name": "孟祥永1",
                "operate_start_time": "20170929101354",
                "operate_end_time": "20171023100415",
                "apply_type": "--",
                "audit_result": "--",
                "opinion": "--",
                "next_route": [],
                "create_time": "20170929101352"
                },
                {
                "$ID": "e43e41bb478b4148b9fd2aedc45933b6",
                "exec_control_id": "e43e41bb478b4148b9fd2aedc45933b6",
                "control_code": "apply_close",
                "operator_name": "何鑫欣",
                "operate_start_time": "20171212102200",
                "operate_end_time": "--",
                "apply_type": "--",
                "audit_result": "--",
                "opinion": "提交申请",
                "next_route": [
                    "郭松超"
                ],
                "create_time": "20171010094143"
                },
                {
                "$ID": "e50c4977c43c439d96d046dfa60a353c",
                "exec_control_id": "e50c4977c43c439d96d046dfa60a353c",
                "control_code": "audit",
                "operator_name": "郭松超",
                "operate_start_time": "20171212160500",
                "operate_end_time": "--",
                "apply_type": "--",
                "audit_result": "1",
                "opinion": "审核申请-通过",
                "next_route": [],
                "create_time": "20171010094207"
                },
                {
                "$ID": "41d66d4831994c4ba9d06a16a2fe89be",
                "exec_control_id": "41d66d4831994c4ba9d06a16a2fe89be",
                "control_code": "audit",
                "operator_name": "郭松超",
                "operate_start_time": "20171212160500",
                "operate_end_time": "--",
                "apply_type": "--",
                "audit_result": "0",
                "opinion": "审核申请-不通过",
                "next_route": [],
                "create_time": "20171010094609"
                },
                {
                "$ID": "2544cd9e028e422dba74551f8d2aad4a",
                "exec_control_id": "2544cd9e028e422dba74551f8d2aad4a",
                "control_code": "audit",
                "operator_name": "郭松超",
                "operate_start_time": "20171212160500",
                "operate_end_time": "--",
                "apply_type": "--",
                "audit_result": "0",
                "opinion": "审核申请-不通过",
                "next_route": [],
                "create_time": "20171010095404"
                },
                {
                "$ID": "5e97bd7997df464692e7c2ff35afb760",
                "exec_control_id": "5e97bd7997df464692e7c2ff35afb760",
                "control_code": "execute",
                "operator_name": "郭松超",
                "operate_start_time": "20171012143421",
                "operate_end_time": "20171023100415",
                "apply_type": "--",
                "audit_result": "--",
                "opinion": "--",
                "next_route": [],
                "create_time": "20171012143417"
                },
                {
                "$ID": "6581cd2101a0445e977ca5a35c5e3316",
                "exec_control_id": "6581cd2101a0445e977ca5a35c5e3316",
                "control_code": "close",
                "operator_name": "小Ａ",
                "operate_start_time": "20171023100414",
                "operate_end_time": "--",
                "apply_type": "--",
                "audit_result": "--",
                "opinion": "--",
                "next_route": [],
                "create_time": "20171023100415"
                }
            ],
            "publish_time": "20170925161846",
            "create_time": "20170925161846",
            "valid": true
        },
        // 工单操作列表
        orderOperatList:[],
        personPositionList:[],
        stop_order_content:"",
        workOrderDetailPaths:[],
    },
    methods: {
        arrToString: function (arr) { //普通数组转字符串方法
            var arr = arr || [];
            var str = ''
            if (arr) {
                str = arr.join("、");
            } else {
                str = ""
            }
            return str;
        },
        workOrderDetailGoBack:function(){
            
        },
        workOrderDetailClick:function(){

        },
        workOrderDetailClick(value) {
            v.goBack(value.path,true)
        },
        workOrderDetailGoBack: function(){
            v.goBack(this.lastPage,true);
        }
    },
    filters: {
        
    },
    beforeMount : function(){
        this.workOrderDetailPaths = v.name.hasOwnProperty('term') ? [
            {name:"首页",path:"planManage"},{name:"计划详情"}
        ] : [

        ];
    }
});