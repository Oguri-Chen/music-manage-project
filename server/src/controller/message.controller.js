const { create, getInfo, getList, update, del } = require('../service/message.service')
const { messageCreatedError, messageNotFound, messageAllNotFound, messageChangeError, messageDeleteError } = require('../constant/err.type')
const resolve = require('../app/resolve')

class MessageController {
    async messageCreate(ctx, next) {
        const { _id } = ctx.state.user;
        const { messageType, messageContent, pid, replyTargetId } = ctx.request.body
        try {
            const res = await create({ user: _id, messageType, messageContent, pid, replyTargetId })
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e);
            ctx.app.emit('error', messageCreatedError, ctx)
        }
    }
    async messageGetInfo(ctx, next) {
        const { _id } = ctx.request.query
        try {
            const res = await getInfo({ _id })
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', messageNotFound, ctx)
        }
    }
    async messageGetList(ctx, next) {
        const { _id = '', pageIndex = 1, pageSize = 5, keyword } = ctx.request.query;
        const condition = {};
        if (keyword) {
            condition.$or = [
                {
                    messageContent: {
                        $regex: new RegExp(keyword, "i")
                    },
                }
            ]
        }
        try {
            const res = await getList({ _id, condition, pageIndex, pageSize })
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', messageAllNotFound, ctx)
        }
    }
    async messageUpdate(ctx, next) {
        const { _id, messageContent, user } = ctx.request.body
        try {
            const res = await update({ _id, messageContent, user })
            ctx.body = resolve.json(res, '修改评论成功')
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', messageChangeError, ctx)
        }
    }
    async messageDelete(ctx, next) {
        const { _id } = ctx.request.body
        try {
            const res = await del({ _id })
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', messageDeleteError, ctx)
        }
    }
}

module.exports = new MessageController()
