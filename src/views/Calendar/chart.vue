<script setup>
import * as echarts from "echarts";
import { computed, onMounted, onBeforeUnmount, reactive, ref, watch } from "vue";
// 引入插件
import dayjs from "dayjs";
// 接收props
let props = defineProps({
  dateData: {
    type: Object,
    default: {},
  },
  monthData: {
    type: Object,
    default: {},
  },
  dateList: {
    type: Object,
    default: [],
  },
});
const dateRange = ref("");
// 实际数据
let realList = [];
let planObj = {};
// 计划数据
let planList = [];
// 日期数据
let dateList = [];
// 事件数据
let eventList = [];
const planSetting = [
  { date: "2023-03-01", weight: 157 },
  { date: "2023-05-01", weight: 158 },
  { date: "2023-07-01", weight: 160 },
  { date: "2023-07-01", weight: 160 },
  { date: "2023-08-01", weight: 158 },
  { date: "2023-09-01", weight: 149 },
  { date: "2023-10-01", weight: 140 },
  { date: "2023-11-01", weight: 135 },
  { date: "2023-12-01", weight: 130 },
  { date: "2024-01-10", weight: 125 },
  { date: "2024-02-01", weight: 128 },
  { date: "2024-03-01", weight: 132 },
  { date: "2024-03-20", weight: 135 },
  { date: "2024-04-15", weight: 135 },
  { date: "2024-05-15", weight: 128 },
  { date: "2024-06-15", weight: 122 },
  { date: "2024-06-25", weight: 120 },
  { date: "2024-08-15", weight: 122 },
  { date: "2024-12-01", weight: 125 },
];

