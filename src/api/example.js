import request from '@/utils/request'


/**
 * 2022.10.4 spark
 * 
 * 请求后端的样例方法，
 * 后端方法名 请求方式需要添加
 * 参数按需要添加，一般都是要添加的 因为要验证
 * 这个方法在views/dashboard/index.vue 中调用了
 * 
 * @returns 
 */
export function example() {
    return request({
      url: 'user/findAllUser',
      method: 'get',
    //   params: {data}
    })
  }