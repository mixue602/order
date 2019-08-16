/**
 * facets 相关操作
 */

//从地址栏里获取相应参数
/*页面url说明：
*自营：有一个参数，http://coudan.gome.com.cn/?spid
*联营：有三个参数，http://coudan.gome.com.cn/?spid&crossShop=true&aid=xxx
*有两个参数，http://coudan.gome.com.cn/?spid&crossShop=false
*url参数描述：
*spid：xxx(活动id)；
*crossShop：true/false(跨店铺促销/店铺内促销)；
*aid：xxx(跨店铺id)；*/
if(window.location.search.indexOf("intcmp")!= -1){
	var coudanID=window.location.search.split("&")[1];
}else{
	var coudanID=window.location.search.substr(1).split("&")[0];
}

var productSite="//item"+cookieDomain;
var cloudSite = "//search"+cookieDomain;
var pageBrand = {};
var pageBrand_l ={};
var activestatus = true;//促销成立
var productLeftOffsetTop = $("#product-left").offset().top;


//请求商品数据基本参数
var pageData = {
	"pageSize":45,//每页大小 参数值范围：1-48
	"currentPage":1,//页码pageNumber 参数值范围：1-100
	"sort":0,//排序规则:20：价格降序;21：价格升序;10：销量数;30：上架时间;50：评论数;0：默认值综合排序
	"coudanID":coudanID,// (1)联营夸店铺，传（aid）  (2)自营或联营不夸店铺，传凑单id （spid）
	"isGome":1,//是否为自营 (1)自营1 (2)联营2
	"crossShop":0,//是否跨店  (1)自营或者联营不跨店铺0 (2)联营跨店铺1
	"catId":0,//筛选分类 ID,
	"facets":0,//筛选的 facets
	"priceTag":0,//自定义价格过滤 0:价格区间不生效 1：生效
	"price":0x0,//例：0x1000 过滤 0-1000 价格的商品例：1000x* 过滤 1000 以上价格的商品该字段是否生效取决于 priceTag
	"instock":1,//库存过滤 0:所有 1：仅展示有货
	"questiion":0,//搜索关键词
	"productTag":0,//自联营过滤  0：所有 1：只展示自营	
	"promoFlag":0,//大促过滤 0:所有 1：展示大促商品
	"couponType":1,//券类型:0：非全场 1全场
	"couDanPrice":0,//凑单价格区间  0：默认 有数值取值
	"couType":0,// 自营全场的增加商品属性，联营的为0
	"scrollHeights":productLeftOffsetTop,
	"muti_op":false,//多选标示  
	"facets_l":"",//facets多选中间存储
};
//http://apis.atguat.com.cn/p/cart/16/1/0/s1004d/1/0/0/0/0/0/0/手机/0/1
//品牌分类模板	
var brandList='\
   <% for(var i=0;i<content.facets.brand.items.length;i++){ %>\
	 <% var dataEach=content.facets.brand.items[i]%>\
		 <li class="c-brand <%if(i >15){%>brand-hide<%}%>"  brand-value="<%=dataEach.prefix%>">\
				<a id="x_<%=dataEach.id%>" brandid="<%=dataEach.id%>" href="javascript:void(0);" track="品牌:<%=dataEach.value%>" class="emcodeProp17" name="<%=dataEach.value%>"  <%if(dataEach.brandImg!=""){%>style="background-image:url(<%=dataEach.brandImg %>)"<%}else{%>style="text-indent:0"<%}%>><%=dataEach.value%></a>\
				<span class="brand-select"></span>\
			</li>\
	 <%}%>';
//相关分类模板
var catFacets='\
	<% for(var i=0;i<content.category.categoryTree.length;i++){ %>\
	<% var firstfeact=content.category.categoryTree[i]%>\
	<% for(var j=0;j<firstfeact.childs.length;j++){ %>\
		<% var secondfeact=firstfeact.childs[j]%>\
			<% for(var k=0;k<secondfeact.childs.length;k++){ %>\
				<% var dataEach=secondfeact.childs[k]%>\
				<li>\
					<a facetsid="<%=dataEach.id%>" href="javascript:void(0);" name="<%=dataEach.name%>" class="emcodeProp17">\
					<i></i><%=dataEach.name%></a>\
				</li>\
			<%}%>\
		<%}%>\
	<%}%>';




var getBrandTplsRender=template.compile(brandList);
var getFacetsTplsRender=template.compile(catFacets);
var bdarea_2 = $.cookie("atgregion")?$.cookie("atgregion").split("|")[2]:"11010200";




