const Router = require('koa-router')
const { createPayment, checkPayment, notifyPayment } = require('../controller/pay.controller')
const { auth } = require('../middleware/auth.middleware');
const router = new Router({ prefix: '/pay' })

router.get('/', auth, createPayment)
router.get('/check', auth, checkPayment)
router.post('/notify', notifyPayment)

module.exports = router