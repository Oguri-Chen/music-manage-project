const mongoose = require('mongoose');

const mvSchema = new mongoose.Schema({
    mvName: { type: String, required: true }, // mv名称
    mvUrl: { type: String, required: true }, // mv链接
    mvCover: { type: String, default: '' }, // 封面
    singer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Singer'
    }, // 歌手
    isVipOnly: { type: Boolean, default: false }, // 是否vip专属
});

const MVModel = mongoose.model('MV', mvSchema);

module.exports = MVModel;
