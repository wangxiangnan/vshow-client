let { imgDirUrl } = require('../../config.js');
const data = {
  icon_saw: imgDirUrl + 'eye.png',
  photoList: [
    /*{
      url: 'handwritten/index',
      avatarUrl: '/img/avatar.jpg',
      text: '美图佳句',
      imgPath: `${imgDirUrl}handwritten.png`,
      sawNum: 0,
      time: '2018-02-23',
      pid: 0
    },*/{
      url: 'handwritten/index',
      avatarUrl: '/img/avatar.jpg',
      text: '个性涂鸦',
      imgPath: `${imgDirUrl}handwritten.png`,
      sawNum: 0,
      time: '2018-02-23',
      pid: 1
    },{
    url: 'speciallist/index',
    avatarUrl: '/img/avatar.jpg',
    text: '创意工厂',
    imgPath: `${imgDirUrl}banner_factory.jpg`,
    sawNum: 0,
    time: '2017-09-26',
    pid: 2
  },{
    url: 'makeword/index',
      avatarUrl: '/img/avatar.jpg',
      text: '文字转图',
      imgPath: `${imgDirUrl}wenzi.jpg`,
      sawNum: 0,
      time: '2017-09-15',
      pid: 3
    },{
      url: 'makeletter/makeletter',
      avatarUrl: '/img/avatar.jpg',
      text: '见字如面',
      imgPath: `${imgDirUrl}jzrm_1.jpg`,
      sawNum: 0,
      time: '2017-06-27',
      pid: 4
    }, {
      url: 'makebarrage/makebarrage?title=疯狂弹幕',
      avatarUrl: '/img/avatar.jpg',
      text: '疯狂弹幕',
      imgPath: `${imgDirUrl}tanmu_1.jpg`,
      sawNum: 0,
      time: '2017-04-20',
      pid: 5
    }/*, {
      url: 'make/make',
      avatarUrl: '',
      text: '创意涂鸦',
      imgPath: `${imgDirUrl}cyty.jpg`,
      pid: 4
    }*/]
}
Page({
  data,

  onLoad(){
    wx.getShareInfo({
      shareTicket: '',
    })

    wx.showShareMenu({
      withShareTicket: true
    })
  },

  onShow(){
    let self = this;
    wx.getStorage({
      key: 'photoListSawNums',
      success: function(res) {
        let [sawNum0 = 0, sawNum1 = 0, sawNum2 = 0] = res.data;
        console.log(res);
        self.setData({
          'photoList[0].sawNum': sawNum0,
          'photoList[1].sawNum': sawNum1,
          photoListSawNums: res.data
        });
      },
      fail(){
        let init = [0, 0, 0, 0, 0];
        wx.setStorage({
          key: 'photoListSawNums',
          data: init,
          success(){
            self.setData({
              photoListSawNums: init
            });
            init = null;
          }
        })
      }
    })
  },

  onShareAppMessage(){
    return({
      title: '一起来体验吧',
      path: 'pages/photo/index',
      success(res){
        console.log(res);
      }
    });
  },

  recSawNum(e){
    let self = this;
    let { index } = e.currentTarget.dataset;
    let { photoListSawNums } = self.data;
    photoListSawNums[index]++;
    wx.setStorage({
      key: 'photoListSawNums',
      data: photoListSawNums,
    })
  }
})
