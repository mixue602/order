<div class="focus edit-mode" modelType="${(children.head.children.focus.modelType)!}" modelId="${(children.head.children.focus.modelId)!}">
<#if (children.head.children.focus.imgList)?? && ((children.head.children.focus.imgList)?size>0)>
    <ul class="focus_box">
        <#list (children.head.children.focus.imgList) as list>
            <li <#if list_index==0>style="display: block;"</#if> >
                <a data-code="${(list.modelId)!}-${list_index+1}" <#if (list.href)??>href="${(list.href)!}"</#if> target="_blank" ><img class="lazyloading" src="${(gomeImgLoad)!}"  data-lazy-init="${list.src!}" data-lazy-img="0"  alt="${list.alt!}"  title="" width="1920" height="410" /></a>
            </li>
        </#list>
    </ul>
</#if>
<#if (children.head.children.focus.imgList)?? && ((children.head.children.focus.imgList)?size>1)>
    <ol class="nav">
        <#list (children.head.children.focus.imgList) as list>
            <li  <#if list_index==0>class="cur"</#if> ></li>
        </#list>
    </ol>
    <div class="slider_page">
        <div class="btns pre" onselectstart="return false" style="-moz-user-select:none;"><span class='btnbg'></span><p class='go_l' id="go_l"></p></div>
        <div class="btns nex" onselectstart="return false" style="-moz-user-select:none;"><span class='btnbg'></span><p class="go_r" id="go_r"></p></div>
    </div>
</#if>
</div>
<#if (children.fanli.templates)?? && ((children.fanli.templates)?size>0)>
<div class="wbox choice">
    <div class="choice_title">
        <ul>
          <#list (children.fanli.templates) as list>
                <li <#if list_index==0>class="cur"</#if> data="<#if (list.children.product.prdList)?? && ((list.children.product.prdList)?size>0)><#list (list.children.product.prdList) as item>${item.productId!}_${item.skuId!}<#if item_has_next>,</#if></#list></#if>">${(list.modelName!)}</li>
            </#list>
        </ul>
    </div>
    <div class="choice_main">
        <#list (children.fanli.templates) as item>
            <ul  <#if item_index==0>style="display: block"</#if> tab-data-load="0">
            <#if (item.children.product.prdList)?? && ((item.children.product.prdList)?size>0)>
            <#list (item.children.product.prdList) as list>
            <li>
                <div class="choice_inner">
                        <a <#if (list.detailHref)??>href="${(list.detailHref)!}" target="_blank"</#if> data-code="${(item.modelId!)}-${list_index+1}" title="${(list.name)!}">
                            <img class="lazyloading" src="${(gomeImgLoad)!}" <#if list.manualImg?? > data-lazy-init="${(list.manualImg)!}" <#else> data-lazy-init="${(list.goodsImgs[0].src)!}_210.jpg" </#if> data-lazy-img="0" alt="${(list.alt)!}" title="${(list.name)!}"  width="210" height="210"/>
                        </a>
                            <a <#if (list.detailHref)??>href="${(list.detailHref)!}" target="_blank"</#if> data-code="${(item.modelId!)}-${list_index+1}" title="${(list.name)!}"><p class="img_name">${(list.name)!}</p></a>
                        <div class="hot_price" data-target="p-price"  data-skuId="${(list.skuId)!}">
                            <span>¥</span><i class="minPrice"></i>
                            <#--<span>¥</span><i class="minPrice"><@FormatPrice.priceFormat curprice=list.price/></i>-->
                        </div>
                    <div class="rebate">
                        <span>返利</span>
                        <a>最高返<i class="rebate_money"></i>国美币</a>
                    </div>
                </div>
            </li>
            </#list>
            </#if>
            </ul>
        </#list>

    </div>
</div>
</#if>

<div class="wbox rebate_goods">
    <div class="title_wrap">
        <div class="rebate_title">
            <ul>
                <li class="cur" data="0">综合</li>
                <li data="10">销量</li>
                <li data="1"  class="rebateprice">价格<span class="up"></span></li>
                <li data="40">返利</li>
            </ul>
            <div class="search">
                <div class="searchbox">
                    <form  onsubmit="return false;">
                        <label id="keyLabel_a"></label>
                        <input type="text" id="searchInput_a"  value="" autocomplete="off">
                        <a class="search-qd js_wineSearch">搜索</a>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="rebate_main">
        <ul tab-data-load="0" style="display: block">
            <#--<li>
                <div class="choice_inner">
                    <a href="#" target="_blank" data-code="" title="">
                        <img class="lazyloading" src="http://gfs14.gomein.net.cn/T1jkCvBXKg1RCvBVdK.jpg" data-lazy-init="" data-lazy-img="0" alt="" title=""  width="260" height="260"/>
                    </a>
                    <a href="#" target="_blank" data-code="" title=""><p class="img_name">小米红米 4X 全网通版32GB香槟 通电信4G手机小米 全新红米4X！5英寸屏幕，4100毫安大电池长续航 全新红米4X！5</p></a>
                    <div class="hot_price">
                        <span>¥</span><i class="minPrice">899.00</i>
                    </div>
                    <div class="rebate">
                        <span>返利</span>
                        <a>最高返<i>0.5</i>国美币</a>
                    </div>
                </div>
            </li>-->
        </ul>
        <ul tab-data-load="0"></ul>
        <ul tab-data-load="0"></ul>
        <ul tab-data-load="0"></ul>
    </div>
</div>