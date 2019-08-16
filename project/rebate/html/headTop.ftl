<#if keyword?? && keyword ==  "/rebate">
<#assign keys><#if (children.defaultSearchKeyWords.linkList)?? && (children.defaultSearchKeyWords.linkList)?size &gt;0><#list (children.defaultSearchKeyWords.linkList) as item>${(item.textOtherAttr.elemenlName)!},1<#if item_has_next>;</#if></#list></#if></#assign><#--头部-->
</#if>
<div class="fli_headbox wbox">
    <div class="fli_box">
        <h1><a href="//www.gome.com.cn" target="_blank" class="gome_logo"></a><a class="rebate_logo" href="//fanli.gome.com.cn" target="_blank"></a></h1>
        <div class="fli_gz edit-mode"><span class="icon"></span><a data-code="rebate0101" class="link" href="//help.gome.com.cn/article/431-0-0.html" target="_blank" title="返利规则">返利规则</a></div>
        <div class="fli_searchbox">
            <div class="fli_searchbox_warp">
                <form id="searchForm" method="get" action="//fanli.gome.com.cn/search" onsubmit="return keyCheck();" class="clearfix">
                    <#if keyword?? && keyword ==  "/rebate">
                        <label id="keyLabel" default="${keys!}"></label>
                        <#else>
                            <label id="keyLabel" default=""></label>
                    </#if>
                    <input type="text" id="searchInput" name="question" value="" autocomplete="off" onpropertychange="if(this.value.length>200){this.value=this.value.slice(0,199)}" alt="">
                    <button class="search-btn" onclick="doSearch();">搜索</button>
                </form>
            </div>
            <div id="searchTips" class="searchtips">
                <div id="his_title" class="hisTitle">
                    <p><span>最近搜索</span><a id="hisClear" href="javascript:void(0)">全部清空</a></p>
                </div>
                <ul id="searchTipsList" class="searchabout clearfix">
                </ul>
            </div>
            <div class="search_hot">
                <a href="#" target="_blank" class="pink">大头</a>
                <a href="#" target="_blank">二头</a>
                <a href="#" target="_blank">三头</a>
                <a href="#" target="_blank">四头</a>
                <a href="#" target="_blank">五头</a>
            </div>
        </div>
    </div>
</div>
<div class="rebate_nav mainnavbox1">
    <div class="wbox">
        <ul>
            <li><a href="//localhost//html/index.ftl" target="_blank">首页</a></li>
            <li><a href="#" target="_blank">购买返利专区</a></li>
            <li><a href="#" target="_blank">返利专区</a></li>
        </ul>
    </div>
</div>

<script type="text/javascript">
    var environment = 'commerce',targetType ='Production',contentLabels = 'Catalog',language = 'chinese' ;
</script>
<#--头部end-->