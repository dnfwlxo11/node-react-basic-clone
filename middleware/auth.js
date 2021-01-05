const { User } = require('../models/User')

let auth = (req, res, next) => {
    // 인증 처리를 하는 곳
    // 클라이언트의 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;

    // 토큰을 복호화하여 유저를 조회
    User.findByToken(token, (err, user) => {
        if (err) throw err;

        // 유저가 없으면 미인증
        if (!user) return res.json({
            isAuth: false,
            err: true
        })

        // 유저가 있으면 인증
        req.token = token;
        req.user = user;

        // 다음 단계로 진행하라고 next()를 주는 것
        next();
    })
}

module.exports = { auth };