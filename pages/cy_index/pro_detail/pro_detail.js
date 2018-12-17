var app = getApp()
Page({
    data: {
      animationData: "",
      showModalStatus: false,
      windowHeight: '',
      con_b_name : '',
      imgUrl: app.globalData.imgUrl,
      from : 'cart'
    }, 

    onLoad:function(option){
      var that = this 
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            windowHeight: res.windowHeight
          })
        }
      })
      var pro_id = option.pro_id;
      wx.request({
        url: app.globalData.requestUrl + '/index/getProDetail',
        data: { pro_id: pro_id },
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
          that.setData({
            pro_detail_info: res.data.result
          })
        }
      }) 
    },
    //跳转到首页
    goStore: function(event){
        wx.switchTab({
          url: '/pages/index/index',
          success: function (e) {
            var page = getCurrentPages().pop();
            page.onLoad();
          }
        })
    },
    //跳转到购物车
    goShoppingCart: function (event) {
      wx.switchTab({
        url: '/pages/shoppingCart/shoppingcart',
        success: function (e) {
          var page = getCurrentPages().pop();
          page.onLoad();
        }
      })
    },
    //选择规格（加入购物车）
    selectGuige: function (e) {
        var that = this
        var pro_id = e.target.dataset.proid
        var from = e.target.dataset.from
        that.setData({
            from : from 
        })
        //获取商品配置信息
        wx.request({
          url: app.globalData.requestUrl + '/product/getProConfigInfo',
          data: { pro_id: pro_id },
          method: 'post',
          header: {
            'content-type': ''
          },
          success: function (res) {
            that.setData({
              pro_config_info: res.data.result,
              select_count: 1,
              show_config2_info: false
            })
          }
        })
        //显示遮罩层
        that.showModel()
    }, 
    //选择规格（立即购买）
    buyNow: function (e) {
      var that = this
      var pro_id = e.target.dataset.proid
      var from = e.target.dataset.from
      that.setData({
        from: from
      })
      //获取商品配置信息
      wx.request({
        url: app.globalData.requestUrl + '/product/getProConfigInfo',
        data: { pro_id: pro_id },
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
          that.setData({
            pro_config_info: res.data.result,
            select_count: 1,
            show_config2_info: false
          })
        }
      })
      //显示遮罩层
      that.showModel()
    }, 
    // 显示遮罩层
    showModel: function () {
      var that = this
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      that.animation = animation
      animation.translateY(that.data.windowHeight).step()
      that.setData({
        animationData: animation.export(),
        showModalStatus: true
      })
      setTimeout(function () {
        animation.translateY(that.data.windowHeight * 0.23).step()
        that.setData({
          animationData: animation.export()
        })
      }.bind(that), 200)
    },
    // 隐藏遮罩层
    hideModal: function () {
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation;
      animation.translateY(this.data.windowHeight).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(this.data.windowHeight * 0.23).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: false
        })
      }.bind(this), 200)
    },
    //选择数量减1
    subtraction : function(e){
      var that = this
      var select_count = parseInt(e.target.dataset.selectcount)
      if (select_count == 1){
          that.setData({
            select_count: 1
          })
      }else{
        var new_count =  select_count - 1
        that.setData({
          select_count: new_count
        })
      }
    },
    //选择数量加1
    plus: function (e) {
      var that = this
      var select_count = parseInt(e.target.dataset.selectcount)
      var new_count = select_count + 1
      that.setData({
        select_count: new_count
      }) 
    },
    //选择规格1按钮
    select_config1_tap : function(e){
      var that = this
      var conname = e.target.dataset.conname
      var pro_id = e.target.dataset.proid
      wx.request({
        url: app.globalData.requestUrl + '/product/getConfig2InfoById',
        data: { pro_id: pro_id, con_info: conname},
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
          var result = res.data.result
          if (result.con_content[0][0]['con_content'] == ''){
            that.setData({
              show_config2_info: false,
              con_pro_id: pro_id
            })
          }else{
            that.setData({
              config2_info: result,
              show_config2_info: true,
              con_pro_id: pro_id
            })
          }
        }
      })
      that.setData({
        conname: conname
      })
    },
    //选择规格2按钮
    select_config2_tap : function(e){
      var that = this
      var con_b_name = e.target.dataset.con_b_name
      var conid = e.target.dataset.conid

      that.setData({
        con_b_name: con_b_name,
        selectconid: conid
      })
    },

    //确认按钮
    xiadan : function(e){
      var that = this
      var from = that.data.from
      var bis_id = app.globalData.bis_id
      var finalcount = e.target.dataset.finalcount
      var openid = app.globalData.openid
      var selectconid = e.target.dataset.selectconid
      if (!selectconid || selectconid == '' || selectconid == 0){
        wx.showToast({
          title: '请选择规格',
          image: '/pics/icons/tanhao.png',
          duration: 2000,
          mask: true
        })
      }else{
        var postdata = {
          bis_id: bis_id, 
          pro_id: selectconid, 
          count: finalcount, 
          wx_id: openid
        }

        console.log(postdata)
        wx.request({
          url: app.globalData.requestUrl + '/shoppingcart/addProIntoCart',
          data: postdata,
          method: 'post',
          header: {
            'content-type': ''
          },
          success: function (res) {
            if (res.data.statuscode == 1) {
              if(from == 'cart'){
                wx.showToast({
                  title: '加入购物车成功',
                  icon: 'success',
                  duration: 2000,
                  success: function (result) {
                    // 隐藏遮罩层  
                    that.hideModal();
                  }
                })
              }else{
                  wx.switchTab({
                    url: '/pages/shoppingCart/shoppingcart',
                    success: function (e) {
                      var page = getCurrentPages().pop(); 
                      page.onLoad(); 
                    }
                  })
              } 
            }
          }
        })
      }   
    }
})