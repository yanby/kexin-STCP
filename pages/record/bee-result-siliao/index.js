import { request, imgUrl, https, httpsUrl } from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toDay: "",
    listId: "",
    batchInfo: "",
    status: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      listId: options.listId || ""
    })
    this.init()
  },
  init() {

    request('/app/batchBee/getForage', 'post', {
      id: this.data.listId
    }).then(res => {
      console.log(res)

      this.setData({
        toDay: res.data.forage,
        batchInfo: res.data.batchInfo
      })

      if (res.data.forage.status == 0) {
        this.setData({
          status: true
        })
      }
    })
  
      

   
  },
  //增补信息
  addFun(e){
    var id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '/pages/record/bee-record-siliao/index?listId=' + id
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
  //点击确认
  configFun() {
    var that = this;
    wx.showModal({
      content: '点击确定完成, 信息将不可更改',
      success(res) {
        if (res.confirm) {
          request('/app/batchBee/closureBatchInfo', 'post', {
            id: that.data.listId,
            type: "forage",
          }).then(res => {
            console.log(res);
            wx.navigateBack()
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