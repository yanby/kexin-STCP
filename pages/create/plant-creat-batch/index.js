import { request, imgUrl, https, httpsUrl } from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "",
    index: "",
    array: ['枇杷', '山药'],
    crop: "",//作物
    name: "",
    area: "",
    plotId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      plotId: options.plotId
    })
  },
  //点确定
  addBatch() {
    if (this.data.crop.trim() == '') {
      wx.showToast({
        title: '请选择作物',
        icon: 'none'
      })
      return
    }
    if (this.data.area.trim() == '') {
      wx.showToast({
        title: '面积不能为空',
        icon: 'none'
      })
      return
    }
    if (this.data.name.trim() == '') {
      wx.showToast({
        title: '品种不能为空',
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
    request('/app/batchCrop/add', 'post', {
      "batchCrop.variety": this.data.name,
      "batchCrop.area": this.data.area,
      "batchCrop.crop": this.data.crop,
      "batchCrop.cote_crop": this.data.plotId,
      "batchCrop.farm": wx.getStorageSync('farms'),
      "batchCrop.batch_time": this.data.date
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
  //跳转批次列表页面
  goBatchList(){
    wx.navigateTo({
      url: '/pages/create/plant-batch-list/index'
    })
  },
  //下拉选择
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    if(this.data.index == 0){
      this.setData({
        crop: "枇杷"
      })
    } else if (this.data.index == 1){
      this.setData({
        crop: "山药"
      })
    }
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