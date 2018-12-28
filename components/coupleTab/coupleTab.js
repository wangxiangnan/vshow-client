// components/dbTabs/dbTabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

    activeColor: {
      type: String,
      value: '#FF4071'
    },

    leftText: {
      type: String,
      value: '课程介绍'
    },

    rightText: {
      type: String,
      value: '目录'
    },

    defaultIndex: {
      type: Number,
      value: 0
    }
    
  },

  data: {
    activeIndex: 0
  },

  ready(){
    this.setData({
      activeIndex: this.properties.defaultIndex
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapTab(e){  //点击tab , 左为index=0， 右为index=1
      //console.log(e.currentTarget.dataset);
      let { index } = e.currentTarget.dataset;
      this.triggerEvent("onTapTab", {index});
      this.setData({
        activeIndex: index
      });
    }
  }
})
