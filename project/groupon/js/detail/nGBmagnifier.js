/*
 * Plugin name - gMagnifier
 * Version - v1.0
 * Updated - 2012-11-20
 * author - liuxiaofan
 * author's blog - http://liuxiaofan.com
 * 参数说明：
 *
 */

/* 放大镜效果 */	
(function($){
$.fn.gMagnifier=function(options){ 
		var ts=$(this).parent();
		var settings={
			xzoom:420,yzoom:420,offset:10,position:"right",lens:1,preload:1
		};
		if(options){
			$.extend(settings,options);
		}
		var noalt='';
		$(this).hover(function(){
			var imageLeft=$(this).offset().left;
			var imageTop=$(this).offset().top;
			var imageWidth=$(this).children('img').get(0).offsetWidth;
			var imageHeight=$(this).children('img').get(0).offsetHeight;
			noalt=$(this).children("img").attr("alt");
			var bigimage=$(this).children("img").attr("jqimg");
			$(this).children("img").attr("alt",'');
			if(ts.find("div.zoomdiv").size()==0){
				$(this).after("<div class='zoomdiv'><img class='bigimg' src='"+bigimage+"'/></div>");
				$(this).append("<div class='jqZoomPup'>&nbsp;</div>");
			}
			if(settings.position=="right"){
				if(imageLeft+imageWidth+settings.offset+settings.xzoom>screen.width){
					leftpos=imageLeft-settings.offset-settings.xzoom;
				}
				else{
					leftpos=imageLeft+imageWidth+settings.offset;
				}
			}
			else{
				leftpos=imageLeft-settings.xzoom-settings.offset;
				if(leftpos<0){
					leftpos=imageLeft+imageWidth+settings.offset;
				}
			}
			ts.find("div.zoomdiv").css({
				top:imageTop,left:leftpos
			});
			ts.find("div.zoomdiv").width(settings.xzoom);
			ts.find("div.zoomdiv").height(settings.yzoom);
			ts.find("div.zoomdiv").show();
			if(!settings.lens){
				$(this).css('cursor','crosshair');
			}
			$(document.body).mousemove(function(e){
				mouse=new MouseEvent(e);
				var bigwidth=ts.find(".bigimg").get(0).offsetWidth;
				var bigheight=ts.find(".bigimg").get(0).offsetHeight;
				var scaley='x';
				var scalex='y';
				if(isNaN(scalex)|isNaN(scaley)){
					var scalex=(bigwidth/imageWidth);
					var scaley=(bigheight/imageHeight);
					//$("div.jqZoomPup").width((settings.xzoom)/(scalex*1));
					//$("div.jqZoomPup").height((settings.yzoom)/(scaley*1));
					ts.find("div.jqZoomPup").width(200);
					ts.find("div.jqZoomPup").height(200);
					
					if(settings.lens){
						ts.find("div.jqZoomPup").css('visibility','visible');
					}
				}
				xpos=mouse.x-ts.find("div.jqZoomPup").width()/2-imageLeft;
				ypos=mouse.y-ts.find("div.jqZoomPup").height()/2-imageTop;
				if(settings.lens){
					xpos=(mouse.x-ts.find("div.jqZoomPup").width()/2 < imageLeft ) ? 0 : (mouse.x + ts.find("div.jqZoomPup").width()/2>imageWidth+imageLeft)?(imageWidth-ts.find("div.jqZoomPup").width()):xpos;
					ypos=(mouse.y-ts.find("div.jqZoomPup").height()/2 < imageTop ) ? 0 : (mouse.y + ts.find("div.jqZoomPup").height()/2>imageHeight+imageTop)?(imageHeight-ts.find("div.jqZoomPup").height()):ypos;
				}
				if(settings.lens){
					ts.find("div.jqZoomPup").css({
						top:ypos,left:xpos
					});
				}
				scrolly=ypos;
				ts.find("div.zoomdiv").get(0).scrollTop=scrolly*scaley;
				scrollx=xpos;
				ts.find("div.zoomdiv").get(0).scrollLeft=(scrollx)*scalex;
			});
		}
		,function(){
			$(this).children("img").attr("alt",noalt);
			$(document.body).unbind("mousemove");
			if(settings.lens){
				ts.find("div.jqZoomPup").remove();
			}
			ts.find("div.zoomdiv").remove();
		});
		count=0;
		if(settings.preload){
			$('body').append("");
			$(this).each(function(){
				var imagetopreload=$(this).children("img").attr("jqimg");
				var content=$('div.jqPreload'+count+'').html();
				$('div.jqPreload'+count+'').html(content+'<img src=\"'+imagetopreload+'\">');
			});
		}
	}
	function MouseEvent(e){
	this.x=e.pageX;
	this.y=e.pageY;
}

})(jQuery);
