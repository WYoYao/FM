v.pushComponent({
    name: "eventList",
    data: {
        eventListTab:[
            {name:"待处理",icon:"A",id:0},
            {name:"处理中",icon:"G",id:1},
            {name:"已关闭",icon:"A",id:2},
        ],
    },
    methods: {
        // 选择大Tab
        selEventRate : function(){
            this.eventTypeSel = 0;
            $("#eventType").precover("全部");
            $("#proEvListKey").precover('',false);
            $("#departmentCombo").precover('处理部门', true);
            $("#eventType").pslideUp();
            $("#closeReasonCombo").pslideUp();
            $("#departmentCombo").pslideUp();
            $('#closeTimePtime').pslideUp();
            this.eventDealDepts = JSON.parse(JSON.stringify(this.eventDealDepts));
            this.eventDeptSel = null;
            this.clearProEvListSort();
            this.addDefaultSort();
            this.eventRate = Number($("#eventListTab").psel());
            // this.proEvListPower.isELTHasPage = this.eventRate === 2 ? true : false;
            //开启分页
            this.proEvListPower.isELTHasPage = true;
            
            this.getProEvListLenAndData();
            $("#closeProEventCombo").hide();
        },
    },
    filters: {

    },
    beforeMount:function(){
        this.proEvListPower = {
            closeEvent:true,      // 关闭事件权限
            isCanSelState:false,   // 是否能够选择事件状态
            isELTHasPage:true,   // 是否分页
        };
        this.$nextTick(function(){
            $("#eventListTab").psel(0);
            this.getEventDealDepts();
        })
        // here
        // 获取项目Id后存入eventListProjectId
        this.eventListProjectId = v.instance.project_id;
    },
    watch: {

    }
});