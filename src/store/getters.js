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
 yuanxi: state => state.user.yuanxi
}
export default getters
