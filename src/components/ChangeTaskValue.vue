<template>
  <el-dialog v-model="props.taskVisible" title="Your任务 | 亲" @close="closeDialog" @open="openDialog">
        <div class="content">
            <el-input 
                v-model="form.listvalue" 
                type="textarea" 
                :autosize="{ minRows: 1, maxRows: 4 }" 
                placeholder="你想添加的任务" 
                style="font-size:22px"
            />
        </div>
        <div class="iconfonts">
            <div class="date" @click="showDatePicker">
                <el-tooltip content="添加到期日" placement="bottom" effect="light" :show-after="300">
                    <i style="position:absolute;z-index:100" class="iconfont" >&#xe65f;</i>
                </el-tooltip>
                
                <el-date-picker
                    v-model="form.deadline"
                    type="date"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                    placeholder="Pick a day"
                    size="small"
                    ref="timePick"
                    style="opacity:0;"
                    :disabled-date="disabledDate"
                />
            </div>
            <div class="date">
                <el-popover placement="right" :width="280" trigger="click" :show-arrow=false popper-class="tag-popper" :visible="tagVisible">
                    <template #reference>
                        <div @click="openTag">
                            <el-tooltip content="添加标签" placement="bottom" effect="light" :show-after="300">
                                <i class="iconfont">&#xe61d;</i>
                            </el-tooltip>
                        </div>
                    </template>
                    <div class="tagTag">
                        <div class="title">
                            <span>添加看板标签</span>
                            <hr style="background-color:#F5F6F7;border:none;height:1px">
                        </div>
                        <el-input v-model="inputValue.tagName" placeholder="新建标签" autofocus=true></el-input>
                        <div style="margin-top:20px">
                            <span>选择一个颜色</span>
                        </div>
                        <div class="colorWall">
                            <div  @click="changeColor(color)" 
                            v-for="(color,index) in colors" 
                            :key="index" 
                            :style="{'background-color': color.color}">
                                <i style="font-size:25px;color:#fff" v-if="color.checked" class="iconfont">&#xe615;</i>
                            </div>
                        </div>

                        <div class="button">
                            <button @click="cancelPop" >取消</button>
                            <button @click="handleInputConfirm">保存</button>
                        </div>
                    </div>
                </el-popover>

            </div>

            <div class="date">
                <el-tooltip content="还没想好" placement="bottom" effect="light" :show-after="300">
                    <i class="iconfont">&#xe62c;</i>
                </el-tooltip>
            </div>
            <div class="date">
                <el-tooltip content="还没想好" placement="bottom" effect="light" :show-after="300">
                    <i class="iconfont">&#xe62c;</i>
                </el-tooltip>
            </div>
        </div>
        
        <!-- 到期日标签 -->
        <div class="timeTag">
            <i class="iconfont" v-if="form.deadline !== ''">&#xe65f;</i>
            <el-tag
                v-if="form.deadline !== ''"
                class="mx-1"
                closable
                round
                :disable-transitions="false"
                @close="handleCloseTime()"
                style="color:#29324B;background-color:white;font-size:14px"
            >
                {{ form.deadline }}
            </el-tag>
        </div>
        <!-- 标签 -->
        <div class="tagsTag">
            <i class="iconfont" v-if="form.tag.length">&#xe61d;</i>
            <el-tag
                v-for="(tag,index) in form.tag"
                :key="index"
                class="mx-1"
                closable
                round
                :color="tag.color"
                :disable-transitions="false"
                @close="handleClose(tag)"
            >
                {{ tag.tagName }}
            </el-tag>
        </div>


    </el-dialog>
</template>

<script setup>
import { ref, defineEmits , defineProps , onMounted} from 'vue'
import throttle from '@/hooks/throttle.js'
import deepClone from '@/hooks/deepClone.js'
import { dropdownMenuProps, ElMessage, formEmits  } from 'element-plus'

const addTaskBlankIsShow = ref(false)
const addTaskButtonIsShow = ref(false)

const timePick = ref('');

let props = defineProps(['taskVisible','taskItem'])

const tagsTags = ref([]);
const timesTags = ref()
const inputVisible = ref(false)
const inputValue = ref({
    tagName:'',
    color:''
});
const closable = ref(false);
const checked = ref(false);
// 颜色选择模块
const colors = ref([
    {color:'#F2DCF5',checked:false},
    {color:'#CEECFD',checked:false},
    {color:'#D6EDE2',checked:false},
    {color:'#FBA63C',checked:false},
    {color:'#FF4E42',checked:false},
    {color:'#11AFA7',checked:false},
    {color:'#168BE8',checked:false},
    {color:'#193883',checked:false},
])
const timeTag = ref([])
const todoTask = ref('')
const ifCanUse = ref(true)
const tagVisible = ref(false)

