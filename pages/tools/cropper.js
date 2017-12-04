const app = getApp();
const Cropper = require('../../utils/cropper');
const cropper = new Cropper();
const data = {
  horiGap: 40,   //横向的间隙
  delHeight: 50,  //减去底部menu的高度


};

Page({
  data,

  onLoad(params) {   //裁切图片的比例，默认为1:1,必须是本地路径或临时路径
    let { scale = '1:1', imgUrl } = params
    cropper.init(scale, imgUrl);
  },

  touchStart(e) {
    cropper.touchStart(e);
  },

  touchMove(e) {
    cropper.touchMove(e);
  },

  touchEnd(e) {
    cropper.touchEnd(e);
  },
  complete() {
    cropper.complete();
  },
  selectImg() {
    cropper.selectImg();
  }
});