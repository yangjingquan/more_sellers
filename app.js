//app.js
App({
  onLaunch: function () {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        if (!res.data || res.data == '') {
          //获取用户信息
          // var loginStatus = true;
          that.getUserInfo()
        } else {
          that.globalData.openid = res.data
          wx.getStorage({
            key: 'userInfo',
            success: function (ress) {
              if (!ress.data || ress.data.length == 0) {
                //获取用户信息
                // var loginStatus = true;
                that.getUserInfo()
              } else {
                that.globalData.userInfo = ress.data
              }
            },
            fail: function (ress) {
              //获取用户信息
              // var loginStatus = true;
              that.getUserInfo()
            }
          })
        }

      },
      fail: function (res) {
        //获取用户信息
        // var loginStatus = true;
        that.getUserInfo()
      }
    })
  },
  getUserInfo: function () {
    wx.navigateTo({
      url: '/pages/first/first',
    })
  },
  getOpenId: function () {
    var that = this
    var userInfo = that.globalData.userInfo
    if (!userInfo) {
      that.getUserInfo()
    }
    var userinfo = {
      avatarUrl: userInfo.avatarUrl,
      city: userInfo.city,
      country: userInfo.country,
      gender: userInfo.gender,
      nickName: userInfo.nickName,
      province: userInfo.province
    }
    var userinfo = {
      avatarUrl: userInfo.avatarUrl,
      city: userInfo.city,
      country: userInfo.country,
      gender: userInfo.gender,
      nickName: userInfo.nickName,
      province: userInfo.province
    }
    //调用登录接口
    wx.login({
      success: function (res) {
        var postdata = {
          appid: that.globalData.appid,
          secret: that.globalData.secret,
          code: res.code,
          bis_id: that.globalData.bis_id,
          avatarUrl: userInfo.avatarUrl,
          city: userInfo.city,
          country: userInfo.country,
          gender: userInfo.gender,
          nickName: userInfo.nickName,
          province: userInfo.province,
          sysType: 2
        }

        wx.request({
          url: that.globalData.requestUrl + '/index/getOpenIdNew',
          data: postdata,
          header: {
            'content-type': ''
          },
          method: 'post',
          success: function (res) {
            that.globalData.openid = res.data.openid
            if (!res.data.openid){
              that.getOpenId()
            }else{
              //将openid存入缓存
              wx.setStorage({
                key: "openid",
                data: res.data.openid
              })
            }
          }
        })
      }
    })
  },

  globalData: {
    userInfo: null,
    bis_id : '9',
    appid: "wx7e8fa0ee9987b8f7",
    secret: "c3afda85c43c5314d7a38cf0a5464c62ee4ec501",
    openid : '',
    rec_id : '',
    //测试
    imgUrl: "http://cp.dxshuju.com/",
    requestUrl: "https://xcx001.dxshuju.com/index",
    acodeUrl: "https://xcx001.dxshuju.com/",
    payUrl: "https://xcx001.dxshuju.com/index/pay/pay",
    payGroupUrl: "https://xcx001.dxshuju.com/index/grouppay/pay"
  }
})