const db = require("../dbconfig/db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const _ = require('lodash');

class pitchController {

    static async addNewPitchView(req, res, next) {
        res.render('userViews/pitchModule/addPitch', { title: 'Add New Pitch || Hub Pitch' });
    }

    static async addPitch(req, res, next) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                company_name: Joi.string()
                    .min(3)
                    .required(),
                pitch_attachment: Joi.any()
                    .required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            var token = req.headers['access-token'];
            let userid = '';
            jwt.verify(token, jwtsecret, function (err, decoded) {
                if (err) {
                    return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
                    //return false;
                } else {
                    userid = decoded.user;
                }
            });
            //console.log(req.body.pitch_attachment);
            let pitchID = '';
            let newPitch = {
                company_name: req.body.company_name,
                user_id: userid,
            }
            db.query("INSERT INTO hp_pitch_master SET?", newPitch, function (
                error,
                results,
                fields
            ) {
              console.log(results);
                pitchID = results.insertId;
                _.forEach(req.body.pitch_attachment, function (key, value) {
                    let newPitchInfo = {}
                    newPitchInfo = {
                        'pitch_id' : pitchID,
                        'pitch_attachment_type' : value.pitch_attachment_type,
                        'pitch_attachment_name' : value.pitch_attachment_name,
                        'pitch_attachment_text' : value.pitch_attachment_text
                    }
                    db.query("INSERT INTO hp_pitch_master SET?", newPitchInfo, function (error,
                        results,
                        fields) {
                            console.log(error, results, fields)
                    })
                })
            });
            let att = 1;
            _.forEach(req.body.pitch_attachment, function (key, value) {
                let newPitchInfo = {}
                console.log(key,value);
                newPitchInfo = {
                    // 'pitch_id' : pitchID,
                    'pitch_attachment_type' : value.pitch_attachment_type,
                    'pitch_attachment_name' : value.pitch_attachment_name,
                    'pitch_attachment_text' : value.pitch_attachment_text
                }
                console.log('ds',newPitchInfo);
                att = att + 1;
            })
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }
}
module.exports = pitchController;