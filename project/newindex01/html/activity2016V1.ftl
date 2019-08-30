
<#if (temps.temp.children.line1.imgList)?? || (temps.temp.children.line2.imgList)?? || (temps.temp.children.line3.imgList)?? || (temps.temp.children.line4.imgList)?? >
<div class="sale sale2 edit-mode" modelId="${(temps.temp.modelId)!}" modelType="" style="background:${(temps.temp.children.background.state)!}">
    <#if (temps.temp.children.topimage.imgList)?? || (temps.temp.children.background.imgList)??>
        <div class="wbox extra_img">
        <#--顶部背景图-->
            <#if (temps.temp.children.topimage.imgList[0])??>
                <#assign top=(temps.temp.children.topimage.imgList[0])>
                <a class="sale_top_bg edit-mode" <#if (top.href)??>href="${(top.href)!}" data-code="${(top.modelId)!}"</#if> target="_blank" title="" modelId="${(temps.temp.children.topimage.modelId)!}" modelType="${(temps.temp.children.topimage.modelType)!}">
                    <img class="sale_t bc_imgt" src="${(gomeImgLoad)!}" data-lazy-init="${(top.src)!}" data-lazy-img="0" <#if (top.alt)??>alt="${(top.alt)!}"</#if> title=""/>
                </a>
            </#if>
        <#--左右背景图-->
            <#if (temps.temp.children.background.imgList)?? && ((temps.temp.children.background.imgList)?size>0)>
                <#list (temps.temp.children.background.imgList) as bc>
                    <a class="edit-mode" <#if (bc.href)??>href="${(bc.href)!}" data-code="${(bc.modelId)!}-${(bc_index+1)!}"</#if> target="_blank" title="" modelId="${(temps.temp.children.background.modelId)!}" modelType="${(temps.temp.children.background.modelType)!}">
                        <img <#if bc_index==0>class="sale_l bc_imgl"<#else>class="sale_r bc_imgr"</#if> src="${(gomeImgLoad)!}" data-lazy-init="${(bc.src)!}" data-lazy-img="0" <#if (bc.alt)??>alt="${(bc.alt)!}"</#if> title=""/>
                    </a>
                </#list>
            </#if>
        </div>
    </#if>
    <#--广告-->
    <#if (temps.temp.children.line1.imgList)?? || (temps.temp.children.line2.imgList)?? || (temps.temp.children.line3.imgList)?? || (temps.temp.children.line4.imgList)??>
        <div class="wbox sale_main">
            <#if (temps.temp.children.line1.imgList)?? && ((temps.temp.children.line1.imgList)?size>0)>
                <#assign imgbox = temps.temp.children.line1>
                <ul class="clearfix up edit-mode" modelId="${(imgbox.modelId)!}" modelType="${(imgbox.modelType)!}">
                    <#list (imgbox.imgList) as img>
                        <li>
                            <a href="${(img.href)!}" data-code="${(img.modelId)!}-${(img_index+1)!}" target="_blank">
                                <img class="lazyloading" src="${(gomeImgLoad)!}" data-lazy-init="${(img.src)!}" data-lazy-img="0" <#if (img.alt)??>alt="${(img.alt)!}"</#if> title=""/>
                            </a>
                        </li>
                    </#list>
                </ul>
            </#if>
            <#if (temps.temp.children.line2.imgList)?? && ((temps.temp.children.line2.imgList)?size>0)>
                <#assign imgbox = temps.temp.children.line2>
                <ul class="clearfix up edit-mode" modelId="${(imgbox.modelId)!}" modelType="${(imgbox.modelType)!}">
                    <#list (imgbox.imgList) as img>
                        <li>
                            <a href="${(img.href)!}" data-code="${(img.modelId)!}-${(img_index+1)!}" target="_blank">
                                <img class="lazyloading" src="${(gomeImgLoad)!}" data-lazy-init="${(img.src)!}" data-lazy-img="0" <#if (img.alt)??>alt="${(img.alt)!}"</#if> title=""/>
                            </a>
                        </li>
                    </#list>
                </ul>
            </#if>
            <#if (temps.temp.children.line3.imgList)?? && ((temps.temp.children.line3.imgList)?size>0)>
                <#assign imgbox = temps.temp.children.line3>
                <ul class="clearfix Brand_area edit-mode" modelId="${(imgbox.modelId)!}" modelType="${(imgbox.modelType)!}">
                    <#list (imgbox.imgList) as img>
                        <li>
                            <a href="${(img.href)!}" data-code="${(img.modelId)!}-${(img_index+1)!}" target="_blank">
                                <img class="lazyloading" src="${(gomeImgLoad)!}" data-lazy-init="${(img.src)!}" data-lazy-img="0" <#if (img.alt)??>alt="${(img.alt)!}"</#if> title=""/>
                            </a>
                        </li>
                    </#list>
                </ul>
            </#if>
            <#if (temps.temp.children.line4.imgList)?? && ((temps.temp.children.line4.imgList)?size>0)>
                <#assign imgbox = temps.temp.children.line4>
                <ul class="clearfix Brand_area edit-mode" modelId="${(imgbox.modelId)!}" modelType="${(imgbox.modelType)!}">
                    <#list (imgbox.imgList) as img>
                        <li>
                            <a href="${(img.href)!}" data-code="${(img.modelId)!}-${(img_index+1)!}" target="_blank">
                                <img class="lazyloading" src="${(gomeImgLoad)!}" data-lazy-init="${(img.src)!}" data-lazy-img="0" <#if (img.alt)??>alt="${(img.alt)!}"</#if> title=""/>
                            </a>
                        </li>
                    </#list>
                </ul>
            </#if>
        </div>
    </#if>
