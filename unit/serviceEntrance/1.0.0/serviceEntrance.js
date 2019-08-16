function customerServiceCall(){
    this.customerArr = []; //店铺id
    this.entryArr = []; //入口类型
    this.brandidArr = [];  //品牌id
    this.categoryidArr = []; //分类id
    this.skuIdArr = [];     //商品id
    this.loginState = ""; //登录状态
    this.entry = '';    //入口类型
    this.userId = ""; //用户id
    this.SCN = "";  //用户token
    this.province = ""; //省份编码
    this.orderId = "";  //订单id
    this.shopId = "";   //店铺id
    this.shippingGroupId = "";  //配送id
    this.productId = "";
    this.serviceUrl = "";
}
customerServiceCall.prototype={
    initialCall: function(){
        var _this = this;
        cookieDomain == ".atguat.com.cn"?_this.serviceUrl = "//larkapi"+cookieDomain:_this.serviceUrl = "//ocsapi"+cookieDomain;
        _this.customerCallInit();
    },
    arr_atgregion: function () {
        var arr = ($.cookie('atgregion') || "11010200|北京市朝阳区朝外街道|11010000|11000000|110102002").split('|');
        return [arr[3], arr[2], arr[0], (arr[4] == undefined ? arr[0] + '1' : arr[4])];
    },
    // 获取客服id
    customerCallInit: function(){
        var _this = this;
        _this.entry = $("[customer-service-button-id]").eq(0).attr('customer-entry');
        _this.province = _this.arr_atgregion().join('_');
        $("[customer-service-button-id]").each(function(i, v){
            _this.customerArr.push($(this).attr('customer-service-button-id'));
            _this.entryArr.push($(this).attr('customer-entry'));
            _this.brandidArr.push($(this).attr('brandid')?$(this).attr('brandid'):"");
            _this.categoryidArr.push($(this).attr('categoryid')?$(this).attr('categoryid'):"");
            _this.skuIdArr.push($(this).attr('skuId')?$(this).attr('skuId'):"");
        })
        _this.checkagent();
        _this.customerJump();
    },
    checkagent: function(){
        var _this = this,
            obj = {},
            newEntryArr = [],
            checkagentByGet = "";
        $.each(_this.entryArr,function(idx, val){
            if(val == "product"){
                obj.categoryid = _this.categoryidArr.join();
                obj.brandid = _this.brandidArr.join();
                obj.skuid = _this.skuIdArr.join();
                obj.area = _this.province;
            }
            if(val == "flagShip"){
            	obj.categoryid = _this.categoryidArr.join();
                obj.brandid = _this.brandidArr.join();
                obj.skuid = _this.skuIdArr.join();
                obj.area = _this.province;
            }
        })
        if(_this.customerArr.length > 1){
            checkagentByGet = "checkagentByBatchGet";
            $.each(_this.entryArr,function(idx, val){
            	if(val == "flagShip"){
	            	val = "composite";
	            }
	            newEntryArr.push(val);
            })
            obj.entry = newEntryArr.join();
            obj.shopid = _this.customerArr.join();
        }else{
            checkagentByGet = "checkagentByGet";
            obj.entry = _this.entry;
            obj.shopid = _this.customerArr.join();
        }
        // 判断客服入口是否显示
        if(_this.customerArr.length > 0){
            var randomStr = Math.random().toString(36).substr(2);
            $.ajax({
                type: 'get',
                url: _this.serviceUrl+'/open/'+checkagentByGet,
                data: obj,
                dataType: 'jsonp',
                jsonpName: 'ckdataGent'+randomStr,
                success: function(res){
                    if(res.status == "200"){
                        var data = res.data;
                        if(_this.customerArr.length > 1 ){
                            for(var i=0; i<data.length; i++){
                                if(data[i].show == "1"){
                                    $("[customer-service-button-id]").eq(i).show();
                                    $("[customer-service-button-id]").eq(i).attr('orgi', data[i].orgi);
                                    $("[customer-service-button-id]").eq(i).attr('orgitype', data[i].orgitype);
                                }else{
                                    $("[customer-service-button-id]").eq(i).hide();
                                }
                            }
                        }else{
                            if(data.show == "1"){
                                $("[customer-service-button-id]").eq(0).attr('orgi', data.orgi);
                                $("[customer-service-button-id]").eq(0).attr('orgitype', data.orgitype);
                            }else{
                                $("[customer-service-button-id]").eq(0).hide();
                            }
                        }
                        _this.customerArr = [];
                        _this.entryArr = [];
                        _this.brandidArr = [];
                        _this.categoryidArr = [];
                        _this.skuIdArr = [];
                    }
                }
            })
        }
    },
    customerJump:function(){
        var _this = this;
        $('[customer-service-button-id]').off('click').on('click', function(){
            var entry = $(this).attr("customer-entry")=="flagShip"?"composite":$(this).attr("customer-entry");
            _this.orderId = $(this).attr("orderId")?$(this).attr("orderId"):"";
            _this.shippingGroupId = $(this).attr("shippingGroupId")?$(this).attr("shippingGroupId"):"";
            _this.skuId = $(this).attr("skuId")?$(this).attr("skuId"):"";
            _this.orgi = $(this).attr("orgi")?$(this).attr("orgi"):"";
            _this.productId = $(this).attr("productid")?$(this).attr("productid"):"";
            if(entry == "order"){
                window.open('//cs'+cookieDomain+'?entry='+entry+'&orgi='+_this.orgi+'&orderId='+_this.orderId+'&shippingGroupId='+_this.shippingGroupId,"_blank");
            }else if(entry == "product"){
                window.open('//cs'+cookieDomain+'?entry='+entry+'&orgi='+_this.orgi+'&productId='+_this.productId+'&skuId='+_this.skuId,"_blank");
            }else{
                window.open('//cs'+cookieDomain+'?entry='+entry+'&orgi='+_this.orgi,"_blank");
            }
        })
    },
    // 商品列表专用
    productList: function(that){
    	var _this = this,
    		productObj = {},
    		serviceBtn = that.find('.online-server'),
    		skuId = serviceBtn.attr('skuId'),
			entry = serviceBtn.attr('customer-entry'),
			productid = serviceBtn.attr('productid'),
			categoryid = serviceBtn.attr('categoryid'),
			brandid = serviceBtn.attr('brandid'),
			shopid = serviceBtn.attr('shopId');
    	if(serviceBtn.attr('orgi') == undefined){
    		productObj.skuid = skuId;
			productObj.entry = entry;
			productObj.productid = productid;
			productObj.categoryid = categoryid;
			productObj.brandid = brandid;
			productObj.area = _this.province;
			productObj.shopid = shopid;
	    	$.ajax({
	    		type: 'get',
	    		url: _this.serviceUrl+'/open/checkagentByGet',
	    		data: productObj,
	    		dataType: "jsonp",
	    		jsonpName: "ckdataGentByGet",
	    		success: function(data){
	    			if(data.status == "200"){
                        if(data.data.show == "1"){
                        	serviceBtn.show();
                            serviceBtn.attr('orgi', data.data.orgi);
                        }else{
                            serviceBtn.hide();
                            serviceBtn.attr('orgi', "");
                        }
                    }
	    		}
	    	})
    	}
    	serviceBtn.off("click").on('click', function(){
    		window.open('//cs'+cookieDomain+'?entry='+entry+'&orgi='+serviceBtn.attr('orgi')+'&productId='+productid+'&skuId='+skuId,"_blank");
	    })
    }
}
var customerServiceCall = new customerServiceCall();
if($("[customer-service-button-id]").length > 0 && $("[customer-service-button-id]").eq(0).attr('isCall')!="prohibit"){
    customerServiceCall.initialCall();
}