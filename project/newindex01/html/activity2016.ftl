
<#if (temps.temp.children.activityImage.templates[0].imgList)?? || (temps.temp.children.activityImage.templates[1].imgList)?? || (temps.temp.children.logoimage.templates[0].imgList)?? || (temps.temp.children.logoimage.templates[1].imgList)??>
    <div class="sale edit-mode" modelId="${(temps.temp.modelId)!}" <#if (temps.temp.children.background.state)??>style="background:${(temps.temp.children.background.state)!}"</#if>>
        <div class="wbox extra_img">
            <#--顶部背景图-->
            <#if (temps.temp.children.topimage.imgList[0])??>
            <#assign top=(temps.temp.children.topimage.imgList[0])>
                <a class="sale_top_bg" <#if (top.href)??>href="${(top.href)!}" data-code="${(top.modelId)!}"</#if> target="_blank">
                    <img class="sale_t bc_imgt" src="//app.gomein.net.cn/images/grey.gif" data-lazy-init="${(top.src)!}" data-lazy-img="0" <#if (top.alt)??>alt="${(top.alt)!}"</#if> title=""/>
                </a>
            </#if>
            <#--左右背景图-->
            <#if (temps.temp.children.background.imgList)?? && ((temps.temp.children.background.imgList)?size>0)>
                <#list (temps.temp.children.background.imgList) as bc>
                    <a <#if (bc.href)??>href="${(bc.href)!}" data-code="${(bc.modelId)!}-${(bc_index+1)!}"</#if> target="_blank">
                        <img <#if bc_index==0>class="sale_l bc_imgl"<#else>class="sale_r bc_imgr"</#if> src="//app.gomein.net.cn/images/grey.gif" data-lazy-init="${(bc.src)!}" data-lazy-img="0" <#if (bc.alt)??>alt="${(bc.alt)!}"</#if> title=""/>
                    </a>
                </#list>
            </#if>
        </div>
        <#--广告-->
        <#if (temps.temp.children.activityImage.templates)?? && ((temps.temp.children.activityImage.templates)?size>0)>
            <div class="wbox sale_main">
                <#if (temps.temp.children.activityImage.templates[0].imgList)?? && ((temps.temp.children.activityImage.templates[0].keyword)= "/activity2016/activityImage_1" )>
                    <#assign imgbox = temps.temp.children.activityImage.templates[0]>
                    <ul class="clearfix up edit-mode" modelId="${(imgbox.modelId)!}" modelType="${(imgbox.modelType)!}">
                        <#list (imgbox.imgList) as img>
                            <#if img_index &lt; 4>
                                <li <#if img_index<1>class="s_m"</#if>>
                                    <a href="${(img.href)!}" data-code="${(img.modelId)!}-${(img_index+1)!}" target="_blank">
                                        <img class="lazyloading" src="//app.gomein.net.cn/images/grey.gif" data-lazy-init="${(img.src)!}" data-lazy-img="0" <#if (img.alt)??>alt="${(img.alt)!}"</#if> title=""/>
                                    </a>
                                </li>
                            </#if>
                        </#list>
                    </ul>
                <#else>
                    <#if (temps.temp.children.activityImage.templates[0].imgList)?? && ((temps.temp.children.activityImage.templates[0].keyword)= "/activity2016/activityImage_2")>
                        <#assign imgbox = temps.temp.children.activityImage.templates[0]>
                        <ul class="clearfix down edit-mode" modelId="${(imgbox.modelId)!}" modelType="${(imgbox.modelType)!}">
                            <#list (imgbox.imgList) as img>
                                <li>
                                    <a href="${(img.href)!}" data-code="${(img.modelId)!}-${(img_index+1)!}" target="_blank">
                                        <img class="lazyloading" src="//app.gomein.net.cn/images/grey.gif" data-lazy-init="${(img.src)!}" data-lazy-img="0" <#if (img.alt)??>alt="${(img.alt)!}"</#if> title=""/>
                                    </a>
                                </li>
                            </#list>
                        </ul>
                    </#if>
                </#if>

                <#if (temps.temp.children.activityImage.templates[1].imgList)?? && ((temps.temp.children.activityImage.templates[1].keyword)= "/activity2016/activityImage_2")>
                    <#assign imgbox = temps.temp.children.activityImage.templates[1]>
                    <ul class="clearfix down edit-mode" modelId="${(imgbox.modelId)!}" modelType="${(imgbox.modelType)!}">
                        <#list (imgbox.imgList) as img>
                            <li>
                                <a href="${(img.href)!}" data-code="${(img.modelId)!}-${(img_index+1)!}" target="_blank">
                                    <img class="lazyloading" src="//app.gomein.net.cn/images/grey.gif" data-lazy-init="${(img.src)!}" data-lazy-img="0" <#if (img.alt)??>alt="${(img.alt)!}"</#if> title=""/>
                                </a>
                            </li>
                        </#list>
                    </ul>
                </#if>
            </div>
        </#if>
        <#--品牌-->
        <#if (temps.temp.children.logoimage.templates)?? && ((temps.temp.children.logoimage.templates)?size>0) >
            <div class="wbox Brand_area" <#if (temps.temp.children.activityImage.templates)?size=0> style="margin-top:80px;"</#if>>
                <#if (temps.temp.children.logoimage.templates[0].imgList)?? && (temps.temp.children.logoimage.templates[0].imgList)?size &gt; 0>
                    <ul class="clearfix up edit-mode" modelId="${(temps.temp.children.logoimage.templates[0].modelId)!}" modelType="${(temps.temp.children.logoimage.templates[0].modelType)!}">
                        <#list (temps.temp.children.logoimage.templates[0].imgList) as brandlogo>
                            <li class="Brand_last${(brandlogo_index)+1}">
                                <a data-code="${(temps.temp.children.logoimage.templates[0].modelId)!}-${(brandlogo_index+1)!}" <#if (brandlogo.href)??>target="_blank" href="${(brandlogo.href)!}"<#else>href="javascript:;"</#if> title="" >
                                    <img class="lazyloading" src="//app.gomein.net.cn/images/grey.gif" data-lazy-init="${(brandlogo.src)!}" data-lazy-img="0" <#if (brandlogo.alt)??>alt="${(brandlogo.alt)!}"</#if> height="96" width="232" title=""/>
                                </a>
                            </li>
                        </#list>
                    </ul>
                </#if>
                <#if (temps.temp.children.logoimage.templates[1].imgList)?? && (temps.temp.children.logoimage.templates[1].imgList)?size &gt; 0>
                    <ul class="clearfix down edit-mode" modelId="${(temps.temp.children.logoimage.templates[1].modelId)!}" modelType="${(temps.temp.children.logoimage.templates[1].modelType)!}">
                        <#list (temps.temp.children.logoimage.templates[1].imgList) as brandlogo>
                            <li class="Brand_last${(brandlogo_index)+1}">
                                <a data-code="${(temps.temp.children.logoimage.templates[1].modelId)!}-${(brandlogo_index+1)!}" <#if (brandlogo.href)??>target="_blank" href="${(brandlogo.href)!}"<#else>href="javascript:;"</#if> title="" >
                                    <img class="lazyloading" src="//app.gomein.net.cn/images/grey.gif" data-lazy-init="${(brandlogo.src)!}" data-lazy-img="0" <#if (brandlogo.alt)??>alt="${(brandlogo.alt)!}"</#if> height="96" width="232" title=""/>
                                </a>
                            </li>
                        </#list>
                    </ul>
                </#if>

            </div>
        </#if>
    </div>
</#if>



