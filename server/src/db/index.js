const mongoose = require("mongoose");
const { DB_CLOUD, DB_HOST, DB_HOST_SRV, DB_PORT, DB_NAME, DB_USER, DB_PASS } = require('../config/config.default')

const src = DB_CLOUD === 'true' ?
    `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST_SRV}/${DB_NAME}?retryWrites=true&w=majority` :
    `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`

mongoose.connect(src, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
    console.log("成功连接数据库");
});