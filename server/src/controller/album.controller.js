const { create, getInfo, getList, update, del } = require('../service/album.service')
const { albumCreatedError, albumNotFound, albumAllNotFound, albumChangeError, albumDeleteError } = require('../constant/err.type')
const resolve = require('../app/resolve')

class AlbumController {
    async albumCreate(ctx, next) {
        const { albumName, albumDesc, singer } = ctx.request.body
        try {
            const res = await create({ albumName, albumDesc, singer })
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e);
            ctx.app.emit('error', albumCreatedError, ctx)
        }
    }
    async albumGetInfo(ctx, next) {
        const { _id } = ctx.request.query
        try {
            const res = await getInfo({ _id })
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', albumNotFound, ctx)
        }
    }
    async albumGetList(ctx, next) {
        const { pageIndex = 1, pageSize = 5, keyword } = ctx.request.query;
        const condition = {};
        if (keyword) {
            condition.$or = [
                {
                    albumName: {
                        $regex: new RegExp(keyword, "i")
                    },
                }, {
                    albumDesc: {
                        $regex: new RegExp(keyword, "i")
                    },
                }
            ]
        }
        try {
            const res = await getList({ condition, pageIndex, pageSize })
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', albumAllNotFound, ctx)
        }
    }
    async albumUpdate(ctx, next) {
        console.log(ctx.request.body);
        const { _id, albumName, albumDesc, singer, albumCover } = ctx.request.body
        console.log(singer);
        try {
            const res = await update({ _id, albumName, albumDesc, singer, albumCover })
            ctx.body = resolve.json(res, '修改分类成功')
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', albumChangeError, ctx)
        }
    }
    async albumDelete(ctx, next) {
        const { _id } = ctx.request.body
        try {
            const res = await del({ _id })
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', albumDeleteError, ctx)
        }
    }
}

module.exports = new AlbumController()
