const Singer = require('../model/singer.model')

class SingerService {
    // 创建歌手
    async create({ ...params }) {
        const res = await Singer.create({ ...params })
        return res
    }
    // 查询歌手信息
    async getInfo({ ...params }) {
        const res = await Singer.findOne({ ...params })
        return res || null
    }
    // 获取歌手列表
    async getList({ ...params }) {
        const { condition, pageIndex, pageSize } = params;
        const totalSize = await Singer.find(condition).countDocuments();
        const singerList = await Singer.find(condition)
            .skip((pageIndex - 1) * pageSize)
            .limit(+pageSize)
            .sort('singerName');
        return {
            pageIndex: +pageIndex,
            pageSize: +pageSize,
            totalSize,
            singerList,
        };
    }
    // 更新歌手信息
    async update({ _id, ...params }) {
        const res = await Singer.findByIdAndUpdate({ _id }, params)
        return res[0] > 0
    }
    // 删除歌手
    async del({ ...params }) {
        const res = await Singer.findByIdAndDelete({ ...params })
        return res[0] > 0
    }
}

module.exports = new SingerService()