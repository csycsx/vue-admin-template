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
            data
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