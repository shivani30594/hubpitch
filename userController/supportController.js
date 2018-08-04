const db = require("../dbconfig/db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const _ = require('lodash');
var async = require('async')

class supportController {

    static async send_support(req, res, next) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body, req.flies), {
                support_message: Joi.string()
                    .min(3)
                    .required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            var token = req.headers['access-token'];
            let userid = '';
            var supportArr = []
            jwt.verify(token, jwtsecret, function (err, decoded) {
                if (err) {

                    return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });

                } else {

                    userid = decoded.user;
                }
            });
            supportArr = {
                'user_id': userid,
                'support_message': support_message,
            }
            db.query("INSERT INTO `hp_support` SET", supportArr, function (
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
module.exports = supportController