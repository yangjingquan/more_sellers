var app = getApp()
Page({
  data: {
    
  },

  onLoad: function (options) {
      var that = this
      wx.request({
        url: app.globalData.requestUrl + '/team/getDetail',
        data: { openid: app.globalData.openid },
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          var result = res.data.result
          that.setData({
            res: result
          })
        }
      })
  }
})