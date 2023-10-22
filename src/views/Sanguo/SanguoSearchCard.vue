<script setup>
import { ref, reactive } from 'vue';

// 接收props
const props = defineProps({
    data: {
        type: Object,
        default: {}
    }
})

// 子传父
const emit = defineEmits(['putCharacter', 'editCharacter', 'deleteCharacter'])

const data = reactive(props.data)

// 事件
// 放置角色
const putCharacter = () => {
    emit('putCharacter')
}
// 编辑角色
const editCharacter = () => {
    emit('editCharacter')
}
// 删除角色
const deleteCharacter = () => {
    emit('deleteCharacter')
}
</script>
<template>
    <div class="search-card">
        <div class="info">
            {{ data.name }} : {{ data.birth }} - {{ data.death }}
        </div>
        <div class="function">
            <el-button type="primary" size="small" @click="putCharacter">存入</el-button>
            <el-button type="primary" size="small" @click="editCharacter">编辑</el-button>
            <el-button type="primary" size="small" @click="deleteCharacter">删除</el-button>
        </div>
    </div>
</template>
<style scoped lang='scss'>
.search-card {
    border-radius: 4px;
    
    background-color: rgb(255, 216, 143);
    padding: 5px 5px 5px 15px;
    font-size: 14px;
    display: flex;
    margin: 5px 0;
    justify-content: space-around;

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