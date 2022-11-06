import request from '@/utils/request'
import axios from "axios";

//查询部门下的请假列表
export function findLeaveFormByDept(data) {
  return request(
    {
    url: '/leave/findLeaveFormByDept',
    method: 'get',
    params: data
    }
  )
}

//查询全校范围内部门审核已完成，但人事处未审核的请假记录
export function findAllLeaveFormByUnfinishedHR() {
  return request(
    {
    url: '/leave/findAllLeaveFormByUnfinishedHR',
    method: 'get',
    }
  )
  
}

//查询部门下的请假列表
export function findLeaveFormByDeptAndUnfinishedSchool(data) {
  return request(
    {
    url: '/leave/findLeaveFormByDeptAndUnfinishedSchool',
    method: 'get',
    params: data
    }
  )
}

//根据工号查询用户的全部请假记录
export function findLeaveFormByUseridInDept(data) {
  return request(
    {
    url: '/leave/findLeaveFormByUseridInDept',
    method: 'get',
    params: data
    }
  )
}
//根据名字查询用户的全部请假记录
export function findLeaveFormByUsernameInDept(data) {
  return request(
    {
    url: '/leave/findLeaveFormByUsernameInDept',
    method: 'get',
    params: data
    }
  )
}

//查询需要人事处审核，且根据工号查询的请假列表
export function findLeaveFormByUseridInHR(data) {
  return request(
    {
    url: '/leave/findLeaveFormByUseridInHR',
    method: 'get',
    params: data
    }
  )
}
//查询需要人事处审核，且根据名字查询的请假列表
export function findLeaveFormByUsernameInHR(data) {
  return request(
    {
    url: '/leave/findLeaveFormByUsernameInHR',
    method: 'get',
    params: data
    }
  )
}

//查询需要校领导审核，且根据工号查询的请假列表
export function findLeaveFormByUseridInSchool(data) {
  return request(
    {
    url: '/leave/findLeaveFormByUseridInSchool',
    method: 'get',
    params: data
    }
  )
}
//查询需要校领导审核，且根据名字查询的请假列表
export function findLeaveFormByUsernameInSchool(data) {
  return request(
    {
    url: '/leave/findLeaveFormByUsernameInSchool',
    method: 'get',
    params: data
    }
  )
}


//查询部门下需要人事处审核，但尚未审核请假记录
export function findLeaveFormByDeptAndUnfinishedHR(data) {
  return request(
    {
    url: '/leave/findLeaveFormByDeptAndUnfinishedHR',
    method: 'get',
    params: data
    }
  )
}

//完成该部分审核
export function SingleleaveAudit(data) {
  return request(
    {
    url: '/audit/SingleleaveAudit',
    method: 'post',
    params: data
    }
  )
}

//查询校领导负责的部门
export function findSchoolDepartmentById(data) {
  return request(
    {
    url: '/school_department/findSchoolDepartmentById',
    method: 'get',
    params: data
    }
  )
}