const db = require("../dbconfig/db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const _ = require('lodash');
const async = require('async');

class subscriptionController {

    static async  manageSubscription(req, res) {
        res.render('adminViews/profileModule/profile', { title: 'Admin Profile || Hub Pitch' })
    }

    static async  manageStripeSetting(req, res) {
        res.render('adminViews/subscriptionModule/manageStripe', { title: 'Admin Manage Stripe Account || Hub Pitch' })
    }

    static async addPlanPage(req, res) {
        res.render('adminViews/subscriptionModule/addPlan', { title: 'Admin Add Plan || Hub Pitch' })
    }
    static async addStripeSetting(req, res) {
        try {
            const StripeSetting = Joi.validate(Object.assign(req.params, req.body, req.flies), {
                pk: Joi.string()
                    .min(6)
                    .required(),
                sk: Joi.string()
                    .min(6).required(),
                test_mode: allow(),
            });
            if (StripeSetting.error) {
                res.send({ success: false, error: StripeSetting.error });
                return;
            }
            var token = req.headers['access-token'];
            let userid = '';
            var settingArr = []
            jwt.verify(token, jwtsecret, function (err, decoded) {
                if (err) {
                    return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    userid = decoded.user;
                }
            });
            settingArr = {
                'public_key': req.body.pk,
                'secret_key': req.body.pk,
                'test_mode': req.body.test_mode,
                'user_id': userid
            }
            db.query("INSERT INTO hp_payment_setting SET?", settingArr, function (
                error,
                results,
                fields
            ) {
                console.log(error,
                    results,
                    fields);
                if (results) {

                }
            });

        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }
}
module.exports = subscriptionController;