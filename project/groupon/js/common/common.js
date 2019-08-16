;var groupBase = {
    /* 
    *dat:{
    *   JsonpName:string,    //jsop情况下回调函数 string
    *   Url:string,         //请求地址string
    *   RequestData:{},      //请求数据-{}
    *   BeforeSend:function, //请求之前方法-function
    *   Callback:function,   //请求成功回调方法-function
    *   Param:{},            //设置回调函数中需要的参数{}
    *   dataType:'jsonp'
    *}
    */
    getAjax:function(dat){
        /* _d:传递给callback方法中需要的数据*/
        /* _d:{data:"请求响应的信息",Param:"特殊参数"}*/
        var _d={};_d.data=undefined;
        try{
            var _ajax = $.ajax({
                type:'get',
                url:dat.Url,
                data:dat.RequestData||{},
                dataType:dat.dataType||'jsonp',
                jsonpName:dat.JsonpName||'',
                jsonpCallback:dat.JsonpName||'',
                timeout:5000,
                beforeSend:function(){
                    if(dat.BeforeSend){
                        dat.BeforeSend.apply();
                    }
                },
                success:function(data){
                    _d.data=data;
                    if(dat.Param)_d.Param=dat.Param;
                    if(dat.Callback){
                        dat.Callback.apply(_d);
                    }
                },
                error:function(req,error){
                    if(dat.errorCallback){
                        dat.errorCallback();
                    }
                //console.log(error)
                },
                complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                    if(status=='timeout'){//超时,status还有success,error等值的情况
                     _ajax.abort(); //取消请求
                    }
                }
            });
        }catch(ex){};
    },
    /*弹出框提示语*/
    bombBox:function(msg){
        var html='<div id="shade"></div><div id="layer">'+
            '<div class="pop-header">'+
            '<span class="tip"> 提示</span>'+
            '<a class="close" >关闭</a>'+
            '</div>'+
            '<div class="popup-contain">'+
            '<p> '+msg+'</p>'+
            '</div>'+
            '</div>';

        $(document.body).append(html);
        var documentHeight=$(document).height();
        $('#shade').css({"height":documentHeight});
        $(document.body).on('click','#layer .close',function(){
            $('#shade').remove();
            $('#layer').remove();
        });
    }

};
;$(function(){
    var tuanSite="//tuan"+cookieDomain;
    var ie6 = $.browser.msie && $.browser.version == "6.0";
    var ssSite="//ss"+cookieDomain;
    //ie6下处理真划算分类背景问题
    if(ie6){
        $(".group-category-list").css({'background':'#000', 'opacity':'0.8', 'filter':'alpha(opacity=80)'});
    }
    //真划算左侧分类hover效果
    $(".group-category-box .all-category").bind({
        "mouseenter":function(){
            $(this).find(".group-category-list").show();
        },
        "mouseleave":function(){
            $(this).find(".group-category-list").hide();
        }
    });
    //窗口变化的时候
    resizeloadFn();
    $(window).on('resize',function(){
        resizeloadFn();
    });
    //窗口变化的时候,处理大小屏的兼容问题
    function resizeloadFn(){
        var windowWidth=$(window).width();
        var hasW1000=$('body').hasClass('w1000');
        if(hasW1000){
            if(windowWidth<=1000){
                $('.group-category-box').css({"width":"1000px"});
                $('.group-all-box').css({"width":"1000px"});
                $('#gome-foot').css({"width":"1000px"});
                $('.group-solid-box').css({"width":"1000px"});
                $('.group-solider').css({"min-width":"1000px"});
            }else{
                $('.group-category-box').css({"width":windowWidth});
                $('.group-all-box').css({"width":windowWidth});
                $('#gome-foot').css({"width":windowWidth});
                $('.group-solid-box').css({"width":windowWidth});
                $('.group-solider').css({"min-width":windowWidth});
            }
        }else{
            if(windowWidth<=1200){
                $('.group-category-box').css({"width":"1200px"});
                $('.group-all-box').css({"width":"1200px"});
                $('#gome-foot').css({"width":"1200px"});
            }else{
                $('.group-category-box').css({"width":"100%"});
                $('.group-all-box').css({"width":"100%"});
                $('#gome-foot').css({"width":"100%"});
            }
        }
    }
    /*搜索框*/
    function search(){
        var question = $.trim($("#question").val());
        if (question != "" && question != "请输入真划算商品名称") {
            location.href = tuanSite+"/groupon/searchkey?key=" + encodeURIComponent(question);
        } else {
            $('#question').val("请输入真划算商品名称").css('color', '#C00');
            setTimeout(function () {
                $('#question').css('color', '#5E5E5E').val('').focus().blur();
            }, 300);
        }
    }
    $('.group-search-btn').on('click',function(){
        search();
    });
    $('#question').keydown(function (evt) {
        if (evt.keyCode == 13) {
            search();
        }
    });
    /*图片懒加载*/
    var interVal = setInterval(function(){
        var max_height = $(window).scrollTop() + $(window).height() +300;
        var min_height = $(window).scrollTop()-300;
$("body img[gome-src]:not(.code-sm img[gome-src],#productDesc img[gome-src],.tc .qrcode_img[gome-src], #J_vipGoodsList .goods-list-ul img[gome-src], #gome-aside-app-code img[gome-src])").each(function(){//底部二维码hover效果不需要提前加载图片
            var _self = $(this);
                _offsetTop = _self.offset().top;
            if(_offsetTop!=0 && _offsetTop <= max_height && _offsetTop > min_height &&  _self.attr("gome-src")!=""){
                var _imgSrc = _self.attr("gome-src");
                _self.attr("src",_imgSrc);
                _self.attr("gome-src","");
            }   
        })
    },500);
    /*placeholder ie支持*/
    if(!("placeholder" in document.createElement("input"))){
        $(".ele-input").each(function(){
            var ph = $(this).attr("placeholder"),
                 type = $(this).attr("type");
            if(type=="password"){
                $(this).parent().append("<span class='ie-ph'>"+ph+"</span>");
                $(this).focus(function(){
                    $(this).siblings('.ie-ph').hide();
                });
                $(this).blur(function(){
                    if(this.value==''){
                        $(this).siblings('.ie-ph').show();
                    }
                });
                $('.inpl-wrap').on("click",".ie-ph",function(){
                    $(this).siblings('.inp-text').focus();
                });
            }else{
                $(this).val(ph);
                this.onfocus = function(){
                    if(this.value === ph){
                        this.value = "";
                        this.style.color = '';
                    }
                };
                this.onblur = function(){
                    if(this.value === ""){
                        this.value = ph;
                        this.style.color = '#999';
                    }
                }
                this.style.color = '#999';
            }
        });
    }
});