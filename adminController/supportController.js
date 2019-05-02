const db = require("../dbconfig/db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const _ = require('lodash');
var async = require('async')

class supportController {

    static async get_all_support(req, res, next) {

        db.query("SELECT u.first_name, u.last_name,u.email ,s.user_id,s.support_message,s.status,s.created FROM hp_users as u join hp_support as s where s.user_id= u.user_id ", function (
            error,
            results,
            fields
        ) {
            if (results) {
                console.log("results", results);
                res.render('adminViews/supportModule/manageSupport', { title: 'All Users Pitch || hubPitch', data: results, datatable: 'TRUE' });
            } else {

                return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
            }
        });
    }

    static async UsersActivation(req, res, next) {
        try {

            let sql = 'UPDATE hp_support SET status="inactive"  WHERE user_id="' + req.body.user_id + '"';
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
                    res.send({ success: true, message: "User Issue has Successfully Resolved!!!" });
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