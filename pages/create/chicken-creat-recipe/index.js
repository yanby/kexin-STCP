import { request, imgUrl, https, httpsUrl } from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    farm: '',
    formula: [{'k':'','v':''}],
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var farms = wx.getStorageSync("farms")
    this.setData({
      farm: farms
    })
  },
  //跳转地块列表页面
  goPlotList() {
    if(this.data.name.trim() == ""){
      wx.showToast({
        title: '请填写饲料名称',
        icon: 'none'
      })
      return
    }
    request('/app/egg/forage/add', 'post', {
      'eggForage.name': this.data.name,
      'eggForage.farm': this.data.farm,
      eggForageFormulas: JSON.stringify(this.data.formula)
    }).then(res => {
      wx.navigateBack()
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  addFormula: function () {
    var that = this;
    var formula = this.data.formula
    let flag = formula.every((item,index)=>{
      return item.k && item.v;
    })
    if (flag){
      formula.push({ 'k': '', 'v': '' })
      that.setData({
        formula: formula
      })
    }    
  },
  delFormula(e){
    console.log(e)
    var index = e.currentTarget.dataset.index;
    this.data.formula.splice(index, 1)
    this.setData({
      formula: this.data.formula
    })
  },
  changeFormula: function(e){
    var num = e.currentTarget.dataset.index
    var k = e.currentTarget.dataset.k
    var v = e.detail.value

    var formula = this.data.formula
    formula[num][k] = v
    this.setData({
      formula: formula
    })
  },
  changeName: function(e){
    this.setData({
      name: e.detail.value
    })
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

  },

  
})