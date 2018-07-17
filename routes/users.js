var express = require('express');
var router = express.Router();
const Controller = require('../userController');
function wrap(func) {
  return async (req, res, next) => {
      try {
          await func(req, res, next);
      } catch (error) {
          console.error(error);
          res.send(error);
      }
  };
}
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('loginModule/index', { title: 'SignIn || Hub Pitch' });
});
router.get('/signup', function(req, res, next) {
    res.render('loginModule/signup', { title: 'SignUp || Hub Pitch' });
});
router.get('/payment', function(req, res, next) {
    res.render('loginModule/', { title: 'Payment Page || Hub Pitch' });
});
router.get('/forgot-password',function(req,res,next){
    res.render('loginModule/forget', { title: 'Forgot Password || Hub Pitch' });
});
router.get('/reset-password/:id',Controller.authController.checkToken);

router.post('/signup',Controller.authController.singup);
router.post('/signin',Controller.authController.signin);
router.post('/forgot_password',Controller.authController.forgotPassword);
router.post('/reset_password',Controller.authController.resetPassword);

module.exports = router;
