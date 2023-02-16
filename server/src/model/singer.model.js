const mongoose = require('mongoose')

const singerSchema = new mongoose.Schema({
    singerName: { type: String, require: true }, // 歌手名称
    singerDesc: { type: String, default: '' }, // 歌手简介
    singerSex: { type: Boolean, default: 0 }, // 歌手性别
    singerCover: { type: String, default: '' }, // 歌手封面图片
})

const SingerModel = mongoose.model('Singer', singerSchema);

module.exports = SingerModel;
