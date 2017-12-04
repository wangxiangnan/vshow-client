// pages/mine/page/vspace/index.js
const { hostUrl, imgDirUrl, getMoodListUrl, staticHostUrl, postCommentUrl, sendTempMsgUrl, delMoodUrl } = require('../../../../config.js');
const { NetRequest, showTips, saveFormId } = require('../../../../utils/util');
const LoadList = require('../../../../utils/loadlist');
const app = getApp();
const resList = new LoadList(getMoodListUrl, 'moodList');

Page({
  data: {
    staticHostUrl,
    coverImgUrl: `${imgDirUrl}cover_bg.jpg`, 
    addIconUrl: `${imgDirUrl}add.png`,
    isLoading: false,
    hasMore: false,
    disabled: false,
    sendText: '发送',
    hideReply: true,
    focus: false,
    replyIndex: -1,
    hideTips: true,
    isUpdateList: false,
    navList: [{
      title: '照片',
      num: 233
    }, {
      title: '日志',
      num: 83
      }, {
        title: '说说',
        num: 23
    }, {
      title: '留言',
      num: 43
    }]
  },
  onLoad(params){
    let self = this;
    let { cid, uname, uavatar } = params;
    if(!cid || !uname) return console.error('参数错误');
    wx.setNavigationBarTitle({
      title: uname
    });
    self.setData({
      uname, uavatar
    });
    if (resList.extData && resList.extData['author'] === cid) {
      //console.log('同一个用户');
      resList.init({ author: cid });
    } else {
      //console.log('不同用户');
      resList.init({ author: cid }, true);
    }
    app.getUserInfo(userInfo => {
      self.setData({
        userInfo
      });
    });
   
    
    
  },

  openLocation(e) {
    let { latitude, longitude } = e.currentTarget.dataset;
    wx.openLocation({
      latitude,
      longitude
    })
  },

  showTips(){
    this.setData({
      hideTips: false
    });
  },

  hideTips() {
    this.setData({
      hideTips: true
    });
  },

  commentToSome(e) {
    let { index, name, cid } = e.currentTarget.dataset;
    console.log(index);
    this.setData({
      hideReply: false,
      replyIndex: index,
      replyValue: `@${name}  `,
      focus: true,
      recUserId: cid
    });
  },

  showReply(e){
    let { index } = e.currentTarget.dataset;
    this.setData({
      hideReply: false,
      replyIndex: index,
      focus: true,
      recUserId: ''
    });
  },

  hideReply(){
    this.setData({
      hideReply: true,
      replyValue: '',
      focus: false
    });
  },

  replay(e) {   //saveFormIdUrl
    let { formId, value: { replyText } } = e.detail;
    console.log(e);
    let { userInfo } = app.globalData;
    let self = this;
    let { replyIndex, moodList, recUserId } = self.data;
    let vSpaceId = moodList[replyIndex]._id;
    let cid = recUserId || moodList[replyIndex].author._id;  //接受消息的id
    replyText = replyText.trim();
    saveFormId(formId);
    if (!replyText) return wx.showToast({
      title: '没有输入评论内容'
    }), self.hideReply();
    if (!userInfo) return wx.showToast({
      title: '请先去我的页面登录'
    });
    self.setData({
      disabled: true,
      sendText: '发送中'
    });
    NetRequest({
      url: postCommentUrl,
      method: 'POST',
      data: {
        vSpaceId, comment: replyText
      },
      success(res) {
        console.log(res);
        let { statusCode, data } = res;
        if (-statusCode === -200){ //评论成功

          moodList[replyIndex].comments.push({
            _id: 'test',
            author: {
              _id: userInfo._id,
              nickName: userInfo.nickName,
              avatarUrl: userInfo.avatarUrl
            },
            cont: replyText
          });
          console.log(moodList);
          self.setData({
            hideReply: true, moodList, focus: false, replyValue: ''
          });
          showTips('评论成功', false);
          userInfo._id !== cid && NetRequest({   //限制不能给自己发消息
            url: sendTempMsgUrl,
            data: {
              cid, sendText: replyText, uName: userInfo.nickName
            },
            success(res){
              console.log(res);
            },fail(res){
              console.log(res);
            }
          });
        }else{
          showTips('评论失败', false);
        }

      },

      fail(){
        showTips('评论失败', false);
      },

      complete(res) {
        self.setData({
          disabled: false,
          sendText: '发送'
        });
      }
    });

  },

  bindblur(){  //评论回复，失去焦点时
    this.setData({
      hideReply: true,
      replyValue: '',
      focus: false
    });
  },


  previewImg(e){
    console.log(e);
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
    })
  },


  onPullDownRefresh(){
    resList.onPullDownRefresh();
  },

  onReachBottom(){
    resList.onReachBottom();
  },

  onUnload() {
    this.data.isUpdateList && this.onPullDownRefresh();
    this.setData({ isUpdateList: false });
  },

  delItem(e){
    let { index, id } = e.currentTarget.dataset;  //要删除的索引
    //console.log(index);
    let self = this;
    let { moodList } = self.data;
    wx.showModal({
      title: '是否删除',
      success(res){
        if(res.confirm){
          wx.showLoading({
            title: '删除中',
            mask: true
          });
          NetRequest({   //删除此条目
            url: delMoodUrl,
            data: {
              id
            },
            success(res) {
              let { statusCode } = res;
              if (-statusCode === -200){ //删除成功
                showTips('删除成功');
                moodList.splice(index, 1);
                self.setData({ moodList, isUpdateList: true });
                app.globalData.hasNewSpace = true;
              }else{
                setTimeout(() => {
                  showTips('删除失败,下拉刷新重试');
                }, 1000);
              }
            }, fail(res) {
              setTimeout(() => {
                showTips('删除失败,下拉刷新重试');
              }, 1000);
            },

            complete(){
             wx.hideLoading();
            }
          });
        }
      }
    });
  }

})