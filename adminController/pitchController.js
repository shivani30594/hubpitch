const db = require("../dbconfig/db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const _ = require('lodash');
var async = require('async')

class pitchController {

    static async allUsersPitchView(req, res, next) {
        let userid = '';
        jwt.verify(req.cookies.accesstoken, jwtsecret, function (err, decoded) {
            if (err) {

                return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });

            } else {

                userid = decoded.user;
            }
        });
        db.query("SELECT DISTINCT master.user_id,master.pitch_id,master.company_name,count(*) as page_count,CONCAT(hp_users.first_name,' ',hp_users.last_name) AS username,master.created FROM hp_pitch_master as master JOIN hp_pitch_info ON master.pitch_id=hp_pitch_info.pitch_id JOIN hp_users ON master.user_id = hp_users.user_id GROUP BY hp_pitch_info.pitch_id ORDER BY master.created DESC", function (
            error,
            results,
            fields
        ) {
            if (results) {
                res.render('adminViews/pitchModule/pitchListing', { title: 'All Users Pitch || Hub Pitch', data: results, datatable: 'TRUE' });
            } else {
                console.log(error, results, fields);
                return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
            }
        });
    }

    static async getPitch(req, res, next) {
        var token = req.headers['access-token'];
        let userid = '';
        jwt.verify(token, jwtsecret, function (err, decoded) {
            if (err) {

                return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });

            } else {

                userid = decoded.user;
            }
        });
        db.query("SELECT DISTINCT master.user_id,master.pitch_id,master.company_name,count(*) as page_count,master.created FROM hp_pitch_master as master JOIN hp_pitch_info ON master.pitch_id=hp_pitch_info.pitch_id GROUP BY hp_pitch_info.pitch_id ORDER BY master.created DESC", function (
            error,
            results,
            fields
        ) {
            if (results) {
                res.send({ success: "true", data: results });
            } else {
                console.log(error, results, fields);
                return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
            }
        });
    }
    static async viewPitchDetails(req, res, next) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                pitch_id: Joi.string()
                    .required(),
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            db.query("SELECT DISTINCT master.pitch_id,master.company_name,count(*) as page_count,master.created FROM hp_pitch_master as master JOIN hp_pitch_info ON master.pitch_id=hp_pitch_info.pitch_id WHERE master.pitch_id=? GROUP BY hp_pitch_info.pitch_id", pitch_id, function (
                error,
                results,
                fields
            ) {
                if (results) {
                    res.send({ success: "true", data: results });
                } else {
                    console.log(error, results, fields);
                    return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
                }
            });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

}
module.exports = pitchController;