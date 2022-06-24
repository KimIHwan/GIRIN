const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.static('public')); // 'public' 폴더의 정적 파일 
app.use(expressLayouts); // 레이아웃

app.use(session({
    secret: 'GirinSecretSession',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 1000 * 60 * 60 } // 로그인 유지 시간 1시간 설정
}));

app.use(flash()); // flash 메시지 사용
app.use(fileUpload()); // 파일 업로드 사용

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.errors = [];
    next();
})

require('./config/passport')(passport); // passport config

app.set('layout', './layouts/main'); //레이아웃 적용
app.set('view engine', 'ejs'); // ejs

const gameRoutes = require('./server/routes/gameRoutes.js'); // router 설정
const userRoutes = require('./server/routes/userRoutes.js'); // router 설정
app.use('/', gameRoutes);
app.use('/', userRoutes);

app.listen(port, ()=> console.log(`Listening to Port ${port}`));