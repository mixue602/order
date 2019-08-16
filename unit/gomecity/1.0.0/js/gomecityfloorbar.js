/**
 * [description] pargam :触发高度，结束高度，楼层节点，楼层名称，显示位置，不对ie67做兼容处理，隐藏
 * @return {[type]} [description]
 */
;(function($){
    $.fn.cityFloorNav = function(options){

        var _default = {
            pos_s:0,//导航条生成并且开始显示的位置
            pos_e:0,//导航条隐藏的位置
            pos_offset:150,//对应楼层提前多少展示
            floorDom:".floor"//需要设置为楼层的对象
        };

        var _opt = $.extend({},_default,options);
        var _box = this;

        var scrollFn = function(){
            var $floorObj = $(_opt.floorDom);//楼层对象
            var $floorObj_position = [];//存放楼层相对高度，用于滚动高度计算

            var $floorNavHTML = '';//楼层导航条html结构
            var $floorNavBox = null;//楼层导航条对象
            var $floorNavList = null;//楼层导航条具体触发事件对象

            var _isFloorNavEvent = false;//是否为楼层导航条正在滚动
            //设置导航条内容，生成导航条结构
            $floorObj.each(function(){
                if($(this).attr("data-fname")){
                    $floorNavHTML+= '<dd>'+$(this).attr("data-fname").replace("br","<br/>")+'</dd>';
                    $floorObj_position.push($(this).offset().top)
                }
            })

            $floorNavBox = $('<dl class="floorNavBox"><dt class="navHd">楼层导航</dt>'+$floorNavHTML+'<dd class="navToTop"><span></span></dd><dd class="navToBot"><span></span></dd></dl>').appendTo(_box);
            $floorNavBox.css("marginTop",-0.5*$floorNavBox.height());
            //z注册楼层点击事件，点击滚动，滚动条相关事件暂停
            $floorNavList = $floorNavBox.find("dd").bind("click",function(){
                var pos = $floorObj_position[$(this).index()-1];
                _isFloorNavEvent = true;
                if($(this).hasClass("navToTop")){
                    pos=0;
                    $floorNavBox.data("isHide",true).hide();
                    $(this).siblings().removeClass("cur");
                }else if($(this).hasClass("navToBot")){
                    pos=_opt.pos_e
                    $(this).siblings().removeClass("cur");
                }else{
                    $(this).addClass("cur").siblings().removeClass("cur");
                }
                $('html,body').stop(true,false).animate({scrollTop: pos},300,function(){
                    _isFloorNavEvent = false;
                });
            })

            //滚动条事件，显示，隐藏，楼层导航当前楼层高亮
            scrollFn = function(offsetTop){
                if(_isFloorNavEvent) return;
                if(offsetTop<_opt.pos_s || offsetTop>_opt.pos_e){
                    $floorNavBox.data("isHide",true).stop(true,true).fadeOut();
                    return;
                }else{
                    if(!$floorNavBox.data("isHide")){
                        for(var j = $floorObj_position.length-1;j>-1;j--){
                            if(offsetTop>$floorObj_position[j]-_opt.pos_offset){
                                $floorNavList.eq(j).addClass("cur").siblings().removeClass("cur");
                                break;
                            }
                        }
                        return;
                    };
                    $floorNavBox.data("isHide",false).stop(true,true).fadeIn();
                }
            }
        }

        $(window).bind("scroll",function(){
            var _top = $(this).scrollTop();
            scrollFn(_top);
        })
    }
})(jQuery);