'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Poll Schema
 */
var PollSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill poll name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  options: [{
    text: String,
    value: Number
  }],
  votes: [{
    type: Schema.ObjectId,
    ref: 'Vote'
  }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Poll', PollSchema);
