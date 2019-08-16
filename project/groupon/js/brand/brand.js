
/**
 * 【品牌团页】
 * author wanghonglan@yolo24.com
 * time 2016-07-29
 */

$(function (){
    function BrandPage(){
        this.init();
    }
    BrandPage.prototype = {
        init: function(){
            //渲染右导航,处理最后一个右侧导航的样式问题
            var fixedStr = '';
            $('.group-wbox h2').each(function (i){
                var $this = $(this);
                var lastClass = $('.group-wbox h2').length == (i+1) ? ' last' : '';
                fixedStr += '<li class="handler'+lastClass+'">'+$this.text()+'</li>';
            })
            $('#J_rightFixed .gm-floor').append(fixedStr); 
            this.bindEvent();
        },
        // 右侧导航滑动效果实现
        bindEvent: function (){
            var $rightFixed = $("#J_rightFixed");
            $('body').elevator({
                floorClass: "group-floor",
                elevatorClass: "right-fixed",
                handlerClass: "handler",
                selectClass: "current",
                delay: 1200,
                easing: "easeOutCirc",
                onStart: function() {},
                onEnd: function(a) {}
            })

            if($('#group-solid').text() != ''){
                $(window).on('scroll', function() {
                    var scrollTop = $(window).scrollTop();
                    if(scrollTop>350){
                        $rightFixed.removeClass('default');
                    }else{
                        $('li', $rightFixed).eq(0).addClass('current');
                        $rightFixed.addClass('default');
                    }
                })
            }
        }
    }
    new BrandPage();
});