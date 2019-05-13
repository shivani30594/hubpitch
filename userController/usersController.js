const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const auth = require('../commonController/auth');
const db = require('./db');
const Joi = require("joi");
class usersController {

    static async checklogin(req, res, next) {
        console.log("rip");
        var token = req.cookies.accesstoken;
        let userid = '';
        jwt.verify(token, jwtsecret, function (err, decoded) {
            if (err) {

                res.render('loginModule/index', { title: 'SignIn || hubPitch' });

            } else {
                userid = decoded.user;
                db.query(
                    'SELECT * FROM hp_users WHERE user_id = "' + userid + '"',
                    function (error, results, fields) {
                        if (results.length) {
                            let dashboardURL = (results[0].role == 'user') ? 'user/dashboard' : 'admin/dashboard';
                            res.redirect(dashboardURL);
                        }
                    });
            }
        });
    }

    // Profile
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

        db.query('SELECT hp_membership_plan.pitch_notifications,hp_users.user_id,hp_users.first_name,hp_users.last_name,hp_users.email,hp_users_info.company_name,hp_users_info.notification_1,hp_users_info.notification_2,hp_users_info.notification_3 FROM hp_users LEFT JOIN hp_users_info ON hp_users.user_id = hp_users_info.user_id JOIN hp_membership_plan ON hp_membership_plan.plan_id = hp_users.plan_id WHERE hp_users.user_id = ?', userid, function (error, results, fields) {
            if (results) {
                console.log(results[0])
                res.render('userViews/profileModule/profile', { title: 'User Profile || hubPitch', documents_viewer: 'false', data: results[0] });
            } else {
                console.log(error, results, fields);
                res.render('userViews/profileModule/profile', { title: 'User Profile || hubPitch', documents_viewer: 'false', data: '' });
            }
        });
    }

    // User Info
    static async me(req, res, next) {
        //console.clear();
        var token = req.headers['access-token'];
        let userid = '';
        if (!token) return res.status(401).send({ success: false, message: 'No token provided.' });
        //return false; 

        jwt.verify(token, jwtsecret, function (err, decoded) {
            if (err) {
                return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
                //return false;
            } else {
                userid = decoded.user;
            }
        });

        db.query('SELECT hp_users.user_id,hp_users.first_name,hp_users.last_name,hp_users.email,hp_users_info.company_name,hp_users_info.notification_1,hp_users_info.notification_2,hp_users_info.notification_3 FROM hp_users LEFT JOIN hp_users_info ON hp_users.user_id = hp_users_info.user_id WHERE hp_users.user_id = ?', userid, function (error, results, fields) {
            if (results.length) {
                res.send({ success: "true", data: results });
            } else {
                console.log(error, results, fields);
            }
        });
    }

    // Update Profile
    static async updateProfile(req, res) {

        try {

            const pitchData = Joi.validate(Object.assign(req.params, req.body, req.flies), {
                firstName: Joi.string()
                    .min(2)
                    .required().trim(),
                lastName: Joi.string()
                    .min(2)
                    .required().trim(),
                companyName: Joi.string()
                    .min(2)
                    .required().trim(),
                allow_notification: Joi.allow(),
                allow_messaging: Joi.allow(),
                allow_share: Joi.allow(),
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
                    let sql1 = 'REPLACE into hp_users_info SET user_id="' + userid + '", company_name = "' + req.body.companyName + '", notification_1 ="' + req.body.allow_notification + '", notification_2 = "' + req.body.allow_messaging + '", notification_3 = "' + req.body.allow_share + '"';
                    db.query(sql1, function (error1,
                        results1,
                        fields1) {
                        if (error1) {
                            console.log(error1,
                                results1,
                                fields1);
                            console.log(sql1);
                            res.send({ success: false, message: "SQL ISSUES IN USERS" });
                        }
                        if (results1) {
                            res.send({ success: true, message: "Profile Updated Successfully" });
                        }
                    });
                }
            });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }
}
module.exports = usersController;