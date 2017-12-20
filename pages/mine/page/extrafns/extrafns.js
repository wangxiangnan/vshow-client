let { imgDirUrl } = require('../../../../config');
const data = {
  subwayMapUrl: `${imgDirUrl}/subway_map.jpg`,
  fnList: [{
    id: 0,
    title: '北京地铁线路图',
    desc: '2017年最新的北京地铁线路图'
  }, {
      id: 1,
      title: '裁剪工具',
      desc: '裁切正方形图片，制作头像等'
    }, {
      id: 2,
      title: '你问她答',
      desc: '向你的微信好友或群提问问题,快来体验吧！'
    }/*, {
    id: 3,
    title: '寻觅',
    desc: '通过头像遇见更好的遇见吧'
  }*/]
}


Page({
  data,

  tapMedia(e){
    let id = e.currentTarget.id - 0;
    switch(id){
      case 0:   //北京地图
        wx.previewImage({
          urls: [data.subwayMapUrl],
        })
      break;
      case 1:   //图片裁剪
        wx.navigateTo({
          url: '/plugins/wecropper/index',
        })
        break;

      case 2:   //问卷
        wx.navigateTo({
          url: '../vtestpaper/index',
        })
      break;

      case 3:   //探探
        wx.navigateTo({
          url: '../meet/index',
        })
        break;

      
    }
  }
})