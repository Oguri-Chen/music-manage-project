const Category = require('../model/category.model')

class CategoryService {
    // 创建分类
    async create({ ...params }) {
        const res = await Category.create({ ...params })
        return res
    }
    // 查询分类信息
    async getInfo({ ...params }) {
        const res = await Category.findOne({ ...params })
        return res || null
    }
    // 获取分类列表
    async getList({ ...params }) {
        const { condition, pageIndex, pageSize } = params;
        const totalSize = await Category.find(condition).countDocuments();
        const categoryList = await Category
            .find(condition)
            .skip((pageIndex - 1) * pageSize)
            .limit(+pageSize)
            .sort({ _id: -1 })
        return {
            pageIndex: +pageIndex,
            pageSize: +pageSize,
            totalSize,
            categoryList,
        };
    }
    // 更新分类信息
    async update({ _id, ...params }) {
        const res = await Category.findByIdAndUpdate({ _id }, params)
        return res[0] > 0
    }
    // 删除分类
    async del({ ...params }) {
        const res = await Category.findByIdAndDelete({ ...params })
        return res[0] > 0
    }
}

module.exports = new CategoryService()