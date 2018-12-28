// components/primaryDialog/primaryDialog.js
Component({
  /**
   * 组件的属性列表
   */
      properties: {
    // 弹窗标题
    title: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题'     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 内容数组
    descArr :{
      type : Array ,
      value : null
    },

    // img数组
    imgArr :{
      type : Array ,
      value : null
    },

    // 弹窗取消按钮文字
    cancelText :{
      type : String ,
      value : '取消'
    },
    // 弹窗确认按钮文字
    confirmText :{
      type : String ,
      value : '确定'
    },

    showClose: {
      type: Boolean,
      value: false
    },

    showCancel: {
      type: Boolean,
      value: true
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
    hideDialog(){
      this.setData({
        isShow: false
      });
    },

    showDialog(){
      this.setData({
        isShow: true
      });
    },

    onCancel(){  //点击取消
      this.hideDialog();
      this.triggerEvent("cancelEvent")
    },

    onConfirm(){  //点击确定
      this.triggerEvent("confirmEvent")
    }
  }
})
