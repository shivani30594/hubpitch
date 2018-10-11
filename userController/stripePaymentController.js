const keyPublishable = "pk_test_wAUwirtoVTeDYL0nEAvhKNjP";
const keySecret = "sk_test_GNiGN2IGCEQIWk2cTooIGhwJ";

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
}
module.exports = stripePaymentController;