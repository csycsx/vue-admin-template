import request from '@/utils/request'
export function getcalenderList() {
    return request({
      url: '/calender/findAllCalender',
      method: 'get',
   
    })
  }
  export function deletecalenderFrom(id) {
      return request({
        url: '/calender/deleteCalender',
        method: 'get',
        params: id
      })
    }
    export function updatecalenderForm(data) {
          return request({
            url: '/calender/updateCalender',
            method: 'get',
            params: data
          })
        }
      //根据ID搜索用户
  export function findUserByUserid(data) {
    return request({
      url: '/user/findUserByUserid',
      method: 'get',
      params: data
    })
  }
// 查询所有用户信息
export function findAllUserPagination(data) {
      return request({
        url: '/user/findAllUserPagination',
        method: 'get',
        params: data
      })
    }
  // 查询有权限的用户
  export function findUserPageByRoleList(data) {
        return request({
          url: '/user/findUserPageByRoleList',
          method: 'get',
          params: data
        })
      }
export function addUserTo(data) {
      return request({
        url: '/user/addUser',
        method: 'post',
        params: data
      })
    }
  
  export function deleteUserFrom(id) {
    return request({
      url: '/user/deleteUser',
      method: 'get',
      params: id
    })
  }

  export function addVocationTo(data) {
    return request({
      url: '/calender/addCalender',
      method: 'get',
      params: data
    })
  }
  export function UpdateLimitTimeById(data) {
        return request({
          url: '/leave_audit_limit_time/UpdateLimitTimeById',
          method: 'get',
          params: data
        })
      }
    export function updateUsersForm(data) {
                  return request({
                    url: '/user/updateUser',
                    method: 'get',
                    params: data
                  })
                }

      export function findAllLimitTimeByRoleId(id) {
                    return request({
                      url: '/leave_audit_limit_time/findAllLimitTimeByRoleId',
                      method: 'get',
                      params: id
                    })
                  }
    //调休信息查询
    export function findAdjustById(id){
                  return request({
                    url: '/calender/findAdjustById',
                    method: 'get',
                    params: id
                        
                  })
                }

    //调休修改
    export function updateCalenderAdjust(data) {
          return request({
            url: '/calender/updateCalenderAdjust',
            method: 'get',
            params: data
          })
        }
    //新增数据
    export function addCalenderAdjust(data) {
          return request({
            url: '/calender/addCalenderAdjust',
            method: 'get',
            params: data
          })
        }