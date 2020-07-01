import request from '@/utils/request'

// 获取雷达回波数据
export function radarList() {
    return request({
        url: '/weather/radar/list',
        method: 'get'
    })
}