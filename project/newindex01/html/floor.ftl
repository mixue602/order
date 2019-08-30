<#import "floor_template.ftl" as floorTemplate>
<#import "floor_bottom.ftl" as floorBottom>
<div class="lazy-fn-wrap clearfix <#if storeConfiguration.sync?? && (storeConfiguration.sync=='false')>async</#if>">
<#if (temps.temp.children.floor1and11.templates)?? && ((temps.temp.children.floor1and11.templates)?size>0)>
    <#list (temps.temp.children.floor1and11.templates) as tp>
        <div class="floor wbox edit-mode" modelId="${(tp.modelId)!}" modelType="" data-title="${tp.modelName!}" data-code-index="${(tp_index+1)!}"  <#if (storeConfiguration.sync)?? && ((storeConfiguration.sync)=='false')>data-time="${tp.time!}"</#if>>
            <#if (storeConfiguration.sync)?? && ((storeConfiguration.sync)=='true')>
                <@floorTemplate.floorTemplates floor=(tp_index+1) tp=tp />
            </#if>
        <#--楼层节日背景-start-->
            <#if (children.tempName.templates[0].temp.children.background.children.floor.children.bg.templates[tp_index])??>
                <#assign floor_bgbox = children.tempName.templates[0].temp.children.background.children.floor.children.bg.templates[tp_index]>
                <div class="floor_bg">
                    <#if (floor_bgbox.children.left.imgList)??>
                        <#assign leftbox = floor_bgbox.children.left.imgList>
                        <img class="left left${(tp_index)+1} edit-mode" modelId="${(floor_bgbox.children.left.modelId)!}-1"  data-lazy-img="0" src="${(gomeImgLoad)!}" data-lazy-init="${(leftbox[0].src)!}" width="300" height="300" <#if (leftbox[0].alt)??>alt="${(leftbox[0].alt)!}"</#if> title=""/>
                    </#if>
                    <#if (floor_bgbox.children.right.imgList)??>
                        <#assign rightbox = floor_bgbox.children.right.imgList>
                        <img class="right right${(tp_index)+1} edit-mode" modelId="${(floor_bgbox.children.left.modelId)!}-1" data-lazy-img="0" src="${(gomeImgLoad)!}" data-lazy-init="${(rightbox[0].src)!}" width="300" height="300" <#if (rightbox[0].alt)??>alt="${(rightbox[0].alt)!}"</#if> title=""/>
                    </#if>
                </div>
            </#if>
        <#--楼层节日背景-end-->
        <#--楼层圈子融合-->
            <#if (tp_index == 3)>
                <div class="quality pluspc_template " data-template="index_quality_life" style="height:0;overflow:hidden;"></div>
            </#if>
            <#if (tp_index == 7)>
                <div class="quality pluspc_template " data-template="index_topic_recommend" style="height:0;overflow:hidden;"></div>
            </#if>
        <#--楼层圈子融合-->
        </div>
    </#list>
</#if>
<#if (temps.temp.children.floorbottom)??>
    <#if (temps.temp.children.floorbottom.children.footfloor.templates)?? && ((temps.temp.children.floorbottom.children.footfloor.templates)?size>0)>
        <div class="floor temp3  edit-mode" modelId="${(temps.temp.children.floorbottom.modelId)!}" modelType="" data-title="${(temps.temp.children.floorbottom.modelName)!}" data-code-index="${((temps.temp.children.floor1and11.templates)?size+1)}" data-time="${(temps.temp.children.floorbottom.time)!}">
            <#if (storeConfiguration.sync)?? && ((storeConfiguration.sync)=='true')>
                    <@floorBottom.floorBottoms tp=(temps.temp.children.floorbottom.children.footfloor.templates)/>
                </#if>
        </div>
    </#if>
</#if>
</div>