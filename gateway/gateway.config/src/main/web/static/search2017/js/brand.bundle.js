/*! by. */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	if(pageData.isBW){
	    pageData.dataBW = __webpack_require__(1).getShopGoods(pageData.ajaxURL,1,pageData.valueBW);
	}
	setTimeout(function(){
	    __webpack_require__(2).getGoods();
	},0);
	//引入facet相关模块
	__webpack_require__(5);
	//引入toolbar相关模块
	__webpack_require__(7);
	__webpack_require__(8);
	// 块-价格获取，懒加载图片
	__webpack_require__(9);
	//引入页面事件的模块-商品事件
	__webpack_require__(11);
	//引入大数据推荐的模块
	if(pageData.isResult){
	    __webpack_require__(17);//右侧店铺精选和底部的推广商品
	    __webpack_require__(19).getData("#prdRight-2");//右侧热销推荐
	    __webpack_require__(21).getData("#prdRight-3");//右侧浏览了还购买商品
	}else{
	    __webpack_require__(22).getData("#prdBottom-1");//无结果情况底部热销推荐
	}
	//底部延迟触发请求
	document.getElementById("lazyajaxloadarea").onmouseover = function (event) {
	    this.style.display = "none";
	    __webpack_require__(23).getData("#prdBottom-2");//猜你喜欢
	    __webpack_require__(24).getData("list","#prdBottom-recent");//最近浏览
	    this.style.display = "none"
	};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	/**
	 * [description]
	 * 页面初始时，根据标识searchObj.header.searchReq.bwSec 判断是否请求页面底部用于补位的联营商品
	 * 如果请求则请求结果存放于pageData.bwsData，用于综合第一页请求时底部替换商品
	 */

	function getShopGoods(url,pageNumber,bwValue){
	    var bwsData = [];
	    var bwsString = "";
	    $.ajax({
	        url:url,
	        dataType:"json",
	        async:false,
	        data:{page:pageNumber,bws:bwValue,type:"json"}
	    }).done(function(data){
	        if(data.content.prodInfo && data.content.prodInfo.products){
	            bwsData = data.content.prodInfo.products;
	            for(var i = 0,j= bwsData.length;i<j;i++){
	                bwsString += '"'+bwsData[i].pId+'"'
	            }
	            bwsString = "["+bwsString+"]";
	        }
	    });
	    return {
	        "bwsData":bwsData,
	        "bwsString":bwsString
	    }
	}

	module.exports = {
	    getShopGoods:getShopGoods
	}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * [description]
	 * 根据排序pageData.sort，页码pageData.currentPage,异步获取商品,并重组数据（，）
	 * 注：区域字段在请求的cookie里面.
	 * 【一】pageData.bwsStaus==-1:初始请求，获取推荐的联营商品，
	 * 【二】pageData.bwsStaus=='[pid,pid,pid.....pid]':综合排序【大于第一页】，获取以排除推荐联营商品的数据
	 * 【三】pageData.bwsStaus==1：默认排序及分页请求，注：当综合排序第一页时需将 底部推荐联营商品 与 请求数据进行合并，
	 *      合并规则：倒数查找自营商品 替换为 联营商品
	 * 【四】综合第一页时将提前获取的底部推荐联营商品整合到主商品数据
	 * 【五】如果请求有推广活动则再次重组主商品数据结构,根据主商品特性clothes，merchandise，isBigImg设置广告活动高度
	 * 【function 1】综合排序第一页时，将推荐联营商品整合到异步主商品
	 * 【function 2】异步请求如果有推广活动位，将活动数据整合到主商品
	 * 【function 3】重新设置迷你分页器，底部分页器
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require,exports,module){
	    var tpl_detail = __webpack_require__(3).getTemplate("normal");
	    /**
	     * [description]
	     * 商品模板+区域推广活动 art-template
	     * {{noSkusStock}}： 无货标识，pagejs.ftl 根据区域设置
	     * {{isActive}},是否广告位，
	     */
	    var tpl_item = '\
	    {{each prodInfo.products}}\
	    {{if $value.isActive}}\
	    <li class="product-item product-ad" style="height:{{$value.height}}px">\
	        <a class="activeImg" data-code="{{modelid}}-{{pageNumber}}_activities_{{$index+1}}" href="{{$value.mUrl}}" title="{{$value.title}}" target="_blank">\
	        <img src="//img.gomein.net.cn/images/grey.gif" gome-src="{{$value.img}}" alt="{{$value.pTxt}}">\
	        </a>\
	        <span class="product-ad-info">\
	        <em class="product-ad-name">{{$value.title}}</em>\
	        <em class="product-ad-title">{{$value.pTxt}}</em>\
	        <a class="product-ad-btn" data-code="{{modelid}}-{{pageNumber}}_activities_{{$index+1}}" href="{{$value.mUrl}}" target="_blank">点击进入</a>\
	        </span>\
	    </li>\
	    {{else}}\
	    <li class="product-item{{if $value.taoGou}} product-item-tao{{/if}}{{if $value.images.length==0}} hideSmallBox{{/if}}" from="ajax" id="gm-{{$value.pId}}-{{$value.skuId}}">\
	        <input appointment="{{if $value.stock==3 || $value.stock==6 || $value.stock==4}}true{{/if}}" class="productInfo" salestype="{{if $value.thirdProduct}}true{{else}}false{{/if}}" type="hidden" pid="{{$value.pId}}" skuid="{{$value.skuId}}" skuname="{{$value.alt}}" prd-index="{{$index+1}}" price="{{$value.price}}" salesVolume="{{$value.salesVolume}}" evaluateCount="{{$value.evaluateCount}}" cateId="{{$value.firstCat}}_{{$value.secondCat}}_{{$value.defCatId}}" brandIds="{{each $value.brandIds as value}}{{if $index==0}}{{value}}{{/if}}{{/each}}" thirdProduct="{{$value.thirdProduct | formatBoolean}}" shopId="{{if $value.shopId}}{{$value.shopId}}{{/if}}"  shopName="{{if $value.sName}}{{$value.sName}}{{/if}}"  promoScore="{{$value.promoScore}}" promoStock="{{$value.promoStock}}" score="{{$value.score}}" pStock="{{$value.stock}}" pWeight="{{$value.promoStock}}" taoType="{{$value.taoType}}" taoSkuId="{{$value.taoSkuId}}" thirdCat="{{$value.defCatId}}" skuType="{{if $value.interFlowType ==1}}G3PP{{else if $value.interFlowType ==5}}3PP{{else if $value.interFlowType ==0}}{{if $value.skuType ==gome_sku}}SMI{{else if $value.skuType == super_market_sku}}SMI_T{{/if}}{{/if}}" brandCode="{{$value.brandCode}}" skuNo="{{$value.skuNo}}"/>\
	        <ul class="arbitrage clearfix">\
	            <li class="arbitrage-num arbitrage-cur" pId="{{$value.pId}}" sId="{{$value.skuId}}">单件</li>\
	            {{each $value.taoGou}}\
	            {{if $index < 3}}\
	            <li class="arbitrage-num">{{$value}}件套</li>\
	            {{/if}}\
	            {{/each}}\
	        </ul>\
	        <div class="item-tab-warp">'+tpl_detail+'</div>\
	    </li>\
	    {{/if}}\
	    {{/each}}\
	    ';
	    /**
	     * [description]
	     * 重组主商品和推荐联营商品
	     */
	    function mixedShopData(mainArray,shopArray){
	        if(shopArray.length == 0) return false;
	        for(var i = mainArray.length-1,j=shopArray.length;i>0&&j>0;i--){
	            if(!mainArray[i].thirdProduct){
	                j--;
	                mainArray[i] = shopArray[j];
	            }
	        }
	    }
	    /**
	     * [description]
	     * 重组主商品和推广活动位，展示位置自定义
	     */
	    function mixActiveData(mainArray,activeArray,activeHeight){
	        var posArr = [11,19,31];//广告位展示位置
	        for(var i= 0;i<posArr.length;i++){
	            var forIndex = posArr[i];
	            if(activeArray[i] && mainArray[forIndex-1]){
	                mainArray.splice(forIndex,0, $.extend({},activeArray[i],{isActive:true,height:activeHeight}));
	            }
	        }
	    }
	    /**
	     * [description]
	     * 异步请求主数据方法，并且渲染页面，主要参数sort，currentPage
	     */
	    function getGoods(callback){
	        var _ajaxData = 0;
	        if(pageData.sort === '00' && pageData.currentPage > 1){
	            _ajaxData = {page:pageData.currentPage,bws:pageData.dataBW.bwsString,type:"json",aCnt:pageData.aCnt};
	        }else {
	            _ajaxData = {page:pageData.currentPage,bws:0,type:"json"};
	        }
	        //首屏商品异步加载增加参数rank
	        if(pageData.sort === '00' && pageData.currentPage == 1){
	            $.extend(_ajaxData,{rank:tagWightVersion=="A"?0:1});
	        }

	        $.ajax({
	            url:pageData.ajaxURL,
	            dataType:"json",
	            data:_ajaxData,
	            timeout:3000,
	            beforeSend:function(){
	                $('#product-waiting').show();
	            }
	        }).always(function () {
	            pageData.ajaxStatus = false;
	            $('#product-waiting').hide();
	        }).done(function (data) {
	            if(!data.content) {return false};
	            if(data.content.prodInfo.products && data.content.prodInfo.products.length <=16){//小于16个商品
	               // console.log('16');
	                $("#szSpread,#prdRight-1,#prdRight-3,#prdRight-4").remove();
	            };
	            //面包屑位置商品总数量保证与实际请求数量同步
	            if(window.pageName != "品牌商品页") {
	                $("#searchTotalNumber").text(data.content.pageBar.totalCount);
	            }
	            //alert(data.content.selectData.toolBar.selectedInstock)
	            if(data.content.selectData.toolBar.selectedInstock == 1){//排序（不包含综合）默认勾选只显示有货
	                $("#instock").addClass("checke");
	            }else{
	                $("#instock").removeClass("checke")
	            };
	            $("#instock").attr("href",$("#instock").attr("data-href")+data.content.toolBar.instock.url.replace(/&sort=[0-9]+/,''));
	            pageData.currentPage = data.content.pageBar.pageNumber;
	            pageData.totalPage = data.content.pageBar.totalPage;
	            if(pageData.sort === '00' && pageData.currentPage == 1 && pageData.dataBW.bwsData){
	                //如果是综合第一页时，混合推荐联营商品
	                mixedShopData(data.content.prodInfo.products,pageData.dataBW.bwsData);
	            }
	            if(data.content.activities && data.content.activities.length > 0){
	                var active_h = 427;
	                if(data.content.prodInfo.clothes || data.content.prodInfo.merchandise){

	                    if(data.content.prodInfo.products[0].isBigImg){
	                        active_h=537
	                    }else{
	                        active_h= 472;
	                    }
	                };

	                mixActiveData(data.content.prodInfo.products,data.content.activities,active_h);
	            }
	            //活动推广位
	            if(data.content.regionPromoInfo){
	                if(!pageData.isfilter){//左侧广告，当筛选无结果的时候隐藏
	                    if(data.content.prodInfo.products.length <=16){//当商品数量小于16个时 左侧广告隐藏
	                        $("#szSpread").remove();
	                    }else{
	                        $("#szSpread").remove();
	                        $(".product-right-box").prepend("<a id='szSpread' data-code='9000000900-0' target='_blank' href='"+data.content.regionPromoInfo.promUrl+"'><img src='"+data.content.regionPromoInfo.imgUrl+"'></a>");
	                    }
	                }else{
	                    $("#szSpread").remove();
	                }
	            }else{
	                $("#szSpread").remove();
	            };
	            //如果是价格展示热门分类产品，点击全部才展示全部商品
	            if($("#sort-price").hasClass("cur") && (!pageData.isShowALL)){
	                if(data.content.toolBar.sort.price.isPriceSort == 1){
	                    $(".product-showmore a").attr("href",data.content.toolBar.sort.price.url3);
	                    $(".product-showmore").show();
	                }
	            }else{
	                $(".product-showmore").hide();
	            }
	            //模板渲染
	            template.helper("formatBoolean",function(data,format){
	                return String(data);
	            });
	            data.content.gome_sku = "gome-sku";
	            data.content.super_market_sku = "super_market_sku";
	            var itemHTML = templateSimple.compile(tpl_item)($.extend({},data.content,{'noSkusStock':pageData.noSkusStock,'modelid':"9000000700",'pageNumber':pageData.currentPage,'productSite':pageData.productSite,pageType:$("body").attr("data-page")}));
	            if($.trim(itemHTML) !=""){
	                $('#product-box').empty().html(itemHTML);
	            }

	            if(callback && typeof callback == "function"){
	                callback();
	            }
	            window.compare_asyn();
	            if(data.content.pageBar.totalPage == 1) {return false};
	            __webpack_require__(4);
	            $("#j-page").ucPager({
	                pageClass: "",
	                currentPage: pageData.currentPage,
	                totalPage: pageData.totalPage,
	                pageSize: 48,
	                clickCallback: function(curPage) {
	                    pageData.currentPage = curPage;
	                    getGoods(goodsTop);
	                }
	            });
	            $("#min-pager-number").text(pageData.currentPage+'/'+pageData.totalPage);

	            if(pageData.currentPage > 1 && pageData.currentPage < pageData.totalPage){
	                $('#mp-prev').removeClass('mp-disable');
	                $('#mp-next').removeClass('mp-disable');
	            }else{
	                if(pageData.currentPage === 1){
	                    $('#mp-prev').addClass('mp-disable');
	                }else{
	                    $('#mp-next').addClass('mp-disable');
	                }
	            }
	        }).fail(function () {
	            console.log("请求错误")
	        });
	    }
	    /**
	     * 商品翻页操作时，整体回到商品区域顶部
	     */
	    function goodsTop() {
	        var _top = $("#product-left").offset().top;
	        $(window).scrollTop(_top);
	    }
	    module.exports = {
	        getGoods:getGoods,
	        goodsTop:goodsTop
	    }
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/**
	 * [getTemplate description] 商品单体模板
	 * @param  {[type]} op [description] normal:普通商品 taogou:套装商品 默认隐藏 multi:多sku商品
	 * @return {[type]}    [description]
	 */
	function getTemplate(op){
	    return '<div class="item-tab asynPriceBox'+(op == "taogou"?" taoStyle":"")+'" isBigImg="{{if $value.isBigImg}}true{{/if}}" >\
	        {{if $value.isBigImg}}\
	            <p class="item-pic bigp"><a class="item-link" rel="nofollow"  href="{{$value.sUrl}}" target="_blank" data-code="{{modelid}}-{{pageNumber}}_{{$index+1}}_1" title="{{$value.alt}}"><img gome-src="{{$value.sImg}}_275.jpg" alt="{{$value.alt}}" src="//img.gomein.net.cn/images/grey.gif"></a></p>\
	        {{else}}\
	            <p class="item-pic"><a class="item-link" rel="nofollow" href="{{$value.sUrl}}" target="_blank" data-code="{{modelid}}-{{pageNumber}}_{{$index+1}}_1" title="{{$value.alt}}"><img gome-src="{{$value.sImg}}_210.jpg" src="//img.gomein.net.cn/images/grey.gif" alt="{{$value.alt}}"></a>{{if $value.energyTag == 1}}<span class="save-energy"></span>{{/if}}</p>\
	        {{/if}}\
	        {{if $value.isMulti && $value.images.length>0}}\
	            <div class="item-pic-small-box" index="{{if $value.images.length > 9}}9{{else}}{{$value.images.length}}{{/if}}" curIndex="{{if $value.images.length > 9}}9{{else}}{{$value.images.length}}{{/if}}">\
	                {{if $value.images.length> 5 }}\
	                <a href="javascript:void(0);" class="icon-prev disable"></a>\
	                <a href="javascript:void(0);" class="icon-next"></a>\
	                {{/if}}\
	                <div class="item-pic-small-wrap">\
	                    <ul class="imgList">\
	                    {{each $value.images}}\
	                    {{if $index < 10}}\
	                        <li class="icon-li" sid="{{$value.skuId}}" d_src="{{$value.sImg}}" sid="{{$value.skuId}}" surl="{{$value.sUrl}}" skuNo="{{$value.skuNo}}">\
	                        <img  gome-src="{{$value.sImg}}_30.jpg" alt="{{$value.color}}" src="//img.gomein.net.cn/images/grey.gif" />\
	                        <div class="icon-li-price hide-dom"></div>\
	                        <div class="icon-li-promotion hide-dom"></div>\
	                        </li>\
	                    {{/if}}\
	                    {{/each}}\
	                    </ul>\
	                </div>\
	            </div>\
	        {{/if}}\
	        <div class="item-price-info">\
	            <p class="item-price">\
	            {{if $value.stock==3}}\
	            <span class="price" pid="{{$value.pId}}" skuid="{{$value.skuId}}">敬请期待</span>\
	            {{else}}\
	            <span class="price asynPrice" pid="{{$value.pId}}" skuid="{{$value.skuId}}"></span>\
	            {{/if}}\
	            {{if $value.isVip == 1}}\
	            <span class="promotion-normal">会员价</span>\
	            {{/if}}\
	            {{if $value.rebate == 1}}\
	            <span class="promotion-normal">返利</span>\
	            {{/if}}\
	            </p>\
	        </div>\
	        <p class="item-name"><a rel="nofollow" class="item-link" data-code="{{modelid}}-{{pageNumber}}_{{$index+1}}_1" href="{{$value.sUrl}}" target="_blank" title="{{$value.alt}}">{{#$value.name}}</a></p>\
	        {{if $value.promoDesc !=""}}\
	        <p class="item-promotional-language">\
	            <!--{{if $value.promoTags && $value.promoTags != null && $value.promoTags.promoType && $value.promoTags.promoType == 2}}\
	                【{{$value.promoTags.promoPrice}}手机专享价】\
	            {{/if}}-->\
	            {{$value.promoDesc}}\
	        </p>\
	        {{/if}}\
	        <p {{if $value.isBigImg}}class="item-comment-dispatching bigger"{{else}}class="item-comment-dispatching"{{/if}}>\
	            {{if $value.stock==0 || noSkusStock}}\
	            <span class="dispatchingbox"></span>\
	            <span class="dispatching item-productnone">{{$value.cityName}}无货</span>\
	            {{else if $value.stock==1}}\
	            <span class="dispatching"></span>\
	            {{else if $value.stock==2}}\
	            <span class="dispatchingbox"></span>\
	            <span class="dispatching nOrange item-productnone">{{$value.cityName}}暂不支持配送</span>\
	            {{else if $value.stock==3 || $value.stock==6}}\
	            <span class="dispatchingbox"></span>\
	            <span class="dispatching nOrange item-productnone">正在预约中</span>\
	            {{else if $value.stock==4}}\
	            <span class="dispatchingbox"></span>\
	            <span class="dispatching nHeigh item-productnone">正在抢购中</span>\
	            {{else}}\
	            <span class="dispatchingbox"></span>\
	            <span class="dispatching item-productnone">{{$value.cityName}}无货</span>\
	            {{/if}}\
	            <a href="{{$value.sUrl}}#j-comment-section" target="_blank" class="comment" data-code="{{modelid}}-{{pageNumber}}_{{$index+1}}_2"><span class="grey">已有</span>{{$value.evaluateCount}}<span class="grey">人评价</span></a>\
	        </p>\
	        <p class="item-shop">\
	        {{if $value.thirdProduct}}\
	            {{if $value.shopId =="80009736" || $value.shopId =="80010355" || $value.shopId =="80010423"}}\
	                <span class="hyg-shopType">自营</span>\
	            {{/if}}\
	            {{if $value.mallTag =="1"}}<span class="brandtip">品牌直营</span>{{/if}}\
	            {{if $value.goodsType == "ZC2M"}}\
	                <span class="promotion-c2m"></span>\
	            {{/if}}\
	            {{if $value.marketTag == 1}}\
	                {{if !$value.shopFlag || $value.shopFlag < 5}}<span class="promotion-hwg"></span>{{/if}}\
	            {{/if}}\
	            {{if $value.sName}}\
	                <a class="nname" data-code="{{modelid}}-{{pageNumber}}_{{$index+1}}_4" target="_blank" href="{{$value.mUrl}}">{{$value.sName}}</a>\
	            {{/if}}\
	        {{else}}\
	            <span class="nnamezy">自营</span>\
	            {{if $value.goodsType == "ZC2M"}}\
	            <span class="promotion-c2m"></span>\
	            {{/if}}\
	            {{if $value.marketTag == 1}}\
	                {{if !$value.shopFlag || $value.shopFlag < 5}}<span class="promotion-hwg"></span>{{/if}}\
	            {{/if}}\
	            {{if $value.sName}}\
	            <a class="nname" data-code="{{modelid}}-{{pageNumber}}_{{$index+1}}_4" target="_blank" href="{{$value.mUrl}}">{{$value.sName}}</a>\
	            {{/if}}\
	        {{/if}}\
	        </p>\
	        <p class="item-promotion"></p>\
	        <p class="item-option clearfix">\
	            <span class="add-contrast" cid="{{$value.pId}}/{{$value.skuId}}" title="对比"><i class="icon"></i></span>\
	            <span class="add-collection" pid="{{$value.pId}}" skuid="{{$value.skuId}}" pname="{{$value.name}}" title="收藏"><i class="icon"></i></span>\
	            {{if $value.stock == 0 || noSkusStock}}\
	            <span class="add-cart next-buy" pid="{{$value.pId}}" skuid="{{$value.skuId}}" title="到货通知"><i class="notice"></i></span>\
	            {{else if $value.stock == 2 || $value.stock == 3 || $value.stock == 4 || $value.stock == 6}}\
	            <i></i>\
	            {{else}}\
	            <a class="add-cart addTo-cart" href="javascript:void(0);" isMCard="{{$value.gomeCardType}}" shopFlag="{{$value.shopFlag}}" isHyg="{{$value.marketTag}}" pid="{{$value.pId}}" skuid="{{$value.skuId}}" taoType="{{$value.taoType}}" taoSkuId="{{$value.taoSkuId}}" data-code="{{pageType}}-{{modelid}}-{{pageNumber}}_{{$index+1}}_3" title="加入购物车"><i class="icon"></i></a>\
	            {{/if}}\
	            <span class="gomekf"><a href="javascript:void(0)" title="咨询" class="online-server1 online-robot"><i class="icon"></i></a></span>\
	        </p>\
	    </div>\
	    ';
	}
	module.exports = {
	    getTemplate:getTemplate
	}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	/**
	 * 分页插件
		$(".pager").ucPager({
			currentPage  : "当前页",				
			totalPage    : "总页数",				
			pageSize     : "每页显示的记录数",			
			clickCallback: cback				//分页回调方法
		})
	 */
	(function($){
		var pageNav = {
			pre : "上一页",
			next : "下一页",
			nav : function(p, pn) {
				var html = "";
				if (pn <= 1 || p > pn) {
					html = this.pager(1, 1);
				} else {
					html += (p == 1) ? this.showPre(0) : this.showPre(1, p);
					if (pn > 6) {
						var c = 1;
						if (p >= 5 && p <= pn) {
							html += (p == 1) ? this.numStatusHTML(0, 1) : this.numStatusHTML(1, 1);
						} else {
							for ( var i = 1; i < 4; i++) {
								html += (p == i) ? this.numStatusHTML(0, i) : this.numStatusHTML(1, i);
							}
						}
						html += (p >= 5) ? "<span class='placeholder'></span>" : "";
						c = p - 2; if (c >= 3 && c < pn - 2) html += (p == c) ? this.numStatusHTML(0, c) : this.numStatusHTML(1, c);
						c = p - 1; if (c > 3 && c < pn - 2) html += (p == c) ? this.numStatusHTML(0, c) : this.numStatusHTML(1, c);
						c = p;     if (c > 3 && c < pn - 2) html += (p == c) ? this.numStatusHTML(0, c) : this.numStatusHTML(1, c);
						c = p + 1; if (c > 3 && c < pn - 2) html += (p == c) ? this.numStatusHTML(0, c) : this.numStatusHTML(1, c);
						c = p + 2; if (c > 3 && c < pn - 2) html += (p == c) ? this.numStatusHTML(0, c) : this.numStatusHTML(1, c);
						html += (p <= pn - 4) ? "<span class='placeholder'></span>" : "";
						if (p <= pn - 4) {
							html += (p == pn) ? this.numStatusHTML(0, pn) : this.numStatusHTML(1, pn);
						} else {
							for ( var i = pn - 2; i <= pn; i++) {
								html += (p == i) ? this.numStatusHTML(0, i) : this.numStatusHTML(1, i);
							}
						}
					} else {
						for ( var i = 1; i <= pn; i++) {
							html += (p == i) ? this.numStatusHTML(0, i) : this.numStatusHTML(1, i);
						}
					}
					html += (p == pn) ? this.showNext(0) : this.showNext(1, p);
				}
				return html;
			},
			pager : function(p, pn) {
				var html = "";
				if (pn <= 1) {
					this.p = p;
					this.pn = pn;
					html = this.showPre(0) + this.numStatusHTML(0, p) + this.showNext(0);
				}
				return html;
			},
			go : function(p, pn) {
				var html = this.nav(p, pn) + this.btnHTML(p, pn);
				return html;
			},
			numStatusHTML : function(t, p) {
				return (t == 0) ? ("<span class='cur'>" + p + "</span>") : "<a href='javascript:void(0);' onclick='javascript:doPageNumSearch("	+ p + ");return false;'>" + p + "</a>";
			},
			showPre : function(t, p) {
				var $disable = "<a class='prev disable' href='javascript:void(0);'>&nbsp;"
					+ this.pre + "<s class='icon-prev'></s><i></i></a>";
				var $able = "<a class='prev' href='javascript:void(0);' onclick='javascript:doPageNumSearch("
					+ (p - 1) + ");return false;'>&nbsp;" + this.pre
					+ "<s class='icon-prev'></s><i></i></a>";
				return (t == 0) ? $disable : $able;
			},
			showNext : function(t, p) {
				var $disable = "<a class='next disable' href='javascript:void(0);'>"
					+ this.next + "<s class='icon-next'></s><i></i></a>";
				var $able = "<a class='next' href='javascript:void(0);' onclick='javascript:doPageNumSearch("
					+ (p + 1) + ");return false;'>" + this.next + "<s class='icon-next'></s><i></i></a>";
				return (t == 0) ? $disable : $able;
			},
			btnHTML : function(p, pn) {
				var html = "<label for='pagenum' class='txt-wrap'>到<input type='text' id='pNum' class='txt' bNum='"+ pn +"' value='" + p + "'>页</label>"
					+ "<a href='javascript:void(0)' zdx='nBtn' class='btn'>确定</a>";
				return html;
			}
		};
		$.fn.extend({
			ucPager: function(options) {
				var op = $.extend({currentPage:1,totalPage:0,pageSize:15,clickCallback:function(){}},options);

				return this.each(function() {
					var $this = $(this);

					var clickCallback = function() {
						op.clickCallback(op.currentPage);
						//$this.html(pageNav.go(op.currentPage, op.totalPage));
					}

					$this.html(pageNav.go(op.currentPage, op.totalPage));


					//翻页
					window.doPageNumSearch = function(p){  //p当前页数
						op.currentPage = p.toString();
						clickCallback();
					};
					//删除订单不刷新，执行下一页20150824
					window.doNextPageNum = function(lenOtbody){  //执行下一页；

						if(op.currentPage==op.totalPage){
							//doPrevPageNum();
							op.currentPage --;

						}else{
							op.currentPage ++;
						}

						doPageNumSearch(op.currentPage);
					};


					var $pNum = $("#pNum", $this);

					$pNum.on('keyup', function(event){
						var val = $(this).val(), reg1 = /^\d+$/ig, reg2 = /\d+/ig;
						if (event.which == 13) {
							$('.btn',$this).click();
						} else {
							if(!reg1.test(val)){
								$(this).val(val.match(reg2) ? val.match(reg2)[0] : '');
							};
						}

					})

					$('.btn',$this).bind('click',function(){
						var $val = $.trim($pNum.val());
						if($val<1){
							$pNum.val(1);
							op.currentPage = 1 + '';
						}else if($val>op.totalPage){
							$pNum.val(op.totalPage);
							op.currentPage = op.totalPage.toString();
						}else{
							$pNum.val($val);
							op.currentPage = $val;
						};

						clickCallback();
					});

				});
			}
		})
	})(jQuery);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require,exports,module){
	    /**
	     * 【一】给每一个facet盒子（.facets-category）,添加一个存放已选facet参数的属性
	     * 【二】初始化设置，包括热门分类，一般分类的更多按钮是否显示
	     * 【三】如果一般分类中仅有一个分类，则删除多选按钮
	     **/
	    $('.facets-category').data('selectFacet','');
	    $(".facets-category-common").each(function(){
	        var _facetHeight = $(this).find(".category-normal ul").height();
	        var _facetNum = $(this).find(".category-normal ul li").length;
	        if( _facetHeight > 35){
	            $(this).find(".fc-option-more").css("visibility","visible");
	        }else{
	            $(this).find(".fc-option-more").remove();
	        }
	        if(_facetNum == 1) {
	            $(this).find(".fc-option-multiple").remove();
	        }
	    });
	    /**
	     * 初始化已选分类
	     * 【一】滑动控制
	     * 【二】全部清空按钮操作
	     **/
	    var moveSt = (function(){
	        var space = 0;
	        var _li = $(".nSearch-crumb-facetsCurrent").find("li");

	        if(pageData.isSearch){
	            space = $("#nSearch-crumb-searchNum").width() + $("#nSearch-crumb-keyWord").width() +65;
	        }else{
	            space = $("#category-first").width() + $("#category-second").width() + $("#category-third").width() +90;
	        }
	        space =  $(".nSearch-crumb").width()-space;
	        /*初始化已选facets样式*/
	        if(_li.length>0){
	            var _width = 0;
	            $(".nSearch-crumb-facetsCurrent").addClass("haschecked");
	            for(var i =0,j=_li.length;i<j;i++){
	                _width+=_li.eq(i).width()+39;
	            }
	            if(_li.length >= 2) {
	                $("#clearallfacts").show();
	                space = space - 110;
	            }
	            $(".nSearch-crumb-facetsCurrent").width(_width);
	            $("#nSearch-crumb-facetsCurrent-warp").width(space);

	            if(_width > space){
	                $(".facetsCurrent-next").show();
	            }
	            return space - _width
	        }
	        return 0;
	    })();
	    $(".facetsCurrent-next").bind("click",function(){
	        $(".nSearch-crumb-facetsCurrent").animate({"left":moveSt+"px"},300,function(){
	            $(".facetsCurrent-prev").show();
	            $(".facetsCurrent-next").hide();
	        });
	    });
	    $(".facetsCurrent-prev").bind("click",function(){
	        $(".nSearch-crumb-facetsCurrent").animate({"left":0},100,function(){
	            $(".facetsCurrent-next").show();
	            $(".facetsCurrent-prev").hide();
	        });
	    });
	    /**
	     * 方法
	     * 重置当前已处于多选状态的facet,
	    **/
	    function clearMultiSelectStatus(){
	        $('.multiSelectStatus').find('.fc-btn-cancel').trigger('click');
	    };
	    /**
	     *  按钮点击事件
	     * 【一】【多选】按钮，设置当前facet是否为可多选状态
	     * 【二】【取消】按钮 对当前分类下的所有已选中的facet触发一次点击事件
	     * 【三】【确定】按钮，调用已封装处理参数的方法，跳转页面，具体参数存放在父级facets-category的data('selectFacet')，此参数由该该facet下的具体筛选项设置
	     * 【四】【更多】按钮，展示隐藏的facet
	     * 【五】【具体筛选项】，根据父级facets-category是否为多选状态（isMultiSelect）。
	     *        true：阻止默认href跳转，设置父级facets-category的值，data('selectFacet')
	    **/
	    $('#module-facet .fc-option-multiple').bind('click',function(){
	        clearMultiSelectStatus();
	        $(this).parents('.facets-category').data('isMultiSelect',true).addClass('multiSelectStatus');
	        $(this).parents('.facets-category').find('.fc-option-more').data('isOpen',false).trigger('click');
	    });
	    $('#module-facet .fc-btn-cancel').bind('click',function(){
	        var _parent = $(this).parents('.facets-category');
	        _parent.find('.facet').filter(function(){return $(this).data('isSelect')}).trigger('click');
	        _parent.find('.fc-option-more').data("isOpen",true).trigger('click');
	        _parent.data('isMultiSelect',false).removeClass('multiSelectStatus');
	    });
	    $('#module-facet .fc-btn-ok').bind('click',function(){
	        var valueString = $(this).parents('.facets-category').data('selectFacet')
	        if(valueString){
	            __webpack_require__(6).dofacet('facets',valueString);
	        }
	    });
	    $('#module-facet .fc-option-more').data('isOpen',false).bind('click',function (event) {
	        if(!$(this).data("isOpen")){
	            $(this).data("isOpen",true).html('<i></i>收起').parents('.facets-category').addClass('moreStatus');
	        }else{
	            $(this).data("isOpen",false).html('<i></i>更多').parents('.facets-category').removeClass('moreStatus');
	        }
	    });
	    $('#module-facet .facet').bind('click',function(event){
	        var _this = $(this),
	            _parent = _this.parents('.facets-category'),
	            facet_checked = _parent.data('selectFacet');
	        if(_parent.data('isMultiSelect')){
	            event.preventDefault();
	            if(_this.data('isSelect')){
	                _this.removeClass('chk');
	                _this.data('isSelect',false);
	                facet_checked = facet_checked.replace(_this.attr('facetsid'),'');
	            }else{
	                _this.addClass('chk');
	                _this.data('isSelect',true);
	                facet_checked += _this.attr('facetsid');
	            }
	            _parent.data('selectFacet',facet_checked);
	        }
	    });
	    /**
	     *  品牌facet相关事件
	     * 【一】【已选中品牌facet】点击事件
	     * 【二】按字母筛选品牌划过效果
	     * 【三】【更多】按钮追加事件，收起时重置隐藏的品牌隐藏
	     * 【四】筛选项追加新的点击事件到队列，由于绑定两次事件，所以此处isSelect 值应该为取反操作
	    **/
	    $('#category-brand-hasCheck').delegate('li','click',function(){
	        $('#brandID'+$(this).data('facetId')).trigger('click');
	    });
	    $('.category-brand-f-letter').find('li').bind({
	        'mouseenter':function () {
	            var _this = $(this);
	            if(!_this.hasClass('all')){
	                _this.addClass('cur').siblings("li").removeClass('cur');
	                _this.parents('.fc-content').find('.c-brand').addClass('brand-op').filter(function () {
	                    return $(this).attr('brand-value') == _this.attr('brand-key')
	                }).removeClass('brand-op');
	            }else{
	                _this.addClass('cur').siblings('li').removeClass('cur');
	                _this.parents('.fc-content').find('.brand-op').removeClass('brand-op')
	            }
	        }
	    });
	    $("#facets-category-brand .fc-option-more").bind("click", function () {
	        $(this).parents('#facets-category-brand').find('.category-brand-f-letter .all').trigger("mouseenter")
	    });
	    $('#facets-category-brand .facet').bind('click',function(event){
	        var _this = $(this);
	        if(!_this.data('isSelect')){
	            _this.parent('.c-brand').removeClass('lichk');
	            $("#category-brand-hasCheck li").filter(function(){
	                return _this.attr('facetsid') == $(this).data("facetId");
	            }).remove();
	        }else{
	            _this.parent('.c-brand').addClass('lichk');
	            $('<li class="ckes"><i></i>'+_this.attr("name")+'</li>').appendTo("#category-brand-hasCheck").data("facetId",_this.attr('facetsid'));
	        }
	    });
	    /**
	     * 聚合分类facet
	     * 【一】滑入滑出效果
	     * 【二】聚合分类facet的【取消】按钮 追加处理事件
	    **/
	    $('.category-syn').bind({
	        "mouseenter":function(event){
	            clearMultiSelectStatus();
	            $(this).parents('.facets-category').data('isMultiSelect',true);
	            $(this).addClass("category-syn-open");
	        },
	        "mouseleave":function(event){
	            $(this).parents('.facets-category').data('isMultiSelect',false);
	            $(this).removeClass('category-syn-open')
	        }
	    });
	    $('.facets-category-syn .fc-btn-cancel').bind('click',function(){
	        $(this).parents('.category-syn').removeClass('category-syn-open');
	    });
	    $('.facets-rele').bind({
	        "mouseenter":function(event){
	            $(this).parents('.facets-category').data('isMultiSelect',false);
	        }
	    });
	    /**
	     * 更多选项显示隐藏处理，仅列表页体现
	    **/
	    $('#fc-common-show').bind('click', function (event) {
	        clearMultiSelectStatus();
	        $(this).parents('.fccc-control-warp').addClass('show').siblings(".fc-hide").show();
	    });
	    $('#fc-common-hide').bind('click', function (event) {
	        clearMultiSelectStatus();
	        $(this).parents('.fccc-control-warp').removeClass('show').siblings(".fc-hide").hide();
	    });

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * [description]
	 * 根据不同筛选条件，设置页面跳转地址，包括facet多选，特殊活动，价格区间，在结果中搜索(仅结果页)
	 * &pzpq=0&pzin=v5 用于品牌预测的时候用
	 * queryString:筛选字段facets，promoFlag，price，et(仅搜索结果页调用)
	 * valueString：修改的值，（promoFlag仅限0,1）
	 *
	 * 20170516 bug: 去掉在结果搜索，调整至resultsearch.js
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require,exports,module){
	    var href = window.location.search;
	    var queryRelation = {"facets":9,"promoFlag":10,"price":6}; //搜索页面url的query与列表页url中对应query的index位置
	    var pageCategoryQueryArray = [];
	    function assembleHref(queryString,valueString){
	        var reg = new RegExp("(^|&)" + queryString + "=([^&]*)(&|$)", "i");
	        var replaceContent = "";
	        var searchPragram = "";
	        switch(window.pageName){
	            case "搜索结果页":
	                var r =href.substr(1).match(reg);
	                if(r!= null){
	                    if(queryString=="facets"){
	                        valueString+=r[2];
	                    }

	                    href= href.replace("&"+queryString+"="+r[2],"&"+queryString+"="+valueString);
	                }else{
	                    if(pageData.brandFacet != ""){
	                        if(queryString=="facets"){
	                            valueString += pageData.brandFacet
	                        }else{
	                            valueString += "&facets="+pageData.brandFacet
	                        }
	                    }
	                    if(queryString=="price"){
	                        valueString +="&priceTag=1"
	                    }
	                    href = href.replace("&pzpq=0&pzin=v5","")+"&"+queryString+"="+valueString+"&pzpq=0&pzin=v5"
	                }
	                break;
	            case "海外购搜索结果页":
	                var r =href.substr(1).match(reg);
	                if (r != null && queryString == "facets"){
	                    replaceContent = "&"+queryString+"="+unescape(r[2])+valueString+"&";
	                }else{
	                    replaceContent = "&"+queryString+"="+valueString+"&";
	                }
	              //href = (href.indexOf(queryString)!= -1)? href.replace(reg, replaceContent) : href+ "&"+queryString+"="+pageData.defaultFacets+valueString+(queryString=="price"?"&priceTag=1":"")+"&pzpq=0&pzin=v5";
	                href = (href.indexOf(queryString)!= -1)? href.replace(reg, replaceContent) : href+ "&"+queryString+"="+valueString+(queryString=="price"?"&priceTag=1":"")+"&pzpq=0&pzin=v5";
	                break;
	            case "三级列表页":
	                href = window.location.pathname;
	                if(href.split("-").length <= 1){
	                    href = href.split(".html")[0] + "-00-0-48-1-0-0-0-1-0-0-0-0-0-0-0-0-0.html";
	                }
	                pageCategoryQueryArray = href.split("-");
	                if (queryString === "facets" && pageCategoryQueryArray[9] !== "0"){
	                    pageCategoryQueryArray[queryRelation[queryString]] += valueString;
	                }else{
	                    pageCategoryQueryArray[queryRelation[queryString]] = valueString;
	                    if(queryString === "price") pageCategoryQueryArray[7] = "1";
	                }
	                href = pageCategoryQueryArray.join("-");
	                break;
	            case "海外购三级列表页":
	                href = window.location.pathname;
	                if(href.split("-").length <= 1){
	                    href = href.split(".html")[0] + "-00-0-48-1-0-0-0-1-0-0-0-11-0-0-0-0-0.html";
	                }
	                pageCategoryQueryArray = href.split("-");
	                if (queryString === "facets" && pageCategoryQueryArray[9] !== "0"){
	                    pageCategoryQueryArray[queryRelation[queryString]] += valueString;
	                }else{
	                    pageCategoryQueryArray[queryRelation[queryString]] = valueString;
	                    if(queryString === "price") pageCategoryQueryArray[7] = "1";
	                }
	                href = pageCategoryQueryArray.join("-");
	                break;
	            case "品牌商品页":
	                //href = window.location.protocol+"//search"+cookieDomain+"/search?question="+pageData.searchkey + "&" + queryString + "=" + pageData.brandId  + valueString +"&pzpq=0&pzin=v5";
	                href = window.location.protocol+"//search"+cookieDomain+"/search?question="+pageData.searchkey + "&" + queryString + "="+ valueString +"&pzpq=0&pzin=v5";
	                break;
	        }
	        window.location.href = href;
	    }
	    module.exports = {
	        dofacet:assembleHref
	    }
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * [description]
	 * 工具栏具体点击事件
	 * sort排序筛选项，地址选择，分页按钮-异步获取商品
	 * 价格区间，在结果中搜索，特殊活动-跳转新页面
	 * 初始化设置，特殊活动是否勾选，分页按钮置灰
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require,exports,module){
	    /**
	     * sort排序点击事件，使用function.getGoods模块获取商品
	     * 【一】价格按钮前置绑定一次事件，设置价格高→低，低→高状态，修改本身sort值
	     * 【二】绑定通用事件，修改pageData.sort，重置pageData.currentPage为1
	     */
	    $('#sort-price').bind('click', function (event) {
	        if(!pageData.ajaxStatus){
	            var _this = $(this);
	            if(_this.attr('data-sort') === "21"){
	                _this.attr('data-sort',"20").removeClass("price-down").addClass("price-up");
	                _this.find("a").attr("href",_this.attr("prdurl1"));
	                _this.find("a").attr("data-href",_this.attr("prdurl1"))
	            }else{
	                _this.attr('data-sort',"21").removeClass("price-up").addClass("price-down");
	                _this.find("a").attr("href",_this.attr("prdurl2"));
	                _this.find("a").attr("data-href",_this.attr("prdurl2"))
	            }
	        }
	    });

		$('#filter-order-box li').bind('click', function (event) {
	        var _this = $(this),
	            sort_target = _this.attr('data-sort');
	        if(pageData.sort !== sort_target && !pageData.ajaxStatus){
	            pageData.ajaxStatus = true;
	            _this.addClass('cur').siblings('.cur').removeClass('cur');
	            pageData.sort = sort_target;
	            pageData.currentPage=1;
	           // pageData.ajaxURL = $(this).find('a').attr("href");
	            pageData.ajaxURL = $(this).find('a').attr("data-href");
	            if(!(_this.attr("id")=='sort-price')){//价格始终由低到高
	                $('#sort-price').attr('data-sort',"21").removeClass("price-up").addClass("price-down");
	            }
	            if(window.pageName== "品牌商品页"){
	                window.location.href = window.location.protocol+"//search"+cookieDomain+$(this).find('a').attr("data-href");
	                return false;
	            }
	            //var _top = $("#product-left").offset().top;
	            //$(window).scrollTop(_top);
	            $('html, body').animate({
	                scrollTop: $("#product-left").offset().top
	            }, 1);
	            pageData.isShowALL = false;
	            __webpack_require__(2).getGoods();
	        }
	    }).find('a').click(function(event){
	        event.preventDefault();
	    });
	    //价格里的查看全部商品
	    $(".product-showmore").on("click","a",function(event){
	        event.preventDefault();
	        pageData.ajaxURL = $(this).attr("href");
	        pageData.isShowALL = true;
	        __webpack_require__(2).getGoods();
	    })
	    /**
	     * 分页点击事件，仅修改pageData.currentPage，使用function.getGoods模块获取商品
	     * 【一】下一页
	     * 【二】上一页
	     */
	    $("#mp-next").bind('click', function (event) {
	        event.preventDefault();
	        if(pageData.currentPage >= pageData.totalPage || pageData.ajaxStatus){
	            return false;
	        }else{
	            pageData.ajaxStatus = true
	        }
	        pageData.currentPage++;

	        var fnTop = __webpack_require__(2).goodsTop;
	        __webpack_require__(2).getGoods(fnTop);
	    });
	    $("#mp-prev").bind('click', function (event) {
	        event.preventDefault();
	        if(pageData.currentPage == 1 || pageData.ajaxStatus){
	            return false;
	        }else{
	            pageData.ajaxStatus = true
	        }
	        pageData.currentPage--;

	        var fnTop = __webpack_require__(2).goodsTop;
	        __webpack_require__(2).getGoods(fnTop);
	    });
	    /**
	     * 特殊活动筛选
	     * 【一】初始换筛选标签是否勾选
	     * 【二】绑定点击事件，调用function.makeHelf模块处理跳转地址*/
	    (function(){
	        var url = window.location.href;
	        if(url.indexOf("promoFlag=1") > 0 || url.split("-")[10] == 1){
	            $("#specialScreening").addClass("checke");
	        }
	    })();
	    $("#specialScreening").bind("click",function(){
	        if($(this).hasClass("checke")){
	            promoFlagVal = 0;
	        }else{
	            promoFlagVal = 1;
	        }
	        __webpack_require__(6).dofacet('promoFlag',promoFlagVal);
	    });
	    $(window).bind("scroll",function(){
	        var productLeftOffsetTop = $("#product-left").offset()!=null?$("#product-left").offset().top:0;
	        if($(document).scrollTop() >= productLeftOffsetTop){
	            $("#filter-box").addClass("onfixed");
	        }else{
	            $("#filter-box").removeClass("onfixed");
	        }
	    });
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * 价格区间筛选处理事件
	 * 【一】输入框设置，屏蔽特殊字符，获取焦点，失去焦点
	 * 【二】移出价格区间区域，修改样式
	 * 【三】【取消】按钮事件
	 * 【四】【确定】按钮事件，调用function.makeHelf模块处理跳转地址
	 */
	$(".priceRange-input input").bind({
	    "keydown": function() {
	        $(this).val($(this).val().replace(/[A-Za-z`~!@#$%^&*_+=¥￥（）()<>?:"{},\/;'[\]！。......，…——、‘；—【】|？》《“：\\\-” \u4e00-\u9fa5]/g,''));
	    },
	    "keyup": function() {
	        $(this).val($(this).val().replace(/[A-Za-z`~!@#$%^&*_+=¥￥（）()<>?:"{},\/;'[\]！。......，…——、‘；—【】|？》《“：\\\-” \u4e00-\u9fa5]/g,''));
	    },
	    "focus": function() {
	        $(".filter-priceRange-box").addClass("filter-priceRange-click");
	    },
	    "blur": function() {
	        $(this).val() == "" && $(this).val("¥");
	    }
	});
	$(".filter-priceRange-box").bind("mouseleave",function() {
	    $(this).removeClass("filter-priceRange-click");
	    $(".priceRange-input input").trigger("blur");
	}).show();
	$("#fc-btn-cancel").bind("click", function() {
	    $(".priceRange-input input").val("¥")
	});
	$("#fc-btn-ok").bind("click", function(event) {
	    event.preventDefault();
	    var priceRange = "";
	    var price1 = $("#fc-lowPrice").val();
	    var price2 = $("#fc-highPrice").val();
	    if(price2 == "¥" && price1 == "¥"){
	        return false;
	    }else if(price1 == "¥"){
	        priceRange="0x"+price2;
	    }else if(price2 == "¥"){
	        priceRange=price1+"x*";
	    }else{
	        priceRange = Math.min(price1, price2) + "x" + Math.max(price1, price2);
	    }
	    __webpack_require__(6).dofacet('price',priceRange);
	});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 页面级事件，
	 * 【一】1.5s定时器,，异步价格盒子asynPriceBox，
	 *  (1)获取可视区域内图片，设置src地址
	 *  (2)获取可视区域内asynPriceBox盒子，异步获取价格信息，成功调用setAsynPriceBox方法设置相关信息
	 *      a,asynPriceBox盒子包括：主体商品，列表页顶部热卖推荐商品（from云眼），底部对比商品，底部最近浏览商品
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require,exports,module){
	var getScreenDom = __webpack_require__(10);
	var itemType = {
	    GOMEPRICE:"normal",
	    SALEPRICE:"normal",
	    AREAPRICE:"normal",
	    AREASALEPRICE:"normal",
	    TUANPRICE:"tuangou",
	    RUSHBUYPRICE:"qianggou"
	};
	/**
	 * [setAsynPriceBox 设置异步价格盒子内方法]根据获取的价格类型重新定义.item-link点击跳转地址，.addTo-cart加入购物车地址，价格标签
	 * @param  {[type]} data    [请求的价格相关数据]
	 * @param  {[type]} asynPriceBox [异步价格节点]
	 */
	/***/
	function setAsynPriceBox(data,asynPriceBox){
	    var _url = "",
	        _hash = "",
	        propTag = "";
	    switch(itemType[data.priceType]){
	        case "normal":
	            _url = "//item"+cookieDomain+"/"+data.productId+"-"+data.skuId+".html";
	            _hash = "#gm-other-info";
	            break;
	        case "tuangou":
	        case "qianggou":
	            //_url = "//tuan"+cookieDomain+"/deal/"+data.promotionUrl+".html";
	            _url = "//item"+cookieDomain+"/"+data.productId+"-"+data.skuId+".html";
	            _hash = "#j-comment-section";
	            asynPriceBox.parents('li').find(".productInfo").attr("tuanqiang",true);
	            var addCart = asynPriceBox.find(".addTo-cart"),
	                cartDataCode = addCart.attr("data-code");
	            addCart.undelegate().replaceWith('<a class="add-cart" href="'+_url+'" title="加入购物车" target="_blank" data-code="'+cartDataCode+'"><i class="icon"></i></a>');
	            break;
	        default:
	            break;
	    }

	    /**
	     * 比价需求临时下线10.31
	     if(data.smartbuy){
	        var dataSmart = data.smartbuy
	        var jdDefalut = dataSmart.jingdongPrice?'比京东低'+dataSmart.jingdongLower+'元':'比苏宁低'+dataSmart.suningLower+'元';
	        var jdShow = dataSmart.jingdongPrice?'<p>京东价：<span>¥'+dataSmart.jingdongPrice+'</span>比京东低'+dataSmart.jingdongLower+'元</p>':'';
	        var snShow = dataSmart.suningPrice?'<p>苏宁价：<span>¥'+dataSmart.suningPrice+'</span>比苏宁低'+dataSmart.suningLower+'元</p>':'';
	        var compareHtml = ['<div class="sb-item-price-warp"><ul class="sb-item-price"><li class="defaultLi"><span>¥',data.price,'</span>',jdDefalut,'</li><li class="otherLi">',jdShow,snShow,'</li><li><p class="ti">比价时间：'+dataSmart.smartdate+'</p></li></ul><i class="tiger"></i></div>'].join("");
	        priceBox.empty().html(compareHtml)
	     }else{
	        priceBox.find(".price").text("¥"+data.price)
	     }
	     */

	    if(itemType[data.priceType] == "tuangou"){
	        propTag+='<span class="promotion-normal">团购价</span>'
	    }else if(itemType[data.priceType] == "qianggou"){
	        propTag+='<span class="promotion-normal">抢购价</span>'
	    }
	    /*if(data.smartbuy){
	     propTag+='<span class="promotion-normal">享优惠</span>'
	     }*/

	    asynPriceBox.find(".asynPrice").text(data.price?"¥"+data.price:"暂无售价").after(propTag);
	    if(_url !=""){
	        asynPriceBox.find(".item-link").attr("href",_url);
	        asynPriceBox.find(".comment").attr("href",_url+_hash);
	    };
	    asynPriceBox.parents("li").find(".productInfo").attr("price",data.price?data.price:"暂无售价");

	}
	setInterval(function(){
	    var $windows = $(window);
	    var areaBottom = $windows.scrollTop() + $windows.height() +300;
	    var areaTop = $windows.scrollTop()-300;

	    var screenItem = getScreenDom(".asynPriceBox",areaTop,areaBottom);
	    var screenImg = getScreenDom(".nSearchWarp img",areaTop,areaBottom);
	    //var screenLiitem = getScreenDom(".product-item",areaTop,areaBottom);

	    if(screenImg.length > 0){
	        $.each(screenImg,function(i){
	            $(this).attr("src",$(this).attr("gome-src"));
	        })
	    };

	    if(screenItem.length > 0){
	        var dtd = $.Deferred();// 新建一个deferred对象
	        var wait = function(){
	            var count =0;
	            $.each(screenItem,function(i){
	                var $dom = $(this),
	                    $priceDom = $(this).find(".asynPrice"),
	                    $buyMode = $(this).hasClass("taoStyle")?"suit":"single";
	                var _index = new Date().getTime()+i;
	              $.ajax({
	                    type:"get",
	                    url:["//ss"+cookieDomain,"search/v1/price/"+$buyMode,$priceDom.attr("pid"),$priceDom.attr("skuid"),pageData.regionId_2,"flag/item","fn"+ _index].join("/"),
	                    dataType:"jsonp",
	                    jsonpCallback:"fn"+ _index,
	                    success:function(data){
	                        if(data && data.success){
	                            setAsynPriceBox(data.result,$dom);
	                            count++;
	                            if(count == screenItem.length){
	                                dtd.resolve();
	                            }
	                        }else{
	                            $dom.data("success",false);
	                        }
	                    }
	                });

	            });
	            return dtd;
	        };
	        $.when(wait(dtd)).done(function(){
	            var zyarr=[],
	                lyarr=[];
	           // var _index = new Date().getTime();
	            //促销标签请求
	            //促销标签
	            $.each(screenItem,function(i){
	                var productInfoObj =$(this).parents('li').find(".productInfo");
	                if(productInfoObj.attr("salestype") =="true"){//联营
	                    if(!productInfoObj.attr("appointment") && !productInfoObj.attr("tuanqiang")){//排除团抢和预约
	                        var lyobj={};
	                        if(productInfoObj.attr("skuNo") !="" && productInfoObj.attr("skuNo") !=undefined && productInfoObj.attr("price") !="" && productInfoObj.attr("price") !=undefined && productInfoObj.attr("price") != "暂无售价"){
	                            lyobj.sku =productInfoObj.attr("skuNo");
	                            lyobj.price =productInfoObj.attr("price");
	                            lyarr.push(lyobj);
	                        }
	                    }
	                }else{//自营
	                    if(!productInfoObj.attr("appointment") && !productInfoObj.attr("tuanqiang")){//排除团抢和预约
	                        var zyobj={};
	                        if(productInfoObj.attr("skuid") !="" && productInfoObj.attr("skuid") !=undefined && productInfoObj.attr("skuType") !="" && productInfoObj.attr("skuType") !=undefined && productInfoObj.attr("thirdCat") !="" && productInfoObj.attr("thirdCat") !=undefined && productInfoObj.attr("brandCode") !="" && productInfoObj.attr("brandCode") !=undefined && productInfoObj.attr("price") !="" && productInfoObj.attr("price") !=undefined && productInfoObj.attr("price") != "暂无售价"){
	                            zyobj.skuId =productInfoObj.attr("skuid");
	                            zyobj.unitPrice =productInfoObj.attr("price");
	                            zyobj.site ="homeSite";
	                            zyobj.areaCode =pageData.regionId_2;
	                            zyobj.skuType =productInfoObj.attr("skuType");
	                            zyobj.categoryId =productInfoObj.attr("thirdCat");
	                            zyobj.brandCode =productInfoObj.attr("brandCode");
	                            zyarr.push(zyobj);
	                        }
	                    }

	                }
	            });
	            //屏蔽联营
	            if(lyarr.length >0){
	                $.ajax({
	                    type:"get",
	                    traditional:true,
	                    //url:"//10.144.48.19:8282/promotion/promotionLabels",
	                    url:cookieDomain==='.gome.com.cn'?'//npop-front.gome.com.cn/promotion/promotionLabels':'//interfaceuat.coupon.coo8.com/promotion/promotionLabels',
	                    data:{"param":JSON.stringify(lyarr)},
	                    dataType:"jsonp",
	                    //jsonpCallback:"callback"+_index,
	                    success:function(data){
	                        if(data.success){
	                            var _data=data.data;
	                            for(var key in _data){
	                                $.each(screenItem,function(){
	                                    var $dom =$(this).parents("li");
	                                    if($dom.find(".productInfo").attr("skuno") == key){
	                                        var promotionHtml ="";
	                                        for(var i=0;i<_data[key].length;i++){
	                                            if(_data[key][i].promLabelPC){
	                                                promotionHtml +='<span class="promotion-normal">'+_data[key][i].promLabelPC+'</span>'
	                                            };
	                                        }
	                                        $dom.find(".item-promotion").html(promotionHtml);
	                                        if($dom.find(".item-promotion .promotion-normal").eq(0).width() > 210){
	                                            $dom.find(".item-promotion .promotion-normal").eq(0).css("margin-top","20px");
	                                        }
	                                    }
	                                });
	                            }
	                        }
	                    },
	                    error:function(){
	                        // alert('error')
	                    }
	                })
	            };

	            if(zyarr.length >0){
	                $.ajax({
	                    type:"get",
	                    traditional:true,
	                    url:"//pl"+cookieDomain+"/promLabel/getPromLabels.do",
	                    data:{"json":JSON.stringify(zyarr)},
	                    dataType:"jsonp",
	                    //jsonpCallback:"callback"+_index,
	                    success:function(data){
	                        if(data.success){
	                            var _data=data.data;
	                            for(var key in _data){
	                                $.each(screenImg,function(){
	                                    var $dom =$(this).parents("li");
	                                    if($dom.find(".productInfo").attr("skuid") == key){
	                                        var promotionHtml ="";
	                                        for(var i=0;i<_data[key].length;i++){
	                                            if(_data[key][i].promLabelPC){
	                                                promotionHtml +='<span class="promotion-normal">'+_data[key][i].promLabelPC+'</span>'
	                                            };
	                                        }
	                                        $dom.find(".item-promotion").html(promotionHtml);
	                                    }
	                                });
	                            }
	                        }
	                    }
	                })
	            }
	        });
	    };
	},1000);
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	 /**
	 * [getScreenDom 获取可视区域内可见对象]，如获取则此元素success=true，此后将不再获取；
	 * @param  {[string]} focusDom       [目标dom标识 class id elementname]
	 * @param  {[type]} screenAreaTop    [可视区域上边缘]
	 * @param  {[type]} screenAreaBottom [可视区域下边缘]
	 * @return {[type]}                  [description]
	 */
	module.exports = function(focusDom,screenAreaTop,screenAreaBottom){
	    return $(focusDom+":visible").filter(function(){
	        var _h = $(this).offset().top;
	        if(_h>0 && _h >= screenAreaTop && _h<=screenAreaBottom && !$(this).data("success")){
	            $(this).data("success",true);
	            return true;
	        }
	        return false;
	    });
	}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	/*加入购物车*/
	$("#product-box").delegate(".addTo-cart", "click", function() {
	    var $this = $(this),
	        _type = 0,
	        _pid = $this.attr("pid"),
	        _sid = $this.attr("skuid"),
	        _taogType = $this.attr("taoType"),
	        _shopFlag = $this.attr("shopFlag");

	    if($this.attr("isHyg") == "1" && _shopFlag != 6 && _shopFlag != 5){_type = 16};

	    if(_taogType == 2){_type = 24};
	    if(_taogType == 3){
	        _type = 24;
	        _sid = $this.attr("taoSkuId")
	    };

	    /* 加入购物车美通卡入口*/
	    if($this.attr("isMCard")){
	        window.open("//card"+cookieDomain+"?intcmp="+$this.attr("data-code")+"&skuType="+$this.attr("isMCard")+"&productId="+_pid+"&skuId="+_sid+"&count=1","_blank")
	    }else{
	        window.open("//cart"+cookieDomain+"/addsuccess?intcmp="+$this.attr("data-code")+"&homesite=home&type="+_type+"&sid="+_sid+"&pid="+_pid+"&pcount=1&cr=0"+"&_r="+new Date().getTime(),"_blank")
	    }
	});


	/*添加收藏*/
	$("#product-box").delegate(".add-collection", "click", function() {
	    var $this = $(this),
	        _pid = $this.attr("pid"),
	        _sid = $this.attr("skuid"),
	        _name = $this.attr("pname");
	    g.login(function(){
	        __webpack_require__(12).addCollect(_pid,_sid,loginData.loginId,_name);
	    });
	});

	/*到货通知*/
	$("#product-box").delegate(".next-buy","click",function(){
	    var $this = $(this),
	        _pid = $this.attr("pid"),
	        _sid = $this.attr("skuid");
	    g.login(function(){
	        __webpack_require__(14).arriveNotice(_pid,_sid,loginData.loginId,pageData.regionId);
	    });
	});
	/*套装商品切换*/
	$("#product-box").delegate(".arbitrage-num","mouseenter",function(){
	    var _this = $(this).parents(".product-item-tao");
	    var _index = $(this).index();
	    if($(this).hasClass("arbitrage-cur")) return false;
	    $(this).addClass("arbitrage-cur").siblings().removeClass("arbitrage-cur")
	    if(!_this.data("taoCompate")){
	        var _data = {products:[]};
	        var tpl_detail = __webpack_require__(3).getTemplate("taogou");
	        var tpl_taogou = '{{each products}}'+tpl_detail+'{{/each}}';
	        var data = _this.attr("id").split("-");
	        $.ajax({
	            type:"get",
	            url:"//apis"+cookieDomain+"/p/taoGou/"+data[1]+"/"+data[2],
	            dataType:"jsonp",
	            data:{from:"search"},
	            timeout:1000
	        }).done(function(data){
	            _this.data("taoCompate",true);
	            _data.products = data;
	            var _html = templateSimple.compile(tpl_taogou)($.extend({},_data,{'noSkusStock':pageData.noSkusStock,'modelid':"9000000700",'pageNumber':pageData.currentPage,'productSite':pageData.productSite}));
	            _this.find(".item-tab-warp").append(_html).find(".item-tab").eq(_index).show().siblings().hide();
	            window.compare_asyn();
	        }).fail(function(){
	            _this.data("taoCompate",false);
	        })
	    }else{
	        _this.find(".item-tab-warp").find(".item-tab").eq(_index).show().siblings().hide();
	    }
	});

	/*多sku小图点选*/
	$("#product-box").delegate(".icon-prev","click",function(){
	    var pars = $(this).parents(".item-pic-small-box");
	    var ingList = pars.find(".imgList");
	    var nextbtn = pars.find(".icon-next");
	    var index = pars.attr("index");
	    var curIndex = pars.attr("curindex");
	    if (!$(this).hasClass("disable")) {
	        if (++curIndex <= index) {
	            nextbtn.removeClass("disable");
	            pars.attr("curindex", curIndex);
	            ingList.animate({
	                "left": (curIndex - index) * 37 + "px"
	            }, 100)
	        } else {
	            $(this).addClass("disable");
	        }
	    }
	});
	$("#product-box").delegate(".icon-next","click",function(){
	    var pars = $(this).parents(".item-pic-small-box");
	    var ingList = pars.find(".imgList");
	    var prevbtn = pars.find(".icon-prev ");
	    var index = pars.attr("index");
	    var curIndex = pars.attr("curindex");
	    if (!$(this).hasClass("disable")) {
	        if (--curIndex >= 5) {
	            prevbtn.removeClass("disable");
	            pars.attr("curindex", curIndex);
	            ingList.animate({
	                "left": (curIndex - index) * 37 + "px"
	            }, 100)
	        } else {
	            $(this).addClass("disable");
	        }
	    }
	});
	//$("#product-box").delegate(".icon-li","mouseenter",function(){
	    function mesgChange(){
	        var _o = $(this);            
	        var pars = _o.parents(".item-tab");
	        var imgSrc = "";
	        var links = _o.attr("surl");
	        var nSid = _o.attr("sid");
	        var nskuNo = _o.attr("skuNo");
	        var productInfoObj = pars.parents('.product-item').find(".productInfo");

	        if(pars.attr("isBigImg")){
	            imgSrc = _o.attr("d_src")+"_275.jpg";
	        }else{
	            imgSrc = _o.attr("d_src")+"_210.jpg";
	        };
	        // pars.find(".asynPrice").attr("skuid",nSid);
	        pars.find(".item-pic img").attr("src",imgSrc);
	        pars.find(".item-pic a").attr("href",links);
	        pars.find(".item-name a").attr("href",links);
	        pars.find(".item-comment-dispatching a").attr("href",links+"#gm-other-info");
	        pars.find(".add-cart").attr("skuid",nSid);
	        pars.find(".add-collection").attr("skuid",nSid);
	        _o.addClass("current").siblings("li").removeClass("current");
	        //价格和促销信息写在demo里，只第一次触发的时候请求
	        productInfoObj.attr("skuno",nskuNo);
	        productInfoObj.attr("skuid",nSid);
	       
	        if(_o.hasClass('already')){
	            pars.find(".asynPrice").text("¥"+_o.find(".icon-li-price").html());
	            pars.find(".item-promotion").html(_o.find(".icon-li-promotion").html());
	            pars.find(".asynPrice").attr("skuid",nSid);
	            productInfoObj.attr("skuid",nSid);
	        }else{
	            $("#product-box").undelegate(".icon-li","mouseenter");
	            pars.find(".asynPrice").attr("skuid",nSid);               
	            $priceDom = pars.find(".asynPrice"),
	            $buyMode = pars.hasClass("taoStyle")?"suit":"single";
	            var _index = new Date().getTime()+_o.index();
	            $.ajax({
	                type:"get",
	                url:["//ss"+cookieDomain,"search/v1/price/"+$buyMode,$priceDom.attr("pid"),$priceDom.attr("skuid"),pageData.regionId_2,"flag/item","fn"+ _index].join("/"),
	                dataType:"jsonp",
	                jsonpCallback:"fn"+ _index,
	                success:function(data){
	                    if(data && data.success){
	                        _o.find(".icon-li-price").html(data.result.price?data.result.price:"暂无售价");
	                        pars.find(".asynPrice").text(data.result.price?"¥"+data.result.price:"暂无售价");
	                        productInfoObj.attr("price",data.result.price?data.result.price:"暂无售价");
	                        
	                        if(productInfoObj.attr("salestype") =="true"){//联营促销信息
	                                var lyarr=[];                           
	                                if(!productInfoObj.attr("appointment") && !productInfoObj.attr("tuanqiang")){//排除团抢和预约
	                                    var lyobj={};
	                                    if(productInfoObj.attr("skuNo") !="" && productInfoObj.attr("skuNo") !=undefined && productInfoObj.attr("price") !="" && productInfoObj.attr("price") !=undefined && productInfoObj.attr("price") != "暂无售价"){
	                                        lyobj.sku =productInfoObj.attr("skuNo");
	                                        lyobj.price =productInfoObj.attr("price");
	                                        lyarr.push(lyobj);
	                                    }else{
	                                        pars.find(".item-promotion").html("");
	                                    }
	                                    if(lyarr.length >0){
	                                        $.ajax({
	                                            type:"get",
	                                            traditional:true,
	                                            //url:"//10.144.48.19:8282/promotion/promotionLabels",
	                                            url:cookieDomain==='.gome.com.cn'?'//npop-front.gome.com.cn/promotion/promotionLabels':'//interfaceuat.coupon.coo8.com/promotion/promotionLabels',
	                                            data:{"param":JSON.stringify(lyarr)},
	                                            dataType:"jsonp",
	                                            //jsonpCallback:"callback"+_index,
	                                            success:function(data){
	                                                if(data.success){
	                                                    var _data=data.data;
	                                                    var promotionHtml ="";
	                                                    for(var key in _data) {
	                                                        for(var i=0;i<_data[key].length;i++){
	                                                            if(_data[key][i].promLabelPC){
	                                                                promotionHtml +='<span class="promotion-normal">'+_data[key][i].promLabelPC+'</span>'
	                                                            };
	                                                        }
	                                                    }
	                                                    _o.find(".icon-li-promotion").html(promotionHtml);
	                                                    pars.find(".item-promotion").html(promotionHtml);
	                                                }
	                                            },
	                                            error:function(){
	                                                // alert('error')
	                                            }
	                                        })
	                                    }
	                                }
	                        }else{//自营促销信息
	                            var zyarr=[];
	                            if(!productInfoObj.attr("appointment") && !productInfoObj.attr("tuanqiang")){//排除团抢和预约
	                                var zyobj={};
	                                if(productInfoObj.attr("skuid") !="" && productInfoObj.attr("skuid") !=undefined && productInfoObj.attr("skuType") !="" && productInfoObj.attr("skuType") !=undefined && productInfoObj.attr("thirdCat") !="" && productInfoObj.attr("thirdCat") !=undefined && productInfoObj.attr("brandCode") !="" && productInfoObj.attr("brandCode") !=undefined && productInfoObj.attr("price") !="" && productInfoObj.attr("price") !=undefined && productInfoObj.attr("price") != "暂无售价"){
	                                    zyobj.skuId =productInfoObj.attr("skuid");
	                                    zyobj.unitPrice =productInfoObj.attr("price");
	                                    zyobj.site ="homeSite";
	                                    zyobj.areaCode =pageData.regionId_2;
	                                    zyobj.skuType =productInfoObj.attr("skuType");
	                                    zyobj.categoryId =productInfoObj.attr("thirdCat");
	                                    zyobj.brandCode =productInfoObj.attr("brandCode");
	                                    zyarr.push(zyobj);
	                                }else{
	                                    pars.find(".item-promotion").html("");
	                                }
	                            }
	                            if(zyarr.length >0){
	                                $.ajax({
	                                    type:"get",
	                                    traditional:true,
	                                    url:"//pl"+cookieDomain+"/promLabel/getPromLabels.do",
	                                    data:{"json":JSON.stringify(zyarr)},
	                                    dataType:"jsonp",
	                                    //jsonpCallback:"callback"+_index,
	                                    success:function(data){
	                                        if(data.success){
	                                            var _data=data.data;
	                                            var promotionHtml ="";
	                                            for(var key in _data) {
	                                                for (var i = 0; i < _data[key].length; i++) {
	                                                    if (_data[key][i].promLabelPC) {
	                                                        promotionHtml += '<span class="promotion-normal">' + _data[key][i].promLabelPC + '</span>'
	                                                    }
	                                                    ;
	                                                }
	                                            }
	                                            _o.find(".icon-li-promotion").html(promotionHtml);
	                                            pars.find(".item-promotion").html(promotionHtml);
	                                        }
	                                    }
	                                })
	                            }
	                        };
	                        _o.addClass('already');
	                        $("#product-box").delegate(".icon-li","mouseenter",mesgChange);
	                    }
	                }
	            });
	        }   
	    }
	    $("#product-box").delegate(".icon-li","mouseenter",mesgChange);
	/*商品点击 搜索云埋码统计*/
	$("#product-box").delegate(".item-link","click",function(){
	    var element_info = $(this).parents(".product-item").find(".productInfo");
	    __webpack_require__(15).cloudClickMonitor(element_info);
	    //trackProdClk(tracks, pId, catName, dsp_gome_c3id, isSearch);
	});

	/*
	*商品划过 请求在线客服
	*商品悬停3s 搜索云埋码统计
	**/
	var _onlieTimer = null;
	var _loggerTimer = null;
	$("#product-box").delegate(".product-item","mouseenter mouseleave",function(e){
	    var $this = $(this),
	        element_info = $this.find(".productInfo");
	    if($this.hasClass("product-ad") || $this.data("hasOnline")) return false;
	    if (e.type == "mouseenter") {
	        var getOnlineService = __webpack_require__(16);

	        _onlieTimer = setTimeout(function(){
	            $this.data("hasOnline",true);
	            if(element_info.attr("thirdProduct") == "0"){
	                getOnlineService.selfsell(element_info.attr("cateId"),element_info.attr("brandIds")).done(function(data){
	                    var $robotClass = data.flagMark?" online-robot":"";
	                    $this.find(".gomekf").html($('<a href="javascript:void(0)" title="咨询小美" class="online-server'+$robotClass+'"><i class="icon"></i></a>').data("customer",{
	                        customerHost:data.customerHost,
	                        customerID:data.customerID,
	                        customerInfo:data.customerInfo,
	                        shopName:"",
	                        flag:data.flagMark || ""
	                    }))
	                });
	            }else{
	                getOnlineService.thirdsell(element_info.attr("shopId")).done(function(data){
	                    $this.find(".gomekf").html($('<a href="javascript:void(0)" class="online-server" title="在线客服"><i class="icon"></i></a>').data("customer",{
	                        customerHost:data.customerHost,
	                        customerID:data.customerID,
	                        customerInfo:data.customerInfo,
	                        shopName:element_info.attr("shopName"),
	                        flag:""
	                    }))
	                });
	            }
	        },1000);

	        _loggerTimer = setTimeout(function(){
	            __webpack_require__(15).cloudClickMonitor(element_info,true);
	        },3000);
	    }else if(e.type == "mouseleave") {
	        clearTimeout(_onlieTimer);
	        clearTimeout(_loggerTimer)
	    } else {}
	});

	$("#product-box").delegate(".online-server", "click", function() {
	    var $this = $(this);
	    var customerData = $this.data("customer");
	    window.open(
	        customerData.customerHost+'/chatClient/chatbox.jsp?companyID='+customerData.customerID+'&customerID='+customerData.customerID+
	        '&info='+customerData.customerInfo+'&page=0&enterurl='+window.location.href+'&areaCode='+pageData.regionId+'&shopname='+ encodeURI(customerData.shopName)+
	        '&customerService=' + customerData.customerID+',toolbar=0,scrollbars=0,location=0,menubar=0,resizable=1,width=1120,height=700'+customerData.flag
	    );
	});


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * [description]
	 * 根据请求返回结果判断收藏是否成功
	 * 请求地址："//ss"+cookieDomain + "/item/v1/sc/"+ productId +"/"+skuId+"/"+userId+"/homeSite/flag/sc/wishlist",
	 * 传入参数：productId,skuId,userId
	 */
	function addCollect(productId,skuId,loginId,productName){
	    $.ajax({
	        type:"get",
	        url:"//ss"+cookieDomain + "/item/v1/sc/"+ productId +"/"+skuId+"/"+loginId+"/homeSite/flag/sc/wishlist",
	        dataType:"jsonp",
	        jsonpCallback:"wishlist"
	    }).done(function(data){
	        var content = '';
	        var dataType = data.errorType;
	        switch(dataType){
	            case "isError":
	                content = '<div class="mask-icon icon-waring"></div><h3 class="mask-tit">错误！</h3>';
	                break;
	            case "isSuccess":
	                content = '<div class="mask-icon"></div><h3 class="mask-tit">成功加入收藏夹！</h3><p id="collecion-content-n">'+productName+'</p>';
	                break;
	            case "isCollect":
	                content = '<div class="mask-icon icon-waring"></div><h3 class="mask-tit">您已收藏过此商品！</h3><p id="collecion-content-n">'+productName+'</p>';
	                break;
	            default:
	                content = '<div class="mask-icon icon-waring"></div><h3 class="mask-tit">下架商品不能收藏!</h3>';
	                break;
	        }
	        content = content + '<div class="mask-addCart-btn"><a class="mask-shopping closeBtn" href="javascript:void(0);">继续购物</a><a class="link" href="//myhome'+window.cookieDomain+'/member/myFavorites" target="_blank">查看收藏夹</a></div>'
	        __webpack_require__(13).showMask(content,function(){});
	    });
	}
	module.exports = {
	    addCollect:addCollect
	}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require,exports,module){
		/**
		 * [showMask description] 创建弹出层
		 * @param  {[type]} content [html内容]
		 * @param  {Function} callback [description]
		 * @return {[type]}         [description]
		 */
		function showMask(content,callback){
			//遮罩层
	        var $bodyHeight = $("body").height(),
		        $windowHeight = $(window).height(),
		        $h = Math.max($bodyHeight,$windowHeight);
	        //弹出层主内容
	        var $maskContentWarp = $('<div class="mask-box" id="mask-box"><a class="mask-close closeBtn" href="javascript:void(0);">╳</a><div class="mask-content-warp" id="mask-content-warp">'+content+'</div></div>');
	        $maskContentWarp.appendTo('body');
	        var $contentHeight = $maskContentWarp.height(),
	        	$contentWidth = $maskContentWarp.width();


	        $('<div id="mask-overlay" class="mask-overlay"></div>').css("height",$h).appendTo('body');
	        $maskContentWarp.css({
	            "margin-left":-($contentWidth/2),
	            "margin-top":-($contentHeight/2)
	        });
	        if(callback && typeof callback == "function"){
	            callback.apply();
	        }
	        $(".closeBtn").on('click',function(){
	            closeMask();
	        })
		}

		function closeMask(){
			$("#mask-overlay").remove();
	        $("#mask-box").remove();
		}


		module.exports = {
			showMask:showMask,
			closeMask:closeMask
		}
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * [description]
	 * 到货通知：根据请求返回结果判断到货通知是否成功
	 * 请求地址："//ss"+cookieDomain+"/item/v1/notice/arrival/"+pId+"/"+sId+"/"+cookieSid+"/"+cookieAtg+"/"+phoneNum+"/"+noticeMall+"/"+collect+"/flag/search/notice",
	 * 传入参数：pId,sId,cookieSid,cookieAtg
	 */
	    var mask = __webpack_require__(13);
	    var base = {
	        exp:{
	            'email':/^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9]+)@[A-Za-z0-9]+\.[a-z]{2,4}$/,
	            "telphone":/^(1)\d{10}$/
	        },
	        pId:"",
	        skuId:"",
	        loginId:"",
	        regionId:""
	    };
	    function check_phone(val,obj){
	        if(base.exp.telphone.test(val) && val!=""){
	            obj.html("").hide();
	            return true;
	        }else if(val==""){
	            obj.html('<i></i>请填写手机号码').show();
	            return false;
	        }else{
	            obj.html('<i></i>请填写正确的手机号码').show();
	            return false;
	        }
	    }

	    function check_email(val,obj){
	        if(base.exp.email.test(val) && val!==""){
	            obj.html("").hide();
	            return true;
	        }else if(val==""){
	            obj.html('<i></i>请填写邮箱地址').show();
	            return false;
	        }else{
	            obj.html('<i></i>请填写正确的邮箱地址').show();
	            return false;
	        }
	    }

	    function arriveNotice(pId,sId,loginId,regionId){
	        var content = '<div class="dh-warp"><h3 class="dh-title">到货通知</h3><p class="dh-info">一旦该商品到货，我们会通过手机短信或邮件通知您</p><table class="dh-form"><tbody><tr><td class="dh-hd"><em class="nHeigh">*</em>手机号码：</td><td><input class="dh-input-text" id="dh-telNum" type="text"><span id="dh-telNum-warn"></span></td></tr><tr><td class="dh-hd"><em class="nHeigh">*</em>邮箱地址：</td><td><input class="dh-input-text" id="dh-email" type="text"><span id="dh-email-warn"></span></td></tr><tr><td>&nbsp;</td><td class="dh-label-box"><label class="gmform-label" for="dhAddCollection"><input class="gmform-input-check" name="dhAddCollection" id="dhAddCollection" type="checkbox">同时加入收藏夹</label></td></tr><tr><td>&nbsp;</td><td class="dh-btn-box"><a href="javascript:void(0)" class="dh-btn-submite" id="dh-submite">确定</a><a href="javascript:void(0)" class="dh-btn-cancel closeBtn">取消</a></td></tr></tbody></table></div>';
	        base.pId = pId;
	        base.sId = sId;
	        base.loginId = loginId;
	        base.regionId = regionId;
	        mask.showMask(content,function(){});
	    }
	    $("body").delegate(".dh-btn-submite",'click',function(){
	        var collect = "false",
	            phoneNum = $("#dh-telNum").val(),
	            noticeMall = $("#dh-email").val();
	        if (!check_phone(phoneNum,$("#dh-telNum-warn"))){return false};
	        if (!check_email(noticeMall,$("#dh-email-warn"))){return false};
	        if($("#dhAddCollection").attr("checked")){
	            collect = "true";
	        }
	        $.ajax({
	            type:"get",
	            url:"//ss"+window.cookieDomain+"/item/v1/notice/arrival/"+base.pId+"/"+base.sId+"/"+base.loginId+"/"+base.regionId+"/"+phoneNum+"/"+noticeMall+"/"+collect+"/flag/search/notice",
	            dataType:"jsonp",
	            jsonpCallback:"notice"
	        }).done(function(data){
	            mask.closeMask();
	            var content = "一旦该商品到货，我们会通过手机短信或邮件通知您!";
	            mask.showMask(content,function(){
	                setTimeout(mask.closeMask,3000)
	            });
	        });
	    });

		module.exports = {
	        arriveNotice:arriveNotice
		}


/***/ }),
/* 15 */
/***/ (function(module, exports) {

	/**
	 * 搜索组埋码事件
	 * 【1】商品点击埋码
	 * 【2】页面访问量监控
	 * */

	/*搜索组页面监控*/


	function getPrevItemInfo(i){
	    var prevItemInfo = [];
	    $("#product-box").find(".productInfo").each(function(index,elem){
	        var $this = $(elem);
	        if(index < parseInt(i)){
	            prevItemInfo.push($this.attr("pid")+"-"+$this.attr("skuid"))
	        }else{
	            return false;
	        }
	    });
	    return JSON.stringify(prevItemInfo)
	}


	module.exports = {
	    googleMonitor_s:function(){
	        setTimeout(function(){
	            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	            })(window,document,'script','//www.google-analytics.com/analytics.js','z_ga');
	            z_ga('create', 'UA-44955382-1', 'gome.com.cn');
	            z_ga('send', 'pageview');
	            (function() {
	                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : '//www') + '.google-analytics.com/ga.js';
	                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	            })();
	            var _gaq = _gaq || [];
	            _gaq.push(['_setAccount', 'UA-44955382-1']);
	            _gaq.push(['_trackPageview',window.location.href]);
	            _gaq.push(['_trackEvent', 'question', 'load', 'searchPage'])
	            z_ga('ec:addPromo', {
	                'id': 'gomeSearch',
	                'name': 'gome 11.11'
	            });
	        },3000);
	    },
	    googleMonitor_c:function(){
	        setTimeout(function(){
	            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	            })(window,document,'script','//www.google-analytics.com/analytics.js','z_ga');
	            z_ga('create', 'UA-44955382-1', 'gome.com.cn');
	            z_ga('send', 'pageview');
	            (function() {
	                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : '//www') + '.google-analytics.com/ga.js';
	                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	            })();
	            var _gaq = _gaq || [];
	            _gaq.push(['_setAccount', 'UA-44955382-1']);
	            _gaq.push(['_trackPageview',window.location.href]);
	            var p_categoryId = dspData.dsp_gome_c3id;
	            _gaq.push(['_trackEvent', p_categoryId, 'load', 'catPage'])
	            z_ga('ec:addPromo', {
	                'id': 'gomeCat',
	                'name': 'gome 11.11'
	            });
	        },3000);
	    },
	    cloudClickMonitor: function (element_info,isHover) {
	        return $.ajax({
	            type:"get",
	            dataType:"jsonp",
	            url:pageData.cloudSite + "/cloud/log",
	            data:{
	                module: "logger",
	                ts:new Date().getTime(),
	                t1:isHover?"1-"+element_info.attr("pid"):element_info.attr("pid"),
	                t2:element_info.attr("skuname"),
	                t3:element_info.attr("salesVolume"),
	                t4:element_info.attr("thirdCat"),
	                t5:loggerData.t5,
	                t6:pageData.sort,
	                t7:loggerData.t7,
	                t8:loggerData.t8,
	                t9:pageData.currentPage,
	                t10:element_info.attr("prd-index"),
	                t11:getPrevItemInfo(element_info.attr("prd-index")),//pid-skuid,pid-skuid,pid-skuid
	                //t12:客户端ip,
	                //t13:params.regionId,
	                //t14:用户cookieid,
	                t15:"",
	                //t16:服务ip,
	                //t17:userId,
	                t18:element_info.attr("skuid"),
	                t19:loggerData.t19,
	                t20:loggerData.t20,
	                t21:loggerData.t21,//?
	                t22:loggerData.t22_s || loggerData.t22_r,
	                t23:loggerData.t23,
	                t24:element_info.attr("evaluateCount"),
	                t25:element_info.attr("promoScore"),
	                t26:element_info.attr("pStock"),
	                t27:element_info.attr("pWeight"),
	                t28:element_info.attr("price"),
	                t29:element_info.attr("promoStock"),
	                t30:element_info.attr("score"),
	                t31:loggerData.t31,
	                t32:loggerData.t32,
	                t33:loggerData.t33,
	                from:pageData.isSearch?"search":"category"
	            }
	        });
	    }

	};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	 /**
	  * [getScreenDom 获取可视区域内可见对象]，获取在线客服信息；
	  * 【1】获取自营商品客服 cateId：一级分类id_二级分类id_三级分类id  brandId：第一个所属品牌
	  * 【2】获取联营营商品客服 shopId：店铺id
	  * return  在线客服信息
	 */


	 function selfsell(cateId,brandId){
	     return $.Deferred(function(defer){
	         $.ajax({
	             type:"get",
	             dataType:"jsonp",
	             url:"//ss" + window.cookieDomain + "/item/v1/online/" + cateId + "/" + brandId + "/" + pageData.regionId_1 + "/Y/" + loginData.loginId + "/flag/public/live800",
	             jsonpName:"live800"
	         }).done(function(data){
	             if(data.result && data.result.length > 0){
	                 var _data = data.result[0];
	                 var renderInfo = {
	                     customerHost:_data.host || "//chat5"+window.cookieDomain+"/live800",
	                     customerID : _data.customerID || "3",
	                     customerInfo : _data.customerInfo
	                 };
	                 if(_data.status == -1) {
	                     renderInfo.flagMark = "&flag=robot";
	                 }
	                 defer.resolve(renderInfo);
	             }
	         })
	     }).promise();
	 }
	 function thirdsell(shopId){
	     return $.Deferred(function(defer){
	        $.ajax({
	             type:"get",
	             dataType:"jsonp",
	             url:"//ss" + window.cookieDomain + "/item/v1/online/" + shopId + "/" + loginData.loginId + "/flag/public/live800",
	             jsonpName:"live800"
	        }).done(function(data){
	            if(data.result && data.result.length > 0) {
	                var _data = data.result[0];
	                if (_data.status == -1) {
	                    defer.reject();
	                } else {
	                    defer.resolve({
	                        customerHost: _data.host,
	                        customerID: _data.customerID,
	                        customerInfo: _data.customerInfo
	                    })
	                }
	            }
	         })
	     }).promise();
	 }
	 module.exports = {
	     selfsell:selfsell,
	     thirdsell:thirdsell
	 };


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	var tpl_normal = __webpack_require__(18).tpl;
	$.ajax({
	    type:"get",
	    dataType:"jsonp",
	    url:dspData.url.dsp_url_c,
	    data:{
	        "p":10045,
	        "catid":dspData.dsp_gome_c3id,
	        "c":"dsp_tg",
	        "width_height":"210-210",
	        "area":pageData.regionId,
	        "requestType":3
	    },
	    jsonpName:"dsp_tg",
	    success:function(data){
	        var _dataShow = [];
	        var data_left = {
	            "data": data.splice(0,8)
	        };
	        var data_bottom = {
	            "data": data.length >= 6?data.splice(0,6):[]
	        };
	        if(data_left.data.length > 0){
	            var listTpl = templateSimple.compile(tpl_normal)(data_left);
	            $("#prdRight-1").append('<div class="prd-right-normal"><h3 class="hd"><i class="dsp-tuiguangIdentifi">广告</i>店铺精选</h3><ul class="bd" id="dsp_tuiguang">'+listTpl+'</ul></div>');
	            _dataShow = _dataShow.concat(data_left.data)
	        }
	        if(data_bottom.data.length > 0){
	            var listTpl = templateSimple.compile(tpl_normal)(data_bottom);
	            $("#prdBottom-1").append('<dl class="nSearch-bottomTuiGuang"><dt class="hd"><i class="dsp-tuiguangIdentifi">广告</i>推广商品</dt><dd class="bd"><ul class="clearfix" id="dsp_bottomTuiGuang">'+listTpl+'</ul></dd> </dl>');
	            _dataShow = _dataShow.concat(data_bottom.data)
	        }
	        if (_dataShow.length > 0) {
	            for(var i=_dataShow.length-1;i>=0;i--){
	                new Image().src = _dataShow[i].pm;
	            }
	        }
	    }
	});

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	module.exports = {
	    tpl:'{{each data as value}}\
	        <li class="buy-items">\
	        {{if !(value.ds) && !(value.skuid) && !(value.productid)}}\
	            <a class="dsp-tgImg" href="{{value.ldp}}" target="_blank"><img gome-src="{{value.src}}" src="//img.gomein.net.cn/images/grey.gif"></a>\
	        {{else}}\
	            <div class="pic"><a href="{{value.ldp}}" target="_blank"><img gome-src="{{value.src}}" src="//img.gomein.net.cn/images/grey.gif"></a></div>\
	            <div class="price">¥<span>{{value.pr}}</span></div>\
	            <div class="name"><a href="{{value.ldp}}" target="_blank">{{value.ds}}</a></div>\
	            {{if value.adver}}<div class="adver">{{#value.adver}}</div>{{/if}}\
	        {{/if}}\
	        </li>\
	    {{/each}}'
	}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	var tpl_normal = __webpack_require__(20).tpl;
	function getData(domId){
	    $.get(
	        dspData.url.bigdata_url,
	        {
	            boxid: "box91",
	            area: pageData.regionId,
	            cid: $.cookie("__clickidc"),
	            imagesize: 160,
	            c1id:dspData.dsp_gome_c1id,
	            c3id:dspData.dsp_gome_c3id,
	            brid: dspData.dsp_gome_brid,
	            search: pageData.searchkey
	        },
	        function(data){
	            if (data.lst && data.lst.length > 0) {
	                data.lst.splice(6,data.lst.length)
	                var listTpl = templateSimple.compile(tpl_normal)(data);
	                $(domId).append('<div class="prd-right-normal"><h3 class="hd">热销推荐</h3><ul class="bd" id="bigD_rexiao">'+listTpl+'</ul></div>');
	            }
	        },
	        "jsonp"
	    );
	}
	module.exports = {
	    getData:getData
	}

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	module.exports = {
	    tpl:'{{each lst as value}}\
	            <li class="buy-items">\
	                <div class="pic"><a class="bigD_item" track="{{value.maima_param}}" href="{{value.purl}}" target="_blank"><img gome-src="{{value.iurl}}" src="//img.gomein.net.cn/images/grey.gif"></a></div>\
	                <div class="price">¥<span>{{value.price}}</span></div>\
	                <div class="name"><a class="bigD_item" track="{{value.maima_param}}" href="{{value.purl}}" target="_blank">{{value.pn}}</a></div>\
	            </li>\
	        {{/each}}'
	};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	var tpl_normal = __webpack_require__(20).tpl;
	function getData(domId){
	    $.get(
	        dspData.url.bigdata_url,
	        {
	            boxid: "box02",
	            area: pageData.regionId,
	            cid: $.cookie("__clickidc"),
	            imagesize: 160,
	            c1n: dspData.dsp_gome_c1name,
	            c3n: dspData.dsp_gome_c3name,
	            c1id: dspData.dsp_gome_c1id,
	            c3id: dspData.dsp_gome_c3id,
	            brid: dspData.dsp_gome_brid
	        },
	        function(data){
	            if (data.lst && data.lst.length > 0) {
	                data.lst.splice(5,data.lst.length)
	                var listTpl = templateSimple.compile(tpl_normal)(data);
	                $(domId).append('<div class="prd-right-normal"><h3 class="hd">浏览此类商品的用户最终买了</h3><ul class="bd" id="bigD_liulan">'+listTpl+'</ul></div>');
	            }
	        },
	        "jsonp"
	    );
	}
	module.exports = {
	    getData:getData
	}

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	var tpl = '{{each lst as value}}\
	    <li class="buy-items">\
	        <div class="item-pic"><a class="bigD_item" track="{{value.maima_param}}" href="{{value.purl}}" target="_blank"><img gome-src="{{value.iurl}}" src="//img.gomein.net.cn/images/grey.gif"></a></div>\
	        <div class="item-price">¥<span>{{value.price}}</span></div>\
	        <div class="item-name"><a class="bigD_item" track="{{value.maima_param}}" href="{{value.purl}}" target="_blank">{{value.pn}}</a></div>\
	    </li>\
	{{/each}}'

	function getData(domId){
	    $.get(
	        dspData.url.bigdata_url,
	        {
	            boxid: "box45",
	            area: pageData.regionId,
	            cid: $.cookie("__clickidc"),
	            imagesize: 160,
	            c1id:dspData.dsp_gome_c1id,
	            c3id:dspData.dsp_gome_c3id,
	            brid: dspData.dsp_gome_brid,
	            search: pageData.searchkey
	        },
	        function(data){
	            if (data.lst && data.lst.length > 0) {
	                var listTpl = templateSimple.compile(tpl)(data);
	                var _length = data.lst.length;
	                $(domId).append('<dl class="nSearch-bottom-advertisement" id="nSearch-bottomHotSale"><dt class="hd"><span id="bottomHotSale-refresh" class="bottom-advertisement-refresh" curp="0">换一组</span>热销推荐</dt><dd class="bd"><ul class="bottom-advertisement-lists clearfix" id="bottomHotSale">'+listTpl+'</ul></dd></dl>');
	                if(_length<=6){$("#bottomHotSale-refresh").hide()}
	                var totlnum = (_length %6 ==0)?(parseInt(_length /6,10)-1):parseInt(_length /6,10);
	                var _i = 0;
	                $("#bottomHotSale").find(".buy-items").each(function(){
	                    if($(this).index()<6){
	                        $(this).addClass("cShow");
	                    }
	                    $(this).addClass("item"+parseInt($(this).index()/6,10))
	                })
	                $("#bottomHotSale-refresh").bind("click",function(){
	                    $("#bottomHotSale").find(".buy-items").removeClass("cShow");
	                    if(_i++ == totlnum || _i==3){
	                        _i=0;
	                    }
	                    $("#bottomHotSale").find(".item"+_i).addClass("cShow")
	                })
	            }
	        },
	        "jsonp"
	    );
	}
	module.exports = {
	    getData:getData
	}


