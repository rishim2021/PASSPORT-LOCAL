const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

const db = require('../../../config/db');

const userModel = db.users;

const bcrypt = require('bcrypt');


module.exports = function(passport){
  passport.use(new LocalStrategy({
    usernameField: 'UserEmail',
    passwordField: 'UserPassword',
    // passReqToCallback: true
  },
  
   async function(UserMail, UserPassword, done) {
     console.log(`Username is ${UserMail} Password is ${UserPassword}`)
        
     let user = await userModel.findOne({where :{ UserEmail: UserMail },paranoid: false})

     if(!user) return done(null, false, { message: 'Incorrect email.' })

     let isMatch = await bcrypt.compare(UserPassword,user.UserPassword);
    //  console.log(isMatch)
     if(!isMatch) return done(null,false,{ message:'Incorrect password.' })

     return done(null,user)

    }
  ));

  passport.serializeUser((user,done)=>{
      done(null,user.UserId)
  })
  passport.deserializeUser(async(id,done)=>{
    let userData = await userModel.findByPk(id);
    if(!userData) return done(null,false,{ message : 'Incorrect user.' })
    return done(null,userData)
  })
}