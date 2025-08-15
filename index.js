const express=require('express');
const app=express();
const Listing=require('./models/listing.js');
const ExpressError=require('./utils/customError.js');
const wrapAsync=require('./utils/wrapAsync.js');
const {listingSchema}=require('./schema.js');
let port=8080;
app.listen(port,()=>{
    console.log(`our server is listening on port ${port}`);
});
function validateListing(req,res,next){
    let {err}=listingSchema.validate(req.body);
    if(err){
        let errMsg=err.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
    // next();
}
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
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}
main()
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
});

app.get('/',(req,res)=>{
    res.send('server is all set');
});
app.get('/listings',wrapAsync(async(req,res)=>{
    let data=await Listing.find();
    res.render('index.ejs',{data});
}));
app.get('/listings/new',(req,res)=>{
    res.render('newlisting.ejs');
});
app.post('/listings',validateListing,wrapAsync(async(req,res)=>{
    let {title,description,image,price,location,country}=req.body;
    // req.body.listing={title,description,image,price,location,country};
    // console.log(req.body.listing);
    let newListing=new Listing({
        title,description,image,price,location,country
    });
    await newListing.save();
    res.redirect('/listings');
}));
app.get('/listings/:id',wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let item=await Listing.findById(id);
    res.render('show.ejs',{item});
}));
app.get('/listings/edit/:id',wrapAsync(async(req,res)=>{
let {id}=req.params;
let item=await Listing.findById(id);
res.render('edit.ejs',{item});
}));
app.put('/listings/update/:id',wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let item=await Listing.findById(id);
    let {title,description,image,price,location,country}=req.body;
    await Listing.findByIdAndUpdate(id,{title,description,image,price,location,country},{runValidators:true,new:true});
    res.redirect(`/listings/${id}`);
}));
app.delete('/listings/:id',wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));
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