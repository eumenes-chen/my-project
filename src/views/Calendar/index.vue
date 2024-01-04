<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

const $router = useRouter();
const path = ref($router.currentRoute);

const tabList = reactive({
  list: [
    { title: "表格", name: "table", active: false },
    { title: "时间线", name: "timeline", active: false },
    { title: "折线图", name: "chart", active: false },
  ],
});

// 监听地址路由
watch(path, (newVal) => {
  let activeName = path.value.name;
  pathHandler(activeName);
});
// 监听路由地址
const pathHandler = (tabName) => {
  tabList.list.forEach(item => {
    if(item.name === tabName){
      item.active = true;
    }else{
      item.active = false;
    }
  })
};
// 切换tab
const changeTab = (tabName) => {
  $router.push({ name: tabName });
};

onMounted(() => {
  let activeName = path.value.name;
  pathHandler(activeName);
});
</script>

<template>
  <div id="calendar">
    <div class="head">
      <ul>
        <li
          v-for="(item, index) in tabList.list"
          :key="index"
          @click="changeTab(item.name)"
          :class="{'active':item.active}"
        >
          {{ item.title }}
        </li>
      </ul>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/style/index.scss";
#calendar {
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  .head {
    height: 50px;
    width: 100%;
    margin: 10px 0;
    border-radius: 8px;
    background: $background-color-opacity;
    ul {
      margin: 0;
      padding: 0 0 0 50px;
      display: flex;
      list-style-type: none;
      li {
        color: rgb(122, 122, 122);
        height: 50px;
        line-height: 50px;
        margin-right: 10px;
        padding: 0 20px;
        letter-spacing: 1px;
        cursor: pointer;
        box-sizing: border-box;
        &:hover {
          border-bottom: 4px solid $background-color-aqua-dark;
          color: $background-color-aqua-dark;
        }
        &.active {
          font-weight: 600;
          border-bottom: 4px solid $background-color-aqua-dark;
          color: $background-color-aqua-dark;
        }
      }
    }
  }
  .main {
    width: 100%;
    flex: 1;
    min-height: 600px;
    max-height: 900px;
    padding-bottom: 10px;
  }
}
</style>
