// order.js
var app = getApp()
Page({
  data: {
    listData: [
      { "a1": "01", "b1": "02", "b2": "03", "c1": "04", "c2": "05", "c3": "06", "c4": "07" },
      { "a1": "01", "b1": "02", "b2": "03", "c1": "04", "c2": "05", "c3": "06", "c4": "07" }
    ]
  },
  onLoad : function(option){
    var that = this
    var mem_id = option.mem_id
    wx.request({
      url: app.globalData.requestUrl + '/bis/getRecOrders',
      data: { mem_id: mem_id },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        that.setData({
          rec_info: res.data.result,
          count: res.data.count ? res.data.count : 0,
          rec_amount: res.data.rec_amount ? res.data.rec_amount : 0.00,
          page: 1,
          hasMore: res.data.has_more,
          mem_id: mem_id
        })
      }
    })
    
    //获取进团队信息
    that.getTeamInfo(mem_id)
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    var mem_id = that.data.mem_id
    wx.showNavigationBarLoading()
    wx.request({
      url: app.globalData.requestUrl + '/bis/getRecOrders',
      data: { mem_id: mem_id },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        that.setData({
          rec_info: res.data.result,
          count: res.data.count ? res.data.count : 0,
          rec_amount: res.data.rec_amount,
          page: 1,
          hasMore: res.data.has_more,
          mem_id: mem_id
        })
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  onReachBottom: function () {
    var that = this
    that.setData({
      hidden: false
    });
    var page = that.data.page
    var mem_id = that.data.mem_id
    page++
    var url = app.globalData.requestUrl + '/bis/getRecOrders'
    var postData = {
      mem_id: mem_id,
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
          var list = that.data.rec_info;
          if (res.data.statuscode == 1) {
            for (var i = 0; i < res.data.result.length; i++) {
              list.push(res.data.result[i]);
            }
            that.setData({
              rec_info: list,
              count: res.data.count ? res.data.count : 0,
              rec_amount: res.data.rec_amount,
              page: page,
              hidden: true,
              hasMore: res.data.has_more
            });
          } else {
            that.setData({
              rec_info: list,
              count: res.data.count ? res.data.count : 0,
              rec_amount: res.data.rec_amount,
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
  getTeamInfo: function (mem_id){
    var that = this
    wx.request({
      url: app.globalData.requestUrl + '/team/getTeamInfo',
      data: { mem_id: mem_id},
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        that.setData({
          res1: res.data.result1,
          res2: res.data.result2
        })
      }
    })
  }
})