<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
// 引入组件
import YearCard from "./SanguoYearCard.vue";
import SearchCard from "./SanguoSearchCard.vue";
import ViewCard from "./SanguoViewCard.vue";
// 引入数据
import sanguoYearList from "@/data/sanguoYearList.js";
// 引入请求
import api from "../../apis/index";

// 当前年份
const selectedYear = ref(184);
// 浏览角色列表
const viewList = ref([]);
// 搜索角色列表
const searchList = ref([]);
// 是否打开弹出框
const dialogFormVisible = ref(false);
const dialogType = ref("create");
// 弹出框标题
const dialogTitle = computed(() =>
  dialogType.value === "create" ? "创建角色" : "编辑角色"
);
// 弹出框表单内容
const form = reactive({
  obj: {
    name: "",
    birth: "",
    death: "",
    country: "",
  },
});
// 排序方式
const sortType = ref("_id");
// 排序选项
const sortOptions = [
  {
    value: "_id",
    label: "默认",
  },
  {
    value: "birth",
    label: "出生日期",
    disabled: true,
  },
  {
    value: "country",
    label: "阵营",
    disabled: true,
  },
];

// 初始化年份
const yearList = [];
let k = {};
const initYear = () => {
  for (let i = 100; i <= 400; i++) {
    k = {
      value: i,
      label: i,
    };
    yearList.push(k);
  }
};
// 查询的数据
const searchValue = ref("");

