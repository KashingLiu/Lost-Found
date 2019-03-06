Page({

  data: {
    currentList: [],
    time: 0,
    isNone: false,
    loading: false,
    inputShowed: false,
    inputVal: ""
  }, 

  test: function() {
    wx.login({
      success: res => {
        // 获取到用户的 code 之后：res.code
        console.log("用户的code:" + res.code);
        wx.request({
          // 自行补上自己的 APPID 和 SECRET
          url: 'https://www.kashingliu.cn/wechattest/send_message.php?code=' + res.code,
          success: res => {
            console.log(res)      //ok
          }
        })
      }
    })
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
    wx.navigateTo({
      url: '/pages/search/search?query=' + this.data.inputVal.replace(/[\-\_\,\!\|\~\`\(\)\#\$\%\^\&\*\{\}\:\;\"\L\<\>]/g, '').replace(/[\?]/g, '？'),
    })
  },
  
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  
  detailTap: function (e) {
    var detail = e.currentTarget.dataset.anchorobj
    console.log(detail)
    if (detail.ifidcard == 1 || detail.img[0] == "/images/ava.png" || detail.img[0] == "/images/lost.png") {
      detail.display = false
    } else {
      detail.display = true
    }

    let str = JSON.stringify(detail)
    wx.navigateTo({
      url: '/pages/show/show?check=0&obj=' + str,
    })
  },

  onPullDownRefresh: function () {
    this.setData({
      loading: true
    })
    console.log('hello')
    var self = this;
    wx.request({
      url: 'https://www.kashingliu.cn/wechattest/show_index.php?load=0',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // console.log(res)
        wx.stopPullDownRefresh()
        console.log("finish")
        self.setData({
          currentList: res.data,
          loading: false
        })
        
      }
    })
  },

  onReachBottom: function () {
    var len = this.data.currentList.length-1
    var latestid = this.data.currentList[len].id
    var self = this;
    wx.request({
      url: 'https://www.kashingliu.cn/wechattest/show_index.php?load=1&id=' + latestid,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // console.log()
        console.log(self.data.currentList)
        console.log(res)
        var result = self.data.currentList
        for (var i = 0; i < res.data.length; i++){
          result.push(res.data[i])
        }
        self.setData({
          currentList: result,
        })
      }
    })
  },

  filter_time: function (e) {
    var time = e.currentTarget.dataset.time
    switch(time) {
      case 'today':
        wx.navigateTo({
          url: '/pages/filter/filter?time=0',
        })
      break;
      case 'yesterday':
        wx.navigateTo({
          url: '/pages/filter/filter?time=1',
        })
      break;
      case 'week':
        wx.navigateTo({
          url: '/pages/filter/filter?time=2',
        })
      break;
      case 'ago':
        wx.navigateTo({
          url: '/pages/filter/filter?time=3',
        })
      break;
    }
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
    var self = this;
    wx.request({
      url: 'https://www.kashingliu.cn/wechattest/show_index.php?load=0',
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})