//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    hidden: true,
    scrollTop: 0
  },
  onLoad: function (options) { 
    var that = this

    if (!options.bis_id) {
      var bis_id = app.globalData.bis_id
    } else {
      var bis_id = options.bis_id
      app.globalData.bis_id = options.bis_id
    }

    //获取店铺信息
    that.getBisInfo()

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    
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
      url: app.globalData.requestUrl + '/index/getRecProByGroup',
      data: { bis_id: bis_id },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        that.setData({
          recommend_info: res.data.result,
          hasMore: res.data.has_more,
          page: 1
        })
      }
    }) 
  },
  //获取详情
  getProDetail: function(event){
    var pro_id = event.currentTarget.dataset.proid;
    wx.navigateTo({
      url: '/pages/index_group/pro_detail/pro_detail?pro_id='+pro_id,
    })
  },
  //下拉刷新
  topLoad: function () {
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
      }
    }),
    //推荐商品列表
    wx.request({
      url: app.globalData.requestUrl + '/index/getRecProByGroup',
      data: { bis_id: bis_id },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        that.setData({
          recommend_info: res.data.result,
          hasMore: res.data.has_more,
          page: 1
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
      path: '/pages/index_group/index?bis_id=' + app.globalData.bis_id
    }
  },
  //页面滑动到底部
  onReachBottom: function () {
    var that = this
    that.loadMore()
  },
  //加载更多
  loadMore: function (e) {
    var that = this
    var bis_id = app.globalData.bis_id
    that.setData({
      hidden: false
    });
    var page = that.data.page
    page++
    var url = app.globalData.requestUrl + '/index/getRecProByGroup'
    var postData = {
      bis_id: bis_id,
      page: page
    }
    if (that.data.hasMore == true) {
      that.setData({
        hasMore: false
      })
      wx.request({
        url: url,
        data: postData,
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          var list = that.data.recommend_info;
          if (res.data.statuscode == 1) {
            for (var i = 0; i < res.data.result.length; i++) {
              list.push(res.data.result[i]);
            }
            that.setData({
              recommend_info: list,
              page: page,
              hidden: true,
              hasMore: res.data.has_more
            });
          } else {
            that.setData({
              recommend_info: list,
              hidden: false,
              hasMore: false
            });
          }
        }
      });
    } else {
      that.setData({
        hidden: true
      });
    }
  },
  //获取店铺信息
  getBisInfo: function () {
    var that = this
    wx.request({
      url: app.globalData.requestUrl + '/bis/getBisInfoByBisId',
      data: { bis_id: app.globalData.bis_id },
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
  getCatInfo: function () {
    wx.navigateTo({
      url: '/pages/group_self_category/category',
    })
  },
  //跳转搜索页面
  searchTab : function () {
    wx.navigateTo({
      url: '/pages/search_group/search',
    })
  },
  //下拉刷新
  onPullDownRefresh : function(e){
    var that = this
    wx.request({
      url: app.globalData.requestUrl + '/index/getRecProByGroup',
      data: { bis_id: app.globalData.bis_id },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        that.setData({
          recommend_info: res.data.result,
          hasMore: res.data.has_more,
          page: 1
        })
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  }
})