const keyPublishable = 'pk_test_nN2AAsg2jHlJxmCky4QOiuPe';
const keySecret = 'sk_test_1lBmrGdD8351UCKd8BIcHbZh';

const db = require("../dbconfig/db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const _ = require('lodash');
const async = require('async');
const stripe = require("stripe")(keySecret);
var btoa = require('btoa');
var atob = require('atob');
const nodemailer = require("nodemailer");
require('dotenv').config()

class stripePaymentController {

    static async testStripe(req, res) {
        stripe.customers.create({
            email: "had.narola@mailinator.com",
            card: "4242424242424242"
        })
            .then(customer =>
                stripe.charges.create({
                    amount,
                    description: "Sample Charge",
                    currency: "usd",
                    customer: customer.id
                }))
            .then(charge => res.send(charge))
            .catch(err => {
                console.log("Error:", err);
                res.status(500).send({ error: "Purchase Failed" });
            });
    }

    static async paymentPage(req, res) {
        // var encodedData = window.btoa('Hello, world'); // encode a string
        // var decodedData = window.atob(encodedData); // decode the string
        // console.log('encodedData========', encodedData, 'decodedData=========', decodedData);
        let bin = ('11, 18e1c619-2e99-4146-81dd-3567829d2acf')
        var b64 = btoa(bin)
        console.log('b64-------------', b64)
        var bin1 = atob(b64);
        console.log('bin1---------sssswss----', bin1[0])
        db.query("SELECT * FROM hp_membership_plan", function (
            error,
            results,
            fields
        ) {
            if (results) {
                res.render('loginModule/payment', { title: 'Payment Page || Hub Pitch', data: results, documents_viewer: 'false' });
            }
            else if (error) {
                console.log(error,
                    results,
                    fields);
                res.send({ success: false, message: 'SQL ISSUES', error: error });
            } else {
                console.log(error,
                    results,
                    fields);
                res.send({ success: false, message: 'Something Went Wrong' });
            }
        });
    }

    static async payment(req, res) {
        var smtpTransport = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.USERNAME,
                pass: process.env.PASSWORD
            }
        });
        var bin1 = atob(req.params.id);
        var array = bin1.split(',');
        let amount = array[0];
        // create a customer 
        stripe.customers.create({
            email: req.body.stripeEmail, // customer email, which user need to enter while making payment
            source: req.body.stripeToken // token for the given card 
        })
            .then(customer =>
                stripe.charges.create({ // charge the customer
                    amount,
                    description: "hubPitch Membership",
                    currency: "usd",
                    customer: customer.id
                }))
            .then(charge => {
                db.query('UPDATE hp_users SET is_payment="yes",	plan_id="' + array[2] + '",	transaction_id="' + charge.id + '" WHERE user_id="' + array[1] + '"', function (error,
                    results,
                    fields) {
                    if (error) {
                        console.log(error,
                            results,
                            fields);
                        res.send({ success: false, message: 'SQL ISSUES', error: error });
                    }
                    if (results) {
                        db.query('SELECT hp_users.email,hp_users_tmp.token_value,hp_users_tmp.randompassword FROM hp_users_tmp JOIN hp_users ON hp_users_tmp.user_id = hp_users.user_id WHERE hp_users_tmp.user_id=?', array[1], function (error1,
                            results1,
                            field1) {
                            // -------------------------------mail sending-----------------------------
                            var tomail = "";
                            tomail = results1[0].email;
                            // setup e-mail data with unicode symbols
                            var mailOptions = {
                                from: process.env.USERNAME, // sender address
                                to: tomail, // list of receivers
                                subject: "Random password for login", // Subject line
                                html: "<h1> Your hubPitch Random Password is: " + results1[0].randompassword + "</h1> <br/> Please Click this Link to Reset your Password: <a href=" + process.env.SITE_URL + 'reset-password/' + results1[0].token_value + "> Click Here</a>"
                            };
                            // send mail with defined transport object
                            smtpTransport.sendMail(mailOptions, function (err, info) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("Message sent: " + info);
                                    res.render("loginModule/welcome", { title: 'Payment Page || Hub Pitch', documents_viewer: 'false', free: 'false' })
                                }
                            });
                        });
                    }
                });
            })
            .catch(err => {
                console.log("Error:", err);
                res.status(500).send({ error: "Purchase Failed" })
            }); // render the charge view: views/charge.pug

    }

    static async signUpFree(req, res) {
        var bin1 = atob(req.params.id);
        var array = bin1.split(',');
        console.log(array);
        var smtpTransport = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.HPEMAILUSER,
                pass: process.env.PASSWORD
            }
        });
        db.query('UPDATE hp_users SET is_payment="free",plan_id="' + array[1] + '",	transaction_id="free_plan_transaction_id_" WHERE user_id="' + array[0] + '"', function (error,
            results,
            fields) {
            if (error) {
                console.log(error,
                    results,
                    fields);
                res.send({ success: false, message: 'SQL ISSUES', error: error });
            }
            if (results) {
                db.query('SELECT hp_users.email,hp_users_tmp.token_value,hp_users_tmp.randompassword FROM hp_users_tmp JOIN hp_users ON hp_users_tmp.user_id = hp_users.user_id WHERE hp_users_tmp.user_id=?', array[0], function (error1,
                    results1,
                    field1) {
                    // -------------------------------mail sending-----------------------------
                    var tomail = "";
                    tomail = results1[0].email;
                    // setup e-mail data with unicode symbols
                    var mailOptions = {
                        from: process.env.USERNAME, // sender address
                        to: tomail, // list of receivers
                        subject: "Random password for login", // Subject line
                        html: "<h1> Your hubPitch Random Password is: " + results1[0].randompassword + "</h1> <br/> Please Click this Link to Reset your Password: <a href=" + process.env.SITE_URL + 'reset-password/' + results1[0].token_value + "> Click Here</a>"
                    };
                    // send mail with defined transport object
                    smtpTransport.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            console.log('ERORR_____________ MAIL',err);
                        } else {
                            console.log('SENT')
                            res.status(200).send({ success: "true" })
                        }
                    });
                });
            }
        });
    }

}
module.exports = stripePaymentController;