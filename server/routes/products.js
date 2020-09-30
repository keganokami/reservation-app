const express = require('express')
const router = express.Router()
const Product = require('../model/product')
const controll = require('../contorollers/user')


router.get('', (req, res) => {
  Product.find({}, null, {sort:{ createDate: -1}},
    (err, foundProducts) => {
    res.json(foundProducts)
  })
})

router.get('/:productId', controll.authMiddleware, (req, res) => {
  const productId = req.params.productId
  Product.findById(productId, (err, foundProduct) => {
    if (err) {
      return res.status(422).send({error: [{title: 'product error', detail: 'Product not found!'}]})
    }
    return res.json(foundProduct)
  })
})

router.delete('/:remove/:productId', controll.authMiddleware, (req, res) => {
  const id = req.params.productId
  Product.deleteOne({'_id': id}, (err) => {
    if (err) {
      return res.status(422).send({error: [{title: 'delete error', detail: 'Product not found!'}]})
    }
    return res.json(id)
  })
})


router.post('/:posts', function(req, res) {
  const {
    username,
    userId,
    postSize,
    coverImage1,
    coverImage2,
    coverImage3,
    heading,
    prefecture,
    description1,
    description2,
    description3,
    createDate,
  } = req.body

  if (!heading) {
    return res.status(422).send({ error: [{ title: 'heading error', detail: '場所の名前は必須です' }]})
  }

  if (postSize === 1) {
    if (!coverImage1) {
      return res.status(422).send({ error: [{ title: 'heading error', detail: '画像は必須です' }]})
    }
    if (!description1) {
      return res.status(422).send({ error: [{ title: 'description error', detail: '説明文は必須です' }]})
    }
    if (description1.length >=170) {
      return res.status(422).send({ error: [{ title: 'description error', detail: '入力されていない説明文があります' }]})
    }
  } else if (postSize === 2) {
    if (!coverImage1 || !coverImage2) {
      return res.status(422).send({ error: [{ title: 'heading error', detail: '画像は必須です' }]})
    }
    if (!description1 || !description2 ) {
      return res.status(422).send({ error: [{ title: 'description error', detail: '説明文は必須です' }]})
    }
    if (description1.length >=170 || description2.length >=170) {
      return res.status(422).send({ error: [{ title: 'description error', detail: '入力されていない説明文があります' }]})
    }
  } else {
    if (!coverImage1 || !coverImage2 || !coverImage3) {
      return res.status(422).send({ error: [{ title: 'heading error', detail: '画像は必須です' }]})
    }
    if (!description1 || !description2 || !description3) {
      return res.status(422).send({ error: [{ title: 'description error', detail: '説明文は必須です' }]})
    }
    if (description1.length >=170 || description2.length >=170 || description3.length >=170) {
      return res.status(422).send({ error: [{ title: 'description error', detail: '入力されていない説明文があります' }]})
    }
  }

  if (heading.length >= 50) {
    return res.status(422).send({ error: [{ title: 'heading error', detail: '場所の名前は50文字以内で入力してください' }]})
  }

  const posts = new Product(
    {
      username,
      userId,
      coverImage1,
      coverImage2,
      coverImage3,
      heading,
      prefecture,
      description1,
      description2,
      description3,
      createDate,
    }
  )
  posts.save((err) => {
    if (err) {
        return res.status(422).send({ error: [{ title: 'error', detail: 'error' }] })
    }
    return res.json({ "registerd": true })
  })
})

router.put('/:update', function(req, res) {

  const {
    _id,
    heading,
    prefecture,
    description1,
    description2,
    description3,
    createDate,
  } = req.body

  Product.updateOne(
    {'_id': _id},
    { $set: {
      'heading':heading,
      'prefecture': prefecture,
      'description1': description1,
      'description2': description2,
      'description3': description3,
      'createDate': createDate,
    }},(err) => {
    if (err) {
        return res.status(422).send({ error: [{ title: 'error', detail: 'error' }] })
    }
    return res.json({ "update": true })
  })
})

module.exports = router
