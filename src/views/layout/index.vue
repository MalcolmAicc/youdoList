<template>
    <div class='app'  v-loading.fullscreen.lock="fullscreenLoading">
        <div class="headtion flex flex-col justify-center items-center" m="auto" w="46">
            <!-- <el-avatar @click="openChange" class="avatar" style="cursor: pointer;" :src="userInfo.user_pic" /> -->
            <el-avatar @click="openChange" class="avatar" style="cursor: pointer;" :src="yang" />
            <!-- 弹出框 -->
            <!-- <el-dialog v-model="dialogFormVisible" title="修改信息">
                <el-form :model="userInfo" label-width="120px">
                    <el-form-item label="用户名">
                        <el-input v-model="userInfo.username" />
                    </el-form-item>
                    <el-form-item label="昵称">
                        <el-input v-model="userInfo.nickname" />
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="userInfo.email" />
                    </el-form-item>
                    <el-form-item label="上传头像">
                        <el-upload 
                            action="http://127.0.0.1:3007/api/uploadimg" 
                            :headers="{'Authorization' : token}" 
                            list-type="picture-card" 
                            :auto-upload="true"
                            :on-success="logresult"
                        
                        >
                            <el-icon><Plus /></el-icon>
                            <template #file="{ file }">
                                <div>
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                    <span class="el-upload-list__item-actions">
                                    <span
                                        class="el-upload-list__item-preview"
                                        @click="handlePictureCardPreview(file)"
                                    >
                                        <el-icon><zoom-in /></el-icon>
                                    </span>
                                    <span
                                        v-if="!disabled"
                                        class="el-upload-list__item-delete"
                                        @click="handleDownload(file)"
                                    >
                                        <el-icon><Download /></el-icon>
                                    </span>
                                    <span
                                        v-if="!disabled"
                                        class="el-upload-list__item-delete"
                                        @click="handleRemove(file)"
                                    >
                                        <el-icon><Delete /></el-icon>
                                    </span>
                                    </span>
                                </div>
                            </template>
                        </el-upload>
                    </el-form-item>

                    <el-dialog v-model="dialogVisible">
                        <img w-full :src="dialogImageUrl" alt="Preview Image" />
                    </el-dialog>



                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">Cancel</el-button>
                        <el-button type="primary" @click="updateUser">Confirm</el-button>
                    </span>
                </template>
            </el-dialog> -->
            <!-- 展示用户名 -->
            <span>{{ userInfo.username }}</span>
            <!-- 搜索按钮 -->
            <i @click="search" class="iconfont">&#xe65c;</i>
            <input type="text" placeholder="Search your tasks" :prefix-icon="Search">

            <!-- 发送消息邮箱部分 -->
            <div class="aside">
                <el-badge :value="99" :max="100" :hidden="false" class="item">
                    <el-tooltip content="你的消息还没做好" placement="bottom" effect="light">
                        <i @click="search" class="iconfont">&#xe9d0;</i>
                    </el-tooltip>
                </el-badge>
                <el-tooltip content="退出登录" placement="bottom" effect="light">
                    <i style="margin-left:40px;" @click="logout" class="iconfont logout">&#xe612;</i>
                </el-tooltip>
            </div>
        </div>
        <main class='project'>

            <!-- 任务栏名称 -->
            <div class='project-tasks'>
                <div class='project-column' v-for="(state,index) in taskPending" ref="project-column" >
                    <!-- Task Ready -->
                    <div class='project-column-heading'>
                        <h2 class='project-column-heading__title'>{{state}}</h2>
                        <el-popover placement="bottom" width="50px" trigger="click" popper-class="teshu">
                            <template #reference>
                                <button class='project-column-heading__options'><i class="fas fa-ellipsis-h"></i></button>
                            </template>
                            <div style="display: flex;justify-content: center;" class="pop">
                                <ul style="list-style:none;display: flex;flex-direction: column;text-align: center;">
                                    <li>还没</li>
                                    <li>想好</li>
                                    <li>咋做</li>
                                </ul>
                            </div>

                        </el-popover>

                    </div>

                    <div class="container">
                        <el-skeleton style="width: 240px" :loading="loading" animated :count="2">
                        <template #template>
                            <el-skeleton-item variant="image" style="width: 323px; height: 162px" />
                                <div style="padding: 14px">
                                <el-skeleton-item variant="h3" style="width: 50%" />
                                <div
                                    style="
                                    display: flex;
                                    align-items: center;
                                    justify-items: space-between;
                                    margin-top: 16px;
                                    height: 16px;
                                    "
                                >
                                    <el-skeleton-item variant="text" style="margin-right: 16px" />
                                    <el-skeleton-item variant="text" style="width: 30%" />
                                </div>
                            </div>
                        </template>
                            <template #default>
                               <div class='task' ref="task" draggable='true' v-for="item in listInfo[state]" @click.stop="modifyTasks(item)"  :key="item.list_id">
                                    <!-- 标签头部 -->
                                    <div class='task__tags'>
                                        <span class='task__tag task__tag--copyright' 
                                            v-for="(tag,index) in item.tag" 
                                            :key="index" 
                                            v-if="item.tag !== ''"
                                            :style="{'background-color': tag.color,'color': tag.textColor}"
                                            >{{tag.tagName}}</span>
                                        <div @click.stop>
                                            <el-popover placement="bottom" :width="50" trigger="click" popper-class="teshu">
                                                <template #reference>
                                                    <!-- <div class="optionsQua"> -->
                                                        <button style="cursor: pointer;" class='task__options'><i class="fas fa-ellipsis-h"></i></button>
                                                    <!-- </div> -->
                                                </template>
                                                <div class="pop" style="display: flex;justify-content: center;">
                                                    <ul style="list-style:none;display: flex;flex-direction: column;text-align: center;">
                                                        <li @click="taskDone(item)">完成</li>
                                                        <li @click="remove(item)">删除</li>
                                                    </ul>
                                                </div>
                                            </el-popover>
                                        </div>
                                    </div>
                                    <!-- <h3>{{item.listtitle}}</h3> -->
                                    <p>{{item.listvalue}}</p>
                                    <div class='task__stats' v-if="item.deadline !== '' && item.area !== 'Done'">
                                        <span><time datetime={{item.date}}><i class="iconfont">&#xe65f;</i>{{item.deadline}}</time></span>
                                    </div>
                                    <div class='task__stats' v-if="item.area === 'Done'" style="color:rgb(58, 163, 97)">
                                        <span><time datetime={{item.date}}><i style="margin-right:8px" class="iconfont">&#xe615;</i>已完成</time></span>
                                    </div>
                                </div>

                                <AddTask @closeDialog="updateTaskValue" :area="Object.keys(listInfo)[index]"/>
                                    
                            </template>
                        </el-skeleton>
                    </div>

                </div>
                
                <ChangeTaskValue @openCloseDialog="changeTaskValues" :taskVisible="taskVisible" :taskItem="taskItem"/>
            </div>
        </main>
        
        <Aside :doneLength="doneLength"/>
    </div>
