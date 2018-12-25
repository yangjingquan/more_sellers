//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    hotList: [
      {
        pic: "/pics/cat/001.png",
        title: "招商入驻",
        cat_id: "../reg_bis/reg_bis"
      },
      {
        pic: "/pics/cat/002.png",
        title: "商城推荐",
        cat_id: "../rec_products/rec_products"
      },
      {
        pic: "/pics/cat/003.png",
        title: "拼团推荐",
        cat_id: "../group_rec_products/group_rec_products"
      },
      {
        pic: "/pics/cat/005.png",
        title: "积分商城",
        cat_id: "../jf_products/jf_products"
      }
    ],
    hotList1: [
      {
        pic: "/pics/cat/near_cat.png",
        title: "附近餐饮",
        cat_id: "../bis_list/bis_list?mall_type=2"
      },
      {
        pic: "/pics/cat/near_mall.png",
        title: "附近商家",
        cat_id: "../bis_list/bis_list?mall_type=1"
      },
      {
        pic: "/pics/cat/008.png",
        title: "我的积分",
        cat_id: "../jifen/jifen"
      },
      {
        pic: "/pics/cat/004.png",
        title: "我的身份",
        cat_id: "../acode/acode"
      }
    ],
  },
  onLoad: function (options) {
    var that = this
    var bis_id = app.globalData.bis_id

    that.getOpenid(options)
    //获取附近店铺
    that.getNearMallInfo()
    
    //首页banner
    wx.request({
      url: app.globalData.requestUrl + '/bis/getBannersInfo',
      data: {},
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          recommend_pics: res.data.result
        })
      }
    }),

    //滚动公告列表
    wx.request({
      url: app.globalData.requestUrl + '/announcement/getHomePreManyAnnouncement',
      data: {},
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          gonggao: res.data.result
        })
      }
    }),
    //广告位图片获取
    that.getAdsInfo()
    // 推荐推荐商家列表
    that.getRecommendMallList()
    //获取推荐餐饮店铺列表
    that.getRecommendCatMallList()
    //推荐商品列表
    wx.request({
      url: app.globalData.extraRequestUrl + '/index/getRecProInfo',
      data: {},
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          recommend_info: res.data.result
        })
      }
    })
  },
  //判断是否被授权
  onReady: function () {
     wx: wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.reLaunch({
            url: '/pages/first/first',
          })
        }

      }
    })
    
  },
  //获取推荐商家
  getRecommendMallList : function(){
    var that = this
    wx.request({
      url: app.globalData.extraRequestUrl + '/index/getRecommendMallList',
      data: {},
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          tjsj_info: res.data.result
        })
      }
    })
  },
  //获取推荐餐饮店铺
  getRecommendCatMallList: function () {
    var that = this
    wx.request({
      url: app.globalData.extraRequestUrl + '/index/getRecommendCatList',
      data: {},
      header: {
        'content-type': ''
      },
      success: function (res) {
        console.log(res.data.result)
        that.setData({
          cat_mall_info: res.data.result
        })
      }
    })
  },
  //广告位信息获取
  getAdsInfo : function(){
    var that = this
    wx.request({
      url: app.globalData.extraRequestUrl + '/index/getAdsInfo',
      data: {},
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          tupian_info: res.data.result
        })
      }
    })
  },
  //点击广告位跳转
  ads_redirect : function(e){
    var jumpurl = e.currentTarget.dataset.jumpurl
    wx.navigateTo({
      url: jumpurl,
    })
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
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    var bis_id = app.globalData.bis_id
    wx.showNavigationBarLoading()
    wx.request({
      url: app.globalData.requestUrl + '/bis/getBannersInfo',
      data: {},
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          recommend_pics: res.data.results
        })
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    }),
      //推荐商品列表
      wx.request({
        url: app.globalData.requestUrl + '/index/getRecProInfoMut',
        data: {},
        header: {
          'content-type': ''
        },
        success: function (res) {
          that.setData({
            recommend_info: res.data.result
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
      title: '多用户小程序，开启全新商业模式时代！',
      path: '/pages/home/home'
    }
  },
  //获取openid
  getOpenid: function (options) {
    var that = this
    //获取openid
    wx.login({
      success: function (res) {
        var postdata = {
          appid: app.globalData.appid,
          secret: app.globalData.secret,
          code: res.code
        }

        wx.request({
          url: app.globalData.requestUrl + '/index/getOpenIdOnly',
          data: postdata,
          header: {
            'content-type': ''
          },
          method: 'post',
          success: function (res) {
            var openid = res.data.openid
            that.checkRecStatus(options, openid)
          }
        })
      }
    })
  },
  //判断是否被推荐
  checkRecStatus: function (options, openid) {
    var that = this

    //判断是否获取到推荐人参数
    if (!options.id || options.id == 'undefined') {
      var postdata = {
        openid: openid
      }
    } else {
      var userid = options.id
      var postdata = {
        rec_id: userid,
        openid: openid
      }
    }
    //检验本用户是否被别人推荐，如果已被推荐，不操作；无被推荐，把推荐用户id更新到会员表中
    wx.request({
      url: app.globalData.requestUrl + '/members/checkRecStatusMulti',
      data: postdata,
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        app.globalData.rec_id = res.data.result
      }
    })
  },
  redirectTo: function (e) {
    var url = e.currentTarget.dataset.catid
    wx.navigateTo({
      url: url
    });
  },
  
  //获取详情
  ToGongGao: function (event) {
    var pro_id = event.currentTarget.dataset.proid
    wx.navigateTo({
      url: '/pages/gonggao_detail/gonggao_detail?pro_id=' + pro_id,
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
        if(type == 1){
          if (is_pintuan == 1) {
            wx.navigateTo({
              url: '/pages/index_group/index?bis_id=' + bis_id,
            })
          } else {
            wx.navigateTo({
              url: '/pages/index/index?bis_id=' + bis_id,
            })
          }
        }else{
          wx.navigateTo({
            url: '/pages/cy_index/index?bis_id=' + bis_id,
          })
        }
        
      }
    })
  },
  //获取附近店铺
  getNearMallInfo : function(){
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        var latitude = res.latitude.toFixed(6)
        var longitude = res.longitude.toFixed(6)
        var location = longitude + ',' + latitude
        wx.request({
          url: app.globalData.extraRequestUrl + '/index/getNearMallInfo',
          data: { location: location },
          header: {
            'content-type': ''
          },
          method: 'post',
          success: function (res) {
            console.log(res.data.result)
            that.setData({
              bis_info: res.data.result
            });
          }
        })

      }
    })
  }
})