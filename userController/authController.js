const md5 = require("md5");
const db = require("./db");
const Joi = require("joi");
const uuidV4 = require("uuid/v4");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
var btoa = require('btoa');
var atob = require('atob');
const expiresIn = 86400; // expires in 24 hours
require('dotenv').config()

class authController {



  static async singup(req, res, next) {

    try {
      const userData = Joi.validate(Object.assign(req.params, req.body), {
        charge_id: Joi.string()
          .min(3)
          .required(),
        firstName: Joi.string()
          .min(3).trim()
          .required(),
        lastName: Joi.string()
          .min(3).trim()
          .required(),
        email: Joi.string()
          .email()
          .required(),
        isemailvarified: Joi.number()
          .integer()
          .default(0),
        role: Joi.number()
          .integer()
          .default(0)
        //terms:Joi.allow(null)
      });

      if (userData.error) {
        res.send({ success: false, error: userData.error });
        return;
      }

      db.query(
        "SELECT * FROM hp_users WHERE email = ?",
        [req.body.email],
        function (error, results, fields) {
          if (results.length) {
            res.send({
              success: false,
              message: "An account with that email address already exists."
            });
          } else {
            var randompassword = Math.random()
              .toString(36)
              .slice(-8);
            var smtpTransport = nodemailer.createTransport({
              service: process.env.SERVICE,
              auth: {
                user: process.env.USERNAME,
                pass: process.env.PASSWORD
              }
            });
            //------------------------preparing user object----------------------
            var newUser = {
              user_id: uuidV4(),
              first_name: req.body.firstName,
              last_name: req.body.lastName,
              email: req.body.email,
              password: md5(randompassword)
            };

            db.query("INSERT INTO hp_users SET ?", newUser, function (
              error,
              results,
              fields
            ) {
              if (error) {
                console.log(error);
                res.send({ success: "false", message: "Something went wrong" });
              }
              if (results) {
                let token = Math.random().toString(36).slice(2)
                let newReset = {
                  user_id: newUser.user_id,
                  token_value: token
                }
                db.query("INSERT INTO hp_users_reset_token SET?", newReset, function (
                  error,
                  results,
                  fields
                ) {
                  if (error) {
                    console.log(error);
                    res.send({ success: "false", message: "Something went wrong" });
                  }
                  if (results) {
                    let tempData = {
                      user_id: newUser.user_id,
                      token_value: token,
                      randompassword: randompassword
                    }
                    db.query("INSERT INTO hp_users_tmp SET?", tempData, function (
                      error,
                      results,
                      fields
                    ) {
                      if (error) {
                        console.log(error);
                        res.send({ success: "false", message: "Something went wrong at Temp Data" });
                      }
                      if (results) {
                        res.send({ success: true, token: newUser.user_id });
                      }
                    });
                  }
                }
                )
              }
            });
          }
        }
      );
    } catch (error) {
      console.error(error);
      res.send({ success: false, error });
    }
  }

  static async signin(req, res, next) {
    try {
      const userData = Joi.validate(Object.assign(req.params, req.body), {
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string()
          .min(3)
          .required()
      });

      if (userData.error) {
        res.send({ success: false, error: userData.error });
        return;
      }

      db.query(
        'SELECT * FROM hp_users WHERE email = ? AND password = ?',
        [req.body.email, md5(req.body.password)],
        function (error, results, fields) {
          if (results.length) {
            let dashboardURL = (results[0].role == 'user') ? 'user/dashboard' : 'admin/dashboard';
            var authToken = jwt.sign({ user: results[0].user_id }, jwtsecret, {
              expiresIn: expiresIn
            });
            if (results[0].activated == "yes") {
              res.send({
                success: true,
                message: "Successfully signin.",
                url: dashboardURL,
                data: "login",
                accesstoken: authToken
              });
            }
            else {
              res.send({
                success: true,
                message: "Successfully signin.",
                url: "user/upgradeplan",
                data: 'payment',
                accesstoken: authToken
              });
            }
          } else {
            res.send({
              success: false,
              message: "email or password is incorrect"
            });
          }
        });
    } catch (error) {
      console.error(error);
      res.send({ success: false, error });
    }
  }

