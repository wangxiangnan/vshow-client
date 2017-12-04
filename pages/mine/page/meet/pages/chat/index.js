const { imgDirUrl, getUserInfoUrl, hostUrl } = require('../../../../../../config');
const { NetRequest, showTips } = require('../../../../../../utils/util.js');
const app= getApp();
Page({
  data: {
    avatarUrl: `${imgDirUrl}headimg/8181505803971749.jpg`,
    iconUploadTipsUrl: `${imgDirUrl}icon_upload.png`,
    chatList: [1,2,3,3],
    user: null,
    customer: null,
    inputValue: '',
    isFocus: true,
    chatList: [{
      from: '599ac2ab66c2b45cd0674f2d',
      to: '5999366f80dbfb42073256e6',
      text: '你好啊'
    }, {
      from: '5999366f80dbfb42073256e6',
      to: '599ac2ab66c2b45cd0674f2d',
      text: '很高兴认识你'
    }, {
        from: '599ac2ab66c2b45cd0674f2d',
        to: '5999366f80dbfb42073256e6',
        text: '恩，我也是'
    }]
  },

  onLoad(params){
    let self = this;
    let { id } = params;
    if(!id) return console.error('id无效！');
    NetRequest({
      url: getUserInfoUrl,
      data: {
        id
      },

      success(res){
        //console.log(res);
        let { statusCode, data } = res;
        if (-statusCode === -200){
          !/http/.test(data.avatarUrl) && (data.avatarUrl = hostUrl + data.avatarUrl);
          self.setData({
            customer: data
          });
        }else{
          showTips(data);
        }
      },
      fail(res){
        //console.log(res);
        showTips('获取失败,稍后重试');
      }
    });
    app.getUserInfo(userInfo => {
      self.setData({
        user: userInfo
      });
    });
  },
  sendImg(){
    
  },

  sendText(e){  //发送文字
    //console.log(e);
    let { value } = e.detail;
    let self = this;
    let { chatList, user, customer } = self.data;
    value = value.trim();
    if(!value) return showTips('请填写文字内容');
    wx.sendSocketMessage({
      data: JSON.stringify({
        type: 'chat',
        from: user._id,
        to: customer._id,
        text: value
      })
    });
    chatList.push({
      from: user._id,
      to: customer._id,
      text: value
    });
    self.setData({
      chatList, inputValue: '', isFocus: true

    });
  }
});