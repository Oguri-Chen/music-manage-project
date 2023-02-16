const { schedule } = require("node-cron")
const { autoUpdate: autoUpdateMusic } = require('../service/music.service');
const { autoUpdate: autoUpdateUser } = require('../service/user.service');

schedule('0 0 * * *', async () => {
    await autoUpdateMusic();
    await autoUpdateUser();
});
