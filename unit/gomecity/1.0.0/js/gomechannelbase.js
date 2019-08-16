var GomeCityBase = new Function();
/**
 * [getScreenElements 获取当前屏幕可见对象，静态方法]
 * @param  {[type]}   elements [页面元素]
 * @param  {Function} ofset    [偏移量]
 * @return {[type]}              [返回筛选出来的dom集合]
 */
GomeCityBase.getScreenElements = function(elements,ofset){
    var $windows = $(window);
    var areaBottom = $windows.scrollTop() + $windows.height() +ofset;
    var areaTop = $windows.scrollTop()-ofset;
    return $(elements+":visible").filter(function(){
        var _h = $(this).offset().top;
        if(_h>0 && _h >= areaTop && _h<=areaBottom && !$(this).data("isSuccess")){
            $(this).data("isSuccess",true)
            return true;
        }
        return false;
    })
}
/**
 * [addMethod description]实例添加自定义方法，非公用方法，页面实例单独添加
 * @param {[type]}   name [description]
 * @param {Function} fn   [description]
 */
GomeCityBase.prototype.addMethod = function(name,fn){
    this[name] = fn;
    return this;
}
/**
 * [getJsonp description] 获取jsonp数据，不指定回调方法名。
 * 形式：http://cart.atguat.com.cn/home/api/cart/getCartItemCount
 * @param  {[type]} url       [description]
 * @param  {[type]} parameter [description]
 * @return {[type]}           [返回promise对象，数据格式{isSuccess:true,data:result}]
 */
GomeCityBase.prototype.getJsonp = function(url,parameter){
    return $.Deferred(function(defer){
        $.ajax({
            type:"get",
            dataType:"jsonp",
            url:url,
            data:parameter
         }).success(function(result){
            defer.resolve({isSuccess:true,data:result})
         }).fail(function(jqXHR, textStatus){
            defer.reject({isSuccess:false,data:"Request failed: " + textStatus})
         })
    }).promise()
}
/**
 * [getJsonp_callback description] 获取jsonp数据，指定回调方法名。
 * 形式：http://ss.gome.com.cn/search/v1/price/single/9134181622/1123130163/11010000/flag/item/fn0
 * @param  {[type]} url    [description]
 * @param  {[type]} fnName [description]
 * @return {[type]}        [返回promise对象，数据格式{isSuccess:true,data:result}]
 */
GomeCityBase.prototype.getJsonp_callback = function(url,fnName){
    return $.Deferred(function(defer){
        $.ajax({
            type:"get",
            dataType:"jsonp",
            url:url,
            jsonpName:fnName
         }).success(function(result){
            defer.resolve({isSuccess:true,data:result})
         }).fail(function(jqXHR, textStatus){
            defer.reject({isSuccess:false,data:"Request failed: " + textStatus})
         })
    }).promise()
}

/**
 * [ajaxPriceInit 滚动获取当前窗口价格元素，并获取价格]
 * @param  {[type]} regionId [2级市，默认北京市]
 * @return {[type]}          [description]
 */
GomeCityBase.prototype.ajaxPriceInit = function(regionId){
    var $priceBox = GomeCityBase.getScreenElements(".asynPrice",100),
        priceBoxClass = [],
        _this = this;

    while($priceBox.length > 0) {
        var priceEl;
        if($priceBox.length > 5) {
            priceEl = $priceBox.splice(0,5);
        }else {
            priceEl = $priceBox.splice(0, $priceBox.length);
        }
        priceBoxClass.push(priceEl);
    }

    $.each(priceBoxClass,function(i,elem) {
        var fnname = "fn"+i+ new Date().getTime()+"_"+parseInt(100000000*Math.random()),
            skuid_pid = [],
            priceDom = $(elem);

        $.each(priceDom,function(index,el){
            skuid_pid.push($(el).attr("pid")+'-'+$(el).attr("skuid"));
        });

        $.ajax({
            type:"get",
            url:["//marketapi"+((window.cookieDomain == '.gome.com.cn')?".m"+window.cookieDomain:window.cookieDomain),"goods/getGoodsDynamicInfo"].join("/"),
            dataType:"json",
            data: {
                skuNo: skuid_pid.join(","),
                daId: "DA"+regionId.split("|")[0],
                type: "price",
                source: "pc",
                priceAreaCode: regionId.split("|")[2]
            },
            jsonpCallback:fnname,
            success:function(data){
                if(data && data.data){
                    for (var j = 0; j < priceDom.length; j++) {
                        var _skuid_pid = $(priceDom[j]).attr("pid")+'-'+$(priceDom[j]).attr("skuid");
                        if(data.data[_skuid_pid].price.pcPrice) {
                            $(priceDom[j]).html("¥"+ _this.priceFormat(data.data[_skuid_pid].price.pcPrice));
                        }else {
                            $(priceDom[j]).html("¥"+"暂无售价");
                        }
                    }
                }
            },
            error:function(){
                // for (var j = 0; j < priceDom.length; j++) {
                //     $(priceDom[j]).text("¥"+$(priceDom[j]).attr("price"));
                // }
            }
        })
    })

    return this
}

/**
 * [priceFormat 价格格式化为99.99]
 * @param  {[type]} price [传入价格]
 * @return {[type]}       [string]
 */
GomeCityBase.prototype.priceFormat = function(price) {
    var priceArr = (price + "").split('.');

    if(priceArr.length == 1) {
        return price + '.00';
    }else if(priceArr.length == 2 && priceArr[1].length == 1){
        return price + '0';
    }

    return price;
};

/**
 * [asyncLoadImage 滚动获取当前窗口img元素，加载图片地址]]
 * @return {[type]}          [description]
 */
GomeCityBase.prototype.asyncLoadImage = function(){
    var $img = GomeCityBase.getScreenElements("img",0);
    $.each($img,function(i){
        $(this).attr("src",$(this).attr("gome-src"));
    })
    return this
}
/**
 * [asyncInit 页面有tab切换或者异步加载商品的时候需要触发触发此方法]
 * @return {[type]} [description]
 */
GomeCityBase.prototype.asyncInit = function(regionId){
    return this.ajaxPriceInit(regionId).asyncLoadImage()
}