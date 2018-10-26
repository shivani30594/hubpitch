const db = require("../dbconfig/db");
const Joi = require("joi");
var async = require('async');
const dir = '/uploads/test';
const nodemailer = require("nodemailer");
const _ = require('lodash');

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
                db.query("SELECT CONCAT(hp_users.first_name,' ',hp_users.last_name) as username,hp_users.email,info.pitch_info_id,master_tbl.company_name,master_tbl.user_id,master_tbl.user_id,master_tbl.pitch_id,master_tbl.created,info.pitch_attachment_type,info.pitch_attachment_name,info.pitch_attachment_text FROM hp_pitch_info as info LEFT JOIN hp_pitch_master as master_tbl ON info.pitch_id=master_tbl.pitch_id JOIN hp_users ON master_tbl.user_id = hp_users.user_id WHERE master_tbl.pitch_id = ?", results[0].pitch_id, function (
                    error,
                    results,
                    fields
                ) {
                    if (error) {
                        res.send({ success: "false", message: "Something went wrong" });
                    }
                    if (results.length > 0) {
                        db.query("SELECT pitch_analytics,sharing_tracking,user_to_customer_messaging FROM hp_membership_plan JOIN hp_users on hp_users.plan_id = hp_membership_plan.plan_id WHERE hp_users.user_id=?", results[0].user_id, function (
                            error1,
                            results1,
                            fields1
                        ) {
                            if (error1) {
                                console.log(error,
                                    results,
                                    fields)
                                res.render('enduserViews/viewPitch', { title: 'View Pitch || Hub Pitch', dir_parth: '/uploads/test/', data: results, results_length: results.length, pitch_token: results[0].pitch_id, user_token: results[0].user_id, user_name: results[0].username, plan: false });
                            }
                            if (results1) {
                                let pitch_analytics = results1[0].pitch_analytics
                                let plan_data = {
                                    sharing_tracking: results1[0].sharing_tracking,
                                    user_to_customer_messaging: results1[0].user_to_customer_messaging,
                                }
                                console.log('PLAN_DATA', plan_data)
                                db.query("SELECT ( select `notification_1` from hp_users_info where user_id = '" + results[0].user_id + "') AS user_setting,( select allow_notification from hp_pitch_manager where pitch_id ='" + results[0].pitch_id + "') AS pitch_setting", function (error2,
                                    results2,
                                    fields2) {
                                    if (error2) {
                                        res.render('enduserViews/viewPitch', { title: 'View Pitch || Hub Pitch', dir_parth: '/uploads/test/', data: results, results_length: results.length, pitch_token: results[0].pitch_id, user_token: results[0].user_id, user_name: results[0].username, plan: plan_data, pitch_analytics: pitch_analytics });
                                    }
                                    if (results2) {
                                        console.log(results2[0], 'user_setting')
                                        if (results2[0].user_setting == 'true' && results2[0].pitch_setting == 'true') {
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
                                            let newEmail = '';
                                            let emailLog = {};
                                            tomail = results[0].email;
                                            // setup e-mail data with unicode symbols
                                            // Email Body Builder 
                                            newEmail = 'Your Pitch :- ' + results[0].company_name + ' Is Visited By Your Invitee' + '<br/> <br/> <p><small> Thanks </small> <br/> <small> hubPitch Team </small><br/> <a href="https://www.hubpitch.com/" target="blank"> www.hubpitch.com </a> </p>'
                                            var mailOptions = {
                                                from: "demo.narolainfotech@gmail.com", // sender address
                                                to: tomail, // list of receivers
                                                subject: "Your Pitch Is Visited " + results[0].company_name, // Subject line
                                                html: newEmail
                                            };
                                            // send mail with defined transport object
                                            smtpTransport.sendMail(mailOptions, function (err, info) {
                                                if (err) {
                                                    console.log(err);
                                                    res.render('enduserViews/viewPitch', { title: 'View Pitch || Hub Pitch', dir_parth: '/uploads/test/', data: results, results_length: results.length, pitch_token: results[0].pitch_id, user_token: results[0].user_id, user_name: results[0].username, plan: plan_data, pitch_analytics: pitch_analytics });
                                                } else {
                                                    console.log('EMAIL SENT');
                                                    console.log('tomail SENT', tomail);
                                                    console.log('EMAIL SENT');
                                                    res.render('enduserViews/viewPitch', { title: 'View Pitch || Hub Pitch', dir_parth: '/uploads/test/', data: results, results_length: results.length, pitch_token: results[0].pitch_id, user_token: results[0].user_id, user_name: results[0].username, plan: plan_data, pitch_analytics: pitch_analytics });
                                                }
                                            });

                                        } else {
                                            res.render('enduserViews/viewPitch', { title: 'View Pitch || Hub Pitch', dir_parth: '/uploads/test/', data: results, results_length: results.length, pitch_token: results[0].pitch_id, user_token: results[0].user_id, user_name: results[0].username, plan: plan_data, pitch_analytics: pitch_analytics });
                                        }
                                    }
                                });
                            }
                        });

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
                email_body: Joi.string().required(),
                pitch_token: Joi.string().required(),
                user_token: Joi.strict().required(),
                user_email: Joi.strict().required(),
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
            let newEmail = '';
            let emailLog = {};
            tomail = req.body.email_id;
            // setup e-mail data with unicode symbols
            // Email Body Builder 
            newEmail = req.body.email_body + '<br/> <br/> <p><small> Thanks </small> <br/> <small> hubPitch Team </small><br/> <a href="https://www.hubpitch.com/" target="blank"> www.hubpitch.com </a> </p>'
            var mailOptions = {
                from: "demo.narolainfotech@gmail.com", // sender address
                to: tomail, // list of receivers
                subject: "You're invited To Visit hubPitch by " + req.body.sender_name, // Subject line
                html: newEmail
            };
            // send mail with defined transport object
            smtpTransport.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    db.query("SELECT ( select `notification_3` from hp_users_info where user_id = '" + req.body.user_token + "') AS user_setting,( select allow_share from hp_pitch_manager where pitch_id ='" + req.body.pitch_token + "') AS pitch_setting", function (error2,
                        results2,
                        fields2) {
                        if (error2) {
                            console.log(error2,
                                results2,
                                fields2);
                        }
                        if (results2) {
                            console.log(results2)
                            if (results2[0].user_setting == 'true' && results2[0].pitch_setting == 'true') {
                                // -------------------------------mail sending-----------------------------
                                var tomail = "";
                                let share = '';
                                let newEmail = '';
                                let emailLog = {};
                                tomail = req.body.user_email;
                                // setup e-mail data with unicode symbols
                                // Email Body Builder 
                                newEmail = 'Your Pitch Shared By ' + req.body.sender_name + 'To ' + req.body.email_id + ' <br /> With Below Email Text <br />' + req.body.email_body + '<br/> <br/> <p><small> Thanks </small> <br/> <small> hubPitch Team </small><br/> <a href="https://www.hubpitch.com/" target="blank"> www.hubpitch.com </a> </p>'
                                var mailOptions = {
                                    from: "demo.narolainfotech@gmail.com", // sender address
                                    to: tomail, // list of receivers
                                    subject: "Your Pitch Shared By " + req.body.sender_name, // Subject line
                                    html: newEmail
                                };
                                // send mail with defined transport object
                                smtpTransport.sendMail(mailOptions, function (err, info) {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        console.log('EMAIL SEND TO PITCH USER')
                                    }
                                });
                            }
                        }
                    });
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
                                if (error1) {
                                    res.send({ success: "SQL_ISSUE", message: "Something went wrong Updating Share" });
                                }
                                emailLog = {
                                    'pitch_id': req.body.pitch_token,
                                    'sender_name': req.body.sender_name,
                                    'receiver_email_address': req.body.email_id,
                                    'email_body': req.body.email_body
                                }
                                db.query('INSERT into hp_email_log SET?', emailLog, function (error,
                                    results,
                                    fields) {
                                    console.log(error,
                                        results,
                                        fields);
                                    if (error) {
                                        res.send({ success: "false", message: "Something went wrong || EMAIL Analytics" });
                                    }
                                    res.send({ success: "true", message: 'Share Notification Issus' });
                                })
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

    static async getConversation(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                conversation_id: Joi.string().required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            db.query("SELECT *,( SELECT COUNT(*) FROM hp_pitch_chat_tbl WHERE conversation_id=" + req.body.conversation_id + " AND status='unread') as unread  FROM hp_pitch_chat_tbl WHERE conversation_id=?", req.body.conversation_id, function (
                error,
                results,
                fields
            ) {
                if (error) {
                    return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
                }
                if (results.length > 0) {
                    res.send({ success: "true", data: results, unread: results[0].unread });
                } else {
                    return res.status(200).send({ success: "true", new_conversation: 'true', message: 'No Message Found' });
                }
            });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async conversationCreater(req, res) {

        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                pitch_token: Joi.string().required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            let newConversation = {
                pitch_id: req.body.pitch_token
            }
            db.query("INSERT INTO hp_conversation SET ?", newConversation, function (
                error,
                results,
                fields
            ) {
                if (results) {
                    console.log(results)
                    res.send({ success: "true", message: "Conversation created", data: results.insertId });
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

    static async getMessage(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                conversation_id: Joi.string().required(),
                user_name: Joi.string().required(),
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            db.query("SELECT * FROM hp_pitch_chat_tbl WHERE conversation_id=" + conversation_id + "receiver=" + user_name + "status = 'unread'", function (
                error,
                results,
                fields
            ) {
                if (error) {
                    return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
                }
                if (results.length > 0) {
                    res.send({ success: "true", data: results });
                } else {
                    return res.status.send({ success: "true", message: 'No Message Found' });
                }
            });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async sendMessage(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                conversation_id: Joi.string().required(),
                sender: Joi.string().required(),
                receiver: Joi.string().required(),
                chat_text: Joi.string().required(),
                pitch_token: Joi.string().required(),
                company_name: Joi.string().required(),
                user_email: Joi.string().required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            let sendMsg = {
                conversation_id: req.body.conversation_id,
                sender: req.body.sender,
                receiver: req.body.receiver,
                chat_text: req.body.chat_text,
            }
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "demo.narolainfotech@gmail.com",
                    pass: "Password123#"
                }
            });

            db.query("SELECT ( select `notification_2` from hp_users_info where user_id = '" + req.body.receiver + "') AS user_setting,( select allow_messaging from hp_pitch_manager where pitch_id ='" + req.body.pitch_token + "') AS pitch_setting", function (error2,
                results2,
                fields2) {
                if (error2) {
                    console.log(error2,
                        results2,
                        fields2);
                }
                if (results2) {
                    console.log(results2)
                    if (results2[0].user_setting == 'true' && results2[0].pitch_setting == 'true') {
                        // -------------------------------mail sending-----------------------------
                        var tomail = "";
                        let share = '';
                        let newEmail = '';
                        let emailLog = {};
                        tomail = req.body.user_email;
                        // setup e-mail data with unicode symbols
                        // Email Body Builder 
                        newEmail = 'You received message by ' + req.body.sender_name + ' On ' + req.body.company_name + ' Pitch  <br /> With Below Text <br />' + req.body.chat_text + '<br/> <br/> <p><small> Thanks </small> <br/> <small> hubPitch Team </small><br/> <a href="https://www.hubpitch.com/" target="blank"> www.hubpitch.com </a> </p>'
                        var mailOptions = {
                            from: "demo.narolainfotech@gmail.com", // sender address
                            to: tomail, // list of receivers
                            subject: 'You received message by ' + req.body.sender + ' On ' + req.body.company_name + ' Pitch', // Subject line
                            html: newEmail
                        };
                        // send mail with defined transport object
                        smtpTransport.sendMail(mailOptions, function (err, info) {
                            if (err) {
                                console.log(err)
                                console.log('SMTP')
                            } else {
                                console.log('EMAIL SEND TO PITCH USER')
                            }
                        });
                    }
                }
            });
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

    static checkforUpdate(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                // pitch_text_arr: Joi.any().required(),counter_r
                pitch_token: Joi.string().required(),
                counter: Joi.string().required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            db.query("SELECT info.pitch_info_id,info.pitch_attachment_text, TIMESTAMPDIFF(second,info.updated, NOW()) as time_dif FROM hp_pitch_info as info LEFT JOIN hp_pitch_master as master_tbl ON info.pitch_id=master_tbl.pitch_id WHERE master_tbl.pitch_id = ?", req.body.pitch_token, function (
                error,
                results,
                fields
            ) {
                if (error) {
                    console.log(error, results, fields);
                    res.send({ success: "false", message: "Something went wrong" });
                }
                if (results.length > 0) {
                    let counter = req.body.counter
                    let flag = 0;
                    _.forEach(results, function (value, key) {
                        if (value.time_dif < 5) {
                            if (value.time_dif != null) {
                                flag = flag + 1;
                            }
                        }
                    });
                    if (flag > 0) {
                        res.send({ success: "true", status: "Updated" });
                    } else {
                        if (results.length == counter) {
                            res.send({ success: "true", status: "No_Update" });
                        } else {
                            res.send({ success: "true", status: "Updated" });
                        }
                    }
                } else {
                    res.send({ success: "false", message: "Something went wrong" });
                }
            })
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static noteCreater(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                pitch_info_id: Joi.string().required(),
                end_user_name: Joi.string().required(),
                text: Joi.string().required(),
                token: Joi.string().required(),
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            let newNote = {
                pitch_info_id: req.body.pitch_info_id,
                end_user_name: req.body.end_user_name,
                text: req.body.text,
                token: req.body.token
            }
            db.query("INSERT INTO hp_pitch_page_notes SET ?", newNote, function (
                error,
                results,
                fields
            ) {
                if (results) {
                    console.log(results)
                    res.send({ success: "true", message: "New Note created" });
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

    static getNotes(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                token: Joi.string().required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }

            db.query("SELECT * FROM hp_pitch_page_notes WHERE token='" + req.body.token + "'", function (
                error,
                results,
                fields
            ) {
                if (error) {
                    console.log(error,
                        results,
                        fields);
                    console.log(req.body.token);
                    return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
                }
                if (results.length > 0) {
                    res.send({ success: "true", data: results });
                } else {
                    return res.status.send({ success: "true", message: 'No Message Found' });
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