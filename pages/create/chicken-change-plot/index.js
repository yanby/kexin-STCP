import { request, imgUrl, https, httpsUrl } from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { id: 'scattered', value: '散养' },
      { id: 'cage', value: '笼养' },
      { id: 'floor', value: '地面平养' },
      { id: 'net', value: '网上平养' }
    ],
    style_mode: '',
    name: '',
    area: '',
    farm: '',
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cote = JSON.parse(options.cote)
    console.log(cote)
    this.setData({
      style_mode: cote.style_mode,
      name: cote.name,
      area: cote.area + "",
      farm: cote.farm,
      id: cote.id,
      style_mode: cote.style_mode
    })
   
  },
  radioChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      style_mode: e.detail.value
    })
  },
  input: function (e) {
    var o = {}
    o[e.target.dataset.k] = e.detail.value
    this.setData(o)
  },
  //点击确定
  addCote: function () {
    if (this.data.style_mode.trim() == '') {
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
      'coteEgg.name': this.data.name,
      'coteEgg.style_mode': this.data.style_mode,
      'coteEgg.area': this.data.area,
      'coteEgg.id': this.data.id
    }
    request('/app/coteEgg/update', 'post', cote).then(res => {
      wx.navigateBack()
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