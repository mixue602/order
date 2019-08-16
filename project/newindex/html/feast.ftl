
<#--横导航右侧节日氛围图- start-->
<#if (children.tempName.templates[0].temp.children.background.children.rightup)??>
    <#assign nav_rihgtbox = children.tempName.templates[0].temp.children.background.children.rightup>
    <div class="nav_right" >
        <#if (nav_rihgtbox.imgList[0])??>
            <a class="nav_right_pic" data-code="${(nav_rihgtbox.modelId)!}-1" <#if (nav_rihgtbox.imgList[0].href)??> target="_blank" href="${(nav_rihgtbox.imgList[0].href)!}"<#else> href="javascript:;"</#if>>
                <img class="edit-mode" modelId="${(nav_rihgtbox.modelId)!}" data-lazy-img="0" src="${(gomeImgLoad)!}" data-lazy-init="${(nav_rihgtbox.imgList[0].src)!}" width="180" height="40" <#if (nav_rihgtbox.imgList[0].alt)??>alt="${(nav_rihgtbox.imgList[0].alt)!}"</#if> title=""/>
            </a>
        </#if>
    </div>
</#if>
<#--横导航右侧节日氛围图-end-->
<#--头部背景-->
<#if (children.tempName.templates[0].temp.children)??>
    <#assign temp=(children.tempName.templates[0].temp.children)>
    <#if (temp.headBacKImg)??>
        <#assign img=(temp.headBacKImg)>
        <#if (img.state)?? && (img.state) == "isShow" >
            <#if (img.imgList[0])??>
                <style>.home{background:url(${(img.imgList[0].src)!}) center top no-repeat;}</style>
            </#if>
            <#if (img.imgList[0].imgOtherAttr.extend)?? && (img.imgList[0].imgOtherAttr.extend) == "big" >
                <style>
                    .gm_main .focus{ background: none;}
                    .gm_sever_wrap{ background:#fff; height: 448px; border:1px solid #e6e6e6; border-left:none; margin-left: 349px;}
                    .w1000 .gm_sever_wrap{background:none;}
                    .gm_sever .icon_tab_content_ul{ border-bottom: none;}
                </style>
                <input type="hidden" class="focus_bg_li" />
            </#if>
        </#if>
    </#if>
<#--节日活动装扮菜单下划线和菜单背景 start-->
    <#if (temp.otherLogo.children.line.imgList[0])??>
        <div class="m-b-line"></div><style>.m-b-line{height: 10px;font-size: 0;background: url(${(temp.otherLogo.children.line.imgList[0].src)!}) repeat-x;position: relative;top: -10px; z-index:99;margin-bottom: -10px;}</style>
    </#if>
    <#if (temp.otherLogo.children.category.imgList[0])??>
        <style>.home .sidecategory h2{background: url(${(temp.otherLogo.children.category.imgList[0].src)!}) no-repeat;opacity: 1;filter:Alpha(opacity=100)}</style>
    </#if>
    <#if (temp.otherLogo.children.logo.imgList[0])??>
        <#assign list=(temp.otherLogo.children.logo.imgList[0])>
        <style>
            .home #logo a{ width:145px;height:120px;background: url(${(list.src)!}) center no-repeat;}
            .home #logo{ width:145px;height:120px; margin:0;}
            #logo-right-ad{ margin-left: 0;}
			#logo-gif{margin-left: 0;}
        </style>
        <#if (list.href)??>
            <input type="hidden" class="logoHref" data="${(list.href)!}"/>
        </#if>
    </#if>
<#--节日活动装扮菜单下划线和菜单背景 end-->
    <#if (storeConfiguration.edit)??>
        <input type="hidden"  id="editModeId" editMark="${(storeConfiguration.edit)!}"   editUrl="${(storeConfiguration.gccUrl)!}" gccCacheUrl="${(storeConfiguration.gccCacheUrl)!}"/>
    </#if>
<#-- end of 可视化编辑-->
<#-- start of ab页逻辑-->
    <#if (storeConfiguration.abFlag)??>
        <input type="hidden"  id="abFlagId" abFlag="${(storeConfiguration.abFlag)!}"/>
    </#if>
<#-- end of ab页逻辑-->
<#--屏蔽大数据js-->
    <#if (state)?? && (state=="bigdata")>
        <script> var _wall_switch = true;</script>
    </#if>
<#-- end 屏蔽大数据js-->
<#--美信广告屏蔽-->
    <#if (children.tempName.templates[0].temp.flag)?? && (children.tempName.templates[0].temp.flag=="AD")>
        <input type="hidden" id="ad_hidden"/>
    </#if>
<#-- end 美信广告屏蔽-->
<#--弹层时间与停留时间-->
    <#if (temp.window.linkList[0])??>
        <input type="hidden" id="layer_time" layer-timebetween="${(temp.window.linkList[0].text)!}" layer-timeshow="${(temp.window.linkList[0].title)!}"/>
    </#if>
<#-- end 弹层时间与停留时间-->

<#--蒙层数据- start-->
<script>
    var layerdata;
    <#if (children.tempName.templates[0].temp.children.Mongolialayer.imgList[0])??>
        <#assign layerbox = children.tempName.templates[0].temp.children.Mongolialayer.imgList[0]>
        <#assign layerboxcode = children.tempName.templates[0].temp.children.Mongolialayer>
        <#if (layerbox.src)?? && (layerbox.href)?? && (layerboxcode.modelId)??>
            layerdata =[{src:"${(layerbox.src)!}",href:"${(layerbox.href)!}",code:"${(layerboxcode.modelId)}-1"}];
        </#if>
    </#if>
</script>
<#--蒙层数据- end-->

<script>
       //浮动logo全局变量
    var FLtime = new Date();
    var floatLogo;
    function is_iPad(){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/iPad/i)=="ipad") {
            return true;
        } else {
            return false;
        }
    }
    var is_iPad = is_iPad();
    if(!is_iPad){
        <#if (temp.floating) ?? && ((temp.floating)?size>0)>
            <#assign floating=(temp.floating)>
            floatLogo = 1;
            <#if (floating.imgList[0])??>
                var floatLogo_0 = "${(floating.imgList[0].src)!}";
                var floatLogo_url = "${(floating.imgList[0].href)!}" ? "${(floating.imgList[0].href)!}" : "javascript:void(0);";
            </#if>
            <#if (floating.imgList[1])??>
                var floatLogo_1 = "${(floating.imgList[1].src)!}";
            </#if>
            var floatLogo_modelId = "${(floating.modelId)!}";
        <#else>
            floatLogo = 0;
        </#if>
    }else{
        floatLogo = 0;
    }
</script>
</#if>
