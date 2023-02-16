const Message = require('../model/message.model')

class MessageService {
    // 创建留言
    async create({ ...params }) {
        const res = await Message.create({ ...params })
        return res
    }
    // 查询留言信息
    async getInfo({ ...params }) {
        const res = await Message.findOne({ ...params }).populate('user')
        return res || null
    }
    // 获取留言列表
    async getList({ _id, ...params }) {
        const { condition, pageIndex, pageSize } = params;
        const totalSize = await Message.find(condition).countDocuments();
        const data = await Message.find(condition)
            .skip((pageIndex - 1) * pageSize)
            .limit(+pageSize)
            .sort('createdAt')
            .populate('user')
            .lean(true)
        const pids = Array.isArray(data) ? data.map(i => i._id) : [];
        let resReply = []
        if (pids.length) resReply = await Message.find({ pid: { $in: pids } }).sort({ 'createdAt': 1 }).populate('user')
        let messageList = data.map(item => {
            const children = JSON.parse(JSON.stringify(resReply.filter(i => i.pid === item._id.toString())))
            const tranformChildren = children.map(innerItem => ({
                ...innerItem,
                canDel: innerItem.user._id && innerItem.user._id.toString() === (_id && _id.toString()) ? 1 : 0
            }))
            return {
                ...item,
                children: tranformChildren,
                canDel: item.user._id && item.user._id.toString() === (_id && _id.toString()) ? 1 : 0
            }
        })
        return {
            pageIndex: +pageIndex,
            pageSize: +pageSize,
            totalSize,
            messageList,
        };
    }
    // 更新留言信息
    async update({ _id, ...params }) {
        const res = await Message.findByIdAndUpdate({ _id }, params)
        return res[0] > 0
    }
    // 删除留言
    async del({ ...params }) {
        const res = await Message.findByIdAndDelete({ ...params })
        return res[0] > 0
    }
}

module.exports = new MessageService()