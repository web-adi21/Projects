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
    type: String,
    set : (v) => v ==="" ? 'https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/fc/c4/a7/a7/85/v1_E10/E102B30R.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=98d2a24dce8d0852d9da5dacfdb22333d9bfd92f267755be948ab8bffdbc3153' : v ,
    default:'https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/fc/c4/a7/a7/85/v1_E10/E102B30R.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=98d2a24dce8d0852d9da5dacfdb22333d9bfd92f267755be948ab8bffdbc3153'
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