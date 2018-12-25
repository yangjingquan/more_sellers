var app = getApp()
Page({
  data: {
    
  },

  onLoad: function (options) {
      var that = this
      wx.request({
        url: app.globalData.requestUrl + '/bis/getMyTeamList',
        data: { openid: app.globalData.openid },
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          var result = res.data.result
          that.setData({
              team_list: result,
              page: 1,
              hasMore: res.data.has_more,
              total_count: res.data.total_count
          })
        }
      })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: app.globalData.requestUrl + '/bis/getMyTeamList',
      data: { openid: app.globalData.openid},
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        var result = res.data.result
        that.setData({
          team_list: result,
          page: 1,
          hasMore: res.data.has_more,
          total_count: res.data.total_count
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
    page++
    var url = app.globalData.requestUrl + '/bis/getMyTeamList'
    var postData = {
      openid: app.globalData.openid,
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
          var list = that.data.team_list;
          if (res.data.statuscode == 1) {
            for (var i = 0; i < res.data.result.length; i++) {
              list.push(res.data.result[i]);
            }
            that.setData({
              team_list: list,
              page: page,
              hidden: true,
              hasMore: res.data.has_more,
              total_count: res.data.total_count
            });
          } else {
            that.setData({
              team_list: list,
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
  getRecOrders : function(e){
      var that = this
      var mem_id = e.currentTarget.dataset.memid
      wx.navigateTo({
        url: '/pages/team_rec_orders/order?mem_id=' + mem_id
      })
  }
})