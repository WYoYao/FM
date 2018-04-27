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
    }, {})
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


var aite_controller = createController([
    {
        // 查询建筑
        name: "Build",
        url: "restObjectService/queryBuild",
        argu: {},
        convert: addSelected
    },
    {
        // 查询楼层
        name: "Floor",
        url: "restObjectService/queryFloor",
        argu: { need_back_parents: true },
        convert: addSelected
    },
    {
        // 查询房间
        name: "Room",
        url: "restObjectService/queryFloor",
        argu: { need_back_parents: true }
    },
    {
        // 查询空间
        name: "Space",
        url: "restObjectService/querySpace",
        argu: { need_back_parents: true },
        convert: addSelected
    },
    {
        //  查询系统
        name: "System",
        url: "restObjectService/querySystem",
        argu: { need_back_parents: true },
        convert: addSelected
    },
    {
        //  查询设备 需要查询空间树
        name: "BuildFloorSpaceTree",
        url: "restObjectService/queryBuildFloorSpaceTree",
        argu: { dict_type: "domain_require" }
    },
    {
        //  查询设备 需要查询查询设备专业
        name: "GeneralDict",
        url: "restGeneralDictService/queryGeneralDictByKey",
        argu: { dict_type: "domain_require" }
    },
    {
        //  查询设备专业系统
        name: "GeneralSystem",
        url: "restObjectService/querySystemForSystemDomain",
    },
    {
        //  查询设备
        name: "EquipList",
        url: "restObjectService/queryEquip",
        argu: { need_back_parents: true },
        convert: addSelected
    },
    {
        //  查询部件 
        name: "Part",
        url: "restObjectService/queryTempObjectList",
        argu: { obj_type: "2" },
        convert: addSelected
    },
    {
        //  查询工具
        name: "Tool",
        url: "restObjectService/queryTempObjectList",
        argu: { obj_type: "3" },
        convert: addSelected
    },
    {
        //  检查自定义是否存在
        name: "Exist",
        url: "restObjectService/existTempObjectWithType",
        argu: {},
    },
    {
        //  保存自定义
        name: "Add",
        url: "restObjectService/addTempObjectWithType",
        argu: {},
    },
    {
        //  根据关键字查詢
        name: "searchObject",
        url: "restObjectService/searchObject",
        argu: {},
        convert: addSelected
    },
], {}
);

