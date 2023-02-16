const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, require: true },//用户名
    password: { type: String, required: true },//密码
    avatar: { type: String, default: '' },//头像
    desc: { type: String, default: '' },//简介
    email: { type: String, default: '' },//邮箱
    sex: { type: Boolean, default: 0 },//性别
    isVip: { type: Boolean, default: 0 },//是否是vip
    vipExpiration: { type: Number, default: 0 },//VIP 到期日期
    level: { type: Number, default: 0 },//是否是管理员
    createdAt: { type: Number },//创建时间
    updatedAt: { type: Number },//更新时间
  },
  { timestamps: { currentTime: () => Date.now() } }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
