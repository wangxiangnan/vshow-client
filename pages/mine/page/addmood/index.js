const { imgDirUrl, sendMoodUrl, hostUrl } = require('../../../../config.js');
const { NetRequest, NetUploadFile, showTips, saveFormId } = require('../../../../utils/util.js');
const app = getApp();
Page({

  data: {
    moodImgUrl: '',
    textNum: 80,
    hasTextNum: 0,
    disabled: false,
    addressName: '',
    address: '',  //位置信息
    upload_Pic: `${imgDirUrl}upload_pic.png`, 
    latitude: -1,
    longitude: -1,
    postText: '发表'
  },

  getLocation(){  //获取位置信息
    let self = this;
    wx.chooseLocation({
      success(res) {
        //console.log(res);
        let { address, name, latitude, longitude } = res;
        self.setData({
          addressName: name,
          address,
          latitude,
          longitude
        });
      },
    })
  },

  onLoad(options){
    let { imgUrl = '' } = options;
    this.setData({
      moodImgUrl: imgUrl
    });
  },

  selImg(){
    let self = this;
    console.log('选择图片');
    wx.chooseImage({
      count: 1,
      success(res){
        console.log(res);
        self.setData({
          moodImgUrl: res.tempFilePaths[0]
        });
      },

      fail(err){
        console.log(err);
      }
    });
  },

  showActionSheet(){
    let that = this;
    let { moodImgUrl } = that.data;
    wx.showActionSheet({
      itemList: ['预览图片', '保存图片', '删除图片'],
      success: function (res) {
        console.log(res.tapIndex);
        switch (res.tapIndex){
          case 0:
            wx.previewImage({
              urls: [moodImgUrl]
            })
          break;
          case 1:
            wx.saveImageToPhotosAlbum({
              filePath: moodImgUrl,
              success(res) {
                showTips('保存成功');
              },
              fail(err){
                console.log();
                console.log(err);
                showTips('保存失败，请重试');
              }
            });
          break;
          case 2:
            that.setData({
              moodImgUrl: ''
            });
          break;
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    });
    
  },

  send(e){
    let self = this;
    let { userInfo } = app.globalData;
    let { formId } = e.detail;
    saveFormId(formId);
    if (!userInfo) return wx.showToast({title: '请先登录'});
    let { moodText } = e.detail.value;
    let { moodImgUrl, addressName, address, latitude, longitude } = self.data;
    moodText = moodText.trim();
    if (!moodText && !moodImgUrl) return wx.showToast({
      title: '说点什么吧',
    });
    self.setData({
      disabled: true,
      postText: '发表中'
    });
    if (moodImgUrl){  //有图片上传时
      NetUploadFile({
        url: sendMoodUrl,
        name: 'moodImg',
        filePath: moodImgUrl,
        formData: {
          moodText,
          addressName,
          address,
          latitude,
          longitude
        },
        success,
        fail
      });
    }else{  //无图片上传
      NetRequest({
        url: sendMoodUrl,
        data: {
          moodText,
          addressName,
          address,
          latitude,
          longitude
        },
        method: 'POST',
        success,
        fail

      });
    }

    function success(res){
      let { statusCode, data } = res;
      //console.log(res);
      statusCode = Number(statusCode);
      if (statusCode === 200){  //发送成功
        //typeof data === 'string' && (data = JSON.parse(data));
        app.globalData.hasNewSpace = true;
        showTips('发表成功', true);
        
      } else if (statusCode === 400){ //未登录
        showTips('未登录!请到我的页面重新登录');
        setTimeout(()=>{
          wx.switchTab({
            url: '/pages/mine/index',
          });
        }, 1500);
      }else{  //其他错误
        showTips('发表失败');
        self.setData({
          disabled: false,
          postText: '发表'
        });
      }
    }

    function fail(res) {
      showTips('发表失败,请检查网络是否畅通');
      self.setData({
        disabled: false,
        postText: '发表'
      });
    }

  }
})