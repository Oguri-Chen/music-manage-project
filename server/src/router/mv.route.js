const Router = require('koa-router')
const { auth, hadAdmin } = require('../middleware/auth.middleware')
const { mvCreate, mvGetInfo, mvGetList, mvUpdate, mvDelete } = require('../controller/mv.controller')
const router = new Router({ prefix: '/mv' })

router.get('/get', mvGetInfo)
router.get('/getall', mvGetList)
router.post('/add', auth, hadAdmin, mvCreate)
router.patch('/update', auth, hadAdmin, mvUpdate)
router.post('/del', auth, hadAdmin, mvDelete)

module.exports = router