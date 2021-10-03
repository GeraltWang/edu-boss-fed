import axios from 'axios';
import store from '@/store';

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

export default request;
