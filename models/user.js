const { required } = require("joi");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


let Schema = mongoose.Schema;

let userSchema = new Schema({
  email: {
    type: String,
    required: true
  }
});