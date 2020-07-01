import request from '@/utils/request'

// 获取定点天气数据
export function weatherList(data) {
    return request({
        url: '/weather/location/list',
        method: 'post',
        params: data
    })
}