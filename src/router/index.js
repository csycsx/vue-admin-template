import Vue from 'vue'
import Router from 'vue-router'
// import store from '../store/index'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    meta:{
      roles:["all"]
    },
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    name: 'Error404',
    meta:{
      roles:["all"]
    },
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'HomePage',
    meta:{
      roles:['admin','user','leader']
    },
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-user' ,roles: ['admin','user','leader']}
    }]
  },

  {
    path: '/apply',
    component: Layout,
    redirect: '/apply/leaveapply',
    name: 'Apply',
    meta: { title: '表单申请', icon: 'el-icon-document',roles: ['admin','user','leader'] },
    children: [
      {
        path: 'leaveapply',
        name: 'LeaveApply',
        component: () => import('@/views/apply/LeaveApply'),
        meta: { title: '请假申请', icon: 'el-icon-top-right' ,roles: ['admin','user','leader']}
      },
      {
        path: 'backapply',
        name: 'BackApply',
        component: () => import('@/views/apply/BackApply'),
        meta: { title: '销假申请', icon: 'el-icon-bottom-left',roles: ['admin','user','leader'] }
      }
    ]
  },

  {
    path: '/audit',
    component: Layout,
    name:"Audit",
    meta: {title: '表单审核', icon: 'el-icon-document',roles: ['admin','leader']},
    children: [
      // {
      //   path: 'auditlist',
      //   name: 'AuditList',
      //   component: () => import('@/views/audit/AuditList'),
      //   meta: { title: '表单审核', icon: 'el-icon-s-check' ,roles: ['admin','leader']}
      // },
      {
        path: 'dpAuditlist',
        name: 'DpAuditList',
        component: () => import('@/views/audit/DpAuditList'),
        meta: { title: '部门表单审核', icon: 'el-icon-s-check' ,roles: ['admin','leader']}
      },
      {
        path: 'hrAuditlist',
        name: 'HrAuditList',
        component: () => import('@/views/audit/HrAuditList'),
        meta: { title: '人事处表单审核', icon: 'el-icon-s-check' ,roles: ['admin','leader']}
      },
      {
        path: 'scAuditlist',
        name: 'ScAuditList',
        component: () => import('@/views/audit/ScAuditList'),
        meta: { title: '校领导表单审核', icon: 'el-icon-s-check' ,roles: ['admin','leader']}
      },
      {
        path: 'detailLeave',
        name: 'DetailLeave',
        props:true ,
        component: () => import('@/views/audit/DetailLeave'),
        meta: { title: '表单审核详情', icon: 'el-icon-s-check' ,roles: ['admin','leader']}
      }
    ]
  },

  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/common',
    name: 'Admin',
    meta: { title: '系统管理', icon: 'el-icon-setting' ,roles: ['admin']},
    children: [
      {
        path: 'common',
        name: 'CommonManagement',
        component: () => import('@/views/admin/CommonManagement'),
        meta: { title: '常用管理', icon: 'el-icon-edit',roles: ['admin'] }
      },
      {
        path: 'authority',
        name: 'AuthorityManagement',
        component: () => import('@/views/admin/AuthorityManagement'),
        meta: { title: '权限管理', icon: 'el-icon-lock' ,roles: ['admin']}
      }
    ]
  },



  // 404 page must be placed at the end !!!
  { path: '*', name:"404", redirect: '/404', meta: {roles:["all"]}, hidden: true }
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
