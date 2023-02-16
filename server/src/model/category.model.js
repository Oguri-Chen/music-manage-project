const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    categoryName: { type: String, require: true },//分类名称
    categoryDesc: { type: String, default: '' }, // 分类描述
    categoryType: { type: Number, default: 1 }, // 分类类型 1.语种 2.风格
})

const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;