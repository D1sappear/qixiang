import request from '@/utils/request'

// 导入表
export function all(data) {
  var requestParam = JSON.stringify(data);
  return request({
    url: '/weather/data/all',
    dataType: 'json',
    method: 'post',
    data: requestParam
  })
}
