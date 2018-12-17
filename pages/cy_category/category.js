//category.js
//获取应用实例
var app = getApp()
Page({
    data: {
      navLeftItems: [],
      navRightItems: [],
      curIndex: 0,
      imgUrl: app.globalData.imgUrl
    },
    onLoad: function () {
      var that = this
      var bis_id = app.globalData.bis_id
      //获取一级分类信息
      wx.request({
        url: app.globalData.requestUrl + '/category/getFirstCatInfo',
        data: { bis_id: bis_id},
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
                  cat2_info: result.data.result
                })
              } else {
                that.setData({
                  cat1_info: res.data.result,
                  curNav: res.data.result[0]['cat_id'],
                  cat2_info: []
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
                  pricestatus : 'up',
                  soldcount : 'up'
                })
              } else {
                that.setData({
                  pro_info: []
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
        var pricestatus = e.target.dataset.pricestatus
        var soldcount = e.target.dataset.soldcount
        var postdata = {
            cat_id: catid
        }
        var pricestate = '';
        var soldnum = '';
        if (pricestatus && pricestatus != ''){
          var postdata = {
            cat_id: catid,
            pricestatus: pricestatus
          }
        }
        if (soldcount && soldcount != '') {
          var postdata = {
            cat_id: catid,
            soldcount: soldcount
          }
        }
        
        if (pricestatus == 'up') {
          pricestate = 'down'
        } else {
          pricestate = 'up'
        }
        if (soldcount == 'up') {
          soldnum = 'down'
        } else {
          soldnum = 'up'
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
              })
            } else {
              that.setData({
                cat2_info: [],
                curNav: catid,
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
                pricestatus: pricestate,
                soldcount: soldnum
              })
            } else {
              that.setData({
                pro_info: []
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
              cat2_id : cat2_id
            })
          } else {
            that.setData({
              pro_info: [],
              cat2_id: cat2_id
            })
          }
        }
      })
    }
})    
