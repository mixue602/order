;(function(exports,$){

	function live800(){
		//find在线客服
		var ServerID_arr = [];
		
		$('[data-customer_service_id]').each(function () {
			ServerID_arr.push($(this).data('customer_service_id'));
		});
		var userid=$.cookie('SSO_USER_ID');
			userid?userid=userid:userid="undefined"
		if (ServerID_arr.length > 0) {
			//调用live800接口
			$.ajax({
				type:'get',
				url:'//ss'+cookieDomain+'/item/v1/online/'+ServerID_arr.join(',')+'/'+userid+'/flag/public/live80000',
				dataType:'jsonp',
				jsonpName:"live80000",
				success: function(data){
					//改变客服状态
					$('[data-customer_service_id]').each(function () {
						var customers = data.result || [];
						for (var i = 0 ; i < customers.length; i++) {
							if (customers[i].customer_flag == $(this).data('customer_service_id')) {
								$(this).data('customer_service', customers[i]);
								//判断是否是详情页
								if(location.href.indexOf("item.")>0 || location.href.indexOf("b.")>0){
									if (customers[i].status == 0) {
										$(this).addClass($(this).data('hidestyle'));
									} else if (customers[i].status == 1) {
										$(this).addClass($(this).data('showstyle'));
									}
									//判断是否是自营并且是针对没有配置客服的商品添加机器人客服图标，文字展示'咨询小美'
									if($(this).data('customer_service_id') && $(this).data('customer_service_id').toString().indexOf('cat') == 0 && customers[i].status == -1) {
										$(this).html('<i class="gm-icon">f</i>咨询小美').addClass($(this).data('otherstyle'));
										$(".zy-online-service").html('<i class="icon-service"></i>咨询小美').attr("title","咨询小美");//小购物车处客服
										$(".added-service .live800-service").html('在线客服');
									}
								}else{
									if (customers[i].status == 0) {
										$(this).addClass('offline');
									} else if (customers[i].status == 1) {
										$(this).addClass('online');
									}
								}
								if (typeof $(this).data('customer_service_cb') == 'function') {
									$(this).data('customer_service_cb').call(this);
								};
							}
						}
					});

					//及时登录判断
					$('[data-customer_service_id]').on('mouseenter',function (evt) {
							evt.stopPropagation();
							$.ajax({
								type: 'get',
								url: '//member'+cookieDomain+'/gome/index/loginStyle',
								dataType: 'jsonp',
								jsonpName :"loginStyle"
							}).done(function(data){
								loginData.loginStatus=data.loginStatus;
							});
						});
					//弹出客服窗口
					$('[data-customer_service_id]').unbind('click').bind('click',function (e) {
						e.stopPropagation();
						var customer_service = $(this).data('customer_service'), shopname = $('.shops-name a.name').attr("title")? $('.shops-name a.name').attr("title") : '';
						if (customer_service){
							if (customer_service.status<0) {
								if(customer_service.customer_flag && customer_service.customer_flag.indexOf('cat') == 0) {
									window.open(
										'//chat5'+gomeplusDomain+'/live800'+
										'/chatClient/chatbox.jsp?' +
										'companyID=3' +
										'&customerID=3' +
										'&info=' + customer_service.customerInfo +
										'&page=0' +
										'&enterurl=' + location.href+
										'&areaCode='+encodeURI(encodeURI($.cookie("atgregion")))+
										'&flag=robot'+
										'&shopname=' + encodeURI(encodeURI( shopname)),
										'customerService',
										'toolbar=0,scrollbars=0,location=0,menubar=0,resizable=1,width=1120,height=700'
									);
								}
								return false;
							}else{
								/*if (loginData.loginStatus >= 3) {*/
									window.open(customer_service.host + //host
										'/chatClient/chatbox.jsp?' +
										'companyID=' + customer_service.customerID +
										'&customerID=' + customer_service.customerID +
										'&info=' + customer_service.customerInfo +
										'&page=0' +
										'&enterurl=' + location.href+
										'&areaCode='+encodeURI(encodeURI($.cookie("atgregion")))+
										'&shopname=' + encodeURI(encodeURI( shopname)),
										'customerService' + $(this).data(customer_service).customerID,// 窗口id
										'toolbar=0,scrollbars=0,location=0,menubar=0,resizable=1,width=1120,height=700'
									);
								/*} else {
									location.href = "https://login"+cookieDomain+"/login?tableName=login&orginURI="+location.href;
									return false;
								}*/
	}
						}else{
							return false;
						}
						/*if (loginData.loginName == '') {
							location.href = g.url.login + '/login?tableName=login&orginURI=' + location.href;
							return;
						}*/
					});
				}
			});
		}
	}
	
	exports.live800Fn=live800;
})(window,$);