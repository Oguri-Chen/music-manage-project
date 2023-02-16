const path = require('path')
const fs = require('fs')
const Koa = require('koa')
const KoaBody = require('koa-body')
const KoaStatic = require('koa-static')
const koaRange = require('koa-range')
const cors = require('koa2-cors');
const errHand = require('./errHand')
const router = require('../router')
const db = require("../db");
const autoRun = require('./autoUpdate')

const app = new Koa()

app.use(cors({
    origin: "*",
    maxAge: 2592000,
    credentials: true
}));
app.use(KoaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '../upload'),
        keepExtensions: true,
        onFileBegin: (name, file) => {
            const fileType = file.mimetype.split('/')[0]
            const time = new Date();
            const dirName = '' + time.getFullYear() + (time.getMonth() + 1) + time.getDate();;
            const dir = path.join(__dirname, `../upload/${fileType}/${dirName}`);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
            file.newFilename = file.originalFilename
            file.filepath = `${dir}/${file.originalFilename}`
            file.dir = `${fileType}/${dirName}/`
        },
        onError: (e) => {
            console.log(e);
        }
    }
}))
app.use(koaRange)
app.use(KoaStatic(path.join(__dirname, '../upload'), {
    setHeaders: (res, path, stats) => {
        if (path.indexOf(/[jpg|png|gif|jpeg]/) > -1) {
            res.setHeader('Cache-Control', ['private', 'max-age=60'])
        }
    }
}))
app.use(router.routes()).use(router.allowedMethods())

app.on('error', errHand)

module.exports = app