const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const auth = require('../commonController/auth');
const db = require('./db');
class usersController {

    // Profile
    static async profile(req, res, next) {
        res.render('userViews/profileModule/profile', { title: 'User Profile || Hub Pitch', documents_viewer: 'false' });
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

        db.query('SELECT hp_users.user_id,hp_users.first_name,hp_users.last_name,hp_users.email,hp_users_info.company_name,hp_users_info.notification_1,hp_users_info.notification_2,hp_users_info.notification_3 FROM hp_users LEFT JOIN hp_users_info ON hp_users.user_id = hp_users_info.user_id WHERE hp_users.user_id = ?', userid, function (error, results, fields) {
            if (results.length) {
                res.send({ success: "true", data: results });
            } else {
                console.log(error, results, fields);
            }
        });
    }
}
module.exports = usersController;