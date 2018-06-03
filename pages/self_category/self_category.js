//category.js
//获取应用实例
var app = getApp()
Page({
    data: {
      navLeftItems: [],
      navRightItems: [],
      curIndex: 0,
      imgUrl: app.globalData.imgUrl,
      hidden : true,
      pos_id : 0,
      scrollTop : 0
    },
    onLoad: function (options) {
      var that = this
      var bis_id = app.globalData.bis_id

      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            scrollHeight: res.windowHeight
          });
        }
      });
      //获取一级分类信息
      wx.request({
        url: app.globalData.requestUrl + '/category/getFirstCatInfo',
        data: { bis_id: bis_id },
        header: {
          'content-type': ''
        },
        success: function (res) {
          //获取初始二级分类信息
          wx.request({
            url: app.globalData.requestUrl + '/category/getSecondCarInfoById',
            data: { cat_id: res.data.result[0]['cat_id'] },
            header: {
              'content-type': ''
            },
            method: 'post',
            success: function (result) {
              if (result.data.statuscode == 1) {
                that.setData({
                  cat1_info: res.data.result,
                  curNav: res.data.result[0]['cat_id'],
                  cat2_info: result.data.result,
                  cat1_id: res.data.result[0]['cat_id'],
                  cat2_id: 0
                })
              } else {
                that.setData({
                  cat1_info: res.data.result,
                  curNav: res.data.result[0]['cat_id'],
                  cat2_info: [],
                  cat1_id: res.data.result[0]['cat_id'],
                  cat2_id: 0
                })
              }
            }
          }),
            //获取商品信息
            wx.request({
              url: app.globalData.requestUrl + '/category/getProInfoByFirstId',
              data: { cat_id: res.data.result[0]['cat_id'] },
              header: {
                'content-type': ''
              },
              method: 'post',
              success: function (res) {
                if (res.data.statuscode == 1) {
                  that.setData({
                    pro_info: res.data.result,
                    page: 1,
                    hasMore: res.data.has_more,
                    pos_id: 0,
                    scrollTop: 0
                  })
                } else {
                  that.setData({
                    pro_info: [],
                    page: 1,
                    hasMore: false,
                    pos_id: 0,
                    scrollTop: 0
                  })
                }
              }
            })
        }
      })
    },

    //点击左边栏一级分类  
    switchRightTab: function (e) {
        var that = this
        // 获取item项的id，和数组的下标值  
        var catid = e.target.dataset.catid
        that.setData({
          cat1_id: catid
        })
        var postdata = {
            cat_id: catid
        }
        
        //获取二级分类信息
        wx.request({
          url: app.globalData.requestUrl + '/category/getSecondCarInfoById',
          data: { cat_id: catid },
          header: {
            'content-type': ''
          },
          method: 'post',
          success: function (res) {
            if (res.data.statuscode == 1) {
              that.setData({
                cat2_info: res.data.result,
                curNav: catid,
                cat2_id: 0
              })
            } else {
              that.setData({
                cat2_info: [],
                curNav: catid,
                cat2_id: 0
              })
            }
          }
        }),
        
        //获取商品信息
        wx.request({
          url: app.globalData.requestUrl + '/category/getProInfoByFirstId',
          data: postdata,
          header: {
            'content-type': ''
          },
          method: 'post',
          success: function (res) {
            if (res.data.statuscode == 1) {
              that.setData({
                pro_info: res.data.result,
                page: 1,
                hasMore: res.data.has_more,
                pos_id: 0,
                scrollTop: 0
              })
            } else {
              that.setData({
                pro_info: [],
                page: 1,
                hasMore: false,
                pos_id: 0,
                scrollTop: 0
              })
            }
          }
        })
    },
    getProDetail: function (event) {
      var pro_id = event.currentTarget.dataset.proid;
      wx.navigateTo({
        url: '../index/pro_detail/pro_detail?pro_id=' + pro_id,
      })
    },
    //通过二级分类id获取商品信息
    getProBySecondId: function (e) {
      var that = this
      var cat1_id = e.target.dataset.catid
      var cat2_id = e.target.dataset.secondid
      if (cat2_id == 0){
        var postdata = {
          cat_id: cat1_id
        }
      }else{
        var postdata = {
          cat2_id: cat2_id
        }
      }
      
      wx.request({
        url: app.globalData.requestUrl + '/category/getProInfoBySecondId',
        data: postdata,
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          if (res.data.statuscode == 1) {
            that.setData({
              pro_info: res.data.result,
              curNav : cat1_id,
              cat2_id : cat2_id,
              page: 1,
              hasMore: res.data.has_more,
              pos_id: 0,
              scrollTop: 0
            })
          } else {
            that.setData({
              pro_info: [],
              cat2_id: cat2_id,
              page: 1,
              hasMore: false,
              pos_id: 0,
              scrollTop: 0
            })
          }
        }
      })
    },
    //页面滑动到底部
    bindDownLoad:function() {
      var that = this;
      that.loadMore()
      
    },
    scroll:function(event) {
      //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
      this.setData({
        crollTop : event.detail.scrollTop
      });
    },
    //加载更多
    loadMore : function(e){
      var that = this
      that.setData({
        hidden: false
      });
      var cat1_id = that.data.cat1_id
      var cat2_id = that.data.cat2_id
      var page = that.data.page
      page ++
      if (cat2_id == 0){
        var url = app.globalData.requestUrl + '/category/getProInfoByFirstId'
        var postData = {
          cat_id: cat1_id,
          page: page
        }
      }else{
        var url = app.globalData.requestUrl + '/category/getProInfoBySecondId'
        var postData = {
          cat_id: cat1_id,
          cat2_id: cat2_id,
          page: page
        }
      }
      
      if(that.data.hasMore == true) {
        that.setData({
          hasMore : false
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
      }else{
        that.setData({
          hidden: true
        });
      } 
    }
})    
