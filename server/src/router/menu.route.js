const Router = require('koa-router')
const { menuCreate, menuGet } = require('../controller/menu.controller')
const { auth } = require('../middleware/auth.middleware')

const router = new Router({ prefix: '/menu' })

router.get('/get', auth, menuGet)
router.post('/add', auth, menuCreate)

module.exports = router