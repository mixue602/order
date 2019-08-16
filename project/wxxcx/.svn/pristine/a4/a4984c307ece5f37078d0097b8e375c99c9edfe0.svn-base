var Page = getApp().sensors.Page;
let app = getApp();
Page({
  data: {
    protocol: app.protocol,
    scrollHeight: 0,
    scrollTop: 0,
    tabList: [],
    itemList: null,
    tabIndex: 0
  },

  ourHost: app.ourHost,
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          scrollHeight: res.windowHeight - 65
        })
      }
    });
    if (options._latest_cmpid) {
      wx.setStorageSync('_latest_cmpid', options._latest_cmpid)
    }
    this.getTabList(0);
  },
  codeClick: function() {
    app.QRScan();
  },
  getTabList: function(id) {
    var that = this;
    var defaultTab;

    wx.request({
      url: that.ourHost + '/category/firstlevel',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn'
      },
      method: 'POST',
      success: function(sssres) {
        that.setData({
          tabList: sssres.data,
          tabIndex: id
        });
        defaultTab = that.data.tabList[id].goodsTypeId;
        that.getiTemList(defaultTab);
      }
    });
  },
  getiTemList: function(defaultTab) {
    var that = this;
    wx.request({
      url: that.ourHost + '/category/detail',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn'
      },
      data: {
        categoryId: defaultTab
      },
      method: 'POST',
      success: function(ssssres) {
        //console.log(ssssres.data);
        //过滤非法图片
        if (ssssres.data && ssssres.data.secondLevelCategories.length > 0) {
          var itemList = ssssres.data;
          var secondLevelCategories = itemList.secondLevelCategories;
          for (var j = 0; j < secondLevelCategories.length; j++) {
            var goodsTypeList = secondLevelCategories[j].goodsTypeList;
            for (var k = 0; k < goodsTypeList.length; k++) {
              goodsTypeList[k].goodsTypeImgUrl = goodsTypeList[k].goodsTypeImgUrl.replace("http:", '').replace("https:", '');
            }
          }
          that.setData({
            itemList: itemList
          });
        }
      }
    });
  },
  tabClick: function(e) {
    //this.getTabList(e.currentTarget.id);
    this.setData({
      tabIndex: e.currentTarget.id,
      itemList: null
    });
    // 埋码
    let _cmpid = wx.getStorageSync('_latest_cmpid');
    let _latest_cmpid = _cmpid.split('_');
    app.sensors.track('MiniPageviewList', {
      tid: app.tid,
      _latest_cmpid: _cmpid,
      first_channel: _latest_cmpid[0], //根绝cmpid 拆解的一级渠道
      second_channel: _latest_cmpid[1], //根绝cmpid 拆解的二级渠道
      third_channel: _latest_cmpid[2], //根绝cmpid 拆解的三级渠道
      category_id: e.currentTarget.id //活动ID
    });
    this.getiTemList(this.data.tabList[e.currentTarget.id].goodsTypeId);
  }
});