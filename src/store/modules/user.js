import { login, logout, getInfo,getUserInfoById, getAdminInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    id:"", // 工号
    name: '', // 
    p_type: "", //人员类别
    gender: "", //性别
    // avatar: '',
    role : [""], // 权限
    role_num: "", // 身份标识码
    yuanxi: "", // 所属部门
    gw: "", //岗位
    xzzj: "", //行政职级
    zyjsdj: "", //专业技术等级
    glgwzw: "", //管理岗位职务
    zyjszw: ""  //专业技术职务
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
  SET_XZZJ: (state, xzzj) => {
    state.xzzj = xzzj
  },
  SET_ZYJSDJ: (state, zyjsdj) => {
    state.zyjsdj = zyjsdj
  },
  SET_GLGWZW: (state, glgwzw) => {
    state.glgwzw = glgwzw
  },
  SET_ZYJSZW: (state, zyjszw) => {
    state.zyjszw = zyjszw
  },
  SET_GW: (state, gw) => {
    state.gw = gw
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
    const all_role = ['user','department_officer','department_leader','hr_officer','hr_leader','leader_auditor','admin']
    var role = []
    
    getUserInfoById(data).then(res => {
      if(res.code!=200){
        return reject('获取失败.')
      }
      const userInfo = res.data
      // 判断该用户是否为 管理员 若是 则为其添加管理员权限
      if(userInfo.role=="admin"){
        role.push(all_role[6])
      }
      console.log(userInfo);

      // 初始化store
      commit('SET_NAME', userInfo.user.basic.userName)
      commit('SET_ID', userInfo.user.basic.userId)
      commit('SET_YUANXI', userInfo.user.basic.yuanXi)
      commit('SET_GENDER', userInfo.user.basic.gender)
      commit('SET_ROLE_NUM', userInfo.user.basic.role)
      commit('SET_XZZJ', userInfo.user.db3.xzzj)
      commit('SET_ZYJSDJ', userInfo.user.db3.zyjsdj)
      commit('SET_GLGWZW', userInfo.user.db3.glgwzw)
      commit('SET_ZYJSZW', userInfo.user.db3.zyjszw)
      commit('SET_GW', userInfo.user.db3.gw)
      // 根据role序号判断权限
      // if(userInfo.user.role==0){
      //   role.push(all_role[0])
      // }else if(userInfo.user.role == 1){
      //   role.push(all_role[1])
      // }else if(userInfo.user.role <= 4){
      //   role.push(all_role[2])
      // }else if(userInfo.user.role <= 5){
      //   role.push(all_role[3])
      // }
      switch(userInfo.user.basic.role){
        case "0":
          role.push(all_role[0]);
          break;
        case "1":
          role.push(all_role[1]);
          break;
        case "2":
          role.push(all_role[2]);
          break;
        case "3":
          role.push(all_role[3]);
          break;
        case "4":
          role.push(all_role[4]);
          break;
        case "5":
          role.push(all_role[5]);
          break;
      }
      console.log('role',role);
      commit('SET_ROLE', role)
      commit('SET_P_TYPE', userInfo.user.basic.ptype)
      commit('SET_TOKEN', userInfo.jwt_token)   
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
      removeToken()    
      resetRouter()
          commit('RESET_STATE')
          resolve()
      // logout(state.token).then(() => {
      //   removeToken() // must remove  token  first
      //   resetRouter()
      //   commit('RESET_STATE')
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
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

