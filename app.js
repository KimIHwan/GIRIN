const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const cookieSession = require('cookie-session');

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(cookieParser('GirinSecure'));
app.use(session({
    secret: 'GirinSecretSession',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 1000 * 60 * 60 }
}));


app.use(flash());
app.use(fileUpload());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.errors = [];
    next();
})

// passport config
require('./config/passport')(passport);

app.set('layout', './layouts/main'); //레이아웃 적용
app.set('view engine', 'ejs'); // ejs

const gameRoutes = require('./server/routes/gameRoutes.js');
const userRoutes = require('./server/routes/userRoutes.js');
app.use('/', gameRoutes);
app.use('/', userRoutes);

app.listen(port, ()=> console.log(`Listening to Port ${port}`));