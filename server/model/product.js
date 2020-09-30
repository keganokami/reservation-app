
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const productSchema = new Schema({
  username: String, // localStrageから取得して送る
  postSize: Number,
  userId: String,　// localStrageから取得して送る
  coverImage1: {
    type: String,
    require: true,
  },
  coverImage2: {
    type: String,
  },
  coverImage3: {
    type: String,
  },
  heading: {
    type: String,
    require: true,
    max: [
      20, 'タイトルは20文字までです'
    ]
  },
  prefecture: {
    type: String,
    require: true,
  },
  description1: {
    type: String,
    require: true,
    max: [
      20, '説明文は170文字までです'
    ]
  },
  description2: {
    type: String,
    max: [
      20, '説明文は170文字までです'
    ]
  },
  description3: {
    type: String,
    max: [
      20, '説明文は170文字までです'
    ]
  },
  createDate: Date, // js で作る
});

module.exports = mongoose.model('Product', productSchema)
