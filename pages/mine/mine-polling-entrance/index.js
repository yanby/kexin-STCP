import { request, imgUrl, https, httpsUrl } from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    titleActiveId: 0,
    arr: [
      { name: "全部", id: 0 },
      { name: "未巡检", id: 1 },
      { name: "已巡检", id: 2 }
    ],
    routing: "",//true已巡检
    page: 1,//页数
    limit: 10,//几条
    farmsResult: "",
    nextPage: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },
  init() {
    request('/app/routing/getRoutingFarm', 'post', {
      user: wx.getStorageSync('token'),
      routing: this.data.routing,
      page: this.data.page,
      limit: this.data.limit
    }).then(res => {
      console.log(res);
      this.setData({
        farmsResult: res.data.farmsResult.list,
        nextPage: res.data.farmsResult.nextPage
      })
  
    })
  },
  //导航选择
  titleFun(e) {
    console.log(e)
    let id = e.target.dataset.id;
    this.setData({
      titleActiveId: id
    })
    if(id == 0){
      this.setData({
        routing: ""
      })
    }else if(id == 1){
      this.setData({
        routing: false
      })
    } else if (id == 2) {
      this.setData({
        routing: true
      })
    }
    this.init();
  },
  //跳转农场列表
  goList(e){
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/mine/mine-polling-farm/index?id=${id}`
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