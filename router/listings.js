const express=require('express');
const router=express.Router();//it returns one object
const wrapAsync=require('../utils/wrapAsync.js');
const {isLoggedin,isOwner,validateListing}=require('../middleware.js');
const listingControllers=require('../controllers/listing.js');
const multer=require("multer");
const {storage}=require('../cloudConfig.js');
const upload=multer({storage});
router.route('/')
.get(wrapAsync(listingControllers.index))//all listings route
.post(upload.single("image"),isLoggedin,validateListing,wrapAsync(listingControllers.createNewListing),);//create new listing route
//new listing form route
router.get('/new',isLoggedin,listingControllers.createListingForm);
router.route("/:id")
.get(wrapAsync(listingControllers.showListing))//individual show route
.delete(isLoggedin,isOwner,wrapAsync(listingControllers.deleteListing));//deleting listings
//edit form route
router.get('/edit/:id',isLoggedin,isOwner,wrapAsync(listingControllers.editListingForm));
//edit listing route
router.put('/update/:id',upload.single("image"),isLoggedin,isOwner,validateListing,wrapAsync(listingControllers.editListing));
module.exports=router;