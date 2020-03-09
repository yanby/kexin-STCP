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
    imgs: [],
    dosage: "",//用药量
    name: "",//药剂名称
    object: "",//防治对象
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    app.getRecordAuth()
    //识别语音
    this.initRecord();

   
    this.setData({
      batchId: options.batchId || "",
      listId: options.listId || ""
    })
    if (this.data.listId){
      this.init()
    }
  
  },
  init(){
    request('/app/batchCrop/getRecovery', 'post', {
      id: this.data.listId
    }).then(res => {
      console.log(res)
      
      this.setData({
        date: res.data.recovery.info_time,
        content: res.data.recovery.text,
        imgs: res.data.recovery.imgs,
        dosage: res.data.recovery.recovery_measure,
      })
      
    })
  },
  //下拉选择
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //时间选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  //单位选择
  onePickerChange(e) {
    const val = e.detail.value
    console.log(val)
  },
  //失去焦点
  input: function (e) {
    var o = {}
    o[e.target.dataset.k] = e.detail.value
    this.setData(o)
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
          batchId: that.data.id
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
            
              that.data.imgs.push({img: getUrl})
              //重新赋值整个对象
             
              that.setData({
                imgs: that.data.imgs
              })
              console.log(that.data.imgs)
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
      this.data.imgs.splice(index, 1)
      this.setData({
        imgs: this.data.imgs
      })
    }
  },
 
  //点击确认
  configFun(e){
    var that = this;
    let id = e.target.dataset.id;

    if (this.data.date.trim() == "") {
      wx.showToast({
        title: "请选择巡检日期",
        icon: 'none'
      })
      return
    }

    if(id == 0){
      this.setData({
        status: 0
      })
      this.resultFun();
    }else if(id == 1){
      this.setData({
        status: 1
      })
      wx.showModal({
        content: '点击确定完成, 信息将不可更改',
        success(res) {
          if (res.confirm) {
            that.resultFun();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } 
  },
  //保存
  resultFun(){
    var that = this;
    request('/app/batchCrop/saveRecovery', 'post', {
      "batchCropRecovery.info_time": that.data.date, //农事时间
      "batchCropRecovery.text": that.data.content,//文字信息
      "batchCropRecovery.status": that.data.status,//0 暂存 1 保存
      "imgs": JSON.stringify(that.data.imgs),//0 暂存 1 保存
      "batchCropRecovery.batch_crop": that.data.batchId,//批次id
      "batchCropRecovery.id": that.data.listId,//巡查 id，无id为新增，有id为编辑
      "batchCropRecovery.recovery_measure": that.data.dosage,//药剂量
    }).then(res => {
      console.log(res);
      wx.navigateBack()
    })
  },
  //说点什么
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
    this.setData({
      content: e.detail.value
    })
  },
  // 手动输入内容
  conInput: function (e) {
    this.setData({
      content: e.detail.value,
    })
  },
  //识别语音 -- 初始化
  initRecord: function () {
    const that = this;
    // 有新的识别内容返回，则会调用此事件
    manager.onRecognize = function (res) {
      console.log(res)
    }
    // 正常开始录音识别时会调用此事件
    manager.onStart = function (res) {
      console.log("成功开始录音识别", res)
    }
    // 识别错误事件
    manager.onError = function (res) {
      console.error("error msg", res)
    }
    //识别结束事件
    manager.onStop = function (res) {
      console.log('..............结束录音')
      console.log('录音临时文件地址 -->' + res.tempFilePath);
      console.log('录音总时长 -->' + res.duration + 'ms');
      console.log('文件大小 --> ' + res.fileSize + 'B');
      console.log('语音内容 --> ' + res.result);
      if (res.result == '') {
        wx.showModal({
          title: '提示',
          content: '听不清楚，请重新说一遍！',
          showCancel: false,
          success: function (res) {

          }
        })
        return;
      }
      var text = that.data.content + res.result;
      that.setData({
        content: text
      })
    }
  },
  //语音  --按住说话
  touchStart: function (e) {
    this.setData({
      recordState: true  //录音状态
    })
    // 语音开始识别
    manager.start({
      duration: 30000,
      lang: 'zh_CN',// 识别的语言，目前支持zh_CN en_US zh_HK sichuanhua
    })
  },
  //语音  --松开结束
  touchEnd: function (e) {
    this.setData({
      recordState: false
    })
    // 语音结束识别
    manager.stop();
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