let isShow = ref(true)

// 把这个form在失去焦点的时候传递给父组件
let form = ref({
    list_id:'',
    area:'',
    listtitle: '',
    listvalue: '',
    status: 1,
    isshow: 0,
    user_id: 0,
    area: '',
    tag: '',
    date: '',
    deadline:''
})

const disabledDate = (time) => {
    return time.getTime() < Date.now() - (1 * 24 * 60 * 60 * 1000)
}

// 添加任务事件
const addTask = throttle(function () {
    // isShow.value  = !isShow.value
    // taskVisible.value = true
    addTaskBlankIsShow.value = true;
    addTaskButtonIsShow.value = false;
}, 1000)


const cancelTaskValue = () => {
  addTaskBlankIsShow.value = false;
  addTaskButtonIsShow.value = true;
}

const openTag = function(){
    tagVisible.value = true
}

const showDatePicker = async function(){
    timePick.value.focus();
}

// 关闭弹出框的回调
const close = defineEmits(['openCloseDialog'])

// 关闭dialog的回到
const closeDialog = function(){
    // form.value.tag = tagsTags.value;
    let deepTag = deepClone(form.value)
    close('openCloseDialog',deepTag);
}

// 打开dialog的回调
const openDialog = function(){
    console.log(props.taskItem)
    form.value = props.taskItem;
    form.value.tag = form.value.tag === "" ? [] : form.value.tag
}

const handleClose = (tag) => {
  form.value.tag.splice(form.value.tag.indexOf(tag), 1)
}

// 选择颜色保存按钮
const handleInputConfirm = () => {
    if (inputValue.value.tagName) {
        form.value.tag.push(inputValue.value)
    }

    if(inputValue.value.tagName === ''){
        ElMessage('标签内容不能为空')
    }else{
        inputValue.value = {
            tagName:'',
            color:'',
            textColor: '#fff'
        }
        for(let i=0;i<colors.value.length;i++){
            colors.value[i].checked = false
        };
        tagVisible.value = false
    }
}

// 选择颜色取消按钮
const cancelPop = function(){
    tagVisible.value = false
}

// 选择标签颜色
const changeColor = function(val){
    for(let i=0;i<colors.value.length;i++){
        colors.value[i].checked = false
    };
    val.checked = true;
    inputValue.value.color = val.color;
    console.log(val)
}

// 到期日标签的删除按钮
const handleCloseTime = () => {
  form.deadline = ''
}


onMounted(() => {
    form.value.area = props.area
    addTaskButtonIsShow.value = true
})


</script>


<style scoped>
    .tag-popper.is-light{
        border-radius: 10px;
    }

    .tagTag > .colorWall{
        margin-top: 10px;
        display: grid;
        grid-template-columns:repeat(4,68px);
        grid-row-gap: 10px;
    }

    .tagTag > .colorWall > div{
        width: 50px;
        height: 50px;
        background-color: aquamarine;
        border-radius: 15px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .timeTag{
        margin-top:20px;
    }


    .tagTag > .title{
        text-align: center;
        font-size: 16px;
        margin-bottom: 10px;
    }

    .tagsTag{
        margin-top: 10px;
        font-size: 20px;
    }

    .tagArea{
        margin-left: 10px;
    }

    .mx-1{
        margin-left: 10px;
        transition: all 0.5s ease 0s !important;
    }

    .button{
        margin-top: 10px;
        margin-bottom: 10px;
        border: none;
        margin-left: 105px;
    }

    .button > button{
        font-weight: 500;
        font-size: 16px;
        color: white;
        border-radius: 20px;
        height: 32px;
        width: 68px;
        border: none;
        cursor: pointer;
    }

    .button > button:first-child{
        border-radius: 20px;
        margin-right: 10px;
        height: 32px;
        width: 68px;
        border: none;
        color: #9DA1AD;
        background-color: white;
        transition: 0.5s all ease-in-out;
    }

    .button > button:last-child{
        color: white;
        background-color: #cdd1db;
        transition: 0.5s all ease-in-out;
    }

    .button > button:first-child:hover{
        color: rgba(3, 14, 44, 0.45);
    }

    .button > button:last-child:hover{
        background-color: #acafbb;
    }


</style>