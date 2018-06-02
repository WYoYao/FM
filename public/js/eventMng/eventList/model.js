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
            this.clearProEvListSort();
            this.eventRate = Number($("#eventListTab").psel());
            this.proEvListPower.isELTHasPage = this.eventRate === 2 ? true : false;
            this.getProEvListLenAndData();
        },
    },
    filters: {

    },
    beforeMount:function(){
        this.proEvListPower = {
            closeEvent:true,      // 关闭事件权限
            isCanSelState:false,   // 是否能够选择事件状态
            isELTHasPage:false,   // 是否分页
        };
        this.eventListProjectId = "abs";
        this.$nextTick(function(){
            $("#eventListTab").psel(0);
        })
        // here
        // 获取项目Id后存入eventListProjectId
        this.eventListProjectId = "Pj1505000004";
    },
    watch: {

    }
});