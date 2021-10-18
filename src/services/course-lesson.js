import request from '@/utils/request.js';

// 保存或更新课时
export const saveOrUpdateLesson = data => {
  return request({
    method: 'POST',
    url: '/boss/course/lesson/saveOrUpdate',
    data
  })
}

// 用章节ID获取课时信息
export const getByLessonId = lessonId => {
  return request({
    method: 'GET',
    url: '/boss/course/lesson/getById',
    params: {
      lessonId
    }
  })
}
