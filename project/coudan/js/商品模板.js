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
var pageCate = "";
var productLeftOffsetTop = $("#product-left").offset().top;

//请求商品数据基本参数
var pageData = {
	"pageSize":48,//每页大小 参数值范围：1-48
	"currentPage":1,//页码pageNumber 参数值范围：1-100
	"sort":0,//排序规则:20：价格降序;21：价格升序;10：销量数;30：上架时间;50：评论数;0：默认值综合排序
	"coudanID":coudanID,// (1)联营夸店铺，传店铺id（aid）  (2)自营或联营不夸店铺，传凑单id （spid）
	"isGome":1,//是否为自营 (1)自营1 (2)联营2
	"crossShop":0,//是否跨店  (1)自营或者联营不跨店铺0 (2)联营跨店铺1
	"catId":0,//筛选分类 ID,
	"facets":0,//筛选的 facets
	"priceTag":0,//自定义价格过滤 0:价格区间不生效 1：生效
	"price":0x0,//例：0x1000 过滤 0-1000 价格的商品例：1000x* 过滤 1000 以上价格的商品该字段是否生效取决于 priceTag
	"instock":0,//库存过滤 0:所有 1：仅展示有货
	//"questiion":0,//搜索关键词
	"questiion":'手机',//搜索关键词
	"productTag":0,//自联营过滤  0：所有 1：只展示自营	
	"promoFlag":0,//大促过滤 0:所有 1：展示大促商品
	"couponType":1,//券类型:0：非全场 1全场
	"scrollHeights":productLeftOffsetTop,
	"muti_op":false,
	"facets_l":""
}
//http://apis.atguat.com.cn/p/cart/16/1/0/s1004d/1/0/0/0/0/0/0/手机/0/1
//相关商品列表模板
var item_tpl= '\
	<% for(var i=0,j=content.prodInfo.products.length;i<j;i++){ %>\
		<% var prd = content.prodInfo.products[i]%>\
		<li class="product-item">\
			<input class="productInfo" type="hidden" gomeert="<%=prd.isGomeart%>" marketTag="<%=prd.marketTag%>" prd-index="<%=i%>" pId="<%=prd.pId%>" sId="<%=prd.skuId%>" skuNo="<%=prd.skuNo%>" pName="<%=prd.name%>" price="<%=prd.price%>"  saleCount="<%=prd.salesVolume%>"/>\
			<ul class="arbitrage clearfix"></ul>\
			<div class="item-tab-warp" sid="<%=prd.skuId%>" pid="<%=prd.pId%>" pidandsid="<%=prd.pId%>-<%=prd.skuId%>">\
				<%if (prd.isGomeart){%>\
					<p class="item-pic"><a class="emcodeItem item-link" rel="nofollow" target="_blank" track="产品列表图片" href="<%= prd.sUrl%>" title="<%= prd.alt%>"><img gome-src="<%= prd.sImg%>" src="//img.gomein.net.cn/images/grey.gif" alt="<%= prd.alt%>"></a></p>\
				<%}else{%>\
					<p class="item-pic"><a class="emcodeItem item-link" rel="nofollow" href="<%= prd.sUrl%>" track="产品列表图片" target="_blank" title="<%= prd.alt%>"><img gome-src="<%= prd.sImg%>_210.jpg" src="//img.gomein.net.cn/images/grey.gif" alt="<%= prd.alt%>"></a></p>\
				<%}%>\
				<%if(content.prodInfo.clothes || content.prodInfo.merchandise){%>\
					<%if(prd.images && prd.images.length>0){%>\
					<div class="item-pic-small-box" index="<%=prd.images.length%>" curIndex="<%=prd.images.length%>">\
						<%if(prd.images.length > 5){%>\
						<a href="javascript:void(0);" class="icon-prev disable" onClick="javascript:smallImgSprev(this)"></a>\
						<a href="javascript:void(0);" class="icon-next" onClick="javascript:smallImgSnext(this)"></a>\
						<%}%>\
						<div class="item-pic-small-wrap">\
							<ul class="imgList">\
							<%for(var m=0,j=prd.images.length;m<j;m++){%>\
								<li class="<%if(prd.images[m].skuId == prd.skuId){%>current<%}%>" sid="<%=prd.images[m].skuId%>">\
									<a track="商品小图:<%=prd.images[m].skuId%>" href="javascript:void(0);" title="<%=prd.images[m].color%>">\
										<img onClick="javascript:smallImgOnClick(this)" gome-src="<%=prd.images[m].sImg%>_30.jpg" sid="<%= prd.images[m].skuId %>" d_src="<%=prd.images[m].sImg%>" alt="<%=prd.images[m].color%>" src="//img.gomein.net.cn/images/grey.gif" />\
									</a>\
								</li>\
							<%}%>\
							</ul>\
						</div>\
					</div>\
					<%}else{%>\
					<%}%>\
				<%}%>\
				<p class="item-price">\
					<span class="price"></span>\
				</p>\
				<p class="item-name"><a rel="nofollow" class="emcodeItem item-link" track="产品列表名称" href="<%= prd.sUrl %>" target="_blank" title="<%= prd.alt %>"><%== prd.name %></a></p>\
				<%if(prd.promoDesc!=""){%>\
				<p class="item-promotional-language"><%= prd.promoDesc %></p>\
				<%}%>\
				<p class="item-comment-dispatching">\
					<a href="<%= prd.sUrl %>#j-comment-section" target="_blank" class="comment emcodeItem" track="产品列表评论数">已有<span><%= prd.evaluateCount %></span>人评价</a>\
				</p>\
				<p class="item-shop">\
					<% if (prd.thirdProduct == true){ %>\
						<a class="nname" target="_blank" href="<%= prd.mUrl %>"><%= prd.sName %></a><%if (prd.shopId =="80009736" || prd.shopId =="80010355" || prd.shopId =="80010423"){ %> <span class="hyg-shopType">国美自营</span><% } %>\
					<% }else{ %>\
						<span class="nname">国美自营</span>\
					<% } %>\
				</p>\
				<p class="item-option clearfix">\
					<% if(content.prodInfo.products[i] == "80007081"){ %>\
						<a href="'+productSite+'/<%= content.prodInfo.products[i].pId %>-<%= content.prodInfo.products[i].skuId %>.html" class="add-cart emcodeItem" target="_blank" track="产品列表立即购买">立即购买</a>\
					<%}else if( content.prodInfo.products[i].stock == 3 ||content.prodInfo.products[i].stock == 4){ %>\
						<a href="'+productSite+'/<%= content.prodInfo.products[i].pId %>-<%= content.prodInfo.products[i].skuId %>.html" target="_blank" class="add-cart prev-buy emcodeItem" track="产品列表预约购买">预约购买</a>\
					<%}else if( content.prodInfo.products[i].stock == 1){ %>\
						<% if(content.prodInfo.products[i].promoStock==3){ %>\
							<a href="//tuan'+cookieDomain+'/deal/<%= prd.promoTags.id %>.html" target="_blank" class="add-cart emcodeItem" track="产品列表立即抢购">立即疯抢</a>\
						<%}else if(content.prodInfo.products[i].promoStock==4){ %>\
							<a href="//q'+cookieDomain+'/item/<%= prd.promoTags.id %>.html" target="_blank" class="add-cart emcodeItem" track="产品列表立即疯抢">立即疯抢</a>\
						<%}else{%>\
							<span track="添加购物车" class="add-cart addTo-cart" >加入购物车</span>\
						<% } %>\
					<%}else if( content.prodInfo.products[i].stock == 0){ %>\
						<span class="add-cart next-buy" track="到货通知">到货通知</span>\
					<% }else{%>\
						<span class="add-cart addTo-cart" track="添加购物车">加入购物车</span>\
					<% } %>\
				</p>\
			</div>\
		</li>\
	<%}%>';
	
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

