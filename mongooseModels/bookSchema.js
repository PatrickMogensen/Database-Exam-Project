const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  release_date: Date,
  genre: String,
  status: String,
  reservation: {
    begin_date: Date,
    user: {type: Schema.Types.ObjectId, ref: 'user'},
  },

});

module.exports = mongoose.model('book', bookSchema);
