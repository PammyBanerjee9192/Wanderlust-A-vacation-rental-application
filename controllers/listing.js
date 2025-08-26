const Listing=require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index=async(req,res)=>{
    let data=await Listing.find();
    res.locals.new=req.flash("newlisting");
    res.render('index.ejs',{data});
}
module.exports.createListingForm=(req,res)=>{
    res.render('newlisting.ejs');
}
module.exports.createNewListing=async(req,res)=>{
    let response=await geocodingClient.forwardGeocode({
    query:req.body.location,
    limit: 1
    })
    .send();
    let url=req.file.path;
    let filename=req.file.filename;
    let {title,description,image,price,location,country}=req.body;
    let newListing=new Listing({
        title,description,image,price,location,country
    });
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    console.log(newListing);
    await newListing.save();
    req.flash("success","new listing is created");
    res.redirect('/listings');
}
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    let item=await Listing.findById(id).populate({path: "reviews",populate:{path:"author"}}).populate("owner");
     if(!item){
        req.flash("error","listing you requested for doesn't exist");
        return res.redirect('/listings');
    }
    res.render('show.ejs',{item});
}
module.exports.editListingForm=async(req,res)=>{
let {id}=req.params;
let item=await Listing.findById(id);
if(!item){
        req.flash("error","listing you requested for doesn't exist");
        return res.redirect('/listings');
    }
let originalUrl=item.image.url;
res.render('edit.ejs',{item,originalUrl});
}
module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    let {title,description,image,price,location,country}=req.body;
    let listing=await Listing.findById(id);
    await Listing.findByIdAndUpdate(id,{title,description,image,price,location,country},{runValidators:true,new:true});
    if(typeof req.file!== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","listing is updated");
    res.redirect(`/listings/${id}`);
}
module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
     req.flash("success","listing is deleted");
    res.redirect('/listings');
}