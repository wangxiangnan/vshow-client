const { NetUploadFile, showTips } = require('../../../../utils/util');
const { editAvatarUrl, hostUrl } = require('../../../../config.js');
const app = getApp();
 class weCropper {
	 
	constructor (params) {
		let self = this
		let { windowWidth, windowHeight} = self.getDevice()

		self.windowWidth = windowWidth
		self.windowHeight = windowHeight

		const pages = getCurrentPages()
		//  获取到当前page上下文

		const pageContext = pages[pages.length - 1]

		Object.assign(self, params)

		//  把this依附在Page上下文的wecropper属性上，便于在page钩子函数中访问
		pageContext.wecropper = self

		self.init()
	}

	getDevice () {
		let self = this
		!self.device && (self.device = wx.getSystemInfoSync())
		return self.device
	}

	init () {
		let self = this
		let { src } = self
		wx.getImageInfo({
			src,
			success (res) {
				let { id, width, height, windowWidth, windowHeight } = self
				let innerAspectRadio = res.width / res.height

				self.croperTarget = src
				self.rectX = 0
				self.baseWidth= width * windowWidth / 750
				self.baseHeight = width * windowWidth / (innerAspectRadio * 750)
				self.rectY = (height * windowWidth / 750 - self.baseHeight) / 2
				self.scaleWidth = self.baseWidth
				self.scaleHeight = self.baseHeight
				self.oldScale = 1

				//  画布绘制图片
				self.ctx = wx.createCanvasContext(id)
				self.ctx.drawImage(src, self.rectX, self.rectY, self.baseWidth, self.baseHeight)
				self.ctx.draw()
			}
		})
	}
	//  图片手势初始监测
	touchStart (e) {
		let self = this
		let xMove, yMove, oldDistance
		let [touch0, touch1] = e.touches

		//计算第一个触摸点的位置，并参照改点进行缩放
		self.touchX = touch0.x
		self.touchY = touch0.y
		self.imgLeft = self.rectX
		self.imgTop = self.rectY

		// 单指手势时触发
		e.touches.length === 1 && (self.timeOneFinger = e.timeStamp)

		// 两指手势触发
		if (e.touches.length >= 2) {
			self.touchX = self.rectX + self.scaleWidth / 2
			self.touchY = self.rectY + self.scaleHeight / 2

			//计算两指距离
			xMove = touch1.x - touch0.x
			yMove = touch1.y - touch0.y
			oldDistance = Math.sqrt(xMove * xMove + yMove * yMove)

			self.oldDistance = oldDistance
		}
	}
	//  图片手势动态缩放
	touchMove (e) {
		let self = this
		let { minScale, maxScale } = self
		let [ touch0, touch1 ] = e.touches
		let xMove, yMove, newDistance

		if (e.timeStamp - self.timeOneFinger < 100) {
			return
		}

		self.rotate && self.ctx.rotate(self.rotate)

		// 单指手势时触发
		if (e.touches.length === 1) {
			//计算单指移动的距离
			self.timeMoveTwo = self.timeMoveTwo || e.timeStamp
			if (e.timeStamp - self.timeMoveTwo < 100) {
				return
			}
			xMove = touch0.x - self.touchX
			yMove = touch0.y - self.touchY

			self.imgLeft = self.rectX + xMove
			self.imgTop = self.rectY + yMove

			self.ctx.drawImage(self.croperTarget, self.imgLeft, self.imgTop, self.scaleWidth, self.scaleHeight)
			self.ctx.draw()
		}
		// 两指手势触发
		if (e.touches.length >= 2) {
			self.timeMoveTwo = e.timeStamp
			// 计算二指最新距离
			xMove = touch1.x - touch0.x
			yMove = touch1.y - touch0.y
			newDistance = Math.sqrt(xMove * xMove + yMove * yMove)

			//  使用0.005的缩放倍数具有良好的缩放体验
			self.newScale =  self.oldScale + 0.005 * (newDistance - self.oldDistance)

			//  设定缩放范围
			self.newScale <= minScale && (self.newScale = minScale)
			self.newScale >= maxScale && (self.newScale = maxScale)

			self.scaleWidth = self.newScale * self.baseWidth
			self.scaleHeight = self.newScale * self.baseHeight
			self.imgLeft =  self.touchX -self.scaleWidth / 2
			self.imgTop = self.touchY - self.scaleHeight / 2

			self.ctx.drawImage(self.croperTarget, self.imgLeft, self.imgTop, self.scaleWidth, self.scaleHeight)
			self.ctx.draw()
		}
	}

	touchEnd (e) {
		let self = this

		self.oldScale = self.newScale || self.oldScale
		self.rectX = self.imgLeft || self.rectX
		self.rectY = self.imgTop || self.rectY
	}

	getCropperImage (pageCtx) {
		let self = this
		let { id } = self
    pageCtx.setData({
      disabled: true,
      btnText: '上传中...'
    });
		wx.canvasToTempFilePath({
			canvasId: id,
			success (res) {
				//console.log(res.tempFilePath)
        let avatarUrl = res.tempFilePath;
        // do something
        NetUploadFile({
          url: editAvatarUrl,
          name: 'avatarUrl',
          filePath: avatarUrl,
          success(res){
            //console.log(res);
            let { statusCode, data } = res;
            //console.log(data);
            if (-statusCode === -200){ //上传成功
              app.globalData.userInfo.avatarUrl = hostUrl + data;
              wx.showToast({
                title: '上传头像成功'
              });
              setTimeout(()=> {
                wx.reLaunch({
                  url: '/pages/mine/index'
                });
              }, 1000);
              
            }else{  //上传失败
              showTips('上传失败,稍后重试');
              pageCtx.setData({
                disabled: false,
                btnText: '上传头像'
              });
            }
          },
          fail(res){
            showTips('网络错误,稍后重试');
            pageCtx.setData({
              disabled: false,
              btnText: '上传头像'
            });
          }
        });
			}
		})
	}
}

const data = {
  id: 'cropper',
  width: 600,
  height: 600,
  minScale: 1,
  maxScale: 2.5,
  disabled: false,
  btnText: '上传头像'
}

Page({
  data,
  touchStart (e) {
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage () {
    this.wecropper.getCropperImage(this)
  },
  uploadTap () {
    let self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        let src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值
        Object.assign(data, { src })
        new weCropper(data)
      }
    })
  },
  onLoad (option) {
    // do something
    console.log();
    let { imgUrl } = option;
    Object.assign(data, { src: imgUrl })
    new weCropper(data)

  }
})
