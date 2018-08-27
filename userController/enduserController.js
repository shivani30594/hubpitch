const db = require("../dbconfig/db");
const Joi = require("joi");
var async = require('async');
const dir = '/uploads/test';
const nodemailer = require("nodemailer");

class enduserController {

    static async viewPitch(req, res) {
        db.query("SELECT pitch_id from hp_pitch_manager where url_token=? ", req.params.id, function (
            error,
            results,
            fields
        ) {
            if (error) {
                res.send({ success: "false", message: "Something went wrong" });
            }
            if (results.length > 0) {
                db.query("SELECT info.pitch_info_id,master_tbl.company_name,master_tbl.user_id,master_tbl.pitch_id,master_tbl.created,info.pitch_attachment_type,info.pitch_attachment_name,info.pitch_attachment_text FROM hp_pitch_info as info LEFT JOIN hp_pitch_master as master_tbl ON info.pitch_id=master_tbl.pitch_id WHERE master_tbl.pitch_id = ?", results[0].pitch_id, function (
                    error,
                    results,
                    fields
                ) {
                    if (error) {
                        res.send({ success: "false", message: "Something went wrong" });
                    }
                    if (results.length > 0) {
                        res.render('enduserViews/viewPitch', { title: 'View Pitch || Hub Pitch', dir_parth: '/uploads/test/', data: results, results_length: results.length, pitch_token: results[0].pitch_id });
                    } else {
                        res.send({ success: "false", message: "Something went wrong" });
                    }
                })
            } else {
                res.send({ success: "false", message: "Something went wrong" });
            }
        })

    }

    static async pitchAnalytics(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                pitch_token: Joi.string()
                    .required(),
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            let newView = {};
            let updateView = {};
            let pitch_id = '';
            let viewCounter = 1;
            db.query("SELECT pitch_id from hp_pitch_manager where url_token=? ", req.body.pitch_token, function (
                error,
                results,
                fields
            ) {
                if (error) {
                    res.send({ success: "false", message: "Something went wrong || Pitch Token" });
                }
                if (results.length > 0) {
                    pitch_id = results[0].pitch_id
                    db.query("SELECT * from hp_pitch_analytics where pitch_id=? ", pitch_id, function (
                        error,
                        results,
                        fields
                    ) {
                        if (error) {
                            res.send({ success: "false", message: "Something went wrong || Pitch Analytics" });
                        }
                        if (results) {
                            if (results.length === 0) {
                                newView = {
                                    'pitch_id': pitch_id,
                                    'pitch_view_counter': viewCounter,
                                }
                                db.query("INSERT INTO hp_pitch_analytics SET?", newView, function (
                                    error,
                                    results,
                                    fields
                                ) {
                                    if (error) {
                                        res.send({ success: "false", message: "Something went wrong || Pitch Analytics" });
                                    }
                                    res.send({ success: "true", message: "View Added" });

                                });
                            } else {
                                viewCounter = viewCounter + results[0].pitch_view_counter
                                db.query("UPDATE hp_pitch_analytics SET pitch_view_counter ='" + viewCounter + "' WHERE `pitch_analytics` = '" + results[0].pitch_analytics + "'", function (error,
                                    results,
                                    fields) {
                                    if (error) {
                                        res.send({ success: "false", message: "Something went wrong || Pitch Analytics" });
                                    }
                                    res.send({ success: "true", message: "View Update" });
                                })
                            }
                        }
                        else {
                            res.send({ success: "false", message: "Something went wrong with SQL Analytics" });
                        }
                    });
                } else {
                    res.send({ success: "false", message: "Something went wrong with SQL" });
                }
            })
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async pitchPageView(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                pitch_token: Joi.string().required(),
                pitch_info_token: Joi.string().required(),
                page: Joi.string().required(),
                view: Joi.string().required(),
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            let dataSetROW = {};
            let avgView = '';
            db.query("SELECT pitch_view_counter as counter,hp_pitch_info.pitch_info_id as pitch_info_token,hp_pitch_info.average_view as average_view from hp_pitch_analytics JOIN hp_pitch_info ON hp_pitch_analytics.pitch_id = hp_pitch_info.pitch_id where hp_pitch_analytics.pitch_id=? ", req.body.pitch_token, function (error,
                results,
                fields) {
                dataSetROW = results;
                async.eachSeries(dataSetROW, function (value, each_callback) {
                    if (value.pitch_info_token == req.body.pitch_info_token) {
                        console.log('VIEWER CURRECT', value.average_view);
                        avgView = value.average_view + req.body.view / value.counter
                    }

                    each_callback();
                }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    if (avgView != '') {
                        db.query("UPDATE hp_pitch_info SET average_view ='" + avgView + "' WHERE `pitch_info_id` = '" + req.body.pitch_info_token + "'", function (error,
                            results,
                            fields) {
                            if (error) {
                                res.send({ success: "false", message: "Something went wrong || Pitch Analytics" });
                            }
                            res.send({ success: "true", message: "View Update" });
                        })
                    }
                });
            });

        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async sharePitch(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                email_id: Joi.string().required(),
                sender_name: Joi.string().required(),
                url: Joi.string().required(),
                pitch_token: Joi.string().required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "demo.narolainfotech@gmail.com",
                    pass: "Password123#"
                }
            });

            // -------------------------------mail sending-----------------------------
            var tomail = "";
            let share = '';
            tomail = req.body.email_id;
            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: "demo.narolainfotech@gmail.com", // sender address
                to: tomail, // list of receivers
                subject: "You're invited To Visit hubPitch by " + req.body.sender_name, // Subject line
                html: "You're invited To Visit hubPitch <br/> Here is link For The Pitch " + req.body.url + '<br/> <br/> <br/> <p><small> Thanks </small> <br/> <small> hubPitch Team </small><br/> <a href="https://www.hubpitch.com/" target="blank"> www.hubpitch.com </a> </p>'
            };
            // send mail with defined transport object
            smtpTransport.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Message sent: " + info);
                    db.query("SELECT share_times AS counter FROM hp_pitch_master where pitch_id=?", req.body.pitch_token, function (error,
                        results,
                        fields) {
                        if (error) {
                            res.send({ success: "SQL_ISSUE", message: "Something went wrong With SQL FETCH" });
                        }
                        if (results.length > 0) {
                            share = results[0].counter + 1
                            db.query("UPDATE hp_pitch_master SET share_times ='" + share + "' WHERE `pitch_id` = '" + req.body.pitch_token + "'", function (error1,
                                results1,
                                fields1) {
                                console.log(error1,
                                    results1,
                                    fields1)
                                if (error1) {
                                    res.send({ success: "SQL_ISSUE", message: "Something went wrong Updating Share"});
                                }
                                res.send({ success: "true" });
                            })
                        }
                    })
                }
            });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }
}
module.exports = enduserController;