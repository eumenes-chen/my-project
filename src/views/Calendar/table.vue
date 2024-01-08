<script setup>
import { computed, onMounted, reactive, ref } from "vue";
const weekConfig = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const monthConfig = [
  { title: "一月", totalDays: 31 },
  { title: "二月", totalDays: 28 },
  { title: "三月", totalDays: 31 },
  { title: "四月", totalDays: 30 },
  { title: "五月", totalDays: 31 },
  { title: "六月", totalDays: 30 },
  { title: "七月", totalDays: 31 },
  { title: "八月", totalDays: 31 },
  { title: "九月", totalDays: 30 },
  { title: "十月", totalDays: 31 },
  { title: "十一月", totalDays: 30 },
  { title: "十二月", totalDays: 31 },
];

// 日期数据
const calendarData = reactive({
  list: [
    {
      date: 8,
      day: 1,
    },
  ],
  dateInfo:{
    year:'',
    month:'',
    date:'',
    day:'',
  }
});

/**
 * 根据时间判断当月的天数
 * params { date }
 * return { number }
 */
const getDayNumOfMonth = (date) => {
  let month = date.getMonth();
  let year = date.getFullYear();
  let isYearLeap = year & (4 === 0) && year % 100 !== 0;
  let res = month === 1 && isYearLeap ? 29 : monthConfig[month].totalDays;
  return res;
};

// 表格日历初始化
const initTable = () => {
  let today = new Date();
  getDateInfo(today)
  let lastMonth = new Date(new Date().setMonth(today.getMonth() - 1));
  let dayNumOfMonth = getDayNumOfMonth(today);
  let dayNumOfLastMonth = getDayNumOfMonth(lastMonth);
  let date = today.getDate();
  let day = today.getDay();
  let newList = [];
  // 正向循环
  for (
    var i = date, k = day;
    i <= 31 || (i > dayNumOfMonth && k <= 6);
    i++, k++
  ) {
    k = k > 6 ? 0 : k;
    newList.push({
      date: i > dayNumOfMonth ? i - dayNumOfMonth : i,
      day: k,
    });
  }
  for (let i = date - 1, k = day - 1; i > 0 || (i <= 0 && k >= 0); i--, k--) {
    console.log("循环", i, k);
    k = k < 0 ? 6 : k;
    newList.unshift({
      date: i < 1 ? dayNumOfLastMonth + i : i,
      day: k,
    });
  }
  calendarData.list = newList;
  console.log("list", calendarData.list);
};
/**
 * 根据日期获取该日期内容
 * params { date }
 */
const getDateInfo = (dateInfo) => {
  calendarData.dateInfo.year = dateInfo.getFullYear();
  calendarData.dateInfo.month = dateInfo.getMonth();
  calendarData.dateInfo.date = dateInfo.getDate();
  calendarData.dateInfo.day = dateInfo.getDay();
  console.log(calendarData);
}

/**
 * 改变选中月份
 */
const changeMonth = (type) => {
  
}

onMounted(() => {
  let today = new Date()
  initTable();
});
</script>
<template>
  <div id="calendar-table">
    <div class="left-calendar"></div>
    <div class="center-calendar">
      <div class="table-info">
        <el-button type="primary" class="today-btn">今日</el-button>
        <el-button type="default" class="arrow-btn" @click="changeMonth('prev')">前</el-button>
        <el-button type="default" class="arrow-btn" @click="changeMonth('next')">后</el-button>
        <span class="year-val">{{calendarData.dateInfo.year}}年</span>
        <span class="month-val">{{calendarData.dateInfo.month + 1}}月</span>
      </div>
      <div class="table-zone">
        <div class="calendar-head">
          <div
            class="head-item"
            v-for="(item, index) in weekConfig"
            :key="index"
          >
            {{ item }}
          </div>
        </div>
        <div class="calendar-zone">
          <div
            class="calendar-item"
            v-for="(item, index) in calendarData.list"
            :key="index + '_' + item.date + '_' + item.day"
          >
            {{item.date}}
          </div>
        </div>
      </div>
    </div>
    <div class="right-calendar"></div>
  </div>
</template>

<style scoped lang="scss">
@import "@/style/index.scss";
#calendar-table {
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
    display: flex;
    flex-direction: column;
    .table-info {
      height: 50px;
      width: 100%;
      line-height: 50px;
      padding: 0 30px;
      box-sizing: border-box;
      .today-btn{
        margin:0 20px;
      }
      .arrow-btn{
        margin: 0;
      }
      .year-val{
        margin:0 5px 0 30px;
      }
      span{
        font-weight: bold;
        font-size: 16px;
        color: gray;
      }
    }
    .table-zone {
      width: 100%;
      flex: 1;
      .calendar-head {
        height: 5%;
        width: 100%;
        display: flex;
        .head-item {
          border: 1px solid aqua;
          border-right: none;
          flex: 1;
          text-align: center;
          line-height: 30px;
          font-size: 12px;
          letter-spacing: 2px;
          &:first-of-type {
            border-left: none;
          }
        }
      }
      .calendar-zone {
        height: 95%;
        width: 100%;
        position: relative;
        display: flex;
        flex-wrap: wrap;
        .calendar-item {
          flex: 1;
          min-width: 14%;
          padding: 10px 5px;
          border: 1px solid rgb(172, 255, 255);
          box-sizing: border-box;
        }
      }
    }
  }
  .right-calendar {
    width: 20%;
  }
}
</style>
