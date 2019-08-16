<h1 class="hide">国美-真划算抢购页</h1>
<div class="page_title w1200"></div>
<#assign currentindex=0 />
<div class="w1200 clearfix">
    <ul class="nav_ul">
        <#if model.times?? && model.times?size &gt; 0>
          <#list model.times as timeItem>
              <#if timeItem.current??>
                  <#assign currentindex=timeItem_index />
              </#if>
              <li modelid="8000020${(timeItem_index+1)!}00" rank="${(timeItem.timeCode)!}" <#if timeItem.current>class="nav_hover current"</#if>>
                  <em>${(timeItem.content)!}</em>
                  <#if timeItem.current==true>
                    <p>
                      <span class="end">距离结束</span>
                      <span class="timeInfo">00:00:00</span>
                    </p>
                  <#else>
                    <p class="timeStatus">${timeItem.description!}</p>
                  </#if>
                  <#if timeItem.current?? && (timeItem.endTime)?? >
                    <input type="hidden" id="timeCurrent" value="${timeItem.currTime!}"/>
                    <input type="hidden" id="timeEnding" value="${timeItem.endTime!}"/>
                  </#if>
              </li>
          </#list>
        </#if>
    </ul>
</div>
<div class="main mOfh">
    <div class="main_con w1200">
    <#list model.times as timeItem>
        <#if timeItem.current==true>
        <ul class="default_ul clickAgo">
            <#if model.goods?? && model.goods?size &gt; 0>
                <#list model.goods as goodsItem>
                  <li data-code="8000020${(currentindex+1)!}00-${(goodsItem_index+1)!}-1" class="nor <#if goodsItem_index==0 && goodsItem.extend=='1'>super<#else>normal</#if>" itemid="${(goodsItem.itemId)!}">
                    <a class="mi_img" href="${(goodsItem.url)!}" target="_blank" title="${(goodsItem.name)!}">
                      <img src="" width="290" height="290" alt="${(goodsItem.name)!}">
                    </a>
                    <h2 class="mi_title">
                      <a class="mi_name" data-code="8000020${(currentindex+1)!}00-${(goodsItem_index+1)!}-2" href="${goodsItem.url!}" title="${(goodsItem.name)!}" target="_blank">
                        ${(goodsItem.name)!}
                      </a>
                    </h2>
                    <div class="mi_content">
                      <div class="mi_left">
                        <div class="mi_price">
                          <span></span>
                        </div>
                        <div class="mi_num">
                        </div>
                      </div>
                      <div class="mi_right">
                        <a class="lijg_btn" href="" target="_blank" data-code="8000020${(currentindex+1)!}00-${(goodsItem_index+1)!}-3"></a>
                      </div>
                    </div>
                  </li>
                </#list>
            </#if>
        </ul>
        <#else>
        <ul></ul>
        </#if>
      </#list>
    </div>
    <div class="mt_bc w1200">
      <h2>商品分类</h2>
    </div>
    <div class="categorys clearfix">
      <ul class="category_ul">
        <#if model.categorys?? && model.categorys?size &gt; 0>
          <#list model.categorys as categoryItem>
            <#if categoryItem.selected?? && categoryItem.selected=true>
              <#assign isSelected = "cur"/>
            <#else>
              <#assign isSelected = ""/>
            </#if>
            <li data-cateid="${(categoryItem.categoryNo)!}" class="${isSelected}">
              <h3>
                <a href="${(categoryItem.url)!}" target="_blank">${(categoryItem.name)!}</a>
              </h3>
            </li>
          </#list>
        </#if>
      </ul>
    </div>
    <div class="mt_bc w1200">
      <h2>
        <#if (model.tomoName)?? && model.tomoName?length &gt; 12>
          ${model.tomoName?substring(0,12)!}
        <#else>
          ${(model.tomoName)!}
        </#if>
      </h2>
    </div>
    <div class="mb_cont mOfh">
      <ul class="mb_presell clearfix">
        <#if model.tomorrow?? && model.tomorrow?size &gt; 0>
          <#list model.tomorrow as tomoItem>
            <li>
              <a data-code="8000020001-${(tomoItem_index+1)!}-1" href="${tomoItem.url!}" target="_blank" title="${tomoItem.name!}" class="mpel_img">
                <img src="//app.gomein.net.cn/images/grey.gif" gome-src="${tomoItem.imgUrl!}_360.jpg" alt="${tomoItem.name!}" />
              </a>
              <div class="mprel_right">
                <h2 class="mpel_tle">
                  <a data-code="8000020001-${(tomoItem_index+1)!}-2" href="${tomoItem.url!}" title="${tomoItem.name!}" target="_blank">${tomoItem.name!}
                  </a>
                </h2>
                <div class="mpel_pric">
                  <div class="mpr_sal">
                    ¥ <span>${tomoItem.rushPrice!}</span>
                  </div>
                  <div class="mpr_num">
                    <span>
                      <a href="javascript:;" data-itemid="${tomoItem.itemId!}"></a>
                      <span>${tomoItem.wantBuy!}</span> 人
                    </span>想买
                  </div>
                </div>
                <div class="mpel_new">活动即将开始，敬请关注！</div>
              </div>
            </li>
          </#list>
        </#if>
      </ul>
    </div>
    <div class="mt_bc w1200 hide">
      <h2>
        <#if model.privilegeName?? && model.privilegeName?length &gt; 12>
          ${(model.privilegeName?substring(0,12))!}
        <#else>
          ${(model.privilegeName)!}
        </#if>
      </h2>
    </div>
    <div class="mb_cont mOfh mprv w1200 hide">
      <div class="mprv_one">
        <#if model.leftOne?? && model.leftOne?size &gt; 0>
          <a data-code="8000020002-1" href="${model.leftOne.url!}" target="_blank" title="${model.leftOne.description!}">
            <img class="zyh_one" src="//app.gomein.net.cn/images/grey.gif" gome-src="${model.leftOne.imgUrl!}" alt="${model.leftOne.description!}" />
          </a>
        </#if>
      </div>
      <div class="mprv_one">
        <#if model.leftTwo?? && model.leftTwo?size &gt; 0>
          <#list model.leftTwo as leftTwoItem>
            <a data-code="8000020003-${(leftTwoItem_index+1)}" href="${leftTwoItem.url!}" target="_blank" title="${leftTwoItem.description!}">
              <img class="zyh_two" src="//app.gomein.net.cn/images/grey.gif" gome-src="${leftTwoItem.imgUrl!}" alt="${leftTwoItem.description!}" />
            </a>
          </#list>
        </#if>
      </div>
      <div class="mprv_one mpv_fou">
        <#if model.rightOne?? && model.rightOne?size &gt; 0>
          <a data-code="8000020004-1" href="${model.rightOne.url!}" target="_blank" title="${model.rightOne.description!}">
            <img class="zyh_three" src="//app.gomein.net.cn/images/grey.gif" gome-src="${model.rightOne.imgUrl!}" alt="${model.rightOne.description!}" />
          </a>
        </#if>
      </div>
      <div class="mprv_one mpv_fou">
        <#if model.rightTwo?? && model.rightTwo?size &gt; 0>
          <#list model.rightTwo as rightTwoItem>
            <a data-code="8000020005-${(rightTwoItem_index+1)}" href="${rightTwoItem.url!}" target="_blank" title="${rightTwoItem.description!}">
              <img class="zyh_four" src="//app.gomein.net.cn/images/grey.gif" gome-src="${rightTwoItem.imgUrl!}" alt="${rightTwoItem.description!}" />
            </a>
          </#list>
        </#if>
      </div>
    </div>
    <ul class="across mOfh">
    </ul>
</div>
