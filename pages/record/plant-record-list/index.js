import { request, imgUrl, https, httpsUrl } from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [
      { name: "日常巡查", id: "to_day" },
      { name: "植保投入", id: "protection" },
      { name: "肥料投入", id: "muck" },
      { name: "采收", id: "recovery" }
    ],
    titleActiveId: "to_day",//导航ID
    batchId: "",
    result: "",
    crop: "",
    variety: "",
    coteType: "",
    status: ""
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      batchId: options.batchId,
      crop: options.crop,
      variety: options.variety,
      coteType: options.coteType
    })
    
  },
  init(){
    request('/app/batchCrop/list', 'post', {
      batch: this.data.batchId,
      type: this.data.titleActiveId
    }).then(res => {
      console.log(res);
      this.setData({
        result: res.data.toDays || res.data.mucks || res.data.recoveries || res.data.protections,
        status: res.data.batch.status
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

    if (this.data.titleActiveId == "to_day") {
      wx.navigateTo({
        url: '/pages/record/plant-result-xuncha/index?listId=' + id
      })
    } else if (this.data.titleActiveId == "protection") {
      wx.navigateTo({
        url: '/pages/record/plant-result-zhibao/index?listId=' + id
      })
    } else if (this.data.titleActiveId == "muck") {
      wx.navigateTo({
        url: '/pages/record/plant-result-feiliao/index?listId=' + id
      })
    } else if (this.data.titleActiveId == "recovery") {
      wx.navigateTo({
        url: '/pages/record/plant-result-caishou/index?listId=' + id
      })
    }
   
  },
  //跳转记录页面
  goRecordWrite(){
    if (this.data.titleActiveId == "to_day"){
      wx.navigateTo({
        url: '/pages/record/plant-record-xuncha/index?batchId=' + this.data.batchId
      })
    } else if (this.data.titleActiveId == "protection"){
      wx.navigateTo({
        url: '/pages/record/plant-record-zhibao/index?batchId=' + this.data.batchId
      })
    } else if (this.data.titleActiveId == "muck") {
      wx.navigateTo({
        url: '/pages/record/plant-record-feiliao/index?batchId=' + this.data.batchId
      })
    } else if (this.data.titleActiveId == "recovery") {
      wx.navigateTo({
        url: '/pages/record/plant-record-caishou/index?batchId=' + this.data.batchId
      })
    }
    
  },
  //点击结束
  resultFun() {
    var that = this;
    wx.showModal({
      content: '点击结束， 该批次将不可再记录和修改',
      success(res) {
        if (res.confirm) {
          request('/app/batch/endBatch', 'post', {
            id: that.data.batchId,
            batchType: that.data.coteType
          }).then(res => {
            wx.showToast({
              title: "全部结束",
              icon: 'none'
            })
            that.init();
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