//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
  },
  onLoad: function (options) { 
    var that = this
    if (!options.bis_id){
      var bis_id = app.globalData.bis_id 
    }else{
      var bis_id = options.bis_id
      app.globalData.bis_id = options.bis_id
    }

    //获取店铺信息
    that.getBisInfo()
    //首页banner
    wx.request({
      url: app.globalData.requestUrl + '/index/getBannersInfo',
      data: {bis_id : bis_id},
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          recommend_pics: res.data.result
        })
      }
    }),
    //推荐商品列表
    wx.request({
      url: app.globalData.requestUrl + '/index/getRecommendProInfo',
      data: { bis_id: bis_id },
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          recommend_info: res.data.result
        })
      }
    }),
    //新品列表
    wx.request({
      url: app.globalData.requestUrl + '/index/getNewProInfo',
      data: { bis_id: bis_id },
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          new_pro_info: res.data.result
        })
      }
    })
  },
  //获取详情
  getProDetail: function(event){
    var pro_id = event.currentTarget.dataset.proid;
    wx.navigateTo({
      url: '/pages/index/pro_detail/pro_detail?pro_id=' + pro_id,
    })   
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    var bis_id = app.globalData.bis_id
    wx.showNavigationBarLoading()
    wx.request({
      url: app.globalData.requestUrl + '/index/getBannersInfo',
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
    }),
    //推荐商品列表
    wx.request({
      url: app.globalData.requestUrl + '/index/getRecommendProInfo',
      data: { bis_id: bis_id },
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          recommend_info: res.data.result
        })
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    }),
    //新品列表
    wx.request({
      url: app.globalData.requestUrl + '/index/getNewProInfo',
      data: { bis_id: bis_id },
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          new_pro_info: res.data.result
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
      path: '/pages/index/index?bis_id='+app.globalData.bis_id
    }
  },
  //跳转搜索页面
  searchTab : function(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  //获取店铺信息
  getBisInfo : function(){
    var that = this
    wx.request({
      url: app.globalData.requestUrl + '/bis/getBisInfoByBisId',
      data: {bis_id : app.globalData.bis_id},
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        that.setData({
          bis_info: res.data.result
        })
      }
    })
  },
  //获取分类
  getCatInfo : function(){
    wx.navigateTo({
      url: '/pages/self_category/self_category',
    })
  }
})