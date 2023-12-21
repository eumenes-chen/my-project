<script setup>
import { RouterLink, RouterView } from "vue-router";
import { onMounted } from "vue";
import Nav from "./components/Nav.vue";

const navList = [
  { title: "首页", route: "home" },
  { title: "计划", route: "weight" },
  { title: "历史", route: "sanguo" },
  { title: "测试", route: "iframe" },
  { title: "管理系统", route: "manage" },
];
onMounted(() => {
  console.log("app的mounted：");
});
</script>

<template>
  <div id="app-view">
    <Nav :navList="navList" />
    <div class="view-container">
      <div class="scroll-container">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/style/index.scss";
#app-view {
  margin: 0;
  padding: 0;
  .view-container {
    width: $container-width;
    margin: 0 auto;
    padding-top: 50px;
    box-sizing: border-box;
    height: 100vh;
    .scroll-container {
      height: 100%;
      max-height: calc(100vh - 50px);
      position: relative;
      width: 100%;    
      overflow-x: clip;
      overflow-y: auto;
      box-sizing: border-box;
    }
  }
}
</style>
