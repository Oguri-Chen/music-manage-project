const { create, getInfo, getList, update, del } = require('../service/category.service')
const { categoryCreatedError, categoryNotFound, categoryAllNotFound, categoryChangeError, categoryDeleteError } = require('../constant/err.type')
const resolve = require('../app/resolve')

class CategoryController {
    async categoryCreate(ctx, next) {
        const { categoryName, categoryDesc } = ctx.request.body
        try {
            const res = await create({ categoryName, categoryDesc })
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e);
            ctx.app.emit('error', categoryCreatedError, ctx)
        }
    }
    async categoryGetInfo(ctx, next) {
        const { _id } = ctx.request.query
        try {
            const res = await getInfo({ _id })
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', categoryNotFound, ctx)
        }
    }
    async categoryGetList(ctx, next) {
        const { pageIndex = 1, pageSize = 5, keyword } = ctx.request.query
        const condition = {}
        if (keyword) {
            condition.$or = [
                {
                    categoryName: {
                        $regex: new RegExp(keyword, "i")
                    },
                }, {
                    categoryDesc: {
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
            ctx.app.emit('error', categoryAllNotFound, ctx)
        }
    }
    async categoryUpdate(ctx, next) {
        const { _id, categoryName, categoryDesc, categoryType } = ctx.request.body
        try {
            const res = await update({ _id, categoryName, categoryDesc, categoryType })
            ctx.body = resolve.json(res, '修改分类成功')
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', categoryChangeError, ctx)
        }
    }
    async categoryDelete(ctx, next) {
        const { _id } = ctx.request.body
        try {
            const res = await del({ _id })
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', categoryDeleteError, ctx)
        }
    }
}

module.exports = new CategoryController()
