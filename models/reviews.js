const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let reviewsSchema = new Schema({
  comment:{
    type:String,
  },
  rating:{
    type: Number,
    min: 1,
    max:5
  },
  createdAt:{
    type:Date,
    default: Date.now()
  },

});

const Review = mongoose.model("Review", reviewsSchema);

module.exports = Review;