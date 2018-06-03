var app = getApp()
Page({
  data: {
    showTopTips: false,

    radioItems: [
      { name: 'cell standard', value: '0' },
      { name: 'cell standard', value: '1', checked: true }
    ],
    checkboxItems: [
      { name: 'standard is dealt for u.', value: '0', checked: true },
      { name: 'standard is dealicient for u.', value: '1' }
    ],

    date: "2016-09-01",
    time: "12:01",

    countryCodes: ["+86", "+80", "+84", "+87"],
    countryCodeIndex: 0,

    countries: ["中国", "美国", "英国"],
    countryIndex: 1,

    region: ['广东省', '广州市', '越秀区'],

    accounts: ["微信号", "QQ", "Email"],
    accountIndex: 0,

    isAgree: false
  },
  onLoad: function (options) {
    var that = this
    var bis_id = app.globalData.bis_id

  },
  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  radioChange: function (e) {
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  },
  checkboxChange: function (e) {
     var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindCountryCodeChange: function (e) {
    this.setData({
      countryCodeIndex: e.detail.value
    })
  },
  bindCountryChange: function (e) {
    this.setData({
      countryIndex: e.detail.value
    })
  },
  bindAccountChange: function (e) {
    this.setData({
      accountIndex: e.detail.value
    })
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  //提交表单
  

    formSubmit: function (e) {
      var that = this
      var formdata = e.detail.value
      if (!formdata.bis_name || !formdata.leader || !formdata.link_mobile) {
        wx.showToast({
          title: '请完整填写资料',
          image: '/pics/icons/tanhao.png',
          duration: 1000,
          mask: true
        })

      } else {
        var postdata = {
          bis_name: formdata.bis_name,
          leader: formdata.leader,
          username: formdata.link_mobile,
          link_mobile: formdata.link_mobile,
          link_tel: formdata.link_mobile,
          password: formdata.password,
          category: 0,
          email: 0,
          brand: formdata.brand,
          region: formdata.region,
          address: formdata.address
      }

      //添加到数据库
      wx.request({
        url: app.globalData.requestUrl + '/bis/xcx_register',
        data: postdata,
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          if (res.data.scode == 1) {
            wx.showModal({
              title: '提交成功',
              content: '请耐心等待我们审核',
              confirmText: '返回首页',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../home/home',
                  })
                } else if (res.cancel) {
                }
              }
            })
          } else {
            wx.showToast({
              title: '提交失败',
              image: '/pics/icons/tanhao.png',
              duration: 2000,
              mask: true
            })
          }
        }
      })
    }

  },

})