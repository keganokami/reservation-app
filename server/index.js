const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./config')
const SampleDb = require('./fake-db')
const multipart  =  require('connect-multiparty');
const multipartMiddleware  =  multipart({ uploadDir:  './src/assets/img/uploads' });
const productRoutes = require('./routes/products')
const usreRoutes = require('./routes/users')
const path = require('path')

mongoose.connect(config.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(
  () => {
    if(process.env.NODE_ENV !== 'production') {
      const fakeDB = new SampleDb()
      // fakeDB.initDb()
    }
  }
)

const app = express()
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ extended: true, limit: '10mb' }));
// エンドポイントが呼ばれた時に request.body.usernameみたいな感じでpost用のbodyから値がとれるようになる
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/users', usreRoutes)

app.post('/api/upload', multipartMiddleware, (req, res) => {
  console.log(req.files);
  res.json({
      'message': 'File uploaded successfully'
  });
})

if(process.env.NODE_ENV === 'production') {
  const appPath = path.join( __dirname, '..', 'dist', 'reservation-app')
  app.use(express.static(appPath))
  app.get("*", function(req, res) {
    res.sendFile(path.resolve(appPath, 'index.html'))
  })
}
const PORT = process.env.PORT || '3001'

app.listen(PORT, function() {
  console.log('I am running!')
})
