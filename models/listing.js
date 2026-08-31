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
        set: (v) => v === "" ? 'https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/3c/07/61/f9/c8/v1_E11/E1182L7F.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=22e9302d843a5defacdddbd1c4044728b23e6c14b1e24495c407d74bdb005c19' : v,
        default: 'https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/3c/07/61/f9/c8/v1_E11/E1182L7F.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=22e9302d843a5defacdddbd1c4044728b23e6c14b1e24495c407d74bdb005c19'
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
  geometry:{
    type:{
      type: String,
      enum:['Point'],
      required: true,
    },
    coordinates: {
      type:[Number],
      required:true
    }
  }
})

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing){
  await Review.deleteMany( {_id: {$in: listing.reviews}});
  }
});


const Listing = mongoose.model("Listing", listingSchema)

module.exports = Listing;

