const express = require('express')
const router = express.Router()
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

module.exports = router
