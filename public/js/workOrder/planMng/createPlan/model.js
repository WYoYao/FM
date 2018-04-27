var ViewError = function () {
    return {
        isRepeat: false,
        isSpace: false,
        isDescForepartSpace: false,
        verify: [],
        sopeds: [],
    };
}

v.pushComponent({
    name: "createPlan",
    data: {
        // 工单状态类型
        WorkOrderType: [],
        //  基础信息
        addWoPlan: {},
        //  事项集合
        matters: [{
            // 事项名称
            matter_name: "",
            desc_objs: [],
            desc_sops: [], // Sop 列表
            desc_works: [],  // 新建工作内容
            // 对象描述
            desc_forepart: "",  //  @ 输入框文本
            desc_aftpart: "",   //  # 输入框文本  
            required_control: [],
        }],
        //  事项的错误信息
        mattersViews: [
            new ViewError(),
        ],
        // 预览事项
        WoMattersPreview: {},
        // 是否被引用
        isquote: false,
        // 是否编辑
        isedit: false,
        // 是否是项目版
        isterm: false,
        // 是否是预览页面
        PreView: false,
        // 根据大类查询出来的结果
        ObjectByClassId: {},
        ObjectByClass: [],
        str: "",
    },
    methods: {
        // 获取对象
        getObj: function (arr) {
            console.log(arr);
            this.str = "";
        },
        //  提交信息
        commit: function () {
            var _that = this;
            console.log(_that.$refs.baseinfomation.addWoPlan);
            console.log(_that.matters);

            // matters 验证

            if (_.filter(_that.mattersViews, { isRepeat: true }).length) return;
            // 验证名称非空
            _that.mattersViews.forEach(function (item, index) {
                item.isSpace = !_that.matters[index].matter_name.length;
                item.isDescForepartSpace = !_that.matters[index].desc_forepart.length;
            })
            // 验证内容为空
            if (_.filter(_that.mattersViews, { isSpace: true }).length) return;
            if (_.filter(_that.mattersViews, { isDescForepartSpace: true }).length) return;

            // 重名的验证
            _that.mattersViews = _that.mattersViews.map(function (item) {
                item.isRepeat = (_.uniq(_.map(_that.matters, 'matter_name')).length != _that.matters.length);
                return item;
            });

            //  验证多个关系是否不匹配
            // 并行发送请求多个事项同时验证
            PromiseConcurrent(
                _that.matters.map(function (item) {

                    return function () {

                        // 对象与SOP 匹配验证
                        return createPlan_controller.verifyObjectAndSop({
                            objs: item.desc_objs.map(function (item) {
                                return {
                                    obj_id: item.obj_id,
                                    obj_name: item.obj_name,
                                }
                            }),
                            sop_ids: _.map(item.desc_sops, "sop_id")
                        })
                    }
                })
            ).then(function (res) {
                // 把原来的错误的状态替换的新的错误信息中
                res.forEach(function (item, index) {

                    item = item.map(function (info) {
                        // 有之前的返回之前的，没有之前的返回新的
                        var find = _.find(_that.mattersViews[index].verify, { obj_name: info.obj_name, sop_name: info.sop_name });
                        return find ? find : info;
                    })

                    _that.mattersViews[index].verify = item;
                });
                // 验证替换后的错误信息是否全部被忽略
                if (
                    !_that.mattersViews.map(function (item) {
                        return _.filter(item.verify, { selected: false }).length
                    }).reduce(function (con, num) {
                        return con + num;
                    }, 0)
                ) {
                    console.log("已经全部被忽略,可以提交预览");
                    //  验证是否被销毁
                    // _that.matters
                    createPlan_controller.querySopListForSel().then(function (data) {
                        var res = data.res;
                        // 验证所有的 SOP 都在直接提交
                        var bool = _that.matters.reduce(function (con, item, index) {

                            if (!con) return false;
                            //  循环每个matter 的 desc_sop 判断是否存在当前SOP列表中
                            return item.desc_sops.reduce(function (con, info) {

                                if (!con) return false;
                                var bol = !!_.filter(res, { sop_id: info.sop_id }).length;
                                // 再从忽略列表中查找
                                if (!bol) {
                                    var bol = !!_.filter(_that.mattersViews[index].sopeds, { sop_id: info.sop_id, ignore: true }).length;
                                }

                                // 已经保存了添加到报废列表中
                                if (!bol) {
                                    info.ignore = false;
                                    _that.mattersViews[index].sopeds.push(info)
                                }

                                return bol;
                            }, con)
                        }, true);

                        if (bool) {


                            createPlan_controller.getWoMattersPreview({
                                order_type: _that.$refs.baseinfomation.addWoPlan.order_type,
                                draft_matters: _that.matters,
                            }).then(function (res) {
                                console.log("可以执行保存了");
                                // 保存预览时候数据
                                _that.WoMattersPreview = res[0];

                                _that.PreView = true;
                            })
                        }
                    })
                }
            })

        },
        //  查询大类下的对象实例
        queryObjectByClass: function (obj_id, obj_type) {

            var _that = this;

            createPlan_controller.queryObjectByClass({
                obj_id: obj_id,
                obj_type: obj_type,
            }).then(function (res) {
                _that.ObjectByClass = res;
            })
        },
        // 获取父级的路径
        getparent_names: function (arr) {
            return arr.map(function (parent) {

                return parent.parent_names.join('-');
            }).join('');
        },
        // 选择实例的点击事件
        handder_clicl: function (confirm_result, item) {
            this.ObjectByClassId = void 0;
            confirm_result.obj_id = item.obj_id;
            confirm_result.obj_name = item.obj_name;
            confirm_result.obj_type = item.obj_type;
        }
    },
    computed: {
        base: function () {
            return this.$refs.baseinfomation;
        }
    },
    watch: {
        matters: function (newVlaue) {
            var _that = this;
            if (newVlaue.length > _that.mattersViews.length) {

                _that.mattersViews = _that.mattersViews.concat(_.range(newVlaue.length - _that.mattersViews.length).map(function () {
                    return new ViewError();
                }))
            } else if (newVlaue.length < _that.mattersViews.length) {

                _that.mattersViews.splice(newVlaue.length);
            }
        }
    },
    beforeMount: function () {

        var _that = this;
        //  查询工单状态类
        var WorkOrderTypePromise = controller.queryWoTypeList().then(function (res) {
            //  返回对应Object 集合
            _that.WorkOrderType = res.reduce(function (con, item) {
                con[item.code] = item.name;
                return con;
            }, {});

        }).catch(function () {

            _that.WorkOrderType = {};
        })



    }
})