/**
 * 【真划算-美日必抢】
 * author dujiahui
 * time 2017-05-17
 */
$(function(){
    var tuanAjax = window.tuanAjax;
    var rushbuyTpl = new window.rushbuyTpl();
    var rushbuyCurrentTpl = rushbuyTpl.rushbuyCurrentTpl;
    //获取区域id
    var groupregion = $.cookie('atgregion');
    if (!groupregion) {
        groupregion = "11011400|北京北京市东城区东城区|11010000|11000000|110114001";
    }
    var groupregions = groupregion.split("|"),
        citycode = groupregions[2];
    var RobLive = function (){
        this.init();
    };
    RobLive.prototype={
        init:function(){
            var needId = this.getUrlParam("itemId");
            this.linkData($(".nav_hover").attr("rank"),needId);
            this.getTime();
            this.across();
        },
        /**
        * @description 明日预售想买
        * @method navInit
        * @since 2017-05-17
        * @author dujiahui
        */
        navInit: function (itemId,cookieCmpt,cookieName,$_this){
            $.ajax({
                url:'//ajaxtuan'+cookieDomain+'/cheap/addWantBuy?itemId='+itemId+'&cmpt='+cookieCmpt+'&callback=wantBuy',
                dataType:'jsonp',
                type:'get',
                jsonpName:'wantBuy',
                success:function(data){
                    if(data.code == '200'){
                        $.cookie(cookieName,cookieCmpt);
                        $_this.siblings('span').text(data.data);
                        if(cookieCmpt=='Y'){
                            $_this.addClass('active');
                        }else{
                            $_this.removeClass('active');
                        }
                    }else{
                        console.log(data.description);
                    }
                }
            })             
        },
        /**
        * @description 拼接数据结构(商品+广告)
        * @method linkData
        * @since 2017-05-17
        * @author dujiahui
        */
        linkData:function(index,needId){
            var _this=this;
            var $currentConUl = $('.main_con ul').eq(index);
            var liModelid=$(".nav_ul li").eq(index).attr('modelid');
            $.ajax({
                type:"get",
                dataType:"jsonp",
                url:"//ajaxtuan"+cookieDomain+"/cheap/getRushBuyTimeGoods",
                data:{
                    callback:"currentRushbuy",
                    timeCode:index
                }
            }).done(function(result){
                if(result.message==="SUCCESS"){
                    var dataAll = result.data;
                    if(needId && dataAll[0].itemId!==needId){//如果url里面参数存在并且不是第一个
                        var dataNeed = '';
                        for(var i=0;i<dataAll.length;i++){
                            if(dataAll[i].itemId===needId){
                                dataNeed = dataAll[i];
                                dataAll.splice(i,1);
                                i=i-1;
                            }
                        }
                        if(dataAll[0].extend==="1" && dataNeed !==""){
                            dataAll.splice(1,0,dataNeed); 
                        }else if(dataAll[0].extend!=="1" && dataNeed !==""){
                            dataAll.splice(0,0,dataNeed);
                        }
                    }
                    var productData = dataAll;
                    var qianggou = _this.advertising();
                    var arrayAll,productOne,productTwo,productThree;
                    if(productData[0].extend==="1"){
                        arrayAll = _this.sliceData(productData,true);
                    }else{
                        arrayAll = _this.sliceData(productData,false); 
                    }
                    productOne = arrayAll.arrayOne;
                    productTwo = arrayAll.arrayTwo;
                    if(qianggou.top.length != 0){
                        var qianggTop = {"label":"adver","modelId":"8000020004","children":qianggou.top};
                        productOne.push(qianggTop);
                    }
                    if(qianggou.bottom.length != 0){
                        var qianggBottom = {"label":"adver","modelId":"8000020005","children":qianggou.bottom};
                        productTwo.push(qianggBottom);
                    }
                    productThree = arrayAll.arrayThree;

                    var data = productOne.concat(productTwo,productThree);
                    for(var i=0;i<data.length;i++){
                        data[i].modelid=liModelid;
                    }
                    //渲染页面
                    _this.tplRenderer(rushbuyCurrentTpl, {list:data}, $currentConUl);
                    $(".clickAgo .normal[itemid='nul']").html("").css("border","1px solid #fff");
                    _this.eachScreenDom();
                }    
            }).fail(function(){

            })
        },
        /**
        * @description 获取url指定的参数 
        * @method getUrlParam
        * @since 2017-05-25
        * @author dujiahui
        */
        getUrlParam:function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        },
        /**
        * @description 循环可视区域内的元素请求状态价格接口
        * @method eachScreenDom
        * @since 2017-11-24 修改bymi
        * @author dujiahui
        */
        eachScreenDom:function(){
            var _this = this;
            var itemString = _this.getScreenDom($(".clickAgo .nor"));
            //var itemString = $(".clickAgo .nor");
            itemString.each(function(){
                var $this=$(this);
                if($this.attr("already") != "true"){
                    var itemStr = $this.attr("itemid");
                   
                    if(itemStr !="nul" && itemStr !=""){
                        _this.priceData(itemStr,$this);
                    }
                }
                
            }) 
        },
        /**
        * @description 把商品数据数组,根据是否有超级秒杀,切割成三部分
        * @method sliceData
        * @param arr 商品数据数组,assign 是否有超级秒杀[true-有,false-没有](必传)
        * @since 2017-05-17
        * @author dujiahui
        */
        sliceData:function(arr,assign){
            var arrayOne=[],arrayTwo=[],arrayThree=[];
            if(assign===true){//有超级秒杀
                arrayOne = arr.slice(0,7);
                this.createUl(arrayOne,7);
                arrayTwo = arr.slice(7,15);
                this.createUl(arrayTwo,8);
                arrayThree = arr.slice(15);
            }else{
                arrayOne = arr.slice(0,8);
                this.createUl(arrayOne,8);
                arrayTwo = arr.slice(8,16);
                this.createUl(arrayTwo,8);
                arrayThree = arr.slice(16);
            }
            return{
                arrayOne:arrayOne,
                arrayTwo:arrayTwo,
                arrayThree:arrayThree
            }
        },
        
        createUl:function(arrS,max){
            if(arrS.length>0 && arrS.length<max){
                var arrayOneLen = max-arrS.length;
                if(arrayOneLen>=4){
                    for(var i=0;i<arrayOneLen-4;i++){
                        arrS.push({"itemId":"nul"});
                    }
                }else{
                    for(var i=0;i<arrayOneLen;i++){
                        arrS.push({"itemId":"nul"});
                    } 
                }   
            }   
            return arrS;     
        },

        /**
        * @description 处理广告(奇数的时候最后一排不显示)
        * @method advertising
        * @since 2017-05-17
        * @author dujiahui
        */
        advertising:function(){
            var qianggou = window.qianggou;
            var bottom = [];
            if(qianggou.top.length!==2){
                window.qianggou.top="";
            }
            if((qianggou.bottom.length%2)!==0){
                for(var i=0;i<Math.floor(qianggou.bottom.length/2)*2;i++){
                    bottom.push(qianggou.bottom[i]) 
                }
                qianggou.bottom=bottom;
            }
            return qianggou;
        },
        /**
        * @description 模板+数据渲染到指定的元素里的方法
        * @method tplRenderer
        * @param tpl 模板,data 数据,containor 指定元素(必传)
        * @since 2017-05-17
        * @author dujiahui
        */
        tplRenderer: function(tpl, data, containor) {
            var tempCompiler = template.compile(tpl),
                data = data || {}
                dataRenderedHtml = tempCompiler(data)
                containor && containor.html(dataRenderedHtml)
                //callback
                $.each(arguments, function(index, args) {
                    args instanceof Function && args()
                })

            return dataRenderedHtml
        },
        /**
        * @description 根据指定的id获取价格，状态，是否自营，已售百分比
        * @method priceData
        * @param itemStr id(一个) $this请求结果渲染到的指定元素(必传) 
        * @since 2017-05-17
        * @author dujiahui
        */
        priceData:function(itemStr,$this){
            var _this = this;
            $.ajax({
                type:"get",
                dataType:"jsonp",
                url:"//ajaxtuan"+cookieDomain+"/cheap/getCheapItemsStatus",
                data:{
                    callback:"getCheapItemsStatus",
                    itemIds:itemStr,
                    areaCode:citycode
                }
            }).done(function(ress){
                if(ress.data && ress.data[0]){ 
                    ress.data[0].cheapPrice = parseFloat(ress.data[0].cheapPrice).toFixed(2);
                    if(ress.data[0].gomePrd){
                        $this.find(".mi_title").addClass("gomeh");
                    }
                    $this.find(".mi_price span").html(ress.data[0].cheapPrice);
                    if(ress.data[0].priceDisplay == true){//划线价
                        $this.find(".mi_price del").html("¥"+ress.data[0].detailPrice);
                    }
                    if(ress.data[0].status == "notStarted"){
                        $this.find(".mi_content").addClass("jjks");
                        $this.find(".mi_num .word").html("精品尖货，敬请关注");
                        $this.find(".mi_right .jjks_btn").css("display","block");

                    }else if(ress.data[0].status == "terminate"){//手动结束的
                        $this.remove();

                    }else{
                        $this.find(".mi_num .word").html("已售"+ress.data[0].salePercent+"%");
                        $this.find(".mi_num .percent .sale").css("width",ress.data[0].salePercent+"px");
                        if(ress.data[0].status == "soldOut" || ress.data[0].status == "ending"){
                            $this.find("a").addClass("mi_gray_img");
                            $this.find(".mi_content").addClass("yjs");
                            $this.addClass("soldout");
                            if(ress.data[0].status == "soldOut"){
                                $this.find(".mi_img span").addClass("loot_img");
                                $this.find(".mi_right .yqg_btn").css("display","block");
                            }else{
                                $this.find(".mi_img span").addClass("mend_img");
                                $this.find(".mi_right .yjs_btn").css("display","block"); 
                            }
                            _this.grayscale($this.find("img"));   
                        }else{
                            $this.find(".mi_right .lijg_btn").css("display","block");
                        }
                    };
                    //商品名称
                    $this.find(".mi_name").html(ress.data[0].name);
                    $this.attr("already",true)
                }
            }).fail(function(){

            })
        },

        /**
        * @description 根据当前场次的时间戳计算倒计时
        * @method getTime
        * @since 2017-05-17
        * @author dujiahui
        */
        getTime: function (){   
            var curT = new Number($("#timeCurrent").val() || '0');      
            var endT = new Number($("#timeEnding").val() || '0');
            var $time = $(".current .timeInfo");
            if(endT != ""){
                if(curT<endT){
                    $.gTimer({
                        ct: curT,
                        et: endT,
                        iEven: function() {},
                        aEven: function() {
                            var hh=this.dt.format("$hh");
                            var mm=this.dt.format("$mm");
                            var ss=this.dt.format("$s");
                           /* 倒计时 */
                            if(hh === "00" && mm === "00" && ss === "00") {
                                $time.html("").siblings().html("已结束");
                                window.location.reload();
                            }else {
                                $time.html(hh + ':' + mm + ':' + ss);
                                $(".current .end").html("距离结束");
                            }
                        },
                        lEven: function() {}
                    });
                }else{
                }
            }
        },
        /**
        * @description 底部横广告渲染
        * @method across
        * @since 2017-05-18
        * @author dujiahui
        */
        across:function(){
            var rushbuyTpl = new window.rushbuyTpl();
            var qianggou = window.qianggou;
            this.tplRenderer(rushbuyTpl.across, {lis:qianggou.across}, $(".across"));

        },
        /**
        * @description 获取可视区域内的指定元素
        * @method getScreenDom
        * @since 2017-05-18
        * @author dujiahui
        */
        getScreenDom:function(focusDom){
            var screenAreaTop = $(document).scrollTop();
            var screenAreaBottom = $(document).scrollTop()+$(window).height();
            return $(focusDom).filter(function(){            
                var _h = $(this).offset().top;  //获取当前元素到文档顶端的距离
                if(_h >= screenAreaTop-340 && _h<=screenAreaBottom){
                    return true;
                }
                return false;
            });          
        },
        /*
        *@description 兼容IE10和IE11图片灰色滤镜
        * @method grayscale
        * @param { object|array } [image] DOM, DOMList, or jQuery wrapper
        * @since 2017-06-07
        * @author dujiahui
        **/
        grayscale: function(image) {
            var self = this;
            // 检测是否支持标准滤镜
            var isUnsupport = (function(){
                var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
                var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器 
                var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
                var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器 
                if (isIE){  
                    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");  
                    reIE.test(userAgent);  
                    var fIEVersion = parseFloat(RegExp["$1"]); 
                    console.log(isEdge) 
                    if(fIEVersion == 10 || fIEVersion == 11 || isEdge){
                        return true;
                    }else{
                        return false;
                    }  
                }else{
                    return false;
                }     
            })();
            // only IE10+ and not support filter
            if (image && isUnsupport == true) {
                if (image.length > 0) {
                    if (image.each) {
                        image.each(function() {
                            self.grayscale(this);
                        });
                    } 
                } else if (/img/i.test(image.tagName)) {
                    // 载入SVG滤镜
                    if (!document.grayscale) {
                        document.body.insertAdjacentHTML('afterBegin', '<svg version="1.1" xmlns="//www.w3.org/2000/svg" class="dn">\
                    <filter id="grayscale">\
                        <feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"/>\
                    </filter>\
                </svg>');
                        document.grayscale = true;
                    }

                    // 图片变SVG
                    var cl = image.className, src = image.src;
                    // 尺寸
                    var width = image.clientWidth, height = image.clientHeight;

                    if (!image.grayscale) {
                        image.insertAdjacentHTML('beforeBegin', '<svg id="beforeSvg" class="'+ cl +'"><image xmlns:xlink="//ww.w3.org/1999/xlink" xlink:href="'+ src +'" x="0" y="0" width="'+ width +'" height="'+ height +'" filter="url(\'#grayscale\')"></image></svg>');
                        image.grayscale=true;
                    }
                } 
                $(".mi_gray_img img.descriptImg").css("display","none");
                return this;
            }
        }    
    }
    var ro = new RobLive();
    /*初始化明日预售心的颜色*/
    $('.mb_presell .mpr_num a').each(function (){
        var $this = $(this);
        var cookieName = 'gome_groupon_cmpt_'+$this.data('itemid');
        if($.trim($.cookie(cookieName))=='Y'){
            $this.addClass('active');
        }
    })
    /*点击明日预售想买*/
    $('.mb_presell li').each(function (){
        var $this = $(this);
        $('.mpr_num a', $this).click(function(){
            var $_this = $(this);
            var itemId = $(this).data('itemid');
            var cookieName = 'gome_groupon_cmpt_'+itemId;
            var cookieCmpt = $.trim($.cookie(cookieName))=='Y' ? 'N' : 'Y';
            ro.navInit(itemId,cookieCmpt,cookieName,$_this);
        })
    })
    /*抢购场次tab切换*/
    $(".nav_ul li").on("click",function(){
        var orderer =$(this).attr("rank");
        var index =$(this).index();
        var $mainConUl = $(".main_con ul");
        var $currentConUl = $(".main_con ul").eq(index);
        $(this).addClass("nav_hover").siblings().removeClass("nav_hover");
        $currentConUl.addClass("clickAgo").siblings().removeClass("clickAgo");
        if($currentConUl.html()){
            $mainConUl.hide().eq(index).show();
        }else{
            ro.linkData(orderer);
            $mainConUl.hide().eq(index).show();
        }             
    })
    /*定时器鼠标滚动请求价格状态等*/
     var timer=null;
    $(window).scroll(function(){
    clearTimeout(timer);
        timer = setTimeout(function(){
            ro.eachScreenDom();
        },100)
    }) 
})


