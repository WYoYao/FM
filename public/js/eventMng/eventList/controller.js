function createAjax(arr){
    return arr.reduce(function(obj,link){
        if(obj[link.name]){
            console.log(link.name + "链接已存在");
            return
        }
        obj[link.name] = function(argu,success,err,complete){
            pajax.post({
                url: link.url,
                data: Object.assign({},link.argu,argu,PMargu),
                success: success,
                error: function(){
                    $("#globalnotice").pshow({
                        text: "网络错误",
                        state: "failure"
                    })
                    err
                },
                complete: complete
            });
        }
        return obj
    },{})
}

function cteatePromise(arr){
    return arr.reduce(function(obj,link){
        if(obj[link.name]){
            console.log(link.name + "链接已存在");
            return
        }
        obj[link.name] = function(argu){
            return new Promise(function(resolve,reject){
                pajax.post({
                    url: link.url,
                    data: Object.assign({},link.argu,argu,PMargu),
                    success: resolve,
                    error: function(err){
                        $("#globalnotice").pshow({
                            text: "网络错误",
                            state: "failure"
                        })
                        reject();
                    }
                });
            })
        }
        return obj
    },{})
}