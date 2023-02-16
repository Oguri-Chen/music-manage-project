const Router = require('koa-router')
const { auth, hadAdmin } = require('../middleware/auth.middleware')
const { musicCreate, musicGetInfo, musicGetList, musicUpdate, musicDelete } = require('../controller/music.controller')
const router = new Router({ prefix: '/music' })

router.get('/get', musicGetInfo)
router.get('/getall', musicGetList)
router.post('/add', auth, hadAdmin, musicCreate)
router.patch('/update', auth, hadAdmin, musicUpdate)
router.post('/del', auth, hadAdmin, musicDelete)

module.exports = router