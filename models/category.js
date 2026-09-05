const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
  },
  icon: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Category', categorySchema);