<div class="wbox hotlist_js">
    <div class="loading-sync"></div>
</div>
<div class="wbox hotlist hotlist_house">
    <div class="hot_l">
        <div class="gm_title"><h2>热销榜</h2><span>HOT</span><a class="hot_more index_fr" target="_blank" href="//www.gome.com.cn/ranking.html"><b class="index_fl">更多好货</b><b class="arrow index_fl"></b></a></div>
        <div class="hot_m"></div>
    </div>
<#--家电服务-->
    <#if (temps.temp.children.applianceService.children)??>
        <#assign house_box = temps.temp.children.applianceService.children>
        <div class="hot_r edit-mode" modelId="${(temps.temp.children.applianceService.modelId)!}" modelType="">
            <div class='gm_title edit-mode' modelId="${(house_box.title.modelId)!}" modelType="${(house_box.title.modelType)!}">
                <h2>${(house_box.title.linkList[0].text)!}</h2>
                <span>${(house_box.title.linkList[0].title)!}</span>
                <div class='hot_word index_fr edit-mode' modelId="${(house_box.linkText.modelId)!}" modelType="${(house_box.linkText.modelType)!}">
                    <a class="num1" <#if (house_box.linkText.linkList[0].href)??> target="_blank" href="${(house_box.linkText.linkList[0].href)!}"<#else> href="javascript:;"</#if> data-code="${(house_box.linkText.modelId)!}-1">
                        ${(house_box.linkText.linkList[0].textOtherAttr.elemenlName)!}
                    </a><#if (house_box.linkText.linkList[1].textOtherAttr.elemenlName) ??>/</#if>
                    <a class="num2" <#if (house_box.linkText.linkList[1].href)??> target="_blank" href="${(house_box.linkText.linkList[1].href)!}"<#else> href="javascript:;"</#if> data-code="${(house_box.linkText.modelId)!}-2">
                        ${(house_box.linkText.linkList[1].textOtherAttr.elemenlName)!}
                    </a>
                </div>
            </div>
            <#if (house_box.product.templates)??>
                <div class="Housekeeper">
                    <ul>
                        <#list house_box.product.templates as items>
                            <li class="lists lists_${(items_index)+1}">
                                <a class="clearfix out" <#if (items.children.goods.prdList[0].detailHref)??> target="_blank" href="${(items.children.goods.prdList[0].detailHref)!}"<#else> href="javascript:;"</#if> data-code="${(items.modelId)!}-${(items_index)+1}">
                                    <#if (items.children.goods.prdList)?? && (items.children.goods.prdList)?size &gt;0>
                                        <#assign prdbox = items.children.goods.prdList>
                                        <div class="index_fl index_pr goods">
                                            <img class="img lazyloading edit-mode" modelId="${(items.children.goods.modelId)!}" modelType="${(items.children.goods.modelType)!}" data-lazy-img="0" data-lazy-init="<#if (prdbox[0].manualImg)?? && prdbox[0].manualImg!="">${(prdbox[0].manualImg)!}<#else>${(prdbox[0].goodsImgs[0].src)!}_120.jpg</#if>" src="${(gomeImgLoad)!}" width="120" height="120" <#if (prdbox[0].name)??>alt="${(prdbox[0].name)!}"</#if> />
                                            <#if (items.children.serviceflag.linkList)?? && (items.children.serviceflag.linkList)?size &gt;0>
                                                <div class="house_ser index_pabs edit-mode" modelId="${(items.children.serviceflag.modelId)!}" modelType="${(items.children.serviceflag.modelType)!}">
                                                    <#--<div class="index_fr">-->
                                                        <#list items.children.serviceflag.linkList as serviceitems>
                                                            <div class="lang"><span class="point">${(serviceitems.textOtherAttr.elemenlName)!}</span></div>
                                                        </#list>
                                                    <#--</div>-->
                                                </div>
                                            </#if>
                                        </div>
                                    </#if>
                                    <div class="index_fl right">
                                        <#if (items.children.goods.prdList[0])??>
                                            <#assign tittlebox = items.children.goods.prdList[0]>
                                            <div class="tittle">
                                                ${(tittlebox.name)!}
                                            </div>
                                        </#if>
                                        <div class="price_out price" data-target="p-price" data-skuId="${(prdbox[0].skuId)!}"><span>¥</span><span class="price minPrice"></span>起</div>
                                        <#if (items.children.serviceExplain.linkList)??>
                                            <div class="des edit-mode" title="${(items.children.serviceExplain.linkList[0].text)!}" modelId="${(items.children.serviceExplain.modelId)!}" modelType="${(items.children.serviceExplain.modelType)!}">
                                                <span>${(items.children.serviceExplain.linkList[0].text)!}</span>
                                                <span>${(items.children.serviceExplain.linkList[0].title)!}</span>
                                            </div>
                                        </#if>
                                    </div>
                                </a>
                            </li>
                        </#list>
                    </ul>
                </div>
            </#if>
        </div>
    </#if>
<#--家电服务-end-->
</div>
<div class="bottom_bg">
<#--底部背景-start-->
<#if (children.tempName.templates[0].temp.children.background.children.bottom.children)??>
    <#assign footer_bgbox = children.tempName.templates[0].temp.children.background.children.bottom.children>
    <div class="footer_bg">
        <#if (footer_bgbox.left.imgList)??>
            <img class="footer_bg_l edit-mode" modelId="${(footer_bgbox.left.modelId)!}-1" data-lazy-img="0" src="//app.gomein.net.cn/images/grey.gif" data-lazy-init="${(footer_bgbox.left.imgList[0].src)!}" <#if (footer_bgbox.left.imgList[0].alt)??>alt="${(footer_bgbox.left.imgList[0].alt)!}"</#if> title=""/>
        </#if>
        <#if (footer_bgbox.right.imgList)??>
            <img class="footer_bg_r edit-mode" modelId="${(footer_bgbox.right.modelId)!}-1" data-lazy-img="0" src="//app.gomein.net.cn/images/grey.gif" data-lazy-init="${(footer_bgbox.right.imgList[0].src)!}"  <#if (footer_bgbox.right.imgList[0].alt)??>alt="${(footer_bgbox.right.imgList[0].alt)!}"</#if> title=""/>
        </#if>

    </div>
    <style>.home{ *position: relative;}</style>
</#if>
<#--底部背景-end-->
</div>
