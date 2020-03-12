import { request, imgUrl, https, httpsUrl } from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { id: 'scattered', value: '散养' },
      { id: 'cage', value: '笼养' },
      { id: 'floor', value: '地面平养' },
      { id: 'net', value: '网上平养' }
    ],
    style_mode: '',
    name: '',
    area: '',
    farm: '',
    id: '',
    img: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cote = JSON.parse(options.cote)
    console.log(cote)
    this.setData({
      style_mode: cote.style_mode,
      name: cote.name,
      area: cote.area + "",
      farm: cote.farm,
      img: cote.img,
      id: cote.id,
      style_mode: cote.style_mode
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
  radioChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      style_mode: e.detail.value
    })
  },
  input: function (e) {
    var o = {}
    o[e.target.dataset.k] = e.detail.value
    this.setData(o)
  },
  //点击确定
  addCote: function () {
    if (this.data.style_mode.trim() == '') {
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
      'coteEgg.name': this.data.name,
      'coteEgg.style_mode': this.data.style_mode,
      'coteEgg.area': this.data.area,
      'coteEgg.img': this.data.img,
      'coteEgg.id': this.data.id
    }
    request('/app/coteEgg/update', 'post', cote).then(res => {
      wx.navigateBack()
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