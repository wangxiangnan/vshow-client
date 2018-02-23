// pages/common/previewimage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  onLoad: function (options) {
    let { url } = options;
    if (!url) return wx.showToast({
      title: '路径不能为空!',
      image: '/img/prompt.png'
    });
    this.setData({
      imgUrl: url
    });
  },

  onClick(){
    if (!this.data.imgUrl) return;
    return; //多次点击调用微信预览接口，图片无法正常保存，故先隐藏
    wx.previewImage({
      urls: [this.data.imgUrl],
    })
  },
  onShareAppMessage() {
    return {
      path: '/pages/photo/index'
    }
  }
})