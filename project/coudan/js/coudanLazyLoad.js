/**
 * 延时加载操作
 * 1、页面图片 定时1s 加载可视区域图片
 * 2、批量价格异步获取：* 1)、url:http://ss.gome.com.cn/item/v1/extra/command/detail/{pid}-{skuid},{pid}-{skuid},{pid}-{skuid}/{二级区域id}/flag/item/{回调callbackname}
 *        2)、itemType：获取的价格类型
 *        3)、doItemHerf：根据不同类型，设置跳转链接
 */

   // var lazyloadfn=function(){   
        var itemType = {
            GOMEPRICE:"normal",
            SALEPRICE:"normal",
            AREAPRICE:"normal",
            AREASALEPRICE:"normal",
            TUANPRICE:"tuanqiang",
            RUSHBUYPRICE:"tuanqiang"
        };
        var tur = true;
       // var arr=[];
        //接口请求成功渲染
        function doItemHerf(data,itemBox){
            var _data = data.result;
                if(_data.length >0){
                    $.each(_data,function(i,datalists){  
                        for(var m in datalists){

                            itemBox.each(function(index,item){
                                if($(item).find(".item-tab-warp").attr('pidandsid') == datalists["product-sku"] && $(item).attr("already") !="true"){
                                                                     
                                    var _url = "//item"+cookieDomain+"/"+datalists["product-sku"]+".html",
                                    _hash = "",
                                    _propTag = "";
                                    if(datalists.priceType==undefined || itemType[datalists.priceType]=="normal"){
                                        //_url = "//item"+cookieDomain+"/"+datalists.productId+"-"+datalists.skuId+".html";
                                        _hash = "#gm-other-info";
                                    }else if(itemType[datalists.priceType]=="tuanqiang"){
                                        _hash = "#j-comment-section";
                                        var addCart = $(item).find(".addCart");
                                        var dataCode= addCart.attr('data-code');
                                        addCart.undelegate().replaceWith('<a class="add-cart" href="'+_url+'" data-code="'+dataCode+'" target="_blank" track="产品列表真划算"><span class="carticon"></span><span>加入购物车</span></a>');
                                        _propTag='<span class="promotion-normal">真划算</span>';
                                    }
                                   // alert(_url)
                                    var oPrice =datalists.price?"¥"+datalists.price:"暂无售价";
                                    $(item).find(".item-price").html('<span class="price">'+oPrice+'</span>'+_propTag);  
                                    $(item).find(".item-link").attr("href",_url);
                                    $(item).find(".comment").attr("href",_url+_hash);
                                    $(item).attr("already",true);
                                    
                                }
                            })
                            
                        }
                    })
                }
        };
        //判断元素是否在可视区内
        function getScreenDom(focusDom){
            var screenAreaTop = $(document).scrollTop();
            var screenAreaBottom = $(document).scrollTop()+$(window).height();
            return $(focusDom).filter(function(){            
                var _h = $(this).offset().top;  //获取当前元素到文档顶端的距离
                if(_h >= screenAreaTop-340 && _h<=screenAreaBottom && !$(this).data("success")){
                    $(this).data("success",true);
                    return true;
                }
                return false;
            });          
        };
               
        //获取可视区内元素并发请求
        function eachScreenDom(ele){
            var _this = this;
            var itemString =getScreenDom(ele);
            var arr=[];
            if(itemString.length>0){
                itemString.each(function(){
                    var $this=$(this);
                    if($this.attr("already") != "true"){
                        var prdid = $this.find(".item-tab-warp").attr("pidandsid");
                        arr.push(prdid);                       
                    } 
                }) ;
            };           
           // console.log(arr)
            if(arr.length>0){
                var strmesg =arr.join(',');
                getpracefn(strmesg,itemString);                  
            }          
            
        };
        //请求价格接口
        function getpracefn(prddata,ele){
            ele.find("img").each(function(i,items){
                if ($(items).attr("gome-src")) {
                    $(items).attr("src", $(items).attr("gome-src")).removeAttr("gome-src");
                }
            });
            var _index = new Date().getTime();
            $.ajax({
                type: "get",
                url: "//ss"+cookieDomain+"/item/v1/extra/command/details/"+prddata+"/"+bdarea_2+"/flag/item/fn"+_index,
                jsonpCallback: "fn"+_index,
                dataType: "jsonp",
                success: function(data) {
                    if(data && data.success){
                        doItemHerf(data,ele);  
                        tur = true;
                    }
                }
            });  

        }   
        //页面滚到时触发            
        $(window).scroll(function(){   
            // console.log(tur)                          
            if(tur){
                //clearTimeout(timer);
                
                setInterval(function(){
                    eachScreenDom($("#product-box li"));
                    
                },1000);
                //tur = false; 
            }
        });
    //}
