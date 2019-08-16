var prdMain;
$(function(){
    /*心愿单埋码 */
    var omniture_wish = {
     /*   show_wish: function () {//弹出心愿单  埋码相关信息，貌似没用到
            var s = s_gi(s_account);
            s.linkTrackVars = "prop22,products,events";
            s.linkTrackEvents = "event67";
            s.linkTracking = true;
            s_objectID = "详情页_向好友提出心愿_3_点击触发";
            //根据实际追踪的控件进行命名
            s.products = ";" + prdInfo.prdId + ";;;;evar23="+prdInfo.prdSign+"|evar24="+prdInfo.shopNo;
            s.events = "event67";
            s.tl(this, 'o', 'interaction');
            s.linkTracking = false;
        },
        bdshare: function (bdcmd, share_text) {
            if (share_text != document.title) {//更多发送愿望的方式：
                this.share('weibo');
            } else {
                this.weibo_weichat(bdcmd);
            }
        },
        weibo_weichat: function (bdshareName) { //百度分享
            var shareName;
            if (bdshareName == 'tsina')
            {
                shareName = 'weibo';
            } else if (bdshareName == 'weixin')
            {
                shareName = 'weixin';
            }

            var s = s_gi(s_account);
            s.linkTrackVars = "prop22";
            s.linkTracking = true;
            s_objectID = "详情页_" + shareName + "_4_点击触发";
            //根据实际追踪的控件进行命名
            s.tl(this, 'o', 'interaction');
            s.linkTracking = false;
        },*/
        wish_submit: function () { //发送按钮
            var s = s_gi(s_account);
            s.linkTrackVars = "prop22,products,events";
            s.linkTrackEvents = "event68";
            s.linkTracking = true;
            s_objectID = "心愿单弹窗_发送_1_点击触发";
            //根据实际追踪的控件进行命名
            s.products = ";" + prdInfo.prdId + ";;;;evar23=coo8|evar24=12345";
            s.events = "event68";
            s.tl(this, 'o', 'interaction');
            s.linkTracking = false;
        },
        share: function (shareName) {
            //链接名称: shareName(复制连接 微信扫一扫)
            var s = s_gi(s_account);
            s.linkTrackVars = "prop22";
            s.linkTracking = true;
            s_objectID = "心愿单弹窗_" + shareName + "_2_点击触发";
            //根据实际追踪的控件进行命名
            s.tl(this, 'o', 'interaction');
            s.linkTracking = false;
        }
    };

    /* 详情页主信息私有命名空间 */
    var prdInfoMain = function(){
        /* 登录的用户ID */
        this.lgId = null;
        /* 弹出层对象 */
        this.dgObj=$("#innerBox");
        /*开关*/
        this.onoff=false;
    };
    prdInfoMain.prototype = {
        /* 初始化请求事件、绑定事件 */
        bind:function(){
            var _this = this;
            //心愿单
            $('#showWish').click(function () {
                if(!_this.onoff){ //第一次点击时如果没登陆需登陆，登陆成功后不需重复登陆
                    g.login(function(){
                        _this.onoff=true;
                        _this.lgId=loginData.loginId;
                        _this.wish();
                    });
                }else{
                    _this.wish();
                }
            });
        },
        wish_initStyle: function () { //弹框弹出时，页面样式初始化
            var innerBox = $('#innerBox');
            innerBox.find('#wish_weixin').hide();
            innerBox.find('#send_wish_success').hide();
            innerBox.find('#send_wish_error').hide();

            innerBox.find('#my_mobilePhone').attr('value',innerBox.attr('mobile'));
            innerBox.find('.my_mobilePhone_wrap').removeClass('verify_r');
            innerBox.find('.my_mobilePhone_wrap').removeClass('verify_e');

            innerBox.find('#wish_verifyNum').attr('value', '');
            innerBox.find('.verificationCode_wrap').removeClass('verify_r');
            innerBox.find('.verificationCode_wrap').removeClass('verify_e');

            innerBox.find('#his_mobilePhone').attr('value', '');
            innerBox.find('.his_mobilePhone_wrap').removeClass('verify_r');
            innerBox.find('.his_mobilePhone_wrap').removeClass('verify_e');
            innerBox.find('.his_mobilePhone_wrap').removeClass('wish_verify_btn_disabled');

            innerBox.find('#wish_text').val('');
            innerBox.find('#submit_wish').removeAttr('disabled');

            window.sec = 61;
            clearInterval(window.wish_timer);
            innerBox.find('#wish_verify_btn').removeAttr('send');
            innerBox.find('#wish_verify_btn').removeClass('wish_verify_btn_disabled');
            innerBox.find('#wish_verify_btn').html('免费获取验证码');

            innerBox.find('#wish_form').show();

        },
        phone_verification: function (object){  //{'objwrap':'','objvalue':'',before_call:function(){}}
            object.objwrap.removeClass('verify_r');
            object.objwrap.removeClass('verify_e');

            //决定性因素，返回ture,后面不需判断
            if(object.before_call&&object.before_call()){
                return false;
            }

            if ( object.phone_reg.test(object.objvalue)) {
                object.objwrap.addClass('verify_r');
            } else {
                object.objwrap.addClass('verify_e');
            }

            if ($.trim(object.objvalue).length == 0) {
                object.objwrap.removeClass('verify_r');
                object.objwrap.removeClass('verify_e');
            }
        },
        //发起请求，弹出心愿单
        wish: function () {
            var _this = this;
            $.ajax({
                type: "GET",
                url:"//ss"+cookieDomain+"/item/v1/user/contact/"+_this.lgId+"/flag/item/getMobile",
                dataType: "jsonp",
                jsonpName: "getMobile",
                success: function (data) {
                    if(!$.isEmptyObject(data)&&data.success){
                        var mobile=data.mobile?data.mobile:"";
                        $('#innerBox').attr('mobile', mobile);//获取到的手机号

                        _this.dialog({
                            inner: "#wish_wrap_dia", cssname: "dialogBox Wish",
                            beforClose: function () { //微信扫一扫的界面的时候处理样式
                                if ($('#innerBox').find('#wish_weixin').css('display') == 'block') {
                                    //弹框弹出时，页面样式初始化
                                    _this.wish_initStyle();
                                    return false;
                                }
                            },
                            closeCall: function (){
                                clearInterval(window.wish_timer);
                                window.sec = 61;
                            },callback: function () {  //弹出框出现后，回调相关DOM节点处理
                                //DOM 节点处理（文本focus 处理、文本框验证处理、手机号验证、发送验证码请求、微信点击二维码、复制链接功能）
                                _this.wishDom();
                            }
                        });
                    }
                }
            });

        },
        //DOM 节点处理（文本focus 处理、文本框验证处理、手机号验证、发送验证码请求、微信点击二维码、复制链接功能）
        wishDom: function () {

            var _this = this;
            var allthis = this;
            var innerBox = $('#innerBox');

            var reg_mobilePhoneNumber = /^1(3|4|5|7|8)\d{9}$/;
            window.sec = 61;//变灰的重新发送验证码的时间
            var sendTimes = 6;//发送次数
            var full_mobilePhoneNumber = []; //超过发送次数的手机号

            var my_mobilePhone = innerBox.find('#my_mobilePhone'); //第一个手机号
            var my_mobilePhone_wrap = innerBox.find('.my_mobilePhone_wrap');

            var verificationCode = innerBox.find('#wish_verifyNum');//验证码
            var verificationCode_wrap = innerBox.find('.verificationCode_wrap');

            var his_mobilePhone = innerBox.find('#his_mobilePhone');//他的手机号
            var his_mobilePhone_wrap = innerBox.find('.his_mobilePhone_wrap');

            var wish_verifyNum = innerBox.find('#wish_verifyNum');

            var wish_text = innerBox.find('#wish_text'); //发送的文本
            var wish_text_wrap = innerBox.find('.wish_text_wrap');


            innerBox.find('#my_mobilePhone').attr('value', $('#innerBox').attr('mobile'));


            innerBox.find('#my_mobilePhone,#wish_verifyNum,#his_mobilePhone').focus(function () { $(this).parent().addClass('focus'); });
            innerBox.find('#my_mobilePhone,#wish_verifyNum,#his_mobilePhone').blur(function () { $(this).parent().removeClass('focus'); });
            //发送文本
            wish_text.focus(function () {
                $(this).addClass('wish_text_focus');
                $('.wish_text_presentation').hide();
                wish_text_wrap.removeClass('wish_text_error');
            });
            //发送文本
            wish_text.blur(function () {
                var wish_text_value=$(this).val();
                $(this).removeClass('wish_text_focus');
                if ($.trim(wish_text_value) == '') {
                    $('.wish_text_presentation').show();
                }
                if ($.trim(wish_text_value).length&&$.trim(wish_text_value).length>140) {
                    wish_text_wrap.addClass('wish_text_error');
                }
            });

            //发送文本
            wish_text.keyup(function () {
                wish_text_wrap.removeClass('wish_text_error');
            });


            //第一个手机号
            my_mobilePhone.blur(function () {
                var phone_this=$(this);
                _this.phone_verification({
                    'objwrap':my_mobilePhone_wrap,
                    'objvalue':phone_this.val(),
                    'phone_reg':reg_mobilePhoneNumber,
                    'before_call':function(){
                        if ($.trim(phone_this.val()) == $('#innerBox').attr('mobile')) { //号码为默认号码时，不用走下面的判断;
                            return true;
                        }else{
                            return false;
                        }
                    }
                });

            });

            my_mobilePhone.keyup(function () {
                my_mobilePhone_wrap.removeClass('verify_r');
                my_mobilePhone_wrap.removeClass('verify_e');
            });

            //第二个手机号
            his_mobilePhone.blur(function () {
                var phone_this=$(this);
                //去掉手机号相同时，提示语句
                his_mobilePhone_wrap.removeClass('verify_double_wrap');

                _this.phone_verification({
                    'objwrap':his_mobilePhone_wrap,
                    'objvalue':phone_this.val(),
                    'phone_reg':reg_mobilePhoneNumber,
                    'before_call':function(){
                        if ($.trim(phone_this.val()) == $.trim(my_mobilePhone.val()) && $.trim(phone_this.val()) != '') {  //两个手机号一致时，后面的判断不用执行，页面提示出错
                            his_mobilePhone_wrap.addClass('verify_double_wrap');
                            return true;
                        }else{
                            return false;
                        }
                    }
                });

            });

            his_mobilePhone.keyup(function () {
                his_mobilePhone_wrap.removeClass('verify_r');
                his_mobilePhone_wrap.removeClass('verify_e');
                his_mobilePhone_wrap.removeClass('verify_double_wrap');
            });

            //验证码
            wish_verifyNum.blur(function () {
                var wish_verifyNum_value=$(this).val();
                verificationCode_wrap.removeClass('verify_e');
                verificationCode_wrap.removeClass('verify_r');

                if ($.trim(wish_verifyNum_value).length == 0) {
                    verificationCode_wrap.removeClass('verify_r');
                    verificationCode_wrap.removeClass('verify_e');
                }
                if ($.trim(wish_verifyNum_value).length&&wish_verifyNum_value.length != 6) {
                    verificationCode_wrap.addClass('verify_e');
                }
            });
            //验证码
            wish_verifyNum.on('change keyup',function(){
                verificationCode_wrap.removeClass('verify_r');
                verificationCode_wrap.removeClass('verify_e');
            });
            //发送按钮hover效果
            innerBox.find('#submit_wish').hover(function () {
                $(this).css('background', '#d00');
            }, function () {
                $(this).css('background', '#c30000');
            });

            //验证非初始手机号码 是否是空是否符合手机号的格式
            function mobilecheck(){
                if (!($('#innerBox').attr('mobile').length == 11 && my_mobilePhone.val() == $('#innerBox').attr('mobile'))) {  //如果返回的号码不是初始号码
                    if(!$.trim(my_mobilePhone.val())){
                        alert('请输入手机号码');
                        my_mobilePhone.focus();
                        return false;
                    }else if (!reg_mobilePhoneNumber.test(my_mobilePhone.val())) {
                        my_mobilePhone.focus();
                        my_mobilePhone_wrap.removeClass('verify_r');
                        my_mobilePhone_wrap.addClass('verify_e');
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    return true;
                }
            }

            //获取验证码，发请求，验证码倒计时
            innerBox.find('#wish_verify_btn').click(function () {

                var _this = $(this);
                _this.attr('send', '1');

                //检测手机号 是否达到发送次数
                var flag = false;
                for (var i = 0 ; i < full_mobilePhoneNumber.length; i++) {
                    if (full_mobilePhoneNumber[i] == my_mobilePhone.val()) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    alert('该手机号今日验证次数已满，请明日再试');
                    clearInterval(window.wish_timer);
                    window.sec = 61;

                    _this.html('免费获取验证码');
                    _this.removeClass('wish_verify_btn_disabled');
                    verificationCode_wrap.removeClass('verify_r');
                    verificationCode_wrap.removeClass('verify_e');
                    return false;
                }

                if (window.sec <= 60) {
                    return false;
                }

                //验证非初始手机号码 是否是空是否符合手机号的格式
                if(!mobilecheck()){
                    return false;
                }

                verificationCode_wrap.removeClass('verify_e');
                verificationCode_wrap.addClass('verify_r');
                _this.addClass('wish_verify_btn_disabled');

                window.sec--;
                _this.html(sec + '秒后重新获取');
                clearInterval(window.wish_timer);
                window.wish_timer = setInterval(function () {
                    window.sec--
                    if (window.sec < 0) {
                        clearInterval(window.wish_timer);
                        _this.html('免费获取验证码');
                        _this.removeClass('wish_verify_btn_disabled');
                        window.sec = 61;
                    } else {
                        _this.html(window.sec + '秒后重新获取');
                    }
                }, 1000);

                //$.ajax(); 请求验证码
                $.ajax({
                    type: "GET",
                    url:'//ss'+cookieDomain+'/item/v1/d/wish/code/'+allthis.lgId+'/'+my_mobilePhone.val()+'/flag/item/securitycode',
                    dataType: "jsonp",
                    jsonpName: "securitycode",
                    success: function (data) {
                        var iresult = data.result;
                        if ( !$.isEmptyObject(data) && data.success ) {
                            switch (iresult)
                            {
                                case 3000:

                                    break;
                                case -1004:
                                    alert("该手机号今日验证次数已满，请明日再试");
                                    clearInterval(window.wish_timer);
                                    window.sec = 61;
                                    full_mobilePhoneNumber.push(my_mobilePhone.val());
                                    _this.html('免费获取验证码');
                                    _this.removeClass('wish_verify_btn_disabled');
                                    verificationCode_wrap.removeClass('verify_r');
                                    verificationCode_wrap.removeClass('verify_e');
                                    break;
                                case -1002:
                                    verificationCode_wrap.removeClass('verify_r');
                                    alert("短信验证码发送失败，请重新获取验证码");
                                    break;
                                case -107:
                                    my_mobilePhone_wrap.removeClass('verify_r');
                                    alert("该手机号已加入黑名单,请联系客服");
                                    break;
                                case -110:
                                    my_mobilePhone_wrap.removeClass('verify_r');
                                    alert("该手机号已加入黑名单,请联系客服");
                                    break;
                                case -106:
                                    my_mobilePhone_wrap.removeClass('verify_r');
                                    my_mobilePhone_wrap.addClass('verify_e');
                                    alert("请输入正确的手机号");
                                    break;
                                case -108:
                                    alert('超过最大发送次数,请延后再试');
                                    clearInterval(window.wish_timer);
                                    window.sec = 61;
                                    full_mobilePhoneNumber.push(my_mobilePhone.val());
                                    _this.html('免费获取验证码');
                                    _this.removeClass('wish_verify_btn_disabled');
                                    verificationCode_wrap.removeClass('verify_r');
                                    verificationCode_wrap.removeClass('verify_e');
                                    break;
                                default:
                                    verificationCode_wrap.removeClass('verify_r');
                                    alert("短信验证码发送失败，请您稍后再试");
                            }
                        }else{
                            verificationCode_wrap.removeClass('verify_r');
                            alert("获取短信验证码失败，请您稍后再试");
                        }
                    }
                });
            });
            //点击微信，展示相关二维码信息
            innerBox.find('#wish_show_weixin').click(function () {
                innerBox.find('#wish_form').hide();
                innerBox.find('#send_wish_error').hide();
                innerBox.find('#send_wish_success').hide();

                innerBox.find('#wish_weixin').show();
                omniture_wish.share('weixin');
            });


            //点击提交按钮依次验证相关信息，通过验证后，发请求提出心愿单
            innerBox.find('#submit_wish').click(function () {
                var _this = $(this);

                //验证非初始手机号码 是否是空是否符合手机号的格式
                if(!mobilecheck()){
                    return false;
                }

                //如果没有输入验证码
                if(!$.trim(verificationCode.val()).length){
                    verificationCode.focus();
                    alert('请输入验证码');
                    return false;
                }

                //验证码格式不对
                if ($.trim(verificationCode.val()).length&&verificationCode.val().length != 6) {
                    verificationCode.focus();
                    verificationCode_wrap.removeClass('verify_r');
                    verificationCode_wrap.addClass('verify_e');
                    return false;
                }

                //如果没获取验证码
                if (innerBox.find('#wish_verify_btn').attr('send') != '1') {
                    alert('请获取验证码');
                    verificationCode.focus();
                    return false;
                }

                //第二个手机号为空验证
                if (!$.trim(his_mobilePhone.val()).length) {
                    his_mobilePhone.focus();
                    his_mobilePhone_wrap.removeClass('verify_r');
                    his_mobilePhone_wrap.removeClass('verify_e');
                    alert('请输入手机号码');
                    return false;
                }

                //第二个手机号与第一个不能一样
                if (my_mobilePhone.val() == his_mobilePhone.val()) {
                    alert('两个电话号码不能重复');
                    his_mobilePhone.focus();
                    return false;
                }

                //第二个手机号的格式验证
                if ($.trim(his_mobilePhone.val()).length&&(!reg_mobilePhoneNumber.test(his_mobilePhone.val()))) {
                    his_mobilePhone.focus();
                    his_mobilePhone_wrap.removeClass('verify_double_wrap');
                    his_mobilePhone_wrap.removeClass('verify_r');
                    his_mobilePhone_wrap.addClass('verify_e');
                    return false;
                }

                //输入的文本内容验证长度
                if (wish_text.attr('value').length > 140) {
                    //wish_text.value = wish_text.val(wish_text.val().substring(0, 140));
                    wish_text.focus();
                    wish_text_wrap.addClass('wish_text_error');
                    return false;
                }


                //发送请求
                $.ajax({
                    type: "GET",
                    url:'//ss'+cookieDomain+'/item/v1/d/wish/send/flag/item/sendwish',
                    data: {
                        userId:allthis.lgId,
                        skuId: window.prdInfo.sku,
                        mobileNumber: innerBox.find('#my_mobilePhone').attr('value'),
                        requestType: "compare",
                        codeType: "wish_check_mobile",
                        message: $.trim(innerBox.find('#wish_text').val()),
                        mobile: innerBox.find('#his_mobilePhone').attr('value'),
                        productId: window.prdInfo.prdId,
                        verifyCode: innerBox.find('#wish_verifyNum').val(),
                        productUrl: window.location.href,
                        productName: window.prdInfo.description
                    },
                    dataType: "jsonp",
                    jsonpName: "sendwish",
                    success: function (data) {
                        _this.removeAttr('disabled');
                        var iresult = data.result;
                        switch (iresult)
                        {
                            case 3000:
                                innerBox.find('#wish_form').hide();
                                innerBox.find('#wish_weixin').hide();
                                innerBox.find('#send_wish_error').hide();
                                innerBox.find('#send_wish_success').show();
                                break;
                            case 10: //2个号码不能重复
                                his_mobilePhone_wrap.focus();
                                his_mobilePhone_wrap.removeClass('verify_r');
                                his_mobilePhone_wrap.removeClass('verify_e');
                                his_mobilePhone_wrap.addClass('verify_double_wrap');
                                break;
                            case -1002: //验证码错误
                                wish_verifyNum.focus();
                                verificationCode_wrap.removeClass('verify_r');
                                verificationCode_wrap.addClass('verify_e');
                                alert('验证码错误');
                                break;
                            case -1003:  //验证码错误
                                wish_verifyNum.focus();
                                verificationCode_wrap.removeClass('verify_r');
                                verificationCode_wrap.addClass('verify_e');
                                alert('验证码错误');
                                break;
                            case -1004:
                                alert('校验次数超过限制,请重新获取验证码');
                                clearInterval(window.wish_timer);
                                window.sec = 61;
                                innerBox.find('#wish_verify_btn').html('免费获取验证码');
                                innerBox.find('#wish_verify_btn').removeClass('wish_verify_btn_disabled');
                                innerBox.find('#wish_verify_btn').removeAttr('send', '1');
                                innerBox.find('#wish_verifyNum').val('');
                                verificationCode_wrap.removeClass('verify_r');
                                verificationCode_wrap.removeClass('verify_e');
                                break;
                            case -103:
                                alert('短信内容不符合要求');
                                $('#dialogBox').find('#wish_text').focus();
                                break;
                            case -107:
                                alert('该手机号已加入黑名单,请联系客服');
                                my_mobilePhone_wrap.removeClass('verify_r');
                                break;
                            case -108:
                                alert('超过最大发送次数,请延后再试');
                                break;
                            case -110:
                                alert('该手机号已加入黑名单,请联系客服');
                                my_mobilePhone_wrap.removeClass('verify_r');
                                break;
                            case -112:
                                alert('超过当前小时最大发送量');
                                break;
                            case -113:
                                alert('短信内容或手机号为空');
                                break;
                            case -114:
                                alert('手机号和短信内容个数不匹配');
                                break;
                            default:
                                innerBox.find('#wish_form').hide();
                                innerBox.find('#wish_weixin').hide();
                                innerBox.find('#send_wish_success').hide();
                                innerBox.find('#send_wish_error').show();
                                break;
                        }
                    }

                });

                _this.attr('disabled', 'disabled');

                omniture_wish.wish_submit();
            });
            //复制链接 功能
            innerBox.find('#copy_link').click(function () {
                try {
                    window.clipboardData.setData("Text", window.location.href);
                    innerBox.find('#copy_link_success').show();

                    if ($.browser.msie && $.browser.version == '7.0') {
                        innerBox.find('#copy_link_success').css('bottom', '63px');
                    }
                    if ($.browser.msie && $.browser.version == '6.0') {
                        innerBox.find('#copy_link_success').css('bottom', '43px');
                    }

                    setTimeout(function () {
                        innerBox.find('#copy_link_success').hide();
                    }, 3000);

                } catch (e) {
                    alert('您的浏览器不支持此功能,请手动复制');
                }
                omniture_wish.share('复制链接');
            });
            //给她留言 文本默认字体点击时
            $('.wish_text_presentation').click(function () {
                $(this).hide();
                wish_text.focus();
            });

            //点击再次发送心愿单时
            $('.tichu_wish,.try_again').click(function (){
                //弹框弹出时，页面样式初始化
                _this.wish_initStyle();
            });

        },
        /* 主信息弹出层 logData:{inner:"弹出层模型",unlock:"是否锁屏",errIco:"提示图标样式",errMsg:"提示内容",callback:"弹出时回调函数",closeCall:"关闭时回调函数",closeAuto:定时关闭提示层}} */
        dialog:function(logData){
            if($.browser.msie && parseInt($.browser.version)<7)$(".dialog").css("position","static");
            this.dgObj.html($(logData.inner).html());
            if(logData.errIco)this.dgObj.find(".dgIcon").addClass(logData.errIco);
            if(logData.errMsg)this.dgObj.find(".errorBox").html(logData.errMsg);
            $("#dialogBox").removeAttr("class").addClass(logData.cssname||"dialogBox").show();
            if(logData.callback)logData.callback();
            var _c={},_t=this;if(logData.closeCall)_c.closeCall = logData.closeCall;
            $("#close").unbind("click")
            $("#close").click(function () {
                if (logData.beforClose && logData.beforClose() == false) {
                    return;
                }
                _t.dialogClose.apply(_c);
            });
            _t.dgObj.find(".stages").click(function(){_t.dialogClose();});
            if(!logData.unlock)$("#dialogBox").gPop({lockBgColor:'#000',opacity:0.15,isColseBtn:false});
            if(logData.closeAuto){window.setTimeout(function(){_t.dialogClose();},3000);}
        },
        dialogClose:function(){
            $("#dialogBox,#popLock").hide();
            if(this.closeCall)this.closeCall();
        },
        /*阻止元素默认行为*/
        stopLink:function(e){
            //W3C浏览器下
            if(e && e.preventDefault){e.preventDefault();}
            //IE下
            else{window.event.returnValue = false;}
        },
        /* 替换元素图片 */
        imgSrc:function(imgObj){
            if(imgObj.attr("gome-src"))imgObj.attr("src",imgObj.attr("gome-src")).removeAttr("gome-src");
        },
        /* 截取指定长度字符，多余显示省略号 */
        spltStr:function suolve(str,lth){
            var temp1 = str.replace(/[^\x00-\xff]/g,"**");/*将汉字或全拼字符截成两个字节*/
            var temp2 = temp1.substring(0,lth);
            /*找出有多少个*/
            var x_length = temp2.split("\*").length - 1;
            var hanzi_num = x_length/2;
            lth = lth - hanzi_num ;/*实际需要sub的长度是总长度-汉字长度*/
            var res = str.substring(0,lth);
            var _tmp = "";
            if(lth < str.length){_tmp =res+"...";}
            else{_tmp = res;}
            return _tmp;
        }
    }
    /* 事件初始化 */
    prdMain = new prdInfoMain();
    prdMain.bind();
    // return prdMain;

});
