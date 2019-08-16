<h1 class="hide">国美团购网站</h1>
<div class="group_slider">
    <div class="group_base">
    <#if model.mainAds?? && model.mainAds?size &gt; 0>
        <ul class="group_list">
        <#assign count=0 />
        <#list model.mainAds as mainAds>
            <#if mainAds_index==0>
                <li style="background:${(mainAds.description)!};display:item-block" class="group${(mainAds_index)+1!}">
                    <a data-code="8000010002-${(mainAds_index+1)!}" target="_blank" href="${(mainAds.url)!}">
                        <img src="${(mainAds.imgUrl)!}" alt="${(mainAds.name)!}" width="900" height="400">
                    </a>
                </li>
            <#else>
                <li style="background:${(mainAds.description)!};display:none;" class="group${(mainAds_index)+1!}">
                    <a data-code="8000010002-${(mainAds_index+1)!}" target="_blank" href="${(mainAds.url)!}">
                        <img src="//app.gomein.net.cn/images/grey.gif" data-src="${(mainAds.imgUrl)!}" alt="${(mainAds.name)!}" width="900" height="400">
                    </a>
                </li>
            </#if>
            <#assign count=count+1 />
            <#if count == 5> <#break> </#if>
        </#list>
        </ul>
        <ul class="slider_tab">
        <#assign count=0 />
        <#if model.mainAds?? && model.mainAds?size &gt; 1>
        <#list model.mainAds as mainAds>
            <#if mainAds_index==0>
            <li class="slider_text cur" id="group${(mainAds_index)+1!}">
            <#else>
            <li class="slider_text" id="group${(mainAds_index)+1!}">
            </#if>
                <span class="bg">${(mainAds_index)+1!}</span>
            <#assign count=count+1 />
            </li>
            <#if count == 5> <#break> </#if>
        </#list>
        </#if>
        </ul>
    </#if>
    </div>
    <div class="group_roof">
        <#if model.rushGoods?? && model.rushGoods?size &gt; 0>
            <div class="roof_slider clearfix">
            <#list model.rushGoods as rushGood>
                <div class="roof_slider_list" data-itemid="${rushGood.name!}">
                    <div class="roof_timer">
                        <h2>限时抢购</h2>
                        <div>
                            <i>00</i><i>00</i><i>00</i><i>00</i>
                        </div>
                    </div>
                    <a data-code="8000010003-${(rushGood_index+1)!}" href="${(rushGood.url)!}" target="_blank" title="${(rushGood.description)!}">
                        <img class="gray_a_img" src="//app.gomein.net.cn/images/grey.gif" gome-src="${(rushGood.imgUrl)!}" alt="${(rushGood.description)!}" width="300" height="360">
                    </a>
                    <div class="gray_img gray_status"></div>
                </div>
            </#list>
            </div>
        </#if>
    </div>
