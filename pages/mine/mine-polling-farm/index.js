import { request, imgUrl, https, httpsUrl} from '../../../utils/request.js'
import { getNowDate, routerLink } from '../../../utils/common.js'
const app = getApp()

Page({
  data: {
    flag: false,
    model: false,//弹窗
    titleArr: [],
    selectArr: [],
    zuowuArr: [
      { name: "枇杷", id: 0 },
      { name: "山药", id: 1 }
    ],
    plotArr: [],
    selectActiveId: -1,//选项id
    dikuaiId: -1,//地块ID
    zuowuId: -1,//作物ID
    imgUrl:{
      menu: imgUrl + '/menu.png',
    },
    token: "",
    farms: "",//农场ID
    coteType: "",//选择类型
    page:1,
    limit: 10,
    nextPage: "",
    cropResult: "",//种植
    eggResult: "",//蛋鸡
    beeResult: "",//养蜂
    cote: "",//地块id
    crop: "",//作物
    routing: ""
  },

  onLoad(query) {
    this.setData({
      farms: query.id,
      selectArr: [
        { name: "全部地块", id: 0 },
        { name: "全部作物", id: 1 }
      ],
      model: false
    })
    this.init()
  },
  //获取种植类型
  init() {
    var arr = [];
    var title = "";
    request('/app/wx/getCoteInfoByFarm', 'post', {
      farm: this.data.farms
    }).then(res => {
      console.log(res);
      if (res.data.bee == 0 && res.data.egg == 0 && res.data.crop == 0) {
        this.setData({
          flag: true
        })
        return
      }
      if (res.data.crop >= 1) {
        arr.push({ "name": "种植", type: "crop" })
        title = "种植"
      }
      if (res.data.egg >= 1) {
        arr.push({ "name": "蛋鸡", type: "egg" })
        title = "蛋鸡"
      }
      if (res.data.bee >= 1) {
        arr.push({ "name": "养蜂", type: "bee" })
        title = "养蜂"
      }

      if (arr.length != 0) {
        this.setData({
          titleArr: arr,
          coteType: arr[0].type
        })
        this.getBatchIndexInfo()
      } else {
        this.setData({
          flag: true
        })
      }
      //获取列表
      this.list()
    })
  },
  //获取列表信息
  list(){
    request('/app/batch/list', 'post', {
      cote: this.data.cote,//地块id
      crop: this.data.crop,//作物
      farm: this.data.farms,//农场id
      page: this.data.page,//第几页
      limit: this.data.limit,//几条
      batchType: this.data.coteType,
      routing: this.data.routing,//巡检记录
    }).then(res => {
      console.log(res);
    
      if (res.data.cropResult){
        this.setData({
          nextPage: res.data.cropResult.nextPage,
          cropResult: res.data.cropResult.list
        })
      } else if (res.data.eggResult){
        this.setData({
          nextPage: res.data.eggResult.nextPage,
          eggResult: res.data.eggResult.list
        })
      } else if (res.data.beeResult){
        this.setData({
          nextPage: res.data.beeResult.nextPage,
          beeResult: res.data.beeResult.list
        })
      }
     
    })
  },
  
  //获取地块信息
  getBatchIndexInfo(){
    request('/app/batch/getBatchIndexInfo', 'post', {
      farm: this.data.farms,
      coteType: this.data.coteType
    }).then(res => {
      console.log(res);
      this.setData({
        plotArr: res.data
      })
    })
  },
  //跳转天气页面 
  getLocation(){

    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res)
        wx.navigateTo({
          url: `/pages/weather/index?lat=${res.latitude}&lng=${res.longitude}`
        })
      }
    })
  },
  //导航选择
  titleFun(e){
    console.log(e)
    let type = e.target.dataset.type;
    if (type == "crop"){
      this.setData({
        selectArr: [
          { name: "全部地块", id: 0 },
          { name: "全部作物", id: 1 }
        ],
        model: false
      })
    }else{
      this.setData({
        selectArr: [
          { name: "全部地块", id: 0 }
        ],
        model: false
      })
    }
    this.setData({
      coteType: type,
      crop: "",
      cote: "",
      routing: ""
    })
    this.list();
    this.getBatchIndexInfo()
  },
  //地块选择
  dikuaiFun(e){
    console.log(e)
    let id = e.target.dataset.id;
    let name = e.target.dataset.name;
    this.data.selectArr[0].name = name;

    // if(this.data.selectArr.length > 1){
    //   this.data.selectArr[1].name = "全部作物"
    // }
   
    this.setData({
      cote: id,
      model: false,
      dikuaiId: id,
      // zuowuId: -1,
      // crop: "",
      selectActiveId: -1,
      selectArr: this.data.selectArr
    })
    this.list();
  },
  //全部地块
  allDikuaiFun(){
    this.data.selectArr[0].name = "全部地块"

    // if (this.data.selectArr.length > 1) {
    //   this.data.selectArr[1].name = "全部作物"
    // }
   
    this.setData({
      cote: "",
      model: false,
      dikuaiId: -1,
      // zuowuId: -1,
      // crop: "",
      selectActiveId: -1,
      selectArr: this.data.selectArr
    })
    this.list();
  },
  //选项选择
  selectFun(e){
    let id = e.target.dataset.id;
    this.setData({
      selectActiveId: id,
      model: true
    })
  },
  //作物选择
  zuowuFun(e){ 
    let id = e.target.dataset.id;
    let name = e.target.dataset.name;
    this.data.selectArr[1].name = name;
    // if (this.data.selectArr.length > 1) {
    //   this.data.selectArr[0].name = "全部地块"
    // }
   
    this.setData({
      // cote: "",
      crop: name,
      zuowuId: id,
      // dikuaiId: -1,
      model: false,
      selectActiveId: -1,
      selectArr: this.data.selectArr
    })
    this.init();
  },
  //全部作物
  allZuowu(){
    
    this.data.selectArr[0].name = "全部地块"
    // if (this.data.selectArr.length > 1) {
    //   this.data.selectArr[1].name = "全部作物"
    // }
    this.setData({
      // cote: "",
      crop: "",
      zuowuId: -1,
      // dikuaiId: -1,
      model: false,
      selectActiveId: -1,
      selectArr: this.data.selectArr
    })
    this.init();
  },
  //关闭弹窗
  closeModel(){
    this.setData({
      model: false,
      selectActiveId: -1
    })
  },
  //跳转记录
  goRecordwrite(e) {

    let id = e.currentTarget.dataset.id;
    let batchType = e.currentTarget.dataset.batchtype;
    console.log(e)
    wx.navigateTo({
      url: `/pages/mine/mine-history-detail/index?batchId=${id}&batchType=${batchType}`
    })

  },
  //跳转巡检记录页面
  goPollingList(e) {
    let obj = JSON.stringify(e.currentTarget.dataset.obj);

    console.log(obj)
    wx.navigateTo({
      url: `/pages/mine/mine-polling-list/index?obj=${obj}&coteType=${this.data.coteType}`
    })
  },
  onReady() {
    // 页面加载完成
   
  },
  onShow() {
    this.list()
    this.getBatchIndexInfo()
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },    
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
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
    request('/app/batch/list', 'post', {
      cote: this.data.cote,//地块id
      crop: this.data.crop,//作物
      farm: wx.getStorageSync('farms'),//农场id
      page: this.data.nextPage,//第几页
      limit: this.data.limit,//几条
      batchType: this.data.coteType
    }).then(res => {
      console.log(res);

      if (res.data.cropResult) {
        this.setData({
          nextPage: res.data.cropResult.nextPage,
          cropResult: this.data.cropResult.concat(res.data.cropResult.list)
        })
      } else if (res.data.eggResult) {
        this.setData({
          nextPage: res.data.eggResult.nextPage,
          eggResult: this.data.eggResult.concat(res.data.eggResult.list)
        })
      } else if (res.data.beeResult) {
        this.setData({
          nextPage: res.data.beeResult.nextPage,
          beeResult: this.data.beeResult.concat(res.data.beeResult)
        })
      }
    })
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return { title: 'My App', desc: 'My App description', path: 'pages/index/index' };
  },
});
