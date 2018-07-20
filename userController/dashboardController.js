const md5 = require("md5");
const db = require("./db");
const Joi = require("joi");
const uuidV4 = require("uuid/v4");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const auth = require('../commonController/auth')

class dashboardController {

    // DASHBOARD
    static async dashboard(req, res, next) {
        userID =
        res.render('userViews/dashboardModule/index', { title: 'User Dashboard || Hub Pitch'});
    }
    
}
module.exports = dashboardController;