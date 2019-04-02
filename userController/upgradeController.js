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

    static async deactiveUser(req, res){

        try {
            var token = req.cookies.accesstoken;
            let userid = '';
            jwt.verify(token, jwtsecret, function (err, decoded) {
                if (err) {
                    return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    userid = decoded.user;
                }
            });
            let sql = 'UPDATE hp_users SET activated="no"  WHERE user_id="' + userid + '"';
            db.query(sql, function (error1,
                results1,
                fields) {
                if (error1) {
                    console.log(error1,
                        results1,
                        fields);
                    console.log(sql)
                    res.send({ success: false, message: "SQL ISSUES IN USERS" });
                }
                if (results1) {
                    var smtpTransport = nodemailer.createTransport({
                        service: process.env.SERVICE,
                        auth: {
                            user: process.env.HPEMAILUSER,
                            pass: process.env.PASSWORD
                        }
                    });                   
                  console.log("user",auth);
                    db.query('SELECT * from hp_users  WHERE hp_users.user_id = ?', userid, function (error, results, fields) {
                        if (results.length) {
                            console.log(results[0].first_name);
                            // -------------------------------mail sending-----------------------------
                            var tomail = "rip@narola.email";
                            var share = '';
                            var newEmail = '';
                            var emailLog = {};
                            var subject = "Cancellation Confirmation";
                            // setup e-mail data with unicode symbols
                            // Email Body Builder 
                            var newEmail = `<div>We have received your request for a cancellation of your subscription to hubPitch. Your request has been processed. No further charges will be posted. You can keep this email as a receipt of your cancellation.&nbsp;<br /><br />We are sorry to see you go and hope that you will consider hubPitch services in the future.&nbsp;</div>
                                <div>&nbsp;</div>
                                <div>If you change your mind, you can login to your original account and re-activate your subscription here: <a href="http://www.bundle-hubpitch.com" target="_blank" rel="noopener">http://www.bundle-hubpitch.com</a></div>
                                <div>&nbsp;</div>
                                <div>-The hubPitch Team</div>
                                <div><a href="http://www.hubpitch.com" target="_blank" rel="noopener">www.hubpitch.com</a>&nbsp;</div>`
                            var mailOptions = {
                                from: process.env.HPEMAILUSER, // sender address
                                to: tomail, // list of receivers
                                subject: subject, // Subject line
                                html: newEmail
                            };
                            smtpTransport.sendMail(mailOptions, function (err, info) {
                                if (err) {
                                    console.log(err);
                                } else {
                                   res.send({ success: true, message: 'Mail send succesfully' });
                                    
                                }
                            })
                            //res.send({ success: "true", data: results });
                        } else {
                            console.log(error, results, fields);
                        }
                    });

                    res.send({ success: true, message: "Plan Deactivated Successfully" });
                }
               
            });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

  

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
                res.render('userViews/upgradeModule/upgrade', { title: 'Payment Page || hubPitch', data: results, documents_viewer: 'false' });
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

    static async upgradeplan(req, res, next) {

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
        db.query('SELECT(SELECT plan_id FROM hp_users WHERE user_id="' + userid + '") AS subscription_id, hp_membership_plan.* FROM hp_membership_plan', function (
            error,
            results,
            fields
        ) {
            if (results) {
                console.log("My data");
                console.log(results);
                res.render('userViews/upgradeModule/upgradeplan', { title: 'Payment Page || hubPitch', data: results, documents_viewer: 'false' });
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
    static async paymentPlan(req, res) {
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
                               
                                var pitch_limit = results1[0].pitch_limit;

                                var date = new Date();
                                var timestamp = date.getTime();
                                var expire = timestamp + 30 * 24 * 60 * 60;

                                if (pitch_limit == "") {
                                    pitch_limit = -1;
                                   // console.log("null");
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
                                        let sql = 'UPDATE hp_users SET activated="yes"  WHERE user_id="' + userid + '"';
                                        db.query(sql, function (error3,
                                            results3,
                                            fields) {
                                            if (error3) {
                                                console.log(error3,
                                                    results3,
                                                    fields);
                                                console.log(sql)
                                                res.send({ success: false, message: "SQL ISSUES IN USERS" });
                                            }
                                            if (results3) {
                                                // let sql1 = 'REPLACE into hp_users_info SET user_id="' + userid + '", company_name = "' + req.body.companyName + '", notification_1 ="' + req.body.allow_notification + '", notification_2 = "' + req.body.allow_messaging + '", notification_3 = "' + req.body.allow_share + '"';
                                                // db.query(sql1, function (error1,
                                                //     results1,
                                                //     fields1) {
                                                //     if (error1) {
                                                //         console.log(error1,
                                                //             results1,
                                                //             fields1);
                                                //         console.log(sql1)
                                                //         res.send({ success: false, message: "SQL ISSUES IN USERS" });
                                                //     }
                                                //     if (results1) {
                                                //         res.send({ success: true, message: "Profile Updated Successfully" });
                                                //     }
                                                // });
                                                // res.send({ success: true, message: "Plan Deactivated Successfully" });
                                                res.render('userViews/dashboardModule/index', { title: 'User Dashboard || hubPitch', documents_viewer: 'false' });
                                            }

                                        });
                                        
                                    }
                                });
                                // console.log('RIP', results1);
                            }
                            else
                            {
                                console.log("rip wrong");
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
                            //         res.render("loginModule/welcome", { title: 'Payment Page || hubPitch', documents_viewer: 'false', free: 'false' })
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
        var customer_id="";
        stripe.customers.create({
            email: req.body.stripeEmail, // customer email, which user need to enter while making payment
            source: req.body.stripeToken // token for the given card 
        }).then(customer =>               
                stripe.charges.create({ // charge the customer
                    amount,
                    description: "hubPitch Membership",
                    currency: "usd",
                    customer: customer.id
                }))

            .then(charge => {
                console.log("Charge",charge);
                console.log("Charge", charge.customer);

                                        // stripe.invoices.create({
                                        //     customer: charge.customer
                                        // }, function (err, invoice) {
                                        //     console.log("invoice",invoice);
                                        //     // asynchronously called
                                        // });
                // stripe.invoices.sendInvoice("in_1E7gPGI4oG97uKrjhrcLrlre", function (err, invoice) {
                //     // asynchronously called
                // });
                stripe.plans.list(
                    { limit: 3 },
                    function (err, plan) {
                        console.log("products",plan);
                    }
                );

                stripe.subscriptions.create({
                    customer: charge.customer,
                    items: [{ plan:'plan_EdxfwzAt0F7sfl'}],
                    billing: 'send_invoice',
                    days_until_due: 30,
                },function (err, subscription) {
                        console.log(err);
                        console.log(subscription);
                        if (err) {
                           // res.send({ success: false, message: err });
                        }
                        else{
                           // res.send({ success: true, message: 'Success'});
                        }
                        // asynchronously called
                    });
                    
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
                        db.query('SELECT (SELECT pitch_limits FROM hp_membership_plan WHERE plan_id="' + array[2] + '") as pitch_limit,hp_users.email  FROM  hp_users WHERE hp_users.user_id="' + userid + '"', function (error1,
                            results1,
                            field1) {
                            if (results1) {

                                var pitch_limit = results1[0].pitch_limit;

                                var date = new Date();
                                var timestamp = date.getTime();
                                var expire = timestamp + 30 * 24 * 60 * 60;

                                if (pitch_limit == "") {
                                    pitch_limit = -1;
                                    // console.log("null");
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
                                        // var stripe = require("stripe")("sk_test_1lBmrGdD8351UCKd8BIcHbZh");

                                        res.render('userViews/dashboardModule/index', { title: 'User Dashboard || hubPitch', documents_viewer: 'false' });
                                    }
                                });
                                // console.log('RIP', results1);
                            }
                            else {
                                console.log("rip wrong");
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
                            //         res.render("loginModule/welcome", { title: 'Payment Page || hubPitch', documents_viewer: 'false', free: 'false' })
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