//search.js
//获取应用实例
var app = getApp()
Page({
    data: {
    },
    onShow: function (options) {
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
            url: app.globalData.requestUrl + '/product/getProInfoBySearch',
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
        url: '/pages/index_group/pro_detail/pro_detail?pro_id=' + pro_id,
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
      var url = app.globalData.requestUrl + '/product/getProInfoBySearch'
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
    }
})    
