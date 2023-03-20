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
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'   // 设置请求头格式为：x-www-form-urlencoded
    },
    data: data
  })
}

// 调用后端"撤销某一条请假记录"接口
export function quashLeaveById(data) {
  return request({
    url: '/leave/quashLeaveById',
    method: 'get',
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

//教学周识别
export function checkTeachingDate(data) {
  return request({
    url: '/calender/checkTeachingDate',
    method: 'get',
    params: data
  })
}

//销假申请
export function addRevokeRecord(data) {
  return request({
    url: '/revoke/addRevokeRecord',
    method: 'post',
    params: data
  })
}

export function getRevokeListByUserId(data) {
  return request({
    url: '/revoke/getRevokeListByUserId',
    method: 'get',
    params: data
  })
}

export function getReferenceLeaveDay(data) {
  return request({
    url: '/calender/getReferenceLeaveDay',
    method: 'get',
    params: data
  })
}

//查找请假申请对应的销假记录
export function findRevokeByLeaveId(data) {
  return request({
    url: '/revoke/findRevokeByLeaveId',
    method: 'get',
    params: data
  })
}

//获取销假申请详情信息
export function getRevokeDetailById(data) {
  return request({
    url: '/revoke/getRevokeDetailById',
    method: 'get',
    params: data
  })
}

//获取销假审核信息
export function getCurrentRevokeAuditMsg(data) {
  return request({
    url: '/revokeAudit/getCurrentRevokeAuditMsg',
    method: 'get',
    params: data
  })
}

//
export function undoRevoke(data) {
  return request({
    url: '/revoke/undoRevoke',
    method: 'get',
    params: data
  })
}
