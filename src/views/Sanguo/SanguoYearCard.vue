<script setup>
import { ref, watchEffect } from "vue";

// 接收props
const props = defineProps({
  sanguoYearList: {
    type: Object,
    default: [],
  },
  selectedYear: {
    type: Number,
    default: 191,
  },
});

// 子传父
const emit = defineEmits(["changeYear"]);

// 激活的年份ref
const activeName = ref("");

// 监听父传子数据变化
watchEffect(() => {
  activeName.value = props.selectedYear;
});

// 事件
// 点击年份表（触发子传父）
const changeCollapse = (active) => {
  emit("changeYear", active);
};

// setInterval(() => {
//     console.log('????',activeName);
// },2000)
</script>
<template>
  <div class="year-card">
    <el-collapse v-model="activeName" accordion @change="changeCollapse">
      <el-collapse-item
        v-for="(item, index) in props.sanguoYearList"
        :title="'AD' + item.year + ' ' + item.title"
        :name="item.year"
        :key="index + '-' + item.year"
      >
        <div>
          <div v-if="item.info.length > 0">
            <p v-for="(itm, idx) in item.info" :key="idx + '-' + itm.month">
              {{ itm.month + "月 " + itm.title }}
            </p>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style scoped lang="scss">
.year-card {
  height: 50px;
  width: 100%;
  padding: 0 10px;
}
</style>
