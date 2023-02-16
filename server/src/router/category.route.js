const Router = require('koa-router')
const { auth, hadAdmin } = require('../middleware/auth.middleware')
const { categoryCreate, categoryGetInfo, categoryGetList, categoryUpdate, categoryDelete } = require('../controller/category.controller')
const router = new Router({ prefix: '/category' })

router.get('/get', categoryGetInfo)
router.get('/getall', categoryGetList)
router.post('/add', auth, hadAdmin, categoryCreate)
router.patch('/update', auth, hadAdmin, categoryUpdate)
router.post('/del', auth, hadAdmin, categoryDelete)

module.exports = router