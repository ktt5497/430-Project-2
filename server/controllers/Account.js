const models = require('../models');

const { Account } = models;

const getNewPass = (req, res) => res.render('newPass');

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Change password - Let user enter a username and their date of birth.
// Their date of birth will verify if it is them;
// if username exist let them go to the change password page. If not return an error.
const verify = (req, res) => {
  const username = `${req.body.username}`;
  const dOb = `${req.body.dOb}`;

  if (!username || !dOb) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.verification(username, dOb, (err, account) => {
    if (err || !account) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({ redirect: '/setNewPassword' });
  });
};

// Setting the new password
const setNewPass = async (req, res) => {
  const username = `${req.body.username}`;
  const newpass = `${req.body.newPass}`;
  const newpass2 = `${req.body.newPass2}`;

  if (!newpass || !newpass2) {
    return res.status(400).json({ error: 'All requirements required!' });
  }

  if (newpass !== newpass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(newpass);
    // finds usernmae and updates password
    const updatePass = await Account.findOneAndUpdate(
      { username },
      { $set: { password: hash } },
      { new: true },
    ).lean().exec();

    if (!updatePass) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({ redirect: '/login' });
  } catch (err) {
    return res.status(400).json({ error: 'something went wrong' });
  }
};

// User login
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/createPost' });
  });
};

// User signup
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  const dOb = `${req.body.dOb}`;

  if (!username || !pass || !pass2 || !dOb) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  // Hashing the password
  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash, dOb });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/createPost' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username alreay in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  verify,
  getNewPass,
  setNewPass,
};
