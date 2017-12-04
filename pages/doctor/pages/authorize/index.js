const { imgDirUrl } = require('../../../../config.js');
const { NetRequest, showTips } = require('../../../../utils/util.js');
const app = getApp();
Page({
  data: {
    showApply: true,
    showSucTips: false,
    showFailTips: true,
    sucIcon: `${imgDirUrl}icon/icon_auth_suc.png`,
  }
})