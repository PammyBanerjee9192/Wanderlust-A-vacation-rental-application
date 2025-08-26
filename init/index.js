const path=require("path");
if(process.env.NODE_ENV!="production"){
    require("dotenv").config({path: path.join(__dirname, "../.env")});
}
const mapToken=process.env.MAP_TOKEN;
const dburl=process.env.ATLAS_DB_LINK;
const mongoose=require('mongoose');
async function main(){
    await mongoose.connect(dburl);
}
main()
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
});
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken:mapToken});
let Listing=require('../models/listing.js');
let initdata=require('./data.js');
let initialization=async()=>{
    for(each of initdata.data){
    let response=await geocodingClient.forwardGeocode({
    query:each.location,
    limit: 1
    })
    .send();
    each.geometry=response.body.features[0].geometry;
    }
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"68ad2f2cb023aa2072b95a12"}));
    await Listing.insertMany(initdata.data);
    console.log("data is saved");
}
initialization();