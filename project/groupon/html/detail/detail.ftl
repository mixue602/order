<!DOCTYPE html>
<html>
<head>
{%widget name="global_head"%}
    
<@global_head title="${(model.seo.title)!}" keyword="${(model.seo.keywords)!}" description="${(model.seo.description)!}" canonical="${(model.seo.canonical)!}"  alternate="${(model.seo.appUrl)!}"   applicable="pc" dns=['img','img1','img3','img4','css','js','app']/>
<link rel="stylesheet" href="<!--#include virtual='/n/common/a12/style.html'-->">
<link rel="stylesheet" href="/css/common.css">
<link rel="stylesheet" href="gmlib/unit/gcity/1.0.0/gcity.min.css">
<link rel="stylesheet" href="/css/groupbuy.css">
<link rel="stylesheet" href="/css/wishcss.css">
<!--#include virtual="/n/common/global/global.html"-->
<script src="<!--#include virtual='/n/common/a12/script.html'-->"></script>
<script src="gmlib/unit/g/1.0.0/g.min.js"></script>
<script src="gmlib/ui/arttemplate/2.0.4/template.min.js"></script>
<script src="gmlib/ui/arttemplate/2.0.4/template-simple.min.js"></script>
<script src="gmlib/ui/gpop/1.0.0/gpop.min.js"></script>
<script src="gmlib/unit/cart/1.0.0/addCart.min.js"></script>
<script src="gmlib/ui/gload/1.0.0/gload.min.js"></script>
<script src="gmlib/ui/jquery.easing/1.0.0/jquery.easing.1.3.min.js"></script>
<script src="gmlib/unit/gtime/1.0.0/gtime.min.js"></script>
<script src="gmlib/ui/opslider/1.0.0/opslider.min.js"></script>
<script src="gmlib/unit/gcity/1.0.0/gcity.min.js"></script>
<script src="gmlib/ui/gpage/1.0.0/gpage.min.js"></script>
<script src="gmlib/ui/json3/3.3.2/json3.min.js"></script>
<script src="gmlib/unit/scode/1.0.0/scode.min.js"></script>
<script src="gmlib/unit/bigdata/1.0.0/bigdata.min.js"></script>
<script src="/js/common/common.js"></script>
<script src="/js/common/collection.js"></script>
<script src="/js/common/recentlyBrowse.js"></script>
<script src="/js/detail/dtcommend.js"></script>
<script src="/js/detail/nGBmagnifier.js"></script>
<script src="/js/detail/addWish.js"></script>
<script src="/js/detail/grouponDetail.js"></script>
<script src="/js/detail/getTuanStatus.js"></script>
<script src="/js/common/publicjs.js" inline></script>
</head>
<body class="groupbuy w1000" data-page="tuandetail">
{%widget name="cheap_web_var"%}
<@cheap_web_var screenAuto=false/>
<!--#include virtual="/n/common/a12/head.html"-->
{%widget name="cheap_web_header"%}
{%widget name="cheap_web_nav"%}
<#include "detailcont.ftl" />
<!--#include virtual="/n/common/a12/foot.html"-->
<!--#include virtual="/n/common/a12/aside.html"-->


</body>
</html>


