seajs.config({base:stageJsServer});
seajs.use(['gmlib/ui/gload/1.0.0/gload.min.js','/js/unit','/js/lazyload','/js/slider','gmlib/ui/getajaxprice/1.0.0/getajaxprice.min.js','gmlib/ui/gtabs/1.0.0/gtabs.min.js'],function(){
    window.setTimeout(function () {
        var editMarks = $("#editModeId").attr("editMark");
        if (editMarks == 1) { //可视化编辑
            seajs.use(['gmlib/unit/gedit/1.0.0/dialogs',
                    'gmlib/unit/gedit/1.0.0/editmode',
                    'gmlib/unit/gedit/1.0.0/editmodule'
                ], function () {
                    editMode.init();
                }
            );
        }
        seajs.use(['gmlib/unit/scode/1.0.0/scode.min.js','gmlib/unit/bigdata/1.0.0/bigdata.min.js','gmlib/unit/scodecommon/1.0.0/scodecommon.min.js'],function(){
            s.pageName="返利:预告页面";
            s.channel="返利";
            s.prop1="返利:预告页面";
            s.prop2="返利:预告页面";
            s.prop3="返利:预告页面";
            s.prop4="返利";
            var s_code=s.t();
            if (s_code) {
                document.write(s_code);
            }
        })
    }, 2000);
    ;(function($){
        var rebate=function(){
            var _this =this;
            _this.init();
        };
        rebate.prototype={
            init:function(){
                var _this = this;
                _this.imgGLoad();//懒加载
                _this.slide('#J_slideBox', '.slideBox', true);//焦点图slide
                _this.BrandShopslider();
            },
            imgGLoad:function(){//懒加载
                $('.goodsTab').lazyload({
                    source: "data-lazy-img"
                });
            },
            slide:function(slideId, slideClass, isPrev){
                var $slideBox = $(slideId);
                var data = {
                    'content': slideClass,
                    'item': '.bd li',
                    'nav':'.hd li',
                    'cur':'on',
                    'auto':true,
                    'tab':true
                };
                var left = $('.hd', $slideBox).width()/2;
                if(isPrev){
                    data['prev'] = '.prev';
                    data['next'] = '.next';
                    if($('body').hasClass('w1000')){
                        left = left - 100;
                    }
                }
                $slideBox.mySlider(data);
                $('.hd', $slideBox).css({'marginLeft':'-'+left+'px'});
            },
            BrandShopslider:function(){
                $('.js_goodsTab').gTabs({ btnID: "#goodsTab_box_title", boxID: "#goodsTab_box", bind: 'hover', hide: 1, gomesrc: 0,hEven:function(){
                     $(".goodsTab").lazyload({
                            source: "data-lazy-img"
                     });
                    var i = $('.goodsTab_box_title li.cur').index();
                    var tab=$(".js_goodsTab_list").eq(i);
                    console.log(i)
                    console.log(tab);
                    var tabdata=$('.goodsTab_box_title li.cur').attr('data-rebate');
                    loaddata(tab,tabdata)
                    $(".goodsTab").getAjaxPrice();
                }});
                function loaddata(c,data){
                    var _url = "//ss" + cookieDomain+"/item/v1/channel/rebate/switchTable/"+data+"/flag/channel/data";
                    $.ajax({
                        type: "get",
                        url: _url,
                        dataType:"jsonp",
                        jsonpCallback: "data",
                        success:function(data){
                            if(data && data.dto && data.dto.length>0){//渲列表
                                var lis=c.find('li');
                                lis.each(function(i){
                                    var rebate_money=$(this).find('.rebate_money');
                                    var rebate = data.dto[i].rebate != '0.00' ? data.dto[i].rebate : (data.dto[i].sharerebate ? data.dto[i].sharerebate : '0.00');
                                    rebate_money.html(rebate);
                                })
                            }
                        }
                    })
                }
                var tab=$('.js_goodsTab_list').eq(0);
                var tabdata=$('.goodsTab_box_title li:first').attr('data-rebate');
                loaddata(tab,tabdata)
                $(".goodsTab").getAjaxPrice();
            }
        };
        new rebate();
    })(jQuery)
});
