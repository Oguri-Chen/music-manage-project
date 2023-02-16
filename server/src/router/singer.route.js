const Router = require('koa-router')
const { auth, hadAdmin } = require('../middleware/auth.middleware')
const { singerCreate, singerGetInfo, singerGetList, singerUpdate, singerDelete } = require('../controller/singer.controller')
const router = new Router({ prefix: '/singer' })

router.get('/get', singerGetInfo)
router.get('/getall', singerGetList)
router.post('/add', auth, hadAdmin, singerCreate)
router.patch('/update', auth, hadAdmin, singerUpdate)
router.post('/del', auth, hadAdmin, singerDelete)

module.exports = router