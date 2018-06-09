v.pushComponent({
    name: "eventListTem",
    data: {
        eventRate:0,              // 事件状态
        eventTypeSel:0,           // 事件类别    
        eventCloseReason:[
            {name:"误报",code:0},
            {name:"重复报修",code:1},
            {name:"其他",code:2},
            // {name:"工单已完成",code:3}
        ],
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
    },
    methods: {

        // 选择事件状态
        selEventState:function(){
            this.clearProEvListSort();
            this.proEvListData.sort = {name:null,type:null};
            this.eventRate = Number($("#eventRateCombo").psel().id);
            $("#eventListPages").psel(1,false);
            this.getProEvListLenAndData();
        },
        // 选择事件类型
        selEventType : function(){
            this.clearProEvListSort();
            this.proEvListData.sort = {name:null,type:null};
            $("#eventListPages").psel(1,false);
            this.eventTypeSel = Number($("#eventType").psel().id);
            this.getProEvListData();
            this.getProEvListLen();
        },
        // 搜索事件
        searchThisEvent : function(){
            $("#eventListPages").psel(1,false);
            $("#proEvListKey").pval().key.length >= 0 ? this.getProEvListData() : void 0;
            
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
            this.getProEvListData();
            this.getProEvListLen();
        },
        // 分页器
        selEventListPage:function(){
            this.getProEvListData();
            this.getProEvListLen();
            $("#closeProEventCombo").hide();
        },




        getProEvListDataParam : function(){
            var param = {
                "eventState":String(this.eventRate),
                "eventType":this.eventTypeSel === 0 ? null : String(this.eventTypeSel - 1),
                "projectId":this.eventListProjectId,
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
                param.close_type = $("#closeReasonCombo").psel() ? $("#closeReasonCombo").psel().index : null;
                param.close_time = {
                    start : time.startTime,
                    end : time.endTime
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
            this.getProEvListLen();
            this.getProEvListData();
        },





        // 恢复页面至初始状态
        eventListRecover : function(){
            this.eventRate = 0;
            this.eventTypeSel = 0;
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
            if((isTop&&isSel) || (!isTop&&!isSel)){obj.type = 'desc';}else{obj.type = 'asc';};
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
        // 项目事件列表关闭按钮的假下拉列表
        proEvListFakerCombo : function(ev,id){
            this.closedEvId = id; 
            var el = ev.target.childNodes.length === 0 ? $(ev.target).parents('.btn') : ev.target;
            this.proEvListSelEl = el;
            var isS = $(el).hasClass('is');  
            isS ? $(el).removeClass('is') : $(el).addClass('is');
            if(!isS){
                var p = $(el).offset();
                $("#closeProEventCombo").css({"top":p.top,"left":p.left,"display":"block"});
                $("#closeProEventCombo>div").eq(1).css("display","block")
            }else{
                $("#closeProEventCombo").css('display',"none");
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
                return [str.split(","),str.split(",").length];
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