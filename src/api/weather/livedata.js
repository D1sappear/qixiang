import request from '@/utils/request'

// 导入表
export function liveData(data) {
    var requestParam = JSON.stringify(data);
    return request({
      url: '/weather/data/list',
      dataType: 'json',
      method: 'post',
      data: requestParam
    })
  }
