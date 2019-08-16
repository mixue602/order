<#if keyword?? && keyword ==  "/rebate">
<#assign keys><#if (children.defaultSearchKeyWords.linkList)?? && (children.defaultSearchKeyWords.linkList)?size &gt;0><#list (children.defaultSearchKeyWords.linkList) as item>${(item.textOtherAttr.elemenlName)!},1<#if item_has_next>;</#if></#list></#if></#assign><#--头部-->
</#if>
<div class="fli_headbox">
    <div class="fli_box">
        <div class="fli_gz edit-mode"><span class="icon"></span><a data-code="rebate0101" class="link" href="//help.gome.com.cn/article/431-0-0.html" target="_blank" title="返利规则">返利规则</a></div>
        <div class="fli_searchbox">
            <form id="searchForm" method="get" action="//fanli.gome.com.cn/search" onsubmit="return keyCheck();" class="">
                <#if keyword?? && keyword ==  "/rebate">
                    <label id="keyLabel" default="${keys!}"></label>
                <#else>
                    <label id="keyLabel" default=""></label>
                </#if>
                <input type="text" id="searchInput" name="question" value="" autocomplete="off" onpropertychange="if(this.value.length>200){this.value=this.value.slice(0,199)}" alt="">
                <button class="search-btn" onclick="doSearch();">搜索</button>
            </form>
            <div id="searchTips" class="searchtips">
                <div id="his_title" class="hisTitle">
                    <p><span>最近搜索</span><a id="hisClear" href="javascript:void(0)">全部清空</a></p>
                </div>
                <ul id="searchTipsList" class="searchabout clearfix">
                </ul>
            </div>
        </div>

    </div>
</div>
<script type="text/javascript">
    var environment = 'commerce',targetType ='Production',contentLabels = 'Catalog',language = 'chinese' ;
</script>
<#--头部end-->