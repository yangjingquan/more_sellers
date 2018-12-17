var app = getApp()
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    showAddress : false
  },
  
  onLoad: function (options) {
    var that = this
    var cart_info_length = options.cart_info_length
    var wm_total_amount = options.wm_total_amount
    var bis_id = app.globalData.bis_id
    //获取店铺相关信息(店铺名称、餐盒费、配送费等)
    wx.request({
      url: app.globalData.requestUrl + '/index/getBisInfo',
      data: { bis_id: bis_id },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        that.setData({
          bis_res: res.data.bis_res,
          lunch_box_fee: res.data.bis_res.lunch_box_fee * cart_info_length,
          distribution_fee: res.data.bis_res.distribution_fee,
        })
      }
    })
    //获取购物车商品信息
    wx.getStorage({
      key: 'wm_cart_info',
      success: function (res) {
        that.setData({
          wm_cart_info: res.data
        })
      }
    })
    //设置总价格
    that.setData({
      wm_total_amount: wm_total_amount
    })
    
    //设置送达时间
    var date = new Date()
    var new_date = new Date(date.getTime() + 1000 * 60 * 30);
    if (new_date.getMinutes() < 10) {
      var minute = '0' + new_date.getMinutes()
    } else {
      var minute = new_date.getMinutes()
    }
    var expect_time = new_date.getHours() + ':' + minute
    that.setData({
      expect_time: expect_time
    })

    setTimeout(function(){
      that.getActInfo()
    },1200)
    
  },
  //选择地址信息
  choose_address: function (){
      var that = this
      wx.chooseAddress({
        success: function (res) {
          that.setData({
            rec_name: res.userName,
            mobile: res.telNumber,
            addressDetail: res.detailInfo,
            showAddress : true
          })
        }
      })  
  },
  //获取活动信息
  getActInfo : function(){
    var that = this
    var pro_fee = that.data.wm_total_amount
    var lunch_box_fee = that.data.lunch_box_fee
    var distribution_fee = that.data.distribution_fee
    
    var total_amount = parseFloat(pro_fee) + parseFloat(lunch_box_fee) + parseFloat(distribution_fee)
    var postData = {
      bis_id : app.globalData.bis_id,
      total_amount: total_amount,
      isNewMember: app.globalData.isNewMember
    }
    //获取实付金额和活动信息
    wx.request({
      url: app.globalData.requestUrl + '/Activity/getActivityInfo',
      data: postData,
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        if (res.data.result.act_res.length == 0){
          that.setData({
            show_act_res: false,
            paid_amount: res.data.result.total_amount
          })
        }else{
          that.setData({
            show_act_res: true,
            act_res: res.data.result.act_res,
            paid_amount: res.data.result.total_amount
          })
        }
        
      }
    })
    
  },
  //提交订单,调起微信支付
  formSubmit : function(e){
      var that = this
      var formData = e.detail.value
      if (that.data.showAddress == false){
        wx.showToast({
          title: '请设置收货地址！',
          image: '/pics/icons/tanhao.png',
          duration: 2000,
          mask: false
        })
      }else{
        var postData = {
          bis_id: app.globalData.bis_id,
          openid: app.globalData.openid,
          remark: formData.remark,
          cart_info: that.data.wm_cart_info,
          total_amount: that.data.paid_amount,
          rec_name: that.data.rec_name,
          mobile: that.data.mobile,
          addressDetail: that.data.addressDetail,
        }
        //生成外卖订单
        wx.request({
          url: app.globalData.requestUrl + '/order/makeWmOrder',
          data: postData,
          header: {
            'content-type': ''
          },
          method: 'post',
          success: function (res) {
            //清除缓存
            wx.clearStorage()
            var order_id = res.data.result
            //生成微信预订单
            that.makePreOrder(order_id)
            
          }
        })
      }
      
  },
  //生成微信预订单
  makePreOrder: function (order_id) {
    var that = this
    var pdata = {
      order_id: order_id,
      body: '餐饮',
      openid: app.globalData.openid
    }
    wx.request({
      url: app.globalData.requestUrl + '/pay/pay',
      data: pdata,
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        var preData = res.data.result
        //调起微信支付
        that.wxPay(preData, pdata.order_id)
      }
    })
  },
  //调起微信支付
  wxPay: function (preData, order_id) {
    wx.requestPayment({
      timeStamp: (preData.timeStamp).toString(),
      nonceStr: preData.nonceStr,
      package: preData.package,
      signType: preData.signType,
      paySign: preData.sign,
      success: function (result) {
        //跳转订单详情页
        wx.navigateTo({
          url: '/pages/wm_order_detail/wm_order_detail?order_id=' + order_id,
        })
      },
      fail: function (res) {
        //跳转订单详情页
        wx.navigateTo({
          url: '/pages/wm_order_detail/wm_order_detail?order_id=' + order_id,
        })
      }
    })
  } 
})
