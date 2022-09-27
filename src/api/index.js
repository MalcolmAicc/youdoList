import request from './request'

// 注册接口
export const reqUserRegister = (data) => request({
    url:'/admin/register',
    method:'post',
    data
})

// 登录接口
export const reqUserLogin = (data) => request({
    url:'/admin/login',
    method:'post',
    data
})

// 获取用户信息
export const reqGetUserInfo = (data) => request({
    url:'/userinfo',
    method:'post',
    data
})

// 获取任务列表
export const reqGetListInfo = (data) => request({
    url:'/listinfo',
    method:'post',
    data
})


export const reqRemoveImg = (data) => request({
    url:'/removeImg',
    method:'post',
    data
})

// 任务列表提交修改
export const reqUpdateList = (data) => request({
    url:'/updateinfo',
    method:'post',
    data
})

// 添加任务
export const addTaskValues = (data) => request({
    url:'/addTaskValue',
    method:'post',
    data
})
// 更新任务
export const updateTaskTagDate = (data) => request({
    url:'/updateTask',
    method:'post',
    data
})
// 删除任务
export const removeTask = (data) => request({
    url:'/removeTask',
    method:'post',
    data
})