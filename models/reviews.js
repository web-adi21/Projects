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
  writer:{
    type: Schema.Types.ObjectId,
    ref:"User",
  },
});

const Review = mongoose.model("Review", reviewsSchema);

module.exports = Review;