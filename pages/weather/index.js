import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
var wxCharts = require('../../utils/wxcharts.js');
const app = getApp()
var lineChart = null;
// packageB/pages/facility-monitor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: {
      baojing: imgUrl + "/baojing.png",
      eryanghuatan: imgUrl + "/eryanghuatan.png",
      guangzhaoQiangdu: imgUrl + "/guangzhao-qiangdu.png",
      kongqiWendu: imgUrl + "/kongqi-wendu.png",
      turangShidu: imgUrl + "/turang-shidu.png",
      turangShuifeng: imgUrl + "/turang-shuifeng.png",
      turangWendu: imgUrl + "/turang-wendu.png",
      tianqi: imgUrl + "/tianqi.png",
      diandao: imgUrl + "/diandao.png"
    },
    lat: "",
    lng: "",
    result: "",
    daily: "",
    aqi: "",
    gaowen: [],
    diwen: [],
    hourlyVal: [],//温度
    hourlyTime: [],//时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    this.setData({
      lat: options.lat,
      lng: options.lng
    })
    this.init()
  },
  init() {
    request('/app/caiyun/request', 'post', {
      token: wx.getStorageSync("token"),
      path: "realtime.json",
      xy: this.data.lng + ',' + this.data.lat
    }).then(res => {
      console.log(res)
      this.setData({
        result: res.data.data.result
      })
      this.yugao()
      this.xiaoshi()
    })
  },
  xiaoshi() {
    var that = this;
    request('/app/caiyun/request', 'post', {
      token: wx.getStorageSync("token"),
      path: "hourly.json",
      xy: this.data.lng + ',' + this.data.lat
    }).then(res => {

      console.log(res)
      var hourlyList = res.data.data.result.hourly.temperature;
      hourlyList.forEach((item,index)=>{
        if(index < 10){
          var time = item.datetime.substr(11);
          this.data.hourlyTime.push(time);
          this.data.hourlyVal.push(item.value);
        }  
      })
      this.setData({
        hourlyTime: this.data.hourlyTime,
        hourlyVal: this.data.hourlyVal
      })
      console.log(this.data.hourlyTime)
      setTimeout(() => {
        that.charts();
      }, 500)
    })
  },
  yugao() {
    var that = this;
    request('/app/caiyun/request', 'post', {
      token: wx.getStorageSync("token"),
      path: "daily.json",
      xy: this.data.lng + ',' + this.data.lat
    }).then(res => {
      console.log(res)
      this.setData({
        daily: res.data.data.result.daily,
        temperature: res.data.data.result.daily.temperature,
        aqi: res.data.data.result.daily.aqi
      })
      this.data.temperature.forEach((item, index) => {
        item.date = new Date(item.date).getDay();
        this.data.gaowen.push(item.max)
        this.data.diwen.push(item.min)
      })
      this.data.aqi.forEach((item, index) => {
        item.date = item.date.slice(5)
      })
      this.setData({
        temperature: this.data.temperature,
        aqi: this.data.aqi,
        gaowen: this.data.gaowen,
        diwen: this.data.diwen
      })
      setTimeout(()=>{
        that.canvasFun();
      },500)

    })
  },
  touchHandler: function (e) {
    lineChart.scrollStart(e);
  },
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  charts() {
    lineChart = new wxCharts({
      canvasId: 'areaCanvas',
      type: 'area',
      categories: this.data.hourlyTime,
      series: [{
        name: '温度',
        color: "#6dcdd1",
        data: this.data.hourlyVal,
        format: function (val) {
          return val.toFixed(2) + '℃';
        }
      }],
      xAxis: {
        disableGrid: false
      },
      yAxis: {
        format: function (val) {
          return val + '℃';
        },
        min: 0
      },
      width: 330,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  canvasFun(){
    // 获取绘图上下文 context
    var context = wx.createContext();
    // 设置描边颜色
    context.setStrokeStyle("#6dcdd1");
    // 设置线宽
    context.setLineWidth(2);
    this.data.gaowen.forEach((item, index) => {
      if (index == 0) {
        context.moveTo(30, 50 - item);
        context.arc(30, 50 - item, 2, 0, 2 * Math.PI);
      } else if (index == 1) {
        context.lineTo(100, 50 - item);
        context.arc(100, 50 - item, 2, 0, 2 * Math.PI);
      } else if (index == 2) {
        context.arc(170, 50 - item, 2, 0, 2 * Math.PI);
        context.lineTo(170, 50 - item);
      } else if (index == 3) {
        context.lineTo(240, 50 - item);
        context.arc(240, 50 - item, 2, 0, 2 * Math.PI);
      } else if (index == 4) {
        context.lineTo(310, 50 - item);
        context.arc(310, 50 - item, 2, 0, 2 * Math.PI);
      }

    })
    // 对当前路径进行描边
    context.stroke();
    wx.drawCanvas({
      canvasId: 'lineCanvas1',
      actions: context.getActions()
    });

    // 获取绘图上下文 context
    var context = wx.createContext();
    // 设置描边颜色
    context.setStrokeStyle("#6dcdd1");
    // 设置线宽
    context.setLineWidth(2);

    this.data.diwen.forEach((item, index) => {
      if (index == 0) {
        context.moveTo(30, 50 - item);
        context.arc(30, 50 - item, 2, 0, 2 * Math.PI);
      } else if (index == 1) {
        context.lineTo(100, 50 - item);
        context.arc(100, 50 - item, 2, 0, 2 * Math.PI);
      } else if (index == 2) {
        context.arc(170, 50 - item, 2, 0, 2 * Math.PI);
        context.lineTo(170, 50 - item);
      } else if (index == 3) {
        context.lineTo(240, 50 - item);
        context.arc(240, 50 - item, 2, 0, 2 * Math.PI);
      } else if (index == 4) {
        context.lineTo(310, 50 - item);
        context.arc(310, 50 - item, 2, 0, 2 * Math.PI);
      }
    })
    // 对当前路径进行描边
    context.stroke();
    wx.drawCanvas({
      canvasId: 'lineCanvas2',
      actions: context.getActions()
    });
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