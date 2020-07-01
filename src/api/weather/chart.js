import request from '@/utils/request'

// 导入表
export function chart(data) {
  var requestParam = JSON.stringify(data);
  return request({
    url: '/weather/data/chart',
    dataType: 'json',
    method: 'post',
    data: requestParam
  })
}
