if(process.env.NODE_ENV!="production"){
require("dotenv").config();
}
const atlasturl=process.env.ATLAS_DB_LINK;
const express=require('express');
const app=express();
const ExpressError=require('./utils/customError.js');
const listingsRouter=require('./router/listings.js');
const reviewsRouter=require('./router/reviews.js');
const userRouter=require('./router/user.js');
const User=require('./models/user.js');
let port=8080;
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const store=MongoStore.create({
    mongoUrl:atlasturl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
});
store.on("error",()=>{
    console.log("ERROR IN OUR MONGOSTORE",err);
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.listen(port,()=>{
    console.log(`our server is listening on port ${port}`);
});
const path=require('path');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
let methodOverride=require('method-override');
app.use(methodOverride('_method'));
const ejsmate=require('ejs-mate');
app.engine('ejs',ejsmate);
const mongoose=require('mongoose');
async function main(){
    await mongoose.connect(atlasturl);
}
main()
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
});
app.use((req,res,next)=>{
    res.locals.newlisting=req.flash("success");
    res.locals.nolisting=req.flash("error");
    res.locals.currentUser=req.user;
    next();
});
//listing routes
app.use('/listings',listingsRouter);
//review routes
app.use('/listings/:id/reviews',reviewsRouter);
//user routes
app.use('/',userRouter);
//sending response for those paths which doesn't exist
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});
//custom error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode,message}=err;
    //res.status(statusCode).send(message);
    res.render('error.ejs',{err});
});