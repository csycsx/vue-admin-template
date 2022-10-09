import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'


NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist


/**
 * 2022.10.3 spark
 * 
 * 判断将要跳转的页面，当前用户是否有权限
 * 
 * @param role 当前用户角色
 * @param to 将要跳转的页面
 * 
 * @return true允许 false不允许
 */
export const pagePermission = (role,to)=>{
    // 跳过白名单  
    if(to.meta.roles[0]=="all"){
      return true
    }
    const permissioned = to.meta.roles.indexOf(role) // 判断要跳转的页面的roles 数组中是否存在，当前用户角色名 -1为不存在
    if(permissioned!=(-1)){
      return true
    }else{
      return false
    }
}



// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()
//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       /**
//        * 2022.10.3 spark
//        * 增加了跳转前的权限确认
//        */
//       const role = store.getters.role // 当前等于用户角色
//       const isAllowed = pagePermission(role,to) // 是否允许跳转
//       if(isAllowed){
//         const hasGetUserInfo = store.getters.name
//         if (hasGetUserInfo) {
//           next()
//         } else {
//           try {
//             // get user info
//             await store.dispatch('user/getInfo')
//             next()
//           } catch (error) {
//             // remove token and go to login page to re-login
//             await store.dispatch('user/resetToken')
//             Message.error(error || 'Has Error')
//             next(`/login?redirect=${to.path}`)
//             NProgress.done()
//           }
//         }
//       }else{
//         // 无权限 则不跳转，弹出提示信息
//         Message.warning("无权限，如有问题请联系管理员！")
//       }
//     }
//   } else {
//     /* has no token*/
//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
