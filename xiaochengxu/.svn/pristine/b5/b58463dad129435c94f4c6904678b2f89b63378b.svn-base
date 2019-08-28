var app = getApp();
var goHeader = app.goHeader;
var scn;
Page({

  data: {
    billInfo: {}, //发票信息集合
    shops: [], //商品信息集合
    shopsName: '', //商品名字集合
    eMail: '', //邮箱
    eMailSure: true, //邮箱格式正确/错误
    startStatus: false, //弹层默认关闭
    checkShop: false, //展开/关闭发票详情
    shippingGroupId: 0, //配送单id
    orderId: 0, //订单id
  },

  onLoad: function(options) {
    var that = this;
    if (options.invoiceNumber) {
      that.setData({
        invoiceNumber: options.invoiceNumber,
        invoiceCode: options.invoiceCode,
      });
    } else {
      wx.showToast({
        title: '加载失败,请重试',
        icon: 'none'
      })
    }
    wx.getSystemInfo({ //获取系统信息
      success: function(res) {
        that.setData({
          height: res.screenHeight + 'px', //窗口高度
        })
      }
    });
  },

  onShow: function() {
    var that = this;
    scn = app.getScn();
    that.init();
  },

  init: function() {
    var that = this;
    var shopName = '';
    wx.request({ //请求发票详情信息
      url: app.ourHost + '/invoice/queryInvoiceDetail',
      data: {
        scn: scn,
        invoiceNum: that.data.invoiceNumber,
        invoiceCode: that.data.invoiceCode,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader
      },
      success: function(res) {
        if (res.data.code == 200) {
          for (let i = 0; i < res.data.result.orderNumListWx[0].partList.length; i++) {
            shopName = shopName + res.data.result.orderNumListWx[0].partList[i].partDesc;
            if (i >= 0 && i < res.data.result.orderNumListWx[0].partList.length - 1) {
              shopName = shopName + '、';
            }
          }
          that.setData({
            billInfo: res.data.result,
            shops: res.data.result.orderNumListWx[0].partList,
            shopsName: shopName,
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }

      },
      fail: function(res) {
        wx.showToast({
          title: '系统异常，请稍后再试~',
          icon: 'none'
        })
      }
    })
  },

  //控制商品列表展开/收起
  openClose: function() {
    var that = this;
    that.setData({
      checkShop: !that.data.checkShop,
    })
  },

  //点击发送邮箱按钮
  sendMail: function() {
    var that = this;
    that.setData({
      startStatus: true,
    })
  },

  //控制遮罩层显示/关闭
  rulePop: function() {
    var that = this;
    that.setData({
      startStatus: true,
    })
  },

  delPop: function(e) {
    var that = this;
    that.setData({
      startStatus: false,
      eMailSure: true
    })
  },

  //输入邮箱事件
  mailDone: function(e) {
    var that = this;
    that.setData({
      eMail: e.detail.value,
    })
  },

  //点击取消按钮
  mailCancel: function() {
    var that = this;
    that.setData({
      startStatus: false,
      eMailSure: true
    })
  },

  //点击确定按钮
  mailConfirm: function() {
    var that = this;
    var reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (reg.test(that.data.eMail)) { //满足邮箱格式
      that.setData({
        eMailSure: true,
      })
      wx.request({
        url: app.ourHost + '/invoice/sendInvoiceMail',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          'gome-header': goHeader
        },
        data: {
          orderId: that.data.billInfo.orderNumListWx[0].orderId,
          shippingGroupId: that.data.billInfo.orderNumListWx[0].orderNum,
          invoiceNumber: that.data.invoiceNumber,
          emailAddress: that.data.eMail,
        },
        method: 'POST',
        success: function(res) {
          if (res.statusCode == 200) {
            wx.showToast({
              title: res.data.errMsg,
              icon: 'none'
            });
            that.delPop();
          } else {
            wx.showToast({
              title: res.data.errMsg,
              icon: 'none'
            })
          }
        },
        fail: function() {
          wx.showToast({
            title: res.data.errMsg,
            icon: 'none'
          })
        },
      })
    } else {
      that.setData({
        eMailSure: false,
      })
    }
  },

  //发票预览
  previewInvoiceEvent: function() {
    let that = this;
    let pdfUrl = that.data.billInfo.pdfUrl;
    wx.navigateTo({
      url: '/pages/active/active?url=' + pdfUrl + '&title=发票预览',
    })

  },

  //阻止滑动冒泡
  move: function() {

  }
})