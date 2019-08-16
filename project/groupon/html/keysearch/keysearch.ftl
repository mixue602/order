<!DOCTYPE html>
<html>
<head>
{%widget name="global_head"%}
    
<@global_head title="${(model.seo.title)!}" keyword="${(model.seo.keywords)!}" description="${(model.seo.description)!}" canonical="${(model.seo.canonical)!}"  alternate="${(model.seo.appUrl)!}"  applicable="pc" dns=['img','img1','img3','img4','css','js','app']/>
<link rel="stylesheet" href="<!--#include virtual='/n/common/a12/style.html'-->">
<link rel="stylesheet" href="/css/common.css">
<link rel="stylesheet" href="gmlib/unit/pager/1.0.0/pager.min.css">
<link rel="stylesheet" href="/css/keysearch.css">

<!--#include virtual="/n/common/global/global.html"-->
<script src="<!--#include virtual='/n/common/a12/script.html'-->"></script>

<script src="gmlib/unit/g/1.0.0/g.min.js"></script>
<script src="gmlib/ui/arttemplate/3.0.0/template.min.js"></script>
<script src="gmlib/unit/pager/1.0.0/pager.min.js"></script>
<script src="gmlib/unit/scode/1.0.0/scode.min.js"></script>
<script src="gmlib/unit/bigdata/1.0.0/bigdata.min.js"></script>
<script src="/js/common/common.js"></script>
<script src="/js/common/collection.js"></script>
<script src="/js/common/recentlyBrowse.js"></script>
<script src="/js/common/keysearchTpl.js"></script>
<script src="/js/common/priceStatus.js"></script>
<script src="/js/keysearch/keysearchLive.js"></script>
<script src="/js/common/publicjs.js" inline></script>
<script type="text/javascript" inbottom>
    var keyword = $('.group-crumbs-keyword').text();
</script>
</head>
<body data-page="tuankeysearch">
{%widget name="cheap_web_var"%}
<@cheap_web_var screenAuto=true/>
<!--#include virtual="/n/common/a12/head.html"-->
{%widget name="cheap_web_header"%}
{%widget name="cheap_web_nav"%}

<#include "keysearchFtl.ftl" />

<!--#include virtual="/n/common/a12/foot.html"-->
<!--#include virtual="/n/common/a12/aside.html"-->


</body>

</html>