// const fs = require('fs');
// const path = require('path');
const models = require('../models');

const { Post, File } = models;

const makerPage = async (req, res) => res.render('app');

const getPosts = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Post.find(query).select('text fileID dateOfMem').lean().exec();

    return res.json({ posts: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving posts!' });
  }
};

// Getting the photo file from the mongodb
const retrieveFile = async (req, res) => {
  let doc;
  try {
    doc = await File.findOne({ _id: req.query._id }).exec();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Something went wrong retrieving dile!' });
  }

  if (!doc) {
    return res.status(404).json({ error: 'File not found!' });
  }

  // letting the browser know some info about the file
  res.set({
    'Content-Type': doc.mimetype,
    'Content-Length': doc.size,
    'Content-Disposition': `filename="${doc.name}"`,
  });

  return res.send(doc.data);
};

// setting schema here
const makePost = async (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ error: 'Write something to post! And include date!' });
  }

  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: 'No Files were uploaded' });
  }

  const { file } = req.files;

  try {
    const newFile = new File(file);

    const postData = {
      text: req.body.text,
      fileID: newFile._id,
      dateOfMem: newFile.createDate.toISOString().split('T')[0],
      owner: req.session.account._id,
    };

    const newPost = new Post(postData);

    await newPost.save();
    await newFile.save();
    return res.status(201).json({
      text: newPost.text,
      fileID: newFile._id,
      dateOfMem: newPost.createDate,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured making post!' });
  }
};

const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete({ _id: req.params.id });
    console.log('Post deleted:', req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'An error occurred deleting the post' });
  }
};

module.exports = {
  makerPage,
  makePost,
  getPosts,
  retrieveFile,
  deletePost,
};
