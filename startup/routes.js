const loginService = require("../src/login/routes/login");

const express = require('express');

// const cookieAuth = require('../middleware/cookie/auth');

const path = require('path');

const db = require('../config/db');

const cookierParser = require('cookie-parser')

const registerService = require('../src/register/routes/register');

const session = require('express-session')

const passport = require('passport');

module.exports = (app) =>{
    require('../src/login/middleware/passport')(passport);
    db.sequelize.sync()
    app.use(express.json())
    app.use(express.urlencoded({extended:false}))
    app.use(express.static('assets'))
    app.use(cookierParser('1234'))
    app.use(session({
        secret:"Secret@123",
        cookie: { 
            secure: false
        },
        saveUninitialized: true,
        resave: true,
    }))
    app.use(passport.initialize());
    app.use(passport.session());
    app.set('view engine', 'ejs');
    app.use('/login',loginService)
    app.use('/register',registerService)
    app.get('/',async(req,res)=>{
        res.status(200).send('Welcome home !');
    })
  
}