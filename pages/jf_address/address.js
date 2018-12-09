var app = getApp()
Page({

  data: {
    openid : ''
  },
  onLoad: function (options) {
    var that = this
    var from = options.from
    var cart_id = options.cart_id
    that.setData({
      from: from,
      cart_id: cart_id
    })
    that.getAddressInfo(app.globalData.openid)
  },
  //添加地址
  addNewAddress : function(){
      var that = this
      var from = that.data.from
      wx.navigateTo({
        url: '/pages/address/new_address/new_address?from='+from
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
        url: '/pages/address/edit_address/edit_address?aid=' + aid + '&from='+that.data.from,
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
                url: app.globalData.requestUrl + '/shoppingcart/getJfProSelectedInfo',
                data: {cart_id: that.data.cart_id, openid: app.globalData.openid, bis_id: app.globalData.bis_id },
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
                      showAddress: true
                    })
                  }
                  var pro_amount = cartResult.data.result.pro_amount
                  //获取该店铺的运费模式
                  wx.request({
                    url: app.globalData.requestUrl + '/index/getTransportType',
                    data: { bis_id: bis_id },
                    method: 'post',
                    header: {
                      'content-type': ''
                    },
                    success: function (result) {
                      var transportType = result.data.result.transport_type
                      if (transportType == 1) {
                        if (cartResult.data.result.transportInfo.length == 0){
                          wx.showToast({
                            title: '店家未设置快递方式',
                            image: '/pics/icons/tanhao.png',
                            duration: 1500,
                            mask: true,
                            success: function () {
                              prevPage.setData({
                                transportType: transportType,
                                showFreightView: false,
                                total_amount: '0.00',
                                transport_fee: '0.00',
                                selected_transport_type: '',
                                buttonUsable: true
                              })
                            }
                          })
                        }else{
                          var first_heavy = cartResult.data.result.transportInfo[0]['first_heavy']
                          var continue_heavy = cartResult.data.result.transportInfo[0]['continue_heavy']
                          var continue_stage = cartResult.data.result.transportInfo[0]['continue_stage']
                          var total_weight = cartResult.data.result.total_weight
                          var transport_fee = (parseFloat(first_heavy) + parseFloat(continue_heavy * (Math.ceil((total_weight - 1) / continue_stage)))).toFixed(2)
                          var total_amount = (parseFloat(cartResult.data.result.price_amount) + parseFloat(transport_fee)).toFixed(2)
                          prevPage.setData({
                            transportType: transportType,
                            showFreightView: true,
                            total_amount: total_amount,
                            transport_fee: transport_fee,
                            selected_transport_type: cartResult.data.result.transportInfo[0]['mode_id'],
                            buttonUsable: false
                          })
                        }
                        
                      } else {
                        var pro_amount = cartResult.data.result.price_amount
                        var ykj_price = result.data.result.ykj_price
                        var total_amount = parseFloat(parseFloat(pro_amount) + parseFloat(ykj_price)).toFixed(2)
                        if (total_amount < '0.01') {
                          var buttonUsable = true
                        } else {
                          var buttonUsable = false
                        }
                        prevPage.setData({
                          transportType: transportType,
                          showFreightView: false,
                          transport_fee: ykj_price,
                          total_amount: total_amount,
                          selected_transport_type: '',
                          buttonUsable: buttonUsable
                        })
                      }
                    }
                  })
                  prevPage.setData({
                    cart_info: cartResult.data.result,
                    pro_info: cartResult.data.result.pro_info,
                    count: cartResult.data.result.pro_info.count,
                    transport_type: cartResult.data.result.transportType,
                    transport_info: cartResult.data.result.transportInfo,
                    price_amount: cartResult.data.result.price_amount,
                    jifen_amount: cartResult.data.result.jifen_amount,
                    total_weight: cartResult.data.result.total_weight
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