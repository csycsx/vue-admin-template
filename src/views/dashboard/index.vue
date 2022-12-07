<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { example} from '@/api/example'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created(){
    /*
      data 对象是存储在前端的数据，一般请求的时候需要这个信息做验证查验，
      example调用的接口是get，所以没有传回后端
    */
    var data = {
      id : this.$store.getters.id , // 获取 store中的 id
      name : this.$store.getters.name , // 获取 store中的 name
      gender : this.$store.getters.gender , // 获取 store中的 gender
      role : this.$store.getters.role , // 获取 store中的 role
      yuanxi : this.$store.getters.yuanxi , // 获取 store中的 yuanxi 院系
    }
    console.log("这里存储的是用户信息")
    console.log(data)
    // this.$store.commit('user/SET_NAME',"修改名字")
    console.log(this.$store.getters.name)
    // 调用 src/api/example.js 中写好的接口
    // example().then(response => {
    //   console.log("后端传回的数据")
    //   console.log(response)
    // })
  
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
