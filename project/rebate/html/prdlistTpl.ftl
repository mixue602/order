<#--商品列表-->
<script id="prdlistTpl" type="text/html">
    {{each dto}}
    <li>
        <div class="choice_inner">
            <a href="{{$value.sUrl}}" target="_blank" data-code="rebate0{{$index}}" title="{{#$value.name}}">
                <img class="lazyloading" src="{{$value.sImg}}_260.jpg" alt="{{$value.alt}}" width="260" height="260"/>
            </a>
            <a href="{{$value.sUrl}}" target="_blank" data-code="rebate0{{$index}}" title="{{#$value.name}}"><p class="img_name">{{#$value.name}}</p></a>
            <div class="hot_price" data-target="p-price"  data-skuId="{{$value.skuId}}">
                <span>¥</span><i class="minPrice"></i>
            </div>
            <div class="rebate">
                <span>返利</span>
                <a>最高返
                {{if ($value.rebate != '0.00')}}
                    <i>{{$value.rebate}}</i>
                {{else}}
                    <i>{{$value.sharerebate}}</i>
                {{/if}}
                国美币</a>
            </div>
        </div>
    </li>
    {{/each}}
</script>

<#--商品列表-->
<script id="rebateTpl" type="text/html">
    {{each dto}}
    <li>
        <div class="choice_inner">
            <a href="{{$value.good.detailHref}}" target="_blank" data-code="{{$value.good.productId}}-{{$value.good.skuId}}" title="{{$value.good.goodsName}}">
                {{if ($value.good.goodsImgUrls) && ($value.good.goodsImgUrls[0])}}
                <img class="lazyloading" src="{{($value.good.goodsImgUrls[0])}}" alt="{{$value.good.goodsName}}" width="260" height="260"/>
                {{else}}
                <img class="lazyloading" src="" alt="{{$value.good.goodsName}}" width="260" height="260"/>
                {{/if}}
            </a>
            <a href="{{$value.good.detailHref}}" target="_blank" data-code="{{$value.good.productId}}-{{$value.good.skuId}}" title="{{$value.good.goodsName}}"><p class="img_name">{{$value.good.goodsName}}</p></a>
            <div class="hot_price" data-target="p-price"  data-skuId="{{$value.good.skuId}}">
                <span>¥</span><i class="minPrice"></i>
            </div>
            <div class="rebate">
                <span>返利</span>
                <a>最高返
                {{if ($value.ma.rebate != '0.00')}}
                    <i>{{$value.ma.rebate}}</i>
                {{else}}
                    <i>{{$value.ma.sharerebate}}</i>
                {{/if}}
                国美币</a>
            </div>
        </div>
    </li>
    {{/each}}
</script>