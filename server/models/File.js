const mongoose = require('mongoose');

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
  createDate: {
    type: Date,
    default: Date.now,
  },
});

FileSchema.statics.toAPI = (doc) => ({
  id: doc._id,
  date: doc.createDate,
});

const FileModel = mongoose.model('File', FileSchema);
module.exports = FileModel;
