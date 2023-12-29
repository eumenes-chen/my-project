<script setup>
import { ref, reactive } from "vue";

// 接收props
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
});

// 子传父
const emit = defineEmits(["putCharacter", "editCharacter", "deleteCharacter"]);

const data = reactive(props.data);

// 事件
// 放置角色
const putCharacter = () => {
  emit("putCharacter");
};
// 编辑角色
const editCharacter = () => {
  emit("editCharacter");
};
// 删除角色
const deleteCharacter = () => {
  emit("deleteCharacter");
};
console.log("data:", data._id);

const dragTarget = ref(null);
const mouseDownTargetPosition = ref({});

const findTarget = (el) => {
  if (el.className !== "search-card") {
    return findTarget(el.parentElement);
  } else {
    return el;
  }
};
const dragHandler = (e) => {
  console.log("dragHandler", e.pageX, e.pageY);
  dragTarget.value.style.position = "absolute";
  dragTarget.value.style.left =
    e.pageX - mouseDownTargetPosition.value.x + "px";
  dragTarget.value.style.top =
    e.pageY - mouseDownTargetPosition.value.y - 55 + "px";
};
const dragEnd = (e) => {
  document.removeEventListener("mousemove", dragHandler);
  document.removeEventListener("mouseup", dragEnd);
  document.body.onselectstart = () => {
    return true;
  };
  dragTarget.value = null;
  console.log("dragEnd", e);
};
// 开始拖拽事件
const dragStart = (e) => {
  console.log("dragStart", e);
  mouseDownTargetPosition.value = { x: e.offsetX, y: e.offsetY };
  dragTarget.value = findTarget(e.target);
  document.addEventListener("mousemove", dragHandler);
  document.addEventListener("mouseup", dragEnd);
  document.body.onselectstart = () => {
    return false;
  };
};
</script>
<template>
  <div class="search-card" :id="data._id" @mousedown.prevent="dragStart">
    <div class="info">
      {{ data.name }} : {{ data.birth }} - {{ data.death }}
    </div>
    <div class="function">
      <el-button
        type="primary"
        size="small"
        @mousedown.stop.prevent="putCharacter"
        >存入</el-button
      >
      <el-button
        type="primary"
        size="small"
        @mousedown.stop.prevent="editCharacter"
        >编辑</el-button
      >
      <el-button
        type="primary"
        size="small"
        @mousedown.stop.prevent="deleteCharacter"
        >删除</el-button
      >
    </div>
  </div>
</template>
<style scoped lang="scss">
.search-card {
  border-radius: 4px;
  background-color: rgb(202, 202, 202);
  padding: 6px 5px 6px 15px;
  font-size: 14px;
  line-height: 24px;
  display: flex;
  margin: 5px 0;
  width: 290px;
  box-sizing: border-box;
  justify-content: space-around;
  cursor: move;
  &:hover {
    box-shadow: 0 0 5px rgb(180, 180, 180);
  }
  .info {
    width: 50%;
  }

  .function {
    width: 50%;
  }

  .el-button {
    margin-left: 2px;
    margin-right: 2px;
    padding: 5px 6px;
  }
}
</style>
