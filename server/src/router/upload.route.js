const Router = require('koa-router');
const { auth } = require('../middleware/auth.middleware');
const { upload } = require('../controller/upload.controller');
const router = new Router();

router.post('/upload', auth, upload);

module.exports = router;
