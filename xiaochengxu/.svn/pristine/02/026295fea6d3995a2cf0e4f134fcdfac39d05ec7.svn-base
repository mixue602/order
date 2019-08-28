let app = getApp();
// 第一个参数事件名 字符串类型，第二个参数 属性值 对象类型
var startTime;
var mode;
var salt; //启动图盐值
var data_type = '';
let myTimes = null;
Page({
  data: {
    currentSwiper: 0, //顶部轮播
    currentEnter: 0, //快捷入口
    currentTab: 0, //tab切换
    dailySwiper: 0, //商品轮播
    autoplay: true, //自动切换
    interval: 5000,
    duration: 500,
    height: 0, //页面高度
    startStatus: false,
    list: [], //首页数据
    bannerList: [], //banner列表
    startList: [], //启动图广告
    enterList: [], //快捷入口
    rushList: [], //国美秒杀入口
    activeList: [], //活动入口
    goodsList: [], //双列商品列表
    templetId: '', //双列商品分页templetId
    moreStatus: false, //显示更多
    skus: "",
    percent: "0",
    countdown: 0, //倒计时数
    h: '00',
    m: '00',
    s: '00',
    shoppingFlow: "", //等于mainSite时是主站 跳普通详情页;等于independent是独立 跳团抢详情页
    navShow: true, //导航侧边栏是否显示
    navList: [],
    protocol: app.protocol,
  },
  codeClick: function() {
    app.QRScan();
  },
  onLoad: function(options) {
    var that = this;

    if (options.data_type == 'preview') {
      data_type = 'preview';
    }
    wx.getSystemInfo({ //获取系统信息
      success: function(res) {
        that.setData({
          height: res.screenHeight + 'px' //窗口高度
        })
      }
    });
    startTime = wx.getStorageSync('startAdTime') || 0;

  },
  onUnload: function() {
    clearInterval(myTimes);
  },
  onShow: function() {
    var that = this;

    mode = wx.getStorageSync('mode') || 0;
    salt = wx.getStorageSync('salt') || '';
    clearTimeout(myTimes);
    that.initEvent();
    that.getNavList();
    that.getHomeStartList();
    that.getActiveEvent();

  },

  // 
  initEvent: function() {
    let that = this;
    wx.request({
      url: app.hdCmsUrl + '/wap/promotion/promscms/homeRA5OQWzpCIs.jsp',
      //url: app.hdCmsUrl + '/wap/promotion/promscms/homeP1UyiYAmAp8m.jsp',
      //url: app.hdCmsUrl + '/wap/promotion/promscms/saleWSeleO3UAXL.jsp',

      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      data: {},
      method: 'POST',
      success: function(res) {
        if (res.data.isSuccess == 'Y') {
          if (res.data.templetList && res.data.templetList.length > 0) {
            let list = res.data.templetList;

            that.setData({
              list: list
            })
            for (var item of list) {
              if (item.templetCode == 'focusPhotoListTemplet') {
                that.setData({
                  bannerList: item
                })
              }
              if (item.templetCode == 'tagShortcutTemplet') {
                let shortcutList = item.tagShortcutTemplet.shortcutList;
                item.tagShortcutTemplet.list = [];
                item.tagShortcutTemplet.list[0] = [];
                if (shortcutList.length > 10) {
                  item.tagShortcutTemplet.list[1] = [];
                }
                for (var [i, items] of shortcutList.entries()) {
                  if (i < 10) {
                    item.tagShortcutTemplet.list[0].push(items)
                  } else {
                    item.tagShortcutTemplet.list[1].push(items)
                  }
                }

              }
              if (item.templetCode == 'rushBuyTemplet' && item.rushBuyTemplet.delayTime!=0) {
                that.setData({
                  rushList: item
                })
                let new_Times = Number(item.rushBuyTemplet.delayTime) * 1000;
                that.getTimesEvent(new_Times);
              }

            }
            that.setData({
              list: list
            })
            that.getProdList();


          }
        }

      },
      fail: function(res) {

      }
    })
  },
  /**
   * 启动图
   * @pammer slot.is_effective String 推荐位生效状态，0生效， -1不生效
   * @pammer mode int 弹出方式：2 每1小时弹出一次
   */
  getHomeStartList: function() {
    var that = this;
    wx.request({
      url: app.hdCmsUrl + '/wap/promotion/promsdata/channelkwWXf7gPiRj.jsp',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'GET',
      success: function(res) {
        if (res.data.isSuccess == 'Y' && res.data.templetList.length>0) {
          let tempList = res.data.templetList[0];
          if (tempList.dataList.length > 0) {
            wx.setStorageSync('mode', 2);
            if ((tempList.startDate - startTime) > 86400000) {
              that.setData({
                startStatus: true
              })
              wx.setStorageSync('startAdTime', tempList.startDate);
            } else {
              that.setData({
                startStatus: false
              })
            }
            that.setData({
              startList: tempList
            })
          }
        }
      },
      fail: function(res) {

      }
    })
  },
  // 启动图点击
  getStartEvent: function(e) {
    let that = this;
    let productID = e.currentTarget.dataset.productid || '',
      scheme = e.currentTarget.dataset.scheme;
    if (productID == '') {
      wx.navigateTo({
        url: '/pages/active/active?url=' + scheme,
      })
    } else {
      wx.navigateTo({
        url: scheme,
        startStatus: true
      })
    }

  },
  // 侧边栏
  getNavList: function() {
    let that = this;
    wx.request({
      url: app.hdCmsUrl + '/wap/promotion/promsdata/channelFFwaFYhxoLe.jsp',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      method: 'POST',
      success: function(res) {
        if (res.data.isSuccess == 'Y') {
          let list = res.data.templetList[0].dataList;
          let navList = [];
          if (list.length > 0) {
            for (var item of list) {
              if (item.remark == '首页' || (item.scheme && item.scheme.indexOf('/index/index') != -1)) {} else {
                navList.push(item);
              }

            }
          }
          navList = navList.slice(0, 3);
          that.setData({
            navList: navList
          })
 
        }
      },
      fail: function(res) {

      }
    })
  },
  // 获取双列商品
  getProdList: function() {
    let that = this;
    wx.request({
      url: app.hdCmsUrl + '/wap/promotion/promscms/channel2vgOhgJOf6e.jsp',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      method: 'GET',
      success: function(res) {

        if (res.data.isSuccess == 'Y') {
          that.setData({
            goodsList: res.data.templetList[0],
            templetId: res.data.templetList[0].templetId
          })
        }
      },
      fail: function(res) {

      }
    })
  },
  // 下拉获得更多双列商品
  scrollEvnet: function() {
    let that = this;
    let list = that.data.goodsList.goodsTemplet;
    let goodsId;

    if (that.data.goodsList.length < 10) {
      that.setData({
        moreStatus: true
      })
    }
    if (that.data.moreStatus) {
      return false;
    }

    if (list.goodsList.length > 0) {
      let i = list.goodsList.length - 1;
      goodsId = list.goodsList[i].goodsId;
    }

    wx.request({
      url: app.hdCmsUrl + '/mobile/promotion/promscms/pagePromscms.jsp?body={"keyProms":"channel2vgOhgJOf6e","templetId":"' + that.data.templetId + '","goodsId":"' + goodsId +'"}',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'GET',
      success: function(res) {
        if (res.data.isSuccess == 'Y' && res.data.goodsList.length>0) {
          let lists = that.data.goodsList;

          let goodsList = res.data.goodsList;
          for (var item of goodsList) {
            lists.goodsTemplet.goodsList.push(item)
          }
    
          that.setData({
            goodsList: lists
          })
          if (goodsList.length < 10) {
            that.setData({
              moreStatus: true
            })
          }
        }else{
          that.setData({
            moreStatus:true
          })
        }
      },
      fail: function(res) {

      }
    })
  },
  // 获取顶部活动图
  getActiveEvent: function() {
    let that = this;
    wx.request({
      //测试环境： url: app.hdCmsUrl + '/wap/promotion/promscms/salezIOSb0p5KmN.jsp',
      url: app.hdCmsUrl + '/wap/promotion/promscms/salezIOSb0p5KmM.jsp',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      method: 'GET',
      success: function(res) {
        if (res.data.isSuccess == 'Y') {
          if (res.data.templetList.length > 0) {
            that.setData({
              activeList: res.data.templetList[0].floorPhotoTemplet
            })
          }
        }
      },
      fail: function(res) {

      }
    })
  },
  // 点击快捷导航
  getBannerEvent: function(e) {
    let that = this;
    let scheme = e.currentTarget.dataset.scheme;
    let menucode = e.currentTarget.dataset.menucode;

    if (menucode == '95') {
      // 打开国美管家小程序
      wx.navigateToMiniProgram({
        appId: scheme,
        path: '',
        extraData: {
          foo: 'gomeMina'
        },
        success(res) {

        }
      })
    } else {
      if (scheme.split('//').length > 1) {
        wx.navigateTo({
          url: '/pages/active/active?url=' + scheme,
        })
      } else {
        if (scheme.split('/cart/cart').length > 1 || scheme.split('/shopList/shopList').length > 1 || scheme.split('/profile/profile').length > 1) {
          wx.switchTab({
            url: scheme,
          })
        } else {
          wx.navigateTo({
            url: scheme,
          })
        }
      }
    }


  },
  // 导航圆点
  swiperChange: function(e) {
    let that = this;
    that.setData({
      currentSwiper: e.detail.current
    })
  },
  // 
  swiperEnter: function(e) {
    let that = this;
    that.setData({
      currentEnter: e.detail.current
    })
  },
  // 导航圆点改变
  dailySwiperChange: function(e) {
    let that = this;
    that.setData({
      dailySwiper: e.detail.current
    })
  },
  // 向右触底和点击跳转秒杀
  getRushBuyEvent: function(e) {
    let that = this;
    // let rondaId = e.currentTarget.dataset.rondaid;

    wx.navigateTo({
      // url: '/pages/groupList/groupList?rondaId=' + rondaId,
      url: '/pages/groupList/groupList',
    })
  },

  // 商品跳转
  getDailyProd: function(e) {
    let that = this;
    let skuID = e.currentTarget.dataset.skuid,
      productID = e.currentTarget.dataset.productid;
    wx.navigateTo({
      url: '/pages/prod/prod?skuId=' + skuID + '&productId=' + productID,
    })
  },
  // 点击图片
  getImgEvent: function(e) {
    let that = this;
    let productID = e.currentTarget.dataset.productid || '',
      promstype = e.currentTarget.dataset.promstype,
      scheme = e.currentTarget.dataset.scheme;
    if (promstype == '95') {
      wx.navigateToMiniProgram({
        appId: 'wxe25ab88328c0cdca',
        path: '',
        extraData: {
          foo: 'gomeMina'
        },
        success(res) {
          console.log(res)
        }
      })
    } else {
      if (productID == '') {
        wx.navigateTo({
          url: '/pages/active/active?url=' + scheme,
        })
      } else {
        wx.navigateTo({
          url: scheme,
        })
      }
    }
  },
  //点击单列图片 
  getProdEvent: function(e) {
    let that = this;
    let promstype = e.currentTarget.dataset.promstype;
    let scheme = e.currentTarget.dataset.scheme;
    if (promstype == '95') {
      wx.navigateToMiniProgram({
        appId: 'wxe25ab88328c0cdca',
        path: '',
        extraData: {
          foo: 'gomeMina'
        },
        success(res) {
          console.log(res)
        }
      })
    } else {
      wx.navigateTo({
        url: scheme,
      })
    }

  },
  // 倒计时
  getTimesEvent: function(new_Times) {
    let that = this;
    myTimes = setTimeout(function() {
      if (new_Times >= 1000) {
        new_Times = parseInt(new_Times - 1000);
        that.countDownEvent(new_Times);
        that.getTimesEvent(new_Times);
      } else {
        that.initEvent();
      }
    }, 1000)
  },
  countDownEvent: function(new_Times) {
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
  // 侧边栏点击
  getNavEvent: function(e) {
    let that = this,
      i = e.target.dataset.index,
      navList = that.data.navList;

    if (navList[i].scheme.split('/cart/cart').length > 1 || navList[i].scheme.split('/shopList/shopList').length > 1 || navList[i].scheme.split('/profile/profile').length > 1) {
      wx.switchTab({
        url: navList[i].scheme,
      })
    } else {
      wx.navigateTo({
        url: navList[i].scheme,
      })
    }
  },
  // 打开快捷导航
  openSideNav: function() {
    let that = this;
    that.setData({
      navShow: false
    })
  },
  // 关闭快捷导航
  closeSideNav: function() {
    let that = this;
    that.setData({
      navShow: true
    })
  },
  // 关闭启动图
  delAdEvent: function(res) {
    let that = this;
    that.setData({
      startStatus: false
    })
  },
  onShareAppMessage:function(){
    return {
      title: '国美，品质、低价、速达',
      desc: '品质、低价、速达',
      path: '/pages/index/index'
    }
  }
})