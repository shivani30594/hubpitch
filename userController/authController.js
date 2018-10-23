const md5 = require("md5");
const db = require("./db");
const Joi = require("joi");
const uuidV4 = require("uuid/v4");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const expiresIn = 86400; // expires in 24 hours
class authController {

  static async singup(req, res, next) {
    try {
      const userData = Joi.validate(Object.assign(req.params, req.body), {
        firstName: Joi.string()
          .min(3)
          .required(),
        lastName: Joi.string()
          .min(3)
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
              service: "Gmail",
              auth: {
                user: "demo.narolainfotech@gmail.com",
                pass: "Password123#"
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
                    // -------------------------------mail sending-----------------------------
                    // var tomail = "";
                    // tomail = req.body.email;
                    // // setup e-mail data with unicode symbols
                    // var mailOptions = {
                    //   from: "demo.narolainfotech@gmail.com", // sender address
                    //   to: tomail, // list of receivers
                    //   subject: "Random password for login", // Subject line
                    //   html: "<h1> Your rendom password is:- " + randompassword + "</h1> <br/> Reset Link: " + 'http://localhost:3000/reset-password/' + token
                    // };
                    // // send mail with defined transport object
                    // smtpTransport.sendMail(mailOptions, function (err, info) {
                    //   if (err) {
                    //     console.log(err);
                    //   } else {
                    //     console.log("Message sent: " + info);
                    //   }
                    // });
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
            res.send({
              success: true,
              message: "Successfully signin.",
              url: dashboardURL,
              accesstoken: authToken
            });
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
        service: "Gmail",
        auth: {
          user: "demo.narolainfotech@gmail.com",
          pass: "Password123#"
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
                // -------------------------------mail sending-----------------------------
                var tomail = "";
                tomail = req.body.email;
                // setup e-mail data with unicode symbols
                var mailOptions = {
                  from: "demo.narolainfotech@gmail.com", // sender address
                  to: tomail, // list of receivers
                  subject: "Password Reset Link", // Subject line
                  html: "Here is Reset Password Link: " + 'http:/localhost:3000/reset-password/' + token
                };
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
        token: Joi.string()
          .required(),
        password: Joi.string()
          .required()
      });
      if (userData.error) {
        res.send({ success: false, error: userData.error });
        return;
      }
      let user_id = "";
      user_id = req.body.token;
      let sqlUpdatePassword = '';
      sqlUpdatePassword = "UPDATE hp_users SET password ='" + md5(req.body.password) + "' WHERE `user_id` = '" + user_id + "'"
      db.query(sqlUpdatePassword,
        function (error, results, fields) {
          if (results.affectedRows > 0) {
            db.query('DELETE FROM hp_users_reset_token WHERE `user_id` = ?', user_id, function (error, results, fields) {
              if (results.affectedRows > 0) {
                db.query('DELETE FROM hp_users_tmp WHERE `user_id` = ?', user_id, function (error1, results1, fields1) {
                  if (results1.affectedRows > 0) {
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
        res.render('loginModule/reset', { title: 'Reset Password || Hub Pitch', reset_id: results[0].user_id, expired: 'false' });
      } else {
        res.render('loginModule/reset', { title: 'Reset Token Expired Password || Hub Pitch', expired: 'true' });
      }
    })
  }
}
module.exports = authController;
