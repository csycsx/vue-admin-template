<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg"
        :text-color="variables.menuText" :unique-opened="false" :active-text-color="variables.menuActiveText"
        :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="route in dynamicsMenu" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import store from "@/store"

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes () {
      return this.$router.options.routes
    },
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo () {
      return this.$store.state.settings.sidebarLogo
    },
    variables () {
      return variables
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  },
  data () {
    return {
      dynamicsMenu: [] // 动态侧边栏
    }
  },
  methods: {
    /**
   * 2022.10.3 spark
   * 
   * 初始化页面时，根据用户权限动态设置侧边导航栏的显示
   */
    createMenu () {
      var role = store.getters.role // 当前等于用户角色
      var commonRoleIndex = 0
      var isAdmin = false
      if (role.length == 2) {
        // 当前用户为管理员
        isAdmin = true
        commonRoleIndex = (role.indexOf('admin') + 1) % 2 // 获取第二种身份得序号
      }
      role = role[commonRoleIndex] // 非管理员的角色
      console.log('isAdmin', commonRoleIndex)
      console.log('isAdmin', role)

      // this.$router.options.routes 静态全部页面列表
      this.$router.options.routes.forEach(element => {

        if (element.meta.roles[0] == "all") {
          // 跳过白名单  
          this.dynamicsMenu.push(element)
        } else {
          if (element.name == 'Admin') {
            //管理员menu控制
            if (isAdmin) {
              this.dynamicsMenu.push(element)
            }
          } else {
            // 非管理员menu控制
            const permissioned = element.meta.roles.indexOf(role)
            const permissioned_admin = element.meta.roles.indexOf('admin')
            if (permissioned != (-1) || permissioned_admin != -1) {
              // -1 ：当前页面不在用户权限范围之内，需要跳过
              var childernArray = []
              // 判断子元素是否有权限查看，当子元素个数为1时则隐藏折叠
              element.children.forEach(childElement => {
                console.log('====', childElement, role)
                if (childElement.meta.roles.indexOf(role) != -1 || childElement.meta.roles.indexOf('admin') != -1) {
                  if (childElement.name === 'DpAuditList') {
                    if (role === 'department_officer') childElement.meta.title = '部门请假初审';
                    else if (role === 'department_leader') childElement.meta.title = '部门请假审核';
                  }
                  else if (childElement.name === 'HrAuditList') {
                    if (role === 'hr_officer') childElement.meta.title = '人事处请假初审';
                    else if (role === 'hr_leader') childElement.meta.title = '人事处请假审核';
                  }
                  else if (childElement.name === 'DpRevokeList') {
                    if (role === 'department_officer') childElement.meta.title = '部门销假初审';
                    else if (role === 'department_leader') childElement.meta.title = '部门销假审核';
                  }
                  else if (childElement.name === 'HrRevokeList') {
                    if (role === 'hr_officer') childElement.meta.title = '人事处销假初审';
                    else if (role === 'hr_leader') childElement.meta.title = '人事处销假审核';
                  }
                  childernArray.push(childElement)
                }
              })
              element.children = childernArray
              this.dynamicsMenu.push(element)
            }
          }
        }

      });
      console.log('isAdmin', this.dynamicsMenu)

    }
  },
  created () {
    // 页面初始化
    this.createMenu()
  }

}
</script>
