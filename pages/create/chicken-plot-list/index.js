import { request, imgUrl, https, httpsUrl } from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    titleActiveId: 0,
    titleArr: [
      { name: "鸡场地块", id: 0 },
      { name: "饲料配方", id: 1 }
    ],
    page1: 1,
    page2: 1,
    limit: 5,
    cotes: [],
    nextPage1: "",
    nextPage2: "",
    farm: '',
    forages: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  initCote: function() {
    request('/app/coteEgg/list', 'post', {
      farm: wx.getStorageSync('farms'),
      page: this.data.page1,
      limit: this.data.limit
    }).then(res => {
      console.log(res)
      this.setData({
        cotes: res.data.result.list,
        nextPage1: res.data.result.nextPage
      })
    })
  },

  //饲料配方列表
  initFirage: function () {
    request('/app/egg/forage/list', 'post', {
      page: this.data.page2,
      limit: this.data.limit,
      farm: wx.getStorageSync('farms'),
    }).then(res => {
      console.log(res)
      this.setData({
        forages: res.data.forages,
        nextPage2: res.data.forages.nextPage
      })
    })
  },
  //点击头部切换
  titleActiveFun(e){
    let id = e.target.dataset.id;
    this.setData({
      titleActiveId: id
    })
    if (id == 0) {
      this.initCote()
    } else {
      this.initFirage()
    }
  },
  //跳转修改地块
  goChangePlot(e){
    var o = JSON.stringify(e.currentTarget.dataset.o)
    wx.navigateTo({
      url: '/pages/create/chicken-change-plot/index?cote=' + o
    })
  },
  //跳转批次列表
  gobatchList(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/create/chicken-batch-list/index?plotId=' + id
    })
  },
  //跳转创建地块
  goCreatPlot(){
    wx.navigateTo({
      url: '/pages/create/chicken-creat-plot/index'
    })
  },
  //跳转饲料配方
  goCreatRecipe(){
    wx.navigateTo({
      url: '/pages/create/chicken-creat-recipe/index'
    })
  },
  //点击删除地块
  delFun(e) {
    var that = this;
    wx.showModal({
      content: '点击删除， 该信息将不会存在',
      success(res) {
        if (res.confirm) {
          request('/app/coteEgg/del', 'post', {
            // 这里的code就是通过wx.login()获取的
            id: e.currentTarget.dataset.id,
          }).then(res => {
            that.initCote()
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //删除饲料
  delForage(e){
    var that = this;
    wx.showModal({
      content: '点击删除， 该信息将不会存在',
      success(res) {
        if (res.confirm) {
          request('/app/egg/forage/del', 'post', {
            // 这里的code就是通过wx.login()获取的
            id: e.currentTarget.dataset.id,
          }).then(res => {
            that.initFirage()
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //编辑饲料
  goChangeForage(e){
    var o = JSON.stringify(e.currentTarget.dataset.o)
    wx.navigateTo({
      url: '/pages/create/chicken-change-recipe/index?cote=' + o
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
    if (this.data.titleActiveId == 0 ){
      this.initCote()
    }else{
      this.initFirage()
    }
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
    
    if (this.data.titleActiveId == 0) {
      console.log(this.data.nextPage1)
      if (this.data.nextPage1 == 0) {
        wx.showToast({
          title: '加载完毕',
          icon: 'none'
        })
        return
      }else{
        request('/app/coteEgg/list', 'post', {
          farm: wx.getStorageSync('farms'),
          page: this.data.nextPage1,
          limit: this.data.limit
        }).then(res => {
          that.setData({
            cotes: that.data.cotes.concat(res.data.result.list),
            nextPage1: res.data.result.nextPage
          })
        })
        return
      } 
    } 

    if (this.data.titleActiveId == 1) {
      if (this.data.nextPage2 == 0) {
        wx.showToast({
          title: '加载完毕',
          icon: 'none'
        })
        return
      } else {
        request('/app/egg/forage/list', 'post', {
          page: this.data.nextPage2,
          limit: this.data.limit,
          farm: wx.getStorageSync('farms'),
        }).then(res => {
          console.log(res)
          this.setData({
            forages: that.data.forages.concat(res.data.forages),
            nextPage2: res.data.result.nextPage
          })
        })
        return
      }
    } 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})