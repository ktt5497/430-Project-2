// const multer = require('multer');
const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // Account things (for setting a new password)
  app.post('/verification', mid.requiresSecure, controllers.Account.verify);
  app.get('/setNewPassword', mid.requiresSecure, controllers.Account.getNewPass);
  app.post('/setNewPassword', mid.requiresSecure, controllers.Account.setNewPass);

  // Post things
  app.get('/createPost', mid.requiresLogin, controllers.Post.makerPage);
  app.get('/getPosts', mid.requiresLogin, controllers.Post.getPosts);
  app.get('/retrieve', mid.requiresLogin, controllers.Post.retrieveFile);
  app.post('/createPost', mid.requiresLogin, controllers.Post.makePost);
  app.post('/delete', mid.requiresLogin, controllers.Post.deletePost);
  app.post('/edit', mid.requiresLogin, controllers.Post.editPost);

  // Premium Monetization
  app.get('/premium', mid.requiresLogin, controllers.Money.premiumPage);
  app.post('/premium', mid.requiresLogin, controllers.Money.premiumBought);

  // Account Thing(To log in and sign up)
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  // Not found page
  app.get('*', mid.requiresSecure, controllers.Error.errorPage);
};

module.exports = router;
