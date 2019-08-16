<#import "floor_template.ftl" as floorTemplate>
<#import "floor_bottom.ftl" as floorBottom>
<#if (children.tempName.templates[3].temp.children.floor1and11.templates)?? && ((children.tempName.templates[3].temp.children.floor1and11.templates)?size>0)>
 <#assign floorList =(children.tempName.templates[3].temp.children.floor1and11.templates)>
 <#assign length =(floorList?size)>
</#if>
<#if (children.tempName.templates[3].temp.children.floorbottom.children.footfloor.templates)??>
    <#assign floorbottom = (children.tempName.templates[3].temp.children.floorbottom.children.footfloor.templates)>
</#if>
<#if storeConfiguration.floor?? && (storeConfiguration.floor?number>0) && ((storeConfiguration.floor?number)<=length)>

      <@floorTemplate.floorTemplates floor=(storeConfiguration.floor) tp=(floorList[(storeConfiguration.floor?number-1)])/>

<#elseif storeConfiguration.floor?? && (storeConfiguration.floor?number==0)>
        <@floorBottom.floorBottoms tp=floorbottom/>
</#if>
