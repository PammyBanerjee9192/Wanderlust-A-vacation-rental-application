const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const Listing=require('../models/listing.js');
const Review=require('../models/review.js');
const {validateReview,isLoggedin,isAuthor}=require('../middleware.js');
//review route
router.post('/',isLoggedin,validateReview,wrapAsync(async(req,res)=>{
   let listing=await Listing.findById(req.params.id);
   let newreview=new Review(req.body.review);
   newreview.author=req.user._id;
   listing.reviews.push(newreview);
   await newreview.save();
   await listing.save();
    req.flash("success","new review is added");
   res.redirect(`/listings/${listing._id}`);
}));
//review delete route
router.delete('/:reviewId',isLoggedin,isAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    let listing=await Listing.findById(id);
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     req.flash("success","review is deleted");
    res.redirect(`/listings/${listing._id}`);
}));
module.exports=router;