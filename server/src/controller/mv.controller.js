const { create, getInfo, getList, update, del } = require('../service/mv.service')
const { mvCreatedError, mvNotFound, mvAllNotFound, mvChangeError, mvDeleteError } = require('../constant/err.type')
const resolve = require('../app/resolve')

class MVController {
    async mvCreate(ctx, next) {
        const { mvName, mvUrl, mvCover, singer, isVipOnly } = ctx.request.body
        try {
            const res = await create({ mvName, mvUrl, mvCover, singer, isVipOnly })
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e);
            ctx.app.emit('error', mvCreatedError, ctx)
        }
    }
    async mvGetInfo(ctx, next) {
        const { _id } = ctx.request.query
        try {
            const res = await getInfo({ _id })
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', mvNotFound, ctx)
        }
    }
    async mvGetList(ctx, next) {
        const { singer = null, pageIndex, pageSize, keyword } = ctx.request.query
        const condition = {}
        if (singer) condition.singer = singer
        if (keyword) {
            condition.$or = [
                {
                    mvName: {
                        $regex: new RegExp(keyword, "i")
                    }
                },
                {
                    "singer.singerName": {
                        $regex: new RegExp(keyword, "i")
                    }
                }
            ]
        }
        try {
            const res = await getList({ condition, pageIndex, pageSize })
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', mvAllNotFound, ctx)
        }
    }
    async mvUpdate(ctx, next) {
        const { _id, mvName, mvUrl, mvCover, isVipOnly } = ctx.request.body
        try {
            const res = await update({ _id, mvName, mvUrl, mvCover, isVipOnly })
            ctx.body = resolve.json(res, '修改mv成功')
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', mvChangeError, ctx)
        }
    }
    async mvDelete(ctx, next) {
        const { _id } = ctx.request.body
        try {
            const res = await del({ _id })
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', mvDeleteError, ctx)
        }
    }
}

module.exports = new MVController()
