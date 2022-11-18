import request from '@/utils/request'

// 调用后端"根据主键查询用户"接口
export function getUserInfoById(data) {
  return request({
    url: '/user/findUserById',
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'   // 设置请求头格式为：x-www-form-urlencoded
    },
    params: data
  })
}

// 调用后端"新增请假申请表信息"接口
export function addTeacherLeaveFormMsg(data) {
  return request({
    url: '/leave/addLeaveForm',
    method: 'post',
    params: data
  })
}

// 调用后端"根据工号分页查询用户的全部请假记录"接口
export function findLeaveFormByUserid(data) {
  return request({
    url: '/leave/findLeaveFormByUserid',
    method: 'get',
    params: data
  })
}

// 调用后端"查询请假类型最大天数——系统默认"接口
export function getSystemMaxLimitTime() {
  return request({
    url: '/leave_audit_limit_time/findAllLimitTimeBySystem',
    method: 'get',
  })
}

// 调用后端"用户年度请假类型统计"接口
export function getSumLeaveTypeDays(data) {
  return request({
    url: '/history/sumHistoryLeaveType',
    method: 'get',
    params: data
  })
}

// 显示查询某个请假的详细信息
export function getLeaveDetail(data) {
  return request({
    url: 'leave/findLeaveFormById',
    method: 'get',
    params: data
  })
}

// 查询功能接口
export function listLeaveByTimePeriodAndAuditStatus(data) {
  return request({
    url: '/leave/findLeaveFromTimePeriodAndAuditStatus',
    method: 'get',
    params: data
  })
}

// 调用获取实际请假时长参考值接口
export function getCurrentLeaveDays(data) {
  return request({
    url: '/history/getCurrentLeaveDays',
    method: 'get',
    params: data
  })
}