// 监听日期(reactive)
watch(props.dateData, (newVal) => {
  console.log("监听日期");
  let start = newVal.dayjs.add(-1, "year").format("YYYY-MM-DD");
  let end = newVal.dayjs.add(5, "month").format("YYYY-MM-DD");
  dateRange.value = [new Date(start), new Date(end)];
  let params = { start, end };
  props.dateData.methods.getDateList(params);
});
watch(
  () => props.dateList,
  (newVal) => {
    console.log("监听到列表变化", newVal);
    initList();
  }
);
// 初始化列表
const initList = () => {
  if (props.dateList) {
    let planArr = [];
    let realArr = [];
    let dateArr = [];
    let eventArr = [];
    props.dateList.forEach((item, index) => {
      if (planObj[item.date]) {
        planArr.push(planObj[item.date].toFixed(2));
      } else {
        planArr.push("");
      }
      if (item.title) {
        eventArr.push({
          coord: [index, item.weight],
          value: item.title,
        });
      }
      realArr.push(item.weight || "");
      dateArr.push(item.date.split("-").join("/"));
    });
    realList = realArr;
    planList = planArr;
    dateList = dateArr;
    eventList = eventArr;
    console.log("planList数据", planList);
    console.log("realList数据", planList);
    console.log("dateList数据", dateList);
    console.log("eventList数据", eventList);
    getChart();
  }
};
// 计算计划
const initPlan = () => {
  let days = "";
  let date = "";
  let weight = "";
  let weightChange = "";
  let obj = {};
  let index = 0;
  for (let i = 0; i < planSetting.length; i++) {
    if (planSetting[i + 1]) {
      days =
        (dayjs(planSetting[i + 1].date).valueOf() -
          dayjs(planSetting[i].date).valueOf()) /
        3600000 /
        24;
      weightChange = (planSetting[i + 1].weight - planSetting[i].weight) / days;
      date = planSetting[i].date;
      weight = planSetting[i].weight;
      index = 0;
      while (days > 0 && index < 1000) {
        obj[date] = weight;
        date = dayjs(date).add(1, "day").format("YYYY-MM-DD");
        weight += weightChange;
        days--;
        index++;
      }
    }
  }
  planObj = obj;
  console.log("测试", planObj);
};
// 获取echarts
const getChart = () => {
  console.log("执行getChart");
  var myChart = echarts.init(document.getElementById("calendar-echart-dom"));
  myChart.setOption({
    tooltip: {
      trigger: "axis",
      position: function (pt) {
        return [pt[0], "10%"];
      },
    },
    title: {
      left: "center",
      text: "减脂计划",
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        restore: {},
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: dateList,
    },
    yAxis: {
      type: "value",
      interval: 5,
      axisLabel: {
        formatter: "{value} 斤",
      },
      scale: true,
      min: 115,
      max: 165,
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 10,
      },
      {
        start: 0,
        end: 10,
      },
    ],
    series: [
      {
        name: "计划体重",
        type: "line",
        symbol: "none",
        sampling: "lttb",
        itemStyle: {
          color: "rgb(255, 70, 131)",
        },
        areaStyle: {
          color: "#ffffff",
        },
        markPoint: {
          symbol: "roundRect",
          symbolOffset: [0, "-140%"],
          itemStyle: {
            color: "#aaa",
          },
          data: eventList,
        },
        markLine: {
          data: [
            { yAxis: 160,label: { formatter: () => "肥胖" } },
            { yAxis: 157.5,label: { formatter: () => "2023" } },
            { yAxis: 155,label: { formatter: () => "益彰后" } },
            { yAxis: 152.5,label: { formatter: () => "居家" } },
            { yAxis: 150,label: { formatter: () => "益彰" } },
            { yAxis: 147.5,label: { formatter: () => "宇" } },
            { yAxis: 145,label: { formatter: () => "待业" } },
            { yAxis: 142.5,label: { formatter: () => "博彦" } },
            { yAxis: 140,label: { formatter: () => "毕业" } },
            { yAxis: 137.5,label: { formatter: () => "设计" } },
            { yAxis: 135,label: { formatter: () => "新寝室" } },
            { yAxis: 132.5,label: { formatter: () => "军训" } },
            { yAxis: 130,label: { formatter: () => "高中" } },
            { yAxis: 127.5,label: { formatter: () => "无氧" } },
            { yAxis: 125,label: { formatter: () => "正常" } },
            { yAxis: 122.5,label: { formatter: () => "偏瘦" } },
            { yAxis: 120,label: { formatter: () => "成功" } },
          ],
        },
        data: planList,
      },
      {
        name: "实际体重",
        type: "line",
        data: realList,
        label: {
          show: true,
          position: "top",
        },
      },
      {
        name: "月份",
        type: "line",
        smooth: true,
        markArea: {
          itemStyle: {
            color: "rgba(255, 173, 177, 0.2)",
          },
          data: [
            [
              {
                name: "8月份",
                xAxis: "2023/8/9",
              },
              {
                xAxis: "2023/8/31",
              },
            ],
            [
              {
                name: "10月份",
                xAxis: "2023/10/1",
              },
              {
                xAxis: "2023/10/31",
              },
            ],
            [
              {
                name: "12月份",
                xAxis: "2023/12/1",
              },
              {
                xAxis: "2023/12/31",
              },
            ],
            [
              {
                name: "2月份",
                xAxis: "2024/2/1",
              },
              {
                xAxis: "2024/2/29",
              },
            ],
          ],
        },
      },
    ],
  });
};
const date2Str = (date) => {
  let newDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return newDate;
};
const changeDate = (value) => {
  let start = date2Str(dateRange.value[0]);
  let end = date2Str(dateRange.value[1]);
  let params = {
    start,
    end,
  };
  props.dateData.methods.getDateList(params);
};
onMounted(() => {
  console.log("chart触发onMounted");
  initPlan();
  // initList();
  // getChart();
});
onBeforeUnmount(() => {
  console.log('销毁');
})
</script>
<template>
  <div id="calendar-chart">
    <div class="top-date">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="changeDate"
      />
    </div>

    <div class="center-calendar">
      <div id="calendar-echart-dom"></div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "@/style/index.scss";
#calendar-chart {
  width: 100%;
  height: 100%;
  // background: $background-color-opacity;
  display: flex;
  flex-direction: column;
  .top-date {
    // height: 50px;
    padding: 10px 40px;
    margin: 0 auto;
  }
  .center-calendar {
    flex: 1;
    margin: 0 10px;
    #calendar-echart-dom {
      flex: 1;
      width: 90%;
      margin: 0 5%;
      padding-bottom: 20px;
      height: calc(100% - 60px);
      background-color: white;
    }
  }
}
</style>
