import { request, imgUrl, https, httpsUrl } from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
const app = getApp()
//引入插件：微信同声传译
const plugin = requirePlugin("WechatSI")
//获取全局唯一的语音识别管理器recordRecoManager
const manager = plugin.getRecordRecognitionManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "",
    recordState: false, //录音状态
    content: '',//内容
    batchId: "",//批次ID
    listId: "",//列表ID
    txt: "",
    status: "",
    imgs1: [],
    imgs2: [],
    imgs3: [],
    dosage: "",//用药量
    forages: "",//饲料
    index: "",
    name: "",
    batchType: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      batchId: options.batchId
    })
    this.init()
   
  },
  init() {
    request('/app/person/getBatchCard', 'post', {
      batch: this.data.batchId
    }).then(res => {
      console.log(res);
      this.setData({
        imgs1: res.data.organics,
        imgs2: res.data.tests,
        imgs3: res.data.elses
      })
    })
  },
  resultFun(){
    wx.redirectTo({
      url: `/pages/mine/mine-product-add/index?batchId=${this.data.batchId}`,
    })
  },
  //图片放大功能
  imgBig(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var src = e.currentTarget.dataset.src;//获取data-src/. -p    //图片预览
    var arr = [];
    src.forEach((item, index) => {
      arr.push(item.img)
    })
    wx.previewImage({
      current: src[index].img, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
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