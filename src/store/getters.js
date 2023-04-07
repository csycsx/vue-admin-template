const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  // avatar: state => state.user.avatar,
  id: state => state.user.id,
  name: state => state.user.name,
  gender: state => state.user.gender,
 /*
 2022.10.3 spark
 */
 role: state => state.user.role,
 role_num: state => state.user.role_num,
 yuanxi: state => state.user.yuanxi,
 p_type: state => state.user.p_type,

 xzzj: state => state.user.xzzj,
 zyjsdj: state => state.user.zyjsdj,
 glgwzw: state => state.user.glgwzw,
 zyjszw: state => state.user.zyjszw,
 gw: state => state.user.gw
}
export default getters
