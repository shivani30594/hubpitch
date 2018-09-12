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

    static async addNewPitchView(res) {
        res.render('userViews/pitchModule/addPitch', { title: 'Add New Pitch || Hub Pitch', documents_viewer: 'true' });
    }

    static async addPitch(req, res) {
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
            let fileType = '';
            let newPitch = {
                company_name: req.body.company_name,
                user_id: userid,
            }
            if (_.size(req.files) == 1 && _.size(req.files['pitch_files']) == 7) {
                fileExtension = '';
                filename = '';
                thisFile = [];

                if (thisFile.mimetype == 'application/octet-stream') {
                    fileExtension = thisFile.name.split(".");
                    fileType = fileExtension
                } else {
                    fileExtension = thisFile.mimetype.split("/");
                    fileType = fileExtension[0];
                }

                filename = "pitch_" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000) + '.' + fileExtension[1];
                req.files['pitch_files'].mv(dir + '/' + filename, async (err) => {
                    if (err) {
                        console.log("There was an issue in uploading cover image");
                    } else {
                        saveAble = {
                            'pitch_attachment': {
                                'pitch_attachment_type': fileType,
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
                        fileType = fileExtension[1];
                        console.log('fileExtension', fileExtension);
                    } else {
                        fileExtension = thisFile.mimetype.split("/");
                        fileType = fileExtension[0];
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
                                    'pitch_attachment_type': fileType,
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


    static async deletePitch(req, res) {
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

    static async getPitch(req, res) {
        var token = req.headers['access-token'];
        let userid = '';
        jwt.verify(token, jwtsecret, function (err, decoded) {
            if (err) {
                return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
            } else {
                userid = decoded.user;
            }
        });
        db.query("SELECT DISTINCT (SELECT COUNT(*) FROM hp_conversation JOIN hp_pitch_chat_tbl ON hp_conversation.conversation_id = hp_pitch_chat_tbl.conversation_id JOIN hp_pitch_master ON hp_conversation.pitch_id = hp_pitch_master.pitch_id WHERE hp_pitch_chat_tbl.receiver='" + userid + "' AND hp_pitch_master.pitch_id = master.pitch_id  AND hp_pitch_chat_tbl.status = 'unread') as messages, master.user_id,master.pitch_id,master.company_name,count(*) as page_count,master.created FROM hp_pitch_master as master JOIN hp_pitch_info ON master.pitch_id=hp_pitch_info.pitch_id WHERE master.user_id=? GROUP BY hp_pitch_info.pitch_id ORDER BY master.created DESC", userid, function (
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

    static async viewPitchDetails(req, res) {
        db.query("SELECT master_tbl.share_times,analysis.pitch_view_counter as total_views ,info.average_view,info.pitch_info_id,master_tbl.company_name,master_tbl.user_id,master_tbl.pitch_id,master_tbl.created,info.pitch_attachment_type,info.pitch_attachment_name,info.pitch_attachment_text FROM hp_pitch_info as info LEFT JOIN hp_pitch_master as master_tbl ON info.pitch_id=master_tbl.pitch_id LEFT JOIN hp_pitch_analytics as analysis ON master_tbl.pitch_id = analysis.pitch_id WHERE master_tbl.pitch_id = ?", req.params.id, function (
            error,
            results,
            fields
        ) {
            if (results) {
                res.render('userViews/pitchModule/viewPitch', { title: 'View Pitch || Hub Pitch', dir_parth: '/uploads/test/', data: results, results_length: results.length, documents_viewer: 'true' });
            } else {
                console.log(error, results, fields);
                return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
            }
        });

    }

    static async managePitch(req, res) {

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

    static sharingDetails(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                pitch_id: Joi.string()
                    .required(),
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            db.query('SELECT * FROM hp_email_log WHERE `pitch_id` = ?', req.body.pitch_id, function (error, results, fields) {
                if (error) {
                    res.send({ success: "false", message: "Something went wrong || EMAIL Analytics" });
                }

                if (results.length > 0) {
                    res.send({ success: "true", data: results });
                } else {
                    res.send({ success: "true", message: "No Data" });
                }
            })
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static getPitchMessage(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                conversation_id: Joi.string()
                    .required(),
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            db.query('SELECT * FROM hp_pitch_chat_tbl WHERE `conversation_id` = ?', req.body.conversation_id, function (error, results, fields) {
                if (error) {
                    res.send({ success: "false", message: "Something went wrong || GET Conversation" });
                }
                if (results.length > 0) {
                    res.send({ success: "true", data: results });
                } else {
                    res.send({ success: "true", message: "No Data" });
                }
            })
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static replyPitchMessage(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                conversation_id: Joi.string().required(),
                sender: Joi.string().required(),
                receiver: Joi.string().required(),
                chat_text: Joi.string().required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            let userid = '';
            jwt.verify(token, jwtsecret, function (err, decoded) {
                if (err) {
                    return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    userid = decoded.user;
                }
            });
            let sendMsg = {
                conversation_id: req.body.conversation_id,
                sender: userid,
                receiver: req.body.receiver,
                chat_text: req.body.chat_text,
            }
            db.query("INSERT INTO hp_pitch_chat_tbl SET ?", sendMsg, function (
                error,
                results,
                fields
            ) {
                if (results) {
                    res.send({ success: "true", message: "Message Sent" });
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

    static editPitchPage(req, res) {
        db.query("SELECT info.pitch_info_id,master_tbl.share_times,analysis.pitch_view_counter as total_views ,info.average_view,info.pitch_info_id,master_tbl.company_name,master_tbl.user_id,master_tbl.pitch_id,master_tbl.created,info.pitch_attachment_type,info.pitch_attachment_name,info.pitch_attachment_text FROM hp_pitch_info as info LEFT JOIN hp_pitch_master as master_tbl ON info.pitch_id=master_tbl.pitch_id LEFT JOIN hp_pitch_analytics as analysis ON master_tbl.pitch_id = analysis.pitch_id WHERE master_tbl.pitch_id = ?", req.params.id, function (
            error,
            results,
            fields
        ) {
            if (results) {
                res.render('userViews/pitchModule/editPitch', { title: 'View Pitch || Hub Pitch', dir_parth: '/uploads/test/', data: results, results_length: results.length, documents_viewer: 'true' });
            } else {
                console.log(error, results, fields);
                return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
            }
        });
    }

    static async editPitch(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body, req.flies), {
                pitch_id: Joi.any().required(),
                company_name: Joi.allow(),
                pitch_attachment_text: Joi.allow()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            var token = req.headers['access-token'];
            jwt.verify(token, jwtsecret, function (err, decoded) {
                if (err) {
                    return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
                }
            });
            let flag = 0;
            if (req.body.company_name != '') {
                db.query('UPDATE hp_pitch_master SET company_name=' + req.body.company_name + ' pitch_id id=' + req.body.pitch_id, function (error,
                    results,
                    fields) {
                    if (error) {
                        res.send({ success: false, message: 'Something went wrong in Company Name', error: error });
                    }
                });
                flag = flag + 1;
            }
            if (req.body.pitch_attachment_text.length > 0) {
                let pitch_attachment_text = req.body.pitch_attachment_text;
                _.forEach(pitch_attachment_text, function (key, value) {
                    db.query('UPDATE hp_pitch_info SET 	pitch_attachment_name=' + key.text + ' pitch_id id=' + key.pitch_info_id, function (error,
                        results,
                        fields) {
                        if (error) {
                            res.send({ success: false, message: 'Something went wrong in Pitch Text', error: error });
                        }
                    });
                })
            }
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static getConversation(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                pitch_id: Joi.string().required(),
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            var token = req.headers['access-token'];
            let userid = ''
            jwt.verify(token, jwtsecret, function (err, decoded) {
                if (err) {
                    return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    userid = decoded.user;
                }
            });

            db.query('SELECT hp_conversation.conversation_id,hp_pitch_chat_tbl.sender,COUNT(*) as messages FROM hp_conversation JOIN hp_pitch_chat_tbl ON hp_conversation.conversation_id = hp_pitch_chat_tbl.conversation_id WHERE hp_conversation.pitch_id=? GROUP BY hp_conversation.conversation_id', req.body.pitch_id, function (
                error,
                results,
                fields
            ) {
                if (error) {
                    res.send({ success: false, error });
                }
                if (results) {
                    res.send({ success: true, data: results });
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