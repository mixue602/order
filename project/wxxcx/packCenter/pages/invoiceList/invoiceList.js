/**
 *  发票列表
 *  @since 2018-12-26
 *  @author Lilian
 *  @产品  周涛
 */
let app = getApp();
let scn;
Page({
  data: {
    hegiht: 0,
    num: 0, //发票张数
    price: '0.00', //发票总价格
    list: [], //发票列表
    date: '', //日期
    dateDesc: '', //日期格式转换
    today: '',
    currentPage: 0, //第一页从0开始
    pageSize: 5, //最大条数不能超过10条
    endFlag: true //是否是最后一页
  },
  onLoad: function(options) {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight + 'px'
        })
      },
    })
  },
  onShow: function() {
    let that = this;
    scn = app.getScn();
    that.setData({
      date: '',
      dateDesc: '',
      list: []
    })
    wx.showLoading({
      title: '加载中',
    })
    that.init();
  },
  // 初始化参数
  init: function() {
    let that = this;
    let dates = new Date();
    let today = dates.getFullYear() + "-" + (dates.getMonth() + 1) + "-" + dates.getDate();
    that.setData({
      currentPage: 0,
      endFlag: true,
      today: today,
      list: []
    })
    that.getInvoiceNum();
    that.getInvoiceList();
  },
  // 获取发票张数和总数
  getInvoiceNum: function() {
    let that = this;
    wx.request({
      url: app.ourHost + '/invoice/queryUserInvoiceSum',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': app.goHeader
      },
      data: {
        scn: scn
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 200) {
          let userInvoiceSum = res.data.result.userInvoiceSum;
          that.setData({
            num: userInvoiceSum.invoiceQuantity,
            price: userInvoiceSum.invoiceAmount
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '系统异常，请稍后再试',
          icon: 'none'
        })
      }

    })
  },
  // 发票列表
  getInvoiceList: function() {
    let that = this;
    wx.request({
      url: app.ourHost + '/invoice/queryUserInvoice',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': app.goHeader
      },
      data: {
        scn: scn,
        currentPage: that.data.currentPage,
        pageSize: that.data.pageSize,
        startDate: that.data.date,
        endDate: that.data.date
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          let list = that.data.list;
          let userInvoices = res.data.result.userInvoices;
          if (userInvoices.length < that.data.pageSize) {
            that.setData({
              endFlag: false
            })
          }
          if (userInvoices.length > 0) {
            for (var item of userInvoices) {
              list.push(item);
            }

            that.setData({
              list: list
            })
          }

        }
      },
      fail: function(res) {
        wx.showToast({
          title: '系统异常，请稍后再试',
          icon: 'none'
        })
      }
    })
  },
  // 点击筛选日期
  bindDateChange: function(e) {
    let that = this;
    let date = e.detail.value;
    let dates = new Date(date);
    let dateDesc = dates.getFullYear() + '年' + (dates.getMonth() + 1) + '月';
    that.setData({
      date: date,
      dateDesc: dateDesc
    })
    that.init();
  },
  // 查看全部
  searchAll: function() {
    let that = this;
    that.setData({
      date: '',
      dateDesc: '',
      list: []
    })
    that.init();
  },
  // 加入卡包
  addCardEvent: function(e) {
    let that = this;
    let list = that.data.list;
    let idx = e.currentTarget.dataset.idx;
    let invoiceCode = list[idx].invoiceCode;
    let invoiceNum = list[idx].invoiceNum;
    wx.request({
      url: app.ourHost + '/invoice/queryInvoiceAuthUrl',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': app.goHeader
      },
      data: {
        scn: scn,
        invoiceCode: invoiceCode,
        invoiceNum: invoiceNum
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.navigateToMiniProgram({
            appId: res.data.result.appid,
            path: res.data.result.authUrl,
            success: function(res) {
              // wx.showToast({
              //   title: '添加卡包成功',
              //   icon: 'none'
              // })
              that.init();
            },
            fail: function(res) {
              console.log(res, 'fail')
            }
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
          title: '系统异常，请稍后再试',
          icon: 'none'
        })
      }
    })
  },
  // 加载更多
  loadMoreEvent: function() {
    let that = this;
    if (that.data.endFlag) {
      let currentPage = that.data.currentPage + 1;
      that.setData({
        currentPage: currentPage
      })
      that.getInvoiceList();
    } else {
      return false;
    }

  },
  // 跳转发票介绍
  toInvoiceDesc: function() {
    wx.navigateTo({
      url: '../invoiceDesc/invoiceDesc',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})