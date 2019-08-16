var app = getApp();
var goHeader = app.goHeader;
var scn;
Page({
  data: {
    height: 0,
    datatype: 1, // 1全部订单/ 2待付款订单/ 3待收货订单
    tips: true, //是否显示提示语
    pendingPayOrders: 0, //待支付的总数
    pendingConfirmOrders: 0, //待收货的总数
    isMore: false, //加载更多提示
    isPayOnOff: false, //不允许客户一直点击支付按钮，只有失败，或异常操作等才能再次点击
    pageSize: 5, //每页显示的个数
    currentList: [], //当前是属于 全部订单/待付款订单/待收货订单
    allOrders: [], //全部订单
    pendingPaymentOrders: [], //待付款订单
    ordersToBereceived: [], //待收货订单
    allOrdersCurrentPage: 1, //全部订单当前分页数
    pendingPayCurrentPage: 1, //待付款订单当前分页数
    toBereceivedCurrentPage: 1, //待收货订单当前分页数
    buttonLists: [], //按钮集合
    invoiceList: [], //发票列表集合
    btnFlag: true, //检查是否初次加载
  },
  onLoad: function(options) {
    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          height: res.windowHeight + 'px'
        })

      },
    })
    //设置待付款、待收货的订单数量
    if (options) {
      _this.setData({
        datatype: options.type
      });
    }

    scn = app.getScn();

  },
  /**
   * @description 获取各订单数量
   * @since 2017-02-09
   * @author 谢俊梅
   */
  getStatusNumber: function() {
    var _this = this;
    var app = getApp();
    wx.request({
      url: app.ourHost + '/order/summary',
      header: {
        'content-type':   'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader
      },
      data: {
        scn: scn
      },
      method: 'POST',
      success: function(data) {
        if (data.statusCode == 200) {
          if (data.data.result.orderremindinfo) {
            _this.setData({
              pendingPayOrders: data.data.result.orderremindinfo.pendingPayOrders,
              pendingConfirmOrders: data.data.result.orderremindinfo.pendingConfirmOrders
            });
          }
        }
      }
    });
  },
  /**
   *
   * @description 获取不同状态下订单列表信息<br />
   * @method getOrderList
   * @param {object} object 函数调用的传参
   * @param {object} object.data 请求接口需传过去的数据
   * @param {string} object.data.pageSize 表示一页显示多少条数据
   * @param {string} object.data.scn  表示用户唯一标识
   * @param {string} object.data.currentPage 表示当前页数
   * @param {string} object.data.orderStatus 表示当前传入的状态 1全部订单/ 2待支付/ 3待收货
   * @param {function} object.successCallback 表示成功后的回调函数
   * @param {function} object.failCallback 表示失败后的回调函数
   * @since 2017-02-17
   * @author 谢俊梅
   */
  getOrderList: function(object) {
    var _this = this;
    var app = getApp();

    wx.request({
      url: app.ourHost + '/order/query',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader
      },
      data: object.data,
      method: 'POST',
      success: function(data) {
        if (data.statusCode == 200) {
          var orderlist = data.data.result.orderViewResult.orderlist;
          object.successCallback && object.successCallback(orderlist);

          var orderButtonsList = data.data.result.orderButtons || [];
          if (_this.data.btnFlag) {
            _this.setData({
              buttonLists: _this.data.buttonLists.concat(orderButtonsList),
            });
          }

          if (orderButtonsList.length == 0) {
            _this.setData({
              btnFlag: false,
            });
            return false;
          }

          if (orderlist) {
            for (var i = 0; i < orderlist.length; i++) {
              //添加订单实付金额字段
              if (orderlist[i].payAmount) {
                orderlist[i].payAmount_before = orderlist[i].payAmount.split(".")[0];
                orderlist[i].payAmount_after = orderlist[i].payAmount.split(".")[1];
              }

              if (orderlist[i] && orderlist[i].shipViewResults && orderlist[i].shipViewResults.length > 0) {

                for (var j = 0; j < orderlist[i].shipViewResults.length; j++) {
                  var num = 0,
                    skuIds = '',
                    shipViewResult = orderlist[i].shipViewResults[j];
                  //添加配送单实付金额字段
                  if (shipViewResult.shipPayAmount) {
                    var shipPayAmountList = shipViewResult.shipPayAmount.split(".");
                    shipViewResult.shipPayAmount_before = shipPayAmountList[0] || '0';
                    shipViewResult.shipPayAmount_after = shipPayAmountList[1] || '00';
                  }

                  for (var z = 0; z < shipViewResult.itemList.length; z++) {
                    num += Number(shipViewResult.itemList[z].quantity);
                    skuIds += ',' + shipViewResult.itemList[z].skuId
                  }
                  //配送单总skuIds集合
                  shipViewResult.skuIds = skuIds.substring(1);
                  //配送单总商品数量
                  shipViewResult.totalQuantity = num;
                  //配送单级别确认收货按钮默认不显示
                  shipViewResult.isConfirmReceipt = 'N';
                  //配送单级别评价得美豆按钮默认不显示
                  shipViewResult.isShowArsButton = 'N';
                  //配送单级别评价追加评价按钮默认不显示
                  // shipViewResult.isShowAddArsButton = 'N';
                  //配送单级别确认删除订单按钮默认不显示
                  shipViewResult.isShowDeleteButton = 'N';
                  //发票按钮默认不显示
                  shipViewResult.isShowBillButton = 'N';
                  //配送单级 查看退款
                  shipViewResult.isShowRefund = 'N';

                  //如果订单未拆单
                  if (shipViewResult.isSplit == 'N') {
                    for (var x = orderButtonsList.length - 1; x >= 0; x--) {
                      if (orderlist[i].orderId == orderButtonsList[x].orderId) {
                        for (var y = orderButtonsList[x].buttonList.length - 1; y >= 0; y--) {
                          if (orderButtonsList[x].buttonList[y].buttonCode == 'btn_cfm') {
                            //配送单级别确认收货按钮
                            shipViewResult.isConfirmReceipt = 'Y';
                          }
                          if (orderButtonsList[x].buttonList[y].buttonCode == 'btn_ars') {
                            //配送单级 评价晒单
                            shipViewResult.isShowArsButton = 'Y';
                          }
                          // if (orderButtonsList[x].buttonList[y].buttonCode == 'btn_addars') {
                          //   //配送单级别评价追加评价按钮默认不显示
                          //   shipViewResult.isShowAddArsButton = 'Y';
                          // }

                          if (orderButtonsList[x].buttonList[y].buttonCode == 'btn_del') {
                            //配送单级 删除订单按钮
                            shipViewResult.isShowDeleteButton = 'Y';
                          }
                          if (orderButtonsList[x].buttonList[y].buttonCode == 'btn_invoice') {
                            //配送单级 发票按钮
                            shipViewResult.isShowBillButton = 'Y';
                          }
                          if (orderButtonsList[x].buttonList[y].buttonCode == 'btn_refund') {
                            //配送单级 查看退款
                            shipViewResult.isShowRefund = 'Y';
                          }
                        }

                      }
                    }

                  } else { //如果是拆单的
                    for (var x = orderButtonsList.length - 1; x >= 0; x--) {
                      if (orderlist[i].orderId == orderButtonsList[x].orderId && shipViewResult.shippingGroupId == orderButtonsList[x].shippingGroupId) {
                        for (var y = orderButtonsList[x].buttonList.length - 1; y >= 0; y--) {
                          if (orderButtonsList[x].buttonList[y].buttonCode == 'btn_cfm') {
                            //配送单级别确认收货按钮
                            shipViewResult.isConfirmReceipt = 'Y';
                          }
                          if (orderButtonsList[x].buttonList[y].buttonCode == 'btn_ars') {
                            //配送单级 评价晒单
                            shipViewResult.isShowArsButton = 'Y';
                          }
                          // if (orderButtonsList[x].buttonList[y].buttonCode == 'btn_addars') {
                          //   //配送单级别评价追加评价按钮默认不显示
                          //   shipViewResult.isShowAddArsButton = 'Y';
                          // }
                          if (orderButtonsList[x].buttonList[y].buttonCode == 'btn_del') {
                            //配送单级 删除订单按钮
                            shipViewResult.isShowDeleteButton = 'Y';
                          }
                          if (orderButtonsList[x].buttonList[y].buttonCode == 'btn_invoice') {
                            //配送单级 发票按钮
                            shipViewResult.isShowBillButton = 'Y';
                          }
                          if (orderButtonsList[x].buttonList[y].buttonCode == 'btn_refund') {
                            //配送单级 查看退款
                            shipViewResult.isShowRefund = 'Y';
                          }
                        }

                      }
                    }

                  }
                }
              }
            }
          }
          object.successCallback && object.successCallback(orderlist);
        } else {
          object.failCallback && object.failCallback();
        }
      },
      fail: function() {
        object.failCallback && object.failCallback();
      }
    });
  },
  onShow: function() {
    var _this = this;
    var app = getApp();

    //重置按钮列表集合
    if (_this.data.buttonLists.length > 0) {
      _this.setData({
        buttonLists: [],
        btnFlag: true,
      });
    }
    //页面重新加载的时候，分页数重置为1
    _this.setData({
      allOrdersCurrentPage: 1, //全部订单当前分页数
      pendingPayCurrentPage: 1, //待付款订单当前分页数
      toBereceivedCurrentPage: 1, //待收货订单当前分页数
    })
    //获取各订单数量
    _this.getStatusNumber();

    //默认获取不同状态下订单列表信息
    _this.getOrderList({
      data: {
        scn: scn,
        pageSize: _this.data.pageSize,
        orderStatus: _this.data.datatype
      },
      successCallback: function(orderlist) {
        if (!orderlist) {
          orderlist = [];
        }
        _this.setData({
          currentList: orderlist
        });

        //初始化显示列表情况
        if (_this.data.datatype == 1) { //全部订单
          _this.setData({
            allOrders: orderlist
          });
        } else if (_this.data.datatype == 2) { //待付款
          _this.setData({
            pendingPaymentOrders: orderlist
          });
        } else { //待收货
          _this.setData({
            ordersToBereceived: orderlist,
          });
        }
      }
    });
  },

  getBillInfo: function(e) { //点击查看发票
    var that = this;
    var buttonLists = that.data.buttonLists;

    for (let i = 0; i <= buttonLists.length - 1; i++) {
      if (e.target.dataset.orderid == buttonLists[i].orderId && e.target.dataset.shippinggroupid == buttonLists[i].shippingGroupId) {
        for (let j = 0; j <= buttonLists[i].buttonList.length - 1; j++) {
          if (buttonLists[i].buttonList[j].buttonCode == 'btn_invoice') {
            if (buttonLists[i].buttonList[j].invoiceDetails.length == 1) { //只有一张发票
              wx.navigateTo({
                url: '/packCenter/pages/invoiceDetail/invoiceDetail?invoiceNumber=' + buttonLists[i].buttonList[j].invoiceDetails[0].invoiceNumber + '&invoiceCode=' + buttonLists[i].buttonList[j].invoiceDetails[0].invoiceCode,
              })
            } else { //多张发票
              that.setData({
                startStatus: true,
                hasMask: true,
                invoiceList: buttonLists[i].buttonList[j].invoiceDetails,
              });
            }
          }
        }
      }
    }
  },

  rulePop: function() {
    var that = this;
    that.setData({
      startStatus: true,
      hasMask: true
    })
  },
  delPop: function(e) {
    var that = this;
    that.setData({
      startStatus: false,
      hasMask: false
    })
  },

  checkSignalBill: function(e) {
    wx.navigateTo({
      url: '/packCenter/pages/invoiceDetail/invoiceDetail?invoiceNumber=' + e.currentTarget.dataset.num + '&invoiceCode=' + e.currentTarget.dataset.code,
    })
  },

  /**
   *
   * @description 点击tap切换,会判断第一次切换还是后期多次切换,第一次加载走请求,第二次走对应数组存储过的数据<br />
   * @method couponTapEven
   * @param {object} event 点击对象上的事件对象
   * @since 2017-02-17
   * @author 谢俊梅
   */
  orderTapEven: function(event) {
    var _this = this;
    var app = getApp();
    if (this.data.datatype === event.target.dataset.type) {
      return false;
    } else {
      //先清空当前列表，数据重新渲染显示
      _this.setData({
        currentList: [],
        datatype: event.target.dataset.type
      });
      //初始化显示列表情况，初始化发请求
      if (!_this.data.allOrders.length && event.target.dataset.type == 1 || !_this.data.pendingPaymentOrders.length && event.target.dataset.type == 2 || !_this.data.ordersToBereceived.length && event.target.dataset.type == 3) {
        _this.queryAjax(event);

      } else {
        //后期多次切换走这里
        if (event.target.dataset.type == 1) {
          _this.setData({
            currentList: _this.data.allOrders
          });
        } else if (event.target.dataset.type == 2) {

          _this.setData({
            currentList: _this.data.pendingPaymentOrders
          });
        } else {

          _this.setData({
            currentList: _this.data.ordersToBereceived
          });
        }
      }

    }
  },
  /**
   *
   * @description 全部订单、待支付、待收货3个选项切换过程中，每个第一次切换时加载发请求<br />
   * @method queryAjax
   * @param {object} event 点击对象上的事件对象
   * @since 2017-02-17
   * @author 谢俊梅
   */
  queryAjax: function(event) {
    var app = getApp();
    var _this = this;

    //获取不同状态下订单列表信息
    _this.getOrderList({
      data: {
        scn: scn,
        pageSize: _this.data.pageSize,
        orderStatus: event.target.dataset.type
      },
      successCallback: function(orderlist) {
        if (!orderlist) {
          orderlist = [];
        }
        if (event.target.dataset.type == 1) {
          _this.setData({
            allOrders: orderlist,
            currentList: orderlist
          });
        } else if (event.target.dataset.type == 2) {
          _this.setData({
            pendingPaymentOrders: orderlist,
            currentList: orderlist
          });
        } else {
          _this.setData({
            ordersToBereceived: orderlist,
            currentList: orderlist
          });
        }
      }
    });
  },
  /**
   *
   * @description 滑动到底部，加载更多，根据每个类型 分别计算对应的分页数、对新增的数据加入到对应的数组中<br />
   * @method lower
   * @since 2017-02-17
   * @author 谢俊梅
   */
  lower: function() {
    var _this = this;

    _this.setData({
      isMore: true
    });
    //在全部订单下，处理上滑操作
    if (_this.data.datatype == 1) {
      //默认加载更多，当前分页+1
      _this.setData({
        allOrdersCurrentPage: _this.data.allOrdersCurrentPage + 1
      })
      //获取不同状态下订单列表信息
      _this.getOrderList({
        data: {
          scn: scn,
          orderStatus: _this.data.datatype,
          pageSize: _this.data.pageSize,
          currentPage: this.data.allOrdersCurrentPage
        },
        successCallback: function(orderlist) {
          //如果没有任何数据的时候
          if (!orderlist) {
            orderlist = [];
            //没有更多数据时，页数不增加，下次继续访问当分页数据
            _this.setData({
              isMore: false,
              allOrdersCurrentPage: _this.data.allOrdersCurrentPage - 1
            });
          }

          //新请求得到的数据，加到对应数组里
          _this.setData({
            currentList: _this.data.allOrders.concat(orderlist),
            allOrders: _this.data.allOrders.concat(orderlist)
          });
        },
        failCallback: function() {
          _this.setData({
            allOrdersCurrentPage: _this.data.allOrdersCurrentPage - 1
          });
        }
      });

    } else if (_this.data.datatype == 2) { //在待支付订单下，处理上滑操作   
      //默认加载更多，当前分页+1
      _this.setData({
        pendingPayCurrentPage: _this.data.pendingPayCurrentPage + 1
      })
      //获取不同状态下订单列表信息
      _this.getOrderList({
        data: {
          scn: scn,
          pageSize: _this.data.pageSize,
          orderStatus: _this.data.datatype,
          currentPage: _this.data.pendingPayCurrentPage
        },
        successCallback: function(orderlist) {
          //如果没有任何数据的时候
          if (!orderlist) {
            orderlist = [];
            //没有更多数据时，页数不增加，下次继续访问当分页数据
            _this.setData({
              isMore: false,
              pendingPayCurrentPage: _this.data.pendingPayCurrentPage - 1
            });
          }

          //新请求得到的数据，加到对应数组里
          _this.setData({
            currentList: _this.data.pendingPaymentOrders.concat(orderlist),
            pendingPaymentOrders: _this.data.pendingPaymentOrders.concat(orderlist)
          });
        },
        failCallback: function() {
          _this.setData({
            allOrdersCurrentPage: _this.data.pendingPaymentOrders - 1
          });
        }
      });

    } else { //在待收货订单下，处理上滑操作 
      //默认加载更多，当前分页+1
      _this.setData({
        toBereceivedCurrentPage: _this.data.toBereceivedCurrentPage + 1
      })
      //获取不同状态下订单列表信息
      _this.getOrderList({
        data: {
          scn: scn,
          pageSize: _this.data.pageSize,
          orderStatus: _this.data.datatype,
          currentPage: _this.data.toBereceivedCurrentPage
        },
        successCallback: function(orderlist) {
          //如果没有任何数据的时候
          if (!orderlist) {
            orderlist = [];
            //没有更多数据时，页数不增加，下次继续访问当分页数据
            _this.setData({
              isMore: false,
              toBereceivedCurrentPage: _this.data.toBereceivedCurrentPage - 1
            });
          }

          //新请求得到的数据，加到对应数组里
          _this.setData({
            currentList: _this.data.ordersToBereceived.concat(orderlist),
            ordersToBereceived: _this.data.ordersToBereceived.concat(orderlist)
          });
        },
        failCallback: function() {
          _this.setData({
            allOrdersCurrentPage: _this.data.toBereceivedCurrentPage - 1
          });
        }
      });
    }
  },
  closeEven: function() {
    //关闭
    this.setData({
      tips: false
    });
  },
  //去支付
  toPlay: function(event) {

    var app = getApp();
    var _this = this;

    if (_this.data.isPayOnOff) {
      return false;
    }

    _this.setData({
      isPayOnOff: true
    })

    //商品对应的订单号和配送单号
    var orderId = event.target.dataset.orderid;
    var shippingGroupId = event.target.dataset.shippinggroupid;
    wx.login({
      success: function(ress) {
        if (ress.code) {
          //发起网络请求
          wx.getSystemInfo({
            success: function(res) {
              wx.request({
                url: app.ourPay + '/api/wechat/cashier/pay',
                header: {
                  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                  'gome-header': goHeader,
                  'Cookie': 'SCN=' + scn
                },
                data: {
                  type: 1,
                  orderId: orderId,
                  msv: res.model,
                  code: ress.code
                },
                method: 'GET',
                success: function(res) {
                  var data = res.data;
                  _this.payResult(data, orderId, shippingGroupId);
                }
              });
            }
          });

        } else {
          _this.setData({
            isPayOnOff: false
          })
          wx.showToast({
            title: '获取用户登录态失败，请稍后重试！',
            duration: 2000
          });
        }
      }
    });
  },
  payResult: function(data, orderId, shippingGroupId) {
    var _this = this;
    _this.setData({
      isPayOnOff: false
    })

    if (data.success) {
      var sdkInfo = data.data;
      if (sdkInfo) { //微信支付
        wx.requestPayment({
          'timeStamp': sdkInfo.timeStamp,
          'nonceStr': sdkInfo.nonceStr,
          'package': sdkInfo.package,
          'signType': sdkInfo.signType,
          'paySign': sdkInfo.paySign,
          'success': function(res) {
            wx.showToast({
              title: '支付成功',
              duration: 500,
              success: function() {
                wx.redirectTo({
                  url: '../orderdetails/orderdetails?orderId=' + orderId + '&shippingGroupId=' + shippingGroupId
                });
              }
            })
          },
          'fail': function(res) {
            _this.setData({
              isPayOnOff: false
            })

            wx.showToast({
              title: '支付失败',
              duration: 2000,
              success: function() {}
            })
          }
        })
      }

    } else {

      if (!data.status) {
        wx.showToast({
          title: data.errMsg || data.message || "对不起！系统繁忙，请稍后重试！",
          duration: 2000
        })
      }
    }
  }
})