const jwt = require('jsonwebtoken');
const { create, getInfo, getList, update, updateVip, del } = require('../service/user.service');
const {
  userRegisterError,
  userLoginError,
  userUpdateError,
  userNotFound,
  UserDeleteError
} = require('../constant/err.type');
const { JWT_SECRET } = require('../config/config.default');
const resolve = require('../app/resolve');

class UserController {
  async register(ctx, next) {
    const { userName, password } = ctx.request.body;
    try {
      const res = await create({ userName, password });
      ctx.body = resolve.json(res);
    } catch (e) {
      console.log(e);
      ctx.app.emit('error', userRegisterError, ctx);
    }
  }

  async login(ctx, next) {
    const { userName } = ctx.request.body;
    try {
      const { password, ...res } = await getInfo({ userName });
      ctx.body = resolve.json({
        user: res._doc,
        token: jwt.sign(res, JWT_SECRET, { expiresIn: '7d' }),
      });
    } catch (e) {
      console.log(e);
      ctx.app.emit('error', userLoginError, ctx);
    }
  }
  async userGetList(ctx, next) {
    const { level } = ctx.state.user;
    const { pageIndex = 1, pageSize = 5, keyword } = ctx.request.query;
    const condition = {};
    condition.$and = keyword
      ? [
        {
          userName: {
            $regex: new RegExp(keyword, 'i'),
          },
        },
        {
          level: {
            $lt: level,
          },
        },
      ]
      : [
        {
          level: {
            $lt: level,
          },
        },
      ];
    try {
      const res = await getList({ condition, pageIndex, pageSize });
      ctx.body = resolve.json(res);
    } catch (e) {
      console.log(e);
      ctx.app.emit('error', userNotFound, ctx);
    }
  }
  async changePassword(ctx, next) {
    const { _id } = ctx.state.user;
    const { password } = ctx.request.body;
    try {
      const res = await update({ _id, password });
      ctx.body = resolve.success('修改用户信息成功');
    } catch (e) {
      console.log(e);
      ctx.app.emit('error', userUpdateError, ctx);
    }
  }
  async userUpdate(ctx, next) {
    const { _id } = ctx.state.user;
    const { userName, sex, desc, avatar, email } = ctx.request.body;
    try {
      const res = await update({ _id, userName, sex, desc, avatar, email });
      ctx.body = resolve.success('修改用户信息成功');
    } catch (e) {
      console.log(e);
      ctx.app.emit('error', userUpdateError, ctx);
    }
  }
  async userUpdateVip(ctx, next) {
    const { _id } = ctx.state.user;
    const { day } = ctx.request.body;
    try {
      const res = await updateVip({ _id, day });
      ctx.body = resolve.success('修改用户信息成功');
    } catch (e) {
      console.log(e);
      ctx.app.emit('error', userUpdateError, ctx);
    }
  }
  async adminUpdate(ctx, next) {
    const { _id, userName, sex, desc, avatar, email, vipExpiration, level } = ctx.request.body;
    const isVip = (vipExpiration > 0)
    try {
      const res = await update({ _id, userName, sex, desc, avatar, email, isVip, vipExpiration, level, });
      ctx.body = resolve.success('修改用户信息成功');
    } catch (e) {
      console.log(e);
      ctx.app.emit('error', userUpdateError, ctx);
    }
  }
  async userDelete(ctx, next) {
    const { _id } = ctx.request.body
    try {
      const res = await del({ _id })
      ctx.body = resolve.json(res)
    } catch (e) {
      console.log(e)
      ctx.app.emit('error', UserDeleteError, ctx)
    }
  }
}

module.exports = new UserController();
