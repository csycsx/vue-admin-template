import request from '@/utils/request'
export function getcalenderList(data) {
    return request({
      url: '/calender/findAllCalender',
      method: 'get',
      params: { data}
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
  export function findAllUser() {
    return request({
      url: '/user/findAllUser',
      method: 'get',
      params: {}
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