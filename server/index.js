const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const { User } = require('./models/User')
const { auth } = require('./middleware/auth')
const config = require('./config/key')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

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

app.get('/api/hello', (req, res) => {
    res.send('hello')
})

app.post('/api/users/register', (req, res) => {
    // 회원 가입시 필요한 정보들을 클라이언트에서 가져오면, DB에 넣어줌.
    const user = new User(req.body)
    console.log(req.body)

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {
    // DB에 로그인 정보가 있는지 검색
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "해당하는 유저가 없습니다."
            })
        }

        // DB의 정보와 비밀번호가 같은지 검사
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({
                loginSuccess: false,
                message: "비밀번호가 틀렸습니다."
            })

            // 비밀번호가 같다면 로그인 상태를 유지하기 위해 토큰을 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err)

                // 토큰을 쿠키, 로컬스토리지 등에 저장 가능, 여기선 쿠키
                res.cookie('x_auth', user.token)
                .status(200)
                .json({
                    loginSuccess: true,
                    userId: user._id
                })
            })
        })
    })
})

app.get('/api/users/auth', auth, (req, res) => {
    // 정상이라면 auth 미들웨어를 통과하고 진행되고 있는 것, Authentication이 True
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, {token: ""}, 
    (err, user) => {
        if (err) return res.json({
            success: false, err
        });

        return res.status(200).json({
            success: true
        })
    })
})

const port = 5000

app.listen(port, () => {
    console.log(`hello, node server start`)
})