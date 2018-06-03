var app = getApp()
Page({
  data: {
    region: ['北京市', '北京市', '东城区']
  },
  onLoad: function (options){
      var that = this
      var from = options.from
      that.setData({
        from: from
      })  
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  formSubmit: function (e) {
    var that = this
    var openid = app.globalData.openid
    var formdata = e.detail.value
    if (!formdata.receiver || !formdata.contact ||!formdata.detail_address){
      wx.showToast({
        title: '请完整填写收货信息',
        image: '/pics/icons/tanhao.png',
        duration: 1200,
        mask: true
      })
    }else{
      var postdata = {
      openid: openid,
      receiver: formdata.receiver,
      contact: formdata.contact,
      detail_address: formdata.detail_address, 
      address: formdata.address,
      idno: formdata.idno
    }

    //添加到数据库
    wx.request({
      url: app.globalData.requestUrl + '/address/addAddress',
      data: postdata,
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 2]
        wx.request({
          url: app.globalData.requestUrl + '/address/getAddressInfo',
          data: { openid: app.globalData.openid },
          header: {
            'content-type': ''
          },
          method: 'post',
          success: function (res) {
            if (res.data.result.length == 0) {
              prevPage.setData({
                show_address: false,
                from : that.data.from
              })
            } else {
              prevPage.setData({
                show_address: true,
                address_info: res.data.result, 
                from: that.data.from
              })
            }
          }
        })
        //返回上一个页面
        wx.navigateBack({
          delta: 1
        })
      }
    })
    }
    
  },
})