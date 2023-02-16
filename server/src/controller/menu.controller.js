const { create, getList } = require('../service/menu.service');
const resolve = require('../app/resolve');

class MenuController {
  async menuCreate(ctx, next) {
    const { menuName, menuPath, menuTitle, menuIcon, parent } =
      ctx.request.body;
    try {
      const res = await create({
        menuName,
        menuPath,
        menuTitle,
        menuIcon,
        parent,
      });
      ctx.body = resolve.json(res);
    } catch (e) {
      console.log(e);
      ctx.app.emit('error', ctx);
    }
  }
  async menuGet(ctx, next) {
    const { level } = ctx.state.user;
    try {
      const res = await getList(level);
      ctx.body = resolve.json(res);
    } catch (e) {
      console.log(e);
      ctx.app.emit('error', ctx);
    }
  }
}

module.exports = new MenuController();
