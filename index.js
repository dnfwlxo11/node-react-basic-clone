const express = require('express')
const app = express()
const port = 3000

const { User } = require('./models/User')
const bodyParser = require('body-parser')
const config = require('./config/key')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) => {
  // 회원 가입시 필요한 정보들을 클라이언트에서 가져오면, DB에 넣어줌.
  const user = new User(req.body)
  console.log(req.body)

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err})
    return res.status(200).json({ 
      success: true
    })
  })
})

app.post('/login', (req, res) => {
  
})

app.listen(port, () => {
  console.log(`hello, node server start`)
})