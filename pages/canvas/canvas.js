// pages/canvas/canvas.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: "650px",
    phone: "",
    qq: "",
    stuffname: "",
    time: "",
    lfflag: 1,
    src: "",
    filePath: "",
    openset: null,
    hide: true
  },

  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: [current] // 需要预览的图片http链接列表  
    })
  },

  cancleSet() {
    this.setData({
      openSet: false
    })
  },

  onLoad: function (options) {
    var self = this
    wx.showLoading({
      title: '加载中',
      success(res) {
        self.setData({
          hide: true
        })
      }
    })
    
    console.log(options)
    var contacts = JSON.parse(options.contacts)
    var detail = JSON.parse(options.detail)
    console.log(contacts)    
    console.log(detail)
    var result = ""
    this.setData({
      phone: contacts.phone,
      qq: contacts.qq,
      stuffname: detail.name,
      time: detail.time,
    })

    console.log(detail)
    if (detail[0]) {
      result = detail[0].img[0]
    } else if (detail.img[0]){
      result = detail.img[0]
    } else {
      result = "don't has img"
    }
    if (result != "/images/ava.png" && result != "/images/lost.png") {
      this.setData({
        src: result
      })
    } else {
      this.setData({
        src: detail.type == '寻物启事' ? '/images/lost.png' : '/images/ava.png'
      })
    }
  },

  save: function() {
    console.log('hello')
    let that = this
    wx.getSetting({
      success(res) {
        
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              console.log(res)
              wx.saveImageToPhotosAlbum({
                filePath: that.data.filePath,
                success() {
                  wx.showToast({
                    title: '保存成功'
                  })
                },
                fail(res) {
                  console.log(res)
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  })
                }
              })
            },
            fail() {
              // 如果用户拒绝过或没有授权，则再次打开授权窗口
              //（ps：微信api又改了现在只能通过button才能打开授权设置，以前通过openSet就可打开，下面有打开授权的button弹窗代码）
              that.setData({
                openSet: true
              })
            }
          })
        } else {
          console.log("no")
          // 有则直接保存
          wx.saveImageToPhotosAlbum({
            filePath: that.data.filePath,
            success() {
              wx.showToast({
                title: '保存成功'
              })
            },
            fail() {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              })
            }
          })
        }
      },
      fail(res) {
        console.log(res)
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
    let self = this
    console.log(this.data.stuffname.length)
    wx.getImageInfo({
      src: self.data.src,
      success(res) {
        const ctx = wx.createCanvasContext('shareCanvas')
        const stuffnamewidth = ctx.measureText(self.data.stuffname)
        ctx.setFillStyle('#FFFFFF')
        ctx.fillRect(0, 0, 400, 700)
        var old_width = res.width;
        var old_height = res.height;
        var scale = old_width / old_height
        var scale_y = 360
        var scale_x = scale * scale_y
        var pic_name = 0

        if (old_height - old_width > 100) {
          ctx.translate(20, scale_x + 15)
          ctx.rotate(-90 * Math.PI / 180)
          ctx.drawImage(res.path, 0, 0, scale_x, scale_y);

          ctx.rotate(90 * Math.PI / 180)
          ctx.translate(-20, -(scale_x + 15))
          pic_name = scale_x + 20
          // self.setData({
          //   height: scale_x+30+"px"
          // })
        } else {
          scale = 1 / scale
          scale_x = 360
          scale_y = scale * scale_x
          ctx.drawImage(res.path, (400 - scale_x) / 2, 15, scale_x, scale_y);

          pic_name = scale_y + 20
          // self.setData({
          //   height: scale_y+30+"px"
          // })
        }
        ctx.setTextBaseline('top')
        var dynamic_height = pic_name + 17
        var stuffname = self.data.stuffname
        var chr = stuffname.split("");
        var temp = "";
        var row = [];
        ctx.setFontSize(33)
        ctx.setFillStyle('black')
        console.log(chr)
        for (var a = 0; a < chr.length; a++) {
          if (ctx.measureText(temp).width < 350) {
            temp += chr[a];
          }
          else {
            a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
            row.push(temp);
            temp = "";
          }
        }
        row.push(temp);
        if (row.length > 2) {
          var rowCut = row.slice(0, 2);
          var rowPart = rowCut[1];
          var test = "";
          var empty = [];
          for (var a = 0; a < rowPart.length; a++) {
            if (ctx.measureText(test).width < 320) {
              test += rowPart[a];
            }
            else {
              break;
            }
          }
          empty.push(test);
          var group = empty[0] + "..."//这里只显示两行，超出的用...表示
          rowCut.splice(1, 1, group);
          row = rowCut;
        }
        for (var b = 0; b < row.length; b++) {
          ctx.setFontSize(33)
          ctx.setFillStyle('black')
          ctx.fillText(row[b], 20, pic_name + 10 + b * 40);
          dynamic_height = dynamic_height + 40
        }

        ctx.setFontSize(27)
        ctx.setFillStyle('black')
        if (self.data.qq != null && self.data.qq != "null" && self.data.qq != "") {
          ctx.setFontSize(27)
          ctx.setFillStyle('black')
          ctx.fillText("请联系QQ： " + self.data.qq, 20, dynamic_height)
          dynamic_height = dynamic_height + 40
        } else if (self.data.phone != null && self.data.phone != "null" && self.data.phone != "") {
          ctx.setFontSize(27)
          ctx.setFillStyle('black')
          ctx.fillText("请联系手机：" + self.data.phone, 20, dynamic_height)
          dynamic_height = dynamic_height + 40
        }

        ctx.setFontSize(17)
        ctx.setFillStyle('gray')
        ctx.fillText(self.data.time + "发布", 20, dynamic_height - 3)
        dynamic_height = dynamic_height + 25

        ctx.moveTo(20, dynamic_height)
        ctx.lineTo(380, dynamic_height)
        ctx.setStrokeStyle('gray')
        ctx.stroke()
        dynamic_height = dynamic_height + 15

        ctx.drawImage('/icon/code.jpg', 20, dynamic_height, 100, 100)
        dynamic_height += 115

        ctx.setFillStyle('gray')
        ctx.setFontSize(14)
        ctx.fillText('长按识别工大威海专属失物招领小程序', 140, dynamic_height - 105)
        ctx.setFillStyle('gray')
        ctx.setFontSize(14)
        ctx.fillText('校会维权服务部QQ：3085514680', 140, dynamic_height - 85)
        ctx.setFillStyle('gray')
        ctx.setFontSize(14)
        ctx.fillText('关注微信公众号：哈工大威海学生会', 140, dynamic_height - 65)
        ctx.setFillStyle('gray')
        ctx.setFontSize(14)
        ctx.fillText('祝你快乐生活每一天', 140, dynamic_height - 45)

        self.setData({
          height: dynamic_height + "px"
        }, (res)=>{
            setTimeout(function () {
              wx.hideLoading()
              self.setData({
                hide: false
              })
            }, 2000)
            ctx.draw(false, function () {
              // 3. canvas画布转成图片
              wx.canvasToTempFilePath({
                canvasId: 'shareCanvas',
                quality: 1,
                success(res) {
                  self.setData({
                    filePath: res.tempFilePath,
                  })
                }
              })
            })
        })
        console.log(self.data.filePath)

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