var facetsTpl= {
	init:function(){
		
		this.showloading();	
		this.geturlmesg();		
		this.meargemethed();//页面方法集合（包含购物车第一次请求接口）		
		this.eventbind();//绑定的事件集合
		this.changeCity();//城市
	},
	// 获取url信息方法
	getUrl_info:function (name) {
		var reg = new RegExp("(^|&)"+ name + "=([^&]*)(&|$)");
		var result = window.location.search.substr(1).match(reg);
		if(result != null) return unescape(result[2]);
		return null;
	},
	geturlmesg:function(){
		var _this =this;
		var _that =this;
		switch(_this.getUrl_info("crossShop")) {
			case null://地址里没有crossShop为自营
				pageData.isGome=1;
				break;
			case "true"://crossShop：true跨店铺促销(联营)
				pageData.isGome=2;
				pageData.coudanID = _this.getUrl_info("aid");//跨店铺的传活动id
				pageData.crossShop = 1;
				pageData.isCrossShop =true;
				break;
			case "false"://crossShop：false/店铺内促销(联营)；
				pageData.isGome=2;
				pageData.isCrossShop =false;
				break;
			default:
				break;
		};
		
		// 添加到购物车
		var cartListScroll = function() {
			var $cartListWarp = $("#cartListWarp"),
			$cartListBox = $("#cartList"),
			$btnPrev = $("#cartPrev"),
			$btnNext = $("#cartNext"),
			_currentIndex = 0,
			_hideNumber = 0,
			_len = 134,
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
		var renderCartInfo = function(data){
			return $.Deferred(function(defer){
				var _this = this;
				//return $.Deferred(function(defer){
				if(data.success){				
					var _data = data.data
		
					if(_data && !_data.satisfied && _data.desc ==null && _data.promotionType == null && _data.promotionSkusProfile == null){//促销结束
						activestatus = false;			
						$(".activityend").show();
						$("#nSearch-facets-search,#product-waiting,#cart-product,.areamatchbox,.product-lists,.product-box,.noProductBox-content").hide();
						return false
					}else{	
						activestatus = true;	
						$(".product-lists").show();
						//_this.getcoudanmesg(bdarea_2);		
						//促销描述
						if (_data.desc) $("#nSearch-crumb-searchNum").text(_data.desc);
						var totalpiece = '',
							totalprice = '',
							html_cartInfo_2 = '';
						//去购物车结算按钮
						$(".go-cart a").attr("href",'//cart'+cookieDomain+'/home/cart')
						if(_data.commerceItemVOs && _data.commerceItemVOs.length > 0){
							//列表
							$(".addcartbox").show();
							var listTpl  = templateSimple('addcartlist_tpl',{data:_data}); 
							$("#cartList").empty().append(listTpl);
						}else{
							$("#cartList").empty().css("left",0)
							$(".addcartbox").hide();
						}
						if(!_data.satisfied){//促销不成立
							switch(_data.promotionType){
								case "ManZeng_Promotion"://满赠
									$("#nSearch-crumb-searchNum").text("满赠");
									if(_data.promodifferAmount && _data.promodifferAmount !="" && _data.promodifferAmount >0){
										html_cartInfo_2 = '再买'+_data.promodifferAmount+'元，即可领取赠品';
									}else{
										html_cartInfo_2 = '满足条件后即可享受优惠';
									}
									break;
								// case "ManFan_Promotion":
								case "MUL_ZE_COUPONS"://多品满金额赠券促销
									$("#nSearch-crumb-searchNum").text("满返");
									//$(".cOrder-crumb-activity a").text("满返");
									//html_cartInfo_1 = '<div class="activity-title" style="background-position:-144px 0;"></div>';
									if(_data.promodifferAmount && _data.promodifferAmount !="" && _data.promodifferAmount >0){
										html_cartInfo_2 = '再买'+_data.promodifferAmount+'元，即可享受优惠';
									}else{
										html_cartInfo_2 = '满足条件后即可享受优惠';
									}
									break;
								case "MUL_ZE_DO"://多品满金额赠豆促销
									$("#nSearch-crumb-searchNum").text("满返");
								// $(".cOrder-crumb-activity a").text("满返");
								// html_cartInfo_1 = '<div class="activity-title" style="background-position:-144px 0;"></div>';
									if(_data.promodifferAmount && _data.promodifferAmount !="" && _data.promodifferAmount >0){
										html_cartInfo_2 = '再买'+_data.promodifferAmount+'件，即可享受优惠';
									}else{
										html_cartInfo_2 = '满足条件后即可享受优惠';
									}
									break;
								case "MUL_ZE_GIFTS"://多品满金额赠实物促销
								// $(".cOrder-crumb-activity a").text("满赠");
								$("#nSearch-crumb-searchNum").text("满赠");
								// html_cartInfo_1 = '<div class="activity-title" style="background-position:-48px 0;"></div>';
									if(_data.promodifferAmount && _data.promodifferAmount !="" && _data.promodifferAmount >0){
										html_cartInfo_2 = '再买'+_data.promodifferAmount+'元，即可享受优惠';
									}else{
										html_cartInfo_2 = '满足条件后即可享受优惠';
									}
									break;
								case "JJHG"://加价换购 
									if(_data.promodifferAmount && _data.promodifferAmount !="" && _data.promodifferAmount >0){
										html_cartInfo_2 = '再买'+_data.promodifferAmount+'元，即可换购商品';
									}else{
										html_cartInfo_2 = '满足条件后即可享受优惠';
									}
									break;
								case "MZ":// 满折
								case "ZDZ":
									if(_data.promodifferAmount && _data.promodifferAmount !="" && _data.promodifferAmount >0){
										html_cartInfo_2 = '再买'+_data.promodifferAmount+'件，即可享受优惠';
									}else{
										html_cartInfo_2 = '满足条件后即可享受优惠';
									}
									break;
								case "Coupon_promotion"://购物券
									html_cartInfo_1 = '<div class="activity-title" style="background-position:-288px 0;"></div>';
									break;
							// case "ManMian_Promotion":
								case "KDP_MM":
								case "POP_MF":
									//if(_data.promodifferAmount && _data.promodifferAmount !=""){
										html_cartInfo_2 = '满足条件后即可享受优惠';
									//}
									break;
								default : //ManJian_Promotion
									$("#nSearch-crumb-searchNum").text("促销");
									if(_data.promodifferAmount && _data.promodifferAmount !="" && _data.promodifferAmount >0){
										html_cartInfo_2 = '再买'+_data.promodifferAmount+'元，即可享受优惠';
									}else{
										html_cartInfo_2 = '满足条件后即可享受优惠';
									}
									break;
							}
							//html_cartInfo_2 ='满足条件后即可享受优惠';
							if(_data.promotionSkusProfile && _data.promotionSkusProfile.skuNum) {
								totalpiece = _data.promotionSkusProfile.skuNum;
								totalprice = "¥"+_data.promotionSkusProfile.total.toFixed(2);
							}
							$(".activity-desc").html(html_cartInfo_2);//描述
						}else{
							switch(_data.promotionType){
								case "ManZeng_Promotion":
									html_cartInfo_2 = '已享受赠品优惠</div>';
									break;
								// case "ManFan_Promotion":
								case "MUL_ZE_COUPONS"://多品满金额赠券促销
			
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
									html_cartInfo_2 = '下单可返'+text_manfan;
									break;
								case "MUL_ZE_DO"://多品满金额赠豆促销
									var text_manfan = _data.returnedCouponCommerceItemVOs[0].quantity;
									html_cartInfo_2 = '下单可返'+text_manfan+'美豆';
									break;
								case "MUL_ZE_GIFTS"://多品满金额赠实物促销
									html_cartInfo_2 = '请去购物车选择赠品</div>';
									break;
								case "JJHG"://加价换购
									html_cartInfo_2 = '请去购物车换购商品</div>';
									break;
								case "MZ":// 满折
								case "ZDZ"://整单折
									html_cartInfo_2 = '已享受优惠'+_data.postPromotion+'元';
									break;
								case "Coupon_promotion"://购物券
									break;
							// case "ManMian_Promotion":
								case "KDP_MM"://满免
									html_cartInfo_2 = '已享受优惠'+_data.postPromotion+'元';
									break;
								default : //ManJian_Promotion,ManZhe_Promotion,ZhengDanZhe_Promotion,ManMian_Promotion
									if(_data.postPromotion && _data.postPromotion !="0.00"){
										html_cartInfo_2 ='已享受优惠' + _data.postPromotion + '元';
									}else{
										html_cartInfo_2 ='已享受优惠';
									}
									break;
							}
							if(_data.promotionSkusProfile && _data.promotionSkusProfile.skuNum) {
								totalpiece = _data.promotionSkusProfile.skuNum;
								totalprice = "¥"+_data.promotionSkusProfile.total.toFixed(2);
							}
							$(".activity-desc").html("已满足条件，"+html_cartInfo_2);//描述
						}
						$(".totalpiece").html(totalpiece);//总件数
						$(".totalprice").html(totalprice);//总件数
						
						//只有一种商品的时候不允许删除
						if($("#cartList li").length <=1){
							$("#cartList li").find(".c-remove").hide();
						};
						_that.getcoudanmesg(bdarea_2);//获取券信息
					};
				}else{
					$(".activityend").show();
					$("#nSearch-facets-search,#product-waiting,#cart-product,.areamatchbox,.product-lists,.product-box,.noProductBox-content").hide();
					return false;
				}
			}).promise();
		};
		var getCartInfo = (function(){
			if(pageData.isGome==1){
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
							"spid":coudanID
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
							"crossShop":pageData.isCrossShop,
							"spid":coudanID
						}
					})
				}
			}
		}());
		if(this.getUrl_info("source") || window.location.search.indexOf("source")!= -1){//从详情页跳转过来的
			this.getcoudanmesg(bdarea_2);//获取券信息
			$("#cart-product").hide();
		}else{
			getCartInfo().then(renderCartInfo).then(cartListScroll);
		}		
		//加入购物车
		var _this =this;
		
		//抛物线
			// 元素以及其他一些变量
			var numberItem = 0;
			var eleFlyElement=document.getElementById("flyItem");//飞的元素
			var eleShopCart =document.getElementById("cartList");//购物车栏(目标元素)
			// 抛物线运动
			var myParabola = funParabola(eleFlyElement, eleShopCart, {
				speed: 200,
				curvature: 0.002,
				complete: function() {//加入成功的回调
					eleFlyElement.style.visibility = "hidden";//隐藏飞的元素
				}
			});
			// 绑定点击事件
			if(eleFlyElement && eleShopCart) {
				$(".product-box").on("click",".addCart",function(event) {
					var _that=$(this);
					var sid = _that.attr("data-sid"),
					pid = _that.attr("data-pid");
					if(_this.getUrl_info("source") || window.location.search.indexOf("source")!= -1){//从详情页跳转过来的,改变加入购物车接口
						window.open("//cart"+cookieDomain+"/addsuccess?intcmp="+_that.attr("data-sid")+"&homesite=home&type=0&sid="+sid+"&pid="+pid+"&pcount=1&cr=0"+"&_r="+new Date().getTime(),"_blank")
					}else{
						fnfly();
						function fnfly(){
							$("#flyItem").show();
							var imgSrc=_that.parents('li').find('.item-pic img').eq(0).attr('src');
							$(".fly_item img").attr('src',imgSrc);
							// 滚动大小
							var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft || 0,
								scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
							$("#flyItem").css({'left':event.clientX + scrollLeft + "px",'top':event.clientY + scrollTop + "px","visibility":"visible"});
							//请求加入购物车
							var sid = _that.attr("data-sid"),
								pid = _that.attr("data-pid");
								//_this.getCartInfo(sid,pid);
							getCartInfo(sid,pid).then(renderCartInfo).then(cartListScroll);
							// 需要重定位
							myParabola.position().move();
						};
					}					
				});
			}
		
		// 删除购物车内商品操作
		$("#cartList").on("click",".c-remove",function() {
			$("#cartList").css("left","0");
			$.ajax({
				type:"get",
				dataType:"jsonp",
				url:"//cart"+cookieDomain+"/home/api/cart/"+ ((pageData.isGome==1) ? 'removeItemCD' : 'removeShopItemCD'),
				data:{
					"cid":$(this).attr("data-cid"),
					"spid":coudanID
				},
				JsonpName:"deleteFn"
			}).then(renderCartInfo).then(cartListScroll);;
		});
	},
	changeCity:function(){//改变区域
		var _this =this;
		$('#address').gCity({
			gc_ads: 'chtm',
			gc_evt: function() {
				$.cookie('atgregion', this.xid + "|" + this.chtm + "|" + this.cid + "|" + this.sid + "|" + this.zid, {
					expires: 30,
					path: '/',
					domain:cookieDomain
				});
				var bdarea_2 =this.cid;
				pageData.currentPage = 1;
				_this.getcoudanmesg(bdarea_2);
			}
		});
	},
	getcoudanmesg:function(bdarea_2){//获取优惠券信息
		var _this =this;
		if(pageData.isGome ==1){//自营才请求促销接口	
			$.ajax({
				type:"GET",
				//url:'//10.115.0.125:3221/promotion/index/getPromotionPromInfo.do?promotionId='+pageData.coudanID+'&regionCode='+bdarea_2,
				url:'//hd'+cookieDomain+'/promotion/index/getPromotionPromInfo.do?promotionId='+pageData.coudanID+'&regionCode='+bdarea_2,
				cache: false,
				dataType:"jsonp",
				jsonpCallback: "condanmesg",
				success:function(data){	
					if(data.data){
						//是否是全场券
						if(data.data.isAll =='1'){
							pageData.couponType=1;
							//couType自营全场的增加商品属性
							if(data.data.couType && data.data.couType !=""){
								pageData.couType = data.data.couType;
							}
						}else{
							pageData.couponType=0;
						};
						//促销价格区间
						if(data.data.pricePart && data.data.pricePart !=""){
							pageData.couDanPrice = data.data.pricePart;
							//pageData.couDanPrice = data.data.floorAmount+'x'+data.data.topAmount;
							//pageData.couDanPrice = 0;
						}
						//区域匹配
						if(data.data.matchWithCurrentRegion){//匹配请求
							if(activestatus){	//促销成立
								
								_this.getfacetsIndex();									
								$("#product-box,#cart-product").show();
								$(".areamatchbox,.activityend").hide();
								if(_this.getUrl_info("source") || window.location.search.indexOf("source")!= -1){//从详情页跳转过来的
									$("#cart-product").hide();
									$("#nSearch-crumb-searchNum").text("活动商品");
								}
							}				
						}else{	//不匹配
							if(activestatus){	//促销成立
								$(".areamatchbox").show();		
							}else{						
								$(".areamatchbox,.noProductBox-content").hide();
							}
							if(_this.getUrl_info("source") || window.location.search.indexOf("source")!= -1){//从详情页跳转过来的
								//从详情页跳过来的
								$("#nSearch-crumb-searchNum").text("活动商品");
								$(".areamatchbox p").hide();
							};
							$("#product-box,.product-box,.noProductBox-content").hide();
							$("#nSearch-facets-search,#product-waiting,#cart-product").hide();
							//区域不匹配不能点击排序和筛选
							$("#fc-btn-ok,#fc-btn-cancel").unbind();
							$("#filter-order-box").undelegate();
							$(".filter-resultSearch-btn").unbind();
							$(".filter-label-box #deliv").unbind();
							$(".filter-label-box #promotion").unbind();
							$("#mp-next,#mp-prev").unbind().addClass("mp-disable");
							//区域不匹配不显示大促筛选
							$("#promotion").hide();
							//隐藏分类和品牌
							$("#nSearch-facets-search").hide();
							$("#searchTotalNumber").text(0);
							//页数显示
							$("#min-pager-number").text("1/1");
						}
					}else{		
						if(_this.getUrl_info("source") || window.location.search.indexOf("source")!= -1){//从详情页跳转过来的
							$("#nSearch-crumb-searchNum").text("活动商品");
							if(_this.getUrl_info("back")){
								var backurl = _this.getUrl_info("back");
							}else if(_this.getUrl_info("amp;back")){
								var backurl = _this.getUrl_info("amp;back");
							}else{
								var backurl ="";
							};
							$(".noProductBox-content").html('<div class="title"><span class="icon"></span>抱歉，没有更多相关商品了。</div><p><a href="//'+backurl+'" class="nBlue">返回上一页</a></p>');
							$(".noProductBox-content").show();
						}else{
							$(".noProductBox-content").show();
						};
						$(".areamatchbox,.activityend").hide();		
						
					}	
				}
			});
		}else{		
			if(activestatus){
				if(_this.getUrl_info("source") || window.location.search.indexOf("source")!= -1){//从详情页跳转过来的
					$("#nSearch-crumb-searchNum").text("活动商品");
				}
				_this.getfacetsIndex();	
			}			
		}
	},
	getfacetsIndex:function(){//请求商品数据
		  var _this=this;
		  $.ajax({
				type:"GET",
				async: false, 
				url:'//apis'+cookieDomain + '/p/cart/'+pageData.pageSize+'/'+pageData.currentPage+'/'+pageData.sort+'/'+pageData.coudanID+'/'+pageData.isGome+'/'+pageData.crossShop+'/'+pageData.catId+'/'+pageData.facets+'/'+pageData.priceTag+'/'+pageData.price+'/'+pageData.instock+'/'+pageData.questiion+'/'+pageData.promoFlag+'/'+pageData.couponType+'/'+pageData.couDanPrice+'/'+pageData.couType,
				cache: false,
                data:{
					"from":"coudan"
				},
				dataType:"jsonp",
				beforeSend: function () {
					_this.showloading();
				},
				success:function(data){		
				    _this.hideLoading();
					_this.renderfacetsIndex(data);
					//window.lazyloadfn();//懒加载图片和价格
					eachScreenDom($("#product-box li"));
			  
				},
				error:function(){
					if(_this.getUrl_info("source") || window.location.search.indexOf("source")!= -1){//从详情页跳转过来的
						$("#nSearch-crumb-searchNum").text("活动商品");
						if(_this.getUrl_info("back")){
							var backurl = _this.getUrl_info("back");
						}else if(_this.getUrl_info("amp;back")){
							var backurl = _this.getUrl_info("amp;back");
						}else{
							var backurl ="";
						};
						$(".noProductBox-content").html('<div class="title"><span class="icon"></span>抱歉，没有更多相关商品了。</div><p><a href="//'+backurl+'" class="nBlue">返回上一页</a></p>');
						$(".noProductBox-content").show();
					}else{
						$(".noProductBox-content").show();
					};
					$(".areamatchbox,.activityend").hide();		
				}
		  })
		  
	},
	renderfacetsIndex:function(data){
		var _this=this;
		pageData.muti_op = false;
		/*商品详情*/
	    if(data.content.prodInfo && data.content.prodInfo.products && data.content.prodInfo.products.length>0){
			var listTpl  = templateSimple('item_tpl',{data:data}); //{data:data,index:i}
		  //var listTpl=getItemTplsRender(data);
			 $("#product-box").show().empty().append(listTpl);
			 $(".noProductBox-content").hide();
			 $("#product-pager,.product-box").show()
			if(activestatus){//促销成立
				$("#nSearch-facets-search").show();
			}
	    }else{
			if(_this.getUrl_info("source") || window.location.search.indexOf("source")!= -1){//从详情页跳转过来的
				$("#nSearch-crumb-searchNum").text("活动商品");
				if(_this.getUrl_info("back")){
					var backurl = _this.getUrl_info("back");
				}else if(_this.getUrl_info("amp;back")){
					var backurl = _this.getUrl_info("amp;back");
				}else{
					var backurl ="";
				};
				$(".noProductBox-content").html('<div class="title"><span class="icon"></span>抱歉，没有更多相关商品了。</div><p><a href="//'+backurl+'" class="nBlue">返回上一页</a></p>');
				$(".noProductBox-content").show();
			}else{
				$(".noProductBox-content").show();
			};			
			$(".areamatchbox,.activityend,#product-box,#product-pager").hide();		
		}
		//条数
		$("#searchTotalNumber").text(data.content.pageBar.totalCount);
		
		/*品牌*/  
	   

		if(data.content.facets && data.content.facets.brand && data.content.facets.brand.items.length>0){
		  	var BrandTplsTmpl=getBrandTplsRender(data);
			  $("#facetsbrandUl").empty().append(BrandTplsTmpl);		
			if(pageData.facets != "" ){
				$("#facets-category-brand").hide()
			}else{
				$("#facets-category-brand").show()
			}
		}else{
			$("#facets-category-brand").hide()
		}
		/*相关分类*/		
		//if(pageData.facets !=0){
		if(data.content.category && data.content.category.categoryTree && data.content.category.categoryTree.length>0){
			var FacetsTplsTmpl=getFacetsTplsRender(data);
				$("#catFacets").empty().append(FacetsTplsTmpl);
				if(pageData.catId ==0){
					$(".catFacetselected ul").empty().append(FacetsTplsTmpl);
				}
			if(pageData.catId != "" ){
				$("#facets-category-common").hide()
			}else{
				$("#facets-category-common").show()
			}			
		}
		//}
		/*其他分类*/
		if(data.content.facets && data.content.facets.commonfacets){
			var commonfacetTpl  = templateSimple('commomfaect_tpl',{data:data}); //{data:data,index:i}
			//var listTpl=getItemTplsRender(data);
			$("#facets_commom_box").empty().append(commonfacetTpl);
		}
		
		_this.showMore();

		/*分页*/
		 _this.setPageInfo(data.content.pageBar);	

		/*已选分类*/
		if(data.content.selectData.facets){
			var selectedfacetsTpl  = templateSimple('selectedfacets_tpl',{data:data});
			$(".nSearch-crumb-facetsCurrent").empty().append(selectedfacetsTpl)
		};
		/*大促信息*/	
		if(data.content.promoInfo){
				$("#promotion").show();
				if(data.content.promoInfo[0].imgUrl !=""){
					var imgurl =data.content.promoInfo[0].imgUrl;
					$(".promotionmesg").html('<img src="'+imgurl+'" style="height:23px;">');
				}else{
					$(".promotionmesg").html(data.content.promoInfo[0].text)
				}				
		}else{
			$("#promotion").hide();
		};
		//已选相关分类
		if(data.content.selectData.category && data.content.selectData.category.third && data.content.selectData.category.third.name !=""){
			$(".nSearch-crumb-catFacet,.catfaceticon").show();
			$(".nSearch-crumb-catFacet .word").text(data.content.selectData.category.third.name)
		};
		//已选相关分类的下拉列表
		_this.scrollfaect();
	},
	/*翻页商品处理*/
	getPrdmesg:function(){
		var _this=this;
		$.ajax({
			  type:"GET",
			  url:'//apis'+cookieDomain + '/p/cart/'+pageData.pageSize+'/'+pageData.currentPage+'/'+pageData.sort+'/'+pageData.coudanID+'/'+pageData.isGome+'/'+pageData.crossShop+'/'+pageData.catId+'/'+pageData.facets+'/'+pageData.priceTag+'/'+pageData.price+'/'+pageData.instock+'/'+pageData.questiion+'/'+pageData.promoFlag+'/'+pageData.couponType+'/'+pageData.couDanPrice+'/'+pageData.couType,
			  cache: false,
			  data:{
				  "from":"coudan"
			  },
			  dataType:"jsonp",
			  beforeSend: function () {
				  _this.showloading();
			  },
			  success:function(data){		
				_this.hideLoading();//隐藏loading
				//只渲染商品列表
				if(data.content.prodInfo && data.content.prodInfo.products && data.content.prodInfo.products.length>0){
					//var listTpl=getItemTplsRender(data);
					var listTpl=templateSimple('item_tpl',{data:data}); 
					$("#product-box").empty().append(listTpl);
					$("#nSearch-facets-search").show();
				}else{
					var errorTplsTmpl=geterrorTplsRender(data);
					$("#product-box").empty().append(errorTplsTmpl);
					$("#personrecommend").css("max-height","462px");
				};
				//条数
				$("#searchTotalNumber").text(data.content.pageBar.totalCount);
				/*分页*/
		 		_this.setPageInfo(data.content.pageBar);	
				//window.lazyloadfn();//懒加载图片和价格
				eachScreenDom($("#product-box li"));
			
		   }
		})
	},
	/*图片加载*/
	showloading:function(){
		  pageData.state = true;
		  $("#product-waiting").show();
		},
	/*取消图片加载*/
   	hideLoading:function(){
		  pageData.state = false;
		  $("#product-waiting").hide();
		},
	/*设置页数*/
   	setPageInfo:function(data){
		if(data.pageNumber == undefined){
			pageData.currentPage = 0;
		}else{
			pageData.currentPage = data.pageNumber;
		}       
        pageData.totalPage = data.totalPage;
		
		/*搜索商品的数量*/
		$("#searchTotalNumber").text(data.totalCount);
		/*当前页/总页数*/
        $("#min-pager-number").text(pageData.currentPage+"/"+pageData.totalPage);
        $("#mp-prev").removeClass("mp-disable");
        $("#mp-next").removeClass("mp-disable");
        if(pageData.currentPage == pageData.totalPage){
            $("#mp-next").addClass("mp-disable");
        }
        if(pageData.currentPage == 1){
            $("#mp-prev").addClass("mp-disable");
        }
		/*分页插件*/
		$("#j-page").ucPager({
            pageClass: "",
            currentPage:parseInt(pageData.currentPage), 
            totalPage: parseInt(pageData.totalPage),
            pageSize: 45,
            clickCallback: function(curPage) {
				pageData.currentPage = curPage;
				//facetsTpl.getpriceiange();/*价格区间*/
				//facetsTpl.getfacetsIndex();
				facetsTpl.getPrdmesg();


                var scrollHeight = $("#product-left").offset().top;
                $(window).scrollTop(scrollHeight);
            }
        });

       
	},
	/*价格区间*/
	getpriceiange:function(){
		var priceRange = "",
		marker=1;
		var price1 = $("#fc-lowPrice").val();
		var price2 = $("#fc-highPrice").val();
		if(price2 == "¥" && price1 == "¥"){
			marker=0;
			priceRange=0;
		}else if(price1 == "¥"){
			priceRange="0x"+price2;
		}else if(price2 == "¥"){
			priceRange=price1+"x*";
		}else{
			priceRange = Math.min(price1, price2) + "x" + Math.max(price1, price2);
			
		}
		pageData.price = priceRange;
		pageData.priceTag = marker;
	},
	scrollfaect:function(){
		/**
     * 初始化已选分类
     * 【一】滑动控制
     * 【二】全部清空按钮操作
     **/
		var moveSt = (function(){
			var space = 0;
			var _li = $(".nSearch-crumb-facetsCurrent").find("li");


			space = $("#nSearch-crumb-searchNum").width() + $("#nSearch-crumb-keyWord").width()+$(".catfaceticon").width()+$(".nSearch-crumb-catFacet").width() +65;
			space =  $(".nSearch-crumb").width()-space;
			/*初始化已选facets样式*/
			if(_li.length>0){
				var _width = 0;
				$(".nSearch-crumb-facetsCurrent").addClass("haschecked");
				for(var i =0,j=_li.length;i<j;i++){
					_width+=_li.eq(i).width()+35;
				}
				if(_li.length >= 2) {
					$("#clearallfacts").show();
					
				}else{
					$("#clearallfacts").hide();
				}
				space = space - 110;
				$(".nSearch-crumb-facetsCurrent").width(_width);
				$("#nSearch-crumb-facetsCurrent-warp").width(space);
	
				if(_width > space){
					$(".facetsCurrent-next").show();
				}
				return space - _width
			}
			return 0;
		})();
		$(".facetsCurrent-next").live("click",function(){
			var moveSt = $(".nSearch-crumb").width()-$("#nSearch-crumb-searchNum").width() - $("#nSearch-crumb-keyWord").width() -65;
			var _li = $(".nSearch-crumb-facetsCurrent").find("li");
			var _width =0;
			for(var i =0,j=_li.length;i<j;i++){
				_width+=_li.eq(i).width()+100;
			};

			$(".nSearch-crumb-facetsCurrent").animate({"left":(moveSt - _width)+"px"},100,function(){
				$(".facetsCurrent-prev").show();
				$(".facetsCurrent-next").hide();
			});
		});
		$(".facetsCurrent-prev").live("click",function(){
			$(".nSearch-crumb-facetsCurrent").animate({"left":0},100,function(){
				$(".facetsCurrent-next").show();
				$(".facetsCurrent-prev").hide();
			});
		});
	},
	meargemethed:function(){
		//更改title
		if(this.getUrl_info("source") || window.location.search.indexOf("source")!= -1){//从详情页跳转过来的
			$(document).attr("title","活动商品_国美");
		};
		//全部清空按钮
		$("#noResultReturnBack,#clearallfacts").click(function(){
			window.location.reload();//刷新当前页面.
		});
		/**
		 * 价格区间筛选处理事件
		 * 【一】输入框设置，屏蔽特殊字符，获取焦点，失去焦点
		 * 【二】移出价格区间区域，修改样式
		 * 【三】【取消】按钮事件
		 * 【四】【确定】按钮事件，调用function.makeHelf模块处理跳转地址
		 */
		$(".priceRange-input input").bind({
			// "keydown": function() {
			// 	$(this).val($(this).val().replace(/[A-Za-z`~!@#$%^&*_+=¥￥（）()<>?:"{},\/;'[\]！。......，…——、‘；—【】|？》《“：\\\-” \u4e00-\u9fa5]/g,''));
			// },
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
		$("#fc-btn-cancel").bind("click", function(event) {
			event.preventDefault();
			$(".priceRange-input input").val("¥");
			facetsTpl.getpriceiange();/*价格区间*/			
			pageData.currentPage =1;
			//facetsTpl.getfacetsIndex(pageData.currentPage,pageData.sort,pageData.facets,pageData.catId,1,priceRange); 
			facetsTpl.getfacetsIndex(); 
		});
		/*品牌单选多选操作*/
		$(".c-brand").find("a").live("click",function(){			
			var brandChecked_box = $("#category-brand-hasCheck"),
				multiSelect_confirm_ok = $(".fc-btn-ok");
						
			if(pageData.muti_op){
				var _facets = $(this).attr("brandid")
				/*品牌多选*/
				if ($(this).hasClass("chk")) {
					$(this).removeClass("chk");
					$(this).parents(".c-brand").removeClass("lichk");
					brandChecked_box.find("#ck_"+ _facets).remove();
					pageData.facets_l=  pageData.facets_l.replace(_facets,"");
					//pageBrand_l[_facets] = "";
				} else {
					// if(brandChecked_box.find('li').length < 16){
						$(this).addClass("chk");
						$(this).parents(".c-brand").addClass("lichk");
						brandChecked_box.append('<li class="ckes" id="ck_'+_facets+'" valuer="'+_facets+'"><i></i>'+$(this).attr("name")+'</li>')
						pageData.facets_l += $(this).attr("brandid");
						//pageBrand_l[_facets] = $(this).attr("name");
					// }else{
					// 	$("#brand-hasChecktip").show();
					// }			
				}
				(pageData.facets_l != "") ? multiSelect_confirm_ok.removeClass("fc-disable") : multiSelect_confirm_ok.addClass("fc-disable");
				(brandChecked_box.find(".ckes").length>0)?brandChecked_box.show():brandChecked_box.hide();
			}else{
				/*品牌单选*/
				$(this).parents("li").siblings().addClass('disabled');//防止重复请求
				if($(this).parents("li").hasClass('disabled')){
					return false;
				}else{
					pageData.facets = $(this).attr("brandid");		
					pageData.currentPage = 1;
					facetsTpl.getfacetsIndex(); 
				}
			}

		});
		/*相关分类点击更多事件*/
		$("#facets-category-common .fc-option-more").unbind().bind("click", function() {
			if ($(this).hasClass("open")) {
				$(this).removeClass("open");
				$(this).html("<i></i>更多");
				if ($("#catFacets").height() >= 68){
					$(".category-catBox").css("height","68px");
				}else{
					$(".category-catBox").css("height","34px");
				};
				$("#facets-category-common .category-normal").removeClass("relevantfaects");
				pageData.scrollHeights=$("#product-left").offset().top;
			} else {
				$(this).addClass("open");
				$(this).html("<i></i>收起");
				if ($("#catFacets").height() >= 68 && $("#catFacets").height() <= 102){
					$(".category-catBox").css("height","102px");
				}else if($("#catFacets").height() >102){
					$(".category-catBox").css("height","136px");
					$("#facets-category-common .category-normal").addClass("relevantfaects");
				};
				pageData.scrollHeights=$("#product-left").offset().top;
			}
		})
		/*普通分类多选事件*/
		$('.facets-category-common .fc-option-multiple').live('click',function(){//多选
			clearMultiSelectStatus();
			pageData.muti_op = true;	
			pageData.facets_l ="";
			$(this).parents('.facets-category').data('isMultiSelect',true).addClass('multiSelectStatus');
			$(this).parents('.facets-category').find('.fc-option-more').data('isOpen',false).trigger('click');
		});
		$('.facets-category-common .fc-btn-cancel').live('click',function(){//取消
			var _parent = $(this).parents('.facets-category');
			_parent.find('.facet').filter(function(){return $(this).data('isSelect')}).trigger('click');
			_parent.find('.fc-option-more').data("isOpen",true).trigger('click');
			_parent.data('isMultiSelect',false).removeClass('multiSelectStatus');
			pageData.muti_op = false;
			var arr =[];
			_parent.find('.facet').each(function(){
				if($(this).hasClass("chk")){				
					arr.push($(this).attr('facetsid'));
				}
			});
			var alreayselect = arr.join('');
			pageData.facets_l = pageData.facets_l.replace(alreayselect,"");
			_parent.find('.facet').removeClass("chk");
			$(this).parents('.fc-btn-box').find('.fc-btn-ok').addClass("fc-disable");
		});
		$('.facets-category-common .fc-btn-ok').live('click',function(){//确认
			if(pageData.facets !=0){
				pageData.facets  += pageData.facets_l;
			}else{
				pageData.facets = pageData.facets_l;
			}
			pageData.currentPage = 1;
			facetsTpl.getfacetsIndex(); 
		});
		$('.facets-category-common .facet').live('click',function(event){
			var _this = $(this),
				_parent = _this.parents('.facets-category'),
				facet_checked = _parent.data('selectFacet'),
				multiSelect_confirm = $(this).parents(".facets-category-common").find(".fc-btn-box"),
				multiSelect_confirm_ok = multiSelect_confirm.find(".fc-btn-ok");
			if(pageData.muti_op){//多选
				event.preventDefault();
				if(_this.hasClass("chk")){
					_this.removeClass('chk');
					pageData.facets_l=  pageData.facets_l.replace(_this.attr('facetsid'),'');
				}else{
					_this.addClass('chk');
					pageData.facets_l += _this.attr('facetsid');
				}
			}else{//单选
				if(pageData.facets !=0){
					pageData.facets  += _this.attr("facetsid");
				}else{
					pageData.facets = _this.attr("facetsid");
				}
				pageData.currentPage = 1;
				facetsTpl.getfacetsIndex(); 

			}
			(pageData.facets_l != "") ? multiSelect_confirm_ok.removeClass("fc-disable") : multiSelect_confirm_ok.addClass("fc-disable");
		});

		//其他分类单选多选操作facets-category-common
		function clearMultiSelectStatus(){
			$('.multiSelectStatus').find('.fc-btn-cancel').trigger('click');
		};
		/**
		 * 聚合分类facet
		 * 【一】滑入滑出效果
		 * 【二】聚合分类facet的【取消】按钮 追加处理事件
		**/
		$('.category-syn').live({
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
		$('.facets-category-syn .fc-btn-cancel').live('click',function(){
			$(this).parents('.category-syn').removeClass('category-syn-open');
			var arr =[];
			$(this).parents('.category-syn-con').find('.facet').each(function(){
				if($(this).hasClass("chk")){				
					arr.push($(this).attr('facetsid'));
				}
			});
			var alreayselect = arr.join('');
			pageData.facets_l = pageData.facets_l.replace(alreayselect,"");
			$(this).parents('.category-syn-con').find('.facet').removeClass("chk");
			$(this).parents('.category-syn-btn').find('.fc-btn-ok').addClass("fc-disable");
		});
		$('.facets-rele').unbind().bind({
			"mouseenter":function(event){
				$(this).parents('.facets-category').data('isMultiSelect',false);
			}
		});
		// 聚合分类多选
		$('.facets-category-syn .facet').live('click',function(event){
			//alert(pageData.muti_op)
			event.preventDefault();
			var _this = $(this),
				_parent = _this.parents('.category-syn'),
				facet_checked = _parent.data('selectFacet');
				multiSelect_confirm = $(this).parents(".category-syn").find(".category-syn-btn"),
				multiSelect_confirm_ok = multiSelect_confirm.find(".fc-btn-ok"),
				isdisable={};
			//聚合都是多选
				
				if(_this.hasClass("chk")){
					_this.removeClass('chk');
					isdisable=  isdisable.replace(_this.attr('facetsid'),'');
				}else{
					_this.addClass('chk');
					isdisable += _this.attr('facetsid');
				}
			(isdisable != "") ? multiSelect_confirm_ok.removeClass("fc-disable") : multiSelect_confirm_ok.addClass("fc-disable");
		});
		$('.facets-category-syn .fc-btn-ok').live('click',function(){//确认
			var arr =[];
			$(".facets-category-syn .facet").each(function(){
				if($(this).hasClass("chk")){				
					arr.push($(this).attr('facetsid'));
				}
			})
			
			if(pageData.facets !=0){
				pageData.facets  += arr.join("");
			}else{
				pageData.facets = arr.join("");
			}
			pageData.currentPage = 1;
			facetsTpl.getfacetsIndex(); 
		});
		/*解除品牌绑定事件*/
		$(".topCheckedfeact").live("click",function(e){
			e.preventDefault();
			pageData.facets = pageData.facets.replace($(this).attr('filterid'),'');
			if(pageData.facets ==""){
				pageData.facets=0;
			}
			pageData.currentPage = 1;
			$(".fc-btn-cancel").click();
			facetsTpl.getfacetsIndex(); 
		})

		/*解除分类绑定事件*/
		$(".topCheckedCate").live("click",function(){
			pageData.catId = 0;
			pageData.currentPage = 1;
			$(".nSearch-crumb-catFacet,.catfaceticon").hide();
			$("#facets-category-common").find(".category-normal").height("30px");
			$("#facets-category-common").find(".fc-option-more").removeClass("open").html("<i></i>更多");
			facetsTpl.getfacetsIndex(); 
		});
		//滚动固底
		$(window).bind("scroll",function(){
			var offsetTop =$("#canzhaowu").offset().top-580;//500是页面尾部的高度
			if($(document).scrollTop() < offsetTop){
				$("#cart-product").addClass("onfixed");
			}else{
				$("#cart-product").removeClass("onfixed");
			};
			// //$(window).bind("scroll",function(){
			// var windowHeight = $(window).height();
			// var scrollheigth = $(document).scrollTop()+windowHeight;
			if($(document).scrollTop() >= pageData.scrollHeights){ 
				if(!pageData.isIE6){
					$("#filter-box").addClass("infixs");
				} 
			}else{
				if(!pageData.isIE6){
					$("#filter-box").removeClass("infixs");
				}
			}
			
			//})
		});
	},
	showMore: function() {
		//品牌facets更多事件绑定		
		$("#facets-category-brand").each(function() {
			var $this = $(this),
				more_btn = $(this).find(".fc-option-more"),
				brand_box = $(this).find(".category-brand"),
				letter_box = $(this).find(".category-brand-f-letter"),
				brandChecked_box = $(this).find("#category-brand-hasCheck"),
				brand_li = brand_box.find("li"),
				brand_li_hide = brand_box.find(".brand-hide"),
				multiSelect_btn = $(this).find(".fc-option-multiple"),
				multiSelect_confirm = $(this).find(".fc-btn-box"),
				multiSelect_confirm_ok = multiSelect_confirm.find(".fc-btn-ok"),
				multiSelect_confirm_cancel = multiSelect_confirm.find(".fc-btn-cancel")
		
			if (brand_li.length > 14) {
				more_btn.show()
			}
			if (brand_li.length < 2) {
				multiSelect_btn.hide()
			}
			more_btn.unbind().bind("click", function() {
				if ($(this).hasClass("open")) {
					$(this).removeClass("open");
					$(this).html("<i></i>更多");
					brand_li.show();
					brand_li_hide.hide();
					letter_box.hide().find("li").removeClass("cur");
					letter_box.find(".all").addClass("cur");
					$this.removeClass("moreStatus");
				} else {
					$(this).addClass("open");
					$(this).html("<i></i>收起");
					brand_li_hide.show();
					letter_box.show();
					$this.addClass("moreStatus");
				}
			})
				
			multiSelect_btn.unbind().bind("click", function() {
				pageData.muti_op = true;
				$this.addClass("multiSelectStatus");
				more_btn.addClass("open");
				more_btn.html("<i></i>收起");
				brand_li_hide.show();
				letter_box.show();
				pageData.facets_l="";
			})
			
			multiSelect_confirm_ok.unbind().bind("click", function(e) {
				if (!$(this).hasClass("fc-disable")) {
					e.preventDefault();
					pageBrand = pageBrand_l;
					pageData.facets = pageData.facets_l;
					pageData.currentPage = 1;
					facetsTpl.getfacetsIndex(); 
				}
				
			})
			multiSelect_confirm_cancel.unbind().bind("click", function() {
				pageData.muti_op = false;
				pageBrand = {}
				pageBrand_l = {}
				$this.removeClass("multiSelectStatus");
				if (more_btn.hasClass("open")) {
					more_btn.removeClass("open");
					more_btn.html("<i></i>更多");
					brand_li.show();
					brand_li_hide.hide();
					letter_box.hide().find("li").removeClass("cur");
					letter_box.find(".all").addClass("cur");
					$this.removeClass("moreStatus");
				}
				$("#facets-category-brand").removeClass("multiSelectStatus").find("#category-brand-hasCheck").empty().html('<li class="hasCheckedTit">已选：</li>').hide();
				$("#facets-category-brand").find(".fc-btn-ok").addClass("fc-disable");
				$(".category-brand").find("li").removeClass("lichk");
			
				multiSelect_btn.show();
				var arr =[];
				$(".c-brand").find("a").each(function(){
					if($(this).hasClass("chk")){				
						arr.push($(this).attr('brandid'));
					}
				});
				var alreayselect = arr.join('');
				pageData.facets_l = pageData.facets_l.replace(alreayselect,"");
				$(".category-brand").find(".c-brand a").removeClass("chk");
			})
			//字母点击筛选品牌
			letter_box.find("li").bind("hover",function(){
				var keyletter = $(this).attr("brand-key");
				$(this).addClass("cur").siblings("li").removeClass("cur");
				if(keyletter=="all"){
					brand_li.show()
				}else{
					brand_li.hide()
					brand_li.each(function(){
						var _thi = $(this);
						if(_thi.attr("brand-value")==keyletter){
							_thi.show()
						}
					})
				}
			})
			//已经多选的品牌，点击取消
			brandChecked_box.delegate("li","click",function(){
				if(!$(this).hasClass("hasCheckedTit")){
					var _val = $(this).attr("valuer");
					$(this).remove();
					$("#x_"+_val).click();
				}
			})
		});
		/*相关分类的高度和更多按钮是否选择*/
		if($("#catFacets").height() >68){//超过两行
			var facetsbtn =$("#facets-category-common .fc-option-more");
			facetsbtn.show();
			if(facetsbtn.hasClass("open")) {
				facetsbtn.removeClass("open");
				facetsbtn.html("<i></i>更多");
			}
		}else{
			$("#facets-category-common .fc-option-more").hide();
		}		
		if ($("#catFacets").height() >= 68){
			$(".category-catBox").css("height","68px");
		}else{
			$(".category-catBox").css("height","34px");
		};		
		$("#facets-category-common .category-normal").removeClass("relevantfaects");
		//相关分类筛选facets
		$("#facets-category-common").each(function() {
			var more_btn = $(this).find(".fc-option-more"),
				facet_box = $(this).find(".category-normal"),
				facet_li = facet_box.find("li");
			facet_box.find("a").bind("click", function(){
				pageData.catId  = $(this).attr("facetsid");
				pageCate= $(this).attr("name");
				pageData.currentPage = 1;
				facetsTpl.getfacetsIndex(); 	 	
			})			
		});		
		//catFacetselected
		$(".catFacetselected").find("a").bind("click", function(){
			pageData.catId  = $(this).attr("facetsid");
			pageData.currentPage = 1;
			facetsTpl.getfacetsIndex(); 	 	
		})	
	},
	eventbind:function(){
		/*综合 销量 新品 评价 价格 排序事件绑定*/
		$("#filter-order-box").undelegate().delegate("li","click",function(event){
			var $this = $(this);
			/* 价格排序*/
			if(pageData.sort == "21" && $this.attr("data-sort")== "21"){
				$this.addClass("price-up").removeClass("price-down").attr("data-sort","20")
			}
			if(pageData.sort == "20" && $this.attr("data-sort")== "20"){
				$this.addClass("price-down").removeClass("price-up").attr("data-sort","21")
			}
			if(pageData.sort != $this.attr("data-sort")){
				pageData.sort = $this.attr("data-sort");
				pageData.currentPage = 1;
				$this.addClass('cur').siblings().removeClass('cur');
				if(pageData.sort == "20"){$this.removeClass("price-up").addClass('price-down')}
				if(pageData.sort == "21"){$this.removeClass("price-down").addClass('price-up')}
				
	
	
				//facetsTpl.getpriceiange();/*价格区间*/
				//facetsTpl.getfacetsIndex(pageData.currentPage,pageData.sort,pageData.facets,pageData.catId,marker,priceRange); 
				facetsTpl.getfacetsIndex(); 
				
			}
		});
		//价格区间确认按钮
		$("#fc-btn-ok").unbind().bind("click", function(event) {
			event.preventDefault();
			facetsTpl.getpriceiange();//
			pageData.currentPage =1;
			//facetsTpl.getfacetsIndex(pageData.currentPage,pageData.sort,pageData.facets,pageData.catId,1,priceRange); 
			facetsTpl.getfacetsIndex(); 
		
		});
		/*在结果中搜索*/
		$(".filter-resultSearch-input").unbind().bind({
			"keyup": function(event) {
				if (event.which == 13) {
					$(".filter-resultSearch-btn").trigger("click");
				} 
				 else {
					 $(this).val($(this).val().replace(/[`~!@#$%^&*_+=¥￥（）()<>?:"{},\/;'[\]！，——‘；—【】|？》《“：\\\-”]/g,' '))
				 }
			},
			"focus": function() {
				$(this).val() == "在结果中搜索" && $(this).val("");
			},
			"blur": function() {
				$(this).val() == "" && $(this).val("在结果中搜索");
			}
		}).trigger("blur");
		$(".filter-resultSearch-btn").unbind().bind("click", function(e) {
			e.preventDefault();
			var searchVal = $(".filter-resultSearch-input").val();
			if (searchVal == "" || searchVal == "在结果中搜索"){
				pageData.questiion = 0;
			}else{
				pageData.questiion = encodeURIComponent(searchVal);
			};
			pageData.currentPage = 1;		
			facetsTpl.getfacetsIndex(); 
		});
		/*国美自营和大促筛选*/
		$(".filter-label-box #deliv").unbind().bind('click',function(e){ 
			e.preventDefault();
			if ($(this).hasClass("checke")) {
				$(this).removeClass("checke");
				pageData.productTag = 0;			
				pageData.currentPage =1;
				facetsTpl.getfacetsIndex(); 
			}else{
				$(this).addClass("checke");
				pageData.productTag = 1; 
				pageData.currentPage =1;
				facetsTpl.getfacetsIndex();
			}
	
		});
		$("#promotion").unbind().bind('click',function(e){
			e.preventDefault();
			$("#flyItem").css({"top":"0"});
			if ($(this).hasClass("checke")) {
				$(this).removeClass("checke");
				pageData.promoFlag = 0;
				pageData.currentPage =1;
				facetsTpl.getfacetsIndex(); 
			}else{
				$(this).addClass("checke");
				pageData.promoFlag = 1;
				pageData.currentPage =1;
				facetsTpl.getfacetsIndex(); 
	
			}
	
		}); 
		/*点击mini分页下一页*/
		$("#mp-next").bind("click", function() {
			if (!$(this).hasClass("mp-disable") && !pageData.state) {
	
				//facetsTpl.getpriceiange();//价格区间
				pageData.currentPage++;
				//facetsTpl.getfacetsIndex();
				facetsTpl.getPrdmesg();
	
				//facetsTpl.getfacetsIndex(++pageData.currentPage,pageData.sort,pageData.facets,pageData.catId);
			}
		});
		/*点击mini分页上一页*/
		$("#mp-prev").bind("click", function() {
			if (!$(this).hasClass("mp-disable") && !pageData.state) {
				//facetsTpl.getpriceiange();//价格区间
				pageData.currentPage--;
				//facetsTpl.getfacetsIndex();
				facetsTpl.getPrdmesg();
			// facetsTpl.getfacetsIndex(--pageData.currentPage,pageData.sort,pageData.facets,pageData.catId);
			}
		});	
	}

}

facetsTpl.init();       