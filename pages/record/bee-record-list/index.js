import { request, imgUrl, https, httpsUrl } from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [
      { name: "日常巡查", id: "to_day" },
      { name: "蜂场环境", id: "env" },
      { name: "药剂投入", id: "drug_input" },
      { name: "饲料投入", id: "forage" },
      { name: "收获", id: "recovery" },
      { name: "位置变更", id: "location" }
    ],
    titleActiveId: "to_day",//导航ID
    batchId: "",
    result: "",
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
      variety: options.variety,
      coteType: options.coteType
    })
    
  },
  init(){
    request('/app/batchBee/list', 'post', {
      batch: this.data.batchId,
      type: this.data.titleActiveId
    }).then(res => {
      console.log(res);
      this.setData({
        result: res.data.toDays || res.data.recoveries || res.data.forages || res.data.drugInputs || res.data.envs || res.data.locations,
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
        url: '/pages/record/bee-result-xuncha/index?listId=' + id
      })
    } else if (this.data.titleActiveId == "drug_input") {
      wx.navigateTo({
        url: '/pages/record/bee-result-yaoji/index?listId=' + id
      })
    } else if (this.data.titleActiveId == "forage") {
      wx.navigateTo({
        url: '/pages/record/bee-result-siliao/index?listId=' + id
      })
    } else if (this.data.titleActiveId == "location") {
      wx.navigateTo({
        url: '/pages/record/bee-result-weizhi/index?listId=' + id
      })
    } else if (this.data.titleActiveId == "recovery") {
      wx.navigateTo({
        url: '/pages/record/bee-result-shouhuo/index?listId=' + id
      })
    } else if (this.data.titleActiveId == "env") {
      wx.navigateTo({
        url: '/pages/record/bee-result-huanjing/index?listId=' + id
      })
    }
    
  },
  //跳转记录页面
  goRecordWrite(){
    if (this.data.titleActiveId == "to_day"){
      wx.navigateTo({
        url: '/pages/record/bee-record-xuncha/index?batchId=' + this.data.batchId
      })
    } else if (this.data.titleActiveId == "drug_input"){
      wx.navigateTo({
        url: '/pages/record/bee-record-yaoji/index?batchId=' + this.data.batchId
      })
    } else if (this.data.titleActiveId == "forage") {
      wx.navigateTo({
        url: '/pages/record/bee-record-siliao/index?batchId=' + this.data.batchId
      })
    } else if (this.data.titleActiveId == "location") {
      wx.navigateTo({
        url: '/pages/record/bee-record-weizhi/index?batchId=' + this.data.batchId
      })
    } else if (this.data.titleActiveId == "recovery") {
      wx.navigateTo({
        url: '/pages/record/bee-record-shouhuo/index?batchId=' + this.data.batchId
      })
    } else if (this.data.titleActiveId == "env") {
      wx.navigateTo({
        url: '/pages/record/bee-record-huanjing/index?batchId=' + this.data.batchId
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
    console.log(11)
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