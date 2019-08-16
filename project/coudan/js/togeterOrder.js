;(function() {
    /*
        页面url说明：
            自营：有一个参数，http://coudan.gome.com.cn/?spid
            联营：有三个参数，http://coudan.gome.com.cn/?spid&crossShop=true&aid=xxx
                  有两个参数，http://coudan.gome.com.cn/?spid&crossShop=false
        url参数描述：
            spid：xxx(活动id)；
            crossShop：true/false(跨店铺促销/店铺内促销)；
            aid：xxx(跨店铺id)；

        页面初始加载请求数据渲染页面，根据url参数不同，请求对应的数据：
            ajax请求url：var ajaxPargam = ["//apis"+cookieDomain+"/p/cart",16,1,0,"",1,0,0,0,0,0];
                         ajaxPargam[0]： 地址
                         ajaxPargam[1]:  每页展示商品的个数 1-48
                         ajaxPargam[2]:  请求的页码 1-100
                         ajaxPargam[3]:  排序方式  0综合 10销量 20价格降序 21价格升序
                         ajaxPargam[4]:  (1)联营夸店铺，传店铺id  (2)自营或联营不夸店铺，传凑单id
                         ajaxPargam[5]:  是否为自营 (1)自营1 (2)联营2
                         ajaxPargam[6]:  是否跨店  (1)自营或者联营不跨店铺0 (2)联营跨店铺1
                         ajaxPargam[7]:  左侧筛选三级分类id 默认0
                         ajaxPargam[8]： 筛选的facetsID：默认0
                         ajaxPargam[9]： 自定义价格标识 (1)价格区间生效1 (2)价格区间不生效0
                         ajaxPargam[10]：价格区间  0x1000 200x500 500x*
                         ajaxPargam[11]：是否只展示有货：(1)仅显示有货1 (2)展示全部商品0
    */

    // 根据页面url的参数情况，处理ajaxPargam中的值
    var pageInfo = (function() { 
        // 获取url信息方法
        function getUrl_info(name) {
            var reg = new RegExp("(^|&)"+ name + "=([^&]*)(&|$)");
            var result = window.location.search.substr(1).match(reg);
            if(result != null) return unescape(result[2]);
            return null;
        };
        // 定义页面数据渲染请求
        var ajaxPargam = ["//apis"+cookieDomain+"/p/cart",16,1,0,"",1,0,0,0,0,0,1];//生产
        // var ajaxPargam = ["//api.search.gomeprelive.com.cn/p/cart",16,1,0,"",1,0,0,0,0,0,1];//4344
        switch(getUrl_info("crossShop")) {
            case null:
                ajaxPargam[4] = window.location.search.substr(1).split("&")[0];
                break;
            case "true":
                ajaxPargam[4] = getUrl_info("aid");
                ajaxPargam[5] = 2;
                ajaxPargam[6] = 1;
                break;
            case "false":
                ajaxPargam[4] = window.location.search.substr(1).split("&")[0];
                ajaxPargam[5] = 2;
                break;
            default:
                break;
        };
        // 返回页面数据
        return {
            ajaxPargam: ajaxPargam,
            coudanID : window.location.search.substr(1).split("&")[0],
            isCrossShop : ajaxPargam[6] == 1 ? true: false,  //作用：（1）购物车添加与获取商品购物车商品时 其中的一个参数，用于标识是否跨店铺;(2)删除商品时请求地址不同
            isGome:ajaxPargam[5]==1?true:false  //购物车添加商品与获取购物车商品时 设置不同参数
        };
    })();

    // 页面加载数据渲染模板,左侧分类和主商品
    var renderItem = function(data){
        //渲染左侧分类列表
        var screen_tpl = '\
        {{if content.category.categoryTree}}\
            {{each content.category.categoryTree}}\
                {{each $value.childs}}\
                    <div class="item">\
                    <h3 class="second-facet">\
                        <i></i><a href="javascript:void(0);">{{$value.name}}</a>\
                    </h3>\
                    <ul class="third-facet">\
                        {{each $value.childs}}\
                            <li><a href="javascript:void(0);" data-itemId="{{$value.id}}">{{$value.name}}</a></li>\
                        {{/each}}\
                    </ul>\
                </div>\
                {{/each}}\
            {{/each}}\
        {{/if}}\
        ';

        if(data.content.category && data.content.category.categoryTree.length > 0){
            var facet_tree = data.content.category.categoryTree;
        };
        if(facet_tree && facet_tree.length > 0) {
            var screen_HTML = templateSimple.compile(screen_tpl)(data);
            $("#screen").append(screen_HTML);
        }

        renderItem = (function(data){
            //渲染商品
            var item_TPL = '\
            {{if content.prodInfo && content.prodInfo.products}}\
                {{each content.prodInfo.products}}\
                    <li class="coudanItem">\
                        <div class="pList-pic">\
                            <a href="{{$value.sUrl}}" target="_blank"><img src="//img.gomein.net.cn/images/grey.gif" gome-src="{{$value.sImg}}_210.jpg" alt="{{$value.alt}}"></a>\
                        </div>\
                        <div class="pList-price" sid="{{$value.skuId}}" pid="{{$value.pId}}"></div>\
                        <div class="pList-name">\
                            <a href="{{$value.sUrl}}" target="_blank" title="{{$value.alt}}">{{$value.name}}</a>\
                        </div>\
                        <div class="pList-cart"><a class="addCart" data-sid="{{$value.skuId}}" data-pid="{{$value.pId}}" href="javascript:void(0);">加入购物车</a></div>\
                    </li>\
                {{/each}}\
            {{else}}\
                <li style="width: 100%;border: none;text-align: center;">相关凑单商品目前未显示，<a style="color:#006699" href="//www.gome.com.cn/">返回首页 &gt;</a></li>\
            {{/if}}\
            ';

            var item_HTML = templateSimple.compile(item_TPL)(data);
            $("#pList").empty().append(item_HTML);
            $("#product_number").html('<span>共<em class="nRed">'+data.content.pageBar.totalCount+'</em>个商品</span><span>'+(data.content.pageBar.pageNumber ? data.content.pageBar.pageNumber : 0)+'/'+data.content.pageBar.totalPage+'</span>');

            // 初始化mini分页按钮
            var curPage = data.content.pageBar.pageNumber,
                maxPage = data.content.pageBar.totalPage;
            $("#mp-prev,#mp-next").removeClass("mp-disable");
            if(curPage == 1) $("#mp-prev").addClass("mp-disable");
            if(curPage == maxPage) $("#mp-next").addClass("mp-disable");
            if(maxPage > 1) {// 设置底部分页插件
                $("#j-page").ucPager({
                    pageClass: "",
                    currentPage: pageInfo.ajaxPargam[2],
                    totalPage: data.content.pageBar.totalPage,
                    pageSize: 16,
                    clickCallback: function(curPage) {
                        pageInfo.ajaxPargam[2] = curPage;
                        getData().done(renderItem);
                        $(window).scrollTop(0);
                    }
                });
            }else {
                $("#j-page").empty();
            }

            $("#product-waiting").hide();
            return arguments.callee;
        }(data));
    };

    // 页面数据宣染请求
    var getData = function () {
        return $.get(pageInfo.ajaxPargam.join('/'),{from: "coudan"},$.noop,"jsonp").always(function() {
            $("#product-waiting").show();
        });
    };
    getData().done(renderItem);

    // facet操作
    $("#screen").on("click",".second-facet",function() {
        $(this).next(".third-facet").toggle(0,function() {//三级facet展示隐藏
            $(this).is(":hidden")?$(this).prev().find("i").removeClass('clc'):$(this).prev().find("i").addClass('clc');
            $(this).parent(".item").siblings().find(".third-facet").hide();
            $(this).parent(".item").siblings().find("i").removeClass('clc');

            // 点击三级分类主商品区域重新渲染
            $(this).on("click","a",function() {
                pageInfo.ajaxPargam[2] = 1;
                pageInfo.ajaxPargam[7] = $(this).data("itemid");
                getData().done(renderItem);
            });
        });
    });

    // 综合、销量、价格排序操作
    $(".filter-order-content li").click(function() {
        $(this).addClass("cur").siblings().removeClass("cur");
        pageInfo.ajaxPargam[2] = 1;
        pageInfo.ajaxPargam[3] = $(this).data("type");
        getData().done(renderItem);
        if($(this).data("type") == 20) {
            $(this).data("type",21).addClass("price-down").removeClass("price-up");
        }else if($(this).data("type") == 21) {
            $(this).data("type",20).addClass("price-up").removeClass("price-down");
        }
    });

    // 价格区间操作:1、固定价格；2、自定义价格
    $(".price-item li a").click(function() {//固定价格选择按钮
        $(this).parent().addClass("cur").siblings().removeClass("cur");
        pageInfo.ajaxPargam[2] = 1;
        pageInfo.ajaxPargam[9] = 1;
        pageInfo.ajaxPargam[10] = $(this).attr("data-range");
        $(".fc-btn-cancel").trigger("click");
        getData().done(renderItem);
    });
    $(".priceRange-input input").on({//价格输入
        focus: function() {
            $(this).parents(".price-input").addClass("filter-priceRange-click");
        },
        blur: function() {
            if($(this).val() == "") $(this).val("¥");
        },
        keyup: function() {
            $(this).val($(this).val().replace(/[A-Za-z`~!@#$%^&*_+=¥￥（）()<>?:"{}.,\/;'[\]！。，…——、·‘；—【】|？》《“：\\\-” \u4e00-\u9fa5]/g,""));
        }
    });
    $(".price-input").mouseleave(function() {//移出自定义价格区域
        $(this).removeClass("filter-priceRange-click");
        $(this).find(".priceRange-input input").trigger("blur");
    });
    $(".fc-btn-cancel").click(function() {//清除自定义价格按钮
        $(".priceRange-input input").val("¥");
    });
    $(".fc-btn-ok").click(function() {//确定按钮
        var priceRange = "";
        var minPrice = $("#fc-lowPrice").val();
        var maxPrice = $("#fc-highPrice").val();
        minPrice = (minPrice && minPrice != "¥")?minPrice:0;
        maxPrice = (maxPrice && maxPrice != "¥")?maxPrice:0;
        if(!minPrice && !maxPrice) {
            return;
        }else if(!minPrice && maxPrice) {
            priceRange = "0x" + maxPrice;
        }else if(minPrice && !maxPrice) {
            priceRange = minPrice + "x*";
        }else {
            priceRange = Math.min(minPrice, maxPrice) + "x" + Math.max(minPrice, maxPrice);
        }
        pageInfo.ajaxPargam[2] = 1;
        pageInfo.ajaxPargam[9] = 1;
        pageInfo.ajaxPargam[10] = priceRange;
        getData().done(renderItem);
        $(".price-item li").removeClass("cur");
        $(".price-input").trigger("mouseleave");
    });

    // mini分页
    $("#mp-next").click(function() {//下一页
        if(!$(this).hasClass('mp-disable')) {
            pageInfo.ajaxPargam[2] ++;
            getData().done(renderItem);
        }
    });
    $("#mp-prev").click(function() {//上一页
        if(!$(this).hasClass('mp-disable')) {
            pageInfo.ajaxPargam[2] --;
            getData().done(renderItem);
        }
    });

    /*
        1、商品价格重新获取
                接口：http://ss.gome.com.cn/item/v1/extra/command/detail/{pid}/{skuid}/{二级区域id}/flag/item/{回调callbackname}
        2、图片懒加载
    */
    function lazyLoad() {
        var minHeight = $(window).scrollTop() - 300,
            maxHeight = $(window).scrollTop() + $(window).height() + 300,
            bdarea_2 = $.cookie("atgregion")?$.cookie("atgregion").split("|")[2]:"11010000";

        $("#pList .pList-price").each(function(index,elem) {
            var _top = $(elem).parent().offset().top,
                _pid = $(elem).attr("pid"),
                _sid = $(elem).attr("sid");

            if(_top >0 && _top > minHeight && _top < maxHeight && !$(elem).prop("hasPrice") && _pid && _sid) {
                $.ajax({
                    type: "get",
                    url: "//ss"+cookieDomain+"/item/v1/extra/command/detail/"+_pid+"/"+_sid+"/"+bdarea_2+"/flag/item/fn"+index,
                    jsonpCallback: "fn"+index,
                    dataType: "jsonp",
                    success: function(data) {
                        if(data && data.success){
                            var priceContent = data.result.finalPrice?"¥"+data.result.finalPrice:"暂无售价";
                            $(elem).text(priceContent);
                            $(elem).prop("hasPrice",true);
                        }
                    }
                });
            }
        });

        $(".cOrder-r img").each(function(index,elem) {
            var _top = $(elem).offset().top;
            if(_top >0 && _top > minHeight && _top < maxHeight && $(elem).attr("gome-src") != "") {
                $(elem).attr("src",$(elem).attr("gome-src"));
                $(elem).attr("gome-src","");
            }
        });
    };
    setInterval(lazyLoad,1000);

    /*
        购物车：
            1、renderCartInfo：购物车内容相关模板；
            2、getCartInfo：添加购物车请求方法
                            url://cart"+cookieDomain+"/home/api/cart/addToCart
                            参数："type":18/21,  自营传18，联营传21
                                  "sid":sid || "",
                                  "pid":pid || "",
                                  "pcount":"1",
                                  "spid":pageInfo.coudanID，
                                  "crossShop":pageInfo.isCrossShop  只有联营传该参数
            3、删除购物车内商品操作；url://cart"+cookieDomain+"/home/api/cart/xxx   联营xxx=removeShopItemCD，自营xxx=removeItemCD
            4、购物车内商品左右滑动及购物车随页面滚动操作；
    */
    var renderCartInfo = function(data){
        return $.Deferred(function(defer){
            var _data = data.data
            var html_cartInfo_1 = '<div class="activity-title"></div>';
            var html_cartInfo_2 = '';
            var html_cartInfo_3 = '<div class="go-cart"><a href="//cart'+cookieDomain+'/home/cart" target="_blank">去购物车结算</a><i></i></div>';
            var html_cartItem = '';
            var tpl_cartItem = '{{each commerceItemVOs}}\
                                    <li class="cartItem">\
                                        <div class="c-img"><img src="//img.gomein.net.cn/images/grey.gif" gome-src="{{$value.itemImageURL}}"/></div>\
                                        <div class="c-price"><em class="num">¥{{$value.salePrice.toFixed(2)}}</em> x<em>{{$value.quantity}}</em></div>\
                                        <div class="c-remove" data-cid="{{$value.itemId}}">删除</div>\
                                    </li>\
                                {{/each}}';
            if(!_data) return;

            //if (_data.promotionDescription) $(".cOrder-crumb-activity a").text(_data.promotionDescription).attr("href",window.location.href);
            if (_data.desc) $(".cOrder-crumb-activity a").text(_data.desc).attr("href",window.location.href);

            if(_data.commerceItemVOs && _data.commerceItemVOs.length >= 0){
                html_cartItem = templateSimple.compile(tpl_cartItem)(_data);
                $("#cartList").empty().css("left",0).append(html_cartItem);
            }else{
                $("#cartList").empty().css("left",0)
            }
            if(!_data.satisfied){//促销不成立
                switch(_data.promotionType){
                    case "ManZeng_Promotion":
                        html_cartInfo_1 = '<div class="activity-title" style="background-position:-48px 0;"></div>';
                        break;
                    // case "ManFan_Promotion":
                    case "MUL_ZE_COUPONS"://多品满金额赠券促销
                        $(".cOrder-crumb-activity a").text("满返");
                        html_cartInfo_1 = '<div class="activity-title" style="background-position:-144px 0;"></div>';
                        break;
                    case "MUL_ZE_DO"://多品满金额赠豆促销
                        $(".cOrder-crumb-activity a").text("满返");
                        html_cartInfo_1 = '<div class="activity-title" style="background-position:-144px 0;"></div>';
                        break;
                    case "MUL_ZE_GIFTS"://多品满金额赠实物促销
                        $(".cOrder-crumb-activity a").text("满赠");
                        html_cartInfo_1 = '<div class="activity-title" style="background-position:-48px 0;"></div>';
                        break;
                    case "JJHG":
                        html_cartInfo_1 = '<div class="activity-title" style="background-position:-192px 0;"></div>';
                        break;
                    case "MZ":// 满折
                    case "ZDZ":
                        html_cartInfo_1 = '<div class="activity-title" style="background-position:-96px 0;"></div>';
                        break;
                    case "Coupon_promotion":
                        html_cartInfo_1 = '<div class="activity-title" style="background-position:-288px 0;"></div>';
                        break;
                   // case "ManMian_Promotion":
                    case "KDP_MM":
                        html_cartInfo_1 = '<div class="activity-title" style="background-position:-240px 0;"></div>';
                        break;
                    default : //ManJian_Promotion,ManZhe_Promotion,ZhengDanZhe_Promotion,ManMian_Promotion
                        $(".cOrder-crumb-activity a").text("促销");
                        html_cartInfo_1 ="";
                        html_cartInfo_3="";
                        break;
                }
                if(_data.promotionSkusProfile && _data.promotionSkusProfile.skuNum){
                    html_cartInfo_2 = '<div class="activity-price">已加入购物车的活动商品共<b class="nRed">'+_data.promotionSkusProfile.skuNum+'</b> 件，已选商品总计<b class="nRed">¥'+_data.promotionSkusProfile.total.toFixed(2)+'</b>元，满足条件后即可享受优惠</div>';
                }
            }else{
                switch(_data.promotionType){
                    case "ManZeng_Promotion":
                        html_cartInfo_1 = '<div class="activity-title" style="background-position:-48px 0;"></div>';
                        html_cartInfo_2 = '<div class="activity-price">已加入购物车的活动商品 共<b class="nRed">'+_data.promotionSkusProfile.skuNum+'</b> 件，已选商品总计<b class="nRed">¥'+_data.promotionSkusProfile.total.toFixed(2)+'</b>元，已享受赠品优惠</div>';
                        break;
                    // case "ManFan_Promotion":
                    case "MUL_ZE_COUPONS"://多品满金额赠券促销
                        // alert('多品满金额赠券')

                        var text_manfan = ""
                        var o_couponType = {
                            "RED":"元红券x",
                            "BLUE":"元蓝券x",
                            "SHOP":"元店铺券x",
                            "GOME":"元美券x"
                        }

                        for(var i = _data.returnedCouponCommerceItemVOs.length;i--;i>0){
                            var voucher = _data.returnedCouponCommerceItemVOs[i];
                            text_manfan += voucher.faceValue + o_couponType[voucher.type] + voucher.quantity+" ; ";
                        }
                        $(".cOrder-crumb-activity a").text("满返");
                        html_cartInfo_1 = '<div class="activity-title" style="background-position:-144px 0;"></div>';
                        html_cartInfo_2 = '<div class="activity-price">已加入购物车的活动商品共<b class="nRed">'+_data.promotionSkusProfile.skuNum+'</b> 件，已选商品总计<b class="nRed">¥'+_data.promotionSkusProfile.total.toFixed(2)+'</b>元，下单可返'+text_manfan+'</div>';
                        break;
                    case "MUL_ZE_DO"://多品满金额赠豆促销
                        //alert("多品满赠豆")
                        var text_manfan = _data.returnedCouponCommerceItemVOs[0].quantity;
                        $(".cOrder-crumb-activity a").text("满返");
                        html_cartInfo_1 = '<div class="activity-title" style="background-position:-144px 0;"></div>';
                        html_cartInfo_2 = '<div class="activity-price">已加入购物车的活动商品共<b class="nRed">'+_data.promotionSkusProfile.skuNum+'</b> 件，已选商品总计<b class="nRed">¥'+_data.promotionSkusProfile.total.toFixed(2)+'</b>元，下单可返'+text_manfan+'美豆</div>';
                        break;
                    case "MUL_ZE_GIFTS"://多品满金额赠实物促销
                        //alert('shiwu')
                        $(".cOrder-crumb-activity a").text("满赠");
                        html_cartInfo_1 = '<div class="activity-title" style="background-position:-48px 0;"></div>';
                        html_cartInfo_2 = '<div class="activity-price">已加入购物车的活动商品共<b class="nRed">'+_data.promotionSkusProfile.skuNum+'</b> 件，已选商品总计<b class="nRed">¥'+_data.promotionSkusProfile.total.toFixed(2)+'</b>元，可返回购物车选择赠品</div>';
                        break;
                    case "JJHG":
                        html_cartInfo_1 = '<div class="activity-title" style="background-position:-192px 0;"></div>';
                        html_cartInfo_2 = '<div class="activity-price">已加入购物车的活动商品共<b class="nRed">'+_data.promotionSkusProfile.skuNum+'</b> 件，已选商品总计<b class="nRed">¥'+_data.promotionSkusProfile.total.toFixed(2)+'</b>元，可返回购物车换购商品</div>';
                        break;
                    case "MZ":// 满折
                    case "ZDZ":
                        html_cartInfo_1 = '<div class="activity-title" style="background-position:-96px 0;"></div>';
                        html_cartInfo_2 = '<div class="activity-price">已加入购物车的活动商品 共<b class="nRed">'+_data.promotionSkusProfile.skuNum+'</b> 件，已选商品总计<b class="nRed">¥'+_data.promotionSkusProfile.total.toFixed(2)+'</b>元，已享受优惠<b class="nRed">'+_data.postPromotion+'</b>元</div>';
                        break;
                    case "Coupon_promotion":
                        html_cartInfo_1 = '<div class="activity-title" style="background-position:-288px 0;"></div>';
                        break;
                   // case "ManMian_Promotion":
                    case "KDP_MM":
                        html_cartInfo_1 = '<div class="activity-title" style="background-position:-240px 0;"></div>';
                        html_cartInfo_2 = '<div class="activity-price">已加入购物车的活动商品 共<b class="nRed">'+_data.promotionSkusProfile.skuNum+'</b> 件，已选商品总计<b class="nRed">¥'+_data.promotionSkusProfile.total.toFixed(2)+'</b>元，已享受优惠<b class="nRed">'+_data.postPromotion+'</b>元</div>';
                        break;
                    default : //ManJian_Promotion,ManZhe_Promotion,ZhengDanZhe_Promotion,ManMian_Promotion
                        // alert('default')
                        if(_data.promotionSkusProfile && _data.promotionSkusProfile.skuNum) {
                            html_cartInfo_2 = '<div class="activity-price">已加入购物车的活动商品 共<b class="nRed">' + _data.promotionSkusProfile.skuNum + '</b> 件，已选商品总计<b class="nRed">¥' + _data.promotionSkusProfile.total.toFixed(2) + '</b>元，已享受优惠<b class="nRed">' + _data.postPromotion + '</b>元</div>';
                        }
                        break;
                }
            }
            $("#cartInfo").empty().append(html_cartInfo_1+html_cartInfo_2+html_cartInfo_3);
        }).promise();
    }

    var getCartInfo = (function(){
        if(pageInfo.isGome){
            return function(sid,pid){
                return $.ajax({
                    type:"get",
                    dataType:"jsonp",
                    url:"//cart"+cookieDomain+"/home/api/cart/addToCart",
                    data:{
                        "type":18,
                        "sid":sid || "",
                        "pid":pid || "",
                        "pcount":"1",
                        "spid":pageInfo.coudanID
                    }
                })
            }
        }else{
            return function(sid,pid){
                return $.ajax({
                    type:"get",
                    dataType:"jsonp",
                    url:"//cart"+cookieDomain+"/home/api/cart/addToCart",
                    data:{
                        "type":21,
                        "sid":sid || "",
                        "pid":pid || "",
                        "pcount":"1",
                        "crossShop":pageInfo.isCrossShop,
                        "spid":pageInfo.coudanID
                    }
                })
            }
        }
    }());

    var cartListScroll = function() {
        var $cartListWarp = $("#cartListWarp"),
            $cartListBox = $("#cartList"),
            $btnPrev = $("#cartPrev"),
            $btnNext = $("#cartNext"),
            _currentIndex = 0,
            _hideNumber = 0,
            _len = 100,
            _cartListWidth = 0;

        $btnPrev.bind("click",function() {
            if(_hideNumber == 0 || _currentIndex <= 0) return false;
            $btnNext.css({"color": "#e6060e","cursor": "pointer"});
            $cartListBox.animate({"left":--_currentIndex*_len*(-1)},500);
            if(_currentIndex <= 0) $(this).css({"color": "#ddd","cursor": "default"});
        });
        $btnNext.bind("click",function(){
            if(_hideNumber == 0 || _currentIndex >= _hideNumber) return false;
            $btnPrev.css({"color": "#e6060e","cursor": "pointer"});
            $cartListBox.animate({"left":++_currentIndex*_len*(-1)},500);
            if(_currentIndex >= _hideNumber) $(this).css({"color": "#ddd","cursor": "default"});
        });

        $(window).bind("scroll",function(){
            if($(document).scrollTop() >= $("#cart-product").offset().top){
                $(".product-detail").addClass("onfixed");
            }else{
               $(".product-detail").removeClass("onfixed");
            }
        });

        cartListScroll = (function() {
            _currentIndex = 0;
            _cartListWidth = $cartListBox.find(".cartItem").length * _len;
            $cartListBox.width(_cartListWidth);
            _hideNumber = Math.max(0,(_cartListWidth - $cartListWarp.width()) / _len);
            $(".product-detail-content .btn").css({"color": "#ddd","cursor": "default"});
            if (_hideNumber > 0) {
                $btnNext.css({"color": "#e6060e","cursor": "pointer"});
            }else {
                $btnNext.css({"color": "#ddd","cursor": "default"});
            }
            return arguments.callee;
        }());
    };

    getCartInfo().then(renderCartInfo).then(cartListScroll);

    //商品添加到购物车操作
    $("#pList").on("click",".addCart",function() {
        getCartInfo($(this).attr("data-sid"),$(this).attr("data-pid")).then(renderCartInfo).then(cartListScroll);
    });

    // 删除购物车内商品操作
    $("#cartList").on("click",".c-remove",function() {
        $.ajax({
            type:"get",
            dataType:"jsonp",
            url:"//cart"+cookieDomain+"/home/api/cart/"+ (pageInfo.isGome ? 'removeItemCD' : 'removeShopItemCD'),
            data:{
                "cid":$(this).attr("data-cid"),
                "spid":pageInfo.coudanID
            },
            JsonpName:"deleteFn"
        }).then(renderCartInfo).then(cartListScroll);
    });
})();