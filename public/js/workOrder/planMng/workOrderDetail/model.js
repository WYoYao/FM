// 需存入v.instance.cache  workOrderId工单id
// 然后调用workOrderDetailReady
// 计划管理通用
v.pushComponent({
    name: "workOrderDetail",
    data: {
        // 工单详情数据
        orderDetailData: {},
        // 添加工具保存数组
        toolarr: [],
        // 是否显示添加工具
        isShowAddTool: false,
    },
    methods: {
        // 查看工单详情 ,id工单id，name，name为"workOrderDetail",path在计划模块中使用，其他模块不需要传
        openWorkOrderDetail : function(id,name,path){
            if(!id){
                console.log("请携带工单ID");
                return
            };
            v.instance.cache.workOrderId = id;
            path ? v.instance.cache.name = path : void 0;
            v.initPage(name);
            v.instance.workOrderDetailReady();
        },
        // 生成页面
        workOrderDetailReady: function () {
            var that = this;
            $("#workOrderDetailLoad").pshow();
            PMA.OD({ order_id: that.cache.workOrderId }, function (data) {
                that.orderDetailData = JSON.parse(JSON.stringify(data.work_order.wo_body || {}));
                that.orderDetailData.wo_exec_controls && that.orderDetailData.wo_exec_controls.length != 0 && that.orderDetailData.wo_exec_controls.forEach(function(item){
                    item.type = that.getWorkOrderCheckType(item.control_code);
                });
            }, function () {
                that.orderDetailData = {};
            }, function () {
                $("#workOrderDetailLoad").phide();
            })
        },
        workOrderArrToString: function (arr) { //普通数组转字符串方法
            var arr = arr || [];
            var str = ''
            if (arr) {
                str = arr.join("、");
            } else {
                str = ""
            }
            return str;
        },
        getWorkOrderCheckType: function (str) {
            str = str || "";

            if(str == 'stop'){
                return {state:'stop',type:'stop'};
            }
            
            var obj = {};
            if (str.search('apply') !== -1) {
                obj.state = 'apply';
            } else if (str.search('audit') !== -1) {
                obj.state = 'audit';
            } else {
                obj.state = 'approval';
            }

            if (str.search('Matters') !== -1) {
                obj.type = 'ma';
            } else if (str.search('AddingPeople') !== -1) {
                obj.type = 'ap';
            } else if (str.search('ReplacePeople') !== -1) {
                obj.type = 'rp';
            } else if (str.search('Delay') !== -1) {
                obj.type = 'dl';
            } else {
                obj.type = 'cl';
            }
            return obj;
        },
        // gt-大于,gte-大于等于，lt-小于,lte-小于等于
        createInfoWrongWO: function (a, b, u) {
            if (a) {
                return a.reduce(function (t, item) {
                    switch (item.type) {
                        case 'gt':
                            t += (',大于' + item.values + u);
                            break
                        case 'gte':
                            t += (',大于等于' + item.values + u);
                            break
                        case 'lt':
                            t += (',小于' + item.values + u);
                            break
                        case 'lte':
                            t += (',小于等于' + item.values + u);
                            break
                        case 'range':
                            t += (item.values[0] + u + '~' + item.values[1] + u);
                            break
                    }
                    t.slice(0, 1) === ',' ? t = t.slice(1) : void 0;
                    return t;
                }, "");
            } else {
                return (b.join(u + ',') + u);
            }
        },
        createSureInfoWO: function (model) {
            var str = "";
            switch (model.type) {
                case '1':
                    str = model.name;
                    break
                case '2':
                    str = model.name + "(异常范围 : " + model.wrongs.join(",") + ")";
                    break
                case '3':
                    str = model.name + "(异常范围 : " + model.wrongs.join(",") + ")";
                    break
                case '4':
                    str = model.name + "(异常范围 : " + this.createInfoWrongWO(model.wrong_ranges, model.wrongs, "") + ")";
                    break
                case '5':
                    str = model.name + "(异常范围 : " + this.createInfoWrongWO(model.wrong_ranges, model.wrongs, model.unit) + ")";
                    break
            }
            return str;
        },
        getPreview: function (argu) {
            var _that = this;
            controller.getWoMattersPreview(argu).then(function (res) {

                _that.argu.preview = res;
                _that.queryPersonListByPositionIdsArgu.domain_list = res.domain_lis;
                controller.queryPersonListByPositionIds(_that.queryPersonListByPositionIdsArgu).then(function (res) {
                    _that.persons = res;
                    // console.log(res);
                })

                _that.isShowAddTool = true;

                var res = Object.assign({}, res, JSON.parse(JSON.stringify(_that.addwork)));


                _that.orderDetailData = JSON.parse(JSON.stringify(res)) || {};
                _that.orderDetailData.wo_exec_controls.forEach(function (item) {
                    item.type = that.getWorkOrderCheckType(item.control_code);
                });
            }).catch(function () {
                _that.orderDetailData = {};
            })
        }


    },
    filters: {

    },
    beforeMount: function () {

    }
});