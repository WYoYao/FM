function Matter() {
    return {
        // 事项名称
        matter_name: "",
        desc_objs: [
            // {
            //     "obj_id": "Bd130102000100B",
            //     "obj_name": "就是玩玩",
            //     "checked": true, //未知
            //     "obj_type": "build",
            //     "initialChecked": true //未知
            // }
        ],
        desc_sops: [], // Sop 列表
        desc_works: [],  // 新建工作内容
        // 对象描述
        desc_forepart: "",  //  @ 输入框文本
        desc_aftpart: "",   //  # 输入框文本
        required_control: [],
    };
}

Vue.component('matter', {
    template: '#matter',
    data: function () {

        return {
            valite: {
                //事项名称为空
                matter_name_isnull: false,
            },
            GeneralDictByKey: [],
            order_type: 2,  // 工单类型2 需要传入
            desc_str: "", // @输入框查询字符串
            desc_sop_str: "", // # 输入框查询 对象
            desc_sop_c_str: "", // # 输入框查询 操作事件
            addcontent: false,
            matters: new Matter(),
            str: "",
        }
    },
    props: ["matter", "views"],
    methods: {
        // 获取对象
        getObj: function (arr) {
            var _that = this;

            _that.desc_str = "";

            _that.matter.desc_objs = _that.matter.desc_objs.concat(arr);

            // 去重
            var obj = {};
            _that.matter.desc_objs = _that.matter.desc_objs.filter(function (item) {
                if (obj.hasOwnProperty(item.obj_name)) return false;
                obj[item.obj_name] = true;
                return true;
            })

            _that.matter.desc_forepart = _that.matter.desc_objs.map(function (obj) {
                return "@" + obj.obj_name + " ";
            }).join('');

        },
        // 获取SOP
        getSOPObj: function (arr) {
            var _that = this;
            _that.matter.desc_sops = _that.matter.desc_sops.concat(arr);
            _that.matter.desc_aftpart = _that.matter.desc_sops.map(function (item) {
                return (item.hasOwnProperty('sop_name') ? "#" : "@") + (item.sop_name || item.obj_name) + " ";
            }).join("");

            _that.desc_sop_str = "";
            _that.desc_sop_c_str = "";
        },
        // 工作内容
        workContent: function (wk) {

            var _that = this;

            if (_.isPlainObject(wk)) {
                _that.matter.desc_works.push(wk);

                _that.matter.desc_aftpart += " " + wk.work_name + " ";
            }

            this.addcontent = false;
        },
    },
    computed: {

    },
    watch: {
        "matter.desc_objs": function (newValue) {
            // 如果选用的 对象有
            var _that = this;
            if (newValue.filter(function (item) {
                return item.obj_id.slice(0, 2) == "Sp" || item.obj_id.slice(0, 2) == "Eq"
            }).length) {

                (_.find(_that.GeneralDictByKey, { code: "obj_first_sign" }) || {}).disabled = false;
                _.find(_that.GeneralDictByKey, { code: "obj_first_photo" }).disabled = false;
            } else {
                (_.find(_that.GeneralDictByKey, { code: "obj_first_sign" }) || {}).disabled = true;
                _.find(_that.GeneralDictByKey, { code: "obj_first_photo" }).disabled = true;
            }

        },
        "matter.matter_name": function (newValue, old) {
            // 有任何输入就把错误提示取消
            this.valite.matter_name_isnull = false;
        },
        // 对象输入监听
        "matter.desc_forepart": function (newValue, old) {
            var _that = this;
            var str = newValue;
            var arr = [], name = [];

            // 获取语句中的所有的对象
            str = str.replace(/@(\S*?)\s{1}/g, function (c, name) {

                arr.push(name);
                return " ";
            }) + " ";

            //  直接在中间插如的操作直接过滤
            for (var index = 0; index < arr.length; index++) {
                var element = arr[index];
                if (/@|#/.test(element)) {
                    _that.matter.desc_forepart = old;
                    return;
                }
            }


            // 更新删除的内容
            _that.matter.desc_objs = _that.matter.desc_objs.filter(function (item, index) {
                return arr.indexOf(item.obj_name) != -1;
            });

            var search = /@(\S*?)\s{1}/.exec(str)

            if (!_.isNull(search)) {
                _that.desc_str = '@' + search[1];
            }
        },
        //  Sop 输入监听
        "matter.desc_aftpart": function (newValue, old) {
            var _that = this;
            var str = newValue;
            var arr = [], name = [];

            // 原来没有保存直接的搜索
            if (!_that.matter.desc_sops.length) {
                if (str.indexOf("@") != -1 && str.indexOf("#") != -1) {

                    if (str.indexOf("@") > str.indexOf("#"))
                        _that.desc_sop_c_str = newValue;
                    else
                        _that.desc_sop_str = newValue;
                } else if (str.indexOf("@") != -1) {
                    _that.desc_sop_str = newValue;
                } else if (str.indexOf("#") != -1) {
                    _that.desc_sop_c_str = newValue;
                }
                return;
            }

            // 获取语句中的所有的对象
            //  @ 对象 # SOP \s 自定义工作内容
            str = str.replace(/(@|#|\s){1}(\S*?)\s{1}/g, function (c, type, name) {

                arr.push({
                    type: type,
                    name: name,
                });
                return " ";
            }) + " ";

            //  直接在中间插如的操作直接过滤
            for (var index = 0; index < arr.length; index++) {
                var element = arr[index].name;
                if (/@|#/.test(element)) {
                    _that.matter.desc_forepart = old;
                    return;
                }
            }

            // 更新删除SOP的内容
            _that.matter.desc_sops = _that.matter.desc_sops.filter(function (item, index) {
                return arr.map(function (params) {
                    return params.name;
                }).indexOf(item.obj_name || item.sop_name) != -1;
            });
            // 更新删除工作内容
            _that.matter.desc_works = _that.matter.desc_works.filter(function (item, index) {
                return arr.map(function (params) {
                    return params.name;
                }).indexOf(item.obj_name || item.sop_name || item.matter_name) != -1;
            });
            // 更新删除对象
            // _that.matter.desc_objs = _that.matter.desc_objs.filter(function (item, index) {
            //     return arr.map(function (params) {
            //         return params.name;
            //     }).indexOf(item.obj_name || item.sop_name || item.matter_name) != -1;
            // });

            var search = /(@|#)(\S*?)\s{1}/.exec(str);

            if (!_.isNull(search)) {

                // 输入的是对象框
                if (search[1] == "@") {

                    _that.desc_sop_str = '@' + search[2];
                } else if (search[1] == "#") {

                    _that.desc_sop_c_str = '#' + search[2];
                }
            } else {
                _that.desc_sop_str = "";
                _that.desc_sop_c_str = "";
            }
        },
        // required_control
        "GeneralDictByKey": {
            handler: function (newValue) {
                var _that = this;
                _that.matter.required_control = _.map(_.filter(_that.GeneralDictByKey, { selected: true }), 'code')
            },
            deep: true
        },
    },
    beforeMount: function () {
        var _that = this;


        console.log(_that.views)


        matter_controller.queryGeneralDictByKey().then(function (res) {
            _that.GeneralDictByKey = res.map(function (item) {

                item.disabled = (item.code == 'obj_first_sign' || item.code == 'obj_first_photo');
                return item;
            });
        });
    }
})