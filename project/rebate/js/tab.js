;(function($,window,document,undefined) {
    //定义Slider的构造函数
    var floorTab = function(ele, opt) {
        this.$element = ele,
            this.defaults = {
                content: '.ct',
                tab:'.tab',
                item: '.main_warp .main',
                next:'.page_slider',
                nav:'.tab li',
                cur:'cur',
                event: null,
                delayTime: 150,
                endFun: null,
                tabItemLoadAttr:"tab-data-load"
            },
            this.options = $.extend({}, this.defaults, opt);
    };
    //定义Slider的方法
    floorTab.prototype = {
        init: function() {
            var _this=this;
            this.content=$(this.options.content);
            this.item=$(this.options.content).find(this.options.item);
            this.next=$(this.options.content).find(this.options.next);
            this.nav=$(this.options.content).find(this.options.nav);
            this.itemsLoadAttr = (this.options.tabItemLoadAttr);
            this.tab=$(this.options.content).find(this.options.tab);
            this.color=$(this.options.content).find('.tab').attr('hcolor');
            this.cur=this.options.cur;
            this.endFun=this.options.endFun;
            this.index=0;
            this.event=this.options.event;
            this.timer=null;
            _this.NexFn();
            _this.tabFn();
        },
        itemFn: function(index){
            this.content.lazyload({
                source: "data-lazy-img"
            });
            if(this.event=='click'){this.nav.eq(2).attr('data','1');}
            this.nav.eq(index).addClass(this.cur).siblings().removeClass(this.cur);
            this.item.eq(index).css('display','block').siblings('ul').css('display','none');

            if(this.event!='click'){
                 "function" == typeof this.endFun && this.endFun(this.item.eq( index ),this.nav.eq(index).attr('data'));
            } else{
                (this.item.eq( index).html()=='') && index!=0 && 0 == this.item.eq( index ).attr(this.itemsLoadAttr) && "function" == typeof this.endFun && this.endFun(this.item.eq( index ),this.nav.eq(index).attr('data'));
            }
        },
        NexFn: function(){
            var _this=this;
            this.next && this.next.bind('click',function(){
                _this.index++;
                if(_this.index>=_this.item.length){
                    _this.index=0;
                }
                _this.itemFn(_this.index);
            })
        },
        tabFn: function(){
            var _this=this,hoverTimer;
            if(this.event=='click'){

                $.each(this.nav,function(i,v){
                    $(this).bind('click',function(){
                        var thiz=$(this);
                        if(i!=2){
                            _this.index=thiz.index();
                            var spanup= _this.nav.eq(2).find('span').attr('class');
                            if(spanup=='down'){
                                _this.nav.eq(2).find('span').removeClass('down').addClass('up');
                            }
                            _this.item.eq(2).html('');
                            _this.itemFn(_this.index);
                        }
                        $("html,body").stop().animate({scrollTop:$(".title_wrap").offset().top},200);
                    })
                })

            }else{

                this.nav.hover(function(){
                    _this.index=$(this).index();
                    hoverTimer = setTimeout(function() {
                        _this.itemFn(_this.index);
                    },200);
                },function(){
                    clearTimeout(hoverTimer);
                })
            }


        }
    }
    //在插件中使用Slider对象
    $.fn.floorTab = function(options) {
        //创建Slider的实体
        var floortab  = new floorTab(this, options);
        //调用其方法
        return floortab.init();
    }
})(jQuery,window,document);


