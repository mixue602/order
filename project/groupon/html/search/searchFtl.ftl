<div class="group_search">
    <#assign categoryNo=""/>
    <#assign categoryName=""/>
    <div class="search_category clearfix w1200">
    <#if model.categorys?? && model.categorys?size &gt; 0>
        <ul>
            <#list model.categorys as category>
            <#if category.selected?? && category.selected == true>
            <#assign categoryNo=category.categoryNo/>
            <#assign categoryName=category.name/>
                <li class="cur">
            <#else>
                <li class="">
            </#if>
                    <a data-code="8000050001-${(category_index+1)!}" href="${(category.url)!}" >${(category.name)!}</a>
                </li>
            </#list>
        </ul>
    </#if>
    </div>
    <h1 class="hide">${categoryName!}团购</h1>
    <div class="search_crumbs w1200" categoryno="${categoryNo}" <#if model.goodsItem?? && model.goodsItem.pageInfo??>currentpage="${(model.goodsItem.pageInfo.currentPage)!}" sorttype="${(model.goodsItem.pageInfo.sortType)!}" begin="${(model.goodsItem.pageInfo.begin)!}" pagesize="${(model.goodsItem.pageInfo.pageSize)!}" totalpage="${(model.goodsItem.pageInfo.totalPage)!}" totalRec="${(model.goodsItem.pageInfo.totalRec)!}"</#if>>
        <#if model.goodsItem?? && model.goodsItem.pageInfo?? && model.goodsItem.pageInfo.sortType??>
        <#assign sortType=model.goodsItem.pageInfo.sortType/>
        <#assign begin=model.goodsItem.pageInfo.begin/>
            <ul class="search_crumbs_left">
                <li class="cur" sort="0" begin="0">默认<i></i></li>
                <li sort="3">销量<i></i></li>
                <li sort="4">价格<i></i></li>
            </ul>
            <div class="line">|</div>
            <ul class="search_crumbs_right">
                <li begin="1">今日上新</li>
                <li begin="2">即将开团</li>
            </ul>
        </#if>
    </div>
    <div class="search_products w1200">
        <div class="product_waiting" id="product_waiting">
            <span class="loading">
                <img src="//app.gomein.net.cn/images/grey.gif" gome-src="//img.gomein.net.cn/gmlib/ui/loading/2.0.0/loading.gif">
            </span>
        </div>
        <ul>
        <#if model.goodsItem?? && model.goodsItem.data?? && model.goodsItem.data?size &gt; 0>
            <#list model.goodsItem.data as goodItem>
                <li itemid="${goodItem.itemId!}" modelid="8000050002">
                    <div class="prod_img">
                        <a class="item_link" data-code="8000050002-${(goodItem_index+1)!}_1_1" href="${goodItem.url!}" target="_blank" title="${goodItem.title!}">
                            <span class="status_img"></span>
                            <img src="//app.gomein.net.cn/images/grey.gif" gome-src="${goodItem.imgUrl!}_260.jpg" alt="${goodItem.title!}" width="260" height="260">
                        </a>
                    </div>
                    <div class="prod_info">
                        <span style="display:none">国美自营</span>
                        <a class="item_link" data-code="8000050002-${(goodItem_index+1)!}_2_1" href="${goodItem.url!}" target="_blank" title="${goodItem.title!}">${goodItem.title!}</a>
                    </div>
                    <div class="prod_price">
                        <div class="prod_price_left">
                            <p class="price">¥<span class="priceNum">0</span><del class="cost"></del></p>
                            <p class="num">
                                <span class="sale">已售<span>100</span>%</span>
                                <span class="percent"><span></span></span>
                            </p>
                        </div>
                        <div class="prod_price_right">
                            <a data-code="8000050002-${(goodItem_index+1)!}_3_1" href="${goodItem.url!}" target="_blank">立即抢购</a>
                        </div>
                    </div>
                </li>
            </#list>
        <#else>
                <li class="error-tips">该条件下暂无商品，去试试其他条件吧</li>
        </#if>
        </ul>
    </div>
    <#if model.goodsItem?? && model.goodsItem.pageInfo?? && model.goodsItem.pageInfo.totalPage?? && model.goodsItem.pageInfo.totalPage &gt; 1>
        <div class="search_pager w1200">
            <div class="pager" id="pager"></div>
        </div>
    </#if>
</div>