</div>
<div class="group_box">
    <div class="group_content">
        <#if model.slaveAds?? && model.slaveAds?size &gt; 0>
            <ul class="group_slave clearfix">
            <#list model.slaveAds as slave>
                <li>
                    <a data-code="8000010004-${(slave_index+1)!}" href="${(slave.url)!}" target="_blank" title="${(slave.name)!}">
                        <img src="${(slave.imgUrl)!}" alt="${(slave.name)!}" width="390" height="200">
                    </a>
                </li>
            </#list>
            </ul>
        </#if>
        <div class="pluspc_template group-topic" data-template="groupon_topic" style="height:0;overflow:hidden;"></div>
        <div class="group_brand clearfix">
            <h2>${(model.brandName)!}</h2>
            <#if model.brands?? && model.brands?size &gt; 0>
                <ul class="brand_goods">
                <#list model.brands as brand>
                    <li>
                        <a data-code="8000010005-${(brand_index+1)!}" rel="nofollow" href="${(brand.url)!}" target="_blank" title="${(brand.name)!}">
                        <#if brand_index<2>
                            <img src="${(brand.imgUrl)!}" alt="${(brand.name)!}" width="590" height="330">
                        <#else>
                            <img src="//app.gomein.net.cn/images/grey.gif" gome-src="${(brand.imgUrl)!}" alt="${(brand.name)!}" width="590" height="330">
                        </#if>
                        </a>
                    </li>
                </#list>
                </ul>
            </#if>
        </div>
        <div class="group_classify">
            <div class="classify_title">
                <#if model.categorys?? && model.categorys?size &gt; 0 >
                    <a class="classify_more" href="${config.indexDomain!}/groupon/${model.categorys[0].categoryNo!}.html" target="_blank">更多商品分类  <em>  ></em></a>
                </#if>
                <h2>${(model.itemFloorName)!}</h2>
                <ul class="classify_tab">
                    <#if model.goodsTab?? && model.goodsTab?size &gt; 0>
                        <#list model.goodsTab as goodTab>
                            <#if goodTab_index==0>
                            <li modelid="8000010${(goodTab_index+1)!}00" class="group_products_list_${goodTab_index+1} cur first" data-index="${goodTab.description!}">
                            <#else>
                            <li modelid="8000010${(goodTab_index+1)!}00" class="group_products_list_${goodTab_index+1}" data-index="${goodTab.description!}">
                            </#if>
                                <a href="javascript:void(0)" rel="nofollow"><span>${goodTab.name!}</span></a>
                            </li>
                        </#list>
                    </#if>
                </ul>
            </div>
            <div class="classify_product clearfix">
                <div class="group_pd_listfirst">
                    <#if (model.featuredGoods)?? && (model.featuredGoods?size &gt; 0)></#if>
                    <ul class="">
                        <#list (model.featuredGoods) as goodsitem>
                            <li class="buying" data-itemId="${(goodsitem.itemId)!}">
                                <div class="prod_img">
                                    <a data-code="${(goodsitem.itemId)!}-1_${(goodsitem_index)+1}" href="${(goodsitem.url)!}" target="_blank" title="${(goodsitem.name)!}">
                                        <img src="//app.gomein.net.cn/images/grey.gif" gome-src="${(goodsitem.imgUrl)!}_260.jpg" alt="${(goodsitem.name)!}" width="260" height="260">
                                    </a></div>
                                    <div class="prod_info">
                                    <span class="gomepdtip" style="display:none">国美自营</span>
                                    <a class="prod_name" data-code="${(goodsitem.itemId)!}-1_${(goodsitem_index)+1}" href="${(goodsitem.url)!}" target="_blank" title="${(goodsitem.name)!}">${(goodsitem.name)!}</a>
                                </div>
                                <div class="prod_price">
                                    <div class="prod_left">
                                        <p class="price"><span class="now">¥</span><del class="cost"></del></p>
                                        <p class="count"><span class="precent">已售31%</span><span class="sale"><span style="width:31px"></span></span></p>
                                    </div>
                                    <div class="prod_right"><a data-code="${(goodsitem.itemId)!}-1_${(goodsitem_index)+1}" href="${(goodsitem.url)!}" target="_blank" style="cursor:default">立即抢购</a></div>
                                </div>
                                <div class="gray_img"></div>
                            </li>
                        </#list>
                    </ul>
                </div>
                <#if model.goodsTab?? && model.goodsTab?size &gt; 0>
                    <ul class="group_products_list" style="display:none"></ul>
                </#if>
            </div>
        </div>
        <div class="group_footads clearfix">
            <#if model.footAds?? && model.footAds?size &gt; 0>
                <ul>
                    <#list model.footAds as footItem>
                        <li>
                            <a data-code="8000010007-${(footItem_index+1)!}" rel="nofollow" href="${(footItem.url)!}" title="${(footItem.name)!}" target="_blank">
                                <img src="//app.gomein.net.cn/images/grey.gif" gome-src="${(footItem.imgUrl)!}" alt="${(footItem.name)!}" width="293" height="200">
                            </a>
                        </li>
                    </#list>
                </ul>
            </#if>
        </div>
    </div>
</div>
