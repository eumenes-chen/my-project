// import TestState from './TestState.js'
const testState = {
  list: [],
  create: function (param) {
    console.log("param", param);
    let item = { name: "张三", duty: "战士" };
    this.list.push(item);
    return item;
  },
  start: function () {
    console.log('开始',this.list);
  },
};

function testManager(app, store) {
  this.app = app;
  this.player = testState.create(params);
  this.player.start();
}
