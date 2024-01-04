<script setup>
import { computed, onMounted, reactive, ref } from "vue";
const weekConfig = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const monthConfig = [
  {title:'一月',totalDays:31},
  {title:'二月',totalDays:28},
  {title:'三月',totalDays:31},
  {title:'四月',totalDays:30},
  {title:'五月',totalDays:31},
  {title:'六月',totalDays:30},
  {title:'七月',totalDays:31},
  {title:'八月',totalDays:31},
  {title:'九月',totalDays:30},
  {title:'十月',totalDays:31},
  {title:'十一月',totalDays:30},
  {title:'十二月',totalDays:31},
];




// 日期数据
const calendarData = reactive({
  calendarList:[{
    date:4,
    day:4,
  }]
})

// 根据时间判断当月的天数
const getDayNumOfMonth = (date) => {
  let month = date.getMonth();
  let year = date.getFullYear();
  let isYearLeap = (year&4 === 0) && (year % 100 !== 0)
  let res = (month === 1 && isYearLeap) ? 29 : monthConfig[month]
  return res
}

// 表格日历初始化
const initTable = () => {
  let today = new Date();
  let dayNumOfMonth = getDayNumOfMonth(today)
  let date = today.getDate();
  let newList = []
  console.log('todayDate',todayDate);
  let day = today.getDay();
  console.log('todayDay',todayDay);
  newList.push({date,day})
  // 正向循环
  while(date <=31 || (date > dayNumOfMonth && day <= 6)){
    console.log('循环',date,day);
    date++;
    day++;
    day = day > 6 ? 0 : day;
    newList.push({
      date,day
    })
  }
  console.log('list',newList);
}

onMounted(() => {
  initTable()
})
</script>
<template>
  <div id="calendar-table">
    <div class="left-calendar"></div>
    <div class="center-calendar">
      <div class="table-info"></div>
      <div class="table-zone">
        <div class="calendar-head">
          <div
            class="head-item"
            v-for="(item, index) in weekConfig"
            :key="index"
          >{{item}}</div>
        </div>
        <div class="calendar-zone"></div>
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
    }
    .table-zone {
      width: 100%;
      flex: 1;
      .calendar-head {
        height: 5%;
        width: 100%;
        display: flex;
        .head-item{
          border: 1px solid aqua;
          border-right: none;
          flex: 1;
          text-align: center;
          line-height: 30px;
          font-size: 12px;
          letter-spacing: 2px;
          &:first-of-type{
            border-left: none;
          }
        }
      }
      .calendar-zone {
        height: 95%;
        width: 100%;
      }
    }
  }
  .right-calendar {
    width: 20%;
  }
}
</style>
