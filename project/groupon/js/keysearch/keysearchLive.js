/**
 * 【真划算-搜索结果页】
 * author dujiahui
 * time 2017-06-30
 */
 $(function(){
    var keySearchTpl = new window.keySearchTpl();
    var keysearchCurTpl = keySearchTpl.goodTpl;
    var priceStatus = new window.priceStatus();
    var keySearchLive = function(){
        this.init();
    };
    keySearchLive.prototype={
        init:function(){
            var $page = $('.pager');
            var data = {
                'curPage':$page.data('curpage'),
                'totalPage':$page.data('totalpage'),
                'pageSize':$page.data('pagesize')
            }
            if($('#J_isEmptyGroup').val() == 'true'){
                //设置分页
                this.setPage(data);
            }else{
                //推荐猜你喜欢
                //this.emptyGroup();
            }
            priceStatus.eachScreenDom($(".keysearch_product li"));
        },
        /**
        * @description 展示分页的方法gPager
        * @method setPage(data) data 页面初始化获取的数据
        * @since 2017-06-28
        * @author dujiahui
        */
        setPage:function(data){
            var _this = this;        
            $('.pager').gPager({
                pageClass : "",
                currentPage : data.curPage,               
                totalPage : data.totalPage,               
                pageSize : data.pageSize,    
                clickCallback : _this.renderer
            })
        },
        /**
        * @description 分页点击之后的回调方法,根据关键字和当前页面请求获取商品
        * @method renderer() 
        * @since 2017-06-30
        * @author dujiahui
        */
        renderer: function (){
            var _this = this;
            var keywordTxt = ""+$('.keysearch_keyword').text();
            $.ajax({
                url:'//ajaxtuan'+cookieDomain+'/cheap/searchInfo?key='+encodeURIComponent(keywordTxt)+'&pageIndex='+_this.currentPage+'&sort=0&beginTime=0&callback=keysearch',
                dataType:'jsonp',
                type:'get',
                jsonp:'callbackparam',
                jsonpName:'keysearch',
                beforeSend:function(){
                    //loading 加载图
                    $("#product_waiting").show();
                }
            }).done(function(res){
                if(res.message == "SUCCESS" && res.code == '200' ){
                    $("#product_waiting").hide();
                    var data = res.data;
                    if(data.data && data.data.length>0){
                        data.data.pageType = "search";
                        priceStatus.tplRenderer(keysearchCurTpl, {listData:data.data}, $('#J_goodsList'));

                        if(data.pageInfo){
                            $('.pager').gPager({
                                pageClass : "",
                                currentPage: data.pageInfo.currentPage,
                                totalPage: data.pageInfo.totalPage,
                                pageSize: data.pageInfo.pageSize,         
                                clickCallback: _this.clickCallback
                            });
                        }
                        $(".search_pager").show();
                    }else if(data.pageInfo.totalPage && data.pageInfo.totalPage == 0){
                        var errorHtml = '<li class="error_tips">该条件下暂无商品，去试试其他条件吧 </li>';
                        $('#J_goodsList').html(errorHtml);
                        $(".search_pager").hide();
                    }else{
                        var errorHtml = '<li class="error_tips">商品加载失败，请<a class="look" href="'+indexDomain+'/groupon/searchKey/'+keywordTxt+'">刷新</a>试试</li>';
                        $('#J_goodsList').html(errorHtml);
                        console.log(res.description);
                    }
                    
                }else{
                    var errorHtml = '<li class="error_tips">该条件下暂无商品，去试试其他条件吧 </li>';
                    $('#J_goodsList').html(errorHtml);
                    $(".search_pager").hide();
                    console.log(res.description);
                }
            }).fail(function(){
                console.log("接口不通")
            })
            var scrollHeight = $('.keysearch_product').offset().top;
            $(window).scrollTop(scrollHeight);
        },
        /**
        * @description 没有数据的时候推荐猜你喜欢商品
        * @method emptyGroup() 
        * @since 2017-06-30
        * @author dujiahui
        */
        emptyGroup: function (){
            var _this = this;
            $.ajax({
                url:'//bigd.gome.com.cn/gome/recPromotionPvTotalRank?category3name=isnull&size=12&imagesize=360&callback=recPromotionPvTotalRankList',
                dataType:'jsonp',
                type:'get',
                jsonp:'callbackparam',
                jsonpName:'recPromotionPvTotalRankList'
            }).done(function(res){
                var data = {};
                data.data = res.productList
                priceStatus.tplRenderer(keysearchNoTpl, data, $('#J_goodsList'));
            }).fail(function(){
                console.log("接口不通");
            })
        }
    };
    var keysearchLi = new keySearchLive();
     //定时器鼠标滚动请求价格状态等
    var timer=null;
    $(window).scroll(function(){
        clearTimeout(timer);
        timer = setTimeout(function(){
            priceStatus.eachScreenDom($(".keysearch_product li"));
        },100)
    })
 })