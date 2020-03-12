import { request, imgUrl, https, httpsUrl } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    name: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token: wx.getStorageSync('token'),
      name: wx.getStorageSync('name')
    })
    if (wx.getStorageSync('type') == "routingInspection"){
      this.setData({
        name: "生态诚品"
      })
    }else{
      this.setData({
        name: wx.getStorageSync('name')
      })
    }
  },
  //点击授权按钮
  getPhoneNumber: function (e) {
    var that = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      //用户允许授权
      request('/app/wx/userLogin', 'post', {
        // 这里的code就是通过wx.login()获取的
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        requestAuthCode: this.data.code,
      }).then(res => {
        console.log(res);
        if (!res.data.farmUser){
          wx.showToast({
            title: "暂无农场，无法登录",
            icon: 'none'
          })
          return
        }else{
          wx.setStorageSync('token', res.data.token);
          wx.setStorageSync('farms', res.data.farmUser.farms);
          wx.setStorageSync('type', res.data.farmUser.type);
          wx.setStorageSync('falg', "true");
          this.setData({
            token: res.data.token
          })
        }

        if (res.data.farm){
          this.setData({
            name: res.data.farm.farm_name
          })
          wx.setStorageSync('name', res.data.farm.farm_name);
        }
      })
    }
  },
  
  //跳转历史记录页面
  goHistory(){
    if (wx.getStorageSync('type') == "routingInspection") {
      wx.showToast({
        title: "您无权限进入",
        icon: 'none'
      })
      return
    }
    
    if (wx.getStorageSync('token')){
      wx.navigateTo({
        url: '/pages/mine/mine-history-list/index'
      })
    }else{
      wx.showToast({
        title: "您还未登录，请先登录",
        icon: 'none'
      })
    }
  },
  //跳转农场资质
  goAptitude(){
    if (wx.getStorageSync('type') == "routingInspection") {
      wx.showToast({
        title: "您无权限进入",
        icon: 'none'
      })
      return
    }
    if (wx.getStorageSync('token')) {
      request('/app/person/getCard', 'post', {
        farm: wx.getStorageSync('farms')
      }).then(res => {
        console.log(res);
        this.setData({
          imgs1: res.data.licence,
          imgs2: res.data.attestations,
          imgs3: res.data.elses
        })
        if (res.data.licence == null && res.data.attestations.length == 0 && res.data.elses.length ==0){
          wx.navigateTo({
            url: '/pages/mine/mine-farm-aptitude/index'
          })
        }else{
          wx.navigateTo({
            url: '/pages/mine/mine-farm-aptitude-result/index'
          })
        }
      })
    } else {
      wx.showToast({
        title: "您还未登录，请先登录",
        icon: 'none'
      })
    }
  },
  //跳转产品认证
  goAuthentication(){
    if (wx.getStorageSync('type') == "routingInspection") {
      wx.showToast({
        title: "您无权限进入",
        icon: 'none'
      })
      return
    }
    if (wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '/pages/mine/mine-product-list/index'
      })
    } else {
      wx.showToast({
        title: "您还未登录，请先登录",
        icon: 'none'
      })
    }
    
  },
  //跳转巡检员
  goPolling(){
    if (wx.getStorageSync('type') != "routingInspection") {
      wx.showToast({
        title: "您无权限进入",
        icon: 'none'
      })
      return
    }
    if (wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '/pages/mine/mine-polling-entrance/index'
      })
    } else {
      wx.showToast({
        title: "您还未登录，请先登录",
        icon: 'none'
      })
    }
    
  },
  loginOut(){
    var that = this;
    wx.showModal({
      content: ' 您确定要退出当前登录吗',
      success(res) {
        if (res.confirm) {
          wx.clearStorage()
          that.setData({
            token: ""
          })
          wx.setStorageSync('falg', "false");
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
    wx.setStorageSync('falg', "")
    //后台进入前台
    var that = this
    // 页面显示
    wx.login({
      success(res) {
        that.setData({
          code: res.code
        })
      }
    })
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