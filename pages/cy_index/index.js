//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    imgUrl: app.globalData.imgUrl
  },
  onLoad: function (options) { 
    var that = this   
    var bis_id = app.globalData.bis_id
    
    //首页信息
    wx.request({
      url: app.globalData.requestUrl + '/index/getBisInfo',
      data: {bis_id : bis_id},
      header: {
        'content-type': ''
      },
      method : 'post',
      success: function (res) {
        that.setData({
          bis_res: res.data.bis_res,
          img_res: res.data.img_res,
          act_res: res.data.act_res,
          banner_res: res.data.banner_res,
          act_count: res.data.act_res.length
        })
        app.globalData.bis_name = res.data.bis_res.bis_name
      }
    })
  },

  getProDetail: function(event){
    var pro_id = event.currentTarget.dataset.proid;
    wx.navigateTo({
      url: '/pages/index/pro_detail/pro_detail?pro_id='+pro_id,
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    var bis_id = app.globalData.bis_id
    wx.showNavigationBarLoading()
    wx.request({
      url: app.globalData.requestUrl + '/index/getBisInfo',
      data: { bis_id: bis_id },
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          recommend_pics: res.data.result
        })
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '轻商小程序系统，更快！更流畅！',
      path: '/pages/index/index'
    }
  },
  //跳转预定页面
  reserve : function(){
    wx.navigateTo({
      url: '/pages/reserve/reserve',
    })
  },
  //跳转点餐页面
  diancan: function () {
    wx.navigateTo({
      url: '/pages/diancan/diancan',
    })
  },
  //跳转点餐页面
  waimai: function () {
    wx.navigateTo({
      url: '/pages/waimai/waimai',
    })
  },
  //跳转收银页面
  shouyin: function () {
    wx.navigateTo({
      url: '/pages/cash_collect/cash_collect',
    })
  },
  //拨打商家电话
  callTel : function(e){
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  }

})