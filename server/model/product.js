
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
  username: String, // localStrageから取得して送る
  userId: String,　// localStrageから取得して送る
  coverImage1: String,
  coverImage2: String,
  coverImage3: String,
  heading1: String,
  heading2: String,
  heading3: String,
  description1: String,
  description2: String,
  description3: String,
  createDate: Date, // js で作る
});

module.exports = mongoose.model('Product', productSchema)
