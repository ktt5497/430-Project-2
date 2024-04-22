//const multer = require('multer');
const controllers = require('./controllers');
const mid = require('./middleware');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });

// const upload = multer({ storage: storage });

const router = (app) => {
  app.post('/verification', mid.requiresSecure, controllers.Account.verify);
  app.get('/setNewPassword', mid.requiresSecure, controllers.Account.getNewPass);
  app.post('/setNewPassword', mid.requiresSecure, controllers.Account.setNewPass);

  app.get('/createPost', mid.requiresLogin, controllers.Post.makerPage);
  app.post('/createPost', mid.requiresLogin, controllers.Post.makePost);
  // app.post('/createPost', upload.single('uploadFile'), controllers.Post.makePost);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
