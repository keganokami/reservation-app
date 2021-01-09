const jwt = require('jsonwebtoken')
const config = require('../config')
const User = require('../model/user')

function notAutorized(res) {
  return res.status(401).send({ error: [{ title: 'Not Authorized', detail: 'サインインが必要です' }] })
}


exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return notAutorized(res)
  }

  jwt.verify(token.split(' ')[1], config.SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).send({ error: [{ title: 'token error', detail: 'Invalid token' }] })
    }

    User.findById(decodedToken.userId, (err, fountUser) => {
      if (err) {
        return res.status(401).send({ error: [{ title: 'token error', detail: 'Invalid token' }] })
      }
      if (!fountUser) {
        return res.status(401).send({ error: [{ title: 'token error', detail: 'Invalid token' }] })
      }
    })
  });
  next()
}
