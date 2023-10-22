<script setup>
import { RouterLink, RouterView,useRouter } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'

const router = useRouter();
const navList = [
  { title: '首页', route: 'home' },
  { title: '体重', route: 'weight' },
  { title: '三国', route: 'sanguo' },
]
const chooseNav = (e) => {
  let routerName = e.target.getAttribute('routerName');
  console.log('点击了nav',routerName)
  router.push({path:routerName})
  // VueRouter.push({path:'/weight'})
}
</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->
  <div id="home">
    <div class="nav">
      <div class="nav-list" @click="chooseNav">
        <div class="nav-item" :routerName="item.route" v-for="(item, index) in navList">{{ item.title }}</div>
      </div>
    </div>
    <div class="view-box">
      <RouterView />
    </div>
    
  </div>
</template>

<style scoped lang="scss">
#home {
  height: 100vh;
  width: 1280px;

  .nav {
    width: 100%;
    height: 50px;
    /* background-color: orange; */
    .nav-list {
      height: 100%;
      display: flex;
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
  .view-box{
    height: calc(100vh - 50px);
    overflow: auto;
  }
}

@media (min-width: 1024px) {}</style>
