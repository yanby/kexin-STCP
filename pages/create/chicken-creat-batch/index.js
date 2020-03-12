import { request, imgUrl, https, httpsUrl } from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "",
    dateEnd: new Date(),
    index: "",
    plotId: "",
    name: "",
    num: "",
    type: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      dateEnd: new Date(),
      plotId: options.plotId
    })
  },
  //点确定
  addBatch() {
    if (this.data.date.trim() == '') {
      wx.showToast({
        title: '请选择日期',
        icon: 'none'
      })
      return
    }
    if (this.data.type.trim() == '') {
      wx.showToast({
        title: '品种不能为空',
        icon: 'none'
      })
      return
    }
    if (this.data.num.trim() == '') {
      wx.showToast({
        title: '数量不能为空',
        icon: 'none'
      })
      return
    }
    if (this.data.name.trim() == '') {
      wx.showToast({
        title: '单位名称不能为空',
        icon: 'none'
      })
      return
    }
    request('/app/batchEgg/add', 'post', {
      "batchEgg.variety": this.data.type,
      "batchEgg.buy_time": this.data.date,
      "batchEgg.buy_number": this.data.num,
      "batchEgg.buy_sbuyer": this.data.name,
      "batchEgg.cote_egg": this.data.plotId,
      "batchEgg.farm": wx.getStorageSync('farms')
    }).then(res => {
      console.log(res);
      wx.navigateBack()
    })
  },
  //失去焦点
  input: function (e) {
    var o = {}
    o[e.target.dataset.k] = e.detail.value
    this.setData(o)
  },

  //时间选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})