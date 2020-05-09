const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const Product = require('../model/product')
const controll = require('../contorollers/user')

router.get('', (req, res) => {
  Product.find({}, (err, foundProducts) => {
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
    heading1,
    heading2,
    heading3,
    description1,
    description2,
    description3,
    createDate,
  } = req.body
  const posts = new Product(
    {
      username,
      userId,
      coverImage1,
      coverImage2,
      coverImage3,
      heading1,
      heading2,
      heading3,
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

module.exports = router
