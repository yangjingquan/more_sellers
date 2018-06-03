var app = getApp()
Page({

  data: {
    openid : ''
  },
  onLoad: function (options) {
    var that = this
    var from = options.from
    that.setData({
      from: from
    })
    that.getAddressInfo(app.globalData.openid) 
  },
  //添加地址
  addNewAddress : function(){
      var that = this
      var from = that.data.from
      wx.navigateTo({
        url: 'new_address/new_address?from='+from
      })
  },
  //获取地址信息列表
  getAddressInfo: function (openid){
      var that = this
      wx.request({
        url: app.globalData.requestUrl + '/address/getAddressInfo',
        data: { openid: openid},
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          if (res.data.result.length == 0){
            that.setData({
              show_address : false
            })
          }else{
            that.setData({
              show_address: true,
              address_info: res.data.result
            })
          }
          
        }
      })
  },
  //修改地址
  editAddress : function(e){
      var that = this
      var aid = e.target.dataset.aid
      wx.navigateTo({
        url: 'edit_address/edit_address?aid=' + aid + '&from='+that.data.from,
      })
  },
  //选择地址
  select_address : function(e){
      var that = this
      var bis_id = app.globalData.bis_id
      var selected_id = e.currentTarget.dataset.selectedid
      var from = that.data.from
      if (from == 'order'){
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 2]  //上一个页面
        //更改数据（选择地址）
        wx.request({
          url: app.globalData.requestUrl + '/address/chooseAddress',
          data: { selected_id: selected_id, openid: app.globalData.openid },
          header: {
            'content-type': ''
          },
          method: 'post',
          success: function (res) {
            if (res.data.result == 1) {
              wx.request({
                url: app.globalData.requestUrl + '/shoppingcart/getSelectedCartInfoMulti',
                data: { openid: app.globalData.openid},
                method: 'post',
                header: {
                  'content-type': ''
                },
                success: function (cartResult) {
                  if (cartResult.data.result.address_info.length == 0) {
                    prevPage.setData({
                      showAddress: false
                    })
                  } else {
                    prevPage.setData({
                      showAddress: true,
                      address_info: cartResult.data.result.address_info
                    })
                  }
                
                  prevPage.setData({
                    cart_info: cartResult.data.result.cart_info,
                    pay_amount: cartResult.data.result.total_amount
                  })
                }
              })
            }
          }
        })
        //返回上一个页面
        wx.navigateBack({
          delta: 1
        })
      }else{
        
      }  
  },
  //删除地址
  deleteAddress : function(e){
      var that = this
      var address_id = e.target.dataset.aid
      //执行操作
      wx.request({
        url: app.globalData.requestUrl + '/address/deleteAddress',
        data: { address_id: address_id },
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          if (res.data.statuscode == 1) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000,
              success: function (result) {
                that.getAddressInfo(app.globalData.openid)
              }
            })
          } else {
            wx.showToast({
              title: '删除失败',
              icon: 'fail',
              duration: 2000,
              success: function (result) {
                that.getAddressInfo(app.globalData.openid)
              }
            })
          }
        }
      })
  },
  //下拉事件
  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: app.globalData.requestUrl + '/address/getAddressInfo',
      data: { openid: app.globalData.openid },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        if (res.data.result.length == 0) {
          that.setData({
            show_address: false
          })
        } else {
          that.setData({
            show_address: true,
            address_info: res.data.result
          })
        }
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
})