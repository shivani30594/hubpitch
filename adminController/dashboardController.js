const md5 = require("md5");
const db = require("../dbconfig/db");
const Joi = require("joi");
const uuidV4 = require("uuid/v4");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";

class dashboardController {

    static async dashboard(req, res, next) {
        res.render('adminViews/dashboardModule/dashboard', { title: 'Admin Dashboard || Hub Pitch', datatable: 'FALSE' });
    }

    static async profile(req, res, next) {
        var token = req.cookies.accesstoken;
        let userid = '';
        jwt.verify(token, jwtsecret, function (err, decoded) {
            if (err) {
                return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
            } else {
                userid = decoded.user;
            }
        });

        db.query('SELECT * FROM hp_users WHERE user_id = "' + userid + '"', function (error, results, fields) {
            if (results) {
                console.log(results)
                res.render('adminViews/profileModule/profile', { title: 'Admin Profile || Hub Pitch', datatable: 'FALSE', data: results[0] });
            } else {
                console.log(error, results, fields);
                res.render('adminViews/profileModule/profile', { title: 'Admin Profile || Hub Pitch', datatable: 'FALSE' });
            }
        });
    }

    // Update Profile
    static async updateProfile(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body, req.flies), {
                firstName: Joi.string()
                    .min(2)
                    .required(),
                lastName: Joi.string()
                    .min(2)
                    .required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            var token = req.cookies.accesstoken;
            let userid = '';
            jwt.verify(token, jwtsecret, function (err, decoded) {
                if (err) {
                    return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    userid = decoded.user;
                }
            });
            let sql = 'UPDATE hp_users SET first_name="' + req.body.firstName + '",last_name="' + req.body.lastName + '" WHERE user_id="' + userid + '"'
            db.query(sql, function (error,
                results,
                fields) {
                if (error) {
                    console.log(error,
                        results,
                        fields);
                    console.log(sql)
                    res.send({ success: false, message: "SQL ISSUES IN USERS" });
                }
                if (results) {
                    res.send({ success: true, message: "Profile Updated Successfully" });
                }
            });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }
}
module.exports = dashboardController;