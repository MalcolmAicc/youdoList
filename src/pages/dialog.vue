<template>
    <!-- 弹出框 -->
    <el-dialog v-model="dialogFormVisible" title="修改信息">
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
            <!-- 上传头像 -->
            <el-form-item label="上传头像">
                <el-upload action="http://127.0.0.1:3007/api/uploadimg" :headers="{ 'Authorization': token }"
                    list-type="picture-card" :auto-upload="true" :on-success="logresult">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    <!-- 做展示 -->
                    <template #file="{ file }">
                        <div>
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                            <span class="el-upload-list__item-actions">
                                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                    <el-icon>
                                        <zoom-in />
                                    </el-icon>
                                </span>
                                <span v-if="!disabled" class="el-upload-list__item-delete"
                                    @click="handleDownload(file)">
                                    <el-icon>
                                        <Download />
                                    </el-icon>
                                </span>
                                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
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
    </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { onMounted } from 'vue';
import type { UploadFile,UploadFiles } from 'element-plus'
import throttle from '@/hooks/throttle.js'
import moveTask from '@/hooks/moveTask.js'
import { Search ,Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import { reqGetUserInfo } from '@/api/index.js'
import { update } from 'lodash';

const formLabelWidth = '140px'
const dialogFormVisible = ref(false)
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const token = ref()

// 接受prop传递的参数
const props = defineProps(['dialogFormVisible','userInfo'])

// 删除照片
const handleRemove = (file: UploadFile) => {
  console.log(file)
}
// 预览照片
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
// 取消上传照片
const handleDownload = (file: UploadFile) => {
  console.log(file)
}
// 上传成功回调
const logresult = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    userInfo.value.user_pic = response.url;
    console.log(response,userInfo.value)
}

// 点击confrim
const updateUser =async function(){
    dialogFormVisible.value = false;
    let result = await reqGetUserInfo(userInfo.value);
    console.log(result);
    // userInfo.value = result.data;
}
</script>

<style>
</style>