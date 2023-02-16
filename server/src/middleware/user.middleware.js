const bcrypt = require('bcryptjs');
const { getInfo } = require('../service/user.service')
const {
    userFormateError,
    userAlreadyExited,
    userRegisterError,
    userNotFound,
    userLoginError,
    invalidPassword } = require('../constant/err.type')

class UserMiddleware {
    async userValidator(ctx, next) {
        const { userName, password } = ctx.request.body
        if (!userName || !password) {
            console.error('用户名或密码为空', ctx.request.body)
            ctx.app.emit('error', userFormateError, ctx)
            return
        }
        await next()
    }

    async verifyUser(ctx, next) {
        const { userName } = ctx.request.body
        try {
            const res = await getInfo({ userName })
            if (res) {
                console.log('用户名已存在', { userName })
                ctx.app.emit('error', userAlreadyExited, ctx)
                return
            }
        } catch (e) {
            console.error('获取用户信息错误', e)
            ctx.app.emit('error', userRegisterError, ctx)
            return
        }
        await next()
    }

    async crpytPassword(ctx, next) {
        const { password } = ctx.request.body
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        ctx.request.body.password = hash
        await next()
    }

    async verifyLogin(ctx, next) {
        const { userName, password } = ctx.request.body
        console.log(userName, password)
        try {
            const res = await getInfo({ userName })
            if (!res) {
                console.error('用户不存在', { userName })
                ctx.app.emit('error', userNotFound, ctx)
                return
            }
            if (!bcrypt.compareSync(password, res.password)) {
                ctx.app.emit('error', invalidPassword, ctx)
                return
            }
        } catch (e) {
            console.error(e)
            ctx.app.emit('error', userLoginError, ctx)
            return
        }
        await next()
    }

}

module.exports = new UserMiddleware()
