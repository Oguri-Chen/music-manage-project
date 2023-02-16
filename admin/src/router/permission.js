import router from './index'
import { userStore } from '@/store'
import { getMenu } from '@/api/manager'

const whiteList = ['/login']
router.beforeEach(async (to, from, next) => {
  const store = userStore()
  if (store.token) {
    to.path === '/login' ? next('/') : next()
    if (store.getMenuData.length === 0) {
      const res = await getMenu()
      let menuData = res.data.map(item => {
        if (item.children.length !== 0) {
          return {
            _id: item._id,
            menuName: item.menuName,
            menuPath: item.menuPath,
            menuIcon: item.menuIcon,
            children: item.children.map(sitem => {
              return {
                _id: sitem._id,
                menuName: sitem.menuName,
                menuPath: sitem.menuPath,
                menuIcon: sitem.menuIcon,
              }
            })
          }
        } else {
          return {
            _id: item._id,
            menuName: item.menuName,
            menuPath: item.menuPath,
            menuIcon: item.menuIcon,
          }
        }
      })
      let newMenuData = [{
        _id: 1,
        menuName: '/',
        menuPath: '/',
        menuIcon: 'house'
      }, {
        _id: 2,
        menuName: 'me',
        menuPath: '/me',
        menuIcon: 'setting'
      }]
      newMenuData = [...newMenuData, ...menuData]
      store.setMenu(newMenuData)
    };
  } else {
    whiteList.includes(to.path) ? next() : next('/login')
  }
})
