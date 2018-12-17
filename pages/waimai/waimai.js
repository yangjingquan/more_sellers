//waimai.js
//获取应用实例
var app = getApp()
Page({
    data: {
      navLeftItems: [],
      navRightItems: [],
      curIndex: 0,
      imgUrl: app.globalData.imgUrl,
      wm_cat_info : {},
      wm_pro_info : {},
      wm_total_amount : ''
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
            wm_bis_res: res.data.bis_res,
            wm_img_res: res.data.img_res,
            wm_act_res: res.data.act_res,
            wm_act_count: res.data.act_res.length
          })
        }
      })
      //获取分类及商品信息
      wx.request({
        url: app.globalData.requestUrl + '/product/getProInfo',
        data: { bis_id: bis_id, pro_type: 2},
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {       
            //检验购物车内是否存在商品
            wx.getStorage({
              key: 'wm_cart_info',
              success: function (cart_info_res) {
                var request_pro_data = res.data.pro_res
                var wm_total_amount = '0.00'
                for (var i = 0; i < request_pro_data.length; i++) {
                  for (var j = 0; j < request_pro_data[i]['pro_info'].length; j++) {
                    var wm_selected_pro_info = request_pro_data[i]['pro_info'][j]
                    var wm_pro_id = wm_selected_pro_info['id']
                    for (var k = 0; k < cart_info_res.data.length;k++){
                      if(wm_pro_id == cart_info_res.data[k]['id']){
                        wm_selected_pro_info['selected_count']  = cart_info_res.data[k]['selected_count']
                        wm_total_amount = (parseFloat(wm_total_amount) + parseFloat(cart_info_res.data[k]['selected_count'] * cart_info_res.data[k]['original_price'])).toFixed(2)
                        break
                      }
                    }
                  }
                }

                //设置购物车内容
                var pro_data = request_pro_data
                var wm_cart_info = new Array()
                for (var i = 0; i < pro_data.length; i++) {
                  for (var j = 0; j < pro_data[i]['pro_info'].length; j++) {
                    var wm_selected_pro_info = pro_data[i]['pro_info'][j]
                    var wm_selected_count = wm_selected_pro_info['selected_count']
                    if (wm_selected_count != 0) {
                      wm_cart_info.push(wm_selected_pro_info)
                    }
                  }
                }
                //将购物车信息放在缓存中
                wx.setStorage({
                  key: "wm_cart_info",
                  data: wm_cart_info
                })
                //计算总价格
                that.setData({
                  wm_total_amount: wm_total_amount
                })
                
                //返回商品信息
                that.setData({
                  wm_pro_info: request_pro_data
                })
              },
              fail: function (cart_info_res){
                //把信息返回到前台
                that.setData({
                  wm_pro_info: res.data.pro_res,
                  wm_total_amount: '0.00'
                })
              }
            })

            //返回分类信息
            that.setData({
              wm_cat_info: res.data.cat_res,
              wm_return_id: res.data.cat_res[0]['cat_id']
            })   
        }
      })
    },

    //点击左边栏分类  
    scrollToViewFn: function (e) {
      var _id = e.target.dataset.catid;
      this.setData({
        toView: 'inToView' + _id,
        wm_return_id: _id
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
      
      var pro_data = that.data.wm_pro_info
      //设置商品数组内容
      pro_data[catindex]['pro_info'][proindex]['selected_count'] = selected_count + 1
      that.setData({
        wm_pro_info: pro_data
      })

      var wm_cart_info = new Array()
      for (var i = 0; i < pro_data.length; i++) {
        for (var j = 0; j < pro_data[i]['pro_info'].length; j++) {
          var wm_selected_pro_info = pro_data[i]['pro_info'][j]
          var wm_selected_count = wm_selected_pro_info['selected_count']
          if (wm_selected_count != 0) {
            wm_cart_info.push(wm_selected_pro_info)
          }
        }
      }
      //将购物车信息放在缓存中
      wx.setStorage({
        key: "wm_cart_info",
        data: wm_cart_info
      })

      //设置总价格
      var wm_total_amount = (parseFloat(that.data.wm_total_amount) + parseFloat(pro_data[catindex]['pro_info'][proindex]['original_price'])).toFixed(2)
      that.setData({
        wm_total_amount: wm_total_amount
      })
    },
    // 点餐减一
    sub : function(e){
      var that = this
      var catindex = e.currentTarget.dataset.catindex
      var proindex = e.currentTarget.dataset.proindex
      var selected_count = e.currentTarget.dataset.scount
      
      var pro_data = that.data.wm_pro_info
      //设置商品数组内容
      pro_data[catindex]['pro_info'][proindex]['selected_count'] = selected_count - 1
      that.setData({
        wm_pro_info: pro_data
      })

      var wm_cart_info = new Array()
      for (var i = 0; i < pro_data.length; i++) {
        for (var j = 0; j < pro_data[i]['pro_info'].length; j++) {
          var wm_selected_pro_info = pro_data[i]['pro_info'][j]
          var wm_selected_count = wm_selected_pro_info['selected_count']
          if (wm_selected_count != 0) {
            wm_cart_info.push(wm_selected_pro_info)
          }
        }
      }
      //将购物车信息放在缓存中
      wx.setStorage({
        key: "wm_cart_info",
        data: wm_cart_info
      })

      //设置总价格
      var wm_total_amount = (parseFloat(that.data.wm_total_amount) - parseFloat(pro_data[catindex]['pro_info'][proindex]['original_price'])).toFixed(2)
      that.setData({
        wm_total_amount: wm_total_amount
      }) 
    },
    //结算按钮
    jiesuan : function(){
      var that = this
      //获取总价
      var wm_total_amount = that.data.wm_total_amount
      if (wm_total_amount == '0.00') {
        wx.showToast({
          title: '请选择商品',
          image: '/pics/icons/tanhao.png',
          duration: 2000,
          mask: false
        })
      }else{
        if (parseFloat(wm_total_amount) < parseFloat(that.data.wm_bis_res.min_price)) {
          var d_value = parseFloat(that.data.wm_bis_res.min_price) - parseFloat(wm_total_amount)
          wx.showToast({
            title: '差￥' + d_value + '元起送',
            image: '/pics/icons/tanhao.png',
            duration: 2000,
            mask: false
          })
        }else{
          wx.getStorage({
            key: 'wm_cart_info',
            success: function (res) {
              var cart_info_length = res.data.length
              wx.navigateTo({
                url: '/pages/wm_confirm_order/wm_confirm_order?cart_info_length=' + cart_info_length + "&wm_total_amount=" + wm_total_amount,
              })
            }
          }) 
        }
      }
    }
})    
