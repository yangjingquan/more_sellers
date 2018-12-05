var app = getApp()
Page({
  data: {
    sq_xs: true, 
    sq_zhengti: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 查看是否授权
    wx: wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.switchTab({
            url: '/pages/home/home',
          })
        }

      }
    })

  },
  aa: function () {
    this.setData({
      'sq_xs': false
    })
  },
  bindGetUserInfo: function (e) {
    var that = this
    if (e.detail.userInfo) {
      wx: wx.setStorage({
        key: 'userInfo',
        data: e.detail.userInfo,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      app.globalData.userInfo = e.detail.userInfo
      wx.switchTab({
        url: '/pages/home/home', //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
      })

    } else {
      //用户按了拒绝按钮
      console.log('没授权')
      this.setData({
        'sq_xs': true
      })
    }
  }
})