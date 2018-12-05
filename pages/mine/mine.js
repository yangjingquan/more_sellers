//mine.js
var app = getApp()
var checkLogin = require('../../utils/util.js'); 
//获取应用实例
Page({
  data: {
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function () {
    var that = this
    console.log(app.globalData.userInfo)
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    }else{
      that.setData({
        userInfo:app.globalData.userInfo,
        rec_id: app.globalData.rec_id,
        openid: app.globalData.openid
      })
    }

    that.getJifen()
    
  },
  myOrderTap : function(){
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      wx.navigateTo({
        url: '../orders/myorder',
      })
    }
  },
  myGroupOrderTap: function () {
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      wx.navigateTo({
        url: '../group_orders/myorder',
      })
    }
  },
  myAddressTap: function () {
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      wx.navigateTo({
        url: '../address/address?from=mine',
      })
    }  
  },  
  getService: function() {
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      wx.navigateTo({
        url: '../service/service',
      })
    } 
  },
  myAcode : function(){
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      wx.navigateTo({
        url: '/pages/acode/acode',
      })
    }
  },
  getRecOrders : function() {
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      wx.navigateTo({
        url: '/pages/rec_orders/order',
      })
    }
  },
  getMyRecInfo: function () {
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      wx.navigateTo({
        url: '/pages/myteam/myteam',
      })
    }
  },
  getMyJifen: function () {
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      wx.navigateTo({
        url: '/pages/jifen/jifen',
      })
    }
  },
  getMyIncome: function () {
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
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
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
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
  //清除缓存
  clearStorage : function(){
    app.getUserInfo()
    if (app.globalData.openid && app.globalData.openid != ''){
      wx.showToast({
        title: '清除缓存成功！',
        icon: 'success',
        duration: 2000
      })
    }
  }
})
