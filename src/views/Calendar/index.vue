<script setup>
import { computed, onMounted, reactive, ref, watch, markRaw } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";

// 引入组件
import Table from "./table.vue";
import Timeline from "./timeline.vue";
import Chart from "./chart.vue";
// 引入插件
import dayjs from "dayjs";
// // 引入请求
import calendarApi from "../../apis/calendar";

// dayjs().format()
const $router = useRouter();
const $route = useRoute();
const activeName = ref(null); // 激活的tab
const components = reactive({
  table: markRaw(Table),
  timeline: markRaw(Timeline),
  chart: markRaw(Chart),
});

const tabList = reactive({
  list: [
    {
      title: "表格",
      name: "table",
      component: components.table,
      active: false,
    },
    {
      title: "时间线",
      name: "timeline",
      component: components.timeline,
      active: false,
    },
    {
      title: "折线图",
      name: "chart",
      component: components.chart,
      active: false,
    },
  ],
});
// 日期数据
const dateData = reactive({
  dayjs: "", // dayjs
  info: {},
  methods: {
    getDateList: (params) => {
      return getDateList(params);
    },
    changeDate: (params) => {
      return changeDate(params);
    },
    submitHandler: (params) => {
      return submitHandler(params);
    },
  },
});
// 月份数据
const monthData = reactive({
  dayjs: "",
  methods: {
    changeMonth: (params) => {
      return changeMonth(params);
    },
  },
});
// 日期列表数据
const dateList = ref(null);
/**
 * 发起请求日期列表
 * params {{ start:dayjs, end:dayjs }}
 */
const getDateList = (params) => {
  console.log("请求列表");
  calendarApi.getDate(params).then((res) => {
    if (res.code === "200") {
      dateList.value = res.data.list;
      if (!dateData.info.date) {
        let selectDate = dateData.dayjs.format("YYYY-MM-DD");
        let target = dateList.value.find((item) => {
          return item.date === selectDate;
        });
        console.log("target", target);
        if (target.date) {
          changeDate(target);
        }
      }
    }
  });
};
/**
 * 修改当前显示月份
 * params { date:YYYY-MM-DD }
 */
const changeMonth = (params) => {
  monthData.dayjs = dayjs(params);
};
/**
 * 修改当前显示日期，并获取详情
 * params { date:YYYY-MM-DD }
 */
const changeDate = (params) => {
  console.log("选中日期", params);
  dateData.dayjs = dayjs(params.date);
  dateData.info = params;
};
/**
 * 提交日期详情
 * params { obj }
 */
const submitHandler = (params) => {
  console.log("params", params);
  calendarApi.editDate(params).then((res) => {
    if (res.code === "200") {
      ElMessage({
        type: "success",
        message: "保存成功",
      });
      let targetIndex = dateList.value.findIndex((item) => {
        return item.date === params.date;
      });
      if (targetIndex > -1) {
        let changeItem = {
          ...dateList.value[targetIndex],
          ...params,
        };
        dateList.value.splice(targetIndex, 1, changeItem);
      }
    }
  });
};

// 点击tab
const tabsHandler = (e) => {
  let paneName = e.paneName;
  $router.push({ query: { active: paneName } });
};
// 默认选中tab
const initActiveName = () => {
  if ($route.query.active) {
    activeName.value = $route.query.active;
  } else {
    activeName.value = tabList.list[0].name;
    $router.push({ query: { active: activeName.value } });
  }
};

// 初始化日期数据
const initDate = () => {
  let today = dayjs("2024-01-12");
  dateData.dayjs = today;
  monthData.dayjs = today;
};

onMounted(() => {
  initActiveName();
  initDate();
});
</script>

<template>
  <div id="calendar">
    <div class="main">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="tabsHandler">
        <el-tab-pane
          v-for="(item, index) in tabList.list"
          :key="index"
          :label="item.title"
          :name="item.name"
        >
          <component
            :is="item.component"
            :dateData="dateData"
            :monthData="monthData"
            :dateList="dateList"
          ></component>
          {{ index }}
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/style/index.scss";
#calendar {
  height: calc(100vh - 50px);
  // display: flex;
  .main {
    height: 100%;
    margin: 10px 0;
    :deep(.el-tabs) {
      height: 100%;
      display: flex;
      flex-direction: column;
      .el-tabs__header {
        background: $background-color-opacity;
        height: 50px;
        width: 100%;
        margin: 10px 0;
        border-radius: 8px;
        .el-tabs__nav-wrap {
          .el-tabs__nav-scroll {
            .el-tabs__nav {
              height: 50px;
              margin: 0 50px;
              .el-tabs__item {
                letter-spacing: 2px;
                height: 50px;
                line-height: 50px;
              }
            }
          }
        }
      }
      .el-tabs__content {
        width: 100%;
        flex: 1;
        min-height: 600px;
        max-height: 900px;
        // background: $background-color-opacity;
        padding-bottom: 10px;
        .el-tab-pane {
          height: 100%;
        }
      }
    }
  }
}
</style>
