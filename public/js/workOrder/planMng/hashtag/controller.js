//  开发环境下绑定的用户信息
var USER = {
    "user_id": "RY1505218031651",
    "customer_id": "",
    "project_id": "Pj1301020001"
}

/**
 * 统一查询接口的类
 * @param {用于创建查询接口的数组} arr 
 * @param {假数据数组} obj
 */
function createController(arr, obj) {

    return arr.reduce(function (con, item) {

        if (con[item.name]) console.error("controller 已有 " + item.name + "方法,请注意合并");

        con[item.name] = function (argu) {

            return new Promise(function (resovle, reject) {

                // 验证是否有假值方法
                if (!_.isUndefined(obj) && obj.hasOwnProperty(item.name)) {

                    setTimeout(() => {

                        resovle(obj[item.name](Object.assign({}, USER, item.argu, argu)));
                    }, _.random(1, 1000));

                } else {


                    // 调用真实接口
                    pajax.post({
                        url: item.url,
                        data: Object.assign({}, USER, item.argu, argu),
                        success: resovle,
                        error: reject,
                        complete: function () { }
                    });
                }
            }).then(function (res) {

                return new Promise(function (resovle) {

                    if (_.isFunction(item.convert)) {
                        resovle(item.convert(res));
                    } else {
                        resovle(res);
                    }
                })
            })
        }
        return con;
    }, _.isPlainObject(controller) ? controller : {})
};

//  给最节点添加 selected 属性
function addSelected(arr) {

    if (!_.isArray(arr)) return arr;

    var own = arguments.callee;

    arr.forEach(function (item) {
        item.selected = false;
        own(item.content);
    });

    return arr;
}


var hashtag_controller = createController([
    {
        // 查询推荐 SOP
        name: "queryRecommendSop",
        url: "restSopService/queryRecommendSop",
        argu: {},
        convert: addSelected
    },
    {
        // 根据搜索的内容查询对应的sop
        name: "querySopListForSel",
        url: "restSopService/querySopListForSel",
        argu: {
            need_return_criteria: true,
        },
        convert: function (res) {
            return {
                criteria: res[0].criteria,
                res: addSelected(res[0].content).map(function (params) {
                    return params;
                })
            }
        }
    },
    // {
    //     //  根据关键字查詢
    //     name: "searchObject",
    //     url: "restObjectService/searchObject",
    //     argu: {},
    //     convert: addSelected
    // },
], {}
);