</div>
</#if>
<#--大促底部弹层 start-->
<#if (children.tempName.templates[1].temp.children.lowhurdles)??>
    <#assign bigprobox = children.tempName.templates[1].temp.children.lowhurdles>
    <div class="fl_pop_wrap big_promotion edit-mode" style="display:none;" modelId="${(bigprobox.modelId)!}" modelType="">
        <#if (bigprobox.children.showImage.imgList[0])??>
            <div class="fl_open_wrap edit-mode" modelId="${(bigprobox.children.showImage.modelId)!}" modelType="${(bigprobox.children.showImage.modelType)!}">
                <div class="fl_open_wrap_cntr"><img src="${(bigprobox.children.showImage.imgList[0].src)!}" width="125" height="100"/></div>
            </div>
        </#if>
        <div style="display: block;" class="fl_pop_wrap_cntr">
            <!-- <div class="fl_pop_wrap_cntr_bg"></div> -->
            <#if (bigprobox.children.backImage.imgList[0])??>
                <#assign backImagebox = bigprobox.children.backImage.imgList[0]>
                <div class="fl_pop_box">
                    <a class="edit-mode pro_bg" data-code="${(bigprobox.children.backImage.modelId)!}-1" <#if (backImagebox.href)??> target="_blank" href="${(backImagebox.href)!}"<#else> href="javascript:;"</#if> modelId="${(bigprobox.children.backImage.modelId)!}" modelType="${(bigprobox.children.backImage.modelType)!}">
                        <img src="${(bigprobox.children.backImage.imgList[0].src)!}" width="1200" height="100"/>
                    </a>
                    <#if (bigprobox.children.buttonImage.imgList)?? && (bigprobox.children.buttonImage.imgList)?size &gt;0>
                        <#assign buttonbox = bigprobox.children.buttonImage.imgList>
                        <ul class="fl_pop_pic clearfix edit-mode" modelId="${(bigprobox.children.buttonImage.modelId)!}" modelType="${(bigprobox.children.buttonImage.modelType)!}"> 
                            <#list buttonbox as listitems>
                                <li class="index_fr">
                                    <a data-code="${(bigprobox.children.buttonImage.modelId)!}-${(listitems_index)+1}" <#if (listitems.href)??> target="_blank" href="${(listitems.href)!}"<#else> href="javascript:;"</#if>>
                                        <img src="${(listitems.src)!}" height="100"/>
                                    </a>
                                </li>
                           </#list>
                        </ul>
                    </#if>
                    
                    <a title="关闭" class="fl_wrap_close" href="javascript:;">×</a>
                </div>
            </#if>
        </div>
    </div>
</#if>
<#--大促底部弹层 end-->
