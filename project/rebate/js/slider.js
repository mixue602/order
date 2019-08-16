;(function($,window,document,undefined) {
    //定义Slider的构造函数
    var Slider = function(ele, opt) {
        this.$element = ele,
            this.defaults = {
                'content': '.slider',
                'item': 'ul li',
                'prev':'.pre',
                'next':'.nex',
                'nav':'.nav li',
                'cur':'cur',
                'time':5000,
                'auto':false,
                'tab':false
            },
            this.options = $.extend({}, this.defaults, opt);
    };
    //定义Slider的方法
    Slider.prototype = {
        init: function() {
            var _this=this;
            this.content=$(this.options.content);
            this.item=$(this.options.content).find(this.options.item);
            this.prev=$(this.options.content).find(this.options.prev);
            this.next=$(this.options.content).find(this.options.next);
            this.nav=$(this.options.content).find(this.options.nav);
            this.cur=this.options.cur;
            this.auto=this.options.auto;
            this.time=this.options.time;
            this.tab=this.options.tab;
            this.index=0;
            this.timer=null;
            this.length=this.item.length;
            _this.autoFn();
            _this.hoverFn();
            _this.preFn();
            _this.NexFn();
            _this.tabFn();
        },
        hoverFn:function(){
            var _this = this;
            if(this.auto){
                this.content.hover(function(){
                    clearInterval(_this.timer);
                }, function(){
                    clearInterval(_this.timer);
                    _this.timer = setInterval(function(){
                        _this.index++;
                        if(_this.index >= _this.item.length){
                            _this.index = 0;
                        }
                        _this.itemFn(_this.index);
                    }, _this.time);
                })
            }else{
            }
        },
        stopFn: function(){
            var _this=this;
            clearInterval(_this.timer);
        },
        autoFn: function(){
            var _this=this;
            if(this.auto && (_this.length>1)){
                clearInterval(_this.timer);
                this.timer=setInterval(function(){
                    _this.index++;
                    if(_this.index>=_this.length){
                        _this.index=0;
                    }
                    _this.itemFn(_this.index);
                },_this.time);
            }else{}
        },
        itemFn: function(index){
            this.content.lazyload({
                source: "data-lazy-img"
            });
            this.item.eq(index).stop(true, true).fadeIn(500).siblings().stop(true, true).fadeOut(500);
            if(this.tab){
                this.nav.eq(index).addClass(this.cur).siblings().removeClass(this.cur);
            }
        },
        preFn: function(){
            var _this=this;
            this.prev && this.prev.bind('click',function(){
                if(this.auto){
                    clearInterval(_this.timer);
                }
                if(_this.index<=0){
                    _this.index=(_this.item.length);
                }
                _this.index--;
                _this.itemFn(_this.index);

            })
        },
        NexFn: function(){
            var _this=this;
            this.next && this.next.bind('click',function(){
                if(this.auto){
                    clearInterval(_this.timer);
                }
                _this.index++;
                if(_this.index>=_this.item.length){
                    _this.index=0;
                }
                _this.itemFn(_this.index);
            })
        },
        tabFn: function(){
            if(this.tab){
                var _this=this;
                $(this.nav).hover(function(){
                    if(this.auto){
                        clearInterval(_this.timer);
                    }
                    _this.index=$(this).index();
                    _this.itemFn(_this.index);
                },function(){})
            }
        }
    }
    //在插件中使用Slider对象
    $.fn.mySlider = function(options) {
      /*  //创建Slider的实体
        var slider = new Slider(this, options);
        //调用其方法
        return slider.init();*/
        var e;
        return this.each(function () {
            e = new Slider( this, options );
            return e.init()
        }),e;
    }

})(jQuery,window,document);


