//search.js
//获取应用实例
var app = getApp()
Page({
    data: {
      mall_type : 1, //1-商城店铺 2-餐饮店铺
      selected: true,
      selected1: false
    },
    onShow: function (options) {
      var that = this
      //获取店铺列表
      that.getBisList()
    },
    //获取商城店铺列表
    getBisList: function (){
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
                mall_type : 1,
                bs: 0
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
    //切换店铺
    changeMallType : function(e){
      var that = this
      var type = e.currentTarget.dataset.type
      if(type == 1){
        that.getBisList()
        that.setData({
          mall_type: type,
          selected1: false,
          selected: true
        });
      }else{
        that.getCatBisList()
        that.setData({
          mall_type: type,
          selected1: true,
          selected: false
        });
      }
      
    },
    //上拉加载更多
    onReachBottom : function(){
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
    onPullDownRefresh : function(){
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
    bisTap : function (e) {
      var that = this
      var bis_id = e.currentTarget.dataset.bisid
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
          if (is_pintuan == 1){
            wx.navigateTo({
              url: '/pages/index_group/index',
            })
          }else{
            wx.navigateTo({
              url: '/pages/index/index',
            })
          }
        }
      })
    }
})    
