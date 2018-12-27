// pages/bis_list/bis_list.js
var app = getApp()
Page({
  data: {
  },
  onLoad: function (options) {
    var that = this
    if (!options.mall_type) {
      //获取商城店铺列表
      that.getBisList()
    } else {
      var mall_type = options.mall_type
      console.log(mall_type)
      if (mall_type == 1) {
        //获取商城店铺列表
        that.getBisList()
      } else {
        //获取餐饮店铺列表
        that.getCatBisList()
      }
    }

  },
  //获取商城店铺列表
  getBisList: function () {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        var latitude = res.latitude.toFixed(6)
        var longitude = res.longitude.toFixed(6)
        var location = longitude + ',' + latitude
        console.log(location)
        var postdata = {
          location: location
        }
        wx.request({
          url: app.globalData.extraRequestUrl + '/index/getBisList',
          data: postdata,
          header: {
            'content-type': ''
          },
          method: 'post',
          success: function (res) {
            console.log(res.data)
            that.setData({
              bis_info: res.data.result,
              hasMore: res.data.has_more,
              page: 1,
              mall_type: 1
            });
          }
        })
      }
    })
  },
  //获取餐饮店铺列表
  getCatBisList: function () {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        var latitude = res.latitude.toFixed(6)
        var longitude = res.longitude.toFixed(6)
        var location = longitude + ',' + latitude
        var postdata = {
          location: location
        }
        wx.request({
          url: app.globalData.extraRequestUrl + '/index/getCatBisList',
          data: postdata,
          header: {
            'content-type': ''
          },
          method: 'post',
          success: function (res) {
            console.log(res.data)
            that.setData({
              cat_bis_info: res.data.result,
              hasMore: res.data.has_more,
              page: 1,
              mall_type: 2
            });
          }
        })
      }
    })
  },
  //上拉加载更多
  onReachBottom: function () {
    var that = this
    mall_type = that.data.mall_type
    that.setData({
      hidden: false
    });
    var page = that.data.page
    page++
    var url = app.globalData.requestUrl + '/bis/getBisList'
    var postData = {
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
          var list = that.data.bis_info;
          if (res.data.statuscode == 1) {
            for (var i = 0; i < res.data.result.length; i++) {
              list.push(res.data.result[i]);
            }
            that.setData({
              bis_info: list,
              page: page,
              hidden: true,
              hasMore: res.data.has_more
            });
          } else {
            that.setData({
              bis_info: list,
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
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading()

    //执行查询
    wx.request({
      url: app.globalData.extraRequestUrl + '/index/getBisList',
      data: {},
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        that.setData({
          bis_info: res.data.result,
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
  //跳转店铺页面
  bisTap: function (e) {
    var that = this
    var bis_id = e.currentTarget.dataset.bisid
    var type = e.currentTarget.dataset.type
    app.globalData.bis_id = bis_id
    //判断店铺类型并跳转页面
    wx.request({
      url: app.globalData.requestUrl + '/bis/getBisTypeByBisId',
      data: { bis_id: bis_id },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        var is_pintuan = res.data.is_pintuan
        if (type == 1) {
          if (is_pintuan == 1) {
            wx.navigateTo({
              url: '/pages/index_group/index?bis_id=' + bis_id,
            })
          } else {
            wx.navigateTo({
              url: '/pages/index/index?bis_id=' + bis_id,
            })
          }
        } else {
          wx.navigateTo({
            url: '/pages/cy_index/index?bis_id=' + bis_id,
          })
        }
        
      }
    })
  }
}) 