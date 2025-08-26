const express=require("express");
const router=express.Router({mergeParams:true});
const User=require('../models/user.js');
const wrapAsync=require('../utils/wrapAsync.js');
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userControllers=require('../controllers/user.js');
router.route("/signup")
.get(userControllers.signupform)//sign up form
.post(userControllers.signingupuser);//signed up route
router.route("/login")
.get(userControllers.loginform)//login form
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userControllers.logginginuser);//logged in route
//logged out route
router.get('/logout', userControllers.loggingoutuser)
module.exports=router;