<div class="wbox hotlist_js">
    <div class="loading-sync"></div>
</div>
<div class="wbox hotlist">
    <div class="hot_l">
        <div class="gm_title"><h2>热销榜</h2><span>HOT</span></div>
        <div class="hot_m"></div>
    </div>
    <#if (temps.temp.children.showOrders)??>
        <div class="hot_r edit-mode" modelId="${(temps.temp.children.showOrders.modelId)!}">
            <div class='gm_title'>
                <h2>晒单</h2>
                <span>SHARE</span>
                <div class='change_btn'>
                    <a class="pre" onselectstart="return false" style="-moz-user-select:none;"></a>
                    <a class="nex" onselectstart="return false" style="-moz-user-select:none;"></a>
                </div>
            </div>
            <div class="hot_m_l">
                <#if (temps.temp.children.showOrders.children.bottom.templates)?? && ((temps.temp.children.showOrders.children.bottom.templates)?size>0)>
                    <ul style="display: block">
                        <#list (temps.temp.children.showOrders.children.bottom.templates) as list>
                        <#if (list.children.pic.imgList[0])??>
                            <#assign pic=(list.children.pic.imgList[0])>
                        </#if>
                        <#if (list.children.face.imgList[0])??>
                            <#assign face=(list.children.face.imgList[0])>
                        </#if>
                        <#if (list.children.title.linkList[0])??>
                            <#assign text=(list.children.title.linkList[0])>
                        </#if>
                        <#if list_index!=0 && (list_index%2)==0>
                            </ul><ul>
                        </#if>
                            <li <#if ((list_index+1)%2)==0>class="ml1"</#if>>
                                <div class="hot_inner">
                                    <a href="${pic.href!}" data-code="${pic.modelId!}-${(list_index+1)!}" target="_blank"><img class="lazyloading user_img" src="${(gomeImgLoad)!}" data-lazy-init="${pic.src!}" data-lazy-img="0" alt="${pic.alt!}" title="" width="140" height="140"/></a>
                                    <div class="gm_user">
                                        <a href="${face.href!}" data-code="${face.modelId!}-${(list_index+1)!}" target="_blank" title="${face.title!}">
                                            <img class="lazyloading" src="${(gomeImgLoad)!}" data-lazy-init="${face.src!}" data-lazy-img="0" width="32" height="32" alt="${face.alt!}"/>
                                        </a>
                                        <a href="${face.href!}" data-code="${face.modelId!}-${(list_index+1)!}" target="_blank" title="${face.title!}">
                                            <span>${(face.urlParam!)}</span>
                                            <p>${face.title!}</p>
                                        </a>
                                    </div>
                                    <div class="ping">
                                        <b></b>
                                        <a href="${text.href!}" data-code="${text.modelId!}-${(list_index+1)!}" target="_blank" title="${(text.title)!}">
                                            <#if (text.title)??>
                                                <p> <#if ((text.title)?length lt 25)>"${(text.title)!}"<#else>"${(text.title?substring(0,25))!}..."</#if></p>
                                            </#if>
                                        </a>
                                    </div>
                                </div>
                            </li>
                        </#list>
                    </ul>
                </#if>
            </div>
        </div>
    </#if>

</div>
<div class="bottom_bg">
    <#--底部背景-start-->
    <#if (children.tempName.templates[0].temp.children.background.children.bottom.children)??>
        <#assign footer_bgbox = children.tempName.templates[0].temp.children.background.children.bottom.children>
        <div class="footer_bg">
            <#if (footer_bgbox.left.imgList)??>
                <img class="footer_bg_l edit-mode" modelId="${(footer_bgbox.left.modelId)!}-1" data-lazy-img="0" src="${(gomeImgLoad)!}" data-lazy-init="${(footer_bgbox.left.imgList[0].src)!}"  alt="${(footer_bgbox.left.imgList[0].alt)!}" title=""/>
            </#if>
            <#if (footer_bgbox.right.imgList)??>
                <img class="footer_bg_r edit-mode" modelId="${(footer_bgbox.right.modelId)!}-1" data-lazy-img="0" src="${(gomeImgLoad)!}" data-lazy-init="${(footer_bgbox.right.imgList[0].src)!}"  alt="${(footer_bgbox.right.imgList[0].alt)!}" title=""/>
            </#if>
    
        </div>
        <style>.home{ *position: relative;}</style>
    </#if>
    <#--底部背景-end-->
</div>
