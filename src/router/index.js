import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]
export const asyncRoutes = [
  // 收益查询
  {
    path:'/finance',
    component: Layout,
    meta:{ icon:'finance', title:'收益查询' },
    children:[
      {
        component:() => import('@/views/virtualProfit/virtualProfit'),
        meta:{title:'贝壳收益' },
        name:'virtualProfit',
        path:'virtualProfit'
      },
      {
        component:() => import('@/views/accountProfit/accountProfit'),
        meta:{title:'出行收益'},
        name:'accountProfit',
        path:'accountProfit'
      }
    ],
  },
  // 下属管理
  {
    path:'/region',
    component: Layout,
    meta:{icon:'region',title:'下属管理'},
    children:[
      {
        component:()=>import('@/views/subTravelerInfo/subTravelerInfo'),
        meta:{ title:'下属向导查询'},
        name:'subTravelerInfo',
        path:'subTravelerInfo'
      },
      {
        component:() => import('@/views/subVirtualProfit/subVirtualProfit'),
        meta:{ title:'下属贝壳收益' },
        name:'subVirtualProfit',
        path:'subVirtualProfit'
      },
      {
        component:() => import('@/views/subAccountProfit/subAccountProfit'),
        meta:{title:'下属出行收益' },
        name:'subAccountProfit',
        path:'subAccountProfit'
      }
    ],
  },
  // 404 一定要放在最后
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
