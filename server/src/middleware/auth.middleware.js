const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.default');
const { tokenExpiredError, invalidToken } = require('../constant/err.type');

const auth = async (ctx, next) => {
  const { authorization = '' } = ctx.request.header;
  const token = authorization.replace('Bearer ', '');
  try {
    const user = jwt.verify(token, JWT_SECRET);
    ctx.state.user = user._doc;
  } catch (e) {
    switch (e.name) {
      case 'TokenExpiredError':
        console.error('token已过期', e);
        return ctx.app.emit('error', tokenExpiredError, ctx);
      case 'JsonWebTokenError':
        console.error('token无效', e);
        return ctx.app.emit('error', invalidToken, ctx);
    }
  }
  await next();
};

const hadAdmin = async (ctx, next) => {
  const { lever } = ctx.state.user;
  if (lever < 1) {
    console.error('权限不足', ctx.state.user);
    return ctx.app.emit('error', hasNotAdmin, ctx);
  }
  await next();
};

module.exports = {
  auth,
  hadAdmin,
};
