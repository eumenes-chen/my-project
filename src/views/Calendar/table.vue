<script setup>
import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue";
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
// 当前日期数据
let selectedDate = reactive({
  currentDate: {
    date: "", // YYYY-MM-DD
  },
  currentMonth: {
    year: "",
    month: "",
  },
});
let formData = reactive({
  date: "",
  weight: "",
  title: "",
  content: "",
});

// 监听日期(reactive)
watch(props.dateData, (newVal) => {
  console.log("监听到日期变化");
  selectedDate.currentDate.date = newVal.dayjs.format("YYYY-MM-DD") || "";
  setFormData(newVal.info);
});
// 监听月份(reactive)
watch(props.monthData, (newVal) => {
  console.log("监听到月份变化", selectedDate);
  initTable();
});
// 监听日期列表(ref)
watch(
  () => props.dateList,
  (newVal) => {
    console.log("监听到列表变化", newVal);
    tableData.list = tableData.list.map((item, index) => {
      let target = newVal[index];
      Object.assign(target, { fromActiveMonth: item.fromActiveMonth });
      return target;
    });
  },
  {
    deep: true,
  }
);
// 日期数据
const tableData = reactive({
  list: [
    {
      date: "",
      dateStamp: "",
      weight: "",
      title: "",
      content: "",
    },
  ],
});
// 处理详情数据
const setFormData = (data) => {
  for (let prop in formData) {
    formData[prop] = data[prop] || "";
  }
};

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

/**
 * 创建表格日历
 * params { date:YYYY-MM-DD }(该月的某天)
 */
const initTable = () => {
  console.log("props", props);
  let monthDate = props.monthData.dayjs || "";
  if (monthDate) {
    selectedDate.currentMonth = {
      year: props.monthData.dayjs.year() || "",
      month: props.monthData.dayjs.month() || "",
    };
    console.log("初始化表格", monthDate);
    tableData.list = [];
    let dateInfo = dayjs(monthDate);
    let lastMonth = dateInfo.add(-1, "month").startOf("month");
    let dayNumOfLastMonth = lastMonth.daysInMonth();
    let date = dateInfo.date();
    let day = dateInfo.day();
    let newList = [];
    let fromActiveMonth = true;
    // 正向循环
    while (fromActiveMonth || (!fromActiveMonth && day !== 0)) {
      newList.push({ dateInfo, date, day, fromActiveMonth });
      dateInfo = dateInfo.add(1, "day");
      date = dateInfo.date();
      day = dateInfo.day();
      fromActiveMonth = date === 1 ? false : fromActiveMonth;
    }
    // 数据初始化
    dateInfo = dayjs(monthDate);
    date = dateInfo.date();
    day = dateInfo.day();
    fromActiveMonth = true;
    // 反向循环
    while (fromActiveMonth || (!fromActiveMonth && day !== 0)) {
      dateInfo = dateInfo.subtract(1, "day");
      date = dateInfo.date();
      day = dateInfo.day();
      if (fromActiveMonth) {
        fromActiveMonth =
          dateInfo.month() === lastMonth.month() ? false : fromActiveMonth;
      }
      newList.unshift({ dateInfo, date, day, fromActiveMonth });
    }
    tableData.list = newList;
    let params = {
      start: newList[0].dateInfo.format("YYYY-MM-DD"),
      end: newList[newList.length - 1].dateInfo.format("YYYY-MM-DD"),
    };
    // 根据首位日期请求日期列表
    props.dateData.methods.getDateList(params);
  }
};

/**
 * 改变选中月份 YYYY-MM-DD
 */
const changeMonth = (type) => {
  let month = "";
  if (type === "prev") {
    month = props.monthData.dayjs.subtract(1, "month");
  } else if (type === "next") {
    month = props.monthData.dayjs.add(1, "month");
  }
  props.monthData.methods.changeMonth(month);
};
/**
 * 选中今日
 */
const todayHandler = () => {
  let dateStr = dayjs().format("YYYY-MM-DD");
  // props.monthData.methods.changeMonth(dateStr)
  props.dateData.methods.changeDate(dateStr);
};
/**
 * 改变选中的日期 obj
 */
const changeDate = (item) => {
  props.dateData.methods.changeDate(item);
};
/**
 * 保存事件
 */
const submitHandler = () => {
  props.dateData.methods.submitHandler(formData);
};
// 日期过滤器
const dateFilter = computed(() => {
  return function (value, type) {
    let res = "";
    if (type === "date" && value.length) {
      res = value.split("-")[2].replace(/^0/, "");
    }
    return res;
  };
});

