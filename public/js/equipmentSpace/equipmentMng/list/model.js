function currentSelector() {
    return {

        "equip_code": "",   //设备类型对应的字段待确定

        "build_id": "", //建筑id
        "domain_code": "", //专业编码
        "system_id": "", //系统id
        "keyword": "", //关键字,
        "valid": true, //有效状态 ，true-有效/运行中，false-失效/作废，必须
        "page": 1, //当前页号，默认从第1页开始，必须
        "page_size": 50 //每页返回数量，不传时不分页，必须
    }
}

function SystemSelector() {
    return {
        "build_id": "", //建筑id
        "system_domain": "" //系统所属专业编码, 必须
    }
}

function EquipStatisticCount() {
    return {
        "equip_total": 0, //设备总数,运行中总数
        "new_count": 0, //本周新数量，没有则返回0
        "repair_count": 0, //当前维修中数量，没有则返回0
        "maint_count": 0, //当前维保中数量，没有则返回0
        "going_destroy_count": 0 //即将报废数量，没有则返回0
    }
}

var EnumType = {
    equip_total: 'EquipList',
    repair_count: 'ServicingList',
    maint_count: 'MaintenanceList',
    going_destroy_count: 'ScrappedList',
};
//2018.01.09-11 add start
function moreCollapseData() {
    return {
        "BuildList": null,
        "GeneralDict": null,
        "System": null,
        "EquipmentType": null
    }
}
//2018.01.09-11 add end

