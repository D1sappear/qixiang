import request from '@/utils/request'

// 导入表
export function alarmList(data) {
    return request({
      url: '/weather/alarm/list',
      method: 'post',
      params: data
    })
  }