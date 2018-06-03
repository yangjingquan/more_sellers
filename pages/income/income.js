var app = getApp()
Page({
  data: {
    acodeUrl: app.globalData.acodeUrl
  },
  onLoad: function (options) {
    var that = this
    var ketixian = options.ketixian
    var tixianzhong = options.tixianzhong
    that.setData({
      ketixian: ketixian,
      tixianzhong: tixianzhong
    })
  },
  //申请提现
  replyTixian: function (e) {
    var that = this
    var name = e.detail.value.name
    var id_no = e.detail.value.id_no
    var ketixian = that.data.ketixian
    var openid = app.globalData.openid
    var bis_id = app.globalData.bis_id

    if (ketixian < 1.00) {
      wx.showToast({
        title: '少于1元不可提现',
        image: '/pics/icons/tanhao.png',
        duration: 2000,
        mask: true
      })
    } else {
      if (name == ''){
        wx.showToast({
          title: '请输入姓名',
          image: '/pics/icons/tanhao.png',
          duration: 1500,
          mask: true
        })
      } else if (id_no == ''){
        wx.showToast({
          title: '请输入身份证号',
          image: '/pics/icons/tanhao.png',
          duration: 1500,
          mask: true
        })
      }else{
        var postData = {
          name: name,
          amount: ketixian,
          bis_id: bis_id,
          openid: openid,
          id_no : id_no
        }
        //申请提现
        wx.request({
          url: app.globalData.requestUrl + '/order/makeTixianOrders',
          data: postData,
          header: {
            'content-type': ''
          },
          method: 'post',
          success: function (res) {
            if (res.data.statuscode == 1) {
              wx.showToast({
                title: '提现成功',
                duration: 1500,
                mask: true,
                success: function () {
                  setTimeout(function () {
                    wx.switchTab({
                      url: '/pages/mine/mine',
                    })
                  }, 1500)
                }
              })
            } else {
              wx.showToast({
                title: '提现失败',
                image: '/pics/icons/tanhao.png',
                duration: 2000,
                mask: true
              })
            }
          }
        })
      }
    }
  }
})