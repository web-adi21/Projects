const mongoose = require("mongoose");
const Review = require("./reviews.js");

let Schema = mongoose.Schema;

let listingSchema = new Schema({
  title : {
    type: String,
    required : true
  },
  description: {
    type: String
  },
  image: {
    filename: String,
    url: {
        type: String,
        set: (v) => v === "" ? 'https://elements-resized.envatousercontent.com/envato-dam-assets-production...' : v,
        default: 'https://elements-resized.envatousercontent.com/envato-dam-assets-production...'
    }
  },
  price:{
    type: Number,
    required : true
  },
  location :{
    type: String,
    required : true
  },
  country: {
    type:String,
    required:true
  },
  reviews:[
    {
    type: Schema.Types.ObjectId,
    ref:"Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
})

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing){
  await Review.deleteMany( {_id: {$in: listing.reviews}});
  }
});


const Listing = mongoose.model("Listing", listingSchema)

module.exports = Listing;

