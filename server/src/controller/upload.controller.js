const path = require('path');
const { fileUploadError } = require('../constant/err.type');
const resolve = require('../app/resolve');


class UploadController {
    async upload(ctx, next) {
        const { file } = ctx.request.files;
        try {
            const pathArr = file[0] ?
                file.map((obj) => obj.dir + path.basename(obj.filepath)) :
                file.dir + path.basename(file.filepath);

            ctx.body = resolve.json(pathArr, '文件上传成功');
        } catch (e) {
            console.log(e);
            ctx.app.emit('error', fileUploadError, ctx);
        }
    }
}

module.exports = new UploadController();
