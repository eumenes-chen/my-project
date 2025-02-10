<script setup>
import { onMounted, ref,reactive } from "vue";
function playerState(param) {
  this.name = param.name;
  this.duty = param.duty;
  this.position = { x: 300, y: 300 };
}
playerState.prototype.start = function () {
  console.log("开始start");
};
const worldStateMgr = {
  list: [],
  create: function (param) {
    console.log("param", param);
    const target = this.list.find((item) => {
      return item.name === param.name;
    });
    if (!target) {
      let item = new playerState(param);
      this.list.push(item);
      return item;
    } else {
      return false;
    }
  },
  start: function () {
    console.log("testStateMgr启动", this.list);
  },
};

function worldManager1(str) {
  this.str = str;
  this.init = function () {
    let params = { name: "张三", duty: "医生" };
    this.world = worldStateMgr.create(params);
    console.log("???", this.world);
    if (this.world) {
      this.world.start();
    }
  };
}
function worldManager2(params) {
  this.params = params;
  this.init = function () {
    let params = params;
    console.log('prarms',params);
    this.world = worldStateMgr.create(params);
    console.log("???", this.world);
    if (this.world) {
      this.world.start();
    }
  };
}

let manager1 = null;
let manager2 = null;
const activeName = ref("first");
const handleClick = (tab, event) => {
  console.log(tab, event);
};
onMounted(() => {
  console.log("加载了");
});
let inputInfo = reactive({
  name:'',
  duty:'',
})

function createWorld1() {
  manager1 = new worldManager1(inputInfo);
  manager1.init();
  worldStateMgr.start();
}
function createWorld2() {
  manager2 = new worldManager2(inputInfo);
  manager2.init();
  worldStateMgr.start();
}
function testHandler() {
  console.log('测试',inputInfo);
}
</script>
<template>
  <div id="Test">
    <el-tabs
      v-model="activeName"
      type="card"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="User" name="first">
        <div class="control">
          <el-input v-model="inputInfo.name"></el-input>
          <el-input v-model="inputInfo.duty"></el-input>
          <el-button @click="createWorld1">创建1</el-button>
          <el-button @click="testHandler">测试</el-button>
        </div>
        <div class="main">
          <div class="world"></div>
          <div class="info"></div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Config" name="second">
        <div class="control">
          <el-button @click="createWorld2">创建2</el-button>
        </div>
        <div class="main">
          <div class="world"></div>
          <div class="info"></div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style scoped lang="scss">
@import "@/style/index.scss";
#Test {
  height: 1000px;
  .control {
    height: 30px;
    width: 100%;
    border: 1px solid rgb(218, 218, 218);
    .el-input{
      max-width: 200px;
    }
  }
  .main {
    height: 100%;
    width: 100%;
    display: flex;
    .world {
      width: 90%;
      height: 100%;
      border: 1px solid rgb(218, 218, 218);
    }
    .info {
      width: 10%;
      height: 100%;
      border: 1px solid rgb(218, 218, 218);
    }
  }
}
</style>
