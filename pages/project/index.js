import { request, imgUrl, https, httpsUrl } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
  },
  //页面跳转
  goFun(e){
    let params = e.currentTarget.dataset.params;
    if (wx.getStorageSync('type') == "routingInspection") {
      wx.showToast({
        title: "您无权限进入",
        icon: 'none'
      })
      return
    }
    if (wx.getStorageSync('token')){
      if (wx.getStorageSync('type') == "routingInspection"){
        wx.showToast({
          title: "巡检员无法进入该页面",
          icon: 'none',
          duration: 3000
        })
      }else{
        if (params == "zhongzhi") {
          wx.navigateTo({
            url: '/pages/create/plant-plot-list/index'
          })
        } else if (params == "yangji") {
          wx.navigateTo({
            url: '/pages/create/chicken-plot-list/index'
          })
        } else if (params == "fengmi") {
          wx.navigateTo({
            url: '/pages/create/bee-plot-list/index'
          })
        }
      }
      
    }else{
      wx.showToast({
        title: "您还未登录，请到个人中心登录",
        icon: 'none'
      })
    }
    
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