const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 定义留言字段
let MessageSchema = new Schema({
    user: {// 用户id
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messageType: { // 1是留言，2是回复
        type: Number,
        default: 1
    },
    messageContent: { //  留言内容
        type: String,
        default: ''
    },
    pid: { // 父id
        type: String,
        default: '-1'
    },
    replyTargetId: { // 回复目标记录id
        type: String,
        default: '-1'
    },
    createdAt: { type: Number },//创建时间
    updatedAt: { type: Number },//更新时间
},
    { timestamps: { currentTime: () => Date.now() } })
const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;
