//mine.js
//获取应用实例
var app = getApp()
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
  myOrderTap : function(){
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '../orders/myorder',
      })
    }
  },
  myGroupOrderTap: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '../group_orders/myorder',
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
  getMyTeamInfo: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.request({
        url: app.globalData.requestUrl + '/team/checkUser',
        data: { openid: app.globalData.openid },
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          var res = res.data.result
          if(res == 0){
            wx.showModal({
              title: '对不起，您还未拥有团队，请联系客服!',
              content: '',
              confirmText: '取消',
              showCancel: false
            })
          }else{
            wx.navigateTo({
              url: '/pages/recommend/recommend',
            })
          }
        }
      })
    }
  },
  getMyRecInfo: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '/pages/myteam/myteam',
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
  //清除缓存
  clearStorage : function(){
    var loginStatus = true;
    app.getUserInfo(loginStatus)
    if (app.globalData.openid && app.globalData.openid != ''){
      wx.showToast({
        title: '清除缓存成功！',
        icon: 'success',
        duration: 2000
      })
    }
  }
})
