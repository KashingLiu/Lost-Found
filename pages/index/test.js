// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    currentList: [],
    hidden: true,
    time: 0,
    isNone: false,
    loading: false,
    scrollHeight: null,
    scrollTop: 0,
  },

  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  onPullDownRefresh: function (e) {

  },

  topLoad: function (event) {
    //   该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
    this.setData({
      scrollTop: 0
    });
    console.log("lower");
  },

  bindscrolltoupper: function (e) {
    console.log(e)
    this.setData({
      loading: true
    })
  },

  detailTap: function (e) {
    var detail = e.currentTarget.dataset.anchorobj
    if (detail.ifidcard == 1 || detail.img[0] == "/images/ava.png") {
      detail.display = false
    }
    let str = JSON.stringify(detail)
    wx.navigateTo({
      url: '/pages/show/show?check=0&obj=' + str,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    wx.request({
      url: 'http://192.168.0.106/wechattest/test.php?api_num=1',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // console.log(res)
        self.setData({
          currentList: res.data,
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})