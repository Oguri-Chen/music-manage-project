const { create, getInfo, getList, update, del } = require('../service/singer.service')
const { singerCreatedError, singerNotFound, singerAllNotFound, singerChangeError, singerDeleteError } = require('../constant/err.type')
const resolve = require('../app/resolve')

class SingerController {
    async singerCreate(ctx, next) {
        const { singerName, singerDesc, singerSex, singerCover } = ctx.request.body
        try {
            const res = await create({ singerName, singerDesc, singerSex, singerCover })
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e);
            ctx.app.emit('error', singerCreatedError, ctx)
        }
    }
    async singerGetInfo(ctx, next) {
        const { _id } = ctx.request.query
        try {
            const res = await getInfo({ _id })
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', singerNotFound, ctx)
        }
    }
    async singerGetList(ctx, next) {
        const { pageIndex, pageSize, keyword } = ctx.request.query;
        const condition = {};
        if (keyword) {
            condition.$or = [
                {
                    singerName: {
                        $regex: new RegExp(keyword, "i")
                    },
                }, {
                    singerDesc: {
                        $regex: new RegExp(keyword, "i")
                    },
                }
            ]
        }
        try {
            const res = await getList({ condition, pageIndex, pageSize });
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', singerAllNotFound, ctx)
        }
    }
    async singerUpdate(ctx, next) {
        const { _id, singerName, singerDesc, singerSex, singerCover } = ctx.request.body
        try {
            const res = await update({ _id, singerName, singerDesc, singerSex, singerCover })
            ctx.body = resolve.json(res, '修改歌手成功')
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', singerChangeError, ctx)
        }
    }
    async singerDelete(ctx, next) {
        const { _id } = ctx.request.body
        try {
            const res = await del({ _id })
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', singerDeleteError, ctx)
        }
    }
}

module.exports = new SingerController()
