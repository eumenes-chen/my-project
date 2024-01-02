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
const emit = defineEmits([
  "dragStart",
  "putCharacter",
  "editCharacter",
  "deleteCharacter",
]);

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

// view框
// const viewZone = document.getElementById("sanguo-view");
console.log("data:", data._id);

// const dragTarget = ref(null);
// const mouseDownTargetPosition = ref({});

// 找到需要拖拽的dom
// const findTarget = (el) => {
//   if (el.className !== "search-card") {
//     let newDom = el.parentElement.cloneNode(true);
//     newDom.style.position = "absolute";
//     el.parentElement.parentElement.insertBefore(newDom, el.parentElement);
//     // el.parentElement.parentElement.appendChild(newDom)
//     return findTarget(newDom);
//   } else {
//     return el;
//   }
// };
// 是否在view框中
// const insideViewOrNot = (x, y) => {
//   console.log('???');
//   if (viewZone) {
//     let viewRect = viewZone.getBoundingClientRect();
//     if (
//       x > viewRect.x &&
//       x < viewRect.x + viewRect.width &&
//       y > viewRect.y &&
//       y < viewRect.y + viewRect.height
//     ) {
//       // 在view框中
//       return true;
//     } else {
//       // 不在view框中
//       return false;
//     }
//   }
// };
// // 拖拽中
// const dragHandler = (e) => {
//   dragTarget.value.style.left =
//     e.pageX - mouseDownTargetPosition.value.x + "px";
//   dragTarget.value.style.top =
//     e.pageY - mouseDownTargetPosition.value.y - 55 + "px";
//   let inside = insideViewOrNot(e.pageX, e.pageY);
//   if (inside) {
//     viewZone.style.boxShadow = "0 0 10px gray";
//   } else {
//     viewZone.style.boxShadow = "none";
//   }
// };
// // 结束拖拽事件
// const dragEnd = (e) => {
//   console.log("dragHandler", e.pageX, e.pageY);
//   document.removeEventListener("mousemove", dragHandler);
//   document.removeEventListener("mouseup", dragEnd);
//   document.body.onselectstart = () => {
//     return true;
//   };
//   console.log("dragEnd", dragTarget.value);
//   // 判断是否拖拽到了view框中
//   let inside = insideViewOrNot(e.pageX, e.pageY);
//   if (inside) {
//     console.log("放入");
//     emit("putCharacter");
//   } else {
//     console.log("不放入");
//     // emit('outCharacter')
//   }
//   dragTarget.value.remove();
//   dragTarget.value = null;
// };

// 开始拖拽事件
const dragStart = (e) => {
  console.log("dragStart");
  emit("dragStart",e);
  // console.log("dragStart", e);
  // mouseDownTargetPosition.value = { x: e.offsetX, y: e.offsetY };
  // dragTarget.value = findTarget(e.target);
  // document.addEventListener("mousemove", dragHandler);
  // document.addEventListener("mouseup", dragEnd);
  // document.body.onselectstart = () => {
  //   return false;
  // };
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
