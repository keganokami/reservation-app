const express = require('express')
const router = express.Router()
const User = require('../model/user')
const jwt = require('jsonwebtoken')
const config = require('../config')

// フォーム入力のためpostで送信
router.post('/login', (req, res) => {
  const { email, password } = req.body
  if (!email) {
    return res.status(422).send({ error: [{ title: 'email error', detail: 'メールアドレスを入力してください' }] })
  }
  if (!password) {
    return res.status(422).send({ error: [{ title: 'password error', detail: 'パスワードを入力してください' }] })
  }

  User.findOne({ email }, (err, foundUser) => {
    if (err) {
      return res.status(422).send({ error: [{ title: 'User error', detail: '問題が発生しました' }] })
    }
    if (!foundUser) {
      return res.status(422).send({ error: [{ title: 'User error', detail: 'ユーザーが見つかりません' }] })
    }
    if (!foundUser.hasSamePassword(password)) {
      return res.status(422).send({ error: [{ title: 'User error', detail: 'パスワードが正しくありません' }] })
    }

    const token = jwt.sign({
      userId: foundUser.id,
      username: foundUser.username
    }, config.SECRET, { expiresIn: '1h' });

    return res.json(token)
  })
})

router.post('/:register', (req, res) => {
  const { username, email, password, confirmPassword } = req.body

  // 変数名とフィールド名が同じ場合は1行で書ける
  // const username = req.body.username
  // const email = req.body.email
  // const password = req.body.password
  // const confirmPassword = req.body.confirmPassword

  if (!username) {
    return res.status(422).send({ error: [{ title: 'User error', detail: 'ユーザー名を入力してください' }] })
  }
  if (!email) {
    return res.status(422).send({ error: [{ title: 'email error', detail: 'メールアドレスを入力してください' }] })
  }
  if (!password) {
    return res.status(422).send({ error: [{ title: 'password error', detail: 'パスワードを入力してください' }] })
  }
  if (password !== confirmPassword) {
    return res.status(422).send({ error: [{ title: 'confirmPassword error', detail: 'パスワードが一致しません' }] })
  }


  // emailは1つ見つかれば検索をやめる。重複がないことを検知するため
  User.findOne({ email }, (err, foundUser) => {
    if (err) {
      return res.status(422).send({ error: [{ title: 'User error', detail: '問題が発生しました' }] })
    }
    if (foundUser) {
      return res.status(422).send({ error: [{ title: 'User error', detail: 'そのメールアドレスは既に使われています' }] })
    }

    const user = new User({ username, email, password })
    user.save((err) => {
      if (err) {
        if (err.errors.email) {
          return res.status(422).send({ error: [{ title: 'validate error', detail: err.errors.email.message }] })
        }
        if (err.errors.password) {
          return res.status(422).send({ error: [{ title: 'validate error', detail: err.errors.password.message }] })
        }
      }
      return res.json({ "registerd": true })
    })
  })
})

module.exports = router
