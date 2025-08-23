const express=require("express");
const router=express.Router({mergeParams:true});
const User=require('../models/user.js');
const wrapAsync=require('../utils/wrapAsync.js');
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
//sign up form
router.get('/signup',(req,res)=>{
    res.render('../views/users/signup.ejs');
});
//signed up route
router.post('/signup',async(req,res)=>{
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
   
});
//login form
router.get('/login',(req,res)=>{
    res.render('../views/users/login.ejs');
});
//logged in route
router.post('/login',
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
    async(req,res)=>{
    req.flash("success","welcome back to wanderlust");
    let redirection=res.locals.redirectUrl || '/listings';
    res.redirect(redirection);
});
//logged out route
router.get('/logout',(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           next(err);
        }
        else{
            req.flash("success","you are successfully loggedout");
           return res.redirect('/listings');
        }
    });
})
module.exports=router;