const db = require("../dbconfig/db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const jwtsecret = "Narola123";
const _ = require('lodash');
const dir = 'public/uploads/test';
const fs = require('fs')
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var async = require('async')
var path = require('path');

class pitchController {

    static async addNewPitchView(req, res, next) {
        res.render('userViews/pitchModule/addPitch', { title: 'Add New Pitch || Hub Pitch', documents_viewer: 'true' });
    }

    static async addPitch(req, res, next) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body, req.flies), {
                company_name: Joi.string()
                    .min(3)
                    .required(),
                pitch_text: Joi.any().required()
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
                } else {
                    userid = decoded.user;
                }
            });
            var fileExtension = '';
            var filename = '';
            var thisFile = [];
            var saveAble = [];
            let counter = 0;
            let pitchID = '';
            let newPitch = {
                company_name: req.body.company_name,
                user_id: userid,
            }
            if (_.size(req.files) == 1 && _.size(req.files['pitch_files']) == 7) {
                fileExtension = '';
                filename = '';
                thisFile = [];
                fileExtension = req.files['pitch_files'].mimetype.split("/");
                filename = "pitch_" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000) + '.' + fileExtension[1];
                req.files['pitch_files'].mv(dir + '/' + filename, async (err) => {
                    if (err) {
                        console.log("There was an issue in uploading cover image");
                    } else {
                        saveAble = {
                            'pitch_attachment': {
                                'pitch_attachment_type': fileExtension[0],
                                'pitch_attachment_name': filename,
                                'pitch_attachment_text': req.body.pitch_text
                            }
                        }
                        // savePinch(newPitch,saveAble);
                        db.query("INSERT INTO hp_pitch_master SET?", newPitch, function (
                            error,
                            results,
                            fields
                        ) {
                            if (results.insertId) {
                                pitchID = results.insertId;
                                _.forEach(saveAble, function (key, value) {
                                    let newPitchInfo = {}
                                    newPitchInfo = {
                                        'pitch_id': pitchID,
                                        'pitch_attachment_type': key.pitch_attachment_type,
                                        'pitch_attachment_name': key.pitch_attachment_name,
                                        'pitch_attachment_text': key.pitch_attachment_text
                                    }
                                    db.query("INSERT INTO hp_pitch_info SET?", newPitchInfo, function (error,
                                        results,
                                        fields) {
                                        if (results.affectedRows) {
                                            res.send({ success: "true", message: "New Pitch Added", pitch: pitchID });
                                        } else {
                                            console.log(error,
                                                results,
                                                fields)
                                            res.send({ success: "false", message: "Something went wrong || Info Table" });
                                        }
                                    })
                                })
                            }
                            else {
                                console.log(error,
                                    results,
                                    fields)
                                res.send({ success: "false", message: "Something went wrong || Master Table" });
                            }
                        });
                    }
                });
            }
            else {
                var temp = [];
                var ext = '';
                counter = 0;
                async.eachSeries(req.files.pitch_files, function (value, each_callback) {

                    fileExtension = '';
                    filename = '';
                    thisFile = [];
                    thisFile = value;
                    if (thisFile.mimetype == 'application/octet-stream') {
                        fileExtension = thisFile.name.split(".");
                    } else {
                        fileExtension = thisFile.mimetype.split("/");
                    }
                    filename = "pitch_" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000) + '.' + fileExtension[1];
                    console.log(filename);
                    thisFile.mv(dir + '/' + filename, (err) => {
                        if (err) {
                            console.log("There was an issue in uploading cover image");
                            each_callback();
                        } else {
                            temp = {
                                'pitch_attachment': {
                                    'pitch_attachment_type': fileExtension[0],
                                    'pitch_attachment_name': filename,
                                    'pitch_attachment_text': req.body.pitch_text[counter]
                                }
                            }
                            saveAble.push(temp);
                            counter++;
                            each_callback();
                        }
                    });
                }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    //savePinch(newPitch,saveAble);
                    //console.log("saveAble:", saveAble);

                    db.query("INSERT INTO hp_pitch_master SET?", newPitch, function (
                        error,
                        results,
                        fields
                    ) {
                        if (results.insertId) {
                            pitchID = results.insertId;
                            let counter_temp = 1;
                            let newPitchInfo = {}
                            async.forEachOf(saveAble, function (value, key, callback) {
                                value['pitch_attachment']['pitch_id'] = pitchID;
                                db.query("INSERT INTO hp_pitch_info SET?", value['pitch_attachment'], function (error,
                                    results,
                                    fields) {
                                    if (results) {
                                        console.log('ADDED')
                                    } else {
                                        console.log(error,
                                            results,
                                            fields)
                                        res.send({ success: "false", message: "Something went wrong || Info Table" });
                                    }
                                })
                                callback();
                            }, function (err) {
                                if (err) console.error(err.message);
                                // configs is now a map of JSON 
                                // console.log('SaveABle LENGTH', saveAble.length);
                                // console.log('Counter', counter_temp);
                                res.send({ success: "true", message: "New Pitch Added", pitch: pitchID });
                            });
                        }
                        else {
                            console.log(error,
                                results,
                                fields)
                            res.send({ success: "false", message: "Something went wrong || Master Table" });
                        }
                    });
                });
            }
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }


    static async deletePitch(req, res, next) {
        if (req.body.pitch_delete_type = 'full') {
            try {
                const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                    pitch_id: Joi.string()
                        .required()
                });
                if (pitchData.error) {
                    res.send({ success: false, error: pitchData.error });
                    return;
                }
                db.query("DELETE FROM hp_pitch_master WHERE pitch_id=?", req.body.pitch_id, function (error, results, fields) {
                    if (results.affectedRows) {
                        res.send({ success: "true", message: "Delete Pitch!" });
                    } else {
                        console.log(error, results, fields)
                        res.send({ success: "false", message: "Something went wrong || Master Table" });
                    }
                })
            }
            catch (error) {
                console.error(error);
                res.send({ success: false, error });
            }
        } else {
            try {
                const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                    att_pitch_id: Joi.string()
                        .required()
                });
                if (pitchData.error) {
                    res.send({ success: false, error: pitchData.error });
                    return;
                }
                db.query("DELETE FROM hp_pitch_info WHERE pitch_info_id=?", req.body.att_pitch_id, function (error, results, fields) {
                    if (results.affectedRows) {
                        res.send({ success: "true", message: "Delete Pitch!" });
                    } else {
                        console.log(error, results, fields)
                        res.send({ success: "false", message: "Something went wrong || Info Table" });
                    }
                })
            }
            catch (error) {
                console.error(error);
                res.send({ success: false, error });
            }
        }
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
        db.query("SELECT DISTINCT master.user_id,master.pitch_id,master.company_name,count(*) as page_count,master.created FROM hp_pitch_master as master JOIN hp_pitch_info ON master.pitch_id=hp_pitch_info.pitch_id WHERE master.user_id=? GROUP BY hp_pitch_info.pitch_id ORDER BY master.created DESC", userid, function (
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
            db.query("SELECT master.user_id,master.pitch_id,master.company_name,count(*) as page_count,master.created,hp_pitch_info.pitch_attachment_type,hp_pitch_info.pitch_attachment_name,hp_pitch_info.pitch_attachment_text FROM hp_pitch_master as master JOIN hp_pitch_info ON master.pitch_id=hp_pitch_info.pitch_id WHERE master.pitch_id=? GROUP BY hp_pitch_info.pitch_id", pitch_id, function (
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

    static async managePitch(req, res, next) {
        
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                pitch_id: Joi.string()
                    .required(),
                allow_notification: Joi.string()
                    .required(),
                allow_messaging: Joi.string()
                    .required(),
                allow_share: Joi.string()
                    .required(),
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
                } else {
                    userid = decoded.user;
                }
            });
            var randomToken = Math.random()
                .toString(36)
                .slice(-8);
            let url_token = randomToken
            let newPitch = {
                pitch_id: req.body.pitch_id,
                allow_notification: req.body.allow_notification,
                allow_messaging: req.body.allow_messaging,
                allow_share: req.body.allow_share,
                url_token: url_token
            }
            db.query("INSERT INTO hp_pitch_manager SET?", newPitch, function (
                error,
                results,
                fields
            ) {
                console.log(error,
                    results,
                    fields);
                if (results) {
                    res.send({ success: "true", message: "share link created", data: url_token });
                } else {
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