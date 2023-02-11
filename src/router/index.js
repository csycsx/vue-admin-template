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
  { path: '/', redirect: '/login' ,meta:{roles:["all"]},},
  {
    name: 'Login',
    meta:{
      roles:["all"]
    },
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true  // hidden 属性，若需要在siderBar中隐藏则设置为True,默认为false
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
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    name: 'HomePage',
    meta:{
      roles:['admin','user','department_auditor','hr_auditor','leader_auditor']
    },
    children: [{
      path: 'index',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-user' ,roles: ['admin','user','department_auditor','hr_auditor','leader_auditor']}
    }]
  },

  {
    path: '/apply',
    component: Layout,
    redirect: '/apply/leaveapply',
    name: 'Apply',
    meta: { title: '表单申请', icon: 'el-icon-document',roles: ['admin','user','department_auditor','hr_auditor','leader_auditor'] },
    children: [
      {
        path: 'leaveapply',
        name: 'LeaveApply',
        component: () => import('@/views/apply/LeaveApply'),
        meta: { title: '请假申请', icon: 'el-icon-top-right' ,roles:['admin','user','department_auditor','hr_auditor','leader_auditor']}
      },
      {
        path: 'revokeapply',
        name: 'revokeApply',
        component: () => import('@/views/apply/RevokeApply'),
        meta: { title: '销假申请', icon: 'el-icon-bottom-left',roles: ['admin','user','department_auditor','hr_auditor','leader_auditor']},
        hidden: true
      }
    ]
  },

  {
    path: '/record',
    component: Layout,
    redirect: '/apply/leaverecord',
    name: 'Record',
    meta: { title: '个人记录', icon: 'el-icon-document',roles:['admin','user','department_auditor','hr_auditor','leader_auditor'] },
    children: [
      {
        path: 'leaverecord',
        name: 'LeaveRecord',
        component: () => import('@/views/apply/LeaveRecord'),
        meta: { title: '个人请假申请记录', icon: 'el-icon-top-right' ,roles: ['admin','user','department_auditor','hr_auditor','leader_auditor']}
      },
      {
        path: 'revokeRecord',
        name: 'RevokeRecord',
        component: () => import('@/views/apply/RevokeRecord'),
        meta: { title: '个人销假申请记录', icon: 'el-icon-bottom-left',roles:['admin','user','department_auditor','hr_auditor','leader_auditor'] }
      },
      {
        path: 'detailedLeave',
        name: 'DetailedLeave',
        component: () => import('@/views/apply/DetailedLeave'),
        meta: { title: '记录详情', icon: 'el-icon-bottom-left',roles: ['admin','user','leader'] },
        hidden: true
      },
      {
        path: 'detailedRevoke',
        name: 'DetailedRevoke',
        component: () => import('@/views/apply/DetailedRevoke'),
        meta: { title: '记录详情', icon: 'el-icon-bottom-left',roles: ['admin','user','department_auditor','hr_auditor','leader_auditor'] },
        hidden: true
        // hidden: false
      },
    ]
  },


  {
    path: '/audit',
    component: Layout,
    name:"Audit",
    meta: {title: '表单审核', icon: 'el-icon-document',roles: ['department_auditor','hr_auditor','leader_auditor']},
    children: [
      // {
      //   path: 'auditlist',
      //   name: 'AuditList',
      //   component: () => import('@/views/audit/AuditList'),
      //   meta: { title: '表单审核', icon: 'el-icon-s-check' ,roles: ['admin','leader']}
      // },
      {
        path: 'dpAuditList',
        name: 'DpAuditList',
        component: () => import('@/views/audit/DpAuditList'),
        meta: { title: '部门请假审核', icon: 'el-icon-s-check' ,roles: ['department_auditor']}
      },
      {
        path: 'hrAuditList',
        name: 'HrAuditList',
        component: () => import('@/views/audit/HrAuditList'),
        meta: { title: '人事处请假审核', icon: 'el-icon-s-check' ,roles: ['hr_auditor']}
      },
      {
        path: 'scAuditList',
        name: 'ScAuditList',
        component: () => import('@/views/audit/ScAuditList'),
        meta: { title: '校领导请假审核', icon: 'el-icon-s-check' ,roles: ['leader_auditor']}
      },
      {
        path: 'detailLeave',
        name: 'DetailLeave',
        props:true ,
        component: () => import('@/views/audit/DetailLeave'),
        meta: { title: '表单审核详情', icon: 'el-icon-s-check' ,roles:['department_auditor','hr_auditor','leader_auditor']},
        hidden: true
      },
      {
        path: 'detailRevoke',
        name: 'DetailRevoke',
        component: () => import('@/views/audit/DetailRevoke'),
        meta: { title: '销假审核详情', icon: 'el-icon-s-check' ,roles:['department_auditor','hr_auditor','leader_auditor']},
        hidden: true
      },
      {
        path: 'dpRevokeList',
        name: 'DpRevokeList',
        component: () => import('@/views/audit/DpRevokeList'),
        meta: { title: '部门销假审核', icon: 'el-icon-s-check' ,roles: ['department_auditor']}
      },
      {
        path: 'hrRevokelist',
        name: 'HrRevokeList',
        component: () => import('@/views/audit/HrRevokeList'),
        meta: { title: '人事处销假审核', icon: 'el-icon-s-check' ,roles: ['hr_auditor']}
      },

    ]
  },
  //考勤
  {
    path: '/attendance',
    component: Layout,
    name:"Attendance",
    meta: {title: '考勤统计', icon: 'el-icon-document',roles: ['department_auditor','hr_auditor','leader_auditor']},
    children:[
      {
        path: 'attendManage',
        name: 'AttendManage',
        component: () => import('@/views/audit/attendance/attendManage'),
        meta: { title: '编辑考勤', icon: 'el-icon-s-check' ,roles: ['admin','leader','department_auditor','leader_auditor']}
      },
    ]

  },

  // 历史记录查询
  {
    path: '/history',
    component: Layout,
    name:"History",
    meta: {title: '历史统计', icon: 'el-icon-document',roles: ['department_auditor','hr_auditor','leader_auditor']},
    children: [
      {
        path: 'deptLeaveHistory',
        name: 'DeptLeaveHistory',
        component: () => import('@/views/audit/history/deptLeaveHistory'),
        meta: { title: '部门请假记录统计', icon: 'el-icon-s-check' ,roles: ['admin','leader','department_auditor','leader_auditor']}
      },
      {
        path: 'deptRevokeHistory',
        name: 'DeptRevokeHistory',
        component: () => import('@/views/audit/history/deptRevokeHistory'),
        meta: { title: '部门销假记录统计', icon: 'el-icon-s-check' ,roles: ['admin','leader','department_auditor','leader_auditor']}
      },
      {
        path: 'hrLeaveHistory',
        name: 'HrLeaveHistory',
        component: () => import('@/views/audit/history/hrLeaveHistory'),
        meta: { title: '各部门请假历史统计', icon: 'el-icon-s-check' ,roles: ['admin','leader','hr_auditor']}
      },
      {
        path: 'hrRevokeHistory',
        name: 'hrRevokeHistory',
        component: () => import('@/views/audit/history/hrRevokeHistory'),
        meta: { title: '各部门销假历史统计', icon: 'el-icon-s-check' ,roles: ['admin','leader','hr_auditor']}
      },
      {
        path: 'detailHistory',
        name: 'DetailHistory',
        component: () => import('@/views/audit/history/DetailHistory'),
        meta: { title: '部门请假历史详情', icon: 'el-icon-s-check' ,roles:['department_auditor','hr_auditor','leader_auditor']},
        hidden: true
      }
    ]
  },

 // 管理员模块开始：
 {
  path: '/admin',
  component: Layout,
  redirect: '/admin/common',
  name: 'Admin',
  meta: { title: '系统管理', icon: 'el-icon-setting' ,roles: ['admin']},
  children: [
    {
      path: 'authority',
      name: 'AuthorityManagement',
      component: () => import('@/views/admin/AuthorityManagement'),
      meta: { title: '权限管理', icon:'el-icon-menu' ,roles: ['admin']}
    },
    {
      path: 'calender',
      name: 'CalenderManagement',
      component: () => import('@/views/admin/CalenderManagement'),
      meta: { title: '校历管理', icon:'el-icon-menu' ,roles: ['admin']}
    },
    {
      path: 'common',
      name: 'CommonManagement',
      component: () => import('@/views/admin/CommonManagement'),
      meta: { title: '时限管理', icon: 'el-icon-menu',roles: ['admin'] }

    },

    {
      path: 'hraudit',
      name: 'HrAuditManagement',
      component: () => import('@/views/admin/HrAuditManagement'),
      meta: { title: '人事处管理', icon: 'el-icon-menu' ,roles: ['admin']}
    },
    {
      path: 'schoolaudit',
      name: 'SchoolAuditManagement',
      component: () => import('@/views/admin/SchoolAuditManagement'),
      meta: { title: '校领导管理', icon:'el-icon-menu' ,roles: ['admin']}
    },
    {
      path: 'adjustleave',
      name: 'AdjustLeaveManagement',
      component: () => import('@/views/admin/AdjustLeaveManagement'),
    //  meta: { title: '调休管理', icon: 'el-icon-lock' ,roles: ['admin']}
    },
  ]
},
//管理员模块结束


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
