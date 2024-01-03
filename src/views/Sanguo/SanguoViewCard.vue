<script setup>
import { ref, reactive, watchEffect } from 'vue';

const props = defineProps({
    data: {
        type: Object,
        default: {}
    },
    selectedYear: {
        type: Number,
    }
})
const emit = defineEmits(['outCharacter'])

const data = reactive(props.data)
let age = ref('')
let death = ref('')

const outCharacter = () => {
    emit('outCharacter')
}

watchEffect(() => {
    let ageNum = props.selectedYear - data.birth
    death.value = (data.death - props.selectedYear) < 0
    age.value = death.value ? '去世' : (ageNum > -1 ? ageNum : '未出生')
})
</script>
<template>
    <div class="view-card">
        <div class="content">
            <div class="info">
                <p class="name">{{ data.name }}</p>
                <p>:{{ data.birth }}-{{ data.death }} </p>
                <p class="age">
                    <span v-if="age.value > 0 & !death.value">年龄: </span>
                    <span class="bold">{{ age }}</span>
                </p>
            </div>
            <div class="function">
                <el-button type="primary" size="small" @click="outCharacter">移除</el-button>
            </div>
        </div>

    </div>
</template>
<style scoped lang='scss'>
.view-card {
    width: 33%;
    height: 50px;
    margin: 2px 0;
    line-height: 40px;
    .content {
        position: relative;
        margin: 5px 5px;
        padding: 0 5px 0 5px;
        background-color: rgb(202, 202, 202);
        border-radius: 8px;
        height: 40px;
        font-size: 12px;

        .info {
            float: left;
            display: flex;
            flex-wrap: nowrap;
            &>p{
                margin: 0;
            }
            .name {
                width: 48px;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
            }

            .age {
                width: 65px;
                text-align: center;

            }

            .bold {
                font-size: 14px;
                font-weight: bold;
            }
        }

        .function {
            float: right;

            .el-button {
                margin-top: -3px;
                padding: 5px 6px;
            }
        }
    }

}
</style>