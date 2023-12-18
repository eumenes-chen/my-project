<script setup>
import { RouterLink, RouterView, useRouter } from "vue-router";
import "./style/index.scss";
import { onMounted } from "vue";
import Nav from "./components/Nav.vue";

const router = useRouter();
const navList = [
  { title: "首页", route: "home" },
  { title: "体重", route: "weight" },
  { title: "三国", route: "sanguo" },
];
const chooseNav = (e) => {
  let routerName = e.target.getAttribute("routerName");
  console.log("点击了nav", routerName);
  router.push({ path: routerName });
  // VueRouter.push({path:'/weight'})
};
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
#app-view {
  // height: 100vh;
  margin: 0;
  padding: 0;
  width: 100%;
  .view-container {
    // height: calc(100vh - 50px);
    width: 1280px;
    margin: 0 auto;
    padding-top: 50px;
    box-sizing: border-box;
    min-height: 100vh;
    overflow: auto;
    .scroll-container{
      height: auto;
      min-height: calc(100vh - 50px);
      position: relative;
      width: 100%;
    }
  }
}

</style>
