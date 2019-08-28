//登陆
var Page = getApp().sensors.Page;
let app = getApp();
Page({
  data: {
    isShowAuthoryPhone: true,//是否展示授权手机号界面，true展示，false展示手机号验证界面
    showPhoneError: true, //是否展示手机号错误提示，true隐藏，false显示
    codeIsClick: true, //验证码是否可以点击，true表示不能点击，false表示能点击
    codeHide: false, //验证码是否隐藏，true隐藏，false显示
    codeError: '', //验证码错误提示内容，如果内容为空则隐藏
    countdownHide: true, //是否隐藏倒计时按钮，true隐藏，false显示
    countdown: 120, //倒计时时间
    confirmIsClick: true, //完成按钮是否可以点击，true表示不能点击，false表示能点击
    confirmMask: true, //true隐藏，false显示
    relationCode: '', //主要用于判断是去关联已有用户，还是关联新用户
    relationNewUserCode: 1001, //关联新用户的code
    passwordError: '', //密码错误图提示内容 ，如果内容为空则隐藏
    phone: '', //手机号
    code: '', //验证码值
    password: '', //密码
    phoneClear: false,
    codeClear: false,
    phoneFocus: false, //获取焦点
    passwordClear: false,
    codeTxt: '获取验证码',
    isSelectAuthoryAgreement: true,//是否选择微信手机授权协议
    isSelectAgreement: true,//协议是否选择
    loginCode:'',//wx:login获取到的code
    avatarUrl: '',
    nickName: ''
  },

  countdown: 120, // 倒计时,

  onLoad: function(options) {
    var that = this;
    if (options._latest_cmpid) {
      wx.setStorageSync('_latest_cmpid', options._latest_cmpid)
    }
    var userInfo = wx.getStorageSync('userInfo');
    that.setData({
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName
    })
    that.authoryLogin();
    
  },

  //手机输入input事件
  bindPhoneInput: function(ev) {

    let val = ev.detail.value,
      codeIsClick = true,
      len = val.length;


    //手机号输入11位时让验证码可以点击
    if (len == 11) {
      codeIsClick = false;
    }

    this.setData({
      codeIsClick: codeIsClick,
      phone: val,
      codeError: false,
      phoneClear: (len ? true : false)
    })
    this.dealConfirmIsClick();

  },

  //手机号获取焦点事件，让手机号错误提示隐藏
  bindPhoneFocus: function(ev) {
    let len = ev.detail.value;
    this.setData({
      showPhoneError: true,
      phoneClear: (len ? true : false)
    })
  },

  //手机号失去焦点事件
  bindPhoneBlur: function(ev) {
    this.setData({
      phoneClear: false,
      codeError: false
    })
  },

  bindClearPhone: function() {
    wx.hideKeyboard();
    this.setData({
      phone: '',
      phoneClear: false,
      codeIsClick: true
    })

    this.dealConfirmIsClick();
  },

  //验证码输入input事件
  bindCodeInput: function(ev) {
    let val = ev.detail.value,
      len = val.length;
    this.setData({
      code: val,
      codeClear: (len ? true : false)
    })

    this.dealConfirmIsClick();
  },

  //验证码获取焦点事件
  bindCodeFocus: function(ev) {
    let len = ev.detail.value;
    this.setData({
      codeError: '',
      codeClear: (len ? true : false)
    })
  },

  //验证码失去焦点事件
  bindCodeBlur: function(ev) {
    this.setData({
      codeClear: false
    })
  },

  bindClearCode: function() {
    wx.hideKeyboard();
    this.setData({
      code: '',
      codeClear: false
    })
    this.dealConfirmIsClick();
  },

  //获取验证码，并校验手机号
  bindGetCode: function() {
    let that = this,
      phone = this.data.phone,
      isChecked = app.checkPhone(phone),
      snsUserId = wx.getStorageSync("openId");

    if (isChecked) { //为真表示手机号前端校验不通过
      that.setData({
        showPhoneError: false
      })
    } else {

      //请求验证码
      wx.request({
        url: app.vipHost + '/relation/getRelationPhoneCode.no',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          'gome-header': 'wxa.gome.com.cn',
          'Cookie': 'DSESSIONID=' + wx.getStorageSync("dsessionId")
        },
        data: {
          phoneNum: phone,
          snsUserId: snsUserId,
          whereFrom: 'weApp'
        },
        method: 'POST',
        success: function(data) {
          let code = data.data.code,
            str = '';

          /*返回2000的时候点下面的完成请求的是relationPhoneBind.no，返回1001的时候，展示出设置密码的选项，此时点击下方完成请求的是relationPhoneReg.no*/

          /*2004,"系统忙请刷新后重试" ——请求非法
          1001,"用户不存在" —— 需要展示设置密码
          2000,"成功" —— 发送成功
          2001,"短信发送失败"
          1002,"账号冲突 "
          0000,"系统内部异常"*/

          that.setData({
            relationCode: code
          })


          if (code != 2000 && code != that.data.relationNewUserCode) {
            if (code == 1009 || code == 600 || code == 1301 || code == 1300 || code == 1012 || code == 1013) {
              wx.showModal({
                title: '提示',
                content: data.data.message,
                cancelText: "更换号码",
                confirmText: "联系客服",
                confirmColor: "#F66A6B",
                success: function(res) {
                  if (res.confirm) {
                    wx.makePhoneCall({
                      phoneNumber: '400-811-3333'
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                    that.setData({
                      phone: '',
                      code: '',
                      phoneClear: false,
                      codeClear: false,
                      codeTxt: '获取验证码',
                      codeIsClick: false,
                      phoneFocus: true
                    })
                  }
                },

              })
            } else {
              str = data.data.message;
              that.setData({
                codeError: str
              })

            }

          } else {
            //展示倒计时，隐藏验证码，隐藏验证码错误提示
            that.setData({
              showPhoneError: true,
              codeHide: true,
              countdownHide: false,
              codeError: ''
            })
            that.dealConfirmIsClick();
          }
        },
        fail: function() {}
      })

      //倒计时
      that.dealCountdown();
    }
  },

  //密码获取焦点事件，让密码错误提示隐藏
  bindPasswordFocus: function(ev) {
    let len = ev.detail.value;
    this.setData({
      passwordError: '',
      passwordClear: (len ? true : false)
    })
  },

  //密码输入input事件
  bindPasswordInput: function(ev) {
    let val = ev.detail.value,
      len = val.length;
    this.setData({
      password: val,
      passwordClear: (len ? true : false)
    })
    this.dealConfirmIsClick();
  },

  //密码失去焦点事件
  bindPasswordBlur: function(ev) {
    this.checkPassword();
    this.setData({
      passwordClear: false
    })
  },

  bindClearPassword: function() {
    wx.hideKeyboard();
    this.setData({
      password: '',
      passwordClear: false
    })
    this.dealConfirmIsClick();
  },
  
  bindAuthoryRadioChange: function(e) {
    let value = e.detail.value;
    this.setData({
      isSelectAuthoryAgreement: (value ? true : false)
    })
  },

  bindRadioChange: function(e) {
    let value = e.detail.value;
    this.setData({
      isSelectAgreement: (value ? true : false)
    })
    this.dealConfirmIsClick();
  },

  //完成事件
  bindConfirm: function(e) {
    this.dealCompleteRelation();
  },

  //phoneNum如果有值，则表示用微信一键绑定手机号，如果是新用户的给一个默认的密码，不需要验证码
  dealCompleteRelation: function (phoneNum) {
    let that = this,
      phone = phoneNum || this.data.phone,
      snsUserId = wx.getStorageSync("openId"),
      url = '/relation/relationPhoneBind.no',
      param = {
        phoneNum: phone,
        snsUserId: snsUserId,
        distinctId: app.sensors.store.getDistinctId(),
        whereFrom: 'weApp',
        isWechatBind: phoneNum ? 1 : 0//传0或者1，0表示不是微信绑定的，1表示是微信绑定的
      };

    //注册埋码
    let _cmpid = wx.getStorageSync('_latest_cmpid');
    let _latest_cmpid = _cmpid.split('_');
    app.sensors.track('Register', {
      tid: app.tid,
      _latest_cmpid: _cmpid,
      first_channel: _latest_cmpid[0], //根绝cmpid 拆解的一级渠道
      second_channel: _latest_cmpid[1], //根绝cmpid 拆解的二级渠道
      third_channel: _latest_cmpid[2], //根绝cmpid 拆解的三级渠道
      login_type: '5', //注册方式
      phone: phone //手机号
    });

    if (!phoneNum) {
      param.msgCode = this.data.code;
      let isChecked = app.checkPhone(phone);
      if (isChecked) { //为真表示手机号前端校验不通过
        that.setData({
          showPhoneError: false
        })

        return false;
      }
    }

    //需要校验密码
    if (that.data.relationCode == that.data.relationNewUserCode) {
      url = '/relation/relationPhoneReg.no';
      param.pwd = this.data.password;

      if (!phoneNum) {
        if (that.checkPassword()) {
          return false;
        }
      }else {
        param.pwd = 'SNS_GOME_PWD';
      }
    }

    let userInfo = wx.getStorageSync('userInfo'),
      nickName = userInfo.nickName;
    param.snsUserName = nickName;

    if (!phoneNum) {
      that.setData({
        confirmMask: false
      })
    }


    wx.request({
      url: app.vipHost + url,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn',
        'Cookie': 'DSESSIONID=' + wx.getStorageSync("dsessionId")
      },
      data: param,
      method: 'POST',
      success: function (data) {
        let code = data.data.code,
          extParams = data.data.extParams,
          str = '';
        if (!phoneNum) {
          that.setData({
            confirmMask: true
          })
        }
        
        let loginBackUrl = wx.getStorageSync('loginBackUrl');

        if (code == 2000) { //问后端要scn

          //scn存入cookie
          if (extParams && extParams.SCN) {
            let scn = extParams.SCN;
            wx.setStorageSync("scn", scn);
            app.sensors.login(extParams.userId);
            app.scn = scn;
            wx.setStorageSync("memberInfo", {
              gradeNO: extParams.gradeNO || '',
              gradeName: extParams.gradeName || '',
              loginName: extParams.loginName || ''
            });


            //跳转
            let re = /pages\/index\/index|pages\/profile\/profile|pages\/cart\/cart|pages\/shopList\/shopList/;
            if (re.test(loginBackUrl)) {
              wx.switchTab({
                url: loginBackUrl
              })
            } else {
              wx.reLaunch({
                url: loginBackUrl
              })
            }

          }
        } else {
          if (code == 1003) {
            str = '关联失败，请重试';
          } else if (code == 1004) {
            str = '您的密码安全性较低，请重新设置';
          } else if (code == 1005) {
            str = '很抱歉，注册失败，请重试';
          } else if (code == 1006) {
            str = '您已提交，请稍后';
          } else if (code == 2003) {
            str = '您输入的验证码有误，请重新输入';
            if (!phoneNum) {
              that.setData({
                code: ''
              })
              that.dealConfirmIsClick();
            }
          } else if (code == 2004) {
            str = '系统忙，请稍后再试';
          } else {
            str = '系统异常';
          }
          wx.showToast({
            title: str,
            icon: 'none',
            mask: true,
            duration: 2000
          })
        }
      },
      fail: function () {
        if (!phoneNum) {
          that.setData({
            confirmMask: true
          })
        }
      }
    })

  },

  //切换校验手机号关联
  switchDiffAuthory: function() {
    this.setData({
      isShowAuthoryPhone: false
    })
  },

  //微信授权手机号
  getPhoneNumber: function(e) {
    var detail = e.detail,
        that = this,
        param = {};
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      param.encryptedData = detail.encryptedData,
      param.iv = detail.iv;

      wx.checkSession({
        success(res) {
          that.getPhoneNumberForWeApp(param);
        },
        fail() {
          wx.login({
            success(res) {
              if (res.code) {
                that.setData({
                  loginCode: res.code
                })
                that.getPhoneNumberForWeApp(param);
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        }
      })
    }else {
      that.authoryLogin();
    }

  },

  getPhoneNumberForWeApp: function(param) {
    let that = this;
    param.whereFrom = 'weApp';
    param.code = this.data.loginCode;
    //获取解码的手机号
    wx.request({
      url: app.vipHost + '/quicklogin/getPhoneNumberForWeApp.no',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn',
        'Cookie': 'DSESSIONID=' + wx.getStorageSync("dsessionId")
      },
      data: param,
      method: 'POST',
      success: function (data) {
        var data = data.data,
          code = data.code;
        that.authoryLogin();
        if (code == 200) {
          let phone = data.phoneNumber;
          that.dealAuthoryCode(phone);
        } else {
          wx.showToast({
            title: data.message || '系统忙，请稍后再试',
            icon: 'none',
            mask: true,
            duration: 2000
          })
        }
      },
      fail: function () { }
    })
  },

  authoryLogin() {
    var that = this;
    //因为code只能用一次，所以在可以授权手机号的页面再获取一次,在回调中调用 wx.login 登录，可能会刷新登录态。此时服务器使用 code 换取的 sessionKey 不是加密时使用的 sessionKey，导致解密失败。建议开发者提前进行 login；或者在回调中先使用 checkSession 进行登录态检查，避免 login 刷新登录态。
    wx.login({
      success(res) {
        if (res.code) {
          that.setData({
            loginCode: res.code
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

  },

  //处理授权验证码
  dealAuthoryCode: function(phone) {
    var that = this;
    var snsUserId = wx.getStorageSync("openId");
    wx.request({
      url: app.vipHost + '/relation/getRelationPhoneCode.no',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn',
        'Cookie': 'DSESSIONID=' + wx.getStorageSync("dsessionId")
      },
      data: {
        phoneNum: phone,
        snsUserId: snsUserId,
        whereFrom: 'weApp',
        isWechatBind: 1//传0或者1，0表示不是微信绑定的，1表示是微信绑定的
      },
      method: 'POST',
      success: function (data) {
        let code = data.data.code,
          str = '';

        /*返回2000的时候点下面的完成请求的是relationPhoneBind.no，返回1001的时候，展示出设置密码的选项，此时点击下方完成请求的是relationPhoneReg.no*/

        /*2004,"系统忙请刷新后重试" ——请求非法
        1001,"用户不存在" —— 需要展示设置密码
        2000,"成功" —— 发送成功
        2001,"短信发送失败"
        1002,"账号冲突 "
        0000,"系统内部异常"*/

        that.setData({
          relationCode: code
        })

        if (code != 2000 && code != that.data.relationNewUserCode) {
          if (code == 1009 || code == 600 || code == 1301 || code == 1300 || code == 1012 || code == 1013) {
            wx.showModal({
              title: '提示',
              content: data.data.message,
              cancelText: "更换号码",
              confirmText: "联系客服",
              confirmColor: "#F66A6B",
              success: function (res) {
                if (res.confirm) {
                  wx.makePhoneCall({
                    phoneNumber: '400-811-3333'
                  })
                } else if (res.cancel) {}
              },

            })
          } else {
            wx.showToast({
              title: data.message || '系统忙，请稍后再试',
              icon: 'none',
              mask: true,
              duration: 2000
            })
          }

        } else {
          
          that.dealCompleteRelation(phone)
        }
      },
      fail: function () { }
    })
  },

  //处理倒计时
  dealCountdown: function() {
    let that = this;

    if (this.countdown == 0) {
      this.resetCountdown();
      return false;
    } else {
      this.setData({
        countdown: this.countdown
      })
      this.countdown--;
    }

    setTimeout(function() {
      that.dealCountdown();
    }, 1000);
  },

  //重置倒计时
  resetCountdown: function() {
    this.countdown = 120;
    this.setData({
      countdown: this.countdown,
      codeHide: false,
      codeTxt: '重新获取',
      countdownHide: true
    })
  },

  //完成按钮是否可点击
  dealConfirmIsClick: function() {
    let re = /^\d+$/g,
      phoneLen = this.data.phone.length,
      checkedCode = !re.test(this.data.code),
      passwordLen = this.data.password.length,
      confirmIsClick = true,
      relationCode = this.data.relationCode,
      relationNewUserCode = this.data.relationNewUserCode;
      if (!this.data.isSelectAgreement) {
        
        confirmIsClick = true;
      }

    if (phoneLen == 11 && !checkedCode) {
      confirmIsClick = false;
    }

    if (!confirmIsClick) { //手机和短信校验不通过

      if (relationCode == 2000 || relationCode == relationNewUserCode) {
        confirmIsClick = false;
      } else {
        confirmIsClick = true;
      }
      if (relationCode == relationNewUserCode) {

        confirmIsClick = (passwordLen < 6 ? true : false);
      }
    }

    this.setData({
      confirmIsClick: confirmIsClick
    })
  },

  //密码校验
  checkPassword: function() {
    let password = this.data.password,
      error = '';

    if (!password) {
      error = '不能为空';
      this.setData({
        passwordError: error
      })
      return true;
    }
    if (!password.match('.{6,20}')) {
      error = '长度应为6-20个字符';
      this.setData({
        passwordError: error
      })
      return true;
    }
    if (/^(.)\1+$/.test(password)) {
      error = '不能为同一字符';
      this.setData({
        passwordError: error
      })
      return true;
    }

    if (password.match('^[0-9]{1,}$')) {
      error = '不能全为数字';
      this.setData({
        passwordError: error
      })
      return true;
    }

    if (!password.match('[A-Za-z0-9~!@#$%^&*()_+\\-=\\[\\];\',\\./\\\\]+') || password.match('[A-Za-z0-9~!@#$%^&*()_+\\-=\\[\\];\',\\./\\\\]+')[0].length < password.length) {
      error = '非法字符，请使用字母加数字或符号的组合，6-20个字符';
      this.setData({
        passwordError: error
      })
      return true;
    }

    return false; //校验通过
  }


})