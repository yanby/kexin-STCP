const imgUrl = "https://kexinfarms.oss-cn-beijing.aliyuncs.com/static";


// const https = "http://192.168.18.236:9002";
const https = "https://eco-pro.cn:9002";
// const https = "http://1d8963n950.iask.in:80";
const httpsUrl = "https://wxfarms.fpchy.com:8085";

// 请求封装
function request (url, method, data, header) {    
  wx.showLoading({  
    title: '加载中',// 数据请求前loading
    mask: true 
  })
  if(method=='get'){  
    header = 'application/json'    
  }else{
    header = 'application/x-www-form-urlencoded'
  }   
  return new Promise((resolve, reject) => {
    wx.request({ 
      url: https + url, // 仅为示例，并非真实的接口地址
      method: method,
      data: data,
      header: { 
        'content-type': header, // 默认值
        // 'token': wx.getStorageSync('token')  
      },  
      success: function (res) {
        wx.hideLoading()
        if(res.data.code == 1){
          resolve(res.data)
          return
        } else if (res.data.code == -11){
          wx.showToast({
            title: "登录过期，请重新登陆",
            icon: 'none',
            duration: 3000
          })
          wx.clearStorageSync()
          wx.redirectTo({
            url: '/pages/mine/index'
          })
          return
        } else if (res.data.code == -22) {
          wx.showToast({
            title: "可信农场暂仅对邀请客户开放，合作请持续关注，敬请谅解。",
            icon: 'none',
            duration: 3000
          })
          return
        }else{
          setTimeout(()=>{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          },500)
          
        }
      },
      fail: function (err) {
        console.log('失败：' + err)
        wx.hideLoading()
        reject(err, false)
      },
      complete: function () {
        wx.hideLoading()
        wx.getNetworkType({
          success(res1) {
            if (res1.networkType == "none"){
              wx.showToast({
                title: "网络不给力，请检查网络",
                icon: 'none',
                duration: 3000
              })
            }
          }
        })
       
      }
    })
  })
}


module.exports = {
  https,
  imgUrl,
  request,
  httpsUrl
}