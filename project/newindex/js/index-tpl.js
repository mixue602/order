/*TMODJS:{"version":"1.0.0"}*/
;(function () {
    if(!this.gomeTemplate){
        function template (filename, content) {
            return (
                /string|function/.test(typeof content)
                ? compile : renderFile
            )(filename, content);
        };


        var cache = template.cache = {};

        function toString (value, type) {

            if (typeof value !== 'string') {

                type = typeof value;
                if (type === 'number') {
                    value += '';
                } else if (type === 'function') {
                    value = toString(value.call(value));
                } else {
                    value = '';
                }
            }

            return value;

        };


        var escapeMap = {
            "<": "&#60;",
            ">": "&#62;",
            '"': "&#34;",
            "'": "&#39;",
            "&": "&#38;"
        };


        function escapeFn (s) {
            return escapeMap[s];
        }


        function escapeHTML (content) {
            return toString(content)
            .replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
        };


        var isArray = Array.isArray || function(obj) {
            return ({}).toString.call(obj) === '[object Array]';
        };


        function each (data, callback) {
            if (isArray(data)) {
                for (var i = 0, len = data.length; i < len; i++) {
                    callback.call(data, data[i], i, data);
                }
            } else {
                for (i in data) {
                    callback.call(data, data[i], i);
                }
            }
        };


        function resolve (from, to) {
            var DOUBLE_DOT_RE = /(\/)[^/]+\1\.\.\1/;
            var dirname = ('./' + from).replace(/[^/]+$/, "");
            var filename = dirname + to;
            filename = filename.replace(/\/\.\//g, "/");
            while (filename.match(DOUBLE_DOT_RE)) {
                filename = filename.replace(DOUBLE_DOT_RE, "/");
            }
            return filename;
        };


        var utils = template.utils = {

            $helpers: {},

            $include: function (filename, data, from) {
                filename = resolve(from, filename);
                return renderFile(filename, data);
            },

            $string: toString,

            $escape: escapeHTML,

            $each: each
            
        };


        var helpers = template.helpers = utils.$helpers;


        function renderFile (filename, data) {
            var fn = template.get(filename) || showDebugInfo({
                filename: filename,
                name: 'Render Error',
                message: 'Template not found'
            });
            return data ? fn(data) : fn; 
        };


        function compile (filename, fn) {

            if (typeof fn === 'string') {
                var string = fn;
                fn = function () {
                    return new String(string);
                };
            }

            var render = cache[filename] = function (data) {
                try {
                    return new fn(data, filename) + '';
                } catch (e) {
                    return showDebugInfo(e)();
                }
            };

            render.prototype = fn.prototype = utils;
            render.toString = function () {
                return fn + '';
            };

            return render;
        };


        function showDebugInfo (e) {

            var type = "{Template Error}";
            var message = e.stack || '';

            if (message) {
                // 利用报错堆栈信息
                message = message.split('\n').slice(0,2).join('\n');
            } else {
                // 调试版本，直接给出模板语句行
                for (var name in e) {
                    message += "<" + name + ">\n" + e[name] + "\n\n";
                }  
            }

            return function () {
                if (typeof console === "object") {
                    console.error(type + "\n\n" + message);
                }
                return type;
            };
        };


        template.get = function (filename) {
            return cache[filename.replace(/^\.\//, '')];
        };


        template.helper = function (name, helper) {
            helpers[name] = helper;
        };

        this.gomeTemplate = template;
    }
    var gomeTemplate = template = this.gomeTemplate;

    if (typeof define === 'function') {define(function() {return template;});} else if (typeof exports !== 'undefined') {module.exports = template;}
    
    /*v:1*/
gomeTemplate('index-floor',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,list=$data.list,$each=$utils.$each,li_item=$data.li_item,li_index=$data.li_index,$escape=$utils.$escape,extra=$data.extra,$out='';$out+='<ul class="main_inner"> ';
if(list){
$out+=' ';
$each(list,function(li_item,li_index){
$out+=' <li> ';
if(li_item.goodsImgs[0] != ""){
$out+=' <a href="';
$out+=$escape(li_item.detailHref);
$out+='" data-code="';
$out+=$escape(extra.i+'-');
$out+=$escape(li_index + 1);
$out+='" target="_blank" title="';
$out+=$escape(li_item.name);
$out+='"> ';
if((li_item.manualImg)){
$out+=' <img class="lazyloading" src="';
$out+=$escape(li_item.manualImg);
$out+='" alt="';
$out+=$escape(li_item.name);
$out+='" width="130" height="130"> ';
}else if((li_item.goodsImgs && li_item.goodsImgs.length>0)){
$out+=' <img class="lazyloading" src="';
$out+=$escape(li_item.goodsImgs[0].src);
$out+='_130.jpg" alt="';
$out+=$escape(li_item.name);
$out+='" width="130" height="130" > ';
}
$out+=' <p class="p_name">';
$out+=$escape(li_item.name);
$out+='</p> ';
if((li_item.salesPromotionTitle)){
$out+=' <p class="p_price">';
$out+=$escape(li_item.salesPromotionTitle);
$out+='</p> ';
}else{
$out+=' <p class="p_price" productId="';
$out+=$escape(li_item.productId);
$out+='" sku="';
$out+=$escape(li_item.sku);
$out+='" priceFlag="true"></p> ';
}
$out+=' </a> ';
}
$out+=' </li> ';
});
$out+=' ';
}
$out+=' </ul> ';
return new String($out);
});/*v:38*/
gomeTemplate('tuan',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,indexRushItem=$data.indexRushItem,$each=$utils.$each,list=$data.list,list_index=$data.list_index,$escape=$utils.$escape,extra=$data.extra,$out='';$out+=' ';
if(indexRushItem){
$out+=' <div class="list"> <div class="lay first"> ';
$each(indexRushItem,function(list,list_index){
$out+=' ';
if(list_index<=3){
$out+=' <div class="list_li ';
$out+=$escape(list_index);
$out+='"> <a href="';
$out+=$escape(extra.domain);
$out+='/q?itemId=';
$out+=$escape(list.itemId);
$out+='" target="_blank" title="';
$out+=$escape(list.goods_name);
$out+='" data-code="indextuan';
$out+=$escape(list_index+1);
$out+='"> <img class="lazyloading" src="';
$out+=$escape(list.goods_img);
$out+='_120.jpg" alt="';
$out+=$escape(list.goods_name);
$out+='" title="';
$out+=$escape(list.goods_name);
$out+='" width="120" height="120" /> <div class="p_price"> <span>¥</span><i>';
$out+=$escape(list.goods_tg_price);
$out+='</i> ';
if(list.priceDisplay==true && list.goods_detailprice != null){
$out+=' <i class="del">¥';
$out+=$escape(list.goods_detailprice);
$out+='</i> ';
}
$out+=' </div> <p class="p_name">';
$out+=$escape(list.goods_name);
$out+='</p> </a> </div> ';
}
$out+=' ';
});
$out+=' </div> ';
if(indexRushItem.length>4){
$out+=' <div class="lay two"> ';
$each(indexRushItem,function(list,list_index){
$out+=' ';
if(list_index > 3){
$out+=' <div class="list_li ';
$out+=$escape(list_index);
$out+='"> <a href="';
$out+=$escape(extra.domain);
$out+='/q?itemId=';
$out+=$escape(list.itemId);
$out+='" target="_blank" title="';
$out+=$escape(list.goods_name);
$out+='" data-code="indextuan';
$out+=$escape(list_index+1);
$out+='"> <img class="lazyloading" src="';
$out+=$escape(list.goods_img);
$out+='_120.jpg" alt="';
$out+=$escape(list.goods_name);
$out+='" title="';
$out+=$escape(list.goods_name);
$out+='" width="120" height="120" /> <div class="p_price"> <span>¥</span><i>';
$out+=$escape(list.goods_tg_price);
$out+='</i> ';
if(list.priceDisplay==true && list.goods_detailprice != null){
$out+=' <i class="del">¥';
$out+=$escape(list.goods_detailprice);
$out+='</i> ';
}
$out+=' </div> <p class="p_name">';
$out+=$escape(list.goods_name);
$out+='</p> </a> </div> ';
}
$out+=' ';
});
$out+=' </div> ';
}
$out+=' </div> ';
}
return new String($out);
});

})();