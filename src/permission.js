import router, {
  resetRouter
} from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken,
  removeToken
} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import myhttp from './utils/request'
import commonUrl from './utils/common'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  let hasToken = getToken()

  if (hasToken) {

    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({
        path: '/'
      })
    } else {
      // 判断缓存里有没有 roles                   store.getters.roles && store.getters.roles.length > 0
      // 刷新时 留住roles
      const hasRoles = localStorage.getItem('roles')

      if (hasRoles) {

        store.commit('user/SET_NAME', 'editor')
        store.commit('user/SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif') //头像
        const accessRoutes = await store.dispatch('permission/generateRoutes', []) // 为什么是数组呢？只有数组才能实现递归
        router.addRoutes(accessRoutes)
        next() // 有的话，继续，next在这里的意思，就是继续的意思，比如此刻就去B页面了

      } else {
        try {
          // 退出并重新登录
          console.error(res)
          console.error('没有用户信息，数据异常')

          localStorage.removeItem('pp_userId')
          store.commit('user/SET_TOKEN', '')
          store.commit('user/SET_ROLES', [])
          store.commit('user/SET_USERID', '')
          store.commit('user/SET_AVATAR', '')
          store.commit('user/SET_NAME', '')
          Message.error('没有用户信息，数据异常')
          removeToken()
          resetRouter()
          next(`/login`)
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {





    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
