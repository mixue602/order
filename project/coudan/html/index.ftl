<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8;" />
    <title>title</title>
    <meta content="" name="description">
    <link rel="shortcut icon" href="//app.gomein.net.cn/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="<!--#include virtual='/n/common/default/style.html'-->,/gmlib/unit/gcity/1.0.0/gcity.min.css,/gmpro/1.0.0/coudan/1.0.0/css/togeterOrder.min.css">

    <!--# include virtual="/n/common/global/global.html"-->
</head>
<body>    
   <!--# include virtual="/n/common/default/head.html"-->


    <!--category-->
    <div class="nSearchWarp">
        <div class="nSearch-crumb nSearch-crumb-search clearfix">
            <a href="javascript:;" class="nSearch-crumb-clearFacets" id="clearallfacts">全部清空</a>
            <span id="nSearch-crumb-keyWord" class="nSearch-crumb-keyWord"><b>全部结果</b></span><i class="crumbArrow">&nbsp;&gt;&nbsp;</i>
            <span id="nSearch-crumb-searchNum" class="nSearch-crumb-searchNum">活动凑单</span><i class="crumbArrow catfaceticon">&nbsp;&gt;&nbsp;</i>
            <div class="nSearch-crumb-catFacet">
                <div class="name topCheckedCate"><span class="word fl"></span><i class="btnclose">x</i><span class="btnshow"></span></div>
                <div class="catFacetselected clearfix">
                    <ul></ul>
                </div>
            </div>
            <div id="nSearch-crumb-facetsCurrent-warp" class="nSearch-crumb-facetsCurrent-warp">
                <ul class="nSearch-crumb-facetsCurrent">
                </ul>
                <a class="facetsCurrent-prev fc-btn" href="javascript:void(0)"></a>
                <a class="facetsCurrent-next fc-btn" href="javascript:void(0)"></a>
            </div>
        </div>
    </div>
    <!--品牌-->
    <div class="nSearchWarp nSearch-facets" id="nSearch-facets-search">
        <div id="facets-category-brand" class="facets-category clearfix">
            <div class="fc-option">
                <span class="fc-option-multiple">多选</span>
                <span class="fc-option-more"><i></i>更多</span>
            </div>
            <span class="fc-key">品牌：</span>
            <div class="fc-content">
                <ul class="category-brand-f-letter clearfix" style>
                    <li class="all cur" brand-key="all">所有品牌</li>
                    <li brand-key="A">A</li>
                    <li brand-key="B">B</li>
                    <li brand-key="C">C</li>
                    <li brand-key="D">D</li>
                    <li brand-key="E">E</li>
                    <li brand-key="F">F</li>
                    <li brand-key="G">G</li>
                    <li brand-key="H">H</li>
                    <li brand-key="I">I</li>
                    <li brand-key="J">J</li>
                    <li brand-key="K">K</li>
                    <li brand-key="L">L</li>
                    <li brand-key="M">M</li>
                    <li brand-key="N">N</li>
                    <li brand-key="O">O</li>
                    <li brand-key="P">P</li>
                    <li brand-key="Q">Q</li>
                    <li brand-key="R">R</li>
                    <li brand-key="S">S</li>
                    <li brand-key="T">T</li>
                    <li brand-key="U">U</li>
                    <li brand-key="V">V</li>
                    <li brand-key="W">W</li>
                    <li brand-key="X">X</li>
                    <li brand-key="Y">Y</li>
                    <li brand-key="Z">Z</li>
                </ul>
                <ul class="category-brand clearfix" style="position: relative;" id="facetsbrandUl">
                </ul>
                <ul class="category-brand-hasCheck clearfix" id="category-brand-hasCheck">
                    <li class="hasCheckedTit">已选：</li>
                </ul>
                <div class="brand-hasChecktip" id="brand-hasChecktip">最多选择15个品牌！</div>
                <div class="fc-btn-box">
                    <a class="fc-btn-ok  fc-disable" href="javascript:void(0)">确定</a>
                    <a class="fc-btn-cancel" href="javascript:void(0)">取消</a>
                </div>
            </div>
        </div>
        <div class="facets-category clearfix" id="facets-category-common">
            <div class="fc-option">
                <span class="fc-option-more"><i></i>更多</span>
            </div>
            <span class="fc-key ftweight">相关分类：</span>
            <div class="fc-content">
                <div class="category-normal category-catBox">
                    <ul class="clearfix" id="catFacets">
                    </ul>
                </div>
            </div>
        </div>
        <div class="facets_commom_box" id="facets_commom_box">
        </div>
    </div>
    
    <#--  <div class="cOrder clearfix">
        <div class="cOrder-r">
            
            <div class="filter clearfix" id="filter">
                <div class="line1 clearfix">
                    <div class="filter-order ">
                        <span class="filter-order-title">排序：</span>
                        <ul class="filter-order-content clearfix">
                            <li class="cur" data-type="00"><a href="javascript:void(0)" class="">综合</a></li>
                            <li class=" " data-type="10"><a href="javascript:void(0)" class="">销量</a></li>
                            <li class="" data-type="21"><a href="javascript:void(0)">价格</a><i class="icon-up-down"></i> </li>
                        </ul>
                    </div>
                    <div class="min-pager-box">
                        <a id="mp-next" class="emcodeProp17 min-pager-next mp-disable" track="小分页:下一页" href="javascript:void(0)">&gt;</a>
                        <a id="mp-prev" class="emcodeProp17 min-pager-prev mp-disable" track="小分页:上一页" href="javascript:void(0)">&lt;</a>
                    </div>
                    <div class="all-product-num" id="product_number">
                        <span>共<em>0</em>个商品</span><span>0/0</span>
                    </div>
                </div>
                <div class="line2 clearfix">
                    <div class="select-price clearfix">
                        <span class="select-price-c">价格区间：</span>
                        <ul class="price-item clearfix">
                            <li class="cur">
                                <a href="javascript:void(0)" data-range="0">
                                    <i></i> 全部
                                </a>
                            </li>
                        </ul>
                        <ul class="price-input clearfix">
                            <li class="priceRange-input"><input type="text" value="¥" id="fc-lowPrice"></li>
                            <li class="priceRange-link">-</li>
                            <li class="priceRange-input"><input type="text" value="¥" id="fc-highPrice"></li>
                            <li class="priceRange-btn"><a track="筛选条件:自定义价格清理" href="javascript:void(0)" class="fc-btn-cancel emcodeProp17" id="fc-btn-cancel">清除</a></li>
                            <li class="priceRange-btn"><a track="筛选条件:自定义价格确定" href="javascript:void(0)" class="fc-btn-ok emcodeProp17" id="fc-btn-ok">确定</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="product-list">
                <div class="product-waiting" id="product-waiting"></div>
                <ul class="clearfix" id="pList"></ul>
                <div id="product-no"></div>
            </div>
            <div id="product-pager" class="clearfix">
                <div id="j-page" class="pager">
                </div>
            </div>
        </div>
    </div>  -->
    <div class="nSearchWarp">
        <div class="product-left-list" id="product-left">
            <!--筛选-->
            <div id="filter-box">
                <div id="filter-top" class="filter-top clearfix">
                    <ul class="filter-order-box" id="filter-order-box">
                        <li class="cur emcodeProp17" data-sort="0" track="筛选条件:综合"><a href="javascript:void(0)">综合</a></li>
                        <li class=" emcodeProp17" data-sort="10" track="筛选条件:销量"><a href="javascript:void(0)">销量</a></li>
                        <li class=" emcodeProp17" data-sort="50" track="筛选条件:评价"><a href="javascript:void(0)">评价</a>
                            <li class=" emcodeProp17" data-sort="21" track="筛选条件:价格"><a href="javascript:void(0)">价格</a><i class="icon-up-down"></i></li>
                    </ul>
                    <#--  价格筛选  -->
                    <ul class="filter-priceRange-box clearfix">
                        <li class="priceRange-input"><input id="fc-lowPrice" maxlength="6" type="text" value="¥"></li>
                        <li class="priceRange-link">-</li>
                        <li class="priceRange-input"><input id="fc-highPrice" type="text" maxlength="6" value="¥"></li>
                        <li class="priceRange-btn"><a id="fc-btn-cancel" class="fc-btn-cancel" href="javascript:void(0)">清除</a></li>
                        <li class="priceRange-btn"><a id="fc-btn-ok" class="fc-btn-ok" href="javascript:void(0)">确定</a></li>
                    </ul>
                    <#--  小翻页  -->
                    <div class="min-pager-box">                       
                        <span class="prdtotalnum">商品共 <em id="searchTotalNumber">0</em> 个</span>
                        <a href="javascript:void(0)" class="min-pager-next " id="mp-next">&gt;</a>
                        <a href="javascript:void(0)" class="min-pager-prev mp-disable" id="mp-prev">&lt;</a>
                        <span class="min-pager-number" id="min-pager-number"></span>
                    </div>
                </div>
                <div id="filter-bottom" class="filter-bottom">
                    <div class="filter-adress-box">
                        <span class="filter-adress-tit">送至：</span>
                        <span id="address" class="filter-adress-stock">
                            <a id="stockaddress" href="javascript:void(0);">请选择</a>
                            <i class="filter-adress-icon"></i>
                            <em class="space"></em>
                        </span>
                        <div class="gCity clearfix"></div>
                    </div>
                    <div class="filter-label-box">
                        <#--  <a class="gmform-label" id="deliv"><i class="iic"></i>国美自营</a>  -->
                        <a class="gmform-label" id="promotion"><i class="iic"></i><span class="promotionmesg"></span></a>
                    </div>
                    <#--  在结果中搜索  -->
                    <div class="filter-resultSearch-box" style="display: block;">
                        <input type="text" value="" class="filter-resultSearch-input">
                        <a href="javascript:void(0)" class="filter-resultSearch-btn">确定</a>
                    </div>
                </div>
            </div>              
            <!--商品列表-->
            <div class="product-box">
                <div class="product-waiting" id="product-waiting"></div>
                <ul class="product-lists clearfix" id="product-box"></ul>
                <div class="clearfix" id="product-pager">
                    <div class="pager" id="j-page"></div>
                </div>
            </div>
            <#--  没有商品  -->
            <div class="noProductBox-content error-content">
                <div class="title"><span class="icon"></span>抱歉，没有找到与<span class="orange">“活动凑单”</span>相关的商品</div>
                <p>建议您：</p>
                <p>1、适当减少筛选条件</p>
                <p>2、调整价格区间</p>
                <p>3、使用其他关键字</p>
                <a href="javascript:void(0)" id="noResultReturnBack" class="clearall_btn">全部清空</a>
            </div>
            <#--  区域不匹配-->
            <div class="error-content areamatchbox">
                <div class="title"><span class="icon"></span>抱歉，该区域下不支持此活动！</div>
                <p>你可以<a href="http://cart.atguat.com.cn/home/cart" class="nBlue">返回购物车</a>查看其它活动</p>
            </div>
            <#--  活动已结束-->
            <div class="error-content activityend">
                <div class="title"><span class="icon"></span>抱歉，优惠活动已结束或不存在！</div>
                <p>你可以<a href="http://cart.atguat.com.cn/home/cart" class="nBlue">返回购物车</a>查看其它活动</p>
            </div>
        </div>
    </div>
    <div id="canzhaowu" style="posiiton:relative;"></div>
    <div class="addcartbox clearfix onfixed" id="cart-product">
        <#--  <div id="cart-product">  -->
        <div class="product-detail">
            <div class="product-detail-content-box clearfix">
                <div class="product_selected fl">已选<span class="nRed totalpiece">0</span>件</div>
                <div class="product-detail-content fl">
                    <a href="javascript:void(0);" class="btn-pre btn fl" id="cartPrev">&lt;</a>
                    <a href="javascript:void(0);" class="btn-next btn fr" id="cartNext">&gt;</a>
                    <div class="product-detail-content-warp" id="cartListWarp">
                        <ul id="cartList"></ul>
                    </div>
                </div>
            </div>
            <div class="product-detail-title clearfix" id="cartInfo">
                
                <div class="go-cart"><a href="//cart.gome.com.cn/home/cart" target="_blank">去购物车结算</a><i></i></div>
                <div class="activity-mesg">
                    <p class="activity-allprice">总价：<b class="nRed num totalprice">¥0.00</b></p>
                    <P class="activity-desc">元，满足条件后即可享受优惠</p>
                </div>
            </div>
        </div>
        <#--  </div>  -->
    </div>
    <!--购物车飞的元素-->
    <div id="flyItem" class="fly_item"><img src="http://img.gomein.net.cn/images/grey.gif" width="50" height="50"></div>
    <!--# include virtual="/n/common/default/aside.html"-->
    <!--# include virtual="/n/common/default/foot.html"-->
    <#--  商品模板  -->
    <script id="item_tpl" type="text/html">
        {{if data.content.prodInfo && data.content.prodInfo.products}}
            {{each data.content.prodInfo.products}}
                <li class="product-item">
                    <input class="productInfo" type="hidden" gomeert="{{$value.isGomeart}}" markettag="{{$value.marketTag}}" prd-index="{{$index}}" pid="{{$value.pId}}" sid="{{$value.skuId}}" skuno="{{$value.skuNo}}" pname="{{$value.name}}" price="{{$value.price}}" salecount="{{$value.salesVolume}}">
                    <div class="item-tab-warp" sid="{{$value.skuId}}" pid="{{$value.pId}}" pidandsid="{{$value.pId}}-{{$value.skuId}}">
                        <p class="item-pic"><a class="emcodeItem item-link" rel="nofollow" href="{{$value.sUrl}}" data-code="coudanprd{{data.content.pageBar.pageNumber}}{{$index}}" track="产品列表图片" target="_blank" title="{{$value.alt}}"><img gome-src="{{$value.sImg}}_210.jpg" src="//img.gomein.net.cn/images/grey.gif" alt="{{$value.alt}}"></a></p>
                        <p class="item-price"><span class="price"></span></p>
                        <p class="item-name">
                            <a rel="nofollow" data-code="coudanprd{{data.content.pageBar.pageNumber}}{{$index}}" class="emcodeItem item-link" track="产品列表名称" href="{{$value.sUrl}}" target="_blank" title="{{$value.alt}}">{{#$value .name}}</a>
                        </p>
                        {{if ($value.promoDesc!="")}}
				        <p class="item-promotional-language">{{#$value.promoDesc}}</p>
                        {{/if}}
                        <p class="item-comment-dispatching">
                            <span class="dispatching"></span>
                            <a href="{{$value.sUrl}}#gm-other-info" target="_blank" class="comment emcodeItem" track="产品列表评论数">已有<span>{{$value.evaluateCount}}</span>人评价</a>
                        </p>                        
                        <p class="item-shop">
                            {{if $value.thirdProduct}}
                                {{if $value.shopId =="80009736" || $value.shopId =="80010355" || $value.shopId =="80010423"}}<span class="hyg-shopType">自营</span>{{/if}}
                            {{else}}
                                <span class="nnamezy">自营</span>
                            {{/if}}
                        </p>
                        <p class="item-option clearfix">
                            <a class="addCart" data-sid="{{$value.skuId}}" data-pid="{{$value.pId}}" href="javascript:void(0);"><span class="carticon"></span><span>加入购物车</span></a>
                        </p>
                    </div>
                </li>
            {{/each}}
        {{/if}}
    </script>
    <#--  公共分类模板  -->
    <script id="commomfaect_tpl" type="text/html">
        {{if data.content.facets.commonfacets && data.content.facets.commonfacets.length >0}}            
            {{each data.content.facets.commonfacets}}
            {{if $index <2}}
            <div class="facets-category facets-category-common clearfix">
                <div class="fc-option">
                    <span class="fc-option-multiple">多选</span>
                </div>
                <span class="fc-key">{{$value.label }}：</span>
                <div class="fc-content">
                    <div class="category-normal">
                        <ul class="clearfix" id="catFacets">
                            {{each $value.items}}
                            <li><a class="facet" href="javascript:;" facetsid="{{$value.id}}"><i></i>{{$value.value}}</a></li>
                            {{/each}}
                        </ul>
                    </div>
                    <div class="fc-btn-box">
                        <a class="fc-btn-ok fc-disable" href="javascript:void(0)">确定</a>
                        <a class="fc-btn-cancel" href="javascript:void(0)">取消</a>
                    </div>
                </div>
            </div>
            {{/if}}       
            {{/each}}    
        {{/if}}
        {{if data.content.facets.commonfacets && data.content.facets.commonfacets.length >=3}}
        <div class="facets-category facets-category-syn clearfix facets-merge">
            <span class="fc-key">高级筛选：</span>
            <div class="fc-content">
                {{each data.content.facets.commonfacets}}
                    {{if $index >=2}}
                    <dl class="category-syn">
                        <dt class="category-syn-tit">{{$value.label }}<i></i></dt>
                        <dd class="category-syn-con">
                            <ul class="category-syn-list clearfix">
                                {{each $value.items}}
                                <li><a class="facet" href="javascript:;" facetsId="{{$value.id}}"><i></i>{{$value.value}}</a></li>
                                {{/each}}
                            </ul>
                            <p class="category-syn-btn">
                                <a href="javascript:void(0)" class="fc-btn-ok fc-disable">确定</a>
                                <a href="javascript:void(0)" class="fc-btn-cancel">取消</a>
                            </p>
                        </dd>
                    </dl>
                    {{/if}}
                {{/each}}
            </div>
        </div>
        {{/if}}
    </script>
    <#--  已选分类模板  -->
    <script id="selectedfacets_tpl" type="text/html">
        {{if data.content.selectData.facets.brand && data.content.selectData.facets.brand.items.length >0}}            
                <li class="topCheckedfeact" filterid="{{each data.content.selectData.facets.brand.items}}{{$value.id}}{{/each}}"><a href="javascript:void(0)"><i>×</i><em>品牌：</em>
                    {{each data.content.selectData.facets.brand.items}}
                        {{$value.value}}、
                    {{/each}}
                </a></li>            
        {{/if}}
        {{if data.content.selectData.facets.commonfacets}}
            {{each data.content.selectData.facets.commonfacets}}
                <li class="topCheckedfeact" filterid="{{each $value.items}}{{$value.id}}{{/each}}"><a href="javascript:void(0)"><i>×</i><em>{{$value.label}}：</em>
                    {{each $value.items}}
                        {{$value.value}}、
                    {{/each}}
                </a></li>
            {{/each}}
        {{/if}}
    </script>
    <#--  加入购物车的商品列表模板 -->
    <script id="addcartlist_tpl" type="text/html">
        {{each data.commerceItemVOs}}
            <li class="cartItem">                                        
                <div class="c-img">
                    <img src="{{$value.itemImageURL}}">
                </div>  
                <div class="c-mesg">
                    <div class="c-price"><em class="num">¥{{$value.salePrice.toFixed(2)}}</em></div>
                    <div class="mt3"><span class="fl">x<em>{{$value.quantity}}</em></span><span class="c-remove fl" data-cid="{{$value.itemId}}">删除</span></div>
                </div>                                   
            </li>
        {{/each}}
        
    </script>
    <script src="<!--#include virtual='/n/common/default/script.html'-->,gmlib/ui/gload/1.0.0/gload.min.js,gmlib/unit/scode/1.0.0/scode.min.js,gmlib/unit/bigdata/1.0.0/bigdata.min.js,gmpro/1.0.0/coudan/1.0.0/js/pager.min.js,/gmlib/unit/gcity/1.0.0/gcity.min.js"></script>
    <script src="/js/parabola.js"></script>
    <script src="/js/coudancommon.js"></script>
    <script src="/js/coudanLazyLoad.js"></script>
</body>

</html>