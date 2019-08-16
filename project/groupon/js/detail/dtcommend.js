var detTemp = {
    tot:'\
	<div class="sor">\
		<div class="sper">\
			<span class="sper-snum"><%= goodCommentPercent %></span><b class="sper-b">%</b>\
			<p class="sper-p">好评度</p>\
		</div>\
		<div class="gmb">\
			<p>好评<span class="gmb-span">(<%= good %>%)</span><em class="gmb-em"><b class="gmb-b" style="width:<%= good %>%"></b></em></p>\
			<p>中评<span class="gmb-span">(<%= mid %>%)</span><em class="gmb-em"><b class="gmb-b" style="width:<%= mid %>%"></b></em></p>\
			<p>差评<span class="gmb-span">(<%= bad %>%)</span><em class="gmb-em"><b class="gmb-b" style="width:<%= bad %>%"></b></em></p>\
		</div>\
	</div>\
	<div class="spot">\
		<b class="spot-tit">推荐点：</b>\
			<%\
            	for(var i=0;i<recocontentlist.length;i++){\
					var tspot = recocontentlist[i].recocontent;\
			%>\
					<a class="spots-a" href="javascript:;"><%= tspot %></a>\
			<%\
				}\
			%>\
	</div>\
	<div class="comt">\
		您可对已购的商品进行评价\
		<a class="btn-light btn-grd-cmt" rel="nofollow" href="//myhome'+cookieDomain+'/member/myGoodsAppraise?orderId&shippingGroupId" target="_blank" id="smtComment">发表评价拿美豆</a>\
	</div>',
    tab:'\
	<li class="cur-commt cmt-tab-li"><input id="cmt1" class="nRadio" type="radio" name="commt" checked="checked" badktype="all" /><label class="nLabel" for="cmt1"><span>全部评价</span>(<%= totalCount %>)</label></li>\
	<li class="cmt-tab-li"><input id="cmt2" type="radio" class="nRadio" name="commt" badktype="good" /><label class="nLabel" for="cmt2"><span>好评</span>(<%= good %>)</label></li>\
	<li class="cmt-tab-li"><input id="cmt3" type="radio" class="nRadio" name="commt" badktype="mid" /><label class="nLabel" for="cmt3"><span>中评</span>(<%= mid %>)</label></li>\
	<li class="cmt-tab-li"><input id="cmt4" type="radio" class="nRadio" name="commt" badktype="bad" /><label class="nLabel" for="cmt4"><span>差评</span>(<%= bad %>)</label></li>\
	<li class="cmt-tab-li"><input id="cmt5" type="radio" class="nRadio" name="commt" badktype="validgood" /><label class="nLabel" for="cmt5"><span>有内容好评</span>(<%= validgood %>)</label></li>',
    lst:'\
	<%\
		for(var j=0; j<Evalist.length; j++){\
		var oneu=Evalist[j];\
	%>\
	<li class="commt-list-li clearfix">\
		<div class="avatar">\
			<a href="javascript:;">\
			<%\
				var imgPath=oneu.imagePath;\
				if(imgPath ==""){\
					imgPath = oneu.imgServer+"/pi-tx-new_1.jpg";\
				}\
			%>\
			<img src="<%= imgPath %>" width="60" height="60" /></a>\
			<p><%= oneu.loginname %></p>\
			<b class="meb-level meb-level<%= oneu.profileGrade %>"> </b>\
		</div>\
		<div class="commt-co">\
			<div class="cc-tit clearfix">\
				<!--<a href="'+reviewSite+'<%= "/"+oneu.appraiseId %>.html" class="ctopic" target="_blank"><%= oneu.appraiseEleTITLE %></a>-->\
				<span class="detail-star"><b style="width:<%= oneu.mscore*20 %>%"></b></span>\
				<a href="'+reviewSite+'<%= "/"+oneu.appraiseId %>.html" class="cc-time" target="_blank"><%= oneu.post_time %></a>\
			</div>\
			<div class="cc-cont clearfix">\
			<!--<span class="mt5">推荐点：</span>-->\
				<%\
					for(var k=0; k<oneu.recocontentlist.length; k++){\
					var sispot=oneu.recocontentlist[k];\
				%>\
					<a class="cc-cont-a" href="javascript:;"><%= sispot %></a>\
				<%\
					}\
				%>\
			</div>\
			<div class="cc-cont clearfix">\
			<!--<span>使用心得：</span>-->\
			<p>\
				<%= oneu.appraiseElSum %>\
				<% if(oneu.hasMore=="true") { %>\
					.........\
					<a href="'+reviewSite+'<%= "/"+oneu.appraiseId %>.html" class="adv_more" target="_blank">查看全部</a>\
				<% }%>\
			</p>\
			</div>\
			<a href="javascript:;" class="praise j-praise" data-value="<%= oneu.appraiseId %>-<%= oneu.productId %>">我赞同 <b class="j-pnum">(<%= oneu.apprnum %>)</b></a>\
		</div>\
	</li>\
	<%\
		}\
	%>',
    sig:'\
	<li class="ordershow-item">\
		<div class="ordershow-user">\
			<span class="avatar"><img alt="<%= ordershow[0].author %>" src="<%= ordershow[0].avatar.replace(/"/g,\'\') %>" /></span>\
			<span class="name"><%= ordershow[0].author %></span>\
		</div>\
		<div class="ordershow-title">\
			<span class="time"><%= ordershow[0].dateline %></span>\
			<a target="_blank" rel="nofollow" href="<%= ordershow[0].href %>"><h5><em>推荐晒单</em><%= ordershow[0].subject %></h5></a>\
		</div>\
		<p class="ordershow-desc"><%= ordershow[0].message %></p>\
		<div class="ordershow-detail clearfix">\
			<ul class="os-imgs clearfix">\
			<% if(ordershow[0].pic){for(var i=0; i<ordershow[0].pic.length; i++){ %>\
				<li><a target="_blank" rel="nofollow" href="<%= ordershow[0].href %>"><img alt="<%= ordershow[0].subject %>" src="<%= ordershow[0].pic[i] %>"></a></li>\
			<% }} %>\
			</ul>\
			<span class="csnum">共<% if(ordershow[0].pic){%> <%= ordershow[0].pic.length %> <%}else{%> 0 <%}%>张</span>\
		</div>\
	</li>',
    ord:'\
		<%\
		for(var i=0 ; i<ordershow.length; i++){\
		var detail = ordershow[i], picnum = detail.pic?detail.pic.length:0;\
		%>\
		<li class="ordershow-item">\
			<div class="ordershow-user">\
				<span class="avatar"><img src="<%= detail.avatar.replace(/"/g,\'\') %>" alt="<%= detail.author %>" /></span>\
				<span class="name"><%= detail.author %></span>\
			</div>\
			<div class="ordershow-title">\
				<span class="time"><%=detail.dateline%></span>\
				<h5><a href="<%= detail.href %>" target="_blank" rel="nofollow"><%= detail.subject %></a></h5>\
			</div>\
			<p class="ordershow-desc"><%= detail.message %></p>\
			<div class="ordershow-detail clearfix">\
				<ul class="os-imgs clearfix">\
		<%for(var j = 0 ; j < picnum ; j++ ){%>\
					<li><a href="<%= detail.href %>" rel="nofollow" target="_blank"><img src="<%= detail.pic[j] %>" /></a></li>\
		<%}%>\
				</ul>\
				<span class="os-more">共<%=picnum%>张<a href="<%= detail.href %>" rel="nofollow" target="_blank">查看晒单 ></a></span>\
			</div>\
		</li>\
	<%}%>'
};

