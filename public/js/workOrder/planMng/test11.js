(function () {
    var _that = v.instance.$refs.baseinfomation;





    //  验证文本框
    if (!$("#plan_name_text").pverifi()) return false;
    if (!$("#aheadCreateTime").pverifi()) return false;
    if (!$("#peoplenumber").pverifi()) return false;
    if (!$("#planRateRig").pverifi()) return false;

    // 验证 工单类型
    if (_that.addWoPlan.order_type) {
        $("#globalnotice").pshow({
            text: '工单类型不能为空',
            state: "failure"
        });
        return false;
    }
    // 验证 下滑栏菜单
    if (_that.addWoPlan.urgency) {
        $("#globalnotice").pshow({
            text: '工单紧急程度不能为空',
            state: "failure"
        });
        return false;
    }
    // 计划频率不能为空
    if (_that.addWoPlan.plan_freq_type) {
        $("#globalnotice").pshow({
            text: '计划频率不能为空',
            state: "failure"
        });
        return false;
    }








})()