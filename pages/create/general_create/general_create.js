// pages/create/general_create/general_create.js
var app = getApp()
var result = new Array()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: 'find', value: '招领', checked: 'true' },
      { name: 'lost', value: '寻物'},
    ],
    files: [],
    select: true,
    text_area: '',
    returnpath: [],
    openid: ""
  },
  bindTextAreaBlur: function (e) {
    // console.log(e.detail.value)
    this.setData({
      text_area: e.detail.value,
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
        console.log(res)
      }
    })
  },

  deleteimg: function (e) {
    var files = this.data.files;
    var index = e.currentTarget.dataset.index;
    files.splice(index, 1);
    this.setData({
      files: files
    });
  },

  previewImage: function (e) {
    var index = e.currentTarget.dataset.index;
    var imgArr = [];
    var objkeys = Object.keys(this.data.files);
    for (var i = 1; i <= objkeys.length; i++) {
      imgArr.push(this.data.files[i]);
    }
    wx.previewImage({
      current: imgArr[index],//当前图片地址
      urls: imgArr
    })
  },


  up_img: function (e) {
    var content = e.detail.value
    if (content.stuff_name == "") {
      wx.showToast({
        title: '请输入物品名称',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
    } else if (content.input_phone == "" && content.input_qq == "") {
      wx.showToast({
        title: '请至少输入一种联系方式',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
    } else if (content.input_phone.length != 0 && content.input_phone.length != 11 && content.input_phone.length != 8) {
      wx.showToast({
        title: '请输入格式正确的手机号码',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
    } else if (content.input_qq.length != 0 && content.input_qq.length < 5 || content.input_qq.length > 11) {
      wx.showToast({
        title: '请输入格式正确的QQ号码',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
    } else {
      var pics = this.data.files;
      if (pics.length === 0) {
        this.generalsubmit(e);
      } else {
        var data = {
          url: 'https://www.kashingliu.cn/wechattest/uploadimg.php',//这里是你图片上传的接口
          path: pics,//这里是选取的图片的地址数组
          e:e
        }
        this.uploadimg(data);
      }
    }
  },


  uploadimg: function (data) {
    // console.log(data)
    var e = data.e
    // var result = new Array();
    var that = this,
      i = data.i ? data.i : 0,//当前上传的哪张图片
      success = data.success ? data.success : 0,//上传成功的个数
      fail = data.fail ? data.fail : 0;//上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',//这里根据自己的实际情况改
      formData: null,//这里是上传图片时一起上传的数据
      success: (resp) => {
        success++;//图片上传成功，图片上传成功的变量+1
        result.push(resp.data);
        // console.log(result);
        // console.log(i);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++;//图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++;//这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) {   //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          console.log(result);
          this.generalsubmit(e);
          // console.log(e)
        } else {//若图片还没有传完，则继续调用函数
          // console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
        
      }
    });
  },



  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == "lost") {
      this.setData({ select: false })
    }
    else { this.setData({ select: true }) }
  },

  generalsubmit: function (e) {

    let self = this;
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
                  generalsubmit: 1,
                  stuff_name: e.detail.value.stuff_name.replace(/[\?]/g, '？'),
                  detail: this.data.text_area.replace(/[\-\_\|\`\#\%\^\&\*\{\}\;\"]/g, '').replace(/[\?]/g, '？'),
                  input_phone: e.detail.value.input_phone,
                  input_qq: e.detail.value.input_qq,
                  input_place: e.detail.value.input_place.replace(/[\-\_\|\~\`\#\%\^\&\*\{\}\;\"\?]/g, ''),
                  lostorfound: this.data.select,
                  filepath: result,
                  openid: self.data.openid
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success(res) {
                  console.log(res.data.id)

                  console.log(e.detail.value)
                  var initarray = new Array()
                  for (var i = 0; i < result.length; i++) {
                    initarray.push('https://www.kashingliu.cn/wechattest/uploadimg/' + result[i]);
                  }
                  console.log(initarray)
                  var display = true;

                  if (result.length == 0) {
                    display = false
                  }
                  var contacts = {};
                  contacts.qq = e.detail.value.input_qq;
                  contacts.phone = e.detail.value.input_phone;
                  contacts.place = e.detail.value.input_place.replace(/[\-\_\!\|\~\`\(\)\#\$\%\^\&\*\{\}\:\;\"\L\<\>\?]/g, '');
                  contacts.detail = self.data.text_area.replace(/[\-\_\!\|\~\`\(\)\#\$\%\^\&\*\{\}\:\;\"\L\<\>]/g, '').replace(/[\?]/g, '？');
                  console.log(contacts);

                  var detail = {};
                  detail.id = res.data.id;
                  detail.name = e.detail.value.stuff_name.replace(/[\?]/g, '？')
                  detail.time = res.data.time;
                  (self.data.select == 1) ? detail.type = "失物招领" : detail.type = "寻物启事";
                  if (initarray.length == 0) {
                    detail.type == "失物招领" ? detail.img = ["/images/ava.png"] : detail.img = ["/images/lost.png"]
                  } else {
                    detail.img = initarray;
                  }
                  console.log(detail);

                  console.log(display);
                  var put = {}
                  put.detail = detail
                  put.contacts = contacts
                  put.display = display
                  let str = JSON.stringify(put)
                  //TO DO
                  result = new Array()
                  wx.navigateTo({
                    url: '/pages/show/show?check=1&put=' + str,
                  })

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
          generalsubmit: 1,
          stuff_name: e.detail.value.stuff_name.replace(/[\?]/g, '？'),
          detail: this.data.text_area.replace(/[\-\_\|\`\#\%\^\&\*\{\}\;\"]/g, '').replace(/[\?]/g, '？'),
          input_phone: e.detail.value.input_phone,
          input_qq: e.detail.value.input_qq,
          input_place: e.detail.value.input_place.replace(/[\-\_\|\~\`\#\%\^\&\*\{\}\;\"\?]/g, ''),
          lostorfound: this.data.select,
          filepath: result,
          openid: self.data.openid
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data.id)

          console.log(e.detail.value)
          var initarray = new Array()
          for (var i = 0; i < result.length; i++) {
            initarray.push('https://www.kashingliu.cn/wechattest/uploadimg/' + result[i]);
          }
          console.log(initarray)
          var display = true;

          if (result.length == 0) {
            display = false
          }
          var contacts = {};
          contacts.qq = e.detail.value.input_qq;
          contacts.phone = e.detail.value.input_phone;
          contacts.place = e.detail.value.input_place.replace(/[\-\_\!\|\~\`\(\)\#\$\%\^\&\*\{\}\:\;\"\L\<\>\?]/g, '');
          contacts.detail = self.data.text_area.replace(/[\-\_\!\|\~\`\(\)\#\$\%\^\&\*\{\}\:\;\"\L\<\>]/g, '').replace(/[\?]/g, '？');
          console.log(contacts);

          var detail = {};
          detail.id = res.data.id;
          detail.name = e.detail.value.stuff_name.replace(/[\?]/g, '？')
          detail.time = res.data.time;
          (self.data.select == 1) ? detail.type = "失物招领" : detail.type = "寻物启事";
          if (initarray.length == 0) {
            detail.type == "失物招领" ? detail.img = ["/images/ava.png"] : detail.img = ["/images/lost.png"]
          } else {
            detail.img = initarray;
          }
          console.log(detail);

          console.log(display);
          var put = {}
          put.detail = detail
          put.contacts = contacts
          put.display = display
          let str = JSON.stringify(put)
          result = new Array()
          wx.navigateTo({
            url: '/pages/show/show?check=1&put=' + str,
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    result = new Array()
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

})