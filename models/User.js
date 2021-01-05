const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // salt의 길이, salt는 암호화할때 사용하는 것
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },

    email: {
        type: String,
        trim: true, // 빈칸을 없애주는 역할
        unique: 1
    },

    password: {
        type: String,
        minlength: 5
    },

    lastname: {
        type: String,
        maxlength: 50
    },

    role: {
        type: Number,
        default: 0
    },

    image: String,

    token: {
        type: String
    },

    tokenExp: {
        type: Number
    }
}, { timestamps: true })

userSchema.pre('save', function (next) {
    // 이 곳을 가리킴
    var user = this;

    // password 필드가 변환될 때만 실행됨
    if (user.isModified('password')) {
        // 비밀번호를 암호화, bcrypt의 salt를 만들며 동작
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            });
        });
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPass, cb) {
    // 비밀번호 비교, plainPass와 cryptPass
    bcrypt.compare(plainPass, this.password, function(err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;

    // jwt을 이용해 token을 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token
    user.save(function(err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }