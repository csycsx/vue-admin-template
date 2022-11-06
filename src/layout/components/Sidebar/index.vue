<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
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
    routes() {
       return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  data(){
    return {
      dynamicsMenu:[] // 动态侧边栏
    }
  },
  methods:{
    /**
   * 2022.10.3 spark
   * 
   * 初始化页面时，根据用户权限动态设置侧边导航栏的显示
   */
    createMenu(){
      const role = store.getters.role // 当前等于用户角色
      // this.$router.options.routes 静态全部页面列表
      this.$router.options.routes.forEach(element => {
        
        if(element.meta.roles[0]=="all"){
          // 跳过白名单  
          this.dynamicsMenu.push(element)
        }else{
          const permissioned = element.meta.roles.indexOf(role)
          if(permissioned!=(-1)){
            // -1 ：当前页面不在用户权限范围之内，需要跳过
            this.dynamicsMenu.push(element)
          }
        }
      });
    }
  },
  created(){
    // 页面初始化
    this.createMenu()
  }
  
}
</script>
