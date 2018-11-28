var app = getApp()
Page({

  data: {
    imgUrl: app.globalData.imgUrl
  
  },

  onLoad: function (option) {
    var that = this
    var pro_id1 = option.pro_id;
    wx.request({
      url: app.globalData.requestUrl + '/announcement/getHomeDetail',
      data: { id: pro_id1 },
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          pro_detail_info: res.data.result
        })
      }
    })
    
  
  }

  
})