<template>
  <div class="calenter">
    <div class="datepicker">
        <el-date-picker
            v-model="date"
            type="date"
            placeholder="Pick a day"
            size="default"
            @change="choseDate"
            :disabled-date="disabledDate"
            value-format='MMM DD YYYY ddd'
            format="YYYY-MMM-DD"
        />
    </div>
    <div class="nav">
        <img src="./Empty.svg" alt="" v-if="tasks.length === undefined">
        <div class="taskcolumn" v-for="task in tasks" :key="task.list_id" v-if="tasks.length !== undefined">
            <span>{{task.listvalue}}</span>
            <i v-if="task.area === 'Done'" class="iconfont done">&#xe615;</i>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref , getCurrentInstance , onMounted} from 'vue'
import {reqGetListInfo} from '@/api/index.js'
import dayjs from 'dayjs' ;

let date = ref('')
let user_id = ref(0)
let tasks = ref([])

const ins = getCurrentInstance();
const bus = ins.appContext.config.globalProperties.$bus

bus.on('userId',(value) => {
    user_id.value = value
    historyTask()
})

const disabledDate = (time) => {
    return time.getTime() > Date.now()
}

// 选择历史日期查看
const choseDate = async function(){
    // console.log(date.value)
    let result = await reqGetListInfo({
        id:user_id.value,
        time:date.value
    })
    console.log(result)

    tasks.value = result.data
    console.log(tasks.value.length);
}

const historyTask = async () => {
    let sevenDaysAgo_time = dayjs().subtract(1, 'day') // 计算1天前的时间
    let sevenDaysAgo = dayjs(sevenDaysAgo_time.$d).format('MMM DD YYYY ddd')
    date.value = sevenDaysAgo
    let result = await reqGetListInfo({
        id:user_id.value,
        time:sevenDaysAgo
    })
    tasks.value = result.data
    console.log(tasks.value);
}   

</script>

<style>
@font-face {
  font-family: 'iconfont';  /* Project id 3221210 */
  src: url('//at.alicdn.com/t/c/font_3221210_2gigjljmcb2.woff2?t=1663774687664') format('woff2'),
       url('//at.alicdn.com/t/c/font_3221210_2gigjljmcb2.woff?t=1663774687664') format('woff'),
       url('//at.alicdn.com/t/c/font_3221210_2gigjljmcb2.ttf?t=1663774687664') format('truetype');
}

.iconfont{
    font-family:"iconfont" !important;
    font-size:16px;font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
}

.calenter{
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.calenter > .datepicker{
    margin-top: 20px;
}

.nav{
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    width: 100%;
    max-height: 40vh;
    overflow: auto;
    /* background-color: antiquewhite; */
}

.nav::-webkit-scrollbar{
            height: 10px;
            width: 15px;
            margin-left: 10px;
        }

.nav::-webkit-scrollbar-thumb {
    border-radius: 10px;
    border: 5px solid rgba(139, 139, 139, 0);
    box-shadow: 8px 0 0 #dbdde0 inset;
}

.nav > .taskcolumn{
    display: flex;
    font-size: 12px;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    margin-bottom: 10px;
    padding-left: 10px;
    border-radius: 10px;
    box-shadow: rgb(99 99 99 / 10%) 0px 2px 8px 0px;
}

.done{
    margin-left: 10px;
    color: #20B759;
}
</style>