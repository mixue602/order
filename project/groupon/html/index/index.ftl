<!DOCTYPE html>
<html>
<head>
{%widget name="global_head"%}
<@global_head title="${(model.seo.title)!}" keyword="${(model.seo.keywords)!}" description="${(model.seo.description)!}" canonical="${(model.seo.canonical)!}"  alternate="${(model.seo.appUrl)!}" applicable="pc" dns=['img','img1','img3','img4','css','js','app']/>
<link rel="stylesheet" href="<!--#include virtual='/n/common/a12/style.html'-->">
<link rel="stylesheet" href="/css/common.css">
<link rel="stylesheet" href="/css/index.css">

<!--#include virtual="/n/common/global/global.html"-->
<script src="<!--#include virtual='/n/common/a12/script.html'-->"></script>

<script src="gmlib/unit/g/1.0.0/g.min.js"></script>
<script src="gmlib/ui/arttemplate/3.0.0/template.min.js"></script>
<script src="gmlib/ui/gslider/1.0.2/gslider.min.js"></script>
<script src="gmlib/unit/gtime/1.0.0/gtime.min.js"></script>
<script src="gmlib/unit/scode/1.0.0/scode.min.js"></script>
<script src="gmlib/ui/gload/1.0.0/gload.js"></script>
<script src="gmlib/unit/bigdata/1.0.0/bigdata.min.js"></script>

<script src="/js/common/common.js"></script>
<script src="/js/common/collection.js"></script>
<script src="/js/common/recentlyBrowse.js"></script>
<script src="/js/index/cheapIndex.js"></script>
<script src="/js/index/cheapSolid.js"></script>
<script  inbottom>
    //精彩话题。
    $.ajax(gomeplusCdn+'dist/js/sdk/resource-niche.js',{
        dataType: "script",
        cache: true
    }).done(function() {
        $('.pluspc_template').on('groupon_topic', function(){});
    });
</script>
</head>
<body data-page="tuanindex">
{%widget name="cheap_web_var"%}
<@cheap_web_var screenAuto=true/>
<!--#include virtual="/n/common/a12/head.html"-->
{%widget name="cheap_web_header"%}
{%widget name="cheap_web_nav"%}

<#include "indexFtl.ftl" />

<!--#include virtual="/n/common/a12/foot.html"-->
<!--#include virtual="/n/common/a12/aside.html"-->
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