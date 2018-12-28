// components/dialog-share/dialog-share.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '恭喜您'
    },

    content: {
      type: String,
      value: '您获得了免费学习的活动名额邀请'
    },

    shareText: {
      type: String,
      value: '立即分享'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showDialog(){
      this.setData({
        isShow: true
      });
    },

    hideDialog(){
      this.setData({
        isShow: false
      });
    },

    onTapMask(){
      this.hideDialog();
    },

    onTapBoard(){
      return;
    }
  }
})
