// components/saveimage-btn/saveimage-btn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'default'
    },

    url: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    onSave(){ //保存图片

      let self = this;
      let { url } = self.properties;
      if(!url.trim()) return wx.showToast({
        title: '路径不能为空!',
        image: '/img/prompt.png'
      });

      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.writePhotosAlbum']){  //获取保存到相册权限成功
            self.saveImageToPhotosAlbum(url);
          } else {  //获取保存到相册权限失败
            wx.openSetting({
              success: (res) => {
                if (res.authSetting['scope.writePhotosAlbum']) {
                  self.saveImageToPhotosAlbum(url);
                }
              }
            })
          }
        }
      })

      

    },

    saveImageToPhotosAlbum(url){
      wx.saveImageToPhotosAlbum({
        filePath: url,
        success() {
          wx.showModal({
            title: '保存成功',
            showCancel: false
          })

        },
        fail(res) {
          console.log(res);
          wx.showToast({
            title: '保存失败!',
            image: '/img/prompt.png'
          })
        }

      })
    }
  }
})
