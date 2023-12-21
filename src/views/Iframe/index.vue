<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

const iframeSrc = ref('http://localhost:8080')
// 渲染完成
onMounted(() => {
  // 进入页面获取角色列表
})
</script>
<template>
  <div id="Iframe">
    <h3>iframe</h3>
    <iframe class="iframe-view" :src="iframeSrc"></iframe>
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
}
</style>
