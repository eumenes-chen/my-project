<script setup>
import { onMounted, reactive, ref, watchEffect, shallowRef } from "vue";
import { useRouter } from "vue-router";
// import { ElMenu, ElMenuItem, ElSubMenu } from "element-plus";
import Sanguo from "./Sanguo.vue";
import Date from "./Date.vue";
import Money from "./Money.vue";
const componets = {
  Sanguo: Sanguo,
  Date: Date,
  Money: Money,
};

const $router = useRouter();

const menuList = reactive([
  { title: "三国角色", label: "sanguo", component: "Sanguo" },
  {
    title: "日历",
    label: "calendar",
    subMenu: [
      { title: "日期数据", label: "date", component: "Date" },
      { title: "金额", label: "money", component: "Money" },
    ],
  },
  { title: "管理系统3", label: "money", component: "Money" },
]);
const activeIndex = ref($router.currentRoute.value.query.active);
const currentComponent = shallowRef(null);
watchEffect(() => {
  let target = null;
  menuList.some((item) => {
    if (item.subMenu && item.subMenu.length > 0) {
      return item.subMenu.some((itm) => {
        if (itm.label === activeIndex.value) {
          target = itm;
          return true;
        }
      });
    } else {
      if (item.label === activeIndex.value) {
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
  activeIndex.value =
    activeIndex.value ||
    (menuList[0].subMenu ? menuList[0].label : menuList[0].label);
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
            <!-- 有子项 -->
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
            <!-- 无子项 -->
            <el-menu-item v-else :key="item.label" :index="item.label">
              {{ item.title }}
            </el-menu-item>
          </template>
        </el-menu>
      </div>
    </div>
    <div class="manage-view">
      <div class="view-container">
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
      background: rgba(255, 255, 255, 0.6);
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
            background: rgba(255, 255, 255, 0.8);
          }
          &.is-active {
            color: black;
            font-weight: bold;
            background: rgba(255, 255, 255, 0.8);
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
