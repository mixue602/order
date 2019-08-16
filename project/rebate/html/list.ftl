
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
<#--定义TDK-->
<#if storeConfiguration.tdk?? && (storeConfiguration.tdk.seoTitle)??>
    <title>${(storeConfiguration.tdk.seoTitle)!}</title>
    <meta name="description" content="${(storeConfiguration.tdk.seoDescription)!}">
    <meta name="Keywords" content="${(storeConfiguration.tdk.seoKeyword)!}">
<#else>
    <#if question?? && question !="">
    <title>【${(question)!}特卖返利】品牌折扣_${(question)!}折扣返利_品牌${(question)!}优惠-国美</title>
    <meta name="description" content="国美xx栏目为您提供品牌折扣${(question)!}、最新${(question)!}折扣、品牌${(question)!}特卖、${(question)!}优惠等返利优惠,找品牌折扣${(question)!}就到国美.">
    <meta name="Keywords" content="${(question)!}返利,品牌折扣${(question)!},折扣${(question)!},${(question)!}特卖,">
    </#if>
</#if>
<#--END-->
    <!-- 启用360浏览器的极速模式(webkit) – -->
    <meta name="renderer" content="webkit">
    <!-- 避免IE使用兼容模式 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <meta http-equiv="Cache-Control" content="no-transform"/>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta property="qc:admins" content="2500556177677556375636"/>
    <meta name="applicable-device" content="pc">
    <link rel="shortcut icon" href="//app.gomein.net.cn/favicon.ico" type="image/x-icon" />
<#--公共环境变量-->
    <!--#include virtual="/n/common/global/global.html"-->
<#--公共环境变量 end-->
<#--公共头部css-->
    <link rel="stylesheet" href="<!--#include virtual='/n/common/a35/style.html'-->,gmlib/unit/pager/1.0.0/pager.css">
    <link rel="stylesheet" href="/css/gcity.css">
    <link rel="stylesheet" href="/css/head.css">
    <link rel="stylesheet" href="/css/list.css">
<#--公共头部css end-->
</head>
<body class="rebate">
<!--#include virtual="/n/common/a35/head.html"-->
<#--窄屏-->
<div id="delscript">
    <script type="text/javascript">
        var winWidth = window.screen.width,objb = document.body;if (winWidth<=1024) {objb.className += " " +"w1000"; }else {objb.className=objb.className.replace("w1000", '');};
    </script>
