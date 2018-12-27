var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sq_xs: true, //根据用户是否授权改变状态
    sq_zhengti: true, //用户授权成功整个哲罩层消失
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
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
            url: '../m_index/index', //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
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
      //用户按了允许授权按钮
      wx: wx.setStorage({
        key: 'userInfo',
        data: e.detail.userInfo,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      app.globalData.userInfo = e.detail.userInfo
        wx.switchTab({
          url: '../home/home', //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
        })
      

    } else {
      //用户按了拒绝按钮
      this.setData({
        'sq_xs': true
      })
    }
  }
})