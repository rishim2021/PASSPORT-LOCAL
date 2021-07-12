
const auth = (req,res,next)=>{
    console.log("running")
    console.log(req.isAuthenticated())
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/login')    
    }
}


module.exports = auth;