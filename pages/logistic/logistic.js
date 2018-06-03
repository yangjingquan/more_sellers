// logistic.js
var app = getApp()
Page({
  data: {
      
  },
  onLoad : function(options){
    var that = this
    var express_no = options.express_no
    var postcode = options.postcode
    var post_mode = options.post_mode
    wx.request({
      url: app.globalData.requestUrl + '/order/getLogisticInfo',
      data: { logisticCode: express_no, shipperCode: postcode },
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        var traces = res.data.Traces
        traces = traces.reverse()
        var first_trace = traces[0]
        that.setData({
          first_trace: first_trace,
          traces: traces,
          post_mode: post_mode,
          express_no: express_no
        })
      }
    })
  } 
})