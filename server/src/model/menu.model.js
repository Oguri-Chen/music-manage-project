const mongoose = require('mongoose')

const menuSchema = new mongoose.Schema({
    menuName: { type: String, require: true },
    menuPath: { type: String, required: true },
    menuTitle: { type: String, default: '默认标题' },
    menuIcon: { type: String, default: 'setting' },
    level: { type: Number, default: 1 },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } })

menuSchema.virtual("children", {
    ref: "Menu",
    localField: "_id",
    foreignField: "parent",
    options: { populate: "children" },
});

const MenuModel = mongoose.model('Menu', menuSchema);

module.exports = MenuModel;