const app = getApp();
const { imgDirUrl } = require('../../config');
const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}
Page({
  data: {
    imgUrl: `${imgDirUrl}headimg/8181505803971749.jpg`,
    years,
    year: date.getFullYear(),
    months,
    month: 2,
    days,
    day: 2,
    value: [9999, 1, 1],
    arr: ['https://dev.mumway.com//uploads//20181227/22e86f7ee64928e7b3f32c9738706c57.jpg',2,'33', '2']
  },


  onLoad(){
    //console.log(test1());
  },

  callback(){
    return this.data.imgUrl
  },

  onShareAppMessage(res){
    console.log(res);
  },
  
  _onTapTab(e){
    //console.log(e);
    let { index } = e.detail;
    console.log(index == 0? '您点击是左按钮': '您点击的是右按钮');
  },
  bindChange(e) {
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]]
    })
  },

  onClickBtn(){
    console.log('您点击了安妮IU');
  },

  onConfirm(){
    console.log('您点击了确定');
  }
  
});
