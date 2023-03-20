import request from '@/utils/request'
export function getcalenderList(data) {
    return request({
      url: '/calender/findAllCalender',
      method: 'get',
      params: data
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


// 获取部门日历组件缺勤记录
export function getMonthDeptAbsenceDate(data) {
  return request({
    url: '/history/getMonthDeptAbsenceDate',
    method: 'get',
    params: data
  })
}

// 部门管理：请假类型饼状图
export function getDeptHistoryLeaveTypeCount(data) {
  return request({
    url: '/history/getDeptHistoryLeaveTypeCount',
    method: 'get',
    params: data
  })
}

// // 部门管理：请假时长条状图
// export function getDeptHistoryLeaveDays(data) {
//   return request({
//     url: '/history/getDeptHistoryLeaveDays',
//     method: 'get',
//     params: data
//   })
// }

// // 部门管理：请假频率条状图
// export function getDeptMemberFrequencyList(data) {
//   return request({
//     url: '/history/getDeptMemberFrequencyList',
//     method: 'get',
//     params: data
//   })
// }

// // 部门管理：默认部门加载
// export function getHistoryLoadingList(data) {
//   return request({
//     url: '/history/getHistoryLoadingList',
//     method: 'get',
//     params: data
//   })
// }

// 部门管理：日历时间筛选
export function getHistoryRecordByOneDate(data) {
  return request({
    url: '/history/getHistoryRecordByOneDate',
    method: 'get',
    params: data
  })
}

// // 全校校领导分管部门
// export function getAllSchoolDeptMsg(data) {
//   return request({
//     url: '/school_department/getAllSchoolDeptMsg',
//     method: 'get',
//     params: data
//   })
// }
