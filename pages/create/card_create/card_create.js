// pages/create/card_create/card_create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    major: ["未知学院","计算机科学与技术学院", "船舶与海洋工程学院", "海洋科学与技术学院", "材料科学与工程学院", "新能源学院", "土木工程学院", "汽车工程学院", "信息科学与工程学院", "经济管理学院", "理学院", "语言文学学院"],
    majorIndex: 0,
    openid: ""
  },
  bindMajorChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', this.data.major[e.detail.value]);

    this.setData({
      majorIndex: e.detail.value
    })
  },
  bindsubmit: function (e) {
    let self = this;
    var item = e.detail.value;
    if (item.cardid=='') {
      wx.showToast({
        title: '请输入丢卡人学号',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
    } else if (item.cardid.length < 9) {
      wx.showToast({
        title: '请输入格式正确的学生卡号码',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
    } else if(item.cardname=='') {
      wx.showToast({
        title: '请输入丢卡人姓名',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
    } else if(item.input_phone==''&&item.input_place==''&&item.input_qq=='') {
      wx.showToast({
        title: '请至少输入一种联系方式',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
    } else if (item.input_phone.length != 0 && item.input_phone.length != 11 && item.input_phone.length != 8) {
      wx.showToast({
        title: '请输入格式正确的手机号码',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
    } else if (item.input_qq.length != 0 && item.input_qq.length < 5 || item.input_qq.length >11) {
      wx.showToast({
        title: '请输入格式正确的QQ号码',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
    } else {
      var openid = ""
      if (getApp().globalData.openid == "" || this.data.openid == "") {
        wx.login({
          success: res => {
            // 获取到用户的 code 之后：res.code
            console.log("用户的code:" + res.code);
            wx.request({
              // 自行补上自己的 APPID 和 SECRET
              url: 'https://www.kashingliu.cn/wechattest/get_userinfo.php?code=' + res.code,
              success: res => {
                console.log(res)      //ok
                getApp().globalData.openid = res.data.openid
                openid = res.data.openid
                self.setData({
                  openid: res.data.openid
                })
                wx.request({
                  url: 'https://www.kashingliu.cn/wechattest/insert_stuff.php',
                  data: {
                    generalsubmit: 0,
                    stuff_name: e.detail.value.cardname.replace(/[\?]/g, '？'),
                    detail: this.data.major[this.data.majorIndex],
                    card_number: e.detail.value.cardid,
                    input_phone: e.detail.value.input_phone,
                    input_qq: e.detail.value.input_qq,
                    input_place: e.detail.value.input_place.replace(/[\-\_\|\~\`\#\%\^\&\*\{\}\:\;\"\?]/g, ''),
                    openid: self.data.openid
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success(res) {
                    console.log(res.data)
                    console.log(e.detail.value)
                    var contacts = {};
                    contacts.qq = e.detail.value.input_qq;
                    contacts.phone = e.detail.value.input_phone;
                    contacts.place = e.detail.value.input_place.replace(/[\-\_\,\!\|\~\`\(\)\#\$\%\^\&\*\{\}\:\;\"\L\<\>\?]/g, '');
                    contacts.detail = "学号：" + e.detail.value.cardid + " 、院系：" + self.data.major[self.data.majorIndex];
                    console.log(contacts);
                    var detail = {};
                    detail.id = res.data.id;
                    detail.name = e.detail.value.cardname.replace(/[\?]/g, '？') + "学号：" + e.detail.value.cardid + "的学生卡"
                    detail.time = res.data.time;
                    (self.data.select == 1) ? detail.type = "失物招领" : detail.type = "寻物启事";
                    detail.type == "失物招领" ? detail.img = ["/images/ava.png"] : detail.img = ["/images/lost.png"]

                    console.log(detail);
                    var put = {}
                    put.detail = detail
                    put.contacts = contacts
                    put.display = false
                    let str = JSON.stringify(put)
                    //TO DO
                    wx.navigateTo({
                      url: '/pages/show/show?check=1&put=' + str,
                    })
                    //TO DO
                  }
                })
              }
            })
          }
        })
      } else {
        wx.request({
          url: 'https://www.kashingliu.cn/wechattest/insert_stuff.php',
          data: {
            generalsubmit: 0,
            stuff_name: e.detail.value.cardname.replace(/[\?]/g, '？'),
            detail: this.data.major[this.data.majorIndex],
            card_number: e.detail.value.cardid,
            input_phone: e.detail.value.input_phone,
            input_qq: e.detail.value.input_qq,
            input_place: e.detail.value.input_place.replace(/[\-\_\|\~\`\#\%\^\&\*\{\}\:\;\"\?]/g, ''),
            openid: self.data.openid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data)
            console.log(e.detail.value)
            var contacts = {};
            contacts.qq = e.detail.value.input_qq;
            contacts.phone = e.detail.value.input_phone;
            contacts.place = e.detail.value.input_place.replace(/[\-\_\,\!\|\~\`\(\)\#\$\%\^\&\*\{\}\:\;\"\L\<\>\?]/g, '');
            contacts.detail = "学号：" + e.detail.value.cardid + " 、院系：" + self.data.major[self.data.majorIndex];
            console.log(contacts);
            var detail = {};
            detail.id = res.data.id;
            detail.name = e.detail.value.cardname.replace(/[\?]/g, '？')
            detail.time = res.data.time;
            (self.data.select == 1) ? detail.type = "失物招领" : detail.type = "寻物启事";
            detail.type == "失物招领" ? detail.img = ["/images/ava.png"] : detail.img = ["/images/lost.png"]

            console.log(detail);
            var put = {}
            put.detail = detail
            put.contacts = contacts
            put.display = false
            let str = JSON.stringify(put)
            //TO DO
            wx.navigateTo({
              url: '/pages/show/show?check=1&put=' + str,
            })
            //TO DO
          }
        })
      }
      
      console.log(e)
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

  bindMajorChange: function (e) {
    this.setData({
      majorIndex: e.detail.value
    })
  },
})