var errorTemplate=' <div style="text-align:center;padding:40px 0;">相关优惠商品未显示，<a style="color:#006699" href="//www.gome.com.cn/">返回首页 &gt;</a></div>';


var getItemTplsRender=template.compile(item_tpl);
var getBrandTplsRender=template.compile(brandList);
var getFacetsTplsRender=template.compile(catFacets);
var geterrorTplsRender=template.compile(errorTemplate);
var bdarea_2 = $.cookie("atgregion")?$.cookie("atgregion").split("|")[2]:"11010000";




var facetsTpl= {
	init:function(){
		this.showloading();
		//this.getQuanmesg(bdarea_2);
		this.changeCity();
		this.getfacetsIndex();
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
				//_this.getQuanmesg(bdarea_2);
			}
		});
	},
	/*getQuanmesg:function(bdarea_2){//获取优惠券信息
		var _this =this;
		$.ajax({
			type:"GET",
			//url:'//10.144.33.189:8081/gome-www-web/promotion/index/getPromotionRuleInfo.do?promotionId='+pageData.coudanID+'&regionCode='+bdarea_2,
			url:'//hd'+cookieDomain+'/promotion/index/getPromotionRuleInfo.do?promotionId='+pageData.coudanID+'&regionCode='+bdarea_2,
			cache: false,
			dataType:"jsonp",
			jsonpCallback: "quanmesg",
			success:function(data){	
				if(data.data){
					var blueTplsTmpl=getblueTplsRender(data);
					$("#blue_tickets").empty().append(blueTplsTmpl);
					
					if(data.data.limitValue != "null"){
						$("#fbule").text("满"+data.data.limitValue+"元可用");
					}
					if(data.data.gfpType=="3002"){//蓝券
						$(".product-right-box").addClass("lanquan");
					}else if(data.data.gfpType=="3003"){
						$(".product-right-box").addClass("hongquan");
					}
					//无面值券

					if(!data.data.couponValue|| !data.data.limitValue||data.data.couponValue == "null" || data.data.limitValue == "null"){
						$(".price").html('<i class="priceNo">优惠券</i>');
						$("#fbule").hide();
					}
					//是否是全场券
					if(data.data.isAll =='1'){
						pageData.couponType=1;
					}else{
						pageData.couponType=0;
					}
					//区域匹配
					if(data.data.matchWithCurrentRegion){//匹配请求
						
						//区域匹配加上点击排序和筛选					
						eventbind();
						if(data.data.gfpType=="3002" || data.data.isSelf == "1"){//蓝券和自营
							
							pageData.productTag = 1;
							$(".filter-label-box #deliv").addClass("checke");
							$(".filter-label-box #deliv").unbind();//不能再点击国美自营
						};
						facetsTpl.getfacetsIndex();
					}else{//不匹配提示  非常抱歉，这张券不支持该区域使用，您可以进入领券中心领取其它优惠券使用！
						var errorTplsTmpl=  '<div style="text-align:center;padding:40px 0;">非常抱歉，这张券不支持该区域使用，您可以进入<a style="color:#006699" href="//lingquan.gome.com.cn">领券中心 &gt;</a>领取其它优惠券使用！</div>';
						$("#product-box").empty().append(errorTplsTmpl);
						$("#personrecommend").css("max-height","462px");
						$("#product-pager").hide();//隐藏翻页
						_this.hideLoading()
						//区域不匹配不能点击排序和筛选
						$("#fc-btn-ok").unbind();
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
					//显示错误提示			
					var errorTplsTmpl=geterrorTplsRender(data);
					$("#product-box").empty().append(errorTplsTmpl);
					$("#personrecommend").css("max-height","462px");
					return;
				}
	
			}
		});
	},*/
	getfacetsIndex:function(){//请求商品数据
		alert('ss')
		  var _this=this;
		  $.ajax({
				type:"GET",
				url:'//apis'+cookieDomain + '/p/cart/'+pageData.pageSize+'/'+pageData.currentPage+'/'+pageData.sort+'/'+pageData.coudanID+'/'+pageData.isGome+'/'+pageData.crossShop+'/'+pageData.catId+'/'+pageData.facets+'/'+pageData.priceTag+'/'+pageData.price+'/'+pageData.instock+'/'+pageData.questiion+'/'+pageData.promoFlag+'/'+pageData.couponType,
				cache: false,
                data:{
					"from":"coudan"
				},
				dataType:"jsonp",
				beforeSend: function () {
					_this.showloading();
				},
				success:function(data){		
					alert('ssssssssssssssssssssss')
				    _this.hideLoading();
					_this.renderfacetsIndex(data);
					//window.lazyloadfn();//懒加载图片和价格
					eachScreenDom($("#product-box li"));
			  
			 }
		  })
		  
	},
	renderfacetsIndex:function(data){
		var _this=this;
		pageData.muti_op = false;
		/*商品详情*/
     	

	    if(data.content.prodInfo && data.content.prodInfo.products && data.content.prodInfo.products.length>0){
		  var listTpl=getItemTplsRender(data);
		 $("#product-box").empty().append(listTpl);
		 $("#nSearch-facets-search").show();
	    }else{
			var errorTplsTmpl=geterrorTplsRender(data);
			$("#product-box").empty().append(errorTplsTmpl);
			$("#personrecommend").css("max-height","462px");
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

			if(pageData.catId != "" ){
				$("#facets-category-common").hide()
			}else{
				$("#facets-category-common").show()
			}
			}else{
			$("#facets-category-common").hide()
		}
		//}
		
		facetsOperation.showMore();

		/*分页*/
		 _this.setPageInfo(data.content.pageBar);	


		var hasCheckedBrand = ''
		for(var o in pageBrand){
			if(pageBrand[o]!=""){
				hasCheckedBrand= hasCheckedBrand +pageBrand[o] +"、";
			}	
		}
		
		$(".nSearch-crumb-facetsCurrent").empty()
		if(hasCheckedBrand != ""){
			$(".nSearch-crumb-facetsCurrent").append('<li class="topCheckedBrand"><a href="javascript:void(0)"><i>×</i><em>品牌：</em>'+hasCheckedBrand.slice(0,hasCheckedBrand.length -1)+"</a></li>")
		}
		
		if(pageCate != ""){
			$(".nSearch-crumb-facetsCurrent").append('<li class="topCheckedCate"><a href="javascript:void(0)"><i>×</i><em>分类：</em>'+pageCate+"</a></li>");
		}	
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
		}
		
	},
	/*翻页商品处理*/
	getPrdmesg:function(){
		var _this=this;
		$.ajax({
			  type:"GET",
			  url:'//apis'+cookieDomain + '/p/blue/'+pageData.pageSize+'/'+pageData.currentPage+'/'+pageData.sort+'/'+pageData.coudanID+'/'+pageData.catId+'/'+pageData.facets+'/'+pageData.priceTag+'/'+pageData.price+'/'+pageData.questiion+'/'+pageData.productTag+'/'+pageData.instock+'/'+pageData.promoFlag+'/'+pageData.couponType,
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
					var listTpl=getItemTplsRender(data);
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
            pageSize: 48,
            clickCallback: function(curPage) {
				pageData.currentPage = curPage;
				facetsTpl.getpriceiange();/*价格区间*/
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
	}
}

facetsTpl.init();       


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
			pageBrand_l[_facets] = "";
		} else {
			if(brandChecked_box.find('li').length < 16){
				console.log(brandChecked_box.find('li').length)
				$(this).addClass("chk");
				$(this).parents(".c-brand").addClass("lichk");
				brandChecked_box.append('<li class="ckes" id="ck_'+_facets+'" valuer="'+_facets+'"><i></i>'+$(this).attr("name")+'</li>')
				pageData.facets_l += $(this).attr("brandid");
				pageBrand_l[_facets] = $(this).attr("name");
			}else{
				$("#brand-hasChecktip").show();
			}			
		}
		(pageData.facets_l != "") ? multiSelect_confirm_ok.removeClass("fc-disable") : multiSelect_confirm_ok.addClass("fc-disable");
		(brandChecked_box.find(".ckes").length>0)?brandChecked_box.show():brandChecked_box.hide();
	}else{
		/*品牌单选*/
		pageData.facets  = $(this).attr("brandid");
		pageBrand[pageData.facets]=$(this).attr("name")
		pageData.currentPage = 1;
		$("#fc-lowPrice").val("¥");
		$("#fc-highPrice").val("¥");
		pageData.price = 0;
		pageData.priceTag = 0;
		//console.log(pageData.price+":sssss:"+pageData.priceTag)
		facetsTpl.getfacetsIndex(); 
	}

})


