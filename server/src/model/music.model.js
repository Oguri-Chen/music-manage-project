const mongoose = require('mongoose')

const musicSchema = new mongoose.Schema({
    musicName: { type: String, require: true },//音乐名称
    musicUrl: { type: String, default: '' }, // 歌曲链接
    lyrics: { type: String, default: '' }, // 歌词
    musicCover: { type: String, default: '' }, // 封面
    singers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Singer'
    }], // 歌手
    mvs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MV'
    }, // 对应mv
    albums: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
    }, // 所属专辑
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],  // 分类id
    isVipOnly: { type: Boolean, default: 0 }, // 是否vip专属
    num: { type: Number, default: 0 },
    oldNum: { type: Number, default: 0 },
    createdAt: { type: Number },
    updatedAt: { type: Number },
}, { timestamps: { currentTime: () => Date.now() } })

const MusicModel = mongoose.model('Music', musicSchema);

module.exports = MusicModel;