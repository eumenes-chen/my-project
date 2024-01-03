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
// // 引入请求
import sanguoApi from "../../apis/sanguo";

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
const putCharacter = async (id) => {
  let target = viewList.value.find((item) => {
    return item._id === id;
  });
  if (!target) {
    let params = { id };
    let res = await sanguoApi.addViewCharacter(params);
    if (res.data && res.code === "200") {
      let newSearchList = [];
      let newViewList = [];
      JSON.parse(JSON.stringify(searchList.value)).forEach((item) => {
        if (item._id === id) {
          item.view = true;
          newViewList.push(item);
        } else if (item.view) {
          newViewList.push(item);
        }
        newSearchList.push(item);
      });
      searchList.value = newSearchList;
      viewList.value = newViewList;
    }
  } else {
    ElMessage({
      type: "warning",
      message: "该角色已存在",
    });
  }
};
// 接收子传父事件，移出角色
const outCharacter = async (id) => {
  let params = { id };
  let res = await sanguoApi.deleteViewCharacter(params);
  let newSearchList = [];
  let newViewList = [];
  if (res.code === "200") {
    JSON.parse(JSON.stringify(searchList.value)).forEach((item) => {
      if (item._id === id) {
        item.view = false;
      } else if (item.view) {
        newViewList.push(item);
      }
      newSearchList.push(item);
    });
    searchList.value = newSearchList;
    viewList.value = newViewList;
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
      let res = await sanguoApi.deleteCharacter({ _id: id });
      if (res.data) {
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
let dialogSubmit = async () => {
  let postData = {
    name: form.obj.name,
    birth: Number(form.obj.birth),
    death: Number(form.obj.death),
    country: form.obj.country,
  };
  let data = "";
  if (dialogType.value === "create") {
    let res = await sanguoApi.addCharacter(postData);
    if (res.code === "200") {
      data = res.data;
      searchList.value.push(data[0]);
      dialogCancel();
      ElMessage({ message: "添加成功", type: "success" });
    } else {
      ElMessage({ message: "添加失败", type: "error" });
    }
  } else {
    postData._id = form.obj._id;
    let res = await sanguoApi.editCharacter(postData);
    if (res.code === "200") {
      let newList = searchList.value.map((item) => {
        if (item._id === form.obj._id) {
          for (let prop in form.obj) {
            item[prop] = form.obj[prop];
          }
        }
        return item;
      });
      searchList.value = newList;
      viewList.value.forEach((item) => {
        if (item._id === form.obj._id) {
          for (let prop in form.obj) {
            item[prop] = form.obj[prop];
          }
        }
      });
      dialogCancel();
      ElMessage({ message: "编辑成功", type: "success" });
    } else {
      ElMessage({ message: "编辑失败", type: "error" });
    }
  }
};

// 获取角色数据
const characterHandler = async () => {
  let res = await sanguoApi.character();
  if (res.data) {
    searchList.value = res.data || [];
    let newRes = [];
    JSON.parse(JSON.stringify(searchList.value)).forEach((item) => {
      if (item.view) {
        newRes.push(item);
      }
    });
    viewList.value = newRes;
  }
};

// 清空视图内的角色
const clearAll = async () => {
  let res = await sanguoApi.clearViewCharacter();
  if (res.data) {
    characterHandler();
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
    let res = await sanguoApi.searchCharacter(params);
    if (res.data && res.data.length > 0) {
      searchList.value = res.data;
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

// 拖拽功能
// view框
const sanguoView = ref(null);
const dragTarget = ref(null);
const mouseDownTargetPosition = ref({});

// 找到需要拖拽的dom
const findTarget = (el) => {
  if (el.className !== "search-card") {
    let newDom = el.parentElement.cloneNode(true);
    newDom.style.position = "absolute";
    el.parentElement.parentElement.insertBefore(newDom, el.parentElement);
    return findTarget(newDom);
  } else {
    return el;
  }
};
// 是否在view框中
const insideViewOrNot = (x, y) => {
  if (sanguoView.value) {
    let viewRect = sanguoView.value.getBoundingClientRect();
    if (
      x > viewRect.x &&
      x < viewRect.x + viewRect.width &&
      y > viewRect.y &&
      y < viewRect.y + viewRect.height
    ) {
      // 在view框中
      return true;
    } else {
      // 不在view框中
      return false;
    }
  }
};
// 拖拽中
const dragHandler = (e) => {
  dragTarget.value.style.left =
    e.pageX - mouseDownTargetPosition.value.x + "px";
  dragTarget.value.style.top =
    e.pageY - mouseDownTargetPosition.value.y - 55 + "px";
  let inside = insideViewOrNot(e.pageX, e.pageY);
  if (inside) {
    sanguoView.style.boxShadow = "0 0 10px gray";
  } else {
    sanguoView.style.boxShadow = "none";
  }
};
// 结束拖拽事件
const dragEnd = (e) => {
  document.removeEventListener("mousemove", dragHandler);
  document.removeEventListener("mouseup", dragEnd);
  document.body.onselectstart = () => {
    return true;
  };
  // 判断是否拖拽到了view框中
  let inside = insideViewOrNot(e.pageX, e.pageY);
  if (inside) {
    putCharacter(dragTarget.value.id);
  }
  dragTarget.value.remove();
  dragTarget.value = null;
};

// 开始拖拽事件
const dragStart = (e) => {
  mouseDownTargetPosition.value = { x: e.offsetX, y: e.offsetY };
  dragTarget.value = findTarget(e.target);
  document.addEventListener("mousemove", dragHandler);
  document.addEventListener("mouseup", dragEnd);
  document.body.onselectstart = () => {
    return false;
  };
};

// 执行函数
initYear();
characterHandler();

// 渲染完成
onMounted(() => {
  // 进入页面获取角色列表
  console.log("sanguoView", sanguoView.value);
});
</script>
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
          <div class="view-container" ref="sanguoView">
            <ViewCard
              v-for="item in viewList"
              :selectedYear="selectedYear"
              :data="item"
              :key="item._id"
              @outCharacter="outCharacter(item._id)"
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
              @dragStart="dragStart"
              @putCharacter="putCharacter(item._id)"
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
  // overflow: hidden;

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
        overflow-x: clip;
        overflow-y: auto;
        :deep(.el-collapse-item__wrap) {
          margin-right: 20px;
        }
        :deep(.el-collapse-item__header) {
          &:hover {
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
          overflow: visible;
          padding: 5px;
        }
      }
    }
  }
}
</style>
