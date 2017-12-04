const { getQuizListUrl } = require('../../../../config.js');
const { showTips } = require('../../../../utils/util');
const LoadList = require('../../../../utils/loadlist');
const app = getApp();
const resList = new LoadList(getQuizListUrl, 'quizList');

Page({
  data: {
    hasMore: resList.hasMore,
    isLoading: resList.isLoading,
    quizList: []
  },

  onLoad() {
    let self = this;
    resList.init();
  },


  onPullDownRefresh(){
    resList.onPullDownRefresh();
  },

  onReachBottom(){
    resList.onReachBottom();
  }

  
});
