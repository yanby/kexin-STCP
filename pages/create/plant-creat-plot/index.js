import { request, imgUrl, https, httpsUrl } from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { id: 'open_air', value: '露地' },
      { id: 'cold', value: '冷棚' },
      { id: 'warm', value: '暖棚' }
    ],
    farm: '',
    type: '',
    name: '',
    area: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          farm: res.data.farms
        })
      },
    })
  },
  radioChange: function (e) {
    this.setData({
      type: e.detail.value
    })
  },
  //跳转地块列表
  goPlotList(){
    // wx.navigateTo({
    //   url: '/pages/plant-plot-list/index'
    // })
  },
  addCote(){
    if (this.data.type.trim() == '') {
      wx.showToast({
        title: '请选择类型',
        icon: 'none'
      })
      return
    }
    if (this.data.name.trim() == '') {
      wx.showToast({
        title: '名称不能为空',
        icon: 'none'
      })
      return
    }
    if (this.data.area.trim() == '') {
      wx.showToast({
        title: '请输入面积',
        icon: 'none'
      })
      return
    }
    var cote = {
      'coteCrop.name': this.data.name,
      'coteCrop.type': this.data.type,
      'coteCrop.area': this.data.area,
      'coteCrop.farm': wx.getStorageSync('farms')
    }
    request('/app/coteCrop/add', 'post', cote).then(res => {
      wx.navigateBack()
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  input: function(e){
    var o = {}
    o[e.target.dataset.k] = e.detail.value
    this.setData(o)
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