<script setup>
import { computed, onMounted, reactive, ref, watch, markRaw } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";

// // 引入组件
// import Table from "./table.vue";
// import Timeline from "./timeline.vue";
// import Chart from "./chart.vue";
// 引入插件
import dayjs from "dayjs";
// // 引入请求
import calendarApi from "../../apis/calendar";

// dayjs().format()
const $router = useRouter();
const $route = useRoute();
const activeName = ref(null); // 激活的tab
const weekConfig = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const tabList = reactive({
  list: [
    {
      title: "表格",
      name: "table",
      active: false,
    },
    {
      title: "时间线",
      name: "timeline",
      active: false,
    },
    {
      title: "折线图",
      name: "chart",
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
// 当天数据
let formData = reactive({
  date: "",
  weight: "",
  title: "",
  content: "",
});

// 处理详情数据
const setFormData = (data) => {
  for (let prop in formData) {
    formData[prop] = data[prop] || "";
  }
};
/**
 * 发起请求日期列表
 * params {{ start:dayjs, end:dayjs }}
 */
const getDateList = (params) => {
  console.log("请求列表", params);
  calendarApi.getDate(params).then((res) => {
    if (res.code === "200") {
      dateList.value = res.data.list;
      console.log("请求列表完成");
      // if (!dateData.info.date) {
      //   let selectDate = dateData.dayjs.format("YYYY-MM-DD");
      //   let target = dateList.value.find((item) => {
      //     return item.date === selectDate;
      //   });
      //   console.log("target", target);
      //   if (target.date) {
      //     changeDate(target);
      //   }
      // }
    }
  });
};
/**
 * 修改当前显示月份
 * params { date:YYYY-MM-DD }
 */
const changeMonth = (params) => {
  console.log("params", params);
  monthData.dayjs = dayjs(params);
};
/**
 * 修改当前显示日期，并获取详情
 * params { date:YYYY-MM-DD }
 */
const changeDate = (params) => {
  console.log(
    "选中日期",
    dayjs(params.date).format("yyyy-mm-dd"),
    monthData.dayjs.format("yyyy-mm-dd")
  );
  if (dayjs(params.date).month() !== monthData.dayjs.month()) {
    console.log("修改月份dayjs");
    monthData.dayjs = dayjs(params.date);
  }
  dateData.dayjs = dayjs(params.date);
  dateData.info = params;
  console.log("dateData", dateData);
  setFormData(params);
};
/**
 * 提交日期详情
 * params { obj }
 */
const submitHandler = () => {
  console.log("提交params");
  calendarApi.editDate(formData).then((res) => {
    if (res.code === "200") {
      ElMessage({
        type: "success",
        message: "保存成功",
      });
      let targetIndex = dateList.value.findIndex((item) => {
        return item.date === formData.date;
      });
      if (targetIndex > -1) {
        let changeItem = {
          ...dateList.value[targetIndex],
          ...formData,
        };
        dateList.value.splice(targetIndex, 1, changeItem);
        console.log("dateList的splice");
      }
    }
  });
};

// 点击tab
const tabsHandler = (e) => {
  let paneName = e.paneName;
  console.log("paneName", paneName);
  $router.push({ name: paneName });
};

// 初始化日期数据
const initDate = () => {
  let today = dayjs();
  dateData.dayjs = today;
  monthData.dayjs = today;
};

onMounted(() => {
  console.log("index触发onMounted");
  initDate();
});
watch(
  () => $route.path,
  (newPath, oldPath) => {
    initDate();
    console.log("跳转", newPath);
  },
  { immediate: true }
);
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
          <!-- <component
            :is="item.component"
            :dateData="dateData"
            :monthData="monthData"
            :dateList="dateList"
          ></component> -->
        </el-tab-pane>
      </el-tabs>
      <div class="container">
        <!-- 左侧部分 -->
        <div class="left"></div>
        <!-- 中部部分 -->
        <div class="center">
          <RouterView
            :dateData="dateData"
            :monthData="monthData"
            :dateList="dateList"
          ></RouterView>
        </div>
        <!-- 右侧部分 -->
        <div class="right">
          <div class="image-zone">
            <div class="info-zone" v-if="dateData.info.date">
              <span class="month"
                >{{ dateData.info.date.split("-")[1] }}月</span
              >
              <span class="date">{{ dateData.info.date.split("-")[2] }}日</span>
              <span class="day">
                {{ weekConfig[dateData.dayjs.$M] }}
              </span>
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
      // height: 100%;
      // display: flex;
      // flex-direction: column;
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
    }
    .container {
      width: 100%;
      height: 90%;
      // background: $background-color-opacity;
      display: flex;
      & > div {
        background: $background-color-opacity;
        border-radius: 8px;
        height: 100%;
      }
      .left {
        width: 8%;
        height: 100%;
      }
      .center {
        flex: 1;
        margin: 0 10px;
        display: flex;
        flex-direction: column;
        color: $font-color-black;
      }
      .right {
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
  }
}
</style>
