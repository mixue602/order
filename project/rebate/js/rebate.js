seajs.config({base:stageJsServer});
seajs.use(['gmlib/ui/gload/1.0.0/gload.min.js','/js/unit','/js/lazyload','/js/slider','/js/tab','/js/autopoint','/js/search','/js/getajaxprice'],function(){
    ;(function($){
        var brand = function(){
            this.init();
        }
        brand.prototype = {
            init:function(){
                this.ranking();
                this.renderData();
                this.floor();
                this.fliRender();
            },

            //首焦图
            ranking:function(){
                $('.focus').mySlider({
                    'content':".focus",
                    'auto':true,
                    'tab':true
                }) ;
                $('.focus,.choice_main').lazyload({
                    source: "data-lazy-img"
                });
               $('.fli_box').prepend('<h1 class="rebate_logo"></h1>')
                $(window).scroll(function(){
                    var ht=$('.title_wrap').offset().top;
                    var wt = $(window).scrollTop();
                    if((wt-ht)>0){
                        $('.rebate_title').addClass('title_wrap_fixed');
                    }else{
                        $('.rebate_title').removeClass('title_wrap_fixed');
                    }
                })

            },
            fliRender:function(){//搜索关键字
                var searchArry=['空调','手机','笔记本电脑','冰箱','平板电视'];
                var searcrandom = parseInt(Math.random()*searchArry.length);
                $('#keyLabel_a').text(searchArry[searcrandom]);
                $('#keyLabel_a').siblings("input").val('');
                $("#keyLabel_a").click(function(){
                    $(this).hide();
                    $(this).siblings("input").focus();
                })
                $("#searchInput_a").focus(function(){
                    $(this).siblings("label").hide();
                });
                $("#searchInput_a").blur(function(){
                    if(this.value==""){
                        $(this).siblings("label").show();
                    };
                });

                $("#searchInput_a").bind('keydown',function(event){
                    if(event.keyCode==13){
                        var searchVal = $("#searchInput_a").val();
                        if($.trim(searchVal) == ""){
                            $(this).val(searchArry[searcrandom]);
                            setTimeout(function(){
                                window.open('//fanli.gome.com.cn/search?question='+searchArry[searcrandom])
                            },500)
                        }else{
                            window.open('//fanli.gome.com.cn/search?question=' + searchVal)
                        }
                    }
                })
                $('.js_wineSearch').click(function(){
                    $(this).siblings("label").hide();
                    var searchVal = $('#searchInput_a').val();
                    //此搜索接口 只支持线上
                    if($.trim(searchVal) == ""){
                        $(this).siblings("input").val(searchArry[searcrandom]);
                        setTimeout(function(){
                            window.open('//fanli.gome.com.cn/search?question=' + searchArry[searcrandom])
                        },500)
                    }else{
                        window.open('//fanli.gome.com.cn/search?question=' + searchVal)
                    }
                });
            },
            renderData:function(){

                $('.choice').floorTab({
                    content: '.choice',
                    nav:'.choice_title li',
                    item: '.choice_main ul',
                    endFun: function(c,floor_key){
                        //参数含义 楼层index， tab页签index， 需要放楼层内签的div， tab页签对应的keywords， tab页签对应的modelId，
                        loaddata(c,floor_key);
                    }
                });
                $(".choice").getAjaxPrice();
               function loaddata(c,data){
                   var _url = "//ss" + cookieDomain+"/item/v1/channel/rebate/switchTable/"+data+"/flag/channel/data";
                   $.ajax({
                       type: "get",
                       url: _url,
                       dataType:"jsonp",
                       jsonpCallback: "data",
                       success:function(data){
                       if(data){//渲列表
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
                var tab=$('.choice_main ul:first');
                var tabdata=$('.choice_title li:first').attr('data');
                loaddata(tab,tabdata)

              /*  var tab=$('.choice_main ul');
                var tabdata=$('.choice_title li');
                tabdata.each(function(i){
                    var lidata=$(this).attr('data');
                    var index=$(this).index();
                    var tabul=$('.choice_main ul').eq(index);
                    console.log(tab);
                    loaddata(tabul,lidata)
                })
*/
            },
            floor:function(){
                $('.rebate_goods').floorTab({
                    content: '.rebate_goods',
                    nav:'.rebate_title li',
                    item: '.rebate_main ul',
                    event:"click",
                    endFun: function(c,floor_key){
                        //参数含义 楼层index， tab页签index， 需要放楼层内签的div， tab页签对应的keywords， tab页签对应的modelId，
                        loaddata(c,floor_key);
                    }
                });
                function loaddata(c,data){
                    c.html('<div class="loading"></div>')
                    var random = parseInt(Math.random()*10000000000);
                    var _url = "//ss" + cookieDomain+"/item/v1/channel/rebate/index/flag/channel/test"+random+"?&sort="+data;
                    $.ajax({
                        type: "get",
                        url: _url,
                        dataType:"jsonp",
                        jsonpCallback: "test"+random,
                        success:function(data){
                            if(data){//渲列表
                                var listhtml = templateSimple('rebateTpl', data);
                                c.html(listhtml);
                                if(c.html()!=''){
                                    $(".rebate_main").getAjaxPrice();
                                }
                            }
                        }
                    })
                }
                var tab=$('.rebate_main ul:first');
                var tabdata=$('.rebate_title li:first').attr('data');
                loaddata(tab,tabdata);


                var flag=true;
                $('.rebateprice').click(function(){
                    var c=$('.rebate_main ul').eq(2);
                    var data=$(this).attr("data");
                    if(flag || data=='1'){
                        loaddata(c,"21");
                        $(this).find('span').addClass('up').removeClass('down');
                        flag=false;
                        $(this).attr("data","0");
                    }else{
                        loaddata(c,"20");
                        $(this).find('span').addClass('down').removeClass('up');
                        flag=true;
                        $(this).attr("data","1");
                    }
                    $(this).addClass('cur').siblings().removeClass(this.cur);
                    $('.rebate_main ul').eq(2).css('display','block').siblings('ul').css('display','none');
                });
            }

        }
        new brand();
    })(jQuery);
});








