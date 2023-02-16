const Music = require('../model/music.model');
class MusicService {
  // 创建音乐
  async create({ ...params }) {
    const res = await Music.create({ ...params });
    return res;
  }

  // 查询音乐信息
  async getInfo({ ...params }) {
    const res = await Music.findOne({ ...params }).populate([
      'singers', 'mvs', 'albums', 'categories'
    ]);
    return res || null;
  }

  // 获取音乐列表
  async getList({ ...params }) {
    const { condition, pageIndex, pageSize } = params;
    const totalSize = await Music.aggregate(condition).count('count');
    condition.push(
      {
        $skip: (pageIndex - 1) * pageSize
      },
      {
        $limit: +pageSize
      })
    const musicList = await Music.aggregate(condition)
    return {
      pageIndex: +pageIndex,
      pageSize: +pageSize,
      totalSize: totalSize[0]?.count,
      musicList,
    };
  }

  // 更新音乐信息
  async update({ _id, ...params }) {
    const res = await Music.findByIdAndUpdate({ _id }, params);
    return res[0] > 0;
  }

  // 自动更新播放数
  async autoUpdate() {
    const musics = await Music.find({});
    for (const music of musics) {
      await Music.updateOne({ _id: music._id }, { $set: { oldNum: music.num } });
    }
    return true;
  }

  // 删除音乐
  async del({ ...params }) {
    const res = await Music.findByIdAndDelete({ ...params });
    return res[0] > 0;
  }
}

module.exports = new MusicService();
