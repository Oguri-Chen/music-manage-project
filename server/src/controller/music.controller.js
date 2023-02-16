const {
  create,
  getInfo,
  getList,
  update,
  del,
} = require('../service/music.service');
const {
  musicCreatedError,
  musicNotFound,
  musicAllNotFound,
  musicChangeError,
  musicDeleteError,
} = require('../constant/err.type');
const resolve = require('../app/resolve');
const mongoose = require('mongoose')

class MusicController {
  async musicCreate(ctx, next) {
    const { _id, musicName, musicUrl, musicCover, singers, albums, categories, mvs, isVipOnly } = ctx.request.body;
    try {
      const res = await create({ _id, musicName, musicUrl, musicCover, singers, albums, categories, mvs, isVipOnly });
      ctx.body = resolve.json(res);
    } catch (e) {
      console.log(e);
      ctx.app.emit('error', musicCreatedError, ctx);
    }
  }
  async musicGetInfo(ctx, next) {
    const { _id } = ctx.request.query;
    try {
      const res = await getInfo({ _id });
      ctx.body = resolve.json(res);
    } catch (e) {
      console.log(e);
      ctx.app.emit('error', musicNotFound, ctx);
    }
  }
  async musicGetList(ctx, next) {
    const {
      categories = null,
      category_id = null,
      singers = null,
      singer_id = null,
      albums = null,
      album_id = null,
      pageIndex = 1,
      pageSize = 5,
      keyword,
      sort
    } = ctx.request.query;
    const condition = [
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categories'
        }
      },
      {
        $lookup: {
          from: 'albums',
          localField: 'albums',
          foreignField: '_id',
          as: 'albums'
        }
      },
      {
        $lookup: {
          from: 'singers',
          localField: 'singers',
          foreignField: '_id',
          as: 'singers'
        }
      },
      {
        $lookup: {
          from: 'mvs',
          localField: 'mvs',
          foreignField: '_id',
          as: 'mvs'
        }
      },
      {
        $addFields: {
          diff: { $subtract: ["$num", "$oldNum"] },
        },
      },
      {
        $match: {
          musicName: {
            $regex: new RegExp(keyword, 'i'),
          },
        }
      },
    ]

    if (sort) {
      const obj = {}
      obj['$sort'] = {}
      obj['$sort'][sort] = -1
      condition.push(obj)
    }
    if (singers) condition.push({
      $match: {
        'singers.singerName': {
          $regex: new RegExp(singers, 'i')
        }
      }
    })
    if (singer_id) condition.push({
      $match: {
        'singers._id': mongoose.Types.ObjectId(singer_id)
      }
    })
    if (albums) condition.push({
      $match: {
        'albums.albumName': {
          $regex: new RegExp(albums, 'i')
        }
      }
    })
    if (album_id) condition.push({
      $match: {
        'albums._id': mongoose.Types.ObjectId(album_id)
      }
    })
    if (categories) condition.push({
      $match: {
        'categories.categoryName': {
          $regex: new RegExp(categories, 'i')
        }
      }
    })
    if (category_id) condition.push({
      $match: {
        'categories._id': mongoose.Types.ObjectId(category_id)
      }
    })
    try {
      const res = await getList({ condition, pageIndex, pageSize });
      ctx.body = resolve.json(res);
    } catch (e) {
      console.log(e);
      ctx.app.emit('error', musicAllNotFound, ctx);
    }
  }
  async musicUpdate(ctx, next) {
    const { _id, musicName, musicUrl, musicCover, singers, albums, categories, mvs, isVipOnly } = ctx.request.body;
    try {
      const res = await update({ _id, musicName, musicUrl, musicCover, singers, albums, categories, mvs, isVipOnly });
      ctx.body = resolve.json(res, '修改音乐成功');
    } catch (e) {
      console.log(e);
      ctx.app.emit('error', musicChangeError, ctx);
    }
  }
  async musicDelete(ctx, next) {
    const { _id } = ctx.request.body;
    try {
      const res = await del({ _id });
      ctx.body = resolve.json(res);
    } catch (e) {
      console.log(e);
      ctx.app.emit('error', musicDeleteError, ctx);
    }
  }
}

module.exports = new MusicController();
