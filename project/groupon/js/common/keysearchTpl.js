var keySearchTpl=function(){
    this.goodTpl='{{if listData && listData.length>0}}'+
                    '{{each listData as item index}}'+
                        '<li itemid="{{item.itemId}}" modelid="{{if listData.pageType == "category"}}8000050002{{else}}8000060001{{/if}}">'+
                            '<div class="prod_img">'+
                                '<a class="item_link" data-code="{{if listData.pageType == "category"}}8000050002{{else}}8000060001{{/if}}-{{index+1}}_1_1" href="{{item.url}}" target="_blank" title="{{item.title}}">'+
                                    '<span class="status_img"></span>'+
                                    '<img src="//app.gomein.net.cn/images/grey.gif" gome-src="{{item.imgUrl}}_260.jpg" alt="{{item.title}}" width="260" height="260">'+
                                '</a>'+
                            '</div>'+
                            '<div class="prod_info">'+
                                '<span style="display:none">国美自营</span>'+
                                '<a class="item_link" data-code="{{if listData.pageType == "category"}}8000050002{{else}}8000060001{{/if}}-{{index+1}}_2_1" href="{{item.url}}" target="_blank" title="{{item.title}}">{{item.title}}</a>'+
                            '</div>'+
                            '<div class="prod_price">'+
                                '<div class="prod_price_left">'+
                                    '<p class="price">¥<span class="priceNum">0</span><del class="cost"></del></p>'+
                                    '<p class="num">'+
                                        '<span class="sale">已售<span>100</span>%</span>'+
                                        '<span class="percent"><span></span></span>'+
                                    '</p>'+
                                '</div>'+
                                '<div class="prod_price_right">'+
                                    '<a data-code="{{if listData.pageType == "category"}}8000050002{{else}}8000060001{{/if}}-{{index+1}}_3_1" href="{{item.url}}" target="_blank">立即抢购</a>'+
                                '</div>'+
                            '</div>'+
                        '</li>'+
                    '{{/each}}'+
                '{{/if}}';
}