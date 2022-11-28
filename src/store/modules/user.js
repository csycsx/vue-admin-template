import { login, logout, getInfo,getUserInfoById, getAdminInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    id:"19721580", // 工号
    name: 'IT民工', // 
    p_type: "教师", //人员类别
    gender: "男", //性别
    // avatar: '',
    role : [""], // 权限
    role_num: "", // 身份标识码
    yuanxi: "ces" // 所属部门
  }
}
const state = getDefaultState()

const mutations = {
  // 同步方法 用this.$store.commit('mutations方法名',值)调用
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID : (state, id) =>{
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_GENDER: (state, gender) => {
    state.gender = gender
  },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },
  SET_ROLE : (state, role) =>{
    state.role = role
  },
  SET_YUANXI: (state, yuanxi) => {
    state.yuanxi = yuanxi
  }, 
  SET_ROLE_NUM: (state, role_num) => {
    state.role_num = role_num
  },
  SET_P_TYPE: (state, p_type) => {
    state.p_type = p_type
  },
}


const actions = {
  // 异步方法 用this.$store.dispatch('actions方法名',值)调用

/**
 * 根据序号初始化用户数据，并保存在store中，模拟一网通办流程
 * 调用在view/login/index.vue 中
 * 
 * 2022.11.8 by spark chen 
 * 
 * @param {*} param0 
 * @param {*} data  一网通办中获取到得用户数据
 * @returns 
 */  
init_user_info({ commit }, data){
  return new Promise((resolve, reject) => {
    const all_role = ['user','department_auditor','hr_auditor','leader_auditor','admin']
    var role = []
    getAdminInfo(data).then(res=>{
      if(res.data){
        role.push(all_role[4])
      }
    })
    
    getUserInfoById(data).then(res => {
      if(res.code!=200){
        return reject('获取失败.')
      }
      const userInfo = res.data
      console.log(userInfo)
      commit('SET_NAME', userInfo.userName)
      commit('SET_ID', userInfo.userId)
      commit('SET_YUANXI', userInfo.yuanXi)
      commit('SET_GENDER', userInfo.gender)
      commit('SET_ROLE_NUM', userInfo.role)
      // 根据role序号判断权限
      if(userInfo.role==0){
        role.push(all_role[0])
      }else if(userInfo.role <= 2){
        role.push(all_role[1])
      }else if(userInfo.role <= 4){
        role.push(all_role[2])
      }else if(userInfo.role <= 5){
        role.push(all_role[3])
      }
      commit('SET_ROLE', role)
      commit('SET_P_TYPE', userInfo.ptype)
      resolve()
    })
  })

},

  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        
        commit('SET_ROLE',data.role) 
        commit('SET_TOKEN', data.token)    
        setToken(data.token)   
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        // const { name, avatar } = data
        const { name } = data
        commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

