// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    hide: true
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },

  search: function (e) {
    var self = this;
    wx.request({
      url: 'https://www.kashingliu.cn/wechattest/make_currentlist.php?query=' + this.data.inputVal.replace(/[\-\_\,\!\|\~\`\(\)\#\$\%\^\&\*\{\}\:\;\"\L\<\>]/g, '').replace(/[\?]/g, '？'),
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        self.setData({
          currentList: res.data,
        })

      }
    })
  },

  detailTap: function (e) {
    var detail = e.currentTarget.dataset.anchorobj
    if (detail.ifidcard == 1 || detail[0].img[0] == "/images/ava.png" || detail[0].img[0] == "/images/lost.png") {
      detail.display = false
    } else {
      detail.display = true
    }
    let str = JSON.stringify(detail)
    wx.navigateTo({
      url: '/pages/show/show?check=0&obj=' + str,
    })
  },

  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.query)
    var self = this;
    wx.showLoading({
      title: '加载中',
      success(res) {
        self.setData({
          hide: true
        })
      }
    })
    wx.request({
      url: 'https://www.kashingliu.cn/wechattest/make_currentlist.php?query=' + options.query.replace(/[\-\_\,\!\|\~\`\(\)\#\$\%\^\&\*\{\}\:\;\"\L\<\>]/g, '').replace(/[\?]/g, '？'),
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        self.setData({
          currentList: res.data,
        })

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
    var self = this
    setTimeout(function () {
      wx.hideLoading()
      self.setData({
        hide: false
      })
    }, 2000)
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