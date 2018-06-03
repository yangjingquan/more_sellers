//share.js
//获取应用实例
var app = getApp()
Page({
    data: {
      imgUrl: app.globalData.imgUrl
    },
    onLoad: function (options) {
      var that = this
      var order_id = options.order_id
      that.setData({
        order_id: order_id
      })
      //获取订单信息
      that.getOrderInfo(order_id)
    },
    //获取订单信息
    getOrderInfo: function (order_id){
        var that = this
        wx.request({
          url: app.globalData.requestUrl + '/order/getOrderInfoByShare',
          data: { order_id: order_id },
          method: 'post',
          header: {
            'content-type': ''
          },
          success: function (res) {
            var order_res = res.data.order_res
            var mem_res = res.data.mem_res
            var is_enough = res.data.is_enough
            var mem_id = res.data.mem_id
            that.setData({
              order_res: order_res,
              mem_res: mem_res,
              is_enough: is_enough,
              mem_id: mem_id
            })
          }
        })
    },
    qianggou : function(){
      var that = this
      var order_id = that.data.order_id
      var mem_id = that.data.mem_id
      if (mem_id == app.globalData.openid){
        wx.showToast({
          title: '不能拼自己的团哦!',
          image: '/pics/icons/tanhao.png',
          duration: 1200,
          mask: true
        })
      }else{
        //获取商品id
        wx.request({
          url: app.globalData.requestUrl + '/order/getProIdByShare',
          data: { order_id: order_id },
          method: 'post',
          header: {
            'content-type': ''
          },
          success: function (res) {
            var pro_id = res.data.pro_id
            var group_num = res.data.group_num
            var mem_id = res.data.mem_id
            wx.redirectTo({
              url: '/pages/index_group/group_pro_detail/pro_detail?pro_id=' + pro_id + '&group_num=' + group_num,
            })
          }
        })
      }
    }
})    
