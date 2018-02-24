let { imgDirUrl } = require('../../../../config.js');
const app = getApp();
Page({
  data: {
    canvasWidth: 300,
    canvasHeight: 400,
    avatarUrl: '/img/test_bg.png',
    qrcodeUrl: `${imgDirUrl}/test_qrcode.png`,
    tipsText: '这个头像合适吗',
    targetName: 'suitable',
    right: 0,
    bottom: 0
  },

  onReplace(){
    let cutHeight = 400,
        targetName = this.data.targetName;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      success: function(res) {
        let tempFilePath = res.tempFilePaths[0];
        wx.navigateTo({
          url: `/plugins/wecropper/index?targetName=${targetName}&cutHeight=${cutHeight}&oriImgUrl=${tempFilePath}`,
        })
      }
    })
  },

  onShow(){
    let avatarUrl = app.globalData[this.data.targetName];
    if (avatarUrl){ //如果有裁切的图片，则修改掉
      this.setData({
        avatarUrl: avatarUrl
      });
      app.globalData[this.data.targetName] = null;
    }
  },

  onPreview(){
    let self = this;
    let { avatarUrl, qrcodeUrl, canvasWidth, canvasHeight } = self.data;
    if (/http/.test(qrcodeUrl)){
      wx.downloadFile({
        url: qrcodeUrl,
        success(res){
          qrcodeUrl = res.tempFilePath;
          self.setData({
            qrcodeUrl: qrcodeUrl
          });
          draw();
        },
        fail(){
          draw();
        }
      })
    }else{
      draw();
    }

    function draw(){
      let ctx = wx.createCanvasContext('canvas');

      //先清空画布

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      //画背景图片
      ctx.drawImage(avatarUrl, -200, 0, canvasWidth, canvasHeight );

      //画半透明方块
      ctx.setFillStyle('rgba(0, 0, 0, .46)');
      ctx.fillRect(63, 344, 237, 59);
      
      //画文字
      ctx.setFontSize(23);
      ctx.setFillStyle('#ffffff');
      ctx.fillText('这个头像合适么', 63 + 8, 344 + 38);

      //画二维码

      ctx.drawImage(qrcodeUrl, 63 + 181, 344 + 6, 50, 50);

      ctx.draw();
    }
    
  },

  onTouchStart(e){  //开始滑动
    let { clientX, clientY } = e.touches[0];
    this.setData({
      startX: clientX,
      startY: clientY
    });
  },

  onTouchMove(e) {  //滑动中。。。
    
    let { startX, startY, right, bottom } = this.data;
    let { clientX, clientY } = e.touches[0];
    let movedXExtent = startX - clientX;
    let movedYExtent = startY - clientY;
    if (Math.abs(movedYExtent) < 10) return;
    let resultRight = (right + movedXExtent) < 0 ? 0 : (right + movedXExtent);
    let resultBottom = (bottom + movedYExtent) < 0 ? 0 : (bottom + movedYExtent);
    this.setData({
      bottom: resultBottom,
      startX: clientX,
      startY: clientY
    });
  },

  onTouchEnd(e) {  //滑动结束

  },
})