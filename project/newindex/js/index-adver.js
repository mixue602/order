//topad_layer 浮层
function LayerInit_ad(){
    var _index_ad_layer = $.cookie('_index_ad_layer');
    var layer_time = $("#layer_time"),
        layer_timebetween = layer_time.attr("layer-timebetween"),
        layer_timeshow = layer_time.attr("layer-timeshow");
    if(layer_time && layer_timebetween){  //弹层间隔时间
        Timebetween = Number(layer_timebetween)* 60 * 1000;
    }else{
        Timebetween = 12 * 60 * 60 * 1000;
    }
    if(layer_time && layer_timeshow){  //弹层停留时间
        Timeshow = Number(layer_timeshow)* 60 * 1000;
    }else{
        Timeshow = 5000;
    }
    if($('body').hasClass('home') && $("#gome-layer-ad").length > 0 && !_index_ad_layer){ 
        // jQuery.getScript(stageJsServer+"/gmpro/1.0.0/public/1.0.0/js/adslide.min.js", function(){$(this).adslide({});});
        jQuery.getScript(stageJsServer+"/gmlib/ui/gpop/1.0.0/gpop.js", function(){
            $('#gome-layer-ad').gPop({
                zIndex: 9999,
                isLock: true,
                lockBgColor: '#000',
                opacity: 0.6,
                time: Timeshow,
                colseCallback: function(){
                    $('html,body').css('overflow','');
                    setTimeout(function () { 
                        $('#gome-aside-app').trigger('mouseover');
                    },100);
                    //浮动logo与抢红包
                    Float_logo();
                    var ADtime = new Date();
                    //ADtime.setTime(ADtime.getTime() + (12 * 60 * 60 * 1000));
                    ADtime.setTime(ADtime.getTime() + Timebetween);
                    $.cookie('_index_ad_layer', '1', {expires:ADtime, path:'/'});
                },
                beforeCallback: function(){
                    $('html,body').css('overflow','hidden');
                }
            });
            

        });

    };
}
function Float_logo(){
    //浮动logo与抢红包
    var _index_float_logo = $.cookie('_index_float_logo');
    if(!_index_float_logo && floatLogo){
        $("body").floatAd({
            imgSrc : floatLogo_0,
            secImgSrc: floatLogo_1,
            imgdata: floatLogo_modelId,
            url:floatLogo_url
        });
        FLtime.setTime(FLtime.getTime() + (10 * 60 * 1000));
        $.cookie('_index_float_logo', '1', {expires:FLtime, path:'/'});
    }
}
function focusInit(){
    seajs.use('/js/slider.js',function(){
     //填充ol小圆点
        var img_len = $(".focus_box li").length,  
            ol_obj = $("#gm_main .focus ol"),  
            _ol="";
        for(var a=0; a < img_len; a++) {
            if(a==0) {
                _ol = '<li class="cur"><a></a></li>';
            } else{
                _ol += '<li><a></a></li>';
            } 
        }
        ol_obj.append(_ol);
        //焦点图调用slider插件
        $('.focus').mySlider({
            'content': '.focus',
            'item': '.focus_box li',
            'time':5000,
            /*'fadetime':200,*/
            'auto':true,
            'tab':true,
            Cbackleft: function(){//点击事件                     
                gomeClicki('send', 'event', '国美首页','首焦轮播图', '翻页左'); 
            },
            Cbackright: function(){//点击事件                         
                gomeClicki('send', 'event', '国美首页','首焦轮播图', '翻页右');
            },
            adcallback:function(index){
                if($(".focus_box li").eq(index).hasClass("show")){
                    return false;   
                }else{
                    if($(".focus_box li").eq(index).hasClass("adver")){
                        var impurl = $(".focus_box li").eq(index).attr("imp")+'&contentType=3';
                        $.ajax({
                            type: "get",
                            url: impurl,
                            dataType: "jsonp",
                            xhrFields: { withCredentials: true },
                            crossDomain: true,
                            jsonp: 'callback',
                            jsonpName: 'ad_focus'+(parseInt(Math.random(802547) *100000)),
                            success:function(){
                                $(".focus_box li").eq(index).addClass("show");
                            },
                            error:function(XMLHttpRequest, textStatus, errorThrown){
                            }
                        });
                    }
                }
            }
        })
    })
}
//美信广告数据对接
//window.onload=function(){
if($("#ad_hidden").length > 0){
    var hdrsideRoll_out = $(".hdrsideRoll"),
        layer = $("#gome-topad-bg"),
        Topad = $('#gome-topad-sm'),
        Logoright = $("#logo-gif"),
        Logoright_slogan = $("#slogan"),
        hdrsideRoll = $(".hdrsideRoll"),
        Hottext = $("#topSearch .hotkeyword");
        layer.remove();
        Topad.remove();
        Logoright.remove();
        Logoright_slogan.remove();
        Hottext.html("");
        hdrsideRoll.remove(); //移除元素
    var data_ad;

    (function(){
        var Start_time = new Date().getTime();//获取广告接口响应时差
        var ajaxTimeout_ad;
        //function ajaxTest(){ 
            var datajson={  //1-3焦点图
                slotId:"10047,10048,10049,10050,10051,10052,10053,10054,10055,10056,10057,10058,10059,10060,10061,10062,10063",
                requestType:"3",
                distId: $.cookie('atgregion') ? $.cookie('atgregion').split("|")[2] : "11011400"
            };
            ajaxTimeout_ad = $.ajax({ 
                url: "//flight.gome.com.cn/flight", //正式地址
                //url: "//flight-pre.gomeplus.com/flight", //测试地址
                dataType: "jsonp",
                type: "get",
                data: datajson,
                timeout : 800, //超时时间设置，单位毫秒
                jsonp: 'callback',
                jsonpName: 'ad_post',
                success:function (data) {
                    data_ad=data;
                    var _img_arr=[];
                    var _img_arr_lunbo=[];
                    var _lunbo_li_src=[];
                    var _lunbo_li_link=[];
                    End_timefn(data);
                    function End_timefn(data){  //广告接口响应计时
                        var End_time = new Date().getTime();
                        var Cha_time =  End_time-Start_time;
                        var reqId_url = data_ad[0].batchImpUrl,
                            reqId_index = reqId_url.indexOf('=');
                            reqId_index_end = reqId_url.indexOf('&');
                            reqId_id = reqId_url.substring(reqId_index+1,reqId_index_end);
                        $.ajax({
                            url: "//shareserver.gome.com.cn/monitor?reqId=" + reqId_id + "&reqCostTime=" + Cha_time,
                            type: "get",
                            dataType: "jsonp",
                            success: function(data){
                                //alert("ok计时"+Cha_time);
                            },
                            error: function() {}
                        })
                    }
                    function strToJson(str) {  //转换格式
                        return JSON.parse(str); 
                    } 
                    if(data_ad && data_ad.length > 0){
                        var _txt="";
                        var _Sli="";
                        for(var t = 0; t < data_ad.length; t++){
                            var Data_i = data_ad[t].adContents[0].content;
                            var Firstimg1 = $(".focus .focus_box li").eq(0);
                            var _li="";
                            var li3="";
                            if(data_ad[t].slotId){
                                if(data_ad[t].slotId == 10047){ //蒙层广告                                    
                                    var obj_top = $("body.home .gome-top");
                                    obj_top.after('<div id="gome-layer-ad" imp="'+data_ad[t].adContents[0].impressionUrl+'"><a href="'+strToJson(Data_i).clickUrl+'" data-code="ad'+data_ad[t].slotId+'" target="_blank" ><img src='+strToJson(Data_i).resourceUrl+' /></a></div>');
                                    LayerInit_ad();
                                    //蒙层单独上报
                                    if($("#gome-layer-ad").css("display")=="block"){
                                        var implayer = $("#gome-layer-ad").attr("imp")+'&contentType=3';
                                        $.ajax({
                                            type: "get",
                                            url: implayer,
                                            dataType: "jsonp",
                                            xhrFields: { withCredentials: true },
                                            crossDomain: true,
                                            jsonp: 'callback',
                                            jsonpName: 'ad_layer'+(parseInt(Math.random(802547) *100000)),
                                            success:function(){
                                            },
                                            error:function(XMLHttpRequest, textStatus, errorThrown){
                                            }
                                        });
                                    }
                                }else if(data_ad[t].slotId == 10048){ //顶通广告
                                    var obj_top = $("body.home .gome-top");                                    
                                    obj_top.before('<div style="background:'+strToJson(data_ad[t].adContents[0].content).imgBackColor+';"><div id="gome-top-ad" impUrl_batch="'+data_ad[t].batchImpUrl+'"><a href="'+strToJson(Data_i).clickUrl+'" data-code="ad'+data_ad[t].slotId+'-'+ data_ad[t].adContents[0].adId+'" target="_blank" ><img src='+strToJson(Data_i).resourceUrl+' /></a><a class="gome-top-close" href="javascript:void(0)"><i>关闭</i></a></div></div>');
                                    $(".gome-top-close").click(function(){ //关闭
                                        $("#gome-top-ad").fadeTo("slow", 0.01, function(){
                                            $(this).slideUp("slow", function() {
                                              $(this).remove();
                                            });
                                        });   
                                    })
                                    _img_arr.push(data_ad[t].adContents[0].batchImpParam);

                                }else if(data_ad[t].slotId == 10049){ //logo右侧                                    
                                    var obj_logo = $("#logo");
                                    obj_logo.after('<div id="logo-right-ad"><a href='+strToJson(Data_i).clickUrl+' data-code="ad'+data_ad[t].slotId+'" target="_blank"><img src='+strToJson(Data_i).resourceUrl+' /></a></div>');
                                    _img_arr.push(data_ad[t].adContents[0].batchImpParam);

                                    //头部热搜词
                                }else if(data_ad[t].slotId == 10050 || data_ad[t].slotId == 10051 || data_ad[t].slotId == 10052 || data_ad[t].slotId == 10053 || data_ad[t].slotId == 10054 || data_ad[t].slotId == 10055 || data_ad[t].slotId == 10056 || data_ad[t].slotId == 10057){ 

                                        _txt += '<a style=color:'+strToJson(Data_i).textColor+' data-code="ad'+data_ad[t].slotId+'" data-slotId='+data_ad[t].slotId+' href='+strToJson(Data_i).clickUrl+' target="_blank">'+strToJson(Data_i).text+'</a>';
                                        _img_arr.push(data_ad[t].adContents[0].batchImpParam);
                                        
                                }else if(data_ad[t].slotId == 10058 || data_ad[t].slotId == 10059 || data_ad[t].slotId == 10060){ //购物车下方轮播图
 
                                    _Sli += '<li class="hdS" imp="'+data_ad[t].adContents[0].impressionUrl+'" imp_batch="'+data_ad[t].adContents[0].batchImpParam+'" data-slotId='+data_ad[t].slotId+'><a data-code="ad'+data_ad[t].slotId+'" href='+strToJson(Data_i).clickUrl+' target="_blank"><img src='+strToJson(Data_i).resourceUrl+'></a></li>';
                                }
                            }
                        }
                        if(_txt!=""){
                            var topSearch = $("#topSearchHover");
                            //topSearch.after('<div class="hotkeyword"></div>');
                            $(".hotkeyword").prepend(_txt);
                        }
                        if(_Sli!=""){
                            var Mainnav = $(".mainnav"); 
                            Mainnav.after('<div class="Hscroll_out"><div class="Hscroll"><ul class="ul_list"></ul></div><div class="hdbtn"><a class="down" href="javascript:void(0);"><i></i></a><a class="up" href="javascript:void(0);"><i></i></a></div></div>');
                            $(".Hscroll .ul_list").prepend(_Sli);
                        }

                        $('.Hscroll').gScroll({
                            isAuto: true,
                            isImgLoad: true,
                            showNum: 1,
                            stepLen: 1,
                            speed: 6000,
                            type: 'vertical',
                            dataOriginal: 'gome-src',
                            btnGo: {left:'.down',right:'.up'},
                            nowindex:function(len){
                                if(len==1 || len==2){
                                    if($(".ul_list li").eq(len).hasClass("show")){
                                        return false;   
                                    }else{
                                        if($(".ul_list li[class=hdS]")){
                                            var imp_hdurl = $(".ul_list").children().eq(len).attr("imp")+'&contentType=3';
                                            $.ajax({
                                                type: "get",
                                                url: imp_hdurl,
                                                dataType: "jsonp",
                                                xhrFields: { withCredentials: true },
                                                crossDomain: true,
                                                jsonp: 'callback',
                                                jsonpName: 'ad_hdS'+(parseInt(Math.random(802547) *100000)),
                                                success:function(data){
                                                    $(".ul_list li").eq(len).addClass("show");
                                                },
                                                error:function(XMLHttpRequest, textStatus, errorThrown){
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                        });

                        if(data_ad && typeof(data_ad) != undefined){ //焦点图
                            var Firstimg1 = $(".focus .focus_box li").eq(0);
                            var _li="";
                            var li3="";
                            function strToJson(str) {  //转换格式
                                return JSON.parse(str); 
                            }
                            function addFocus(){
                                 for(var i=0; i < data_ad.length; i++) {
                                    var content = strToJson(data_ad[i].adContents[0].content);
                                    if(data_ad[i].slotId) {
                                       if(data_ad[i].slotId == 10061 || data_ad[i].slotId == 10062){
                                            _li += '<li class="adver" style="background:'+strToJson(data_ad[i].adContents[0].content).imgBackColor+';" imp="'+data_ad[i].adContents[0].impressionUrl+'" data-slotId='+data_ad[i].slotId+'><a data-code="ad'+data_ad[i].slotId+'-'+ data_ad[i].adContents[0].adId+'" href="'+content.clickUrl+'" target="_blank"><img src='+content.resourceUrl+' /></a></li>';
                                       }else if(data_ad[i].slotId == 10063) {
                                            li3 = '<li class="adver"  style="background:'+strToJson(data_ad[i].adContents[0].content).imgBackColor+';" imp="'+data_ad[i].adContents[0].impressionUrl+'" data-slotId='+data_ad[i].slotId+'><a data-code="ad'+data_ad[i].slotId+'-'+ data_ad[i].adContents[0].adId+'" href="'+strToJson(data_ad[i].adContents[0].content).clickUrl+'" target="_blank"><img src='+strToJson(data_ad[i].adContents[0].content).resourceUrl+' /></a></li>';
                                       }                                 
                                    }
                                }
                                Firstimg1.after(_li);
                                var Firstimg4 = $(".focus .focus_box li").eq(3); //实时获取第四帧元素
                                if(li3 && $(".focus .focus_box li").length>3 ){
                                    Firstimg4.after(li3);
                                } 
                                focusInit();
                            };

                            addFocus();
                        }else{

                            focusInit();
                        }

                        //批量曝光 1,顶通 2, logo右侧 3,8个热搜词 4,购物车下方第一张图片
                        if($(".Hscroll_out li").hasClass("hdS")){ 
                            var imp_0_atr = $(".Hscroll_out li").eq(0).attr("imp_batch");  //购物车下方第一张图片
                            _img_arr.push(imp_0_atr);  
                        }else{
                            _img_arr; 
                        }
                        var allbatchurl = $("#gome-top-ad").attr("impurl_batch");
                             // 其他浏览器会使用下面的请求方式
                            var Impdata = false;
                            clearTimeout(t);//清除之前的定时器
                            function PostImp(){
                                var batchImp = $.ajax({
                                    //url: _img_arr[0], 
                                    url: allbatchurl+_img_arr+'&contentType=3', 
                                    type: "get",
                                    dataType: "jsonp",
                                    jsonp: 'callback',
                                    success: function(data){
                                        Impdata = true;
                                    },
                                    error: function() {
                                        Impdata = true;
                                    }
                                })
                            }
                            var t=setTimeout(function() { //设置定时器
                                PostImp();
                            },4000)     
                            //页面关闭时
                            $(window).unload(function(){ 
                                !Impdata && PostImp();
                            });
                        //}
                    }else{

                    }
                },
                error:function(XMLHttpRequest,status){
                    ajaxTimeout_ad.abort();
                    window['ad_post'] = function(){
                        delete window['ad_post'];
                    };
                    focusInit();
                    Float_logo();
                     //广告超时统计
                    $.ajax({
                        //url: "//shareserver-pre.gomeplus.com/monitor?reqId=''&reqCostTime=800",
                        url: "//shareserver.gome.com.cn/monitor?reqId=''&reqCostTime=800",
                        type: "get",
                        dataType: "jsonp",
                        //jsonp: 'callback',
                        success: function(data){
                        },
                        error: function() {
                        }
                    })
                }
            });
        //}
        return data_ad;
    })(); 
}else{
    focusInit(); //焦点图调用
    //插入蒙层结构
    if(layerdata && typeof(layerdata) != "undefined" && (layerdata).length>0){
      var obj_top = $("body.home .gome-top");
        obj_top.after('<div id="gome-layer-ad" ><a href="'+layerdata[0].href+'" data-code="'+layerdata[0].code+'" target="_blank" ><img src='+layerdata[0].src+' /></a></div>'); 
    }
    LayerInit_ad(); //广告蒙层调用
    //Float_logo(); //浮动广告调用
}
//}
