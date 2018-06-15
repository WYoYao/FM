v.pushComponent({
    name: "eventListTem",
    data: {
        eventRate:0,              // 事件状态
        eventTypeSel:0,           // 事件类别    
        eventCloseReason:[
            {name:"全部",code:null,id:null},
            {name:"误报",code:0,id:"0"},
            {name:"重复报修",code:1,id:"1"},
            {name:"其他",code:2,id:"2"},
            {name:"工单已完成",code:3,id:"3"},
            {name:"工单已中止",code:4,id:"4"}
        ],
        eventCloseReasonBtn:[//操作按钮上的状态
            {name:"误报",code:0},
            {name:"重复报修",code:1},
            {name:"其他",code:2},
        ],
        eventDeptSel: null,      //事件处理部门
        eventDealDepts: [],       //事件处理部门数据
        eventListProjectId:"",    // 查询该项目的事件
        proEvListPower:{          // 该页所有控制类数据
            closeEvent:false,      // 操作或者关闭事件权限
            isCanSelState:true,   // 是否能够选择事件状态
            isELTHasPage:false,   // 是否分页
        },   
        proEvListData:{           // 项目事件数据
            data:[],              // 项目事件列表数据
            len:{},               // 项目各状态事件数量
            num:0,
            sort:{
                name:null,          //排序根据
                type:null           //排序顺序
            }
        },
        proEvListSelEl:"",
        _startTime:"", //设置时间筛选
        _endTime:"",
        showDepartmentCombo: true,
    },
    methods: {

        // 选择事件状态
        selEventState:function(){
            this.clearProEvListSort();
            this.addDefaultSort();
            this.proEvListData.sort = {name:null,type:null};
            this.eventRate = Number($("#eventRateCombo").psel().id);
            $("#eventListPages").psel(1,false);
            this.getProEvListLenAndData();
        },
        // 选择事件类型
        selEventType : function(){
            this.clearProEvListSort();
            // debugger;
           
            this.proEvListData.sort = {name:null,type:null};
            $("#eventListPages").psel(1,false);
            this.eventTypeSel = Number($("#eventType").psel().id);
            this.getProEvListData();
            this.getProEvListLen();
            setTimeout(function(){
                this.addDefaultSort();
            })
            
        },
        // 搜索事件
        searchThisEvent : function(){
            $("#eventListPages").psel(1,false);
            $("#proEvListKey").pval().key.length >= 0 ? this.getProEvListData() : void 0;
            
        },
        // 选择事件处理部门
        selDepartment : function(){
            this.eventDeptSel = arguments[0];
            $("#eventListPages").psel(1,false);
            this.getProEvListData();
            this.getProEvListLen();
        },
        // 选择关闭事件原因
        selCloseReason : function(){
            $("#eventListPages").psel(1,false);
            this.getProEvListData();
            this.getProEvListLen();
        },
        // 选择关闭事件时间
        selCloseEvTime : function(){
            $("#eventListPages").psel(1,false);
            this._startTime = $("#closeTimePtime").psel().startTime;
            this._endTime = $("#closeTimePtime").psel().endTime;
            this.getProEvListData();
            this.getProEvListLen();
        },
        // 分页器
        selEventListPage:function(){
            this.getProEvListData();
            this.getProEvListLen();
            $("#closeProEventCombo").hide();
        },
        //关闭时间控件弹框
        hideTimeCalendar:function(){
            $('#closeTimePtime').pslideUp();
        },



        //获取事件处理部门
        getEventDealDepts: function () {
            var that = this;
            EMA.DT({"projectId":this.eventListProjectId}, function (data) {
                function appendAttrTree (arr, arrAttr, settedAttr, value, curLevel) {
                    arr = arr ? arr : [];
                    for (var i = 0; i < arr.length; i++) {
                        arr[i][settedAttr] = value;
                        arr[i]['level'] = curLevel;
                        appendAttrTree(arr[i][arrAttr], arrAttr, settedAttr, value, curLevel + 1);
                    }
                }
                appendAttrTree(data.data || [], 'child_objs', 'issel', true, 1);
                that.eventDealDepts = JSON.parse(JSON.stringify(data.data)) || [];
            }, function () {
                that.eventDealDepts = [];
            }, function () {
            })
        },
        getProEvListDataParam : function(){
            var param = {
                "eventState":String(this.eventRate),
                "eventType":this.eventTypeSel === 0 ? null : String(this.eventTypeSel - 1),
                "projectId":this.eventListProjectId,
                "deptId":(this.eventDeptSel || {}).obj_id
            }
            if(this.proEvListData.sort.type != null){
                param.orderName = this.proEvListData.sort.name;
                param.orderType = this.proEvListData.sort.type;
            }
            var time = $("#closeTimePtime").psel();
            // 搜索
            $("#proEvListKey").pval().key.length > 0 ? param.keyword = $("#proEvListKey").pval().key : void 0;
            // 关闭原因及时间筛选
            if(this.eventRate === 2){
                param.closeType = $("#closeReasonCombo").psel() && $("#closeReasonCombo").psel().text == "全部" ? null : ($("#closeReasonCombo").psel().index -1 );
                if(this._startTime){
                    param.closeTime = {
                        start : new Date(time.startTime).format("yMd") || '',
                        end :new Date(time.endTime).format("yMd") || ''
                    }
                }else{
                    param.closeTime = null;
                }
                
            }
            // 分页
            if(this.proEvListPower.isELTHasPage){
                param.page = $("#eventListPages").psel() ? $("#eventListPages").psel() : 1;
                param.pageSize = this.evPageLen;
            }
            return param;
        },
        // 获取项目事件数量
        getProEvListLen : function(){
            var that = this;
            EMA.PL({"eventState":String(that.eventRate),"projectId":this.eventListProjectId,},function(data){
                that.proEvListData.len = data[0] ? data[0] : {};
            },function(){
                that.proEvListData.len = {};
            },function(){
                
            });
        },
        // 获取项目事件列表数据
        getProEvListData : function(){
            var that = this;
            $("#globalloading").pshow();
            // $('#globalloading').pshow();
            EMA.PE(that.getProEvListDataParam(),function(data){
                that.proEvListData.data = data[0] ? (data[0].contents || []) : [];
                $("#eventListPages").pcount(data[0] ? Math.ceil((data[0].total || 1)/(v.instance.evPageLen)) : 1);
                that.proEvListData.num = data[0] ? data[0].total || 0 : 0;
                that.compuetEvsObj();
                that.$nextTick(function(){
                    $("#globalloading").phide();
                })
            },function(){
                that.proEvListData.data = [];
                that.proEvListData.num = 0;
                $("#globalloading").phide();
            },function(){
                
                // $('#globalloading').phide();
            });
            
        },
        // 有分页时切换大Tab获取数据
        getProEvListLenAndData : function(){
            this._startTime = ""; //设置时间重置
            this._endTime = "";
            if(this.eventRate === 2){
                
            }
            this.getProEvListLen();
            this.getProEvListData();
        },





        // 恢复页面至初始状态
        eventListRecover : function(){
            this.eventRate = 0;
            this.eventTypeSel = 0;
            this.timeIsDefault = false;
            $("#eventRateCombo").psel(0,false);
            $("#eventType").psel(0,false);
        },




        // 处理异常信息
        evListWrong : function(a,b){
            if(a){
                return a[0] + "~" + a[1];
            }else{
                return b.reduce(function(t,m){
                    switch(m.type){
                        case 'gt':
                            t+=(",>"+m.values);
                        break;
                        case 'lt':
                            t+=(",<"+m.values);
                        break;
                        case 'range':
                            t+=("," + m.values[0] + '~' + m.values[1]);
                        break;
                    }
                    return t.substring(1);
                },"")
            }
        },
        // 处理实际数据
        evListActual : function(a,b,c){
            if(a){
                return a+c;
            }else{
                return (b.reduce(function(t,item){
                    return t += "," + item;
                },"") + c).substring(1);
            }
        },
        // 项目时间列表表头排序按钮点击事件 将分页器归1，重新获取数据
        proEvListSort : function(ev,type){
            this.eventMngListSort(ev,type,v.instance.proEvListData.sort);
            if(this.proEvListPower.isELTHasPage){$("#eventListPages").psel(1,false);};
            this.getProEvListData();
        },
        // 事件模块表格表头排序按钮点击
        eventMngListSort : function(ev,type,obj){
            var isSel = $(ev.target).hasClass('op');
            var isTop = $(ev.target).hasClass('t');
            this.clearProEvListSort();
            isSel ? isTop ? $(ev.target).next('em').addClass('op') : $(ev.target).prev('em').addClass('op') : $(ev.target).addClass('op');
            obj.name = type;
            if((isTop&&isSel) || (!isTop&&!isSel)){obj.type = 'asc';}else{obj.type = 'desc';};
        },
        // 清除排序箭头状态
        clearProEvListSort : function(){
            var elGather = document.getElementsByClassName('sort');
            for(var i=0;i<elGather.length;i++){
                var em = $(elGather[i]).find('em');
                $(em[0]).removeClass('op');
                $(em[1]).removeClass('op');
            }
        },
        addDefaultSort:function(){//z增加表头默认排序向下
            var elGather = document.getElementsByClassName('quertionType');
            for(var i=0;i<elGather.length;i++){
                var em = $(elGather[i]).find('em');
                $(em[0]).removeClass('op');
                $(em[1]).addClass('op');
            }
        },
        // 项目事件列表关闭按钮的假下拉列表
        proEvListFakerCombo : function(ev,id){
            ev.stopPropagation();
            this.closedEvId = id; 
            var el = ev.target.childNodes.length === 0 ? $(ev.target).parents('.btn') : ev.target;
            this.proEvListSelEl = el;
            // var isS = $(el).hasClass('is');  
            // isS ? $(el).removeClass('is') : $(el).addClass('is');
            // if(!isS){
            //     var p = $(el).offset();
            //     $("#closeProEventCombo").css({"top":p.top,"left":p.left,"display":"block"});
            //     $("#closeProEventCombo>div").eq(1).css("display","block")
            // }else{
            //     $("#closeProEventCombo").css('display',"none");
            // }
            //.per-combobox-wrap  控件下拉框的下半部分
            var isShow=$("#closeProEventCombo .per-combobox-wrap").is(":visible");
            if(isShow){
                $("#closeProEventCombo").hide();
                $("#closeProEventCombo .per-combobox-wrap").hide();
            }else{
                var p = $(el).offset();
                $("#closeProEventCombo").css({"top":p.top,"left":p.left});
                $("#closeProEventCombo").show();
                $("#closeProEventCombo .per-combobox-wrap").show();
                $("#closeProEventCombo>div").eq(1).css("display","block");
            }
          
        },
        // 项目列表选择了关闭原因
        proEvListCloseSel: function(sel){
            this.evCloseFromList = true;
            this.selCloseProEvWay(sel,'list');
        },
        //计算项目事件的对象长度生成对应html模板，伪装省略效果
        compuetEvsObj : function(){

            var w = $(".eventListTemWrap .grid").width() - 40;
            var arr = [[9,0,10,0,8],[9,0,12.5,0,12.5],[9,0,10,0,12.5]];
            w = w*arr[this.eventRate][this.eventTypeSel]/100;
            var l = Math.floor(w/14);

            this.proEvListData.data.forEach(function(item){
                if(item.associationObject){
                    var a = evListStrToArr(item.associationObject)[0];
                    var x = 0 , isL = false;
                    var o = a.reduce(function(t,model){
                        if((x + model.length) < l){
                            x += model.length;
                            if(model.split("@").length != 0){
                                t += "<span class='moreBlue'>" + model + ",</span>";
                            }else{
                                t += "<span>" + model + ",</span>";
                            }
                        }else if(l - x > 0){
                            isL = true;
                            var c = model.slice(0,l - x + 1);
                            x = l;
                            if(model.split("@").length != 0){
                                t += "<span class='moreBlue'>" + c + "...</span>";
                            }else{
                                t += "<span>" + c + "...</span>";
                            }
                        }
                        return t;
                    },"");
                    if(!isL){
                        o = o.substring(0,o.length - 8) + '</span>';
                    }
                    item.obj = o;
                    item.isL = isL;
                }else{
                    item.obj = v.instance.noDataWord;
                    item.isL = false;
                };
            })

        },

        //事件列表中关联对象处理
        evListStrToArr : function(str){
            if(str && str.length != 0){
                return [str.split("，"),str.split("，").length];
            }else{
                return [this.noDataWord,0];
            }   
        },
    },
    filters: {

    },
    watch: {
    },
    beforeMount : function(){
    }
});