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
    oneCode: "",
    code: "",
    variety: "",
    total: "",
    address: "",
    plotId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      dateEnd: new Date(),
      plotId: options.plotId
    })
  },
  //跳转批次列表页面
  goBatchList(){
    wx.navigateTo({
      url: '/pages/create/bee-batch-list/index'
    })
  },
  //点确定
  addBatch() {
    if (this.data.oneCode.trim() == '') {
      wx.showToast({
        title: '母群号不能为空',
        icon: 'none'
      })
      return
    }
    if (this.data.date.trim() == '') {
      wx.showToast({
        title: '请选择日期',
        icon: 'none'
      })
      return
    }
    if (this.data.code.trim() == '') {
      wx.showToast({
        title: '蜂群号不能为空',
        icon: 'none'
      })
      return
    }
    if (this.data.variety.trim() == '') {
      wx.showToast({
        title: '品种不能为空',
        icon: 'none'
      })
      return
    }
    if (this.data.total.trim() == '') {
      wx.showToast({
        title: '蜂群总数不能为空',
        icon: 'none'
      })
      return
    }
    if (this.data.address.trim() == '') {
      wx.showToast({
        title: '蜂群位置不能为空',
        icon: 'none'
      })
      return
    }
    request('/app/batchBee/add', 'post', {
      "batchBee.bee_join_time": this.data.date,
      "batchBee.bee_number": this.data.code,
      "batchBee.variety": this.data.variety,
      "batchBee.parent_bee_number": this.data.oneCode,
      "batchBee.hive_number": this.data.total,
      "batchBee.location": this.data.address,
      "batchBee.cote_bee": this.data.plotId,
      "batchBee.farm": wx.getStorageSync('farms')
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