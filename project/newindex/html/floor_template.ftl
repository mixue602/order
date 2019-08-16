<#assign gomeImgLoad = storeConfiguration.imageserver+"/grey.gif">
<#macro floorTemplates floor tp>
<#if (tp.flag)?? && (tp.flag=="A模板")>
    <#assign floorStyle="temp0">
<#elseif (tp.flag)?? && (tp.flag=="B模板")>
    <#assign floorStyle="temp1">
<#elseif (tp.flag)?? && (tp.flag=="C模板")>
    <#assign floorStyle="temp1 temp2">
<#else>
    <#assign floorStyle="temp0">
</#if>
<#if (tp.children.firstTab)??>
    <#assign firstTab=(tp.children.firstTab) />
</#if>
<div class="ct ${floorStyle!}">
    <div class="mt" style="border-bottom:1px solid ${firstTab.flag!"#ccc"}">
        <div class="mtTop"><span class="h2_text">${floor!}F</span><h2>${tp.modelName!}</h2></div>
        <ul class="tab" floor-info="${floor!}" Hcolor="${firstTab.flag!"#ccc"}">
            <li class="cur"><a style="background: ${firstTab.flag!"#ccc"};" href="javascript:void(0)" modelid="${(firstTab.modelId)!}">${(firstTab.modelName)!}</a></li>
            <#if (tp.children.tab.templates)?? && ((tp.children.tab.templates)?size>0)>
                <#list (tp.children.tab.templates) as tab>
                    <li key="${(tab.keyword)!}" modelid="${(tab.modelId)!}"><a href="javascript:void(0);">${(tab.modelName)!}</a></li>
                </#list>
            </#if>
        </ul>
    </div>
    <div class="mc">
        <div class="mc_l" style="background: ${firstTab.flag!"#ccc"}">
            <#if (firstTab.children.logoPic.imgList[0])??>
                <#assign img=(firstTab.children.logoPic.imgList[0])>
                <a class="mc_l_img edit-mode" href="${img.href!}" data-code="${img.modelId!}" target="_blank" modelId="${(firstTab.children.logoPic.modelId)!}" modelType="${(firstTab.children.logoPic.modelType)!}">
                    <img class="lazyloading" src="${(gomeImgLoad)!}" data-lazy-init="${img.src!}" data-lazy-img="0" <#if (img.alt)??>alt="${img.alt!}"</#if> title="" width="220" height="278"/></a>
            </#if>
            <#if (firstTab.children.nav)??>
                <div class="keyAll">
                    <div class="channelbg">
                        <div class="channel" style="background: ${firstTab.state!"#848484"}">
                            <#if (firstTab.children.nav.children.navUp.templates)?? && ((firstTab.children.nav.children.navUp.templates)?size>0)>
                                <ul class="channel_inner">
                                    <#list (firstTab.children.nav.children.navUp.templates) as list>
                                        <li class='edit-mode' modelId="${(list.modelId)!}" modelType="${(list.modelType)!}">
                                            <#if (list.linkList)?? && ((list.linkList)?size>0)>
                                                <#list (list.linkList) as item>
                                                    <a href="${item.href!}" target="_blank" data-code="${list.modelId!}-${(item_index+1)!}">${item.title!}</a><#if item_has_next><span>/</span></#if>
                                                </#list>
                                            </#if>
                                        </li><#if list_has_next><li class="line"></li></#if>
                                    </#list>
                                </ul>
                            </#if>
                        </div>
                    </div>
                    <div class="keywords edit-mode" style="background: url(${(firstTab.children.nav.children.imageDown.imgList[0].src)!})" modelId="${(firstTab.children.nav.children.navDown.modelId)!}" modelType="${(firstTab.children.nav.children.navDown.modelType)!}">
                        <#if (firstTab.children.nav.children.navDown)??>
                            <#assign nav=(firstTab.children.nav.children.navDown)>
                            <#if (nav.linkList)?? && ((nav.linkList)?size>0)>
                                <#list (nav.linkList) as list>
                                    <#if list_index==0>
                                    <ul class="w55">
                                        <li class="${(list.textOtherAttr.extend)!}"><a href="${list.href!}" target="_blank" data-code="${nav.modelId!}-${(list_index+1)!}">${list.title!}</a></li>
                                    <#elseif list_index==5>
                                    </ul>
                                    <ul class="w43">
                                        <li class="${(list.textOtherAttr.extend)!}"><a href="${list.href!}" target="_blank" data-code="${nav.modelId!}-${(list_index+1)!}">${list.title!}</a></li>
                                    <#elseif list_index==10>
                                    </ul>
                                    <ul class="w62">
                                        <li class="${(list.textOtherAttr.extend)!}"><a href="${list.href!}" target="_blank" data-code="${nav.modelId!}-${(list_index+1)!}">${list.title!}</a></li>
                                    <#elseif list_index==((firstTab.children.nav.children.navDown.linkList)?size-1)>
                                        <li class="${(list.textOtherAttr.extend)!}"><a href="${list.href!}" target="_blank" data-code="${nav.modelId!}-${(list_index+1)!}">${list.title!}</a></li>
                                    </ul>
                                    <#else>
                                        <li class="${(list.textOtherAttr.extend)!}"><a href="${list.href!}" target="_blank" data-code="${nav.modelId!}-${(list_index+1)!}">${list.title!}</a></li>
                                    </#if>
                                </#list>
                            </#if>
                        </#if>
                    </div>
                </div>
            </#if>
        </div>
        <div class="main_warp">
            <div class="main" style="display: block" tab-data-load="0">
                <#if (firstTab.children.advertPic)??>
                <#assign pic=(firstTab.children.advertPic)>
                    <div class="mc_c " >
                        <#if (pic.children.FocusPic.imgList)?? && ((pic.children.FocusPic.imgList)?size>0)>
                            <ul class="slider edit-mode" modelId="${(pic.children.FocusPic.modelId)!}" modelType="${(pic.children.FocusPic.modelType)!}">
                                <#list (pic.children.FocusPic.imgList) as item>
                                    <li <#if item_index==0>style="display: block"</#if> ><a href="${(item.href)!}" data-code="${(item.modelId)!}-${(item_index+1)!}" target="_blank"><img class="lazyloading" src="${(gomeImgLoad)!}" data-lazy-init="${(item.src)!}" data-lazy-img="0" alt="" title="" <#if floorStyle=='temp0'>width="389"<#else>width="479"</#if>  height="470" /></a></li>
                                </#list>
                            </ul>
                            <ol class="nav">
                                <#list (pic.children.FocusPic.imgList) as item>
                                    <li <#if item_index==0>class="cur"</#if> ><a></a></li>
                                </#list>
                            </ol>
                            <div class="slider_page">
                                <p class="slider_up" onselectstart="return false" style="-moz-user-select:none;"><a href="javascript:void(0)" class="slider_prev"></a><span class="prev"></span></p>
                                <p class="slider_down" onselectstart="return false" style="-moz-user-select:none;"><a href="javascript:void(0)" class="slider_next"></a><span class="next"></span></p>
                            </div>
                        </#if>
                        <div class="brand_slider edit-mode" modelId="${(pic.children.brandPic.modelId)!}" modelType="${(pic.children.brandPic.modelType)!}">
                            <#if (pic.children.brandPic.imgList)?? && ((pic.children.brandPic.imgList)?size>0)>
                                <ul style="display:block">
                                    <#list (pic.children.brandPic.imgList) as list>
                                        <#if floorStyle=="temp0">
                                            <#if list_index!=0 && (list_index%6)==0></ul><ul></#if>
                                        <#else>
                                            <#if list_index!=0 && (list_index%8)==0></ul><ul></#if>
                                        </#if>
                                        <li><a href="${(list.href)!}" data-code="${(list.modelId!)}-${(list_index+1)!}" target="_blank" title="${(list.title)!}"><img src="${(gomeImgLoad)!}" data-lazy-init="${(list.src)!}" data-lazy-img="0" <#if (list.alt)??>alt="${(list.alt)!}"</#if> width="100" height="30"/></a></li>
                                    </#list>
                                </ul>
                            </#if>
                        </div>
                    </div>
                </#if>
                <div class="mc_r">
                    <ul class="mc_r_inner edit-mode" modelId="${(firstTab.children.productPic.modelId)!}" modelType="${(firstTab.children.productPic.modelType)!}">
                        <#if (firstTab.children.productPic.imgList)?? && ((firstTab.children.productPic.imgList)?size>0)>
                            <#list (firstTab.children.productPic.imgList) as list>
                                <li <#if floorStyle="temp1 temp2">class="<#if list_index==1>w199<#elseif list_index==3>last</#if>"</#if>><a href="${list.href!}" data-code="${list.modelId}-${(list_index+1)!}" target="_blank"><img class="lazyloading" src="${(gomeImgLoad)!}" data-lazy-init="${list.src!}" data-lazy-img="0" <#if (list.alt)??>alt="${(list.alt)!}"</#if> title="" width="199" <#if floorStyle="temp1 temp2"><#if list_index==1>height="470"</#if></#if>height="234" /></a></li>
                            </#list>
                        </#if>
                    </ul>
                </div>
            </div>
            <#if (tp.children.tab.templates)?? && ((tp.children.tab.templates)?size>0)>
                <#list (tp.children.tab.templates) as tab>
                    <div class="main" tab-data-load="0"></div>
                </#list>
            </#if>
            <div class="page_slider">
                <p class="page_down" onselectstart="return false" style="-moz-user-select:none;"><a href="javascript:void(0)" class="slider_next"></a><span class="next"></span></p>
            </div>
        </div>
    </div>

