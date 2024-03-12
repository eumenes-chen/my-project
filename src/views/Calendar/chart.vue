<script setup>
import * as echarts from "echarts";
import { computed, onMounted, onActivated, reactive, ref, watch } from "vue";
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
  { date: "2023-03-01", weight: 160 },
  { date: "2023-10-01", weight: 160 },
  { date: "2023-11-01", weight: 150 },
  { date: "2023-12-01", weight: 140 },
  { date: "2024-02-01", weight: 130 },
  { date: "2024-04-01", weight: 145 },
  { date: "2024-05-01", weight: 130 },
  { date: "2024-08-01", weight: 120 },
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
    console.log("planObj", planObj);
    props.dateList.forEach((item, index) => {
      // console.log('item',item.date);
      if (planObj[item.date]) {
        console.log("执行", item.date);
        planArr.push(planObj[item.date]);
      } else {
        planArr.push("");
      }
      eventArr.push({
        coord: [index, item.weight],
        value: item.title,
      });
      realArr.push(item.weight || "");
      dateArr.push(item.date.split("-").join("/"));
    });
    console.log("realArr", realArr);

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
  // 计算echarts数据
  // let base = +new Date(2023, 7, 8);
  // let oneDay = 24 * 3600 * 1000;
  // let dateList = [];
  // let planData = [];
  // let nowWeight = 155;
  // let k = 3;
  // let aday = 0.5;
  // for (let i = 1; i < 235; i++) {
  //   var now = new Date((base += oneDay));
  //   dateList.push(
  //     [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/")
  //   );
  //   switch (true) {
  //     case nowWeight >= 150:
  //       k = 4;
  //       break;
  //     case nowWeight >= 145:
  //       k = 4;
  //       break;
  //     case nowWeight >= 140:
  //       k = 4;
  //       break;
  //     case nowWeight >= 135:
  //       k = 5;
  //       break;
  //     case nowWeight >= 130:
  //       k = 7;
  //       break;
  //     case nowWeight >= 125:
  //       k = 9;
  //       break;
  //     default:
  //       k = 10;
  //       break;
  //   }
  //   aday = 1 / k;
  //   nowWeight = (nowWeight - aday).toFixed(3);
  //   planData.push(nowWeight > 125 ? nowWeight : 125);
  //   k--;
  // }

  // // 事件列表
  // const eventList = [
  //   { date: "2023/8/13", value: "云" },
  //   { date: "2023/8/16", value: "9" },
  //   { date: "2023/8/22", value: "9" },
  //   { date: "2023/8/26", value: "分离" },
  //   { date: "2023/8/31", value: "兴隆" },
  //   { date: "2023/9/4", value: "中等" },
  //   { date: "2023/9/8", value: "10" },
  //   { date: "2023/9/11", value: "10" },
  //   { date: "2023/9/14", value: "兴隆" },
  //   { date: "2023/9/17", value: "醒悟" },
  //   { date: "2023/9/18", value: "面试" },
  //   { date: "2023/9/23", value: "兴隆" },
  //   { date: "2023/9/24", value: "毕业" },
  //   { date: "2023/9/26", value: "火车" },
  //   { date: "2023/9/27", value: "回齐" },
  //   { date: "2023/9/29", value: "中秋" },
  //   { date: "2023/10/1", value: "国庆" },
  //   { date: "2023/10/7", value: "国庆结束" },
  //   { date: "2023/10/9", value: "兴隆" },
  //   { date: "2023/10/11", value: "香槟" },
  //   { date: "2023/10/13", value: "offer" },
  //   { date: "2023/10/16", value: "失去" },
  //   { date: "2023/10/17", value: "入职" },
  //   { date: "2023/10/18", value: "交房租" },
  //   { date: "2023/10/19", value: "10" },
  //   { date: "2023/10/21", value: "涮肉" },
  //   { date: "2023/10/23", value: "周一" },
  //   { date: "2023/10/28", value: "骑行" },
  //   { date: "2023/10/30", value: "周一" },
  //   { date: "2023/11/6", value: "周一" },
  //   { date: "2023/11/13", value: "周一" },
  //   { date: "2023/11/15", value: "请假" },
  //   { date: "2023/11/20", value: "周一" },
  //   { date: "2023/11/25", value: "加班" },
  //   { date: "2023/11/27", value: "周一" },
  //   { date: "2023/12/15", value: "发工资" },
  //   { date: "2024/1/1", value: "元旦" },
  //   { date: "2024/1/15", value: "发工资" },
  //   { date: "2024/2/10", value: "春节" },
  //   { date: "2024/2/17", value: "结束" },
  // ];
  // // 处理后的事件列表
  // let handleEventList = [];
  // const initEvent = () => {
  //   let eachData = {};
  //   let dataIndex = "";
  //   eventList.forEach((item) => {
  //     dataIndex = dateList.indexOf(item.date);
  //     eachData = {
  //       value: item.value,
  //       coord: [dataIndex, planData[dataIndex]],
  //     };
  //     handleEventList.push(eachData);
  //   });
  // };
  // initEvent();
  // console.log("dateList", dateList);
  // console.log("planData", planData);
  // console.log("事件列表", handleEventList);
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
      min: 110,
      max: 170,
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
            {
              yAxis: 157.5,
              label: {
                formatter: () => "2023",
              },
            },
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
