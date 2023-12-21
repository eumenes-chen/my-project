<script setup>
import { computed, onMounted, reactive, ref } from "vue";

// 列表数据
let tableData = reactive([
  {
    title: "标题12312",
    date: "2021-12-21",
    address: "但是附件微软请问里是开发",
    tag: "qqqq",
  },
  {
    title: "请问企鹅",
    date: "2021-12-21",
    address: "但是去恶趣味人情味让人附件里是开发",
    tag: "www",
  },
  {
    title: "额为我请问去",
    date: "2021-12-21",
    address: "但12是附件里1231是开发",
    tag: "rrrrrrr",
  },
]);
// 数据总量
let total = ref(1000);
// 每页数量
let pageSize = ref(10);
// 列表数据配置项
let tableConfig = reactive([
  { prop: "title", label: "Title", width: "150", fixed: true },
  { prop: "date", label: "Date", width: "200" },
  { prop: "address", label: "Address", width: "300" },
  { prop: "tag", label: "Tag", width: "100" },
]);
// 搜索信息
let searchValue = ref("");
// 是否显示弹出框
let dialogVisible = ref(false);
// 打开的弹出框的类型
let dialogType = ref(false);
// 弹出框的表单数据
let form = reactive({ title: "标题" });

// 打开弹出框
const handleClick = (type, index, row) => {
  if (type === "edit" || type === "add") {
    dialogVisible.value = true;
    dialogType = type;
    console.log("添加或编辑", index, row, dialogVisible.value);
  } else if (type === "delete") {
    console.log("删除",index,row);
  }
};

// 点击弹出框内按钮
const dialogHandler = (type) => {
  if (type === "cancel") {
    dialogVisible.value = false;
  } else if (type === "submit") {
    if (dialogType === "edit") {
      console.log("保存编辑数据");
    } else if (dialogType === "add") {
      console.log("添加新数据");
    }
  }
};

// 渲染完成
onMounted(() => {});
</script>
<template>
  <div id="Manage1">
    <div class="head-zone">
      <div class="add-zone">
        <el-button type="primary" @click="handleClick('add')"
          >新增数据</el-button
        >
      </div>
      <div class="search-zone">
        <el-input :value="searchValue" placeholder="请输入搜索信息"></el-input>
        <el-button type="primary">搜索</el-button>
      </div>
    </div>
    <div class="table-zone">
      <el-table :data="tableData">
        <!-- 表头配置 -->
        <el-table-column
          v-for="item in tableConfig"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed"
        >
        </el-table-column>
        <el-table-column fixed="right" label="Operations" width="150">
          <template #default="scope">
            <el-button
              type="primary"
              round
              size="small"
              @click="handleClick('edit', scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定删除此项吗？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleClick('delete', scope.$index, scope.row)"
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
        />
      </div>
    </div>
    <el-dialog
      :title="dialogType === 'edit' ? '编辑' : '新增'"
      v-model="dialogVisible"
    >
      <template v-if="dialogType === 'edit'">
        <!-- 编辑弹出框 -->
        <el-form :model="form">
          <el-form-item label="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
        </el-form>
        <div class="button-zone">
          <el-button type="default" @click="dialogHandler('cancel')"
            >取消</el-button
          >
          <el-button type="primary" @click="dialogHandler('submit')"
            >保存</el-button
          >
        </div>
      </template>
      <template v-else>
        <!-- 添加弹出框 -->
      </template>
    </el-dialog>
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
  .button-zone {
    display: flex;
    justify-content: right;
  }

}

</style>
