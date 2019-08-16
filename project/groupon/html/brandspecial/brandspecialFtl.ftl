<h1 class="hide">国美-真划算品牌团分页-${model.imgUrl!}</h1>
<div class="group-brand-box">
    <#if model.mainAds?? && model.mainAds?size &gt; 0>
        <#list model.mainAds as mainAds>
            <div class="group-brand-top" style="background-color:${mainAds.description!}">
                <#if mainAds.url=="">
                   <a href="javascript:;" title="${mainAds.name!}" style="cursor:default">
                    <img src="${mainAds.imgUrl!}" alt="${mainAds.name!}">
                   </a>
                <#else>
                   <a href="${mainAds.url!}" title="${mainAds.name!}" target="_blank">
                    <img src="${mainAds.imgUrl!}" alt="${mainAds.name!}">
                   </a>
                </#if>
            </div>
        </#list>
    </#if>
    <div class="group-brand-item clearfix" <#if model.mainAds?? && model.mainAds?size &gt; 0> style="margin:-48px auto 0;"</#if>>
        <ul>
            <#if model.items?? && model.items?size &gt; 0>
                <#list model.items as items>
                    <li data-itemId="${items.itemId!}">
                        <div class="brand-item-img">
                            <a data-code="8000040001-${(items_index+1)!}_1" href="${items.url!}" title="${items.title!}" target="_blank">
                                <img <#if items.status?? && items.status=="ending"||items.status?? && items.status=="soldOut">class="gray-a-img"</#if> src="${items.imgUrl!}_360.jpg"  alt="${items.title!}">
                            </a>
                        </div>
                        <div class="brand-item-info clearfix">
                            <#if items.gomePrd?? && items.gomePrd==true>
                                <span <#if items.status?? && items.status=="ending"||items.status?? && items.status=="soldOut">class="gray-span-icon"</#if>>国美自营</span>
                            </#if>
                            <a data-code="8000040001-${(items_index+1)!}_2" href="${items.url!}" title="${items.title!}" <#if items.gomePrd?? && items.gomePrd==true> class="gomeprd_a"</#if>>${items.title!}</a>
                        </div>
                        <div class="brand-item-price">
                            <#if items.status?? && items.status=="buying">
                                <div class="brand-item-price-l"><span>¥</span>${items.groupPrice!}</div>
                                <div class="brand-item-price-r">
                                    <p class="count">${items.saleNum!}</p>
                                    <p>人已买</p>
                                </div>
                            <#elseif items.status?? && items.status=="ending">
                                <div class="brand-item-price-l prod-price-end"><span>¥</span>${items.groupPrice!}</div>
                                <div class="brand-item-price-r prod-price-end">
                                    <p class="yjs">已结束</p>
                                </div>
                                <div class="gray-img gray-end"></div>
                            <#elseif items.status?? && items.status=="notStarted">
                                <div class="brand-item-price-l prod-price-will"><span>¥</span>${items.groupPrice!}</div>
                                <div class="brand-item-price-r prod-price-will">
                                    <p class="jjks">即将开始</p>
                                </div>
                            <#elseif items.status?? && items.status=="soldOut">
                                <div class="brand-item-price-l prod-price-end"><span>¥</span>${items.groupPrice!}</div>
                                <div class="brand-item-price-r prod-price-end">
                                    <p class="ymw">已抢光</p>
                                </div>
                                <div class="gray-img gray-soldOut"></div>
                            </#if>
                        </div>
                    </li>
                </#list>
            <#else>
                <p style="padding: 100px 0;text-align: center; color:#5e5e5e;">商品加载失败，请刷新试试</p>
            </#if>
        </ul>
        <#if model.mainAds?? && model.mainAds?size &gt; 0>
            <span class="grey-box grey-box-l"></span>
            <span class="grey-box grey-box-r"></span>
        </#if>
    </div>
</div>
