const Listing=require('../models/listing.js');
const Review=require('../models/review.js');
const User=require('../models/user.js');
module.exports.signupform=(req,res)=>{
    res.render('../views/users/signup.ejs');
}
module.exports.signingupuser=async(req,res)=>{
    try{
         let {username,email,password}=req.body;
         const newUser=new User({
            username,
            email
            });
         let result=await User.register(newUser,password);
         req.logIn(result,(err)=>{
            if(err){
                next(err);
            }
            else{
                req.flash('success','welcome to wanderlust');
                return res.redirect('/listings');
            }
         });
    }
    catch(e){
        req.flash("error",e.message);
        return res.redirect('/signup');
    }
   
}
module.exports.loginform=(req,res)=>{
    res.render('../views/users/login.ejs');
}
module.exports.logginginuser=async(req,res)=>{
    req.flash("success","welcome back to wanderlust");
    let redirection=res.locals.redirectUrl || '/listings';
    res.redirect(redirection);
}
module.exports.loggingoutuser=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           next(err);
        }
        else{
            req.flash("success","you are successfully loggedout");
           return res.redirect('/listings');
        }
    });
}