</template>

<script setup>
import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/js/all.min.js'
import yang from '@/views/layout/yang.svg'
import dayjs from 'dayjs' ;
import {ref , onMounted, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { menuItemEmits } from 'element-plus'
import throttle from '@/hooks/throttle.js'
import moveTask from '@/hooks/moveTask.js'
import deepClone from '@/hooks/deepClone.js'
import { Search ,Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import { reqGetUserInfo , reqRemoveImg , reqGetListInfo , reqUpdateList, addTaskValues, updateTaskTagDate , removeTask} from '@/api/index.js'
import AddTask from '@/components/AddTask.vue'
import ChangeTaskValue from '@/components/ChangeTaskValue.vue'
import Aside from '@/components/Aside.vue'

const router = useRouter()
const ins = getCurrentInstance();
const bus = ins.appContext.config.globalProperties.$bus
const dialogFormVisible = ref(false)
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const token = ref()
const disabled = ref(false)
const loading = ref(false);
const taskVisible = ref(false)
// 任务栏状态数组
let taskPending = ref(['Ready','Progress','Review','Done'])
let isShow = ref(true)

// 点击已有看板将点击的看板内容传递给子组件
let taskItem = ref({})

let date = ref('');

// 任务卡片的dom节点
let task = ref();
// 任物数量
let taskCount = ref()
const fullscreenLoading = ref(false)

// 用户信息列表
let userInfo = ref({
    username: '',
    user_id: '',
    nickname: '',
    email: '',
    user_pic: '',
})

// task列表
let listInfo= ref({
    Ready:[],
    Progress:[],
    Review:[],
    Done:[],
})

// 要上传的双向绑定列表
let form = ref({
    list_id:'',
    listtitle: '',
    listvalue: '',
    status: 1,
    isshow: 0,
    //直接从用户获取
    user_id: 0,
    area: '',
    tag: '',
    //当天日期
    date: '',
    deadline:''
})

const logout = () => {
  localStorage.removeItem('Authorization');
  router.push({path:'/register'})
}

// 点击头像修改用户信息事件
const openChange = function () {
    dialogFormVisible.value = true;
}

// 添加任务事件
const addTask = throttle(function () {
    isShow.value  = !isShow.value
    taskVisible.value = true
}, 1000)

// 点击已有的任务看板触发添加到期日和标签dialog事件
const modifyTasks = (item) => {
    console.log(item)
    taskItem.value = item
    taskVisible.value = true;
}

// 搜索事件
const search = function () {
    console.log('aaa')
}

let allListLength = ref(0)
// 获取用户信息和任务列表
const getData = async function () {
    let result = await reqGetUserInfo();
    userInfo.value = result.data;
    userInfo.value.user_pic = userInfo.value.user_pic === "" ? 'http://127.0.0.1:3007/upload/piulianggaigai.jpg' : result.data.user_pic;
    
    bus.emit('userId',userInfo.value.user_id)

    let list = await reqGetListInfo({
        id:result.data.user_id,
        time:dayjs().format('MMM DD YYYY ddd')
    });
    // 将任务列表分组
    list.data.forEach((item) => {
        item.tag = item.tag !== '' ? JSON.parse(item.tag) : ''
        switch(item.area){
            case 'Ready':
                // item.date = item.date.split(' ');
                listInfo.value.Ready.push(item);
                break;
            case 'Done':
                // item.date = item.date.split(' ');
                listInfo.value.Done.push(item)
                break;
            case 'Progress':
                // item.date = item.date.split(' ');
                listInfo.value.Progress.push(item)
                break;
            case 'Review':
                // item.date = item.date.split(' ');
                listInfo.value.Review.push(item)
                break;
            default:
                alert('任务完成了')
        }
    })
    
    form.value.user_id = userInfo.value.user_id;
    form.value.date = dayjs().format('MMM DD YYYY ddd HH:mm:ss');
    loading.value = false;
    allListLength.value = list.data.length
}

// 删除照片
const handleRemove = async (file) => {
    // let files = file.response;
    let result = await reqRemoveImg(file.response);
    let noneImg = userInfo.value;
    noneImg.user_pic = ""
    console.log(noneImg);
    updateUser(noneImg);
    getData(); 
}
// 预览照片
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

// 上传成功回调
const logresult = (response, uploadFile, uploadFiles) => {
    userInfo.value.user_pic = response.url;
    console.log(response,userInfo.value)
}

// 点击confrim
const updateUser = async function(data){
    dialogFormVisible.value = false;
    let result = await reqGetUserInfo(userInfo.value);
    userInfo.value = result.data;
}

// task操作
const changeTask = function(){
    console.log('aaa');
}

const doneLength = ref(0)
// 完成任务操作
const taskDone = async function(item){
    
    let area = item.area
    let length = listInfo.value[area].length;
    console.log(listInfo.value.Ready.length)
    for (let index = 0; index < length; index++) {
        if (listInfo.value[area][index] === item) {
            listInfo.value[area].splice(index,1);
        }
    }
    // let data = ['Done',item.list_id]
    let id = item.list_id === undefined ? form.value.list_id : item.list_id
    // console.log(id)
    let result = await reqUpdateList(['Done',id])
    // console.log(result)
    // }
    // 将任务状态改成完成
    item.area = 'Done'
    listInfo.value.Done.push(item);
    // console.log(item);
    doneLength.value = listInfo.value.Done.length
    // bus.emit('donecount',doneLength.value) // 完成任务传递完成个数
}

// 删除任务
const remove = async (task) => {
    let taskarea = listInfo.value[task.area]
    for(let i=0;i<taskarea.length;i++){
        if (taskarea[i].list_id === task.list_id) {
            taskarea.splice(i,1)
        }
    }
    if (task.list_id === undefined) {
        task.list_id  = form.value.list_id
    }
    console.log(task);
    let result = await removeTask(task)
    bus.emit('remove',task.area)
    allListLength.value -= 1
}

const timePick = ref(null)

const showDatePicker = async function(){
    timePick.value.focus();
}

// 添加新任务功能
const updateTaskValue = async function(val){
    form.value.list_id = ''
    console.log(val);
    form.value = val;
    form.value.user_id = userInfo.value.user_id; 
    form.value.date = dayjs().format('MMM DD YYYY ddd HH:mm:ss');

    let deepCloneObj = deepClone(form.value)
    listInfo.value[val.area].push(deepCloneObj)
    let result = await addTaskValues(form.value);
    // console.log(result)
    form.value.list_id = result.data.insertId
    // 总任务+1
    allListLength.value += 1
    bus.emit('changecount',allListLength.value) // 事件总线传输新增任务后的总长度
}

// 添加到期日和标签的子组件通信事件
const changeTaskValues = async (val) => {
    console.log(val);
    taskVisible.value = false;
    val.tag = JSON.stringify(val.tag)
    console.log(form.value.list_id)
    if (val.list_id === undefined) {
        val.list_id = form.value.list_id
    }
    let result = await updateTaskTagDate(val)
}

fullscreenLoading.value = true


// 组件DOM挂载完毕执行拖动代码
onMounted(() => {
    // 获取dom节点
    setTimeout(() => {
        moveTask(task.value);
    },500)

    getData(); 
    // 存储token
    token.value = localStorage.getItem('Authorization');
    // 获取当天的日期
    // console.log(dayjs().format('MMM DD YYYY ddd HH:mm:ss'));
    // console.log(timePick.value);
    fullscreenLoading.value = false
})

</script>



<style lang="scss">
@font-face {
  font-family: 'iconfont';  /* Project id 3221210 */
  src: url('//at.alicdn.com/t/c/font_3221210_2gigjljmcb2.woff2?t=1663774687664') format('woff2'),
       url('//at.alicdn.com/t/c/font_3221210_2gigjljmcb2.woff?t=1663774687664') format('woff'),
       url('//at.alicdn.com/t/c/font_3221210_2gigjljmcb2.ttf?t=1663774687664') format('truetype');
}


.iconfont {
    cursor: pointer;
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
}

.logout{
    transition: 0.5s ease-in-out;
}

.logout:hover{
    color: red;
}

.iconfonts{
    display: inline-flex;
    .date{
        height: 32px;
        min-width: 32px;
        max-width: 32px;
        border-radius: 8px;
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        cursor: pointer;
        background-color: rgba(3, 14, 44, 0.04);
        margin-right: 5px;
        margin-top: 20px;
    };
    
    .date:hover{
        background-color: rgba(157, 157, 157, 0.447);
    }   
}

:root {
    --bg: #ebf0f7;
    --header: #fbf4f6;
    --text: #2e2e2f;
    --white: #ffffff;
    --light-grey: #c4cad3;
    --tag-1: #ceecfd;
    --tag-1-text: #2e87ba;
    --tag-2: #d6ede2;
    --tag-2-text: #13854e;
    --tag-3: #ceecfd;
    --tag-3-text: #2d86ba;
    --tag-4: #f2dcf5;
    --tag-4-text: #fff;
    --purple: #7784ee;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;

}

html{
    height: 100%;
}

body {
    color: var(--text);
    height: 100%;
}

@mixin display {
    display: flex;
    align-items: center;
}

.app {
    background-color: #ebf0f7;
    width: 100%;
    min-height: 100vh;
}

h1 {
    font-size: 30px;
}

.app>.headtion {
    position: relative;
    top: 0px;
    // width: 1088px;
    height: 60px;
    background-color: #ffffff;
    box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, .04), 0px 8px 20px rgba(0, 0, 0, .08);
    border-radius: 15px;
}

.app>.headtion>.avatar {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 20px;
}

.app>.headtion>span {
    font-size: 12px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 70px;
    color: #13854e;
}

.app>.headtion>input {
    position: absolute;
    left: 170px;
    top: 12px;
    width: 626px;
    height: 36px;
    border-radius: 200px 200px 200px 200px;
    outline: none;
    background-color: #ebf0f7;
    border: none;
    padding-left: 30px;
}

.app>.headtion>.iconfont {
    position: absolute;
    top: 22px;
    left: 179px;
    z-index: 100;
    cursor: pointer;
}

.app>.headtion>.aside {
    position: absolute;
    right: 200px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
}

.project {
    padding: 2rem;
    max-width: 75%;
    width: 100%;
    display: inline-block;
    height: 92vh;

    &-info {
        padding: 2rem 0;
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }

    &-participants {
        @include display;

        span,
        &__add {
            width: 30px;
            height: 30px;
            display: inline-block;
            background: #7784ee;
            border-radius: 100rem;
            margin: 0 .2rem;
        }

        &__add {
            background: transparent;
            border: 1px dashed rgb(150, 150, 150);
            font-size: 0;
            cursor: pointer;
            position: relative;

            &:after {
                content: '+';
                font-size: 15px;
                color: rgb(150, 150, 150);

            }
        }
    }

    &-tasks {
        display: grid;
        height: calc(100%);
        overflow: visible;
        grid-template-columns: repeat(4, 1fr);
        width: 100%;
        grid-column-gap: 1.5rem;
    }

    &-column {
        padding: 5px 10px;
        &-heading {
            margin-bottom: 1rem;
            @include display;
            justify-content: space-between;

            &__title {
                font-size: 20px;

            }

            &__options {
                background: transparent;
                color: #c4cad3;
                font-size: 18px;
                border: 0;
                cursor: pointer;
            }
        }

        .container{
            height: 77vh;
            overflow: auto;
        }

        .container::-webkit-scrollbar{
            height: 10px;
            width: 15px;
            margin-left: 10px;
        }

        .container::-webkit-scrollbar-thumb {
            border-radius: 10px;
            border: 5px solid rgba(139, 139, 139, 0);
            box-shadow: 8px 0 0 #dbdde0 inset;
        }

    }

    &-column:hover{
        background-color: #EBEDF0;
        border-radius: 10px;
    }

}

.task {
    cursor: move;
    background-color: #fff;
    padding: 10px 12px;
    border-radius: 8px;
    width: 100%;
    max-width: 300px;
    box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
    margin-bottom: 1rem;
    border: 3px dashed transparent;
    position: relative;
    transition: 0.5s all ease-in-out;
    word-break:break-all;
    
    &:hover {
        box-shadow: rgba(99, 99, 99, 0.3) 0px 2px 8px 0px;
        border-color: rgba(162, 179, 207, .2) !important;
    }

    &:hover &__options{
        display: block;
    }

    input{
        border: none;
        background-color: rgba($color: #000000, $alpha: 0.0);
        outline: none;
    }

    h3{
        font-size: 16px;
        margin: 0.5rem 0 0 0;
    }

    p {
        font-size: 15px;
        margin: 0.1rem 0 0.1rem 0;
    }

    &__tag {
        display: inline-block;
        border-radius: 100px;
        padding: 2px 13px;
        font-size: 12px;
        margin-right: 10px;
        max-width: 200px;
        max-height: 22px;
        overflow: hidden;
        color: #fff;
    }

    &__tags {
        width: 100%;
        // @include display;
        justify-content: space-between;

        li:hover{
            background-color: #d459e8;
        }
    }

    &__options {
        width: 26px;
        position: absolute;
        right: 20px;
        top: 10px;
        display: none;
        background: #EBF0F7;
        border-radius: 50%;
        border: 0;
        color: #c4cad3;
        font-size: 17px;
        transition: 1s all ease-in-out;
        // box-shadow: 0px 12px 32px 4px rgb(0 0 0 / 4%), 
        // 0px 8px 20px rgb(0 0 0 / 8%);
    }

    &__options:hover{
        box-shadow: 0px 12px 32px 4px rgb(0 0 0 / 4%), 
        0px 8px 20px rgb(0 0 0 / 8%);
    }

    &__stats {
        margin-top: 10px;
        position: relative;
        width: 100%;
        color: rgb(255, 161, 46);
        height: 18px;
        line-height: 18px;
        font-size: 12px;

        span:not(:last-of-type) {
            margin-right: 1rem;
        }
        
        span{
            font-size: 15px;
        }

        svg {
            margin-right: 5px;
        }

    }

    &__owner {
        width: 25px;
        height: 25px;
        border-radius: 100rem;
        background: #7784ee;
        position: absolute;
        display: inline-block;
        right: 0;
        bottom: 0;

    }
}

.task-hover {
    border: 3px dashed #c4cad3 !important;
}

.task-details {
    width: 24%;
    border-left: 1px solid #d9e0e9;
    display: inline-block;
    height: 100%;
    vertical-align: top;
    padding: 0 2rem;
}

.tag-progress {
    margin: 1.5rem 0;

    h2 {
        font-size: 16px;
        margin-bottom: 1rem;
    }

    p {
        display: flex;
        width: 100%;
        justify-content: space-between;

        span {
            color: rgb(180, 180, 180);
        }
    }

    .progress {
        width: 100%;
        -webkit-appearance: none;
        appearance: none;
        border: none;
        border-radius: 10px;
        height: 10px;

        &::-webkit-progress-bar,
        &::-webkit-progress-value {
            border-radius: 10px;
        }

        &--copyright {
            &::-webkit-progress-bar {
                background-color: #ecd8e6;
            }

            &::-webkit-progress-value {
                background: #d459e8
            }
        }

        &--illustration {
            &::-webkit-progress-bar {
                background-color: #dee7e3;

            }

            &::-webkit-progress-value {
                background-color: #46bd84;
            }
        }

        &--design {
            &::-webkit-progress-bar {

                background-color: #d8e7f4;
            }

            &::-webkit-progress-value {
                background-color: #08a0f7;
            }
        }


    }
}

.task-activity {
    h2 {
        font-size: 16px;
        margin-bottom: 1rem;
    }

    li {
        list-style: none;
        margin: 1rem 0;
        padding: 0rem 1rem 1rem 3rem;
        position: relative;
    }

    time {
        display: block;
        color: #c4cad3;
    }
}

.task-icon {
    width: 30px;
    height: 30px;
    border-radius: 100rem;
    position: absolute;
    top: 0;
    left: 0;
    @include display;
    justify-content: center;


    svg {
        font-size: 12px;
        color: #fff;
    }

    &--attachment {
        background-color: #fba63c;
    }

    &--comment {
        background-color: #5dc983;
    }

    &--edit {
        background-color: #7784ee;
    }

}





@media only screen and (max-width: 1300px) {
    .project {
        padding: 2rem;
        max-width: 75%;
        width: 100%;
        display: inline-block;
        height: 92vh;
    }

    .task-details {
        width: 24%;
        border-left: 1px solid #d9e0e9;
        display: inline-block;
        height: 100%;
        vertical-align: top;
        padding: 0 2rem;
    }

    .project-column:nth-child(3) {
        display: none;
    }

    .project-tasks {
        grid-template-columns: repeat(3, 1fr);
    }

    .tag-progress,
    .task-activity {
        flex-basis: 50%;
        background: #fff;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem;
    }
}

@media only screen and (max-width: 1000px) {

    .project-column:nth-child(2),
    .project-column:nth-child(3) {
        display: none;
    }
    
    .project-tasks {
        grid-template-columns: 1fr 1fr;
    }
}



// @media only screen and (max-width: 600px) {
//     .project-column:nth-child(4) {
//         display: none;
//     }

//     .project-tasks {
//         grid-template-columns: 1fr;
//     }

//     .task-details {
//         flex-wrap: wrap;
//         padding: 3rem 1rem;
//     }

//     .tag-progress,
//     .task-activity {
//         flex-basis: 100%;
//     }

//     h1 {
//         font-size: 25px;
//     }
// }
</style>