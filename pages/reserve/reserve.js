var app = getApp()
var util = require('../../utils/util.js');  
Page({
  data: {
    region: '1',
    new_date : '',
    new_time: '',
    table_type : ['二十人桌','十六人桌','十二人桌',
    '十人桌','四人桌','两人桌'],
    table_consume: ['最低消费2000.00', '最低消费1000.00', '最低消费800.00',
      '最低消费500.00', '最低消费100.00', '最低消费50.00'],
    index: 0
  },
  onLoad: function (options){
      var that = this
      app.getOpenId(function (openid) {
        //更新数据
        that.setData({
          openid: openid
        })
      })
      var date = new Date() 
      var today  = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      if (date.getMinutes() < 10){
        var minute = '0' + date.getMinutes()
      }else{
        var minute = date.getMinutes()
      }
      
      var now = date.getHours() + ':' + minute
      this.setData({
        new_date: today,
        new_time: now
      }); 
  },
  bindDateChange: function (e) {
    this.setData({
      new_date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      new_time: e.detail.value
    })
  },
  bindTableChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  formSubmit: function (e) {
    var that = this
    
    var formdata = e.detail.value
    if (!formdata.contact || !formdata.count || !formdata.mobile){
      wx.showToast({
        title: '请填写必要信息',
        image: '/pics/icons/tanhao.png',
        mask: true
      })
    }else{
      var postdata = {
        bis_id: app.globalData.bis_id,
        date: formdata.date,
        time: formdata.time,
        type: formdata.table,
        link_man: formdata.contact,
        count: formdata.count,
        mobile: formdata.mobile,
        remark: formdata.remark,
        openid : app.globalData.openid
      }

      //添加到数据库
      wx.request({
        url: app.globalData.requestUrl + '/reserve/addReserveInfo',
        data: postdata,
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          wx.showToast({
            title: '预定成功！',
            success: function () {
              //返回上一个页面
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }
          })
        }
      })    
    } 
  }
    
})