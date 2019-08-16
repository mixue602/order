<#if model?? && model.itemDetailInfo??>
    <#if model.itemDetailInfo.itemType =='1'>
        <#assign itemTypes="团购">
    <#else>
        <#assign itemTypes="抢购">
    </#if>
</#if>

<#--navBegin-->
<div class="wbox">
    <div class="gr-crumb js-posi">
        <a href="${config.staSite!}">首页</a>&nbsp;&gt;&nbsp;
        <a href="${config.indexDomain!}"> 真划算</a>&nbsp;&gt;&nbsp;
       <#if model?? && model.itemDetailInfo?? && model.itemDetailInfo.categoryId??  && model.itemDetailInfo.categoryId !=""><a href="${config.indexDomain!}/groupon/${model.itemDetailInfo.categoryId!}.html">${model.itemDetailInfo.categoryName!}</a>&nbsp;&gt;&nbsp;</#if> ${model.itemDetailInfo.itemName!}${model.itemDetailInfo.itemDesc!}
    </div>
</div>
<#--焦点图begin-->
<div class="wbox bgwh clearfix">
    <div class="gr-prd-images">
        <div class="gr-prd-images">
            <div class="magnifier">
                <div class="pic-big">
                    <div class="jqzoom">
                    <#if model?? && model.pictures?? && model.pictures?size &gt; 0>
                        <#list model.pictures as item>
                            <#if item_index == 0>
                            <img class="j-bpic-b" width="360" height="360" jqimg="${item.url!}_800_pc.jpg" src="${item.url!}_360.jpg" alt=""/>
                            </#if>
                        </#list>
                    </#if>
                    </div>
                </div>
                <div class="pic-list j-listroll">
                    <div class="pic-small j-gRbox j-pichover">
                        <ul>
                        <#if model?? && model.pictures?? && model.pictures?size &gt; 0>
                            <#list model.pictures as item>
                                <li class="gr-pic-li">
                                    <a href="javascript:;">
                                        <img rpic="${item.url!}_800_pc.jpg" bpic="${item.url!}_360.jpg" src="${item.url!}_50.jpg" height="50" width="50" alt="${model.itemDetailInfo.itemName?js_string!}${model.itemDetailInfo.itemDesc?js_string!}图${item_index+1!}">
                                    </a>
                                </li>
                            </#list>
                        </#if>
                        </ul>
                    </div>
                    <a class="spic-prev" href="javascript:;"></a>
                    <a class="spic-next" href="javascript:;"></a>
                </div>
            </div>
        </div>
    </div>
    <!--无版本时加上class: detail-no-version-->
    <div class="grd-sell-detail ">
        <h1 class="grdsd-tit">
        <#if model.itemDetailInfo.gomePrd!>
            <em class="d_important-notice">国美自营</em>
        </#if>
        ${model.itemDetailInfo.itemName!}${model.itemDetailInfo.itemDesc!}
        </h1>
        <#if (model.itemDetailInfo.startTime)??>
        <span class="hide">${(model.itemDetailInfo.startTime)!}</span>
        </#if>
        <div class="grd-city clearfix">
            <div class="grdLeft">送&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;至：</div>
            <div class="grdRight city">
                <span id="address" class="regon">
                <a id="stockaddress" href="javascript:;"></a>
                <i></i>
                <span class="space"></span>
            </span>
                <span class="prdstock">有货</span>
                <div class="gCity clearfix"></div>
            </div>
            <div class="delivery" id="groupDelivery"></div>
        </div>
        <p class="arrive-time"></p>
        <!--版本颜色-->
            <div id="tuanVersionControl">
            <ul class="salesProperty" id="salesProperty">
            <#if model?? && model.salePropers?? && (model.salePropers?size &gt; 0) >
            <#list model.salePropers as versionName>
            <#if versionName.salesNameNo??>
            <#assign salesNameNo = versionName.salesNameNo>
            </#if>
            <li class="prdother clearfix <#if versionName.booleanMainsale?? && versionName.booleanMainsale != 'true'>nozhu</#if>" <#if versionName.booleanMainsale?? && versionName.booleanMainsale == "true">id="booleanMainsale"</#if>>
            <div class="prdLeft">${versionName.chinesename!}：</div>
                <div class="prdRight">
                    <#if model?? && model.skuPropers??>
                    <#list model.skuPropers[salesNameNo] as versionContent>
                        <#if versionContent.src?? && versionContent.src!="">
                            <div class="prdcol prd-img-item">
                                <a href="javascript:;" class="<#if versionContent.target?? && versionContent.target=="curr">select<#else>novison</#if>" title="${versionContent.value!}" alt="${versionContent.alt!}">
                                    <img src="${versionContent.src!}_60.jpg" alt="${versionContent.value!}" />
                                    <span>${versionContent.value!}</span>
                                    <i class=""></i>
                                </a>
                            </div>
                        <#else>
                            <div class="prdmod">
                                <a href="javascript:;" class="<#if versionContent.target?? && versionContent.target=="curr">select<#else>novison</#if>" title="${versionContent.value!}" alt="${versionContent.alt!}">
                                ${versionContent.value!}
                                    <i class=""></i>
                                </a>
                            </div>
                        </#if>
                    </#list>
                    </#if>
            </li>
            </#list>
            </#if>
            </ul>
            </div>

        <div class="item-purch grd-purch clearfix">
            <div class="grd-nstate">
                <a class='grd-gogb' data-type="${model.itemDetailInfo.itemType!}">马上抢</a>
            </div>
            <p class="cur-price">
                <span class="yuan">¥</span><span id="salePrice" class="price-44">
            <#if model.itemDetailInfo.groupPrice??>
            ${model.itemDetailInfo.groupPrice!}
            <#else>
                0.00
            </#if>
            </span>
            </p>
            <div class="old-price">
                <p class="purch-minor-text"><del>¥<span id="listPrice"></span></del></p>
                <a class="compare-link" rel="nofollow" target="_blank" href="${config.itemSite!}/${model.itemDetailInfo.productId!}-${model.itemDetailInfo.skuId!}.html">对比原商品<span class="simsun">&gt;&gt;</span></a>
            </div>
        </div>
        <div class="grd-countdown">
            <p class="grd-sales"></p>
            <div class="cdown" id="msCountdown">
            </div>
        </div>
        <div class="grd-other-op clearfix">
           <#-- 
            <div class="grd-share-op">
                <span class="share-op-tit" style="cursor:pointer;">一键分享拿提成<i class="ico-smon"></i></span>
            </div>
            -->
            <div class="grd-insite-op">
                <a class="addtofav" >加入真划算收藏<i class="ico-saddfav"></i></a>
                <a class="addtowish" id="showWish">向好友提出心愿<i class="ico-saddwish"></i></a>
                <div id ='showWishWrap' style="display:none;"></div>
            </div>
            <div class="collect-tw">
                <i class="ico-right"></i><b class="save-tishi"></b><a class="ico-close16"></a>
            </div>
        </div>
    </div>

