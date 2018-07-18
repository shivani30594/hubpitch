var express = require('express');
var router = express.Router();
const Controller = require('../userController');
const adminController = require('../adminController');
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
/* GENRAL PAGE CALLING METHOD */
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

// ====== USER PAGE CALLING METHOD 
router.get('/user/dashboard',Controller.dashboardController.dashboard);

// =========== ADMIN PAGE CALLING METHOD

router.get('/admin/dashboard',adminController.dashboardController.dashboard);

// ================ API METHODS ========

// GENRAL API METHOD
router.post('/signup',Controller.authController.singup);
router.post('/signin',Controller.authController.signin);
router.post('/forgot_password',Controller.authController.forgotPassword);
router.post('/reset_password',Controller.authController.resetPassword);

// ADMIN API METHOD


// USER API METHOD

module.exports = router;