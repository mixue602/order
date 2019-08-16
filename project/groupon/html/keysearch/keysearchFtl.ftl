<h1  class="hide">国美-真划算搜索结果页-<#if (model.goodsItem.searKey)??>${(model.goodsItem.searKey)!}</#if></h1>
<div class="keysearch_result">
    <div class="result_box">
        <#if (model.goodsItem.pageInfo)??>
            找到“
            <span class="keysearch_keyword">${(model.goodsItem.searKey)!}</span>
            ”相关的真划算
            <span class="keysearch_amount">
                    ${(model.goodsItem.pageInfo.totalRec)!}
            </span>
            个
        <#if model.goodsItem.pageInfo.totalPage &gt; 1>
            <input type="hidden" id="J_isEmptyGroup" value="true" />
        </#if>
        <#else>
            抱歉没有找到与“<span class="keysearch_keyword">${(model.goodsItem.searKey)!}</span>”相关的真划算商品
            <input type="hidden" id="J_isEmptyGroup" value="false" />
        </#if>
    </div>
</div>
<div class="keysearch_product clearfix">
    <div class="product_content">
        <#if (model.goodsItem.pageInfo)??>
        <#else>
            <p class="youlike">根据浏览猜你喜欢</p>
        </#if>
        <div class="product_waiting" id="product_waiting">
            <span class="loading">
                <img src="//app.gomein.net.cn/images/grey.gif" gome-src="//img.gomein.net.cn/gmlib/ui/loading/2.0.0/loading.gif">
            </span>
        </div>
        <ul id="J_goodsList">
            <#if (model.goodsItem.data)?? && (model.goodsItem.data)?size &gt; 0>
                <#list model.goodsItem.data as goodItem>
                    <li modelid="8000060001" itemid="${goodItem.itemId!}">
                        <div class="prod_img">
                            <a class="item_link" data-code="8000060001-${(goodItem_index+1)!}_1_1" href="${goodItem.url!}" target="_blank" title="${goodItem.title!}">
                                <span class="status_img"></span>
                                <img src="//app.gomein.net.cn/images/grey.gif" gome-src="${goodItem.imgUrl!}_260.jpg" alt="${goodItem.title!}" width="260" height="260">
                            </a>
                        </div>
                        <div class="prod_info">
                            <span style="display:none">国美自营</span>
                            <a class="item_link" data-code="8000060001-${(goodItem_index+1)!}_2_1" href="${goodItem.url!}" target="_blank" title="${goodItem.title!}">${goodItem.title!}</a>
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
                                <a data-code="8000060001-${(goodItem_index+1)!}_3_1" href="${goodItem.url!}" target="_blank">立即抢购</a>
                            </div>
                        </div>
                    </li>
                </#list>
            </#if>
        </ul>
        <#if (model.goodsItem.pageInfo)?? && (model.goodsItem.pageInfo.totalPage) &gt; 1>
            <div class="pager clearfix" data-curpage="${model.goodsItem.pageInfo.currentPage!}" data-totalpage="${model.goodsItem.pageInfo.totalPage!}" data-pagesize="${model.goodsItem.pageInfo.pageSize!}"></div>
        </#if>
    </div>
</div>