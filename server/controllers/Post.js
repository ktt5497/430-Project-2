const fs = require('fs');
const path = require('path');
const models = require('../models');

const { Post } = models;

const makerPage = async (req, res) => res.render('app');

const getPosts = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Post.find(query).select('text img likes').lean().exec();

    return res.json({ posts: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving posts!' });
  }
};

const makePost = async (req, res, next) => {
  if (!req.body.text) {
    return res.status(400).json({ error: 'Write something to post!' });
  }

  //console.log(req.files);

  const postData = {
    text: req.body.text,
    likes: req.body.likes,
    owner: req.session.account._id,
  };

  // Post.create(postData).then ((err, item) => {
  //   if(err) {
  //     console.log(err);
  //   }
  //   else {
  //     item.save();
  //   }

  // });
  if (req.files) {
    postData.file = {
      name: req.file.originalname,
      data: req.file.buffer,
      size: req.file.size,
      mimetype: req.file.mimetype,
    };
  }

  try {
    const newPost = new Post(postData);
    await newPost.save();
    return res.status(201).json({ text: newPost.text, file: newPost.file, likes: newPost.likes });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured making post!' });
  }
};

module.exports = {
  makerPage,
  makePost,
  getPosts,
};
