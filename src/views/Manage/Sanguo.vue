<script setup>
import { computed, onMounted, watchEffect, reactive, ref, nextTick } from "vue";
import { ElMessage } from "element-plus";
// // 引入请求
import sanguoApi from "../../apis/sanguo";

// 列表数据
let tableData = reactive({
  tableList: [],
});
// 当前页数
let curPage = ref(1);
// 数据总量
let total = ref(0);
// 每页数量
let pageSize = ref(10);
// 列表数据配置项
let tableConfig = reactive({
  list: [
    { prop: "id" },
    { prop: "name", label: "姓名", width: "200", fixed: true },
    { prop: "birth", label: "出生年", width: "200" },
    { prop: "death", label: "去世年", width: "200" },
    {
      prop: "country",
      label: "阵营",
      width: "200",
      type: "select",
      options: ["魏国", "蜀汉", "吴国", "其他"],
    },
  ],
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
  console.log("触发", type, index, row);
  let params = {
    name: row.name,
    birth: Number(row.birth),
    death: Number(row.death),
    country: row.country,
  };
  if (type === "add") {
    if (!row.name && !row.birth && !row.death) {
      ElMessage({ message: "不能添加空数据", type: "warning" });
    } else {
      sanguoApi.addCharacter(row).then((res) => {
        console.log("res:", res);
        if (res.code === "200") {
          console.log("新增成功");
          row._id = res.data[0]._id;
          row.created = true;
          tableData.tableList.push(addEmptyRow());
        }
      });
    }
  } else if (type === "save") {
    if (row._id) {
      sanguoApi.editCharacter(row).then((res) => {
        console.log("res1:", res);
      });
    }
  } else if (type === "delete") {
    sanguoApi.deleteCharacter(row).then((res) => {
      console.log("res:", res);
      if (res.code === "200") {
        tableData.tableList.splice(index, 1);
      }
    });
    console.log("删除", index, row);
  }
};

// 初始化
const init = () => {
  getCharacterList();
};
// 请求角色列表数据
const getCharacterList = () => {
  let params = {
    curPage: curPage.value,
    pageSize: pageSize.value,
  };
  sanguoApi.character(params).then((res) => {
    console.log("rse", res);
    if (res.code === "200") {
      tableData.tableList = res.data.list.map((item) => {
        return { ...item, created: true };
      });
      total.value = res.data.total;
      tableData.tableList.push(addEmptyRow());
      console.log("tableData", tableData);
    }
  });
};
// 添加新的空数据
const addEmptyRow = () => {
  let row = {};
  tableConfig.list.forEach((item) => {
    return (row[item.prop] = "");
  });
  console.log("row:", row);
  return row;
};
// 改变页数
const changePage = (page) => {
  console.log("page", page);
  curPage.value = page;
  getCharacterList();
};

init();

// 渲染完成
onMounted(() => {});
</script>
<template>
  <div id="Manage1">
    <div class="head-zone">
      <div class="search-zone">
        <el-input :value="searchValue" placeholder="请输入搜索信息"></el-input>
        <el-button type="primary">搜索</el-button>
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
            <template v-if="scope.row.created">
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
            <template v-else>
              <el-button
                type="success"
                round
                size="small"
                @click="eventHandler('add', scope.$index, scope.row)"
                >新增</el-button
              >
            </template>
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
