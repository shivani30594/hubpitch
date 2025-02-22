const db = require("../dbconfig/db");
const Joi = require("joi");
var async = require('async');
const dir = '/uploads/test';
const nodemailer = require("nodemailer");
const _ = require('lodash');
const md5 = require("md5");
const uuidV4 = require("uuid/v4");

class enduserController {

    static async viewPitch(req, res) {
        let viewer_id = '';
        viewer_id = req.url.split('?viewer=').pop();
        db.query("SELECT pitch_id,(SELECT email FROM hp_pitch_user_viewer where view_token='" + viewer_id + "') as viewer_email from hp_pitch_manager where url_token=? ", req.params.pitch_id, function (
            error,
            results,
            fields
        ) {
            if (error) {
                res.send({ success: "false", message: "Something went wrong" });
            }
            console.log(error)
            let view_email = results[0].viewer_email
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
                                res.render('enduserViews/viewPitch', { title: 'View Pitch || hubPitch', dir_parth: '/uploads/test/', data: results, results_length: results.length, pitch_token: results[0].pitch_id, user_token: results[0].user_id, user_name: results[0].username, plan: false, view_email: view_email });
                            }
                            if (results1) {
                                let pitch_analytics = results1[0].pitch_analytics
                                let plan_data = {
                                    sharing_tracking: results1[0].sharing_tracking,
                                    user_to_customer_messaging: results1[0].user_to_customer_messaging,
                                }
                                res.render('enduserViews/viewPitch', { title: 'View Pitch || hubPitch', dir_parth: '/uploads/test/', data: results, results_length: results.length, pitch_token: results[0].pitch_id, user_token: results[0].user_id, user_name: results[0].username, plan: plan_data, pitch_analytics: pitch_analytics, view_email: view_email });
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
                sender_role: Joi.string().required(),
                url: Joi.string().required(),
                email_body: Joi.string().required(),
                pitch_token: Joi.string().required(),
                user_token: Joi.strict().required(),
                user_email: Joi.strict().required(),
                company_name: Joi.string().required(),
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            var smtpTransport = nodemailer.createTransport({
                service: process.env.SERVICE,
                auth: {
                    user: process.env.HPEMAILUSER,
                    pass: process.env.PASSWORD
                }
            });

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
                user_id: req.body.user_token,
                view_token: randomToken,
                email: req.body.email_id,
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
                // -------------------------------mail sending-----------------------------
                var tomail = "";
                let share = '';
                let newEmail = '';
                let emailLog = {};
                tomail = req.body.email_id;
                // setup e-mail data with unicode symbols
                // Email Body Builder
                newEmail = req.body.email_body + '<br/> <p> Please click on this link to view the documents that have been shared with you by ' + req.body.sender_name + ': <a href="' + req.body.url + '?viewer=' + randomToken + '" target="blank"> ' + req.body.url + '?viewer=' + randomToken + '</a></p><br /><p> <strong> Here is your password to access presentation:</strong> ' + randompassword + ' </p><br/><br/>  <div><em>Please review the documents immediately.</em></div><br/><div>**You can add your own notes to each document, send messages to your contact, as well as share with your team (all within the platform which is hyperlinked above).**</div><br/> <br/> <p><small> Thanks </small> <br/> <small> hubPitch Team </small><br/> <a href="https://www.hubpitch.com/" target="blank"> www.hubpitch.com </a> </p>'
                var mailOptions = {
                    from: process.env.USERNAME, // sender address
                    to: tomail, // list of receivers
                    subject: "You're invited To Visit hubPitch by " + req.body.sender_name, // Subject line
                    html: newEmail
                };

                // send mail with defined transport object
                smtpTransport.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                    } else {
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
                                            console.log(error)
                                        }
                                        console.log('DataBase Logged')
                                    })
                                })
                            }
                        })
                        db.query("SELECT ( select `notification_3` from hp_users_info where user_id = '" + req.body.user_token + "') AS user_setting,( select allow_share from hp_pitch_manager where pitch_id ='" + req.body.pitch_token + "') AS pitch_setting", function (error2,
                            results2,
                            fields2) {
                            if (error2) {
                                console.log(error2, results2, fields2);
                            }
                            if (results2) {
                                if (results2[0].user_setting == 'true' && results2[0].pitch_setting == 'true') {
                                    // -------------------------------mail sending-----------------------------
                                    var tomail = "";
                                    let share = '';
                                    let newEmail = '';
                                    let emailLog = {};
                                    tomail = req.body.user_email;
                                    // setup e-mail data with unicode symbols
                                    // Email Body Builder 
                                    newEmail = 'Your Pitch,' + req.body.company_name + ' was recently shared by a client of yours. This is a good sign that a final Decision Maker is viewing your sales pitch!<br /><br /></u>Who Shared your Pitch?</u><br/>Contact : ' + req.body.sender_name + ' <br /> Their Role at the Company : ' + req.body.sender_role + ' <br/><br/><u></u>Who Received your Pitch?</u><br/>Contact Email Address : ' + req.body.email_id + '<br/><br/><p><small> **The best time to connect with a client is when they are viewing your material. Try sending them a message through the hubPitch Chat.** </small> <br/><br/> <small> hubPitch Sales Team </small><br/> Seattle, WA </p>'
                                    var mailOptions = {
                                        from: process.env.USERNAME, // sender address
                                        to: tomail, // list of receivers
                                        subject: "NOTIFICATION: Your Pitch has Been Shared Again by " + req.body.sender_name, // Subject line
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
                        res.send({ success: "true", message: 'Email Send' });

                    }
                });
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
                pitch_token: Joi.string().required(),
                viewer_id: Joi.string().required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            let newConversation = {
                pitch_id: req.body.pitch_token,
                viewer_id: req.body.viewer_id
            }
            db.query("INSERT INTO hp_conversation SET ?", newConversation, function (
                error,
                results,
                fields
            ) {
                if (error) {
                    console.log(error,
                        results,
                        fields);
                    return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
                }
                else if (results) {
                    console.log(results)
                    res.send({ success: "true", message: "Conversation created", data: results.insertId });
                } else {
                    console.log(error,
                        results,
                        fields);
                    return res.status(500).send({ success: false, message: 'Something Went Wrong' });
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
        console.log("Send message");
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                conversation_id: Joi.string().required(),
                sender: Joi.string().required(),
                receiver: Joi.string().required(),
                chat_text: Joi.string().required(),
                pitch_token: Joi.string().required(),
                company_name: Joi.string().required(),
                user_email: Joi.string().required(),
                company_name: Joi.string().required()
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
                service: process.env.SERVICE,
                auth: {
                    user: process.env.HPEMAILUSER,
                    pass: process.env.PASSWORD
                }
            });
            console.log("user id and password", process.env.HPEMAILUSER, process.env.PASSWORD)
            db.query("SELECT ( select `notification_2` from hp_users_info where user_id = '" + req.body.receiver + "') AS user_setting,( select allow_messaging from hp_pitch_manager where pitch_id ='" + req.body.pitch_token + "') AS pitch_setting", function (error2,
                results2,
                fields2) {
                if (error2) {
                    console.log(error2,
                        results2,
                        fields2);
                }
                if (results2) {
                    console.log("Rip", results2)
                    if (results2[0].user_setting == 'true' && results2[0].pitch_setting == 'true') {
                        // -------------------------------mail sending-----------------------------
                        var tomail = "";
                        let share = '';
                        let newEmail = '';
                        let emailLog = {};
                        tomail = req.body.user_email;
                        // setup e-mail data with unicode symbols
                        // Email Body Builder 
                        newEmail = 'You received message by ' + req.body.sender + ' On ' + req.body.company_name + ' Pitch  <br /> With Below Text <br />' + req.body.chat_text + '<br/> <br/> <p><small> Thanks </small> <br/> <small> hubPitch Team </small><br/> <a href="https://www.hubpitch.com/" target="blank"> www.hubpitch.com </a> </p>'
                        var mailOptions = {
                            from: process.env.USERNAME, // sender address
                            to: tomail, // list of receivers
                            subject: 'You received message by ' + req.body.sender + ' On ' + req.body.company_name + ' Pitch', // Subject line
                            html: 'You received message by ' + req.body.sender + ' On ' + req.body.company_name + ' Pitch  <br /> With Below Text <br />' + req.body.chat_text + '<br/> <br/> <p><small> Thanks </small> <br/> <small> hubPitch Team </small><br/> <a href="https://www.hubpitch.com/" target="blank"> www.hubpitch.com </a> </p>'
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
                user_email: Joi.string().required(),
                company_name: Joi.string().required()
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
                    var smtpTransport = nodemailer.createTransport({
                        service: process.env.SERVICE,
                        auth: {
                            user: process.env.HPEMAILUSER,
                            pass: process.env.PASSWORD
                        }
                    });
                    // -------------------------------mail sending-----------------------------
                    var tomail = "";
                    let share = '';
                    let newEmail = '';
                    let emailLog = {};
                    tomail = req.body.user_email;
                    // setup e-mail data with unicode symbols
                    // Email Body Builder 
                    newEmail = req.body.end_user_name + ' has added their own noted on ' + req.body.company_name + ' Pitch  <br /> With Below Note <br />' + req.body.text + '<br/> <br/> <p><small> Thanks </small> <br/> <small> hubPitch Team </small><br/> <a href="https://www.hubpitch.com/" target="blank"> www.hubpitch.com </a> </p>'
                    var mailOptions = {
                        from: process.env.USERNAME, // sender address
                        to: tomail, // list of receivers
                        subject: req.body.end_user_name + ' has added their own noted on ' + req.body.company_name + ' Pitch', // Subject line
                        html: newEmail
                    };

                    console.log("subject : ", mailOptions.subject);
                    console.log("list of receivers : ", mailOptions.to);

                    // send mail with defined transport object
                    smtpTransport.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            console.log(err)
                            res.send({
                                success: false,
                                message: "Something Went Wrong!"
                            });
                        } else {
                            console.log('EMAIL SENT');
                            console.log('tomail SENT');
                            console.log('EMAIL SENT');
                            res.send({ success: "true", message: "New Note created" });
                        }
                    });

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

    static downloadDocument(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                end_user_name: Joi.string().required(),
                user_email: Joi.string().required(),
                company_name: Joi.string().required(),
                end_user_role: Joi.string().required()
            });
            // end_user_name: endUserName,
            //     user_email: sender_email,
            //         company_name: company_name
            var smtpTransport = nodemailer.createTransport({
                service: process.env.SERVICE,
                auth: {
                    user: process.env.HPEMAILUSER,
                    pass: process.env.PASSWORD
                }
            });
            // -------------------------------mail sending-----------------------------
            var tomail = "";
            let share = '';
            let newEmail = '';
            let emailLog = {};
            tomail = req.body.user_email;
            // setup e-mail data with unicode symbols
            // Email Body Builder 
            newEmail = 'A document was recently downloaded and is being viewed right now! <br /><br />Pitch Name:' + req.body.company_name + ' <br />Contact:' + req.body.end_user_name + ' <br /> Their Role at the Company:' + req.body.end_user_role + ' <br/> Name of Document: <br/><p><small> **The best time to connect with a client is when they are viewing your material. Try sending them a message through the hubPitch Chat.** </small> <br/><br/> <small> hubPitch Sales Team </small><br/> Seattle, WA </p>'
            var mailOptions = {
                from: process.env.USERNAME, // sender address
                to: tomail, // list of receivers
                subject: 'NOTIFICATION: Document Downloaded from Pitch ' + req.body.company_name, // Subject line
                html: newEmail
            };

            console.log("subject : ", mailOptions.subject);
            // console.log("list of receivers : ", mailOptions.to);
            //  'Notification: Pitch "' + req.body.company_name + '" was viewed'
            //  send mail with defined transport object
            smtpTransport.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err)
                    res.send({
                        success: false,
                        message: "Something Went Wrong!"
                    });
                } else {
                    console.log('EMAIL SENT');
                    console.log('tomail SENT');
                    console.log('EMAIL SENT');
                    res.send({ success: "true", message: "New Note created" });
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
    static async getViewerFromToken(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                token: Joi.string().required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            db.query("SELECT * FROM hp_pitch_user_viewer WHERE view_token='" + req.body.token + "'", function (
                error,
                results,
                fields
            ) {
                if (error) {
                    console.log(error,
                        results,
                        fields);
                    console.log('ERROR-->TOKEN', req.body.token);
                    return res.status(500).send({ success: false, message: 'Something Went Wrong || Get Query Issues' });
                }
                if (results.length > 0) {
                    res.send({ success: "true", data: results });
                } else {
                    return res.status.send({ success: 'AuthERROR', message: 'No User Found On This Token Please Check Your Email Or Contact hubPitch Support' });
                }
            });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async viewerLogin(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                token: Joi.string().required(),
                password: Joi.string().required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            db.query(
                'SELECT * FROM hp_pitch_user_viewer WHERE view_token = ? AND password = ?',
                [req.body.token, md5(req.body.password)],
                function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    }
                    console.log(error, results, fields);
                    if (results.length) {
                        res.send({
                            success: true,
                            message: "Successfully signin.",
                            token: results[0].viewer_id
                        });
                    } else {
                        res.send({
                            success: false,
                            message: "email or password is incorrect"
                        });
                    }
                });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async viewerNameAdding(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                view_token: Joi.string().required(),
                name: Joi.string().required(),
                job_title: Joi.string().required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            db.query(
                'UPDATE hp_pitch_user_viewer SET full_name = ?,	job_title = ? WHERE viewer_id = ?',
                [req.body.name, req.body.job_title, req.body.view_token],
                function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    }
                    console.log(error, results, fields);
                    if (results.affectedRows > 0) {
                        res.send({
                            success: true,
                            message: "Update Successfully!"
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

    static async viewerAnalysis(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                viewer_id: Joi.string().required(),
                pitch_info_id: Joi.string().required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            db.query('SELECT COUNT(*) as counter,views as views FROM hp_pitch_viewer_analytics WHERE viewer_id = ?', [req.body.viewer_id],
                function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        res.send({ success: false, error });
                    }
                    if (results) {
                        if (results[0].counter == 0) {
                            console.log('counter', results[0].counter, 'results', results)
                            db.query(
                                'INSERT INTO hp_pitch_viewer_analytics SET viewer_id = ?, pitch_info_id = ?,views = ?',
                                [req.body.viewer_id, req.body.pitch_info_id, 1],
                                function (error1, results1, fields) {
                                    if (error1) {
                                        console.log(error1);
                                    }
                                    if (results1) {
                                        res.send({
                                            success: true,
                                            message: "View Added Successfully!"
                                        });
                                    } else {
                                        res.send({
                                            success: false,
                                            message: "Something Went Wrong!"
                                        });
                                    }
                                });
                        }
                        else {
                            let newView = results[0].views + 1
                            db.query(
                                'UPDATE hp_pitch_viewer_analytics SET views = ? WHERE viewer_id = ? AND pitch_info_id = ?',
                                [newView, req.body.viewer_id, req.body.pitch_info_id],
                                function (error1, results1, fields1) {
                                    if (error1) {
                                        console.log(error);
                                    }
                                    if (results1.affectedRows > 0) {
                                        res.send({
                                            success: true,
                                            message: "View Update Successfully!"
                                        });

                                    } else {
                                        res.send({
                                            success: false,
                                            message: "Something Went Wrong!"
                                        });
                                    }
                                });
                        }
                    } else {
                        res.send({ success: false, message: 'Something Went Wrong!' });
                    }
                })
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async viewerAnalysisUpdateViews(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                viewer_id: Joi.string().required(),
                viewing_time: Joi.string().required(),
                pitch_info_id: Joi.string().required(),
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            db.query('SELECT viewing_time FROM hp_pitch_viewer_analytics WHERE viewer_id = ? AND pitch_info_id = ?', [req.body.viewer_id, req.body.pitch_info_id],
                function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        res.send({ success: false, error });
                    }
                    if (results.length > 0) {
                        if (results[0].viewing_time == null) {
                            // GET VIEWS AND UPDATES
                            db.query(
                                'UPDATE hp_pitch_viewer_analytics SET viewing_time = ? WHERE viewer_id = ? AND pitch_info_id = ?',
                                [req.body.viewing_time, req.body.viewer_id, req.body.pitch_info_id],
                                function (error, results, fields) {
                                    if (error) {
                                        console.log(error);
                                        res.send({
                                            success: false,
                                            message: "Something Went Wrong!"
                                        });
                                    }
                                    console.log(error, results, fields);
                                    if (results.affectedRows > 0) {
                                        res.send({
                                            success: true,
                                            message: "Insert Successfully!"
                                        });
                                    } else {
                                        res.send({
                                            success: false,
                                            message: "Something Went Wrong!"
                                        });
                                    }
                                });
                        } else {
                            let updateView = results[0].viewing_time + parseInt(req.body.viewing_time)
                            db.query(
                                'UPDATE hp_pitch_viewer_analytics SET viewing_time = ? WHERE viewer_id = ? AND pitch_info_id = ?',
                                [updateView, req.body.viewer_id, req.body.pitch_info_id],
                                function (error, results, fields) {
                                    if (error) {
                                        console.log(error);
                                        res.send({
                                            success: false,
                                            message: "Something Went Wrong!"
                                        });
                                    }
                                    if (results.affectedRows > 0) {
                                        res.send({
                                            success: true,
                                            message: "Update Successfully!"
                                        });
                                    } else {
                                        console.log(error, results, fields)
                                        res.send({
                                            success: false,
                                            message: "Something Went Wrong!"
                                        });
                                    }
                                });
                        }
                    } else {
                        db.query(
                            'INSERT INTO hp_pitch_viewer_analytics SET viewer_id = ?, pitch_info_id = ?,views = ?',
                            [req.body.viewer_id, req.body.pitch_info_id, 1],
                            function (error1, results1, fields) {
                                if (error1) {
                                    console.log(error1);
                                    res.send({
                                        success: false,
                                        message: "Something Went Wrong!"
                                    });
                                }
                                if (results1) {
                                    res.send({
                                        success: true,
                                        message: "View Added Successfully!"
                                    });
                                } else {
                                    res.send({
                                        success: false,
                                        message: "Something Went Wrong!"
                                    });
                                }
                            });
                    }
                });
        }
        catch (error) {
            console.error(error);
            res.send({ success: false, error });
        }
    }

    static async viewUpdater(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                viewer_id: Joi.string().required(),
                pitch_info_id: Joi.string().required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            db.query(
                'INSERT INTO hp_pitch_viewer_analytics SET viewer_id = ?, pitch_info_id = ?,views = ?',
                [req.body.viewer_id, req.body.pitch_info_id, 1],
                function (error1, results1, fields) {
                    if (error1) {
                        console.log(error1);
                    }
                    if (results1) {
                        res.send({
                            success: true,
                            message: "View Added Successfully!"
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

    static async viewMail(req, res) {
        try {
            const pitchData = Joi.validate(Object.assign(req.params, req.body), {
                user_token: Joi.string().required(),
                pitch_token: Joi.string().required(),
                company_name: Joi.string().required(),
                user_email: Joi.string().required(),
                viewer_name: Joi.string().required()
            });
            if (pitchData.error) {
                res.send({ success: false, error: pitchData.error });
                return;
            }
            db.query("SELECT ( select `notification_1` from hp_users_info where user_id = '" + req.body.user_token + "') AS user_setting,( select allow_notification from hp_pitch_manager where pitch_id ='" + req.body.pitch_token + "') AS pitch_setting", function (error2,
                results2,
                fields2) {
                console.log(error2,
                    results2,
                    fields2)
                if (error2) {
                    console.log(error2,
                        results2,
                        fields2)
                }
                if (results2) {
                    if (results2[0].user_setting == 'true' && results2[0].pitch_setting == 'true') {
                        var smtpTransport = nodemailer.createTransport({
                            service: process.env.SERVICE,
                            auth: {
                                user: process.env.HPEMAILUSER,
                                pass: process.env.PASSWORD
                            }
                        });
                        // -------------------------------mail sending-----------------------------
                        var tomail = "";
                        let share = '';
                        let newEmail = '';
                        let emailLog = {};
                        tomail = req.body.user_email;
                        // setup e-mail data with unicode symbols
                        // Email Body Builder 
                        newEmail = 'Your Pitch :- "' + req.body.company_name + '" was viewed by ' + req.body.viewer_name + '<br/> <br/> <p><small> Thanks </small> <br/> <small> hubPitch Team </small><br/> <a href="https://www.hubpitch.com/" target="blank"> www.hubpitch.com </a> </p>'
                        var mailOptions = {
                            from: process.env.HPEMAILUSER, // sender address
                            to: tomail, // list of receivers
                            subject: 'Notification: Pitch "' + req.body.company_name + '" was viewed', // Subject line
                            html: newEmail
                        };

                        console.log("subject : ", mailOptions.subject);

                        // send mail with defined transport object
                        smtpTransport.sendMail(mailOptions, function (err, info) {
                            if (err) {
                                console.log(err)
                                res.send({
                                    success: false,
                                    message: "Something Went Wrong!"
                                });
                            } else {
                                console.log('EMAIL SENT');
                                console.log('tomail SENT', tomail);
                                console.log('EMAIL SENT');
                                res.send({
                                    success: true,
                                });
                            }
                        });
                    } else {
                        res.send({
                            success: false,
                            message: "AUTH ISSUE OF PITCH CUSTOMER"
                        });
                    }
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