Vue.component('addinfo', {
    template: '#addinfo',
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
            // 信息点列表
            InfoPoint: [],
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
            return _.filter(arr, { selected: true });
            // return _.filter(arr, { selected: true }).map(function (item) {
            //     return {
            //         obj_id: item.obj_id,
            //         obj_name: item.obj_name,
            //     }
            // })
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

            return _that.querySelectedDeep(arr, 2);

            // return _that.querySelectedDeep(arr, 2).map(function (item) {
            //     return {
            //         obj_id: item.obj_id,
            //         obj_name: item.obj_name,
            //     }
            // })
        },
        // 返回对应的值
        submit: function () {
            var _that = this;

            var obj;
            // 查询出来获取的参数
            if (_that.onBlock == "search") {

                obj = _.filter(_that.searchRes, { selected: true }).map(function (item) {
                    // 去除多余的页面渲染需要的数据
                    delete item.info_point.name_arr;

                    item.info_point = [item.info_point]
                    return item;
                });
            } else {

                // 现获取对象
                if (_that.onBlock == "Floor" || _that.onBlock == "System") {
                    obj = _that.getValueDeep(_that[_that.onBlock]);
                } else {
                    var type = _that.onBlock;
                    if (type == 'Room') type = 'Space';
                    if (type == 'Equip') type = 'EquipList';
                    obj = _that.getValue(_that[type]);
                }

                obj = obj.map(function (item) {

                    item.info_points = _.filter(_that.InfoPoint, { selected: true });
                    return item;
                })
            }

            console.log(obj);
            if (_.isFunction(_that.cb)) _that.cb(obj);
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
            // 信息点清空
            _that.InfoPoint = [];
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
                addinfo_controller[key](item || {}).then(function (res) {
                    _that[key] = res;
                }).finally(function () { _that.isLoading = false; })

            } else {
                // 设备需要查询控件树和设备实例
                var a = addinfo_controller.BuildFloorSpaceTree();
                var b = addinfo_controller.GeneralDict();

                a.then(function (res) {
                    _that.BuildFloorSpaceTree = res;

                    b.then(function (res) {
                        _that.GeneralDict = res;

                    }).finally(function () { _that.isLoading = false; })
                })
            };
            _that.InfoPoint = [];
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
        },
        // 查询对应的信息点
        queryInfoPoints: function (argu) {
            var _that = this;
            _that.isLoading = true;
            addinfo_controller.queryInfoPointForObject(argu)
                .then(function (res) {
                    _that.InfoPoint = res;
                }).catch(function () {
                    _that.InfoPoint = [];
                }).finally(function () {
                    _that.isLoading = false;
                })
        },
        //  查询其对应信息点
        clickInfoPointsByItem: function (item, type) {
            var _that = this;
            if (item.selected == true) {
                _that.queryInfoPoints({
                    keyword: "",
                    obj_id: item.obj_id,
                    obj_type: type,
                })
            }
        },
        //根据关键字查询 信息点
        searchInfoPoint: function (str) {
            var _that = this;
            _that.isLoading = true;
            addinfo_controller.searchInfoPoint({
                keyword: str
            }).then(function (res) {

                _that.searchRes = res.map(function (item) {

                    item.info_point = [item.info_point].map(function (item) {
                        var arr = [],
                            reg = new RegExp(str, 'g'),
                            res = reg.exec(item.name);

                        while (res) {
                            arr = arr.concat(_.range(+res.index, res.index + str.length))
                            res = reg.exec(item.name);
                        }

                        item.name_arr = item.name.split("").map(function (char, index) {

                            return {
                                mark: arr.indexOf(index) != -1,
                                char: char,
                            }
                        })

                        return item;
                    })[0];
                    return item;
                })

            }).finally(function () { _that.isLoading = false; })
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