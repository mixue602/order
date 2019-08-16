seajs.config({base:stageJsServer});
seajs.use(['/js/lazyLoad','/js/slider','gmlib/unit/sticknav/1.0.0/sticknav.min.js','gmlib/unit/gtime/1.0.0/gtime.min.js','/js/jquery.delayHover','/js/gload','/js/tab','/js/guess_you','/js/unit','/js/localstorage','/js/easing','/js/fixable','/js/smartkey','/js/elevator','/js/ele_start','gmlib/unit/gomelib/1.0.0/gomelib.min.js','gmlib/ui/getajaxprice/1.0.0/getajaxprice.min.js','/js/floatlogo'],function(){
    //可视化逻辑无需放入延时中
    var editMarks = $("#editModeId").attr("editMark");
    if (editMarks == 1) {
        seajs.use(['gmlib/unit/gedit/1.0.0/dialogs.min.js','gmlib/unit/gedit/1.0.0/editmode.min.js','gmlib/unit/gedit/1.0.0/editmodule.min.js'],function () {
            editMode.init();
        });
    };
    seajs.use(['gmlib/unit/scode/1.0.0/scode.min.js','gmlib/unit/bigdata/1.0.0/bigdata.min.js','gmpro/1.0.0/index/1.0.0/js/sCodeCommon_2015.min.js'],function(){
        var abFlag = $("#abFlagId").attr("abFlag");
        if(!abFlag){abFlag="A";}
        gomeLib.tongji.sCodeMain({pageName:"首页",channel:"首页",prop1:"首页",prop2:"首页",prop3:"首页推荐",prop4:"首页",eVar41:"首页"+abFlag,eVar42:"全国:首页",eVar3:"首页推荐",eVar30:"首页推荐"});
    });
    //main1
    ;(function($){
        $(function(){
            var gome_index = function(){
                this.init();
            };
            gome_index.prototype = {
                init: function(){
                    var _this = this;
                    _this.logoHref();  //logo蒙层链接
                    _this.focuslayer();  //焦点图蒙层
                    _this.focus();      //焦点图
                    _this.countTuan();   //倒计时
                    _this.feature();      //淘实惠
                    _this.focusRight(); //焦点图右侧
                    _this.area();
                    _this.fnLazyload(); //图片懒加载
                    _this.floorTab();
                    _this.floor();
                    _this.forIndex();   //首页独特的地方
                    _this.ajaxprice();   //价格异步
                },
                ajaxprice:function(){
                    $('.hotlist_house').getAjaxPrice();  
                },
                logoHref:function(){
                    var logohref=$(".logoHref").attr('data');
                    if($(".logoHref").length>0){
                       $("#logo a").attr({"href":logohref});
                       $("#logo a").attr("target","_blank");
                    }else{
                        $("#logo a").attr("target","_self");
                    }
                },
                focuslayer:function(){
                    var obj_img = $(".focus_img_l"),obj_layerimg = $(".focuslayer .focuslayer_img"),layerbtn = $(".layer_btn"),layerout = $(".focuslayer");
                    if(obj_layerimg && typeof(obj_layerimg) != "undefined" && obj_layerimg.length>0){
                        obj_img.delayHover(function(){
                            obj_layerimg.stop().animate({"width":"950px"},200);
                            layerout.show();
                            layerbtn.show("200");
                            $("#navBox").hide();
                        },function(){
                            obj_layerimg.stop().animate({"width":"0"},100);
                            layerout.hide();
                            layerbtn.hide();
                            $("#navBox").show();
                        },200)
                        layerbtn.click(function(){
                            obj_layerimg.stop().animate({"width":"0"},100);
                            $("#navBox").show();
                            $(this).hide();
                        })
                    }else{
                        return;
                    }
                },
                //手机3c 资源池  randomInProbability是一个按照比例取数据的函数，可以直接用；
                randomInProbability: function(weights){
                    if(arguments.length > 1){
                        weights = [].slice.call(arguments);
                    };
                    var total, current = 0, parts = [],
                        i = 0, l = weights.length;
                    // reduce 方法的简单兼容
                    total = weights.reduce ? weights.reduce(function(a, b){
                        return a + b;
                    }) : eval(weights.join('+'));
                    for(; i < l; i++){
                        current += weights[i];
                        parts.push('if( p < ', current / total, ' ) return ', i / l, ' + n;');
                    }
                    return Function('var p = Math.random(), n = Math.random() / ' + l + ';' + parts.join(''));
                },
                focus: function(){
                    var This = this,
                        $slider=$('.focus_box');
                    //焦点图 资源池
                    if(typeof(main_data) != "undefined" && main_data.length > 0){  //判断main_data 是否存在  如果存在按比例显示图片，如果不存在走默认图片
                        var focusData=main_data;
                        var html='';
                        $.each((focusData),function(i,v){
                            var focusLi=[],chances=[],lisArray=focusData[i],updateRandom,randomIndex,focus_pool;
                            var checkAll=[];
                            $.each(lisArray,function(s,val){
                                var chance=Math.abs(Number(val.chance));
                                focusLi.push(val);         //把属于某帧的图片  ，放在对应的数组中。  比如图片1属于第一帧， 就把图片1放在属于第一帧的数组中
                                if(!isNaN(chance)){      //把属于某帧图片的概率，放在对应的数组中，比如图片1概率属于第一帧， 就把图片1概率放在属于第一帧的数组中
                                    chances.push(chance);
                                }else{
                                    chances.push(1); 
                                }
                            });
                            //判断chances  是否都为0 如果都为0 则checkAll数组中没有b,反之含有b
                            $.each(chances,function(i){
                                if(0==chances[i]){
                                    checkAll.push("a");
                                }else{
                                    checkAll.push("b");
                                }
                            });
                            //判断后台传过来图片的个数 和 概率个数 都大于1  并且checkAll数组中含有b， 即概率都不为0 的情况 走概率  否则默认显示第一张图片
                            if(focusLi.length>1 && chances.length>1 && ($.inArray("b",checkAll)>-1)){
                                updateRandom = This.randomInProbability(chances);
                                randomIndex = Math.floor(focusLi.length * updateRandom());
                                focus_pool = focusLi[randomIndex];
                            }else{
                                focus_pool = focusLi[0];
                            }
                            //body节日背景，轮播图背景无,窄屏显示
                            var focus_bg_li=$(".focus_bg_li");
                            if($("body").hasClass("w1000")){//窄屏
                                if(i==0){
                                    if(focus_pool){
                                        html += '<li style="display:block;background: ' + focus_pool.background + ';"><a href="' + focus_pool.href + '" data-code="' + focus_pool.code + '" target="_blank"><img class="lazyloading" src="' + focus_pool.src + '" alt="'+focus_pool.alt+'" title="" width="750" height="450"></a><span class="promotion_tags"><img src="//app.gomein.net.cn/images/grey.gif" /></span></li>';
                                    }
                                }else{
                                    if(focus_pool){
                                        html+='<li style="background: '+focus_pool.background+'"><a href="'+focus_pool.href+'" data-code="'+focus_pool.code+'" target="_blank"><img class="lazyloading" src="//app.gomein.net.cn/images/grey.gif"  data-lazy-init="'+focus_pool.src+'" data-lazy-img="0" alt="'+focus_pool.alt+'" title="" width="750" height="450"></a><span class="promotion_tags"><img src="//app.gomein.net.cn/images/grey.gif" /></span></li>';
                                    }
                                }

                            }else if(focus_bg_li.length>0){//宽屏且有body节日背景
                                if(i==0){
                                    if(focus_pool){
                                        html += '<li style="display:block;"><a href="' + focus_pool.href + '" data-code="' + focus_pool.code + '" target="_blank"><img class="lazyloading" src="' + focus_pool.src + '" alt="'+focus_pool.alt+'" title="" width="750" height="450"></a><span class="promotion_tags"><img src="//app.gomein.net.cn/images/grey.gif" /></span></li>';
                                    }
                                }else{
                                    if(focus_pool){
                                        html+='<li style=""><a href="'+focus_pool.href+'" data-code="'+focus_pool.code+'" target="_blank"><img class="lazyloading" src="//app.gomein.net.cn/images/grey.gif"  data-lazy-init="'+focus_pool.src+'" data-lazy-img="0" alt="'+focus_pool.alt+'" title="" width="750" height="450"></a><span class="promotion_tags"><img src="//app.gomein.net.cn/images/grey.gif" /></span></li>';
                                    }
                                }
                            }else{    //默认宽屏状态
                                if(i==0){
                                    if(focus_pool){
                                        html += '<li style="display:block;background: ' + focus_pool.background + ';"><a href="' + focus_pool.href + '" data-code="' + focus_pool.code + '" target="_blank"><img class="lazyloading" src="' + focus_pool.src + '" alt="'+focus_pool.alt+'" title="" width="100" height="100"></a><span class="promotion_tags"><img src="//app.gomein.net.cn/images/grey.gif" /></span></li>';
                                    }
                                }else{
                                    if(focus_pool){
                                        html+='<li style="background: '+focus_pool.background+'"><a href="'+focus_pool.href+'" data-code="'+focus_pool.code+'" target="_blank"><img class="lazyloading" src="//app.gomein.net.cn/images/grey.gif"  data-lazy-init="'+focus_pool.src+'" data-lazy-img="0" alt="'+focus_pool.alt+'" title="" width="100" height="100"></a><span class="promotion_tags"><img src="//app.gomein.net.cn/images/grey.gif" /></span></li>';
                                    }
                                }
                            }
                            $slider.html(html);
                        })
                        if(saleflag && typeof(saleflag) != "undefined" && saleflag.length>0){ //大促标签
                            var saleflagsrc = saleflag[0].src;
                            $(".focus li .promotion_tags").find("img").each(function(){
                                $(this).attr("src",saleflagsrc);
                            });
                            if($("#saleflagextend") && $("#saleflagextend").length>0){
                                $(".focus li .promotion_tags").addClass("promotion_tags_left");
                            }else{
                                $(".focus li .promotion_tags").removeClass("promotion_tags_left");
                            }
                        }
                        seajs.use('/js/index-adver.js',function(){}); //引入广告逻辑
                    }
                },
                area: function(){
                    if(typeof(area1)!= "undefined" && area1.data.length > 1){
                        var divArea1=$('.area1');
                        areaimg(area1,divArea1);
                    }
                    if(typeof(area2)!= "undefined" && area2.data.length > 1){
                        var divArea2=$('.area2');
                        areaimg(area2,divArea2);
                    }
                    function areaimg(option,div){
                        var cookieId= $.cookie('atgregion'); //获取页面cookie
                        if(typeof(cookieId)!="undefined" && cookieId!=null && cookieId!=''){
                            var cookieIds=cookieId.split('|');
                            var areaHtml='';
                            $.each(option.data,function(i,val){
                                if(i>=1){
                                    var areaId=val.areaid;
                                    if(typeof(areaId)!="undefined" && areaId!='' && areaId!=null){
                                        $.each(cookieIds,function(s,v){
                                            if(areaId==v){    //判断后台cookie 是否 等于页面cookie
                                                areaHtml='<a href="'+val.href+'" data-code="'+val.code+'" target="_blank"><img class="lazyloading" src="'+val.src+'"  alt="'+val.alt+'" title="" width="240" height="200"></a>';
                                                div.html(areaHtml);
                                            }
                                        })
                                    }
                                }
                            });
                        }

                    };
                },
                countTuan:function(){
                    if($('.countdown').length>0){
                        this.tuan();
                    }
                },
                tuan:function(){
                    var _this=this;
                    //var cityCode = $.cookie('atgregion')? $.cookie('atgregion').split("|")[0] : "24150300" ;
                    var arr_atgregion = (function () {//获取区域3级和四级id
                        function getCookie(c_name) {
                            if (document.cookie.length > 0) {
                                c_start = document.cookie.indexOf(c_name + "=")
                                if (c_start != -1) {
                                    c_start = c_start + c_name.length + 1
                                    c_end = document.cookie.indexOf(";", c_start)
                                    if (c_end == -1) c_end = document.cookie.length
                                    return decodeURIComponent(document.cookie.substring(c_start, c_end))
                                }
                            }
                            return "";
                        }
                        var arr = (getCookie('atgregion') || "11010200|北京北京市朝阳区朝外街道|11010000|11000000|110102002").split('|');
                        return [arr[1], arr[3], arr[2], (arr[0] == undefined ? '11011400' : arr[0]), (arr[4] == undefined ? arr[0] + '1' : arr[4])];
                    })();
                    //var threeareaId = arr_atgregion[3];//三级区域ID
                    var threeareaId = arr_atgregion[2];//二级区域ID
                    var ajaxTimeoutTest=$.ajax({
                        type: "get",
                        url: ajaxTuan + "/cheap/getIndexRushbuyItem?areaCode="+threeareaId,
                        cache: false,
                        dataType: "jsonp",
                        timeout : 200,
                        jsonpCallback: "tuanbackshouye",
                        success: function(tuandata){
                            if(tuandata && tuandata.data && (tuandata.data.indexRushItem) && ((tuandata.data.indexRushItem).length>0) ){
                                var endtime=tuandata.data.goods_endTim;
                               /* var curtime=new Date().getTime();*/
                                var curtime=tuandata.data.goods_curr;
                                $('.countdown_js').hide();
                                function toDubble(n){  //小于10显示两位数
                                    return n<10 ? '0'+n : ''+n;
                                };

                                $.gTimer({
                                    ct: curtime,
                                    et: endtime,
                                    aEven: function() {
                                        if (this.ct >= this.et) {
                                            return;
                                        }
                                        var dd = toDubble(Number(this.dt.format('$dd')));
                                        var hh = toDubble(Number(this.dt.format('$hh')));
                                        var mm = toDubble(Number(this.dt.format('$mm')));
                                        var ss = toDubble(Number(this.dt.format('$s')));
                                        //(dd>100)&& ( dd =dd%100);
                                        if(dd === '00' && hh === '00' && mm === '00' && ss==='00'){
                                            window.location.reload();
                                        }else{
                                            $('.time_box').html('<i class="defintext">本场次剩余时间</i>'+
                                            '<i class="timego">'+
                                            '<em class="num">' + hh + '</em>:<em class="num">' + mm + '</em>:<em class="num">' + ss + '</em></i>');
                                        }
                                    }
                                });
                                tuandata.data.extra = {
                                    domain: tuandata.data.tuanIndexSite
                                }
                                seajs.use('/js/index-tpl', function(template){
                                    var html = template('tuan', tuandata.data);
                                    $('.countdown_l_b .countdown_lists').html(html);
                                    $('.countdown').show();
                                    //抢购调用slider插件
                                    $(".count_l").mouseover(function(){
                                        $(".countdown_btn").show();
                                    }).mouseout(function(){
                                        $(".countdown_btn").hide();
                                    })
                                    $(".count_l").mySlider({
                                        'content': '.count_l',
                                        'item': '.countdown_l_b .lay',
                                        'fadetime':100,
                                        'prev':'.prebtn',
                                        'next':'.nexbtn'
                                    })
                                });
                                //团抢数据处理
                                /*var data = tuandata.data.indexRushItem,
                                    dataurl = tuandata.data.tuanIndexSite;
                                if(data && data.length > 0){   //<i class="del">¥' + data[t].goods_tg_price + '</i>
                                    var tuanTpl='';
                                    for(var t = 0, len = data.length; t < len; t++){
                                        var _li = '<li class="list_li list_li_'+t+'" data-list="'+t+'"> <a href="'+dataurl+'/q?itemId='+ data[t].itemId +'" target="_blank" title="'+ data[t].goods_name+'" data-code="indextuan'+t+1+'"><img class="lazyloading" src="'+ data[t].goods_img+'_120.jpg"  alt="'+ data[t].goods_name+'" title="'+ data[t].goods_name+'" width="120" height="120" /><div class="p_price"><span>¥</span><i>' + data[t].goods_tg_price + '</i></div><p class="p_name">' + data[t].goods_name + '</p></a></li>';
                                        if(t == 0){
                                            tuanTpl += '<ul style="display:block clearfix">';
                                            tuanTpl += _li;
                                        }else if( Math.floor(t%4)==0 ){
                                            tuanTpl += '</ul><ul>';
                                            tuanTpl += _li;
                                        }else if( t== len-1){
                                            tuanTpl += _li;
                                            tuanTpl += '</ul>';
                                        }else{
                                            tuanTpl += _li;
                                        }
                                    } 
                                    $(".countdown_lists").html(tuanTpl);
                                    $('.countdown').show();
                                    if(($(".countdown_lists ul").length)>1){//按钮
                                        $(".count_l").mouseover(function(){ 
                                            $(".countdown_btn").show();
                                        }).mouseout(function(){
                                             $(".countdown_btn").hide();
                                        })
                                    }
                                    $('.count_l').mySlider({//抢购调用slider插件
                                        'content': '.count_l',
                                        'item': '.countdown_l_b ul',
                                        'fadetime':200,
                                        'prev':'.prebtn',
                                        'next':'.nexbtn'
                                    });
                                }*/
                            }else{

                                $('.countdown_js').hide();
                            }
                        },
                        error:function(){
                            $('.countdown_js').hide();
                        },
                        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                            if(status=='timeout'){//超时,status还有success,error等值的情况
                                window["tuanbackshouye"] = function(){
                                    delete window["tuanbackshouye"];
                                };
                                $('.countdown_js').hide();
                            }
                        }
                    });
                },
                feature: function(){
                    var This = this;
                    function pool(pooData,divPool){
                        var pool_datas = []; //存放后台传过来 图片 的数组
                        var chance1 = [];   //存放后台传过来 图片出现概率 的数组
                        var checkAll=[];    //用来判断 传过来 图片出现概率是否都为0 如果都是0，则默认显示第一张图片
                        var pool1=[];
                        $.each((pooData.data), function(index, val){
                            var chance=Math.abs(Number(val.chance));  //把后台传过来的概率变成数字类型型，并且如果是负数 取它的正数
                            pool_datas.push(val); //把页面取过来的图片信息重新放到一个新数组中，一遍进行js渲染
                            if(!isNaN(chance)){  //判断每个概率是否为数字  如果是数字正常取就行，如果不是数字，默认当前图片
                                chance1.push(chance);
                            }else{
                                chance1.push(1);
                            }
                        });
                        $.each(chance1,function(i){
                            if(0==chance1[i]){
                                checkAll.push("a");
                            }else{
                                checkAll.push("b");
                            }
                        });
                        if(pool_datas.length>1 && chance1.length>1 && ($.inArray("b",checkAll)>-1)){
                            var updateRandom = This.randomInProbability(chance1);
                            var randomIndex = Math.floor(pool_datas.length * updateRandom());
                             pool1 = pool_datas[randomIndex];
                        }else{
                            pool1 = pool_datas[0];
                        }
                        if(pool1){
                            var html = '<a href="' + pool1.href + '" target="_blank" data-code="' + pool1.code + '"><img class="lazyloading img_w199" src="//app.gomein.net.cn/images/grey.gif" data-lazy-init="' + pool1.src + '" title="" data-lazy-img="0" alt="' + pool1.alt + '" width="219" height="209"></a>';
                            divPool.html(html);
                        }
                    };
                    //淘实惠第三个坑位是资源池
                    if(typeof(pool1_data) != "undefined" && pool1_data.data.length > 1){
                        var divPool=$('.f_m_l .pool');
                        pool(pool1_data,divPool);
                    }
                    //购新潮第三个坑位是资源池
                    if(typeof(pool2_data) != "undefined" && pool2_data.data.length > 1){
                        var divPool=$('.f_m_c .pool');
                        pool(pool2_data,divPool);
                    }
                },

                focusRight: function(){
                    var $icon_wrap = $('.icon_tab_wrap'),
                        $ser_cur = $('.ser_cur'),
                        icon_server = $('#icon_server'),
                        $fang=$('#fang'),
                        $gm_sever_wrap= $('#gm_sever_wrap'),
                        $guan=$('.guan');

                    if($('body').hasClass('w1000')){
                        //w1000下  鼠标滑过快讯缩略图
                        $fang.delayHover(function(){
                            $fang.fadeOut(500);
                            $gm_sever_wrap.stop().animate({
                                "margin-left": '237.5px',
                                "width": '262.5px',
                                "height": '450px'
                            }, 150);
                        }, function(){
                        }, 200);
                        $guan.on("click", function(){
                            $gm_sever_wrap.stop().animate({"margin-left": '495.5px', "width": '0', "height": '0'}, 150);
                            $fang.fadeIn(500);
                        })
                    }else{
                        //虚拟服务 添加iframe
                        $(".icon_tab_content_ul li a[gome=0]").each(function(i){
                            if($(this).attr('gome-src') != 'undefind'){
                                var html = '<iframe height="167" width="250" scrolling="no" frameborder="0"></iframe>';
                                $(this).append(html);
                            }
                        });

                        //虚拟服务 点击前4个 有动画效果
                        $('#icon_server>li:lt(2)').each(function(){
							var index = $(this).index();
							var liobj = $(this);
                            $(this).find("a").delayHover(function(){
                                $ser_cur.css('display', 'block');
                                var Liwidth = $('#icon_server li').width();
                                var swidth = $ser_cur.width();
                                
								var left = 15+ index * (Liwidth+29) + ((Liwidth - swidth) / 2);
                                if($icon_wrap.css('top') == "435px"){
                                    $icon_wrap.stop().animate({"top": '69px'}, 200);
                                }
                                $ser_cur.stop().animate({"left": left + 'px'}, 150);
                                liobj.addClass('cur').siblings().removeClass('cur');
                                $icon_wrap.find('li').eq(index).show().siblings().hide();
                                var a = $(this).parents(".icon_box").siblings(".icon_tab_wrap").find('li').eq(index).children('a');
                                var iframe = $(this).parents(".icon_box").siblings(".icon_tab_wrap").find('li').eq(index).find("iframe");
                                iframe.attr("src", a.attr('gome-src'));
                                a.removeAttr('gome-src');
                            }, function(){
                            }, 200);
                        });

                        //虚拟服务 点击差号 恢复默认状态
                        $('.close_icon,.home,.icon_server li').on("click", function(){
                            if($icon_wrap.css('top') == '69px'){
                                $ser_cur.css('display', 'none');
                                icon_server.find('li').removeClass('cur');
                                $icon_wrap.stop().animate({"top": '435px'}, 300);
                            }
                        });
                    }
                },
                floor:function(){
                    var thiz=this;
                    // 其中el是$(slider),ui是slider的返回值，用于调用其内部方法
                    var f = {
                        el: [],
                        bl:[],
                        ui: []
                    };
                    // 两个定时器
                    var g_timer = -1;
                    $(window).off('load scroll resize', sliderLoad).on('load scroll resize', sliderLoad);
                    // 页面加载，滚动，窗口缩放的时候 延迟0.2S调用页面上哪个图片自动轮播
                    function sliderLoad(){
                        clearTimeout(g_timer), g_timer = setTimeout(function(){
                            measureHight();
                        }, 200)
                    }

                    //判断在可视范围内的轮播图，应该自动轮播哪一个
                    function measureHight(){
                        var a = measureHightFn(f.el);
                        $.each(f.ui, function(b, c){
                            a && c.options.content.get(0) == a.get(0) ? (  c.auto = true, c.autoFn()  ) : ( c.stopFn(), c.auto = false);
                        })
                        $.each(f.bl, function(b, c){
                            a && c.options.content.get(0) == a.get(0) ? (  c.auto = true, c.autoFn()  ) : ( c.stopFn(), c.auto = false);
                        })
                    }

                    //判断页面中哪些轮播图在可视范围内
                    function measureHightFn(a){
                        var b = [];
                        var c = $(window).height();
                        // d为滚动条滚动高度
                        var d = $("body").scrollTop() || $("html").scrollTop();
                        // e为slider上边框到document的高 e = h.offset().top
                        var e = 0;
                        // f为slider的高
                        var f = 0;
                        // g为底部到document的高
                        var g = 0;
                        // h是循环出来的单个slider
                        var h = null;
                        return $.each(a, function(a){

                            // g>d  如果slider的底部没有到达屏幕的上边框，也就是说slider没有离开视线
                            // d + c > e  那么看看屏幕下边距是否到达slider的上边距，也就是说slider是否进入视线
                            // 两句合起来 判断了 如果slider已经超出了屏幕，那么就什么都不用判断了，如果底部一直大于屏幕的上边框，那么就说明还没有看到，继续判断 看看slider是否进入了屏幕，如果进入，进入if
                            if(h = $(this), !h.data("floorIsHover") && (e = h.offset().top, f = h.outerHeight(), g = e + f, g > d && d + c > e)){
                                var i = 0;
                                // d > e slider的上边框达到屏幕并超出时
                                // i = g - d  i为底部到doc的高与滚动高度的差值
                                // 两句合起来 判断了 如果slider已经达到屏幕上边框，那么开始创建一个变量i，其值正好为slider高开始一直缩小的一个数值
                                // e > d   slider上边框还未达到屏幕上边框时
                                // d + c > e   屏幕下边框大于slider上边框，也就是说如果slider在下面已经露出屏幕时
                                // i = d + c - e 创建 i为 slider露出高度 并越来越大
                                // 三句合起来 判断了 slider的位置在以它的上边框为基准，slider上边框在屏幕上下边框游走而不超出时，给一个i值，i从零开始，一直增大的一个数值
                                // 整个儿判断语句为 判断slider上边框是否超出屏幕上边框，超出了给一个i，没超出接着判断slider是否露出屏幕，露出了给个i
                                d > e && (i = g - d), e > d && d + c > e && (i = d + c - e), b.push({
                                    node: h,
                                    ch: i,
                                    i: a
                                })
                            }
                        }), b.length > 0 ? (b.sort(function(a, b){
                            return a.ch != b.ch ?(a.ch < b.ch ? -1 : 1)  : (Math.round(Math.random()) ? -1 : 1)
                        }), b.pop().node) : null
                    }

                    function sliderAll(sync,obj){
                        if(sync==false){
                            var m=obj.find('.mc_c');
                        }else{
                            var m=$('.mc_c');
                        }
                        m.each(function(){
                            var content=$(this),
                                itemli=$(this).find('ul.slider li'),
                                itemul=$(this).find('.brand_slider ul');
                            var $slider_page=$(this).find('.slider_page'),
                                $page_slider=$(this).parents('.main_warp').find('.page_slider');

                            //鼠标滑过焦点图区域时 定时器停止，离开时定时器开始
                            $(this).parents('.main_warp').hover(function(){
                                $page_slider.css('display','block');
                            },function(){
                                $page_slider.css('display','none');
                            });

                            var b=$(this).mySlider({
                                'content': content,
                                'item': itemli,
                                'prev':'.slider_up',
                                'next':'.slider_down',
                                'tab':true
                            });
                            var c=$(this).mySlider({
                                'content': content,
                                'item': itemul,
                                'prev':'.slider_up',
                                'next':'.slider_down'
                            });
                            content.bind("mouseenter", function(){
                                $slider_page.css('display',"block");
                                content.data("floorIsHover", !0), measureHight()
                            }), content.bind("mouseleave", function(){
                                $slider_page.css('display',"none");
                                content.data("floorIsHover", !1), measureHight()
                            }), b.stopFn(), b.autoInterval = false,f.el.push(content), f.ui.push(b), f.bl.push(c);
                        });
                    };
                    sliderAll(true);
                    if($('.lazy-fn-wrap').hasClass('async')){//如果是异步插入的方式
                        var gf_timer = -1;
                        var check_localStorage = $.localStorage.check();
                        $(window).off('load scroll resize', floorLoad).on('load scroll resize', floorLoad);
                    }
                    function floorLoad(){
                        clearTimeout(gf_timer), gf_timer = setTimeout(function(){
                            var floorList = [];
                            var win_height = $(window).height();//浏览器当前窗口可视区域高度
                            //scrollTop d为滚动条滚动高度
                            var scrollTop = $("body").scrollTop() || $("html").scrollTop();
                            // e为floor上边框到document的高 e = h.offset().top
                            var e = 0;
                            // f为floor的高
                            var f = 0;
                            // g为floor底部到document的高
                            var g = 0;
                            // h是循环出来的单个floor
                            var h = null;
                            // dataTime是循环出来的单个floor的缓存时间戳
                            var dataTime = null;
                            $('.floor').each(function(){
                                h = $(this);
                                e = h.offset().top;
                                f = h.outerHeight();
                                g = e + f;
                                dataTime = h.attr('data-time');
                                //dataTime 如何缓存时间戳存在，说明是异步插入
                                //h.data("floorIsHover") 默认为undefind 默认没有加载过
                                //判断底部距离大于滚动距离，且floor上边框的高度在 可视区高度+滚动高度+floor高度的范围内
                                if(dataTime && !h.data("floorIsHover") && (g > scrollTop+20 && (scrollTop + win_height + f) > e)){
                                    floorList.push(h);
                                }
                            });

                            for(var i = 0; i < floorList.length; i++){
                                var _this = $(floorList[i]),
                                    index = _this.index() + 1,
                                    ls_index = 'floor' + index + '_floor', //local-storage 缓存的楼层名称
                                    dataTime = _this.attr('data-time');
                                if(check_localStorage){
                                    var ls_obj = $.localStorage.get(ls_index);
                                }
                                if(!check_localStorage || !ls_obj || ls_obj.time != dataTime || ls_obj.time == dataTime && (!ls_obj.data)){ //不支持本地缓存的时候 //第一次没有存本地缓存或者缓存数据已经更新
                                    if(_this.hasClass('temp3')){ //如果是生活服务楼层
                                        floorAjax({dataTime: dataTime, ls_index: ls_index, index: 0, obj: _this});
                                    }else{
                                        floorAjax({dataTime: dataTime, ls_index: ls_index, index: index, obj: _this});
                                    }
                                }else{ //有缓存数据存在的时候
                                    _this.append(ls_obj.data);
                                    afterDo({obj: _this, index: index});
                                }
                                //改变属性 表示已加载过
                                _this.data('floorIsHover', true);
                            }
                        }, 200);
                    };

                    //楼层ajax请求
                    function floorAjax(local_data){
                        var _url = window.location.href;
                        var url = "//www" + cookieDomain + "/floor" + local_data.index + ".html";
                        if(_url.indexOf("version") != -1){ //首页回滚版本
                            var versionstr=_url.split("version=")[1];
                            if(versionstr.indexOf("&") != -1){
                                var version = versionstr.split("&")[0];
                            }else{
                                var version = versionstr;
                            }
                        };
                        if(version){
                            if(_url.indexOf("jsp") > -1){
                                //测试环境测试
                                url = "floor.jsp?floor=" + local_data.index + '&version=' + version ;
                            }else if(_url.indexOf("ftl") > -1){
                                //本地测试
                                url="//localhost/html/floor3.html?_=1476880160389";
                            }else if(_url.indexOf("html") > -1){
                                //gcc预览地址  http://gccpreview.ds.atguat.com.cn/floor1.html
                                //http://gccpreview.ds.atguat.com.cn/4126042b731945d9bf89ffa5e2574467_floor2.html
                                url = version +"_floor" + local_data.index + ".html";
                            }
                        }else{
                            if(_url.indexOf("jsp") > -1){
                                //测试环境测试
                                url = "floor.jsp?floor=" + local_data.index;
                            }else if(_url.indexOf("ftl") > -1){
                                //本地测试
                                url="//localhost/html/floor3.html?_=1476880160389";
                            }else if(_url.indexOf("html") > -1){
                                //gcc预览地址  http://gccpreview.ds.atguat.com.cn/floor1.html
                                url = "/floor" + local_data.index + ".html";
                            }
                        }
                        
                        $.ajax({
                            type: "get",
                            url: url,
                            cache: false,
                            success: function(data){
                                var data_content = data,
                                    storage_data = {'time': local_data.dataTime, 'data': data_content};
                                    local_data.obj.prepend(data_content);
                                    local_data.obj.addClass("floor-done");
                                if(check_localStorage){
                                    $.localStorage.set(local_data.ls_index, storage_data);
                                }
                                afterDo({obj: local_data.obj, index: local_data.index});
                            }
                        });
                    };
                    //渲染楼层各JS效果
                    function afterDo(local_data){
                        $('.floor').lazyload({
                            source: "data-lazy-img"
                        });
                        sliderAll(false,(local_data.obj))
                        thiz.floorTab(false,(local_data.obj));
                    };
                },
                floorTab:function(sync,obj){
                    if(sync==false){
                        var ct=obj.find('.ct');
                    }else{
                        var ct=$('.ct');
                    }
                    ct.each(function(){
                        var ct=$(this);
                        $(this).floorTab({
                            content: ct,
                            endFun: function(floor_index, tab_index, $_tab_content, floor_key, tab_id){
                                //参数含义 楼层index， tab页签index， 需要放楼层内签的div， tab页签对应的keywords， tab页签对应的modelId，
                                window.loadTabData(floor_index, tab_index, $_tab_content, floor_key, tab_id);
                            }
                        });
                    });
                    window.loadTabData = function(f, t, c, k, i){
                        var cityCode = $.cookie('atgregion') ? $.cookie('atgregion').split("|")[0] : "24150300";
                        var url = window.location.href;
                        var _url = "//ss" + cookieDomain + "/item/v1/floorSelect/" +  k.split("/")[2] + "/" +k.split("/")[3]+"/" +cityCode + "/home/flag/homepage/test"+f+t; //正式地址
                        if(url.indexOf("jsp") > -1){
                            _url = "../2016/indexFloorTabPrd2016.jsp?floor=" + k.split("/")[2] + "&tab=" + k.split("/")[3]; //动态页地址
                        }else if(url.indexOf("ftl") > -1){
                            //本地测试地址
                            _url="//preview.ds.atguat.com.cn/stage-web_06/2016/indexFloorTabPrd2016.jsp?floor=floor1and11_2&tab=tab_2&callback=test"+f+t; //本地测试地址
                        }
                        $.ajax({
                            type: "get",
                            url: _url,
                            cache: false,
                            dataType: "jsonp",
                            jsonpCallback: "test"+f+t,
                            success: function(data){
                                if(data){
                                    data.extra = {
                                        f: f,
                                        t: t,
                                        i: i
                                    }
                                    seajs.use('/js/index-tpl', function(template){
                                        var html = template('index-floor', data);
                                        c.html(html);
                                        c.attr('tab-data-load','1');
                                        ct.lazyload({
                                            source: "data-lazy-img"
                                        });
                                        loadPrice(f, t, c, k);
                                    });
                                }
                            }
                        });
                    };
                    function loadPrice(f, t, c, k){
                        var area = cityID()[2];   //用户所在地区ID
                        var tabIds = "", tabIdStr = "", tabIdArr = [];
                        var tabPrice = c.find(".p_price[sku]");
                        var freePrice = c.find(".p_price");
                        tabPrice.each(function(){
                            var productId = $(this).attr("productId"),
                                sku = $(this).attr("sku");
                            if($(this).attr("priceFlag") == "true"){
                                $(this).attr("priceFlag", "false");
                                //tabIds = productId + "-" + sku;
                                // if(k=="/floor/floor1and11_1/tab_2"){//比价购skuID加引号
                                //     tabIds = "'"+sku+"'";
                                // }else{
                                //     tabIds = sku;
                                // };
                                tabIds = sku;
                                tabIdArr.push(tabIds);
                            }
                        });
                        tabIdStr = tabIdArr.join(",");
                        // var url ="//ss.gome.com.cn/ec/homeus/n/product/browse/gomeProdPriceInterface.jsp?sid=" + tabIdStr +"&districtCode="+ area;
                        price()
                        function price(){
                            $.ajax({
                                type: "get",
                                //url: "//ss" + cookieDomain  + contextPath + "/n/product/browse/gomeProdPriceInterface.jsp?sid=" + tabIdStr +"&districtCode="+ area,
                                url: "//ss" + cookieDomain + "/item/v1/price/promogen/" + tabIdStr + "/" + area + "/flag/channel/callback",
                                // url:url,
                                cache: false,
                                dataType: "jsonp",
                                jsonpName: "callback",
                                success: function (data) {
                                    if (data && data.result) {
                                        data = data.result;
                                    }
                                    //var data = [{"sid":"1120050160","sp":"499.00","rp":"489.00","isr":true},{"sid":"1120010010","sp":"499.00","rp":"468.00","isr":true},{"sid":"1114320125","sp":"399.00","rp":"349.00","isr":false},{"sid":"pop8002285147","sp":"499.00","rp":"499.00","isr":false},{"sid":"pop8002285144","sp":"499.00","rp":"366.00","isr":true},{"sid":"pop8002285146","sp":"159.00","rp":"147.00","isr":true},{"sid":"pop8002285149","sp":"199.00","rp":"199.00","isr":false},{"sid":"pop8002285143","sp":"99.00","rp":"99.00","isr":false}];
                                    if (data && data.length>0) {
                                        $.each(data, function (i, item) {
                                            var sid = data[i].skuId;
                                            var sp = data[i].originalPrice;
                                            var rp = data[i].minPrice;
                                            tabPrice.each(function () {
                                                var sku = $(this).attr("sku");
                                                //alert(sku)
                                                if (sku == sid && rp) {
                                                    $(this).html("<span>¥</span>" + rp);
                                                }
                                            })
                                        })
                                    }
                                }
                            });
                        };
                    }
                    function cityID(){
                        var _cookie = $.cookie('atgregion') || "11011400|北京北京市东城区东城区|11010000|11000000|110114001",
                            _array = _cookie.split("|");
                        if(_array.length === 4)_array.push(_array[0] + "1");
                        return _array;
                    }
                },
                fnLazyload: function(){
                    $('.sale,.gm_feature,.gm_finance,.quan_out,.guess_main,.activity,.floor,.floor_bg,.temp3,.hotlist,.nav_right,.focus_img_bg,.footer_bg').lazyload({
                        source: "data-lazy-img"
                    });
                },
                forIndex: function(){
                    $.sticknav({
                        scrollTop:'615px'
                    });
                    window.scrollTo(0,0);
                    //首页二维码自动展示
                    var _index_ad = $.cookie('_index_ad');
                    var _index_code = $.cookie('_index_code');
                    function showCode(){
                        var ADtime = new Date();
                        ADtime.setTime(ADtime.getTime() + (2 * 60 * 60 * 1000));
                        $.cookie('_index_code', '1', {expires: ADtime, path: '/'});
                        $('#gome-aside-app').trigger('mouseover');
                    }
                    if($("#gome-topad-bg").length <= 0 && !_index_code){
                        showCode();
                    }
                    if(_index_ad && !_index_code){
                        showCode();
                    }
                    //for index
                    $(".mainnav li").eq(0).css("display", "none");
                    //大促底部弹层
                    if($("body").hasClass("w1000")){//窄屏
                        $(".big_promotion").remove();
                    }
                    if($(".big_promotion").length > 0){
                        var obj_tao = $(".gm_feature"),
                        obj_pro = $(".fl_pop_wrap"),
                        obj_close = $(".fl_wrap_close"),
                        objH_tao = obj_tao.offset().top,
                        $window = $(window),
                        $document = $(document);
                        $(window).scroll(function(){
                            var WscrollTop = $(this).scrollTop();
                            if( WscrollTop > objH_tao){
                                obj_pro.fadeIn("slow", function(){
                                    $(this).slideDown("slow");
                                });
                            }else{
                                obj_pro.slideUp("slow");
                            }
                            if($document.scrollTop() + $window.height() >= $document.height()){
                                $(".fl_pop_wrap_cntr").animate({left: "-100%"}, "slow",stopHide());
                            }
                            /*$('.big_promotion').lazyload({
                                source: "data-lazy-img"
                            })*/
                        })
                        $(".fl_pop_wrap").mouseover(function(){
                            obj_close.show();
                        }).mouseout(function(){
                            obj_close.hide();
                        })
                        /*setTimeout(function(){
                           $(".fl_pop_wrap_cntr").animate({left: "-100%"}, "slow",stopHide());
                            //  $(".fl_wrap_close").trigger("click");
                        },3000);*/
                        $(".fl_open_wrap").click(function() {
                            $(".fl_pop_wrap").css({width:"100%"});
                            $(".fl_open_wrap_cntr").stop().animate({left:'-100%'},"slow",nextShow_2());
                        });
                        $(".fl_wrap_close").click(function(){
                            $(".fl_pop_wrap_cntr").stop().animate({left:'-100%'},"slow",stopHide());
                        });
                        function nextShow_2(){//右出
                            $(".fl_open_wrap_cntr").stop().animate({left:'-100%'},"slow",function(){
                                $(".fl_pop_wrap .fl_pop_wrap_cntr").show();
                                $(".fl_pop_wrap_cntr .fl_pop_box").show();
                                $(".fl_pop_wrap .fl_pop_wrap_cntr").animate({ left: '0%'}, "slow");
                                $(".big_promotion").addClass("fl_pop_index");
                            });
                        };
                        function stopHide(){//左出
                            $(".fl_pop_wrap_cntr").stop().animate({left:'-100%'},"slow",function(){
                                $(".fl_open_wrap").show();
                                $(".fl_open_wrap .fl_open_wrap_cntr").show();
                                $(".fl_open_wrap .fl_open_wrap_cntr").animate({ left: '0%'}, "slow");
                            });
                            $(".fl_pop_wrap").css({width:"120px"});
                            $(".fl_open_wrap").show();
                            $(".fl_pop_wrap_cntr").hide();
                            $(".big_promotion").removeClass("fl_pop_index");
                        };
                    }
                    

                }
            };
            new gome_index();
        });
    })(jQuery);
});
//大促模块最后一个ul去掉下边距
$(window).load(function(){
    var sale_obj=$(".home .sale");
    var oul_last = sale_obj.find("ul").last();
    oul_last.addClass("nomargin");   
});
    
