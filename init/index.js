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
let Listing=require('../models/listing.js');
let initdata=require('./data.js');
let initialization=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"68a9513c21b072c3f70313e4"}));
    await Listing.insertMany(initdata.data);
    console.log("data is saved");
}
initialization();