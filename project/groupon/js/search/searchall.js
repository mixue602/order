/**
 * 【真划算-分类列表页】
 * author dujiahui
 * time 2017-06-26
 */
 $(function(){
    var searchTpl = new window.keySearchTpl();
    var goodsTpl = searchTpl.goodTpl;
    var priceStatus = new window.priceStatus();
    //进入页面面包屑部分的参数存入一个对象 
    var searchLive = function(){
        var obj = $(".search_crumbs");
        this.pageData = {
            currentPage:obj.attr("currentpage"),
            sortType:obj.attr("sorttype"),
            begin:obj.attr("begin"),
            pageSize:obj.attr("pagesize"),
            totalPage:obj.attr("totalpage"),
            categoryNo:obj.attr("categoryno"),
            totalRec:obj.attr("totalRec")
        }; 
        this.init();
    };
    searchLive.prototype={
        init:function(){
            if(this.pageData.totalPage>1){
                this.setPage(this.pageData);
            } 
            priceStatus.eachScreenDom($(".search_products li")); //根据当前屏幕的$(".search_products li")请求价格状态并渲染页面
        },
        /**
        * @description 展示分页的方法
        * @method setPage(data) data pageInfo数据
        * @since 2017-06-28
        * @author dujiahui
        */
        setPage:function(data){
            var _this = this;        
            $('.pager').gPager({
                pageClass : "",
                currentPage : Number(data.currentPage),               
                totalPage : Number(data.totalPage),               
                pageSize : Number(data.pageSize),    
                clickCallback :function(curpage){
                    data.currentPage = curpage;
                    _this.getGoods(data);
                }
            })
        },
        /**
        * @description 分页请求商品数据
        * @method getGoods   dat表示接口需要的参数集合（必传）
        * @since 2017-06-28
        * @author dujiahui
        */
        getGoods:function(dat){
            var _this = this;
            $.ajax({
                type:"get",
                url:"//ajaxtuan"+cookieDomain+"/cheap/searchInfo",
                dataType:"jsonp",
                data:{
                    "pageSize":dat.pageSize,
                    "pageIndex": dat.currentPage,
                    "categoryId": dat.categoryNo,
                    "sort":dat.sortType,
                    "beginTime":dat.begin
                },
                beforeSend:function(){
                    $("#product_waiting").show();
                }
            }).done(function(data){
                _this.renderProduct(data);     
            }).fail(function(){
                $("#product_waiting").hide();
                var cateNo = dat.categoryNo;
                var errorHtml = _this.errorTemplate(cateNo);
                $(".search_products ul").html(errorHtml);
                $("#pager").css("display","none");
            })
        },
        /**
        * @description 请求成功之后渲染页面并触发价格请求事件
        * @method renderProduct   data分页请求成功返回的字段(必传)
        * @since 2017-06-28
        * @author dujiahui
        */
        renderProduct:function(data){
            var _this = this;
            var da = data.data;
            if(da.data && da.data.length>0){        
                //更新页面数据
                _this.pageData.currentPage=da.pageInfo.currentPage;
                _this.pageData.sortType=da.pageInfo.sortType;
                _this.pageData.begin=da.pageInfo.begin;
                _this.pageData.pageSize=da.pageInfo.pageSize;
                _this.pageData.totalPage=da.pageInfo.totalPage;
                _this.pageData.totalRec=da.pageInfo.totalRec; 
                $(".search_crumbs").attr({"sorttype":da.pageInfo.sortType,"begin":da.pageInfo.begin,"pagesize":da.pageInfo.pageSize,"totalPage":da.pageInfo.totalPage,"totalRec":da.pageInfo.totalRec});
                $("#product_waiting").hide();
                da.data.pageType = "category";
                priceStatus.tplRenderer(goodsTpl,{listData:da.data},$(".search_products ul"));
                var scrollHeight = $('.search_crumbs').offset().top;
                $(window).scrollTop(scrollHeight);
                if(da.pageInfo.totalPage>1){
                    $("#pager").css("display","block");
                    this.setPage(_this.pageData);
                }else{
                    $("#pager").css("display","none");
                }
                priceStatus.eachScreenDom($(".search_products li"));
            }else{
                $("#product_waiting").hide();
                var cateNo = _this.pageData.categoryNo;
                var errorHtml = _this.errorTemplate(cateNo);
                $(".search_products ul").html(errorHtml);
                $("#pager").css("display","none");
            }
        },
        /**
        * @description 错误的渲染模板
        * @method errorTemplate   categoryId分类的id(必传)
        * @since 2017-06-28
        * @author dujiahui
        */
        errorTemplate:function(categoryId){
            //return '<li class="error_tips">商品加载失败，请<a class="look" href="'+indexDomain+'/groupon/'+categoryId+'.html">刷新</a>试试</li>';
            return '<li class="error_tips">该条件下暂无商品，去试试其他条件吧</li>';
        }
    }
    var searchLi = new searchLive();
    //面包屑排序部分点击事件
    $(".search_crumbs li").on("click",function(){
        var _this = this;
        var dataAll = {
            "pageSize": $(".search_crumbs").attr("pagesize"),
            "currentPage": $(".search_crumbs").attr("currentpage"),
            "categoryNo": $(".search_crumbs").attr("categoryno"),
            "sortType":$(this).attr("sort")||0,
            "begin":$(this).attr("begin")||0
        };
        //更新页面sort等属性
        $(this).parent().find("i").attr("class","");
        switch($(this).attr("sort")){
            case "2":
                $(this).attr("sort","3").find("i").addClass("up");
                break;
            case "3":
                $(this).attr("sort","2").find("i").addClass("down");
                break;
            case "4":
                $(this).attr("sort","5").find("i").addClass("down");
                break;
            case "5":
                $(this).attr("sort","4").find("i").addClass("up");
                break;
            default:
                break;
        }
        $(".search_crumbs").find("li").removeClass("cur");
        $(this).addClass("cur");
        searchLi.getGoods(dataAll);               
    })
    //定时器鼠标滚动请求价格状态等
    var timer=null;
    $(window).scroll(function(){
        clearTimeout(timer);
        timer = setTimeout(function(){
            priceStatus.eachScreenDom($(".search_products li"));
        },100)
    })
 })