let app = getApp();
let src='';
Page({
  data: {
    src: '',
    scheme: '',
  },
  onLoad: function(options) {
    var that = this;
    if (options.url) {
      src = app.protocol +"//"+ options.url.split('//').pop();
      this.setData({
        scheme: options.url
      })
    }
    if (options.title) {
      wx.setNavigationBarTitle({
        title: options.title
      })
    }
  },
  onShow: function() {
    let that = this;
    let lable = wx.getStorageSync('codeCookies') || [];
    let scn = wx.getStorageSync('scn') || '';
    that.setData({
      src: src + '?gcid=' + lable[1] + '&gdid=' + lable[2] + '&gtid=' + lable[3] +'&scn='+scn
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '国美，品质、低价、速达',
      desc: '品质、低价、速达',
      // path: '/pages/index/index',
      path: '/pages/active/active?url=' + this.data.scheme,
    }
  }
})