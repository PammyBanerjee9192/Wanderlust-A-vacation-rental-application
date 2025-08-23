const express=require('express');
const router=express.Router();//it returns one object
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/customError.js');
const Listing=require('../models/listing.js');
const {isLoggedin,isOwner,validateListing}=require('../middleware.js');
//all listings route
router.get('/',wrapAsync(async(req,res)=>{
    let data=await Listing.find();
    res.locals.new=req.flash("newlisting");
    res.render('index.ejs',{data});
}));
//new listing form route
router.get('/new',isLoggedin,(req,res)=>{
    res.render('newlisting.ejs');
});
//create new listing route
router.post('/',isLoggedin,validateListing,wrapAsync(async(req,res)=>{
    let {title,description,image,price,location,country}=req.body;
    // req.body.listing={title,description,image,price,location,country};
    // console.log(req.body.listing);
    let newListing=new Listing({
        title,description,image,price,location,country
    });
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","new listing is created");
    res.redirect('/listings');
}));
//individual show route
router.get('/:id',wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let item=await Listing.findById(id).populate({path: "reviews",populate:{path:"author"}}).populate("owner");
     if(!item){
        req.flash("error","listing you requested for doesn't exist");
        return res.redirect('/listings');
    }
    res.render('show.ejs',{item});
}));
//edit form route
router.get('/edit/:id',isLoggedin,isOwner,wrapAsync(async(req,res)=>{
let {id}=req.params;
let item=await Listing.findById(id);
if(!item){
        req.flash("error","listing you requested for doesn't exist");
        return res.redirect('/listings');
    }
res.render('edit.ejs',{item});
}));
//edit listing route
router.put('/update/:id',isLoggedin,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let {title,description,image,price,location,country}=req.body;
    await Listing.findByIdAndUpdate(id,{title,description,image,price,location,country},{runValidators:true,new:true});
     req.flash("success","listing is updated");
    res.redirect(`/listings/${id}`);
}));
//deleting listings
router.delete('/:id',isLoggedin,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
     req.flash("success","listing is deleted");
    res.redirect('/listings');
}));
module.exports=router;