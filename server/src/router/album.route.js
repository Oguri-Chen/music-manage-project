const Router = require('koa-router')
const { auth, hadAdmin } = require('../middleware/auth.middleware')
const { albumCreate, albumGetInfo, albumGetList, albumUpdate, albumDelete } = require('../controller/album.controller')
const router = new Router({ prefix: '/album' })

router.get('/get', albumGetInfo)
router.get('/getall', albumGetList)
router.post('/add', auth, hadAdmin, albumCreate)
router.patch('/update', auth, hadAdmin, albumUpdate)
router.post('/del', auth, hadAdmin, albumDelete)

module.exports = router