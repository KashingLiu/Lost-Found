Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("login---onload")
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        console.log("getsetting--success")
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log("getusrinfo success"+res)
            }
          });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面?????
          // that.setData({
          //   isHide: true
          // });
        }
      }
    });
  },



  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      getApp().globalData.userInfo = e.detail.userInfo
      console.log('set userinfo glb')
      console.log(getApp().globalData.userInfo)
      wx.login({
        success: res => {
          // 获取到用户的 code 之后：res.code
          console.log("用户的code:" + res.code);
          console.log("login--success--init")
          console.log(getApp().globalData.userInfo)
          wx.request({
            // 自行补上自己的 APPID 和 SECRET
            url: 'https://www.kashingliu.cn/wechattest/insert_userinfo.php?code=' + res.code,
            data: {
              nickName: getApp().globalData.userInfo.nickName,
              avatarUrl: getApp().globalData.userInfo.avatarUrl
            },
            success: res => {
              console.log(res)
              wx.setStorage({
                key: 'openid',
                data: res.data,
              })
              wx.setStorage({
                key: 'userInfo',
                data: getApp().globalData.userInfo,
              })
              getApp().globalData.openid = res.data
              console.log('after insert')
              console.log(getApp().globalData.userInfo)
              // // TO DO NAVIGATE/REDIRECT
              wx.navigateBack({
                delta: 1
              })
            }
          });
        }
      });

    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
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