  static async forgotPassword(req, res, next) {

    try {
      const userData = Joi.validate(Object.assign(req.params, req.body), {
        email: Joi.string()
          .email()
          .required()
      });
      if (userData.error) {
        res.send({ success: false, error: userData.error });
        return;
      }
      var smtpTransport = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
          user: process.env.HPEMAILUSER,
          pass: process.env.PASSWORD
        }
      });
      db.query(
        'SELECT * FROM hp_users WHERE email= ?', [req.body.email],
        function (error, results, fields) {
          if (results.length > 0) {
            let token = Math.random().toString(36).slice(2)
            let newReset = {
              user_id: results[0].user_id,
              token_value: token
            }
            db.query("INSERT INTO hp_users_reset_token SET?", newReset, function (
              error,
              results,
              fields
            ) {
              if (error) {
                console.log(error);
                res.send({ success: "false", message: "Something went wrong" });
              }
              if (results) {
                // ------------------------------- mail sending ----------------------------- //
                var tomail = "";
                tomail = req.body.email;
                // setup e-mail data with unicode symbols
                var mailOptions = {
                  from: process.env.USERNAME, // sender address
                  to: tomail, // list of receivers
                  subject: "Password Reset Link", // Subject line
                  html: "Here is Reset Password Link: <a href='" + process.env.SITE_URL + 'reset-password/' + token + "'>" + process.env.SITE_URL + 'reset-password/' + token + "</a>"
                };
                //"Here is Reset Password Link: " + process.env.SITE_URL+'reset-password/' + token
                //"<a href='http://test.com'>+process.env.SITE_URL+'reset-password/' + token</a>"
                // send mail with defined transport object
                smtpTransport.sendMail(mailOptions, function (err, info) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Message sent: " + info);
                  }
                });
                res.send({ success: true, message: 'Reset Link Sent' });
              }
            }
            )
          } else {
            let message = 'User Not Found';
            res.send({ success: false, message });
          }
        });
    } catch (error) {
      res.send({ success: false, error });
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const userData = Joi.validate(Object.assign(req.params, req.body), {
        token: Joi.string(),
        password: Joi.string().trim()
          .required()
      });
      if (userData.error) {
        res.send({ success: false, error: userData.error });
      }
      else {
        let user_id = "";
        user_id = req.body.token;
        db.query("UPDATE hp_users SET password ='" + md5(req.body.password) + "' WHERE `user_id` = '" + user_id + "'",
          function (error, results, fields) {
            if (error) {
              res.send({ success: false, error: error });
            }
            console.log('UPDATE PASSWORD------>', error, results, fields)
            if (results.affectedRows > 0) {
              db.query('DELETE FROM hp_users_reset_token WHERE `user_id` = ?', user_id, function (error2, results2, fields2) {
                console.log('DELETE reset_token------>', error2, results2, fields2)
                if (results2) {
                  db.query('DELETE FROM hp_users_tmp WHERE `user_id` = ?', user_id, function (error1, results1, fields1) {
                    console.log('DELETE users_tmp------>', error1, results1, fields1)
                    if (error1) {
                      res.send({ success: false, error: error1 });
                    }
                    if (results1.affectedRows = 0) {
                      res.send({ success: true, message: 'Password Reset Successfuly' });
                    } else {
                      res.send({ success: true, message: 'Password Reset Successfuly' });
                    }
                  });
                }
              })
            } else {
              res.send({ success: false, error: 'Someting Went Wrong' });
            }
            if (error) {
              res.send({ success: false, error: error });
            }
          })
      }
    }
    catch (error) {
      res.send({ success: false, error });
    }
  }

  static async checkToken(req, res, next) {
    db.query("SELECT * FROM hp_users_reset_token WHERE token_value = ?", req.params.id, function (
      error,
      results,
      fields
    ) {
      if (error) {
        res.send({ success: "false", message: "Something went wrong" });
      }
      if (results.length > 0) {
        res.render('loginModule/reset', { title: 'Reset Password || hubPitch', reset_id: results[0].user_id, expired: 'false' });
      } else {
        res.render('loginModule/reset', { title: 'Reset Token Expired Password || hubPitch', expired: 'true' });
      }
    })
  }

  static async changePassword(req, res) {
    try {
      const userData = Joi.validate(Object.assign(req.params, req.body), {
        password: Joi.string()
          .required()
      });

      if (userData.error) {
        res.send({ success: false, error: userData.error });
        return;
      }

      var token = req.cookies.accesstoken;
      let userid = '';
      jwt.verify(token, jwtsecret, function (err, decoded) {
        if (err) {
          return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
        } else {
          userid = decoded.user;
        }
      });

      db.query("UPDATE hp_users SET password='" + md5(req.body.password) + "' WHERE user_id='" + userid + "'", function (error,
        results,
        fields) {
        console.log(error, results, fields)
        if (error) {
          console.log(error, results, fields)
          return res.send({ success: false, message: 'Something Went Wrong!' });
        }
        if (results.affectedRows > 0) {
          console.log(error, results, fields)
          return res.send({ success: true, message: 'Password Updated Successfully' });
        }
      });
    }
    catch (error) {
      res.send({ success: false, error });
    }
  }
}
module.exports = authController;