<#if (tp.children.bannerImage)??>
    <#if (tp.children.bannerImage.imgList)?? && ((tp.children.bannerImage.imgList)?size>0)>
        <#assign img=(tp.children.bannerImage.imgList)>
        <ul class="wbox fl_b edit-mode" modelId="${(tp.children.bannerImage.modelId)!}" modelType="${(tp.children.bannerImage.modelType)!}">
            <#list img as banner>
                <#if (img?size==1)>
                    <li>
                        <a href="${banner.href!}" data-code="${banner.modelId!}-${(banner_index+1)!}" target="_blank">
                            <img class="lazyloading" src="${(gomeImgLoad)!}" data-lazy-init="${banner.src!}" data-lazy-img="0" <#if (banner.alt)??>alt="${banner.alt!}"</#if> title=""/>
                        </a>
                    </li>
                <#elseif (img?size==2)>
                    <li>
                        <a href="${banner.href!}" data-code="${banner.modelId!}-${(banner_index+1)!}" target="_blank" class="num2">
                            <img class="lazyloading" src="${(gomeImgLoad)!}" data-lazy-init="${banner.src!}" data-lazy-img="0" <#if (banner.alt)??>alt="${banner.alt!}"</#if> title=""/>
                        </a>
                    </li>
                <#elseif (img?size==3)>
                    <li>
                        <a href="${banner.href!}" data-code="${banner.modelId!}-${(banner_index+1)!}" target="_blank" class="num3 <#if (banner_index>0)>w333</#if>">
                            <img class="lazyloading" src="${(gomeImgLoad)!}" data-lazy-init="${banner.src!}" data-lazy-img="0" <#if (banner.alt)??>alt="${banner.alt!}"</#if> title=""/>
                        </a>
                    </li>
                </#if>
            </#list>
        </ul>
    </#if>
</#if>
<#if (tp.children.life)??>
<div class="life">
    <div class="gm_title"><h2>${(tp.children.life.modelName)!}</h2><span>${(tp.children.life.state)!}</span></div>
    <#if (tp.children.life.children.brandImage.imgList)?? && ((tp.children.life.children.brandImage.imgList)?size>0)>
        <ul>
            <#list (tp.children.life.children.brandImage.imgList) as list>
                <li><a href="${list.href!}" data-code="${list.modelId!}-${(list_index+1)!}" target="_blank"><img class="lazyloading" src="${(gomeImgLoad)!}" data-lazy-init="${list.src!}" data-lazy-img="0" <#if (list.alt)??>alt="${(list.alt)!}"</#if> title="" width="294" height="220"/><p>${list.title!}</p></a></li>
            </#list>
        </ul>
    </#if>
</div>
</#if>
</div>
</#macro>

