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
    res.render('index', { title: 'Express' });
});

router.post('/signup',Controller.authController.singup);
router.post('/signin',Controller.authController.signin);

module.exports = router;