</div>
<#--焦点图end-->
<div class="wbox clearfix wbox_d" >
    <div class="grd-cmdty-r">
    <#if model ?? && model.itemDetailInfo?? && model.itemDetailInfo.gomePrd?? && model.itemDetailInfo.gomePrd==false!>
        <#if model.itemDetailInfo.sapSkuType??&&model.itemDetailInfo.sapSkuType=='Z3PP'&&model.venderInfo??&&model.venderInfo.shopFlag??&&model.venderInfo.shopFlag==4>
            <div class="grd-store-box">
                <p class="grd-store-tit">商家信息</p>
                <a class="fly_cow" href="//mall.gome.com.cn/${model.venderInfo.vid!}" target="_blank">
                    <img src="${(config.imageserver)!}/flycow.png" alt="飞牛网" width="180" height="60">
                </a>
                <p class="pt10 pb10 overhidden">
                    <a class="storeName fl" style="width:120px;height:22px; display:inline-block;overflow:hidden;white-space:nowrap;text-overflow: ellipsis;" href="//mall.gome.com.cn/${model.venderInfo.vid!}" title="${model.venderInfo.vname!}" title="${(model.venderInfo.vname)!}" target="_blank">${model.venderInfo.vname!}</a>
                    <span class="zy_icon">国美自营</span>
                </p>
            </div>
        <#else>
            <div class="grd-store-box">
                <p class="grd-store-tit">商家信息</p>
                <p><span class="gray-88">店铺名称：</span><a class="storeName" rel="nofollow" href="//mall.gome.com.cn/${model.venderInfo.vid!}" title="${model.venderInfo.vname!}" target="_blank">${model.venderInfo.vname!}</a></p>
            </div>
            <div class="grd-store-box">
                <p>
                    <span class="gray-a5">服务评分：</span>
                        <span class="grd-r-score">
                            <i class="grd-r-score-i" style="width:${(model.venderInfo.serviceScore/5*100)?string('#.0')!}%"></i>
                        </span>
                    <b>${model.venderInfo.serviceScore?string('#.0')!}</b>分
                </p>
            </div>
            <div class="grd-store-box">
                <p><span class="gray-a5 bifen_title">评分明细</span>
                    <span class="gray-a5">与行业对比</span>
                </p>
                <p><span class="gray-a5 bifen_title">商品描述：<b>${model.venderInfo.goodsMatch?string('#.00')!}</b></span>
                    <span class="<#if (model.venderInfo.goodsMatchCmp<0)>diyu<#elseif (model.venderInfo.goodsMatchCmp>0)>gaoyu</#if>"></span>
                    <span class="<#if (model.venderInfo.goodsMatchCmp<0)>diyu_text<#elseif (model.venderInfo.goodsMatchCmp>0)>gaoyu_text</#if>"><#if (model.venderInfo.goodsMatchCmp>=0)>${model.venderInfo.goodsMatchCmp?string('0.00')!}%<#elseif (model.venderInfo.goodsMatchCmp<0)>${(-model.venderInfo.goodsMatchCmp)?string('0.00')!}%</#if></span>
                </p>
                <p><span class="gray-a5 bifen_title">发货速度：<b>${model.venderInfo.deliverySpeed?string('#.00')!}</b></span>
                    <span class="<#if (model.venderInfo.deliverySpeedCmp<0)>diyu<#elseif (model.venderInfo.deliverySpeedCmp>0)>gaoyu</#if>"></span>
                    <span class="<#if (model.venderInfo.deliverySpeedCmp<0)>diyu_text<#elseif (model.venderInfo.deliverySpeedCmp>0)>gaoyu_text</#if>"><#if (model.venderInfo.deliverySpeedCmp>=0)>${model.venderInfo.deliverySpeedCmp?string('0.00')!}%<#elseif (model.venderInfo.deliverySpeedCmp<0)>${(-model.venderInfo.deliverySpeedCmp)?string('0.00')!}%</#if></span>
                </p>
                <p><span class="gray-a5 bifen_title">服务质量：<b>${model.venderInfo.serviceScore?string('#.00')!}</b></span>
                    <span class="<#if (model.venderInfo.serviceScoreCmp<0)>diyu<#elseif (model.venderInfo.serviceScoreCmp>0)>gaoyu</#if>"></span>
                    <span class="<#if (model.venderInfo.serviceScoreCmp<0)>diyu_text<#elseif (model.venderInfo.serviceScoreCmp>0)>gaoyu_text</#if>"><#if (model.venderInfo.serviceScoreCmp>=0)>${model.venderInfo.serviceScoreCmp?string('0.00')!}%<#elseif (model.venderInfo.serviceScoreCmp<0)>${(-model.venderInfo.serviceScoreCmp)?string('0.00')!}%</#if></span>
                </p>
            </div>
            <div class="grd-store-box live800_wrap">
                <div style="margin:4px 0 ;" class="clearfix">

                    <span class="line online" data-customer_service_id="${model.venderInfo.vid!}"></span>
					<span class="jrdp" style=""><a rel="nofollow" data-code="8000070001-1" href="//mall.gome.com.cn/${model.venderInfo.vid!}" target="_blank">进入店铺</a></span>
                </div>
                <p>客服电话：<b>${model.venderInfo.shopMobileNo!}</b></p>
            </div>
        </#if>
    </#if>
        <div class="grd-recom">
            <div id="mboxDynamic"></div>
            <div id="selectedgoods"></div>
        </div>
    </div>
     <div id="j-comment-section" class="grd-cmdty-l">
        <ul class='grd-tabs clearfix' id="prd_tbox">
            <li class="grd-tab-li tab-cur">商品详情</li>
            <li class="grd-tab-li">规格参数</li>
            <li class="grd-tab-li">商品评价
                <span class="grd-cmt-sum">(${model.appraiseCount?c!})</span>
            </li>
        </ul>
        <div class="grd-cont grd-cont-detail" >
            <div id="productDesc"></div>
            <div class="pricedesc">
                <p class="title">价格说明：</p>
                <p>1、未划线价格：该价格是商品的销售标价，最终成交价格可能会因使用优惠券等原因而发生变化，请以订单结算页面价格为准。</p>
                <p>2、划线价格：该价格是商品的参考价，可能是商品的厂商指导价、正品零售价、商品吊牌价、品牌专柜价，或者是在国美平台上曾经展示过的销售价等价格,仅供您选购商品时参考。</p>
                <p>3、其他：商品促销信息以商品详情页促销栏目中的信息为准；如您发现活动商品售价或促销信息有异常，请购买前先联系销售商咨询。</p>
            </div>
        </div>
        <div class="grd-cont grd-cont-spec" id="productArguments">
        <#if model?? && model.prdSpecs?? && model.prdSpecs?size &gt; 0>
            <table class="grd-specbox">
                <#list model.prdSpecs as item>
                    <#if item.single!>
                        <tr>
                            <th colspan="2">
                                <b>${item.key!}</b>
                            </th>
                        </tr>
                    <#else>
                        <tr>
                            <td width="219">
                                <span class="gray-a5">${item.key!}</span>
                            </td>
                            <td width="520">
                                <span class="gray-a5">${item.value!}</span>
                            </td>
                        </tr>
                    </#if>
                </#list>
            </table>
        <#else>
            <p class="grd-cont-blank">很抱歉，暂无相关参数信息</p>
        </#if>
        </div>
        <div class="grd-cont grd-cont-cmt product-comment clearfix">
            <div class="sorceOut clearfix"></div>
            <ul class="commentTab clearfix" id="j-ctTab"></ul>
            <ul class="ordershow-list" id="singleShow"></ul>
            <ul class="comment-list" id="j-commentsList"></ul>
            <div class="clearfix">
                <a target="_blank" href="${config.reviewSite!}/${model.itemDetailInfo.productId!}-0-1.html"
                   class="allcmt">查看全部评价&gt;
                </a>
                <div id="j-page" class="page"></div>
            </div>
        </div>
    </div>
