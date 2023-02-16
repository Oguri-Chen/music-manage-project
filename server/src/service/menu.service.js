const Menu = require('../model/menu.model')

class MenuService {
    async create({ ...params }) {
        const res = await Menu.create({ ...params })
        return res
    }
    async getList(level) {
        const res = await Menu.find({ parent: null }).lte('level', level).populate("children")
        return res || null
    }
    async update({ _id, ...params }) {
        const res = await Menu.findByIdAndUpdate({ _id }, params)
        return res[0] > 0
    }
    async del({ ...params }) {
        const res = await Menu.findByIdAndDelete({ ...params })
        return res[0] > 0
    }
}

module.exports = new MenuService()