//search.js
//获取应用实例
var app = getApp()
Page({
    data: {
      imgUrl: app.globalData.imgUrl,
      is_mall : 1
    },
    onShow: function (options) {
      var that = this
      //获取店铺列表
      that.getBisList(0)
      //获取分类信息
      that.getCatInfo()
    },
    //获取店铺列表
    getBisList: function (cat_id){
      var that = this
      wx.request({
        url: app.globalData.requestUrl + '/bis/getBisList',
        data: { cat_id: cat_id},
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          that.setData({
            bis_info: res.data.result,
            hasMore: res.data.has_more,
            page : 1,
            navBar: cat_id,
            cat_id:cat_id
          });
        }
      })
    },
    //上拉加载更多
    onReachBottom : function(){
      var that = this
      that.setData({
        hidden: false
      });
      var page = that.data.page
      page++
      var url = app.globalData.requestUrl + '/bis/getBisList'
      var postData = {
        cat_id: that.data.cat_id,
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
      var postData = {
        cat_id: that.data.cat_id
      }

      //执行查询
      wx.request({
        url: app.globalData.requestUrl + '/bis/getBisList',
        data: postData,
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
    },
    //获取详情
    proTap: function (event) {
      var pro_id = event.currentTarget.dataset.proid
      //获取该商品bis_id
      wx.request({
        url: app.globalData.requestUrl + '/bis/getBisIDByProId',
        data: { pro_id: pro_id },
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          var bis_id = res.data.bis_id
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
              if (is_pintuan == 1) {
                wx.navigateTo({
                  url: '/pages/index_group/pro_detail/pro_detail?pro_id=' + pro_id,
                })
              } else {
                wx.navigateTo({
                  url: '/pages/index/pro_detail/pro_detail?pro_id=' + pro_id,
                })
              }
            }
          })
        }
      })
    },
    //获取分类信息
    getCatInfo : function(){
      var that = this
      wx.request({
        url: app.globalData.requestUrl + '/bis/getFirstCatInfo',
        data: {},
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          that.setData({
            cat_info: res.data.result
          })
        }
      })
    },
    //通过分类获取商家列表
    getBisListByCat : function(e){
      var that = this
      var cat_id = e.currentTarget.dataset.catid
      that.getBisList(cat_id)
    }
})    
