<h1 class="hide">国美-真划算品牌团</h1>
<div class="group-wrapper">
    <div class="group-solider clearfix" id="group-solid">
        <#if model.mainAds?? && model.mainAds?size &gt; 0>
            <div class="group-solid-box">
                <div class="gSolid" id="gSolid">
                    <div class="gSolid-list" id="gSolid-list">
                        <ul class="solid-list-ul">
                        <#list model.mainAds as mainAds>
                            <#if mainAds_index == 0>
                                <li style="background:${mainAds.description!};display:list-item;">
                                    <img src="${config.imageserver!}/grey.gif ">
                                    <a data-code="8000030001-${(mainAds_index+1)!}" href="${mainAds.url!}" target="_blank">
                                        <img src="${config.imageserver!}/grey.gif " gome-src="${mainAds.imgUrl!}">
                                    </a>
                                    <img src="${config.imageserver!}/grey.gif ">
                                </li>
                            <#else>
                                <li style="background:${mainAds.description!};">
                                    <a data-code="8000030001-${(mainAds_index+1)!}" href="${mainAds.url!}" target="_blank">
                                        <img src="${config.imageserver!}/grey.gif " gome-src="${mainAds.imgUrl!}">
                                    </a>
                                </li>
                            </#if>
                        </#list>
                        </ul>
                    </div>
                    <#if model.mainAds?size &gt; 1>
                        <ul class="gsolid-tab" id="gSolid-tab">
                        <#list model.mainAds as mainAds>
                            <li class="gSolid-tab-text">
                                <#if mainAds_index == 0>
                                    <span class="bg cur"></span>
                                <#else>
                                    <span class="bg"></span>
                                </#if>
                                    <span class="text"><#if mainAds.name?length &gt; 10>${mainAds.name?substring(0,10)!}<#else>${mainAds.name!}</#if></span>
                            </li>
                        </#list>
                        </ul>
                        <div style="-moz-user-select:none;" onselectstart="return false" class="btn pre">
                            <span style="-moz-user-select: none;" onselectstart="return false" class="btnbg"></span>
                            <p id="go_l" class="go" style="-moz-user-select:none;" onselectstart="return false"></p>
                        </div>
                        <div style="-moz-user-select:none;" onselectstart="return false" class="btn nex">
                            <span style="-moz-user-select: none; " onselectstart="return false" class="btnbg"></span>
                            <p id="go_r" class="go" style="-moz-user-select:none;" onselectstart="return false"></p>
                        </div>
                    </#if>
                </div>
            </div>
        </#if>
    </div>
    <div class="group-wbox">
        <div class="group-brands-list clearfix">
            <#if model.floors?? && model.floors?size &gt; 0>
                <#list model.floors as itemFloors>
                    <#if itemFloors.topad?? || itemFloors.middlead?? || itemFloors.footad??>
                        <div class="group-floor">
                            <h2 <#if itemFloors_index == 0>class="pt20"</#if>>
                                <em class="txt_bg"></em>
                                <span>${itemFloors.name?substring(0,4)!}</span>
                            </h2>
                            <ul class="brands-list-ul clearfix">
                                <#if itemFloors.topad?? && itemFloors.topad?size &gt; 0>
                                    <#list itemFloors.topad as itemTopad>
                                        <li>
                                            <a data-code="8000030${(itemFloors_index+1)!}00-${(itemTopad_index+1)}_1" href="${itemTopad.url!}" target="_blank"><img src="${itemTopad.imgUrl!}" alt="${itemTopad.name!}" /></a>
                                        </li>
                                    </#list>
                                </#if>
                            </ul>
                            <#if itemFloors.middlead?? && itemFloors.middlead?size &gt; 0>
                                <div class="group-brands-midbanner clearfix">
                                    <#list itemFloors.middlead as itemMiddlead>
                                        <#if itemMiddlead_index==0>
                                            <div class="banner-bg"><img src="${itemMiddlead.imgUrl!}" alt="${itemMiddlead.name!}" /></div>
                                        <#else>
                                            <a data-code="8000030${(itemFloors_index+1)!}00-${(itemMiddlead_index+1)}_2" class="pic${itemMiddlead_index!}" href="${itemMiddlead.url!}" target="_blank"><img src="${itemMiddlead.imgUrl!}" alt="${itemMiddlead.name!}" /></a>
                                        </#if>
                                    </#list>
                                </div>
                            </#if>
                            <ul class="brands-list-ul clearfix">
                                <#if itemFloors.footad?? && itemFloors.footad?size &gt; 0>
                                    <#list itemFloors.footad as itemFootad>
                                        <li>
                                            <a data-code="8000030${(itemFloors_index+1)!}00-${(itemFootad_index+1)}_3" href="${itemFootad.url!}" target="_blank"><img src="${itemFootad.imgUrl!}" alt="${itemFootad.name!}" /></a>
                                        </li>
                                    </#list>
                                </#if>
                            </ul>
                        </div>
                    </#if>
                </#list>
            </#if>
        </div>
        <div class="group-brands-list group-floor clearfix">
            <h2><#if (model.tomoName)?? >
				<em class="txt_bg"></em>
				<span>
                    <#if model.tomoName?length &gt; 4||model.tomoName?length == 4>${model.tomoName?substring(0,4)!}</#if>
                    <#if (model.tomoName)?? && model.tomoName?length &gt; 0 && model.tomoName?length < 4>${(model.tomoName)!}</#if>
                </span>
                <#else>
                    <em class="txt_bg"></em>
                    <span> 明日预售</span>
                </#if>
            </h2>
            <ul class="brands-small-ul">
                <#if model.tomoAds???? && model.tomoAds?size &gt; 0>
                    <#list model.tomoAds as itemTomoAds>
                        <li>
                            <a data-code="8000030002-${(itemTomoAds_index+1)!}" href="${itemTomoAds.url!}" target="_blank"><img src="${itemTomoAds.imgUrl!}" alt="${itemTomoAds.name!}" /></a>
                        </li>
                    </#list>
                </#if>
            </ul>
        </div>
    </div>
</div>
<div id="J_rightFixed" class="right-fixed<#if model.mainAds?? && model.mainAds?size &gt; 0> default</#if>">
    <ul class="gm-floor">
    </ul>
</div>
<script type="text/javascript">
    setTimeout(function () {
        $.ajax({
            url: stageJsServer+'/??/gmlib/unit/scode/1.0.0/scode.min.js,/gmlib/unit/bigdata/1.0.0/bigdata.min.js,/gmlib/unit/scodecommon/1.0.0/scodecommon.min.js?v=2',
            dataType: 'script'
        }).done(function(){
            s.pageName = '团购:品牌团';
            s.channel='团购';
            s.prop1='团购:品牌团';
            s.prop2='团购:品牌团';
            s.prop3='团购:品牌团';
            s.prop4='团购:品牌团';
            var s_code=s.t();
            if(s_code)document.write(s_code);
        });
    }, 700);
</script>