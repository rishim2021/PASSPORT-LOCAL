
const express = require('express');

const router  = express.Router();

const db = require('../../../config/db');

const userModel = db.users;

const { validate } = require('../middleware/validation');
 
const bcrypt = require('bcrypt');

const auth = require('../middleware/authGuard');

const passport = require('passport');
const user = require('../../../common/models/user');




router.get('/',async(req,res)=>{
    res.status(200).render('login',{ layout:false,name:'Akashdeep',login:1,register:0 });
})

router.post('/',async(req,res,next)=>{
    let bodyData = req.body;
    const { error } = validate(bodyData)
    if(error) return res.status(400).send({Error:error.details[0].message}) 
    
    let existsUser = await userModel.findOne({ wherer : { UserEmail : bodyData.UserEmail }})
    if(!existsUser) return res.status(404).send({ msg : 'Data Not Found !!' })
    
    passport.authenticate('local',(err,user,info)=>{
        if(err) return next(err);
        if(!user){
            console.log("not authenticate")
            return res.status(404).redirect('/login')
        }
        // console.log(user)
        req.logIn(user,(err)=>{
            if(err) return next(err);
            if(user){
                console.log("authenticate")
                return  res.status(200).redirect('/login/home')
            }
        }) 

    })(req,res,next);
    

})


router.get('/home',auth,async(req,res)=>{

    let id = req.session.passport.user;
    let userData = await userModel.findByPk(id);
    console.log(userData)

    res.status(200).render('home',{userData : userData})
})


router.get('/logout',async(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        req.logout()
        res.clearCookie('connect.sid')
        res.redirect('/login')
    })
})












module.exports = router;