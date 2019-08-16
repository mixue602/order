;$.fn.floatAd = function(options){
    var defaults = {
        imgSrc : "", //漂浮图片路径
        secImgSrc: "", //第二张图片路径
        imgdata:"",
        url : "javascript:void(0);", //图片点击跳转页
        speed : 10//漂浮速度 单位毫秒
    };
    var options = $.extend(defaults,options);
    var _target = options.url == "javascript:void(0);" ?  '':"target='_blank'"  ;
    var html = "<div id='float_ad' style='position:absolute;left:0px;top:0px;z-index:1000000;cleat:both;'>"+
                    "<a href='" + options.url + "' " + _target + " data-code='"+options.imgdata+"'><img height='150' width='150' src='" + options.imgSrc + "' border='0' class='float_ad_img' /></a>"+
                    "<a href='javascript:;' id='close_float_ad'></a>"+
                "</div>";
    $('body').append(html);
    function init(){
        var obj=$("#float_ad");
        var OW = obj.width();//当前广告的宽
        var OH = obj.height();//高
        var DW = $(document).width(); //浏览器窗口的宽
        var DH = $(document).height();
        var start = OH+DH;
        
        var win_height = $(window).height();//浏览器宽高
        var win_width = $(window).width();
        var img_height = $(".float_ad_img").height(); //float图片宽高
        var img_width = $(".float_ad_img").width();
        var mid_width = (win_width-img_width)/2;
        var secImgSrc = options.secImgSrc;
       
        //2条路线
        obj.css({"left":0,"top":win_height-img_height}).stop().animate({"left":win_width,"top":200},12000,function(){      //从屏幕左下角飞致屏幕右上200位置
            $('.float_ad_img').attr("src",secImgSrc);    //更换第二章图片
        }).animate({"left":win_width,"top":200},1000).animate({'left':mid_width,'top':300},6000,function(){    //再飞致屏幕中间位置
            var logo_top = $("#logo").offset().top; //必须logo的位置
            var logo_left = $("#logo").offset().left;
           
            obj.animate({"top":logo_top+22,"left":logo_left+30},1000,"swing").find("img").animate({"height":0,"width":0},2000,function(){
                $("#close_float_ad").animate({"height":0,"width":0},1);
            })//飞致logo并缩小
        });
        
        $('#close_float_ad').live('click',function(){
            $('#float_ad').hide();
        })
    }
    init();
}; //floatAd
//调用漂浮插件
var _index_ad_layer = $.cookie('_index_ad_layer');
var _index_float_logo = $.cookie('_index_float_logo');

function startFloatLogo(){
    
    $("body").floatAd({
        imgSrc : floatLogo_0,
        secImgSrc: floatLogo_1,
        imgdata: floatLogo_modelId,
        url:floatLogo_url
        /*lin:arrLins*/
    });
    FLtime.setTime(FLtime.getTime() + (10 * 60 * 1000));
    $.cookie('_index_float_logo', '1', {expires:FLtime, path:'/'});
}
/*if($('body').hasClass('home') && $("#gome-layer-ad").length == 0 && !_index_float_logo && floatLogo){
    startFloatLogo();
}else if($('body').hasClass('home') &&  $("#gome-layer-ad").length > 0 && _index_ad_layer && !_index_float_logo && floatLogo){
    startFloatLogo();
}*/

if($('body').hasClass('home') && _index_ad_layer && !_index_float_logo && floatLogo){
    startFloatLogo();
}