// 事件
// 点击加减号
const digitYear = (type) => {
  if (type === "minus") {
    selectedYear.value--;
  } else if (type === "plus") {
    selectedYear.value++;
  }
};
// 接收子传父事件，改变年份
const changeYear = (active) => {
  selectedYear.value = active;
};
// 接收子传父事件，放入角色
const putCharacter = async (data) => {
  let target = viewList.value.find((item) => {
    return item._id === data._id;
  });
  if (!target) {
    let params = {
      name: data.name,
    };
    let res = await api.addView(params);
    if (res.length) {
      viewHandler();
    }
  } else {
    ElMessage({
      type: "warning",
      message: "该角色已存在",
    });
  }
};
// 接收子传父事件，移出角色
const outCharacter = async (item) => {
  let params = {
    name: item.name,
  };
  let res = await api.deleteView(params);
  if (res.ok) {
    viewHandler();
  } else {
    ElMessage({
      type: "warning",
      message: "移出失败",
    });
  }
};
// 接收子传父事件，删除角色
const deleteCharacter = (data) => {
  ElMessageBox.confirm("即将删除此角色的数据，确定吗?", "Warning", {
    confirmButtonText: "确定删除",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let id = data._id;
      let res = await api.deleteCharacter({ _id: id });
      if (res.ok) {
        const newList = searchList.value.filter((item) => {
          return item._id !== id;
        });
        searchList.value = newList;
        ElMessage({
          type: "success",
          message: "删除成功",
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消",
      });
    });
};
// 接收子传父事件，编辑角色
const editCharacter = (data) => {
  emptyForm();
  openForm();
  form.obj = data;
  dialogType.value = "edit";
};
// 创建角色
const createCharacter = () => {
  emptyForm();
  openForm();
  dialogType.value = "create";
};
// 清空表单
const emptyForm = () => {
  form.obj = {
    _id: "",
    name: "",
    birth: "",
    death: "",
    country: "",
  };
};

// 打开表单
const openForm = () => {
  dialogFormVisible.value = true;
  window.addEventListener("keydown", keyDownHandler);
};
// 关闭表单
const closeForm = () => {
  dialogFormVisible.value = false;
  window.removeEventListener("keydown", keyDownHandler, false);
};
// 回车事件
const keyDownHandler = (e) => {
  if (e.keyCode === 13) {
    dialogSubmit();
  }
};

// 关闭表单
const dialogCancel = () => {
  closeForm();
  emptyForm();
};
// 提交表单
let dialogSubmit = () => {
  submitForm();
};
// 上传数据
const submitForm = async () => {
  let postData = {
    name: form.obj.name,
    birth: Number(form.obj.birth),
    death: Number(form.obj.death),
    country: form.obj.country,
  };
  let data = "";
  if (dialogType.value === "create") {
    data = await api.addCharacter(postData);
    if (data) {
      searchList.value.push(data[0]);
      closeForm();
      ElMessage({
        message: "添加成功",
        type: "success",
      });
    } else {
      ElMessage({
        message: "添加失败",
        type: "error",
      });
    }
  } else {
    postData._id = form.obj._id;
    data = await api.editCharacter(postData);
    if (data.ok) {
      let newList = searchList.value.map((item) => {
        let obj = item._id === form.obj._id ? form.obj : item;
        return obj;
      });
      searchList.value = newList;
      closeForm();
      ElMessage({
        message: "编辑成功",
        type: "success",
      });
    } else {
      ElMessage({
        message: "编辑失败",
        type: "error",
      });
    }
  }
};

// 获取角色数据
const characterHandler = async () => {
  let data = await api.character();
  searchList.value = data;
};
// 获取id数据
const viewHandler = async () => {
  let data = await api.getView();
  let arr = [];
  data.forEach((item) => {
    arr.push({ name: item.name });
  });
  viewCharacterHandler(arr);
};
// 通过id获取角色数据
const viewCharacterHandler = async (arr) => {
  let params = { arr: arr };
  let data = await api.getCharacter(params);
  if (data instanceof Array) {
    viewList.value = data;
  } else {
    viewList.value = [];
  }
};
// 清空视图内的角色
const clearAll = async () => {
  let res = await api.deleteAllView();
  if (res.ok) {
    viewHandler();
  }
};
// 搜索事件
const searchHandler = async () => {
  if (!searchValue.value) {
    characterHandler();
  } else {
    let params = {
      str: searchValue.value,
    };
    let res = await api.searchCharacter(params);
    if (res.length) {
      searchList.value = res;
    } else {
      characterHandler();
    }
  }
};
// 排序方式改变
const changeSort = (str) => {
  let newArr = viewList.value.sort(sortBy(str, 1));
  viewList.value = newArr;
};
// 排序函数
const sortBy = (attr, rev) => {
  if (rev == undefined) {
    rev = 1;
  } else {
    rev ? 1 : -1;
  }
  return function (a, b) {
    a = a[attr];
    b = b[attr];
    if (a < b) {
      return rev * -1;
    }
    if (a > b) {
      return rev * 1;
    }
    return 0;
  };
};

// 执行函数
initYear();
characterHandler();
viewHandler();

// 渲染完成
onMounted(() => {
  // 进入页面获取角色列表
});
</script>
db.sanguocharacter.find({_id:ObjectId("6500745b42a5d3b1e89331cc")})
<template>
  <div id="sanguo">
    <div class="head">
      <div class="function">
        <el-row>
          <el-button type="primary" @click="createCharacter"
            >创建角色</el-button
          >
        </el-row>
      </div>
      <div class="year">
        <el-button @click="digitYear('minus')">-</el-button>
        <el-select
          v-model="selectedYear"
          class="m-2"
          placeholder="Select"
          size="default"
        >
          <el-option
            v-for="item in yearList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button @click="digitYear('plus')">+</el-button>
      </div>
      <div class="search">
        <el-input
          v-model="searchValue"
          placeholder="请输入角色姓名"
          :prefix-icon="Search"
        />
        <el-button type="primary" @click="searchHandler">查询</el-button>
      </div>
    </div>
    <div class="main">
      <div class="left-main">
        <div class="year-zone">
          <div class="year-box">
            <YearCard
              :sanguoYearList="sanguoYearList"
              :selectedYear="selectedYear"
              @changeYear="changeYear"
            />
          </div>
        </div>
      </div>
      <div class="right-main">
        <div class="view-zone">
          <div class="view-container">
            <ViewCard
              v-for="(item) in viewList"
              :selectedYear="selectedYear"
              :data="item"
              :key="item._id"
              @outCharacter="outCharacter(item)"
            />
          </div>
          <div class="sort-container">
            <el-select
              v-model="sortType"
              placeholder="排序方式"
              @change="changeSort"
            >
              <el-option
                v-for="(item, index) in sortOptions"
                :key="item.value + index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="clear-all">
            <el-button type="warning" @click="clearAll">清空</el-button>
          </div>
        </div>
        <div class="search-zone">
          <div class="search-container">
            <SearchCard
              v-for="item in searchList"
              :data="item"
              :key="item._id"
              @putCharacter="putCharacter(item)"
              @editCharacter="editCharacter(item)"
              @deleteCharacter="deleteCharacter(item)"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 弹出框 -->
    <el-dialog v-model="dialogFormVisible" :title="dialogTitle">
      <el-form :model="form">
        <el-form-item label="角色姓名">
          <el-input v-model="form.obj.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="出生日期">
          <el-input v-model="form.obj.birth" autocomplete="off" />
        </el-form-item>
        <el-form-item label="死亡日期">
          <el-input v-model="form.obj.death" autocomplete="off" />
        </el-form-item>
        <el-form-item label="阵营">
          <el-select v-model="form.obj.country" placeholder="请选择阵营">
            <el-option label="魏国" value="魏国" />
            <el-option label="蜀汉" value="蜀汉" />
            <el-option label="吴国" value="吴国" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogCancel">取消</el-button>
          <el-button type="primary" @click="dialogSubmit"> 保存 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
@import "@/style/index.scss";

#sanguo {
  position: relative;
  height: calc(100vh - 50px);
  overflow: hidden;

  .head {
    height: 60px;
    width: 100%;
    display: flex;
    padding: 0 !important;

    .function {
      width: 20%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .year {
      width: 60%;
      display: flex;
      justify-content: center;
      align-items: center;

      .el-select {
        margin: 0 10px;
      }
    }

    .search {
      display: flex;
      width: 20%;
      justify-content: center;
      align-items: center;
      padding: 10px;
    }
  }

  .main {
    height: calc(100% - 70px);
    display: flex;

    .left-main {
      box-sizing: border-box;
      border-radius: 8px;
      border: 1px solid #ddd;
      width: 20%;
      height: 100%;

      .year-zone {
        width: 90%;
        height: 96%;
        margin: 2% 5%;
        padding: 2px 20px;
        box-sizing: border-box;
        overflow-x: clip;;
        overflow-y: auto;
        :deep(.el-collapse-item__wrap){
          margin-right: 20px;
        }
        :deep(.el-collapse-item__header){
          &:hover{
            font-weight: bold;
          }
        }
      }
    }

    .right-main {
      width: 80%;
      height: 100%;
      display: flex;

      .view-zone {
        width: 70%;
        height: 100%;
        float: left;
        padding: 10px;
        box-sizing: border-box;
        position: relative;

        .view-container {
          border: 1px solid gray;
          border-radius: 10px;
          box-shadow: 2px 2px 5px rgba($color: gray, $alpha: 0.5);
          height: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: start;
          align-content: flex-start;
          overflow: auto;
          overflow: visibility;
        }

        .sort-container {
          position: absolute;
          left: 30px;
          top: -30px;

          .el-select {
            width: 160px;
          }
        }

        .clear-all {
          position: absolute;
          right: 30px;
          top: -30px;
        }
      }

      .search-zone {
        width: 30%;
        height: 100%;
        padding: 10px;
        float: left;

        .search-container {
          height: 100%;
          overflow: auto;
        }
      }
    }
  }
}
</style>
