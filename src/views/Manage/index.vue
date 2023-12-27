<script setup>
import { onMounted, reactive, ref, watchEffect, shallowRef } from "vue";
import { useRouter } from "vue-router";
// import { ElMenu, ElMenuItem, ElSubMenu } from "element-plus";
import Manage1 from "./Manage1.vue";
import Manage3 from "./Manage3.vue";
console.log("组件", Manage1, Manage3);
const componets = {
  Manage1: Manage1,
  Manage3: Manage3,
};

const $router = useRouter();

const menuList = reactive([
  { title: "管理系统1", label: "manage1", component: "Manage1" },
  {
    title: "管理系统2",
    label: "manage2",
    subMenu: [
      { title: "子导航1", label: "child1", component: "Manage1" },
      { title: "子导航2", label: "child2", component: "Manage3" },
    ],
  },
  { title: "管理系统3", label: "manage3", component: "Manage3" },
]);
const activeIndex = ref($router.currentRoute.value.query.active);
const currentComponent = shallowRef(null);
watchEffect(() => {
  let target = null;
  menuList.some((item) => {
    if (item.subMenu && item.subMenu.length > 0) {
      return item.subMenu.some((itm) => {
        if(itm.label === activeIndex.value){
          target = itm;
          return true;
        }
      });
    } else {
      if(item.label === activeIndex.value){
        target = item;
        return true;
      }
    }
  });
  if (target) {
    target = JSON.parse(JSON.stringify(target));
    currentComponent.value = componets[target.component];
  }
});

// 点击menu事件
const handleSelect = (key, keyPath) => {
  activeIndex.value = key;
  $router.push({ query: { active: key } });
};
const init = () => {
  activeIndex.value = activeIndex.value || menuList[0].label;
};
// 渲染完成
onMounted(() => {
  init();
});
</script>
<template>
  <div id="Manage">
    <div class="manage-list">
      <div class="list-container">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          @select="handleSelect"
        >
          <template v-for="item in menuList">
            <el-sub-menu
              v-if="item.subMenu && item.subMenu.length > 0"
              :key="item.label"
              :index="item.label"
            >
              <template #title>{{ item.title }}</template>
              <el-menu-item
                v-for="itm in item.subMenu"
                :key="itm.label"
                :index="itm.label"
              >
                {{ itm.title }}
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :key="item.label" :index="item.label">
              {{ item.title }}
            </el-menu-item>
          </template>
        </el-menu>
      </div>
    </div>
    <div class="manage-view">
      <div class="view-container">
        <!-- <Manage1></Manage1> -->
        <component :is="currentComponent"></component>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "@/style/index.scss";
#Manage {
  height: 100%;
  width: 100%;
  display: flex;
  & > div {
    height: 100%;
    box-sizing: border-box;
    padding: 5px;
    & > div {
      width: 100%;
      height: 100%;
      border-radius: 8px;
      background: rgb(255, 249, 249);
      box-sizing: border-box;
      padding: 10px;
      overflow: hidden;
    }
  }
  .manage-list {
    width: 18%;
    .list-container {
      :deep(.el-menu) {
        background: transparent;
        border: none;
        .el-menu-item,
        .el-sub-menu__title {
          height: 50px;
          font-size: 14px;
          letter-spacing: 2px;
          border-radius: 10px;
          margin-bottom: 5px;
          &:hover {
            background: white;
          }
          &.is-active {
            color: black;
            font-weight: bold;
            background: white;
          }
        }
      }
    }
  }
  .manage-view {
    width: 82%;
  }
}
</style>
