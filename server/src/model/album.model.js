const mongoose = require('mongoose')

const albumSchema = new mongoose.Schema({
    albumName: { type: String, require: true }, // 专辑名称
    albumDesc: { type: String, default: '' }, // 专辑描述
    albumCover: { type: String, default: '' }, // 专辑封面
    singer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Singer'
    }, // 歌手
    createdAt: { type: Number },
    updatedAt: { type: Number },
}, { timestamps: { currentTime: () => Date.now() } })

const AlbumModel = mongoose.model('Album', albumSchema)

module.exports = AlbumModel
