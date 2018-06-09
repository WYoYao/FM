// 将时间对象修正为每一天的第一秒,day为true则顺带修正为第一天
function dateTrim(date,day){
    day ? date.setDate(1) : void 0;
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}
// 修改中心月  type分为last,next两种情况
function getCenterMonth(num,type){
    var date = new Date(num);
    date = dateTrim(date,true);    
    var a = date.getMonth();
    if(type == 'last'){
        date.setMonth(a - 1);
    }else{
        date.setMonth(a + 1);
    }
    return date.getTime();
}
// 获取该月及上一个月的天数
function getThisAndLastMonthDays(num,type){
    var a = dateTrim(new Date(num),true);    
    var month = a.getMonth();
    a.setDate(0);
    var last = a.getDate();
    a = dateTrim(a,true)
    a.setMonth(month + 1);
    a.setDate(0);
    var now = a.getDate();
    if(type){
        return now
    }else{
        return {last:last,this:now}
    }
}

// 数据处理流程控制
function dataControll(data){
// 在流程控制函数中将数据分割为计划粒度，根据计划类型处理计划数据
// 第一轮筛选出在界面显示的工单并对其开始和结束时间进行切割
// 第二轮将工单进行分行处理，将work_orders数据转换为row数据
// 第三轮将分行的工单数据转换为基于单元格子的数据
// 日计划类型因为工单长度为基础长度，所以不需要第一轮处理，但开始和结束日期必须处于页面显示日期之内

    // 日工单数据转行数据
    function dayOrderDataToRow(plan){
        var len = plan.max_freq_num;
        var arr = [];
        for(var i=0;i<len;i++){arr.push([])};
        plan.work_order_date.forEach(function(day){
            for(var i=0;i<len;i++){
                if(day.work_orders[i]){

                    // 5.30 已确认日工单不可跨日，在此进行一次覆盖，修改该工单日期为计划日期
                    day.work_orders[i].ask_start_time = day.date + "000000";
                    day.work_orders[i].ask_end_time = day.work_orders[i].ask_start_time;


                    arr[i].push(day.work_orders[i]);
                }
            }
        })
        plan.rowData = arr;
        plan.row = len;
        return plan;
    }

    // 非日计划类型工单筛选与日期预处理
    function orderDataFilter(plan){
        var that = v._instance;
        var orderGather = plan.work_orders.map(function(order){
            if((that.dateData.startTime < order.ask_start_time && order.ask_start_time < that.dateData.endTime) || (that.dateData.startTime < order.ask_end_time && order.ask_end_time < that.dateData.endTime)){
                order.ask_start_time = order.ask_start_time > that.dateData.startTime ? order.ask_start_time : that.dateData.startTime;
                order.ask_end_time   = order.ask_end_time > that.dateData.endTime ? that.dateData.endTime : order.ask_end_time;
                return order
            }
        })
        plan.work_orders = orderGather;
        return plan;
    }

    // 非日计划类型工单数据转行数据
    function orderDataToRow(plan){
        var row = 0;
        // 行数据
        var rowData = [];
        // 上一次工单结束时间
        var lastEndTime = 0;
        plan.work_orders.forEach(function(order){
            if(order){
                if(order.ask_start_time <= lastEndTime){
                    // 如果工单开始时间小于等于上一条工单的结束时间,行数加一
                    row ++;
                    // 新建一行数据并推入行数据
                    var a = [order];
                    rowData.push(a);
                }else{
                    // 如果工单开始时间大于上一条工单的结束时间,则行数不变,将行数据最后一行取出推入该数据
                    var a = rowData.pop();
                    // 如果之前行数据为空则推入第一行数据
                    if(a == undefined){
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
    function rowDataTransform(data){
        
        var days = v.instance.dateData.day.length;//页面显示天数总长度
        // var cell = window.document.getElementById('getCellWidth').offsetWidth/v.instance.dateData.day.length;//单格宽度
        var cell = (window.document.getElementById('getCellWidth').offsetWidth - v.instance.dateData.day.length + 1)/v.instance.dateData.day.length;//单格宽度
    
        data.forEach(function(plan){
    
            // 无工单计划补足
            plan.row == 0 ? plan.row = 1 : void 0;
            plan.rowData == [] ? plan.rowData = [[]] : void 0;
            plan.grid = [];
    
            for(var i=0;i<plan.row;i++){
                plan.grid.push([]);
                for(var a=0;a<days;a++){
                    plan.grid[i].push({type:null,id:null,width:1});
                }
            }
    
            plan.rowData.forEach(function(row,index){
                row.forEach(function(order){ 
                    if(order && order.ask_start_time && order.ask_end_time){
                        var l = getDaysIndex(numToObj(order.ask_start_time));
                        var r = getDaysIndex(numToObj(order.ask_end_time));
                        if(l == r){
                            // 没有order_state则为is_next_order，将其状态置为""
                            plan.grid[index][l] = {
                                type:order.order_state || (order.is_next_order ? '' : null),
                                id:order.order_id || null,
                                width:1
                            };
                        }else{
                            plan.grid[index][l] = {
                                type:order.order_state || (order.is_next_order ? '' : null),
                                id:order.order_id || null,
                                width:r-l
                            };
                        }
                    }   
                })
            })
    
            plan.grid.forEach(function(row){
                row.forEach(function(grid,index){
                    if(Number(grid.width) === 1){
                        grid.width = cell; 
                    }else{
                        row.splice(index + 1,(grid.width));
                        grid.width = (grid.width + 1)*cell + grid.width;
                    }
                    (row[index + 1]) || (grid.width = grid.width - 1);
                })
            })
    
        })
    
        return data;
    }

    function getDaysIndex(obj){
        var time = JSON.parse(JSON.stringify(v.instance.dateData));
        // var min = numToObj(time.startTime);
        // var max = numToObj(time.endTime);
        // var mid = {m:new Date(v.instance.centerMonth).getMonth() + 1,d:time.day.length - 4};
        // if(obj.m == min.m){
        //     a = obj.d == min.d ? 0 : 1;
        // }else if(obj.m == mid.m){
        //     a = 1 + obj.d;
        // }else{
        //     a = 1 + mid.d + (obj.d == max.d ? 2 : 1);
        // }
        // return a;
        return obj.d - 1;
    }

    function numToObj(num){
        return {
            m: Number(num.substring(4,6)),
            d: Number(num.substring(6,8))
        }
    }

    var arr = data.map(function(plan){
        return plan.freq_cycle == 'd' ? dayOrderDataToRow(plan) : orderDataToRow(orderDataFilter(plan));
    })

    return rowDataTransform(arr);
    
}