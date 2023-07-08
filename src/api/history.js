import request from '@/utils/request'
import axios from "axios";

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

// 部门管理：请假时长条状图
export function getDeptHistoryLeaveDays(data) {
  return request({
    url: '/history/getDeptHistoryLeaveDays',
    method: 'get',
    params: data
  })
}

// 部门管理：请假频率条状图
export function getDeptMemberFrequencyList(data) {
  return request({
    url: '/history/getDeptMemberFrequencyList',
    method: 'get',
    params: data
  })
}

// 部门管理：默认部门加载
export function getHistoryLoadingList(data) {
  return request({
    url: '/history/getHistoryLoadingList',
    method: 'get',
    params: data
  })
}

// 部门管理：日历时间筛选
export function getHistoryRecordByOneDate(data) {
  return request({
    url: '/history/getHistoryRecordByOneDate',
    method: 'get',
    params: data
  })
}

// 全校校领导分管部门
export function getAllSchoolDeptMsg(data) {
  return request({
    url: '/school_department/getAllSchoolDeptMsg',
    method: 'get',
    params: data
  })
}

// 查询某部门下当月的全部缺勤人员的考勤
export function getLeaveHistoryByDept(data) {
  return request({
    url: '/history/getLeaveHistoryByDept',
    method: 'get',
    params: data
  })
}

// 考勤待审核查询
export function findHistoryAudit(data) {
  return request({
    url: '/historyAudit/findHistoryAudit',
    method: 'get',
    params: data
  })
}

// 考勤审核 
export function singleHistoryAudit(data) {
  return request({
    url: '/historyAudit/singleHistoryAudit',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'   // 设置请求头格式为：x-www-form-urlencoded
    },
    data: data
  })
}