/*分类点击更多事件*/
$("#facets-category-common .fc-option-more").unbind().bind("click", function() {
    if ($(this).hasClass("open")) {
        $(this).removeClass("open");
        $(this).html("<i></i>更多");
       $("#facets-category-common .category-normal").height("30px");
        pageData.scrollHeights=$("#product-left").offset().top;
    } else {
        $(this).addClass("open");
        $(this).html("<i></i>收起");
        $("#facets-category-common .category-normal").height("auto");
        pageData.scrollHeights=$("#product-left").offset().top;
	}
})
/*分类多选事件*/
$('.facets-category-common .fc-option-multiple').bind('click',function(){
	clearMultiSelectStatus();
	$(this).parents('.facets-category').data('isMultiSelect',true).addClass('multiSelectStatus');
	$(this).parents('.facets-category').find('.fc-option-more').data('isOpen',false).trigger('click');
});
$('.facets-category-common .fc-btn-cancel').bind('click',function(){
	var _parent = $(this).parents('.facets-category');
	_parent.find('.facet').filter(function(){return $(this).data('isSelect')}).trigger('click');
	_parent.find('.fc-option-more').data("isOpen",true).trigger('click');
	_parent.data('isMultiSelect',false).removeClass('multiSelectStatus');
});
$('.facets-category-common .fc-btn-ok').bind('click',function(){
	var valueString = $(this).parents('.facets-category').data('selectFacet')
	if(valueString){
		require('../function/makeHelf').dofacet('facets',valueString);
	}
});

