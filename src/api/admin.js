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

      export function findAllLimitTimeByRoleId(id) {
                    return request({
                      url: '/leave_audit_limit_time/findAllLimitTimeByRoleId',
                      method: 'get',
                      params: id
                    })
                  }
    //调休信息查询
    export function findAdjustById(adjust_name,id){
                  return request({
                    url: '/calender/findAdjustById',
                    method: 'get',
                    params: {
                        adjust_name:adjust_name,
                        id:id
                       }
                  })
                }

