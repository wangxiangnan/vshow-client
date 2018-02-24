let { imgDirUrl } = require('../../../../config');
const data = {
  subwayMapUrl: `${imgDirUrl}/subway_map.jpg`,
  fnList: [{
    id: 0,
    title: '为我们代言',
    desc: '生成您的私人代言微V秀海报'
  }, {
      id: 1,
      title: '私信我们',
      desc: '吐槽、建议、赞美、抨击，都可以私信我们'
    }, {
      id: 2,
      title: '最新公告',
      desc: '一些最新动态会在这里展示'
    }]
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
      case 1:   //图片裁剪1
        wx.navigateTo({
          url: '/plugins/wecropper/index',
        })
        break;

      case 2:   //图片裁剪2
        wx.navigateTo({
          url: '/plugins/wecropper/index?cutHeight=400',
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