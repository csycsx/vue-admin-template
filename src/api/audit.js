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
export function findLeaveFormByUserid(data) {
  return request(
    {
    url: '/leave/findLeaveFormByUserid',
    method: 'get',
    params: data
    }
  )
}
//根据名字查询用户的全部请假记录
export function findLeaveFormByUsername(data) {
  return request(
    {
    url: '/leave/findLeaveFormByUsername',
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
    url: '/leave/SingleleaveAudit',
    method: 'get',
    params: data
    }
  )
}