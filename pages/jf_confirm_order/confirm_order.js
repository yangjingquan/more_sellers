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
    var cart_id = options.cart_id
    
    that.setData({
      cart_id: cart_id
    })
    var openid = app.globalData.openid
    //获取此条购物车信息
    that.getSelectedCartInfo(cart_id, openid)
  },
  //获取选中的购物车信息
  getSelectedCartInfo: function (cart_id, openid){
      var that = this
      var bis_id = app.globalData.bis_id
      wx.request({
        url: app.globalData.requestUrl + '/shoppingcart/getJfProSelectedInfo',
        data: { cart_id: cart_id, openid: openid, bis_id: bis_id},
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
          if (res.data.result.address_info.length == 0){
            that.setData({
              showAddress: false
            })
          }else{
            that.setData({
              showAddress: true
            })
          }
          var pro_amount = res.data.result.pro_amount
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
              that.setData({
                bis_transportType: transportType
              })
              if (transportType == 1) {
                if (res.data.result.transportInfo.length == 0) {
                  wx.showToast({
                    title: '店家未设置快递方式',
                    image: '/pics/icons/tanhao.png',
                    duration: 1500,
                    mask: true,
                    success : function(){
                      that.setData({
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
                  var first_heavy = res.data.result.transportInfo[0]['first_heavy']
                  var continue_heavy = res.data.result.transportInfo[0]['continue_heavy']
                  var continue_stage = res.data.result.transportInfo[0]['continue_stage']
                  var total_weight = res.data.result.total_weight
                  var transport_fee = (parseFloat(first_heavy) + parseFloat(continue_heavy * (Math.ceil((total_weight - 1) / continue_stage)))).toFixed(2)
                  var total_amount = (parseFloat(res.data.result.price_amount) + parseFloat(transport_fee)).toFixed(2)
                  that.setData({
                    transportType: transportType,
                    showFreightView: true,
                    total_amount: total_amount,
                    transport_fee: transport_fee,
                    selected_transport_type: res.data.result.transportInfo[0]['mode_id'],
                    buttonUsable: false
                  })
                }  
              } else {
                var pro_amount = res.data.result.price_amount
                var ykj_price = result.data.result.ykj_price
                var total_amount = parseFloat(parseFloat(pro_amount) + parseFloat(ykj_price)).toFixed(2)
                
                that.setData({
                  transportType: transportType,
                  showFreightView: false,
                  transport_fee: ykj_price,
                  total_amount: total_amount,
                  selected_transport_type: '',
                  buttonUsable: false
                })
              }
            }
          })
          that.setData({
            cart_info: res.data.result,
            pro_info: res.data.result.pro_info,
            count: res.data.result.pro_info.count,
            transport_type: res.data.result.transportType,
            transport_info: res.data.result.transportInfo,
            price_amount: res.data.result.price_amount,
            jifen_amount: res.data.result.jifen_amount,
            total_weight: res.data.result.total_weight
          })
        }
      }) 
  },
  //支付按钮
  formSubmit : function(e){
    var that = this
    var formId = e.detail.formId
    var cart_info = that.data.cart_info
    var remark = e.detail.value.remark
    var pro_info_length = cart_info.pro_info.length
    if (cart_info.address_info.length == 0) {
      wx.showToast({
        title: '请设置您的地址!',
        image: '/pics/icons/tanhao.png',
        duration: 1500,
        mask: true
      })
    } else {
      //判断积分是否足够
      var jifen_amount = that.data.jifen_amount
      wx.request({
        url: app.globalData.requestUrl + '/shoppingcart/checkJifenEnough',
        data: {openid:app.globalData.openid,jifen_amount:jifen_amount},
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
          var state = res.data.result
          if(state < 0){
            wx.showToast({
              title: '您的积分不够啦!',
              image: '/pics/icons/tanhao.png',
              duration: 2000,
              mask: true
            })
          }else{
            var total_amount = that.data.total_amount
            var postdata = {
              bis_id: app.globalData.bis_id,
              mem_id: app.globalData.openid,
              rec_name: cart_info.address_info.rec_name,
              mobile: cart_info.address_info.mobile,
              address: cart_info.address_info.address,
              id_no: cart_info.address_info.idno,
              total_amount: total_amount,
              pro_amount: that.data.price_amount,
              transport_fee: that.data.transport_fee,
              jifen_amount: that.data.jifen_amount,
              selected_transport_type: that.data.selected_transport_type,
              remark: remark,
              pro_info: cart_info.pro_info,
              appid: app.globalData.appid,
              secret: app.globalData.secret
            }
            if (total_amount < '0.01') {
              postdata.order_status = 3
            }else{
              postdata.order_status = 2
            }
          
        
            //生成外部订单
            wx.request({
              url: app.globalData.requestUrl + '/order/makeJfOrder',
              data: postdata,
              method: 'post',
              header: {
                'content-type': ''
              },
              success: function (res) {
                var order_id = res.data.result
                if (postdata.order_status == 3){
                  //减去消耗的积分
                  wx.request({
                    url: app.globalData.requestUrl + '/bis/subJifenOrg',
                    data: { order_id: order_id, openid: app.globalData.openid, bis_id: app.globalData.bis_id },
                    method: 'post',
                    header: {
                      'content-type': ''
                    },
                    success: function (res) {

                    }
                  })
                  //直接跳转订单页面
                  wx.navigateTo({
                    url: '/pages/orders/myorder',
                  })
                }else{
                  //生成微信预订单
                  that.makePreOrder(order_id, formId)
                }
              }
            })
          }
        }
      })
    }
  },
  //生成微信预订单
  makePreOrder: function (order_id, formId, from){
    var that = this
    var pdata = {
      order_id: order_id,
      body: '商品',
      openid: app.globalData.openid
    }
    wx.request({
      url: app.globalData.payUrl,
      data: pdata,
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        var preData = res.data.result
        //调起微信支付
        that.wxPay(preData, pdata.order_id, formId)
      }
    }) 
  },
  //调起微信支付
  wxPay: function (preData, order_id, formId){
    var that = this
    wx.requestPayment({
      timeStamp: (preData.timeStamp).toString(),
      nonceStr: preData.nonceStr,
      package: preData.package,
      signType: preData.signType,
      paySign: preData.sign,
      success: function (result) {
        //更改订单状态
        wx.request({
          url: app.globalData.requestUrl + '/order/updateJfOrderStatus',
          data: { order_id: order_id},
          method: 'post',
          header: {
            'content-type': ''
          },
          success: function (res) {
          }
        })
        
        //减去消耗的积分
        wx.request({
          url: app.globalData.requestUrl + '/bis/subJifenOrg',
          data: { order_id: order_id, openid: app.globalData.openid, bis_id: app.globalData.bis_id },
          method: 'post',
          header: {
            'content-type': ''
          },
          success: function (res) {

          }
        })

        //跳转订单
        wx.navigateTo({
          url: '/pages/orders/myorder',
        })
      },
      fail : function(res){
        var template_id = "SEX_cA2MxCtW5LTLdQQu6-YKSXIUQCIrk0TJ1q_jZKE"
        var openid = app.globalData.openid
        var appid = app.globalData.appid
        var secret = app.globalData.secret

        var postData = {
          form_id: formId,
          template_id: template_id,
          touser: openid,
          appid: appid,
          secret: secret,
          order_id: order_id
        }

        wx.request({
          url: app.globalData.requestUrl + '/index/setTemMessage',
          data: postData,
          header: {
            'content-type': ''
          },
          method: 'post',
          success: function (res) {
            //跳转订单
            wx.navigateTo({
              url: '/pages/orders/myorder',
            })
          }
        })
        
      }
    })
  },
  //选择地址
  choose_address : function(){
      var that = this
      var cart_id = that.data.cart_id
      wx.navigateTo({
        url: '/pages/jf_address/address?from=order&cart_id=' + cart_id,
      })
  },
  //切换快递类型
  bindTypeChange: function (e) {
    var that = this
    var index = e.detail.value
    var total_weight = that.data.total_weight
    var first_heavy = that.data.transport_info[index]['first_heavy']
    var continue_heavy = that.data.transport_info[index]['continue_heavy']
    var continue_stage = that.data.transport_info[index]['continue_stage']
    var transport_fee = (parseFloat(first_heavy) + parseFloat(continue_heavy * (Math.ceil((total_weight - 1) / continue_stage)))).toFixed(2)
    var total_amount = (parseFloat(transport_fee) + parseFloat(that.data.price_amount)).toFixed(2)
    var selected_transport_type = that.data.transport_info[index]['mode_id']

    that.setData({
      index: index,
      transport_fee: transport_fee,
      total_amount: total_amount,
      selected_transport_type: selected_transport_type
    })
  },
  //获取该店铺的运费模式
  getTransportType : function(bis_id){
      var that = this
      wx.request({
        url: app.globalData.requestUrl + '/index/getTransportType',
        data: { bis_id: bis_id},
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
          var transportType = res.data.result.transport_type
          if (transportType == 1){
            that.setData({
              transportType: transportType,
              showFreightView: true
            })
          }else{
            var pro_amount = that.data.pro_amount
            var ykj_price = res.data.result.ykj_price
            var total_amount = parseFloat(pro_amount) + parseFloat(ykj_price)
            that.setData({
              transportType: transportType,
              showFreightView: false,
              transport_fee: ykj_price,
              total_amount: total_amount,
              selected_transport_type: ''
            })
          }
        }
      })
  },
  //获取运费详情
  getTransportFeeDetail : function(){
    var that = this
    var showTransportFeeDetail = !(that.data.showTransportFeeDetail)
    that.setData({
      showTransportFeeDetail: showTransportFeeDetail
    })
  },
  //购物车对应商品数量减1
  subtap: function (e) {
    var that = this
    var bis_id = app.globalData.bis_id
    var cartid = parseInt(e.target.dataset.cartid)
    var selectedcount = parseInt(e.target.dataset.selectedcount)
    var postdata = {}
    if (selectedcount != 1) {
      postdata = {
        cart_id: cartid,
        selectedcount: selectedcount,
        type: 'sub'
      }
      wx.request({
        url: app.globalData.requestUrl + '/shoppingcart/updateProCountBySingle',
        data: postdata,
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          var bis_transportType = that.data.bis_transportType
          var count = res.data.result
          var unit_price = that.data.pro_info.associator_price
          var pro_amount = parseFloat(count * unit_price).toFixed(2)
          var jifen_amount = count * that.data.pro_info.ex_jifen
          var unit_weight = that.data.pro_info.weight
          if (bis_transportType == 1){
            var total_weight = parseFloat(count * unit_weight).toFixed(2)
            var index = that.data.index
            var first_heavy = that.data.transport_info[index]['first_heavy']
            var continue_heavy = that.data.transport_info[index]['continue_heavy']
            var continue_stage = that.data.transport_info[index]['continue_stage']
            var transport_fee = (parseFloat(first_heavy) + parseFloat(continue_heavy * (Math.ceil((total_weight - 1) / continue_stage)))).toFixed(2)
            var total_amount = parseFloat(parseFloat(transport_fee) + parseFloat(pro_amount)).toFixed(2)
            that.setData({
              count: count,
              total_amount: total_amount,
              jifen_amount: jifen_amount,
              transport_fee: transport_fee,
              total_weight: total_weight
            })
          }else{
            var transport_fee = that.data.transport_fee
            var total_amount = parseFloat(parseFloat(transport_fee) + parseFloat(pro_amount)).toFixed(2)
            that.setData({
              count: count,
              total_amount: total_amount,
              jifen_amount: jifen_amount
            })
          }
        }
      })
    }
  },
  //购物车对应商品数量加1
  plustap: function (e) {
    var that = this
    var bis_id = app.globalData.bis_id
    var cartid = parseInt(e.target.dataset.cartid)
    var selectedcount = parseInt(e.target.dataset.selectedcount)
    var postdata = {}
    
    postdata = {
      cart_id: cartid,
      selectedcount: selectedcount,
      type: 'plus'
    }
    wx.request({
      url: app.globalData.requestUrl + '/shoppingcart/updateProCountBySingle',
      data: postdata,
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        var bis_transportType = that.data.bis_transportType

        var count = res.data.result
        var unit_price = that.data.pro_info.associator_price
        var pro_amount = parseFloat(count * unit_price).toFixed(2)
        var jifen_amount = count * that.data.pro_info.ex_jifen
        var unit_weight = that.data.pro_info.weight
        if (bis_transportType == 1) {
          var total_weight = parseFloat(count * unit_weight).toFixed(2)
          var index = that.data.index
          var first_heavy = that.data.transport_info[index]['first_heavy']
          var continue_heavy = that.data.transport_info[index]['continue_heavy']
          var continue_stage = that.data.transport_info[index]['continue_stage']
          var transport_fee = (parseFloat(first_heavy) + parseFloat(continue_heavy * (Math.ceil((total_weight - 1) / continue_stage)))).toFixed(2)
          var total_amount = parseFloat(parseFloat(transport_fee) + parseFloat(pro_amount)).toFixed(2)
          that.setData({
            count: count,
            total_amount: total_amount,
            jifen_amount: jifen_amount,
            transport_fee: transport_fee,
            total_weight: total_weight
          })
        } else {
          var transport_fee = that.data.transport_fee
          var total_amount = parseFloat(parseFloat(transport_fee) + parseFloat(pro_amount)).toFixed(2)
          that.setData({
            count: count,
            total_amount: total_amount,
            jifen_amount: jifen_amount
          })
        }
      }
    })
    
  }
})
