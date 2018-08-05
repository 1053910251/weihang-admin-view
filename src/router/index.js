import Vue from 'vue'
import Router from 'vue-router'
import { getToken } from '@/utils/auth'

Vue.use(Router)

const LayoutComponent = () => import('@/views/layout/layout')
const LoginComponent = () => import('@/views/login/index')
const articleListComponent = () => import('@/views/article/list')
const articleAddComponent = () => import('@/views/article/create')
const articleEditComponent = () => import('@/views/article/edit')
const videoListComponent = () => import('@/views/video/list')

// 首页
const dashboardRoute = {
  path: '/',
  redirect: 'article',
  name: 'dashboard',
  hidden: true
}

/**
 * 登录路由
 * @type {{path: string, component: function(), hidden: boolean}}
 */
const loginRoute = {
  path: '/login',
  name: 'login',
  component: LoginComponent,
  hidden: true
}

/**
 * 文章列表
 * @type {{path: string, component: function(), name: string}}
 */
const articleListRoute = {
  path: '/article/list',
  component: articleListComponent,
  name: 'articleList',
  meta: {
    title: '文章列表'
  }
}

/**
 * 添加文章
 * @type {{path: string, component: function(), name: string, meta: {title: string}}}
 */
const articleAddRoute = {
  path: '/article/add',
  component: articleAddComponent,
  name: 'articleAdd',
  meta: {
    title: '创建文章'
  }
}

/**
 * 编辑文章
 * @type {{path: string, component: function(), name: string, meta: {title: string}}}
 */
const articleEditRoute = {
  path: '/article/edit/:id(\\d+)',
  component: articleEditComponent,
  name: 'articleEdit',
  hidden: true,
  meta: {
    title: '修改文章'
  }
}

/**
 * 文章管理
 * @type {{path: string, component: function(), name: string, redirect: string, children: *[]}}
 */
const articleRoute = {
  path: '/article',
  component: LayoutComponent,
  name: 'article',
  redirect: '/article/list',
  meta: {
    title: '文章管理'
  },
  children: [
    articleAddRoute,
    articleListRoute,
    articleEditRoute
  ]
}

/**
 * 视频列表
 * @type {{path: string, component: function(), name: string}}
 */
const videoListRoute = {
  path: '/video/list',
  component: videoListComponent,
  name: 'videoList',
  meta: {
    title: '视频列表'
  }
}

/**
 * 视频管理
 * @type {{path: string, component: function(), name: string, redirect: string, children: *[]}}
 */
const videoRoute = {
  path: '/video',
  component: LayoutComponent,
  name: 'video',
  redirect: '/video/list',
  meta: {
    title: '视频管理'
  },
  children: [
    videoListRoute
  ]
}

export const routes = [
  dashboardRoute,
  loginRoute,
  articleRoute,
  videoRoute
]

const router = new Router({
  routes
})

// 全局路由拦截器，鉴权
router.beforeEach((to, from, next) => {
  if (to.name !== 'login') {
    // 在这里鉴权。没有权限跳转到login页面
    const token = getToken()
    console.log(token)
    if (!token) {
      next({
        name: 'login'
      })
    }
  }
  next()
})

export default router
