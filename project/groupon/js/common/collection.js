//真划算收藏效果
var collectionOff=false; //初始化，是否触发收藏按钮
var tuanCollection={//真划算收藏
    totalPage:1,  //总页数初始化
    pageSize:4,  //每页显示的个数初始化
    pageCurrent:1, //当前页数初始化
    dataCount:0, //被收藏数据的个数
    flag:0,    //标识，暂时没用到，之前用来控制收藏接口的频率
    clickCollectButton:function(){//点击团购收藏按钮，显示收藏相关内容
        $("#noLogin").hide();
        $('#okLogin').show();
    },
    getCollection:function(){//获得团购收藏接口
        // if(tuanCollection.flag==0) {
            $.ajax({
                type:"get",
                url:"//ss"+cookieDomain+"/item/v1/groupon/"+loginData.loginId+"/flag/tuan/collec",
                dataType:"jsonp",
                async:false,
                cache:false,
                jsonpName:"collec",
                jsonpCallback:"collec",
                success:function(data){
                    tuanCollection.getCollecGoods(data);//获得团购收藏商品
                    // tuanCollection.flag=1;
                },
                error:function(e){
                    console.log('error');
                }
            })
        // }
    },
    //根据接口返回数据，获取分页的总页数
    calculatePageInfo:function(total){
        tuanCollection.totalPage=parseInt(total/tuanCollection.pageSize);
        tuanCollection.dataCount=total;
        if(total>tuanCollection.pageSize){
            if(tuanCollection.totalPage*tuanCollection.pageSize<total){
                tuanCollection.totalPage=tuanCollection.totalPage+1;
            }
        }
    },
    getCollecGoods:function(data){//获得团购收藏商品
        if(data.groupIds==""){ //如果没有数据，调用无收藏数据时的展示样式
            tuanCollection.noCollectionGoods();  
            return;
        }else{
            $("#assistant-box-c-list").html("");
            var groupCount=data.groupIds.length;
            //根据接口返回数据，获取分页的总页数
            tuanCollection.calculatePageInfo(groupCount);
            //渲染收藏的数据
            for(var i=0;l=groupCount,i<l;i++){
                var obj=data.groupIds[i];
                var display="display:none";
                var content="";
                content+='<li class="clearfix all" dataIndex='+i+' style='+display+' data-groupid="'+obj.grouponId+'" data-groupstatus="'+obj.status+'">\
                            <div class="assistant-img-box">\
                                <a title="'+obj.displayName+'" href="'+obj.url+'" target="_blank">\
                                    <img src="'+obj.picture+'_60.jpg" alt="'+obj.displayName+'">\
                                </a>\
                            </div>\
                            <div class="assistant-info-box">\
                                <p class="info-name">\
                                    <a target="_blank" title="'+obj.displayName+'" href="'+obj.url+'">'+obj.displayName+'</a>\
                                </p>\
                                <p class="info-price">\
                                    <span>¥'+parseFloat(obj.priceDecimals).toFixed(2)+'</span>\
                                </p>\
                                <p class="info-count"><em>'+obj.buyquantity+'</em>人已购买</p>\
                                <i id="'+obj.grouponId+'" class="ico-rit-del" y="0"></i>\
                            </div>\
                        </li>'
                $(content).appendTo('.assistant-box-c .assistant-box-list');
            }
            //点击全部、已开始、未开始时展示的效果
            tuanCollection.showCollection();
            //hover 到已收藏元素上，显示删除按钮、hover上去样式变化
            tuanCollection.collectionItenHover();
        }
    },
    showCollectPage:function(){//显示团购收藏分页（上一页、下一页的样式）
        $('.pop-pagination').html("");
        if(tuanCollection.totalPage>1){
            var str = '<div class="assistant-page">';
            if(tuanCollection.pageCurrent==1){
                str+='<a class="pop-pagi-prev" onselectstart="return false">&lt;&nbsp;上一页</a><span class="pop-pagi-num"><b id="gpnum" class="light">'+tuanCollection.pageCurrent+'</b>/'+tuanCollection.totalPage+'</span><a class="pop-pagi-next" name="2" onselectstart="return false" onclick="tuanCollection.getNextPage()" y="0">下一页&nbsp;&gt;</a>';
            }else if(tuanCollection.pageCurrent == tuanCollection.totalPage){
                var prePage=tuanCollection.pageCurrent-1;
                str+='<a class="pop-pagi-prev" onselectstart="return false" onclick="tuanCollection.getPrePage()" name="'+prePage+'" y="0">&lt;&nbsp;上一页</a><span class="pop-pagi-num"><b id="gpnum" class="light">'+tuanCollection.pageCurrent+'</b>/'+tuanCollection.totalPage+'</span><a class="pop-pagi-next" onselectstart="return false">下一页&nbsp;&gt;</a>';
            }else{
                var nextpage=tuanCollection.pageCurrent+1;
                var prePage=tuanCollection.pageCurrent-1;
                str+='<a class="pop-pagi-prev" onselectstart="return false" onclick="tuanCollection.getPrePage()" name="'+prePage+'" y="0">&lt;&nbsp;上一页</a><span class="pop-pagi-num"><b id="gpnum" class="light">'+tuanCollection.pageCurrent+'</b>/'+tuanCollection.totalPage+'</span><a class="pop-pagi-next" onselectstart="return false" onclick="tuanCollection.getNextPage()" name="'+nextpage+'" y="0">下一页&nbsp;&gt;</a>';
            }
            str+='</div><a class="remove" id="qinggroup" onclick="tuanCollection.clearCollect()" y="0">清空</a>';
            $(".pop-pagi-box").show();
            $(".gbfav-cont").css('padding-bottom', '30px');
        }else{
            $('.pop-pagi-box').hide();
            $(".assistant-box-c .assistant-remove").hide();
            $(".gbfav-cont").css('padding-bottom', '0');
        }
        $('.pop-pagination').html(str);
    },
    //点击全部、已开始、未开始时展示的效果
    showCollection:function(){
        var statusName = $(".collection-status a.cur").html();
        if(statusName=="全部"){
            dataArray = $("#assistant-box-c-list").find(".all");
        }else if(statusName=="已开始"){
            dataArray = $("#assistant-box-c-list").find("li[data-groupstatus=buying]")
        }else if(statusName=="未开始"){
            dataArray = $("#assistant-box-c-list").find("li[data-groupstatus=notStarted]");
        }
        $("#assistant-box-c-list").find(".all").each(function(){
            $(this).css("display","none");
        });
        if(dataArray.length==0){  //如果分类下没有数据，调用无数据时的展示效果
            tuanCollection.noCollectionGoods();
        }else{
            //隐藏暂无收藏的真划算商品 这种提示语
            tuanCollection.clearNoCollentionGoods();
            //根据接口返回数据，获取分页的总页数
            tuanCollection.calculatePageInfo(dataArray.length);
            //设置分页器的样式（上一页、下一页、清空等）
            tuanCollection.showCollectPage();

            //在当前页的数据显示，不在当前页的数据隐藏
            var curPage = tuanCollection.pageCurrent;
            for(var i=0;i<dataArray.length;i++){
                if(i>=(curPage-1)*tuanCollection.pageSize&&i<curPage*tuanCollection.pageSize){
                    $(dataArray[i]).css("display","block");
                }else{
                    $(dataArray[i]).css("display","none");
                }
            }
        }
    },
    getPrePage:function(){//加入团购收藏上一页
        collectionOff=true;
        tuanCollection.pageCurrent = tuanCollection.pageCurrent - 1;
        //点击全部、已开始、未开始时展示的效果
        tuanCollection.showCollection();
    },
    getNextPage:function(){//加入团购收藏下一页
        collectionOff=true;
        tuanCollection.pageCurrent = tuanCollection.pageCurrent + 1;
        //点击全部、已开始、未开始时展示的效果
        tuanCollection.showCollection();
    },
    //hover 到收藏元素上，显示删除按钮、hover上去样式变化
    collectionItenHover:function(){
        //为删除按钮添加 删除收藏事件
        $('#assistant-box-c-list .all').find('.ico-rit-del').each(function () {
            var id=$(this).attr('id');
            $(this).on('click', function () {
                //发起删除请求接口
                tuanCollection.clearCollect(id);
            });
        })
        //hover最近浏览商品变换样式
        $('#assistant-box-c-list .all').hover(function () {
            $(this).css({'background-color': '#F0F0F0'});
            $(this).find(".ico-rit-del").css({'display': 'block'});
        }, function () {
            $(this).css({'background-color': '#FFF'});
            $(this).find(".ico-rit-del").css({'display': 'none'});
        });
    },
    //清空团购收藏
    clearCollect:function(itemIds){
        collectionOff=true;
        var groupIdStr="";
        if(typeof(itemIds)=="undefined"){ //清空的id 不存在的时候，取groupIdStr
            $("#assistant-box-c-list").find(".all").each(function(){
                if(groupIdStr==""){
                    groupIdStr = $(this).attr("data-groupid");
                }else{
                    groupIdStr += "_" + $(this).attr("data-groupid");
                }
            });
        }else{  //存在的时候取 id
            groupIdStr=itemIds;
        }
        //发起清空的请求
        if (groupIdStr!=""){
            $.ajax({
                type:"get",
                url:"//ss"+cookieDomain+"/item/v1/groupon/"+loginData.loginId+"/"+groupIdStr+"/Y/flag/tuan/collec",
                dataType:"jsonp",
                async:false,
                cache:false,
                jsonpName:"collec",
                jsonpCallback:"collec",
                success:function(data){
                    var colleStatus = $.trim(data.colleStatus);
                    var groups = data.groupIds;
                    if (colleStatus!="N"){
                        if(typeof(itemIds)=="undefined"){
                            $("#assistant-box-c-list").html("");
                        }else{
                            //每删除一个数据，当前翻页跳转到第一页
                            $("#assistant-box-c-list").find("li[data-groupid="+groupIdStr+"]").remove();
                            tuanCollection.pageCurrent = 1;
                        }
                        //点击全部、已开始、未开始时展示的效果
                        tuanCollection.showCollection();
                    }
                },
                error:function(e){
                    console.log('error');
                }
            });
        }
    },
    noCollectionGoods:function(){//没有收藏团购商品时的展示样式
        $(".gbfav-in-wu").show();
        $('.pop-pagi-box').hide();
        $(".gbfav-cont").css('padding-bottom', '0');
    },
    //没登陆的时候展示的样式
    noLogin:function(){
        $(".group-assistant-collection .assistant-box-c").show();
        $("#noLogin").show();
        $('#okLogin').hide();
    },
    clearNoCollentionGoods:function(){
        $(".gbfav-in-wu").hide();
    },
    tabCollection:function(){//切换团购选项卡
        $(".collection-status a").bind("click",function(){
            $(this).addClass("cur").siblings().removeClass("cur");
            tuanCollection.pageCurrent = 1;
            //点击全部、已开始、未开始时展示的效果
            tuanCollection.showCollection();
        })
    }
};
//没登录，点击登录弹框
$("#noLogin a").click(function(){
    g.login();
})
//触发方法 鼠标hover到收藏按钮
$(".group-assistant-collection .icon").on("mouseenter",function(){
    if(loginData.loginStatus ==3){  //如果用户已登录
        tuanCollection.getCollection();//获得团购收藏接口
        tuanCollection.clickCollectButton();//点击团购收藏按钮，显示收藏相关内容
        tuanCollection.tabCollection();//切换团购选项卡
        $(".group-assistant-collection .assistant-box-c").show();
    }else{ 
        //没登陆的时候展示的样式
        tuanCollection.noLogin();
    }
 });

//收藏对应的内容显示隐藏的处理
$(".group-assistant-collection").on('mouseenter', function () {
    collectionOff=false;
});
$(".group-assistant-collection").on('mouseleave', function () {
    if(!collectionOff){
        $(".group-assistant-collection .assistant-box-c").hide();
    }
});