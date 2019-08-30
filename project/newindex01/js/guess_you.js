;$(function(){
    var gomeIndex = {
    };
    /* 猜你喜欢ajax事件 */
    gomeIndex.guseeLike = function () {
        var boxid = "box20",
            cid = $.cookie("__clickidc"),  //cookieID
            uid = "",   //登录用户ID
            pid = "",
            c1n ="",
            c3n ="",
            brid ="",
            shopid ="",
            c1id = "",
            c3id ="",
            sid = "",
            imagesize = 120,
            area = $.cookie('atgregion') ? $.cookie('atgregion').split("|")[0] : "11011400";  //用户所在地区ID
        /*if(window.loginData.loginId){
         uid = window.loginData.loginId;
         };*/
        var ajaxTimeoutTest;
        var ajaxTimeoutTest = $.ajax({
            type: "get",
            url: "//bigd.gome.com.cn/gome/rec?boxid=" + boxid + "&pid=" + pid + "&area=" + area + "&cid=" + cid + "&uid=" + uid + "&imagesize=" + imagesize+ "&c1n=" + c1n + "&c3n=" + c3n + "&brid=" + brid + "&shopid=" + shopid + "&c1id=" + c1id + "&c3id=" + c3id + "&sid=" + sid,
            cache: false,
            dataType: "jsonp",
            timeout : 500, //超时时间设置，单位毫秒
            jsonpName: "callback",
            error:function(XMLHttpRequest,status){
                if(status=='timeout'){//超时,status还有success,error等值的情况
                    if(ajaxTimeoutTest){
                        ajaxTimeoutTest.abort();
                    }
                    $(".gm_guess").hide();
                    $('.gm_guess_js').remove();
                }
                $(".gm_guess").hide();
                $('.gm_guess_js').remove();
            },
            success: function (data) {
                if(data){
                    var data = data.lst;
                    if (data && data.length > 0) {
                        var likeTpl = '';
                        for (var i = 0, len = data.length; i < len; i++) {
                            var _li = '<li maima_param="'+ data[i].maima_param +'" productid="' + data[i].pid + '"><a rel="nofollow" target="_blank" title="' + data[i].pn + '" href="' + data[i].purl + '&frm=bigd" target="_blank"><img width="120" height="120" alt="' +
                                data[i].pn + '" src="//app.gomein.net.cn/images/grey.gif" data-lazy-init="' + data[i].iurl + '" data-lazy-img="0"/><p class="guess_title">' + data[i].pn
                                + '</p><p class="guess_price"><span class="yuan">¥</span>' + data[i].price + '</p></a></li>';
                            if (i==0) {
                                likeTpl+='<ul style="display: block">';
                                likeTpl += _li;
                            }else if (Math.floor(i%6)==0) {
                                likeTpl+='</ul><ul>';
                                likeTpl += _li;

                            }else if(i==len-1){
                                likeTpl += _li;
                                likeTpl+='</ul>';
                            }else{
                                likeTpl += _li;
                            }
                        }
                        $("#j-imgload-recomm").html(likeTpl);

                        $('.guess_main').lazyload({
                            source: "data-lazy-img"
                        });
                        $('.gm_guess').mySlider({
                            'content': '.gm_guess',
                            'item': '.guess_main ul'
                        });

                        $('.gm_guess_js').remove();
                        $(".gm_guess").show();
                    }else{
                        $(".gm_guess").hide();
                        $('.gm_guess_js').remove();
                    }
                }else{
                    $(".gm_guess").hide();
                    $('.gm_guess_js').remove();
                }
            }
            /*complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
             console.log("超时")
             　　　　if(status=='timeout'){//超时,status还有success,error等值的情况
             　　　　　 ajaxTimeoutTest.abort();
             $(".gm_guess").hide();
             $('.gm_guess_js').remove();
             　　　　}
             　　},*/

        });
    };

    gomeIndex.showOrder=function(){
        var boxid = "box23",
            cid = $.cookie("__clickidc"),  //cookieID
            uid = "",   //登录用户ID
            pid = "",
            c1n ="",
            c3n ="",
            brid ="",
            shopid ="",
            c1id = "",
            c3id ="",
            sid = "",
            imagesize = 210,
            area = $.cookie('atgregion') ? $.cookie('atgregion').split("|")[0] : "11011400";  //用户所在地区ID
        var ajaxTimeoutTest;
        var ajaxTimeoutTest = $.ajax({
            type: "get",
            url: "//bigd.gome.com.cn/gome/rec?boxid=" + boxid + "&pid=" + pid + "&area=" + area + "&cid=" + cid + "&uid=" + uid + "&imagesize=" + imagesize+ "&c1n=" + c1n + "&c3n=" + c3n + "&brid=" + brid + "&shopid=" + shopid + "&c1id=" + c1id + "&c3id=" + c3id + "&sid=" + sid + 'rec',
            cache: false,
            /* async:false,*/
            dataType: "jsonp",
            timeout : 500, //超时时间设置，单位毫秒
            jsonpName: "rec",
            success: function (data) {
                if(data){
                    var data = data.lst;
                    if (data && data.length > 0) {
                        var ranking = '',hot='';
                        var len = data.length;
                        for (var i = 0; i < len; i++) {
                            if(i==0){
                                ranking+='<div class="star"  maima_param="'+ data[i].maima_param +'" productid="' + data[i].pid + '">'+
                                '<a href="' + data[i].purl + '?frm=bigd" target="_blank" title="' + data[i].pn + '">'+
                                '<span></span>'+
                                '<img class="lazyloading" src="//app.gomein.net.cn/images/grey.gif" data-lazy-init="' + data[i].iurl + '" data-lazy-img="0" width="210" height="210"/>'+
                                '<p class="star_name">' + data[i].pn+ '</p>'+
                                '<p class="star_price"><b>¥</b>' + data[i].price + '</p></a></div>';
                            }else{
                                hot+='<li maima_param="'+ data[i].maima_param +'" productid="' + data[i].pid + '">'+
                                '<a href="' + data[i].purl + '?frm=bigd" target="_blank" title="' + data[i].pn+ '">'+
                                '<img class="lazyloading" src="//app.gomein.net.cn/images/grey.gif" data-lazy-init="' + data[i].iurl + '" data-lazy-img="0" width="120" height="120"/>'+
                                '<p class="hot_name">' + data[i].pn+ '</p>'+
                                '<p class="hot_price"><span>¥</span>' + data[i].price + '</p>'+
                                '<b>'+(i+1)+'</b></a></li>';
                            }
                        }
                        ranking+='<div class="hot_list"><ul>'+hot+'</ul></div>';
                        $('.hot_m').html(ranking);
                        $('.hotlist_js').remove();
                        $('.hotlist').lazyload({
                            source: "data-lazy-img"
                        });
                        $(".hotlist").show();
                    }else{
                        $('.hotlist_js').remove();
                        $(".hotlist").hide();
                    }
                }else{
                    $('.hotlist_js').remove();
                    $(".hotlist").hide();
                }
            },
            error:function(XMLHttpRequest,status){
                if(status=='timeout'){//超时,status还有success,error等值的情况
                    if(ajaxTimeoutTest) {
                        ajaxTimeoutTest.abort();
                    }
                    $('.hotlist_js').remove();
                    $(".hotlist").hide();
                    return false;
                }
            }
        });
    }
    $(".gm_guess_js").gLoad({
        df: 30,
        e:function(){
            gomeIndex.guseeLike();//不管登录与否都发请求，替换默认数据
        }
    })
    $(".hotlist_js").gLoad({
        df: 30,
        e:function(){
            gomeIndex.showOrder();//不管登录与否都发请求，替换默认数据
        }
    })
});

