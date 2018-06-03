var app = getApp()
Page({
  data: {
    acodeUrl: app.globalData.acodeUrl
  },
  onLoad: function (options) {
    var that = this
    var postdata = {
      appid: app.globalData.appid,
      secret: app.globalData.secret,
      openid: app.globalData.openid
    }
    wx.request({
      url: app.globalData.requestUrl + '/index/getMultiWxacode',
      data: postdata,
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        that.setData({
          acode_url: res.data.result
        })
      }
    })
  }
})