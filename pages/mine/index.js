const app = getApp();
let { imgDirUrl, editAvatarUrl, hostUrl } = require('../../config.js');
let { NetUploadFile } = require('../../utils/util');
Page({
  data: {
    defaultAvatarUrl: `${imgDirUrl}defalt_avatar.png`,
    userInfo: null,
    bgPic: `${imgDirUrl}mine_bg.jpg`,
    mineList: [{
      id: 1,
      name: '更多功能',
      bgColor: '#fe6a6a',
      url: './page/extrafns/extrafns',
      icon: `${imgDirUrl}wwx_cy.png`
    }, {
      id: 2,
      name: 'V秀场',
      bgColor: '#ffa648',
      url: './page/vspace/index',
      icon: `${imgDirUrl}wwx_sy.png`
      }, {
        id: 3,
        name: '小秘密',
        bgColor: '#6cacf4',
        url: './page/secret/index',
        icon: `${imgDirUrl}wwx_zp.png`
      }, {
        id: 4,
        name: '联系微V秀',
        bgColor: '#b4e087',
        url: './page/aboutus/aboutus',
        icon: `${imgDirUrl}wwx_fx.png`
      }]
  },

  updateWechatAvatar(avatarUrl){
    console.log('开始替换图片');
    wx.getUserInfo({
      success(res){
        console.log('替换图片');
        wx.downloadFile({
          url: res.userInfo.avatarUrl,
          success(res) {
            NetUploadFile({
              url: editAvatarUrl,
              name: 'avatarUrl',
              filePath: res.tempFilePath,
              success(res) {
                console.log(res);
                let { statusCode, data } = res;
                //console.log(data);
                if (-statusCode === -200) { //上传成功
                  app.globalData.userInfo.avatarUrl = hostUrl + data;
                }
              }
            });
          }
        })
      }
    })
    
    
  },

  onLoad(){
    let self = this;
    app.getUserInfo(userInfo => {
      if(userInfo === null) return;
      self.setData({
        userInfo
      });      
      /qlogo/.test(userInfo.avatarUrl) && self.updateWechatAvatar();  //如果不是自己服务器的图片则更新最新微信头像
    });

    wx.getStorage({
      key: 'bgPicPath',
      success: function(res) {
        let bgPicPath = res.data;
        self.setData({ bgPic: bgPicPath });
      },
    })

    //创建animation
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
      delay: 500,
      transformOrigin: '50% 50% 0'
    });
    
  },

  onLogin(e){
    let self = this;
    console.log(e);
    if (e.detail.userInfo){
      app.getUserInfoAgain(userInfo => {
        self.setData({
          userInfo
        });
      });
    }
  },

  getUserInfo(){
    let self = this;
    app.getUserInfo(userInfo => {
      self.setData({
        userInfo
      });
    });
  },

  tapAvatar(){
    if(!app.globalData.userInfo) return console.error('未登录');
    wx.showModal({
      title: '是否上传头像',
      success(res){
        if(res.confirm){  //确定替换
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            success(res) { //res.tempFilePaths
              wx.navigateTo({
                url: './page/cropper/index?imgUrl=' + res.tempFilePaths[0]
              })
            },
          })
        } else if (res.cancel){  //取消替换

        }
      }
    })
  },

  replaceBgPic(){
    let self = this;
    wx.showModal({
      title: '更换背景图片',
      success(res){
        if(res.confirm){
          wx.chooseImage({
            count: 1,
            success: function (res) {
              let bgPicPath = res.tempFilePaths[0];
              wx.getStorage({
                key: 'bgPicPath',
                success: function(res) {
                  wx.removeSavedFile({
                    filePath: res.data,
                    complete(res){
                      console.log(res);
                    }
                  })
                },
              })

              wx.saveFile({
                tempFilePath: bgPicPath,
                success(res){
                  let savePath = res.savedFilePath;
                  wx.setStorage({
                    key: 'bgPicPath',
                    data: savePath,
                  })
                  self.setData({ bgPic: savePath });
                }
              })
              
              
            }
          })
        }else if(res.cancel){
          console.log('取消更换');
        }
      }
    })
    
  }
})