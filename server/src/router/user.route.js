const Router = require('koa-router');
const {
  userValidator,
  verifyUser,
  crpytPassword,
  verifyLogin,
} = require('../middleware/user.middleware');
const { auth, hadAdmin } = require('../middleware/auth.middleware');
const {
  register,
  login,
  userGetList,
  changePassword,
  userUpdate,
  userUpdateVip,
  adminUpdate,
  userDelete
} = require('../controller/user.controller');

const router = new Router({ prefix: '/user' });

router.get('/getall', auth, userGetList);
router.post('/register', userValidator, verifyUser, crpytPassword, register);
router.post('/login', userValidator, verifyLogin, login);
router.patch('/changepwd', auth, crpytPassword, changePassword);
router.patch('/update', auth, userUpdate);
router.patch('/vupdate', auth, userUpdateVip);
router.patch('/aupdate', auth, hadAdmin, adminUpdate);
router.post('/del', auth, hadAdmin, userDelete)

module.exports = router;
