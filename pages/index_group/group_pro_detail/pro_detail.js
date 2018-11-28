var app = getApp()
var imageUtil = require('../../../utils/util.js');  
Page({
    data: {
      animationData: "",
      showModalStatus: false,
      windowHeight: '',
      con_b_name : '',
      imgUrl: app.globalData.imgUrl,
      from : 'cart',
      imageSizeInfo : {}
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
      var pro_id = option.pro_id
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
        }
      })
      var group_num = option.group_num
      that.setData({
        group_num: group_num
      })
      //获取商品详情
      wx.request({
        url: app.globalData.requestUrl + '/index/getProDetailOneDimensional',
        data: { pro_id: pro_id },
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
          that.setData({
            pro_detail_info: res.data.result,
            pro_id: pro_id
          })
        }
      })        
    },
    //跳转到首页
    goStore: function(event){
        wx.switchTab({
          url: '/pages/index/index',
        })
    },
    //参团购买
    buyByJoinGroup: function (e) {
      var that = this
      if (!app.globalData.userInfo) {
        app.getUserInfo(true)
      } else {
        var pro_id = that.data.pro_id
        var from = 'join_group'
        var postdata = {
          pro_id: pro_id,
          from: from
        }
        //获取商品配置信息
        wx.request({
          url: app.globalData.requestUrl + '/product/getProConfigInfoOneDimensionalByGroup',
          data: postdata,
          method: 'post',
          header: {
            'content-type': ''
          },
          success: function (res) {
            that.setData({
              conname: '',
              selectconid: '',
              cur_price: '',
              pro_config_info: res.data.result,
              select_count: 1
            })
          }
        })
        //显示遮罩层
        that.showModel()
      }
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
    //选择规格按钮
    select_config1_tap : function(e){
      var that = this
      var conname = e.target.dataset.conname
      var pro_id = e.target.dataset.proid
      var from = that.data.from
      var postdata = {
        pro_id: pro_id,
        from : from 
      }
      wx.request({
        url: app.globalData.requestUrl + '/product/getConByIdOneDimensionalByGroup',
        data: postdata,
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
          var result = res.data.result
          that.setData({
            conname: conname,
            cur_price: result.price,
            selectconid: pro_id
          })
        }
      })
    },

    //确认按钮
    xiadan : function(e){
      var that = this
      var from = 'join_group'
      var bis_id = app.globalData.bis_id
      var finalcount = e.target.dataset.finalcount
      var openid = app.globalData.openid
      var selectconid = e.target.dataset.selectconid
      var pro_id = that.data.pro_detail_info.pro_id
      var pintuan_count = that.data.pro_detail_info.pintuan_count
      var group_num = that.data.group_num
      if (!selectconid || selectconid == '' || selectconid == 0){
        wx.showToast({
          title: '请选择规格',
          image: '/pics/icons/tanhao.png',
          duration: 1200,
          mask: true
        })
      }else{
        var postdata = {
          bis_id: bis_id,
          pro_id: selectconid,
          count: finalcount,
          wx_id: openid
        }
        wx.request({
          url: app.globalData.requestUrl + '/shoppingcart/addGroupProIntoCart',
          data: postdata,
          method: 'post',
          header: {
            'content-type': ''
          },
          success: function (res) {
            var cart_id = res.data.result
            wx.navigateTo({
              url: '/pages/group_confirm_order/confirm_order?cart_id=' + cart_id + '&pro_id=' + pro_id + '&from=' + from + '&pintuan_count=' + pintuan_count + '&group_num=' + group_num,
            })
          }
        }) 
      }   
    },
    imageLoad: function (e) {
      var that = this
      var imageSize = imageUtil.imageUtil(e)
      
      var imageSizeInfo = that.data.imageSizeInfo;
      imageSizeInfo[e.target.dataset.index] = {
        imagewidth: imageSize.imageWidth,
        imageheight: imageSize.imageHeight
      }
      that.setData({
        imageSizeInfo: imageSizeInfo
      })
    }
})