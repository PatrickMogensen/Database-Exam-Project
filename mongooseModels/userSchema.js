const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
  status: String,
  role: String,
  fines: [{
    creation_date: Date,
    amount: Number,
    book: {type: Schema.Types.ObjectId, ref: 'book'},
  }],
  loans: [{
    start_Date: {type: Date, default: Date.now()},
    book: {type: Schema.Types.ObjectId, ref: 'book'},
  },
  ],
});

module.exports = mongoose.model('user', userSchema);