</div>
<div class="dialog">
    <div id="dialogBox" class="dialogBox">
        <div class="close"><a href="javascript:;" id="close">╳</a></div>
        <div id="innerBox"></div>
    </div>
</div>
<div id="saleRemind">
    <div class="remind">
        <p class="tit">活动开售前1小时内，我们会通过短信通知您哦～</p>
        <div class="phone v-err">
            <input type="" name="" placeholder="请输入手机号码" maxlength="11" onfocus="this.placeholder=''" onblur="this.placeholder='请输入手机号码'" id="phoneInput">
            <div class="errdiv"> <p class="errMsg">手机号码有误，请重新输入！</p></div>
           
        </div>
        <div class="btn">
            <a href="javascript:;" class="active" id="btnConfirm">确定</a><a href="javascript:;" id="btnCancel">取消</a>
        </div>
    </div>
    <div class="success">
        <p class="tit"><i class="icon_suc"></i><span>添加成功！<span></p>
        <p id="remindtxt">活动开售前1小时内，我们会通过短信通知您哦～</p>
    </div>
</div>

<div id ="wish_wrap_dia" style ="display:none;">
    <div id="wish_wrap" class="wish_wrap">
        <div id="wish_form"  >
            <div class="wish_header">马上对TA说出心愿，等待惊喜吧！</div>
            <div class="wish_title">您可以免费给TA发短信</div>
            <div class="wish_form">
                <div   class="item  my_mobilePhone_wrap ">
                    <div class="item_title"><span class="must_flag">*</span>我的手机号：</div>
                    <div class="item_boder v_border">
                        <input id="my_mobilePhone" class="_ie6_input wish_mobilePhoneNumber " type="text" value="" maxlength="11" tabindex="1" />
                    </div>
                    <div class="verify_info">
                        <div class="v_e">手机号码错误</div>
                        <div class="v_r"></div>
                    </div>
                </div>
                <div class="item verificationCode_wrap">
                    <div class="item_title"><span class="must_flag">*</span>短信验证码：</div>
                    <div class="item_boder v_border item_v_boder" >
                        <input id  ="wish_verifyNum" type="text" class="_ie6_input wish_verifyNum" value="" maxlength="6" tabindex="2"  />
                    </div>
                    <div class="fl">
                        <span id ="wish_verify_btn" class="wish_verify_btn " >免费获取验证码</span>
                    </div>
                    <div class="verify_info">
                        <div class="v_e">验证码错误</div>
                        <div class="v_send">验证码已发送,请查收短信</div>
                    </div>
                </div>
                <div class="item his_mobilePhone_wrap">
                    <div class="item_title"><span class="must_flag">*</span>TA的手机号：</div>
                    <div class="item_boder v_border">
                        <input id="his_mobilePhone" class="_ie6_input wish_mobilePhoneNumber " type="text" value="" maxlength="11" tabindex="3" />
                    </div>
                    <div class="verify_info">
                        <div class="v_e">手机号码错误</div>
                        <div class="v_r"></div>
                    </div>
                    <div class="verify_double" >手机号码重复 </div>
                </div>
                <div class="item wish_text_wrap">
                    <div class="item_title">给TA留言：</div>
                    <div class="fl pr">
                        <textarea id ="wish_text" class="wish_text" tabindex="4"></textarea>
                        <div class="wish_text_e">留言最多140个字</div>
                        <div class ="wish_text_presentation">例如：我是Tina，我想要这款商品，你愿意送给我吗？</div>
                    </div>
                </div>
                <div class="item">
                    <div class="item_title"></div>
                    <div class="fl">
                        <button id ="submit_wish" class="submit_wish">发送</button><span class="submit_wish_text" style="color: #A5A5A5;line-height: 16px;padding-left: 5px;">短信的内容包括：留言+您的手机号+商品标题+网址</span>
                    </div>
                    <div style="clear:both;"></div>
                </div>
            </div>
        </div>
        <div id="wish_weixin" style ="display:none;" >
            <div class="wish_header">马上对TA说出心愿，等待惊喜吧！</div>
            <div>
                <p class ="tc">
                    <img class ="qrcode_img" width="200" height="200" gome-src="//ss${config.cookieDomain}/item/v1/barcodeImage/${model.itemDetailInfo.itemId!}-${model.itemDetailInfo.productId!}-${model.itemDetailInfo.skuId!}/<#if itemTypes=='团购'>groupxyd<#else>rush</#if>/200/200/flag/tuan" src="${(config.imageserver)!}/grey.gif"/>
                </p>
                <p class ="weixin_text" >打开手机微信客户端，点击“发现”使用“扫一扫”，选择您要发送的朋友，TA就能看到您提出心愿的商品啦~~</p>
            </div>
        </div>
        <div id="send_wish_success" class="send_wish_success">
            <div class ='send_wish_success_flag'>
            </div>
            <div class ='send_wish_success_text'>
                短信已发送成功!
            </div>
            <div class ='c333'><span>你可以继续 </span><span class="tichu_wish">提出心愿</span></div>
        </div>
        <div id="send_wish_error" class="send_wish_error">
            <div class ='send_wish_error_flag'>
            </div>
            <div class ='send_wish_error_text'>
                短信已发送失败!
            </div>
            <div class ='c333'>
                <span>你可以</span><span class='try_again'>再试一次 </span>
            </div>
        </div>
        <div id="wish_share_wrap" class ="wish_share_wrap"  >
            <div  class ="c5e">更多发送愿望的方式：</div>
            <div id ="wish_share" class="wish_share  oh"  >
                <div  class ="fleft">
                    <span id="copy_link" class ="copy_link"  href="javascript:;"><i></i><span>复制链接</span></span>
                    <span class ="weixin_saoyisao" id="wish_show_weixin"><i></i><span>微信扫一扫</span></span>
                </div>
            </div>
            <div id ='copy_link_success'>
                成功复制到剪切板
                <div class ='c_l_s'></div>
            </div>
        </div>
    </div>
