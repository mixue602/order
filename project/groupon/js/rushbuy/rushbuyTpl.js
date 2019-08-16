var rushbuyTpl = function (){
    this.rushbuyCurrentTpl = '{{if list && list.length>0}}'+
                                '{{each list as item index}}'+
                                    '{{if item.label}}'+
                                        '<li class="adverAll">'+
                                        '<div class="adver clearfix">'+
                                            '{{each item.children as adverList index}}'+                                               
                                                '<a href="{{adverList.url}}" target="_blank" title="{{adverList.name}}" data-code="{{item.modelId}}-{{index+1}}-1">'+
                                                    '<img class="descriptImg" src="//app.gomein.net.cn/images/grey.gif" gome-src="{{adverList.src}}" width="550" height="290" alt="{{adverList.name}}">'+
                                                '</a>'+    
                                            '{{/each}}'+
                                        '</div>'+
                                        '</li>'+
                                    '{{else}}'+
                                        '<li itemid="{{item.itemId}}" class="nor {{if index==0 && item.extend=="1"}}super{{else}}normal{{/if}}">'+
                                        '<a href="{{item.url}}" target="_blank" title="{{item.name}}" class="mi_img" data-code="{{item.modelid}}-{{index+1}}-1">'+
                                            '<span class="status_img"></span>'+
                                            '<img class="descriptImg" src="//app.gomein.net.cn/images/grey.gif" gome-src="{{item.imgUrl}}_260.jpg" width="260" height="260" alt="{{item.name}}">'+
                                        '</a>'+
                                        '{{if item.promoName!=""}}'+
                                            '<div class="topName"><p>{{item.promoName}}</p></div>'+
                                        '{{/if}}'+
                                        '{{if !item.code}}'+
                                            '<h2 class="mi_title">'+
                                                '<span class="gome">国美自营</span>'+
                                                '<a class="mi_name" href="{{item.url}}" data-code="{{item.modelid}}-{{index+1}}-2" target="_blank" title="{{item.name}}">{{item.name}}</a>'+
                                            '</h2>'+
                                            '<div class="mi_content">'+
                                                '<div class="mi_left">'+
                                                    '<div class="mi_price">'+
                                                        '¥<span></span>'+ 
                                                        '<del></del>'+     
                                                    '</div>'+
                                                    '<div class="mi_num">'+
                                                        '<span class="word">'+
                                                        '</span>'+
                                                        '<span class="percent"><span class="sale"></span></span>'+
                                                    '</div>'+
                                                '</div>'+
                                                '<div class="mi_right">'+
                                                        '<a class="jjks_btn" href="{{item.url}}" target="_blank" style="display:none" data-code="{{item.modelid}}-{{index+1}}-3">即将开始</a>'+
                                                        '<a class="yjs_btn" style="display:none;cursor:default;" data-code="{{item.modelid}}-{{index+1}}-3">已结束</a>'+
                                                        '<a class="yqg_btn" style="display:none;cursor:default;" data-code="{{item.modelid}}-{{index+1}}-3">已抢光</a>'+
                                                        '<a class="lijg_btn" href="{{item.url}}" target="_blank" style="display:none" data-code="{{item.modelid}}-{{index+1}}-3">立即抢购</a>'+
                                                '</div>'+
                                            '</div>'+
                                        '{{/if}}'+                                   
                                        '</li>'+
                                    '{{/if}}'+    
                                '{{/each}}'+
                            '{{/if}}';
    this.across = '{{if lis && lis.length>0}}'+
                    '{{each lis as acrossItem index}}'+
                        '<li>'+
                            '<a href="{{acrossItem.href}}" target="_blank" data-code="8000020003-{{index+1}}">'+
                            '<img src="//app.gomein.net.cn/images/grey.gif" gome-src="{{acrossItem.src}}">'+
                            '</a>'+
                        '</li>'+
                    '{{/each}}'+
                '{{/if}}';
};

