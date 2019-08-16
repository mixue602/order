// JavaScript Document
var editModule={
    edit:function(className,type,id,idName){
        var $floor_head = $(className);
        $floor_head.hover(function(){
            var This =this;
            $(This).addClass("deit-floor-out");
            if($('body').hasClass('.home')){
                var deitFloor=$(This).find("deit-floor-area");
                if(deitFloor.length<=0){
                    $(This).append(" <div class='deit-floor-area'></div>");
                }else{
                    console.log(deitFloor.length);
                };
            }else{
                $(This).append(" <div class='deit-floor-area'></div>");
            }
        },function(){
            var This =this;
            $(This).removeClass("deit-floor-out");
            $(This).children(".deit-floor-area").remove();
        });
        $floor_head.bind("click",function(){
            var This = this;
            var _this = this;
            //var modelType = $(_this).attr("modelType");
            //var _modelId = $(_this).attr("modelId");
            var modelType = $(_this).attr(type);
            var _modelId = $(_this).attr(id);
            var modelId = _modelId.replace(/\,/gi, "");
            /*版本回滚*/
            var urltext = window.location.href;//"http://preview.ds.atguat.com.cn/stage-web/channel.jsp?templateName=brandSpecial&ftlPath=brandStore/brandProNew&version=121337878787&edit=1"
            if(urltext.indexOf("version") != -1){
                var versionstr=urltext.split("version=")[1];
                if(versionstr.indexOf("&") != -1){
                    var version = versionstr.split("&")[0];
                }else{
                    var version = versionstr;
                }
            };
            //alert("modelType:"+modelType+"-----modelId:"+modelId+"----------"+urltext);
            /*if(modelType){
                _this.SDUrl =  $(idName).attr("editUrl") + "gcc/channel/channelPage_channelModelTypeModificationMain.do";
                if(version){
                    var url = _this.SDUrl + '?modelType=' + modelType + '&modelId=' + modelId + '&version=' + version;
                }else{
                     var url = _this.SDUrl + '?modelType=' + modelType + '&modelId=' + modelId;
                }
            }else{
                _this.SDUrl =  $(idName).attr("editUrl") + "gcc/channel/channelPage_channelMainLvlNext.do";
                 var url = _this.SDUrl + '?modelType=' + modelType + '&modelId=' + modelId;
            };*/
            var indexClass = $("body").hasClass('home');
            if(indexClass){
                if(version){
                    _this.SDUrl =  $(idName).attr("editUrl") + "gcc/channel/channelPage_channelMainLvlNext.do";
                    var url = _this.SDUrl + '?modelType=' + modelType + '&modelId=' + modelId + '&version=' + version;
                }else{
                    _this.SDUrl =  $(idName).attr("editUrl") + "gcc/channel/channelPage_channelMainLvlNext.do";
                    var url = _this.SDUrl + '?modelType=' + modelType + '&modelId=' + modelId;
                }
            }else{
                if(modelType){
                    _this.SDUrl =  $(idName).attr("editUrl") + "gcc/channel/channelPage_channelModelTypeModificationMain.do";
                    var url = _this.SDUrl + '?modelType=' + modelType + '&modelId=' + modelId;
                }else{
                    _this.SDUrl =  $(idName).attr("editUrl") + "gcc/channel/channelPage_channelMainLvlNext.do";
                    var url = _this.SDUrl + '?modelType=' + modelType + '&modelId=' + modelId;
                }
            }
            showModalDlg2(url, window, "850", "494","","","yes");
        });
    },
    reload:function (){
        $("body").append(" <div id='reload' class='reload-logo'>刷新页面</div>");
        $("#reload").bind("click",function(){
            $.ajax({
                type: "get",
                url: "/stage-web/pageTemplateClearCache.jsp",
                cache: false,
                success: function (data) {
                    data  = $.parseJSON(data);
                    if(data.result == "true"){
                        location.reload();
                    }

                }
            });
        });
    }
 }