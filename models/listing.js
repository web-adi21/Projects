const mongoose = require("mongoose");

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
  }
})

const Listing = new mongoose.model("Listing", listingSchema)

module.exports = Listing;

