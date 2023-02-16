const Router = require('koa-router')
const { auth, hadAdmin } = require('../middleware/auth.middleware')
const { messageCreate, messageGetInfo, messageGetList, messageUpdate, messageDelete } = require('../controller/message.controller')
const router = new Router({ prefix: '/message' })

router.get('/get', messageGetInfo)
router.get('/getall', messageGetList)
router.post('/add', auth, messageCreate)
router.patch('/update', auth, hadAdmin, messageUpdate)
router.post('/del', auth, messageDelete)

module.exports = router