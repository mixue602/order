<#import "priceFormat.ftl" as FormatPrice >
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <#if (storeConfiguration.tdk)?? && (storeConfiguration.tdk.seoTitle)??>
        <title>${(storeConfiguration.tdk.seoTitle)!}</title>
        <meta name="description" content="${(storeConfiguration.tdk.seoDescription)!}">
        <meta name="Keywords" content="${(storeConfiguration.tdk.seoKeyword)!}">
        <#else>
            <title>【返利精选】返利商城-国美</title>
            <meta name="description" content="国美返利频道，主要提供电视、洗衣机、电脑、手机、数码、空调、电脑配件返利为目的的频道，让您购物更省钱">
            <meta name="Keywords" content="返利,返利商城,返利网站,品牌折扣">
    </#if>
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
    <link rel="shortcut icon" href="//app.gomein.net.cn/favicon.ico" type="image/x-icon"/>
    <!--#include virtual="/n/common/global/global.html"-->
    <#--公共头部css-->
        <link rel="stylesheet" href="<!--#include virtual='/n/common/b18/style.html'-->">
        <link rel="stylesheet" href="/css/yglist.css">
        <#--公共头部css end-->
</head>
<body class="rebate">
<script type="text/javascript">
    var winWidth = window.screen.width,objb = document.body;if (winWidth<=1024) {objb.className += " " +"w1000"; }else {objb.className=objb.className.replace("w1000", '');};
</script>
<!--#include virtual="/n/common/b18/head.html"-->
<#assign gomeImgLoad = storeConfiguration.imageserver+"/grey.gif">
<#include "listfloor.ftl">
<!--尾部开始-->
<!--#include virtual="/n/common/b18/foot.html"-->
<!--尾部结束-->
<!--#include virtual="/n/common/b18/aside.html"-->
<script src="<!--#include virtual='/n/common/b18/script.html'-->,gmlib/sea/seajs/3.0.0/sea.js,gmlib/sea/seajs-combo/1.0.0/seajs-combo.js"></script>
<script src="/js/yglist.js"></script>
<script inbottom>
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