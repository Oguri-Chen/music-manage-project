const MV = require('../model/mv.model')

class MvService {
    // 创建mv
    async create({ ...params }) {
        const res = await MV.create({ ...params })
        return res
    }

    // 查询mv信息
    async getInfo({ ...params }) {
        const res = await MV
            .findOne({ ...params })
            .populate('singers')
        return res || null
    }

    // 获取mv列表
    async getList({ ...params }) {
        const { condition, pageIndex, pageSize } = params
        const totalSize = await MV.find(condition).countDocuments()
        const mvList = await MV
            .find(condition)
            .skip((pageIndex - 1) * pageSize)
            .limit(+pageSize)
            .sort({ _id: -1 })
            .populate('singer')
        return {
            pageIndex: +pageIndex,
            pageSize: +pageSize,
            totalSize,
            mvList
        }
    }

    // 更新mv信息
    async update({ _id, ...params }) {
        const res = await MV.findByIdAndUpdate({ _id }, params)

        return res[0] > 0
    }

    // 删除mv
    async del({ ...params }) {
        const res = await MV.findByIdAndDelete({ ...params })
        return res[0] > 0
    }
}

module.exports = new MvService()
