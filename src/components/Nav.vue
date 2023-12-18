<template>
    <div id="nav">
      <div class="nav-list" @click="chooseNav">
        <div class="nav-item" :routerName="item.route" v-for="(item, index) in navList" :key="index">{{ item.title }}</div>
      </div>
    </div>
</template>

<script setup>

import { RouterLink, RouterView,useRouter } from 'vue-router'
const router = useRouter();
const props = defineProps({
  navList:{
    type:Array,
    default:[]
  }
})
const chooseNav = (e) => {
  let routerName = e.target.getAttribute('routerName');
  console.log('点击了nav',routerName)
  router.push({path:routerName})
  // VueRouter.push({path:'/weight'})
}

</script>

<style scoped lang="scss">
#nav {
    width: 100%;
    height: 50px;
    position: fixed;
    background: rgb(201, 255, 255);
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
        font-size: 20px;
        line-height: 50px;
        &:hover{
          font-weight: 800;
          color: yellowgreen;
          cursor: pointer;
        }
      }
    }
  }
</style>