/***/ }),
/* 23 */
/***/ (function(module, exports) {

	var tpl = '{{each lst as value}}\
	    <li class="buy-items">\
	        <div class="item-pic"><a class="bigD_item" track="{{value.maima_param}}" href="{{value.purl}}" target="_blank"><img gome-src="{{value.iurl}}" src="//img.gomein.net.cn/images/grey.gif"></a></div>\
	        <div class="item-name"><a class="bigD_item" track="{{value.maima_param}}" href="{{value.purl}}" target="_blank">{{value.pn}}</a></div>\
	        <div class="item-price"><b>¥{{value.price}}</b></div>\
	    </li>\
	{{/each}}'
	function getData(domId){
	$.get(
	    dspData.url.bigdata_url,
	    {
	        boxid: "box05",
	        area: pageData.regionId,
	        cid: $.cookie("__clickidc"),
	        imagesize: 160,
	        c1n: dspData.dsp_gome_c1name,
	        c3n: dspData.dsp_gome_c3name,
	        c1id: dspData.dsp_gome_c1id,
	        c3id: dspData.dsp_gome_c3id,
	        brid: dspData.dsp_gome_brid
	    },
	    function(data){
	        if (data.lst && data.lst.length > 0) {
	            var listTpl = templateSimple.compile(tpl)(data);
	            var _length = data.lst.length;
	            $(domId).append('<dl class="nSearch-bottom-advertisement" id="nSearch-quessYouLike"><dt class="hd"><span id="quessYouLike-refresh" class="bottom-advertisement-refresh" curp="0">换一组</span>根据浏览猜你喜欢</dt><dd class="bd"><ul class="bottom-advertisement-lists clearfix" id="bigD_quessLike">' + listTpl + '</ul></dd></dl>');

	            if (_length <= 6) {
	                $("#quessYouLike-refresh").hide()
	            }
	            var totlnum = (_length % 6 == 0) ? (parseInt(_length / 6, 10) - 1) : parseInt(_length / 6, 10);
	            var _i = 0;
	            $("#bigD_quessLike").find(".buy-items").each(function () {
	                if ($(this).index() < 6) {
	                    $(this).addClass("cShow");
	                }
	                $(this).addClass("item" + parseInt($(this).index() / 6, 10))
	            })
	            $("#quessYouLike-refresh").bind("click", function () {
	                $("#bigD_quessLike").find(".buy-items").removeClass("cShow");
	                if (_i++ == totlnum || _i == 3) {
	                    _i = 0;
	                }
	                $("#bigD_quessLike").find(".item" + _i).addClass("cShow")
	            })
	        }
	    },
	    "jsonp"
	);
	}
	module.exports = {
	    getData:getData
	}

/***/ }),
/* 24 */
/***/ (function(module, exports) {

	/**
	 * 根据cookie--proid120517atg 请求前台组获取最近浏览商品信息
	 * pagename 接口标识，判断请求来源
	 * */
	var tpl = '{{each result as value}}\
	            <li class="item">\
	                <p class="pic"><a href="{{value.url}}" target="_blank"><img gome-src="{{value.pic}}" src="//img.gomein.net.cn/images/grey.gif"></a></p>\
	                <p class="name"><a href="{{value.url}}" target="_blank">{{value.name}}</a></p>\
	                <p class="price">¥<span>{{value.price}}</span></p>\
	            </li>\
	        {{/each}}';
	function getData(pagename,domId){
	    var product_id = $.cookie("proid120517atg");
	    if(product_id == null || product_id ==""){return false;}

	    $.ajax({
	        type:"get",
	        dataType:"jsonp",
	        url:"//ss"+window.cookieDomain+"/item/v1/browse/prdreturn/"+$.parseJSON(product_id).join(",")+"/80/flag/"+window.pagename+"/recentViewed",
	        jsonpName:"recentViewed"
	    }).done(function(data){
	        if(data.success && data.result.length>0){
	            var listTpl = templateSimple.compile(tpl)(data);
	            $(domId).html('<dl class="nSearch-recentVisit"><dt class="hd">最近浏览</dt><dd class="bd"><ul class="recentVisit-lists clearfix" id="recentVisit-lists" modelid="9000002000">'+listTpl+'</ul></dd></dl>');
	        }
	    }).fail(function(){
	        console.log("请求失败")
	    });
	}
	module.exports = {
	    getData:getData
	}



/***/ })
/******/ ]);