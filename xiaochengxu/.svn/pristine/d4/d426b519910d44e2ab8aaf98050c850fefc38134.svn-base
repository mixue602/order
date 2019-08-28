// 神策埋码
var sensors = require('../../utils/sensorsdata.min.js');
sensors.init();
var distinct_id = sensors.store.getDistinctId()
//获取应用实例
var app = getApp();
// 创建页面实例对象
Page({
  data: {
    similarList: [],
    oldGoodObj: {}
  },
  onLoad: function (options) {
    this.setData({
      oldGoodObj: {
        iurl: options.imgUrl,
        desc: options.desc,
        price: options.price,
        productId: options.productId,
        skuId: options.skuId,
        category: options.category // 商品品类
      }
    })
    this.getSimilarList()
    
  },
  getSimilarList: function () {
    const that = this
    let areaCode = that.getAreaCode();
    wx.request({
      url: app.bigData + '/gome/rec',
      data: {
        distinct_id: distinct_id,
        from: 'MiniPro', 
        area: areaCode,
        boxid:'grec4032100',
        imagesize: 160,
        pid: that.data.oldGoodObj.productId,
        sid: that.data.oldGoodObj.skuId,
        uid: wx.getStorageSync('scn'),
        c3id: that.data.oldGoodObj.category,
        area: areaCode
      },
      method: 'GET',
      dataType: 'jsonp',
      success: function (data) {
        if (data.statusCode == 200) {
          that.setData({
            similarList: JSON.parse(data.data).lst[0].lst
          })
        }
      }
    })
  },
  getAreaCode: function () {
    //取cookie
    let codeCookies = wx.getStorageSync('codeCookies');
    let cookieCode;
    //如果cookie存在
    if (codeCookies && codeCookies[2]) {
      cookieCode = codeCookies[2]; //取第3级（第1个）
    } else {
      cookieCode = 11010000 //默认北京市（2级）
    }
    return cookieCode;
  },
})