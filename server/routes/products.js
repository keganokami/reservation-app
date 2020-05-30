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


router.post('/:posts', function(req, res) {
  const {
    username,
    userId,
    coverImage1,
    coverImage2,
    coverImage3,
    heading,
    prefecture,
    // heading1,
    // heading2,
    // heading3,
    description1,
    description2,
    description3,
    createDate,
  } = req.body

  if (!heading) {
    return res.status(422).send({ error: [{ title: 'heading error', detail: '場所の名前は必須です' }]})
  }

  if (!coverImage1 || !coverImage2 || !coverImage3) {
    return res.status(422).send({ error: [{ title: 'heading error', detail: '画像は必須です' }]})
  }
  // if (!heading1 || !heading2 || !heading3) {
  //   return res.status(422).send({ error: [{ title: 'heading error', detail: 'タイトルは必須です' }]})
  // }
  if (!description1 || !description2 || !description3) {
    return res.status(422).send({ error: [{ title: 'description error', detail: '説明文は必須です' }]})
  }

  if (heading.length >= 50) {
    return res.status(422).send({ error: [{ title: 'heading error', detail: '場所の名前は50文字以内で入力してください' }]})
  }

  // if (heading1.length >=23 || heading2.length >=23 || heading3.length >=23) {
  //   return res.status(422).send({ error: [{ title: 'heading error', detail: 'タイトル22文字以内で入力してください' }]})
  // }
  if (description1.length >=170 || description2.length >=170 || description3.length >=170) {
    return res.status(422).send({ error: [{ title: 'description error', detail: '入力されていない説明文があります' }]})
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
      // heading1,
      // heading2,
      // heading3,
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
    // heading1,
    // heading2,
    // heading3,
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
      // 'heading1': heading1,
      // 'heading2': heading2,
      // 'heading3': heading3,
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
