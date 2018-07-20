const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const auth = require('../commonController/auth');
const db = require('./db');
class usersController {

    // Profile
    static async profile(req, res, next) {
        res.render('userViews/profileModule/profile', { title: 'User Profile || Hub Pitch' });
    }

    // User Info
    static async me(req, res, next) {
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
        db.query('SELECT * FROM hp_users WHERE user_id = ?', userid, function (error, results, fields) {
            console.log(error, results, fields);
            });
    }
}
module.exports = usersController;