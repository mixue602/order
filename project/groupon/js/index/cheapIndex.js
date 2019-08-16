/**
 * 【真划算-首页】
 * author dujiahui
 * time 2017-06-14
 */
 $(function(){
    var indexTpl = new window.indexTpl();
    var productTpl = indexTpl.productTpl;
    var errorTpl = indexTpl.errorTpl;
    var loadTpl = indexTpl.loadTpl;
    var btnTpl = indexTpl.btnTpl;
    var timer = "";
    var groupLi = $(".group_list li");
    var qidArr = [];//存放右侧商品itemid的数组
    //获取区域id
    var groupregion = $.cookie('atgregion');
    if (!groupregion) {
        groupregion = "11011400|北京北京市东城区东城区|11010000|11000000|110114001";
    }
    var groupregions = groupregion.split("|"),
        citycode = groupregions[2];
    var HomeLive = function(){
        this.init();
    };
    HomeLive.prototype = {
        init:function(){
            var _this = this;
            setTimeout(function(){_this.slider(0,400);},2000);
            // 右侧根据同步数据商品的id获取轮播时间数据
            $(".roof_slider_list").each(function(){
                qidArr.push($(this).data("itemid"));
            })
            var timerid = qidArr.join(",");
            //延迟两秒请求右侧倒计时数据接口
            //setTimeout(function(){
                _this.countdown(timerid);   
            //},2000);
        },
        /**
        * @description 倒计时接口
        * @method countdown
        * @since 2017-06-16
        * @author dujiahui
        */
        countdown:function(qId){
            var _this = this;
            $.ajax({
                type:"get",
                dataType:"jsonp",
                url:"//ajaxtuan"+cookieDomain+"/cheap/getTimeAndStatus",
                callback:"getTimeAndStatus",
                data:{
                    itemIds:qId
                }
            }).done(function(data){
                if(data.message == "SUCCESS" && data.code == 200){
                    var timerData = data.data;
                    for(var i = 0;i <timerData.length;i++){
                         _this.dealTime(timerData[i].currTime,timerData[i].endDate,timerData[i].startDate,timerData[i].status,i)
                    }
                }else{
                    console.log(data.description)   
                }
            }).fail(function(){
                console.log("接口不通");
            })   
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
        * @description 处理时间的方法
        * @method dealTime
        * @param currTime当前时间,endDate结束时间,startDate开始时间,status状态,i循环序号(必传)
        * @since 2017-06-16
        * @author dujiahui
        */
        dealTime:function(currTime,endDate,startDate,status,i){
            var curT = new Number(currTime || '0');      
            var endT = new Number(endDate || '0');
            var startT = new Number(startDate || '0')
            var $time = $(".roof_slider_list").eq(i);
            var $rooftime = $time.find(".roof_timer");
            if(endT != ""){
                if(status == "buying"){
                    $.gTimer({
                        ct: curT,
                        et: endT,
                        gap:100,
                        iEven: function() {},
                        aEven: function() {
                            var dd=this.dt.format("$dd")
                            var hh=this.dt.format("$hh");
                            var mm=this.dt.format("$mm");
                            var ss=this.dt.format("$s");
                            var SS=this.dt.format('$S');
                            SS=Math.floor(SS/100);
                           /* 倒计时 */
                            if(hh === "00" && mm === "00" && ss === "00") {
                                $rooftime.html('<h2>已结束</h2><div><i>00</i>:<i>00</i>:<i>00</i>:<i>00</i></div>');
                            }else {
                                $rooftime.html('<h2>还剩<em>' + dd + '</em>天</h2><div><i>' + hh + '</i>:<i>' + mm + '</i>:<i>' + ss + '</i>:<i>' + SS +'</i></div>');
                            }
                        },
                        lEven: function() {}
                    });
                }else if(status == "notStarted"){
                    var now = new Date(startT),
                    year=now.getYear(),
                    month=(now.getMonth()+1)<10?"0"+(now.getMonth()+1):(now.getMonth()+1),
                    date=now.getDate()<10?"0"+now.getDate():now.getDate(),
                    hour=now.getHours()<10?"0"+now.getHours():now.getHours(),
                    minute=now.getMinutes()<10?"0"+now.getMinutes():now.getMinutes();
                    $time.addClass("notstart");
                    $rooftime.html('<h2>未开始,</h2><p>' + month + '月' + date + '日&nbsp&nbsp' + hour+':'+ minute +'开抢</p>');
                }else if(status == "ending"){
                    $time.addClass("ending");
                    $rooftime.html('<h2>已结束</h2><div><i>00</i>:<i>00</i>:<i>00</i>:<i>00</i></div>');
                }else if(status == "soldOut"){
                    $time.addClass("soldout");
                    $rooftime.html('<h2>已卖光</h2><div><i>00</i>:<i>00</i>:<i>00</i>:<i>00</i></div>');
                }
            }
        },   
        /**
        * @description banner轮播
        * @method slider
        * @param index 当前轮播li的序号，time 图片淡入淡出的时间
        * @since 2017-06-20
        * @author dujiahui
        */
        slider:function(index,time){
            var groupLen = groupLi.length;
            clearInterval(timer);
            timer = setInterval(function(){
                var groupClsAttr = groupLi.eq(index).attr("class");
                groupLi.eq(index).find("img").attr("src",groupLi.eq(index).find("img").data("src"));
                groupLi.eq(index).fadeIn(time).siblings().fadeOut(time);
                $("#"+groupClsAttr).addClass("cur").siblings().removeClass("cur");
                index++;
                if(index>=groupLen){
                    index=0;
                }
            },5000)
        },
        /**
        * @description 轮播上一个 下一个的处理事件
        * @method btnEvent
        * @param btnType 按钮类型（pre 表示上一个）
        * @since 2017-06-20
        * @author dujiahui
        */
        btnEvent:function(btnType){
            clearInterval(timer);
            var num = $(".cur").index();
            if(btnType=="pre"){
                if(num==0){
                    num = groupLi.length;
                }
                num = num-1;

            }else{
                if(num==groupLi.length-1){
                    num = -1;
                }
                num = num+1;
            }
            var groupAttr = groupLi.eq(num).attr("class");
            groupLi.eq(num).find("img").attr("src",groupLi.eq(num).find("img").data("src"));
            groupLi.eq(num).fadeIn(400).siblings().fadeOut(400);
            $("#"+groupAttr).addClass("cur").siblings().removeClass("cur");
        }
    }
    var homeFn = new HomeLive();
    //如果右侧大于一个商品时，调滚动插件
    if(qidArr.length>1){
        $(".roof_slider").gSlider({
            type:'slideLeft',
            delayTime:5000,
            animateTime:500,
            control:{
                index:{ 
                    className:'roof_tab',
                    activeClassName:'current',
                    event:'mouseover' 
                },
                side:{
                    className:'btn',
                    prev:{
                        className:'pre',
                        html:'<span class="arrow"></span>'
                    },
                    next:{
                        className:'next',
                        html:'<span class="arrow"></span>'
                    }
                }
            }
        })
    }
    //返回deferred对象处理商品请求返回数据
    var getCategoryGoods = (function(){
        var goodsData = {};
        return function(num){
            return $.Deferred(function(defer){
                if(goodsData[num]){
                    defer.resolve(goodsData[num]);
                }else{
                    $.ajax({
                        type:"get",
                        dataType:"jsonp",
                        url:"//ajaxtuan"+cookieDomain+"/cheap/getCategoryGoods",
                        callback:"getCategoryGoods",
                        data:{
                            cateId:num,
                            areaCode:citycode
                        },
                        beforeSend:function(){
                            homeFn.tplRenderer(loadTpl, {}, $(".group_products_list"));
                        }  
                    }).done(function(data){
                        if(data.message=="SUCCESS" && data.code==200){
                            data.data.modelId = $(".group_products_list_"+num).attr("modelid");
                            goodsData[num] = data.data;
                            defer.resolve(data.data);
                        }else{
                            $(".product-waiting").html("该条件下暂无商品，去试试其他条件吧")
                            console.log(data.description)
                        }
                        
                    }).fail(function(){
                        defer.reject({});
                    })
                }
            }).promise();
        }
    })(); 
    //商品点击分类请求
    $(".classify_tab li").not(".classify_tab li.first").on("click",function(){
        $(this).addClass("cur").siblings().removeClass("cur");
        $(".group_pd_listfirst").hide();
        $(".group_products_list").show();
        var order = $(this).data("index");
        getCategoryGoods(order).done(function(data){
            homeFn.tplRenderer(productTpl, {lit:data}, $(".group_products_list"));
        }).fail(function(data){
            homeFn.tplRenderer(errorTpl, {lit:data}, $(".group_products_list"));
        })
    });
    $(".classify_tab li.first").on("click",function(){
        $(this).addClass("cur").siblings().removeClass("cur");
        $(".group_pd_listfirst").show();
        $(".group_products_list").hide();
    });
    //精选商品第一个标签内商品状态请求
    $(".group_pd_listfirst").gLoad({//图片懒加载
        df: 50,
        e: function() {
            var itemIdarr=[],
                dataitemId="";
            $(".group_pd_listfirst ul li").each(function(index,item){
                if($(item).attr("data-itemId") !=""){
                    itemIdarr.push($(item).attr("data-itemid"));
                }
            });
            dataitemId=itemIdarr.join(",");
            $.ajax({
                type: "get",
                //url:http://ajaxtuan.gome.com.cn/cheap/getCheapItemsStatus?itemIds=Q8800673253
                url:'//ajaxtuan'+cookieDomain+'/cheap/getCheapItemsStatus?itemIds='+dataitemId+'&areaCode='+citycode,
                dataType: 'jsonp',
                jsonpName: 'getpdstatus',
                jsonpCallback: 'getpdstatus',
                success: function (data) {
                    if(data.data && data.data.length >0){
                        $.each(data.data,function(i,datalists){  
                            for(var m in datalists){
                                $(".group_pd_listfirst ul li").each(function(index,items){
                                    //状态判断
                                    if($(items).attr('data-itemid') == datalists[m]){
                                        //{{if item.status=="ending"}}end{{else if item.status=="soldOut"}}sold{{else if item.status=="notStarted"}}notstarted{{/if}}
                                        if(datalists.status == "ending"){//结束

                                            $(items).attr("class","buying end"); 
                                            $(items).find(".prod_right").html('<a style="cursor:default">已结束</a>') 

                                        }else if(datalists.status == "soldOut"){//抢光

                                            $(items).attr("class","buying sold");
                                            $(items).find(".prod_right").html('<a style="cursor:default">已抢光</a>') 

                                        }else if(datalists.status == "notStarted"){//未开始

                                            $(items).attr("class","buying notstarted");  
                                            $(items).find(".count").html("精品尖货，敬请关注");
                                            $(items).find(".prod_right a").html('即将开始'); 

                                        }else{
                                            $(items).attr("class","buying");//进行中
                                        };
                                        //价格
                                        $(items).find(".price .now").html("<b>¥</b>"+datalists.cheapPrice);//现价
                                        if(datalists.priceDisplay == true){//划线价
                                            $(items).find(".price .cost").html("¥"+datalists.detailPrice);
                                        };
                                        //国美自营gomepdtip
                                        if(datalists.gomePrd == true){
                                            $(items).find(".gomepdtip").show();
                                        };
                                        //已售百分比
                                        $(items).find(".precent").html("已售"+datalists.salePercent+"%");
                                        $(items).find(".sale").html("<span style='width:"+datalists.salePercent+"px'></span>");
                                        //修改商品名称
                                        $(items).find(".prod_name").html(datalists.name);
                                    }
                                    

                                })
                            }
                        });
                    }
                },
                error:function (data) {
                    console.log(data);
                }
            })
        }
    });
    //商品数据失败之后点击刷新
    $(".errorBox .look").on("click",function(){
        var order = $(".classify_tab li.cur").data("index");
        getCategoryGoods(order).done(function(data){
            homeFn.tplRenderer(productTpl, {lit:data}, $(".group_products_list"));
        }).fail(function(data){
            homeFn.tplRenderer(errorTpl, {lit:data}, $(".group_products_list"));
        })                    
    })
    //移入移出文字tab,banner改变
    $(".slider_tab li").on({
        "mouseover":function(){
            clearInterval(timer);
            var tabId = $(this).attr("id");
            $("."+tabId).find("img").attr("src",$("."+tabId).find("img").data("src"));
            $("."+tabId).fadeIn(400).siblings().fadeOut(400);
            $(this).addClass("cur").siblings().removeClass("cur");
        },
        "mouseout":function(){
            homeFn.slider($(this).index()+1,400);
        }
    })
    //动态加入上一个 下一个结构
    if(groupLi && groupLi.length>1){
        $(".group_base").append(btnTpl);   
    }
    //点击btn上一个下一个的事件
    $(".btn_pre").click(function(){
        homeFn.btnEvent("pre");
    })
    $(".btn_next").click(function(){
        homeFn.btnEvent("next");
    })
    //移入btn清除定时器,移出btn事件轮播继续，从当前开始
    $(".btn").on({
        "mouseover":function(){
            clearInterval(timer);
        },
        "mouseout":function(){
            homeFn.slider($(".cur").index()+1,400);
        }
    })
    //鼠标滑到商品位置，才触发点击事件
    var sign = true;
    $(window).scroll(function () {
        var categoryTop = $(".group_classify").offset().top;
        if (categoryTop >= $(window).scrollTop() && categoryTop < $(window).scrollTop()+$(window).height()) {
            if(sign==true){
                sign=false;
                $(".classify_tab li").eq(0).trigger("click");        
            }
        }
    });    
})