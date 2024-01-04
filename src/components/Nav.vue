<template>
  <div id="nav">
    <div class="nav-list" @click="chooseNav">
      <div
        :class="{ 'nav-item': true, 'is-active': item.active }"
        :routerName="item.route"
        v-for="(item, index) in navList"
        :key="index"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { onMounted, ref, reactive, watch } from "vue";

const $router = useRouter();
const props = defineProps({
  navList: {
    type: Array,
    default: [],
  },
});
const navList = reactive(props.navList);
const path = ref($router.currentRoute);
// 监听地址路由
watch(path, (newVal) => {
  updateNavList();
});
const init = () => {
};
const chooseNav = (e) => {
  let routerName = e.target.getAttribute("routerName");
  console.log('routerName',routerName);
  $router.push({ name: routerName });
};
// 更新nav选中状态
const updateNavList = () => {
  navList.forEach((item) => {
    let pathReg = new RegExp(item.route);
    item.active = path.value.path.search(pathReg) > -1 ? true : false;
  });
};
onMounted(() => {
  init();
});
</script>

<style scoped lang="scss">
@import "@/style/index.scss";
#nav {
  width: 100%;
  height: 50px;
  position: fixed;

  z-index: 100;
  top: 0;
  /* background-color: orange; */
  .nav-list {
    height: 100%;
    display: flex;
    width: 1280px;
    margin: 0 auto;
    flex-direction: row;
    .nav-item {
      width: 100px;
      text-align: center;
      font-size: 16px;
      line-height: 50px;
      color: rgb(88, 88, 88);
      letter-spacing: 3px;
      margin-right: 10px;
      &:hover {
        font-weight: 800;
        color: rgb(0, 85, 85);
        cursor: pointer;
      }
      &.is-active {
        font-weight: bold;
        border-bottom: 3px solid $background-color-aqua-dark;
      }
    }
  }
}
</style>
