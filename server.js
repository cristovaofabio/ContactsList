require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        //console.log('Connection to database established!');
        app.emit('all right!');
    })
    .catch(e => console.log(e));

const session = require('express-session');
const mongoStore = require('connect-mongo');
const flash = require('connect-flash');

const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
    secret: 'You can write anything that you want',
    store: mongoStore.create({ mongoUrl: process.env.connectionUrl }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, //one week
        httpOnly: true,
    }
});
app.use(sessionOptions);
app.use(flash())

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());

app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on('all right!', () => {
    app.listen(3000, () => {
        console.log('The server is executing...')
        console.log('Check this link: http://localhost:3000');
    });
});