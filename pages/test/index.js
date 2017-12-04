const app = getApp();
const { imgDirUrl } = require('../../config');
Page({
  data: {
    imgUrl: `${imgDirUrl}headimg/8181505803971749.jpg`
  },

  onLoad(){
    //console.log(test1());
  } 
});

function Foo(){


  return this;
}