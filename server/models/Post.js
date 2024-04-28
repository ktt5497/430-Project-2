const mongoose = require('mongoose');
const _ = require('underscore');

const setText = (text) => _.escape(text).trim();

const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    set: setText,
  },
  fileID: {
    type: String,
    ref: 'File',
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  dateOfMem: {
    type: String,
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.statics.toAPI = (doc) => ({
  id: doc._id,
  text: doc.text,
  fileID: doc.fileID,
  date: doc.dateOfMem,
});

const PostModel = mongoose.model('Post', PostSchema);
module.exports = PostModel;
