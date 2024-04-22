const mongoose = require('mongoose');
const _ = require('underscore');

const setText = (text) => _.escape(text).trim();

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  data: {
    type: Buffer,
  },
  size: {
    type: Number,
  },
  mimetype: {
    type: String,
  },
}); 

const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    set: setText,
  },
  likes: {
    type: Number,
    min: 0,
  },
  file: FileSchema,
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.statics.toAPI = (doc) => ({
  text: doc.text,
  file: doc.file,
  likes: doc.likes,
  date: doc.createDate,
});

const PostModel = mongoose.model('Post', PostSchema);
module.exports = PostModel;
