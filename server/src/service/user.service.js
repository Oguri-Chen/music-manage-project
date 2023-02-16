const User = require('../model/user.model');

class UserService {
  async create({ ...params }) {
    const res = await User.create({ ...params });
    return res;
  }
  async getInfo({ ...params }) {
    const res = await User.findOne({ ...params });
    return res || null;
  }
  async getList({ ...params }) {
    const { condition, pageIndex, pageSize } = params;
    const totalSize = await User.find(condition).countDocuments();
    const userList = await User.find(condition)
      .skip((pageIndex - 1) * pageSize)
      .limit(+pageSize)
      .sort('createdAt');
    return {
      pageIndex: +pageIndex,
      pageSize: +pageSize,
      totalSize,
      userList,
    };
  }
  async update({ _id, ...params }) {
    const res = await User.findByIdAndUpdate({ _id }, params);
    return res[0] > 0;
  }
  async updateVip({ _id, day }) {
    const expiredAt = day * 24 * 60 * 60 * 1000;
    const res = await User.updateOne({ _id }, { $inc: { vipExpiration: expiredAt }, $set: { isVip: true } });
    return res[0] > 0;
  }
  // 检查用户vip状态
  async autoUpdate() {
    const users = await User.find({});
    for (const user of users) {
      const diff = user.vipExpiration - Date.now();
      if (diff < 0) await User.updateOne({ _id: user._id }, { $set: { isVip: false, vipExpiration: 0 } });
    }
    return true;
  }
  async del({ ...params }) {
    const res = await User.findByIdAndDelete({ ...params })
    return res[0] > 0
  }
}

module.exports = new UserService();
