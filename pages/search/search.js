//search.js
//获取应用实例
var app = getApp()
Page({
    data: {
      imgUrl: app.globalData.imgUrl
    },
    onLoad: function (options) {
      var that = this

      //获取热门搜索词汇
      that.getHotSearchWords()
      that.setData({
        showPro: false,
        showHotSearch: true,
        showEmpty: false,
        value: ''
      })
    },
    //执行搜索
    search : function(e){
        var that = this
        var value = e.detail.value

        if (value == '' || value == 'undefined' || !value){

        }else{
          var postData = {
            param: value,
            bis_id: app.globalData.bis_id
          }

          //执行查询
          wx.request({
            url: app.globalData.requestUrl + '/product/getOrgProInfoBySearch',
            data: postData,
            header: {
              'content-type': ''
            },
            method: 'post',
            success: function (res) {
              if(res.data.statuscode == 1){
                that.setData({
                  pro_info: res.data.result,
                  hasMore: res.data.has_more,
                  page: 1,
                  showPro: true,
                  showHotSearch: false,
                  showEmpty: false,
                  value: value
                })
              }else{
                that.setData({
                  showPro: false,
                  showHotSearch: false,
                  showEmpty: true,
                  value: value
                })
              }            
            }
          })
        }
    },
    //点击热门词汇搜索
    hotSearchTab : function(e){
        var that = this
        var param = e.currentTarget.dataset.param
        var eve = {
          detail: {
            value: param
          }
        }
        that.search(eve)
    },
    //获取详情
    getProDetail: function (event) {
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
        }
      })
      wx.navigateTo({
        url: '/pages/index/pro_detail/pro_detail?pro_id=' + pro_id,
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
      var url = app.globalData.requestUrl + '/product/getOrgProInfoBySearch'
      var postData = {
        param: that.data.value,
        bis_id: app.globalData.bis_id,
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
            var list = that.data.pro_info;
            if (res.data.statuscode == 1) {
              for (var i = 0; i < res.data.result.length; i++) {
                list.push(res.data.result[i]);
              }
              
              that.setData({
                pro_info: list,
                page: page,
                hidden: true,
                hasMore: res.data.has_more
              });
            } else {
              that.setData({
                pro_info: list,
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
    //输入框为空时显示热门词汇
    inputTab : function(e){
        var that = this
        if(e.detail.value == ''){
          that.setData({
            showPro: false,
            showHotSearch: true,
            showEmpty: false
          })
        }
    },
    //获取热门词汇
    getHotSearchWords : function(){
      var that = this
      var bis_id = app.globalData.bis_id
      wx.request({
        url: app.globalData.requestUrl + '/product/getHotSearchWords',
        data: { bis_id: bis_id},
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          that.setData({
            hot_words: res.data.result
          })
        }
      })
    },
    //下拉刷新
    onPullDownRefresh : function(){
      var that = this
      var value = that.data.value
      wx.showNavigationBarLoading()
      if (value == '' || value == 'undefined' || !value) {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      } else {
        var postData = {
          param: value,
          bis_id: app.globalData.bis_id
        }

        //执行查询
        wx.request({
          url: app.globalData.requestUrl + '/product/getOrgProInfoBySearch',
          data: postData,
          header: {
            'content-type': ''
          },
          method: 'post',
          success: function (res) {
            if (res.data.statuscode == 1) {
              that.setData({
                pro_info: res.data.result,
                hasMore: res.data.has_more,
                page: 1,
                showPro: true,
                showHotSearch: false,
                showEmpty: false,
                value: value
              })
            } else {
              that.setData({
                showPro: false,
                showHotSearch: false,
                showEmpty: true,
                value: value
              })
            }
          },
          complete : function(){
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
          }
        })
      }
    }
})    
