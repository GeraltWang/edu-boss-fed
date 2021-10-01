import axios from 'axios';

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
  return config
})

export default request;
