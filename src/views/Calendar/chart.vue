<script setup>
import * as echarts from "echarts";
import { computed, onMounted,onActivated, reactive, ref } from "vue";
// 减脂成果
const realData = [
  155.6,
  156.7, //8/10
  154.9,
  155.3,
  154.3,
];

// 获取echarts
const getChart = () => {
  console.log("执行getChart", document.getElementById("calendar-echart-dom"), echarts);
  var myChart = echarts.init(document.getElementById("calendar-echart-dom"));
  console.log("myChart", myChart);
  // 计算echarts数据
  let base = +new Date(2023, 7, 8);
  let oneDay = 24 * 3600 * 1000;
  let dateList = [];
  let planData = [];
  let nowWeight = 155;
  let k = 3;
  let aday = 0.5;
  for (let i = 1; i < 235; i++) {
    var now = new Date((base += oneDay));
    dateList.push(
      [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/")
    );
    switch (true) {
      case nowWeight >= 150:
        k = 4;
        break;
      case nowWeight >= 145:
        k = 4;
        break;
      case nowWeight >= 140:
        k = 4;
        break;
      case nowWeight >= 135:
        k = 5;
        break;
      case nowWeight >= 130:
        k = 7;
        break;
      case nowWeight >= 125:
        k = 9;
        break;
      default:
        k = 10;
        break;
    }
    aday = 1 / k;
    nowWeight = (nowWeight - aday).toFixed(3);
    planData.push(nowWeight > 125 ? nowWeight : 125);
    k--;
  }

  // 事件列表
  const eventList = [
    { date: "2023/8/13", value: "云" },
    { date: "2023/8/16", value: "9" },
    { date: "2023/8/22", value: "9" },
    { date: "2023/8/26", value: "分离" },
    { date: "2023/8/31", value: "兴隆" },
    { date: "2023/9/4", value: "中等" },
    { date: "2023/9/8", value: "10" },
    { date: "2023/9/11", value: "10" },
    { date: "2023/9/14", value: "兴隆" },
    { date: "2023/9/17", value: "醒悟" },
    { date: "2023/9/18", value: "面试" },
    { date: "2023/9/23", value: "兴隆" },
    { date: "2023/9/24", value: "毕业" },
    { date: "2023/9/26", value: "火车" },
    { date: "2023/9/27", value: "回齐" },
    { date: "2023/9/29", value: "中秋" },
    { date: "2023/10/1", value: "国庆" },
    { date: "2023/10/7", value: "国庆结束" },
    { date: "2023/10/9", value: "兴隆" },
    { date: "2023/10/11", value: "香槟" },
    { date: "2023/10/13", value: "offer" },
    { date: "2023/10/16", value: "失去" },
    { date: "2023/10/17", value: "入职" },
    { date: "2023/10/18", value: "交房租" },
    { date: "2023/10/19", value: "10" },
    { date: "2023/10/21", value: "涮肉" },
    { date: "2023/10/23", value: "周一" },
    { date: "2023/10/28", value: "骑行" },
    { date: "2023/10/30", value: "周一" },
    { date: "2023/11/6", value: "周一" },
    { date: "2023/11/13", value: "周一" },
    { date: "2023/11/15", value: "请假" },
    { date: "2023/11/20", value: "周一" },
    { date: "2023/11/25", value: "加班" },
    { date: "2023/11/27", value: "周一" },
    { date: "2023/12/15", value: "发工资" },
    { date: "2024/1/1", value: "元旦" },
    { date: "2024/1/15", value: "发工资" },
    { date: "2024/2/10", value: "春节" },
    { date: "2024/2/17", value: "结束" },
  ];
  // 处理后的事件列表
  let handleEventList = [];
  const initEvent = () => {
    let eachData = {};
    let dataIndex = "";
    eventList.forEach((item) => {
      dataIndex = dateList.indexOf(item.date);
      eachData = {
        value: item.value,
        coord: [dataIndex, planData[dataIndex]],
      };
      handleEventList.push(eachData);
    });
  };
  initEvent();

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
      min: 120,
      max: 160,
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
          color: '#ffffff',
        },
        markPoint: {
          symbol: "roundRect",
          symbolOffset: [0, "-140%"],
          itemStyle: {
            color: "#aaa",
          },
          data: handleEventList,
        },
        markLine: {
          data: [
            {
              yAxis: 157.5,
              label: {
                formatter: () => "待业2023",
              },
            },
            {
              yAxis: 155,
              label: {
                formatter: () => "从益彰离职2023",
              },
            },
            {
              yAxis: 152.5,
              label: {
                formatter: () => "疫情居家2022",
              },
            },
            {
              yAxis: 150,
              label: {
                formatter: () => "入职益彰后2022",
              },
            },
            {
              yAxis: 147.5,
              label: {
                formatter: () => "宇动源2022",
              },
            },
            {
              yAxis: 145,
              label: {
                formatter: () => "待业期2021",
              },
            },
            {
              yAxis: 142.5,
              label: {
                formatter: () => "博彦工作2021",
              },
            },
            {
              yAxis: 140,
              label: {
                formatter: () => "千峰学vue2020",
              },
            },
            {
              yAxis: 137.5,
              label: {
                formatter: () => "毕业前2018",
              },
            },
            {
              yAxis: 135,
              label: {
                formatter: () => "大学新寝室2016",
              },
            },
            {
              yAxis: 132.5,
              label: {
                formatter: () => "大一军训",
              },
            },
            {
              yAxis: 130,
              label: {
                formatter: () => "少量无氧，正常饮食",
              },
            },
            {
              yAxis: 127.5,
              label: {
                formatter: () => "大量无氧",
              },
            },
            {
              yAxis: 125,
              label: {
                formatter: () => "全力无氧，多吃",
              },
            },
          ],
        },
        data: planData,
      },
      {
        name: "实际体重",
        type: "line",
        data: realData,
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
onMounted(() => {
  console.log('触发onMounted',document.getElementById('calendar-echart-dom'));
  getChart();

})
onActivated(() => {
  console.log('触发onActivated');
});
</script>
<template>
  <div id="calendar-chart">
    <div class="left-calendar">我是chart</div>
    <div class="center-calendar">
      <div id="calendar-echart-dom"></div>
    </div>
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
    #calendar-echart-dom {
      flex: 1;
      width: 90%;
      margin: 0 5%;
      padding-bottom: 20px;
      height: calc(100% - 60px);
      background-color: white;
    }
  }
  .right-calendar {
    width: 20%;
  }
}
</style>
