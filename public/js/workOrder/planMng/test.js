






_.chunk(_.range(_.random(28, 31)).map(item => ++item), 3).map((item, index) => {

    var obj = {
        "ask_start_time": "201804" + ("00" + item.slice(0, 1)).slice(-2),   //要求开始时间,yyyyMMddhhmmss
        "ask_end_time": "201804" + ("00" + item.slice(-1)).slice(-2),     //要求结束时间,yyyyMMddhhmmss
        "order_state": "1"       //工单状态编码，优先返回自定义状态
    };

    if (index % 2) {
        obj.order_id = "1231";
    }

    return obj;
})