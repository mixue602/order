<!--焦点图-->
<#if children.head?? && children.head.children?? && children.head.children.focus?? && children.head.children.focus.imgList?? && children.head.children.focus.imgList?size &gt; 0>
    <div class="firstseecn clearfix edit-mode" modelType="${(children.head.children.focus.modelType)!}" modelId="${(children.head.children.focus.modelId)!}">
        <div id="J_slideBox" class="slideBox">
            <div class="hd">
                <ul>
                    <#if children.head.children.focus.imgList?size &gt;1>
                        <#list children.head.children.focus.imgList as item>
                            <li <#if item_index == 0>class="on"</#if>></li>
                        </#list>
                    </#if>
                </ul>
            </div>
            <div class="bd">
                <ul>
                    <#list children.head.children.focus.imgList as item>
                        <li style="background:${(item.imgOtherAttr.extend)!};<#if item_index == 0>display:list-item;</#if>">
                            <a <#if item.href??>href="${(item.href)!}"  target="_blank"</#if> data-code="${(children.head.children.focus.modelId)!}-${(item_index+1)!}">
                            <img class="gload-bgimg" src="${(item.src)!}" alt="${(item.alt)!}" width="1200" height="400" />
                            </a>
                        </li>
                    </#list>
                </ul>
            </div>
            <#if children.head.children.focus.imgList?size &gt;1>
                <!-- 下面是前/后按钮代码，如果不需要删除即可 -->
                <a class="prev" onselectstart="return false"><span class="btn-bg"></span><span class="arrow"></span></a>
                <a class="next" onselectstart="return false"><span class="btn-bg"></span><span class="arrow"></span></a>
            </#if>
        </div>
    </div>
</#if>

<!--焦点图 end-->
<#if children.Dailynecessityproduct ?? && children.Dailynecessityproduct.prdList?? && children.Dailynecessityproduct.prdList?size &gt; 0>
    <div class="rebate_floor edit-mode" modelType="${(children.Dailynecessityproduct.modelType)!}" modelId="${(children.Dailynecessityproduct.modelId)!}"  data-rebate="<#list (children.Dailynecessityproduct.prdList) as item>${item.productId!}_${item.skuId!}<#if item_has_next>,</#if></#list>" data-flag="zg">
        <div class="wbox">
            <h2  class="floor" data-title="${(children.Dailynecessityproduct.modelName)!}">${(children.Dailynecessityproduct.modelName)!}</h2>
            <div class="floor_warp clearfix">
                <ul>
                    <#list children.Dailynecessityproduct.prdList as item>
                        <li>
                            <a href="${(item.detailHref)!}" target="_blank" title="${(item.name)!}" class="goods_img" data-code="${(children.Dailynecessityproduct.modelId)!}-${(item_index+1)!}">
                                <#if item.manualImg ?? >
                                    <img src="${(gomeImgLoad)!}" data-lazy-img="0" data-lazy-init="${(item.manualImg)!}" alt="${(item.name)!}" width="160" height="160"/>
                                <#else>
                                    <img src="${(gomeImgLoad)!}" data-lazy-img="0" data-lazy-init="${(item.goodsImgs[0].src)!}_160.jpg" alt="${(item.name)!}" width="160" height="160"/>
                                </#if>
                            </a>
                            <a href="${(item.detailHref)!}" target="_blank" title="${(item.name)!}" class="goods_name" data-code="${(children.Dailynecessityproduct.modelId)!}-${(item_index+1)!}">${(item.name)!}</a>
                            <span data-target="p-price" data-skuId="${(item.skuId)!}" class="price">¥<i class="minPrice">${(item.price)!}</i></span>
                            <div><span class="rebate_fl">返利</span><span class="rebate_txt">最高返 <i class="rebate_money"></i> 国美币</span></div>
                        </li>
                    </#list>
                </ul>
            </div>
        </div>
    </div>
</#if>
<#if children.jufanproduct ?? && children.jufanproduct.prdList?? && children.jufanproduct.prdList?size &gt; 0>
    <div class="rebate_floor edit-mode" modelType="${(children.jufanproduct.modelType)!}" modelId="${(children.jufanproduct.modelId)!}"  data-rebate="<#list (children.jufanproduct.prdList) as item>${item.productId!}_${item.skuId!}<#if item_has_next>,</#if></#list>" data-flag="gm">
        <div class="wbox">
            <h2 class="floor" data-title="${(children.jufanproduct.modelName)!}">${(children.jufanproduct.modelName)!}</h2>
            <div class="floor_warp floor_warp2 clearfix">
                <ul>
                    <#list children.jufanproduct.prdList as item>
                        <li>
                            <a href="${(item.detailHref)!}" target="_blank" title="${(item.name)!}" class="goods_img" data-code="${(children.jufanproduct.modelId)!}-${(item_index+1)!}">
                                <#if item.manualImg ?? >
                                    <img src="${(gomeImgLoad)!}" data-lazy-img="0" data-lazy-init="${(item.manualImg)!}" alt="${(item.name)!}" width="160" height="160"/>
                                    <#else>
                                        <img src="${(gomeImgLoad)!}" data-lazy-img="0" data-lazy-init="${(item.goodsImgs[0].src)!}_160.jpg" alt="${(item.name)!}" width="160" height="160"/>
                                </#if>
                            </a>
                            <a href="${(item.detailHref)!}" target="_blank" title="${(item.name)!}" class="goods_name" data-code="${(children.jufanproduct.modelId)!}-${(item_index+1)!}">${(item.name)!}</a>
                            <span data-target="p-price" data-skuId="${(item.skuId)!}" class="price">¥<i class="minPrice">${(item.price)!}</i></span>
                            <div><span class="rebate_fl">返利</span><span class="rebate_txt">购买返 <i class="rebate_money"></i> 国美币</span></div>
                        </li>
                    </#list>
                </ul>
            </div>
        </div>
    </div>
