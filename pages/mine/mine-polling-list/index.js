import { request, imgUrl, https, httpsUrl } from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    batchId: "",
    result: "",
    coteType: "",
    obj: "",
    status: ""
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.obj)
    var o = JSON.parse(options.obj)
    this.setData({
      // batchId: options.batchId,
      batchId: o.id,
      coteType: options.coteType,
      obj: options.obj
    })
  },
  init(){
    request('/app/routing/getRoutingList', 'post', {
      batch: this.data.batchId,
      type: this.data.coteType
    }).then(res => {
      console.log(res);
      this.setData({
        result: res.data.routings,
        status: res.data.status
      })
    })
  },
  //导航选择
  titleFun(e) {
    let id = e.target.dataset.id;
    this.setData({
      titleActiveId: id
    })
    this.init();
  },
  //跳转记录结果
  recordResult(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    wx.navigateTo({
      url: `/pages/mine/mine-polling-result/index?listId=${id}`
    })
  },
  //跳转记录页面
  goRecordWrite(){
    wx.navigateTo({
      url: `/pages/mine/mine-polling-record/index?obj=${this.data.obj}&coteType=${this.data.coteType}`
    })
  },
  //点击结束
  resultFun(){
    var that = this;
    wx.showModal({
      content: '点击结束， 该批次将不可再记录和修改',
      success(res) {
        if (res.confirm) {
          request('/app/routing/endRouting', 'post', {
            id: that.data.batchId,
            batchType: that.data.coteType
          }).then(res => {
            console.log(res);
            wx.showToast({
              title: "全部结束",
              icon: 'none'
            })
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
    this.init();
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