function clearMultiSelectStatus(){
	$('.multiSelectStatus').find('.fc-btn-cancel').trigger('click');
};

var facetsOperation = {
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
			  pageData.facets = 0;
			})
		  
		  multiSelect_confirm_ok.unbind().bind("click", function(e) {
			  if (!$(this).hasClass("fc-disable")) {
				   e.preventDefault();
				   pageBrand = pageBrand_l,
				   pageData.facets = pageData.facets_l;
				   pageData.currentPage = 1;
				   $("#fc-lowPrice").val("¥");
				   $("#fc-highPrice").val("¥");
				   pageData.price = 0;
				   pageData.priceTag = 0;
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
			  pageData.facets = 0;
			  pageData.facets_l = ""
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
	  })
	
	//分类facets
	  $("#facets-category-common").each(function() {
			  var more_btn = $(this).find(".fc-option-more"),
				  facet_box = $(this).find(".category-normal"),
				  facet_li = facet_box.find("li");
	  
		  if (facet_li.length > 8) {
			  more_btn.show();
		  }else{
		  	 more_btn.hide();
		  }
			
		  facet_box.find("a").bind("click", function(){
			   pageData.catId  = $(this).attr("facetsid");
			   pageCate= $(this).attr("name");
			   pageData.currentPage = 1;
			   $("#fc-lowPrice").val("¥");
			   $("#fc-highPrice").val("¥");
			   pageData.price = 0;
			   pageData.priceTag = 0;
			   facetsTpl.getfacetsIndex(); 	 	
		  })
		  
	  })
	}

}

