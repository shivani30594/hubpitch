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
const nodemailer = require("nodemailer");
require('dotenv').config()
const uuidV4 = require("uuid/v4");
const md5 = require("md5");

class pitchController {

    static async addNewPitchView(req, res) {
        var token = req.cookies.accesstoken;
        let userid = '';
        jwt.verify(token, jwtsecret, function (err, decoded) {
            if (err) {
                return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
            } else {
                userid = decoded.user;
            }
        });
        //res.render('userViews/pitchModule/addPitch', { title: 'Add New Pitch || Hub Pitch', documents_viewer: 'true' });
        //db.query("SELECT unlimited_customer_pitches,video_upload_editing,pdf_upload,pitch_customization,powerpoint_upload,excel_upload,word_upload,pitch_analytics,pitch_notifications,sharing_tracking,user_to_customer_messaging FROM hp_membership_plan JOIN hp_users on hp_users.plan_id = hp_membership_plan.plan_id WHERE hp_users.user_id=?", userid, function (
        //(SELECT pitch_limits FROM hp_membership_plan WHERE plan_id=?) as total_pitch_limit,
        db.query("SELECT (SELECT remaining_pitch FROM hp_users_pitch_limit WHERE hp_users_pitch_limit.user_id=?) as pitch_limit,pitch_limits,unlimited_customer_pitches,video_upload_editing,pdf_upload,pitch_customization,powerpoint_upload,excel_upload,word_upload,pitch_analytics,pitch_notifications,sharing_tracking,user_to_customer_messaging FROM hp_membership_plan JOIN hp_users on hp_users.plan_id = hp_membership_plan.plan_id WHERE hp_users.user_id=?", [userid, userid], function (
            error,
            results,
            fields
        ) {
            if (error) {
                console.log(error,
                    results,
                    fields)
                res.render('userViews/pitchModule/addPitch', { title: 'Add New Pitch || Hub Pitch', plan: false, documents_viewer: 'true' });
            }
            if (results) {
                console.log(results);
                let plan_data = {
                    video: results[0].video_upload_editing,
                    pdf: results[0].pdf_upload,
                    pitch_customization: results[0].pitch_customization,
                    word_upload: results[0].word_upload,
                    excel_upload: results[0].excel_upload,
                    powerpoint_upload: results[0].powerpoint_upload,
                    pitch_analytics: results[0].pitch_analytics,
                    pitch_notifications: results[0].pitch_notifications,
                    sharing_tracking: results[0].sharing_tracking,
                    user_to_customer_messaging: results[0].user_to_customer_messaging,
                    img_support: 'true',
                    text_file: 'true'
                }

                res.render('userViews/pitchModule/addPitch', { title: 'Add New Pitch || Hub Pitch', plan: JSON.stringify(plan_data), documents_viewer: 'true', plan_type: results[0].pitch_customization, pitch_limit: results[0].pitch_limit, total_pitch_limit: results[0].pitch_limits, pitch_limits_plan: results[0].unlimited_customer_pitches });
            }
        });

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
                console.log("ritt", _.size(req.files['pitch_files']));
                fileExtension = '';
                filename = '';
                thisFile = req.files['pitch_files'];
                console.log('thisFile===========>', thisFile)
                if (thisFile.mimetype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
                    console.log('--------mimetype-------', thisFile.mimetype)
                    fileExtension = thisFile.name.split(/\.(?=[^\.]+$)/);
                    console.log('--------> fileExtension', fileExtension);
                    fileType = fileExtension[1]
                    console.log('fileType', '===========', fileType);
                } else if (thisFile.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    console.log('--------mimetype-------', thisFile.mimetype)
                    fileExtension = thisFile.name.split(/\.(?=[^\.]+$)/);
                    console.log('--------> fileExtension', fileExtension);
                    fileType = fileExtension[1]
                    console.log('fileType', '===========', fileType);
                } else {
                    if (thisFile.mimetype == 'application/octet-stream') {
                        console.log('--------mimetype-------', thisFile.mimetype)
                        fileExtension = thisFile.name.split(/\.(?=[^\.]+$)/);
                        fileType = fileExtension[1]
                    } else {
                        console.log('--------mimetype-------', thisFile.mimetype)
                        fileExtension = thisFile.mimetype.split("/");
                        fileType = fileExtension[0];
                        console.log('fileType --------- NON-octet-stream', fileType)
                    }
                    console.log('thisFile-------->', fileType);
                    console.log('TYPE OF-------->', typeof fileType);
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
                                console.log('saveAble=====>', saveAble);
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
                                            db.query("SELECT remaining_pitch FROM `hp_users_pitch_limit` where user_id=?", userid, function (error1,
                                                results1,
                                                fields1) {
                                                if (results1) {
                                                    var limit_data = results1[0].remaining_pitch;
                                                    console.log("fdhgfh", results1[0].remaining_pitch);
                                                    if (limit_data != -1 && limit_data != 0) {
                                                        limit_data = limit_data - 1;
                                                    }
                                                    db.query("Update hp_users_pitch_limit SET remaining_pitch=? WHERE user_id=?", [limit_data, userid], function (error1,
                                                        results2,
                                                        fields2) {
                                                        if (results2) {

                                                        }
                                                        else {
                                                            console.log(error2,
                                                                results2,
                                                                fields2)
                                                            res.send({ success: "false", message: "Something went wrong || Info Table" });
                                                        }
                                                    });
                                                }
                                                else {
                                                    console.log(error1,
                                                        results1,
                                                        fields1)
                                                    res.send({ success: "false", message: "Something went wrong || Info Table" });
                                                }
                                            });

                                            // db.query("Update hp_users_pitch_limit SET remaining_pitch='5' WHERE user_id=?", userid, function (error1,
                                            //     results1,
                                            //     fields1){
                                            //     if (results1){

                                            //     }
                                            //    else{
                                            //         console.log(error1,
                                            //             results1,
                                            //             fields1)
                                            //         res.send({ success: "false", message: "Something went wrong || Info Table" });
                                            //     }
                                            //     });
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
                    console.log("12345bhfgbhnbmmmmmmmmmmm");
                    fileExtension = '';
                    filename = '';
                    thisFile = [];
                    thisFile = value;
                    if (thisFile.mimetype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
                        console.log('--------mimetype-------', thisFile.mimetype)
                        fileExtension = thisFile.name.split(/\.(?=[^\.]+$)/);
                        console.log('--------> fileExtension', fileExtension);
                        fileType = fileExtension[1]
                        console.log('fileType', '===========', fileType);
                    } else if (thisFile.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                        console.log('--------mimetype-------', thisFile.mimetype)
                        fileExtension = thisFile.name.split(/\.(?=[^\.]+$)/);
                        console.log('--------> fileExtension', fileExtension);
                        fileType = fileExtension[1]
                        console.log('fileType', '===========', fileType);
                    } else {
                        if (thisFile.mimetype == 'application/octet-stream') {
                            console.log('--------mimetype-------', thisFile.mimetype)
                            fileExtension = thisFile.name.split(/\.(?=[^\.]+$)/);
                            fileType = fileExtension[1];
                            //console.log('fileExtension', fileExtension);
                        } else {
                            console.log('--------mimetype-------', thisFile.mimetype)
                            fileExtension = thisFile.mimetype.split("/");
                            fileType = fileExtension[0];
                        }
                    }
                    filename = "pitch_" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000) + '.' + fileExtension[1];
                    // console.log(filename);
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
                                        console.log('File Added')
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
                                console.log("12345");
                                // configs is now a map of JSON 
                                // console.log('SaveABle LENGTH', saveAble.length);
                                // console.log('Counter', counter_temp);
                                res.send({ success: "true", message: "New Pitch Added", pitch: pitchID });





                                db.query("SELECT remaining_pitch FROM `hp_users_pitch_limit` where user_id=?", userid, function (error1,
                                    results1,
                                    fields1) {
                                    if (results1) {
                                        var limit_data = results1[0].remaining_pitch;
                                        console.log("fdhgfh", results1[0].remaining_pitch);
                                        if (limit_data != -1 && limit_data != 0) {
                                            limit_data = limit_data - 1;
                                        }
                                        db.query("Update hp_users_pitch_limit SET remaining_pitch=? WHERE user_id=?", [limit_data, userid], function (error1,
                                            results2,
                                            fields2) {
                                            if (results2) {

                                            }
                                            else {
                                                console.log(error2,
                                                    results2,
                                                    fields2)
                                                res.send({ success: "false", message: "Something went wrong || Info Table" });
                                            }
                                        });
                                    }
                                    else {
                                        console.log(error1,
                                            results1,
                                            fields1)
                                        res.send({ success: "false", message: "Something went wrong || Info Table" });
                                    }
                                });
                                // db.query("Update hp_users_pitch_limit SET remaining_pitch='5' WHERE user_id=?", userid, function (error1,
                                //     results1,
                                //     fields1) {
                                //     if (results1) {

                                //     }
                                //     else {
                                //         console.log(error1,
                                //             results1,
                                //             fields1)
                                //         res.send({ success: "false", message: "Something went wrong || Info Table" });
                                //     }
                                // });
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

    static upgradePlanEmail(req, res) {

        var smtpTransport = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.HPEMAILUSER,
                pass: process.env.PASSWORD
            }
        });

        var token = req.headers['access-token'];
        let userid = '';
        jwt.verify(token, jwtsecret, function (err, decoded) {
            if (err) {
                return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
            } else {
                userid = decoded.user;
            }
        });
        db.query('SELECT * from hp_users  WHERE hp_users.user_id = ?', userid, function (error, results, fields) {
            if (results.length) {
                console.log(results[0].first_name);
                // -------------------------------mail sending-----------------------------
                var tomail = results[0].email;
                var share = '';
                var newEmail = '';
                var emailLog = {};
                var subject = "Your Account Needs an Update";
                // setup e-mail data with unicode symbols
                // Email Body Builder 
                var newEmail = `<p><span style="color: #000000;"><span style="font-family: Helvetica, serif;">You have reached your maximum number of pitches within your hubPitch Bundle account. In order to continue sending pitches to your clients you will need to upgrade your subscription.</span></span></p>
                <p><span style="color: #000000;"><span style="font-family: Helvetica, serif;"><u>To Upgrade Your Subscription</u></span></span></p>
                <p><span style="color: #000000;"><span style="font-family: Helvetica, serif;">1. Sign in to your account at&nbsp;</span></span><a href="http://bundle-hubpitch.com"><span style="color: #0000ff;"><span style="font-family: Helvetica, serif;"><u>http://bundle-hubpitch.com</u></span></span></a></p>
                <p><span style="color: #000000;"><span style="font-family: Helvetica, serif;">2. Click on your Account Name (top right corner of the screen)</span></span></p>
                <p><span style="color: #000000;"><span style="font-family: Helvetica, serif;">3. Click on My Subscription</span></span></p>
                <p>&nbsp;</p>
                <p><span style="color: #000000;"><span style="font-family: Helvetica, serif;">We look forward to hearing about your continued sales success!</span></span></p>
                <p>&nbsp;</p>
                <p><span style="color: #000000;"><span style="font-family: Helvetica, serif;">-The hubPitch Team</span></span></p>`
                var mailOptions = {
                    from: process.env.HPEMAILUSER, // sender address
                    to: tomail, // list of receivers
                    subject: subject, // Subject line
                    html: newEmail
                };
                smtpTransport.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send({ success: true, message: 'Mail send succesfully' });
                    }
                })
                //res.send({ success: "true", data: results });
            } else {
                console.log(error, results, fields);
            }
        });

    }
    static async addPitchDraft(req, res) {
        try {

            const pitchData = Joi.validate(Object.assign(req.params, req.body, req.flies), {
                company_name: Joi.string()
                    .min(3)
                    .required(),
                pitch_text: Joi.allow()
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
                is_published: 'no',
            }

            console.log(newPitch);
            if (_.size(req.files) == 1 && _.size(req.files['pitch_files']) == 7) {
                fileExtension = '';
                filename = '';
                thisFile = req.files['pitch_files'];
                console.log('thisFile===========>', thisFile)
                if (thisFile.mimetype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
                    console.log('--------mimetype-------', thisFile.mimetype)
                    fileExtension = thisFile.name.split(/\.(?=[^\.]+$)/);
                    console.log('--------> fileExtension', fileExtension);
                    fileType = fileExtension[1]
                    console.log('fileType', '===========', fileType);
                } else if (thisFile.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    console.log('--------mimetype-------', thisFile.mimetype)
                    fileExtension = thisFile.name.split(/\.(?=[^\.]+$)/);
                    console.log('--------> fileExtension', fileExtension);
                    fileType = fileExtension[1]
                    console.log('fileType', '===========', fileType);
                } else {
                    if (thisFile.mimetype == 'application/octet-stream') {
                        console.log('--------mimetype-------', thisFile.mimetype)
                        fileExtension = thisFile.name.split(/\.(?=[^\.]+$)/);
                        fileType = fileExtension[1]
                    } else {
                        console.log('--------mimetype-------', thisFile.mimetype)
                        fileExtension = thisFile.mimetype.split("/");
                        fileType = fileExtension[0];
                        console.log('fileType --------- NON-octet-stream', fileType)
                    }
                    console.log('thisFile-------->', fileType);
                    console.log('TYPE OF-------->', typeof fileType);
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
                                console.log('saveAble=====>', saveAble);
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
                                            db.query("SELECT remaining_pitch FROM `hp_users_pitch_limit` where user_id=?", userid, function (error1,
                                                results1,
                                                fields1) {
                                                if (results1) {
                                                    // var limit_data = results1[0].remaining_pitch;
                                                    // if (limit_data != -1 && limit_data != 0) {
                                                    //     limit_data = limit_data - 1;
                                                    // }
                                                    // db.query("Update hp_users_pitch_limit SET remaining_pitch=? WHERE user_id=?", [limit_data, userid], function (error1,
                                                    //     results2,
                                                    //     fields2) {
                                                    //     if (results2) {

                                                    //     }
                                                    //     else {
                                                    //         console.log(error2,
                                                    //             results2,
                                                    //             fields2)
                                                    //         res.send({ success: "false", message: "Something went wrong || Info Table" });
                                                    //     }
                                                    // });
                                                }
                                                else {
                                                    console.log(error1,
                                                        results1,
                                                        fields1)
                                                    res.send({ success: "false", message: "Something went wrong || Info Table" });
                                                }
                                            });

                                            // db.query("Update hp_users_pitch_limit SET remaining_pitch='5' WHERE user_id=?", userid, function (error1,
                                            //     results1,
                                            //     fields1){
                                            //     if (results1){

                                            //     }
                                            //    else{
                                            //         console.log(error1,
                                            //             results1,
                                            //             fields1)
                                            //         res.send({ success: "false", message: "Something went wrong || Info Table" });
                                            //     }
                                            //     });
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
                    if (thisFile.mimetype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
                        console.log('--------mimetype-------', thisFile.mimetype)
                        fileExtension = thisFile.name.split(/\.(?=[^\.]+$)/);
                        console.log('--------> fileExtension', fileExtension);
                        fileType = fileExtension[1]
                        console.log('fileType', '===========', fileType);
                    } else if (thisFile.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                        console.log('--------mimetype-------', thisFile.mimetype)
                        fileExtension = thisFile.name.split(/\.(?=[^\.]+$)/);
                        console.log('--------> fileExtension', fileExtension);
                        fileType = fileExtension[1]
                        console.log('fileType', '===========', fileType);
                    } else {
                        if (thisFile.mimetype == 'application/octet-stream') {
                            console.log('--------mimetype-------', thisFile.mimetype)
                            fileExtension = thisFile.name.split(/\.(?=[^\.]+$)/);
                            fileType = fileExtension[1];
                            //console.log('fileExtension', fileExtension);
                        } else {
                            console.log('--------mimetype-------', thisFile.mimetype)
                            fileExtension = thisFile.mimetype.split("/");
                            fileType = fileExtension[0];
                        }
                    }
                    filename = "pitch_" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000) + '.' + fileExtension[1];
                    // console.log(filename);
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
                                        console.log('File Added')
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
                                db.query("Update hp_users_pitch_limit SET remaining_pitch='5' WHERE user_id=?", userid, function (error1,
                                    results1,
                                    fields1) {
                                    if (results1) {

                                    }
                                    else {
                                        console.log(error1,
                                            results1,
                                            fields1)
                                        res.send({ success: "false", message: "Something went wrong || Info Table" });
                                    }
                                });
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
                    pitch_delete_type: Joi.string().required(),
                    pitch_id: Joi.string().required()
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
                db.query("DELETE FROM hp_pitch_master WHERE pitch_id=?", req.body.pitch_id, function (error, results, fields) {
                    if (results.affectedRows) {
                        res.send({ success: "true", message: "Pitch Deleted!" });
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
                    pitch_delete_type: Joi.string().required(),
                    att_pitch_id: Joi.string().required(),
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
                db.query("DELETE FROM hp_pitch_info WHERE pitch_info_id=?", req.body.att_pitch_id, function (error, results, fields) {
                    if (results.affectedRows) {
                        res.send({ success: "true", message: "Pitch Page Deleted!" });
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
        db.query("SELECT DISTINCT (SELECT COUNT(*) FROM hp_conversation JOIN hp_pitch_chat_tbl ON hp_conversation.conversation_id = hp_pitch_chat_tbl.conversation_id JOIN hp_pitch_master ON hp_conversation.pitch_id = hp_pitch_master.pitch_id WHERE hp_pitch_chat_tbl.receiver='" + userid + "' AND hp_pitch_master.pitch_id = master.pitch_id  AND hp_pitch_chat_tbl.status = 'unread') as messages, master.user_id,master.pitch_id,master.company_name,master.is_published,count(*) as page_count,master.created FROM hp_pitch_master as master JOIN hp_pitch_info ON master.pitch_id=hp_pitch_info.pitch_id WHERE master.user_id=? GROUP BY hp_pitch_info.pitch_id ORDER BY master.created DESC", userid, function (
            error,
            results,
            fields
        ) {
            if (results) {
                console.log(results);
                res.send({ success: "true", data: results });
            } else {
                console.log(error, results, fields);
                return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
            }
        });
    }

    static async viewPitchDetails(req, res) {
        var tagId = req.query.publish;
        if (tagId == "publish") {
            db.query("SELECT CONCAT(users.first_name,' ',users.last_name) AS username,master_tbl.share_times,(SELECT SUM(hp_pitch_viewer_analytics.views) FROM hp_pitch_viewer_analytics WHERE hp_pitch_viewer_analytics.pitch_info_id = info.pitch_info_id) as total_views,info.pitch_info_id,master_tbl.company_name,master_tbl.user_id,master_tbl.pitch_id,master_tbl.created,info.pitch_attachment_type,info.pitch_attachment_name,info.pitch_attachment_text,(SELECT COUNT(*) FROM hp_pitch_page_notes WHERE hp_pitch_page_notes.pitch_info_id = info.pitch_info_id) as note_count FROM hp_pitch_info as info LEFT JOIN hp_pitch_master as master_tbl ON info.pitch_id=master_tbl.pitch_id LEFT JOIN hp_pitch_analytics as analysis ON master_tbl.pitch_id = analysis.pitch_id JOIN hp_users as users ON master_tbl.user_id = users.user_id WHERE master_tbl.pitch_id =  ?", req.params.id, function (
                error,
                results,
                fields
            ) {
                console.log('------------------1', error,
                    results,
                    fields)
                if (results) {
                    res.render('userViews/pitchModule/viewPitch', { title: 'View Pitch || Hub Pitch', dir_parth: '/uploads/test/', data: results, results_length: results.length, documents_viewer: 'true', view_pitch: process.env.SITE_URL + 'viewer/' + results[0].url_token, username: results[0].username, draf: true });
                } else {
                    console.log(error, results, fields);
                    return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
                }
            });

        }
        else {
            db.query("SELECT CONCAT(users.first_name,' ',users.last_name) AS username,manager.url_token,master_tbl.share_times,(SELECT SUM(hp_pitch_viewer_analytics.views) FROM hp_pitch_viewer_analytics WHERE hp_pitch_viewer_analytics.pitch_info_id = info.pitch_info_id) as total_views,info.pitch_info_id,master_tbl.company_name,master_tbl.user_id,master_tbl.pitch_id,master_tbl.created,info.pitch_attachment_type,info.pitch_attachment_name,info.pitch_attachment_text,(SELECT COUNT(*) FROM hp_pitch_page_notes WHERE hp_pitch_page_notes.pitch_info_id = info.pitch_info_id) as note_count FROM hp_pitch_info as info LEFT JOIN hp_pitch_master as master_tbl ON info.pitch_id=master_tbl.pitch_id LEFT JOIN hp_pitch_analytics as analysis ON master_tbl.pitch_id = analysis.pitch_id JOIN hp_pitch_manager as manager ON master_tbl.pitch_id = manager.pitch_id JOIN hp_users as users ON master_tbl.user_id = users.user_id WHERE master_tbl.pitch_id =  ?", req.params.id, function (
                error,
                results,
                fields
            ) {
                console.log('------------------2', error,
                    results,
                    fields)
                if (results) {
                    res.render('userViews/pitchModule/viewPitch', { title: 'View Pitch || Hub Pitch', dir_parth: '/uploads/test/', data: results, results_length: results.length, documents_viewer: 'true', view_pitch: process.env.SITE_URL + 'viewer/' + results[0].url_token, username: results[0].username, draf: false });
                } else {
                    console.log(error, results, fields);
                    return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
                }
            });
        }

    }
    static async viewPitchDraftDetails(req, res) {
        // console.log(req);
        db.query("SELECT CONCAT(users.first_name,' ',users.last_name) AS username,manager.url_token,master_tbl.share_times,(SELECT SUM(hp_pitch_viewer_analytics.views) FROM hp_pitch_viewer_analytics WHERE hp_pitch_viewer_analytics.pitch_info_id = info.pitch_info_id) as total_views,info.pitch_info_id,master_tbl.company_name,master_tbl.user_id,master_tbl.pitch_id,master_tbl.created,info.pitch_attachment_type,info.pitch_attachment_name,info.pitch_attachment_text,(SELECT COUNT(*) FROM hp_pitch_page_notes WHERE hp_pitch_page_notes.pitch_info_id = info.pitch_info_id) as note_count FROM hp_pitch_info as info LEFT JOIN hp_pitch_master as master_tbl ON info.pitch_id=master_tbl.pitch_id LEFT JOIN hp_pitch_analytics as analysis ON master_tbl.pitch_id = analysis.pitch_id JOIN hp_pitch_manager as manager ON master_tbl.pitch_id = manager.pitch_id JOIN hp_users as users ON master_tbl.user_id = users.user_id WHERE master_tbl.pitch_id =  ?", req.params.id, function (
            error,
            results,
            fields
        ) {
            if (results) {
                console.log(results)
                if (!results[0].url_token) {
                    results[0].url_token = "published";
                }
                res.render('userViews/pitchModule/viewPitch', { title: 'View Pitch || Hub Pitch', dir_parth: '/uploads/test/', data: results, results_length: results.length, documents_viewer: 'true', view_pitch: process.env.SITE_URL + 'viewer/' + results[0].url_token, username: results[0].username });
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
                pitch_id: Joi.string().required(),
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
            db.query('SELECT * ,(SELECT sharing_tracking FROM hp_membership_plan where plan_id =(SELECT plan_id FROM hp_users where user_id="' + userid + '")) as sharing_tracking_permission FROM hp_email_log WHERE `pitch_id` = ?', req.body.pitch_id, function (error, results, fields) {
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
                conversation_id: Joi.string().required(),
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
            var token = req.headers['access-token'];
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                conversation_id: Joi.string().required(),
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
                //console.log(results)
                res.render('userViews/pitchModule/editPitch', { title: 'View Pitch || Hub Pitch', dir_parth: '/uploads/test/', data: results, results_length: results.length, documents_viewer: 'true' });
            } else {
                console.log(error, results, fields);
                return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
            }
        });
    }

    static async editText(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body, req.flies), {
                pitch_info_id: Joi.string().required(),
                pitch_info_text: Joi.string().required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }

            db.query('UPDATE hp_pitch_info SET pitch_attachment_text=? WHERE pitch_info_id=' + req.body.pitch_info_id, req.body.pitch_info_text, function (error,
                results,
                fields) {
                if (error) {
                    console.log(error,
                        results,
                        fields);
                    res.send({ success: false, message: 'Something went wrong in Pitch Text', error: error });
                }
                res.send({ success: true, message: 'Pitch Text Updated', error: error });
            });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
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

            db.query('SELECT (SELECT user_to_customer_messaging FROM `hp_membership_plan` where plan_id = (select plan_id from hp_users where user_id ="' + userid + '"))as msg, hp_conversation.conversation_id,hp_pitch_chat_tbl.sender,COUNT(*) as messages FROM hp_conversation JOIN hp_pitch_chat_tbl ON hp_conversation.conversation_id = hp_pitch_chat_tbl.conversation_id WHERE hp_conversation.pitch_id=? GROUP BY hp_conversation.conversation_id', req.body.pitch_id, function (
                error,
                results,
                fields
            ) {
                if (error) {
                    res.send({ success: false, error });
                }
                if (results) {
                    if (results.length == 0) {
                        db.query('SELECT user_to_customer_messaging as "msg" FROM `hp_membership_plan` where plan_id = (select plan_id from hp_users where user_id ="' + userid + '")', function (
                            error1,
                            results1,
                            fields1
                        ) {
                            if (error1) {
                                res.send({ success: false, error1 });
                            }
                            if (results1) {

                                res.send({ success: true, data: results1 });
                            }
                        });
                    }
                    else {
                        res.send({ success: true, data: results });
                    }

                }
            });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static markAsReadConversation(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                conversation_id: Joi.string().required(),
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }

            db.query('UPDATE `hp_pitch_chat_tbl` SET `status`="read" WHERE conversation_id =?', req.body.conversation_id, function (
                error,
                results,
                fields
            ) {
                if (error) {
                    res.send({ success: false, error });
                }
                if (results) {
                    res.send({ success: true });
                }
            });

        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static addNewPitchInExiting(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body, req.flies), {
                pitch_id: Joi.string().required(),
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
            var fileType = '';
            var thisFile = [];
            var saveAble = [];
            let counter = 0;
            if (_.size(req.files) == 1 && _.size(req.files['pitch_files']) == 7) {
                fileExtension = '';
                filename = '';
                thisFile = [];
                thisFile = req.files['pitch_files'];
                if (thisFile.mimetype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
                    console.log(thisFile.mimetype)
                    fileExtension = thisFile.name.split(/\.(?=[^\.]+$)/);
                    console.log('--------> fileExtension', fileExtension);
                    fileType = fileExtension[1]
                    console.log('fileType', '===========', fileType);
                } else if (thisFile.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    console.log(thisFile.mimetype)
                    fileExtension = thisFile.name.split(/\.(?=[^\.]+$)/);
                    console.log('--------> fileExtension', fileExtension);
                    fileType = fileExtension[1]
                    console.log('fileType', '===========', fileType);
                } else {
                    if (thisFile.mimetype == 'application/octet-stream') {
                        fileExtension = thisFile.name.split(/\.(?=[^\.]+$)/);
                        fileType = fileExtension[1];
                    } else {
                        fileExtension = thisFile.mimetype.split("/");
                        fileType = fileExtension[0];
                    }
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
                        let pitchID = req.body.pitch_id
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
                                    //"SELECT * FROM hp_pitch_viewers where pitch_id=?", pitchID
                                    db.query("SELECT hp_pitch_viewers.*,hp_pitch_master.is_published FROM hp_pitch_viewers RIGHT JOIN hp_pitch_master ON hp_pitch_viewers.pitch_id = hp_pitch_master.pitch_id where hp_pitch_master.pitch_id=?", pitchID, function (error1, results1, fields1) {
                                        if (error1) {
                                            console.log(error1, results1, fields1);
                                            res.send({ success: "true", message: "New Pitch Added || In Something Went Wrong" });
                                        }

                                        res.send({ success: "true", message: "New Pitch Added", viewers: results1, publish: results1[0].is_published });
                                    })
                                } else {
                                    console.log(error,
                                        results,
                                        fields)
                                    res.send({ success: "false", message: "Something went wrong || Info Table" });
                                }
                            })
                        })
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
                    if (thisFile.mimetype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
                        console.log(thisFile.mimetype)
                        fileExtension = thisFile.name.split(/\.(?=[^\.]+$)/);
                        console.log('--------> fileExtension', fileExtension);
                        fileType = fileExtension[1]
                        console.log('fileType', '===========', fileType);
                    } else if (thisFile.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                        console.log(thisFile.mimetype)
                        fileExtension = thisFile.name.split(/\.(?=[^\.]+$)/);
                        console.log('--------> fileExtension', fileExtension);
                        fileType = fileExtension[1]
                        console.log('fileType', '===========', fileType);
                    } else {
                        if (thisFile.mimetype == 'application/octet-stream') {
                            fileExtension = thisFile.name.split(/\.(?=[^\.]+$)/);
                            fileType = fileExtension[1];
                            //console.log('fileExtension', fileExtension);
                        } else {
                            fileExtension = thisFile.mimetype.split("/");
                            fileType = fileExtension[0];
                        }
                    }
                    filename = "pitch_" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000) + '.' + fileExtension[1];
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
                    let pitchID = req.body.pitch_id;
                    let counter_temp = 1;
                    let newPitchInfo = {}
                    async.forEachOf(saveAble, function (value, key, callback) {
                        value['pitch_attachment']['pitch_id'] = pitchID;
                        db.query("INSERT INTO hp_pitch_info SET?", value['pitch_attachment'], function (error,
                            results,
                            fields) {
                            if (results) {
                                console.log('File Added')
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
                        //configs is now a map of JSON 
                        // console.log('SaveABle LENGTH', saveAble.length);
                        // console.log('Counter', counter_temp);
                        db.query("SELECT * FROM hp_pitch_viewers where pitch_id=?", pitchID, function (error1, results1, fields1) {
                            if (error1) {
                                console.log(error1, results1, fields1);
                                res.send({ success: "true", message: "New Pitch Added", viewers: 'Something Went Wrong' });
                            }
                            res.send({ success: "true", message: "New Pitch Added", viewers: results1 });
                        })
                    });
                });
            }
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static sharePitchWithEmail(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                email_id: Joi.any().required(),
                email_body: Joi.string().required(),
                pitch_token: Joi.string().required(),
                sender_name: Joi.string().required(),
                pitch_url: Joi.string().required()
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
            var smtpTransport = nodemailer.createTransport({
                service: process.env.SERVICE,
                auth: {
                    user: process.env.HPEMAILUSER,
                    pass: process.env.PASSWORD
                }
            });

            db.query('SELECT company_name FROM hp_users_info where user_id=?', userid, function (error,
                results,
                fields) {
                if (error) {
                    res.send({ success: "false", message: 'User Token || SOMETHING WENT WRONG || Please Logout and Login Again!' });
                }
                let emailAddress = JSON.parse(req.body.email_id)
                //console.log(emailAddress);
                var tomail = "";
                let share = '';
                let newEmail = '';
                let emailLog = {};
                let subject = 'You are invited to view a presentation pitch by ' + req.body.sender_name + ' ';
                subject = subject + results[0].company_name != '' ? 'You are invited to view a presentation pitch by ' + req.body.sender_name + ' at ' + results[0].company_name : 'You are invited to view a presentation pitch by ' + req.body.sender_name + ' '
                async.forEachOf(emailAddress, function (value, key, callback) {

                    // CREATE END USER
                    var randompassword = Math.random()
                        .toString(36)
                        .slice(-8);

                    var randomToken = Math.random()
                        .toString(36)
                        .slice(-8);
                    var newViewer = {
                        viewer_id: uuidV4(),
                        pitch_id: req.body.pitch_token,
                        user_id: userid,
                        view_token: randomToken,
                        email: value,
                        password: md5(randompassword)
                    };

                    db.query("INSERT INTO hp_pitch_user_viewer SET ?", newViewer, function (
                        error,
                        results,
                        fields
                    ) {
                        if (error) {
                            console.log(error);
                            res.send({ success: "false", message: "Something went wrong" });
                        }

                        let tempData = {
                            user_id: newViewer.viewer_id,
                            token_value: ' ',
                            randompassword: randompassword
                        }
                        db.query("INSERT INTO hp_users_tmp SET?", tempData, function (
                            error1,
                            results1,
                            fields1
                        ) {
                            if (error1) {
                                console.log(error);
                                console.log("Something went wrong at Temp Data");
                            }
                            if (results1) {
                                console.log('Viewer Added In Temp!')
                            }
                        });
                        // // -------------------------------mail sending-----------------------------
                        tomail = "";
                        share = '';
                        newEmail = '';
                        emailLog = {};
                        tomail = value;
                        // setup e-mail data with unicode symbols
                        // Email Body Builder 
                        newEmail = req.body.email_body + '<br/> <p> Please click on this link to view the documents that have been shared with you by ' + req.body.sender_name + ': <a href="' + req.body.pitch_url + '?viewer=' + randomToken + '" target="blank"> ' + req.body.pitch_url + '?viewer=' + randomToken + '</a></p><br /><p> <strong> Here is your password to access presentation: </strong>' + randompassword + ' </p><br/>  <div><em>Please review the documents immediately.</em></div><br/><div>**You can add your own notes to each document, send messages to your contact, as well as share with your team (all within the platform which is hyperlinked above).**</div><br/> <br/> <p><small> Thanks </small> <br/> <small> hubPitch Team </small><br/> <a href="https://www.hubpitch.com/" target="blank"> www.hubpitch.com </a> </p>'
                        var mailOptions = {
                            from: process.env.HPEMAILUSER, // sender address
                            to: tomail, // list of receivers
                            subject: subject, // Subject line
                            html: newEmail
                        };
                        smtpTransport.sendMail(mailOptions, function (err, info) {
                            if (err) {
                                console.log(err);
                            } else {
                                emailLog = {
                                    'pitch_id': req.body.pitch_token,
                                    'email_body': req.body.email_body,
                                    'email_address': value
                                }
                                db.query('INSERT into hp_pitch_viewers SET?', emailLog, function (error,
                                    results,
                                    fields) {
                                    console.log(error,
                                        results,
                                        fields);
                                    if (error) {
                                        res.send({ success: "false", message: "Something went wrong || EMAIL Analytics" });
                                    }
                                    callback();
                                })
                            }
                        })
                    });
                }, function (err) {
                    if (err) console.error(err.message);
                    // configs is now a map of JSON 
                    res.send({ success: "true", message: 'Email Sent' });
                });
            });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }
    static updateSharePitchWithEmail(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                pre_email_id: Joi.any().required(),
                new_email_id: Joi.allow(),
                email_body: Joi.string().required(),
                pitch_id: Joi.string().required(),
                sender_name: Joi.string().required(),
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
            var smtpTransport = nodemailer.createTransport({
                service: process.env.SERVICE,
                auth: {
                    user: process.env.HPEMAILUSER,
                    pass: process.env.PASSWORD
                }
            });

            let pre_emailAddress = JSON.parse(req.body.pre_email_id)
            var tomail = "";
            let share = '';
            let newEmail = '';
            let emailLog = {};
            db.query('SELECT company_name FROM hp_users_info where user_id=?', userid, function (error,
                results,
                fields) {
                if (error) {
                    res.send({ success: "false", message: 'User Token || SOMETHING WENT WRONG || Please Logout and Login Again!' });
                }
                let subject = 'You are invited to view a presentation pitch by ' + req.body.sender_name + ' ';
                subject = subject + results[0].company_name != '' ? 'You are invited to view a presentation pitch by ' + req.body.sender_name + ' at ' + results[0].company_name : 'You are invited to view a presentation pitch by ' + req.body.sender_name + ' '
                db.query('SELECT url_token FROM hp_pitch_manager where pitch_id=?', req.body.pitch_id, function (error,
                    results,
                    fields) {
                    if (error) {
                        res.send({ success: "false", message: 'Issue In URL Token || SOMETHING WENT WRONG' });
                    }

                    let pitch_url = results[0].url_token;
                    async.forEachOf(pre_emailAddress, function (value, key, callback) {
                        // // -------------------------------mail sending-----------------------------
                        tomail = "";
                        share = '';
                        newEmail = '';
                        tomail = value;
                        // setup e-mail data with unicode symbols
                        // Email Body Builder 
                        newEmail = req.body.email_body + '<br/> <p> Please click on this link to view the documents that have been shared with you by ' + req.body.sender_name + ': <a href="' + process.env.SITE_URL + pitch_url + '" target="blank">' + process.env.SITE_URL + 'viewer/' + pitch_url + '</a></p> <br/><br/>  <div><em>Please review the documents immediately.</em></div><br/><div>**You can add your own notes to each document, send messages to your contact, as well as share with your team (all within the platform which is hyperlinked above).**</div><br/> <br/> <p><small> Thanks </small> <br/> <small> hubPitch Team </small><br/> <a href="https://www.hubpitch.com/" target="blank"> www.hubpitch.com </a> </p>'
                        var mailOptions = {
                            from: process.env.HPEMAILUSER, // sender address
                            to: tomail, // list of receivers
                            subject: subject, // Subject line
                            html: newEmail
                        };
                        smtpTransport.sendMail(mailOptions, function (err, info) {
                            if (err) {
                                console.log(err);
                            } else {
                                callback();
                            }
                        })
                    }, function (err) {
                        if (err) console.error(err.message);
                        // configs is now a map of JSON 
                        if (req.body.new_email_id == '') {
                            res.send({ success: "true", message: 'Email Sent' });
                        } else {
                            let emailAddress = JSON.parse(req.body.new_email_id)
                            async.forEachOf(emailAddress, function (value, key, callback) {
                                // // -------------------------------mail sending-----------------------------
                                tomail = "";
                                share = '';
                                newEmail = '';
                                emailLog = {};
                                tomail = value;
                                // setup e-mail data with unicode symbols
                                // Email Body Builder 
                                newEmail = req.body.email_body + '<br/> <p> Please click on this link to view the documents that have been shared with you by ' + req.body.sender_name + ': <a href="' + process.env.SITE_URL + 'viewer/' + pitch_url + '" target="blank">' + process.env.SITE_URL + 'viewer/' + pitch_url + '</a></p> <br/><br/>  <div><em>Please review the documents immediately.</em></div><br/><div>**You can add your own notes to each document, send messages to your contact, as well as share with your team (all within the platform which is hyperlinked above).**</div><br/> <br/> <p><small> Thanks </small> <br/> <small> hubPitch Team </small><br/> <a href="https://www.hubpitch.com/" target="blank"> www.hubpitch.com </a> </p>'
                                var mailOptions = {
                                    from: process.env.HPEMAILUSER, // sender address
                                    to: tomail, // list of receivers
                                    subject: subject, // Subject line
                                    html: newEmail
                                };
                                smtpTransport.sendMail(mailOptions, function (err, info) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        emailLog = {
                                            'pitch_id': req.body.pitch_id,
                                            'email_body': req.body.email_body,
                                            'email_address': value
                                        }

                                        db.query('INSERT into hp_pitch_viewers SET?', emailLog, function (error,
                                            results,
                                            fields) {
                                            console.log(error,
                                                results,
                                                fields);
                                            if (error) {
                                                res.send({ success: "false", message: "Something went wrong || EMAIL Analytics" });
                                            }
                                            callback();
                                        })
                                    }
                                })
                            }, function (err) {
                                if (err) console.error(err.message);
                                // configs is now a map of JSON 
                                res.send({ success: "true", message: 'Email Sent' });
                            });
                        }
                    });
                });
            });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }
    static getNotes(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                pitch_info_id: Joi.string().required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }

            db.query("SELECT * FROM hp_pitch_page_notes WHERE pitch_info_id='" + req.body.pitch_info_id + "'", function (
                error,
                results,
                fields
            ) {
                if (error) {
                    console.log(error,
                        results,
                        fields);
                    console.log(req.body.pitch_info_id);
                    return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
                }
                if (results.length > 0) {
                    res.send({ success: "true", data: results });
                } else {
                    return res.status(200).send({ success: "false", message: 'No Message Found' });
                }
            });

        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async searchPitch(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                search_key: Joi.string().required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            var token = req.cookies.accesstoken;
            let userid = '';
            jwt.verify(token, jwtsecret, function (err, decoded) {
                if (err) {
                    return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    userid = decoded.user;
                }
            });
            db.query("SELECT company_name,pitch_id FROM hp_pitch_master WHERE user_id='" + userid + "' AND  company_name LIKE '%" + req.body.search_key + "%' ", function (
                error,
                results,
                fields
            ) {
                if (error) {
                    console.log(error,
                        results,
                        fields);
                    console.log(req.body.pitch_info_id);
                    return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
                }
                if (results.length > 0) {
                    res.send({ success: "true", data: results });
                } else {
                    return res.status(200).send({ success: "search_fail", message: 'No Pitch Found' });
                }
            });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async sharePitchU(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                email_id: Joi.any().required(),
                email_body: Joi.string().required(),
                pitch_id: Joi.string().required(),
                pitch_url: Joi.string().required(),
                sender_name: Joi.string().required(),
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
            var smtpTransport = nodemailer.createTransport({
                service: process.env.SERVICE,
                auth: {
                    user: process.env.HPEMAILUSER,
                    pass: process.env.PASSWORD
                }
            });
            let emailAddress = JSON.parse(req.body.email_id)
            var tomail = "";
            let share = '';
            let newEmail = '';
            let emailLog = {};
            let pitch_url = req.body.pitch_url;
            async.forEachOf(emailAddress, function (value, key, callback) {
                // CREATE END USER
                var randompassword = Math.random()
                    .toString(36)
                    .slice(-8);

                var randomToken = Math.random()
                    .toString(36)
                    .slice(-8);
                var newViewer = {
                    viewer_id: uuidV4(),
                    pitch_id: req.body.pitch_id,
                    user_id: userid,
                    view_token: randomToken,
                    email: value,
                    password: md5(randompassword)
                };
                db.query("INSERT INTO hp_pitch_user_viewer SET ?", newViewer, function (
                    error,
                    results,
                    fields
                ) {
                    if (error) {
                        console.log(error);
                        res.send({ success: "false", message: "Something went wrong" });
                    }
                    let tempData = {
                        user_id: newViewer.viewer_id,
                        token_value: ' ',
                        randompassword: randompassword
                    }
                    db.query("INSERT INTO hp_users_tmp SET?", tempData, function (
                        error1,
                        results1,
                        fields1
                    ) {
                        if (error1) {
                            console.log(error);
                            console.log("Something went wrong at Temp Data");
                        }
                        if (results1) {
                            console.log('Viewer Added In Temp!')
                        }
                    });
                    // // -------------------------------mail sending-----------------------------
                    tomail = "";
                    share = '';
                    newEmail = '';
                    tomail = value;
                    // setup e-mail data with unicode symbols
                    // Email Body Builder 
                    newEmail = req.body.email_body + '<br/> <p> Please click on this link to view the documents that have been shared with you by ' + req.body.sender_name + ': <a href="' + req.body.pitch_url + '?viewer=' + randomToken + '" target="blank"> ' + req.body.pitch_url + '?viewer=' + randomToken + '</a></p><br /><p> <strong> Here is your password to access presentation: </strong>' + randompassword + ' </p><br/><br/>  <div><em>Please review the documents immediately.</em></div><br/><div>**You can add your own notes to each document, send messages to your contact, as well as share with your team (all within the platform which is hyperlinked above).**</div><br/> <br/> <p><small> Thanks </small> <br/> <small> hubPitch Team </small><br/> <a href="https://www.hubpitch.com/" target="blank"> www.hubpitch.com </a> </p>'
                    var mailOptions = {
                        from: process.env.HPEMAILUSER, // sender address
                        to: tomail, // list of receivers
                        subject: "You're invited To Visit hubPitch by " + req.body.sender_name, // Subject line
                        html: newEmail
                    };
                    smtpTransport.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            console.log(err);
                        } else {
                            emailLog = {
                                'pitch_id': req.body.pitch_id,
                                'email_body': req.body.email_body,
                                'email_address': value
                            }
                            db.query('INSERT into hp_pitch_viewers SET?', emailLog, function (error,
                                results,
                                fields) {
                                console.log(error,
                                    results,
                                    fields);
                                if (error) {
                                    res.send({ success: "false", message: "Something went wrong || EMAIL Analytics" });
                                }
                                // callback();
                            })
                            callback();
                        }
                    })
                })
            }, function (err) {
                if (err) console.error(err.message);
                // configs is now a map of JSON 
                res.send({ success: "true", message: 'Email Sent' });
            });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async getViewerAnalysis(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                pitch_info_id: Joi.string().required()
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
            db.query(
                'SELECT hp_pitch_viewer_analytics.views,(SELECT pitch_analytics FROM hp_membership_plan where plan_id =(SELECT plan_id FROM hp_users where user_id="' + userid + '")) as analytics_permission,CONVERT_TZ(hp_pitch_viewer_analytics.created, @@session.time_zone, "+00:00") AS `utc_datetime`,hp_pitch_user_viewer.full_name,hp_pitch_user_viewer.job_title,hp_pitch_viewer_analytics.viewing_time FROM hp_pitch_viewer_analytics LEFT JOIN hp_pitch_user_viewer ON hp_pitch_viewer_analytics.viewer_id = hp_pitch_user_viewer.viewer_id  WHERE hp_pitch_viewer_analytics.pitch_info_id ="' + req.body.pitch_info_id + '"',
                function (error1, results1, fields1) {
                    if (error1) {
                        console.log(error1);
                    }
                    if (results1) {
                        res.send({
                            success: true,
                            data: results1,
                        });
                    } else {
                        res.send({
                            success: false,
                            message: "Something Went Wrong!"
                        });
                    }
                });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async createDrafLink(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                pitch_id: Joi.string().required(),
                allow_notification: Joi.string().required(),
                allow_messaging: Joi.string().required(),
                allow_share: Joi.string().required()
            });
            console.log("data" + pitchData);
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            var randomToken = Math.random()
                .toString(36)
                .slice(-8);
            let newPitch = {
                pitch_id: req.body.pitch_id,
                allow_notification: req.body.allow_notification,
                allow_messaging: req.body.allow_messaging,
                allow_share: req.body.allow_share,
                url_token: randomToken
            }
            db.query("INSERT INTO hp_pitch_manager SET?", newPitch, function (
                error,
                results,
                fields
            ) {
                if (error) {
                    console.log(error);
                    console.log("Something went wrong at Temp Data");
                    return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' })
                }
                if (results) {
                    db.query("Update hp_pitch_master SET is_published='yes' WHERE pitch_id=?", req.body.pitch_id, function (error1, results1,
                        fields1) {
                        if (error1) {
                            console.log(error1);
                            console.log("Something went wrong at Temp Data");
                            return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' })
                        }
                        var token = req.cookies.accesstoken;
                        let userid = '';
                        jwt.verify(token, jwtsecret, function (err, decoded) {
                            if (err) {
                                return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
                            } else {
                                userid = decoded.user;
                            }
                        });
                        //Update remaining pitch 
                        db.query("SELECT remaining_pitch FROM `hp_users_pitch_limit` where user_id=?", userid, function (error1,
                            results1,
                            fields1) {
                            if (results1) {
                                var limit_data = results1[0].remaining_pitch;
                                if (limit_data != -1 && limit_data != 0) {
                                    limit_data = limit_data - 1;
                                }
                                db.query("Update hp_users_pitch_limit SET remaining_pitch=? WHERE user_id=?", [limit_data, userid], function (error1,
                                    results2,
                                    fields2) {
                                    if (results2) {

                                    }
                                    else {
                                        console.log(error2,
                                            results2,
                                            fields2)
                                        res.send({ success: "false", message: "Something went wrong || Info Table" });
                                    }
                                });
                            }
                            else {
                                console.log(error1,
                                    results1,
                                    fields1)
                                res.send({ success: "false", message: "Something went wrong || Info Table" });
                            }
                        });

                        res.send({ success: "true", message: "share link created", data: randomToken });
                    })
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
    static upgradeAccount(req, res) {

        var smtpTransport = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.HPEMAILUSER,
                pass: process.env.PASSWORD
            }
        });

        var token = req.headers['access-token'];
        let userid = '';
        jwt.verify(token, jwtsecret, function (err, decoded) {
            if (err) {
                return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
            } else {
                userid = decoded.user;
            }
        });
        db.query('SELECT * from hp_users  WHERE hp_users.user_id = ?', userid, function (error, results, fields) {
            if (results.length) {
                //console.log(results[0].first_name);
                // -------------------------------mail sending-----------------------------
                var tomail = results[0].email;
                var share = '';
                var newEmail = '';
                var emailLog = {};
                var subject = "Account Update Needed – Customer Message Sent via hubPitch";
                // setup e-mail data with unicode symbols
                // Email Body Builder 
                var newEmail = `<p><span style="color: #000000;"><span style="font-family: Helvetica, serif;">You have received a message from one of your customers within your hubPitch Bundle account. In order to read &amp; respond to your customer(s) you will need to upgrade your subscription.</span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: Helvetica, serif;"><u>To Upgrade Your Subscription</u></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: Helvetica, serif;">1. Sign in to your account at&nbsp;</span></span><a href="http://bundle-hubpitch.com"><span style="color: #0000ff;"><span style="font-family: Helvetica, serif;"><u>http://bundle-hubpitch.com</u></span></span></a></p>
                    <p><span style="color: #000000;"><span style="font-family: Helvetica, serif;">2. Click on your Account Name (top right corner of screen)</span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: Helvetica, serif;">3.Click on My Subscription<br /><br /></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: Helvetica, serif;">We look forward to hearing about your continued sales success!<br /><br /><br /></span></span><span style="color: #000000;"><span style="font-family: Helvetica, serif;">-The hubPitch Team</span></span></p>`
                var mailOptions = {
                    from: process.env.HPEMAILUSER, // sender address
                    to: tomail, // list of receivers
                    subject: subject, // Subject line
                    html: newEmail
                };
                smtpTransport.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send({ success: true, message: 'Mail send succesfully' });
                    }
                })
                //res.send({ success: "true", data: results });
            } else {
                console.log(error, results, fields);
            }
        });

    }
}
module.exports = pitchController;