</div>
<div class="pop-soldout" style="display:none;">
    <p>该商品刚刚卖光啦！</p>
    <a class="ico-close12" href="javascript:;"></a>
    <a class="btn-normal">确定</a>
</div>
<div id="productmbox"></div>
<div id="xsd_tishi">
    <p>送达时间段</p>
    <p><span>上午达</span>10:00——14:00</p>
    <p><span>下午达</span>14:00——18:00</p>
    <p><span>夜间达</span>18:00——22:00</p>
</div>
<div id="jsd_tishi">
    <p><span class="xiadanshijian">下单时间</span><span>送达时间</span></p>
    <p><span class="xiadanshijian">00：00—12:00</span><span>当日20:00前</span></p>
    <p><span class="xiadanshijian">12：00—14:00</span><span>当日22:00前</span></p>
    <p><span class="xiadanshijian">14：00—24:00</span><span>次日14:00前</span></p>
</div>
<style>
    #popLogin-ifrWindow body{ background:#666;}
</style>


<#-- 将同步数据转换成js变量  遍历map-->
<#assign prdProperties="">
<#if model?? && model.properForItem?? && model.properForItem?keys?size &gt; 0 >
    <#list model.properForItem?keys as itemKey>
        <#if prdProperties?length = 0>
            <#assign prdProperties='"${itemKey!}"'+':'+'"${(model.properForItem[itemKey])!}"'>
        <#else>
            <#assign prdProperties=prdProperties+','+'"${itemKey!}"'+':'+'"${(model.properForItem[itemKey])!}"'>
        </#if>
    </#list>
