import { request, imgUrl, https, httpsUrl } from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0, 
    array: [{ name: "全部", id: "" }],
    batchId: "",
    batchType: "",
    infoType: "",
    cropInfos: "",
    nextPage: "",
    page: 1,
    limit: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      batchId: options.batchId,
      batchType: options.batchType
    })
    console.log(options)
    this.init();
    if (this.data.batchType == "crop"){
      this.setData({
        array: [
          { name: "全部", id: "" },
          { name: "日常巡查", id: "to_day" },
          { name: "植保投入", id: "protection" },
          { name: "肥料投入", id: "muck" },
          { name: "采收", id: "recovery" }
        ]
      })
    } else if (this.data.batchType == "egg"){
      this.setData({
        array: [
          { name: "全部", id: "" },
          { name: "日常巡查", id: "to_day" },
          { name: "药剂投入", id: "drug_input" },
          { name: "饲料投入", id: "forage" },
          { name: "死淘记录", id: "die" },
          { name: "收获", id: "recovery" }
        ]
      })
    } else if (this.data.batchType == "bee") {
      this.setData({
        array: [
          { name: "全部", id: "" },
          { name: "日常巡查", id: "to_day" },
          { name: "蜂场环境", id: "env" },
          { name: "药剂投入", id: "drug_input" },
          { name: "饲料投入", id: "forage" },
          { name: "收获", id: "recovery" },
          { name: "位置变更", id: "location" }
        ]
      })
    }
  },
  init(){
    request('/app/person/getBatchHistoryInfo', 'post', {
      batchType: this.data.batchType,
      infoType: this.data.infoType,
      page: this.data.page,
      limit: this.data.limit,
      batchId: this.data.batchId
    }).then(res => {
      console.log(res);

      if (res.data.cropInfosResult) {
        this.setData({
          cropInfos: res.data.cropInfosResult.list,
          nextPage: res.data.cropInfosResult.nextPage
        })
      } else if (res.data.eggInfosResult) {
        this.setData({
          cropInfos: res.data.eggInfosResult.list,
          nextPage: res.data.eggInfosResult.nextPage
        })
      } else if (res.data.beeInfosResult) {
        this.setData({
          cropInfos: res.data.beeInfosResult.list,
          nextPage: res.data.beeInfosResult.nextPage
        })
      }
    })
  },
  //下拉选择
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let index = e.detail.value
    this.setData({
      index: index,
      infoType: this.data.array[index].id
    })
    this.init();
  },
  //图片放大功能
  imgBig(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var src = e.currentTarget.dataset.src;//获取data-src/. -p    //图片预览
    var arr = [];
    src.forEach((item,index)=>{
      arr.push(item.img)
    })
    wx.previewImage({
      current: src[index].img, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  //图片放大功能
  imgBig1(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var src = e.currentTarget.dataset.src;//获取data-src/. -p    //图片预览
    var arr = [];
    src.forEach((item, index) => {
      arr.push(item)
    })
    wx.previewImage({
      current: src[index], // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  //点击确认
  configFun() {
    wx.showModal({
      content: '点击确定完成, 信息将不可更改',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
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
  onReachBottom() {
    // 页面被拉到底部
    var that = this
    if (this.data.nextPage == 0) {
      wx.showToast({
        title: '加载完毕',
        icon: 'none'
      })
      return
    }
    request('/app/person/getBatchHistoryInfo', 'post', {
      batchType: this.data.batchType,
      infoType: this.data.infoType,
      page: this.data.nextPage,
      limit: this.data.limit,
      batchId: this.data.batchId
    }).then(res => {
      console.log(res);
      this.setData({
        cropInfos: this.data.cropInfos.concat(res.data.cropInfosResult || res.data.eggInfosResult || res.data.beeInfosResult),
      })
      if (res.data.cropInfosResult) {
        this.setData({
          cropInfos: this.data.cropInfos.concat(res.data.cropInfosResult.list),
          nextPage: res.data.cropInfosResult.nextPage
        })
      } else if (res.data.eggInfosResult) {
        this.setData({
          cropInfos: this.data.cropInfos.concat(res.data.eggInfosResult.list),
          nextPage: res.data.eggInfosResult.nextPage
        })
      } else if (res.data.beeInfosResult) {
        this.setData({
          cropInfos: this.data.cropInfos.concat(res.data.beeInfosResult.list),
          nextPage: res.data.beeInfosResult.nextPage
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})