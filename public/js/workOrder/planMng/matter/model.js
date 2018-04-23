Vue.component('matter', {
    template: '#matter',
    data: function () {

        return {
            valite: {
                //事项名称为空
                matter_name_isnull: false,
            },
            order_type: 2,  // 工单类型2 需要传入
            desc_str: "", // @输入框查询字符串
            desc_sop_str: "", // # 输入框查询 对象
            desc_sop_c_str: "", // # 输入框查询 操作事件
            matter: {
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
                // 对象描述
                desc_forepart: "",  //  @ 输入框文本
                desc_aftpart: "",   //  # 输入框文本
            },
            str: "",

        }
    },
    props: [],
    methods: {
        //事项名称输入事件
        input_matter_name: function () {

        },
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
        getSOPObj: function () {
            console.log(arguments);
        }
    },
    computed: {

    },
    watch: {
        "matter.desc_objs": function (newValue) {
            console.log(newValue);
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
                    _that.matter.desc_forepart = old;
                    return;
                }
            }


            // 更新删除的内容
            _that.matter.desc_sops = _that.matter.desc_sops.filter(function (item, index) {
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
            str = str.replace(/(@|#){1}(\S*?)\s{1}/g, function (c, type, name) {

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

            // 更新删除的内容
            _that.matter.desc_sops = _that.matter.desc_sops.filter(function (item, index) {
                return arr.map(function (params) {
                    return params.name;
                }).indexOf(item.obj_name) != -1;
            });

            var search = /(@|#)(\S*?)\s{1}/.exec(str);

            if (!_.isNull(search)) {

                // 输入的是对象框
                if (search[1] == "@") {

                    _that.desc_sop_str = '@' + search[2];
                } else if (search[1] == "#") {

                    _that.desc_sop_c_str = '#' + search[2];
                }
            }
        },
        //
        desc_sop_str: function (value) {
            console.log(value);
        },
        desc_sop_c_str: function (value) {
            console.log(value)
        }
    },
    beforeMount: function () {

    }
})