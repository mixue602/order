var indexTpl = function(){
    this.productTpl = '{{if lit && lit.length>0}}'+
                        '{{each lit as item index}}'+
                            '<li class="buying {{if item.status=="ending"}}end{{else if item.status=="soldOut"}}sold{{else if item.status=="notStarted"}}notstarted{{/if}}">'+
                                '<div class="prod_img">'+
                                    '<a data-code="{{lit.modelId}}-{{index+1}}_1" href="{{item.url}}" target="_blank" title="{{item.name}}">'+
                                        '<img src="//app.gomein.net.cn/images/grey.gif" gome-src="{{item.imgUrl}}_260.jpg" alt="{{item.name}}" width="260" height="260">'+
                                    '</a>'+
                                '</div>'+
                                '<div class="prod_info">'+
                                    '{{if item.gomePrd==true}}'+
                                        '<span>国美自营</span>'+
                                    '{{/if}}'+
                                    '<a data-code="{{lit.modelId}}-{{index+1}}_2" href="{{item.url}}" target="_blank" title="{{item.name}}">{{item.name}}</a>'+
                                '</div>'+
                                '<div class="prod_price">'+
                                    '<div class="prod_left">'+
                                        '<p class="price">'+
                                            '<span>¥</span>{{item.rushPrice}}'+
                                            '{{if item.priceDisplay==true}}'+
                                                '<del class="cost">¥{{item.detailPrice}}</del>'+
                                            '{{/if}}'+
                                        '</p>'+
                                        '{{if item.status=="notStarted"}}'+
                                            '<p class="count">精品尖货，敬请关注</p>'+ 
                                        '{{else}}'+
                                            '<p class="count">'+
                                                '<span class="precent">已售{{item.salePercent}}%</span>'+
                                                '<span class="sale"><span style="width:{{item.salePercent}}px"></span></span>'+
                                            '</p>'+
                                        '{{/if}}'+
                                    '</div>'+
                                    '<div class="prod_right">'+
                                        '{{if item.status=="ending"}}<a style="cursor:default">已结束</a>'+
                                        '{{else if item.status=="soldOut"}}<a style="cursor:default">已抢光</a>'+
                                        '{{else if item.status=="notStarted"}}<a data-code="{{lit.modelId}}-{{index+1}}_3" href="{{item.url}}"  target="_blank" style="cursor:default">即将开始</a>'+
                                        '{{else if item.status=="buying"}}<a data-code="{{lit.modelId}}-{{index+1}}_3" href="{{item.url}}" target="_blank" style="cursor:default">立即抢购</a>{{/if}}'+
                                    '</div>'+
                                '</div>'+
                                '<div class="gray_img"></div>'+
                            '</li>'+
                        '{{/each}}'+
                        '{{/if}}';
    this.errorTpl = '<p class="errorBox">商品加载失败，请<a href="javascript:void(0)" class="look">刷新</a>试试</p>';
    this.loadTpl = '<div class="product-waiting">'+
                        '<img src="//img.gomein.net.cn/gmlib/ui/loading/2.0.0/loading.gif">'+
                    '</div>';
    this.btnTpl = '<div class="btn btn_pre">'+
                        '<p class="pre_bg"></p>'+
                    '</div>'+
                    '<div class="btn btn_next">'+
                        '<p class="next_bg"></p>'+
                    '</div>';
}