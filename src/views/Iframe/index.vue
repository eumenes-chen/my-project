<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

const iframeSrc = ref('http://localhost:8080')
onMounted(() => {
  console.log('加载了');
  let dom = document.getElementsByClassName('test')[0]
  console.log('dom:',!!dom);
  if(!!dom){
    dom.addEventListener('animationend',()=> {
      // let llkksd = 1;
      let num = 1
      llkksd++;
      console.log('动画结束啦');
    })
    dom.classList.add('do-animation')
  }
})
// 渲染完成
onMounted(() => {
  // 进入页面获取角色列表
})
</script>
<template>
  <div id="Iframe">
    <h3>iframe</h3>
    <!-- <iframe class="iframe-view" :src="iframeSrc"></iframe> -->
    <div class="test"></div>
  </div>
</template>
<style scoped lang="scss">
@import "@/style/index.scss";
#Iframe{
  height: 1000px;
  .iframe-view{
    width: 100%;
    height: 500px;
    background: rgb(241, 255, 255);
  }
  .test{
    width: 400px;
    height: 200px;
    border: 1px solid gray;
    
  }
}
.do-animation {
  animation: animate01 0.5s linear;
}
@keyframes animate01 {
  0% {
    width: 400px;
  }
  100% {
    width: 100px;
  }
}
</style>
