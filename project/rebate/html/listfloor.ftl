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
<!--返利商品-->
<#if children.fanliTab?? && children.fanliTab.templates?? && children.fanliTab.templates?size &gt; 0>
    <div class="goodsTab wbox">
        <div class="goodsTab_warp js_goodsTab">
            <ul class="goodsTab_box_title clearfix" id="goodsTab_box_title">
                <#list children.fanliTab.templates as items>
                    <li <#if items_index==0>class="cur"</#if> data-rebate="<#if items.children?? && items.children.product?? && items.children.product.prdList?? && items.children.product.prdList?size &gt; 0><#list (items.children.product.prdList) as item>${item.productId!}_${item.skuId!}<#if item_has_next>,</#if></#list></#if>">${(items.modelName)!}</li>
                </#list>
            </ul>
            <div class="floor_warp clearfix goodsTab_box" id="goodsTab_box">
                <#list children.fanliTab.templates as items>
                    <div class="goodsTab_list js_goodsTab_list edit-mode" modelType="${(items.children.product.modelType)!}" modelId="${(items.children.product.modelId)!}">
                        <#if items.children?? && items.children.product?? && items.children.product.prdList?? && items.children.product.prdList?size &gt; 0>
                            <ul>
                            <#list items.children.product.prdList as item>
                                <li>
                                    <a href="${(item.detailHref)!}" target="_blank" title="${(item.name)!}" class="goods_img" data-code="${(items.children.product.modelId)!}-${(item_index+1)!}">
                                        <#if item.manualImg ?? >
                                            <img src="${(gomeImgLoad)!}" data-lazy-img="0" data-lazy-init="${(item.manualImg)!}" alt="${(item.name)!}" width="160" height="160"/>
                                            <#else>
                                                <img src="${(gomeImgLoad)!}" data-lazy-img="0" data-lazy-init="${(item.goodsImgs[0].src)!}_160.jpg" alt="${(item.name)!}" width="160" height="160"/>
                                        </#if>
                                    </a>
                                    <a href="${(item.detailHref)!}" target="_blank" title="${(item.name)!}" class="goods_name" data-code="${(items.children.product.modelId)!}-${(item_index+1)!}">${(item.name)!}</a>
                                    <span data-target="p-price" data-skuId="${(item.skuId)!}" class="price">¥<i class="minPrice">${(item.price)!}</i></span>
                                    <#if items_index == 0>
                                        <div><span class="rebate_fl">返利</span><span class="rebate_txt">最高返 <i class="rebate_money"></i> 国美币</span></div>
                                    <#else>
                                        <div class="rebate_text">大额返利即将到达,敬请期待！</div>
                                    </#if>
                                </li>
                            </#list>
                            </ul>
                        </#if>
                    </div>
                </#list>
            </div>
        </div>
    </div>
</#if>

<!--返利商品 end-->