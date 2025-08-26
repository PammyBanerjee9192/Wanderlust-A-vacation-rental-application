const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const Listing=require('../models/listing.js');
const Review=require('../models/review.js');
const {validateReview,isLoggedin,isAuthor}=require('../middleware.js');
const reviewControllers=require('../controllers/reviews.js');
//review route
router.post('/',isLoggedin,validateReview,wrapAsync(reviewControllers.postAReview));
//review delete route
router.delete('/:reviewId',isLoggedin,isAuthor,wrapAsync(reviewControllers.deleteAReview));
module.exports=router;