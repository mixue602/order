/**
    * @description 根据itemid请求价格状态并渲染页面
    * @method priceStatus.eachScreenDom(ele) ele表示当前屏幕的节点
    * @since 2017-07-03
    * @author dujiahui
    */
var priceStatus = function(){
    /**
    * @description 根据itemid请求商品价格状态等参数
    * @method statusAndprice(itemStr,$this) itemStr商品的itemid $this触发请求的对象
    * @since 2017-06-26
    * @author dujiahui
    */
    this.statusAndprice=function(itemStr,$this){
        var _this = this;
        //获取区域id
        var groupregion = $.cookie('atgregion');
        if (!groupregion) {
            groupregion = "11011400|北京北京市东城区东城区|11010000|11000000|110114001";
        }
        var groupregions = groupregion.split("|"),
            citycode = groupregions[2];
        $.ajax({
            type:"get",
            dataType:"jsonp",
            url:"//ajaxtuan"+cookieDomain+"/cheap/getCheapItemsStatus",
            data:{
                callback:"getCheapItemsStatus",
                itemIds:itemStr,
                areaCode:citycode
            }
        }).done(function(data){
            if(data.message=="SUCCESS" && data.code==200){
                if(data.data && data.data[0]){
                    var result = data.data[0]; 
                    result.cheapPrice = parseFloat(result.cheapPrice).toFixed(2);
                    $this.find(".priceNum").html(result.cheapPrice);
                    if(result.priceDisplay == true){//划线价                    
                        $this.find("del.cost").html("¥"+result.detailPrice);
                    };
                    if(data.data[0].gomePrd==true){
                        $this.find(".prod_info span").show();
                    }
                    if(result.status=="notStarted"){
                        $this.addClass("notS");
                        $this.find(".num").html("精品尖货，敬请关注");
                        $this.find(".prod_price_right a").html("即将开始");
                    }else if(result.status == "ending"){
                        $this.addClass("end");
                        $this.find(".prod_price_right a").html("已结束").attr({"href":"javascript:void(0);","target":"_self"}).css("cursor","default");

                    }else if(result.status == "soldOut"){
                        $this.addClass("sold");
                        $this.find(".prod_price_right a").html("已抢光").attr({"href":"javascript:void(0);","target":"_self"}).css("cursor","default");
                    }
                    $this.find(".sale span").html(result.salePercent);
                    $this.find(".percent span").css("width",result.salePercent+"px");
                    $this.attr("already",true);
                    if($("body").attr("data-page")=="tuankeysearch" || $("body").attr("data-page")=="tuansearch"){//结果页和分类页修改链接
                        $this.find(".item_link").attr("href",result.url);
                        $this.find(".prod_price_right a").attr("href",result.url);
                    }
                }
            }else{
                console.log(data.description);
            }
        }).fail(function(){
            console.log("接口不通");
        })

    };
    /**
    * @description 获取可视区域内的指定元素
    * @method getScreenDom(focusDom) focusDom节点名称
    * @since 2017-05-18
    * @author dujiahui
    */
    this.getScreenDom=function(focusDom){
        var screenAreaTop = $(document).scrollTop();
        var screenAreaBottom = $(document).scrollTop()+$(window).height();
        return $(focusDom).filter(function(){            
            var _h = $(this).offset().top;  //获取当前元素到文档顶端的距离
            if(_h >= screenAreaTop-340 && _h<=screenAreaBottom){
                return true;
            }
            return false;
        });          
    };
    /**
    * @description 模板+数据渲染到指定的元素里的方法
    * @method tplRenderer
    * @param tpl 模板,data 数据,containor 指定元素(必传)
    * @since 2017-05-17
    * @author dujiahui
    */
    this.tplRenderer=function(tpl, data, containor) {
        var tempCompiler = template.compile(tpl),
            data = data || {}
            dataRenderedHtml = tempCompiler(data)
            containor && containor.html(dataRenderedHtml)
            //callback
            $.each(arguments, function(index, args) {
                args instanceof Function && args()
            })
        return dataRenderedHtml
    };
    /**
    * @description 循环当前可视区域内的每个元素，触发获取价格状态的事件
    * @method eachScreenDom(ele) ele 可视区域的节点
    * @since 2017-06-30
    * @author dujiahui
    */
    this.eachScreenDom=function(ele){
        var _this = this;
        var itemString = _this.getScreenDom(ele);
        itemString.each(function(){
            var $this=$(this);
            if($this.attr("already") != "true"){
                var itemStr = $this.attr("itemid");
                if(itemStr){
                    _this.statusAndprice(itemStr,$this);   
                }  
            } 
        }) 
    }

};