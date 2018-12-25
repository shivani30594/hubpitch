const db = require("../dbconfig/db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const _ = require('lodash');
const async = require('async');

class subscriptionController {

    static async  manageSubscription(req, res) {
        db.query("SELECT plan_id,plan_name,plan_price, DATE_FORMAT(created,'%d/%m/%Y') AS niceDate FROM hp_membership_plan ORDER BY created DESC", function (
            error,
            results,
            fields
        ) {
            if (results) {
                res.render('adminViews/subscriptionModule/manageSubscription', { title: 'Admin Subscription Plan || hubPitch', data: results, datatable: 'TRUE' })
            } else {
                console.log(error, results, fields);
                return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
            }
        });
    }

    static async  manageStripeSetting(req, res) {
        res.render('adminViews/subscriptionModule/manageStripe', { title: 'Admin Manage Stripe Account || hubPitch', datatable: 'FALSE' })
    }

    static async editPlanPage(req, res) {
        db.query("SELECT * FROM hp_membership_plan WHERE plan_id=?", req.params.id, function (
            error,
            results,
            fields
        ) {
            if (results) {
                res.render('adminViews/subscriptionModule/editPlan', { title: 'Admin Edit Plan || hubPitch', data: results, datatable: 'FALSE' })
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

    static async addPlanPage(req, res) {
        res.render('adminViews/subscriptionModule/addPlan', { title: 'Admin Edit Plan || hubPitch', datatable: 'FALSE' })
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
                    res.send({ success: true, message: "Stripe Setting Added" });
                }
            });

        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async addMembershipPlan(req, res) {
        try {

            const StripeSetting = Joi.validate(Object.assign(req.params, req.body, req.flies), {
                plan_name: Joi.string()
                    .min(3)
                    .required(),
                plan_price: Joi.string()
                    .min(2).required(),
                unlimited_customer_pitches: Joi.string().required(),
                pitch_limits:Joi.allow(),
                video_upload_editing: Joi.string().required(),
                pdf_upload: Joi.string().required(),
                pitch_customization: Joi.string().required(),
                powerpoint_upload: Joi.string().required(),
                excel_upload: Joi.string().required(),
                word_upload: Joi.string().required(),
                pitch_analytics: Joi.string().required(),
                pitch_notifications: Joi.string().required(),
                sharing_tracking: Joi.string().required(),
                user_to_customer_messaging: Joi.string().required(),
                other_details: Joi.allow()
            });
            if (StripeSetting.error) {
                res.send({ success: false, error: StripeSetting.error });
                return;
            }

            var token = req.headers['access-token'];
            let userid = '';
            var membershipArr = []
            jwt.verify(token, jwtsecret, function (err, decoded) {
                if (err) {
                    return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    userid = decoded.user;
                }
            });
            membershipArr = {
                'plan_name': req.body.plan_name,
                'plan_price': req.body.plan_price,
                'unlimited_customer_pitches': req.body.unlimited_customer_pitches,
                'pitch_limits': req.body.pitch_limits,
                'video_upload_editing': req.body.video_upload_editing,
                'pdf_upload': req.body.pdf_upload,
                'pitch_customization': req.body.pitch_customization,
                'powerpoint_upload': req.body.powerpoint_upload,
                'excel_upload': req.body.excel_upload,
                'word_upload': req.body.word_upload,
                'pitch_analytics': req.body.pitch_analytics,
                'pitch_notifications': req.body.pitch_notifications,
                'sharing_tracking': req.body.sharing_tracking,
                'user_to_customer_messaging': req.body.user_to_customer_messaging,
                'other_details': req.body.other_details,
                'user_id': userid
            }
            db.query("INSERT INTO hp_membership_plan SET?", membershipArr, function (
                error,
                results,
                fields
            ) {
                console.log(error,
                    results,
                    fields);
                if (results) {
                    res.send({ success: true, message: "membership plan added" });
                }
            });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async getPlanByID(req, res) {
        try {
            const StripeSetting = Joi.validate(Object.assign(req.params, req.body, req.flies), {
                plan_id: Joi.string().required(),
            });
            if (StripeSetting.error) {
                res.send({ success: false, error: StripeSetting.error });
                return;
            }

            db.query("SELECT * FROM hp_membership_plan WHERE plan_id=?", req.body.plan_id, function (
                error,
                results,
                fields
            ) {
                if (results) {
                    res.send({ success: true, data: results });
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
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async editPlan(req, res) {
        try {

            const StripeSetting = Joi.validate(Object.assign(req.params, req.body, req.flies), {
                plan_id: Joi.string().required(),
                plan_name: Joi.string()
                    .min(3)
                    .required(),
                plan_price: Joi.string().required(),
                unlimited_customer_pitches: Joi.string().required(),
                pitch_limit:Joi.allow(),
                video_upload_editing: Joi.string().required(),
                pdf_upload: Joi.string().required(),
                pitch_customization: Joi.string().required(),
                powerpoint_upload: Joi.string().required(),
                excel_upload: Joi.string().required(),
                word_upload: Joi.string().required(),
                pitch_analytics: Joi.string().required(),
                pitch_notifications: Joi.string().required(),
                sharing_tracking: Joi.string().required(),
                user_to_customer_messaging: Joi.string().required(),
                other_details: Joi.allow()
            });

            if (StripeSetting.error) {
                res.send({ success: false, error: StripeSetting.error });
                return;
            }

            db.query('UPDATE hp_membership_plan SET plan_name="' + req.body.plan_name + '",	plan_price="' + req.body.plan_price + '",unlimited_customer_pitches="' + req.body.unlimited_customer_pitches + '",	pitch_limits="' + req.body.pitch_limit + '", video_upload_editing="' + req.body.video_upload_editing + '", pdf_upload="' + req.body.pdf_upload + '", pitch_customization="' + req.body.pitch_customization + '" , powerpoint_upload="' + req.body.powerpoint_upload + '" , excel_upload="' + req.body.excel_upload + '" , word_upload="' + req.body.word_upload + '" , pitch_analytics="' + req.body.pitch_analytics + '" , pitch_notifications="' + req.body.pitch_notifications + '" , sharing_tracking="' + req.body.sharing_tracking + '" , user_to_customer_messaging="' + req.body.user_to_customer_messaging + '", other_details="' + req.body.other_details + '" WHERE plan_id=' + req.body.plan_id, function (error,
                results,
                fields) {
                if (error) {
                    console.log(error,
                        results,
                        fields);
                    res.send({ success: false, message: 'SQL ISSUES', error: error });
                }
                res.send({ success: true, message: 'Plan Updated Successfully' });
            });

        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async removePlan(req, res) {
        try {
            const StripeSetting = Joi.validate(Object.assign(req.params, req.body, req.flies), {
                plan_id: Joi.string().required(),
            });
            if (StripeSetting.error) {
                res.send({ success: false, error: StripeSetting.error });
                return;
            }
            db.query("DELETE FROM hp_membership_plan WHERE plan_id=?", req.body.plan_id, function (
                error,
                results,
                fields
            ) {
                if (results) {
                    res.send({ success: true, message: 'Plan Has Deleted!' });
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

        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }
}
module.exports = subscriptionController;