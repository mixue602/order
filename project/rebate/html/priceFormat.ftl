<#macro priceFormat curprice>
	<#if curprice?? && (curprice > 0)>
		<#assign price=curprice?c >
		<#assign beforePoint = "" >
	    <#assign afterPoint = "" >
	    <#if price?string?split(".")?? && (price?string?split(".")?size)=2>
    		<#assign beforePoint = price?string?split(".")[0] >
    		<#assign afterPoint = price?string?split(".")[1] >
    		<#if afterPoint?length = 1>
    			<#assign afterPoint=afterPoint+"0">
    		</#if>
    	<#else>
    		<#assign beforePoint = price?string >
    		<#assign afterPoint = "00" >
    	</#if>
${beforePoint}.${afterPoint}
    <#else>
    	暂无价格	
	</#if>
</#macro>