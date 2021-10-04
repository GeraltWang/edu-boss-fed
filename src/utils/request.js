import axios from 'axios';
import store from '@/store';
import router from '@/router'
import qs from 'qs'
import { Notification } from 'element-ui';

const request = axios.create({
  timeout: 3000
  // baseURL,
  // headers,
});

function getBaseURL (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagou.com'
  } else {
    return 'http://edufront.lagou.com'
  }
}

// 请求拦截器
request.interceptors.request.use(function (config) {
  //    判断config.url的前缀，来进行baseUrl的拼接
  config.baseURL = getBaseURL(config.url)
  // 统一设置token信息
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
})

function redirectLogin () {
  // 跳转登录页
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

// 存储 token 更新状态
let isRefreshing = false
// 存储因等待 token 刷新而挂起的请求
let failedRequests = []

// 响应拦截器
request.interceptors.response.use(function (response) {
  // 状态码2XX时(成功)，对响应数据做点什么
  console.log('响应成功：', response);
  return response;
}, function (error) {
  // 状态码4XX时(失败)，对响应错误做点什么
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status } = error.response
    let errorMsg = ''
    if (status === 400) {
      errorMsg = '请求参数错误'
    } else if (status === 401) {
      // 1. 无 token 信息 = 未登录
      if (!store.state.user) {
        // 跳转登录页
        redirectLogin()
        return Promise.reject(error)
      }
      // 检测 是否有请求触发了 token 刷新
      if (isRefreshing) {
        // 将当前失败的请求，存储到请求列表中
        failedRequests.push(() => {
          // 当前函数调用后，会自动发送本次失败的请求
          request(error.config)
        })
        return
      }
      isRefreshing = true
      // 2. token 信息错误 / token 过期,发送请求获取新的 access_token
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        if (res.data.state !== 1) {
          // 清除无效的用户信息
          store.commit('setUser', null)
          // 跳转登录页
          redirectLogin()
          return Promise.reject(error)
        }
        // 刷新 token 并存储新的 token
        store.commit('setUser', res.data.content)
        // 重新发送之前失败的请求 - error.config 是本次失败请求的配置对象
        // 根据 failedRequests 发送所有失败请求
        failedRequests.forEach(request => {
          request()
        })
        // 发送完毕后清楚 failedRequests 中的内容
        failedRequests = []
        // 将本次请求发送
        return request(error.config)
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        // 请求发送完毕，响应处理完毕，将状态变更为false
        isRefreshing = false
      })
    } else if (status === 403) {
      errorMsg = '没有权限，请联系管理员'
    } else if (status === 404) {
      errorMsg = '您访问的资源不存在'
    } else if (status === 500) {
      errorMsg = '服务端错误，请联系管理员'
    }
    Notification.error({
      title: '错误',
      message: errorMsg,
      offset: 60
    })
  } else if (error.request) {
    // 请求发送成功，但是服务端未响应
    Notification.error({
      title: '错误',
      message: '请求超时，请稍后重试',
      offset: 60
    })
  } else {
    // 未知错误
    Notification.error({
      title: '未知错误',
      message: error.message,
      offset: 60
    })
  }
  // 将请求的错误对象向后抛出，让接收响应的处理函数进行操作
  return Promise.reject(error);
});

export default request;
