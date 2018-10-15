const db = require("../dbconfig/db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const _ = require('lodash');
var async = require('async')
const nodemailer = require("nodemailer");

class supportController {

    static async send_support(req, res, next) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body, req.flies), {
                support_message: Joi.string()
                    .min(3)
                    .required(),
                user_name: Joi.string()
                    .min(3).required(),
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            var token = req.headers['access-token'];
            let userid = '';
            var supportArr = []
            jwt.verify(token, jwtsecret, function (err, decoded) {
                if (err) {
                    return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    userid = decoded.user;
                }
            });
            let userName = req.body.user_name
            let support_message = req.body.support_message
            supportArr = {
                'user_id': userid,
                'support_message': support_message
            }
            db.query("INSERT INTO hp_support SET?", supportArr, function (
                error,
                results,
                fields
            ) {
                console.log(error,
                    results,
                    fields);
                if (results) {
                    var smtpTransport = nodemailer.createTransport({
                        service: "Gmail",
                        auth: {
                            user: "demo.narolainfotech@gmail.com",
                            pass: "Password123#"
                        }
                    });
                    // -------------------------------mail sending-----------------------------
                    var tomail = "";
                    tomail = 'local.hubpitch@mailinator.com';
                    // setup e-mail data with unicode symbols
                    var mailOptions = {
                        from: "demo.narolainfotech@gmail.com", // sender address
                        to: tomail, // list of receivers
                        subject: "Support Request", // Subject line
                        html: "<strong>" + userName + " need support for following issue.</strong> <br/> " + support_message + " <br/> Thank You <br/> hubPitch."
                    };
                    // send mail with defined transport object
                    smtpTransport.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Message sent: " + info);
                        }
                    });
                    res.send({ success: "true", message: 'Support Message Sent' });
                } else {
                    console.log(error, results, fields);
                    return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
                }
            });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }

    }

}
module.exports = supportController