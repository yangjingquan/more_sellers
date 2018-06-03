var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    transport_type: {},
    index : 0,
    showTransportFeeDetail : false,
  },
  
  onLoad: function (options) {
    var that = this
    var openid = options.openid
    //获取购物车内选中的信息
    that.getSelectedCartInfo(openid)
  },
  //获取选中的购物车信息
  getSelectedCartInfo: function (openid){
      var that = this
      wx.request({
        url: app.globalData.requestUrl + '/shoppingcart/getSelectedCartInfoMulti',
        data: { openid: openid},
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
          if (!res.data.result.address_info){
            that.setData({
              showAddress: false
            })
          }else{
            that.setData({
              showAddress: true,
              address_info: res.data.result.address_info
            })
          }
          that.setData({
            cart_info: res.data.result.cart_info,
            pay_amount: res.data.result.total_amount
          })
        }
      }) 
  },
  //提交订单
  formSubmit : function(e){
    var that = this
    var formId = e.detail.formId
    var cart_info = that.data.cart_info
    var address_info = that.data.address_info

    var address_info_length = address_info.length
    if (address_info_length == 0){
      wx.showToast({
        title: '请设置您的地址!',
        image: '/pics/icons/tanhao.png',
        duration: 1500,
        mask: true
      })
    }else{
      var postdata = {
        mem_id: app.globalData.openid,
        cart_info: cart_info,
        address_info: address_info,
        appid: app.globalData.appid,
        secret: app.globalData.secret
      }

      //生成外部订单
      wx.request({
        url: app.globalData.requestUrl + '/order/makeOrderMulti',
        data: postdata,
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
          if(res.data.statuscode == 1){
            wx.navigateTo({
              url: '/pages/orders/myorder',
            })
          }else{
            wx.showToast({
              title: '提交订单失败!',
              image: '/pics/icons/tanhao.png',
              duration: 1500,
              mask: true
            })
          } 
        }
      })
    } 
  },
  //选择地址
  choose_address : function(){
      wx.navigateTo({
        url: '/pages/address/address?from=order',
      })
  },
  //切换快递类型
  bindTypeChange: function (e) {
    var that = this
    var index = e.detail.value
    var cartIndex = that.data.cIndex
    var cart_info = that.data.cart_info
    var pay_amount = that.data.pay_amount
    var pre_transport_fee = cart_info[cartIndex]['transport_fee']

    cart_info[cartIndex]['selectedIndex'] = index

    var total_weight = cart_info[cartIndex]['total_weight']
    var first_heavy = cart_info[cartIndex]['transport_info'][index]['first_heavy']
    var continue_heavy = cart_info[cartIndex]['transport_info'][index]['continue_heavy']
    var continue_stage = cart_info[cartIndex]['transport_info'][index]['continue_stage']
    var transport_fee = (parseFloat(first_heavy) + parseFloat(continue_heavy * (Math.ceil((total_weight - 1) / continue_stage)))).toFixed(2)
    var total_amount = (parseFloat(transport_fee) + parseFloat(that.data.pro_amount)).toFixed(2)
    var selected_transport_type = cart_info[cartIndex]['transport_info'][index]['mode_id']
    
    cart_info[cartIndex]['transport_fee'] = transport_fee
    cart_info[cartIndex]['total_amount'] = total_amount
    cart_info[cartIndex]['selected_transport_type'] = selected_transport_type
    var cur_pay_amount = parseFloat(parseFloat(pay_amount) - parseFloat(pre_transport_fee) + parseFloat(transport_fee)).toFixed(2)
    
    that.setData({
      index: index,
      cart_info: cart_info,
      pay_amount: cur_pay_amount
    })
  },
  changeType : function(e){
      var that = this
      var cartIndex = e.currentTarget.dataset.cartindex
      that.setData({
        cIndex: cartIndex
      })
  },
  //获取运费
  getTransportFeeDetail: function (e) {
    var that = this
    var getcartindex = e.currentTarget.dataset.cartindex
    var cart_info = that.data.cart_info
    var showTransportFeeDetail = !(cart_info[getcartindex]['showTransportFeeDetail'])
    cart_info[getcartindex]['showTransportFeeDetail'] = showTransportFeeDetail
    that.setData({
      cart_info: cart_info,
      getcartindex: getcartindex
    })
  }
})
