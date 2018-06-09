v.pushComponent({
    name: "closeEvent",
    data: {
        repeateEvListData:[],//该项目事件重复事件列表数据
        evCloseFromList:null,//关闭项目事件用，判断该关闭事件来自项目事件列表还是项目事件详情
        closedEvId:"",//要操作的项目事件的ID
        isSelCloseEv:true,
        // EMCloseEvProjectId:"",
    },
    methods: {
        // 选择关闭事件方式
        selCloseProEvWay : function(sel,type){
            this.evCloseFromList = type === 'list' ? true : false;
            v.instance.proEvListPower.isELTHasPage = true;
            switch(sel.code){
                case 0:
                    this.closeEvWrong();
                    break
                case 1:
                    type === 'list' ? this.stopModelEvPropagation(true) : void 0;
                    this.getRepeateEvList();
                    this.isSelCloseEv = true;
                    $("#selRepeatEventW").pshow();
                    break
                case 2:
                    type === 'list' ? this.stopModelEvPropagation(true) : void 0;
                    $("#closeEvOthRsnW").pshow();
                    break
            }
        },
        // 关闭重复事件确认
        selRepeatEventFin : function(type){
            if(type){
                var param = {
                    eventId : this.closedEvId,
                    eventState: "2",
                    closeType : "1",
                    repeatedEventId : [],
                    person_id:this.userInfo.person_id
                };
                this.repeateEvListData.forEach(function(item){
                    item.sel ? param.repeatedEventId.push(item.eventId) : void 0;
                })
                param.repeatedEventId = param.repeatedEventId.toString();
                if(param.repeatedEventId.length === 0){
                    $("#globalnotice").pshow({text: "请选择事件",state: "failure"});
                    return 
                }
                var fn = this.evCloseFromList ? v.instance.getProEvListData : v.instance.getProEvInfo;
                this.closeProEv(param,fn)
            }
            $("#selRepeatEventW").phide();
        },
        // 关闭事件  其他原因  确认
        closeEvOthRsnFin : function(type){
            if(type){
                var param = {
                    eventId : this.closedEvId,
                    eventState: "2",
                    closeType : "2",
                    closeRemark: $("#closeEvOthText").pval(),
                    person_id:this.userInfo.person_id
                };
                var fn = this.evCloseFromList ? v.instance.getProEvListData : v.instance.getProEvInfo;
                this.closeProEv(param,fn);
            }
            $("#closeEvOthRsnW").phide();
        },
        // 关闭误报事件
        closeEvWrong : function(){
            var param = {eventId:this.closedEvId,closeType:"0",eventState:"2",person_id:this.userInfo.person_id};
            var fn = this.evCloseFromList ? v.instance.getProEvListData : v.instance.getProEvInfo;
            this.closeProEv(param,fn);
        },
        // 获取重复事件列表数据
        getRepeateEvList : function(){
            var that = this;
            $("#evRepeatLoading").pshow();
            EMA.RE({
                keyword:$("#proEvListKey").pval().key.length === 0 ? null : $("#proEvListKey").pval().key,
                projectId:this.eventListProjectId,
                eventId:this.closedEvId,
            },function(data){
                data = JSON.parse(JSON.stringify(data)) || [];
                that.repeateEvListData = data.map(function(item){
                    item.sel = false;
                    return item;
                });
            },function(){
                that.repeateEvListData = [];
            },function(){
                $("#evRepeatLoading").phide();
            })
        },
        // 关闭项目事件
        closeProEv : function(param,fn){
            EMA.CP(param,function(){
                $("#globalnotice").pshow({ text: '提交成功', state: "success" });
                fn();
            },function(){

            },function(){
                
            })
        },
        // 选择关闭
        selRepeatProEv : function(model){
            this.repeateEvListData.forEach(function(item){
                item.sel = false;
            })
            model.sel = true;
        },   
    },
    filters: {

    },
    watch: {

    },
});