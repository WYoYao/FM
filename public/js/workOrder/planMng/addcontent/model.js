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
            customize: {
                name: "",
                type: "1",
                items: [],
                wrongs: [],
                wrong_ranges: [],
                unit: "",
            },
            InfoPoints: [],
            InfoPointForObject: {
                argu: "",
                list: []
            },
            onItem: "",
            searchKey: "",
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
                "work_name": "***",      //工作内容名称
                "pre_conform": "***",    //强制确认
                "content": "***",        //操作内容
                //操作内容中涉及的对象
                "content_objs": [
                    {
                        "obj_id": "",	        //对象id
                        "obj_name": "",	    //对象名称
                        "obj_type": ""      //对象类型,子项见后边
                    }
                ],
                "notice": "***",        //注意事项
                "confirm_result": [	//需确认的操作结果
                    {
                        "obj_id": "*** ",
                        "obj_name": "*** ",
                        "obj_type": "***",
                        "parents": [
                            { "parent_ids": ["***", "***", "***"], "parent_names": ["建筑1", "楼层1", "空间"] },
                            { "parent_ids": ["***", "***"], "parent_names": ["专业1", "系统1"] },
                            { "parent_ids": ["***", "***", "***"], "parent_names": ["专业1", "系统大类", "设备大类"] }
                        ],
                        "info_points": [
                            {
                                "id": "***", "code": "***", "name": "***", "unit": "***", "cmpt": "Numberentry02",
                                "wrong_ranges": [{ "type": "gt", "values": "12" }, { "type": "lt", "values": "6" }]
                            },
                            {
                                "id": "***", "code": "***", "name": "***", "unit": "***", "cmpt": "Multiselect01",
                                "cmpt_data": [{ "code": "***", "name": "***" }], "wrongs": ["选项1", "选项2"]
                            }
                        ],
                        "customs": [//自定义项，type：1-文本，2-单选，3-多选,4、无单位的数字,5、有单位的数字
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
                "domain": "***",                //专业code
                "domain_name": "***"            //专业名称
            }
        }
    },
    props: ["cb"],
    methods: {
        // 查询某个对象对应的信息点
        queryInfoPointForObject: function (item) {
            var _that = this;
            // 传入空的时候
            if (!_.isPlainObject(item)) {
                _that.InfoPointForObject.argu = void 0;
                _that.InfoPointForObject.list = [];
                _that.InfoPoints = [];
                return;
            }

            var _that = this;
            _that.InfoPointForObject.argu = item;

            addcontent_controller.queryInfoPointForObject({
                obj_id: item.obj_id,
                obj_type: {
                    "Bd": "build",
                    "Fl": "floor",
                    "Sp": "space",
                    "Sy": "system",
                    "Eq": "equip",
                }[item.obj_id.slice(0, 2)]
            }).then(function (res) {
                _that.InfoPointForObject.list = res;
                _that.InfoPoints = res;
            })
        },

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
        search: function () {
            var _that = this;
            if (_that.searchKey.length) {
                _that.InfoPoints = _that.InfoPointForObject.list.filter(function (item) {
                    return item.name.indexOf(_that.searchKey) != -1;
                })
            }

            return _that.InfoPoints = _that.InfoPointForObject.list;
        }
    },
    computed: {
        InfoPoints: function () {
            var _that = this;
            if (_that.searchKey.length) {
                return _that.InfoPointForObject.list.filter(function (item) {
                    return item.name.indexOf(_that.searchKey) != -1;
                })
            }

            return _that.InfoPointForObject.list;
        }
    },
    watch: {
        "onItem": function (item) {
            this.queryInfoPointForObject(item);
        },
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

        // 修改自定义信息点的类型
        window.changeCustomizeType = function (item) {
            _that.customize.type = item.type;
            if (item.type == '2' || item.type == '3') {
                _that.customize.items = [{ str: "" }];
            } else {
                _that.customize.items = [];
            }
        }
    },
    destroyed: function () {
        window.clear_pre_conform = undefined;
    }
})