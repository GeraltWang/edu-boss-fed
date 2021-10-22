import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'

Vue.use(VueRouter)

// 路由规则
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */'@/views/login/index')
  },
  {
    path: '*',
    name: 'error-page',
    component: () => import(/* webpackChunkName: 'error-page' */'@/views/error-page/index')
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: 'layout' */'@/views/layout/index'),
    // 直接给某个路由设置，这时内部的子路由都需要认证（包含当前路由）
    meta: { requiresAuth: true, breadcrumb: '主页' },
    children: [
      {
        path: '',
        name: 'home',
        redirect: '/course',
        component: () => import(/* webpackChunkName: 'home' */'@/views/home/index')
      },
      {
        path: '/role',
        name: 'role',
        meta: {
          breadcrumb: '角色管理'
        },
        component: () => import(/* webpackChunkName: 'role' */'@/views/role/index')
      },
      {
        path: '/menu',
        name: 'menu',
        meta: {
          breadcrumb: '菜单列表'
        },
        component: () => import(/* webpackChunkName: 'menu' */'@/views/menu/index')
      },
      {
        path: '/resource',
        name: 'resource',
        meta: {
          breadcrumb: '资源列表'
        },
        component: () => import(/* webpackChunkName: 'resource' */'@/views/resource/index')
      },
      {
        path: '/course',
        name: 'course',
        meta: {
          breadcrumb: '课程管理'
        },
        component: () => import(/* webpackChunkName: 'course' */'@/views/course/index')
      },
      {
        path: '/user',
        name: 'user',
        meta: {
          breadcrumb: '用户管理'
        },
        component: () => import(/* webpackChunkName: 'user' */'@/views/user/index')
      },
      {
        path: '/advert',
        name: 'advert',
        meta: {
          breadcrumb: '广告列表'
        },
        component: () => import(/* webpackChunkName: 'advert' */'@/views/advert/index')
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        meta: {
          breadcrumb: '广告位列表'
        },
        component: () => import(/* webpackChunkName: 'advert-space' */'@/views/advert-space/index')
      },
      // 添加菜单路由组件
      {
        path: '/menu/create',
        name: 'menu-create',
        meta: {
          breadcrumb: '添加菜单'
        },
        component: () => import(/* webpackChunkName: 'menu-create' */'@/views/menu/create')
      },
      // 编辑菜单路由组件
      {
        path: '/menu/:id/edit',
        name: 'menu-edit',
        meta: {
          breadcrumb: '编辑菜单'
        },
        component: () => import(/* webpackChunkName: 'menu-edit' */'@/views/menu/edit')
      },
      // 分配菜单路由组件
      {
        path: '/role/:roleId/:name/alloc-menu',
        name: 'alloc-menu',
        meta: {
          breadcrumb: '分配菜单'
        },
        component: () => import(/* webpackChunkName: 'alloc-menu' */'@/views/role/alloc-menu'),
        props: true
      },
      // 分配资源路由组件
      {
        path: '/role/:roleId/:name/alloc-resource',
        name: 'alloc-resource',
        meta: {
          breadcrumb: '分配资源'
        },
        component: () => import(/* webpackChunkName: 'alloc-resource' */'@/views/role/alloc-resource'),
        props: true
      },
      // 添加课程组件
      {
        path: '/course/create',
        name: 'course-create',
        meta: {
          breadcrumb: '添加课程'
        },
        component: () => import(/* webpackChunkName: 'course-create' */'@/views/course/create')
      },
      // 编辑课程组件
      {
        path: '/course/:courseId/edit',
        name: 'course-edit',
        meta: {
          breadcrumb: '编辑课程'
        },
        component: () => import(/* webpackChunkName: 'course-edit' */'@/views/course/edit'),
        props: true
      },
      // 课程内容组件
      {
        path: '/course/:courseId/:courseName/section',
        name: 'course-section',
        meta: {
          breadcrumb: '内容管理'
        },
        component: () => import(/* webpackChunkName: 'course-section' */'@/views/course/section'),
        props: true
      },
      // 上传课时视频
      {
        path: '/course/:courseId/:lessonId/video',
        name: 'course-video',
        meta: {
          breadcrumb: '视频上传'
        },
        component: () => import(/* webpackChunkName: 'course-video' */'@/views/course/video'),
        props: true
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 验证 to 路由是否需要鉴权
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 验证Vuex 的store中登录用户信息是否存在
    if (!store.state.user) {
      // 未登录，跳转到登录页
      next({
        name: 'login',
        query: {
          // 将路由的fullpath传递给login页面
          redirect: to.fullPath
        }
      })
    } else {
      console.log('登录成功');
      next()
    }
    console.log('当前页面需要认证');
  } else {
    console.log('无需认证');
    next()
  }
})

// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push (location) {
//   return originalPush.call(this, location).catch(err => err)
// }

export default router
