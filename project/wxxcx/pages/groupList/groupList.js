let app = getApp();
let new_Times = 0; //倒计时；
let myTimes = null;
Page({
  data: {
    rondaId: '',
    height: 0, //高度
    tab: [],
    templetId: '', //模板ID
    nowTime: 0, //现在的时间
    d: 0, //天数
    h: '00', //倒计时小时
    m: '00', //倒计时分钟
    s: '00', //倒计时秒
    list: [],
    protocol: app.protocol,
    selectType: 0,
    moreStatus: false,
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
    if (options.rondaId) {
      that.setData({
        rondaId: options.rondaId
      })
    }
    that.initEvent();
  },
  onUnload: function() {
    clearInterval(myTimes);
  },
  initEvent: function() {
    let that = this;
    wx.request({
      url: app.hdCmsUrl + '/wap/promotion/promscms/channelrushLbuyBN89.jsp',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'GET',
      success: function(res) {
        if (res.data.isSuccess == 'Y') {
          if (res.data.templetList[0].commonTabTagTemplet.length > 0) {
           
            let serverTime = res.data.serverTime.replace(/-/g, "/");
            serverTime = (new Date(serverTime)).getTime();
            let list = res.data.templetList[0].commonTabTagTemplet;
            for (var [i, item] of list.entries()) {
              item.name = item.rushBuyStartDate.slice(-8, -3);

              item.startTime = (new Date(item.rushBuyStartDate.replace(/-/g, "/"))).getTime();
              item.endTime = (new Date(item.rushBuyEndDate.replace(/-/g, "/"))).getTime();

              if (serverTime <= item.endTime && serverTime >= item.startTime) {
                item.status = '抢购中';
                that.setData({
                  selectType: i
                })
                new_Times = item.endTime - serverTime;

              } else {
                if (serverTime < item.startTime) {
                  item.status = '即将开始';

                } else {
                  item.status = '已开始';
                }
              }
            }
            that.setData({
              tab: list,
              nowTime: serverTime
            })
            that.getProdList();

          }
        }
      },
      fail: function(res) {

      }
    })
  },
  // 倒计时
  getTimesEvent: function() {
    let that = this;
    let d = Math.floor(new_Times / 1000 / 60 / 60 / 24);
  
    if (d > 3) {
      that.setData({
        d: d
      })
    } else {
      myTimes = setTimeout(function() {
        if (new_Times >= 1000) {
          new_Times = parseInt(new_Times - 1000);
          that.countDownEvent();
          that.getTimesEvent();
        } else {
          that.initEvent();
        }
      }, 1000)
    }

  },
  countDownEvent: function() {
    let that = this;
    let h = Math.floor(new_Times / 1000 / 60 / 60 % 24),
      m = Math.floor(new_Times / 1000 / 60 % 60),
      s = Math.floor(new_Times / 1000 % 60);
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    that.setData({
      h: h,
      m: m,
      s: s
    })
  },
  //tab选择
  selectTabEvnet: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let key = e.currentTarget.dataset.keyproms;
    let templetId = that.data.templetId;

    if (index == that.data.selectType) {
      return false;
    } else {
      clearTimeout(myTimes);

      that.setData({
        list: [],
        selectType: index,
        moreStatus: false,
      })

      let tab = that.data.tab;
    console.log(tab)
      if (tab[index].status == '抢购中') {
        console.log(that.data.nowTime);
        let serverTime = Number(that.data.nowTime);
        let endTime = Number(tab[index].endTime);
        new_Times = endTime - serverTime;

      } else if (tab[index].status == '即将开始') {

        let serverTime = Number(that.data.nowTime);
        let startTime = Number(tab[index].startTime);
        new_Times = startTime - serverTime;

      } else {

      }

      that.getProdList();
    }

  },
  // 获取商品列表
  getProdList: function() {

    let that = this;
    let key = that.data.tab[that.data.selectType].keyProms;
    wx.request({
      url: app.hdCmsUrl + '/wap/rushbuy/stickyRushBuyGoods.jsp?body={"keyProms":"' + key + '"}',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'GET',
      success: function(res) {
        if (res.data.isSuccess == 'Y') {
          let list = that.data.list;
          if (res.data.templetList[0].templetCode == 'productTemplet') {
            let goodsList = res.data.templetList[0].goodsTemplet.goodsList;
            for (var item of goodsList) {
              list.push(item)
            }
            if (list.length < 10) {
              that.setData({
                moreStatus: true
              })
            }
            that.setData({
              list: list,
              templetId: res.data.templetList[0].templetId
            })
          }
          that.getTimesEvent();
        }
      },
      fail: function(res) {

      }
    })
  },
  //分页
  getPageEvent: function() {
    let that = this;
    let list = that.data.list;
    let key = that.data.tab[that.data.selectType].keyProms;

    let goodsId;

    if (that.data.moreStatus) {
      return false;
    }
    if (list.length > 0) {
      let i = list.length - 1;


      goodsId = list[i].goodsId;
    }

    wx.request({
      url: app.hdCmsUrl + '/mobile/promotion/promscms/pagePromscms.jsp?body={"keyProms":"' + key + '","templetId":"' + that.data.templetId + '","goodsId":"' + goodsId + '"}',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'GET',
      success: function(res) {
        if (res.data.isSuccess == 'Y') {
          let list = that.data.list;

          let goodsList = res.data.goodsList;
          for (var item of goodsList) {
            list.push(item)
          }
          that.setData({
            list: list
          })
          if (goodsList.length < 10) {
            that.setData({
              moreStatus: true
            })
          }
        }
      },
      fail: function(res) {

      }
    })
  },
  // 查看商品
  getProdEvent: function(e) {
    let that = this;
    let skuID = e.currentTarget.dataset.skuid,
      productID = e.currentTarget.dataset.productid;
    wx.navigateTo({
      url: '/pages/prod/prod?skuId=' + skuID + '&productId=' + productID,
    })
  },
  // 未开抢
  noStartEvnet: function() {
    wx.showToast({
      title: '商品暂未开抢，请稍后再来~',
      icon: 'none'
    })
  },
  // 已结束
  noProdEvnet: function() {

  },
  onPullDownRefresh: function() {

  },

  onShareAppMessage: function() {

  }
})