onMounted(() => {
  console.log("table触发onMounted");
  initTable();
});
</script>
<template>
  <div id="calendar-table">
    <!-- 左侧部分 -->
    <div class="left-calendar"></div>
    <!-- 中部日历部分 -->
    <div class="center-calendar">
      <div class="table-info">
        <el-button type="primary" class="today-btn" @click="todayHandler"
          >今日</el-button
        >
        <el-button type="default" class="arrow-btn" @click="changeMonth('prev')"
          >前</el-button
        >
        <el-button type="default" class="arrow-btn" @click="changeMonth('next')"
          >后</el-button
        >
        <span class="year-val">{{ selectedDate.currentMonth.year }}年</span>
        <span class="month-val"
          >{{ selectedDate.currentMonth.month + 1 }}月</span
        >
      </div>
      <!-- 表格区域 -->
      <div class="table-zone">
        <!-- 表头 -->
        <div class="calendar-head">
          <div
            class="head-item"
            v-for="(item, index) in weekConfig"
            :key="index"
          >
            {{ item }}
          </div>
        </div>
        <!-- 日期 -->
        <div class="calendar-zone">
          <div
            class="calendar-item"
            v-for="(item, index) in tableData.list"
            :key="index + '_' + item.date + '_' + item.day"
            :class="{
              'current-month': item.fromActiveMonth,
              'current-date': item.date === selectedDate.currentDate.date,
            }"
            @click="changeDate(item)"
          >
            <div class="date">
              {{ dateFilter(item.date, "date") }}
            </div>
            <div class="info" v-if="item.weight">
              <span>体重: {{ item.weight }}</span>
            </div>
            <div class="info" v-if="item.title">
              <span>标题: {{ item.title }}</span>
            </div>
            <div class="info" v-if="item.content">
              <span>记录: {{ item.content }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧部分 -->
    <div class="right-calendar">
      <div class="image-zone">
        <div class="info-zone">
          <span class="month"
            >{{ selectedDate.currentDate.date.split("-")[1] }}月</span
          >
          <span class="date"
            >{{ selectedDate.currentDate.date.split("-")[2] }}日</span
          >
          <span class="day">{{
            weekConfig[selectedDate.currentDate.date.split("-")[2]]
          }}</span>
        </div>
      </div>
      <div class="form-zone">
        <div class="form-title">
          <span>当天数据</span>
        </div>
        <div class="form-container">
          <div class="form-box">
            <div class="form-title">基础数据</div>
            <el-row :gutter="0" justify="space-around">
              <el-col :span="8">
                <span class="label">体重</span>
              </el-col>
              <el-col :span="16">
                <el-input
                  size="small"
                  v-model="formData.weight"
                  @blur="submitHandler"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="0" justify="space-around">
              <el-col :span="8">
                <span class="label">标题</span>
              </el-col>
              <el-col :span="16">
                <el-input
                  size="small"
                  v-model="formData.title"
                  @blur="submitHandler"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="0" justify="space-around">
              <el-col :span="8">
                <span class="label">记录</span>
              </el-col>
              <el-col :span="16">
                <el-input
                  size="small"
                  type="textarea"
                  v-model="formData.content"
                  @blur="submitHandler"
                ></el-input>
              </el-col>
            </el-row>
          </div>
          <div class="form-box">
            <div class="form-title">金额数据</div>
            <svg style="width: 600px; height: 600px">
              <!-- 'xlink：href执行用哪一个图标,属性值务必icon-图标名字·' -->
              <!-- use标签fi11属性可以设置图标的颜色 -->
              <use xlink:href="jiahao2fill" fill="red"></use>
            </svg>
          </div>
        </div>
      </div>
    </div>
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
    color: $font-color-black;
    .table-info {
      height: 50px;
      width: 100%;
      line-height: 50px;
      padding: 0 30px;
      box-sizing: border-box;
      .today-btn {
        margin: 0 20px;
      }
      .arrow-btn {
        margin: 0;
      }
      .year-val {
        margin: 0 5px 0 30px;
      }
      span {
        font-weight: bold;
        font-size: 16px;
        color: $font-color-gray;
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
          min-height: 15%;
          padding: 12px 10px;
          border: 1px solid rgb(172, 255, 255);
          box-sizing: border-box;
          background-color: rgb(230, 230, 230);
          color: $font-color-black;
          opacity: 0.5;
          cursor: pointer;
          &:hover {
            border: 1px solid gray;
          }
          &.current-month {
            background-color: white;
            opacity: 1;
          }
          &.current-date {
            border: 2px solid gray;
          }
          .date {
            color: $font-color-black;
          }
          .info {
            width: 100%;
            border-radius: 4px;
            background: rgba(226, 226, 226, 0.3);
            height: 24px;
            color: gray;
            padding: 0 10px;
            box-sizing: border-box;
            margin: 5px 0;
            overflow: hidden;
            span {
              line-height: 24px;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
  .right-calendar {
    width: 20%;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    flex-direction: column;
    .image-zone {
      height: 300px;
      width: 100%;
      background: rgb(248, 248, 248);
      border-radius: 8px;
      padding-top: 20px;
      .info-zone {
        line-height: 30px;
        height: 30px;
        float: right;
        span {
          font-size: 20px;
          font-weight: bold;
          color: gray;
          &.month {
            margin-right: 2px;
          }
          &.date {
            margin-right: 20px;
          }
          &.day {
            margin-right: 30px;
          }
        }
      }
    }
    .form-zone {
      width: 100%;
      height: auto;
      background: rgb(248, 248, 248);
      flex: 1;
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      margin-top: 10px;
      padding: 10px;
      box-sizing: border-box;
      overflow: hidden;
      .form-title {
        height: 34px;
        line-height: 30px;
        font-size: 168x;
        font-weight: bold;
        margin-left: 10px;
        color: $font-color-black;
      }
      .form-container {
        flex: 1;
        width: 100%;
        background: rgb(255, 255, 255);
        .form-title {
          font-size: 14px;
          color: $font-color-gray;
        }
        .form-box {
          margin: 3px 6px;
          padding: 5px 15px;
          background: rgb(235, 235, 235);
          font-size: 14px;
          .el-row {
            line-height: 30px;
            // height: 30px;
            margin-bottom: 5px;
          }
        }
      }
    }
  }
}
</style>
