// myorder.js
var app = getApp()
Page({
  data: {
      status : 1,
      openid : '',
  },

  onLoad: function (options) {
      var that = this
      var bis_id = app.globalData.bis_id
      var order_status = options.order_status
      var postdata = {
        wx_id : app.globalData.openid
      }
      that.setData({
        status: order_status
      }) 
      //获取订单信息
      that.getOrderInfo(postdata)
  },

  //切换订单类型
  checkOrderStatus : function(event){
    var that = this
    var status = event.currentTarget.dataset.statusid
    var postdata = {
      wx_id: app.globalData.openid,
      type : status
    }
    that.setData({
        status : status
    }) 
    that.getOrderInfo(postdata)
  },
  //获取订单信息
  getOrderInfo : function(postdata){
      var that = this
      wx.request({
        url: app.globalData.requestUrl + '/order/getOrderInfoBySingleMulti',
        data: postdata,
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
          if (res.data.statuscode == 1){
              that.setData({
                order_info: res.data.result
              })
          }else{
            that.setData({
              order_info: []
            })
          }
          
        }
      }) 
  },
  //去付款
  pay: function (e) {
    var that = this
    var order_id = e.target.dataset.orderid
    //拼团情况下，检验当前是否成团
    wx.request({
      url: app.globalData.requestUrl + '/order/checkGroupStatusByOrderId',
      data: { order_id: order_id },
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        if (res.data.statuscode == 0) {
          //未成团
          that.makePreOrder(order_id)
        } else {
          wx.showToast({
            title: '手慢了，被别人抢先拼成了！',
            image: '/pics/icons/tanhao.png',
            duration: 1200,
            mask: true
          })
        }
      }
    })
  },
  //生成微信预订单
  makePreOrder: function (order_id) {
    var that = this
    var pdata = {
      order_id: order_id,
      body: '商品',
      openid: app.globalData.openid
    }
    wx.request({
      url: app.globalData.payGroupUrl,
      data: pdata,
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        var preData = res.data.result
        //调起微信支付
        that.wxPay(preData, pdata.order_id)
      }
    })
  },
  //调起微信支付
  wxPay: function (preData,order_id) {
    var that = this
    wx.requestPayment({
      timeStamp: (preData.timeStamp).toString(),
      nonceStr: preData.nonceStr,
      package: preData.package,
      signType: preData.signType,
      paySign: preData.sign,
      success: function (result) {
        //更改订单状态
        wx.request({
          url: app.globalData.requestUrl + '/order/updateOrderStatusBySingle',
          data: { order_id: order_id },
          method: 'post',
          header: {
            'content-type': ''
          },
          success: function (res) {

          }
        })

        //添加积分
        wx.request({
          url: app.globalData.requestUrl + '/bis/editJifenGroup',
          data: { order_id: order_id, openid: app.globalData.openid, bis_id: app.globalData.bis_id },
          method: 'post',
          header: {
            'content-type': ''
          },
          success: function (res) {

          }
        })
        
        if (!app.globalData.rec_id || app.globalData.rec_id == '') {
          var e = {
            currentTarget : {
              dataset : {
                statusid : 4
              }
            }
          }
          that.checkOrderStatus(e)
        } else {
          //设置主订单表推荐人及佣金信息
          wx.request({
            url: app.globalData.requestUrl + '/order/setMainRecInfoBySingle',
            data: { order_id: order_id, rec_id: app.globalData.rec_id },
            method: 'post',
            header: {
              'content-type': ''
            },
            success: function (res) {
              var e = {
                currentTarget: {
                  dataset: {
                    statusid: 4
                  }
                }
              }
              that.checkOrderStatus(e)
            }
          })
        } 
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading()
    var postdata = {
      wx_id: app.globalData.openid,
      type: that.data.status
    }
    that.setData({
      status: that.data.status
    })
    //获取订单信息
    wx.request({
      url: app.globalData.requestUrl + '/order/getOrderInfoBySingleMulti',
      data: postdata,
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        if (res.data.statuscode == 1) {
          that.setData({
            order_info: res.data.result
          })
        } else {
          that.setData({
            order_info: []
          })
        }
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  //上拉加载更多（待开发）
  onReachBottom: function () {
    var that = this
  },
  //取消订单
  cancelOrder : function(e){
    var that = this
    var order_id = e.target.dataset.orderid 
    wx.request({
      url: app.globalData.requestUrl + '/order/cancelOrderBySingle',
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
              wx_id: app.globalData.openid,
              type: that.data.status
            }
            that.setData({
              status: that.data.status
            })
            that.getOrderInfo(postdata)  
          }
        })       
      }
    })
  },
  //进入订单详情
  detailOrder: function (e) {
    var model = JSON.stringify(e.currentTarget.dataset.model);
    var orderid = e.currentTarget.dataset.orderid;
    wx.redirectTo({
      url: '/pages/group_orders_detail/orders_detail?model=' + model + '&orderid=' + orderid,
    })
  },
  //确认收货
  confirmOrder: function (e) {
    var that = this
    var order_id = e.target.dataset.orderid
    wx.request({
      url: app.globalData.requestUrl + '/order/confirmGroupOrder',
      data: { order_id: order_id },
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        wx.showToast({
          title: '确认收货成功',
          icon: 'success',
          duration: 1000,
          success: function (result) {
            //获取订单信息
            var postdata = {
              wx_id: app.globalData.openid,
              type: that.data.status
            }
            that.setData({
              status: that.data.status
            })
            that.getOrderInfo(postdata)
          }
        })
      }
    })
  },
  //查询物流
  getLogisticInfo : function(event){
    var that = this
    var express_no = event.currentTarget.dataset.expressno
    var postcode = event.currentTarget.dataset.postcode
    var post_mode = event.currentTarget.dataset.postmode
    wx.navigateTo({
      url: '/pages/logistic/logistic?express_no=' + express_no + '&postcode=' + postcode + '&post_mode=' + post_mode,
    })
  },
  //分享
  share : function(e){
      var that = this
      var order_id = e.currentTarget.dataset.orderid
      wx.redirectTo({
        url: '../share/share?order_id='+order_id,
      })
  }
})