</#if>
<#assign prdProperties='{'+prdProperties+'}'>
<script type="text/javascript">
    var ColorVersion = ${prdProperties!}
</script>
<#assign cityCode="'[">
<#if model?? && model.itemDetailInfo.restrictCityCode??>
    <#list model.itemDetailInfo.restrictCityCode as item>
        <#if item_index!=0>
            <#assign cityCode= cityCode+','+'city:'+item!>
        <#else>
            <#assign cityCode= cityCode+'city:'+item!>
        </#if>
    </#list>
</#if>
<#assign cityCode=cityCode+"]'">
<#assign cagalog="gome">
<#if !model.itemDetailInfo.gomePrd>
    <#assign cagalog="coo8">
</#if>

<script type="text/javascript">
    var prdInfo={
        prdId:"${model.itemDetailInfo.productId!}",
        sku:"${model.itemDetailInfo.skuId!}",
        skuNo:"${model.itemDetailInfo.skuNo!}",
        catText:"${model.itemDetailInfo.categoryName!}",
        catTitl:"${model.itemDetailInfo.categoryName!}",
        catId:"${model.itemDetailInfo.categoryId!}",
        nomalCatid:"${model.itemDetailInfo.thirdCatId!}",
        itemName:"${model.itemDetailInfo.itemName?js_string!}",
        description:"${model.itemDetailInfo.itemName?js_string!}${model.itemDetailInfo.itemDesc?js_string!}",
        itemId:"${model.itemDetailInfo.itemId!}",
        startDate:"${model.itemDetailInfo.startDate!?c}",
        endDate:"${model.itemDetailInfo.endDate!?c}",
        groupPrice:"${model.itemDetailInfo.groupPrice!}",
        skuType:"${model.itemDetailInfo.sapSkuType!}",
        shelfCtgy3:"${model.itemDetailInfo.shelfCtgy3!}",
        vid:"${model.venderInfo.vid!}",
        itemType:"${model.itemDetailInfo.itemType!}"
    };
    <#--var tuanSite = "${config.tuanSite!}";-->
    var itemSite = "${config.itemSite!}";
    var reviewSite = "${config.reviewSite!}";
    var productDetailUrl="${model.productDetailUrl!}";
    var citys=${cityCode!};
    var memberSite ="${config.memberSite!}";
    var tuanSite ="${config.indexDomain!}";

</script>
