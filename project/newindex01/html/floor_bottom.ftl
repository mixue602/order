<#macro floorBottoms tp>
<div class="floor_bottom">
<div class="wbox">
    <#list tp as tp>
        <div <#if tp_index==0>class="m_l"<#elseif tp_index==1>class="m_r"</#if>">
            <div class="tp_l">
                <#if (tp.children.floorPicbig)??>
                    <#assign pic=(tp.children.floorPicbig)/>
                    <div class="tp_img edit-mode" modelId="${(pic.children.Up.modelId)!}" modelType="${(pic.children.Up.modelType)!}">
                        <#if (pic.children.floorPic.imgList[0])??>
                            <#assign pc=(pic.children.floorPic.imgList[0])>
                            <a href="${pc.href!}" data-code="${pc.modelId!}" target="_blank">
                                <img class="lazyloading" src="${(gomeImgLoad)!}" data-lazy-init="${pc.src!}" data-lazy-img="0" <#if (pc.alt)??>alt="${pc.alt!}"</#if> title="" width="294" height="287"/>
                                <#if (pic.children.Up.linkList[0])??>
                                    <div class="gain">
                                        <span>${(pic.children.Up.linkList[0].title)!}</span>
                                        <b>${(pic.children.Up.linkList[0].text)!}</b>
                                    </div>
                                </#if>
                            </a>
                        </#if>
                    </div>
                    <ul class="channel pindao edit-mode" style="background: ${(tp.flag)!}" modelId="${(pic.children.content.modelId)!}" modelType="${(pic.children.content.modelType)!}">
                        <#if (pic.children.content.linkList)?? && ((pic.children.content.linkList)?size>0)>
                            <li>
                                <#list (pic.children.content.linkList) as item>
                                    <a href="${item.href!}" target="_blank" data-code="${(pic.children.content.modelId!)}-${(item_index+1)!}">${item.title!}</a>
                                    <#if item_has_next><span>/</span></#if>
                                </#list>
                            </li>
                        </#if>
                    </ul>
                    <div class="words edit-mode" style="background: ${(tp.state)!}" modelId="${(pic.children.Down.modelId)!}" modelType="${(pic.children.Down.modelType)!}">
                        <ul class="wd">
                            <#if (pic.children.Down.linkList)?? && ((pic.children.Down.linkList)?size>0)>
                                <#list (pic.children.Down.linkList) as list>
                                    <li class="${(list.textOtherAttr.extend)!}"><a href="${list.href!}" target="_blank" data-code="${(pic.children.Down.modelId!)}-${(list_index+1)!}">${list.title!}</a></li>
                                </#list>
                            </#if>
                        </ul>
                    </div>
                </#if>
            </div>
            <ul class="tp_r">
                <#if (tp.children.imagetext.templates)?? && ((tp.children.imagetext.templates)?size>0)>
                    <#list (tp.children.imagetext.templates) as img>
                        <#if (img.children.floorPic.imgList[0])??>
                            <#assign imgs=(img.children.floorPic.imgList[0])>
                        </#if>
                        <li>
                            <a href="${imgs.href!}" data-code="${imgs.modelId!}" target="_blank">
                                <img class="lazyloading edit-mode" src="${(gomeImgLoad)!}" data-lazy-init="${imgs.src!}" data-lazy-img="0" alt="" title="" modelId="${(img.children.floorPic.modelId)!}" modelType="${(img.children.floorPic.modelType)!}" width="200" height="200"/>
                                <#if (img.children.text.linkList[0])??>
                                    <#assign tx=(img.children.text.linkList[0])>
                                </#if>
                                <#if tp_index==0>
                                    <div class="center edit-mode" modelId="${(img.children.text.modelId)!}" modelType="${(img.children.text.modelType)!}">
                                        <span>${tx.title!}</span>
                                        <b>${tx.text!}</b>
                                    </div>
                                <#elseif tp_index==1>
                                    <p>${tx.title!}</p>
                                </#if>
                            </a>
                        </li>
                    </#list>
                </#if>
            </ul>
        </div>
    </#list>
</div>
</div>
</#macro>