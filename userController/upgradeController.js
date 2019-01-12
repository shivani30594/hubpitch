const keyPublishable = 'pk_test_nN2AAsg2jHlJxmCky4QOiuPe';
const keySecret = 'sk_test_1lBmrGdD8351UCKd8BIcHbZh';
const md5 = require("md5");
const db = require("./db");
const Joi = require("joi");
const uuidV4 = require("uuid/v4");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const auth = require('../commonController/auth')
//Stripe require header
const _ = require('lodash');
const async = require('async');
const stripe = require("stripe")(keySecret);
var btoa = require('btoa');
var atob = require('atob');
var moment = require('moment');

require('dotenv').config()
class upgradeController {

    // Upgrade
    static async upgrade(req, res, next) {
     
        let bin = ('11, 18e1c619-2e99-4146-81dd-3567829d2acf')
        var b64 = btoa(bin)
        console.log('b64-------------', b64)
        var bin1 = atob(b64);
        console.log('bin1---------sssswss----', bin1[0])
        var token = req.cookies.accesstoken;
        let userid = '';
        jwt.verify(token, jwtsecret, function (err, decoded) {
            if (err) {
                return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
            } else {
                userid = decoded.user;
            }
        });
        db.query('SELECT(SELECT plan_id FROM hp_users WHERE user_id="'+ userid +'") AS subscription_id, hp_membership_plan.* FROM hp_membership_plan', function (
            error,
            results,
            fields
        ) {
            if (results) {
                console.log("My data");
                console.log(results);
                res.render('userViews/upgradeModule/upgrade', { title: 'Payment Page || Hub Pitch', data: results, documents_viewer: 'false' });
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
        // var smtpTransport = nodemailer.createTransport({
        //     service: process.env.SERVICE,
        //     auth: {
        //         user: process.env.HPEMAILUSER,
        //         pass: process.env.PASSWORD
        //     }
        // });
        var bin1 = atob(req.params.id);

        var array = bin1.split(',');
        let amount = array[0];
        // console.log(bin1);
        // console.log(array[1]);
        // console.log(req.cookies.accesstoken);
        var token = req.cookies.accesstoken;
        let userid = '';
        jwt.verify(token, jwtsecret, function (err, decoded) {
            if (err) {
                return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
            } else {
                userid = decoded.user;
            }
        });
       // console.log(array[2],userid);
        //create a customer 
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
                db.query('UPDATE hp_users SET is_payment="yes",	plan_id="' + array[2] + '",	transaction_id="' + charge.id + '" WHERE user_id="' + userid + '"', function (error,
                    results,
                    fields) {
                    if (error) {
                        console.log(error,
                            results,
                            fields);
                        res.send({ success: false, message: 'SQL ISSUES', error: error });
                    }
                    // SELECT(SELECT pitch_limits FROM hp_membership_plan WHERE plan_id =?) as pitch_limit, hp_users.email, hp_users_tmp.token_value, hp_users_tmp.randompassword FROM hp_users_tmp JOIN hp_users ON hp_users_tmp.user_id = hp_users.user_id WHERE hp_users_tmp.user_id =? ', [array[2], userid]
                    //  
                    if (results) {
                        // console.log(results);
                        // console.log("ritts"+array[2]+userid);
                        db.query('SELECT (SELECT pitch_limits FROM hp_membership_plan WHERE plan_id="' + array[2] + '") as pitch_limit,hp_users.email  FROM  hp_users WHERE hp_users.user_id="' + userid + '"',function (error1,
                            results1,
                            field1) {
                            if (results1) {
                                //console.log(results1[0].pitch_limit);
                                //console.log("rip");
                                var pitch_limit = results1[0].pitch_limit;

                                var date = new Date();
                                var timestamp = date.getTime();
                                var expire = timestamp + 30 * 24 * 60 * 60;

                                if (pitch_limit == null) {
                                    pitch_limit = -1;
                                }
                                let hp_users_pitch_limit_data = {
                                    user_id: userid,
                                    remaining_pitch: pitch_limit,
                                    end_date: moment(expire).format("YYYY-MM-DD HH:mm:ss")
                                }
                                // db.query("INSERT INTO hp_users_pitch_limit SET?", hp_users_pitch_limit_data, function (
                                //     error2,
                                //     results2,
                                //     fields2
                                // )
                                db.query('UPDATE hp_users_pitch_limit SET remaining_pitch="' + pitch_limit + '",end_date="' + moment(expire).format("YYYY-MM-DD HH:mm:ss") + '" WHERE user_id="' + userid + '"', function (
                                    error2,
                                    results2,
                                    fields2
                                ) {
                                    if (error2) {
                                        console.log(error2);
                                        res.send({ success: "false", message: "Something went wrong" });
                                    }
                                    if (results2) {
                                        res.render('userViews/dashboardModule/index', { title: 'User Dashboard || Hub Pitch', documents_viewer: 'false' });
                                    }
                                });
                                // console.log('RIP', results1);
                            }
                            else
                            {
                                //console.log("rip wrong");
                            }
                            // -------------------------------mail sending-----------------------------
                            // var tomail = "";
                            // tomail = results1[0].email;
                            // // setup e-mail data with unicode symbols
                            // var mailOptions = {
                            //     from: process.env.USERNAME, // sender address
                            //     to: tomail, // list of receivers
                            //     subject: "Random password for login", // Subject line
                            //     html: "<h1> Your hubPitch Random Password is: " + results1[0].randompassword + "</h1> <br/> Please Click this Link to Reset your Password: <a href=" + process.env.SITE_URL + 'reset-password/' + results1[0].token_value + "> Click Here</a>"
                            // };
                            // // send mail with defined transport object
                            // smtpTransport.sendMail(mailOptions, function (err, info) {
                            //     if (err) {
                            //         console.log(err);
                            //     } else {
                            //         console.log("Message sent: " + info);
                            //         res.render("loginModule/welcome", { title: 'Payment Page || Hub Pitch', documents_viewer: 'false', free: 'false' })
                            //     }
                            // });
                        });
                    }
                });
            })
            .catch(err => {
                console.log("Error:", err);
                res.status(500).send({ error: "Purchase Failed" })
            }); // render the charge view: views/charge.pug

    }

}
module.exports = upgradeController;