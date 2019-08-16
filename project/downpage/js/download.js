// JavaScript Document
var appdown= {
    init: function () {
        this.slideDomcss();//初始化样式
        this.judgeScreen();
        this.pageScroll();//满屏滚动
        this.appWindow(); //点击弹出下载框
        this.getTabs();   //tab
        this.getBtn();  //翻页按钮
    },
    slideDomcss:function(){//初始化样式
        $(".aslide").each(function(ind, elem){
            var slidenum = $(this).attr("aslide").split(",");
            if (slidenum[0] == "left") {
                $(this).attr({"recode":parseInt($(this).css("left"))});
            } else if (slidenum[0] == "right") {
                $(this).attr({"recode":parseInt($(this).css("right"))});
            } else if (slidenum[0] == "top") {
                $(this).attr({"recode":parseInt($(this).css("top"))});
            } else {
                $(this).attr({"recode":parseInt($(this).css("bottom"))});
            }
        });
    },
    appWindow:function(){
        var _this=this;
        $('.js-app-down').bind('click',function(){
            $('.js-code-btn li').eq(0).addClass('cur').siblings().removeClass('cur');
            $('.js-code-box').children().eq(0).css({display:'block'}).siblings().css({display:'none'});
            $('#code').center();
            $('#goodcover').show();
            $('#code').fadeIn();
        });
        $('.js-appNav ul li').each(function(){
            $(this).click(function(){
                var index = $(this).index();
                $('.js-code-btn li').eq(index).addClass('cur').siblings().removeClass('cur');
                $('.js-code-box').children().eq(index).css({display:'block'}).siblings().css({display:'none'});
                $('#code').center();
                $('#goodcover').show();
                $('#code').fadeIn();
            });
        });
        $('#closebt').click(function() {
            $('#code').hide();
            $('#goodcover').hide();
        });
        $('#goodcover').click(function() {
            $('#code').hide();
            $('#goodcover').hide();
        });
        $(".closed").click(function(){
            _this.hideCloseBtn();
        })
        $(".appDowns").click(function(){            
            $('#webChatPop').center();
            $('#goodcover').show();
            $("#webChatPop").show();
            $("#webChatPop").fadeIn()
        })

        jQuery.fn.center = function(loaded) {
            var obj = this;
            body_width = parseInt($(window).width());
            body_height = parseInt($(window).height());
            block_width = parseInt(obj.width());
            block_height = parseInt(obj.height());

            left_position = parseInt((body_width / 2) - (block_width / 2) + $(window).scrollLeft());
            if (body_width < block_width) {
                left_position = 0 + $(window).scrollLeft();
            };

            top_position = parseInt((body_height / 2) - (block_height / 2) + $(window).scrollTop());
            if (body_height < block_height) {
                top_position = 0 + $(window).scrollTop();
            };

            if (!loaded) {

                obj.css({
                    'position': 'absolute'
                });
                obj.css({
                    'top': ($(window).height() - $('#code').height()) * 0.5,
                    'left': left_position
                });
                $(window).bind('resize', function() {
                    obj.center(!loaded);
                });
                $(window).bind('scroll', function() {
                    obj.center(!loaded);
                });

            } else {
                obj.stop();
                obj.css({
                    'position': 'absolute'
                });
                obj.animate({
                    'top': top_position
                }, 200, 'linear');
            }
        }
    },
    hideCloseBtn:function(){
            var _this = this;
            $("#webChatPop,#goodcover").hide();
    },
    getTabs:function(){
        $('.code_down').gTabs({ btnID: "#code_btn", boxID: "#code_box", bind: 'hover', hide: 1, gomesrc: 0 });
        $('.webChatdown').gTabs({ btnID: "#webChatBtn", boxID: "#webChatbox", bind: 'hover', hide: 1, gomesrc: 0 });
    },
    getBtn:function() { //翻页按钮
        $('.js-sliderIcon').bind('click',function(event) {
            $('#downapp .section').each(function(){
               if($(this).attr('class').indexOf('active') > -1){
                   if($(this).index() < 6){
                       window.location.href = window.location.href.split('#')[0]+'#page'+($(this).index()+2);
                   }else{
                       window.location.href = window.location.href.split('#')[0]+'#page'+1;
                   }
               }
            });

        });
    },
    pageScroll: function () {//满屏滚动
        var _this = this;
        $('#downapp').fullpage({
            afterRender: function () {
                _this.pageAnimate.domSlidein(".section1");
                _this.pageAnimate.domFadein(".section1")
            },
            sectionsColor: ['#ffffd6', '#ffffd6', '#ffffd6', '#ffffd6', '#ffffd6',"#ffffd6"],
            navinavigation: true,
            resize:true,
            afterLoad: function (anchorLink, index) {
                if (index == 1) {
                    _this.pageAnimate.domSlidein(".section1");
                    _this.pageAnimate.domFadein(".section1");
                    _this.headScroll.headBackin();
                    $(".sliderIcon").fadeIn(0);                  
                }
                if (index == 2) {                   
                    _this.pageAnimate.domSlidein(".section2");
                    _this.pageAnimate.domFadein(".section2");
                    _this.headScroll.headBackout();
                    $(".sliderIcon,.contrail1").fadeIn(0);
                    _this.tweenMax(".app_describeTwo .fire",{right:220,top:223},{right:220,top:375},{css:{rotation:0},ease:"easeInExpo"},{right:850,top:375},{css:{rotation:-90,ease:"easeOutQuart"}},{top:527,right:855});               
                    _this.hideCloseBtn();
                }
                if (index == 3) {
                    _this.pageAnimate.domFadein(".section3");
                    _this.pageAnimate.domSlidein(".section3");
                    _this.headScroll.headBackout();
                    $(".sliderIcon,.contrail1,.contrail2").fadeIn(0);
                    _this.tweenMax(".app_three .fire",{left:232,top:236},{left:232,top:356},{css:{rotation:-180}},{left:845,top:356},{css:{rotation:-90}},{left:845,top:500});;   
                    _this.hideCloseBtn();
                }
                if (index == 4) {
                    _this.pageAnimate.domFadein(".section4");
                    _this.pageAnimate.domSlidein(".section4");
                    _this.headScroll.headBackout();
                    $(".sliderIcon,.contrail2,.contrail3").fadeIn(0);  
                    _this.tweenMax(".app_describeFour .fire",{right:131,top:240},{right:131,top:300},{css:{rotation:0}},{right:780,top: 300},{css:{rotation:-90}},{right:808,top: 414});                
                    _this.hideCloseBtn();
                }
                if (index == 5) {
                    _this.pageAnimate.domFadein(".section5");
                    _this.pageAnimate.domSlidein(".section5");
                    _this.headScroll.headBackout();
                    $(".sliderIcon,.contrail3,.contrail4").fadeIn(0);
                    _this.tweenMax(".app_five .fire",{left:198,top:200},{left:238,top:320},{css:{rotation:-180}},{left:840,top: 320},{css:{rotation:-90}},{left:852,top: 485});
                    _this.hideCloseBtn();
                }

                if(index == 6){
                    _this.pageAnimate.domFadein(".section6");
                    _this.pageAnimate.domSlidein(".section6");
                    _this.headScroll.headBackout();
                    $(".sliderIcon,.contrail4").fadeIn(0);
                    _this.hideCloseBtn(); 
                }
                if(index==7){
                     $(".sliderIcon").fadeOut(0);
                     _this.hideCloseBtn();
                }
            },
            onLeave: function (index, nextIndex ,direction) {
                if(nextIndex%2==0){
                    $("#fp-nav").addClass("evenActive");
                    $(".sliderIcon").addClass("sliderDown");                   
                }else{
                    $("#fp-nav").removeClass("evenActive");
                    $(".sliderIcon").removeClass("sliderDown");
                }
                if (index == 1) {
                    _this.pageAnimate.domFadeout(".section1");
                    _this.pageAnimate.domSlideout(".section1");
                }
                if (index == 2) {
                    _this.pageAnimate.domFadeout(".section2");
                    _this.pageAnimate.domSlideout(".section2");
                    
                }
                if (index == 3) {
                    _this.pageAnimate.domFadeout(".section3");
                    _this.pageAnimate.domSlideout(".section3");
                    
                }
                if (index == 4) {
                    _this.pageAnimate.domFadeout(".section4");
                    _this.pageAnimate.domSlideout(".section4");
                    
                }
                if (index == 5) {
                    _this.pageAnimate.domFadeout(".section5");
                    _this.pageAnimate.domSlideout(".section5");
                                    
                }
                if(index==6){
                    _this.pageAnimate.domFadeout(".section6");
                    _this.pageAnimate.domSlideout(".section6");
                 
                }
            },
            anchors: ['page1', 'page2', 'page3', 'page4', 'page5','page6',"page7"],
            "navigation": true
        });
    },
    pageAnimate:{
        domFadein: function (dom) {//元素渐出
            var fadeDom = $(dom).find(".fade");
            fadeDom.stop(true, true).animate({"opacity": 1,"filter:alpha(opacity":100+")"}, 2000);
        },
        domFadeout: function (dom) {//元素渐入
            var fadeDom = $(dom).find(".fade");
            fadeDom.stop(true, true).animate({"opacity": 0,"filter:alpha(opacity":0+")"}, 200);
        },
        domSlidein: function (dom) {//滑动淡入
            var slideDom = $(dom).find(".aslide"),distance=0;     
            slideDom.each(function (ind, elem) {
                var slidenum = $(this).attr("aslide").split(",");            
                if (slidenum[0] == "left") {
                    distance=parseInt($(this).attr("recode"))+parseInt(slidenum[1]);
                    $(this).stop(true, true).delay(ind * 300).animate({"left": distance, "opacity": 1,"filter:alpha(opacity":100+")"}, 500, "easeOutExpo");
                } else if (slidenum[0] == "right") {
                    distance=parseInt($(this).attr("recode"))+parseInt(slidenum[1]);
                    $(this).stop(true, true).delay(ind * 300).animate({"right": distance, "opacity": 1,"filter:alpha(opacity":100+")"}, 500, "easeOutExpo");
                } else if (slidenum[0] == "top") {
                    distance=parseInt($(this).attr("recode"))+parseInt(slidenum[1]);
                    $(this).stop(true, true).delay(ind * 300).animate({"top": distance, "opacity": 1,"filter:alpha(opacity":100+")"}, 500, "easeOutExpo");
                } else {
                    distance=parseInt($(this).attr("recode"))+parseInt(slidenum[1]);
                    $(this).stop(true, true).delay(ind * 300).animate({"bottom": distance, "opacity": 1,"filter:alpha(opacity":100+")"}, 500, "easeOutExpo");
                }
            })     
        },
        domSlideout: function (dom) {//滑动淡出
            var slideDom = $(dom).find(".aslide"), len = slideDom.length;
            slideDom.each(function (ind, elem) {
                var slidenum = $(this).attr("aslide").split(","),dislide=$(this).attr("recode");
                if (slidenum[0] == "left") {
                    $(this).stop(true, true).delay((Math.abs(ind - len + 1)) * 500).animate({"left": dislide, "opacity": 0,"filter:alpha(opacity":0+")"}, 800, "easeOutExpo");
                } else if (slidenum[0] == "right") {
                    $(this).stop(true, true).delay((Math.abs(ind - len + 1)) * 500).animate({"right": dislide, "opacity": 0,"filter:alpha(opacity":0+")"}, 800, "easeOutExpo");
                } else if (slidenum[0] == "top") {
                    $(this).stop(true, true).delay((Math.abs(ind - len + 1)) * 500).animate({"top": dislide, "opacity": 0,"filter:alpha(opacity":0+")"}, 800, "easeOutExpo");
                } else {
                    $(this).stop(true, true).delay((Math.abs(ind - len + 1)) * 500).animate({"bottom":dislide, "opacity": 0,"filter:alpha(opacity":0+")"}, 800, "easeOutExpo");
                }
            })
        },
    },
    headScroll: {//顶部滚动
        headBackin:function(){
            $(".appHeader").stop(true,true).animate({"height":120});
            $(".gome-top #gome-top-body").stop(true,true).animate({"height":30})
        },
        headBackout:function(){
            $(".appHeader").stop(true,true).animate({"height":0});
            $(".gome-top #gome-top-body").stop(true,true).animate({"height":0});
        }
    },
    judgeScreen:function(){
        $(".appNav .active").attr({"href":"javascript:void(0)"}).removeAttr("target");
        var curentScreen=$(window).height();//获取当前屏幕高度
        var tops= $(window).height()-$("#gome-foot").outerHeight()-$(".paddingBottom").height();
        $(".topBanner").css({"paddingTop":tops*0.40,"paddingBottom":tops*0.40});
    },
    tweenMax:function(dom,a,b,c,d,e,f){
       var move = new TimelineMax();
            move.from(dom,0.3,a);
            move.to(dom,0.3,b);
            move.to(dom,0.3,c);
            move.to(dom,0.3,d);
            move.to(dom,0.3,e);
            move.to(dom,0.3,f);
    },
}

;(function($, window, document,undefined){
    if(!window.browser){        
        var userAgent = navigator.userAgent.toLowerCase(),uaMatch;
        window.browser = {}
        /**
         * 判断是否为火狐浏览器
         */
        if(!uaMatch){
            uaMatch = userAgent.match(/firefox\/([\d.]+)/);
            if(uaMatch!=null){
             //window.browser['name'] = 'firefox';
			 //window.browser['version'] = uaMatch[1];
				  var tops=($(window).height()-$("#gome-foot").outerHeight()-$(".paddingBottom").height())/2+50;
				  $(".topBanner").css({"paddingTop":tops*0.40,"paddingBottom":tops*0.40});
            }else{
				var tops= $(window).height()-$("#gome-foot").outerHeight()-$(".paddingBottom").height();
				$(".topBanner").css({"paddingTop":tops*0.40,"paddingBottom":tops*0.41});
				
			}
        }
    }
})(jQuery, window, document);



















