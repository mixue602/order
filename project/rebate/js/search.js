/**
 * @Author   unkonw
 * @Change   Silence
 * @QQ       82568873
 * @Mail     shixiaoqiang@yolo24.com
 * @DateTime 2015-07-30
 */

//搜索提交
function doSearch()
{
    var inputKey = $("#searchInput").val();
    if($.trim(inputKey) == "")
    {
        var defaultKey = $("#keyLabel").text();
        $("#keyLabel").hide();
        $("#searchInput").val(defaultKey);
    }
    if(inputKey.length>40){
        inputKey = inputKey.substring(0,40);
        $("#searchInput").val(inputKey);
    }

    $("#searchForm").submit();
    return false;
}

//关键字验证
function keyCheck(){
    var keyValue=$.trim($("#searchInput").val());
    if(keyValue==""){
        $("#searchInput").val("手机");
        return false;
    }
}

//搜索输入提示
$(function(){
    //autopoint
    if ($("#searchInput").length > 0 ) { 
        $("#searchInput").autopoint({
            //url :'//apis'+cookieDomain+'/p/suggest?from=rebate_pc',
            url :'//apis.gome.com.cn/p/suggest?from=rebate_pc',
            environment:environment,
            targetType:targetType,
            contentLabels:contentLabels,
            language:language
        });
    } 
    //ginputfocus
    $("#searchInput").ginputfocus();
});


//取默认搜索关键字
function getDefaultKey(value1){
    var keys=value1.split(";"),num=0,keywords=[];
    $.each(keys,function(i,t){
        var item=t.split(","),qz=item[1]|0;//权重 转化为整数
        for(var i=0;i<qz;i++)keywords.push(item[0]);
        num+=qz;
    });

    return keywords[Math.random()*num|0]||"";
}

//设置默认搜索关键字
$(function(){

    var defaultKeyStr = $("#keyLabel").attr('default');
    if(defaultKeyStr != null && defaultKeyStr != "")
    {
        var defaultKey = getDefaultKey(defaultKeyStr);
        $("#keyLabel").text(defaultKey.replace(/(^\s*)|(\s*$)/g, ""));
    }

    /**
     * 如果用户输入了搜索关键字，需要保留
     * 如果查询无结果也保留此关键字
     */
   /* if($('span.gjz').text() != '') {
        $("#searchInput").val($('span.gjz').text().replace(/[\“,\”]/g,''));
    } else if($('input.t-input').val() != '') {
        $("#searchInput").val($('input.t-input').val());
    }*/

    var searchInputVal = $("#searchInput").val();

    if(searchInputVal == null || searchInputVal == ""){
        $("#keyLabel").show();
    }
    else
    {
        $("#keyLabel").hide();
    }

});