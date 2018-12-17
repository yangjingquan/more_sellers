//diancan.js
//获取应用实例
var app = getApp()
Page({
    data: {
      navLeftItems: [],
      navRightItems: [],
      curIndex: 0,
      imgUrl: app.globalData.imgUrl,
      cat_info : {},
      pro_info : {},
      total_amount : ''
    },
    //初始化
    onLoad: function () {
      var that = this 
      var bis_id = app.globalData.bis_id
      //获取商家信息
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
            img_res: res.data.img_res,
            act_res: res.data.act_res,
            act_count: res.data.act_res.length
          })
        }
      })
      //获取分类信息
      wx.request({
        url: app.globalData.requestUrl + '/product/getProInfo',
        data: { bis_id: bis_id, pro_type: 1},
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {       
          //检验购物车内是否存在商品
          wx.getStorage({
            key: 'cart_info',
            success: function (cart_info_res) {
              var request_pro_data = res.data.pro_res

              var total_amount = '0.00'
              for (var i = 0; i < request_pro_data.length; i++) {
                for (var j = 0; j < request_pro_data[i]['pro_info'].length; j++) {
                  var selected_pro_info = request_pro_data[i]['pro_info'][j]
                  var pro_id = selected_pro_info['id']
                  for (var k = 0; k < cart_info_res.data.length; k++) {
                    if (pro_id == cart_info_res.data[k]['id']) {
                      selected_pro_info['selected_count'] = cart_info_res.data[k]['selected_count']
                      total_amount = (parseFloat(total_amount) + parseFloat(cart_info_res.data[k]['selected_count'] * cart_info_res.data[k]['original_price'])).toFixed(2)
                      break
                    }
                  }
                }
              }
              //计算总价格
              that.setData({
                total_amount: total_amount
              })

              //返回商品信息
              that.setData({
                pro_info: request_pro_data
              })
            },
            fail: function (cart_info_res) {
              //把信息返回到前台
              that.setData({
                pro_info: res.data.pro_res,
                total_amount: '0.00'
              })
            }
          })

          //返回分类信息
          that.setData({
            cat_info: res.data.cat_res,
            return_id: res.data.cat_res[0]['cat_id']
          }) 
        }
      })
    },

    //点击左边栏分类  
    scrollToViewFn: function (e) {
      var _id = e.target.dataset.catid;
      this.setData({
        toView: 'inToView' + _id,
        return_id: _id
      })
    }, 
    //查看商品详情
    getProDetail: function (event) {
      var pro_id = event.currentTarget.dataset.proid;
      wx.navigateTo({
        url: '../index/pro_detail/pro_detail?pro_id=' + pro_id,
      })
    },
    //点餐加一
    plus : function(e){
      var that = this
      var catindex = e.currentTarget.dataset.catindex
      var proindex = e.currentTarget.dataset.proindex
      var selected_count = e.currentTarget.dataset.scount
      
      var pro_data = that.data.pro_info
      //设置商品数组内容
      pro_data[catindex]['pro_info'][proindex]['selected_count'] = selected_count + 1
      that.setData({
        pro_info: pro_data
      })

      var cart_info = new Array()
      for (var i = 0; i < pro_data.length; i++) {
        for (var j = 0; j < pro_data[i]['pro_info'].length; j++) {
          var selected_pro_info = pro_data[i]['pro_info'][j]
          var selected_count = selected_pro_info['selected_count']
          if (selected_count != 0) {
            cart_info.push(selected_pro_info)
          }
        }
      }
      //将购物车信息放在缓存中
      wx.setStorage({
        key: "cart_info",
        data: cart_info
      })

      //设置总价格
      var total_amount = (parseFloat(that.data.total_amount) + parseFloat(pro_data[catindex]['pro_info'][proindex]['original_price'])).toFixed(2)
      that.setData({
        total_amount: total_amount
      })
    },
    // 点餐减一
    sub : function(e){
      var that = this
      var catindex = e.currentTarget.dataset.catindex
      var proindex = e.currentTarget.dataset.proindex
      var selected_count = e.currentTarget.dataset.scount
      var pro_data = that.data.pro_info
      //设置商品数组内容
      pro_data[catindex]['pro_info'][proindex]['selected_count'] = selected_count - 1
      that.setData({
        pro_info: pro_data
      })

      var cart_info = new Array()
      for (var i = 0; i < pro_data.length; i++) {
        for (var j = 0; j < pro_data[i]['pro_info'].length; j++) {
          var selected_pro_info = pro_data[i]['pro_info'][j]
          var selected_count = selected_pro_info['selected_count']
          if (selected_count != 0) {
            cart_info.push(selected_pro_info)
          }
        }
      }
      //将购物车信息放在缓存中
      wx.setStorage({
        key: "cart_info",
        data: cart_info
      })

      //设置总价格
      var total_amount = (parseFloat(that.data.total_amount) - parseFloat(pro_data[catindex]['pro_info'][proindex]['original_price'])).toFixed(2)
      that.setData({
        total_amount: total_amount
      })  
    },
    //结算按钮
    jiesuan : function(){
      var that = this
      //获取总价
      var total_amount = that.data.total_amount
      if (total_amount == '0.00') {
        wx.showToast({
          title: '请选择商品',
          image: '/pics/icons/tanhao.png',
          duration: 2000,
          mask: false
        })
      }else{
        var total_amount = that.data.total_amount
        wx.navigateTo({
          url: '/pages/dc_confirm_order/dc_confirm_order?total_amount=' + total_amount,
        })
      }
    }
})    
