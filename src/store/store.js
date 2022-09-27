import { defineStore } from 'pinia'
import { reqGetUserInfo,reqGetListInfo } from "@/api/index.js";
import { nextTick } from 'vue'

export const userStore = defineStore('userinfo',{

    state:() => ({
        userInfo:{},
        listInfo:[]
    }),

    actions:{
        async getUserInfo(){
            const result = await reqGetUserInfo()
            this.userInfo = result.data
        },
    }
})


// 任务列表
export const listStore = defineStore('listinfo',{

    state:() => ({
        listInfo:{}
    }),


    actions:{
        async getListInfo(){
            const result = await reqGetListInfo(this.userInfo.user_id)
            console.log(result);
        }
    }


})