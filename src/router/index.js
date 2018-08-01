import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const LoginComponent = () => import('@/views/login/index')

/**
 * 登录路由
 * @type {{path: string, component: function(), hidden: boolean}}
 */
const loginRoute = {
  path: '/login',
  component: LoginComponent,
  hidden: true
}

export default new Router({
  routes: [
    loginRoute
  ]
})
