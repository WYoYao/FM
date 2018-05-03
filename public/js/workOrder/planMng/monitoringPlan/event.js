
// 数据处理流程控制
function groupDataControll(data) {
    // 日工单数据转行数据
    function dayOrderDataToRow(plan) {
        var len = plan.max_freq_num;
        var arr = [];
        for (var i = 0; i < len; i++) { arr.push([]) };
        plan.work_order_date.forEach(function (day) {
            for (var i = 0; i < len; i++) {
                if (day.work_order[i]) {
                    arr[i].push(day.work_order[i]);
                }
            }
        })
        plan.rowData = arr;
        plan.row = len;
        return plan;
    }
    // 非日计划类型工单筛选与日期预处理
    function orderDataFilter(plan) {
        var that = v._instance;
        var orderGather = plan.work_orders.map(function (order) {
            if ((+that.timeData.startTime < +order.ask_start_time && +order.ask_start_time < +that.timeData.endTime) || (+that.timeData.startTime < +order.ask_end_time && +order.ask_end_time < +that.timeData.endTime)) {
                order.ask_start_time = +order.ask_start_time > +that.timeData.startTime ? +order.ask_start_time : +that.timeData.startTime;
                order.ask_end_time = +order.ask_end_time > +that.timeData.endTime ? +that.timeData.endTime : +order.ask_end_time;
                return order
            }
        })
        plan.work_orders = orderGather;
        return plan;
    }
    // 非日计划类型工单数据转行数据
    function orderDataToRow(plan) {
        var row = 0;
        // 行数据
        var rowData = [];
        // 上一次工单结束时间
        var lastEndTime = 0;
        plan.work_orders.forEach(function (order) {
            if (order) {
                if (order.ask_start_time <= lastEndTime) {
                    // 如果工单开始时间小于等于上一条工单的结束时间,行数加一
                    row++;
                    // 新建一行数据并推入行数据
                    var a = [order];
                    rowData.push(a);
                } else {
                    // 如果工单开始时间大于上一条工单的结束时间,则行数不变,将行数据最后一行取出推入该数据
                    var a = rowData.pop();
                    // 如果之前行数据为空则推入第一行数据
                    if (a == undefined) {
                        a = [];
                        row += 1;
                    }
                    a.push(order);
                    // 将数据推回行数据
                    rowData.push(a);
                }
                // 更新上一条工单的结束时间
                lastEndTime = order.ask_end_time;
            }
        })
        // 将转换后的行数据放入计划数据
        plan.row = row;
        plan.rowData = rowData;
        return plan;
    }
    // 行数据转换
    function rowDataTransform(data) {
        data.forEach(function (plan) {
            // 无工单计划补足
            plan.row == 0 ? plan.row = 1 : void 0;
            plan.rowData == [] ? plan.rowData = [[]] : void 0;
            var days = v.instance.timeData.day.length;//页面显示天数总长度
            // var cell = window.document.getElementById('monitoringWidth').offsetWidth/v.instance.dateData.day.length;//单格宽度
            plan.grid = [];
            for (var i = 0; i < plan.row; i++) {
                plan.grid.push([]);
                for (var a = 0; a < days; a++) {
                    plan.grid[i].push({ type: 'none', id: null, width: 1 });
                }
            }
            plan.rowData.forEach(function (row, index) {

                row.forEach(function (order) {
                    if (order) {
                        var l = getDaysIndex(order.ask_start_time);
                        var r = getDaysIndex(order.ask_end_time);
                        if (l == r) {
                            plan.grid[index][l] = { type: (order.order_state || ""), id: (order.order_id || null), width: 1 };
                        } else {
                            plan.grid[index][l] = { type: (order.order_state || ""), id: (order.order_id || null), width: (r - l) };
                        }
                    }
                })

            })

            plan.grid.forEach(function (row, index) {
                row.forEach(function (item, index2) {
                    if (item.width > 1) {
                        row.splice(index2 + 1, item.width);
                        // item.width = (item.width + 1) + " 0 " + (item.width + "px");
                        item.width = (item.width + 1) + " 0 " + (item.width + "px");
                    }
                })
            })

        })
        return data;
    }
    function getDaysIndex(num) {
        return Number(num.toString().substring(6, 8)) - 1
    }

    var arr = data.map(function (plan) {
        return plan.freq_cycle ? dayOrderDataToRow(plan) : orderDataToRow(orderDataFilter(plan));
    })
    return rowDataTransform(arr);
}