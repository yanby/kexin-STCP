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
    batch: "",
    crop: "",//作物
    name: "",
    area: "",
    batchId: "",
    crop: "",
    array: ['枇杷', '山药']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var batch = JSON.parse(options.batch)
    console.log(batch)
    this.setData({
      dateEnd: new Date(),
      name: batch.variety,
      crop: batch.crop,
      batchId: batch.id,
      area: batch.area + '',
      date: batch.batch_time
    })
    this.data.array.forEach((item,index) => {
      if (item == this.data.crop){
        that.setData({
          index: index
        })
      }
    })
  },
  //跳转批次列表页面
  goBatchList(){
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
    request('/app/batchCrop/update', 'post', {
      "batchCrop.variety": this.data.name,
      "batchCrop.area": this.data.area,
      "batchCrop.crop": this.data.crop,
      "batchCrop.cote_crop": "",
      "batchCrop.farm": "",
      "batchCrop.batch_time": this.data.date,
      "batchCrop.id": this.data.batchId
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
  //下拉选择
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    if (this.data.index == 0) {
      this.setData({
        crop: "枇杷"
      })
    } else if (this.data.index == 1) {
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