const mongoose=require('mongoose');
let Schema=mongoose.Schema;
let listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://plus.unsplash.com/premium_vector-1716874671235-95932d850cce?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(v)=> v===""?"https://plus.unsplash.com/premium_vector-1716874671235-95932d850cce?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v
    },
    price:Number,
    location:String,
    country:String
});
let Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;