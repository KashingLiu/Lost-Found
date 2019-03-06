// pages/stuverify/stuverify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  bindsubmit: function (e) {
    if (getApp().globalData.openid == "" || getApp().globalData.openid == null) {
      wx.login({
        success: res => {
          // 获取到用户的 code 之后：res.code
          console.log("用户的code:" + res.code);
          // 可以传给后台，再经过解析获取用户的 openid
          // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
          wx.request({
            // 自行补上自己的 APPID 和 SECRET
            url: 'https://www.kashingliu.cn/wechattest/get_userinfo.php?code=' + res.code,
            success: res => {
              getApp().globalData.openid = res.data.openid      //ok
            },
            fail: res => {
              wx.showToast({
                title: 'error',
              })
            }
          })
        }
      })
    }
    let self = this;
    console.log(e.detail.value.stuid)
    console.log(e.detail.value.pwd)
    var time = this.addJYM();
    wx.request({
      url: "https://www.kashingliu.cn/wechattest/login.php",
      data: {
        stuid: e.detail.value.stuid,
        pwd: e.detail.value.pwd,
        jym2005: time,
        openid: getApp().globalData.openid
      },
      success(res) {
        if (res.data == 'true') {
          wx.showToast({
            title: '绑定成功',
          })
        }
      }
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

  },

  addJYM: function (){
    //产生随机数
    var time = ((new Date().getTime() * 9301 + 49297) % 233280) / (233280.0);
    var rand = Math.random();
    time = (time + rand) * 9301;
    return time;
  }

})