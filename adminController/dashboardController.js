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
        res.render('adminViews/profileModule/profile', { title: 'Admin Profile || Hub Pitch', datatable: 'FALSE' });
    }
    
}
module.exports = dashboardController;