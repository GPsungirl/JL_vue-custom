import {
  asyncRoutes,
  constantRoutes
} from '@/router'


/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}
//处理 动态路由数据
function setServeMap(routerMap) {

  //深克隆
  let cloneData = JSON.parse(JSON.stringify(routerMap))

  // 父级id ===  子级 pid
  return cloneData.filter(father => {

    let branchArr = cloneData.filter(child => father['id'] == child['pid']);
    branchArr.length > 0 ? father['children'] = branchArr : ''

    return father['pid'] == 0 // 目前一级 pid：0
  })

}
// 修正数据
function modifyKeys(data) {

  for (let i = 0; i < data.length; i++) {
    //父级
    let item = data[i];
    if (item.children) {
      // 父级 path

      // alwaysShow: true
      let _index = item.path.indexOf('/');
      if( _index > -1){
        var _icon_name = item.path.slice(_index+1);
      }
      item['component']  = 'Layout';  // 一级菜单强行加 Layout
      item['alwaysShow'] = true;
      // meta
      item['meta'] = {
        title: item.menu_name,
        icon: _icon_name
      }
      if (item.hasOwnProperty('children')) {
        //注意 children是数组
        for (let i = 0; i < item.children.length; i++) {

          // meta
          item['children'][i]['meta'] = {
            title: item.children[i].menu_name
          }
          // component  name
          item.children[i]['name']  = item.children[i].path;
          item.children[i]['component'] = item.children[i].path;
        }
      }
    }
  }

  return data;
}
/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  //console.log(res)
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}
const fya_routerMap = {
  Layout: () => import('@/layout/index'),

  // 收益查询       finance
  virtualProfit: () => import('@/views/virtualProfit/virtualProfit'), //贝壳收益
  accountProfit: () => import('@/views/accountProfit/accountProfit'), // 出行收益
  // 下属管理       sub
  subTravelerInfo: () => import('@/views/subTravelerInfo/subTravelerInfo'),// 下属向导查询

  subVirtualProfit: () => import('@/views/subVirtualProfit/subVirtualProfit'),// 下属贝壳收益
  subAccountProfit: () => import('@/views/subAccountProfit/subAccountProfit'),// 下属出行收益

}

function generateAsyncRouter(routerMap, serverRouterMap) {
  serverRouterMap.forEach(function (item, index) {
    item.component = routerMap[item.component]
    if (item.children && item.children.length > 0) {
      generateAsyncRouter(routerMap, item.children)
    }
  })
  return serverRouterMap;
}
const actions = {

  generateRoutes({
    commit
  }, list) {
    return new Promise(resolve => {

      // const fya_list = setServeMap(list)
      // const gp_list = modifyKeys(fya_list)
      // 固定路由表
      let gp_list = [
        {
          alwaysShow: true,
          component: 'Layout',
          menu_name:'收益查询',
          meta:{
            icon:'finance',
            title:'收益查询'
          },
          path:'/finance',
          children:[
            {
              component:'virtualProfit',
              menu_name:'贝壳收益',
              meta:{
                title:'贝壳收益'
              },
              name:'virtualProfit',
              path:'virtualProfit'
            },
            {
              component:'accountProfit',
              menu_name:'出行收益',
              meta:{
                title:'出行收益'
              },
              name:'accountProfit',
              path:'accountProfit'
            }
          ],
        },
        {
          alwaysShow: true,
          component: 'Layout',
          menu_name:'下属管理',
          meta:{
            icon:'region',
            title:'下属管理'
          },
          path:'/region',
          children:[
            {
              component:'subTravelerInfo',
              menu_name:'下属向导查询',
              meta:{
                title:'下属向导查询'
              },
              name:'subTravelerInfo',
              path:'subTravelerInfo'
            },
            {
              component:'subVirtualProfit',
              menu_name:'下属贝壳收益',
              meta:{
                title:'下属贝壳收益'
              },
              name:'subVirtualProfit',
              path:'subVirtualProfit'
            },
            {
              component:'subAccountProfit',
              menu_name:'下属出行收益',
              meta:{
                title:'下属出行收益'
              },
              name:'subAccountProfit',
              path:'subAccountProfit'
            }
          ],
        }
      ]
      console.log(gp_list)
      // 用本地 写死的路由表
      const asyncRouterMap = generateAsyncRouter(fya_routerMap, gp_list)
      asyncRouterMap.push({
        path: '*',
        redirect: '/404',
        hidden: true
      })
      commit('SET_ROUTES', asyncRouterMap)
      resolve(asyncRouterMap)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
