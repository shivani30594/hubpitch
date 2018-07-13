const md5 = require("md5");
const uuidV4 = require("uuid/v4");
const db = require("./db");
const Joi = require("joi");
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
        "SELECT * FROM users WHERE email = ?",
        [req.body.email],
        function(error, results, fields) {
          //console.log(error, results, fields);
          if (results.length) {
            res.send({
              success: false,
              message: "An account with that email address already exists."
            });
          } else {
            var randompassword = Math.random()
              .toString(36)
              .slice(-8);

            console.log(randompassword);
            var smtpTransport = nodemailer.createTransport({
              service: "Gmail",
              auth: {
                user: "demo.narolainfotech@gmail.com",
                pass: "Password123#"
              }
            });

            // -------------------------------mail sending-----------------------------
            var tomail = "";
            tomail = req.body.email;
            // setup e-mail data with unicode symbols
            var mailOptions = {
              from: "getprep.io@gmail.com", // sender address
              to: tomail, // list of receivers
              subject: "Random password for login", // Subject line
              html: "<h1> Your rendom password is" + randompassword + "</h1>"
            };
            // send mail with defined transport object
            smtpTransport.sendMail(mailOptions, function(err, info) {
              if (err) {
                console.log(err);
              } else {
                console.log("Message sent: " + info);
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

            db.query("INSERT INTO users SET ?", newUser, function(
              error,
              results,
              fields
            ) {
              if (error) {
                console.log(error);
                res.send({ success: "false", message: "Something went wrong" });
              }
              if (results) {
                //console.log(results);
                res.send({ success: true });
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
        password:Joi.string()
          .min(3)
          .required()      
      });

      if (userData.error) {
        res.send({ success: false, error: userData.error });
        return;
      }
      db.query(
        'SELECT * FROM users WHERE email = ? AND password = ? AND role = 0',
        [req.body.email,md5(req.body.password)],
        //'SELECT * FROM users WHERE email = '+ req.body.email +' AND password ='+ md5(req.body.password),
        function(error, results, fields) {
          console.log(error, results, fields);
          if (results.length) {
            console.log(results.user_id);
            var authToken = jwt.sign({ user: results.user_id }, jwtsecret, {
              expiresIn: expiresIn
            });

            res.send({
              success: true,
              message:"Successfully signin.",
              accesstoken :authToken             
            });
          } else {
            res.send({
              success: false,
              message: "email or password is incorrect"
            });
          }
          });

    }catch (error) {
      console.error(error);
      res.send({ success: false, error });
    }
  }



}
module.exports = authController;
