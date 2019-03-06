Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nologin: "",
    avatarUrl: "",
    nickName: "",
    broadcasturl: "",
    userInfo: null
  },

  about: function () {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },

  student: function () {
    wx.navigateTo({
      url: '/pages/stuverify/stuverify',
    })
  },

  mine: function () {
    wx.navigateTo({
      url: this.data.broadcasturl,
    })
  },

  onLoad: function (options) {
    console.log('onload')
    console.log(getApp().globalData.userInfo)
  },

  onShow: function () {
    var app = getApp()
    var that = this
    console.log(getApp().globalData.userInfo)



    if (getApp().globalData.userInfo == null) {
      console.log('glbdata is still null')
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
              console.log(res)      //ok
              if(res.data.flag == 0) {
                console.log("database doesn't have userinfo")
                this.setData({
                  avatarUrl: "/images/avatar.png",
                  nickName: "未登录",
                  nologin: "/pages/login/login",
                  broadcasturl: "/pages/login/login"
                })
              } else {
                console.log("database have userinfo")
                getApp().globalData.userInfo = {
                  nickName: res.data.nickName,
                  avatarUrl: res.data.avatarUrl
                }
                getApp().globalData.openid = res.data.openid
                this.setData({
                  avatarUrl: res.data.avatarUrl,
                  nickName: res.data.nickName,
                  nologin: "",
                  broadcasturl: "/pages/my_stuff/my_stuff"
                })
                console.log(getApp().globalData)
              }
            }
          })
        }
      })

    } else {
      console.log('glbdata is not null')
      if (getApp().globalData.openid == '' || getApp().globalData.openid == null) {
        console.log('openid is null')
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
                getApp().globalData.openid =res.data.openid      //ok
              }
            })
          }
        })
      }
      console.log(getApp().globalData)
      this.setData({
        avatarUrl: getApp().globalData.userInfo.avatarUrl,
        nickName: getApp().globalData.userInfo.nickName,
        nologin: "",
        broadcasturl: "/pages/my_stuff/my_stuff"
      })
    }
  }

})