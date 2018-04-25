var Custom = function (obj) {
    this.name = obj.name;
    this.type = obj.type;

    if (obj.type == 2 || obj.type == 3) {
        this.items = obj.items || [];
        this.wrongs = obj.wrongs || [];
    } else if (obj.type == 4 || obj.type == 5) {
        this.wrong_ranges = obj.wrong_ranges || [];

        if (obj.type == 5) this.unit = obj.unit || "";
    }
}

Vue.component('addcontent', {
    template: '#addcontent',
    data: function () {

        return {
            leo: false,
            uRangesType: [
                {
                    name: "大于",
                    code: "gt",
                }, {
                    name: "大于等于",
                    code: "gte",
                }, {
                    name: "小于",
                    code: "lt",
                }, {
                    name: "小于等于",
                    code: "lte",
                }],
            wrongType: [
                {
                    name: "区间",
                    code: 1,
                },
                {
                    name: "非区间",
                    code: 0,
                }
            ],

            onItem: "",
            onPoint: "",
            // 自定义的控件
            controlsList: [
                { name: "普通文本", type: "1" },
                { name: "单选", type: "2" },
                { name: "多选", type: "3" },
                { name: "无单位的数字", type: "4" },
                { name: "有单位的数字", type: "5" }
            ],
            GeneralDictByKey: [],
            view: {
                // 作业前检查项
                pre_conform: false,
                //标准操作要求
                content: false,
                // 注意事项
                notice: false,
                // 操作记录要求
                confirm_result: false,
                // 专业限定
                domain: false,
            },
            content_str: "",
            desc_work: {
                "work_name": "1",
                "pre_conform": "",
                "content": "@上格云-001-2号楼 @上格云-001-1号楼 ",
                "content_objs": [
                    {
                        "obj_id": "Bd1301020001002",
                        "obj_name": "上格云-001-2号楼",
                        "selected": true
                    },
                    {
                        "obj_id": "Bd1301020001001",
                        "obj_name": "上格云-001-1号楼",
                        "selected": true
                    }
                ],
                "notice": "",
                "confirm_result": [
                    {
                        "info_points": [
                            {
                                "code": "BuildLocalName",
                                "id": "build_0_BuildLocalName",
                                "name": "建筑本地名称",
                                "selected": true
                            },
                            {
                                "code": "BuildLocalID2",
                                "id": "build_0_BuildLocalID2",
                                "name": "建筑本地编码2",
                                "selected": true
                            },
                            {
                                "code": "BuildLocalName2",
                                "id": "build_0_BuildLocalName2",
                                "name": "建筑本地名称2",
                                "selected": true
                            }
                        ],
                        "parents": [],
                        "customs": [
                            {
                                "name": "多选",
                                "type": "3",
                                "items": [
                                    "1",
                                    "2",
                                    "3"
                                ],
                                "wrongs": [
                                    "1",
                                    "2",
                                    "3"
                                ]
                            },
                            {
                                "name": "区间",
                                "type": "5",
                                "wrong_ranges": [
                                    {
                                        "type": "range",
                                        "values": [
                                            "1",
                                            "10"
                                        ]
                                    },
                                    {
                                        "type": "gte",
                                        "values": "2"
                                    }
                                ]
                            },
                            {
                                "name": "非区间",
                                "type": "4",
                                "wrong_ranges": [
                                    {
                                        "type": "gte",
                                        "values": "10"
                                    }
                                ]
                            }
                        ],
                        "obj_id": "Bd1301020001002",
                        "obj_name": "上格云-001-2号楼",
                        "selected": true
                    },
                    {
                        "info_points": [],
                        "parents": [],
                        "customs": [],
                        "obj_id": "Bd1301020001001",
                        "obj_name": "上格云-001-1号楼",
                        "selected": true
                    }
                ],
                "domain": "",
                "domain_name": ""
            }
            // desc_work: {
            //     "work_name": "",      //工作内容名称
            //     "pre_conform": "",    //强制确认
            //     "content": "",        //操作内容
            //     //操作内容中涉及的对象
            //     "content_objs": [
            //         {
            //             "obj_id": "",	        //对象id
            //             "obj_name": "",	    //对象名称
            //             "obj_type": ""      //对象类型,子项见后边
            //         }
            //     ],
            //     "notice": "",        //注意事项
            //     "confirm_result": [	//需确认的操作结果
            //         {
            //             "obj_id": " ",
            //             "obj_name": " ",
            //             "obj_type": "",
            //             "parents": [
            //                 { "parent_ids": ["", "", ""], "parent_names": ["建筑1", "楼层1", "空间"] },
            //                 { "parent_ids": ["", ""], "parent_names": ["专业1", "系统1"] },
            //                 { "parent_ids": ["", "", ""], "parent_names": ["专业1", "系统大类", "设备大类"] }
            //             ],
            //             "info_points": [
            //                 {
            //                     "id": "", "code": "", "name": "", "unit": "", "cmpt": "Numberentry02",
            //                     "wrong_ranges": [{ "type": "gt", "values": "12" }, { "type": "lt", "values": "6" }]
            //                 },
            //                 {
            //                     "id": "", "code": "", "name": "", "unit": "", "cmpt": "Multiselect01",
            //                     "cmpt_data": [{ "code": "", "name": "" }], "wrongs": ["选项1", "选项2"]
            //                 }
            //             ],
            //             "customs": [//自定义项，type：1-文本，2-单选，3-多选,4、无单位的数字,5、有单位的数字
            //                 { "name": "确认信息2", "type": "1" },
            //                 { "name": "确认信息2", "type": "2", "items": ["选项1", "选项2", "选项3"], "wrongs": ["选项1", "选项2"] },
            //                 { "name": "确认信息3", "type": "3", "items": ["选项1", "选项2", "选项3"], "wrongs": ["选项1", "选项2"] },
            //                 //非区间异常的type项有：gt-大于,gte-大于等于，lt-小于,lte-小于等于,区间的type项为range,满足一个子项就认为出现异常
            //                 { "name": "确认信息4", "type": "4", "wrong_ranges": [{ "type": "gt", "values": "12" }, { "type": "lt", "values": "6" }] },
            //                 {
            //                     "name": "确认信息5", "type": "5", "unit": "", "wrong_ranges": [{ "type": "range", "values": ["12", "20"] }]
            //                 }
            //             ]
            //         },
            //     ],
            //     "domain": "",                //专业code
            //     "domain_name": ""            //专业名称
            // }
        }
    },
    props: ["cb"],
    methods: {
        // 获取对象
        get_content_Obj: function (arr) {
            var _that = this;

            _that.content_str = "";

            _that.desc_work.content_objs = _that.desc_work.content_objs.concat(arr);

            // 去重
            var obj = {};
            _that.desc_work.content_objs = _that.desc_work.content_objs.filter(function (item) {
                if (obj.hasOwnProperty(item.obj_name)) return false;
                obj[item.obj_name] = true;
                return true;
            })

            _that.desc_work.content = _that.desc_work.content_objs.map(function (obj) {
                return "@" + obj.obj_name + " ";
            }).join('');

            var arr_name = _that.desc_work.confirm_result.map(function (item) {
                return item.obj_name;
            });

            _that.desc_work.confirm_result = _that.desc_work.content_objs.map(function (obj) {
                var index = arr_name.indexOf(obj.obj_name);
                if (index != -1) {
                    return _that.desc_work.confirm_result.slice(index, 1);
                } else {
                    return Object.assign({}, {
                        info_points: [],
                        parents: [],
                        customs: [],
                    }, obj)
                }
            })



        },
        // 获取单个对象的信息点
        get_point: function (obj) {
            var _that = this;
            // 返回什么附加什么
            if (obj.info_points.length) {
                _that.onItem.info_points = obj.info_points;
                _that.onItem = void 0;
                return;
            }
            if (obj.customs.length) {
                _that.onItem.customs = _that.onItem.customs.concat(obj.customs);
                _that.onItem = void 0;
                return;
            }
            //  什么否没返回直接置空
            _that.onItem.customs = [];
            _that.onItem.info_points = [];

            _that.onItem = void 0;

        },
        //转换成父级链字符串形式
        getParentsLinks: function (parents) {
            if (!parents || !parents.length) return '';
            var str = '(';
            for (var i = 0; i < parents.length; i++) {
                str += parents[i].parent_names.join('-');
                if (i != parents.length - 1) str += '/';
            }
            return str + ')';
        },
        // 获取key 集合
        getkeys: function (list, key) {
            if (!_.isArray(list) || !list.length) return [];
            return list.map(function (item) {
                return item[key];
            })
        },
        // 获取异常范围
        getError: function (item) {
            var str = "";
            var type = [
                {
                    name: "大于",
                    code: "gt",
                }, {
                    name: "大于等于",
                    code: "gte",
                }, {
                    name: "小于",
                    code: "lt",
                }, {
                    name: "小于等于",
                    code: "lte",
                }];
            if (item.type == 2 || item.type == 3) {
                str = item.wrongs.join();
            } else if (item.type == 4 || item.type == 5) {

                str = item.wrong_ranges.map(function (info) {

                    if (info.type == "range") {
                        return info.values.join('~');
                    } else {
                        return (_.find(type, { code: info.type }) || {}).name + info.values;
                    }
                }).join();
            }

            return str.length ? ("异常范围：" + str) : '';
        },
        idecallback: function (item) {
            var _that = this;
            Object.assign(_that.onPoint, item);
            _that.onPoint = void 0;
        }
    },
    computed: {

    },
    watch: {
        "desc_work.content": function (newValue, old) {
            var _that = this;
            var str = newValue;
            var arr = [], name = [];

            // 原来没有保存直接的搜索
            // if (!_that.matter.desc_sops.length) {
            //     _that.desc_str = newValue;
            //     return;
            // }

            // 获取语句中的所有的对象
            str = str.replace(/@(\S*?)\s{1}/g, function (c, name) {

                arr.push(name);
                return " ";
            }) + " ";

            //  直接在中间插如的操作直接过滤
            for (var index = 0; index < arr.length; index++) {
                var element = arr[index];
                if (/@|#/.test(element)) {
                    _that.desc_work.content = old;
                    return;
                }
            }


            // 更新删除的内容
            _that.desc_work.content_objs = _that.desc_work.content_objs.filter(function (item, index) {
                return arr.indexOf(item.obj_name) != -1;
            });

            var search = /@(\S*?)\s{1}/.exec(str)

            if (!_.isNull(search)) {
                _that.content_str = '@' + search[1];
            }
        }
    },
    beforeMount: function () {
        var _that = this;
        // 加载专业限定
        addcontent_controller.GeneralDictByKey().then(function (res) {
            _that.GeneralDictByKey = res;
        })

        window.clear_pre_conform = function () {
            _that.desc_work.pre_conform = "";
            _that.view.pre_conform = false;
        };
        window.clear_domain = function () {
            // _that.desc_work.pre_conform = "";
            _that.desc_work.domain = "";
            _that.desc_work.domain_name = "";
            _that.view.domain = false;
        };
        window.clear_confirm_result = function () {
            _that.desc_work.confirm_result = [];
            _that.view.confirm_result = false;
        };
        window.clear_notice = function () {
            _that.desc_work.notice = "";
            _that.view.notice = false;
        };
        window.clear_content = function () {
            // _that.desc_work.pre_conform = "";
            _that.view.content = false;
            _that.desc_work.content = "";
            _that.desc_work.content_objs = [];
        };

        // 专业限定下拉选择事件
        window.domainSel = function () {
            var item = $("#add-major").psel();
            _that.desc_work.domain = item.code;
            _that.desc_work.domain_name = item.name;
        }
    },
    destroyed: function () {

        window.clear_pre_conform = undefined;
    }
})