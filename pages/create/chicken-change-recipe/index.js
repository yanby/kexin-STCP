import { request, imgUrl, https, httpsUrl } from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    farm: '',
    formula: [{ 'k': '', 'v': '' }],
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var cote = JSON.parse(options.cote)
    this.setData({
      name: cote.name,
      id: cote.id,
      formula: cote.eggForageFormulas
    })
  },
  //跳转地块列表页面
  goPlotList() {
    console.log(this.data.formula)
    if (this.data.name.trim() == "") {
      wx.showToast({
        title: '请填写饲料名称',
        icon: 'none'
      })
      return
    }
    request('/app/egg/forage/update', 'post', {
      'eggForage.name': this.data.name,
      'eggForage.id': this.data.id,
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
    let flag = formula.every((item, index) => {
      return item.k && item.v;
    })
    if (flag) {
      formula.push({ 'k': '', 'v': '' })
      that.setData({
        formula: formula
      })
    }
  },
  delFormula(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    if(id){
      request('/app/egg/forage/delEggForageFormulas', 'post', {
        id: id
      }).then(res => {
        console.log(res)
        this.data.formula.forEach((item, index) => {
          if (item.id == id) {
            this.data.formula.splice(index, 1)
            this.setData({
              formula: this.data.formula
            })
          }
        })
      })
    }else{
      this.data.formula.splice(index, 1)
      this.setData({
        formula: this.data.formula
      })
    }
    
    
  },
  changeFormula: function (e) {
    var num = e.currentTarget.dataset.index
    var k = e.currentTarget.dataset.k
    var v = e.detail.value

    var formula = this.data.formula
    formula[num][k] = v
    this.setData({
      formula: formula
    })
  },
  changeName: function (e) {
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