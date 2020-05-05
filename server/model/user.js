const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')


const emailValidator = {
  validator: (v) => {
    const pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
    return pattern.test(v)
  },
  message: 'メールアドレスの形式が不正です'
}

const passwordValidator = {
  validator: (v) => {
    const pattern = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{6,100}$/i
    return pattern.test(v)
  },
  message: '半角英数字が1種類以上必要です。'
}

const UserSchema = new Schema({
  username: {
    type: String,
    require: true,
    max: [
      60, 'ユーザー名は最大60文字までです'
    ]
  },
  email: {
    type: String,
    require: true,
    max: [
      60, 'メールアドレスは最大60文字までです'
    ],
    lowercase: true,
    unique: true,
    validate: emailValidator,
  },
  // 半角英数字6文字以上にする
  password: {
    type: String,
    require: true,
    min: [
      6, 'パスワードは6文字以上で入力してください'
    ],
    max: [
      30, 'パスワードは最大30文字までです'
    ],
    validate: passwordValidator,
  },
})

/**
 * users.jsでhasSamePasswordが呼ばれたときにそこに渡した引数を受け取り処理が可能
 */
UserSchema.methods.hasSamePassword = function(inputPassWord) {
  const user = this
  return bcrypt.compareSync(inputPassWord, user.password)
}

// users.jsのsaveをする前に以下の関数を実行する
UserSchema.pre('save', function(next) {
  const user = this
  const saltRounds = 10; // ハッシュを作る規模　1秒間に10個hashを作る
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(user.password, salt, function (err, hash) {
      user.password = hash
      // saveを実行
      next()
    });
  })
})

// mongoDBのコレクション名を指定する。
module.exports = mongoose.model('User', UserSchema)
