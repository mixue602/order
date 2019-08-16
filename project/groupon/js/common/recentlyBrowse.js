    var clearoff=false; //单击页面元素，最近浏览列表是否展示
    var recentlyBrowse={//最近浏览
        totalPage:1,   //总页数
        pageSize:4,    //每页展示的商品个数
        pageCurrent:1,  //当前分页初始化为1
        dataCount:0,    //最近浏览总条数
        flag:0,         //控制最近浏览发请求的次数，只发一次
        getRecentlyCookie:function(){//获取最近浏览cookie
            var _Pid = '';
            if(typeof (prdInfo)!='undefined'){
                _Pid=prdInfo.itemId;
            }
            //var _prs = $.cookie("grouponBrowse","T8800004064",{expire:7});//自己加的值
            _prs=$.cookie("grouponBrowse");
            var _p_ = [];
            try {
                eval('var _p_=' + _prs);
            } catch (e) {
            };
            if (!_p_)
                _p_ = [];
            if (_Pid) {
                _p_.unshift(_Pid);
            };
            var _z_ = {};
            for (var i = 0; i < _p_.length; i++) {
                _z_[_p_[i]] = _p_[i];
            };
            _p_ = [];
            for (var v in _z_) {
                _p_.push(_z_[v]);
            };
            if (_p_.length >= 10) {
                _p_ = _p_.slice(0, 10);
            }
            $.cookie('grouponBrowse', '["' + _p_.join('","') + '"]', {
                expires: 7,
                path: '/',
                domain: cookieDomain
            });
            return _p_.join(',');
        },
        getRecentlyBrowseData:function(prodstrs){//获取最近浏览商品
            if(prodstrs==''){//判断是否有cookie信息，用来判断是否有浏览商品
                recentlyBrowse.noRecentlyBrowse();
                return;
            }else{
                $.ajax({
                    type:"get",
                    url:tuanAjax+"/cheap/getCheapItemsStatus?itemIds="+prodstrs,
                    cache:false,
                    dataType:"jsonp",
                    jsonName:"logintopCollect",
                    success:function(data){
                        if(data.code=="200"){
                            var result="";
                            if(data.data.length>0){
                                 //计算总的分页数
                                var groupCount=data.data.length;
                                recentlyBrowse.totalPage=parseInt(groupCount/recentlyBrowse.pageSize);
                                recentlyBrowse.dataCount=groupCount;
                                if(groupCount>recentlyBrowse.pageSize){
                                    if(recentlyBrowse.totalPage*recentlyBrowse.pageSize<groupCount){
                                        recentlyBrowse.totalPage=recentlyBrowse.totalPage+1;
                                    }
                                };
                                //渲染最近浏览的商品
                                for(var i=0;l=groupCount,i<l;i++){
                                    var obj=data.data[i];
                                    var display="display:none";
                                    result+='<li class="clearfix" dataIndex='+i+' style='+display+'>\
                                    <div class="assistant-img-box">\
                                        <a title="'+obj.name+'" href="'+obj.url+'" target="_blank">\
                                            <img src="'+obj.imgUrl+'_60.jpg">\
                                        </a>\
                                    </div>\
                                    <div class="assistant-info-box">\
                                        <p class="info-name">\
                                            <a target="_blank" title="'+obj.name+'" href="'+obj.url+'">'+obj.name+'</a>\
                                        </p>\
                                        <p class="info-price">\
                                            <span>¥'+obj.cheapPrice+'</span>\
                                        </p>\
                                        <p class="info-count"><em>'+obj.saleNum+'</em>人已购买</p>\
                                    </div>\
                                </li>'
                                }
                                $("#browseBox").html(result);
                                // 当前分页的商品展示出来，其他隐藏
                                recentlyBrowse.showBrowseData();
                                //hover最近浏览商品变换样式
                                recentlyBrowse.recentItenHover();
                                recentlyBrowse.flag=1;
                            }else{
                                //调取没有数据时的展示效果
                                recentlyBrowse.noRecentlyBrowse();
                            }
                        }
                    },
                    error:function(e){
                        console.log('error');
                    }
                })
            }
        },
        // 当前分页的商品展示出来，其他隐藏
        showBrowseData:function(){
            var curPage = recentlyBrowse.pageCurrent;
            for(var i=0;i<recentlyBrowse.dataCount;i++){
                if((curPage-1)*recentlyBrowse.pageSize<=i && i< curPage*recentlyBrowse.pageSize){
                    $("li[dataIndex="+i+"]").css("display","block");
                }else{
                    $("li[dataIndex="+i+"]").css("display","none");
                }
            }
            //上一页、下一页的展示问题
            recentlyBrowse.showBrowsePage();
        },
        //上一页、下一页的展示问题
        showBrowsePage:function(){
            var str = '';
            if(recentlyBrowse.totalPage>1){
                if(recentlyBrowse.pageCurrent==1){
                    str+='<a class="pop-pagi-prev" onselectstart="return false">&lt;&nbsp;上一页</a><span class="pop-pagi-num"><b class="light">'+recentlyBrowse.pageCurrent+'</b>/'+recentlyBrowse.totalPage+'</span><a class="pop-pagi-next" onselectstart="return false" id="next" name="2" >下一页&nbsp;&gt;</a>';
                }else if(recentlyBrowse.pageCurrent == recentlyBrowse.totalPage){
                    var npage=recentlyBrowse.pageCurrent-1;
                    str+='<a class="pop-pagi-prev" onselectstart="return false" id="pre" name="'+npage+'">&lt;&nbsp;上一页</a><span class="pop-pagi-num"><b class="light">'+recentlyBrowse.pageCurrent+'</b>/'+recentlyBrowse.totalPage+'</span><a class="pop-pagi-next" onselectstart="return false">下一页&nbsp;&gt;</a>';
                }else{
                    var nextpage = recentlyBrowse.pageCurrent + 1;
                    var prePage = recentlyBrowse.pageCurrent - 1;
                    str+='<a class="pop-pagi-prev" onselectstart="return false" id="pre" name="'+prePage+'">&lt;&nbsp;上一页</a><span class="pop-pagi-num"><b class="light">'+recentlyBrowse.pageCurrent+'</b>/'+recentlyBrowse.totalPage+'</span><a class="pop-pagi-next" onselectstart="return false" id="next" name="'+nextpage+'">下一页&nbsp;&gt;</a>';
                }
            }
            $(".assistant-bottom-browse .assistant-page").html(str).show();
        },
        noRecentlyBrowse:function(){//没有最近收藏的商品
            $(".assistant-box-b .assistant-box-list").html('<li class="rec-noitem"><p>暂无浏览记录，快去<a class="look" href="//tuan'+cookieDomain+'/" target="_blank">逛逛</a>吧</p></li>');
            $(".assistant-bottom-browse .assistant-page").hide();
            $(".assistant-bottom .remove").hide();

        },
        clearRecentlyBrowse:function(){//清空最近浏览商品
            $.cookie('grouponBrowse','',{
                expires:7,
                path:'/',
                domain:cookieDomain
            });
            //调用没有最近收藏的商品的展示效果
            recentlyBrowse.noRecentlyBrowse();
        },
        preRecentlyBrowse:function(){//点击最近浏览商品上一页
            recentlyBrowse.pageCurrent = recentlyBrowse.pageCurrent - 1;
            if(recentlyBrowse.pageCurrent<1){
                recentlyBrowse.pageCurrent=1;
            }
            // 当前分页的商品展示出来，其他隐藏
            recentlyBrowse.showBrowseData();
        },
        nextRecentlyBrowse:function(){//点击最近浏览商品下一页
            recentlyBrowse.pageCurrent = recentlyBrowse.pageCurrent + 1;
            if(recentlyBrowse.pageCurrent>recentlyBrowse.totalPage){
                recentlyBrowse.pageCurrent=recentlyBrowse.totalPage;
            }
            // 当前分页的商品展示出来，其他隐藏
            recentlyBrowse.showBrowseData();
        },
        recentItenHover:function(){//hover最近浏览商品变换样式
            $('.group-assistant-browse .assistant-box-list li').hover(function () {
                $(this).css({'background-color': '#F0F0F0'});
            }, function () {
                $(this).css({'background-color': '#FFF'});
            });
        }
    };

    //触发最近浏览的事件
    $(".group-assistant-browse").bind({
        "mouseenter":function(){
            clearoff=false;
            if(recentlyBrowse.flag==0){
                recentlyBrowse.getRecentlyBrowseData(recentlyBrowse.getRecentlyCookie());//获取最近浏览商品
            }
            $(".assistant-box-b").show();
        },
        "mouseleave":function(){
            if(!clearoff){ //非点击清空情况下触发隐藏
                $(this).find(".assistant-box-b").hide();
            }
        }
    });
    //上一页
    $('.group-assistant-browse').delegate('.pop-pagi-prev', 'click', function(event) {
        clearoff=true;
        recentlyBrowse.preRecentlyBrowse();
    });
    //下一页
    $('.group-assistant-browse').delegate('.pop-pagi-next', 'click', function(event) {
        clearoff=true;
        recentlyBrowse.nextRecentlyBrowse();
    });
    //点击清空
    $(".assistant-bottom .remove").click(function () {
        clearoff=true;
        recentlyBrowse.clearRecentlyBrowse();
    });
