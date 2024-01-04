<script setup>
import { computed, onMounted, reactive, ref } from "vue";
</script>
<template>
  <div id="calendar-chart">
    <div class="left-calendar">
      我是chart
    </div>
    <div class="center-calendar"></div>
    <div class="right-calendar"></div>
  </div>
</template>

<style scoped lang="scss">
@import "@/style/index.scss";
#calendar-chart {
  width: 100%;
  height: 100%;
  // background: $background-color-opacity;
  display: flex;
  & > div {
    background: $background-color-opacity;
    border-radius: 8px;
    height: 100%;
  }
  .left-calendar {
    width: 8%;
  }
  .center-calendar {
    flex: 1;
    margin: 0 10px;
  }
  .right-calendar {
    width: 20%;
  }
}
</style>