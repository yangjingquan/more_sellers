var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl
  },
  
  onLoad: function (options) {
    var that = this
    var order_id = options.order_id
    that.getOrderInfo(order_id)
  },
  getOrderInfo: function (order_id){
    var that = this
    wx.request({
      url: app.globalData.requestUrl + '/order/getWmOrderDetail',
      data: { order_id: order_id},
      method : 'post',
      header: {
        'content-type': ''
      },
      success : function(res){
          that.setData({
            order_info : res.data.result
          })
      }
    })
  }
  
})
