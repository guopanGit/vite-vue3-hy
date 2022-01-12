import request from '@/utils/system/request'
import URL from '@/api/url'

// 开关灯源
export function switchApi(data){
  return request ({
    url:URL.lamp,
    method: 'POST',
    data
  })
}
// 获取列表
export function getList(data){
  return request ({
    url:URL.getList,
    method: 'POST',
    data
  })
}
// 获取状态
export function getStatus(data){
  return request ({
    url:URL.getStatus,
    method: 'POST',
    data
  })
}

// 获取图表数据
export function getData(data){
  return request ({
    url:URL.getStatus,
    method: 'GET',
    data
  })
}