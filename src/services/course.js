import request from '@/utils/request.js';

// 分页查询课程信息
export const getQueryCourses = (data) => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}

// 通过课程Id获取课程信息
export const getCourseById = courseId => {
  return request({
    method: 'GET',
    url: '/boss/course/getCourseById',
    params: {
      courseId
    }
  })
}

// 课程上下架
export const changeState = (courseId, status) => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params: {
      courseId,
      status
    }
  })
}

// 保存或者更新课程信息
export const saveOrUpdateCourse = data => {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}

// 上传图片接口
export const uploadCourseImage = (data, onUploadProgress) => {
  // data 为 FormData 对象
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    // onUploadProgress 监测上传进度
    onUploadProgress
  })
}
