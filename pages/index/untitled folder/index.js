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
    scrollHeight: null
  },

  onPullDownRefresh: function(e) {
    console.log('hello')
  },

  topLoad: function (e) {
    console.log('topLoad')
  },

  bindDownLoad: function (e) {
    console.log('bindDownLoad')
  },

  detailTap: function (e) {
    var detail = e.currentTarget.dataset.anchorobj
    if(detail.ifidcard == 1||detail.img[0] == "/images/ava.png") {
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