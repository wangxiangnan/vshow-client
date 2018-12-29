// components/pin-item/pin-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    size: {  //大的是default 小的是mini
      type: String,
      value: 'default'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onJoin(){ //立即参与
      this.trigger('_onJoin');
    }
  }
})