/*解除品牌绑定事件*/
$(".topCheckedBrand").live("click",function(){
	pageData.facets = 0;
	pageData.currentPage = 1;
	$(".fc-btn-cancel").click();
	$("#fc-lowPrice").val("¥");
	$("#fc-highPrice").val("¥");
	pageData.price = 0;
	pageData.priceTag = 0;
	facetsTpl.getfacetsIndex(); 
})

/*解除分类绑定事件*/
$(".topCheckedCate").live("click",function(){
	pageData.catId = 0;
	pageData.currentPage = 1;
	pageCate = "";
	$("#facets-category-common").find(".category-normal").height("30px");
	$("#facets-category-common").find(".fc-option-more").removeClass("open").html("<i></i>更多");
	$("#fc-lowPrice").val("¥");
	$("#fc-highPrice").val("¥");
	pageData.price = 0;
	pageData.priceTag = 0;
	facetsTpl.getfacetsIndex(); 
})

	
function eventbind(){
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
			


			facetsTpl.getpriceiange();/*价格区间*/
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
		$("#fc-lowPrice").val("¥");
		$("#fc-highPrice").val("¥");
		pageData.price = 0;
		pageData.priceTag = 0;		
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

			facetsTpl.getpriceiange();//价格区间
			pageData.currentPage++;
			//facetsTpl.getfacetsIndex();
			facetsTpl.getPrdmesg();

			//facetsTpl.getfacetsIndex(++pageData.currentPage,pageData.sort,pageData.facets,pageData.catId);
		}
	});

	/*点击mini分页上一页*/
	$("#mp-prev").bind("click", function() {
		if (!$(this).hasClass("mp-disable") && !pageData.state) {
			facetsTpl.getpriceiange();//价格区间
			pageData.currentPage--;
			//facetsTpl.getfacetsIndex();
			facetsTpl.getPrdmesg();
		// facetsTpl.getfacetsIndex(--pageData.currentPage,pageData.sort,pageData.facets,pageData.catId);
		}
	});

}