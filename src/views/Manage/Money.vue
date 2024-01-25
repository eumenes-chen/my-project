<script setup>
import { computed, onMounted, watchEffect, reactive, ref, nextTick } from "vue";
import { ElMessage } from "element-plus";
// // 引入请求
import calendarApi from "../../apis/calendar";

// 列表数据
let tableData = reactive({
  tableList: [],
});
// 当前页数
let curPage = ref(1);
// 数据总量
let total = ref(0);
// 每页数量
let pageSize = ref(12);
// 列表数据配置项
let tableConfig = reactive({
  list: [
    { prop: "id" },
    { prop: "date", label: "日期", width: "250", fixed: true },
    { prop: "money", label: "金额", width: "200" },
    { prop: "type", label: "类型", width: "200",type:'select',options:['支出','收入'] },
    { prop: "detail", label: "详情", width: "200",type:'select',options:[''] },
  ],
  options: {
    income:['工资','红包','其他收入'],
    expend:['衣服','饮食','房租','出行','娱乐','购物','其他支出']
  }
});
// 搜索信息
let searchValue = ref("");
// 打开的弹出框的类型
let dialogType = ref(false);
// 弹出框的表单数据
let form = reactive({ title: "标题" });

watchEffect(() => {});

// 打开弹出框
const eventHandler = (type, index, row) => {
  if (type === "save") {
    if (row._id) {
      calendarApi.editDate(row).then((res) => {
        if (res.code === "200") {
          // getDateList()
        }
      });
    }
  } else if (type === "delete") {
    calendarApi.deleteDate(row).then((res) => {
      if (res.code === "200") {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        getDateList();
      }
    });
  }
};

// 初始化
const init = () => {
  getDateList();
};
// 请求角色列表数据
const getDateList = () => {
  let params = {
    curPage: curPage.value,
    pageSize: pageSize.value,
  };
  calendarApi.getDate(params).then((res) => {
    if (res.code === "200") {
      tableData.tableList = res.data.list;
      total.value = res.data.total;
    }
  });
};
// 搜索事件
const searchHandler = () => {
  if (!searchValue.value) {
    getDateList();
  } else {
    let params = {
      value: searchValue.value,
    };
    calendarApi.searchDate(params).then((res) => {
      if (res.code === "200") {
        tableData.tableList = res.data.list.map((item) => {
          return { ...item, created: true };
        });
        total.value = res.data.total;
      }
    });
  }
};
const listenHandler = (e, type) => {
  if (type) {
    document.addEventListener("keypress", keyPressHandler);
  } else {
    document.removeEventListener("keypress", keyPressHandler);
  }
};
const keyPressHandler = (e) => {
  if (e.keyCode === 13) {
    searchHandler();
  }
};
// 改变页数
const changePage = (page) => {
  curPage.value = page;
  getDateList();
};

init();

// 渲染完成
onMounted(() => {});
</script>
<template>
  <div id="Income">
    <div class="head-zone">
      <div class="search-zone">
        <el-input
          v-model="searchValue"
          @focus="listenHandler($event, true)"
          @blur="listenHandler($event, false)"
          placeholder="请输入搜索信息"
        ></el-input>
        <el-button type="primary" @click="searchHandler">搜索</el-button>
      </div>
    </div>
    <div class="table-zone">
      <el-table :data="tableData.tableList">
        <!-- 表头配置 -->

        <template v-for="(item, index) in tableConfig.list">
          <el-table-column
            sortable
            v-if="item.prop !== 'id'"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :fixed="item.fixed"
          >
            <template #default="scope">
              <el-select
                v-if="item.type === 'select'"
                :placeholder="'请选择' + item.label"
                v-model="scope.row[item.prop]"
                @change="eventHandler('save', index, scope.row)"
              >
                <el-option
                  v-for="(itm, idx) in item.options"
                  :key="idx"
                  :label="itm"
                  :value="itm"
                ></el-option>
              </el-select>
              <el-input
                v-else
                :placeholder="'请输入' + item.label"
                v-model="scope.row[item.prop]"
                @blur="eventHandler('save', index, scope.row)"
              ></el-input>
            </template>
          </el-table-column>
        </template>

        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-popconfirm
              title="确定删除此项吗？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="eventHandler('delete', scope.$index, scope.row)"
            >
              <template #reference>
                <el-button type="warning" round size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-zone">
      <div class="page-container">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="curPage"
          @current-change="changePage"
        />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "@/style/index.scss";
#Manage1 {
  height: 100%;
  display: flex;
  box-sizing: border-box;
  padding: 0 10px;
  flex-direction: column;
  & > div {
    width: 100%;
  }
  .head-zone {
    height: 50px;
    & > div {
      display: flex;
      justify-content: center;
      height: 100%;
      align-items: center;
    }
    .add-zone {
      width: 20%;
      float: left;
    }
    .search-zone {
      width: 50%;
      float: right;

      .el-input {
        width: 70%;
        margin-right: 3%;
      }
      .el-button {
        width: 20%;
      }
    }
  }
  .table-zone {
    flex: 1;
    box-sizing: border-box;
    padding: 10px 5px;
    overflow: auto;
    .el-table {
      padding: 15px;
      border-radius: 8px;
    }
  }
  .page-zone {
    height: 100px;
    padding-right: 80px;
    padding-top: 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: right;
    align-items: top;
  }
}
:deep(.el-dialog) {
  height: 70vh;
  display: flex;
  flex-direction: column;
  .el-dialog__body {
    flex: 1;
    box-sizing: border-box;
    overflow: hidden;
    .form-zone {
      height: 85%;
      overflow: auto;
    }
    .button-zone {
      height: 15%;
      display: flex;
      justify-content: right;
      align-items: center;
    }
  }
}
</style>
