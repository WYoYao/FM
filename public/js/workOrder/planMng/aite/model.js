Vue.component('aite', {
    template: '#aite',
    data: function () {

        return {
            // 查询字符创
            searchStr: "",
            // 定时查询的实例
            timer: null,
            // 显示哪块内容 index默认首页
            onBlock: "index",
            // 加载动画
            isLoading: "false",
            // 顶部标题
            titles: {
                Build: '建筑',
                Floor: '楼层',
                Room: '房间',
                System: '系统',
                Equip: '设备',
                Part: '部件',
                Tool: '工具',
            },
            // 建筑列表
            Build: [],
            // 楼层列表
            Floor: [],
            // 房间类表
            Room: [],
            // 空间列表
            Space: [],
            // 系统列表
            System: [],
            // 设备列表
            // 空间树
            BuildFloorSpaceTree: [],
            // 设备专业集合
            GeneralDict: [],
            // 设备专业集合
            GeneralSystem: [],
            // 设备列表
            EquipList: [],
            // 部件列表
            Part: [],
            // 工具列表
            Tool: [],
            // 自定义对象
            auto: "",
            // 查询的对象
            searchObject: [],
            // 搜索时候返回保存的对象集合
            searchRes: [],
            // 自定义页面控制
            autoView: {
                autoTypeNull: false,
                error: ""
            },
            // 类别集合
            typeList: [
                { name: "对象", code: 1, selected: false },
                { name: "部件", code: 2, selected: false },
                { name: "工具", code: 3, selected: false },
                { name: "其他", code: 9, selected: false }]
        }
    },
    props: ['str', 'cb'],
    methods: {
        // 获取返回值单层
        getValue: function (arr) {
            var _that = this;
            return _.filter(arr, { selected: true }).map(function (item) {
                return {
                    obj_id: item.obj_id,
                    obj_name: item.obj_name,
                }
            })
        },
        querySelectedDeep: function (list, index) {

            return (function (list, index) {

                if (index != 0) {
                    var result = (_.find(list, { selected: true }) || {}).content || [];
                    return arguments.callee(result, --index);
                } else {
                    return _.filter(list, { selected: true })
                }

            })(list, --index || 0);
        },
        // 获取返回值多层
        getValueDeep: function (arr) {
            var _that = this;

            return _that.querySelectedDeep(arr, 2).map(function (item) {
                return {
                    obj_id: item.obj_id,
                    obj_name: item.obj_name,
                }
            })
        },
        // 返回对应的值
        submit: function () {
            var _that = this;

            //  自定义对象
            if (_that.onBlock == "auto") {
                // 非空验证
                if (!_.filter(_that.typeList, { selected: true }).length) {
                    _that.autoView.error = "所属类别不能为空";
                    return;
                }

                // 重名验证
                aite_controller.Exist({
                    obj_name: _that.auto,
                    obj_type: _.find(_that.typeList, { selected: true }).code,
                }).then(function (res) {
                    if (res.exist) {
                        // 已经存在
                        _that.autoView.autoTypeNull = true;
                    } else {
                        // 不存在正常提交
                        aite_controller.Add({
                            obj_name: _that.auto,
                            obj_type: _.find(_that.typeList, { selected: true }).code,
                        }).then(function (res) {

                            _that.callback(res.map(function (item) {
                                item.obj_name = _that.auto;
                                return item;
                            }))
                        })
                    }
                })
            } else if (_that.onBlock == "Floor" || _that.onBlock == "System") {
                _that.callback(_that.getValueDeep(_that[_that.onBlock]));
            } else {
                var type = _that.onBlock;
                if (type == 'Room') type = 'Space';
                if (type == 'Equip') type = 'EquipList';
                if (type == 'Search') type = 'searchObject';

                _that.callback(_that.getValue(_that[type]));
            }
        },
        // 搜索按钮点击返回有没有选中值的之后直接把 输入的文字当成自定义对象保存
        createAuto: function () {
            var _that = this;

            aite_controller.Exist({
                obj_name: _that.searchStr,
                obj_type: 1,
            }).then(function (res) {
                if (res.exist) {
                    // 已经存在

                } else {
                    // 不存在正常提交
                    aite_controller.Add({
                        obj_name: _that.searchStr,
                        obj_type: 1,
                    }).then(function (res) {
                        // 保存在控件中
                        _that.searchRes = _that.searchRes.concat(res.map(function (item) {
                            item.obj_name = _that.searchStr;
                            return item;
                        }));

                        _that.searchObject = [];
                        _that.searchStr = "";
                    })
                }
            })
        },
        // 返回的首页
        back: function () {
            var _that = this;
            // 搜索的时候返回 需要保存现有的内容
            // if (_that.onBlock == 'Search')
            // 返回保存当前的对象
            // _that.createAuto();
            _that.onBlock = 'index';
            // 清空数据
            // 建筑列表
            _that.Build = [];
            // 楼层列表
            _that.Floor = [];
            // 房间类表
            _that.Room = [];
            // 空间列表
            _that.Space = [];
            // 系统列表
            _that.System = [];
            // 设备列表
            // 空间树
            _that.BuildFloorSpaceTree = [];
            // 设备实例集合
            _that.GeneralDict = [];
            // 设备等于空
            _that.EquipList = [];
            // 部件列表
            _that.Part = [];
            // 工具列表
            _that.Tool = [];

        },
        // 查询空间
        querySpace: function (item) {
            console.log(item);
        },
        // 获取选中的值
        querySelectedItem: function (list, index) {

            return (function (list, index) {

                if (index == 0) {
                    return _.filter(list, { selected: true })
                }

                var res = (_.find(list, { selected: true }) || {}).content || [];

                return arguments.callee(res, --index)

            })(list, --index || 0);
        },
        // 获取选中值的集合
        querySelectedContent: function (list, index) {

            return (_.find(list, { selected: true }) || {}).content || [];
        },
        // 集合中选中一个
        listClick: function (list, item) {
            list.forEach(function (info) {
                info.selected = info == item;
            })
        },
        // 大类点击时间
        handler_class: function (key) {
            var _that = this;
            // 页面转换
            _that.onBlock = key;

            _that.queryClass(key);

            _that.$nextTick(function () {
                $("#id_GeneralSystem").pdisable(true)
            })
        },
        // 插叙相关接口
        queryClass: function (key, item) {
            var _that = this;

            _that.isLoading = true;
            //  除了设备都只需要查询一个接口
            if (key != 'Equip') {
                aite_controller[key](item || {}).then(function (res) {
                    _that[key] = res;
                }).finally(function () { _that.isLoading = false; })

            } else {
                // 设备需要查询控件树和设备实例
                var a = aite_controller.BuildFloorSpaceTree();
                var b = aite_controller.GeneralDict();

                a.then(function (res) {
                    _that.BuildFloorSpaceTree = res;

                    b.then(function (res) {
                        _that.GeneralDict = res;

                    }).finally(function () { _that.isLoading = false; })
                })
            }
        },
        // 查询设备
        queryQuip: function () {
            var _that = this,
                argu = {};

            var arr = $("#id_BuildFloorSpaceTree").psel(),
                generalDict = $("#id_GeneralDict").psel(),
                generalSystem = $("#id_GeneralSystem").psel();

            //  空间树选择之后才进行查询
            if (_.isArray(arr) && arr.length) {

                var space = arr.slice(-1)[0];
                // 楼层不进行查询
                if (space.obj_type == "floor") return;

                argu[space.obj_type == "space" ? "space_id" : "build_id"] = space.obj_id;
            }

            if (generalDict) {
                argu.domain_code = _that.GeneralDict[generalDict.index].code;
            }

            if (generalSystem) {
                argu.system_id = _that.GeneralSystem[generalSystem.index].system_id;
            }

            _that.queryClass("EquipList", argu);
        },
        // 对调内容
        callback: function (arr) {
            //  如果传入回调调用回调
            if (_.isFunction(this.cb)) this.cb(this.searchRes.concat(arr));
            //  清空已经保存的信息
            this.searchRes = [];
            // 清空所有的类表
            this.back();
        },
        // 桌面点击时间
        documentClick: function () {
            var _that = this;
            if (_that.str.length) {
                _that.callback([]);
            }
        }
    },
    computed: {
        // 根据@后面的字符判断时候是搜索选项
        isSearch: function () {
            return /^\@\S+/g.test(this.str);
        },
        // 根据传入的字符长度来判断长度来判断时候需要显示隐藏
        isShow: function () {

            return this.str.indexOf('@') != -1;
        }
    },
    watch: {
        str: function (newValue, oldValue) {

            var _that = this;
            // 跟上次相同不做任何处理
            if (newValue == oldValue) return;
            // 验证格式 格式不对不进行搜索
            if (!/^\@\S+/g.test(newValue)) {
                _that.onBlock = 'index';
                return;
            };
            _that.onBlock = "Search"
            _that.searchStr = newValue.replace(/@/g, "");

            if (!_that.searchStr.length) return;

            if (!_.isNull(_that.timer)) {
                clearTimeout(_that.timer);
                _that.timer = null;
            }

            _that.timer = setTimeout(function () {

                // 查询事件
                _that.queryClass('searchObject', {
                    keyword: _that.searchStr,
                });
            }, 300)

        },
        auto: function () {
            this.autoView.error = "";
        }
    },
    beforeMount: function () {
        var _that = this;

        // 加载完毕
        _that.isLoading = false;

        // 绑定树形的点击事件
        window.roomTree = function (item) {

            var argu = {
                "obj_id": item.obj_id,
                "obj_type": item.obj_id.slice(0, 1) == 'B' ? "build" : "floor",
            }

            _that.queryClass('Space', argu);

        };
        // 专业点击事件
        window.DictSel = function (item) {
            // 查询 专业对应的系统
            _that.queryClass("GeneralSystem", { system_domain: item.code });

            $("#id_GeneralSystem").pdisable(false)

            // 查询设备
            _that.queryQuip()
        }
        //  设备树形菜单事件
        window.QuipTreeSel = function () {
            // 查询设备
            _that.queryQuip();
        }
        // 系统选择事件
        window.DictSystemSel = function () {
            // 查询设备
            _that.queryQuip();
        }

        // 绑定点击桌面消失内容
        document.addEventListener("click", _that.documentClick, false)
    },
    destroyed: function () {
        // 释放桌面点击事件
        document.removeEventListener("click", this.documentClick, false)
        // 释放所有的全局方法
        window.roomTree = undefined;
        window.DictSel = undefined;
        window.QuipTreeSel = undefined;
        window.DictSystemSel = undefined;
    }
})