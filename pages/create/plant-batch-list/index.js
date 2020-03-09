import { request, imgUrl, https, httpsUrl } from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plotId: "",//地块Id
    page: 1,//第几页
    limit: 10,//几条
    cropResult: "",//列表
    nextPage: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      plotId: options.plotId
    })
    
  },

  init(){
    request('/app/batch/list', 'post', {
      cote: this.data.plotId,
      crop: "",
      farm: wx.getStorageSync('farms'),
      page: this.data.page,
      limit: this.data.limit,
      batchType: "crop"
    }).then(res => {
      console.log(res);
      this.setData({
        cropResult: res.data.cropResult.list,
        nextPage: res.data.cropResult.nextPage
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //跳转修改批次
  goChangeBatch(e){
    var o = JSON.stringify(e.currentTarget.dataset.o)
    wx.navigateTo({
      url: '/pages/create/plant-change-batch/index?batch=' + o
    })
  },
  //跳转创建批次
  goCreatBatch(){
    wx.navigateTo({
      url: '/pages/create/plant-creat-batch/index?plotId=' + this.data.plotId
    })
  },
  //点击删除
  delFun(e){
    var that = this;
    wx.showModal({
      content: '点击删除， 该信息将不会存在',
      success(res) {
        if (res.confirm) {
          request('/app/batchCrop/del', 'post', {
            // 这里的code就是通过wx.login()获取的
            id: e.currentTarget.dataset.id,
          }).then(res => {
            that.init()
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init()
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
    var that = this
    if (this.data.nextPage == 0) {
      wx.showToast({
        title: '加载完毕',
        icon: 'none'
      })
      return
    }

    request('/app/batch/list', 'post', {
      cote: this.data.plotId,
      crop: "",
      farm: wx.getStorageSync('farms'),
      page: this.data.nextPage,
      limit: this.data.limit,
      batchType: "crop"
    }).then(res => {
      that.setData({
        cropResult: that.data.cropResult.concat(res.data.cropResult.list),
        nextPage: res.data.cropResult.nextPage
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})