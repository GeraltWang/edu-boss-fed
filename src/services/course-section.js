import request from '@/utils/request.js';

// 获取章节和课时
export const getSectionAndLesson = courseId => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getSectionAndLesson',
    params: {
      courseId
    }
  })
}

// 用章节ID获取章节信息
export const getBySectionId = sectionId => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getBySectionId',
    params: {
      sectionId
    }
  })
}

// 保存或更新章节
export const saveOrUpdateSection = data => {
  return request({
    method: 'POST',
    url: '/boss/course/section/saveOrUpdateSection',
    data
  })
}