</div>
<#--窄屏 end-->
<#--可视化编辑-->
<#if edit??>
<input type="hidden" id="editModeId" editMark="${(edit)!}" editUrl="${(storeConfiguration.gccUrl)!}"/>
</#if>
<#--可视化编辑 end-->
<#assign gomeImgLoad = storeConfiguration.imageserver+"/grey.gif">
<#include "head.ftl"/>
<#include "prdlistTpl.ftl"/>
<#--搜搜列表页内容-->
<div class="fli_box clearfix">
    <span class="fli_listtitle">返利精选</span>
    <div class="fli_current"><a href="//fanli.gome.com.cn/" title="返利首页" class="link " target="_blank">返利首页</a><span class="icon">&gt;</span><span class="cur">手机</span><span class="num">共个商品</span></div>
    <div class="fli_listbox">
    <div id="filter-box">
        <div id="filter-top" class="filter-top clearfix">
            <ul class="filter-order-box" id="filter-order-box">
                <li id="sort-general" class="cur" data-sort="00"><a href="javascript:;">综合</a></li>
                <li class="" data-sort="10"><a href="javascript:;">销量</a></li>
                <li id="sort-price" class="price-up" data-sort="20"><a href="javascript:;">价格</a><i class="icon-up-down"></i></li>
                <li class="" data-sort="40"><a href="javascript:;">返利</a></li>
            </ul>
            <div class="priceRange-name">价格</div>
            <ul class="filter-priceRange-box clearfix pricebox">
                <li class="priceRange-input"><input id="fc-lowPrice" maxlength="6" type="text" value="¥"></li>
                <li class="priceRange-link">-</li>
                <li class="priceRange-input"><input id="fc-highPrice" type="text" maxlength="6" value="¥"></li>
                <li class="priceRange-btn"><a id="fc-btn-cancel" class="fc-btn-cancel" href="javascript:void(0)">清除</a></li>
                <li class="priceRange-btn"><a id="fc-btn-ok" class="fc-btn-ok" href="javascript:void(0)">确定</a></li>
            </ul>
            <div class="pricefli-name">返利</div>
            <ul class="filter-fli-box clearfix pricebox">
                <li class="pricefli-input"><input id="fli-lowPrice" maxlength="6" type="text" value="¥"></li>
                <li class="pricefli-link">-</li>
                <li class="pricefli-input"><input id="fli-highPrice" type="text" maxlength="6" value="¥"></li>
                <li class="pricefli-btn"><a id="fli-btn-cancel" class="fc-btn-cancel" href="javascript:void(0)">清除</a></li>
                <li class="pricefli-btn"><a id="fli-btn-ok" class="fc-btn-ok" href="javascript:void(0)">确定</a></li>
            </ul>

            <div class="min-pager-box">
                <a href="javascript:void(0)" class="min-pager-next " id="mp-next">&gt;</a>
                <a href="javascript:void(0)" class="min-pager-prev mp-disable" id="mp-prev">&lt;</a>
                <span class="min-pager-number" id="min-pager-number">/</span>
            </div>
        </div>
        <div id="filter-bottom" class="filter-bottom">
            <div class="filter-adress-box city">
                <span class="filter-adress-tit">送至：</span>
                <span id="address" class="filter-adress-stock">
                    <a id="stockaddress" href="javascript:void(0);" title=""></a>
                    <i class="filter-adress-icon"></i>
                    <em class="space"></em>
                </span>
                <div class="gCity clearfix"></div>
            </div>
            <div class="filter-label-box">
                <a class="gmform-label ziying" id="deliv" data-check="false" data-value="1" href="javascript:;"><i class="iic"></i>国美自营</a>
                <a class="gmform-label huowu" id="instock" data-check="false" data-value="1" href="javascript:;"><i class="iic"></i>仅显示有货</a>
                <a class="gmform-label fanli" id="discountQiang" data-check="false" data-value="200" href="javascript:;"><i class="iic"></i>分享返利</a>
                <a class="gmform-label fanli" id="discountRebate" data-check="false" data-value="300" href="javascript:;"><i class="iic"></i>购买返利</a>
            </div>
        </div>
    </div>
    <div class=" rebate_goods ">
        <div class="rebate_main mt15 clearfix">
            <ul class="rebate_list">

            </ul>

        </div>
        <div class="rebate_noprd">
            <h3>抱歉，没有找到相关的商品</h3>
            <p>建议您：</p>
            <p>1、修改筛选条件</p>
            <p>2、调整价格区间</p>
            <p>3、使用其他关键字</p>
        </div>
        <div class="y_page pager" id="y_page_in"></div>
    </div>
    </div>
</div>

<#--搜搜列表页end-->
<!--尾部开始-->
<!--#include virtual="/n/common/a35/foot.html"-->
<!--#include virtual="/n/common/a35/aside.html"-->
<!--尾部结束-->
<script src="<!--#include virtual='/n/common/a35/script.html'-->,gmlib/sea/seajs/3.0.0/sea.js,gmlib/sea/seajs-combo/1.0.0/seajs-combo.js"></script>
<script src="/js/list.js"></script>
<script>

    (function(){
        var bp = document.createElement('script');
        var curProtocol = window.location.protocol.split(':')[0];
        if (curProtocol === 'https') {
            bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
        }
        else {
            bp.src = 'http://push.zhanzhang.baidu.com/push.js';
        }
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(bp, s);
    })();
</script>

</body>
</html>