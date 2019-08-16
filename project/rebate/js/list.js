seajs.config({base:stageJsServer});
seajs.use(['gmlib/unit/gcity/1.0.0/gcity.min.js','gmlib/ui/gload/1.0.0/gload.min.js','gmlib/unit/pager/1.0.0/pager.min.js','/js/unit','/js/lazyload','/js/autopoint','/js/search','/js/getajaxprice'],function(){
    window.setTimeout(function () {
        var editMarks = $("#editModeId").attr("editMark");
        if (editMarks == 1) { //可视化编辑
            seajs.use(['gmlib/unit/gedit/1.0.0/dialogs',
                    'gmlib/unit/gedit/1.0.0/editmode',
                    'gmlib/unit/gedit/1.0.0/editmodule'
                ], function () {
                    editMode.init();
                }
            );
        }
        seajs.use(['gmlib/unit/scode/1.0.0/scode.min.js','gmlib/unit/bigdata/1.0.0/bigdata.min.js','gmlib/unit/scodecommon/1.0.0/scodecommon.min.js'],function(){
            s.pageName="返利:首页";
            s.channel="返利";
            s.prop1="返利:首页";
            s.prop2="返利:首页";
            s.prop3="返利:首页";
            s.prop4="返利";
            var s_code=s.t();
            if (s_code) {
                document.write(s_code);
            }
        })
    }, 2000);
    ;(function($){
        var searchval=null;//搜索关键字
        var rebate=function(){
            var _this =this;
            _this.init();
        };
        rebate.prototype={
            init:function(){
                var _this = this;
                // _this.imgGLoad();//懒加载
                _this.fliRender();//搜索
                _this.priceRange();//价格
                _this.gcity();//地址
                _this.toolbarfix();//筛选条件滚动固定
                _this.fnfilter();//刷选方法
            },
            imgGLoad:function(){//懒加载
                $('.map_dynamic,.map_server,.map_fenlei,.map_floor,.map_hot_box').lazyload({
                    source: "data-lazy-img"
                });
            },
            fliRender:function(){//搜索关键字
                var _this = this;
                var urltext = window.location.href;//http://search.gome.com.cn/search?question=%E7%94%B5%E8%84%91
               //var urltext ="http://search.gome.com.cn/search?question=手机";
                if(urltext.indexOf("question") != -1){
                    var keyVal=urltext.split("question=")[1];
                    if(keyVal.indexOf("&") != -1){
                        searchval = keyVal.split("&")[0];
                    }else{
                        searchval = keyVal;
                    }
                    searchval = searchval.replace(/\"/g,"'");
                    searchval=decodeURI(searchval);
                    //替换头部搜索框的关键字
                    $("#keyLabel").attr("default",searchval+",1",1);
                    $("#keyLabel").html(searchval);
                    $("#keyLabel").css("top","-50px");
                    $("#searchInput").val(searchval);
                    //当前位置
                    $(".fli_current .cur").html(searchval);
                    //渲染页面数据，综合
                    _this.getData(searchval,1)

                };
                //alert(encodeURI(encodeURI(searchval)))


            },
            fnfilter:function(){
                var _this =this;
                //alert(searchval)
                //价格
                $('#sort-price').bind('click', function (event) {//20降序：price-up ； 21升序：price-down
                    //if(!pageData.ajaxStatus){
                        var _this = $(this);
                        if(_this.attr('data-sort') === "21"){
                            _this.attr('data-sort',"20").removeClass("price-down").addClass("price-up");
                        }else{
                            _this.attr('data-sort',"21").removeClass("price-up").addClass("price-down");
                        }
                    //}
                });
                //复选框
                var filterKey = {
                    "sort":"00",
                    "productTag":"0",
                    "instock":"0"
                };
                //综合00、销量10、返利40,价格
                $('#filter-order-box li').bind('click', function (event) {//综合00、销量10、返利40,价格
                    var sort_target = $(this).attr('data-sort');//sort:综合00、销量10、返利40,价格21/20
                    $(this).addClass('cur').siblings('.cur').removeClass('cur');
                    filterKey.sort=sort_target;
                    _this.getData(searchval,1,filterKey);
                    //console.log(filterKey)
                }).find('a').click(function(event){
                    event.preventDefault();
                });
                //自营：1，有货：1，分享返利：200，购买返利：300，超级返利：100
                $('.filter-label-box .gmform-label').bind('click', function (event) {//20降序：price-up ； 21升序：price-down
                    //if(!pageData.ajaxStatus){
                    var _that = $(this);
                    //_this.addClass('checke').siblings('.cur').removeClass('cur');
                    if(_that.hasClass('checke')){
                        _that.removeClass("checke");
                        _that.attr("data-check","false");
                        if(_that.hasClass('ziying')){//自营
                            filterKey.productTag = 0;
                        }else if(_that.hasClass('huowu')){//有货无货
                            filterKey.instock = 0;
                        }else if(_that.hasClass('fanli')){
                            _that.removeClass("already");
                            if($(".already").length <1){
                               // filterKey.sale = _this.attr("data-value");
                                delete filterKey["sale"];
                            }else{
                                filterKey.sale = $(".already").attr("data-value");
                            }
                        }
                    }else{
                        _that.addClass("checke");
                        _that.attr("data-check","true");
                        if(_that.hasClass('ziying')){//自营
                            filterKey.productTag = 1;
                        }else if(_that.hasClass('huowu')){//有货无货
                            filterKey.instock = 1;
                        }else if(_that.hasClass('fanli')){
                            _that.addClass("already");
                            if($(".already").length >1){
                                filterKey.sale = 100;
                            }else{
                                filterKey.sale = _that.attr("data-value");
                            }
                        }
                    };
                    //console.log(filterKey)
                    _this.getData(searchval,1,filterKey);
                    //}
                });
                //价格区间 普通价格：startPrice endPrice；返利价格：startRebatePrice endRebatePrice
                $("#fc-btn-ok").bind("click", function(event) {
                    event.preventDefault();
                    var priceRange = "";
                    var price1 = $("#fc-lowPrice").val();
                    var price2 = $("#fc-highPrice").val();
                    if(price1 == "¥" && price2 == "¥"){
                        return false;
                    }else if(price1 == "¥"){
                        filterKey.startPrice = 0;
                        filterKey.endPrice = price2;
                        //priceRange="0x"+price2;
                    }else if(price2 == "¥"){
                        filterKey.startPrice = price1;
                        //priceRange=price1+"x*";
                    }else{
                        filterKey.startPrice = price1;
                        filterKey.endPrice = price2;
                        //priceRange = Math.min(price1, price2) + "x" + Math.max(price1, price2);
                    }
                    console.log(filterKey);
                    _this.getData(searchval,1,filterKey);
                });
                $("#fli-btn-ok").bind("click", function(event) {
                    event.preventDefault();
                    var priceRange = "";
                    var rebateprice1 = $("#fli-lowPrice").val();
                    var rebateprice2 = $("#fli-highPrice").val();
                    if(rebateprice1 == "¥" && rebateprice2 == "¥"){
                        return false;
                    }else if(rebateprice1 == "¥"){
                        filterKey.startRebatePrice = 0;
                        filterKey.endRebatePrice = rebateprice2;
                        //priceRange="0x"+price2;
                    }else if(rebateprice2 == "¥"){
                        filterKey.startRebatePrice = rebateprice1;
                        //priceRange=price1+"x*";
                    }else{
                        filterKey.startRebatePrice = rebateprice1;
                        filterKey.endRebatePrice = rebateprice2;
                        //priceRange = Math.min(price1, price2) + "x" + Math.max(price1, price2);
                    }
                    console.log(filterKey);
                    _this.getData(searchval,1,filterKey);
                });
                /*$('.filter-label-box .fanli').bind('click', function (event) {//分享返利和购买返利
                    //if(!pageData.ajaxStatus){
                    if($("#discountQiang").attr("data-value")=="true" && $("#discountRebate").attr("data-value")=="true"){
                        filterKey.sale = 100;
                    }else if($("#discountQiang").attr("data-value")=="true"){
                        filterKey.sale = 200;
                    }else if($("#discountRebate").attr("data-value")=="true"){
                        filterKey.sale = 300;
                    }else{
                        delete filterKey["sale"];
                    }
                    console.log(filterKey)
                });*/
                //console.log(filterKey)
            },
            getData:function(serachkey,pageNo,data){//serachkey：搜索关键字;pageNo：页码;sort:综合00、销量10、返利40,价格21/20
                var _data = data || {};
                var _this =this;
                var pageNum = pageNo || 1;
                //http://ss.atguat.com.cn/item/v1/channel/rebate/list/flag/channel/test?callback=test&question=手机
                var _url = "//ss" + cookieDomain+"/item/v1/channel/rebate/list/flag/channel/getdata?callback=getdata&question="+serachkey+"&pageNumber="+pageNum;
                $.ajax({
                    type: "get",
                    url: _url,
                    dataType:"jsonp",
                    data:_data,
                    jsonp: 'callback',
                    jsonpName: 'getdata',
                    success:function(data){
                        if(data){
                            if(data.dto && data.dto.length >0){//渲列表
                                if(data.parameter){
                                    var totalPage = parseInt((data.parameter.pageBar.totalPage ),10);//总页数
                                    var totalNum = parseInt((data.parameter.pageBar.totalCount),10);//总条数
                                    var currentPage = parseInt(data.parameter.pageNumber,10);//当前页数
                                    $(".fli_current .num").html("共"+totalNum+"个商品");
                                }
                                var listhtml = templateSimple('prdlistTpl', data);
                                $(".rebate_list").html(listhtml);
                                _this.smallpage(currentPage,totalPage,serachkey,_data)//小翻页
                                _this.pagerId(totalPage,currentPage,serachkey,_data);//翻页
                                $(".rebate_list").getAjaxPrice();
                                $(".rebate_noprd").hide();
                            }else{
                                $(".fli_current .num").html("共0个商品");
                                $(".rebate_list").html("");
                                $("#min-pager-number").text('1/1');
                                $("#y_page_in").html("");
                                $(".rebate_noprd").show();
                                $('#mp-prev').addClass('mp-disable');
                                $('#mp-next').addClass('mp-disable');
                                $("#mp-next,#mp-prev").unbind("click");
                            };
                            /*data.cookieDomain = window.cookieDomain;;*/
                        };
                    }
                })
            },
            pagerId:function(totalPage,currentPage,serachkey,_data){//分页插件
                var _this =this;
                var tPage = totalPage;
                var curPage  = currentPage || 1;
                /*$(".pager").gPager({
                 pageClass	 : "分页样式",
                 currentPage  : "当前页",
                 totalPage    : "总页数",
                 pageSize     : "每页显示的记录数",
                 clickCallback: cback				//分页回调方法
                 })*/
                $("#y_page_in").gPager({
                    pageClass  : "pager",
                    currentPage  : curPage,//当前页
                    totalPage    : tPage,//总页数
                    pageSize     : 10,
                    clickCallback: function(pageNo) {//pageNo位当前页
                        _this.getData(serachkey,pageNo,_data);
                        $("html,body").animate({scrollTop:$(".fli_box").offset().top},0);
                    }
                });
            },
            smallpage:function(currentPage,totalPage,serachkey,_data){//小翻页 当前页、总页数
                var _this = this;
                //右上角的小翻页
                $("#min-pager-number").text(currentPage+'/'+totalPage);
                if(currentPage > 1 && currentPage < totalPage){
                        $('#mp-prev').removeClass('mp-disable');
                        $('#mp-next').removeClass('mp-disable');
                }else if(currentPage > 1 && currentPage == totalPage){
                    $('#mp-prev').removeClass('mp-disable');
                    $('#mp-next').addClass('mp-disable');
                }else if(currentPage === 1 && currentPage == totalPage) {
                    $('#mp-prev').addClass('mp-disable');
                    $('#mp-next').addClass('mp-disable');
                }else{
                    if(currentPage === 1){
                        $('#mp-prev').addClass('mp-disable');
                        $('#mp-next').removeClass('mp-disable');
                    }else{
                        $('#mp-next').addClass('mp-disable');
                    }
                };
                $("#mp-next").bind('click', function (event) {
                    event.preventDefault();
                    /*if(currentPage >= totalPage || pageData.ajaxStatus){
                     return false;
                     }else{
                     pageData.ajaxStatus = true
                     }*/
                    if(currentPage >= totalPage){
                        return false;
                    }
                    currentPage++;
                    _this.getData(serachkey,currentPage,_data);

                });
                $("#mp-prev").bind('click', function (event) {
                    event.preventDefault();
                    /*if(pageData.currentPage == 1 || pageData.ajaxStatus){
                        return false;
                    }else{
                        pageData.ajaxStatus = true
                    }*/
                    if(currentPage == 1){
                        return false;
                    }
                    currentPage--;
                    _this.getData(serachkey,currentPage,_data);
                });
            },
            priceRange:function(){//价格
                $(".priceRange-input input,.pricefli-input input").bind({
                    keydown: function() {
                        $(this).val($(this).val().replace(/[A-Za-z`~!@#$%^&*_+=¥￥（）()<>?:"{},\/;'[\]！。......，…——、‘；—【】|？》《“：\\\-” \u4e00-\u9fa5]/g, ""));
                    },
                    keyup: function() {
                        $(this).val($(this).val().replace(/[A-Za-z`~!@#$%^&*_+=¥￥（）()<>?:"{},\/;'[\]！。......，…——、‘；—【】|？》《“：\\\-” \u4e00-\u9fa5]/g, ""));
                    },
                    focus: function() {
                        $(this).parents(".pricebox").addClass("filter-priceRange-click")
                    },
                    blur: function() {
                        "" == $(this).val() && $(this).val("¥")
                    }
                });
                $(".pricebox").bind("mouseleave", function() {
                    $(this).removeClass("filter-priceRange-click"), $(this).find(".priceRange-input input").trigger("blur")
                }).show();
                $("#fc-btn-cancel").bind("click", function() {
                    $(".priceRange-input input").val("¥")
                });
                $("#fli-btn-cancel").bind("click", function() {
                    $(".pricefli-input input").val("¥")
                });
//                $("#fc-btn-ok").bind("click", function(a) {
//                    a.preventDefault();
//                    var t = "",
//                        i = $("#fc-lowPrice").val(),
//                        s = $("#fc-highPrice").val();
//                    return ("¥" != s || "¥" != i) && (t = "¥" == i ? "0x" + s : "¥" == s ? i + "x*" : Math.min(i, s) + "x" + Math.max(i, s), void e(2).dofacet("price", t))
//                });
            },
            gcity:function(){//地址
                $('#address').gCity({
                    gc_ads:'chtm',
                    gc_evt:function(){
                        //your code
                        //重写城市cookie
                        $.cookie('atgregion',this.xid+"|"+this.chtm+"|"+this.cid+"|"+this.sid+"|"+this.zid,{expires:30,path:'/',domain:cookieDomain});
                        //重写八叉乐cookie
                        //$.cookie('atgMboxCity',this.snam,{expires:30,path:'/',domain:cookieDomain});
                    }
                });

            },
            toolbarfix:function(){//筛选条件滚动固定
                $(window).bind("scroll",function(){
                    var productLeftOffsetTop = $(".fli_listbox").offset()!=null?$(".fli_listbox").offset().top:0;
                    if($(document).scrollTop() >= productLeftOffsetTop){
                        $("#filter-box").addClass("onfixed");
                    }else{
                        $("#filter-box").removeClass("onfixed");
                    }
                });
            }
        };
        new rebate();
    })(jQuery)
});
