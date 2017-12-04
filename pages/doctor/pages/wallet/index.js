const { imgDirUrl } = require('../../../../config.js');
const { NetRequest, showTips } = require('../../../../utils/util.js');
const app = getApp();
Page({
  data: {
    iconUrl: `${imgDirUrl}icon/icon_wallet.png`,
  }
})