</#if>
<#if children.meidianproduct ?? && children.meidianproduct.prdList?? && children.meidianproduct.prdList?size &gt; 0>
    <div class="rebate_floor edit-mode" modelType="${(children.meidianproduct.modelType)!}" modelId="${(children.meidianproduct.modelId)!}" data-rebate="<#list (children.meidianproduct.prdList) as item>${item.productId!}_${item.skuId!}<#if item_has_next>,</#if></#list>" data-flag="fx">
        <div class="wbox">
            <h2 class="floor" data-title="${(children.meidianproduct.modelName)!}">${(children.meidianproduct.modelName)!}</h2>
            <div class="floor_warp floor_warp2 clearfix">
                <ul>
                    <#list children.meidianproduct.prdList as item>
                        <li>
                            <a href="${(item.detailHref)!}" target="_blank" title="${(item.name)!}" class="goods_img" data-code="${(children.meidianproduct.modelId)!}-${(item_index+1)!}">
                                <#if item.manualImg ?? >
                                    <img src="${(gomeImgLoad)!}" data-lazy-img="0" data-lazy-init="${(item.manualImg)!}" alt="${(item.name)!}" width="160" height="160"/>
                                    <#else>
                                        <img src="${(gomeImgLoad)!}" data-lazy-img="0" data-lazy-init="${(item.goodsImgs[0].src)!}_160.jpg" alt="${(item.name)!}" width="160" height="160"/>
                                </#if>
                            </a>
                            <a href="${(item.detailHref)!}" target="_blank" title="${(item.name)!}" class="goods_name" data-code="${(children.meidianproduct.modelId)!}-${(item_index+1)!}">${(item.name)!}</a>
                            <span data-target="p-price" data-skuId="${(item.skuId)!}" class="price">¥<i class="minPrice">${(item.price)!}</i></span>
                            <div><span class="rebate_fl">返利</span><span class="rebate_txt">分享返 <i class="rebate_money"></i> 国美币</span></div>
                            <#if item.affixAttr.longDesc?? && item.affixAttr.longDesc !=''>
                                <a href="${(item.affixAttr.longDesc)!}" target="_blank" class="joinMd" data-code="${(children.meidianproduct.modelId)!}-${(item_index+1)!}">加入美店</a>
                            </#if>

                        </li>
                    </#list>
                </ul>
            </div>
        </div>
    </div>
</#if>

<!--综合搜索-->
<div class="wbox rebate_goods">
    <div class="title_wrap">
        <div class="rebate_title">
            <ul>
                <li class="cur" data="0">综合</li>
                <li data="10">销量</li>
                <li data="1"  class="rebateprice">价格<span class="up"></span></li>
                <li data="40">返利</li>
            </ul>
            <div class="searchList">
                <div class="searchbox">
                    <form  onsubmit="return false;">
                        <label id="keyLabel_a"></label>
                        <input type="text" id="searchInput_a"  value="" autocomplete="off">
                        <a class="search-qd js_wineSearch">搜索</a>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="rebate_main">
        <ul tab-data-load="0" style="display: block">
            <#--<li>
                <div class="choice_inner">
                    <a href="#" target="_blank" data-code="" title="">
                        <img class="lazyloading" src="http://gfs14.gomein.net.cn/T1jkCvBXKg1RCvBVdK.jpg" data-lazy-init="" data-lazy-img="0" alt="" title=""  width="260" height="260"/>
                    </a>
                    <a href="#" target="_blank" data-code="" title=""><p class="img_name">小米红米 4X 全网通版32GB香槟 通电信4G手机小米 全新红米4X！5英寸屏幕，4100毫安大电池长续航 全新红米4X！5</p></a>
                    <div class="hot_price">
                        <span>¥</span><i class="minPrice">899.00</i>
                    </div>
                    <div class="rebate">
                        <span>返利</span>
                        <a>最高返<i>0.5</i>国美币</a>
                    </div>
                </div>
            </li>-->
        </ul>
        <ul tab-data-load="0"></ul>
        <ul tab-data-load="0"></ul>
        <ul tab-data-load="0"></ul>
    </div>
</div>
<!--综合搜索 end-->