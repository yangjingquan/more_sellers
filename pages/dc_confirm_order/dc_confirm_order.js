var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    tables: [],
    index: 0
  },
  
  onLoad: function (options) {
    var that = this
    var total_amount = options.total_amount
    wx.getStorage({
      key: 'cart_info',
      success: function (res) {
        that.setData({
          cart_info: res.data
        })
      }
    })
    
    that.setData({
      total_amount: total_amount
    })
    var bis_id = app.globalData.bis_id
    that.getTablesInfo(bis_id)
  },
  //获取桌位信息
  getTablesInfo: function (bis_id){
      var that = this
      wx.request({
        url: app.globalData.requestUrl + '/table/getAllTablesInfo',
        data: {bis_id : bis_id},
        header: {
          'content-type': ''
        },
        method : 'post',
        success: function (res) {
          var result = res.data.result
          var table_data = new Array()
          for(var i = 0; i < result.length; i++){
            table_data.push(result[i]['table_name'])
          }
          that.setData({
            tables: table_data
          })
        }
      })
      
  },
  bindTableChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  //提交订单
  formSubmit : function(e){
      var that = this
      var formData = e.detail.value
      var postData = {
        bis_id : app.globalData.bis_id,
        openid: app.globalData.openid,
        table: formData.table,
        remark : formData.remark,
        cart_info : that.data.cart_info,
        total_amount: that.data.total_amount
      }

      wx.request({
        url: app.globalData.requestUrl + '/order/makeDcOrder',
        data: postData,
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          //清除缓存
          wx.clearStorage()
          var order_id = res.data.result
          //跳转订单详情页
          wx.navigateTo({
            url: '/pages/dc_order_detail/dc_order_detail?order_id=' + order_id,
          })
        }
      })
  }
  
})
