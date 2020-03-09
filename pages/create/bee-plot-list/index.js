import { request, imgUrl, https, httpsUrl } from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    page: 1,
    limit: 5,
    cotes: [],
    nextPage: 1,
    farm: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  init() {
    request('/app/coteBee/list', 'post', {
      farm: wx.getStorageSync('farms'),
      page: this.data.page,
      limit: this.data.limit
    }).then(res => {
      console.log(res)
      this.setData({
        cotes: res.data.result.list,
        nextPage: res.data.result.nextPage
      })
    })
  },
  //跳转修改地块
  goChangePlot(e){
    var o = JSON.stringify(e.currentTarget.dataset.o)
    wx.navigateTo({
      url: '/pages/create/bee-change-plot/index?cote=' + o
    })
  },
  //跳转批次列表
  gobatchList(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/create/bee-batch-list/index?plotId=' + id
    })
  },
  //跳转创建地块
  goCreatPlot(){
    wx.navigateTo({
      url: '/pages/create/bee-creat-plot/index?plotId=' + this.data.plotId
    })
  },
  //点击删除
  delFun(e) {
    var that = this;
    wx.showModal({
      content: '点击删除， 该信息将不会存在',
      success(res) {
        if (res.confirm) {
          request('/app/coteBee/del', 'post', {
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

    request('/app/coteBee/list', 'post', {
      farm: wx.getStorageSync('farms'),
      page: this.data.nextPage,
      limit: this.data.limit
    }).then(res => {
      that.setData({
        cotes: that.data.cotes.concat(res.data.result.list),
        nextPage: res.data.result.nextPage
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})