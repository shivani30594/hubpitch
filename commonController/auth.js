const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";

exports.verifytoken = function (req, res, next) {
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
            
            return res.status(200).send({ success: true, user: userid });
        }
    });
}