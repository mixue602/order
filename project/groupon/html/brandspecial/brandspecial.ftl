<!DOCTYPE html>
<html>
<head>
{%widget name="global_head"%}
    
<@global_head title="${(model.seo.title)!}" keyword="${(model.seo.keywords)!}" description="${(model.seo.description)!}" canonical="${(model.seo.canonical)!}" alternate="" applicable="pc" dns=['img','img1','img3','img4','css','js','app']/>
<link rel="stylesheet" href="<!--#include virtual='/n/common/a12/style.html'-->">
<link rel="stylesheet" href="/css/common.css">
<link rel="stylesheet" href="/css/brandspecial.css">

<!--#include virtual="/n/common/global/global.html"-->
<script src="<!--#include virtual='/n/common/a12/script.html'-->"></script>

<script src="gmlib/unit/g/1.0.0/g.min.js"></script>
<script src="gmlib/ui/arttemplate/2.0.4/template.min.js"></script>
<script src="gmlib/ui/arttemplate/2.0.4/template-simple.min.js"></script>
<script src="/js/common/common.js"></script>
<script src="/js/common/collection.js"></script>
<script src="/js/common/recentlyBrowse.js"></script>
<script src="/js/common/publicjs.js" inline></script>
<script type="text/javascript" inbottom>
    var itemcont=function(){
        $(".group-brand-item").text;
    };
    if(itemcont==null ||itemcont==undefined){
        $(".grey-box ").css({background:"none"});
    }
    //埋码
    setTimeout(function () {
        $.ajax({
            url: stageJsServer+'/??/gmlib/unit/scode/1.0.0/scode.min.js,/gmlib/unit/scodecommon/1.0.0/scodecommon.min.js?v=2',
            dataType: "script"
        }).done(function(){
            s.pageName="团购:${model.imgUrl!}";
            s.channel="团购";
            s.prop1="团购:${model.imgUrl!}";
            s.prop2="团购:${model.imgUrl!}";
            s.prop3="团购:${model.imgUrl!}";
            s.prop4="团购:专题页";
            var s_code=s.t();
            if(s_code)document.write(s_code);
        });
    }, 700);
</script>
</head>
<body data-page="tuanbrandspecial">
{%widget name="cheap_web_var"%}
<@cheap_web_var screenAuto=true/>
<!--#include virtual="/n/common/a12/head.html"-->
{%widget name="cheap_web_header"%}
{%widget name="cheap_web_nav"%}


<#include "brandspecialFtl.ftl" />

<!--#include virtual="/n/common/a12/foot.html"-->
<!--#include virtual="/n/common/a12/aside.html"-->


</body>
</html>