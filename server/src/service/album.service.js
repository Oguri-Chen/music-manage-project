const Album = require('../model/album.model')

class AlbumService {
    // 创建专辑
    async create({ ...params }) {
        const res = await Album.create({ ...params })
        return res
    }
    // 查询专辑信息
    async getInfo({ ...params }) {
        const res = await Album
            .findOne({ ...params })
            .populate("singer")
        return res || null
    }
    // 获取专辑列表
    async getList({ ...params }) {
        const { condition, pageIndex, pageSize } = params;
        const totalSize = await Album.find(condition).countDocuments();
        const albumList = await Album.find(condition)
            .populate('singer')
            .skip((pageIndex - 1) * pageSize)
            .limit(+pageSize)
            .sort('createdAt');
        return {
            pageIndex: +pageIndex,
            pageSize: +pageSize,
            totalSize,
            albumList,
        };
    }
    // 更新专辑信息
    async update({ _id, ...params }) {
        const res = await Album.findByIdAndUpdate({ _id }, params)
        return res[0] > 0
    }
    // 删除专辑
    async del({ ...params }) {
        const res = await Album.findByIdAndDelete({ ...params })
        return res[0] > 0
    }
}

module.exports = new AlbumService()