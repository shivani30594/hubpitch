//const keyPublishable = 'pk_live_Ts12q0y0KGDazyEyx88ZaExj';
//const keySecret = 'sk_live_UcujAygz3kEGLjrCmZ5n4D8y';
const keyPublishable = 'pk_test_nN2AAsg2jHlJxmCky4QOiuPe';
const keySecret = 'sk_test_1lBmrGdD8351UCKd8BIcHbZh';

var http = require('http');
const db = require("../dbconfig/db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const _ = require('lodash');
const async = require('async');
const stripe = require("stripe")(keySecret);
var btoa = require('btoa');
var atob = require('atob');
var moment = require('moment');
const nodemailer = require("nodemailer");
const EmailTemplate = require('email-templates-v2').EmailTemplate;
var path = require('path');
var handlebars = require('handlebars');
var fs = require('fs');
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
				res.render('loginModule/payment', { title: 'Payment Page || hubPitch', data: results, documents_viewer: 'false' });
			}
			else if (error) {
				console.log(error,
					results,
					fields);
				res.send({ success: false, message: 'SQL ISSUES', error: error });
			} else {
				console.log(error, results, fields);
				res.send({ success: false, message: 'Something Went Wrong' });
			}
		});
	}


	static async payment(req, res) {

		var readHTMLFile = function (path, callback) {
			fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
				if (err) {
					throw err;
					callback(err);
				}
				else {
					callback(null, html);
				}
			});
		};


		var transporter = nodemailer.createTransport({
			service: process.env.SERVICE,
			auth: {
				user: process.env.HPEMAILUSER,
				pass: process.env.PASSWORD
			}
		});


		var bin1 = atob(req.params.id);
		var array = bin1.split(',');

		let amount = array[0];
		const token = req.body.stripeToken;
		// create a customer 
		stripe.customers.create({
			email: req.body.stripeEmail,
			source: req.body.stripeToken
		})
			.then(customer => {
				console.log('customer => ', customer);
				var charge_id = "trial_period";
				var customer_id = customer.id;
				stripe.subscriptions.create({
					customer: customer.id,
					items: [{ plan: array[2] }],
					trial_end: 1557896607,
					billing: 'send_invoice',
					days_until_due: 5,
				}, function (err, subscription) {
					if (err) {
						console.log('err => ', err);
						res.send({ success: false, message: err });
					}
					else {
						console.log('subscription => ', subscription);

						readHTMLFile('emailhelper/emailViews.html', function (err, html) {

							var template = handlebars.compile(html);
							var replacements = {
								date: moment(Date.now()).format('LL'),
								dateto: moment(Date.now()).add(7, 'days').format('LL'),

							};
							var htmlToSend = template(replacements);
							var mailOptions = {
								from: process.env.HPEMAILUSER, // sender address
								to: req.body.stripeEmail, // list of receivers/*9
								subject: "Welcome to your Bundle Free Trial!", // Subject line
								html: htmlToSend
							};
							transporter.sendMail(mailOptions, function (error, response) {
								if (error) {
									console.log(error);
									//callback(error);
								}
								else {
									let encodedDataD = charge_id + ',' + subscription.id + ',' + customer_id;
									var encodedData = btoa(encodedDataD);
									//window.location.href = http://www.gorissen.info/Pierre/...";} 
									//res.redirect('/signup/?id=' + encodedData);
									//res.redirect('/signupp');
									res.render('loginModule/signup', { title: 'hubPitch Sign Up', charge: encodedData });
								}
							});
						});

					}
					//});
				}).catch(err => {
					console.log('charge Error => ', err);
				});
			})
			.catch(err_customer => {
				console.log('custome create Error => ', err_customer);
				if (err_customer.type === 'StripeCardError') {
					res.status(500).send({ error: "Your card was decliend" })
				}
				else {
					res.status(500).send({ error: err_customer.message });
				}
			});
	}

	static async paymentbackup(req, res) {

		var bin1 = atob(req.params.id);
		var array = bin1.split(',');

		let amount = array[0];
		const token = req.body.stripeToken;
		// create a customer 
		stripe.customers.create({
			email: req.body.stripeEmail,
			source: req.body.stripeToken
		})
			.then(customer => {
				console.log('customer => ', customer);
				stripe.charges
					.create({
						amount,
						description: "hubPitch Membership",
						currency: "usd",
						customer: customer.id,
						receipt_email: req.body.stripeEmail
					}).then(charge => {
						console.log('charge => ', charge);
						var charge_id = charge.id;
						var customer_id = charge.customer;
						stripe.subscriptions.create({
							customer: charge.customer,
							items: [{ plan: array[2] }],
							trial_end: 1557748731,
							billing: 'send_invoice',
							days_until_due: 5,
						}, function (err, subscription) {
							if (err) {
								console.log('err => ', err);
								res.send({ success: false, message: err });
							}
							else {
								console.log('subscription => ', subscription);
								let encodedDataD = charge_id + ',' + subscription.id + ',' + customer_id;
								var encodedData = btoa(encodedDataD);
								res.render('loginModule/signup', { title: 'hubPitch Sign Up', charge: encodedData });
							}
						});
					}).catch(err => {
						console.log('charge Error => ', err);
					});
			})
			.catch(err_customer => {
				console.log('custome create Error => ', err_customer);
				if (err_customer.type === 'StripeCardError') {
					res.status(500).send({ error: "Your card was decliend" })
				}
				else {
					res.status(500).send({ error: err_customer.message });
				}
			});
	}

	static async paymentDone(req, res) {
		var smtpTransport = nodemailer.createTransport({
			service: process.env.SERVICE,
			auth: {
				user: process.env.HPEMAILUSER,
				pass: process.env.PASSWORD
			}
		});
		var bin1 = atob(req.params.id);
		var array = bin1.split(',');
		var charge = atob(array[2]);
		var subscription = charge.split(',');

		console.log("array1", array);
		console.log("charge111", subscription);

		db.query('UPDATE hp_users SET is_payment="yes",	plan_id="' + array[1] + '",	transaction_id="' + subscription[0] + '" , subscription_id="' + subscription[1] + '" , customer_id="' + subscription[2] + '" WHERE user_id="' + array[0] + '"', function (error,
			results,
			fields) {

			if (error) {
				console.log(error,
					results,
					fields);
				res.send({ success: false, message: 'SQL ISSUES', error: error });
			}

			if (results) {

				db.query('SELECT (SELECT pitch_limits FROM hp_membership_plan WHERE plan_id=?) as pitch_limit,hp_users.email,hp_users_tmp.token_value,hp_users_tmp.randompassword FROM hp_users_tmp JOIN hp_users ON hp_users_tmp.user_id = hp_users.user_id WHERE hp_users_tmp.user_id=?', [array[1], array[0]], function (error1,
					results1,
					field1) {
					if (results1) {
						//console.log('RIP', results1);
						var pitch_limit = results1[0].pitch_limit;

						var date = new Date();
						var timestamp = date.getTime();
						var expire = timestamp + 30 * 24 * 60 * 60;

						if (pitch_limit == "") {
							pitch_limit = -1;
						}

						let hp_users_pitch_limit_data = {
							user_id: array[0],
							remaining_pitch: pitch_limit,
							end_date: moment(Date.now()).add(1, 'months').format('LLLL')
						}

						db.query("INSERT INTO hp_users_pitch_limit SET?", hp_users_pitch_limit_data, function (
							error2,
							results2,
							fields2
						) {
							if (error2) {
								console.log(error2);
								res.send({ success: "false", message: "Something went wrong" });
							}
							if (results2) {
								// -------------------------------mail sending-----------------------------
								var tomail = "";
								tomail = results1[0].email;
								// setup e-mail data with unicode symbols
								var mailOptions = {
									from: process.env.USERNAME, // sender address
									to: tomail, // list of receivers
									subject: "Random password for login", // Subject line
									//html: res.render('email/emailViews')									
									html: "<h1> Your hubPitch Random Password is: " + results1[0].randompassword + "</h1> <br/> Please Click this Link to Reset your Password: <a href=" + process.env.SITE_URL + 'reset-password/' + results1[0].token_value + "> Click Here</a>"
								};
								// send mail with defined transport object
								smtpTransport.sendMail(mailOptions, function (err, info) {
									if (err) {
										console.log(err);
									}
									else {
										console.log("Message sent: " + info);
										// res.render("loginModule/welcome", { title: 'Payment Page || hubPitch', documents_viewer: 'false', free: 'false' })
										res.status(200).send({ success: "true" });
									}
								});
							}
						});

					}

				});
			}
		});

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
				db.query('SELECT (SELECT pitch_limits FROM hp_membership_plan WHERE plan_id=?) as pitch_limit,hp_users.email,hp_users_tmp.token_value,hp_users_tmp.randompassword FROM hp_users_tmp JOIN hp_users ON hp_users_tmp.user_id = hp_users.user_id WHERE hp_users_tmp.user_id=?', [array[1], array[0]], function (error1,
					results1,
					field1) {
					if (results1) {
						var pitch_limit = results1[0].pitch_limit;
						var date = new Date();
						var timestamp = date.getTime();
						var expire = timestamp + 30 * 24 * 60 * 60;
						if (pitch_limit == "") {
							pitch_limit = -1;
						}

						let hp_users_pitch_limit_data = {
							user_id: array[0],
							remaining_pitch: pitch_limit,
							end_date: moment(Date.now()).add(1, 'months').format('LLLL')
						}
						db.query("INSERT INTO hp_users_pitch_limit SET?", hp_users_pitch_limit_data, function (
							error2,
							results2,
							fields2
						) {
							if (error2) {
								console.log(error2);
								res.send({ success: "false", message: "Something went wrong" });
							}
							if (results2) {

							}
						});
					}
					// -------------------------------mail sending-----------------------------
					var tomail = "";
					tomail = results1[0].email;
					// setup e-mail data with unicode symbols
					var mailOptions = {
						from: process.env.HPEMAILUSER, // sender address
						to: tomail, // list of receivers/*9
						subject: "Random password for login1", // Subject line
						html: res.render('email/emailViews')
						//html: "<h1> Your hubPitch Random Password is: " + results1[0].randompassword + "</h1> <br/> Please Click this Link to Reset your Password: <a href=" + process.env.SITE_URL + 'reset-password/' + results1[0].token_value + "> Click Here</a>"
					};
					// send mail with defined transport object
					smtpTransport.sendMail(mailOptions, function (err, info) {
						if (err) {
							console.log('ERORR_____________ MAIL', err);
						} else {
							console.log('SENT')
							res.status(200).send({ success: "true" })
						}
					});
				});
			}
		});
	}


	static async tempMail(req, res) {

		var readHTMLFile = function (path, callback) {
			fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
				if (err) {
					throw err;
					callback(err);
				}
				else {
					callback(null, html);
				}
			});
		};


		var transporter = nodemailer.createTransport({
			service: process.env.SERVICE,
			auth: {
				user: process.env.HPEMAILUSER,
				pass: process.env.PASSWORD
			}
		});

		var date = new Date();
		var timestamp = date.getTime();
		var expire = timestamp + 30 * 24 * 60 * 60;
		// console.log(date);
		// console.log(timestamp);
		// console.log(expire);
		// console.log("date", moment(expire).format("YYYY-MM-DD HH:mm:ss"));
		// // console.log(moment.unix(Date.now()).add(7, 'days'));
		// console.log("now", moment(Date.now()).format('LL'));

		console.log("7 daya", moment(Date.now()).add(7, 'days').format('LLLL'));
		console.log("1 month", moment(Date.now()).add(1, 'months').format('LLLL'));


		// db.query("SELECT * from hp_users WHERE hp_users.user_id ='abf054f1-1057-4ba7-aaa6-17b143377a0a'", function (error, results, fields) {
		// 	if (results.length) {

		// 		if (results[0].subscription_id != '' || results[0].subscription_id != null) {
		// 			console.log("rip");
		// 		}
		// 		else {
		// 			console.log("rip not");
		// 		}
		// 	}
		// });

		//console.log(Date.now());

		// readHTMLFile('emailhelper/emailViews.html', function (err, html) {

		// 	var template = handlebars.compile(html);
		// 	var replacements = {
		// 		date: "hj",
		// 		dateto: "gfnjg",

		// 	};
		// 	var htmlToSend = template(replacements);
		// 	var mailOptions = {
		// 		from: process.env.HPEMAILUSER, // sender address
		// 		to: "rip@narola.email", // list of receivers/*9
		// 		subject: "Testing", // Subject line
		// 		html: htmlToSend
		// 	};
		// 	transporter.sendMail(mailOptions, function (error, response) {
		// 		if (error) {
		// 			console.log(error);
		// 			//callback(error);
		// 		}
		// 		else {
		// 			res.status(200).send({ success: "true" })
		// 		}
		// 	});
		// });

	}

	static async tempMail1(req, res) {

		var smtpTransport = nodemailer.createTransport({
			service: process.env.SERVICE,
			auth: {
				user: process.env.HPEMAILUSER,
				pass: process.env.PASSWORD
			}
		});
		//var temp = new EmailTemplate('emailhelper/emailViews');
		// var sendPwdReminder = smtpTransport.templateSender({
		// 	render: function (context, callback) {
		// 		callback(null, {
		// 			html: 'rendered html content',
		// 			text: 'rendered text content'
		// 		});
		// 	}
		// });

		// var template_sender = transporter.templateSender(new EmailTemplate('emailhelper/emailViews'), {
		// 	from: "rip@narola.email"
		// });


		// return template_sender({
		// 	to: "rip@narola.email",
		// 	subject: "just checking",
		// }, data).then(function (info) {
		// 	console.log("Mail Send");
		// 	return { "status": 1, "message": info };
		// }).catch(function (err) {
		// 	console.log("Mail Not Send");
		// 	return { "status": 0, "error": err };
		// });


		var template_sender = smtpTransport.templateSender(new EmailTemplate('emailhelper/emailViews'), {
			from: "rip@narola.email"
		});
		return template_sender({
			to: "rip@narola.email",
			subject: "just checking",
		}, data).then(function (info) {
			console.log("Mail Send");
			return { "status": 1, "message": info };
		}).catch(function (err) {
			console.log("Mail Not Send");
			return { "status": 0, "error": err };
		});



		// const email = new EmailTemplate({
		// 	message: {
		// 		from: 'rip@narola.email'
		// 	},
		// 	transport: {
		// 		jsonTransport: true
		// 	},
		// 	textOnly: true // <----- HERE
		// });

		// email
		// 	.send({
		// 		template: 'mars',
		// 		message: {
		// 			to: 'rip@narola.email'
		// 		},
		// 		locals: {
		// 			name: 'Elon'
		// 		}
		// 	})
		// 	.then(console.log)
		// 	.catch(console.error);

	}

}
module.exports = stripePaymentController;