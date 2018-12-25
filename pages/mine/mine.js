//mine.js
var app = getApp()
var checkLogin = require('../../utils/util.js'); 
//获取应用实例
Page({
  data: {
    userInfo: {},
    order_type : 1//1-普通订单 2-拼团订单 3-餐饮订单
  },
  onShow: function () {
    var that = this
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    }else{
      that.setData({
        userInfo:app.globalData.userInfo,
        rec_id: app.globalData.rec_id,
        openid: app.globalData.openid
      })
    }

    that.getJifen()
    
  },
  myOrderTap : function(e){
    var order_status = e.currentTarget.dataset.orderstatus
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '../orders/myorder?order_status=' + order_status,
      })
    }
  },
  myGroupOrderTap: function (e) {
    var order_status = e.currentTarget.dataset.orderstatus
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '../group_orders/myorder?order_status=' + order_status,
      })
    }
  },
  myCyOrderTap: function (e) {
    var order_type = e.currentTarget.dataset.ordertype
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '../cy_orders/myorder?order_type=' + order_type,
      })
    }
  },
  myAddressTap: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '../address/address?from=mine',
      })
    }  
  },  
  getService: function() {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '../service/service',
      })
    } 
  },
  myAcode : function(){
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '/pages/acode/acode',
      })
    }
  },
  getRecOrders : function() {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '/pages/rec_orders/order',
      })
    }
  },
  getMyJifen: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '/pages/jifen/jifen',
      })
    }
  },
  getMyIncome: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      //获取可提现金额和提现中金额
      wx.request({
        url: app.globalData.requestUrl + '/index/getMyIncome',
        data: {openid : app.globalData.openid},
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          var result = res.data.result
          var ketixian = result.ketixian
          var tixianzhong = result.tixianzhong
          wx.navigateTo({
            url: '/pages/income/income?ketixian=' + ketixian + '&tixianzhong=' + tixianzhong,
          })
        }
      })
    }  
  },
  replyTixian : function(){
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      //获取可提现金额和提现中金额
      wx.request({
        url: app.globalData.requestUrl + '/index/getMyIncome',
        data: { openid: app.globalData.openid },
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          var result = res.data.result
          var ketixian = result.ketixian
          var tixianzhong = result.tixianzhong
          wx.navigateTo({
            url: '/pages/tixian/tixian?ketixian=' + ketixian,
          })
        }
      })
    } 
  },
  //获取积分
  getJifen : function(){
     var that = this
     wx.request({
       url: app.globalData.requestUrl + '/bis/getPersonJifen',
       data: { openid: app.globalData.openid },
       header: {
         'content-type': ''
       },
       method: 'post',
       success: function (res) {
          that.setData({
            jifen : res.data.result
          })
       }
     })
  },
  switchOrderType : function(e){
    var that = this
    var order_type = e.currentTarget.dataset.ordertype
    that.setData({
      order_type: order_type
    })
  }
})
