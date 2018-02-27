// pages/find/find.js
let { imgDirUrl } = require('../../../config.js');
const data = {
  wordBgUrl: `${imgDirUrl}word_bg.jpg`,
  wordList: [{
    url: 'make/make',
    text: '以一当百',
    imgPath: `${imgDirUrl}yydb.jpg`,
    pid: 1
  }, {
      url: 'make/make',
      text: '扑朔迷离',
      imgPath: `${imgDirUrl}psml.jpg`,
      pid: 2
  }]
}
Page({
  data,

  onShareAppMessage() {
    return {
      title: '一起制作美图佳句吧'
    }
  }
})