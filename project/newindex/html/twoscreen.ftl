<#--淘实惠-->
<#if (temps.temp.children.twoscreen)?? >
<#assign tmp=(temps.temp.children.twoscreen)>
<div class="gm_feature edit-mode" style="background: ${(tmp.children.image.state)!};" modelId="${(tmp.modelId)!}" modelType="">
    <div class="f_m wbox">
        <#if (tmp.children.image.imgList)?? && ((tmp.children.image.imgList)?size>0)>
            <div class="wbox extra_img edit-mode" modelId="${(tmp.children.image.modelId)!}" modelType="${(tmp.children.image.modelType)!}">
                <#list (tmp.children.image.imgList) as image>
                    <a <#if (image.href)??>href="${(image.href)!}"</#if> data-code="${(image.modelId)!}-${(image_index+1)!}" target="_blank"><img <#if image_index==0>class="f_extra_l bc_imgl"<#else>class="f_extra_r bc_imgr"</#if> src="${(gomeImgLoad)!}" data-lazy-init="${image.src!}" data-lazy-img="0"/></a>
                </#list>
            </div>
        </#if>
        <#if (tmp.children.tao)??>
            <#assign tao=(tmp.children.tao)>
            <div class="f_m_l">
                <div class="gm_title">
                    <h2>淘 · 实惠</h2><span>BARGAINS</span>
                    <#if (tao.children.topimage.imgList[0])??>
                    <#assign img=(tao.children.topimage.imgList[0])>
                        <a <#if (img.href)??>href="${(img.href)!}" data-code="${(img.modelId)!}" </#if> target="_blank"><img src="${(gomeImgLoad)!}" data-lazy-init="${img.src!}" data-lazy-img="0"/></a>
                    </#if>
                </div>
                <#if (tao.children)??>
                    <div class="f_inner">
                        <#if (tao.children.activity.imgList)?? && ((tao.children.activity.imgList)?size>0)>
                            <#assign activity=(tao.children.activity.imgList)>
                            <#if activity[0]??>
                                <a class="edit-mode" href="${activity[0].href!}" data-code="${activity[0].modelId!}-1" target="_blank" modelId="${(tao.children.activity.modelId)!}" modelType="${(tao.children.activity.modelType)!}">
                                    <img class="lazyloading special"  src="${(gomeImgLoad)!}" data-lazy-init="${activity[0].src!}" data-lazy-img="0" <#if (activity[0].alt)??>alt="${activity[0].alt!}"</#if> title="" width="219" height="419" />
                                </a>
                            </#if>
                            <#if activity[1]??>
                                <a class="edit-mode line_dash" href="${activity[1].href!}" data-code="${activity[1].modelId!}-2" target="_blank" modelId="${(tao.children.activity.modelId)!}" modelType="${(tao.children.activity.modelType)!}" >
                                    <img class="lazyloading img_w199" src="${(gomeImgLoad)!}" data-lazy-init="${activity[1].src!}" data-lazy-img="0" <#if (activity[1].alt)??>alt="${activity[1].alt!}"</#if> title="" width="199" height="209"/>
                                </a>
                            </#if>
                        </#if>
                        <#if (tao.children.qiang.imgList)?? && ((tao.children.qiang.imgList)?size>0)>
                            <div class="pool_data" >
                                <script>var pool1_data={"data":[<#list (tao.children.qiang.imgList) as list>{"href":"${list.href!}","src":"${list.src!}","code":"${(list.modelId)!}-${list_index+1!}","alt":"${list.alt!}",chance:"${list.urlParam!1}"}<#if list_has_next>,</#if></#list>]}</script>
                            </div>
                            <div class="pool edit-mode" modelId="${(tao.children.qiang.modelId)!}" modelType="${(tao.children.qiang.modelType)!}">
                                <#if (tao.children.qiang.imgList[0])??>
                                    <#assign qiang=(tao.children.qiang.imgList[0])>
                                    <a href="${qiang.href!}" data-code="${qiang.modelId!}-1" target="_blank"><img class="lazyloading img_w199" src="${(gomeImgLoad)!}" data-lazy-init="${qiang.src!}" data-lazy-img="0" <#if (qiang.alt)??>alt="${qiang.alt!}"</#if> title="" width="199" height="209"/></a>
                                </#if>
                            </div>
                        </#if>
                    </div>
                </#if>
            </div>
        </#if>
        <#if (tmp.children.Trendy)??>
            <#assign trendy=(tmp.children.Trendy)>
            <div class="f_m_c">
            <div class="gm_title">
                <h2>购 · 新潮</h2><span>FASHION</span>
                <#if (trendy.children.topimage.imgList[0])??>
                    <#assign img=(trendy.children.topimage.imgList[0])>
                    <a <#if (img.href)??>href="${(img.href)!}" data-code="${(img.modelId)!}" </#if> target="_blank"><img src="${(gomeImgLoad)!}" data-lazy-init="${img.src!}" data-lazy-img="0"/></a>
                </#if>
            </div>
            <div class="f_inner">
                    <#if (trendy.children.activity.imgList)?? && ((trendy.children.activity.imgList)?size>0)>
                        <#assign activity=(trendy.children.activity.imgList)>
                        <#if activity[0]??>
                            <a class="edit-mode w195" href="${activity[0].href!}" data-code="${activity[0].modelId!}-1" target="_blank" modelId="${(trendy.children.activity.modelId)!}" modelType="${(trendy.children.activity.modelType)!}">
                                <img class="lazyloading special ml12" src="${(gomeImgLoad)!}" data-lazy-init="${activity[0].src!}" data-lazy-img="0" <#if (activity[0].alt)??>alt="${activity[0].alt!}"</#if> title="" width="219" height="419"/></a>
                        </#if>
                        <#if activity[1]??>
                            <a class="line_dash edit-mode" href="${activity[1].href!}" data-code="${activity[1].modelId!}-2" target="_blank" modelId="${(trendy.children.activity.modelId)!}" modelType="${(trendy.children.activity.modelType)!}">
                                <img class="lazyloading img_w199 ml5" src="${(gomeImgLoad)!}" data-lazy-init="${activity[1].src!}" data-lazy-img="0" <#if (activity[1].alt)??>alt="${activity[1].alt!}"</#if> title="" width="199" height="209"/></a>
                        </#if>
                    </#if>
                    <#if (trendy.children.promotion.imgList)?? && ((trendy.children.promotion.imgList)?size>0)>
                        <div class="pool_data">
                            <script>var pool2_data={"data":[<#list (trendy.children.promotion.imgList) as list>{"href":"${list.href!}","src":"${list.src!}","code":"${(list.modelId)!}-${list_index+1!}","alt":"${list.alt!}",chance:"${list.urlParam!1}"}<#if list_has_next>,</#if></#list>]}</script>
                        </div>
                        <div class="pool edit-mode" modelId="${(trendy.children.promotion.modelId)!}" modelType="${(trendy.children.promotion.modelType)!}">
                            <#if (trendy.children.promotion.imgList[0])??>
                                <#assign promotion=(trendy.children.promotion.imgList[0])>
                                <a href="${promotion.href!}" data-code="${promotion.modelId!}-1" target="_blank"><img class="lazyloading img_w199 ml5" src="${(gomeImgLoad)!}" data-lazy-init="${promotion.src!}" data-lazy-img="0" <#if (promotion.alt)??>alt="${promotion.alt!}"</#if> title="" width="199" height="209"/></a>
                            </#if>
                        </div>
                    </#if>
                </div>
            </div>
        </#if>
        <#if (tmp.children.brand)??>
            <#assign brand=(tmp.children.brand)>
            <div class="f_m_r">
            <div class="gm_title">
                <h2>逛 · 品牌</h2><span>BRANDS</span>
                <#if (brand.children.topimage.imgList[0])??>
                    <#assign img=(brand.children.topimage.imgList[0])>
                    <a <#if (img.href)??>href="${(img.href)!}" data-code="${(img.modelId)!}" </#if> class="brand_img" target="_blank"><img src="${(gomeImgLoad)!}" data-lazy-init="${img.src!}" data-lazy-img="0"/></a>
                </#if>
            </div>
                <div class="f_inner">
                    <div class="f_inner_l edit-mode" modelId="${(brand.children.activity.modelId)!}" modelType="${(brand.children.activity.modelType)!}">
                        <#if (brand.children.activity.imgList)?? && ((brand.children.activity.imgList)?size>0)>
                            <#list (brand.children.activity.imgList) as activity>
                                <a class="line_dash" href="${activity.href!}" data-code="${activity.modelId!}-${(activity_index+1)!}"  target="_blank" ><img class="lazyloading ml12" src="${(gomeImgLoad)!}" data-lazy-init="${activity.src!}" data-lazy-img="0" <#if (activity.alt)??>alt="${activity.alt!}"</#if> title="" width="219" height="209"/></a>
                            </#list>
                        </#if>
                    </div>
                    <div class="f_brands">
                        <div class="f_b_inner edit-mode" modelId="${(brand.children.logimag.modelId)!}" modelType="${(brand.children.logimag.modelType)!}">
                            <#if (brand.children.logimag.imgList)?? && ((brand.children.logimag.imgList)?size>0)>
                                <#list (brand.children.logimag.imgList) as logimag>
                                    <a href="${logimag.href!}" data-code="${logimag.modelId!}-${(logimag_index+1)!}" target="_blank" title="${logimag.title!}" >
                                        <img src="${(gomeImgLoad)!}" data-lazy-init="${logimag.src!}" data-lazy-img="0" <#if (logimag.alt)??>alt="${logimag.alt!}"</#if> width="100" height="30"/></a>
                                </#list>
                            </#if>
                        </div>
                    </div>
                </div>
            </div>
        </#if>
    </div>
</div>
</#if>
<#--领券-->
<#if (temps.temp.children.quanTemp.children)??>
    <#assign quanbox = temps.temp.children.quanTemp.children>
    <div class="quan_out wbox edit-mode" modelId="${(temps.temp.children.quanTemp.modelId)!}" modelType="">
        <div class="mini">
            <#if (quanbox.quancenter.imgList)??>
            <div class="index_fl edit-mode" modelId="${(quanbox.quancenter.modelId)!}" modelType="${(quanbox.quancenter.modelType)!}">
                <a href="${(quanbox.quancenter.imgList[0].href)!}" target="_blank" data-code="${(quanbox.quancenter.modelId)!}-1">
                    <img class="lazyloading" src="${(gomeImgLoad)!}" data-lazy-init="${(quanbox.quancenter.imgList[0].src)!}" data-lazy-img="0" width="122" height="110" />
                </a>
            </div>
            </#if>
            <#if (quanbox.quan.imgList)?? && (quanbox.quan.imgList)?size &gt;0>
                <ul class="index_fl list_out clearfix edit-mode" modelId="${(quanbox.quan.modelId)!}" modelType="${(quanbox.quan.modelType)!}">
                    <#list (quanbox.quan.imgList) as quanitems>
                    <li class="index_fl quan_list num${(quanitems_index)+1}">
                        <a class="" href="${(quanitems.href)!}" target="_blank"  data-code="${(quanbox.quan.modelId)!}-${(quanitems_index)+1}">
                            <img src="${(gomeImgLoad)!}" data-lazy-init="${(quanitems.src)!}" data-lazy-img="0" width="209" height="110" />
                        </a>
                    </li>
                    </#list>
                </ul>
            </#if>
           <#if (quanbox.more.imgList)??>
            <div class="index_fr quan_r edit-mode" modelId="${(quanbox.more.modelId)!}" modelType="${(quanbox.more.modelType)!}">
                <a href="${(quanbox.more.imgList[0].href)!}" target="_blank" data-code="${(quanbox.more.modelId)!}-1">
                    <img class="lazyloading" src="${(gomeImgLoad)!}" data-lazy-init="${(quanbox.more.imgList[0].src)!}" data-lazy-img="0" width="39" height="110" />
                </a>
            </div>
            </#if>
        </div>
    </div>
</#if>
<#--金融-->
<#if (temps.temp.children.finance)??>
<#assign fc=(temps.temp.children.finance)>
<div class="gm_finance wbox edit-mode" modelId="${(fc.modelId)!}" modelType ="">
    <div class="gm_title"><h2>金融</h2><span>FINANCE</span></div>
    <div class="f_c">
        <div class="f_m_l edit-mode" modelId="${(fc.children.financing.modelId)!}" modelType="${(fc.children.financing.modelType)!}">
            <#if (fc.children.textlink.linkList[0])?? >
                <b class="finance_entrance"><a href="${(fc.children.textlink.linkList[0].href)!}" target="_blank"><#if (fc.children.textlink.modelName)??>${(fc.children.textlink.modelName)!}</#if></a><span></span></b>
            </#if>
            <#if (fc.children.financing.imgList[0])?? >
                <#assign finance=(fc.children.financing.imgList[0])>
                <a href="${finance.href!}" data-code="${finance.modelId!}" target="_blank"><img class="lazyloading" src="${(gomeImgLoad)!}" data-lazy-init="${finance.src!}" data-lazy-img="0" <#if (finance.alt)??>alt="${finance.alt!}"</#if> title="" width="420" height="230"/></a>
            </#if>
        </div>
        <div class="f_m_r edit-mode" modelId="${(fc.children.activity.modelId)!}" modelType="${(fc.children.activity.modelType)!}">
            <ul>
                <#if (fc.children.activity.imgList)?? && ((fc.children.activity.imgList)?size>0)>
                    <#list (fc.children.activity.imgList) as activity>
                        <a href="${activity.href!}" data-code="${activity.modelId!}-${(activity_index+1)!}"  <#if activity_index==0>class="w194"</#if>  target="_blank"><img class="lazyloading" src="${(gomeImgLoad)!}" data-lazy-init="${activity.src!}" data-lazy-img="0"  <#if (activity.alt)??>alt="${activity.alt!}"</#if> title="" width="194" height="228"/></a>
                    </#list>
                </#if>
            </ul>
        </div>
    </div>
</div>
<#--金融 结束-->
</#if>
<#--猜你喜欢 开始-->
<div class="wbox gm_guess_js">
    <div class="loading-sync"></div>
</div>
<div class='wbox gm_guess'>
    <div class='gm_title'>
        <h2>猜你喜欢</h2>
        <span>YOU MAY LIKE</span>
        <div class='change_btn'>
            <a class="pre" onselectstart="return false" style="-moz-user-select:none;"></a>
            <a class="nex" onselectstart="return false" style="-moz-user-select:none;"></a>
        </div>
    </div>
    <div class='guess_main' id="guess_main">
        <div id="j-imgload-recomm">
        </div>
    </div>
</div>
<#--猜你喜欢 结束-->

<#--融合-热门话题 开始-->
<div class="pluspc_template" data-template="index_hot_topic" style="height: 0; overflow: hidden;"></div>
<#--融合-热门话题 结束-->