;(function($){
    //$(".group-sidecate").hide();
    var groupDetail = function(){
        this.lgCall=null;
    };
    groupDetail.prototype = {
        getAjax:function(dat){
            var _d={};_d.data=undefined,_t=this;
            try{
                var _ajax = function(){
                    $.ajax({
                        type:'get',
                        url:dat.Jurl,
                        data:dat.Jdat||{},
                        dataType:'jsonp',
                        jsonpName:dat.Jname,
                        jsonpCallBack:dat.Jname,
                        success:function(data){
                            _d.data=data,_d.obj=_t;
                            if(dat.param)_d.param=dat.param;
                            if(dat.Jback)_d.callback=dat.Jback;
                            dat.Jcall.apply(_d);
                        },
                        error:function(){}
                    });
                }
                window.setTimeout(function(){_ajax();},0);
            }catch(ex){};
        }
    };
    var dcUtil = new groupDetail();

    /* 评论 and 晒单 */
    function disc(){
        /* UI选择器 & 初始化 */
        /*this.smt="#smtComment";*/
        this.lbj="#j-commentsList";
        this.tab="#j-ctTab";
        this.sig="#singleShow";
        this.sce=".sorceOut";
        this.bbs = "//bbs"+cookieDomain+"/api/api_getbaskorder.php"; ////bbs.atguat.com.cn/api/api_getbaskorder.php;
        this.bdt = {"productId":prdInfo.prdId,"skuId":prdInfo.skuNo};//{"productId":"9126710120","skuId":"1115900229"};
        this.flag=true;
        this.init=function(){
            /* 获取各评论总数、好评度 */
            this.marks();
            /* 获取评论信息 */
            this.list("all",1);
            /*页面上暂无晒单功能（由于bbs接口不支持）,故屏蔽相关代码,如新的评论晒单功能添加,可以在此基础上修改，或删掉隐藏代码进行重写*/
            /*this.single();*/
            /* 晒单 */
            /*this.orderBind();*/

        };
        this.marks=function(){
            var _url = "//ss"+cookieDomain+'/item/v1/prdevajsonp/productEvaComm/'+prdInfo.prdId+'/flag/appraise/totleMarks',_dat={"productId":prdInfo.prdId};
            dcUtil.getAjax({Jname:"totleMarks",Jurl:_url,Jdat:_dat,Jcall:this.markDom,param:this});
        };
        this.markDom=function(){
            if(this.data){
                var _ren = template.compile(detTemp.tot),_ths=this.param;
                $(_ths.sce).html(_ren(this.data));
            }
        };

        /* 评论列表 */
        this.list=function(cbtype,curPage,_this){
            var _dat={"productId":prdInfo.prdId,"pagenum":curPage,"_this":_this||"cmt1"},
                _url = "//ss"+cookieDomain+'/item/v1/prdevajsonp/appraiseModuleAjax/'+prdInfo.prdId+'/'+curPage+'/'+cbtype+'/flag/appraise/'+cbtype;
            dcUtil.getAjax({Jname:cbtype,Jurl:_url,Jdat:_dat,Jcall:this.listDom,param:{_t:this,"productId":prdInfo.prdId,"pagenum":curPage,"_this":_this||"cmt1"}});
        };
        this.listDom=function(){
            if (this.data) {
                var data = this.data, _this = this.param._t, _list = data.evaList;
                var _tab = {"totalCount":data.totalCount,"good":data.good,"mid":data.mid,"bad":data.bad,"validgood":data.validgood,"totalpage":data.totalpage};
                //给_list添加图片地址域名
                for(var i=0;i<_list.Evalist.length;i++){
                    if(!_list.Evalist[i].imgServer){
                        _list.Evalist[i].imgServer=imgServer;
                    }
                }
                if(_this.flag){
                    var _rentab = template.compile(detTemp.tab);
                    $(_this.tab).html(_rentab(_tab));
                }
                var _ren = template.compile(detTemp.lst);
                $(_this.lbj).html(_ren(_list));
                if(_this.flag)zdata.zanLink();
                _this.listGmb();
                _this.listHtml(this.param._this);
                _this.listPage(data.totalpage,this.param.pagenum);
            }
        };
        this.listHtml=function(_this){
            /* 暂无评价 */
            var _list = $(this.lbj),_lili = _list.find("li"),_no='<p class="grd-cont-blank">暂无商品评价！</p>';
            var _TabThis = $("#"+_this);
            /* 判断当前元素是否已选中 */
            if(_TabThis.attr("checked")==true){
                /* 判断当前数据是否为空 */
                if(_lili.length==0){
                    /* 全部评论为空则添加  ls 属性*/
                    if(_this=="cmt1"){
                        _list.html(_no).next().hide();
                        _TabThis.attr("ls","true");
                        return false;
                    }
                    if($("#cmt1").attr("ls")=="true"){
                        _list.html(_no).next().hide();
                        return false;
                    }
                    /* 其他tab没有数据提示 */
                    _no='<p class="grd-cont-blank">暂无商品'+_TabThis.parent().find("span").html()+'信息！</p>';
                    _list.html(_no).next().show();
                }
            }
        };
        this.listGmb=function(){
            var _this = this;
            $("#j-ctTab input").unbind("click").click(function(){
                var _bk = $(this).attr("badktype");
                _this.list(_bk, 1, $(this).attr("id"));

                $("#j-ctTab li").removeClass("cur-commt");
                $(this).parent("li").addClass("cur-commt");
                if(_bk!="all"){$(_this.sig).hide();}if(_bk=="all" && $(_this.sig).html()!=""){$(_this.sig).show();}
                _this.flag = false;
            });
        };
        //分页器调用
        this.listPage=function(tP,cP){
            var _type = $(".cur-commt input").attr("badktype"),_this = this;
            $('#j-page').gPage({ap:tP,cp:cP,np:10,tg:"#j-comment-section",e:function(){_this.list(_type, this.cp);}});
        };
        /*this.single=function(){
         this.bdt["type"]=1;
         dcUtil.getAjax({Jname:"orderShowData",Jurl:this.bbs,Jdat:this.bdt,Jcall:this.singleDom,param:this});
         };
         this.singleDom = function () {
         if (this.data) {
         var _t = $("#j-ordershow-tab"), _this = this.param;
         if (this.data.ordershow != null) {
         var _ren = template.compile(detTemp.sig);
         $(_this.sig).html(_ren(this.data)).show();
         $("#showAllSD").click(function () {
         var _h = _t.offset().top - 55;
         $('html,body').animate({ scrollTop: _h + 'px' }, 200);
         _t.click();
         });
         }
         *//* 晒单事件 *//*
         _t.click(function () { _this.orderData(); });
         *//*
         if(!this.data.ordershow || this.data.ordershow==null){
         //$("#j-ordershow-tab,"+this.param.sig+",.ordershow-wrap").hide();
         return false;
         }*//*
         }
         };*/

        /* 晒单模块 */
        /*this.orderData=function(page){
         var curPage=page?page:1;
         this.bdt["type"]=0;
         this.bdt["page"]=curPage;
         dcUtil.getAjax({Jname:"orderShowData",Jurl:this.bbs,Jdat:this.bdt,Jcall:this.orderDom,param:{ts:this,pg:curPage}});
         };
         this.orderDom=function(){
         if(this.data){
         var pos = $("#j-ordershow-list"),data = this.data;
         if(!data || !data.count || data.ordershow==null){
         var str = '<li>' +
         '<p style="color: #5E5E5E;">暂无商品晒单!</p>' +
         '<p style ="padding-bottom:10px;">购买商品后，<a href ="//bbs.gome.com.cn/forum-67-1.html" target="_blank" style="color:#c00;">发表晒单</a>即可轻松获得1~3积分哦~</p>' +
         '</li>';
         pos.html(str).show();
         $('#page_ordershow').hide();
         return false;
         };
         var _ren = template.compile(detTemp.ord),_this=this.param.ts;
         pos.html(_ren(data)).show();
         $('#page_ordershow').show().gPage({ ap: data.pages, cp: this.param.pg, np: 6, tg: "javascript:;", e: function () { _this.orderData(this.cp); } });
         }
         };*/
        /*this.orderBind=function(){
         $("#j-comment-section .ds-hd").each(function(){
         $this = $(this).find("li").bind("click",function(){
         var _index = $this.index($(this));
         $(this).siblings().removeClass("cur");
         $(this).addClass("cur");
         $("#j-comment-section .ds-bd .cmt-con").hide().eq(_index).show();
         });
         });
         };*/

    }

    /* 赞操作 */
    var zdata = {
        onOff:false,//初始化未登陆
        loginId:null,
        zanLink:function(){
            var _this=this;
            $("#j-commentsList").unbind("click").click(function(e){
                zdata._z = $(_this.getEvent(e));
                if(zdata._z.hasClass("j-praise") || (zdata._z=zdata._z.parent()).hasClass("j-praise"))_this.zanDone(zdata._z.attr("data-value"));
            });
        },
        zanDone:function(_v){
            if(!zdata.onOff){
                g.login(function(){
                    if(loginData!= undefined){
                        var _st = loginData.loginStatus;
                        /*已登录状态*/
                        if(_st==3||_st=='3'){
                            zdata.onOff=true; //已经登陆过
                            zdata.loginId=loginData.loginId;
                            zdata.zanAjax(_v,zdata.loginId);
                        }
                    }
                });
            }else{
                zdata.zanAjax(_v,zdata.loginId);
            }
        },
        getEvent:function(e){
            e=e||window.event;
            return e.target || e.srcElement;
        },
        zanAjax:function(_v,userId){
            _v = _v.split("-");
            var _url ="//ss"+cookieDomain+"/item/v1/approve/"+_v[1]+"/"+_v[0]+"/"+userId+"/flag/appraise/gmAppraise";
            dcUtil.getAjax({Jname:"gmAppraise",Jurl:_url,Jcall:zdata.zanDom});
        },
        zanDom:function(){
            if(this.data){
                var data = this.data,_m=data.message,_r = data.approveFlag;
                if(_r==true||_r=='true'){//成功做的处理
                    data.approNum&&zdata._z.find('.j-pnum').text('('+data.approNum+')');
                    alert(_m);
                }else{//失败作的处理
                    alert(_m);
                    return false;
                }
            }
        }
    };
    $.zanDone = zdata.zanDone;
    /* 绑定加载事件 */
    $("#prd_tbox").gLoad({df:100,e:function(){(new disc).init();}});
})(jQuery);