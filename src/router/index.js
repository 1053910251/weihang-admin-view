import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const LayoutComponent = () => import('@/views/layout/layout')
const LoginComponent = () => import('@/views/login/index')
const articleListComponent = () => import('@/views/article/list')
const articleAddComponent = () => import('@/views/article/create')
const videoListComponent = () => import('@/views/video/list')

/**
 * 登录路由
 * @type {{path: string, component: function(), hidden: boolean}}
 */
const loginRoute = {
  path: '/login',
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
    articleListRoute
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
  loginRoute,
  articleRoute,
  videoRoute
]

export default new Router({
  routes
})
