const { imgDirUrl } = require('../../../../config.js');
const { NetRequest, showTips } = require('../../../../utils/util.js');
const app = getApp();



Page({
  
  data: {
    avatarUrl: `${imgDirUrl}headimg/9541506595478812.jpg`,
    avatarUrl2: `${imgDirUrl}headimg/1041507599194622.jpg`,
    prfileBg: `${imgDirUrl}profile_bg.png`,
    isVip: true,
    spriteUrl: `${imgDirUrl}doc_sprite@2x.png`
  }
 
  
})