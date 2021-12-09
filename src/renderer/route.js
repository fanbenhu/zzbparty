import Home from './pages/Home'
import Login from './pages/Login'
import menus from './menu'

const childrenRoutes = []

for (const menu of menus) {
  childrenRoutes.push(menu)
}

// childrenRoutes.push({
//   path: '*',
//   redirect: menus[ 0 ].path
// })

const routes = [
  {
    path: '/',
    name: '登陆',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: childrenRoutes
  },
  {
    path: '*',
    redirect: '/'
  }
]
export default routes
