const keyPublishable = 'pk_test_wAUwirtoVTeDYL0nEAvhKNjP';
const keySecret = 'sk_test_GNiGN2IGCEQIWk2cTooIGhwJ';

const db = require("../dbconfig/db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const _ = require('lodash');
const async = require('async');
const stripe = require("stripe")(keySecret);

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
        res.render('loginModule/payment', { title: 'Payment Page || Hub Pitch', documents_viewer: 'false' });
    }
    static async payment(req, res) {
        console.log('payment---------');
        let amount = 5 * 100; // 500 cents means $5 

        // create a customer 
        stripe.customers.create({
            email: req.body.stripeEmail, // customer email, which user need to enter while making payment
            source: req.body.stripeToken // token for the given card 
        })
            .then(customer =>
                stripe.charges.create({ // charge the customer
                    amount,
                    description: "Sample Charge",
                    currency: "usd",
                    customer: customer.id
                }))
            .then(charge =>{
                console.log('====================');
                console.log(charge);
                res.render("loginModule/welcome",{ title: 'Payment Page || Hub Pitch', documents_viewer: 'false' })
            })
            .catch(err => {
                console.log("Error:", err);
                res.status(500).send({ error: "Purchase Failed" })
            }); // render the charge view: views/charge.pug

    }
}
module.exports = stripePaymentController;