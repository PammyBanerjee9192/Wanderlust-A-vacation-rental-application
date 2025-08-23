const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/customError.js');
const Listing=require('../models/listing.js');
const Review=require('../models/review.js');
const {reviewSchema}=require('../schema.js');
function validateReview(req,res,next){
    let {err}=reviewSchema.validate(req.body);
    if(err){
        let errMsg=err.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
    // next();
}
//review route
router.post('/',validateReview,wrapAsync(async(req,res)=>{
   let listing=await Listing.findById(req.params.id);
   let newreview=new Review(req.body.review);
   listing.reviews.push(newreview);
   await newreview.save();
   await listing.save();
    req.flash("success","new review is added");
   res.redirect(`/listings/${listing._id}`);
}));
//review delete route
router.delete('/:reviewId',wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    let listing=await Listing.findById(id);
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     req.flash("success","review is deleted");
    res.redirect(`/listings/${listing._id}`);
}));
module.exports=router;