// pages/about/about.js
var formid = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }, 
  formSubmit: function (e) {
    // console.log(e.detail)
    if (e.detail.formId != 'the formId is a mock one') {
      var data = {
        formId: e.detail.formId,
        openid: getApp().globalData.openid,
        expire: new Date().getTime() + 604800000 // 7天后的过期时间戳
      }
      formid.push(data)
    }
    console.log(formid)
  },

  sendformid: function (e) {
    var put = JSON.stringify(formid)
    console.log(put.length)
    wx.request({
      url: 'https://www.kashingliu.cn/wechattest/make_formid.php?content=' + put,
      success(res) {
        console.log(res.data)
        formid = []
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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