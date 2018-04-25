console.log(
    [
        {
            name: "大于",
            code: "gt",
        }, {
            name: "大于等于",
            code: "gte",
        }, {
            name: "小于",
            code: "lt",
        }, {
            name: "小于等于",
            code: "lte",
        }].map(function (item) {
            var o = {};
            o[item.code] = item.name;
            return o;
        }).reduce(function (con, params) {
            return Object.assign({}, con, params)


        }, {}))