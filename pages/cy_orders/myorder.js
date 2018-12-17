// myorder.js
var app = getApp()
Page({
  data: {
      status : 1,
      openid : '',
      imgUrl: app.globalData.imgUrl
  },

  onLoad: function (options) {
      var that = this
      var bis_id = app.globalData.bis_id
      var status = 1
      var postdata = {
        openid: app.globalData.openid,
        type: status,
        bis_id: bis_id
      }
      that.setData({
        status: status
      })
      that.getOrderInfo(postdata) 

  },

  //切换订单类型
  checkOrderType : function(event){
    var that = this
    var bis_id = app.globalData.bis_id
    var status = event.currentTarget.dataset.statusid
    var postdata = {
      openid: app.globalData.openid,
      type : status,
      bis_id : bis_id
    }
    
    that.getOrderInfo(postdata)
  },
  //获取订单信息
  getOrderInfo : function(postdata){
      var that = this
      if(postdata.type != 3){
        var url = app.globalData.requestUrl + '/order/getNormalOrderInfo'
      }else{
        var url = app.globalData.requestUrl + '/order/getReserveOrderInfo'
      }
      
      wx.request({
        url: url,
        data: postdata,
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
          if(res.data.statuscode == 1){
            that.setData({
              order_info: res.data.result,
              status: postdata.type
            })
          }else{
            that.setData({
              order_info: [],
              status: postdata.type
            })
          }
          
        }
      }) 
  },
  //去付款
  pay: function (e) {
    var that = this
    var order_id = e.target.dataset.orderid
    that.makePreOrder(order_id)
  },
  //生成微信预订单
  makePreOrder: function (order_id) {
    var that = this
    var pdata = {
      order_id: order_id,
      body: '餐饮',
      openid: app.globalData.openid
    }
    wx.request({
      url: app.globalData.requestUrl + '/pay/pay',
      data: pdata,
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        var preData = res.data.result
        //调起微信支付
        that.wxPay(preData)
      }
    })
  },
  //调起微信支付
  wxPay: function (preData) {
    wx.requestPayment({
      timeStamp: (preData.timeStamp).toString(),
      nonceStr: preData.nonceStr,
      package: preData.package,
      signType: preData.signType,
      paySign: preData.sign,
      success: function (result) {
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    var bis_id = app.globalData.bis_id
    var status = that.data.status
    var postdata = {
      openid: app.globalData.openid,
      type: status,
      bis_id: bis_id
    }
    wx.showNavigationBarLoading()
    if (postdata.type != 3) {
      var url = app.globalData.requestUrl + '/order/getNormalOrderInfo'
    } else {
      var url = app.globalData.requestUrl + '/order/getReserveOrderInfo'
    }

    //获取订单信息
    wx.request({
      url: url,
      data: postdata,
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        if (res.data.statuscode == 1) {
          that.setData({
            order_info: res.data.result,
            status: postdata.type
          })
        } else {
          that.setData({
            order_info: [],
            status: postdata.type
          })
        }
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  //取消预定订单
  canceReserveOrder : function(e){
    var that = this
    var order_id = e.currentTarget.dataset.orderid
    wx.request({
      url: app.globalData.requestUrl + '/order/cancelOrder',
      data: { order_id: order_id},
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        wx.showToast({
          title: '取消订单成功',
          icon: 'success',
          duration: 2000,
          success: function (result) {
            //获取订单信息
            var postdata = {
              openid: app.globalData.openid,
              type: that.data.status,
              bis_id: app.globalData.bis_id,
            }
            
            that.getOrderInfo(postdata)  
          }
        })       
      }
    })
  },
  //获取点餐订单详情
  getDcDetail : function(e){
    var order_id = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/dc_order_detail/dc_order_detail?order_id=' + order_id,
    })
  },
  //获取外卖订单详情
  getWmDetail: function (e) {
    var order_id = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/wm_order_detail/wm_order_detail?order_id=' + order_id,
    })
  }
})