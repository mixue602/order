
var getTuanStatusData = {
    ifNeedSync:true,//判断页面是否是可见的
    tuanClearTimer:null,//倒计时gTime插件清除事件绑定
    productType:1,//判断商品是团还是抢
    loginstatus:null,//判断是否登录
    doubleEleven:false,//是否有双十一防刷cookie
    doublenum:0//超时再次请求参照

}
var getTuanStatus={
    getGrouponStatus:function(areaCode,type,callback){//获取团购商品状态
        // /***/
        //   getTuanStatus.detailPriceAjax(200);//获取团购商品状态
        //   // getTuanStatus.getGrouponAddress();//获取团购商品地址
        //   // getTuanStatus.getGrouponTime();//获取团购商品倒计时时间 
        //   getTuanStatus.saleRemind();//开售提醒    
        // /***/      

        $.ajax({
            type: "get",
            //url:tuanAjax+'/cheap/getCheapItemsStatus?itemIds='+prdInfo.itemId+'',
            url:tuanAjax+'/cheap/getCheapItemsStatus?itemIds='+prdInfo.itemId+'&areaCode='+areaCode,
            dataType: 'jsonp',
            jsonpName: 'currentTime',
            jsonpCallback: 'currentTime',
            success: function (data) {
                tuanStatus = data.data[0].status;
                tuanDate=data.data;
                saleNum=data.data[0].saleNum;
                timers = data.data[0].time;
                if(getTuanStatusData.ifNeedSync == true){//页面刚进去发这几个请求，页签切换只发获取当前时间戳请求
                    getTuanStatus.detailPriceAjax(data.code);//获取团购商品状态
                    if(type==1){
                        getTuanStatus.getGrouponAddress();//获取团购商品地址
                    }
                    if(data.data[0].priceDisplay == true){//划线价purch-minor-text
                        $(".purch-minor-text").show();
                        $("#listPrice").html(data.data[0].detailPrice);
                    }else{
                        $(".purch-minor-text").hide();
                    }
                } 
                getTuanStatus.getGrouponTime();//获取团购商品倒计时时间 
                getTuanStatus.saleRemind();//开售提醒

                
                (callback && typeof(callback) === "function") && callback();
            },
            error:function (data) {
                console.log(data);
            }
        })
    },
    saleRemind:function(){
        var _this = this;
        $('.grd-purch-upcom .grd-nstate').on('click',function(){
            g.login(
                function(){
                    if(loginData.loginStatus==3){
                         prdMain.dialog({
                                inner: "#saleRemind", 
                                cssname: "dialogBox saleRemind",
                                unlock:false,
                                beforClose: function () { 
                                    if ($('.remind').css('display') == 'none') {
                                        $('.remind').show();
                                        $('.success').hide();
                                    }
                                    if($('.phone').hasClass('v_err')){
                                        $('.phone').removeClass('v_err');
                                    }
                                },
                                closeCall: function (){
                                    clearInterval(window.wish_timer);
                                    window.sec = 61;
                                },callback: function () {  
                                    var phone_warp = $('.remind .phone');
                                    var phone_input = $('#phoneInput');

                                    var errMsg = $('.errMsg');
                                    phone_input.on('blur',function(){
                                        _this.phoneValide();
                                      
                                    })
                                    phone_input.on('keyup',function(){
                                        var phone_warp = $('.remind .phone').removeClass('v_err');;
                                    })
                                    $('#btnConfirm').on('click',function(){
                                        var phoneVal = phone_input.val();
                                        if(!_this.phoneValide()){
                                            return false;
                                        };
                                        $.ajax({
                                            type: "GET",
                                            url:tuanAjax+'/cheap/sendTMess?itemId='+prdInfo.itemId+'&profileId='+loginData.loginId+'&sendAddress='+phoneVal+'&sendType=SMS',
                                            dataType: "jsonp",
                                            jsonpName: "getMobile",
                                            success: function (data) {
                                                if(data.message=='SUCCESS'){
                                                    if(data.data.type=='success'){
                                                        $('.remind').hide();

                                                        $('.success').show();
                                                        $('#remindtxt').html(data.data.message);
                                                    } else{
                                                        var info={"1":"手机号码有误，请重新输入！",
                                                        "2":"该手机号码已添加过此活动的提醒！",
                                                        "3":"每日短信提醒数量最多为50条， 您已达到最大限制值！",
                                                        "4":"操作过于频繁请稍后再试！"}
                                                        phone_warp.addClass('v_err');
                                                        $('.errMsg').html(info[data.data.num]);
                                                    }
                                                    
                                                } else{
                                                    alert('后台返回错误');
                                                }
                                             
                                            },
                                            error:function (data) {
                                                alert('请求失败');
                                            }
                                        });
                                        // _this.remind();
                                        
                                    })
                                    $('#btnCancel').on('click',function(){
                                        $("#close").click();
                                    })
                                    
                                }
                         })
                    }
                    
                }
            ); 
           
        })
    },
    phoneValide:function(){
        var reg_phone = /^1(3|4|5|7|8)\d{9}$/;
        //^(((1[3|8][0-9])|(14[5|7])|(15[^4,\\D])|(17[0|5|6|7|8]))\\d{8})$

        var phone_warp = $('.remind .phone');
        var phone_input = $('#phoneInput');
        var errMsg = $('.errMsg');
        if(!phone_input.val()){
            phone_warp.addClass('v_err');
            errMsg.html('手机号码不能为空!');
            return false;
        } else if(!reg_phone.test(phone_input.val())){
            phone_warp.addClass('v_err');
            errMsg.html('手机号码有误，请重新输入!');
            return false;
        }else{
            if(phone_warp.hasClass('v_err')) phone_warp.removeClass('v_err');
            return true;
        }

        
    },
    remind:function(){
        
    },
    getGrouponAddress:function(){//获取团购商品送货地址
        $('#address').gCity({
            gc_ads: 'chtm',
            gc_evt: function () {
                $.cookie('atgregion', this.xid + "|" + this.chtm + "|" + this.cid + "|" + this.sid
                + "|" + this.zid, {expires: 30, path: '/', domain: cookieDomain});
                var a=this.xid,b=this.cid,c=this.zid;
                getTuanStatusData.ifNeedSync = true;
                getTuanStatus.getGrouponStatus(this.cid,2,function(){

                    getTuanStatus.getExactGroup(a,b,c,1);


                }); //判断团购商品有货无货，对应的运费提示信息
                getTuanStatus.getPrice(this.cid);//获取原商品价格
                 //重新同步当前时间，解决setinterval的bug
                clearInterval(getTuanStatusData.tuanClearTimer);
            }
        });
        var groupregion = $.cookie('atgregion');
        if (!groupregion) {
            groupregion = "11011400|北京北京市东城区东城区|11010000|11000000|110114001";
        } else {
            var groupregions = groupregion.split("|");
        }
        var groupregions = groupregion.split("|");
        var a = groupregions[0];
        var b = "";
        var c = groupregions[4];
        if (groupregions[2]) {
            b = groupregions[2];
        }
        if (groupregions.length != 5 || groupregions[4] == "undefined") {
            c = groupregions[0] + "1";
        }
        getTuanStatus.getExactGroup(a, b, c);//判断团购商品有货无货，对应的运费提示信息
		getTuanStatus.getPrice(b); //获取原商品价格
    },
    detailPriceAjax:function(teststatus){//获取团购商品价格
        // /***/
        // var tuanDate;
        // if(tuanDate){tuanDate=tuanDate} else{tuanDate="notStarted";var tuanStatus ="notStarted"}
        // /***/
        if (teststatus != 200 || typeof (tuanDate) == 'undefined') {
            return false;
        }
        if (tuanDate) {
            if (tuanStatus == "notStarted") {
                $(".item-purch").attr("class","").addClass("item-purch grd-purch grd-purch-upcom clearfix");
                $('.grd-nstate').html('开售提醒');
            } else if (tuanStatus == "buying") {
                $(".item-purch").attr("class","").addClass("item-purch grd-purch clearfix");
                $(".grd-sales").html('<span class="light">'+saleNum+'</span>人已购');
                $('.grd-nstate').html('<a class="grd-gogb" data-type="1">马上抢</a>');
            } else if (tuanStatus == "soldOut") {
                $(".item-purch").attr("class","").addClass("item-purch grd-purch grd-purch-end clearfix");
                $('.grd-nstate').html('已卖光');
            } else if (tuanStatus == "areaSoldOut") {
                $(".item-purch").attr("class","").addClass("item-purch grd-purch grd-purch-end clearfix");
                $('.grd-nstate').html('该区域已卖光');
            }else if (tuanStatus == "ending") {
                $(".item-purch").attr("class","").addClass("item-purch grd-purch clearfix grd-purch-end");
                $('.grd-nstate').html('已结束');
                $(".grd-sales").html('<span class="light">'+saleNum+'</span>人已购');
            }
        }
    },
    getStatus:function(){//获取团购商品参数
        var ss = tuanStatus + "|"+prdInfo.skuNo+"|"+prdInfo.skuType+"|"+prdInfo.shelfCtgy3+"|"+prdInfo.sku+"|"+prdInfo.prdId+"";
        return ss;
    },
    //马上够对应的购物车地址
    jsonpAddCart:function (iid, pid, sid,avoid) {
        if(prdInfo.itemType ==null || prdInfo.itemType==undefined){
            prdInfo.itemType==1;
        }
        if(prdInfo.itemType==1){
            var _href='//cart'+cookieDomain+'/groupOn/cart';
            var url = '//cart'+ cookieDomain +'/groupOn/api/cart/'+avoid+'/addToCart';
            var addCartData = {"type":"9","sid":sid,"pid":pid,"spid":iid,"pcount":"1","r":new Date().getTime()};
        }else if(prdInfo.itemType==2){
            var _href= '//cart'+cookieDomain+'/rushBuy/cart';
            var url = '//cart'+ cookieDomain +'/rushBuy/api/cart/'+avoid+'/addToCart';
            var addCartData = {"type":"7","sid":sid,"pid":pid,"spid":iid,"pcount":"1","_r":new Date().getTime()};
        }
        $.createProgress({
            Jump:false,//不跳转
            url:url,
            data:addCartData ,
            callback:function(data){
                if (data.success) {//添加成功
                    window.location.href = _href;
                }else {
                    groupBase.bombBox(data.errMsg);

                }
            }                        
        });       
        
    },

    //获取加入购物车接口(前提判断登录状态)
    popLogin_addCart:function(){
        if(getTuanStatusData.loginstatus && getTuanStatusData.doubleEleven){//已登录，直接请求购物车
            getTuanStatus.doubleelevenaddcart();
        }else{//未登录，先登录，然后在请求双十一防刷cookie,成功后再请求购物车
            g.login(
                function () {
                    //console.log('ss:'+getTuanStatusData.doubleEleven)
                    getTuanStatus.getdoubleElevencookie(getTuanStatus.doubleelevenaddcart);
                }
            );
        }
    },
    doubleelevenaddcart:function(){//取到双11防刷cookie,然后添加购物车
        var avoid = $.cookie('CART_TQ_DU');
       // console.log(avoid)
        getTuanStatus.jsonpAddCart(prdInfo.itemId, prdInfo.prdId, prdInfo.sku,avoid);
    },
	getPrice:function(zid){//获取原商品价格
	 var url = tuanAjax+"/cheap/getSkuPrice";
	 $.ajax({
            type: "GET",
            url: url,
            async: true,
            cache: false,
            dataType: "jsonp",
            jsonpName: "getSkuPrice",
			data:{"skuId":prdInfo.sku,"code":zid},
            success: function (data) {
				if(data.message !="" || data.message !== undefined && data.message =="SUCCESS"){
					var orgprice = '对比原商品<span class="simsun">>></span>';
					$(".compare-link").html(orgprice);
				}
				}
			
			});
	},
    getExactGroup:function(xid, zid, cid,type){//判断团购商品有货无货，对应的运费提示信息
        if(type !=1){
            var pstatus = getTuanStatus.getStatus(); //获取团购商品参数
            var gstatus = pstatus.split("|");
            var isShopPrd = '0';
            gstatu = gstatus[0];
        }else{
            gstatu =tuanStatus;
        }
        //对即将开始的 和正在抢购的处理有货无货
        if (gstatu == "notStarted" || gstatu == "buying") {
            if (citys.length > 3 && citys.indexOf(zid) < 0) {
                $(".prdstock").html("暂不可送");
                $(".arrive-time").hide();
                $("#groupDelivery").html('');
                $(".item-purch").addClass("grd-purch-nogs");
                $(".grd-gogb").unbind("click");
            } else {
                  
                var url ="//ss"+cookieDomain+"/item/v1/grouponDetailAsyn/stockdelivery/"+prdInfo.prdId+"/"+prdInfo.sku+"/N/"+xid+"/"+cid+"/flag/item/exact";
                $.ajax({
                    type: "GET",
                    url: url,
                    async: false,
                    cache: false,
                    dataType: "jsonp",
                    jsonpName: "exact",
                    jsonpCallback: "exact",
                    success: function (data) {
                         if(data.success && data.success ==true ){
                                var isGood =(data.result&&data.result.stock&&data.result.stock.status)||false;
                                var isPreSell =(data.result&&data.result.stock&&data.result.stock.presell)||false;
                                if (isPreSell == false) {
                                    if (isGood == false) {
                                        $(".prdstock").html("暂不可送");
                                        $(".arrive-time").hide();
                                        $("#groupDelivery").html('');
                                        $(".item-purch").addClass("grd-purch-nogs");
                                        $(".grd-gogb").unbind("click");
                                    } else if (isGood == true) {
                                        $(".item-purch").removeClass("grd-purch-nogs");
                                        $(".grd-gogb").on("click",function () {
                                            $(this).attr("data-status",'alreay');
                                            //加入购物车
                                            getTuanStatus.popLogin_addCart();
                                        });
                                        $(".prdstock").html("有货");
                                        $(".arrive-time").html('').show();

                                    }
                                } else if (isPreSell == true) {
                                    $(".prdstock").html("暂不可送");
                                    $(".arrive-time").hide();
                                    $("#groupDelivery").html('');

                                    $(".item-purch").addClass("grd-purch-nogs");
                                    $(".grd-gogb").unbind("click");
                                }
                                if(data.result&&data.result.gs){
                                    var icons = data.result.gs;
                                    if (icons.length > 0) {
                                        $("#groupDelivery").html('<span class="deli-tit">支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持：</span>');
                                        for (var i = 0; i < icons.length; i++) {
                                            var icon = icons[i].icon;
                                            var tip = icons[i].tip;
                                            if (icon == "cod-sale") {//货到付款
                                                $("#groupDelivery").append("<span class='deli-sup'><a title='支持送货时收款，可现金或POS机刷卡支付。' target='_blank' href='//help.gome.com.cn/article/232-0-0.html'><i class='ico-deli-df'></i>货到付款</a></span>");
                                            } else if (icon == "freedelivery") {//免运费
                                                $("#groupDelivery").append("<span class='deli-sup'><a target='_blank' href='//help.gome.com.cn/question/9.html' title='支付金额39元以上免运费，偏远地区支付金额99元以上免运费，大家电部分偏远区域收取少量远程费及过桥过路费。'><i class='ico-deli-free'></i>免运费</a></span>");
                                            } else if (icon == "cash-carry") {//自提
                                                $("#groupDelivery").append("<span class='deli-sup'><a title='您可就近选择国美门店，自行提取商品。' target='_blank' href='//help.gome.com.cn/question/37.html'><i class='ico-deli-zt'></i>自提</a></span>");
                                            } //else if (icon == "prd_quhuo_xsd") {//限时达
                                            //    $('#groupDelivery').append('<span class="deli-sup"><a rel="nofollow" href="//help.gome.com.cn/question/28.html#xsd" target="_blank" title ="" id="prd_quhuo_xsd"><i class="ico-deli-xsd"></i>限时达</a></span>');
                                            //} else if (icon == 'prd_quhuo_jsd') {//即时达
                                            //    $('#groupDelivery').append('<span class="deli-sup"><a rel="nofollow" href="//help.gome.com.cn/question/28.html#jsd" target="_blank" title ="" id="prd_quhuo_jsd"><i class="ico-deli-jsd"></i>计时达</a></span>');
                                            //}
                                        }
                                    } else {
                                        $("#groupDelivery").html('');
                                    }
                                }
                                if(data.result.arrival && data.result.arrival.length>0){
                                    var arri = data.result.arrival;
                                    if (gstatu == "buying") {
                                        var _str = {lt: '<', gt: '>', a034: '"', amp: '&', nbsp: ''}, _de = arri.replace(/#/g, 'a');
                                        arri = _de.replace(/&(.*?);/g, function (_e, _e1) {
                                            return _str[_e1] ? _str[_e1] : _e;
                                        });
                                        $(".arrive-time").html(arri);
                                    }
                                }
                        //限时达 即时达
                        //$("#groupDelivery").delegate("#prd_quhuo_jsd","mouseenter mouseleave",function(e){
                        //    if(e.type == "mouseenter"){
                        //        $('#jsd_tishi').show().css({
                        //            left: $('#prd_quhuo_jsd').offset().left,
                        //            top: $('#prd_quhuo_jsd').offset().top + 25
                        //        });
                        //    }else if(e.type == "mouseleave"){
                        //        $('#jsd_tishi').hide();
                        //    }else{}
                        //});
                        //$("#groupDelivery").delegate("#prd_quhuo_xsd","mouseenter mouseleave",function(e){
                        //    if(e.type == "mouseenter"){
                        //        $('#xsd_tishi').show().css({
                        //            left: $('#prd_quhuo_xsd').offset().left,
                        //            top: $('#prd_quhuo_xsd').offset().top + 25
                        //        });
                        //    }else if(e.type == "mouseleave"){
                        //        $('#xsd_tishi').hide();
                        //    }else{}
                        //})

                         }

                    },
                    error: function (response) {
                    }
                });
              $(".grd-insite-op").show();
            }
        } else {
            $(".prdstock").html("无货");
            $(".item-purch").addClass("grd-purch-nogs");
            $(".grd-gogb").unbind("click");
            $(".grd-insite-op").hide();
            $('#msCountdown').html("<a href='"+itemSite+"/"+prdInfo.prdId+"-"+prdInfo.sku+".html'>商城还有售卖，去商城看看>></a>");

        }
    },
    getDate:function(timmer){
        var newDate = new Date();
        newDate.setTime(timmer);
        var Y = newDate.getFullYear()
        var M = newDate.getMonth()+1;
        var d = newDate.getDate();
        var h = newDate.getHours();
        var m = newDate.getMinutes();
        if(M<10)
        {
            M="0"+M;
        }
        if(d<10)
        {
            d="0"+d;
        }
        if(h<10)
        {
            h="0"+h;
        }
        if(m<10)
        {
            m="0"+m;
        }
        var date =M+'月'+d+'日 '+h+':'+m;
        return date;
        // $icon.html('<div class="title_end">未开始，'+M+'月'+d+'日'+' '+h+':'+m+'开抢</div>');
    },
    getGrouponTime:function(){//获取团购商品倒计时时间
        var _this = this;
        var startDate = prdInfo.startDate;
        var endDate = prdInfo.endDate;
        var $cdown = $('#msCountdown'), txt;
        if (startDate >= timers) { //未开始
            if(tuanStatus != "buying"){
                $cdown.html("<a href='"+itemSite+"/"+prdInfo.prdId+"-"+prdInfo.sku+".html'>商城还有售卖，去商城看看&gt;&gt;</a>");
                if(tuanStatus=="notStarted"){
                    $cdown.append('<p class="remindTime">预计 '+_this.getDate(startDate)+' 开售</p>')
                }
            }
            getTuanStatusData.tuanClearTimer = $.gTimer({ct: timers, et: startDate, gap: 100, aEven: function () {
                if (tuanStatus == "buying") {
                    if (this.dt.format('$dd') >= 3) {
                        $cdown.html("距离开团三天以上");
                    } else {
                        $cdown.html(this.dt.format("距离开团<span class='cdTime'>$dd</span>天<span class='cdTime'>$hh</span>小时<span  class='cdTime'>$mm</span>分钟<span class='cdTime'>$ss.$SS</span>秒！"));
                        txt = $cdown.find('.cdTime').eq(3).text();
                        $cdown.find('.cdTime').eq(3).text(txt.substr(0, 4));
                    }
                }
                $(".grd-sales").hide();
            }, iEven: null, lEven: function () {
                window.location.reload();
            }});
        } else if (startDate < timers && timers < endDate) {
            if(tuanStatus != "buying"){
                $cdown.html("<a href='"+itemSite+"/"+prdInfo.prdId+"-"+prdInfo.sku+".html'>商城还有售卖，去商城看看&gt;&gt;</a>");
            }
            $(".grd-sales").show();
            getTuanStatusData.tuanClearTimer = $.gTimer({ct: timers, et: endDate, gap: 100, aEven: function () {
                var pstatus = getTuanStatus.getStatus(); //获取团购商品参数
                var gpstatus = pstatus.split("|");
                var statustime = "";
                if (tuanStatus != null) {
                    statustime = gpstatus[0];
                }
                if (tuanStatus == "buying") {
                    if (this.dt.format('$dd') >= 3) {
                        $('#msCountdown').html("还剩三天以上");
                    } else {
                        $cdown.html(this.dt.format("还剩<span class='cdTime'>$dd</span>天<span class='cdTime'>$hh</span>小时<span  class='cdTime'>$mm</span>分钟<span class='cdTime'>$ss.$SS</span>秒！"));
                        txt = $cdown.find('.cdTime').eq(3).text();
                        $cdown.find('.cdTime').eq(3).text(txt.substr(0, 4));
                    }
                }
            }, iEven: null, lEven: function () {
                window.location.reload();
            }});
        } else if (timers > endDate) {
            $('#msCountdown').html("<a href='"+itemSite+"/"+prdInfo.prdId+"-"+prdInfo.sku+".html'>商城还有售卖，去商城看看>></a>");

        }
    },
    getdoubleElevencookie:function(callbackname){//双11防刷
        var ajaxdoubleEleven = $.ajax({
            type: "get",
            //url:ajaxtuan.gome.com.cn/cheap/cheapByGroupRush/{userId}/{itemId}
            url:tuanAjax+'/cheap/cheapByGroupRush/'+loginData.loginId+'/'+prdInfo.itemId,
            timeout : 200, 
            dataType: 'jsonp',
            jsonpName: 'callback',
            jsonpCallback: 'gomedoubleEleven'+Math.floor(Math.random()*1000+1),
            success: function (data) {
                if(data.message == "SUCCESS"){
                    getTuanStatusData.doubleEleven = true;
                    setTimeout(function(){
                        getTuanStatusData.doubleEleven = false;//1小时后cookie过期
                    },3600000)
                    if(callbackname){
                        callbackname();
                    }
                }else{
                    if(getTuanStatusData.doublenum > 0){
                        if($(".grd-gogb").attr("data-status") == "alreay"){
                            groupBase.bombBox("忙疯啦！正在加速处理中，请稍后再试~");
                        }
                        return;
                    }else{
                        getTuanStatus.getdoubleElevencookie();
                        getTuanStatusData.doublenum++;
                    }
                    getTuanStatusData.doubleEleven = false;
                }
            },
            error : function(XMLHttpRequest,status){ //请求完成后最终执行参数
        　　　　if(status=='timeout'){//超时
                    if(getTuanStatusData.doublenum > 0){
                        if($(".grd-gogb").attr("data-status") == "alreay"){
                            groupBase.bombBox("忙疯啦！正在加速处理中，请稍后再试~");
                        };         
                        ajaxdoubleEleven.abort();
                        return;
                    }else{
                        getTuanStatus.getdoubleElevencookie();
                        getTuanStatusData.doublenum++;
                    }
        　　　　}
        　　}
        })
    },
    init:function(){
        var groupregion = $.cookie('atgregion');
        if (!groupregion) {
            groupregion = "11011400|北京北京市东城区东城区|11010000|11000000|110114001";
        } else {
            var groupregions = groupregion.split("|");
        }
        var groupregions = groupregion.split("|"),
            citycode = groupregions[2];
        getTuanStatus.getGrouponStatus(citycode,1);//获取团购商品状态

        //双11防刷
        setTimeout(function(){
            if(loginData && loginData.loginStatus == 3){
                getTuanStatusData.loginstatus = true;//已登录           
            }else{
                getTuanStatusData.loginstatus = false;//未登陆
            }
            if(getTuanStatusData.loginstatus){
                getTuanStatus.getdoubleElevencookie();//调用后端接口
            }
        },1000)
        
        
    }
};

getTuanStatus.init();


//获取最近浏览的商品加入cookie
recentlyBrowse.getRecentlyCookie(); 
/*判断当前的浏览页面可见性*/
if (typeof document.addEventListener === "undefined" || typeof document.visibilityState === "undefined") {
     //console.log( "当前浏览器不支持visibilitychange属性！" );
}else{
    document.addEventListener('visibilitychange',function(){
        if(document.visibilityState=='hidden') {
            getTuanStatusData.ifNeedSync = false;
        }else{
            var groupregion = $.cookie('atgregion');
            if (!groupregion) {
                groupregion = "11011400|北京北京市东城区东城区|11010000|11000000|110114001";
            } else {
                var groupregions = groupregion.split("|");
            }
            var groupregions = groupregion.split("|"),
                citycode = groupregions[2];
            //重新同步当前时间，解决setinterval的bug
            clearInterval(getTuanStatusData.tuanClearTimer);
            getTuanStatus.getGrouponStatus(citycode);//获取团购商品状态
            // getTuanStatusData.ifNeedSync = true;
        }
        
    });
}