v.pushComponent({
    name: 'equipmentMng',
    el: '#equipmentMng',
    data: {
        currentWordListEquip_id: "",
        BuildList: [], //建筑列表
        GeneralDict: [], // 专业列表
        System: [], // 系统列表
        EquipmentType: [],//设备类型
        EquipList: [], // 当前设备列表
        ServicingList: [], //维修中列表
        MaintenanceList: [], // 维保中列表
        ScrappedList: [], //报废列表
        EquipStateList: [{
            "code": true,
            "name": "运行中"
        }, {
            "code": false,
            "name": "已报废"
        }], //设备状态
        //2018.01.08 add start
        more: new moreCollapseData(),
        collapse: new moreCollapseData(),
        //2018.01.08 add end
        currentSelector: new currentSelector(), // 查询列表内容
        currentSystemSelector: new SystemSelector(), // 查询当前专业实例的
        EquipStatisticCount: new EquipStatisticCount(), // 设备数量
        onTab: 'equip_total', // 当前显示的块
        onPage: 'list', // list 列表 detail // 详情 // 新建 insert    //系统管理 System
        listHeight: {}, // 行号的类型
        Scrapped: {}, // 准备报废的设备
        // 工单详情Start
        planObjExampleArr: [],
        orderDetailData: {},
        orderOperatList: [],
        pages: [],
        curPage: '',
        personPositionList: [],
        // 工单详情End
        uploadImgLength:0,
        uploadFileLength:0,


    },
    computed: {
        // listHeight: function() {
        //     debugger;
        //     var height = document.querySelector('.queryblock').offsetHeight + (this.onTab == 'equip_total' ? document.querySelector('.searchHeader').offsetHeight : 0);
        //     console.log(height);
        //     return {
        //         postion: 'absolute',
        //         top: height + 'px',
        //         bottom: 0,
        //     };
        // }
    },
    filters: {
        num2str: function (str) {

            if (_.isUndefined(str)) return "";

            if (_.isNumber(str)) str = Array.prototype.slice.call(new String(str)).reverse().join('');
            return Array.prototype.slice.call(
                str.replace(/\d{3}?/g, function (word, startIndex) {

                    return startIndex + 3 == str.length ? word : word + ",";
                })
            ).reverse().join('');
        },
        yyyyMMddhhmmss2date: function (str) {

            return str.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/g, function () {
                var arr = Array.prototype.slice.call(arguments);
                return arr.slice(1, 4).join('/') + " " + arr.slice(4, 7).join(':');
            });
        },
        date2yyyyMMddhhmm: function (date) {

            return (new Date(date)).format('yyyy.MM.dd hh:mm');
        }
    },
    methods: {
        // 前往工单详情
        _clickGoWork: function (item) {
            var _that = this;

            _that.showWorkOrder = "wordorder";
            orderDetail_pub.getOrderDetail(v.instance, item.order_id, "1", function () {
                _that.onPage = "list";
                _that.showWorkOrder = false;
            });
        },
        // 跳转到详情页
        _clickIntoDeatil: function (item) {

            v.initPage('equipmentMngDeatil', {
                equip_id: item.equip_id
            });

            this.onPage = 'detail';
        },
        // 文字搜索
        _clearSearch: function () {
            $("#searchBtn").precover();
            this.currentSelector = new currentSelector();
            this.setCurrentSelectorAttr('keyword', '');
            // 清空所属系统
            this.System = []
        },
        // 搜索按钮点击事件
        _clickSearch: function () {

            // this.currentSelector = new currentSelector();

            document.querySelector('#ul_' + this.onTab).scrollTop = 0;

            // this.currentSelector.build_id = "";
            // this.currentSelector.domain_code = "";
            // this.System = [];
            this.$nextTick(this.computelistHeight);

            this.setCurrentSelectorAttr('keyword', $("#searchBtn").pval());
        },
        // 获取行高
        computelistHeight: function () {
            var height = (document.querySelector('.queryblock') || { offsetHeight: 0 }).offsetHeight + (this.onTab == 'equip_total' ? (document.querySelector('.searchHeader') || { offsetHeight: 0 }).offsetHeight : (document.querySelector('.spaceHeader') || { offsetHeight: 0 }).offsetHeight);

            this.listHeight = {
                position: 'absolute',
                top: height + 'px',
                bottom: 0,
                width: '100%'
            };
        },
        //页面切换效果
        switchOnTab: function (str) {

            $(".nodata").addClass('noDataDiv');

            // 切换页面效果
            this.onTab = str;

            // 清空当前选项
            this.currentSelector = new currentSelector();

            // 清空已加载的列表
            this.EquipList = []; // 当前设备列表
            this.ServicingList = []; //维修中列表
            this.MaintenanceList = []; // 维保中列表
            this.ScrappedList = []; //报废列表

            this.System = [];

            // 切换Tab 默认查询全部
            this.setCurrentSelectorAttr("build_id", "");

            // 清空搜索按钮
            $("#searchBtn").precover();

            var _that = this;
            this.$nextTick(this.computelistHeight);

        },
        // 查询列表
        setCurrentSelectorAttr: function (key, value) {

            this.currentSelector[key] = value;
            var _that = this;

            this.currentSelector.page = 1;

            equipmentMngList.queryEquipEnum(_that.onTab, this.currentSelector).then(function (list) {
                
                _that[EnumType[_that.onTab]] = list || [];

                $(".nodata").removeClass('noDataDiv');
                _that.$nextTick(_that.computelistHeight);
            })
        },
        // 清空对应的属性
        rmCurrentSelectorAttr: function (key, value) {
            var _that = this;
            if((key == "build_id")){
                this.setCurrentSelectorAttr('build_id', value);
                // key = "domain_code";
                // value = "";
                return false;
            }
            var Enum = ['domain_code', 'build_id'];
            var convertEnum = {
                'domain_code': 'system_domain',
                'build_id': 'build_id',
            }
            if (Enum.indexOf(key) != -1) {

                this.setCurrentSelectorAttr('system_id', '');
                this.setCurrentSelectorAttr('equip_code', '');

                this.currentSystemSelector[convertEnum[key]] = value;

                // 当专业未选择的时候的为空
                if (!this.currentSystemSelector['system_domain']) {

                    _that.System = [];
                    _that.EquipmentType = [];
                    _that.$nextTick(_that.computelistHeight);

                } else {
                    //查询系统、类型TODO
                    equipmentMngList.queryProfession({ domain_code: _that.currentSelector.domain_code, system_code: _that.currentSelector.system_code }).then(function (res) {
                        var all = {
                            "code": "",
                            "name": "全部"
                        };
                        res = _.isArray(res) ? res : [];
                        res.splice(0, 0, all);
                        _that.System = res;
                        _that.EquipmentType = [];
                        setTimeout(function () {
                            _that.$nextTick(_that.computedUlHeight("System"), 0);

                        });

                    });
                    //wyy注释
                    // equipmentMngList.querySystemForSystemDomain(this.currentSystemSelector).then(function (res) {
                    //     var all = {
                    //         "system_id": "",
                    //         "system_name": "全部"
                    //     };

                    //     res = _.isArray(res) ? res : [];

                    //     if (res.length) {
                    //         res.splice(0, 0, all);
                    //     }

                    //     _that.System = res;
                    //     // _that.$nextTick(_that.computelistHeight);
                    //     setTimeout(function () {
                    //         _that.$nextTick(_that.computedUlHeight("System"), 0)

                    //     })
                    // });
                }

            }

            // 如果修改的是系统需要重新查询设备类型
            if (key == "system_id") {
                _that.setCurrentSelectorAttr('equip_code', '');
                // 如果是全部直接清空
                if (!value.length)
                    _that.EquipmentType = [];
                else {
                    equipmentMngList.queryProfession({ domain_code: _that.currentSelector.domain_code, system_code: _that.currentSelector.system_id }).then(function (res) {
                        var all = {
                            "code": "",
                            "name": "全部"
                        };
                        res = _.isArray(res) ? res : [];
                        res.splice(0, 0, all);
                        _that.EquipmentType = res;
                        setTimeout(function () {
                            _that.$nextTick(_that.computedUlHeight("EquipmentType"), 0);

                        })


                    });
                }
            }
        },
        //2018.01.09 add start
        clearLastData: function (key) {
            var keywords = key.split("_");
            var pro;
            switch (keywords[0]) {
                case "domain":
                    pro = "System";
                    break;
                default:
                    break;
            }
            this.more[pro] = null;
            this.collapse[pro] = null;
            $("." + pro).removeClass("heightAuto");
        },
        //2018.01.09 add end
        // 数组之间的高亮样式切换
        listClassTolego: function (key, id) {
            this.clearLastData(key);//清掉上一次数据
            //修改查询的状态
            this.currentSelector[key] = id;

            // 所属建筑 和 专业修改后做额外处理
            this.rmCurrentSelectorAttr(key, id);



            // 查询对应的内容
            this.setCurrentSelectorAttr(key, id);

        },
        // 下拉到底的调用方法
        scrollButtom: function () {
            this.setCurrentSelectorAttr('page', this.currentSelector.page + 1);
        },
        // 报废设备
        _clickScrapped: function (item) {
            this.Scrapped = item;
            $("#confirmWindow").pshow({
                title: '确定要报废此设备吗？',
                subtitle: '被报废的设备不能再编辑以及被工单使用'
            })
        },
        // 录入新设备
        goInsert: function () {

            v.initPage("equipmentMngInsert")
            this.onPage = 'insert';
        },
        goSystemMgn: function () {
            v.initPage("systemMng")
            this.onPage = 'System';
        },
        //2018.01.08-11 add start
        /*computedWidth: function (className) {
         var _that = this;
         var $queryDom = $("." + className)
         var pWidth = $queryDom.width();
         var lWidth = 0;
         $queryDom.children("li:visible").each(function (i, ele) {
         var boxwidth = $(this).width() + 16;
         console.log(boxwidth)
         lWidth += boxwidth;
         });
         console.log(lWidth)
         console.log(pWidth)
         _that.more[className] = lWidth > pWidth;
         _that.computelistHeight();
         },*/
        computedUlHeight: function (className) {
            var _that = this;
            var $queryDom = $("." + className);
            var pHeight = $queryDom.height();
            _that.more[className] = pHeight > 36;
            setTimeout(function () {
                _that.computelistHeight();

            }, 0)

        },
        //点击更多展开
        expand: function (boo, className, event) {
            event.stopPropagation();
            var _that = this;
            var $queryDom = $("." + className);
            if (boo) {
                _that.more[className] = false;
                _that.collapse[className] = true;
                $queryDom.addClass("heightAuto");

            } else {
                _that.more[className] = true;
                _that.collapse[className] = false;
                $queryDom.removeClass("heightAuto");

            }
            setTimeout(function () {
                _that.computelistHeight();
            }, 0)
        },
        //点击收起关闭
        //2018.01.08-11 add end



    },
    beforeMount: function () {

        var _that = this;
        // 查询所有的建筑列表
        equipmentMngList.queryBuild().then(function (res) {
            var all = {
                "obj_id": "",
                "obj_name": "全部",
            };

            res = _.isArray(res) ? res : [];

            res.splice(0, 0, all);
            _that.BuildList = res;
            setTimeout(function () {
                _that.$nextTick(_that.computedUlHeight("BuildList"), 0)

            })
        });

        // 查询专业需求
        equipmentMngList.queryProfession({ domain_code: "", system_code: "" }).then(function (res) {
            var all = {
                "code": "",
                "name": "全部"
            };

            res = _.isArray(res) ? res : [];

            res.splice(0, 0, all);
            _that.GeneralDict = res;
            setTimeout(function () {
                _that.$nextTick(_that.computedUlHeight("GeneralDict"), 0)

            })
        });

        // 查询设备统计数量
        equipmentMngList.queryEquipStatisticCount().then(function (res) {
            _that.EquipStatisticCount = res;

            $("#globalloading").phide();
        });

        // 绑定下滑列表的滚动查询

        $(".tbody").scroll(function () {

            if ((this.scrollTop + this.offsetHeight) == this.scrollHeight) {

                document.querySelector('#ul_' + _that.onTab).scrollTop = document.querySelector('#ul_' + _that.onTab).scrollTop - 1;

                _that.currentSelector.page += 1;

                equipmentMngList.queryEquipEnum(_that.onTab, _that.currentSelector).then(function (list) {

                    if (_.isArray(list) && !list.length) {
                        $("#globalnotice").pshow({
                            text: '已经加载到底了',
                            state: "success"
                        });
                    }
                    ;

                    document.querySelector('#ul_' + _that.onTab).scrollTop = document.querySelector('#ul_' + _that.onTab).scrollTop - 1;

                    var count = _that[EnumType[_that.onTab]].count;

                    _that[EnumType[_that.onTab]] = _that[EnumType[_that.onTab]].concat(list);

                    _that[EnumType[_that.onTab]].count = count;
                })
            }

        });


        _that.switchOnTab("equip_total");

    },
})