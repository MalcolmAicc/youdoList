import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { // 重定向
      path: '/',
      redirect:'/register',
      component: () => import('../views/registerLogin/register.vue'),
      meta: { transition: 'slide-left' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/registerLogin/register.vue')
    },
    {
      path:'/layout',
      name:'layout',
      component: () => import('../views/layout/index.vue'),
    }
  ]
})
// 路由守卫
router.beforeEach((to, from, next) => {
  //to:获取到要跳转到的路由信息
  //from：获取到从哪个路由跳转过来来的信息
  //next: next() 放行  next(path) 放行  
  //方便测试 统一放行
 //  next();
 //获取仓库中的token-----可以确定用户是登录了
  //用户登录了
  let token = localStorage.getItem('Authorization')
  if(token){
    //已经登录而且还想去登录------不行
    if(to.path=='/register'){
       next('/layout');
    }
  }
  next()
});

router.afterEach((to, from, failure) => {
  if (to.path == '/register' && from.path == '/layout') {
    location.reload()
  }
})
export default router
