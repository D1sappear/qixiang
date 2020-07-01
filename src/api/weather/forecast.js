import request from '@/utils/request'

// 导入表
export function forecastList(data) {
    return request({
      url: '/weather/forecast/list/'+data,
      method: 'get'

    })
  }