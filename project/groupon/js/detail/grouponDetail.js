;(function () {
    var ie6 = $.browser.msie && $.browser.version=="6.0";
    var  salePrice = parseInt($('#salePrice').width()*0.56);
    /*商品详情标签切换*/
    $('.grd-cont-detail').show();
    $('.grd-tab-li').click(function () {
        $(this).addClass('tab-cur').siblings().removeClass('tab-cur');
        var index = $(this).index();
        $('.grd-cont').eq(index).show().siblings('div').hide();
        var sTop = $(window).scrollTop();
        var tabs_top = $('#j-comment-section').offset().top;
        if (sTop > tabs_top) {
            $("html,body").animate({ scrollTop: tabs_top }, 100);
        }

    });
    /*去掉商品原价*/
    $('.compare-link').html('对比原商品<span class="simsun">&gt;&gt;</span>');

   /*tabs滚动至顶部固定*/
    function tabsScroll() {
        var scrollX = window.scrollX;
       //.grd-purch-end
        var MARGIN_RIGHT = 20;
        var PRICE_WIDTH = 120;
        var tabs_top = $('#j-comment-section').offset().top;
        var xNum = typeof window.scrollX == 'number'?window.scrollX:0
        var tabs_left = $('#j-comment-section').offset().left-xNum;
        var remind_left =$('.wbox').offset().left+$('.wbox').width()-$('.grd-nstate').width()-MARGIN_RIGHT-xNum;
        var price_left = remind_left-salePrice-40 ;
        var sTop = $(window).scrollTop();

        if (!ie6) {
            if($('.grd-purch-end').length){
                 if (sTop > tabs_top) {
                    $('.grd-tabs').addClass('fix-top').css('left', tabs_left);
                } else {
                    $('.grd-tabs').removeClass('fix-top').css('left', 0);
                }
            } else{
                if (sTop > tabs_top) {
                    $('.grd-tabs').addClass('fix-top').css('left', tabs_left);
                    if($('.grd-purch-nogs').length){
                        $('.grd-nstate').addClass('ungrd-nstatefixed').css({'left':remind_left,'z-index':9999});
                        $('.cur-price').addClass('ungrd-pricefixed').css({'left':price_left});
                    } else{
                        $('.grd-nstate').addClass('grd-nstatefixed').css({'left':remind_left,'z-index':9999});
                        $('.cur-price').addClass('grd-pricefixed').css({'left':price_left});
                    }
                } else {
                    $('.grd-tabs').removeClass('fix-top').css('left', 0);
                    if($('.grd-purch-nogs').length){
                        $('.grd-nstate').removeClass('ungrd-nstatefixed').css('right',0);
                        $('.cur-price').removeClass('ungrd-pricefixed').css('right',0);
                    } else{
                        $('.grd-nstate').removeClass('grd-nstatefixed').css('right',0);
                        $('.cur-price').removeClass('grd-pricefixed').css('right',0);
                    }

                }

            }
        }else {
            if (sTop > tabs_top) {
                $('.grd-tabs').eq(0).hide()
                    .end().eq(1).show().css({'top': sTop, 'left': tabs_left});
            }
            else {
                $('.grd-tabs').eq(1).hide()
                    .end().eq(0).show().css({'top': '0', 'left': '0'});
            }
        }
    }
    $(window).scroll(function () {
        tabsScroll();
    }).on('resize', function() {
        tabsScroll();
    });
    /*商品详情*/
    $.ajax({
        type: "GET",
        url: productDetailUrl,
        cache: false,
        dataType: "jsonp",
        jsonpName: 'jianjie',
        success: function (data) {
            $("#productDesc").html(data);
            $("#productDesc").find('img').css({'width':'100%'});
            $("#productDesc").find('img[gome-src]').gLoad({e: function () {
                $(this).attr('src', $(this).attr('gome-src')).removeAttr('gome-src');
            }});
        }
    });
    /*猜你喜欢*/
    var cid = $.cookie('__clickidc');
    var atgregion = $.cookie('atgregion');
    var shopid = prdInfo.vid;
    var brid = "";
    var area = null;
    var uid = "";
    var c1n = "";
    var c2n = prdInfo.catText;
    var c3n = "";
    var c1id = "";
    var c2id = "";
    var c2id = prdInfo.catId;
    var c3id = "";
    var param = "&";
    if (atgregion) {
        area = atgregion.split("|")[0];
    }else{
        area = 11010200;
    }
    if (window.loginData && window.loginData.loginId) {
        uid = window.loginData.loginId;
    }
    param = param + 'cid=' + cid + '&area=' + area + '&shopid=' + shopid + '&brid=' + brid + '&uid=' + uid + '&c1n=' + c1n + '&c2n=' + c2n + '&c3n=' + c3n + '&c1id=' + c1id + "&c3id=" + c3id + "&c2id=" + c2id;
    var boxid=prdInfo.itemType==1?'box71':'box51';//团购itemType=1，boxid=box71  抢购itemType=2，boxid=box51
    $(".grd-cmdty-r").gLoad({df:50,e:function(){       
        $.ajax({
            type: "GET",
            url: '//bigd'+cookieDomain+'/gome/rec?pid='+prdInfo.prdId+'&size=5&imagesize=260&boxid='+boxid+'&sid='+prdInfo.sku+''+param,
            dataType: "jsonp",
            jsonpName: "viewAndViewList",
            success: function (data) {
                var productList = data.lst;
                if (!productList || productList.length == 0) {
                    return false;
                }
                var liarray = [];
                liarray.push('<div class="grd-recom">');
                liarray.push('<div class="grd-store-box">');
                liarray.push('<p class="grd-store-tit">猜你喜欢</p>');
                liarray.push('</div>');
                $.each(productList, function (i, v) {
                    if(v.promotionId&&v.promotionId!='null'){ //如果商品属于团抢，则拼接对应的团抢地址
                        var purl="//tuan"+cookieDomain+"/deal/"+v.promotionId+".html?"+v.purl.split('?')[1];
                    }else{
                        var purl=v.purl;
                    }
                    liarray.push("<a href=\""+purl+"\" title=\""+v.pn+"\"  target=\"_blank\" ><img gome-src=\""+v.iurl+"\" src=\"//app.gomein.net.cn/images/grey.gif\" width=\"240\" height=\"240\" onclick='recTrack(\""+v.maima_param+"\")' /></a>");
                    liarray.push("<div class=\"grd-rec-info\" onclick='recTrack(\""+v.maima_param+"\")'>");
                    liarray.push("<p><a target=\"_blank\" title=\""+v.pn+"\" href=\""+purl+"\">"+v.pn+"</a></p>");
                    liarray.push("<p class=\"grd-rec-price\">");
                    liarray.push("<span class=\"yuan\">¥</span>&nbsp;<span class=\"price-2prd_tbox0\">"+v.price+"</span>");
                    liarray.push("</p>");
                    liarray.push('</div>');
                });
                liarray.push('</div>');
                $('#mboxDynamic').append(liarray.join(''));
            }
        });    
    /*精选商品*/
        $.ajax({
            //uat//ad-flitght.pre.ds.gome.com.cn:8080/flight?callback=gmADbox& area=【实时区域码值】&p=10102&catid=cat10000197&width_height=210-210&c=gmADbox&requestType=3
            //生产//flight.gome.com.cn/flight?callback=gmAdBox&area=【实时区域码值】&p=10102&catid=cat10000054&width_height=210-210&c=gmAdBox&_=1504515485736 &requestType=3
             type: "GET",
             //url: '//ad-flitght.pre.ds.gome.com.cn:8080/flight?p=10102&area='+area+'&catid='+prdInfo.nomalCatid+'&c=loadgomedsp&width_height=210-210&requestType=3',//uat
             url: '//flight'+cookieDomain+'/flight?p=10102&area='+area+'&catid='+prdInfo.nomalCatid+'&c=loadgomedsp&width_height=210-210&requestType=3',//生产
             dataType: "jsonp",
             jsonpCallback: "loadgomedsp",
             success: function (data) {
                 var productList = data;
                 if (!productList || productList.length == 0) {
                     return false;
                 }
                 var liarray = [];
                 var arryData = [];
                 liarray.push('<div class="grd-recom">');
                 liarray.push('<div class="grd-store-box">');
                 liarray.push('<p class="grd-store-tit">精选商品</p>');
                 liarray.push('</div>');
                 $.each(productList, function (i, v) {
                     var index=i+1;
                     liarray.push("<a href=\""+v.ldp+"\" title=\""+v.ds+"\"  target=\"_blank\" pm=\""+v.pm+"\" ><img gome-src=\""+v.src+"\" src=\"//app.gomein.net.cn/images/grey.gif\" width=\"240\" height=\"240\" pm=\""+v.pm+"\"/></a>");
                     liarray.push("<div class=\"grd-rec-info\" pm=\""+v.pm+"\">");
                     liarray.push("<p><a target=\"_blank\" title=\""+v.ds+"\" href=\""+v.ldp+"\">"+v.ds+"</a></p>");
                     liarray.push("<p class=\"grd-rec-price\">");
                     liarray.push("<span class=\"yuan\">¥</span>&nbsp;<span class=\"price-2prd_tbox0\">"+v.pr+"</span>");
                     liarray.push("</p>");
                     liarray.push('</div>');
                     arryData.push(v.pm);
                 });
                 liarray.push('</div>');
                 $('#selectedgoods').append(liarray.join(''));
                 //向广告平台发送前端曝光监测请求，监测PV
                 for(var i=0;i<arryData.length;i++){
                     $.get(arryData[i]);
                 }
             }
         });
    }});
    /*放大镜效果*/
    if($(".jqzoom").children().length)  $(".jqzoom").gMagnifier();
    /* 图片列表小图hover效果 */
    $(".j-pichover img").hover(function(){
        var b_url =$(this).attr("bpic");
        var r_url =$(this).attr("rpic");
        $(".j-bpic-b").attr("src",b_url);
        $(".j-bpic-b").attr("jqimg",r_url);
        $(".j-pichover img").removeClass("icur");
        $(this).addClass("icur");
    });


    /*放大镜小图滑动*/
    $(".spic-next").on("click",function(){
        var $cont = $(this).siblings('.pic-small').find('ul');
        if (!$cont.is(":animated")) {
            var len = $cont.find('li').length,
                sWidth = 64,
                maxLeft = 64 * (len - 5);
            if ($cont.position().left + maxLeft > 0) {
                $cont.animate({left: '-=' + 5 * sWidth}, 500);
            }
        }
    });

    $(".spic-prev").on("click",function(){
        var $cont = $(this).siblings('.pic-small').find('ul');
        if (!$cont.is(":animated")) {
            var len = $cont.find('li').length,
                sWidth = 64;
            if ($cont.position().left < 0) {
                $cont.animate({left: '+=' + 5 * sWidth}, 500);
            }
        }
    });

    /**颜色、版本、合约机  切换**/
    var changeGoods = function(){
        var wrapdiv=$('#salesProperty li');
        var str="",
            $this=this,
            arr=[],   //   所有的数组
            arr1=[],  //当前的主属性下的数组
            arra=[];  // 匹配到点击当前a 的相关的数组
            $this.jumpUrl=function(wrapdiv){
                var txt1="";
                wrapdiv.each(function(){
                    if($(this).find('a').hasClass('select')){
                        txt1+='&'+$(this).find('a.select').attr('alt');
                    }else{
                        txt1+='&';
                    }
                });
                txt1=txt1.substring(1);
                if(ColorVersion[txt1]){
                    location.href = tuanSite+"/deal/"+ColorVersion[txt1]+".html";
                    return  false;
                }
            };
            $this.getMaincorrelation_array=function(onecur,arr){ //获取和 'onecur' 字符串相关的 所有存在的商品数组
                var arr1=[]; //当前的主属性下的数组
                var regExpStr=new RegExp('^'+onecur+'&');
                //匹配主属性(颜色属性)下的所有数组  例如：regExpStr=/^丁香紫&/ arr1=["丁香紫&38&eee", "丁香紫&42&aaa", "丁香紫&41&fff", "丁香紫&44&999", "丁香紫&43&fff", "丁香紫&40&666"];
                $.each(arr,function(k,v){
                    if(regExpStr.test(v)){
                        arr1.push(v);
                    }
                });
                return arr1;
            };
            $this.defaultStyle=function(_thisall,arr1,k){ //对存在的属性进行样式设置 设置为可点击 clicks,不存在的属性设置 novison
                var arrs=[];
                //获取还存在的属性 例如（尺寸）
                $.each(arr1,function(j,n){
                    arrs.push(n.split('&')[k])
                });
                //对存在的属性进行样式设置 设置为可点击 clicks,不存在的属性设置 novison
                $.each(arrs,function(a,s){
                    _thisall.find('a').each(function(){

                        if($(this).attr('alt')==s){

                            $(this).addClass('clicks');
                            $(this).removeClass('novison');
                        }
                        if($(this).hasClass('select'))$(this).removeClass('clicks');   //带select的不能点击
                        if($(this).hasClass('novison'))$(this).removeClass('clicks');
                    });
                });
            };
            $this.getClickcorrelation_array=function(txt2,curindex,arr1){ //点击 clicks元素后，获取该属性元素所对应的存在商品的数组
                var arra=[];
                $.each(arr1,function(k,v){
                    var arrd=v.split('&');
                    $.each(arrd,function(a,s){
                        if(a==curindex && s==txt2){
                            arra.push(v);
                        }
                    });
                });
                return arra;
            };
            Array.prototype.unique2 = function(){  //数组去重
                this.sort(); //先排序
                var res = [this[0]];
                for(var i = 1; i < this.length; i++){
                    if(this[i] !== res[res.length - 1]){
                        res.push(this[i]);
                    }
                }
                return res;
            }

        str=$('#booleanMainsale').find('a.select').attr('alt');    // 选中的主属性的值
        $.each(ColorVersion,function(k,v){                          //arr 获取所有存在的商品数组
            arr.push(k);
        });

        //取点击后和主属性相关的存在商品的数组
        arr1=$this.getMaincorrelation_array(str,arr);
        wrapdiv.each(function(k,v){

            $(this).find('.prdLeft').each(function(){     //后台不给返回“版　　本”这种格式，只能自己搞；
                var txt=$(this).text();
                var txt2="";
                txt=txt.replace(/\s+/g,""); //去掉多余空格
                if(txt.length==3){
                    txt2=txt.substring(0,1)+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+txt.substring(1);
                }else if(txt.length==4){
                    txt2=txt.substring(0,1)+'&nbsp;&nbsp;'+txt.substring(1,2)+'&nbsp;&nbsp;'+txt.substring(2);
                }else{
                    txt2=txt;
                }
                $(this).html(txt2);
            });
            var _thisall=$(this);
            //对存在的属性进行样式设置 设置为可点击 clicks,不存在的属性设置 novison
            $this.defaultStyle(_thisall,arr1,k);

            //点击事件
            $(this).on('click','a.clicks',function(){

                $(this).addClass('select').parent().siblings().find('a').removeClass('select');

                wrapdiv.each(function(m){ //同级属性的参数可以切换点击
                    if(m!=0){
                        $(this).find('a').each(function(){
                            if(!$(this).hasClass('novison')){
                                $(this).addClass('clicks');
                            }
                        })
                    }
                });
                //点击看是否有足够的条件可以跳转
                 var curT=$this.jumpUrl(wrapdiv); //跳转
                 if(curT==false){
                    return  false;
                 }
                //不允许点击马上购
                $(".grd-gogb").unbind("click");
                //如果有很多属性，只点击了其中的几个，还有其他必选条件没有勾选完成，会导致不跳转
                //此时需要去掉其他li标签 里面 a标签的选中状态，重置其他其他必选条件的li样式
                $(this).parent().parent().parent().siblings('.nozhu').find('a').removeClass('select');

                arra=[]; //重置清空
                var txt2=$(this).attr('alt'), //获取当前点击的属性值
                curindex=$(this).parent().parent().parent().index();//获取当前点击的属性所属于哪一个li的索引值

                //点击 clicks元素后，获取该属性元素所对应的存在商品的数组
                arra=$this.getClickcorrelation_array(txt2,curindex,arr1);

                wrapdiv.each(function(z,x){
                    var arras=[],
                        _this=$(this);
                    $.each(arra,function(h,v){
                        arras.push(v.split('&')[z])
                    })
                    if(z!=0 && z!=curindex){
                        wrapdiv.eq(z).addClass('chooseVersion').find('a').addClass('novison')//.removeClass('select').removeClass('clicks');
                        $.each(arras,function(a,s){
                            _this.find('a').each(function(){
                                if($(this).attr('alt')==s){
                                    $(this).removeClass('novison');
                                    $(this).addClass('seclass');
                                }
                                if(wrapdiv.eq(z).hasClass('chooseVersion')){
                                    $(this).removeClass('clicks');
                                }
                            });

                        });
                    }
                    // 产品又提的小需求
                    //对于一个属性，其里面的值都为不可选的时候，不给它加上 chooseVersion 这个样式，表示这个不是必选条件，仍然可以跳转
                    var curlens= $(this).find('.prdRight a').length; //总a的个数
                    if($(this).find('.prdRight a.novison').length==curlens){ //不能选的个数等于li里所有的a的个数
                        $(this).removeClass('chooseVersion');
                    }
                });
            });
        });
        $('#booleanMainsale').on('click','a',function(i){    //点击主属性
            if($(this).hasClass('select')){                 //如果是选中的元素，点击后返回
                return false;
            }
            $(this).addClass('select').parent().siblings().find('a').removeClass('select');
            //点击后如果存在如下的颜色和尺寸，则会跳转到当前颜色和尺寸的详情页商品地址
            var curT=$this.jumpUrl(wrapdiv); //跳转
            if(curT==false){
                return  false;
            }

            //对于有多个属性，点击后不跳转做如下处理
            //不允许点击马上购
            $(".grd-gogb").unbind("click");
            //去掉主属性以外的其他选中的标签
            $(this).parent().parent().parent().siblings().removeClass('chooseVersion').find('a').removeClass('select');
            //取点击完主属性的值
            str=$(this).attr('alt');
            arr1.length=0; //清空一下arr1
            //取点击后和主属性相关的存在商品的数组
            arr1=$this.getMaincorrelation_array(str,arr);

            //对存在的属性进行样式设置 设置为可点击 clicks,不可点击的设置为novison;
            wrapdiv.each(function(k,v){
                if(k!=0){ //代表的是除了主属性外的其他属性 例如（尺寸，版本，大小）
                    //初始化默认都不可选
                    $(this).find('a').addClass('novison').removeClass('select');
                    //初始化默认都不可选
                    var _thisall=$(this);
                    //对存在的属性进行样式设置 设置为可点击 clicks,不存在的属性设置 novison
                    $this.defaultStyle(_thisall,arr1,k);
                }
            });
        });

        $('#salesProperty').on('click','li.chooseVersion a.seclass',function(){
            if($(this).hasClass('select')){ //点击已选中的不做任何处理
                return false;
            }
           //当前参数选中，其他同级属性参数不选中
            $(this).addClass('select').parent().siblings().find('a').removeClass('select');

            //点击看是否有足够的条件可以跳转
             var curT=$this.jumpUrl(wrapdiv); //跳转
             if(curT==false){
                return  false;
             }
             //如果还需要选中其他属性，则可以继续修改匹配参数的状态
            var curindex=$(this).parent().parent().parent().index();
            var indexArr=[],selectedArr=[],secarr=[];; //indexArr=[0,1,4,5] selectedArr=['黑','S','','','aaass','35654',''] indexArr 是选中的元素的li的索引值，组成的数组  selectedArr 是选中的元素拼接的数组 secarr最终能匹配选中元素的所有数组
            wrapdiv.each(function(){
                if($(this).find('a').hasClass('select')){
                    var value=$(this).find('a.select').attr('alt');
                    selectedArr.push(value);
                    indexArr.push($(this).index());
                }else{
                    selectedArr.push('');
                }
            });
            //满足所有勾选条件的数组加入 secarr
            $.each(arr1,function(k,v){  //v 黑&S&型号3&aaa&aaass&35654&
                var arrd=v.split('&');  //arrd ['黑','S','型号3','aaa','aaass','35654','']
                $.each(arrd,function(a,s){
                    var f=0;
                    for(var i=0;i<indexArr.length;i++){
                        f+= Number(selectedArr[indexArr[i]]==arrd[indexArr[i]]);
                    }
                    if(f==indexArr.length){ //满足所有勾选条件的数组加入 secarr
                        secarr.push(v);
                    }
                });
            });

            secarr=secarr.unique2(); //数组去重
            wrapdiv.each(function(z,x){
                var arras=[],
                    _this=$(this);
                $.each(secarr,function(h,v){

                    arras.push(v.split('&')[z])
                });

                if(_this.hasClass('chooseVersion')&& z!=curindex){ //除了当前的li，匹配其他名为chooseVersion的li不存在的属性加novison ,匹配的加seclass
                    wrapdiv.eq(z).find('a').addClass('novison').removeClass('seclass').removeClass('clicks');
                    $.each(arras,function(a,s){
                        _this.find('a').each(function(){
                            if($(this).attr('alt')==s){
                                $(this).removeClass('novison').addClass('seclass');
                            }
                        });
                    });
                }
            });
        });
        $('#booleanMainsale').find('a').removeClass('novison');
    }
    changeGoods();
    /**颜色、版本、合约机  切换 结束**/
    /*一键分享*/
    $(".share-op-tit").click(function(){
        $.ajax({
            url: '//js.gomein.net.cn/channels/jsshare/share.js',
            dataType: "script",
            cache: true
        }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
        }).done(function () {

            var tshare_tit=""+prdInfo.itemName+" -国美";
            var tshare_img="";
            $('.pic-small ul li').each(function(){
                var this_img_str=$(this).find('img').attr('src');
                tshare_img+=this_img_str+',';
            });
            tshare_img = tshare_img.substring(0,tshare_img.length-1);
            tshare_img=tshare_img.replace(/_50/g,'_360');
            _GmFxb.FxbDiv(1,location.href,tshare_tit,tshare_img,"","","","","","","","","","")

        });
    });
    /*添加团购收藏*/
    function groupCollection(loginId){
        $.ajax({
            type:"GET",
            url:"//ss"+cookieDomain+"/item/v1/groupon/"+loginId+"/"+prdInfo.itemId+"/flag/tuan/collec",
            async: false,
            cache: false,
            dataType:"jsonp",
            jsonpName:'collec',
            jsonpCallback:'collec',
            success: function(data){
                var colleStatus = $.trim(data.colleStatus);
                var groups = data.groupIds;
                var $fadd = $('.addtofav'),
                    gbfav_off = $('.group-assistant-collection').offset();
                var cLeft = $('.wbox').eq(0).offset().left + 495 - 225 + 'px',
                    cTop = $fadd.offset().top;
                //N:收藏失败  Y:收藏成功   C:已收藏过
                if(colleStatus == 'N'){
                    $(".collect-tw").css({'left':cLeft,'top':cTop -160+'px'}).show();
                    $(".save-tishi").html('收藏失败！');
                }else if(colleStatus == 'Y'){
                    $fadd.find('.ico-saddfav').clone().appendTo('body')
                        .css({'left':$fadd.offset().left,'top':$fadd.offset().top})
                        .animate({'left':gbfav_off.left+15,'top':gbfav_off.top},1000,'swing',function(){
                            $(this).remove();
                        });
                }else if(colleStatus == 'C'){
                    $(".collect-tw").css({'left':cLeft,'top':cTop -160+'px'}).show();
                    $(".save-tishi").html('您已收藏过该商品！');
                }
            }
        });
    }
    //加入真划算收藏
    $(".addtofav").click(function(){
        if(loginData&&loginData.loginStatus==3){ //如果已登录
            loginId=loginData.loginId;
            groupCollection(loginId);
        }else{                                  //如果未登录
            g.login(function(){
                loginId=loginData.loginId;
                groupCollection(loginId);
            });
        }
    });
    function closeColle(){
        $(".collect-tw").hide();
    }
    $('.ico-close16').click(function(){closeColle();});
    //向好友发出心愿二维码
    $('#showWish').click(function () {
        var gomeImgs=$('.tc').find('img[gome-src]');
        var gsrc=gomeImgs.attr("gome-src");
        if(gomeImgs!=""){
            gomeImgs.attr("src", gsrc);
            gomeImgs.removeAttr("gome-src");
        }
    });
})(jQuery);
