import { request, imgUrl, https, httpsUrl } from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { id: 'open_air', value: '露地' },
      { id: 'cold', value: '冷棚' },
      { id: 'warm', value: '暖棚' }
    ],
    farm: '',
    type: '',
    name: '',
    area: '',
    id: '',
    img: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cote = JSON.parse(options.cote)
    this.setData({
      farm: cote.farm,
      type: cote.type,
      name: cote.name,
      img: cote.img,                         
      area: cote.area + '',
      id: cote.id
    })
  },
  //一级点击拍照
  chooseImg() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['camera', 'album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)

        const file = res.tempFiles[0];
        var lastIndex = file.path.lastIndexOf(".");
        var suffix = file.path.substr(lastIndex);

        request('/app/oss/info', 'post', {

        }).then(res1 => {
          console.log(res1)
          wx.showLoading({
            title: '上传中',
            mask: true
          })
          var json = res1.data.oss
          var ossUrl = json.host
          var nameStart = new Date().getTime() + "" + Math.ceil(Math.random() * 100)
          var name = "/" + nameStart + suffix
          var getUrl = json.host + "/" + json.dir + "/" + name

          wx.uploadFile({
            url: res1.data.oss.host, //仅为示例，非真实的接口地址
            filePath: res.tempFilePaths[0],
            name: 'file',
            header: {
              "Access-Control-Allow-Origin": "*"
            },
            formData: {
              "OSSAccessKeyId": json.accessid,
              "policy": json.policy,
              "Signature": json.signature,
              "keys": json.dir + "/",
              "key": json.dir + "/" + name,
              "success_action_status": 200,
              // "callback": json.callback,
              "type": "image/jpeg",
            },
            success: function (res2) {
              console.log(res2)
              wx.hideLoading()

              //重新赋值整个对象

              that.setData({
                img: getUrl
              })
              console.log(that.data.img)
            },
            fail: function (err) {
              console.log(err)
              wx.showToast({
                title: "上传失败",
                icon: 'none'
              })
            }
          })
        })
      }
    })
  },
  //删除图片
  delImg(e) {
    const id = e.target.dataset.id;
    let index = e.target.dataset.index;
    if (id) {
      request('/app/batch/delImgs', 'post', {
        id: id
      }).then(res => {
        console.log(res)

        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        this.init()
      })
    } else {
      this.setData({
        img: ""
      })
    }
  },
  //跳转地块列表
  goPlotList(){
    wx.navigateTo({
      url: '/pages/create/plant-plot-list/index'
    })
  },
  input: function (e) {
    var o = {}
    o[e.target.dataset.k] = e.detail.value
    this.setData(o)
  },
  updateCote: function(){
    console.log(this.data)
    if (this.data.type.trim() == '') {
      wx.showToast({
        title: '请选择类型',
        icon: 'none'
      })
      return
    }
    if (this.data.name.trim() == '') {
      wx.showToast({
        title: '名称不能为空',
        icon: 'none'
      })
      return
    }
    if (this.data.area.trim() == '') {
      wx.showToast({
        title: '请输入面积',
        icon: 'none'
      })
      return
    }
    
    var cote = {
      'coteCrop.name': this.data.name,
      'coteCrop.type': this.data.type,
      'coteCrop.area': this.data.area,
      'coteCrop.farm': this.data.farm,
      'coteCrop.img': this.data.img,
      'coteCrop.id': this.data.id
    }
    request('/app/coteCrop/update', 'post', cote).then(res => {
      wx.navigateBack()
    })
  },
  radioChange: function(e){
    this.setData({
      type: e.detail.value
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